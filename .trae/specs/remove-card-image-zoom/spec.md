# 移除游戏卡片悬停图片放大效果规范

## Why
游戏卡片（首页和搜索页）在鼠标悬停时图片会放大，用户希望移除此效果，只保留卡片的悬停效果（上移和阴影）。

## What Changes
- 移除游戏卡片图片的 `group-hover:scale-110` 类
- 保留卡片的悬停上移和阴影效果

## Impact
- Affected specs: 游戏卡片交互效果
- Affected code: `src/js/modules/components.js`

## MODIFIED Requirements

### Requirement: 游戏卡片悬停效果
游戏卡片悬停时，卡片整体上移并增加阴影，但图片不再放大。

#### Scenario: 鼠标悬停卡片
- **WHEN** 用户鼠标悬停在游戏卡片上
- **THEN** 卡片上移 4px 并增加阴影
- **THEN** 图片保持原大小，不放大
