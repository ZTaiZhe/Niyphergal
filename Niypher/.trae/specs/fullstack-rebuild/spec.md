# NiypherGal Flutter 全端重建 Spec

## Why
当前项目存在 Flutter 版（`flutter_niypher/`，未完成）和 React 版（`src/js/`，已上线）两套代码。需要：
1. 移除旧 Flutter 版本，以 React 版 UI/动效为蓝本用 Flutter 重写
2. 重构逻辑层（不照搬 React 代码和注释，理解后重新设计）
3. 添加后端 API 预留层（Cloudflare Workers + D1），接入 CF 服务做可迁移的调试
4. 在新 Flutter 版完善前保留 React 版作为参考和回退

## What Changes
- **移除** `flutter_niypher/`（旧 Flutter 版）
- **保留** `src/js/`（React 版）和 `src/css/`（React 样式）作为参考，Flutter 版完善后再移除
- **保留** `flutter/` SDK 目录（构建依赖）
- **修改** `wrangler.toml` 构建输出：Flutter 版完善前仍指向 `dist/`（React 构建），完善后切换到 Flutter Web 构建
- **新增** Flutter 项目（`lib/`），以 React 版 UI/动效为蓝本重写
- **保留** UI 设计语言：毛玻璃（Glassmorphism）、品牌色（玫红 #FE007F）、动画令牌
- **保留** 动效系统：方向感知路由过渡、卡片 stagger、轮播 Ken Burns、Hero 缩放淡入
- **新增** Cloudflare Workers API 后端（预留为主，可迁移）
- **新增** D1 数据库 schema + 数据迁移脚本
- **新增** 认证系统骨架（注册/登录/JWT，预留接口）
- **新增** Flutter API 客户端层（支持 fallback 到本地数据）
- **BREAKING** 前端技术栈从 React 迁移到 Flutter（渐进式，React 版保留至 Flutter 版完善）

## Impact
- Affected code: 新增 Flutter 项目（`lib/`），React 版暂保留
- Affected infra: Cloudflare Pages 部署配置暂不变（仍部署 React 版），Flutter 版完善后切换
- 删除: `flutter_niypher/`（旧 Flutter 版）、`Kazumi-main/`、根目录无关文件
- 保留: `src/js/`、`src/css/`、`flutter/` SDK、React 构建配置

---

## ADDED Requirements

### Requirement: 移除旧 Flutter 版本（保留 React 版）
系统 SHALL 移除旧 Flutter 版本代码，保留 React 版作为参考。

#### Scenario: 清理旧代码
- **WHEN** 执行此 spec
- **THEN** `flutter_niypher/` 目录被删除（旧 Flutter 版）
- **THEN** `Kazumi-main/` 目录被删除
- **THEN** 根目录无关文件被清理（zip 包、临时测试文件、temp_carousel/ 等）
- **THEN** `src/js/` 和 `src/css/` 保留（React 版，作为 UI/动效参考和回退）
- **THEN** `wrangler.toml` 暂不修改（仍部署 React 版），Flutter 版完善后再切换

---

### Requirement: Flutter 项目结构
系统 SHALL 创建清晰的 Flutter 项目结构。

#### Scenario: 目录结构
- **WHEN** 查看项目 `lib/` 目录
- **THEN** 结构如下：
  ```
  lib/
    main.dart              # 应用入口
    app.dart               # MaterialApp 配置（路由、主题、Provider）
    core/
      theme.dart           # 品牌色 + Material 3 主题
      router.dart          # GoRouter 路由配置
      constants.dart       # 常量配置
      motion.dart           # 动效令牌（duration/easing/variants）
    data/
      models/              # 数据模型（Game, CarouselSlide, User, Comment）
      repositories/         # Repository 接口
      local/               # 本地数据源（fallback）
      remote/              # 远程数据源（API 客户端）
    features/
      home/                # 首页（轮播图 + 卡片网格）
      detail/              # 详情页（Hero + 截图 + 评论）
      search/              # 搜索页（输入 + 筛选 + 分页）
      category/            # 分类页
      discover/            # 发现页（替代引力搜索）
      profile/             # 个人中心（注册/登录/已登录视图）
    widgets/               # 共享 UI 组件
      game_card.dart        # 游戏卡片
      game_carousel.dart    # 轮播图
      header.dart           # 顶部导航栏
      docker_nav.dart       # 底部导航栏
      mobile_search.dart    # 移动端搜索覆盖层
      image_viewer.dart     # 全屏图片查看器
      scroll_to_top.dart    # 回到顶部按钮
      theme_toggle.dart     # 主题切换按钮
      announcement_modal.dart # 公告弹窗
      glass_card.dart       # 毛玻璃容器
    services/               # 业务服务
      search_service.dart   # 搜索逻辑
      recommendation_service.dart # 推荐逻辑
      auth_service.dart     # 认证逻辑
  ```

