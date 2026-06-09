# Tasks

- [x] Task 1: injectSection 新增 transient 容器清理逻辑
  - [x] SubTask 1.1: 在 `injectSection` 函数开头，添加代码移除 `#main-container` 中的所有 `.page-transition-container` 和 `.search-page-transition-container` 元素
  - [x] SubTask 1.2: 验证动画分支和搜索过渡分支中的 `clearTransientContent()` 调用仍保留作为双重保障

- [x] Task 2: 恢复 prefers-reduced-motion 跳过动画的完整逻辑
  - [x] SubTask 2.1: 在动画分支恢复 `if (newPageEl && !prefersReducedMotion)` 条件判断，完全跳过动画
  - [x] SubTask 2.2: 移除 `animationDuration` 变量，恢复直接传入 `500` 作为 fallback

- [x] Task 3: 修复首次加载不必要进入动画分支
  - [x] SubTask 3.1: 在动画分支条件新增 `router.previous` 非空判断，首次加载时跳过动画直接进入 else 分支

- [x] Task 4: 清理残留调试代码
  - [x] SubTask 4.1: 移除 `console.log('[Animation]...', ...)` 
  - [x] SubTask 4.2: 移除 `console.error('[Animation]...')`

# Task Dependencies
- Task 1 是核心修复，最高优先级
- Task 2、3、4 互相独立，可与 Task 1 并行修复（均在 renderer.js 同一文件中）
