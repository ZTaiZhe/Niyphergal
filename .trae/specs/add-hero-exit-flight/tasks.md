# Tasks

- [x] Task 1: animationHelpers.js — 存储退出上下文 + 新增 performHeroExit
  - [x] SubTask 1.1: 新增 `var _heroExitInFlight = false; var _heroExitContext = null;`
  - [x] SubTask 1.2: 在 `performHeroNavigate` 中 `router.push` 之前存储 `_heroExitContext = { gameId: targetId, sourcePage: routerInstance.current }`
  - [x] SubTask 1.3: 导出 `getHeroExitContext()` 和 `clearHeroExitContext()` 
  - [x] SubTask 1.4: 新增 `performHeroExit()` 函数，含陷阱1-8全部防护

- [x] Task 2: renderer.js — 派发 page:rendered + 清除 hero 上下文
  - [x] SubTask 2.1: injectSection 中 `display='block'` 后派发 `page:rendered` CustomEvent
  - [x] SubTask 2.2: render 中离开 detail 时调用 `clearHeroExitContext()`

- [x] Task 3: eventDelegation.js + detail.js — 返回按钮联动
  - [x] SubTask 3.1: eventDelegation.js 导入 performHeroExit, getHeroExitContext
  - [x] SubTask 3.2: 新增 navigate-hero-back action
  - [x] SubTask 3.3: detail.js 返回按钮根据上下文动态选择 action

# Task Dependencies
- Task 1 是核心
- Task 2 依赖 Task 1（需要知道 page:rendered 的用法）
- Task 3 依赖 Task 1（需要 import performHeroExit）
