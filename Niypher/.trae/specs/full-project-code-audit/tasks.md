# Tasks

- [x] Task 1: 修复 ThemeManager 与 Store 的 localStorage key 不一致
  - [x] SubTask 1.1: 将 theme.js 中 saveTheme/loadTheme 的 localStorage key 从 `'theme'` 改为 `'niypher_theme'`
  - [x] SubTask 1.2: 确保 Store.loadPersistedState 和 ThemeManager 使用同一 key

- [x] Task 2: 修复 authForm.js 全角＠替换逻辑错误
  - [x] SubTask 2.1: 将 `email.replace(/＠/g, '.')` 改为 `email.replace(/＠/g, '@')`

- [x] Task 3: 消除 app.js 与 uiComponents.js 的重复模块定义
  - [x] SubTask 3.1: 从 app.js 中删除本地定义的 DeviceDetector、ResponsiveHeader、MobileSearch、LogoMenu
  - [x] SubTask 3.2: 在 app.js 中从 uiComponents.js 导入这些模块
  - [x] SubTask 3.3: 确保 globals.js 已正确从 uiComponents.js 导入

- [x] Task 4: 修复 search.js syncInputFromURL 读取错误 URL 部分
  - [x] SubTask 4.1: 将 `new URLSearchParams(window.location.search)` 改为从 `window.location.hash` 解析参数
  - [x] SubTask 4.2: 实现从 hash 中提取查询参数的逻辑

- [x] Task 5: 修复 router._updateURL 未序列化 id 参数
  - [x] SubTask 5.1: 在 router._updateURL 中添加 `if (state.params.id) searchParams.set('id', state.params.id);`
  - [x] SubTask 5.2: 在 parseInitialRoute 中添加 id 参数解析

- [x] Task 6: 修复 renderer.js debounce 模式失效
  - [x] SubTask 6.1: 将 debouncedRender 创建移到 render 函数外部作为模块级变量
  - [x] SubTask 6.2: 确保 render 函数调用外部的 debouncedRender

- [x] Task 7: 修复 renderer.js bindSearchControlsDelegated 全局 click 监听器泄漏
  - [x] SubTask 7.1: 将 filter-group-collapsible 的全局 click 监听器提取为模块级变量
  - [x] SubTask 7.2: 在添加新监听器前先移除旧的

- [x] Task 8: 修复 ImageViewer.cleanupEvents 从错误元素移除 wheel 监听器
  - [x] SubTask 8.1: 保存 container 引用到 ImageViewer 实例
  - [x] SubTask 8.2: 在 cleanupEvents 中从 container（而非 document）移除 wheel 监听器

- [x] Task 9: 修复 search.js 变量遮蔽和双重编码
  - [x] SubTask 9.1: 删除 renderSearch 中外层无用的 `let gameCards = ''` 声明
  - [x] SubTask 9.2: 修复 navigateToSearch 中移除多余的 encodeURIComponent
  - [x] SubTask 9.3: 修复 app.js 中 mobile search keydown handler 同样的双重编码

- [x] Task 10: 修复 renderer.js ErrorHandler 命名遮蔽
  - [x] SubTask 10.1: 将 renderer.js 中本地 ErrorHandler 类重命名为 RenderErrorHandler
  - [x] SubTask 10.2: 更新所有引用

- [x] Task 11: 统一 SearchSuggestion.pageSize 使用 CONFIG
  - [x] SubTask 11.1: 将 `pageSize: 10` 改为 `pageSize: CONFIG.SEARCH.SUGGESTIONS_PER_PAGE`

# Task Dependencies
- [Task 3] depends on [Task 1] (app.js 重构需要先确保主题系统正确)
- [Task 6] depends on nothing (独立修复)
- [Task 9] depends on nothing (独立修复)
