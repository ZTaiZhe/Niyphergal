# 调整荧光笔位置规范

## Why
荧光笔效果需要调整到文字的下一层、模糊层的上一层，使视觉效果更清晰。

## What Changes
- 将荧光笔元素从 h3 标题内移到外层 div
- 调整 z-index 确保荧光笔在模糊层上方

## Impact
- Affected specs: 游戏卡片标题荧光笔效果
- Affected code: `src/js/modules/components.js`, `src/css/styles.css`

## MODIFIED Requirements

### Requirement: 荧光笔位置
荧光笔应在文字下方、模糊层上方。

#### Scenario: 荧光笔位置
- **WHEN** 荧光笔显示
- **THEN** 荧光笔在文字下方、模糊层上方
