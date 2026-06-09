# 首页刷新动画统一修复 - 任务列表

## 任务列表

- [x] Task 1: 修复 refreshCards 函数中的进入动画
  - 使用 DocumentFragment 预先设置卡片状态
  - 确保卡片在插入 DOM 前已有 is-hidden 类
  - 使用双帧 requestAnimationFrame 触发动画

- [x] Task 2: 验证动画效果
  - 验证首次加载动画
  - 验证刷新后进入动画
  - 验证动画流畅性

## 任务依赖
- [Task 2] depends on [Task 1]
