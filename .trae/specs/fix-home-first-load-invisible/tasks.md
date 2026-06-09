# Tasks

- [x] Task 1: 修复 renderer.js 中 router.previous === router.current 时的动画冲突
  - [x] 在 `else if (animationClass && router.previous)` 分支中增加 `router.previous !== router.current` 条件
  - [x] 当条件不满足时，走 fallback 分支（injectSection + afterPageSwitch）
  - [x] 验证：首次加载首页内容正常显示

- [x] Task 2: 构建验证
  - [x] 运行 `npx vite build` 确认无构建错误
  - [x] 验证：页面切换动画不受影响

# Task Dependencies
- [Task 2] 依赖 [Task 1]
