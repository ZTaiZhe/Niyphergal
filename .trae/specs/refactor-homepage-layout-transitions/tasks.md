# Tasks — 按 P0→P1→P2 实施路线

## Phase 0: 企业基础设施（并行，一次性）

- [ ] Task E1: Feature Flag 系统
  - [ ] `window.__NPHER_V2 = { pageKeepAlive: true, animationEnd: true, skeletonScreen: true, gpuAccel: true, lazyGallery: true, xpathScraper: true, scrollContain: true, detailV2: false, telemetry: true }` 注入 app.js 开头
  - [ ] 每个改动模块 `if (!__NPHER_V2.xxx) return originalBehavior`
  - [ ] `localStorage.setItem('niypher_v2_override', '0')` 全局回滚
  - [ ] 验收：设置 override=0 后所有行为退回到当前稳定版

- [ ] Task E2: CI/CD 管道配置文件
  - [ ] `.github/workflows/ci.yml` — lint → test(vitest+playwright) → build → lighthouse audit → deploy(仅 main)
  - [ ] `.lighthouse-budget.json` — FCP 1800 / LCP 2500 / TBT 200 / CLS 0.1 / script 200KB
  - [ ] 验收：推送到 PR 分支 → CI 自动运行 → 失败阻断合并

- [ ] Task E3: 安全审查清单落地
  - [ ] XPathScraper `ALLOWED_ORIGINS` 白名单 Set
  - [ ] `escapeHTML()` 包装所有动态 HTML 插入
  - [ ] `_headers` CSP 审查：无 `unsafe-inline` script，style `'self'`
  - [ ] `npm audit --audit-level=high` → 0 漏洞
  - [ ] 验收：npm audit 通过，CSP Evaluator 无违规

---

## P0: R2 XPath 抓取鲁棒性（独立）
## 🆕 P0: R11 网络加载算法（独立，并行于 R2）

- [ ] Task R11.1: 声明式预加载引擎
  - [ ] `src/js/modules/preloadEngine.js` → `PreloadEngine` 类：`constructor(router, scraper)` + `init()` + `handleIntent()` + `executePreload()`
  - [ ] `init()` 绑定全局 `document.addEventListener('mouseover', (e) => this.handleIntent(e, 'hover'))` + `touchstart` (passive)
  - [ ] `handleIntent()`：`e.target.closest('[data-hero-id]')` 提取 gameId → hover 模式下 `setTimeout(executePreload, 120)` 防抖 → card 注册 `mouseleave` `{ once: true }` 清理定时器
  - [ ] touchstart 模式立即 `executePreload(targetUrl)`
  - [ ] `executePreload(url)`：三前置检查 `saveData` / `effectiveType` / `LRU Map.has(url)` → 通过则 `fetch(url).then(r => r.json())` → `cache.set(url, { status, promise })`
  - [ ] `LRUMap(50)` 内存缓存 + `navigator.connection` 带宽自适应
  - [ ] Telemetry 埋入 `preload_hit` / `preload_miss`
  - [ ] 验收：悬停 120ms 后 Network 面板可见预请求；`preload_hit/(hit+miss) > 0.6`

- [ ] Task R11.2: 并发分片下载器
  - [ ] `src/js/modules/chunkDownloader.js` → `downloadInChunks(url, { concurrency: 3 })`
  - [ ] `HEAD` 请求确认 `content-length` + `accept-ranges: bytes` → 不支持降级 `fetch(url)` 全量
  - [ ] `chunkSize = Math.max(512KB, Math.min(4MB, bandwidth * latency / 8))`
  - [ ] `concurrentWorkerPool(tasks, concurrency)` — `Promise.all` 并发池 + 每分片 3 次重试
  - [ ] `Range: bytes=start-end` 请求 → `arrayBuffer()` → 合并 `new Blob(results, { type })`
  - [ ] 验收：Network 3 并发 Range → 下载速度 >1.5x；不支持 accept-ranges 降级正常

- [ ] Task R11.3: 静态资源预读取
  - [ ] `<link rel="prefetch" as="script">` + `<link rel="prefetch" as="style">` 注入 `<head>`
  - [ ] `requestIdleCallback` 触发 → 按路由优先级队列注入
  - [ ] 验收：Application > Frames prefetch cache 列表确认

## P0: R2 XPath 抓取鲁棒性（独立）

