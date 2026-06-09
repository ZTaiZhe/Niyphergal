# 重构 Hero 退出飞行渲染路径 Spec

## Why
之前的修复在 renderer.js 的多个分支中打补丁（动画分支 inner else、最终 else），但 hero exit 仍不工作。根因有三个：(1) `newContent` 包含 `animate-slide-in-left` 类导致页面滑入动画未被抑制；(2) `revealHomeCardsImmediately()` 受 CSS `transition: opacity 0.3s` 影响并非真正立即显示；(3) 飞行中的卡片被同时显示造成视觉重复。需要换思路：将 hero exit 作为 render() 顶部的独立路径处理。

## 代码路径追踪（当前问题）

```
performHeroExit → _heroExitInFlight = true → router.push('home')
    ↓
render(_mode='push'):
    L1038: router.previous === 'detail' → clearHeroExitContext() ← 上下文被提前清除
    L1050: animationClass = 'animate-slide-in-left'  ← 问题1: 滑入动画类
    L1068: newContent = renderHome('') + animationClass  ← 带动画类的内容
    ↓
    L1192: animationClass && ... && !isHeroExitInFlight() → FALSE → SKIP
    L1326: 最终 else → ENTERED
        L1328: injectSection('home', newContent)  ← 问题1: 注入带滑入动画的内容
        L1340: isHeroExitInFlight() → true → revealHomeCardsImmediately()
            ← 问题2: CSS transition 0.3s 导致非立即显示
            ← 问题3: 所有卡片包括飞行中的卡片都被显示
```

## What Changes
- 在 renderer.js 的 `render()` 函数中，**在分支逻辑之前**增加 hero exit 专用路径，直接 return
- hero exit 路径：注入无动画类的内容 → 立即显示非飞行卡片（绕过 CSS transition）→ 隐藏飞行中的卡片 → 动画完成后显示飞行卡片
- 重写 `revealHomeCardsImmediately()` 为 `revealHomeCardsImmediately(excludeGameId)`，支持排除飞行卡片并绕过 CSS transition
- 在 `performHeroExit` 的 `cleanup()` 中派发 `hero:exit-complete` 事件，通知飞行卡片可以显示
- 移除各分支中的 `isHeroExitInFlight()` 补丁代码（不再需要）

## Impact
- Affected code:
  - `src/js/modules/renderer.js` — render() 增加 hero exit 顶部拦截路径，移除各分支补丁
  - `src/js/modules/animationHelpers.js` — cleanup() 派发 hero:exit-complete 事件
  - `src/js/pages/home.js` — revealHomeCardsImmediately() 重写，新增 revealFlownCard()

## ADDED Requirements

### Requirement: Hero Exit 专用渲染路径
render() 函数 SHALL 在所有分支逻辑之前检查 `isHeroExitInFlight()`，若为 true 且 `router.current === 'home'`，执行专用路径并 return。

#### Scenario: Hero 退出飞行到首页
- **WHEN** 用户从详情页返回，hero exit 飞行进行中
- **THEN** render() 在顶部拦截，注入无动画类的内容，立即显示非飞行卡片，隐藏飞行卡片，跳过所有分支逻辑

### Requirement: 飞行卡片延迟显示
正在执行反向飞行的卡片 SHALL 在飞行动画期间保持隐藏（opacity: 0），仅在飞行动画完成后显示。

#### Scenario: 飞行中的卡片不可见
- **WHEN** hero exit 飞行动画正在播放
- **THEN** 对应的首页卡片不可见，其他卡片立即可见

#### Scenario: 飞行完成后卡片显示
- **WHEN** hero exit 飞行动画完成（cleanup 被调用）
- **THEN** 对应的首页卡片淡入显示

### Requirement: 真正的立即显示
`revealHomeCardsImmediately()` SHALL 绕过 CSS transition，使卡片瞬间出现而非 0.3s 渐入。

#### Scenario: 卡片瞬间出现
- **WHEN** hero exit 飞行中调用 revealHomeCardsImmediately()
- **THEN** 非飞行卡片在当前帧内变为可见，无过渡动画

### Requirement: 无页面级滑入动画
hero exit 期间 SHALL 不触发任何页面级滑入/淡入动画。

#### Scenario: 无滑入动画
- **WHEN** hero exit 飞行进行中
- **THEN** 首页内容直接出现，无 translateX 滑入效果

## MODIFIED Requirements

### Requirement: renderer.js 分支逻辑简化
移除动画分支（L1192）和最终 else 分支（L1326）中的 `isHeroExitInFlight()` 检查补丁，因为 hero exit 已在顶部拦截，不会到达这些分支。

### Requirement: performHeroExit cleanup 派发事件
`performHeroExit` 的 `cleanup()` 函数 SHALL 在移除克隆后派发 `hero:exit-complete` CustomEvent，携带 `gameId`，供首页监听以显示飞行卡片。
