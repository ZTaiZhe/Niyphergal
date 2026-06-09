# 图片查看器（Pic Viewer）功能修复规范

## Why
详情页媒体区域的图片点击后应打开全屏图片查看器，支持缩放、切换、关闭等操作。当前代码中 `renderMediaItem()` 生成的图片带有 `cursor-pointer` 但**没有任何点击事件处理**，导致点击图片无响应；同时缺少完整图片查看器组件，用户报告控件样式丢失、缩放失灵、功能无法使用。

## What Changes
- 新增全屏图片查看器（Image Viewer / Pic Viewer）组件
- 为详情页媒体区域图片绑定点击事件，打开查看器
- 实现图片缩放功能（双指/滚轮缩放 + 按钮控制）
- 实现图片左右切换（多图时显示导航箭头）
- 实现关闭按钮和背景点击关闭
- 查看器控件使用项目统一的玻璃态（glass-card/acrylic）设计风格

## Impact
- Affected specs: remove-card-image-zoom（需补充详情页图片查看功能）
- Affected code:
  - `src/js/modules/components.js` — 新增 ImageViewer 组件
  - `src/js/modules/eventDelegation.js` — 新增 open-image-viewer action
  - `src/js/pages/detail.js` — 媒体图片绑定点击事件
  - `src/css/styles.css` — 图片查看器样式

## ADDED Requirements

### Requirement: 全屏图片查看器
系统 SHALL 提供全屏图片查看器组件，用于查看详情页媒体区域的大图。

#### Scenario: 点击媒体图片打开查看器
- **WHEN** 用户在详情页点击媒体区域的图片
- **THEN** 打开全屏图片查看器，显示该图片的原始尺寸
- **THEN** 查看器覆盖整个屏幕，背景半透明黑色模糊
- **THEN** 显示玻璃态风格的控制按钮（关闭、缩放、左右切换）

#### Scenario: 关闭查看器
- **WHEN** 用户点击关闭按钮或背景区域或按 ESC 键
- **THEN** 查看器以动画方式关闭
- **THEN** 页面滚动恢复

### Requirement: 图片缩放功能
系统 SHALL 在图片查看器中提供缩放功能。

#### Scenario: 滚轮/双指缩放
- **WHEN** 用户在查看器中使用鼠标滚轮或双指捏合手势
- **THEN** 图片在 0.5x ~ 5x 范围内平滑缩放
- **THEN** 缩放中心为鼠标/触摸位置

#### Scenario: 按钮控制缩放
- **WHEN** 用户点击放大(+)按钮
- **THEN** 图片放大一级（每级 1.25x）
- **WHEN** 用户点击缩小(-)按钮
- **THEN** 图片缩小一级
- **WHEN** 用户点击重置按钮
- **THEN** 图片恢复到适应屏幕大小

#### Scenario: 缩放后拖拽平移
- **WHEN** 图片被放大到超出视口范围
- **THEN** 用户可拖拽图片平移查看不同区域

### Requirement: 多图切换功能
系统 SHALL 在有多张图片时提供左右切换导航。

#### Scenario: 左右箭头切换
- **WHEN** 查看器打开且存在多张图片时
- **THEN** 显示左右导航箭头按钮
- **WHEN** 用户点击右箭头或向左滑动
- **THEN** 切换到下一张图片（带滑动过渡动画）
- **WHEN** 用户点击左箭头或向右滑动
- **THEN** 切换到上一张图片

#### Scenario: 首尾循环
- **WHEN** 用户在最后一张图片点击右箭头
- **THEN** 循环回到第一张图片
- **WHEN** 用户在第一张图片点击左箭头
- **THEN** 循环到最后一张图片

### Requirement: 查看器控件样式
系统 SHALL 使用与项目一致的玻璃态设计风格渲染查看器控件。

#### Scenario: 控件外观
- **WHEN** 查看器打开时
- **THEN** 关闭按钮位于右上角，圆形玻璃态卡片样式
- **THEN** 缩放按钮组位于右下角，玻璃态面板样式
- **THEN** 导航箭头位于左右两侧，半透明玻璃态样式
- **THEN** 所有控件在 3 秒无操作后自动淡出，移动鼠标/触摸时重新显示
- **THEN** 底部显示图片计数指示器（如 "2 / 5"）

## MODIFIED Requirements

### Requirement: 详情页媒体图片交互
现有的 `renderMediaItem()` 生成的图片已有 `cursor-pointer` 类但无事件绑定。修改后：
- 图片元素添加 `data-action="open-image-viewer"` 和 `data-index` 属性
- EventDelegation 中新增 `open-image-viewer` action 处理逻辑

## REMOVED Requirements
（无）
