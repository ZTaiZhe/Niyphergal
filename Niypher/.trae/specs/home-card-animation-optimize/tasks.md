# 首页卡片动画效果优化 - 任务列表

## 任务列表

- [x] Task 1: 优化卡片悬停动画
  - 将动画时长从 0.4s 改为 0.3s
  - 将动画曲线从 cubic-bezier 改为 ease
  - 添加 scale(1.02) 缩放效果
  - 添加 z-index 提权防止遮挡

- [x] Task 2: 添加加载进入动效
  - 为卡片添加初始隐藏状态（opacity: 0, translateY: 20px）
  - 添加 .is-loaded 类显示状态
  - 使用 CSS 变量 --stagger-index 实现延时进入效果

- [x] Task 3: 添加刷新退出动效
  - 为卡片添加 .is-exiting 类隐藏状态
  - 使用 CSS 变量 --stagger-index 实现延时退出效果

- [x] Task 4: 添加刷新按钮
  - 在 index.html 中添加刷新按钮
  - 样式与日夜切换键相同
  - 位置在右下角，支持移动端安全区

- [x] Task 5: 添加刷新按钮交互逻辑
  - 点击刷新按钮触发卡片退出动画
  - 等待退出动画完成
  - 刷新数据（随机排序）
  - 执行载入动画
  - 添加 isRefreshing 锁防止重复点击

- [x] Task 6: 验证效果
  - 验证卡片悬停动画
  - 验证加载进入动效
  - 验证刷新退出和载入动效
  - 验证刷新按钮功能和样式

## 任务依赖
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 4]
- [Task 6] depends on [Task 5]
