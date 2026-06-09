# 退出飞行卡片入场动效修复 Spec

## Why
`fix-exit-card-reanimate` 采用"飞行期间抑制 + 飞行后重触发"策略，导致两个问题：

1. **卡片无动画**：cleanup 中 `initHomeAnimations()` 先给已可见的卡片加 `is-hidden`（`opacity:0`），再 rAF×2 移除。卡片先闪消失再淡入，视觉上不可见或无动画感
2. **其他卡片保持原位置**：renderer 渲染 home 时 `isHeroExitInFlight` 为 true，`initHomeAnimations` 被跳过，卡片无 stagger 入场，静态出现在原位置

**正确方案**：不抑制 `initHomeAnimations()`。退出飞行时 clone（z-index: 9999）从 detail 大图飞向卡片位置，期间 renderer 正常触发卡片 stagger 入场动效，卡片在 clone 覆盖下自然动画。clone 移除时卡片已完好就位。

## What Changes
- **回退** `fix-exit-card-reanimate` 的全部变更
- 从 animationHelpers.js 移除 `import { initHomeAnimations }`、cleanup 中的调用、`isHeroExitInFlight` 导出
- 从 renderer.js 移除 `isHeroExitInFlight` import 和两处 `!isHeroExitInFlight()` 条件

## Impact
- Affected specs: hero 退出飞行过渡、首页卡片入场动效
- Affected code:
  - `src/js/modules/animationHelpers.js` — 回退 3 处修改
  - `src/js/modules/renderer.js` — 回退 3 处修改

## MODIFIED Requirements

### Requirement: 退出飞行时卡片自然入场
系统 SHALL 在退出飞行时不抑制渲染器的 `initHomeAnimations()`，让卡片 stagger 动效在 clone（z-index: 9999）覆盖下自然执行。

#### Scenario: 从详情页返回首页
- **WHEN** 用户点击返回按钮触发反向飞行
- **THEN** clone 从大图飞向卡片，期间首页卡片在 clone 下方执行 stagger 渐入，clone 落地移除后卡片已完整就位，无闪烁

## REMOVED Requirements

### Requirement: 飞行期间抑制渲染器动效
**Reason**: 此策略导致卡片无动画。clone 的 z-index 9999 天然覆盖卡片，无需抑制
**Migration**: 移除 `!isHeroExitInFlight()` 条件

### Requirement: 退出飞行完成后卡片重新入场
**Reason**: cleanup 中重新触发 `initHomeAnimations()` 会导致可见→隐藏→动画的闪烁
**Migration**: 移除 cleanup 中的 `initHomeAnimations()` 调用
