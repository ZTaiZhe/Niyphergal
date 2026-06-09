# Checklist

## Task 1: animationHelpers.js 修复
- [x] `clone.animate()` 使用 `fill: 'none'`（非 `fill: 'forwards'`）
- [x] `animFinish` 中先设置 clone 终态 inline style，再调 revealDetailContent()，再移除 clone
- [x] 所有退出路径含 `setHeroTransition(false)`
- [x] `fromBorderRadius` 查找含 `.recommendation-card` 回退
- [x] import 中包含 `setHeroTransition`

## Task 2: detail.js 修复
- [x] `revealDetailContent()` 中 L0 添加 is-visible 前设 `style.transition = 'none'`
- [x] L0 强制 reflow 后移除 `style.transition`
- [x] `revealDetailContent()` 入口重置 `_descToggleBound = false`
- [x] `initDetailAnimations()` 入口重置 `_descToggleBound = false`

## Task 3: 端到端验证
- [x] 构建成功（vite build 0 errors）
- [x] 部署成功（Cloudflare Pages）
