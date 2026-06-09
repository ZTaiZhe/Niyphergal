# Tasks

## Phase 0: 清理旧代码
- [ ] Task 0.1: 删除 `flutter_niypher/` 目录（旧 Flutter 版）
- [ ] Task 0.2: 删除 `Kazumi-main/` 目录
- [ ] Task 0.3: 清理根目录无关文件（`Kazumi-main.zip`、`flutter_windows_3.24.5-stable.zip`、`游戏网站首页轮播图设计.zip`、`游戏详情页设计.zip`、`deploy_test.html`、`asset_test.txt`、`check-syntax.ps1`、`deploy.log`、`server.js`、`temp_carousel/`、`pic/`）
- [ ] Task 0.4: 保留 `src/js/` 和 `src/css/`（React 版，作为 UI/动效参考和回退）
- [ ] Task 0.5: 保留 `wrangler.toml` 当前配置（仍部署 React 版），Flutter 版完善后再切换

## Phase 1: 后端基础（Cloudflare Workers + D1，预留为主）
- [ ] Task 1.1: 创建 Workers API 项目结构
  - [ ] 创建 `api/` 目录，包含 `wrangler.toml`、`src/index.ts`（Workers 入口）
  - [ ] 配置 D1 数据库绑定
  - [ ] 配置 CORS 中间件
  - [ ] 路由分发层（handler → service → repository）
- [ ] Task 1.2: 设计并创建 D1 数据库 schema
  - [ ] `games` 表（id, title, cover, tags, intro, rating, size, date, language, platform, developer, created_at, updated_at）
  - [ ] `game_versions` 表（id, game_id, ver, date, size）
  - [ ] `game_media` 表（id, game_id, type, url, sort_order）
  - [ ] `carousel_slides` 表（id, type, title, subtitle, description, image, action, sort_order）
  - [ ] `users` 表（id, email, password_hash, name, avatar, created_at）
  - [ ] `comments` 表（id, game_id, user_id, text, created_at）
  - [ ] 创建迁移 SQL 文件
- [ ] Task 1.3: 实现 Repository 层（可迁移抽象）
  - [ ] `GameRepository` 接口 + D1 实现
  - [ ] `UserRepository` 接口 + D1 实现
  - [ ] `CommentRepository` 接口 + D1 实现
- [ ] Task 1.4: 实现游戏数据 API（✅ 完整实现）
  - [ ] `GET /api/games` — 列表（分页、排序、筛选）
  - [ ] `GET /api/games/:id` — 详情（含 versions、media）
  - [ ] `GET /api/carousel` — 轮播数据
  - [ ] `GET /api/search` — 搜索（标题 + 拼音 + 标签匹配）
- [ ] Task 1.5: 实现认证 API（🔧 预留骨架）
  - [ ] `POST /api/auth/register` — 预留（验证 Turnstile + mock 成功）
  - [ ] `POST /api/auth/login` — 预留（mock JWT token）
  - [ ] `POST /api/auth/refresh` — 预留（mock 刷新）
  - [ ] JWT 中间件骨架（预留，暂跳过验证）
- [ ] Task 1.6: 实现用户与评论 API（🔧 预留骨架）
  - [ ] `GET /api/user/profile` — 预留（mock 用户数据）
  - [ ] `POST /api/comments` — 预留（mock 成功）
  - [ ] `GET /api/comments?gameId=` — 预留（mock 评论列表）
- [ ] Task 1.7: 数据迁移脚本
  - [ ] 将 React 版 `data.js` 中的硬编码数据写入 D1 数据库
  - [ ] 验证迁移完整性

## Phase 2: Flutter 项目脚手架
- [ ] Task 2.1: 创建 Flutter 项目
  - [ ] 使用 `flutter create` 初始化项目（支持 web/android/ios/macos/windows/linux）
  - [ ] 配置 `pubspec.yaml`（依赖：flutter_riverpod, go_router, dio, flutter_animate, cached_network_image, shared_preferences, pinyin_pro）
  - [ ] 创建目录结构（core/data/features/widgets/services）
- [ ] Task 2.2: 实现核心层
  - [ ] `core/theme.dart` — 品牌色 + Material 3 ColorScheme + 亮/暗模式
  - [ ] `core/router.dart` — GoRouter 路由配置 + 方向感知过渡
  - [ ] `core/constants.dart` — 常量配置
  - [ ] `core/motion.dart` — 动效令牌（duration/easing/variants）
- [ ] Task 2.3: 实现数据模型
  - [ ] `data/models/game.dart` — Game, GameVersion, GameMedia
  - [ ] `data/models/carousel.dart` — CarouselSlide
  - [ ] `data/models/user.dart` — User
  - [ ] `data/models/comment.dart` — Comment
- [ ] Task 2.4: 实现数据层
  - [ ] `data/repositories/game_repository.dart` — 接口
  - [ ] `data/repositories/user_repository.dart` — 接口
  - [ ] `data/local/local_data_source.dart` — 本地数据（从 React 版 data.js 迁移）
  - [ ] `data/local/local_game_repository.dart` — 本地实现
  - [ ] `data/remote/api_client.dart` — dio 封装（JWT + fallback + LRU 缓存）
  - [ ] `data/remote/remote_game_repository.dart` — 远程实现
