# 回到顶部按钮规范

## Why
用户在浏览长页面时需要快速返回页面顶部，添加一个回到顶部按钮可以提升用户体验。

## What Changes
- 在刷新按钮上方添加一个回到顶部按钮
- 样式与刷新按钮保持一致（不包括图标）
- 点击后平滑滚动到页面顶部

## Impact
- Affected specs: UI 组件
- Affected code: `index.html`, `src/css/styles.css`

## ADDED Requirements

### Requirement: 回到顶部按钮
系统应提供回到顶部按钮，位于刷新按钮上方，样式与刷新按钮一致。

#### Scenario: 点击回到顶部
- **WHEN** 用户点击回到顶部按钮
- **THEN** 页面平滑滚动到顶部

#### Scenario: 按钮样式
- **WHEN** 页面加载完成
- **THEN** 回到顶部按钮样式与刷新按钮一致（圆形、亚克力面板、悬停放大效果）

### Requirement: 按钮位置
回到顶部按钮应位于刷新按钮上方一点的位置。

#### Scenario: 按钮定位
- **WHEN** 页面渲染完成
- **THEN** 回到顶部按钮位于右下角，在刷新按钮上方约 60px 处