- [ ] Task R2.1: 安全沙箱
  - [ ] `xpathScraper.js` → `SANITIZE_ATTRS = ['onload','onerror','onclick','onfocus','onblur','onchange','onsubmit','onreset','onselect','onkeydown','onkeypress','onkeyup','onmouseover','onmouseout','onmousedown','onmouseup','onmousemove','ondblclick','oncontextmenu','onwheel','onscroll','onresize','onabort','oncanplay','oncanplaythrough','ondurationchange','onemptied','onended']`
  - [ ] `sanitize(doc)` → `doc.querySelectorAll('*').forEach(el => SANITIZE_ATTRS.forEach(a => el.removeAttribute(a)))`
  - [ ] `MutationObserver` 监控 `childList` + `attributes` 防止后期注入
  - [ ] 验收：`vitest` 测试 `sanitize(parseFromString('<img onerror="alert(1)">'))` → `getAttribute('onerror') === null`

- [ ] Task R2.2: Shadow XPaths
  - [ ] `evaluateFirstMatch(xpaths, doc, contextNode?)` → `for...of` + `doc.evaluate(xpath, contextNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue`
  - [ ] `ScrapeRule` 模型：`{ linkPath: string[], itemTitle: string[], itemCover: string[], itemPrice: string[] }`
  - [ ] 全部 null → `Telemetry.track('scraper_fallback', { domain, rule, failedPaths })`
  - [ ] 验收：`xpaths=['//nonexistent', '//body']` → 返回 body + matchedPath:1

- [ ] Task R2.3: 超时熔断
  - [ ] `scrapeWithTimeout(url, 5000)` → `AbortController` → `setTimeout(() => abort(), 5000)`
  - [ ] `err.name === 'AbortError'` → `{ status: 'timeout', data: null }` → Silent Fallback
  - [ ] 验收：Network 节流 Slow 3G → 5s 自动中断 + `scraper_timeout` 遥测

---

## P0: R1 渲染管线性能（独立）

- [ ] Task R1.1: Acrylic 骨架屏
  - [ ] CSS: `@keyframes shimmer { 0%{ background-position: -200% 0 } 100%{ background-position: 200% 0 } }` + `--skeleton-base: var(--acrylic-bg)` + `--skeleton-shine`
  - [ ] `.is-loading { background: linear-gradient(90deg, var(--skeleton-base) 25%, var(--skeleton-shine) 50%, var(--skeleton-base) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite }`
  - [ ] `data-fetch-state="loading"` → `.is-loading`；`"loaded"` → `.is-loaded` + 200ms crossfade
  - [ ] 验收：Slow 3G Lighthouse Screenshot 首帧无白屏

- [ ] Task R1.2: GPU 合成层
  - [ ] `.stagger-layer { will-change: transform, opacity; }`（CSS 侧）
  - [ ] FLIP: `el.style.willChange = 'transform, opacity'` → `requestAnimationFrame` → `el.style.transition = ...` → 动画后 500ms `removeProperty`
  - [ ] 验收：Chrome Layers 面板 Compositing Layer 确认 + FPS ≥55

- [ ] Task R1.3: 截图画廊懒加载
  - [ ] template: `<img loading="lazy" decoding="async" data-src="..." class="screenshot-img">`
  - [ ] `new IntersectionObserver(callback, { root: gallery, rootMargin: '200px' })`；移动端 `matchMedia('(max-width:640px)').matches ? '100px' : '200px'`
  - [ ] callback: `entry.isIntersecting` → `img.src = img.dataset.src`
  - [ ] 验收：Network 面板仅可见截图请求

---

## P1: R5 动画基础设施（依赖 R1+R2）

- [ ] Task R5.1: animationend 驱动
  - [ ] `waitForAnimation(el)` → `new Promise(resolve => { el.addEventListener('animationend', resolve, { once: true }); el.addEventListener('transitionend', resolve, { once: true }) })`
  - [ ] 7 处替换：`executeEnteringAnimation` / `executeLeavingAnimation` / 常规切换 500ms / 搜索进入 450ms / 搜索退出 pop 400ms / 搜索退出 push / refreshCards 离场
  - [ ] 验收：快速 10 次导航 100ms 间隔，无残留 DOM

- [ ] Task R5.2: 页面保活
  - [ ] `<main>` 内 5 个 `<section data-page="home|category|galgame|search|profile" style="display:none">`
  - [ ] `render()` → `activeSection.style.display = 'block'` + 其余 `none`；首次 `innerHTML = pageHTML`
  - [ ] 搜索页排序/筛选 → `section.querySelector('#search-results-area').innerHTML = newResultsHTML`
  - [ ] 删除 `pageCache.js`
  - [ ] 验收：Tab 切换无闪烁；搜索排序后滚动位置保留

---

