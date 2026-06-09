# 游戏卡片标题荧光笔动效规范

## Why
为游戏卡片标题添加荧光笔效果，悬停时从左向右生长，移走时向左消失，增强交互体验。

## What Changes
- 为游戏卡片标题添加底部荧光笔元素
- 添加 CSS 动画实现荧光笔生长和消失效果

## Impact
- Affected specs: 游戏卡片交互效果
- Affected code: `src/js/modules/components.js`, `src/css/styles.css`

## ADDED Requirements

### Requirement: 游戏卡片标题荧光笔效果
游戏卡片悬停时，标题底部显示荧光笔效果，从左向右生长；移走时向左消失。

#### Scenario: 鼠标悬停卡片
- **WHEN** 用户鼠标悬停在游戏卡片上
- **THEN** 标题底部出现荧光笔效果
- **THEN** 荧光笔从左向右生长

#### Scenario: 鼠标离开卡片
- **WHEN** 用户鼠标离开游戏卡片
- **THEN** 荧光笔效果从右向左消失

#### Scenario: 荧光笔样式
- **WHEN** 荧光笔显示
- **THEN** 颜色为粉色（与主题一致）
- **THEN** 高度适中，不遮挡文字
