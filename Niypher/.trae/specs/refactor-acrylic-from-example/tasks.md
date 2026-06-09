# 亚克力/毛玻璃视觉质感升级 - 任务列表

## 任务列表

- [x] Task 1: 重构 CSS 变量定义
  - 更新 `:root` 中的亮色模式变量（渐变背景、白色半透明边框、增强阴影）
  - 更新 `body.dark` 中的深色模式变量
  - 修改 `--acrylic-blur` 为 12px

- [x] Task 2: 重构 `.acrylic-panel` 核心样式
  - 应用新的 CSS 变量
  - 添加 `-webkit-backdrop-filter` Safari 兼容性
  - 添加 `will-change` 和 `transform: translateZ(0)` 性能优化
  - 更新 hover 状态样式

- [x] Task 3: 同步更新 `.glass-card` 和 `.glass-card-pill` 样式
  - 使用统一的 CSS 变量
  - 保持各组件特有的圆角等属性

- [x] Task 4: 验证视觉效果
  - 检查亮色模式渐变质感
  - 检查深色模式切换平滑度
  - 确认 Safari 兼容性
  - 确认滚动性能

## 任务依赖
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 2, Task 3]
