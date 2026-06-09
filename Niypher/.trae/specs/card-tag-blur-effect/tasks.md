# 游戏卡片底部渐进模糊效果 - 任务列表

## 任务列表

- [x] Task 1: 创建渐进模糊 CSS 样式类
  - 创建 `.card-blur-overlay` 样式类
  - 使用 `backdrop-filter` + `mask-image` 实现无色渐进模糊
  - 最底部模糊程度为 85%（不完全模糊）

- [x] Task 2: 修改 renderGameCard 函数
  - 在标签区域添加渐进模糊遮罩层
  - 确保图层位置正确（在图片图层之上）

- [x] Task 3: 验证视觉效果
  - 检查浅色模式效果
  - 检查深色模式效果
  - 确认标签可读性

## 任务依赖
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
