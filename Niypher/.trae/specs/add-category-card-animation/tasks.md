# 分类页卡片动效 - 任务列表

## 任务列表

- [ ] Task 1: 修改 renderCategoryCard 函数，添加动画相关类和样式
  - 添加 `is-hidden` 类
  - 添加 `--stagger-index` 样式

- [ ] Task 2: 创建 initCategoryAnimations 函数
  - 与 initHomeAnimations 类似的逻辑
  - 选择器使用 `.category-cards-container .glass-card`

- [ ] Task 3: 在 renderer.js 中调用分类页动画初始化
  - 在页面转换完成后调用 initCategoryAnimations

- [ ] Task 4: 验证效果
  - 验证分类页卡片有阶梯式进入动效
  - 验证动效与首页一致

## 任务依赖
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]
