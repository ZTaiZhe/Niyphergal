# 删除 SearchPage 规格

## Why
用户要求移除之前实施的搜索页功能，恢复到之前的搜索行为（直接在 header 搜索栏显示结果或跳转到详情页）。

## What Changes
- 删除搜索页面路由（search page）
- 移除搜索页的渲染模块（src/js/pages/search.js）
- 恢复 header 搜索栏的原有行为（点击搜索或回车直接显示结果或跳转到详情页）
- 移除搜索页相关的路由配置和渲染逻辑
- 移除搜索页的排序和筛选功能
- 保留联想栏功能不变

## Impact
- Affected specs: new-search-page（反向操作）
- Affected code: 
  - src/js/pages/search.js（删除）
  - src/js/modules/router.js（移除 search 相关配置）
  - src/js/modules/renderer.js（移除 renderSearch 逻辑）
  - src/js/modules/search.js（恢复原有搜索行为）

## ADDED Requirements
### Requirement: 删除搜索页功能
系统 SHALL 移除搜索页相关功能，恢复原有搜索行为。

#### Scenario: 用户触发搜索
- **WHEN** 用户在 header 搜索栏输入内容后点击搜索按钮或按回车键
- **THEN** 直接执行搜索并显示结果或跳转到第一个结果的详情页（原有行为）

#### Scenario: 用户选择联想项
- **WHEN** 用户在联想栏中选中某项并按回车键
- **THEN** 将联想项文本填入搜索栏并执行原有搜索行为

## MODIFIED Requirements
### Requirement: 搜索行为恢复
- **修改**: 移除 router.push('search') 调用
- **恢复**: 使用原有的 performSearch 或 navigateToDetail 方法

## REMOVED Requirements
### Requirement: 搜索页路由
**Reason**: 需要移除独立搜索页功能
**Migration**: 删除 search.js 页面文件和相关配置

### Requirement: 搜索页排序筛选
**Reason**: 搜索页被移除，排序筛选功能不再需要
**Migration**: 移除相关 UI 组件和事件绑定

### Requirement: URL 参数驱动搜索页
**Reason**: 搜索页被移除，不再需要通过 URL 参数初始化搜索结果
**Migration**: 移除 URL 参数解析中的 search 相关逻辑