- [ ] Task 2.5: 实现 Riverpod Provider
  - [ ] `uiProvider` — UI 状态
  - [ ] `themeProvider` — 主题状态
  - [ ] `userProvider` — 用户状态
  - [ ] `authProvider` — 认证状态
  - [ ] `gamesProvider` — 游戏数据
  - [ ] `carouselProvider` — 轮播数据
  - [ ] `searchProvider` — 搜索状态
- [ ] Task 2.6: 实现入口
  - [ ] `main.dart` — ProviderScope 包裹
  - [ ] `app.dart` — MaterialApp.router + GoRouter + 主题

## Phase 3: Flutter 共享 Widget
- [ ] Task 3.1: `widgets/glass_card.dart` — 毛玻璃容器（ClipRRect + BackdropFilter）
- [ ] Task 3.2: `widgets/game_card.dart` — 游戏卡片（全覆盖封面 + 渐变遮罩 + 标签 + stagger 入场 + hover 动画）
- [ ] Task 3.3: `widgets/game_carousel.dart` — 轮播图（方向感知 + Ken Burns + 内容 stagger + 自动播放 6s）
- [ ] Task 3.4: `widgets/header.dart` — 顶部导航栏（Logo 菜单 + 桌面搜索栏 + 移动搜索按钮）
- [ ] Task 3.5: `widgets/docker_nav.dart` — 底部导航栏（4 tab + 毛玻璃 + 图标切换）
- [ ] Task 3.6: `widgets/mobile_search.dart` — 移动端全屏搜索覆盖层
- [ ] Task 3.7: `widgets/image_viewer.dart` — 全屏图片查看器（缩放 + 拖拽 + 左右切换）
- [ ] Task 3.8: `widgets/scroll_to_top.dart` — 回到顶部浮动按钮
- [ ] Task 3.9: `widgets/theme_toggle.dart` — 主题切换按钮
- [ ] Task 3.10: `widgets/announcement_modal.dart` — 公告弹窗

## Phase 4: Flutter 功能页面
- [ ] Task 4.1: `features/home/home_page.dart` — 首页（轮播图 + 卡片网格 + 推荐排序）
- [ ] Task 4.2: `features/detail/detail_page.dart` — 详情页（Hero 缩放淡入 + 5 层 stagger + 截图画廊 + 评论）
- [ ] Task 4.3: `features/search/search_page.dart` — 搜索页（输入 + 筛选 + 分页 + 空状态动画）
- [ ] Task 4.4: `features/category/category_page.dart` — 分类页（分类卡片网格 + stagger）
- [ ] Task 4.5: `features/discover/discover_page.dart` — 发现页（热门 + 最近 + 随机推荐）
- [ ] Task 4.6: `features/profile/profile_page.dart` — 个人中心（两步注册/登录 + Turnstile + 已登录视图）

## Phase 5: Flutter 业务服务
- [ ] Task 5.1: `services/search_service.dart` — 搜索逻辑（防抖 + API 优先 + 本地 fallback + 拼音匹配）
- [ ] Task 5.2: `services/recommendation_service.dart` — 推荐逻辑（基于标签的协同过滤）
- [ ] Task 5.3: `services/auth_service.dart` — 认证逻辑（API 调用 + mock fallback）

## Phase 6: 集成与部署
- [ ] Task 6.1: 更新部署配置
  - [ ] `wrangler.toml` 指向 Flutter Web 构建输出
  - [ ] 后端 Workers 部署配置
  - [ ] D1 数据库绑定
- [ ] Task 6.2: 端到端验证
  - [ ] 首页加载 + 轮播 + 卡片点击
  - [ ] 详情页 Hero 动画 + 截图查看
  - [ ] 搜索 + 筛选 + 分页
  - [ ] 注册 + 登录流程（mock）
  - [ ] 昼夜模式切换
  - [ ] 移动端响应式
  - [ ] Web 端部署到 Cloudflare Pages

# Task Dependencies
- [Task 1.x] 后端 API 依赖 [Task 1.1] 项目结构
- [Task 1.3] Repository 层依赖 [Task 1.2] 数据库 schema
- [Task 1.4] 游戏 API 依赖 [Task 1.3] Repository 层
- [Task 1.7] 数据迁移依赖 [Task 1.2] + [Task 1.4]
- [Task 2.x] Flutter 脚手架可与 [Task 1.x] 并行
- [Task 2.4] 数据层依赖 [Task 2.3] 数据模型
- [Task 2.5] Provider 依赖 [Task 2.4] 数据层
- [Task 3.x] Widget 依赖 [Task 2.2] 核心层 + [Task 2.3] 数据模型
- [Task 4.x] 页面依赖 [Task 2.5] Provider + [Task 3.x] Widget
- [Task 5.x] 服务依赖 [Task 2.4] 数据层
- [Task 6.x] 集成部署依赖所有前置任务
