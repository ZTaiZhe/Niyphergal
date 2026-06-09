# 修复模糊遮罩圆角问题规范

## Why
模糊遮罩底部的圆角和高度与卡片底部不匹配，导致游戏图片从底部露出来。

## What Changes
- 将模糊遮罩的圆角从 `inherit` 改为明确的 `16px`，与卡片圆角匹配
- 确保模糊遮罩完全覆盖卡片底部

## Impact
- Affected specs: 游戏卡片视觉效果
- Affected code: `src/css/styles.css`

## MODIFIED Requirements

### Requirement: 模糊遮罩圆角
模糊遮罩底部圆角应与卡片圆角完全匹配。

#### Scenario: 模糊遮罩圆角
- **WHEN** 卡片显示
- **THEN** 模糊遮罩底部圆角为 16px，与卡片匹配
- **THEN** 图片不会从底部露出