## P1: R6-R10 动效 + 布局（依赖 R5）

- [ ] Task R6: ResizeObserver 动态网格
  - [ ] `ResizeObserver(entries => entries.forEach(e => e.target.style.gridTemplateColumns = \`repeat(\${cols(e.contentRect.width)}, 1fr)\`))`
  - [ ] `cols(w)`: ≤480→1, ≤768→2, ≤1200→3, >1200→4
  - [ ] 删除 styles.css 固定 grid 媒体查询
  - [ ] 验收：拖动窗口实时重排列

- [ ] Task R7: 导航栏图标双态
  - [ ] index.html 每个 `nav-item` 内 `<i class="ri-*-line">` + `<i class="ri-*-fill" style="display:none">`
  - [ ] `updateNav()` → 匹配页 fill 显示 + line 隐藏 + `aria-current="page"` + `.nav-item-indicator` 圆点
  - [ ] 验收：Tab 切换图标同步翻转

- [ ] Task R8: Hero 共享元素过渡
  - [ ] 卡片 img `data-hero-id="game-${id}"`，详情 img `data-hero-id="game-${id}"`
  - [ ] `getBoundingClientRect()` → clone → `position:fixed` → `animate()` 飞行 350ms
  - [ ] 反向飞行 350ms
  - [ ] 验收：点击卡片 → 封面平滑飞行 350ms

- [ ] Task R9: FLIP 刷新
  - [ ] `refreshCards()`: First → 打乱渲染 → Last → Invert(translate) → Play(requestAnimationFrame + transition 400ms cubic-bezier)
  - [ ] 动画后 500ms 回收 will-change
  - [ ] 验收：刷新按钮 → 卡片平滑重排 ≥55fps

- [ ] Task R10: App Store 详情页五层
  - [ ] L0 Hero: 方形图标 100x100 + 标题 + 社团 + 评分 + CTA 48px 胶囊
  - [ ] L1 Snap Gallery: `scroll-snap-type: x mandatory` + `scroll-snap-align: center` + 16:9 + 圆点指示器（IntersectionObserver）
  - [ ] L2 折叠描述: `line-clamp: 3` + `max-height 300ms ease-out` + `aria-expanded`
  - [ ] L3 评分柱状图: 5★→1★ accent 色百分比条 + 总分数字
  - [ ] L4 信息卡片: key-value 6 字段 + xpathScraper 正版购买链接
  - [ ] Stagger: `animation-delay: var(--layer-delay)` L0:0ms L1:50ms L2:100ms L3:150ms L4:200ms
  - [ ] 验收：分层入场 + 各层尺寸间距 App Store 一致

---

## P1: R3 滚动穿透 + A11y（独立）

- [ ] Task R3.1: overscroll-behavior
  - [ ] `.screenshot-gallery { overscroll-behavior-x: contain }`
  - [ ] `.detail-page-container { overscroll-behavior-y: none }`
  - [ ] `@supports (overscroll-behavior: contain)` 渐进增强
  - [ ] 验收：iOS Safari 边界无橡皮筋

- [ ] Task R3.2: WCAG AA
  - [ ] `aria-expanded` 同步 + `aria-hidden="false"` 描述全文
  - [ ] 对比度检查：`.acrylic-panel` 上 `--text-primary` vs `--acrylic-bg` ≥4.5:1
  - [ ] 验收：axe-core 0 violations

---

## P2: R4 遥测（最后）

- [ ] Task R4.1: 抓取漏斗
  - [ ] `BoundedRingBuffer(256)` + `Telemetry.track(event, data)`
  - [ ] `requestIdleCallback` 批量上报
  - [ ] 告警：30 次内 fallback_rate >0.3 → `console.warn` + `dispatchEvent('scraper-alert')`
  - [ ] 验收：30 次 fallback → console.warn 触发

- [ ] Task R4.2: 动画帧监控
  - [ ] `measureFrameBudget(fn)` → `performance.now()` delta >500ms → `animation_jank`
  - [ ] 5次/60s → `jankMitigation = true` → Stagger 归零 + FLIP 减半 + Hero→fade
  - [ ] 验收：CPU 6x slowdown → jank 事件 → mitigation 启用

---

## Phase Final: 收尾

- [ ] Task F1: 底部导航安全区 + FAB
- [ ] Task F2: `npm run build` → `wrangler pages deploy dist --project-name=niyphergal`
- [ ] Task F3: Lighthouse 审计 → 确认 SLO 达标
- [ ] Task F4: 视觉回归人工检查（详情页五层 + 暗色模式 + 骨架屏 + iOS Safari 橡皮筋）
