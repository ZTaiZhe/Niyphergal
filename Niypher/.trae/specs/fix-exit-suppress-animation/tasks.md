# Tasks

- [x] Task 1: animationHelpers.js — 重新导出 isHeroExitInFlight
  - [x] SubTask 1.1: 添加 `export function isHeroExitInFlight() { return _heroExitInFlight; }`

- [x] Task 2: home.js — 新增 revealHomeCardsImmediately 函数
  - [x] SubTask 2.1: 新增 `revealHomeCardsImmediately()` — 不加 `is-hidden`，直接 `is-loaded`

- [x] Task 3: renderer.js — 动画抑制 + 使用 revealHomeCardsImmediately
  - [x] SubTask 3.1: import 添加 `isHeroExitInFlight` 和 `revealHomeCardsImmediately`
  - [x] SubTask 3.2: 动画条件增加 `!isHeroExitInFlight()`
  - [x] SubTask 3.3: else 分支 home 根据飞行状态选择卡片初始化方式

# Task Dependencies
- Task 3 依赖 Task 1 和 Task 2
- Task 1、2 可并行执行
