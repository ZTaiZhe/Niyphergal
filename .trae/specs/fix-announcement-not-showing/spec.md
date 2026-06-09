# 修复公告弹窗不显示 Spec

## Why
公告弹窗的 HTML 正确渲染到 DOM 中，`showAnnouncement()` 也正确移除了 `hidden` 类，但 `.modal-overlay` 没有 CSS 样式定义。移除 `hidden` 后，modal 只是作为普通流式元素显示在页面底部（用户需要滚动到底部才能看到），而不是以固定定位覆盖层的形式弹出。

## What Changes
- 在 `src/css/components/components.css` 中添加 `.modal-overlay` 样式：固定定位、全屏覆盖、半透明背景遮罩、z-index 层级、居中布局

## Impact
- Affected code: `src/css/components/components.css`

## ADDED Requirements
### Requirement: 公告弹窗覆盖层样式
系统 SHALL 为 `.modal-overlay` 提供完整的 CSS 样式，使其作为全屏覆盖层正确显示在页面顶层。

#### Scenario: 公告弹窗显示
- **WHEN** `showAnnouncement()` 被调用（移除 `hidden` 类）
- **THEN** `.modal-overlay` 以固定定位覆盖全屏，带有半透明深色背景遮罩，modal 内容居中显示在屏幕上方区域

#### Scenario: 公告弹窗关闭
- **WHEN** `closeAnnouncement()` 被调用（添加 `hidden` 类）
- **THEN** `.modal-overlay` 完全隐藏，不占据布局空间

## MODIFIED Requirements
无

## REMOVED Requirements
无
