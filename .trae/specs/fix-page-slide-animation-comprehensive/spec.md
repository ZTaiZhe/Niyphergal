# 全面修复页面切换动效问题 Spec

## Why
上一轮修复（fix-page-slide-animation-conflict）移除了 fast path 并添加了 pop 模式动画支持，但 pop 模式的动画方向逻辑有 bug：`getAnimationDirection(prevIndex, currIndex)` 在 pop 模式下已经返回了正确的反向动画（因为 `currIndex < prevIndex`），但代码又对结果做了字符串替换反转，导致方向被二次反转回错误方向。同时，动画覆盖分支中 `oldContent` 包含所有 section 而非仅旧页面 section，可能导致视觉错位。此外，`else` 分支（无动画路径）在某些场景下不应出现。

## What Changes
- 修复 pop 模式动画方向：直接使用 `getAnimationDirection(prevIndex, currIndex)` 的结果，不做字符串替换反转
- 修复 `oldContent`：动画覆盖分支中，仅提取旧页面 section 的内容作为旧页面层，而非整个 container.innerHTML
- 确保 `else` 分支也播放动画（当 `animationClass` 为 fade-in 时）

## Impact
- Affected code: `src/js/modules/search/renderer.js`（`render()` 函数）
- Affected specs: fix-page-slide-animation-conflict, preserve-page-state-on-back

## ADDED Requirements

### Requirement: pop 模式动画方向正确
系统 SHALL 在 pop 模式下播放正确方向的滑动动画。

#### Scenario: 分类→首页（pop 模式）
- **WHEN** 用户从分类页(1)返回首页(0)
- **THEN** `getAnimationDirection(1, 0)` 返回 `{ animationClass: 'animate-slide-in-left', oldAnimationClass: 'animate-slide-out-right' }`
- **AND** 首页从左侧滑入，分类页向右滑出

#### Scenario: 魅力搜索→首页（pop 模式）
- **WHEN** 用户从魅力搜索页(2)返回首页(0)
- **THEN** 首页从左侧滑入，魅力搜索页向右滑出

## MODIFIED Requirements

### Requirement: pop 模式动画方向计算
pop 模式下 SHALL 直接使用 `getAnimationDirection(prevIndex, currIndex)` 的返回值，不做任何字符串替换。因为 `currIndex < prevIndex` 时，`getAnimationDirection` 已经返回 `animate-slide-in-left` / `animate-slide-out-right`，这正是 pop 模式需要的方向。

### Requirement: 动画覆盖分支的旧页面内容
动画覆盖分支中，`.page-transition-old` SHALL 仅包含旧页面 section 的 innerHTML，而非整个 container.innerHTML（包含所有 section）。这避免旧页面层中显示多个 section 导致视觉错位。

## REMOVED Requirements
（无）
