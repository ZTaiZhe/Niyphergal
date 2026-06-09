# Tasks

- [x] Task 1: 建立 `data-hero-role` 标记体系
  - [x] `detail.js` L31 `data-hero-role="detail-hero"` → `data-hero-role="target"`
  - [x] `detail.js` 五个 `.detail-stagger-layer` 各添加 `data-hero-role="reveal-group"`（含 L1）
  - [x] `components.js` `renderGameCard` 封面 `<img>` 添加 `data-hero-role="source"`
  - [x] `home.js` `buildRecommendationRow` 推荐卡片 `.recommendation-cover` 添加 `data-hero-role="source"`
  - **验证**: ✅ target=1处, reveal-group=5处, source≥2处

- [x] Task 2: 重写 `animationHelpers.js`
  - [x] 删除 `doHeroTransition`
  - [x] 新 `performHeroNavigate`: `_heroInFlight` 防双击 + `data-src` fallback + `detail:rendered` 事件 + 动态 `getComputedStyle` + 800ms/500ms 双超时
  - [x] 零硬编码选择器（仅 `[data-hero-role="target"]`）
  - **验证**: ✅ animationHelpers.js 中无 CSS 类名字面量

- [x] Task 3: `detail.js` 改造
  - [x] `animate-fade-in` 已删除，根容器 `visibility:hidden`
  - [x] `revealDetailContent()` 导出
  - [x] `setHeroTransition`/`getHeroTransition` flag 导出
  - [x] `_bindDescToggle()` 共享函数防重复绑定
  - **验证**: ✅ 0 个 animate-fade-in, 6 个 data-hero-role

- [x] Task 4: `renderer.js` detail 分支
  - [x] `isDetailTransition` 跳过 `page-transition-container`
  - [x] `injectSection` 后派发 `detail:rendered`
  - [x] `!getHeroTransition()` 时调 `initDetailAnimations()`
  - **验证**: ✅ detail 不走过渡动画容器

- [x] Task 5: `eventDelegation.js`
  - [x] `navigate-detail` 用 `[data-hero-role="source"]` 查找
  - [x] 有源→`performHeroNavigate`；无源/超时→普通导航
  - **验证**: ✅ import setHeroTransition + performHeroNavigate

- [x] Task 6: CSS
  - [x] `.detail-stagger-layer` 移除 `opacity:0`（仅 `transform: translateY(20px)`）
  - [x] 无并发 CSS animation
  - **验证**: ✅ .detail-stagger-layer 规则仅 2 条（base + .is-visible）
