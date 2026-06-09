# 修复左右换页动效消失冲突 Spec

## Why
`preserve-page-state-on-back` 功能引入的 fast path 过于激进——当 `sectionAlreadyRendered` 为 true 时，直接切换 `display` 属性并 `return`，完全跳过了左右滑动动画。同时，`pop` 模式（返回导航）的动画路径也有缺陷：动画覆盖分支要求 `_mode !== 'pop'`，导致返回时永远不进入滑动动画分支，直接落入无动画的 `else` 分支。结果是：一旦页面被访问过，所有后续导航都没有左右换页动效。

## What Changes
- 移除 fast path（`sectionAlreadyRendered` 时直接 return 的逻辑），改为让动画系统正常运行
- 修改动画覆盖分支的条件，允许 `pop` 模式也播放左右滑动动画（方向反转）
- 在动画完成后，仍通过 `_shouldPreserve` 保留 DOM 状态（不重新注入 innerHTML）
- `pop` 模式下，动画方向应与 `push` 相反：返回时新页面从左侧滑入，旧页面向右滑出

## Impact
- Affected code: `src/js/modules/search/renderer.js`（`render()` 函数）
- Affected specs: preserve-page-state-on-back

## ADDED Requirements

### Requirement: 已访问页面间导航时仍播放左右滑动动画
系统 SHALL 在已访问页面间导航时播放左右滑动过渡动画，而不是瞬间切换。

#### Scenario: 首页→分类（首次）
- **WHEN** 用户从首页导航到分类页（首次访问）
- **THEN** 分类页从右侧滑入，首页向左滑出

#### Scenario: 分类→首页（返回，pop 模式）
- **WHEN** 用户从分类页返回首页
- **THEN** 首页从左侧滑入，分类页向右滑出
- **AND** 首页 DOM 状态保持（卡片不重新播放入场动画，轮播图位置不重置）

#### Scenario: 首页→分类（再次访问）
- **WHEN** 用户从首页再次导航到分类页
- **THEN** 分类页从右侧滑入，首页向左滑出
- **AND** 分类页 DOM 状态保持

#### Scenario: 底部导航栏切换页面
- **WHEN** 用户通过底部导航栏从"推荐"切到"分类"
- **THEN** 播放左右滑动动画

## MODIFIED Requirements

### Requirement: 移除 fast path，改为动画完成后保留 DOM 状态
`render()` 中的 fast path（`sectionAlreadyRendered` 时直接切换 display 并 return）SHALL 被移除。页面状态保留 SHALL 通过动画完成后 `injectSection` 的 `preserveExisting` 参数实现，而非跳过整个动画流程。

### Requirement: pop 模式播放反向滑动动画
`render()` 中的动画覆盖分支 SHALL 支持 `pop` 模式：
- `push` 模式：新页面从右侧滑入（`animate-slide-in-right`），旧页面向左滑出（`animate-slide-out-left`）
- `pop` 模式：新页面从左侧滑入（`animate-slide-in-left`），旧页面向右滑出（`animate-slide-out-right`）

## REMOVED Requirements

### Requirement: fast path 直接切换 display
**Reason**: fast path 完全跳过动画，导致左右换页动效消失
**Migration**: 改为通过 `injectSection` 的 `preserveExisting` 参数在动画完成后保留 DOM 状态
