# NiypherGal 全项目 Flutter 转换 Spec

## Why
当前 Web SPA 项目（vanilla JS + Vite + Cloudflare Pages）积累了 30+ 模块、复杂的 DOM 操作和动画竞争问题，维护成本高且难以扩展到移动端。转为 Flutter 可实现一套代码多端运行（Android/iOS/Web），同时已有 Flutter 骨架代码（数据模型、路由、主题、Provider）可复用。

## 现状分析

### Web 项目规模
| 维度 | 数量 |
|------|------|
| JS 模块 | ~30 个（src/js/modules/） |
| 页面 | 6 个（home/detail/category/galgame/search/profile） |
| CSS 行数 | ~5000 行（styles.css + tokens.css） |
| 游戏数据 | 42 条硬编码资源 |
| API 端点 | 8 个（Cloudflare Workers + D1） |

### 已有 Flutter 骨架
| 文件 | 状态 |
|------|------|
| `lib/main.dart` | ✅ 入口点，ProviderScope |
| `lib/app.dart` | ✅ MaterialApp.router + 主题切换 |
| `lib/core/router.dart` | ✅ GoRouter 6 路由（占位页面） |
| `lib/core/theme.dart` | ✅ 亮/暗主题 + glassmorphism 辅助函数 |
| `lib/core/constants.dart` | ✅ 常量定义 |
| `lib/core/motion.dart` | ✅ 动效时长/曲线 |
| `lib/data/models/*.dart` | ✅ Game/Carousel/Comment/User 模型 |
| `lib/data/providers.dart` | ✅ Riverpod Provider（游戏/轮播/主题/认证/UI） |
| `lib/data/remote/api_client.dart` | ✅ Dio + LRU 缓存 + JWT 拦截器 |
| `pubspec.yaml` | ✅ 依赖已配置 |

### 需要新建的页面/组件
| 页面/组件 | 复杂度 | 说明 |
|-----------|--------|------|
| 首页（HomeScreen） | 高 | 轮播图 + 游戏卡片网格 + 交错入场动画 |
| 详情页（DetailScreen） | 高 | Hero 飞行过渡 + 分层入场 + 媒体画廊 + 评分 + 下载 |
| 搜索页（SearchScreen） | 高 | 模糊拼音搜索 + 排序/筛选 + 分页 + 部分刷新 |
| 分类页（CategoryScreen） | 低 | 6 个分类卡片网格 |
| 个人页（ProfileScreen） | 中 | 登录/注册流程 + 用户信息 + 菜单列表 |
| 游戏卡片（GameCard） | 中 | 毛玻璃 + 图片懒加载 + 标签 + 点击涟漪 |
| 轮播图（CarouselWidget） | 高 | Ken Burns + AnimatePresence 等效 + 内容交错入场 |
| Docker 导航栏 | 中 | 底部导航 + 页面切换动画 |
| 搜索栏 | 中 | 顶部搜索栏 + 联想下拉 + 移动端适配 |
| 公告弹窗 | 低 | 模态框 + 图片 + 关闭按钮 |
| Hero 飞行动画 | 高 | 卡片→详情页共享元素过渡 |

## What Changes
- **BREAKING**: 用 Flutter 项目完全替代当前 Web SPA 项目
- 新建 6 个页面 Widget（HomeScreen/DetailScreen/CategoryScreen/GalgameScreen/SearchScreen/ProfileScreen）
- 新建共享组件（GameCard/CarouselWidget/BlurOverlay/SearchBar/AnnouncementModal/DockerNav）
- 新建 Hero 飞行过渡（Flutter Hero widget 原生支持共享元素过渡）
- 新建搜索模块（拼音索引 + 模糊匹配，移植 pinyin-pro 逻辑）
- 新建认证流程（邮箱→密码→人机验证，Turnstile 在 Flutter 中用 WebView 实现）
- 适配 API 层（已有 ApiClient，补充本地数据源）
- 新建 Web 构建配置（flutter build web + Cloudflare Pages 部署）
- 保留 API 后端不变（Cloudflare Workers + D1）

## Impact
- Affected code: 整个 `src/` 目录（Web 前端）将被 `lib/` 目录（Flutter）替代
- Affected infra: 构建流水线从 `npm run build` + Vite 变为 `flutter build web`；部署目标不变（Cloudflare Pages）
- API 后端（`api/`）完全不受影响
- 现有 `dist/` 目录将被 Flutter Web 构建产物替代

## 技术映射分析

