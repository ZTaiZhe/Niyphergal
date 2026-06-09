# 统一首页和搜索页游戏卡片悬停效果规范

## Why
首页游戏卡片的鼠标悬停效果与搜索页不一致，可能是因为首页卡片使用了 `is-loaded` 状态类，其 `transform: translateY(0)` 与悬停效果的 `transform` 产生冲突。

## What Changes
- 确保 `.glass-card:hover` 的 transform 效果优先级高于 `is-loaded` 类
- 统一首页和搜索页的卡片悬停效果

## Impact
- Affected specs: 游戏卡片交互效果
- Affected code: `src/css/styles.css`

## MODIFIED Requirements

### Requirement: 统一的游戏卡片悬停效果
首页和搜索页的游戏卡片悬停效果应当完全一致。

#### Scenario: 首页卡片悬停
- **WHEN** 用户鼠标悬停在首页游戏卡片上
- **THEN** 卡片上移 4px 并增加阴影
- **THEN** 效果与搜索页一致

#### Scenario: 搜索页卡片悬停
- **WHEN** 用户鼠标悬停在搜索页游戏卡片上
- **THEN** 卡片上移 4px 并增加阴影
- **THEN** 效果与首页一致
