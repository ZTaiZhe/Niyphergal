# Checklist

## Hero 结构对称
- [x] GameCard Hero child 是 `NetworkImgLayer` 无额外包裹
- [x] DetailScreen Hero child 是 `NetworkImgLayer` 无额外包裹
- [x] GameCard: `AspectRatio > ClipRRect` 在 Hero 外部
- [x] DetailScreen: `AspectRatio > ClipRRect` 在 Hero 外部

## flightShuttleBuilder 简化
- [x] 移除 `AnimatedBuilder`、`ClipRRect`、`Curves.easeOutCubic` 包装
- [x] 仅保留 `InheritedTheme.captureAll + Material(transparency) + hero.child`
- [x] static 方法保留但不包含额外动画逻辑

## 页面过渡
- [x] `ThemeData.pageTransitionsTheme` 在 lightTheme 和 darkTheme 中配置
- [x] Desktop 使用 `FadeUpwardsPageTransitionsBuilder()`
- [x] 详情路由 `CustomTransitionPage` → `MaterialPage`

## 图片加载优化
- [x] DetailScreen Hero 中 `NetworkImgLayer(fadeInDuration: Duration.zero)`

## 验证
- [x] `flutter build web` 编译成功
- [x] 部署到 Cloudflare Pages 成功
