# 修复布局样式未生效

## Why
Flutter Web 部署后布局和样式与 React 版严重不一致：导航栏在侧边（Kazumi 模式）而非底部浮动栏、无标题栏和搜索栏、卡片宽高比错误、图片加载不出来。

## What Changes
- 修复 DockerNav：在 Web/桌面端也显示底部浮动导航栏，而非 NavigationRail 侧边栏
- 添加标题栏（AppBar）：包含 Logo 和搜索栏，匹配 React 版 ResponsiveHeader
- 修复卡片网格高度：从 `screenWidth / crossCount / 0.65 + 48` 改为固定 256px
- 修复图片加载：检查 CachedNetworkImage 在 Web 上的兼容性，必要时替换为 Image.network

## Impact
- Affected code: `lib/shared/widgets/docker_nav.dart`、`lib/features/home/home_screen.dart`、`lib/shared/widgets/network_img_layer.dart`
- Affected specs: align-react-layout（导航栏、标题栏、搜索栏、卡片高度均未对齐）

## ADDED Requirements

### Requirement: 底部浮动导航栏
系统 SHALL 在所有平台（包括桌面 Web）上显示底部浮动毛玻璃导航栏，而非侧边 NavigationRail。React 版始终使用底部导航栏。

#### Scenario: 桌面浏览器显示底部导航栏
- **WHEN** 用户在桌面浏览器中访问应用
- **THEN** 底部显示浮动毛玻璃导航栏（居中、圆角、宽度 min(600px, 95vw)）

### Requirement: 标题栏包含 Logo 和搜索栏
系统 SHALL 在首页顶部显示标题栏（AppBar），包含 Logo 和搜索栏，匹配 React 版 ResponsiveHeader 布局。

#### Scenario: 标题栏可见
- **WHEN** 用户打开首页
- **THEN** 顶部显示包含 Logo 和搜索栏的标题栏

### Requirement: 卡片高度 256px
系统 SHALL 使用 256px 固定高度作为网格行高，匹配 React 版的 `h-64`。

#### Scenario: 卡片高度正确
- **WHEN** 用户查看首页游戏网格
- **THEN** 每张卡片高度为 256px

### Requirement: 图片正确加载
系统 SHALL 在 Web 平台上正确加载并显示卡片图片。

#### Scenario: 图片可见
- **WHEN** 用户查看游戏卡片
- **THEN** 卡片图片正确加载并显示（非空白或占位符）
