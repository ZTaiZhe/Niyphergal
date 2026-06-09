# 修复滑动切换动画容器塌陷 Spec

## Why
上一轮重构将动画从临时容器改为直接在 `section[data-page]` 上播放，但 CSS 规则对所有带动画 class 的 section 都设置了 `position: absolute`。当新旧两个 section 同时变为 absolute 时，`main-container` 失去所有文档流内容，高度塌陷为 0，导致动画完全不可见或视觉错乱。

## What Changes
- 修改 CSS：仅退出（outgoing）section 使用 `position: absolute`；进入（incoming）section 保持在正常文档流中，仅用 `transform` 滑入
- JS 中在动画期间临时设置 `overflow: hidden` 防止水平溢出
- 确保 `main-container` 在动画期间是定位上下文（`position: relative`）
- 修正动画 class 添加时序：先添加退出动画 class（使旧 section 脱离文档流），强制 reflow，再添加进入动画 class

## Impact
- Affected CSS: `src/css/styles.css`（section 动画叠加样式）
- Affected JS: `src/js/modules/search/renderer.js`（主动画分支）
- Affected specs: refactor-page-transition-animation

## ADDED Requirements

### Requirement: 进入 section 保持正常文档流
系统 SHALL 在页面滑动切换动画期间，让进入的新 section 保持在正常文档流中（不设 `position: absolute`），仅通过 CSS `transform` 实现滑入效果。这确保 `main-container` 始终有内容撑起高度。

#### Scenario: push 导航（首页→分类）
- **WHEN** 用户从首页导航到分类页
- **THEN** 首页 section 获得 `animate-slide-out-left` class → `position: absolute`，覆盖在上方，向左滑出
- **AND** 分类 section 获得 `animate-slide-in-right` class → 保持在正常文档流，从右侧滑入
- **AND** `main-container` 高度由分类 section 撑起，不塌陷

#### Scenario: pop 导航（分类→首页）
- **WHEN** 用户从分类页返回首页
- **THEN** 分类 section 获得 `animate-slide-out-right` class → `position: absolute`，覆盖在上方，向右滑出
- **AND** 首页 section 获得 `animate-slide-in-left` class → 保持在正常文档流，从左侧滑入
- **AND** 首页 DOM 状态保持（`preserveExisting=true`）

### Requirement: 动画期间容器溢出裁剪
系统 SHALL 在滑动动画期间临时将 `main-container` 的 overflow 设为 `hidden`，动画结束后恢复为 `overflow-y: auto`。这防止 section 在 `translateX` 偏移时产生水平滚动条或视觉溢出。

### Requirement: 容器作为定位上下文
系统 SHALL 确保 `main-container` 在动画期间具有 `position: relative`，使退出 section 的 `position: absolute` 相对于容器定位而非更上层祖先。

### Requirement: 动画 class 添加时序
系统 SHALL 按以下顺序添加动画 class：
1. 设置新 section 内容和 `display: block`
2. 强制 reflow（确保容器获得新 section 的高度）
3. 添加退出动画 class 到旧 section（使其脱离文档流成为覆盖层）
4. 强制 reflow（确保旧 section 的初始位置正确渲染）
5. 添加进入动画 class 到新 section（开始滑入动画）

## MODIFIED Requirements

### Requirement: section 动画叠加 CSS
退出 section（`animate-slide-out-left/right`, `animate-fade-out`）保持 `position: absolute; z-index: 5`。
进入 section（`animate-slide-in-right/left`, `animate-fade-in`）不再设 `position: absolute`，仅设 `z-index: 1`，保持在正常文档流中。

## REMOVED Requirements

### Requirement: 进入 section 使用 position: absolute
**Reason**: 导致容器高度塌陷，动画不可见
**Migration**: 进入 section 保持在正常文档流，仅用 transform 滑入
