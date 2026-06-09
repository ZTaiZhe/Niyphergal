# Tasks

- [x] Task 1: 重写 `animationHelpers.js` 的 `performHeroNavigate` 函数
  - [x] 1.1 移除 `transform: translate() scale()` 方案，改用 `clone.animate()` 直接属性动画
  - [x] 1.2 keyframes 从 `(fromRect.left, fromRect.top, fromRect.width, fromRect.height)` 到 `(toRect.left, toRect.top, toRect.width, toRect.height)`
  - [x] 1.3 用 `animation.onfinish` 替代 `transitionend` + `setTimeout(finish, 500)`
  - [x] 1.4 添加 600ms 超时兜底：`animation.cancel()` + 降级显示
  - [x] 1.5 添加 `Element.prototype.animate` 不存在时的降级路径
  - [x] 1.6 clone 初始样式添加 `will-change: left, top, width, height, border-radius`（移至 CSS .hero-clone 类）
  - [x] 1.7 clone 初始样式添加 `object-fit: cover`（从 fromStyle 读取）
  - [x] 1.8 移除所有 `clone.style.transform` 和 `clone.style.transition` 相关代码
  - [x] 1.9 添加 `clone.className = 'hero-clone'` 使 CSS 类生效，inline 样式仅保留动态定位属性
  - **验证**: ✅ animationHelpers.js 中无 transform、transitionend、transition 关键字

- [x] Task 2: 更新 CSS `.hero-clone` 规则
  - [x] 2.1 添加 `will-change: left, top, width, height, border-radius`
  - [x] 2.2 移除硬编码 `border-radius: 0.75rem`（改为 JS 动态设置）
  - [x] 2.3 统一 z-index 为 9999
  - **验证**: ✅ .hero-clone 规则不含硬编码 border-radius

- [x] Task 3: 端到端验证
  - [x] 3.1 构建成功
  - [x] 3.2 部署成功
  - **验证**: ✅ https://0a52a53e.niyphergal.pages.dev

# Task Dependencies
- Task 2 依赖 Task 1（CSS 规则需与 JS 配合）
- Task 3 依赖 Task 1 + Task 2
