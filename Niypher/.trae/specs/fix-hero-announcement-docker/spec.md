# 飞行过渡消失、公告异常、Docker 栏层级修复 Spec

## Why
`fix-animation-container-cleanup` 中将动画分支条件从 `oldAnimationClass` 改为 `animationClass && router.previous`，导致 pop 模式返回导航也进入 500ms 动画分支。动画分支中 `injectSection` 在动画结束后替换 DOM 会销毁并重建页面内容，导致：1) 公告弹窗先显示后消失（`showAnnouncement` 在动画容器中生效但随后被 `injectSection` 重建）；2) `injectSection` 清理逻辑可能干扰 hero 飞行过渡的事件时序。同时 docker 栏 `z-40` 可能被其他元素覆盖。

## What Changes
- 修复动画分支条件：pop 模式不进入动画分支（pop 模式应由浏览器默认行为或简单 fade-in 处理）
- 修复公告弹窗：将 `showAnnouncement` 的调用时机移至 `injectSection` 之后，确保弹窗在最终 DOM 结构中显示
- 修复 hero 飞行过渡：在 `isDetailTransition` 分支中，`injectSection` 调用前不执行 `.page-transition-container` 清理，避免干扰 hero 元素
- 提高 docker 栏 z-index 至 `z-[9999]` 确保始终在最顶层

## Impact
- Affected specs: 页面切换动画、公告弹窗、hero 飞行过渡、docker 栏层级
- Affected code:
  - `src/js/modules/renderer.js` — 修复动画分支条件、修复公告调用时机、修复 injectSection 清理范围
  - `index.html` — 提高 docker nav 的 z-index

## ADDED Requirements

### Requirement: Docker 栏始终在最顶层
系统 SHALL 确保 docker 导航栏的 z-index 高于所有页面内容（包括 hero-clone、公告弹窗等），始终可点击。

#### Scenario: 任何页面状态下
- **WHEN** 用户在任意页面或动画过渡中
- **THEN** docker 栏始终在最顶层，不被任何元素遮挡

### Requirement: pop 模式不进入过渡动画分支
系统 SHALL 在浏览器后退/前进（pop 模式）时不进入 `.page-transition-container` 动画分支，直接使用 `injectSection` 渲染内容。

#### Scenario: 用户按浏览器后退按钮
- **WHEN** 用户按浏览器后退按钮从 detail 返回到 home
- **THEN** 不创建过渡容器，直接调用 `injectSection` 渲染新页面

## MODIFIED Requirements

### Requirement: 公告弹窗显示时机
公告弹窗 SHALL 在 `injectSection` 创建最终 DOM 结构之后再调用 `showAnnouncement`，而非在动画容器创建前。

#### Scenario: 导航到首页
- **WHEN** 用户导航到 home 页面且有公告
- **THEN** 公告弹窗在页面内容注入完成后稳定显示，不会先显示后消失

### Requirement: Hero 飞行过渡
`isDetailTransition` 分支中 `injectSection` 调用时 SHALL 不触发不必要的过渡容器清理，确保 hero 飞行过渡的事件时序不被干扰。

#### Scenario: 点击游戏卡片进入详情页
- **WHEN** 用户点击游戏卡片触发 hero 飞行过渡
- **THEN** `detail:rendered` 事件正常触发，hero-clone 动画正常执行，详情页内容正确显示

## REMOVED Requirements

（无移除项）
