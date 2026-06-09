# Checklist

## Task 1: performHeroNavigate 重写
- [x] `clone.animate()` 使用 `left/top/width/height` keyframes，无 `transform`
- [x] `animation.onfinish` 替代 `transitionend` + `setTimeout`
- [x] 600ms 超时兜底调用 `animation.cancel()` + 降级显示
- [x] `Element.prototype.animate` 不存在时降级为无动画直接显示
- [x] clone 初始样式含 `will-change: left, top, width, height, border-radius`（通过 CSS .hero-clone 类）
- [x] clone 初始样式含 `object-fit`（从 fromStyle 读取）
- [x] 无 `clone.style.transform` / `clone.style.transition` 代码
- [x] `_heroInFlight` 防重复点击正常
- [x] `detail:rendered` 事件监听正常
- [x] 800ms 超时未收到 `detail:rendered` 时降级
- [x] `clone.className = 'hero-clone'` 使 CSS 类生效
- [x] inline 样式仅保留动态定位属性（left/top/width/height/object-fit/border-radius/margin）

## Task 2: CSS .hero-clone 规则
- [x] `.hero-clone` 含 `will-change: left, top, width, height, border-radius`
- [x] `.hero-clone` 无硬编码 `border-radius` 值
- [x] `.hero-clone` 保留 `position: fixed; z-index: 9999; pointer-events: none; overflow: hidden; box-shadow`

## Task 3: 端到端验证
- [x] 构建成功（vite build 0 errors）
- [x] 部署成功（Cloudflare Pages）
