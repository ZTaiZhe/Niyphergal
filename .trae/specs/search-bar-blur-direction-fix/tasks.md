# 搜索栏与表单横线失焦动画方向修正 - 任务列表

## 任务列表

- [x] Task 1: 修改搜索栏失焦动画方向
  - 将 `.search-input-wrapper::after` 的 `transform-origin` 从 `left` 改为 `right`
  - 在 `.search-input-wrapper:focus-within::after` 中添加 `transform-origin: left` 保持展开方向

- [x] Task 2: 修改表单输入框失焦动画方向
  - 将 `.form-input-wrapper::after` 的 `transform-origin` 从 `left` 改为 `right`
  - 在 `.form-input-wrapper:focus-within::after` 中添加 `transform-origin: left` 保持展开方向

- [x] Task 3: 验证效果
  - 验证搜索栏 Focus/失焦动画
  - 验证表单输入框 Focus/失焦动画

## 任务依赖
- [Task 3] depends on [Task 2]
