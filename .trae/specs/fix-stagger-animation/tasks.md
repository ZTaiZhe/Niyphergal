# 搜索结果交错动效修复 - 任务列表

## 任务列表

- [x] Task 1: 修复 CSS 冲突
  - 在 `.is-leaving` 和 `.is-entering` 中添加 `!important` 确保优先级
  - 添加 `animation: none !important` 禁用原有动画

- [x] Task 2: 修复 JS 逻辑
  - 在执行离开动画前，移除卡片上的 `animate-card-in` 类
  - 确保过渡样式能正确应用

- [x] Task 3: 验证动效效果
  - 验证卡片离开时一项接一项离开
  - 验证卡片载入时一项接一项载入

- [x] Task 4: 修改动效方向为向上
  - 修改 `.is-leaving` 的 transform 为向上移动（translateY 负值）
  - 修改 `.is-entering` 的初始位置为向下，最终位置为原位

- [x] Task 5: 增强时序效果
  - 增加交错延迟时间（从 30ms 增加到 50ms）
  - 使动效更加明显和流畅

## 任务依赖
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 5] depends on [Task 4]
