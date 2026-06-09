# 添加排序正倒序按钮 - 规范文档

## Why
用户希望在排序选项后面添加正倒序切换按钮，允许用户切换排序的升序/降序顺序。

## What Changes
- 在排序按钮行后面添加正倒序切换按钮
- 支持 URL 参数 `order` (asc/desc)
- 点击按钮切换排序顺序
- UI 和动效由 UI/UX 智能体设计实现

## Impact
- Affected specs: recreate-search-page
- Affected code: 
  - src/js/pages/search.js (添加 order 参数和正倒序按钮)
  - src/js/modules/router.js (添加 order URL 参数支持)
  - src/js/modules/searchHelper.js (处理排序顺序逻辑)

## ADDED Requirements
### Requirement: 正倒序切换功能
系统 SHALL 提供正倒序切换功能，允许用户切换排序顺序。

#### Scenario: 切换排序顺序
- **WHEN** 用户点击正倒序按钮
- **THEN** 排序顺序切换，URL 参数更新，列表重新渲染

#### Scenario: 默认排序顺序
- **WHEN** 用户未选择排序方式或选择默认排序
- **THEN** 正倒序按钮应隐藏或禁用

## MODIFIED Requirements
### Requirement: 排序功能扩展
- **添加**: 正倒序切换按钮
- **保留**: 现有的排序选项（默认、标题、日期）
