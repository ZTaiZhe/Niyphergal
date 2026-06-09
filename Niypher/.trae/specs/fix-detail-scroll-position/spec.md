# 详情页滚动位置修复 Spec

## Why
首页上下滑动后进入详情页时，详情页不在顶部，而是保持首页的滚动位置。根因是 `#main-container`（`overflow-y: auto`）是实际滚动容器，而 `router.push()` 和 `popstate` 处理器只调用 `window.scrollTo(0, 0)`，不影响 `main-container` 的滚动位置。

## What Changes
- `router.push()` 中 `window.scrollTo(0, 0)` 改为同时滚动 `main-container` 到顶部
- `router.pushSearch()` 中同理
- `popstate` 处理器中 `window.scrollTo()` 改为同时滚动 `main-container`
- `renderer.js` 中 Hero 飞行过渡路径（`isDetailTransition`）添加 `main-container.scrollTop = 0`

## Impact
- Affected code: `src/js/modules/router.js`, `src/js/modules/renderer.js`

---

## ADDED Requirements

### Requirement: 页面导航时重置 main-container 滚动位置
所有页面导航（push、pushSearch、popstate）SHALL 同时重置 `#main-container` 的 `scrollTop` 为 0。

#### Scenario: 首页滚动后进入详情页
- **WHEN** 用户在首页滚动到第 3 行卡片后点击进入详情页
- **THEN** 详情页从顶部开始显示
- **AND** `main-container.scrollTop === 0`

#### Scenario: 浏览器后退恢复滚动位置
- **WHEN** 用户从详情页后退到首页
- **THEN** 首页恢复到之前的滚动位置（`event.state.scrollY`）
- **AND** `main-container.scrollTop` 也恢复到对应位置

#### Scenario: Hero 飞行过渡进入详情页
- **WHEN** 通过 Hero 飞行过渡进入详情页
- **THEN** `main-container.scrollTop` 被设为 0
- **AND** 详情页从顶部开始显示

## MODIFIED Requirements

### Requirement: router.push() 滚动重置
`router.push()` 中 `window.scrollTo(0, 0)` SHALL 同时滚动 `main-container` 到顶部。

### Requirement: popstate 滚动恢复
`popstate` 事件处理器中 `window.scrollTo()` SHALL 同时恢复 `main-container` 的滚动位置。保存滚动位置时也 SHALL 保存 `main-container.scrollTop` 而非 `window.scrollY`。
