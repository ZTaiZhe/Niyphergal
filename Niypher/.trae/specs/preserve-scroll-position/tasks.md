# Tasks

- [x] Task 1: 修改 router.push() 恢复目标页面的滚动位置
  - [x] 1.1 将 `router.push()` 中 L46 的 `_scrollTo(0)` 改为：读取 `scrollPositions[page]`，有值则 `_scrollTo(scrollPositions[page])`，否则 `_scrollTo(0)`
  - [x] 1.2 恢复滚动位置后，从 scrollPositions 中删除该条目（避免后续导航误恢复旧位置）

- [x] Task 2: Hero exit 拦截路径恢复滚动位置
  - [x] 2.1 在 renderer.js 的 hero exit 拦截块中，`injectSection` 和 `revealHomeCardsImmediately` 之后，从 `router.scrollPositions` 读取首页的滚动位置并恢复

- [x] Task 3: 构建并部署

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1] and [Task 2]
