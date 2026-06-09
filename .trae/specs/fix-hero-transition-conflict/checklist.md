# Checklist

## Task 1: data-hero-role 标记
- [x] `.detail-hero-img` 含 `data-hero-role="target"`
- [x] 5 个 `.detail-stagger-layer` 各含 `data-hero-role="reveal-group"`
- [x] `renderGameCard` 封面 `<img>` 含 `data-hero-role="source"`
- [x] 推荐卡片 `.recommendation-cover` 含 `data-hero-role="source"`
- [x] 改名/移动 Hero 元素后不需修改 animationHelpers.js

## Task 2: performHeroNavigate 五步+防护
- [x] `doHeroTransition` 已删除，`performHeroNavigate` 已重写
- [x] `_heroInFlight` 防护正常：飞行中第二次点击被忽略
- [x] `data-src` fallback 保护 lazy-load 占位符
- [x] `detail:rendered` 事件接收后查询 `[data-hero-role="target"]`
- [x] `targetImg` 不存在时降级移除 clone
- [x] clone 的 borderRadius/objectFit 从目标 `getComputedStyle` 动态读取
- [x] `translate(dx,dy) scale(sx,sy)` 计算正确
- [x] transitionend 或 500ms fallback 后 clone 被移除
- [x] clone 移除后调用 `revealDetailContent()`
- [x] `_heroInFlight` 最终 reset 为 false
- [x] 800ms 超时未收到 `detail:rendered` 时降级
- [x] animationHelpers.js 零硬编码 CSS 类名

## Task 3: detail.js 飞行兼容
- [x] 模板无 `animate-fade-in`
- [x] 根容器初始 `visibility:hidden`
- [x] `revealDetailContent()` 设 `visibility:visible` + 触发 stagger
- [x] `setHeroTransition(false)` 时直接以 `visibility:visible` 渲染
- [x] `_bindDescToggle()` 防重复绑定（`_descToggleBound` guard）
- [x] URL 直入时立即可见

## Task 4: renderer.js detail 分支
- [x] detail 不经过 `page-transition-container`
- [x] `injectSection` 后派发 `detail:rendered` 事件
- [x] 非 Hero 飞行时调用 `initDetailAnimations()`
- [x] 无副作用影响其他页面过渡

## Task 5: eventDelegation.js
- [x] `navigate-detail` 用 `[data-hero-role="source"]` 查找
- [x] 有源 → performHeroNavigate；无源/超时 → 普通导航
- [x] setHeroTransition import 正常

## Task 6: CSS
- [x] `.detail-stagger-layer` 无默认 `opacity:0`
- [x] 飞行期间无并发动画
- [x] 布局重构后仅需保留 `data-hero-role` 属性
