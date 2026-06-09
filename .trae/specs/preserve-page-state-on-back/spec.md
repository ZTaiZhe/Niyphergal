# 返回页面保持状态 Spec

## Why
从详情页返回首页（或其他页面）后，原页面的状态丢失——卡片重新播放入场动画、轮播图位置重置、滚动位置可能不正确。根本原因是 `render()` 每次都移除所有 section 并通过 `innerHTML` 重新注入内容，即使内容来自缓存，也会破坏所有 DOM 状态（动画类、轮播图实例、事件监听器等）。

## What Changes
- `render()` 中，当目标页面已有 `section[data-page]` 且内容未变时，不再移除重建 section，而是直接切换 `display` 属性来显示/隐藏
- 对于"返回"场景（从 detail 回到 home 等），如果 section 已存在，跳过 `innerHTML` 注入和动画初始化，仅切换可见性
- 仅在首次渲染或内容变化时才替换 `innerHTML`
- Hero exit 路径保持现有逻辑不变（`revealHomeCardsImmediately` + `revealFlownCard`）

## Impact
- Affected code: `src/js/modules/search/renderer.js`（`render()` 函数、`injectSection()` 闭包）
- Affected specs: fix-ui-regressions-cache, fix-hero-exit-conflict, preserve-scroll-position

## ADDED Requirements

### Requirement: 返回已访问页面时保持 DOM 状态
系统 SHALL 在返回已访问页面时保持该页面的 DOM 状态（动画状态、轮播图位置、滚动位置等），而不是重新注入 innerHTML 并重新初始化。

#### Scenario: 从详情页返回首页（非 hero exit）
- **WHEN** 用户从详情页返回首页（非 hero exit 路径）
- **THEN** 首页卡片保持之前的可见状态，不重新播放入场动画
- **AND** 轮播图保持之前的位置
- **AND** 滚动位置恢复到进入详情页前的位置

#### Scenario: 从详情页返回首页（hero exit）
- **WHEN** 用户从详情页返回首页（hero exit 路径）
- **THEN** hero exit 飞行动画正常执行
- **AND** 飞行完成后卡片恢复显示
- **AND** 其他卡片保持可见状态
- **AND** 轮播图保持之前的位置

#### Scenario: 从其他页面返回已访问页面
- **WHEN** 用户从任意页面返回之前访问过的页面
- **THEN** 该页面保持之前的 DOM 状态，不重新播放入场动画

#### Scenario: 首次导航到页面
- **WHEN** 用户首次导航到某页面（section 不存在或内容未缓存）
- **THEN** 正常渲染、初始化动画、缓存内容

## MODIFIED Requirements

### Requirement: injectSection 支持保留已有 section
`injectSection()` SHALL 支持两种模式：
1. **替换模式**（首次渲染/内容变化）：替换 `innerHTML`，与当前行为一致
2. **保留模式**（返回已访问页面）：如果 section 已存在且内容未变，仅切换 `display`，不替换 `innerHTML`

### Requirement: render() 不再无条件移除所有 section
`render()` 开头的 `sections.forEach(sec => sec.remove())` SHALL 改为：仅在需要替换内容时才移除目标 section，其他 section 保持不变（仅切换 display）。
