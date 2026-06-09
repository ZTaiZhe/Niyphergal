# 页面切换卡顿/不响应及动画丢失修复 Spec

## Why
docker 栏页面左右切换出现卡顿或不响应，且左右滑动动画消失。根因是 `render()` 函数使用 `debounce(fn, 50)` 包装，导致连续快速点击导航时渲染被反复延迟甚至吞没；同时 `oldAnimationClass` 为空时直接跳过滑动动画分支，退化为无动画的 fade-in。

## What Changes
- 移除 `render()` 中的 debounce 包装，改为同步执行渲染逻辑
- 修复滑动动画条件判断：当 `animationClass` 有值但 `oldAnimationClass` 为空时，仍应执行动画（使用 fade-out 替代 slide-out 作为旧页面退出动画）
- 修复动画期间旧内容双重存在：在构建过渡容器前先移除原始 section 元素
- 将 `detail` 加入 `pageOrder` 映射，修复从 detail 返回时动画方向退化

## Impact
- Affected specs: 页面切换动画、路由渲染
- Affected code:
  - `src/js/modules/renderer.js` — 移除 debounce、修复动画条件、修复内容双重存在、添加 detail 到 pageOrder
  - `src/js/modules/animationHelpers.js` — 无需修改

## ADDED Requirements

### Requirement: 页面切换即时响应
系统 SHALL 在用户点击导航按钮后立即开始渲染新页面，不使用 debounce 延迟。

#### Scenario: 快速连续点击导航按钮
- **WHEN** 用户快速连续点击不同导航按钮
- **THEN** 每次点击都立即触发渲染，不会被 debounce 吞没或延迟

### Requirement: 页面切换始终显示动画
系统 SHALL 在页面切换时始终显示过渡动画。当旧页面无退出动画类时，使用 fade-out 作为默认退出动画，而非跳过整个动画分支。

#### Scenario: 从 detail 页面返回主页面
- **WHEN** 用户从 detail 页面返回到主页面
- **THEN** 新页面显示 slide-in 动画，旧页面显示 fade-out 动画

#### Scenario: 正常左右切换
- **WHEN** 用户在 home 和 category 之间切换
- **THEN** 新页面显示 slide-in 动画，旧页面显示对应的 slide-out 动画

## MODIFIED Requirements

### Requirement: 页面过渡渲染
页面过渡期间 SHALL 先移除原始 section 元素再构建过渡容器，避免内容双重存在导致的布局跳动。

#### Scenario: 从 home 切换到 category
- **WHEN** 用户从首页切换到分类页
- **THEN** 原始 section 元素先被移除，过渡容器构建后只包含一份旧内容

### Requirement: 页面切换动画方向
`pageOrder` 映射 SHALL 包含 `detail` 页面（值为 5），确保从 detail 页面返回时能正确计算动画方向。

## REMOVED Requirements

（无移除项）
