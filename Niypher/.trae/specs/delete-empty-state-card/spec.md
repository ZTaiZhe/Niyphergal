# 删除空状态卡片 - 规范文档

## Why
空状态和无结果状态使用了 glass-card 容器样式，用户希望移除卡片容器，但保留内部的内容、逻辑和动效。

## What Changes
- 删除 `renderEmptySearch()` 函数中的 `glass-card` 样式容器
- 删除 `renderNoResults()` 函数中的 `glass-card` 样式容器
- 保留所有内部元素、图标、动画和功能逻辑
- 保留搜索结果头部的 glass-card 样式

## Impact
- Affected specs: recreate-search-page
- Affected code: src/js/pages/search.js

## MODIFIED Requirements
### Requirement: 空状态样式调整
- **修改**: 空状态和无结果状态不再使用 glass-card 容器
- **保留**: 内部图标、标题、描述、按钮、动效逻辑完整保留
