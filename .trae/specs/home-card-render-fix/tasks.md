# 首页卡片渲染修复 - 任务列表

## 任务列表

- [x] Task 1: 修复 renderHome 中的字符串替换逻辑
  - 正确插入 is-hidden 类
  - 正确设置 --stagger-index 样式
  - 保留原有类名

- [x] Task 2: 修复 refreshCards 中的懒加载问题
  - 刷新后调用 observeExistingMedia

- [x] Task 3: 验证效果
  - 验证卡片圆角
  - 验证图片加载
  - 验证动画效果

## 任务依赖
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
