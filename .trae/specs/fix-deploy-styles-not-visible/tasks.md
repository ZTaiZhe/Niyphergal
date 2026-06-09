# Tasks

- [x] Task 1: 修复 Service Worker 缓存问题
  - [x] 1.1: 在 `web/_headers` 中为 `flutter_bootstrap.js`、`flutter_service_worker.js`、`main.dart.js`、`index.html` 添加 `Cache-Control: no-cache`
  - [x] 1.2: 重新构建并部署（合并到 Task 4）

- [x] Task 2: 在首页引入 SearchBarWidget
  - [x] 2.1: 在 `home_screen.dart` 中导入 SearchBarWidget
  - [x] 2.2: 在轮播和游戏网格之间添加 SearchBarWidget

- [x] Task 3: Outfit 字体本地打包
  - [x] 3.1: 下载 Outfit 字体 TTF 文件到 `assets/fonts/`
  - [x] 3.2: 在 `pubspec.yaml` 中声明字体
  - [x] 3.3: 在 `theme.dart` 中将 `GoogleFonts.outfit()` 替换为 `TextStyle(fontFamily: 'Outfit', ...)`
  - [x] 3.4: 移除 `google_fonts` 依赖

- [x] Task 4: 重新构建并部署
  - [x] 4.1: `flutter clean && flutter build web --base-href "/"`
  - [x] 4.2: `wrangler pages deploy build/web --project-name=niyphergal --branch=main` → https://f9a34e86.niyphergal.pages.dev

# Task Dependencies
- Task 1 独立
- Task 2 独立
- Task 3 独立
- Task 4 依赖 Task 1-3 全部完成
