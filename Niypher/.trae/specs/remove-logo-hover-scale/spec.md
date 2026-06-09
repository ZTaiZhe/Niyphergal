# 移除 Logo 卡片悬停放大效果规范

## Why
Logo 卡片（NiypherGal 按钮）在鼠标悬停时会放大，用户希望移除此效果。

## What Changes
- 移除 Logo 按钮的 `hover:scale-105` 类

## Impact
- Affected specs: Logo 卡片交互效果
- Affected code: `index.html`

## MODIFIED Requirements

### Requirement: Logo 卡片悬停效果
Logo 卡片悬停时不再放大，只保留背景和边框的变化效果。

#### Scenario: 鼠标悬停 Logo 卡片
- **WHEN** 用户鼠标悬停在 Logo 卡片上
- **THEN** 卡片不放大
- **THEN** 背景和边框的悬停效果保留
