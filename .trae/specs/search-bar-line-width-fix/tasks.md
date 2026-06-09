# 搜索栏动画横线宽度修正 - 任务列表

## 任务列表

- [x] Task 1: 修正横线宽度和位置
  - 将 `.search-input-wrapper::after` 的 `left` 改为 `16px`
  - 将 `.search-input-wrapper::after` 的 `width` 改为 `calc(100% - 32px)`

- [x] Task 2: 验证效果
  - 验证横线从左圆角结束处开始
  - 验证横线到右圆角开始处结束
  - 验证动画效果正常

## 任务依赖
- [Task 2] depends on [Task 1]
