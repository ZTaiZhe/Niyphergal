# 全面抄 Kazumi Hero 动画体系 Spec

## Why
当前 Hero 过渡定位不准 + 飞行卡顿 + 前后关联动效缺失。Kazumi 验证过的方案：对称 Hero child + 极简 flightShuttleBuilder + ThemeData 级 pageTransitionsTheme + 骨架时序协调。

## What Changes
- **BREAKING** 移除 `CustomTransitionPage`，详情页改用标准 `MaterialPage` + `pageTransitionsTheme`
- `ThemeData` 增加 `pageTransitionsTheme`（Kazumi 同款：Desktop 用 `FadeUpwardsPageTransitionsBuilder`）
- GameCard 与 DetailScreen 的 Hero child 结构完全对称（都是 `NetworkImgLayer`）
- `flightShuttleBuilder` 简化为 Kazumi 原版：`InheritedTheme.captureAll + Material(transparency) + hero.child`
- DetailScreen Hero 图片 `fadeInDuration: 0` 避免飞行后二次淡入
- 首页 `AutomaticKeepAliveClientMixin` 已就绪（无需改）

## Impact
- Affected code:
  - `lib/core/theme.dart` — 添加 `pageTransitionsTheme`
  - `lib/core/router.dart` — 详情页改用 `MaterialPage` 替代 `CustomTransitionPage`
  - `lib/shared/widgets/game_card.dart` — Hero 结构对称
  - `lib/features/detail/detail_screen.dart` — Hero 结构对称 + fadeInDuration:0
  - `lib/shared/widgets/network_img_layer.dart` — flightShuttleBuilder 简化

## ADDED Requirements

### Requirement: ThemeData 级 pageTransitionsTheme
`lightTheme` 和 `darkTheme` SHALL 包含 `pageTransitionsTheme`，Desktop 使用 `FadeUpwardsPageTransitionsBuilder()`。

#### Scenario: 详情页打开过渡
- **WHEN** 用户点击游戏卡片进入详情页
- **THEN** 详情页使用 `FadeUpwardsPageTransitionsBuilder` 从底部淡入滑入，与 Hero 飞行并行

### Requirement: 详情页路由用标准 MaterialPage
详情路由 SHALL 使用 `MaterialPage` 替代 `CustomTransitionPage`，让 `pageTransitionsTheme` 和 Hero 动画正常工作。

#### Scenario: 路由过渡不干扰 Hero
- **WHEN** Hero 飞行过渡执行时
- **THEN** 页面路由过渡使用标准 `FadeUpwardsPageTransitionsBuilder`，不与 Hero overlay 冲突

### Requirement: 对称 Hero child 结构
GameCard 和 DetailScreen 的 Hero child SHALL 都是 `NetworkImgLayer(width: double.infinity, height: double.infinity)`，AspectRatio 和 ClipRRect SHALL 在 Hero 外部。

### Requirement: Kazumi 风格 flightShuttleBuilder
`heroFlightShuttleBuilder` SHALL 仅做 `InheritedTheme.captureAll + Material(type: transparency) + hero.child`，不添加任何动画包装。

### Requirement: DetailScreen 图片零淡入
DetailScreen 的 Hero 中使用 `NetworkImgLayer(fadeInDuration: Duration.zero)` 避免飞行完成后二次淡入。

## MODIFIED Requirements
### Requirement: GameCard Hero 结构
`AspectRatio(16/9) > ClipRRect(topRadius: 16) > Hero(tag, flightShuttleBuilder) > NetworkImgLayer(double.infinity)` — 与 DetailScreen 结构完全对称。

### Requirement: DetailScreen Hero 结构
`AspectRatio(16/9) > ClipRRect(radius: 12) > Hero(tag, flightShuttleBuilder) > NetworkImgLayer(double.infinity, fadeInDuration: 0)` — 与 GameCard 结构完全对称。
