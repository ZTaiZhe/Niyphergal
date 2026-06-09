# Tasks

- [x] Task 1: 创建 ImageViewer 组件（JS 逻辑）
  - [x] SubTask 1.1: 在 `src/js/modules/components.js` 中创建 `ImageViewer` 对象，包含 open/close 方法
  - [x] SubTask 1.2: 实现图片加载和显示逻辑
  - [x] SubTask 1.3: 实现缩放功能（滚轮 + 按钮控制 + 拖拽平移）
  - [x] SubTask 1.4: 实现多图左右切换导航（箭头按钮 + 触摸滑动）
  - [x] SubTask 1.5: 实现 ESC 键关闭、背景点击关闭、控件自动淡出/显示

- [x] Task 2: 创建 ImageViewer 样式（CSS）
  - [x] SubTask 2.1: 创建查看器全屏遮罩层样式（fixed inset-0, z-index 最高层, backdrop-blur）
  - [x] SubTask 2.2: 创建图片容器样式（居中显示, max-width/max-height 自适应, overflow-hidden）
  - [x] SubTask 2.3: 创建玻璃态控件样式（关闭按钮、缩放按钮组、导航箭头）使用 acrylic-panel/glass-card 风格
  - [x] SubTask 2.4: 创建控件自动淡出动画（3秒无操作后 opacity 过渡到 0.3）
  - [x] SubTask 2.5: 创建图片切换滑动过渡动画

- [x] Task 3: 绑定事件处理
  - [x] SubTask 3.1: 在 `eventDelegation.js` 中新增 `open-image-viewer` action 处理
  - [x] SubTask 3.2: 修改 `renderMediaItem()` 为图片元素添加 `data-action="open-image-viewer"` 和 `data-index` 属性
  - [x] SubTask 3.3: 确保点击事件正确传递当前游戏的所有 media 数据给 ImageViewer

- [x] Task 4: 构建验证
  - [x] SubTask 4.1: 运行 `npm run build` 确保无构建错误
  - [x] SubTask 4.2: 验证 dist/index.html 中包含 ImageViewer 相关代码

# Task Dependencies
- [Task 1] 无前置依赖，可立即开始
- [Task 2] 可与 Task 1 并行
- [Task 3] 依赖 [Task 1]（需 ImageViewer 组件先完成）
- [Task 4] 依赖 [Task 1, 2, 3]
