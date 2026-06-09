# 退出飞行时抑制页面滑动动画并立即显示卡片 Spec

## Why
退出飞行（`performHeroExit`）中，renderer 在 clone 飞行期间并行渲染源页面，产生两个冲突：

1. **页面自左向右滑入动画**（`.page-transition-container` + `animate-slide-in-right`）与 clone 从大图飞向卡片的动画同时发生，视觉混乱
2. **卡片先 `is-hidden` 再 stagger 渐入**（`initHomeAnimations` 的 `is-hidden` → rAF×2 → 移除）：clone 已飞到卡片位置，卡片却不可见或正在渐入，视觉上不同步

## 根因

```
performHeroExit:
  clone 起飞 → router.push(home)
    → renderer: animationClass 匹配 → 创建 .page-transition-container → 500ms 页面滑入
    → 同时 clone 在飞                                    → 双重动画冲突
    → initHomeAnimations: add is-hidden → rAF×2 → stagger → 卡片延迟出现
```

card 的 `is-hidden` 造成卡片在 clone 飞行期间不可见，当 clone 落地/移除后方渐显，体验割裂。

## What Changes
- 重新导出 `isHeroExitInFlight()`，用于 renderer 判断当前是否处于 hero exit
- 在 renderer 动画分支条件中增加 `!isHeroExitInFlight()` 判断，飞行期间完全跳过页面滑入动画
- 在 home.js 中新增 `revealHomeCardsImmediately()` 函数：不添加 `is-hidden`，直接在卡片上设置 `is-loaded` 立即显示
- 在 renderer 的 else 分支中，当 hero exit 进行中且当前页面为 home 时，调用 `revealHomeCardsImmediately()` 替代 `initHomeAnimations()`

## Impact
- Affected specs: hero 退出飞行过渡、页面切换动画、首页卡片入场
- Affected code:
  - `src/js/modules/animationHelpers.js` — 重新导出 `isHeroExitInFlight()`
  - `src/js/modules/renderer.js` — 动画条件 + 卡片显示分支
  - `src/js/pages/home.js` — 新增 `revealHomeCardsImmediately()`

## ADDED Requirements

### Requirement: 退出飞行时跳过页面滑入动画
系统 SHALL 在 hero 退出飞行进行中（`isHeroExitInFlight() === true`）时跳过 renderer 的 `.page-transition-container` 过渡动画，直接渲染页面内容。

#### Scenario: 退出飞行期间页面渲染
- **WHEN** `performHeroExit` 调用 `router.push(home)` 触发 renderer
- **THEN** renderer 不创建过渡容器，不播放页面滑入动画，直接调用 `injectSection` 和 `revealHomeCardsImmediately`

### Requirement: 退出飞行时卡片立即显示
系统 SHALL 在 hero 退出飞行期间渲染 home 页面时，使用 `revealHomeCardsImmediately()` 替代 `initHomeAnimations()`，卡片不经过 `is-hidden` 阶段直接可见。

#### Scenario: clone 飞向目标卡片
- **WHEN** hero-clone 从详情大图飞向首页卡片位置
- **THEN** 卡片在 clone 到来前已完全可见，clone 仿佛直接"变成"卡片

## MODIFIED Requirements

（无修改项）

## REMOVED Requirements

（无移除项）
