# Tasks

- [x] Task 1: renderer.js 最终 else 分支（L1339-L1343）增加 isHeroExitInFlight 判断
  - [x] SubTask 1.1: 将 `setTimeout(initHomeAnimations, 50)` 改为 `isHeroExitInFlight() ? revealHomeCardsImmediately() : setTimeout(initHomeAnimations, 50)`
