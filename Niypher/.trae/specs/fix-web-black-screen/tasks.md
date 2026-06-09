# Tasks

- [x] Task 1: 修复 CSP 策略允许 Flutter Web 运行
  - [x] 1.1: `web/_headers` 添加 `worker-src 'self' blob:` 允许 CanvasKit Worker
  - [x] 1.2: `connect-src` 添加 `https://fonts.googleapis.com` 允许 Google Fonts API
  - [x] 1.3: 添加 `manifest-src 'self'` 允许 manifest.json 加载

- [x] Task 2: 将 providers.dart 改为本地优先策略
  - [x] 2.1: `gamesProvider` 的 `build()` 先返回本地数据，再异步尝试远程刷新
  - [x] 2.2: `carouselProvider` 同理，先返回本地轮播数据
  - [x] 2.3: 确保骨架屏在暗色主题下可见（检查 Skeletonizer 配色）

- [x] Task 3: 缩短 API 超时时间
  - [x] 3.1: `api_client.dart` 中 `connectTimeout` 从 10s 改为 3s
  - [x] 3.2: `receiveTimeout` 从 15s 改为 5s

- [x] Task 4: 添加 Web 初始化加载占位
  - [x] 4.1: `web/index.html` 添加品牌色 CSS 加载动画（在 Flutter 引擎加载期间显示）

- [x] Task 5: 修复构建警告
  - [x] 5.1: `pubspec.yaml` 添加 `cupertino_icons` 依赖，修复字体缺失警告

- [x] Task 6: 重新构建并部署
  - [x] 6.1: `flutter build web`
  - [x] 6.2: `wrangler pages deploy build/web`

# Task Dependencies
- Task 1/2/3/4/5 相互独立，可并行
- Task 6 依赖 Task 1-5 全部完成
