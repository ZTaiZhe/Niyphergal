# 从根源修复 Hero 飞行过渡 Spec

## Why
前两轮修复（`complete-features-and-fix-hero`、`fix-hero-kazumi-style`）虽然统一了结构，但 4 个问题始终存在：定位不准、大小变形、卡顿/闪烁、返回动画异常。根因是 5 个冲突点未被识别和解决。

## What Changes
1. **移除 Hero 路径上的 AnimatedScale**：GameCard 的 `AnimatedScale(1.05)` 在 Hero 捕获坐标时处于动画中间态，导致起始位置偏移。改为仅在非 Hero 容器层级应用缩放。
2. **简化 Hero 两端子节点**：将 `NetworkImgLayer` 的 `ClipRRect` 移到 Hero 外部，Hero child 为纯 `Image` widget（无裁剪、无额外容器），确保 Flutter 原生 Hero overlay 不做额外裁剪。
3. **flightShuttleBuilder 正确处理 animation**：当前实现完全忽略 `animation` 参数，导致飞行过程中无法正确处理淡入淡出和尺寸过渡。改为简易 shuttle：Hero child 随 animation.value 做 opacity 渐隐/渐显。
4. **移除 Hero 路径上的 GlassCard 嵌套**：GameCard 的 GlassCard（BackdropFilter + ClipRRect）在 Hero 飞行期间被 overlay 捕获，增加渲染负担。改为普通 Container。
5. **返回时处理滚动偏移**：详情页 `NestedScrollView` 滚动后 pop 返回，Hero target 在列表中的实际位置与视觉位置不一致。添加 `PopScope` 在 pop 前将详情页 scroll 归零。

## Impact
- Affected code:
  - `lib/shared/widgets/game_card.dart` — 移除 AnimatedScale 对 Hero 子树的覆盖，简化卡片容器
  - `lib/features/detail/detail_screen.dart` — Hero child 纯图片、Pop 前 scroll 归零
  - `lib/shared/widgets/network_img_layer.dart` — flightShuttleBuilder 处理 animation，或新建独立 shuttle

## MODIFIED Requirements

### Requirement: Hero child 纯图片
GameCard 和 DetailScreen 的 Hero child SHALL 为纯 `Image` widget（CachedNetworkImage 或 Image.network），不含 `ClipRRect`、`Container`、`Padding` 等额外包装。圆角 SHALL 由 Hero 外部的 `ClipRRect` 处理。

#### Scenario: Hero child 纯净
- **WHEN** Flutter Hero overlay 创建飞行 shuttle
- **THEN** shuttle 内容仅为图片本身，无额外裁剪或容器

### Requirement: flightShuttleBuilder 响应 animation
`heroFlightShuttleBuilder` SHALL 使用 `animation.value` 控制 shuttle 的 opacity：push 方向 0→1 渐显，pop 方向 1→0 渐隐。不再忽略 animation 参数。

#### Scenario: Push 方向渐显
- **WHEN** 用户点击卡片进入详情
- **THEN** 飞行中 shuttle 从透明渐显到不透明

#### Scenario: Pop 方向渐隐
- **WHEN** 用户从详情返回首页
- **THEN** 飞行中 shuttle 从不透明渐隐到透明

### Requirement: GameCard 无 AnimatedScale 干扰 Hero
GameCard 的 hover/press 缩放动画 SHALL 不包裹 Hero widget。缩放效果 SHALL 仅作用在 Hero 外部的容器（GlassCard/Container）层级。

#### Scenario: Hero tag 捕获准确坐标
- **WHEN** 用户点击卡片触发导航
- **THEN** Hero widget 的位置不受 AnimatedScale 中间态影响，坐标精确

### Requirement: GameCard Hero 路径无 GlassCard
GameCard 的 Hero 父级容器 SHALL 为普通 `Container`（BoxDecoration 手动实现圆角和阴影），不使用 GlassCard 的 BackdropFilter 以避免渲染冲突。

### Requirement: 详情页 Pop 前 scroll 归零
DetailScreen SHALL 在 `PopScope` 或返回前将 `NestedScrollView`/`ScrollController` 滚动位置归零，确保 Hero target（列表中的 GameCard）的视觉位置与 Flutter 计算的 Hero 目标位置一致。

#### Scenario: 返回时 Hero 定位准确
- **WHEN** 用户在详情页滚动后按返回
- **THEN** 返回前 scroll 归零，封面图飞回卡片原始位置无错位
