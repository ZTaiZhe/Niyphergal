# Tasks

- [x] Task 1: 重写 flightShuttleBuilder 响应 animation
  - [x] 修改 `NetworkImgLayer.heroFlightShuttleBuilder`，使用 `animation.value` 做 FadeTransition
  - [x] Push 方向 opacity 0→1，Pop 方向 opacity 1→0
  - [x] 保持 Kazumi 风格 InheritedTheme.captureAll + Material(transparency) 包裹
  - [x] 验证：shuttle 在飞行中平滑过渡，不再完全忽略 animation

- [x] Task 2: Hero child 纯图片
  - [x] GameCard: Hero child 改为纯 `CachedNetworkImage`，移除 NetworkImgLayer 包装
  - [x] DetailScreen: Hero child 改为纯 `CachedNetworkImage`，移除 NetworkImgLayer 包装
  - [x] 两端 width/height 使用 LayoutBuilder 传入的 constraints
  - [x] 圆角由外部 ClipRRect 处理（不在 Hero child 内部）
  - [x] 验证：Hero child 为纯 Image，无额外 ClipRRect/Container

- [x] Task 3: GameCard 移除 AnimatedScale 对 Hero 的干扰
  - [x] 完全移除 AnimatedScale，hover/press 态改为 BoxShadow 变化
  - [x] 确保 Hero tag 坐标在点击时不受 scale 动画影响
  - [x] 验证：点击卡片时 Hero 起始位置精确

- [x] Task 4: GameCard 移除 GlassCard 对 Hero 路径的包围
  - [x] 将 GlassCard 替换为普通 Container + BoxDecoration（手动实现圆角、阴影、玻璃态背景色）
  - [x] 保持视觉外观不变
  - [x] 验证：Hero 飞行时无 BackdropFilter 渲染开销

- [x] Task 5: 详情页 Pop 前 scroll 归零
  - [x] 在 DetailScreen 添加 ScrollController 控制 NestedScrollView
  - [x] 在 AppBar 返回按钮中，pop 前先 `_scrollController.jumpTo(0)`
  - [x] 验证：滚动后返回，封面图飞回正确位置

# Task Dependencies
- Task 2 依赖 Task 1（shuttle 需要与纯 Image child 配合测试）
- Task 3 可并行于 Task 1、2
- Task 4 可并行于 Task 1、2、3
- Task 5 可独立并行
