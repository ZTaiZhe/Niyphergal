# 合并刷新按钮到主页导航按钮规范

## Why
当前主页有一个独立的刷新按钮（右下角固定位置），与导航栏分离。将刷新功能合并到主页导航按钮上可以简化界面，当用户在主页时，主页按钮变为刷新按钮。

## What Changes
- 删除主页独立的刷新按钮元素（`#refresh-cards-btn`）
- 修改主页导航按钮，在主页时显示刷新图标并执行刷新逻辑
- 在其他页面时显示主页图标并执行导航逻辑
- **注意**：搜索页的重试按钮（`.btn-retry`）不受影响，保留原有功能
- **BREAKING** 移除独立的主页刷新按钮 DOM 元素

## Impact
- Affected specs: 导航栏、主页刷新功能
- Affected code: `index.html`, `src/js/pages/home.js`, `src/js/modules/navigation.js`

## ADDED Requirements

### Requirement: 动态主页按钮
主页导航按钮应当根据当前页面动态切换图标和功能。

#### Scenario: 在主页时
- **WHEN** 用户当前在主页
- **THEN** 主页按钮显示刷新图标（ri-refresh-line）
- **THEN** 点击按钮执行刷新卡片逻辑

#### Scenario: 不在主页时
- **WHEN** 用户当前不在主页
- **THEN** 主页按钮显示主页图标（ri-home-4-line）
- **THEN** 点击按钮导航到主页

## REMOVED Requirements

### Requirement: 独立主页刷新按钮
**Reason**: 刷新功能已合并到主页导航按钮
**Migration**: 删除 `#refresh-cards-btn` 元素，刷新逻辑改为使用主页按钮

## NOT Affected

### Requirement: 搜索页重试按钮
搜索页的网络错误重试按钮（`.btn-retry`）保持不变，继续执行重新搜索逻辑。
