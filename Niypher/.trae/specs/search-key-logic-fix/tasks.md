# Tasks

- [x] Task 1: 恢复 performSearch 原有搜索逻辑
  - 修改 `performSearch` 方法，恢复原始搜索行为（搜索并跳转到第一个结果的详情页）
  - 移除 `performSearch` 中的 `router.push('search')` 调用
  - 恢复原有的 `SearchIndex.search(text)` 和 `navigateToDetail` 逻辑

- [x] Task 2: 新增 navigateToSearch 方法
  - 创建 `navigateToSearch` 方法，专门用于跳转到搜索页
  - 该方法接收搜索词参数，执行 `router.push('search', { q: text })`
  - 该方法调用 `input.blur()` 收起键盘

- [x] Task 3: 修改搜索按钮点击事件
  - 修改 `init` 方法中搜索按钮的点击事件监听器
  - 从调用 `performSearch` 改为调用 `navigateToSearch`

- [x] Task 4: 修改 Enter 键处理逻辑
  - 修改 `handleKeydown` 方法中的 Enter 键处理
  - 未选中联想项时，调用 `navigateToSearch` 而非 `performSearch`
  - 选中联想项时，保持调用 `selectSuggestion`（内部调用 `performSearch`）

# Task Dependencies
- Task 2 依赖 Task 1（需要先恢复 performSearch）
- Task 3 依赖 Task 2（需要 navigateToSearch 方法）
- Task 4 依赖 Task 2（需要 navigateToSearch 方法）
