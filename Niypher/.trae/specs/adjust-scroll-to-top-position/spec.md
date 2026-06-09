# 调整回到顶部按钮位置规范

## Why
在首页时，回到顶部按钮位置偏高，与左侧主题切换按钮高度不一致，影响视觉对称性。需要调整到与主题切换按钮相同高度。

## What Changes
- 在首页时，回到顶部按钮的 bottom 位置调整为 `bottom-20`（与主题切换按钮一致）
- 在搜索页时，回到顶部按钮和刷新按钮位置保持不变

## Impact
- Affected specs: UI 布局
- Affected code: `src/js/modules/navigation.js`

## ADDED Requirements

### Requirement: 首页回到顶部按钮位置
在首页时，回到顶部按钮应当与主题切换按钮高度一致。

#### Scenario: 在首页时
- **WHEN** 用户在首页
- **THEN** 回到顶部按钮位置为 `bottom-20`（与主题切换按钮一致）

#### Scenario: 在搜索页时
- **WHEN** 用户在搜索页
- **THEN** 回到顶部按钮位置保持 `bottom: calc(max(env(safe-area-inset-bottom, 20px), 5rem) + 60px)`
- **THEN** 刷新按钮位置保持 `bottom: max(env(safe-area-inset-bottom, 20px), 5rem)`

#### Scenario: 在其他页面时
- **WHEN** 用户在其他页面（分类页、详情页、个人页等）
- **THEN** 回到顶部按钮位置为 `bottom-20`
