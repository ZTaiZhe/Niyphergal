# 搜索栏亚克力质感 - 任务列表

## 任务列表

- [x] Task 1: 修改 HTML 添加输入框包裹层
  - 在 `#header-search` 外层添加 `.search-input-wrapper` 包裹层
  - 解决 `<input>` 无法使用伪元素的技术限制

- [x] Task 2: 修改搜索栏 CSS 添加亚克力质感
  - 为 `#desktop-search-bar` 添加 `backdrop-filter: blur(12px)` 和 `-webkit-backdrop-filter` 前缀
  - 调整背景透明度为 `rgba(255, 255, 255, 0.6)`，opacity 为 0.8
  - 添加边框 `border: 1px solid rgba(255, 255, 255, 0.3)`
  - 使用 `transition: background-color 0.3s ease, opacity 0.3s ease, border-color 0.3s ease`（避免 all）

- [x] Task 3: 添加 Focus 状态底部粉色横线动画
  - 创建 `.search-input-wrapper` 样式（position: relative; flex: 1; height: 32px）
  - 创建 `.search-input-wrapper::after` 伪元素作为底部横线
  - 使用 `transform: scaleX(0/1)` + `transform-origin: left` 实现从左向右生长
  - 使用 `:focus-within` 触发动画，实现失焦时平滑缩回

- [x] Task 4: 添加深色模式适配
  - 为 `body.dark #desktop-search-bar` 添加深色亚克力样式
  - 深色模式 Hover 效果适配
  - 深色模式粉色横线颜色 #E19CBB
  - 深色模式输入框 Focus 背景色适配

- [x] Task 5: 添加 A11y 无障碍降级
  - 添加 `@media (prefers-reduced-motion: reduce)` 媒体查询
  - 开启减弱动态效果时屏蔽所有过渡动画

- [x] Task 6: 验证效果
  - 验证默认状态亚克力效果
  - 验证 Hover 状态（背景变白，透明度变1）
  - 验证 Focus 状态粉色横线生长动画
  - 验证失焦时横线平滑缩回
  - 验证深色模式
  - 验证无障碍降级

## 任务依赖
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 2, Task 3]
- [Task 5] depends on [Task 2, Task 3]
- [Task 6] depends on [Task 4, Task 5]
