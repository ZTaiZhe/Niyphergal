# 退出飞行后卡片不执行入场动效修复 Spec

## Why
`fix-exit-flight-radius-sync` 将 `performHeroExit` 改为同步飞行（clone 立即起飞），但遗漏了卡片入场动效的时序协调。当前流程：

```
performHeroExit:
  clone 起飞 → router.push('home') → renderer 渲染 home
    → 50ms 后 initHomeAnimations() → 卡片 stagger 渐显  ← 在 clone 飞行期间！
    → ~570ms 后 clone 落地/清理   → 卡片早已显示完毕     ← 用户看到的是静态卡片
```

卡片入场动效在 clone 覆盖之下偷偷完成，clone 消失后用户看到的是已经静态的无动画卡片。

## 根因

`performHeroExit` 的 `cleanup()` 在 clone 移除后未重新触发卡片入场动效。renderer 中的 `initHomeAnimations()` 在 50ms 时触发（太早，clone 还在飞），且 `performHeroExit` cleanup 中完全没有动画重触发逻辑。

## What Changes
- 在 `performHeroExit` 的 `cleanup()` 中调用 `initHomeAnimations()`，在 clone 移除后立即触发卡片 stagger 入场
- 在 renderer.js 中，当 hero exit 正在飞行时跳过 `initHomeAnimations()` 调用（避免双次动画）
- 从 animationHelpers.js 导出 `isHeroExitInFlight()` 供 renderer 判断

## Impact
- Affected specs: hero 退出飞行过渡、首页卡片入场动效
- Affected code:
  - `src/js/modules/animationHelpers.js` — 导入 `initHomeAnimations`，在 cleanup 中调用，导出 `isHeroExitInFlight`
  - `src/js/modules/renderer.js` — 动画/else 分支中检查 `isHeroExitInFlight()` 决定是否调用 `initHomeAnimations`

## ADDED Requirements

### Requirement: 退出飞行完成后卡片重新入场
系统 SHALL 在 hero 退出克隆动画完成并移除后，立即触发源页面的卡片 stagger 入场动效。

#### Scenario: 从详情页返回首页
- **WHEN** 用户点击返回按钮触发反向飞行，clone 从详情大图飞回首页卡片位置并完成弹簧动画
- **THEN** clone 移除后，首页游戏卡片立即执行 stagger 渐入动效，视觉上 clone 仿佛"变成"了卡片

### Requirement: 飞行期间抑制渲染器动效
系统 SHALL 在 hero 退出飞行进行中时，不触发 `initHomeAnimations()`，避免动画在 clone 覆盖下执行。

#### Scenario: hero 退出飞行进行中
- **WHEN** `_heroExitInFlight === true` 且 renderer 完成 `injectSection`
- **THEN** `initHomeAnimations()` 不被调用，卡片保持 `is-hidden` 状态等待飞行完成

## MODIFIED Requirements

（无修改项）

## REMOVED Requirements

（无移除项）
