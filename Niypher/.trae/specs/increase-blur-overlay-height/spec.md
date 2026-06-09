# 增加模糊层高度规范

## Why
卡片底部的模糊层高度需要增加，使标题区域更加清晰可读。

## What Changes
- 将 `.card-blur-overlay` 的 `height` 从 `33.33%` 增加到 `50%`

## Impact
- Affected specs: 游戏卡片视觉效果
- Affected code: `src/css/styles.css`

## MODIFIED Requirements

### Requirement: 模糊层高度
模糊层高度应覆盖卡片下半部分。

#### Scenario: 模糊层高度
- **WHEN** 卡片显示
- **THEN** 模糊层覆盖卡片高度的 50%