### 路由
| Web | Flutter |
|-----|---------|
| 自定义 hash router + RouterStore | GoRouter（已配置） |
| `router.push('detail', {id: 101})` | `context.go('/detail?id=101')` |
| 滚动位置保存/恢复 | ScrollController + KeepAlive |
| popstate 监听 | GoRouter 自动处理 |

### 状态管理
| Web | Flutter |
|-----|---------|
| 自定义 createStore + 订阅 | Riverpod（已配置） |
| UserStore/AuthStore/RouterStore/ThemeStore/UIStore | 对应 StateNotifierProvider（已实现） |
| localStorage 持久化 | SharedPreferences（已集成） |
| 加密存储（crypto.js） | flutter_secure_storage |

### 动画
| Web | Flutter |
|-----|---------|
| Web Animations API（element.animate） | flutter_animate + 隐式/显式动画 |
| CSS transition + class 切换 | AnimatedContainer/AnimatedOpacity |
| Hero 飞行（手动 clone + 弧线 keyframes） | Hero widget（原生共享元素过渡） |
| 交错入场（--stagger-index + CSS delay） | staggerDelay() + flutter_animate |
| Ken Burns（scale + translate keyframes） | Transform + AnimationController |
| AnimatePresence 等效切换 | AnimatedSwitcher / PageTransition |

### UI 组件
| Web | Flutter |
|-----|---------|
| Tailwind CSS 类 | Flutter Widget 属性 |
| glass-card（backdrop-filter） | BackdropFilter + ClipRRect（已有 glassmorphism()） |
| Docker 导航栏（自定义 div） | BottomNavigationBar / NavigationBar |
| 搜索栏（input + 联想下拉） | TextField + Autocomplete |
| 轮播图（vanilla JS / React） | PageView + flutter_animate |
| 模态框（自定义 div + z-index） | showDialog() + BackdropFilter |
| 图片懒加载（IntersectionObserver） | cached_network_image（已集成） |
| 涟漪效果（自定义 JS） | InkWell（Material 原生） |

### 搜索
| Web | Flutter |
|-----|---------|
| pinyin-pro.js | 需移植或使用 lpinyin 包 |
| SearchIndex（倒排索引） | 需移植为 Dart 实现 |
| 模糊拼音匹配 | 同上 |
| Web Worker 异步搜索 | Isolate 或 compute() |

## ADDED Requirements

### Requirement: Flutter 多端应用
系统 SHALL 以 Flutter 框架重建，支持 Android、iOS 和 Web 三端。

#### Scenario: Web 端部署
- **WHEN** 执行 `flutter build web`
- **THEN** 生成可部署到 Cloudflare Pages 的静态文件

#### Scenario: Android 构建
- **WHEN** 执行 `flutter build apk`
- **THEN** 生成可安装的 APK 文件

### Requirement: Hero 共享元素过渡
游戏卡片到详情页 SHALL 使用 Flutter Hero widget 实现共享元素过渡动画。

#### Scenario: 卡片→详情页
- **WHEN** 用户点击游戏卡片
- **THEN** 卡片封面图通过 Hero 动画飞到详情页顶部，无闪烁

#### Scenario: 详情页→返回
- **WHEN** 用户点击返回按钮
- **THEN** 封面图通过 Hero 动画飞回原卡片位置

### Requirement: 毛玻璃设计系统
所有卡片和面板 SHALL 使用 BackdropFilter 实现毛玻璃效果，与当前 Web 版视觉效果一致。

#### Scenario: 亮色模式
- **WHEN** 主题为亮色
- **THEN** 卡片背景为 rgba(255,255,255,0.7) + blur(12px)

#### Scenario: 暗色模式
- **WHEN** 主题为暗色
- **THEN** 卡片背景为 rgba(0,0,0,0.45) + blur(12px)

### Requirement: 拼音搜索
搜索功能 SHALL 支持拼音首字母和全拼模糊匹配，与当前 Web 版搜索体验一致。

#### Scenario: 拼音首字母搜索
- **WHEN** 用户输入 "ys"
- **THEN** 匹配"原神"等游戏

#### Scenario: 全拼搜索
- **WHEN** 用户输入 "yuanshen"
- **THEN** 匹配"原神"

### Requirement: 轮播图组件
首页 SHALL 包含轮播图组件，视觉效果与 GameCarousel.tsx 源码一致。

#### Scenario: 自动播放
- **WHEN** 用户停留在首页
- **THEN** 轮播图每 6 秒自动切换，带 Ken Burns 效果和内容交错入场动画

#### Scenario: 手动切换
- **WHEN** 用户点击导航箭头或指示器
- **THEN** 切换动画方向感知，0.8s ease

