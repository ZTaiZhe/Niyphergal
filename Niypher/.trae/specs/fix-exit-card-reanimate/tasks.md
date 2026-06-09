# Tasks

- [x] Task 1: animationHelpers.js — 导入 initHomeAnimations + 在 cleanup 中调用 + 导出 isHeroExitInFlight
  - [x] SubTask 1.1: 添加 `import { initHomeAnimations } from '../pages/home.js';`
  - [x] SubTask 1.2: cleanup 中 `_heroExitContext = null;` 之后添加 `initHomeAnimations();`
  - [x] SubTask 1.3: 导出 `isHeroExitInFlight()` 

- [x] Task 2: renderer.js — 检查 isHeroExitInFlight 跳过早期 initHomeAnimations
  - [x] SubTask 2.1: import 扩展为 `{ clearHeroExitContext, isHeroExitInFlight }`
  - [x] SubTask 2.2: 动画分支 home initHomeAnimations 加 `!isHeroExitInFlight()` 条件
  - [x] SubTask 2.3: else 分支 home initHomeAnimations 加 `!isHeroExitInFlight()` 条件

# Task Dependencies
- Task 2 依赖 Task 1（需要 isHeroExitInFlight 导出）
