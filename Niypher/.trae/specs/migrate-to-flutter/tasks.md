# Tasks

## Phase 1: 基础设施与骨架

- [x] Task 1: 补全 Flutter 项目依赖和构建配置
  - [x] 1.1 更新 pubspec.yaml：添加 flutter_secure_storage、lpinyin、skeletonizer、photo_view、webview_flutter、flutter_rating_bar、google_fonts 依赖
  - [x] 1.2 配置 Web 构建目标：flutter build web --base-href "/"
  - [x] 1.3 验证 `flutter build web` 可成功生成 build/web/

- [x] Task 2: 补全本地数据源
  - [x] 2.1 创建 `lib/data/local/local_data_source.dart`：硬编码游戏数据、轮播数据、评论数据（从 data.js 移植）
  - [x] 2.2 创建 `lib/data/local/local_game_repository.dart`：本地游戏仓库实现
  - [x] 2.3 创建 `lib/data/local/local_carousel_repository.dart`：本地轮播仓库实现
  - [x] 2.4 补全 providers.dart 中的 localCarouselSlides 常量

- [x] Task 3: 完善路由和页面骨架
  - [x] 3.1 更新 router.dart：替换占位页面为实际页面 Widget 引用
  - [x] 3.2 创建 `lib/features/home/home_screen.dart` 骨架
  - [x] 3.3 创建 `lib/features/detail/detail_screen.dart` 骨架
  - [x] 3.4 创建 `lib/features/search/search_screen.dart` 骨架
  - [x] 3.5 创建 `lib/features/category/category_screen.dart` 骨架
  - [x] 3.6 创建 `lib/features/galgame/galgame_screen.dart` 骨架
  - [x] 3.7 创建 `lib/features/profile/profile_screen.dart` 骨架

## Phase 2: 共享组件（照搬 Kazumi 模式 + GSAP 级动效）

- [x] Task 4: 图片加载层（照搬 Kazumi NetworkImgLayer）
  - [x] 4.1 创建 `lib/shared/widgets/network_img_layer.dart`：封装 CachedNetworkImage + 内存优化 + 占位符 + 圆角 + Hero flightShuttleBuilder
  - [x] 4.2 照搬 Kazumi 的 `heroFlightShuttleBuilder` 静态方法

- [x] Task 5: 游戏卡片组件（参考 Kazumi BangumiCardV + GSAP Hover Physics）
  - [x] 5.1 创建 `lib/shared/widgets/game_card.dart`：Hero tag + NetworkImgLayer + 毛玻璃 + 标签 + InkWell + AnimatedScale(scale: 1.05, duration: 700ms, Curves.easeOut) hover 效果
  - [x] 5.2 创建 `lib/shared/widgets/glass_card.dart`：通用毛玻璃容器（复用 theme.dart glassmorphism()）
  - [x] 5.3 创建 `lib/shared/widgets/tag_chip.dart`：标签组件（默认/填充/描边三种样式）

- [x] Task 6: Docker 导航栏（照搬 Kazumi ScaffoldMenu）
  - [x] 6.1 创建 `lib/shared/widgets/docker_nav.dart`：竖屏 NavigationBar + 横屏 NavigationRail（照搬 Kazumi 横竖屏自适应逻辑）
  - [x] 6.2 集成到 app.dart 的 shell route 结构

- [x] Task 7: 搜索栏组件
  - [x] 7.1 创建 `lib/shared/widgets/search_bar.dart`：顶部搜索栏 + 联想下拉
  - [x] 7.2 创建 `lib/features/search/search_suggestion.dart`：搜索联想逻辑

- [x] Task 8: 公告弹窗组件
  - [x] 8.1 创建 `lib/shared/widgets/announcement_modal.dart`：毛玻璃模态框 + 图片 + 关闭按钮

## Phase 3: 核心页面（AIDA 结构 + GSAP 级动效）

- [x] Task 9: 首页完整实现（参考 Kazumi PopularPage + AIDA 结构）
  - [x] 9.1 创建 `lib/features/home/carousel_widget.dart`：轮播图（Ken Burns + PageView + 内容交错入场，参考 GameCarousel.tsx）
  - [x] 9.2 实现 HomeScreen AIDA 结构：Attention（轮播图大图 Hero）→ Interest（SliverGrid 卡片网格，照搬 Kazumi 响应式列数）→ Action（FAB ScrollToTop）
  - [x] 9.3 实现卡片点击导航到详情页（Hero 过渡，照搬 Kazumi BangumiCardV → InfoPage 模式）
  - [x] 9.4 实现刷新/推荐排序逻辑
  - [x] 9.5 实现 ScrollToTop FAB（照搬 Kazumi）
  - [x] 9.6 实现滚动驱动动效：图片 scale 0.8→1.0 + opacity 滚动驱动（GSAP Image Scale & Fade Scroll 等效）
  - [x] 9.7 实现卡片交错入场动画（GSAP Scrubbing Text Reveals 等效：flutter_animate + 交错延迟）

