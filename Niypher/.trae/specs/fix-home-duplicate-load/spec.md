# 主页卡片重复加载修复规范

## Why
从其他页面导航到主页时，卡片会加载两次并出现卡顿现象，影响用户体验。

## What Changes
- 移除 `render()` 函数中 `case 'home'` 分支内的 `initHomeAnimations()` 调用
- 确保动画初始化只在页面转换完成后执行一次

## Impact
- Affected specs: 页面渲染、动画效果
- Affected code: `src/js/modules/renderer.js`

## ADDED Requirements

### Requirement: 单次动画初始化
主页卡片动画初始化函数 `initHomeAnimations()` 应当只在页面内容完全加载后执行一次。

#### Scenario: 从其他页面导航到主页
- **WHEN** 用户从分类页、搜索页等其他页面点击导航到主页
- **THEN** 卡片动画只初始化一次，不会出现重复加载或卡顿

#### Scenario: 浏览器前进/后退到主页
- **WHEN** 用户通过浏览器历史记录导航回主页
- **THEN** 卡片动画正常初始化一次

## MODIFIED Requirements

### Requirement: 页面渲染流程
在 `renderer.js` 的 `render()` 函数中，主页渲染时不再立即调用 `initHomeAnimations()`，而是由页面转换完成后的回调统一处理。

## REMOVED Requirements
无
