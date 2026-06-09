# Tasks

- [x] Task 1: 修复 `animationHelpers.js` — 移除 fill:forwards + 重置 _heroTransition + 推荐卡片 borderRadius
  - [x] 1.1 `clone.animate()` 移除 `fill: 'forwards'`，改为 `fill: 'none'`
  - [x] 1.2 `animFinish` 中先手动设置 clone 终态 inline style（left/top/width/height/borderRadius = toRect 值），再调 `revealDetailContent()`，再移除 clone
  - [x] 1.3 所有退出路径添加 `setHeroTransition(false)` 调用（已 import）
  - [x] 1.4 `fromBorderRadius` 查找增加 `.recommendation-card` 回退
  - **验证**: ✅ animationHelpers.js 中无 `fill: 'forwards'`，所有退出路径含 `setHeroTransition(false)`

- [x] Task 2: 修复 `detail.js` — L0 跳过 transition + _descToggleBound 重置
  - [x] 2.1 `revealDetailContent()` 中 L0 添加 `is-visible` 前设 `style.transition = 'none'`，添加后强制 reflow，再移除 `style.transition`
  - [x] 2.2 `revealDetailContent()` 入口重置 `_descToggleBound = false`
  - [x] 2.3 `initDetailAnimations()` 入口也重置 `_descToggleBound = false`
  - **验证**: ✅ L0 在 Hero 飞行后无 0.4s transition 延迟

- [x] Task 3: 构建并部署验证
  - **验证**: ✅ https://a0b54c69.niyphergal.pages.dev

# Task Dependencies
- Task 2 依赖 Task 1
- Task 3 依赖 Task 1 + Task 2
