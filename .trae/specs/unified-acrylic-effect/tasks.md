# 全局亚克力面板统一 - 任务列表

## 任务列表

- [ ] Task 1: 创建全局亚克力面板样式类 `.acrylic-panel`
  - 添加日模式样式（背景 85% 透明白、12px 模糊、双层投影）
  - 添加夜模式样式（60% 透明深灰、高光白线边框）
  - 添加 hover 效果（提亮/变浅、投影扩散）
  - 添加平滑过渡动画
  - 添加无障碍降级处理

- [ ] Task 2: 更新 HTML 元素使用新样式类
  - Logo 卡片：移除 `glass-card-pill`，添加 `acrylic-panel`
  - Docker 栏：移除 `glass-card`，添加 `acrylic-panel`
  - 日夜按钮：移除 `glass-card`，添加 `acrylic-panel`
  - 刷新按钮：移除 `glass-card`，添加 `acrylic-panel`

- [ ] Task 3: 验证视觉效果
  - 验证日模式效果和颜色一致性
  - 验证夜模式效果和颜色一致性
  - 验证 hover 效果
  - 验证边框渲染正常
  - 验证圆角自适应
  - 验证无障碍降级

## 任务依赖
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
