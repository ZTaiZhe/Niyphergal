# Tasks

- [ ] Task 1: 修改 CSS — 进入 section 不再设 position: absolute
  - [ ] 将 `section[data-page].animate-slide-in-right/left, animate-fade-in` 从 absolute 规则中移除
  - [ ] 仅保留退出 section（`animate-slide-out-left/right`, `animate-fade-out`）的 `position: absolute; z-index: 5`
  - [ ] 进入 section 仅设 `z-index: 1`，保持在正常文档流
  - [ ] 验证：进入 section 在动画期间不脱离文档流

- [ ] Task 2: 修改 JS 主动画分支 — 修复动画时序和容器状态
  - [ ] 动画开始前：保存容器原始 overflow，临时设为 `overflow: hidden`；确保容器有 `position: relative`
  - [ ] 设置新 section 内容和 display:block
  - [ ] 强制 reflow（`void newSection.offsetHeight`）
  - [ ] 添加退出动画 class 到旧 section
  - [ ] 强制 reflow（`void oldSection.offsetHeight`）
  - [ ] 添加进入动画 class 到新 section
  - [ ] 动画结束后：恢复容器原始 overflow，移除 `position: relative`（如果是临时添加的），清理动画 class
  - [ ] 验证：push 时旧页面左滑出、新页面右滑入；pop 时旧页面右滑出、新页面左滑入

- [ ] Task 3: 构建验证
  - [ ] 运行 `npx vite build` 确认无构建错误
  - [ ] 验证：所有页面切换动画方向正确，容器不塌陷

# Task Dependencies
- [Task 2] 依赖 [Task 1]
- [Task 3] 依赖 [Task 1, Task 2]
