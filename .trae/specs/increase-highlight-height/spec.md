# 调整荧光笔高度规范

## Why
荧光笔效果的高度需要再高一点，使视觉效果更加明显。

## What Changes
- 将荧光笔高度从 `0.5em` 改为 `0.65em`

## Impact
- Affected specs: 游戏卡片标题荧光笔效果
- Affected code: `src/css/styles.css`

## MODIFIED Requirements

### Requirement: 荧光笔高度
荧光笔高度应为文字高度的 65%。

#### Scenario: 荧光笔高度
- **WHEN** 荧光笔显示
- **THEN** 高度为文字高度的 65%（0.65em）
