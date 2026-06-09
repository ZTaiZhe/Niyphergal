# Checklist

## Task 1: router.js 滚动修复
- [x] `_scrollTo(y)` 辅助函数同时滚动 window 和 main-container
- [x] `_getScrollY()` 辅助函数优先读取 main-container.scrollTop
- [x] `push()` 使用 `_scrollTo(0)`
- [x] `pushSearch()` 使用 `_scrollTo(0)`
- [x] `popstate` 使用 `_scrollTo(event.state.scrollY)` 和 `_scrollTo(0)`
- [x] `_updateURL()` 中 scrollY 读取 `_getScrollY()`
- [x] `push()` 和 `pushSearch()` 保存滚动位置时读取 `_getScrollY()`

## Task 2: renderer.js Hero 飞行路径滚动
- [x] `isDetailTransition` 分支中 `mainContainer.scrollTop = 0`

## Task 3: 端到端验证
- [x] 构建成功（vite build 0 errors）
- [x] 部署成功（Cloudflare Pages）
