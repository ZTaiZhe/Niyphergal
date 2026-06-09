# Tasks

- [x] Task 1: animationHelpers.js — 回退 initHomeAnimations 相关变更
  - [x] SubTask 1.1: 删除 `import { initHomeAnimations } from '../pages/home.js';`
  - [x] SubTask 1.2: 删除 cleanup 中的 `initHomeAnimations();` 调用
  - [x] SubTask 1.3: 删除 `isHeroExitInFlight()` 导出函数

- [x] Task 2: renderer.js — 回退 isHeroExitInFlight 抑制
  - [x] SubTask 2.1: import 改回 `{ clearHeroExitContext }`
  - [x] SubTask 2.2: 动画分支 `!isHeroExitInFlight()` 条件移除
  - [x] SubTask 2.3: else 分支 `!isHeroExitInFlight()` 条件移除

# Task Dependencies
- 无依赖，两任务可并行
