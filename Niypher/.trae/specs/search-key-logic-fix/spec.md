# 回车键和搜索键逻辑修复 - Product Requirement Document

## Why
当前实现中，`performSearch` 方法被修改为只跳转到搜索页，导致选中联想项（tag/developer/vndb 类型）时的原有行为被破坏。需要修复回车键和搜索键的逻辑，确保符合原始需求。

## What Changes
- 恢复 `performSearch` 的原始搜索逻辑（搜索并跳转到第一个结果的详情页）
- 新增 `navigateToSearch` 方法专门用于跳转到搜索页
- 修改搜索按钮点击事件，调用 `navigateToSearch` 而非 `performSearch`
- 修改 Enter 键处理（未选中联想项时），调用 `navigateToSearch` 而非 `performSearch`

## Impact
- Affected specs: new-search-page
- Affected code: src/js/modules/search.js

## ADDED Requirements

### Requirement: 搜索按钮点击行为
系统 SHALL 在用户点击搜索按钮时，跳转到搜索页并显示搜索结果。

#### Scenario: 搜索按钮点击
- **WHEN** 用户在搜索栏输入文本后点击搜索按钮
- **THEN** 系统跳转到搜索页，URL 参数包含搜索词，搜索页显示搜索结果

### Requirement: 未选中联想项时按回车行为
系统 SHALL 在用户未选中任何联想项时按回车键，跳转到搜索页。

#### Scenario: 未选中联想项按回车
- **WHEN** 用户在搜索栏输入文本，未选中任何联想项，按回车键
- **THEN** 系统跳转到搜索页，URL 参数包含搜索词，搜索页显示搜索结果

### Requirement: 选中联想项时按回车行为（原有行为保持）
系统 SHALL 在用户选中联想项时按回车键，执行原有搜索行为。

#### Scenario: 选中游戏类型联想项按回车
- **WHEN** 用户选中游戏类型的联想项，按回车键
- **THEN** 系统跳转到该游戏的详情页

#### Scenario: 选中 tag/developer/vndb 类型联想项按回车
- **WHEN** 用户选中 tag/developer/vndb 类型的联想项，按回车键
- **THEN** 系统执行搜索并跳转到第一个结果的详情页（原有行为）

## MODIFIED Requirements

### Requirement: performSearch 方法
`performSearch` 方法 SHALL 执行搜索并跳转到第一个结果的详情页（恢复原有行为）。

### Requirement: navigateToSearch 方法（新增）
系统 SHALL 提供 `navigateToSearch` 方法，专门用于跳转到搜索页。

## REMOVED Requirements
无
