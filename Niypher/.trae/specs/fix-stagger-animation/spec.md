# 搜索结果交错动效修复 - 规范文档

## Why
当前搜索结果的离开和载入动画没有生效，原因是卡片已有 `animate-card-in` 类（使用 CSS animation），与新的 `.is-leaving` 和 `.is-entering` 类（使用 CSS transition）产生冲突。

## What Changes
- 在执行离开动画前，先移除卡片上的 `animate-card-in` 类
- 在执行载入动画后，不添加回 `animate-card-in` 类（因为卡片已经是可见状态）
- 使用 `!important` 确保 `.is-leaving` 和 `.is-entering` 样式优先级最高
- **修改动效方向**：离开和载入都改为向上移动
- **增强时序效果**：增加交错延迟时间，使动效更明显

## Impact
- Affected specs: fix-stagger-animation
- Affected code: src/js/modules/renderer.js, src/css/styles.css

## MODIFIED Requirements
### Requirement: 解决 CSS 冲突
- **修改**: 在 JS 中移除 `animate-card-in` 类
- **修改**: 在 CSS 中使用 `!important` 确保过渡样式优先级

### Requirement: 交错动效正确执行
- **效果**: 卡片离开时一项接一项离开（淡出+上移）
- **效果**: 卡片载入时一项接一项载入（淡入+上移）
- **增强**: 增加交错延迟时间，使动效更明显
