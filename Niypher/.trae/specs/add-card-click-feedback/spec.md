# 游戏卡片点击反馈规范

## Why
游戏卡片（推荐页和搜索页）点击时没有像 Logo 卡片一样的点击反馈效果，用户体验不一致。

## What Changes
- 为游戏卡片添加 `btn-active` 类，提供点击缩放反馈

## Impact
- Affected specs: 游戏卡片交互效果
- Affected code: `src/js/modules/components.js`

## MODIFIED Requirements

### Requirement: 游戏卡片点击反馈
游戏卡片点击时应当有缩放反馈效果，与 Logo 卡片一致。

#### Scenario: 点击游戏卡片
- **WHEN** 用户点击游戏卡片
- **THEN** 卡片缩放到 0.96 倍
- **THEN** 效果与 Logo 卡片一致
