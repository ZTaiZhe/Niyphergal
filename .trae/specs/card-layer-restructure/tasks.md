# 调整卡片层级结构 - 任务列表

## 任务列表

- [x] Task 1: 修改 CSS 样式
  - 创建独立的 `.card-blur-overlay` 样式类
  - 移除 `.card-tag-section::before` 模糊遮罩
  - 简化 `.card-tag-section` 样式

- [x] Task 2: 重构 renderGameCard 函数
  - 添加独立的模糊遮罩层 `.card-blur-overlay`
  - 将标题和标签合并到同一层

- [x] Task 3: 验证视觉效果
  - 检查标签和标题在同一层
  - 检查模糊遮罩在标题下一层

## 任务依赖
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