#### Scenario: 技术栈
- **WHEN** 查看 `pubspec.yaml`
- **THEN** 核心依赖：
  - `flutter_riverpod: ^2.5+` — 状态管理
  - `go_router: ^14+` — 路由
  - `dio: ^5+` — 网络请求
  - `flutter_animate: ^4+` — 动画
  - `cached_network_image: ^3+` — 图片缓存
  - `shared_preferences: ^2+` — 轻量持久化
  - `pinyin_pro: ^1+` — 拼音搜索

---

### Requirement: UI 设计语言（从 React 版蓝本迁移）
系统 SHALL 复刻 React 版的全部 UI 设计语言到 Flutter。

#### Scenario: 毛玻璃效果
- **WHEN** 渲染 DockerNav、Header、搜索栏、卡片标签
- **THEN** 使用 `ClipRRect` + `BackdropFilter` + 半透明背景色
- **THEN** 亮色模式: `Colors.white.withOpacity(0.72)` + `ImageFilter.blur(sigmaX: 20, sigmaY: 20)`
- **THEN** 暗色模式: `Color(0xFF0D1216).withOpacity(0.72)` + `ImageFilter.blur(sigmaX: 20, sigmaY: 20)`

#### Scenario: 品牌色
- **WHEN** 渲染高亮、标签、CTA 按钮
- **THEN** 主色为玫红 `Color(0xFFFE007F)`
- **THEN** 辅助色为品红 `Color(0xFFE19CBB)`
- **THEN** 深色背景为 `Color(0xFF0D1216)`

#### Scenario: 卡片设计
- **WHEN** 渲染游戏卡片
- **THEN** 全覆盖封面图 + 底部渐变遮罩 + backdrop-blur
- **THEN** 标题带粉色高亮条动画（hover/tap 时 scaleX 0→1, 0.35s）
- **THEN** 底部毛玻璃标签

---

### Requirement: 动效系统（从 React 版蓝本迁移）
系统 SHALL 复刻 React 版的全部动效到 Flutter，使用 `motion.ts` 等价令牌。

#### Scenario: 动效令牌
- **WHEN** 实现任何动画
- **THEN** 使用 `core/motion.dart` 统一令牌：
  - duration: micro(150ms), short(250ms), medium(400ms), long(600ms)
  - easing: standard(Curves.easeInOutCubic), decel(Curves.decelerate), accel(Curves.accelerate), emphasis

#### Scenario: 页面过渡
- **WHEN** 路由切换
- **THEN** 方向感知过渡：前进 y:24→0→-24，后退 y:-24→0→24
- **THEN** 使用 GoRouter 的 `CustomTransitionPage` + `AnimatedBuilder`

#### Scenario: 卡片入场
- **WHEN** 首页/搜索页卡片渲染
- **THEN** stagger delay: `min(index * 0.05, 0.4)`s
- **THEN** opacity:0→1, y:20→0, duration 400ms, ease standard

#### Scenario: 轮播图
- **WHEN** 首页轮播切换
- **THEN** 方向感知滑动（环形最短路径）+ Ken Burns (10s) + 内容 stagger + 自动播放 6s
- **THEN** 使用 `flutter_animate` + `AnimatedBuilder`

#### Scenario: 详情页 Hero
- **WHEN** 进入详情页
- **THEN** Hero 图片: opacity:0→1, scale:0.95→1, 400ms standard easing
- **THEN** 5 层 stagger 入场: delay 100ms + i*80ms

#### Scenario: 减少动画偏好
- **WHEN** 用户系统设置减少动画
- **THEN** `MediaQuery.disableAnimations` 为 true 时禁用 Ken Burns、stagger delay
- **THEN** 动画时长截断为 short

---

### Requirement: 路由系统
系统 SHALL 使用 GoRouter 实现以下路由。

#### Scenario: 路由定义
- **WHEN** 应用启动
- **THEN** 以下路由可用：
  - `/` / `/home` — 首页
  - `/detail?id={id}` — 详情页
  - `/search` — 搜索页
  - `/category` — 分类页
  - `/discover` — 发现页（替代引力搜索）
  - `/profile` — 个人中心

#### Scenario: 路由过渡动画
- **WHEN** 页面切换
- **THEN** 前进: SlideTransition(y: 24→0) + FadeTransition
- **THEN** 后退: SlideTransition(y: -24→0) + FadeTransition

---

### Requirement: 状态管理
系统 SHALL 使用 Riverpod 进行状态管理。

#### Scenario: Provider 定义
- **WHEN** 组件需要读写状态
- **THEN** 使用以下 Provider：
  - `uiProvider` — UI 状态（公告、菜单、搜索、加载）
  - `themeProvider` — 主题状态（亮/暗/自动）
  - `userProvider` — 用户状态（登录、注册用户列表）
  - `authProvider` — 认证状态（步骤、邮箱、Turnstile）
  - `gamesProvider` — 游戏数据（从 API 或本地获取）
  - `carouselProvider` — 轮播数据
  - `searchProvider` — 搜索状态

---

### Requirement: Cloudflare Workers API 后端（预留为主）
系统 SHALL 提供 Cloudflare Workers API 后端，以预留接口为主，接入 CF 服务做可迁移的调试。

