# Tasks

- [x] Task 1: 修复主题色与 React 版一致
  - [x] 1.1: `theme.dart` 亮色 scaffoldBackgroundColor 改为 `#f8fafc`，暗色改为 `#0f172a`
  - [x] 1.2: `theme.dart` 暗色 AppBar 背景改为 `#0f172a`，亮色 AppBar 背景改为 `#f8fafc`

- [x] Task 2: 重写 GameCard 照搬 React 版布局
  - [x] 2.1: 图片全铺卡片（Stack + Positioned.fill）
  - [x] 2.2: 底部 50% 渐变遮罩（card-blur-overlay：从下到上 linear-gradient + backdrop-filter blur(12px) + mask 渐变）
  - [x] 2.3: 标题白色带文字阴影（TextStyle color: white, shadows: [Shadow(blurRadius: 4, color: black54)]）
  - [x] 2.4: 标签在底部（Positioned.bottom）
  - [x] 2.5: 移除 AspectRatio 0.65，改为固定高度 256px（与 React 版 h-64 一致）

- [x] Task 3: 重写 TagChip 照搬 React 版 tag-acrylic 样式
  - [x] 3.1: 粉色半透明背景 rgba(236,72,153,0.5) + backdrop-filter blur(12px) + 圆角
  - [x] 3.2: 文字颜色改为白色/浅灰色（暗色模式下）

- [x] Task 4: 重写 DockerNav 照搬 React 版浮动毛玻璃底部栏
  - [x] 4.1: 改为浮动毛玻璃底部栏（Stack + Positioned.bottom）
  - [x] 4.2: 居中、圆角 16px、毛玻璃背景、宽度 min(600px, 95vw)
  - [x] 4.3: 与页面内容有 16px 间距（bottom: 16）

- [x] Task 5: 重写 SearchBarWidget 照搬 React 版 pill 形状
  - [x] 5.1: 全圆角 pill 形状（borderRadius: 9999）
  - [x] 5.2: 毛玻璃背景（acrylic 渐变 + backdrop-filter）
  - [x] 5.3: focus 时底部粉色下划线动画

- [x] Task 6: 更新 GlassCard 增加 React 版 acrylic 渐变背景
  - [x] 6.1: 亮色：linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.6))
  - [x] 6.2: 暗色：linear-gradient(135deg, rgba(30,30,30,0.85), rgba(20,20,20,0.6))

- [x] Task 7: 重新构建并部署
  - [x] 7.1: `flutter analyze lib` → 0 issues
  - [x] 7.2: `flutter build web --base-href "/"` → 成功
  - [x] 7.3: `wrangler pages deploy` → https://fb113193.niyphergal.pages.dev

# Task Dependencies
- Task 1 独立
- Task 2 依赖 Task 3（GameCard 使用 TagChip）
- Task 3 独立
- Task 4 独立
- Task 5 独立
- Task 6 独立
- Task 7 依赖 Task 1-6 全部完成
