# Tasks

- [x] Task 1: performHeroNavigate 存储源卡片坐标到退出上下文
  - [x] SubTask 1.1: `_heroExitContext` 扩展为 `{ gameId, sourcePage, sourceRect, sourceBorderRadius }`

- [x] Task 2: performHeroExit 使用预存坐标直接启动动画
  - [x] SubTask 2.1: 创建 frame 时添加 `frame.style.setProperty('border-radius', fromBorderRadius)`
  - [x] SubTask 2.2: `toRect` 和 `toBorderRadius` 从 `_heroExitContext` 获取
  - [x] SubTask 2.3: 飞行逻辑在 `routerInstance.push` 后同步执行，无需等待事件
  - [x] SubTask 2.4: 删除 `page:rendered` 监听器
  - [x] SubTask 2.5: 删除 `requestAnimationFrame`×2 + `querySelector` 查找
  - [x] SubTask 2.6: 所有 keyframes borderRadius 使用变量而非硬编码
  - [x] SubTask 2.7: cleanup 中保留 `_heroExitContext = null` × `_heroExitInFlight = false` × `setHeroTransition(false)`

# Task Dependencies
- Task 2 依赖 Task 1（需要 sourceRect 和 sourceBorderRadius）