设计原则：
- **预留为主**：API 端点先定义接口和路由，核心逻辑可渐进实现
- **可迁移**：数据访问层抽象化，通过 repository 层隔离
- **CF 服务接入**：D1（数据库）、R2（图片存储）、Turnstile（人机验证）已接入
- **前后端解耦**：Flutter API 客户端层支持 fallback 到本地数据

#### Scenario: API 端点预留
- **WHEN** 前端请求数据
- **THEN** 以下端点可用：
  - `GET /api/games` — 游戏列表 ✅ 实现
  - `GET /api/games/:id` — 游戏详情 ✅ 实现
  - `GET /api/carousel` — 轮播数据 ✅ 实现
  - `GET /api/search` — 搜索 ✅ 实现
  - `POST /api/auth/register` — 注册 🔧 预留
  - `POST /api/auth/login` — 登录 🔧 预留
  - `POST /api/auth/refresh` — 刷新 token 🔧 预留
  - `GET /api/user/profile` — 用户信息 🔧 预留
  - `POST /api/comments` — 发表评论 🔧 预留
  - `GET /api/comments?gameId=` — 获取评论 🔧 预留

#### Scenario: 可迁移架构
- **WHEN** 需要迁移后端到其他平台
- **THEN** Workers handler 层仅做路由分发，业务逻辑在 service 层
- **THEN** 数据访问通过 repository 接口，D1 实现可替换

---

### Requirement: D1 数据库（可迁移）
系统 SHALL 使用 Cloudflare D1 存储结构化数据。

#### Scenario: 数据表
- **WHEN** Workers 启动
- **THEN** 以下表存在：
  - `games`, `game_versions`, `game_media`, `carousel_slides`, `users`, `comments`

#### Scenario: 数据迁移
- **WHEN** 首次部署
- **THEN** React 版 `data.js` 中的硬编码数据被迁移到 D1 数据库

---

### Requirement: 认证系统（预留骨架）
系统 SHALL 提供认证系统骨架。

#### Scenario: 注册/登录（预留）
- **WHEN** 用户提交邮箱和密码
- **THEN** 预留阶段返回 mock 成功响应
- **THEN** 后续实现：Turnstile 验证 + Argon2id 哈希 + JWT 签发

---

### Requirement: Flutter API 客户端层（fallback 本地数据）
系统 SHALL 在 Flutter 端提供统一的 API 客户端，支持 fallback 到本地数据。

#### Scenario: 请求流程
- **WHEN** 组件需要数据
- **THEN** 优先请求 Workers API（dio）
- **THEN** API 不可用时 fallback 到本地数据（`data/local/`）
- **THEN** 请求级缓存（内存 LRU，50 条, 5 分钟 TTL）

---

### Requirement: 搜索系统
系统 SHALL 在 Flutter 端实现搜索功能。

#### Scenario: 搜索流程
- **WHEN** 用户输入搜索关键词
- **THEN** 300ms 防抖后优先调用 `GET /api/search`
- **THEN** API 不可用时 fallback 到本地搜索（pinyin + fuzzyMatch）
- **THEN** 支持排序（默认/标题/日期）+ 筛选（标签）+ 分页

---

## MODIFIED Requirements

### Requirement: DockerNav
原版 DockerNav 的"引力搜索" tab 指向 `/galgame` 页面。Flutter 版改为：
- "引力搜索" tab 改为"发现"，指向 `/discover` 页面
- `/discover` 页面展示热门推荐 + 最近更新 + 随机推荐

### Requirement: ProfilePage
原版 ProfilePage 的注册/登录逻辑完全在前端。Flutter 版改为：
- 注册/登录改为调用后端 API（预留阶段 mock 响应）
- 移除前端密码哈希
- 保留 Turnstile 人机验证（Web 端通过 WebView 嵌入）
- JWT token 存储在 `shared_preferences`

### Requirement: 主题系统
原版主题系统有 `theme.js` 和 `useThemeStore` 并存。Flutter 版统一为：
- `themeProvider`（Riverpod）管理主题状态
- 保留基于时间的自动切换（6:00-18:00 亮色）
- Material 3 ColorScheme + 自定义 brand color

---

## REMOVED Requirements

### Requirement: 旧 Flutter 版本（flutter_niypher/）
**Reason**: 旧 Flutter 版本未完成，需删除后用新架构重写
**Migration**: React 源码作为 UI/动效蓝本参考

### Requirement: 旧版 JS 模块（Flutter 版完善后移除 React 版时生效）
**Reason**: `store.js`、`globals.js`、`navigation.js` 等 ~30 个旧版 JS 模块在 Flutter 版完善后随 React 版一起移除
**Migration**: 逻辑理解后用 Flutter/Dart 重新实现

### Requirement: 前端密码哈希
**Reason**: 安全实践要求密码哈希在服务端完成
**Migration**: 迁移到 Workers API 后端

### Requirement: CSS 样式系统
**Reason**: Flutter 使用 Widget 树渲染，不需要 CSS
**Migration**: 毛玻璃等视觉效果用 Flutter Widget 实现（BackdropFilter、ClipRRect 等）
