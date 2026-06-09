# 删除 SearchPage 计划

## 概述
删除项目中的搜索页面（search page），包括页面组件文件、路由配置、以及相关的导航逻辑。

## 涉及文件分析

### 需要删除的文件
1. **`src/js/pages/search.js`** - 搜索页面组件（126行）

### 需要修改的文件
1. **`src/js/modules/renderer.js`**
   - 移除 `renderSearch` 导入（第7行）
   - 移除 `pageOrder` 中的 `search: 3`（第17行）
   - 移除 `isSearchRefresh` 变量定义（第39行）
   - 移除 `switch` 中的 `case 'search'` 分支（第70-73行）
   - 移除 `bindSearchControls()` 相关调用（第98-99行, 第121-123行）
   - 移除 `bindSearchControls` 函数定义（第128-161行）

2. **`src/js/modules/router.js`**
   - 移除 search 相关的 URL 参数处理（第37-39行）

3. **`src/js/modules/search.js`**
   - 移除 `navigateToSearch` 方法（第657-667行）
   - 修改 `selectSuggestion` 方法，移除对 `navigateToSearch` 的调用（第622行）
   - 修改搜索按钮点击事件，移除对 `navigateToSearch` 的调用（第54-59行）
   - 修改 `handleKeydown` 中的 Enter 键处理逻辑（第574-576行）

## 执行步骤

### 步骤 1: 删除搜索页面文件
- 删除 `src/js/pages/search.js`

### 步骤 2: 修改 renderer.js
- 移除 `renderSearch` 导入
- 从 `pageOrder` 对象中移除 `search: 3`
- 移除 `isSearchRefresh` 变量
- 移除 `switch` 语句中的 `case 'search'` 分支
- 移除 `bindSearchControls()` 函数及其调用

### 步骤 3: 修改 router.js
- 移除 search 相关的 URL 参数处理代码

### 步骤 4: 修改 search.js 模块
- 移除或修改 `navigateToSearch` 方法
- 调整搜索联想的选择行为

## 风险评估
- **低风险**: 搜索页面是一个独立的功能模块，删除不会影响其他核心页面
- **注意事项**: 需要确保搜索联想功能仍然可以正常工作（直接跳转到详情页）

## 预期结果
- 搜索页面被完全移除
- 搜索联想功能改为直接跳转到详情页
- 路由系统不再处理 search 页面
