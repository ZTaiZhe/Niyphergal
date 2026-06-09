# 搜索栏文本颜色与清除按钮优化 - 任务列表

## 任务列表

- [x] Task 1: 添加深色模式搜索栏文本颜色
  - 为 `body.dark #header-search` 添加暗灰色文本颜色
  - 为 `body.dark #header-search::placeholder` 添加更暗的颜色

- [x] Task 2: 优化清除按钮样式
  - 为 `#header-search::-webkit-search-cancel-button` 添加自定义样式
  - 设置合适的位置、尺寸和透明度
  - 添加 hover 状态

- [x] Task 3: 添加深色模式清除按钮样式
  - 为 `body.dark #header-search::-webkit-search-cancel-button` 添加适配样式

- [x] Task 4: 验证效果
  - 验证深色模式文本颜色
  - 验证日间模式清除按钮
  - 验证深色模式清除按钮

## 任务依赖
- [Task 4] depends on [Task 1, Task 2, Task 3]
