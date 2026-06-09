# 退出飞行过渡圆角消失与动画不同步修复 Spec

## Why
`add-hero-exit-flight` 实现中存在两个回归缺陷：

1. **圆角消失**：`performHeroExit` 创建 frame 时未设置初始 `border-radius`（对比 `performHeroNavigate` 第 57 行），且 keyframes 中目标圆角硬编码 `'0.75rem'` 而非从卡片计算样式获取
2. **图片与页面不同步**：退出时通过 `page:rendered` + `rAF×2` 等待页面渲染后才启动飞行，clone 闲置约 32ms 期间页面 stagger 内容已开始动画，视觉上 clone 晚于页面启动

## 根因分析

```
performHeroExit 当前流程:
  clone 出现（静止）→ push(sourcePage) → 页面渲染 + 内容渐显
    → page:rendered → rAF×2 (~32ms) → clone 开始飞行  ← 晚了！

performHeroNavigate 流程（正确）:
  clone 出现 → push(detail) → clone 立即飞行 → detail:rendered → 飞向目标
```

两个方向的关键区别：进入时不依赖目标页面渲染来获取坐标（clone 创建时已知源和目标），而退出时却依赖 `page:rendered` 获取源卡片坐标。

## What Changes
- 在 `performHeroNavigate` 中将源卡片位置和圆角存入 `_heroExitContext`
- 在 `performHeroExit` 中使用存储的坐标直接启动飞行动画，不再等待 `page:rendered`
- 修复初始 border-radius 设置和 keyframes 中的圆角值

## Impact
- Affected specs: hero 退出飞行过渡
- Affected code:
  - `src/js/modules/animationHelpers.js` — `performHeroNavigate` 存储存储坐标、`performHeroExit` 直接启动动画

## ADDED Requirements

### Requirement: 退出飞行使用预存坐标立即启动
系统 SHALL 在退出飞行时使用进入时存储的源卡片坐标和圆角，不等待目标页面渲染。

#### Scenario: 用户点击返回按钮
- **WHEN** 用户点击详情页返回按钮
- **THEN** hero-clone 立即从详情大图位置向源卡片位置飞行，与页面渲染并行

### Requirement: 退出飞行 frame 初始圆角
系统 SHALL 在退出飞行创建 frame 时设置 `border-radius` 为 detail 大图的计算样式圆角。

#### Scenario: 退出飞行动画中
- **WHEN** hero-clone 从详情位置飞向卡片位置
- **THEN** clone 全程保持正确圆角过渡（从详情大图圆角到卡片圆角）

## MODIFIED Requirements

### Requirement: Hero 退出上下文存储
`_heroExitContext` SHALL 存储 `{ gameId, sourcePage, sourceRect, sourceBorderRadius }`，其中 `sourceRect` 为进入时捕获的源卡片 GBCR 快照。

## REMOVED Requirements
（无移除项）
