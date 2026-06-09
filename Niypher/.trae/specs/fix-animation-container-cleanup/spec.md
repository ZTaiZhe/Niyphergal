# 动画后页面布局错乱及功能失灵修复 Spec

## Why
上次 `fix-page-transition-performance` 变更中，`injectSection()` 在动画完成后未清理 `.page-transition-container` 过渡容器，导致该容器（`height: 100%`）持续占据 `#main-container` 全高，将新创建的 section 元素挤出可视区域，造成页面位置层级错乱和功能失灵。同时动画分支条件过于宽泛，首次加载也会进入动画分支产生不必要延迟；`prefers-reduced-motion` 判断被弱化。

## What Changes
- **BREAKING**: 撤销 `clearTransientContent` + `injectSection` 之间缺少容器清理的缺陷
- `injectSection()` 在创建 sections 之前先清理所有 transient 容器（`.page-transition-container`、`.search-page-transition-container`）
- 恢复 `prefers-reduced-motion` 跳过动画的完整逻辑
- 修复动画分支条件：首次加载（`router.previous` 为空）或同页刷新不进入动画分支
- 移除上次修复中残留的 `console.log` / `console.error` 调试代码

## Impact
- Affected specs: 页面切换动画渲染
- Affected code:
  - `src/js/modules/renderer.js` — `injectSection` 新增清理逻辑、恢复 reduced-motion 跳过、修复动画条件、移除调试代码

## ADDED Requirements

### Requirement: injectSection 清理过渡容器
系统 SHALL 在 `injectSection()` 函数中，在创建或更新 section 元素之前，先移除 `#main-container` 中的所有 transient 过渡容器元素。

#### Scenario: 动画完成后注入 section
- **WHEN** 页面切换动画完成，`injectSection` 被调用
- **THEN** `.page-transition-container` 和 `.search-page-transition-container` 从 DOM 中移除，新 section 正常占据布局空间

## MODIFIED Requirements

### Requirement: prefers-reduced-motion 完全跳过动画
系统 SHALL 在用户启用 `prefers-reduced-motion` 时，完全跳过 CSS 过渡动画，直接使用 `injectSection` 渲染内容，而非仅缩短 fallback 超时。

#### Scenario: reduced-motion 用户切换页面
- **WHEN** 用户启用了 reduced-motion 偏好并切换页面
- **THEN** 跳过动画容器构建，直接调用 `injectSection` 渲染新内容

### Requirement: 首次加载不进入动画分支
页面首次加载 SHALL 不进入过渡动画分支，直接使用 `injectSection` 渲染初始页面内容。

#### Scenario: 应用首次加载
- **WHEN** 应用启动，`router.push('home')` 首次执行
- **THEN** 不创建过渡容器，不播放动画，直接渲染 home 页面

## REMOVED Requirements

（无移除项）
