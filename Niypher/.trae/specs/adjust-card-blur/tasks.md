# 调整卡片渐变遮罩高度和颜色 - 任务列表

## 任务列表

- [x] Task 1: 添加日夜模式 CSS 变量
  - 在 `:root` 中定义 `--card-glass-tint` 和 `--card-glass-tint-fade`
  - 在 `body.dark` 中定义深色模式的颜色变量

- [x] Task 2: 调整卡片渐变遮罩高度
  - 修改 `.card-tag-section::before` 的样式
  - 添加 `height: 90px` 强制高度为三分之一
  - 使用 `background` 引入日夜模式颜色
  - 使用 `mask-image` 控制透明度

- [x] Task 3: 调整标签文字颜色适配
  - 确保 renderGameCard 中标签文字颜色适配日夜模式

- [x] Task 4: 验证视觉效果
  - 检查遮罩高度是否为三分之一
  - 检查浅色模式效果
  - 检查深色模式效果
  - 确认无缝缝合

## 任务依赖
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 2, Task 3]
