# 修复首页首次加载内容不显示 Spec

## Why
首次进入网站时，`router.previous` 和 `router.current` 都为 `'home'`（RouterStore 初始状态），导致 `oldSection` 和 `newSection` 指向同一个 DOM 元素。`animateSlideTransition()` 对同一元素同时添加 `animate-fade-out` 和 `animate-fade-in` 冲突动画类，且动画结束后将该元素设为 `display: none`，导致首页内容完全不可见。切换页面后 `router.previous !== router.current`，问题不再出现。

## What Changes
- 在 `renderer.js` 的 slide 动画分支中，增加 `router.previous !== router.current` 前置判断
- 当 `router.previous === router.current` 时，跳过 slide 动画，走 fallback 直接注入内容

## Impact
- Affected code: `src/js/modules/search/renderer.js` 第 1340 行附近的 slide 动画分支

## ADDED Requirements

### Requirement: 首次加载首页正确显示
系统在 `router.previous === router.current` 时 SHALL 跳过 slide 动画，直接注入页面内容并执行 afterPageSwitch。

#### Scenario: 首次加载首页
- **WHEN** 用户首次访问网站，`router.previous === router.current === 'home'`
- **THEN** 首页内容正常显示，无动画冲突，section 不被设为 `display: none`

#### Scenario: 正常页面切换
- **WHEN** 用户在不同页面间切换，`router.previous !== router.current`
- **THEN** slide 动画正常播放，行为不变
