# 首页卡片动画类冲突修复 - 任务列表

## 任务列表

- [x] Task 1: 修复 renderHome 中的动画类冲突
  - 移除 animate-card-in 类
  - 使用 --stagger-index 替代 --card-delay

- [x] Task 2: 修复 refreshCards 中的动画类冲突
  - 移除 animate-card-in 类
  - 确保使用统一的动画系统

- [x] Task 3: 验证动画效果
  - 验证首次加载动画
  - 验证刷新后进入动画
  - 验证动画流畅性

## 任务依赖
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
