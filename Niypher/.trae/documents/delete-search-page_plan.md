# 删除搜索页和相关逻辑代码 - 实施计划

## [x] Task 1: 修改搜索联想模块，避免跳转到搜索页
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 修改 `src/js/modules/search.js` 中的 `performSearch` 方法
  - 移除跳转到 search 页面的逻辑
  - 对于非游戏类型的搜索，直接显示提示或不处理
- **Success Criteria**:
  - 点击搜索联想后，游戏类型正确跳转到详情页
  - 其他类型不跳转到搜索页
- **Test Requirements**:
  - `programmatic` TR-1.1: 验证 `performSearch` 方法不再调用 `router.push('search')`
  - `human-judgement` TR-1.2: 测试 header 搜索栏点击游戏建议跳转到详情页正常

## [x] Task 2: 修改移动端搜索逻辑
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 修改 `src/js/app.js` 中的移动端搜索逻辑
  - 移除跳转到 search 页面的逻辑
- **Success Criteria**:
  - 移动端搜索栏点击游戏建议跳转到详情页正常
  - 不跳转到搜索页
- **Test Requirements**:
  - `programmatic` TR-2.1: 验证移动端搜索不再调用 `SearchSuggestion.performSearch` 跳转到搜索页
  - `human-judgement` TR-2.2: 测试移动端搜索功能

## [x] Task 3: 修改渲染器，移除搜索页渲染逻辑
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 修改 `src/js/modules/renderer.js`
  - 移除 `renderSearch` 和 `SearchPage` 的导入
  - 移除 `pageOrder` 中的 search
  - 移除 switch 语句中的 search case
  - 移除搜索页初始化逻辑
- **Success Criteria**:
  - 渲染器不再引用搜索页相关代码
- **Test Requirements**:
  - `programmatic` TR-3.1: 验证 renderer.js 中不再有 search 相关导入和逻辑
  - `human-judgement` TR-3.2: 验证其他页面渲染正常

## [x] Task 4: 删除搜索页文件
- **Priority**: P0
- **Depends On**: Task 3
- **Description**: 
  - 删除 `src/js/pages/search.js` 文件
- **Success Criteria**:
  - 搜索页文件已删除
- **Test Requirements**:
  - `programmatic` TR-4.1: 验证 src/js/pages/search.js 不存在

## [x] Task 5: 清理 CSS 中的搜索页样式
- **Priority**: P1
- **Depends On**: Task 1, Task 3
- **Description**: 
  - 检查 `src/css/styles.css` 中的搜索页相关样式
  - 保留样式以便未来恢复
- **Success Criteria**:
  - Header 搜索栏样式保留
- **Test Requirements**:
  - `programmatic` TR-5.1: 验证 header 搜索栏相关样式保留
  - `human-judgement` TR-5.2: 检查 header 搜索栏视觉效果正常

## [x] Task 6: 完整测试验证
- **Priority**: P1
- **Depends On**: Task 1, Task 2, Task 3, Task 4, Task 5
- **Description**: 
  - 全面测试所有功能
  - 验证 header 搜索栏正常工作
  - 验证其他页面正常工作
- **Success Criteria**:
  - 所有功能正常工作
  - 没有错误
- **Test Requirements**:
  - `human-judgement` TR-6.1: 完整测试应用所有功能