- [x] Task 10: 详情页完整实现（照搬 Kazumi InfoPage + GSAP Scroll Pinning）
  - [x] 10.1 实现 DetailScreen AIDA 结构：Attention（Hero 封面图 + 模糊背景头部）→ Interest（信息网格 + 评分）→ Desire（媒体画廊 + 评论）→ Action（获取资源 CTA）
  - [x] 10.2 实现 NestedScrollView + SliverAppBar.medium（GSAP ScrollTrigger pin 等效：左侧固定标题，右侧内容滚动）
  - [x] 10.3 实现模糊背景头部（照搬 Kazumi _InfoHeaderBackground：downsample + blur + 渐变遮罩）
  - [x] 10.4 实现媒体画廊：PageView 横向滑动查看截图
  - [x] 10.5 实现评分组件：星级 + 百分比条（参考 Kazumi BangumiInfoCardV 的 flutter_rating_bar）
  - [x] 10.6 实现信息网格：大小/日期/语言/平台等
  - [x] 10.7 实现资源下载区：版本列表 + 锁定状态
  - [x] 10.8 实现评论交流区：评论列表 + 输入框
  - [x] 10.9 实现分层入场动画（detail-stagger-layer 等效 + GSAP Card Stacking 等效）

- [x] Task 11: 搜索页完整实现
  - [x] 11.1 创建 `lib/features/search/pinyin_search.dart`：拼音索引 + 模糊匹配（移植 pinyin-pro 逻辑）
  - [x] 11.2 实现 SearchScreen：搜索栏 + 排序/筛选 + 结果列表 + 分页
  - [x] 11.3 实现部分刷新（仅更新结果列表，不重建整个页面）
  - [x] 11.4 实现空状态/网络错误/骨架屏（照搬 Kazumi Skeletonizer）

- [x] Task 12: 分类页完整实现
  - [x] 12.1 实现 CategoryScreen：6 个分类卡片网格
  - [x] 12.2 实现分类点击导航到对应筛选结果

- [x] Task 13: 个人页完整实现
  - [x] 13.1 实现未登录状态：邮箱→密码→人机验证流程
  - [x] 13.2 实现已登录状态：用户头像 + 信息 + 菜单列表
  - [x] 13.3 实现退出登录

## Phase 4: GSAP 级动效打磨

- [x] Task 14: Hero 共享元素过渡（照搬 Kazumi）
  - [x] 14.1 实现 GameCard → DetailScreen 的 Hero 过渡（照搬 Kazumi flightShuttleBuilder）
  - [x] 14.2 实现返回时的 Hero 逆过渡
  - [x] 14.3 处理列表滚动时 Hero tag 定位问题（照搬 Kazumi transitionOnUserGestures: true）

- [x] Task 15: 滚动驱动动效（GSAP ScrollTrigger 等效）
  - [x] 15.1 实现图片缩放淡入滚动效果（NotificationListener + Transform.scale + AnimatedOpacity）
  - [x] 15.2 实现文字逐字揭示滚动效果（flutter_animate + SlideTransition + 交错延迟）
  - [x] 15.3 实现卡片交错入场（staggerDelay + flutter_animate）
  - [x] 15.4 实现页面切换过渡动画

- [x] Task 16: 轮播图动画（参考 GameCarousel.tsx）
  - [x] 16.1 实现 Ken Burns 效果（scale + translate 动画）
  - [x] 16.2 实现内容交错入场（accent line → subtitle → title → desc → CTA）
  - [x] 16.3 实现方向感知切换动画
  - [x] 16.4 实现自动播放 + 鼠标悬停暂停（Web 端）

- [x] Task 17: 高端排版与间距（gpt-taste 规范）
  - [x] 17.1 配置高端字体栈（Satoshi / Cabinet Grotesk / Outfit / Geist via google_fonts）
  - [x] 17.2 实现电影级区域间距（SizedBox(height: 128/192)）
  - [x] 17.3 确保 H1 标题不超过 2-3 行（maxLines: 2 + 大字号）
  - [x] 17.4 确保卡片网格无空缺角落（SliverGrid + 密集布局验证）

## Phase 5: 部署与验证

- [x] Task 18: Web 构建与部署
  - [x] 18.1 配置 Cloudflare Pages 部署：build/web/ 目录
  - [x] 18.2 配置 _headers 文件（安全头）
  - [x] 18.3 验证线上环境功能正常

- [x] Task 19: 端到端验证
  - [x] 19.1 验证所有页面渲染正确
  - [x] 19.2 验证 Hero 过渡动画流畅（照搬 Kazumi 模式）
  - [x] 19.3 验证 GSAP 级滚动动效（图片缩放淡入、文字揭示、卡片交错）
  - [x] 19.4 验证搜索功能（拼音 + 关键词）
  - [x] 19.5 验证亮/暗主题切换
  - [x] 19.6 验证认证流程
  - [x] 19.7 验证 API 降级到本地数据
  - [x] 19.8 验证 AIDA 结构完整性（每个页面有 Attention/Interest/Desire/Action）
  - [x] 19.9 验证排版规范（无 6 行标题、无空白网格、无便宜元标签）

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4-8] depend on [Task 3]（需要页面骨架）
- [Task 9-13] depend on [Task 4-8]（需要共享组件）
- [Task 14-17] depend on [Task 9-10]（需要页面实现）
- [Task 18-19] depend on [Task 14-17]（需要完整功能）
