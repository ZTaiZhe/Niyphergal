# 修复 Flutter Web 部署黑屏问题

## Why
部署到 Cloudflare Pages 后页面全黑，骨架屏和错误状态均未显示。根因：CSP 过于严格阻止 CanvasKit/Google Fonts/Worker 加载，API 不存在导致 10 秒超时才降级，无离线优先策略。

## What Changes
- 放宽 CSP 策略：添加 `worker-src`、`connect-src` 加入 `fonts.googleapis.com`、`manifest-src`
- 将数据加载策略从"远程优先→本地降级"改为"本地优先→后台刷新"
- 缩短 API 超时时间（10s→3s）
- 添加 HTML 加载占位动画（CanvasKit 加载期间可见）
- 确保骨架屏在暗色主题下可见
- 修复构建警告（cupertino_icons 字体缺失）

## Impact
- Affected code: `web/_headers`、`lib/data/providers.dart`、`lib/data/remote/api_client.dart`、`web/index.html`、`pubspec.yaml`

## ADDED Requirements

### Requirement: CSP 允许 Flutter Web 运行所需资源
系统 SHALL 在 CSP 中允许所有 Flutter Web 运行时需要的资源加载。

#### Scenario: CanvasKit 正常加载
- **WHEN** 浏览器加载页面
- **THEN** CanvasKit WASM、JS、Worker 文件均可正常加载和执行

#### Scenario: Google Fonts 正常加载
- **WHEN** 应用使用 google_fonts 包
- **THEN** 字体元数据和字体文件均可从 Google CDN 正常下载

### Requirement: 离线优先数据加载
系统 SHALL 在启动时立即使用本地硬编码数据渲染界面，不阻塞等待远程 API。

#### Scenario: 无后端时正常显示
- **WHEN** 用户打开应用且后端 API 不可用
- **THEN** 页面在 1 秒内显示本地数据（骨架屏→本地数据内容）

#### Scenario: 后端可用时刷新数据
- **WHEN** 用户打开应用且后端 API 可用
- **THEN** 先显示本地数据，然后在后台静默刷新为远程数据

### Requirement: API 超时快速降级
系统 SHALL 在 3 秒内完成 API 超时判定。

#### Scenario: API 无响应
- **WHEN** API 请求超过 3 秒未响应
- **THEN** 立即降级到本地数据

### Requirement: Web 初始化占位
系统 SHALL 在 Flutter 引擎加载期间显示品牌色加载指示器。

#### Scenario: CanvasKit 加载中
- **WHEN** Flutter 引擎尚未初始化完成
- **THEN** 显示品牌粉色 (#FE007F) 加载动画，而非纯黑背景

### Requirement: 骨架屏在暗色主题下可见
系统 SHALL 确保骨架屏动画在暗色背景下清晰可见。

#### Scenario: 暗色主题加载中
- **WHEN** 应用处于暗色主题且数据正在加载
- **THEN** 骨架屏动画清晰可见，用户可感知加载状态

### Requirement: 构建无警告
系统 SHALL 在 `flutter build web` 时无阻断性警告。

#### Scenario: cupertino_icons 字体
- **WHEN** 执行 `flutter build web`
- **THEN** 不出现 "Expected to find fonts for packages/cupertino_icons/CupertinoIcons" 警告
