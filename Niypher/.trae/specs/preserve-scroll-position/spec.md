# 保持页面滚动位置 Spec

## Why
进入详情页时首页滚动位置被重置为 0，退出详情页返回首页时也回到顶部。用户期望原页面（如首页）的滚动位置在进入和退出详情页时保持不变。

## 代码路径追踪（当前问题）

```
进入详情页:
  performHeroNavigate → router.push('detail')
    L34: scrollPositions['home'] = _getScrollY()  ← 保存了首页位置
    L46: _scrollTo(0)  ← 详情页从顶部开始 ✓

退出详情页:
  performHeroExit → router.push('home')
    L34: scrollPositions['detail'] = _getScrollY()  ← 保存详情页位置
    L46: _scrollTo(0)  ← 问题: 首页被重置到顶部 ✗
    应该恢复 scrollPositions['home'] 的值
```

## What Changes
- `router.push()` 中，在调用 `_scrollTo()` 时，检查目标页面是否有保存的滚动位置，有则恢复，无则滚动到顶部
- Hero exit 拦截路径中，恢复首页的滚动位置
- `isDetailTransition` 分支中，`mainContainer.scrollTop = 0` 保持不变（详情页从顶部开始）

## Impact
- Affected code: `src/js/modules/router.js`, `src/js/modules/renderer.js`

## ADDED Requirements

### Requirement: 返回页面时恢复滚动位置
`router.push()` 中 `_scrollTo(0)` SHALL 改为：如果目标页面在 `scrollPositions` 中有保存的位置，则恢复到该位置；否则滚动到顶部。

#### Scenario: 退出详情页返回首页
- **WHEN** 用户从详情页返回首页
- **THEN** 首页恢复到进入详情页前的滚动位置

#### Scenario: 首次进入页面
- **WHEN** 首次导航到某页面（无保存的滚动位置）
- **THEN** 页面从顶部开始

#### Scenario: 进入详情页
- **WHEN** 用户从首页进入详情页
- **THEN** 详情页从顶部开始（detail 无保存的滚动位置）

## MODIFIED Requirements

### Requirement: Hero exit 拦截路径恢复滚动位置
renderer.js 的 hero exit 拦截路径中，`injectSection` 后 SHALL 恢复首页的滚动位置（从 `router.scrollPositions` 读取）。
