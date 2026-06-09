# Tasks

- [x] Task 1: 修复 DockerNav 在桌面端显示底部导航栏
  - [x] 1.1: 移除 `OrientationBuilder`，改为始终使用底部浮动导航栏（`_portraitLayout`）
  - [x] 1.2: 删除 `_landscapeLayout` 方法和 `_railDestinations`

- [x] Task 2: 添加首页标题栏（AppBar）含 Logo 和搜索栏
  - [x] 2.1: 在 `home_screen.dart` 的 Scaffold 中添加 AppBar
  - [x] 2.2: AppBar 左侧显示 Logo 文字 "NiypherGal"
  - [x] 2.3: AppBar 右侧或居中显示 SearchBarWidget
  - [x] 2.4: 从 CustomScrollView 的 slivers 中移除独立的 SearchBarWidget（已移至 AppBar）

- [x] Task 3: 修复卡片网格高度
  - [x] 3.1: 将 `mainAxisExtent = screenWidth / crossCount / 0.65 + 48` 改为 `mainAxisExtent = 256.0`

- [x] Task 4: 修复图片加载
  - [x] 4.1: 在 `network_img_layer.dart` 中，Web 平台使用 `Image.network` 替代 `CachedNetworkImage`
  - [x] 4.2: 使用 `import 'package:flutter/foundation.dart'` 的 `kIsWeb` 判断平台

- [x] Task 5: 重新构建并部署
  - [x] 5.1: `flutter analyze lib` → 0 issues
  - [x] 5.2: `flutter build web --base-href "/"` → 成功
  - [x] 5.3: `wrangler pages deploy` → https://758b2426.niyphergal.pages.dev

# Task Dependencies
- Task 1 独立
- Task 2 独立
- Task 3 独立
- Task 4 独立
- Task 5 依赖 Task 1-4 全部完成
