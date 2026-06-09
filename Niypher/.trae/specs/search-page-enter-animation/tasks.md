# 搜索页全局入场动效优化 - 任务列表

## 任务列表

- [x] Task 1: 添加搜索页上下滑动动画 CSS
  - 创建 `.page-slide-up-enter-active` 类（自下而上进入，translateY(100%) -> translateY(0)）
  - 创建 `.page-slide-down-exit-active` 类（向下退出，translateY(0) -> translateY(100%)）
  - 使用 GPU 硬件加速（transform + opacity）
  - 添加 `@media (prefers-reduced-motion: reduce)` 支持

- [x] Task 2: 修改 renderer.js 页面切换逻辑
  - 检测目标页面是否为搜索页（`router.current === 'search'`）
  - 进入搜索页时使用 `.page-slide-up-enter-active` 动画
  - 手机手势返回或点击返回键退出搜索页时使用 `.page-slide-down-exit-active` 动画
  - 从搜索页跳转到其他页面时使用原有左右滑动逻辑
  - 修改 `getAnimationDirection` 函数支持搜索页特殊处理

- [x] Task 3: 统一搜索结果项首次入场动效
  - 首次进入搜索页时，结果项初始状态设为隐藏态（opacity: 0; transform: translateY(16px)）
  - 强制触发重绘（读取 `offsetHeight` 或 `requestAnimationFrame`）
  - 为节点附加 `.is-entering` 类和 `--delay` 变量
  - 与局部刷新时的动效保持一致

- [x] Task 4: 验证动效效果
  - 验证进入搜索页时整页自下而上进入
  - 验证手机手势返回或点击返回键时搜索页整页向下退出
  - 验证从搜索页跳转详情页时使用左右滑动逻辑
  - 验证结果项交错入场动效
  - 验证无跳闪
  - 验证无障碍兼容（减弱动态效果）

## 任务依赖
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]
