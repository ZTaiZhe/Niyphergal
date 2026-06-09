# 修复推荐页卡片悬停恢复延迟 - 任务列表

## 任务列表

- [ ] Task 1: 修改 CSS 中卡片的 transition-delay
  - 在 `.game-cards-container .glass-card` 中添加 `transition-delay: calc(var(--stagger-index) * 50ms)` 仅用于加载动画
  - 确保悬停恢复时 transition-delay 为 0

- [x] Task 2: 验证效果
  - 验证推荐页卡片悬停恢复无延迟
  - 验证搜索页卡片悬停效果正常
  - 验证卡片加载动画正常

## 任务依赖
- [Task 2] depends on [Task 1]
