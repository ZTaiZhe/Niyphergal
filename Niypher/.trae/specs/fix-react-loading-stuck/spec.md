# 修复 Flutter Web 站内卡加载 Spec

## Why
Niypher Flutter Web 版本部署后，浏览器显示品牌色 spinner（`index.html` 中的 CSS 动画），但 Flutter 应用永不接管渲染，页面一直卡在开屏加载状态。`fix-web-black-screen` 完成了本地优先数据策略，但 Flutter 引擎本身未能成功完成初始化。

## What Changes
- 确保 `flutter_service_worker.js` 存在于构建产物中（当前 `build/web/` 缺少此文件，导致 Service Worker 注册失败）
- 为 Flutter 加载流程添加超时检测：引擎加载超过 15 秒自动显示"加载超时"错误提示 + 刷新按钮
- 确保 `_headers` CSP 配置兼容 Flutter Web（dart2js + CanvasKit 渲染器）
- 添加 Flutter ErrorWidget 自定义错误页面，catch 所有未处理异常
- 验证 `flutter build web` 构建完整性，确保所有必要文件都生成

## Impact
- Affected code: `build/web/index.html`, `build/web/_headers`, `lib/main.dart`, `build/web/flutter_bootstrap.js`
- Flutter 包依赖：flutter_riverpod, go_router, skeletonizer, flutter_animate, shared_preferences, dio

## ADDED Requirements

### Requirement: Service Worker 文件完整性
系统 SHALL 在 Flutter Web 构建产物中包含 `flutter_service_worker.js`。

#### Scenario: 构建产物流失检查
- **WHEN** 执行 `flutter build web`
- **THEN** `build/web/` 目录中必须存在 `flutter_service_worker.js`，`flutter_bootstrap.js` 中的 SW 注册不会收到 404

### Requirement: Flutter 加载超时检测
系统 SHALL 在 HTML 层添加加载超时检测，超过 15 秒自动显示错误状态。

#### Scenario: Flutter 引擎加载超时
- **WHEN** 页面打开后 15 秒 Flutter 仍未渲染
- **THEN** 自动隐藏 spinner，显示"加载超时，请刷新重试"提示和刷新按钮

### Requirement: Flutter 全局异常捕获
系统 SHALL 在 Dart 层设置 ErrorWidget.builder，捕获所有未处理异常。

#### Scenario: Dart 运行时异常
- **WHEN** Flutter 应用初始化或渲染过程中抛出异常
- **THEN** 显示品牌色错误页面（含错误信息和重试按钮），而非灰色错误区域

### Requirement: CSP 策略兼容 Flutter CanvasKit
系统 SHALL 确保 CSP 允许 Flutter CanvasKit 渲染器所需的全部资源。

#### Scenario: CanvasKit 从本地或 CDN 加载
- **WHEN** Flutter 引擎加载 CanvasKit WASM/JS 文件
- **THEN** 不论从本地 `canvaskit/` 还是 `www.gstatic.com` CDN 加载，均不触发 CSP 违规

### Requirement: 离线优先渲染验证
系统 SHALL 在本地数据返回后 1 秒内完成首帧渲染。

#### Scenario: 后端不可用
- **WHEN** 后端 API 无响应
- **THEN** Flutter 应用在 1 秒内完成首帧渲染（显示骨架屏或本地数据）