### Requirement: 认证流程
个人页 SHALL 提供邮箱→密码→人机验证的注册/登录流程。

#### Scenario: 注册新用户
- **WHEN** 用户输入邮箱→设置密码→通过人机验证
- **THEN** 创建账户并自动登录

#### Scenario: 登录已有账户
- **WHEN** 用户输入邮箱→输入密码→通过人机验证
- **THEN** 登录成功，显示用户信息

### Requirement: 离线/降级数据
当 API 不可用时 SHALL 降级到本地硬编码数据。

#### Scenario: API 不可用
- **WHEN** 网络请求失败
- **THEN** 显示本地硬编码的游戏数据和轮播数据

## MODIFIED Requirements

### Requirement: 项目构建方式
原 `npm run build`（Vite）改为 `flutter build web`，部署流水线相应调整。

### Requirement: 部署产物
原 `dist/` 目录（Vite 产物）改为 `build/web/` 目录（Flutter Web 产物）。

## REMOVED Requirements

### Requirement: vanilla JS SPA 框架
**Reason**: 整体迁移到 Flutter，不再需要自定义 router/renderer/eventDelegation 等
**Migration**: 用 GoRouter + Riverpod + Flutter Widget 替代

### Requirement: CSS 动画系统
**Reason**: Flutter 使用自己的动画框架
**Migration**: 用 flutter_animate + Hero + AnimatedContainer 等替代

### Requirement: DOM 操作和事件委托
**Reason**: Flutter 使用声明式 UI，不需要直接操作 DOM
**Migration**: 用 Widget 树 + Riverpod 状态驱动替代

## 参考项目：Kazumi

Kazumi（`Kazumi-main/`）是一个成熟的 Flutter 番剧应用，其 UI 和动效模式可直接参考/照搬：

### 可直接照搬的模式
| 模式 | Kazumi 实现 | Niypher 对应 |
|------|-------------|-------------|
| **Hero 飞行过渡** | `Hero(tag: id, transitionOnUserGestures: true, flightShuttleBuilder: NetworkImgLayer.heroFlightShuttleBuilder)` | 游戏卡片→详情页的封面图飞行过渡，**建议直接照搬** |
| **导航框架** | `PageView.builder` + `NavigationBar`/`NavigationRail`（横竖屏自适应） | Docker 导航栏，**建议照搬横竖屏自适应逻辑** |
| **图片加载** | `NetworkImgLayer`（封装 `CachedNetworkImage` + 内存优化 + 占位符 + 圆角） | 游戏卡片图片，**建议照搬** |
| **卡片布局** | `SliverGrid` + 响应式列数（compact→3, medium→5, wide→6） | 游戏卡片网格，**建议照搬响应式逻辑** |
| **详情页头部** | `NestedScrollView` + `SliverAppBar.medium` + 模糊背景 + 渐变遮罩 | 详情页顶部封面图区域，**建议照搬** |
| **骨架屏** | `Skeletonizer` 包 | 加载状态占位，**建议照搬** |
| **评分组件** | `flutter_rating_bar` + `fl_chart` 柱状图 | 详情页评分区域，**可参考** |

### Hero 飞行过渡详细对照
Kazumi 的 Hero 实现（**建议直接照搬**）：
```dart
// 卡片端（bangumi_card.dart）
Hero(
  transitionOnUserGestures: true,
  flightShuttleBuilder: NetworkImgLayer.heroFlightShuttleBuilder,
  tag: bangumiItem.id,
  child: NetworkImgLayer(src: imageUrl, width: w, height: h),
)

// 详情页端（bangumi_info_card.dart）
Hero(
  transitionOnUserGestures: true,
  flightShuttleBuilder: NetworkImgLayer.heroFlightShuttleBuilder,
  tag: bangumiItem.id,
  child: NetworkImgLayer(src: imageUrl, width: w, height: h, fadeInDuration: Duration.zero),
)

// flightShuttleBuilder（network_img_layer.dart）
static Widget heroFlightShuttleBuilder(
  BuildContext flightContext,
  Animation<double> animation,
  HeroFlightDirection flightDirection,
  BuildContext fromHeroContext,
  BuildContext toHeroContext,
) {
  final fromHero = fromHeroContext.widget as Hero;
  final toHero = toHeroContext.widget as Hero;
  final heroContext = flightDirection == HeroFlightDirection.push
      ? fromHeroContext : toHeroContext;
  final hero = flightDirection == HeroFlightDirection.push ? fromHero : toHero;
  return InheritedTheme.captureAll(heroContext,
    Material(type: MaterialType.transparency, child: hero.child),
  );
}
```

