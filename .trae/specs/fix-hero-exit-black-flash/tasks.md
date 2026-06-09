# Tasks

- [x] Task 1: 克隆图片加载等待
  - [x] 1.1 在 `performHeroExit` 中，`document.body.appendChild(frame)` 之后、帧动画启动之前，检查 `contentImg.complete`，未加载完成时通过 `onload` 等待
  - [x] 1.2 添加超时回退（300ms），防止 `onload` 永不触发导致动画卡死
- [x] Task 2: 后备背景色
  - [x] 2.1 为 `.hero-clone-content` 添加 `background: var(--bg-secondary)`

# Task Dependencies
- 两任务可并行
