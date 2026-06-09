# Tasks

## Task 1: 配置 ThemeData 级 pageTransitionsTheme + 路由改造
- [x] 1.1 修改 `theme.dart`：`lightTheme` 和 `darkTheme` 添加 `pageTransitionsTheme: const PageTransitionsTheme(builders: {TargetPlatform.windows: FadeUpwardsPageTransitionsBuilder(), TargetPlatform.linux: FadeUpwardsPageTransitionsBuilder(), TargetPlatform.macOS: FadeUpwardsPageTransitionsBuilder()})`
- [x] 1.2 修改 `router.dart`：详情路由 `CustomTransitionPage` → 标准 `MaterialPage(child: DetailScreen(...))`
- [x] 1.3 搜索路由同样改为 `MaterialPage`（一致性）

## Task 2: 对称 Hero child 结构 + 简化 flightShuttleBuilder
- [x] 2.1 修改 `game_card.dart`：`AspectRatio(16/9) > ClipRRect(topRadius: 16) > Hero(tag, flightShuttleBuilder) > NetworkImgLayer(double.infinity)` — 已就绪（无需改，结构已正确）
- [x] 2.2 修改 `detail_screen.dart`：`AspectRatio(16/9) > ClipRRect(radius: 12) > Hero(tag, flightShuttleBuilder) > NetworkImgLayer(double.infinity, fadeInDuration: Duration.zero)`
- [x] 2.3 修改 `network_img_layer.dart` 的 `heroFlightShuttleBuilder`：移除 `AnimatedBuilder`、`ClipRRect`、`Opacity`，仅保留 Kazumi 原版：`InheritedTheme.captureAll(heroContext, Material(type: MaterialType.transparency, child: hero.child))`

## Task 3: 构建验证
- [x] 3.1 `flutter build web` 成功
- [x] 3.2 部署验证 Hero 全流程动画

# Task Dependencies
- [Task 1] 和 [Task 2] 可并行
- [Task 3] 依赖 [Task 1, 2]
