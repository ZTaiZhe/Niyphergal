# 全项目代码审查与修复 Spec

## Why
项目存在多处代码缺陷（语法错误、逻辑错误、重复定义、变量遮蔽等），导致功能异常和界面问题，需要系统性排查和修复。

## What Changes
- 修复 ThemeManager 与 Store 之间 localStorage key 不一致导致主题状态不同步
- 修复 authForm.js 中全角＠符号替换为`.`而非`@`的逻辑错误
- 消除 app.js 与 uiComponents.js 之间 DeviceDetector/ResponsiveHeader/MobileSearch/LogoMenu 的重复定义
- 修复 search.js 中 syncInputFromURL 读取 window.location.search 而非 hash 的错误
- 修复 router._updateURL 未序列化 id 参数导致详情页刷新丢失数据
- 修复 renderer.js 中 debounce 模式失效（每次调用创建新 debounced 函数）
- 修复 renderer.js 中 bindSearchControlsDelegated 全局 click 监听器累积泄漏
- 修复 ImageViewer.cleanupEvents 从错误元素移除 wheel 监听器
- 修复 search.js 中 gameCards 变量遮蔽
- 修复 renderer.js 中本地 ErrorHandler 类遮蔽导入的 ErrorHandler 模块
- 修复 search.js 中 navigateToSearch 双重 URL 编码问题
- 统一 SearchSuggestion.pageSize 使用 CONFIG 配置

## Impact
- Affected specs: 主题系统、认证流程、搜索系统、路由系统、渲染系统、图片查看器
- Affected code: app.js, uiComponents.js, globals.js, theme.js, store.js, authForm.js, search.js, router.js, renderer.js, components.js

## ADDED Requirements

### Requirement: Theme localStorage Key 一致性
系统 SHALL 使用统一的 localStorage key 存储和读取主题设置。ThemeManager.saveTheme 和 Store.loadPersistedState 必须使用相同的 key。

#### Scenario: 主题保存后刷新页面
- **WHEN** 用户切换主题并刷新页面
- **THEN** 页面应正确恢复用户选择的主题

### Requirement: 全角＠符号正确替换
系统 SHALL 将全角＠符号替换为半角@符号，而非替换为点号。

#### Scenario: 用户输入全角邮箱
- **WHEN** 用户在邮箱输入框中输入包含全角＠的邮箱地址
- **THEN** 全角＠应被替换为半角@，邮箱格式应保持正确

### Requirement: 消除重复模块定义
系统 SHALL 仅在 uiComponents.js 中定义 DeviceDetector、ResponsiveHeader、MobileSearch、LogoMenu，app.js 应从 uiComponents.js 导入使用，而非重复定义。

#### Scenario: MobileSearch 状态同步
- **WHEN** 通过任何途径调用 MobileSearch.open/close
- **THEN** 全局唯一的 MobileSearch 实例状态应保持一致

### Requirement: 搜索栏 URL 同步使用 hash
系统 SHALL 从 window.location.hash（而非 window.location.search）读取搜索参数，因为应用使用 hash 路由。

#### Scenario: 浏览器前进后退时搜索栏同步
- **WHEN** 用户通过浏览器前进后退导航
- **THEN** 搜索栏应正确显示当前搜索关键词

### Requirement: 详情页 ID 序列化到 URL
系统 SHALL 在 router._updateURL 中序列化 id 参数到 URL hash，确保详情页刷新后能恢复。

#### Scenario: 详情页刷新
- **WHEN** 用户在详情页刷新浏览器
- **THEN** 页面应正确显示同一游戏的详情

### Requirement: Renderer debounce 正确工作
系统 SHALL 在 render 函数外创建 debounced 版本，确保防抖功能正常工作。

#### Scenario: 快速连续导航
- **WHEN** 用户快速连续点击不同导航项
- **THEN** 只应执行最后一次导航的渲染

### Requirement: 搜索控件事件监听器不泄漏
系统 SHALL 在 bindSearchControlsDelegated 中避免重复添加全局 click 监听器。

#### Scenario: 多次搜索刷新
- **WHEN** 用户多次执行搜索操作
- **THEN** 不应累积多余的 click 事件监听器

### Requirement: ImageViewer 事件正确清理
系统 SHALL 在 ImageViewer.cleanupEvents 中从正确的元素移除 wheel 事件监听器。

#### Scenario: 图片查看器关闭后无残留监听器
- **WHEN** 用户关闭图片查看器
- **THEN** 所有事件监听器应被正确移除

### Requirement: 搜索 URL 不双重编码
系统 SHALL 在 navigateToSearch 中不重复 encodeURIComponent，因为 router._updateURL 已经处理 URL 参数。

#### Scenario: 搜索中文关键词
- **WHEN** 用户搜索包含中文的关键词
- **THEN** URL 中的搜索参数不应被双重编码

## MODIFIED Requirements

### Requirement: SearchSuggestion 分页大小使用配置
SearchSuggestion.pageSize 应使用 CONFIG.SEARCH.SUGGESTIONS_PER_PAGE 而非硬编码值 10。

### Requirement: renderer.js 命名不遮蔽
renderer.js 中的本地 ErrorHandler 类应重命名为 RenderErrorHandler，避免遮蔽从 errorHandler.js 导入的同名模块。

## REMOVED Requirements
无