### 轮播图参考
`游戏网站首页轮播图设计.zip` 中的 GameCarousel.tsx 提供轮播图视觉参考：
- Ken Burns 效果（scale 1.08→1.0 + x 偏移）
- 对角线装饰（clipPath + 滑入动画）
- 多层径向渐变遮罩
- 内容交错入场（accent line → subtitle → title → desc → CTA）
- 方向感知切换（cubic-bezier 0.8s）

## 高端动效设计规范（gpt-taste / GSAP 级别）

基于 gpt-taste 技能的 AIDA 设计原则，将 GSAP 级别的动效质量映射到 Flutter 实现：

### AIDA 页面结构
每个页面 SHALL 遵循 AIDA 框架：
- **Attention（首屏）**：轮播图/大图 Hero 区域，电影级视觉冲击
- **Interest（内容）**：高密度卡片网格，数学精确的无缝 Bento 布局
- **Desire（沉浸）**：滚动驱动的视差效果、图片缩放淡入、文字逐字揭示
- **Action（操作）**：高对比度 CTA 按钮，清晰可点击

### Hero 区域铁律
- H1 标题 SHALL 不超过 2-3 行，使用 `maxLines: 2` + 大字号
- Hero 区域 SHALL 有巨大垂直间距（`SizedBox(height: 48)` 以上）
- Hero 区域 SHALL 有全出血背景图 + 暗色径向渐变遮罩

### 无缝网格
- 卡片网格 SHALL 使用 `SliverGrid` + `grid-flow-dense` 等效逻辑，无空缺角落
- 3-5 个精心设计的大卡片优于 8 个杂乱小卡片
- 卡片 SHALL 包含大图、密集排版或 CSS 效果的混合

### GSAP 级别动效映射到 Flutter
| GSAP 效果 | Flutter 等效 |
|-----------|-------------|
| ScrollTrigger pin（左侧固定，右侧滚动） | `SliverAppBar(pinned: true)` + `NestedScrollView` |
| Image Scale & Fade Scroll（scale 0.8→1.0 + opacity 滚动驱动） | `NotificationListener<ScrollNotification>` + `Transform.scale` + `AnimatedOpacity` |
| Scrubbing Text Reveals（文字逐字 opacity 0.1→1.0） | `flutter_animate` + `SlideTransition` + 交错延迟 |
| Card Stacking（卡片从底部堆叠） | `PageView` + `Transform.translate` + `AnimatedBuilder` |
| Hover Physics（scale 1.05 + duration 700ms ease-out） | `InkWell` + `AnimatedScale(scale: 1.05, duration: 700ms, curve: Curves.easeOut)` |
| Infinite Marquee | `ListView.builder` + `ScrollController` + 循环数据 |
| Horizontal Accordion | `AnimatedContainer` + `GestureDetector` + `Flex` 扩展 |

### 排版与间距
- 字体栈 SHALL 使用高端字体（Satoshi / Cabinet Grotesk / Outfit / Geist），**禁止 Inter**
- 标题 SHALL 使用 `clamp(3rem, 5vw, 5.5rem)` 等效的 `TextStyle(fontSize: MediaQuery.textScalerOf(context).clamp(minScaleFactor: 0.8, maxScaleFactor: 1.5))` 
- 各主要区域间 SHALL 有巨大垂直间距（`py-32 md:py-48` 等效为 `SizedBox(height: 128/192)`）
- 区域间 SHALL 感觉像独立的电影章节

### 严格禁止
- **禁止** 6 行以上换行的窄标题
- **禁止** 网格中的空白角落
- **禁止** 便宜的元标签（"SECTION 01"、"QUESTION 05"）
- **禁止** 不可见的按钮文字
- **禁止** 静态无动效的界面
- **禁止** 左右布局无限重复

## 风险与挑战

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| Flutter Web 首屏加载慢 | 用户体验 | 使用 deferred components + tree shaking |
| Turnstile 人机验证在 Flutter 中实现复杂 | 认证流程 | 用 WebView 嵌入或替换为 reCAPTCHA |
| 毛玻璃效果在低端设备性能差 | 流畅度 | 提供降级方案（纯色背景） |
| 拼音搜索库生态不如 JS | 搜索体验 | 移植 pinyin-pro 逻辑为纯 Dart |
| Hero 动画在列表滚动时定位不准 | 视觉效果 | 照搬 Kazumi 的 flightShuttleBuilder + GlobalKey |
| Flutter Web SEO 不如 SSR | 搜索引擎 | 游戏资源站不依赖 SEO，可接受 |
