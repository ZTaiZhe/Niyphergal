# 修复部署后样式不生效

## Why
Flutter Web 部署后用户反馈"一点没改"——视觉上没有任何变化。根因有三个：Service Worker 缓存旧资源、SearchBarWidget 未被引用、Google Fonts 在中国大陆无法加载。

## What Changes
- 在 `_headers` 中为关键 JS 文件添加 `Cache-Control: no-cache`，确保浏览器总是获取最新版本
- 在首页 `home_screen.dart` 中引入 SearchBarWidget
- 将 Outfit 字体从 Google Fonts 运行时下载改为本地打包

## Impact
- Affected code: `web/_headers`、`lib/features/home/home_screen.dart`、`lib/core/theme.dart`、`pubspec.yaml`
- Affected specs: align-react-layout（SearchBarWidget 修改未生效）

## ADDED Requirements

### Requirement: Service Worker 缓存控制
系统 SHALL 在 `_headers` 中为 `flutter_bootstrap.js`、`flutter_service_worker.js`、`main.dart.js`、`index.html` 设置 `Cache-Control: no-cache`，确保每次部署后浏览器获取最新资源。

#### Scenario: 部署后用户看到最新版本
- **WHEN** 新版本部署到 Cloudflare Pages
- **THEN** 用户刷新页面后能看到最新内容（不被 Service Worker 缓存阻止）

### Requirement: SearchBarWidget 在首页显示
系统 SHALL 在首页 `home_screen.dart` 中引入并显示 SearchBarWidget，位于轮播和游戏网格之间。

#### Scenario: 搜索框在首页可见
- **WHEN** 用户打开首页
- **THEN** 在轮播下方、游戏网格上方显示 pill 形状毛玻璃搜索框

### Requirement: Outfit 字体本地打包
系统 SHALL 将 Outfit 字体文件打包到项目本地，不再依赖运行时从 Google Fonts CDN 下载。

#### Scenario: 中国大陆用户看到正确字体
- **WHEN** 中国大陆用户访问应用
- **THEN** 文本使用 Outfit 字体渲染，不依赖 fonts.googleapis.com
