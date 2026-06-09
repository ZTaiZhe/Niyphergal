# Tasks

- [x] Task 1: 修复 `router.js` — 所有导航路径同时滚动 main-container
  - [x] 1.1 提取辅助函数 `_scrollTo(y)` 和 `_getScrollY()` 统一处理 window 和 main-container 滚动
  - [x] 1.2 `push()` 中 `window.scrollTo(0, 0)` 改为 `_scrollTo(0)`
  - [x] 1.3 `pushSearch()` 中 `window.scrollTo(0, 0)` 改为 `_scrollTo(0)`
  - [x] 1.4 `popstate` 中 `window.scrollTo()` 改为 `_scrollTo()`
  - [x] 1.5 `_updateURL()` 中 `scrollY: window.scrollY` 改为 `_getScrollY()`
  - [x] 1.6 `push()` 和 `pushSearch()` 中保存滚动位置时读取 `_getScrollY()`
  - **验证**: ✅ 首页滚动后进入详情页，详情页从顶部开始

- [x] Task 2: 修复 `renderer.js` — Hero 飞行过渡路径滚动重置
  - [x] 2.1 `isDetailTransition` 分支中添加 `mainContainer.scrollTop = 0`
  - **验证**: ✅ Hero 飞行过渡后详情页从顶部开始

- [x] Task 3: 构建并部署验证
  - **验证**: ✅ https://47f03835.niyphergal.pages.dev

# Task Dependencies
- Task 2 独立于 Task 1
- Task 3 依赖 Task 1 + Task 2
