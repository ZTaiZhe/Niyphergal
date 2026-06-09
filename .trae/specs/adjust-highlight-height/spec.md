# 调整荧光笔高度规范

## Why
荧光笔效果的高度需要调整为标题文字高度的一半，使视觉效果更加协调。

## What Changes
- 将荧光笔高度从固定 6px 改为相对单位 `0.5em`

## Impact
- Affected specs: 游戏卡片标题荧光笔效果
- Affected code: `src/css/styles.css`

## MODIFIED Requirements

### Requirement: 荧光笔高度
荧光笔高度应为标题文字高度的一半。

#### Scenario: 荧光笔高度
- **WHEN** 荧光笔显示
- **THEN** 高度为标题文字高度的一半（约 0.5em）
