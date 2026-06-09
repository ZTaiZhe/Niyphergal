# 页面切换卡顿优化 - 任务列表

## 任务列表

- [x] Task 1: 优化 render() 函数中的 debounce 和 setTimeout 叠加问题
  - 移除 debounce 外层的 setTimeout（第 1200 行）
  - 只保留 debounce，减少 50ms 延迟

- [ ] Task 2: 避免 switch 分支中重复调用 render 函数
  - 在 case 'home' 分支中，renderHome 被调用两次（第 985-986 行）
  - 修改为只调用一次并缓存结果

- [x] Task 3: 减少动画初始化延迟
  - 将 initHomeAnimations 的延迟从 100ms 减少到 50ms
  - 涉及 renderer.js 中的多处调用

- [x] Task 4: 验证优化效果
  - 验证页面切换流畅度
  - 验证动画效果正常

## 任务依赖
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]
