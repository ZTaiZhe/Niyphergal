# Tasks

- [x] Task 1: 重写 revealHomeCardsImmediately() — 支持排除飞行卡片 + 绕过 CSS transition
  - [x] SubTask 1.1: 修改函数签名为 `revealHomeCardsImmediately(excludeGameId)`，当 excludeGameId 匹配卡片 data-id 时，仅移除 is-hidden 并设 style.opacity='0'
  - [x] SubTask 1.2: 对非排除卡片，先设 `style.transition='none'`，再 remove is-hidden + add is-loaded，强制 reflow 后恢复 transition
  - [x] SubTask 1.3: 新增 `revealFlownCard(gameId)` 函数，移除卡片的 style.opacity 并添加 is-loaded 类

- [x] Task 2: performHeroExit cleanup 派发 hero:exit-complete 事件
  - [x] SubTask 2.1: 在 cleanup() 中，移除克隆后、清空 _heroExitInFlight 前，保存 gameId
  - [x] SubTask 2.2: 派发 `new CustomEvent('hero:exit-complete', { detail: { gameId } })`

- [x] Task 3: renderer.js render() 增加 hero exit 顶部拦截路径
  - [x] SubTask 3.1: 在 `if (router.previous === 'detail') { clearHeroExitContext(); }` 之后、`const prevIndex` 之前，增加 hero exit 拦截块
  - [x] SubTask 3.2: 拦截块逻辑：若 `isHeroExitInFlight() && router.current === 'home'`，执行：`injectSection('home', contentWithoutAnimation)` → `revealHomeCardsImmediately(_heroExitContext.gameId)` → 注册 `hero:exit-complete` 一次性监听器调用 `revealFlownCard` → return
  - [x] SubTask 3.3: 注意：clearHeroExitContext() 在 L1038 会清除上下文，需将 gameId 提前保存或在拦截块中从 getHeroExitContext() 获取（需调整 clearHeroExitContext 调用位置到拦截块之后）

- [x] Task 4: 移除各分支中的 isHeroExitInFlight() 补丁
  - [x] SubTask 4.1: 移除 L1192 动画分支条件中的 `!isHeroExitInFlight()` 检查
  - [x] SubTask 4.2: 移除 L1244-1250 inner else 中的 isHeroExitInFlight 判断，恢复为统一的 `setTimeout(initHomeAnimations, 50)`
  - [x] SubTask 4.3: 移除 L1339-1346 最终 else 中的 isHeroExitInFlight 判断，恢复为统一的 `setTimeout(initHomeAnimations, 50)`

- [x] Task 5: 调整 clearHeroExitContext 调用时机
  - [x] SubTask 5.1: 将 L1038-1040 的 `if (router.previous === 'detail') { clearHeroExitContext(); }` 移到 hero exit 拦截块之后（非 hero exit 时才清除），或在拦截块中手动清除

# Task Dependencies
- [Task 3] depends on [Task 1] and [Task 2]
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 3]
