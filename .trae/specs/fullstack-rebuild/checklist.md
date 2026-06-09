# Fullstack Rebuild Checklist

## Phase 0: 清理旧代码
- [ ] `flutter_niypher/` 目录已删除（旧 Flutter 版）
- [ ] `Kazumi-main/` 目录已删除
- [ ] 根目录无关文件已清理
- [ ] `src/js/` 和 `src/css/` 已保留（React 版参考）
- [ ] `wrangler.toml` 暂未修改（仍部署 React 版）

## Phase 1: 后端基础
- [ ] Workers API 项目结构已创建（`api/` 目录，handler→service→repository 分层）
- [ ] D1 数据库 schema 已创建（6 张表）
- [ ] Repository 抽象层已实现（GameRepository/UserRepository/CommentRepository 接口 + D1 实现）
- [ ] `GET /api/games` 返回游戏列表
- [ ] `GET /api/games/:id` 返回游戏详情
- [ ] `GET /api/carousel` 返回轮播数据
- [ ] `GET /api/search` 返回搜索结果
- [ ] `POST /api/auth/register` 预留端点可访问
- [ ] `POST /api/auth/login` 预留端点可访问
- [ ] `POST /api/auth/refresh` 预留端点可访问
- [ ] `GET /api/user/profile` 预留端点可访问
- [ ] `POST /api/comments` 预留端点可访问
- [ ] `GET /api/comments?gameId=` 预留端点可访问
- [ ] CORS 头正确返回
- [ ] Repository 层可替换
- [ ] 硬编码数据已迁移到 D1 数据库

## Phase 2: Flutter 项目脚手架
- [ ] Flutter 项目已创建（6 端支持）
- [ ] `pubspec.yaml` 依赖已配置
- [ ] 目录结构已创建（core/data/features/widgets/services）
- [ ] `core/theme.dart` 品牌色 + Material 3 主题正常
- [ ] `core/router.dart` GoRouter 路由 + 方向感知过渡正常
- [ ] `core/constants.dart` 常量配置正常
- [ ] `core/motion.dart` 动效令牌正常
- [ ] 数据模型已创建（Game/CarouselSlide/User/Comment）
- [ ] Repository 接口已定义
- [ ] 本地数据源已实现（从 React 版 data.js 迁移）
- [ ] 远程数据源已实现（dio + JWT + fallback + LRU 缓存）
- [ ] Riverpod Provider 已实现
- [ ] `main.dart` + `app.dart` 入口正常启动

## Phase 3: Flutter 共享 Widget
- [ ] `glass_card.dart` 毛玻璃效果正常（亮/暗模式）
- [ ] `game_card.dart` 卡片设计正常（全覆盖封面 + 渐变遮罩 + 标签 + stagger + hover）
- [ ] `game_carousel.dart` 轮播图正常（方向感知 + Ken Burns + stagger + 自动播放 6s）
- [ ] `header.dart` 顶部导航栏正常（Logo 菜单 + 搜索栏 + 移动搜索按钮）
- [ ] `docker_nav.dart` 底部导航栏正常（4 tab + 毛玻璃 + "发现" tab）
- [ ] `mobile_search.dart` 移动端搜索覆盖层正常
- [ ] `image_viewer.dart` 全屏图片查看器正常（缩放 + 拖拽 + 左右切换）
- [ ] `scroll_to_top.dart` 回到顶部按钮正常
- [ ] `theme_toggle.dart` 主题切换按钮正常
- [ ] `announcement_modal.dart` 公告弹窗正常

## Phase 4: Flutter 功能页面
- [ ] `home_page.dart` 首页正常（轮播图 + 卡片网格 + 推荐排序）
- [ ] `detail_page.dart` 详情页正常（Hero 缩放淡入 + 5 层 stagger + 截图 + 评论）
- [ ] `search_page.dart` 搜索页正常（输入 + 筛选 + 分页 + 空状态动画）
- [ ] `category_page.dart` 分类页正常（分类卡片 + stagger）
- [ ] `discover_page.dart` 发现页正常（热门 + 最近 + 随机推荐）
- [ ] `profile_page.dart` 个人中心正常（两步注册/登录 + Turnstile + 已登录视图）

## Phase 5: Flutter 业务服务
- [ ] `search_service.dart` 搜索逻辑正常（防抖 + API 优先 + 本地 fallback + 拼音）
- [ ] `recommendation_service.dart` 推荐逻辑正常（基于标签协同过滤）
- [ ] `auth_service.dart` 认证逻辑正常（API 调用 + mock fallback）

## Phase 6: 集成与部署
- [ ] `wrangler.toml` 指向 Flutter Web 构建输出
- [ ] 后端 Workers 部署成功
- [ ] D1 数据库绑定正常
- [ ] 端到端：首页 → 轮播 → 卡片 → 详情页流程正常
- [ ] 端到端：搜索 → 筛选 → 分页流程正常
- [ ] 端到端：注册 → 登录（mock）流程正常
- [ ] 昼夜模式切换正常
- [ ] 移动端响应式布局正常
- [ ] Web 端部署到 Cloudflare Pages 正常
