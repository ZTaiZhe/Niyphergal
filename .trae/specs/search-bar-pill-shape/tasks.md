# 搜索栏药丸型样式与深色模式横线颜色修正 - 任务列表

## 任务列表

- [x] Task 1: 修改搜索栏圆角样式
  - 将 `#desktop-search-bar` 的 `border-radius` 改为 `9999px`
  - 将 `#header-search` 的 `border-radius` 改为 `9999px`
  - 将 `#header-search-btn` 的 `border-radius` 改为 `9999px`
  - 确保 Focus 状态背景圆角正确

- [x] Task 2: 修正深色模式横线颜色
  - 将 `body.dark .search-input-wrapper::after` 的背景色从 `#E19CBB` 改为暗粉色 `#C9184A`
  - 将 `body.dark .form-input-wrapper::after` 的背景色从 `#E19CBB` 改为暗粉色 `#C9184A`

- [x] Task 3: 验证效果
  - 验证搜索栏药丸型样式
  - 验证与 docker 栏风格一致性
  - 验证深色模式横线颜色

## 任务依赖
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1, Task 2]
