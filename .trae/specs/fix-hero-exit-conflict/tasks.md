# Tasks

- [x] Task 1: 重构 hero exit 路径，不再直接 return 跳过页面过渡
  - [x] 将 hero exit 检查从 `return` 模式改为设置变量模式：设置 `_isHeroExit` 和 `_heroExitGameId`
  - [x] 移除 hero exit 路径中的 `injectSection`、`revealHomeCardsImmediately`、`observeExistingMedia`、`initCarousel` 调用（这些将在页面过渡动画分支中处理）
  - [x] 验证：hero exit 场景下代码继续走到页面过渡动画分支

- [x] Task 2: 在页面过渡动画分支中处理 hero exit 特殊逻辑
  - [x] 在页面过渡动画完成后的回调中，检测 `_isHeroExit` 标志
  - [x] 如果是 hero exit：调用 `revealHomeCardsImmediately(_heroExitGameId)` 替代 `initHomeAnimations()`
  - [x] 如果是 hero exit：监听 `hero:exit-complete` 事件触发 `revealFlownCard`
  - [x] 如果是 hero exit：调用 `initCarousel()` 和恢复滚动位置
  - [x] 如果不是 hero exit：保持原有 `initHomeAnimations()` 逻辑
  - [x] 同时处理了 reduced motion 分支

- [x] Task 3: 处理 hero exit 场景下的非动画分支（无 animationClass 的情况）
  - [x] 当 hero exit 但没有 animationClass 时，直接 `injectSection` + `revealHomeCardsImmediately` + 监听 `hero:exit-complete`
  - [x] 验证：非动画分支中 hero exit 逻辑正确

# Task Dependencies
- Task 1 是基础，Task 2 和 Task 3 依赖 Task 1
- Task 2 和 Task 3 可并行
