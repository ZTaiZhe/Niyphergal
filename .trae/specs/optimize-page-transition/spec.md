# 页面切换卡顿优化规范

## Why
页面切换时存在卡顿现象，主要原因包括：renderHome 被调用两次、debounce 双重延迟、以及过多的 setTimeout 调用。

## What Changes
- 优化 render() 函数中的 debounce 逻辑，移除双重延迟
- 避免在 switch 分支中重复调用 render 函数
- 减少 initHomeAnimations 的延迟时间
- 优化页面转换动画的等待时间

## Impact
- Affected specs: 页面渲染、动画效果
- Affected code: `src/js/modules/renderer.js`, `src/js/pages/home.js`

## ADDED Requirements

### Requirement: 单次渲染调用
在 `render()` 函数的 switch 分支中，每个页面的渲染函数应当只被调用一次，避免重复计算。

#### Scenario: 导航到主页
- **WHEN** 用户导航到主页
- **THEN** renderHome 只执行一次，不会重复生成 HTML

### Requirement: 优化的 debounce 逻辑
debounce 函数不应当与 setTimeout 叠加使用，造成双重延迟。

#### Scenario: 页面切换
- **WHEN** 用户切换页面
- **THEN** 渲染在 50ms 内开始执行，而不是 100ms

### Requirement: 快速动画初始化
主页动画初始化应当更快执行，减少用户等待时间。

#### Scenario: 主页加载
- **WHEN** 主页内容加载完成
- **THEN** 动画在 50ms 内开始初始化，而不是 100ms

## MODIFIED Requirements

### Requirement: 页面渲染流程
在 `renderer.js` 中：
1. 移除 debounce 外层的 setTimeout，只保留 debounce
2. 在 switch 分支中，只调用一次 render 函数，缓存结果
3. 将 initHomeAnimations 的延迟从 100ms 减少到 50ms
