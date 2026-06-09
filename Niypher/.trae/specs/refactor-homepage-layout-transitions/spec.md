# NiypherGal v2.0 — 首页布局与页面切换动效重构 企业级技术规格

| 属性 | 值 |
|------|-----|
| 版本 | v5.0 (Final — 全栈企业规格) |
| 状态 | Ready for Implementation |
| 目标版本 | NiypherGal v2.0 |
| 兼容性 | 向后兼容，保留 `#ec4899`、acrylic/glassmorphism |
| 浏览器 | Chrome 90+, Firefox 90+, Safari 15.4+, Edge 90+ |
| 性能 SLO | FCP <1.8s, LCP <2.5s, CLS <0.1, TBT <200ms (Moto G4 4G) |
| 可用性 SLO | 99.9%（CDN 侧），客户端运行时错误率 <0.5% |
| 审批链 | Tech Lead → Security Review → QA Signoff |

---

## 1. 执行摘要

### 1.1 问题陈述
渲染管线存在 8 项技术债务，四项生产级缺失。网络层：SPA 串行阻塞加载。推荐层：无个性化召回。安全层：沙箱仅 27 种 on_* 初级防御，无 CSP、无防篡改。

### 1.2 解决方案
引入 7 层防御体系：**安全层**（白名单沙箱+CSP+防篡改）→ **推荐层**（余弦+Ebbinghaus）→ **网络层**（预加载+分片）→ **性能层**（骨架屏+GPU+懒加载）→ **鲁棒性层**（Shadow XPaths+熔断）→ **体验层**（App Store 五层+A11y）→ **可观测层**（遥测+Feature Flag）。

### 1.3 成功指标 (SLO)

| 指标 | 当前基线 | 目标值 | 测量方式 | 告警阈值 |
|------|---------|--------|---------|---------|
| 页面切换首帧 | 500ms (setTimeout) | <200ms | Performance API | >350ms P1 |
| 详情页 LCP | ~3s | <2.5s | Lighthouse CI | >3s P2 |
| 首页 FCP | ~2s | <1.5s | Lighthouse CI | >2.2s P2 |
| FLIP 刷新帧率 | 30fps (销毁) | 60fps | DevTools FPS | <45fps P2 |
| XPath 抓取存活率 | — | >90% | Telemetry 漏斗 | <85% P1 |
| 图片带宽 (画廊) | 全量预加载 | 视口±200px | Network 面板 | — |
| A11y 评分 | 0 | WCAG AA | axe-core | 任何违规 P2 |
| 动画丢帧率 | >30% | <5% | animation_jank | >10% P2 |
| JS 错误率 | — | <0.5% | onerror 遥测 | >1% P1 |
| Bundle 大小 | ~180KB (gzip) | <200KB | vite build | >250KB P2 |
| 🆕 预加载命中率 | — | >60% (hover 120ms 窗口) | Telemetry preload_hit/miss | <40% P2 |
| 🆕 分片下载吞吐 | 单连接串行 | 3x 并发 (HTTP/2) | Network 面板 | — |
| 🆕 推荐 CTR (刷新) | — | >35% 点击率 | Telemetry rec_impression/rec_click | <20% P2 |
| 🆕 冷启动降级覆盖 | — | 100% (shuffle) | profile 无数据时 | — |
| 🆕 CSP 违规率 | — | 0 | CSP Evaluator | 任何违规 P0 |
| 🆕 运行时篡改检测 | — | <0.1% 误报 | antiTamper isNative | tamper 事件 P0 |

### 1.4 风险矩阵

| 风险 | 概率 | 影响 | RPN | 缓解措施 |
|------|------|------|-----|---------|
| animationend 遗漏 | 中 | 高 | 12 | grep 全量扫描 + 7 处逐一替换 + integration test |
| XPath Shadow Paths 全部失效 | 中 | 低 | 6 | Silent Fallback + Telemetry 告警 + 月度规则审查 |
| will-change GPU 内存泄漏 | 低 | 中 | 4 | 动画后 500ms 自动回收 + Memory 面板 profiling |
| overscroll-behavior 旧浏览器 | 低 | 低 | 2 | @supports 渐进增强 |
| 页面保活 DOM 膨胀 | 低 | 中 | 4 | WeakMap 引用追踪 + >20MB 时 LRU 淘汰 |
| 🆕 预加载缓存内存压力 | 低 | 中 | 4 | LRU Map 上限 50 条 + Save-Data 模式禁用 |
| 🆕 分片 Range 请求被 CDN 拒绝 | 中 | 低 | 3 | HEAD 检测 accept-ranges → 不支持时降级全量下载 |
| 🆕 Connection API 隐私限制 | 低 | 低 | 2 | 仅作为优化提示，降级到全量预加载 |
| 🆕 推荐用户画像数据膨胀 | 低 | 低 | 2 | 时间衰减自动清理 ≤30 天未出现标签 |
| 🆕 CSP 阻断正常功能 (误配) | 低 | 高 | 5 | Staging 环境预验证 + Report-Only 模式灰度 48h |
| 🆕 运行时篡改误报(旧浏览器) | 低 | 中 | 3 | isNative 降级：`[native code]` 检测失败 → 仅 warn 不降级 |
| 🆕 strictSanitize 破坏合法内联样式 | 低 | 低 | 2 | `style` 属性在 ALLOWED_ATTRS 白名单内放行 |

### 1.5 Feature Flag 体系

```js
// 三级开关
window.__NPHER_V2 = {
  pageKeepAlive:   true,   // R5.2 页面保活
  animationEnd:    true,   // R5.1 animationend 驱动
  skeletonScreen:  true,   // R1.1 骨架屏
  gpuAccel:        true,   // R1.2 GPU 合成层
  lazyGallery:     true,   // R1.3 懒加载
  xpathScraper:    true,   // R2 全部
  scrollContain:   true,   // R3.1 滚动穿透
  detailV2:        false,  // R10 详情页（渐进上线）
  preloadEngine:   true,   // R11.1 声明式预加载
  chunkDownloader: true,   // R11.2 分片下载
  edgeRecommender: true,   // R12 端侧推荐
  strictSanitize:   true,   // R13.1 白名单沙箱
  antiTamper:       true,   // R13.3 运行时防篡改
  telemetry:       true,   // R4 遥测
};
// 回滚：localStorage.setItem('niypher_v2_override', '0')
```

---

## 2. 架构决策记录 (ADR)

| ADR | 决策 | 替代方案 | 理由 | 权衡 |
|-----|------|---------|------|------|
| ADR-01 | `animationend` 替代 `setTimeout` | WAAPI `finished` Promise | 兼容性 94% vs 88% | 需处理 transitionend 同名事件冒泡 |
| ADR-02 | `display:none/block` 页面保活 | `visibility:hidden` | 不占布局空间 | 首次 display:block 触发 reflow |
| ADR-03 | `will-change` 外部声明 + 500ms 回收 | 始终保留 | 避免 GPU 内存泄漏 | 回收后下次动画需重新声明 |
| ADR-04 | Shadow XPaths 数组降级 | CSS selector | XPath 在非 XML 文档更强 | 数组维护成本略高 |
| ADR-05 | Telemetry 环形缓冲区 + idleCallback | 立即 fetch 上报 | 不阻塞主线程 | 页面关闭时可能丢失最后几条 |
| ADR-06 | `overscroll-behavior` 渐进增强 | JS preventDefault | CSS 零 JS 开销 | Firefox <73 不支持 |
| ADR-07 | `requestAnimationFrame` 帧监控 | `PerformanceObserver` longtask | 更精确测量动画帧 | longtask 50ms 粒度太粗 |
| ADR-08 | 详情页保留 acrylic 玻璃风格 | Material 3 纯色 | 品牌一致性 | 对比度达标需额外验证 |
| 🆕 ADR-09 | 声明式预加载 (Hover 120ms 防抖) | pointerenter 立即触发 | 120ms 过滤误触，命中率提升 40% | 需防抖 + mouseleave 清理 |
| 🆕 ADR-10 | HTTP Range 分片并发下载 | Service Worker 流式 | 3x 并发线程池，绕过 6 连接限制 | CDN 需支持 accept-ranges |
| 🆕 ADR-11 | 端侧余弦相似度 + Ebbinghaus 遗忘 | 服务端协同过滤 | 零网络延迟，隐私本地化，冷启动 shuffle 兜底 | 需用户有交互历史积累 |
| 🆕 ADR-12 | 白名单标签/属性 + 协议过滤 | DOMPurify 库 | 零依赖，TreeWalker 倒序处理避免树破坏 | 白名单需随业务扩展维护 |
| 🆕 ADR-13 | CSP Report-Only 灰度 → 强制 | 直接强制 | 48h 监控报告不阻断 → 确认无误后强制 | 灰度期存在短暂 XSS 窗口 |
| 🆕 ADR-14 | isNative + deepFreeze 防篡改 | CSP 'strict-dynamic' | 轻量零依赖，直接检测原型链 | [native code] 检测在部分引擎不可靠 |

---

## 3. 需求分解 (Given-When-Then)

### R1: 渲染管线性能（P0）

**R1.1 Acrylic 骨架屏**
- **Given** 详情页首次加载，数据异步抓取中
- **When** Hero 卡片和信息矩阵的 `data-fetch-state="loading"`
- **Then** 渲染 `.is-loading` 骨架（保留 acrylic 模糊背景 + shimmer 1.5s infinite 脉冲），`data-fetch-state` 变为 `"loaded"` 时 200ms crossfade 过渡到真实内容
- 验收：Lighthouse Screenshot Slow 3G 首帧可见骨架，无白屏
- 测试：`__NPHER_V2.skeletonScreen = false` 回退到 spinner

**R1.2 GPU 合成层加速**
- **Given** `.stagger-layer` 或 FLIP 目标元素即将执行 CSS transition
- **When** 动画开始前 1 帧（`requestAnimationFrame` 回调）
- **Then** `el.style.willChange = 'transform, opacity'`，动画结束后 500ms `el.style.removeProperty('will-change')`
- 验收：Chrome Layers 面板确认 Compositing Layer，FPS ≥55
- 测试：Memory 面板录制 20 次 Stagger 入场，无持续增长

**R1.3 截图画廊智能懒加载**
- **Given** `.screenshot-gallery` 包含 N 张 `<img loading="lazy" decoding="async" data-src="...">`
- **When** 创建 `IntersectionObserver({ root: gallery, rootMargin: '200px' })`（移动端 `rootMargin: '100px'`）
- **Then** 进入 rootMargin 的 `.screenshot-item` → `img.src = img.dataset.src`，`img.onload` 后 `img.classList.add('loaded')`
- 验收：Network 面板瀑布流仅可见截图发起请求；打印 `[LazyLoad] activated N/M images`

### R2: XPath 抓取鲁棒性（P0）

**R2.1 安全沙箱**
- **Given** `fetch(url)` 返回外部商城 HTML 字符串
- **When** `DOMParser.parseFromString(html, 'text/html')` 解析为 document
- **Then** `sanitize(doc)` 遍历 `querySelectorAll('*')`，`removeAttribute` 剔除 `ON_EVENT_ATTRS` 集合（27 种内联事件属性：onload/onerror/onclick/onfocus/onblur/onchange/onsubmit/onreset/onselect/onkeydown/onkeypress/onkeyup/onmouseover/onmouseout/onmousedown/onmouseup/onmousemove/ondblclick/oncontextmenu/onwheel/onscroll/onresize/onabort/oncanplay/oncanplaythrough/ondurationchange/onemptied/onended）
- 验收：`sanitize(parseFromString('<img onerror="alert(1)" src=x>'))` → `.querySelector('img').getAttribute('onerror') === null`
- 风险缓解：`MutationObserver` 监控 DOM 变化防止后期注入

**R2.2 Shadow XPaths 多路径降级**
- **Given** `ScrapeRule { linkPath: ['//a[contains(@class,"buy")]/@href', '//div#shop//a[1]/@href'], itemTitle: ['//h1/text()', '//meta[@property="og:title"]/@content'], ... }`
- **When** `evaluateFirstMatch(xpaths, doc, contextNode?)` 执行
- **Then** `for (const xpath of xpaths)` → `doc.evaluate(xpath, contextNode, null, FIRST_ORDERED_NODE_TYPE).singleNodeValue` → 首个非空返回 `{ nodeValue, xpathIndex, matchedPath }`；全部 null → `{ nodeValue: null, xpathIndex: -1, matchedPath: null }`
- 全部字段 null → `Telemetry.track('scraper_fallback', { domain, rule, failedPaths })`
- 验收：单元测试 `xpaths=['//nonexistent', '//body']` → 返回 body 节点 + matchedPath:1

**R2.3 超时熔断**
- **Given** `scrapeWithTimeout(url, timeoutMs = 5000)`
- **When** `AbortController` signal 传入 fetch
- **Then** `setTimeout(() => abort(), timeoutMs)` → catch `err.name === 'AbortError'` → `return { status: 'timeout', data: null }` → Silent Fallback
- 非 AbortError → 路由到 `ErrorType.NETWORK_TIMEOUT`
- 验收：Chrome Network 节流 Slow 3G → 5s 后 `scraper_timeout` 事件触发

### R3: 滚动穿透与 A11y（P1）

**R3.1 滚动穿透**
- **Given** `.screenshot-gallery` 水平滑动 / `.detail-page-container` 垂直滑动
- **When** 用户滑动到滚动边界
- **Then** 滚动事件不传导至外层容器 / 浏览器橡皮筋
- 实现：`overscroll-behavior-x: contain` / `overscroll-behavior-y: none`；`@supports (overscroll-behavior: contain)` 渐进增强
- 验收：iOS Safari 截图画廊滑到最左/最右无橡皮筋

**R3.2 WCAG AA 无障碍**
- **Given** 折叠描述按钮 + acrylic 背景面板
- **When** 用户点击展开/收起 + 屏幕阅读器聚焦描述区域
- **Then** `btn.setAttribute('aria-expanded', String(isExpanded))`；`.description-text[aria-hidden="false"]` → 阅读器朗读全文
- acrylic 面板文字 `--text-primary` 与 `--acrylic-bg` 对比度 ≥4.5:1（明/暗双模均验证）
- 验收：axe-core 扫描 0 violations；Chrome DevTools CSS Overview 对比度检查

### R4: 遥测与可观测性（P2）

**R4.1 抓取漏斗**
- **Given** XPathScraper 每次抓取完成（成功/fallback/超时）
- **When** `Telemetry.track(event, { domain, ruleName, latencyMs, pathIndex, timestamp })`
- **Then** `BoundedRingBuffer(256)` 追加；`requestIdleCallback` 异步批量上报
- 告警：同一 domain 滑动窗口 30 次内 `scraper_fallback / (scraper_success + scraper_fallback) > 0.3` → `console.warn('[ScraperAlert]', domain)` + `window.dispatchEvent(new CustomEvent('scraper-alert'))`
- 验收：手动 `track('scraper_fallback', ...)` 30 次 → console.warn 触发

**R4.2 动画帧监控**
- **Given** `measureFrameBudget(fn)` 包装 FLIP/Stagger/Hero 动画
- **When** `const t0 = performance.now(); await fn(); const dt = performance.now() - t0`
- **Then** `dt > 500` → `Telemetry.track('animation_jank', { type, duration: dt, deviceMemory: navigator.deviceMemory })`
- 同页面 60 秒内 5 次 jank → 全局 `jankMitigation = true` → Stagger 延迟归零，FLIP duration 减半，Hero 降级为 fade
- 验收：Chrome DevTools CPU 6x slowdown → `animation_jank` 事件触发 → mitigation 启用

### R5: 页面切换与保活（P1）

**R5.1 animationend 事件驱动**
- **Given** 页面切换动画中的过渡容器 `.page-transition-*`
- **When** CSS transition/animation 完成
- **Then** `waitForAnimation(el)` 返回 Promise → resolve 后执行清理（移除旧 DOM、恢复状态）
- 实现：`new Promise(resolve => { el.addEventListener('animationend', resolve, { once: true }); el.addEventListener('transitionend', resolve, { once: true }); })`
- 7 处 setTimeout 全部替换：enterAnim / leaveAnim / 常规切换 / 搜索进入 / 搜索退出 (pop) / 搜索退出 (push) / 刷新离场
- 验收：快速连续点击导航 10 次 (100ms 间隔)，无残留 DOM，无 Uncaught Error

**R5.2 页面保活**
- **Given** `index.html` main 中 5 个 `<section data-page="home|category|galgame|search|profile" style="display:none">`
- **When** `render(routerInstance, mode)` 被调用
- **Then** 首次：`section.innerHTML = pageHTML` + `section.style.display = 'block'`；后续：仅切换 display
- 搜索页参数变化 → 局部刷新 `#search-results-area`
- 删除 `src/js/modules/pageCache.js`
- 验收：Tab 切换无闪烁；搜索页排序后滚动位置保留；Memory 面板确认 DOM 节点不膨胀

### R6: ResizeObserver 动态网格（P1）
- **Given** `.game-cards-container` / `.category-cards-container` 容器
- **When** `new ResizeObserver(entries => entries.forEach(e => updateGridColumns(e.contentRect.width)))` 绑定
- **Then** 动态设置 `el.style.gridTemplateColumns = repeat(N, 1fr)`；N = width≤480→1, ≤768→2, ≤1200→3, >1200→4
- 删除 styles.css 中固定断点的 grid-template-columns 媒体查询
- 验收：拖动窗口实时重排列数，DevTools 元素面板确认 inline style

### R7: 导航栏图标双态 + 选中指示器（P1）
- **Given** `<nav>` 中 4 个 `.nav-item`，每个内含 `<i class="ri-*-line">` + `<i class="ri-*-fill" style="display:none">`
- **When** `updateNav(currentPage)` 被调用
- **Then** 匹配 → `ri-*-fill` 显示 + `ri-*-line` 隐藏 + `aria-current="page"`；不匹配 → 反之
- 选中项追加 `.nav-item-indicator`（accent 色圆点，`width:6px; height:6px; border-radius:50%`）
- 验收：Tab 切换图标同步翻转，圆点指示器平滑移动

### R8: Hero 共享元素封面过渡（P1）
- **Given** 卡片封面 `<img data-hero-id="game-101">` + 详情页封面 `<img data-hero-id="game-101">`
- **When** 用户点击卡片 `navigateTo('detail', { id: '101' })`
- **Then**
  1. `cardImg.getBoundingClientRect()` → `fromRect`
  2. `clone = cardImg.cloneNode(true)` → `position:fixed` → `fromRect` 位置
  3. 导航到详情页，`detailImg.getBoundingClientRect()` → `toRect`
  4. `clone.animate([{ transform: translate(0,0) scale(1) }, { transform: translate(dx,dy) scale(toW/fromW) }], { duration: 350, easing: 'cubic-bezier(0.25,0.46,0.45,0.94)' })`
  5. `.finished.then(() => clone.remove())`
- 反向：详情→首页，逆向飞行
- 验收：点击卡片，封面平滑飞行到详情页位置，无抖动

### R9: FLIP 刷新动画（P1）
- **Given** 首页 `.game-cards-container` 中 N 张卡片
- **When** 用户点击刷新按钮 → `refreshCards()`
- **Then**
  1. **First**: `[...cards].map(c => c.getBoundingClientRect())` → `firstRects[i]`
  2. **Last**: 打乱数据 → 重新渲染 → `cardEls[i].getBoundingClientRect()` → `lastRects[i]`
  3. **Invert**: `cardEls[i].style.transform = translate(${firstRects[i].left - lastRects[i].left}px, ${firstRects[i].top - lastRects[i].top}px)` + `willChange = 'transform'`
  4. **Play**: `requestAnimationFrame(() => { cardEls[i].style.transition = 'transform 400ms cubic-bezier(0.25,0.46,0.45,0.94)'; cardEls[i].style.transform = ''; })`
- 动画结束后 500ms `removeProperty('will-change')`
- 验收：刷新按钮点击 → 卡片平滑重排；Performance 录制帧率 ≥55

### R10: App Store 详情页五层结构（P1）
- **L0 Hero**: 方形图标(100x100 rounded-2xl) + 标题 + 社团名 + 评分摘要 + CTA 按钮(accent 色全宽胶囊 48px) — 玻璃卡片
- **L1 Snap Gallery**: scroll-snap x mandatory + 圆点指示器 + 16:9 响应式截图
- **L2 折叠描述**: line-clamp:3 → "展开全文" → 300ms ease-out 展开 → "收起"
- **L3 评分柱状图**: 5★→1★ 百分比条(accent 色填充) + 总评分大号数字
- **L4 信息卡片**: key-value 6 字段(大小/日期/平台/语言/分级/社团) + 正版购买链接集成
- **Stagger**: L0(0ms) → L1(50ms) → L2(100ms) → L3(150ms) → L4(200ms) — CSS `animation-delay: var(--layer-delay)`
- 验收：详情页分层渐入；各层尺寸和间距与 App Store 一致

### 🆕 R11: 网络加载算法重构（P0）

**R11.1 声明式预加载引擎**
- **Given** 首页游戏卡片已渲染，指针悬停或触摸启动
- **When** `mouseover` 事件在卡片上停留 ≥120ms（防抖窗口），或移动端 `touchstart` 立即触发
- **Then**
  1. 提取 `card.dataset.heroId` 构建目标 URL（详情 API / 外部商城抓取 URL）
  2. 检查三个前置条件：① `navigator.connection?.saveData === false`；② `effectiveType !== '2g' && effectiveType !== '3g'`；③ LRU 缓存未命中
  3. 满足条件 → `fetch(url).then(r => r.json())` 存入 `LRUMap(50)`；`mouseleave` 事件在 120ms 防抖窗口内触发 → `clearTimeout` 取消
  4. `Telemetry.track('preload_hit', { url })` 当用户实际点击时命中缓存；`Telemetry.track('preload_miss', { url })` 未被缓存命中
- 实现：`src/js/modules/preloadEngine.js` — `PreloadEngine` 类，`init()` 绑定全局 `mouseover`/`touchstart`/`mouseleave`
- 验收：DevTools Network 面板可见悬停后的预请求（带 `sec-purpose: prefetch` 标记）；Telemetry `preload_hit / (preload_hit + preload_miss) > 0.6`

**R11.2 并发分片下载器**
- **Given** 用户触发大文件下载（Galgame 资源包 / 画廊多图）
- **When** `downloadInChunks(url, { concurrency: 3, chunkSize })` 被调用
- **Then**
  1. `HEAD` 请求确认 `content-length` 和 `accept-ranges: bytes`；不支持 → 降级 `fetch(url)` 全量下载
  2. 分片公式：`chunkSize = max(512KB, min(4MB, bandwidth × latency / 8))`，带宽/延迟从 `navigator.connection` 估算
  3. `tasks = Math.ceil(totalLength / chunkSize)` → 3 个 worker（`Promise.all` 并发池）各取 `Range: bytes=start-end` 分片
  4. 每个分片最多重试 3 次，任一失败 3 次 → 抛出异常并降级全量下载
  5. `new Blob(results, { type })` 合并返回
- 实现：`src/js/modules/chunkDownloader.js` — `downloadInChunks(url, options)`
- 验收：Network 面板确认 3 个并发 Range 请求；下载速度 > 单连接 1.5x；不支持 accept-ranges 时降级为全量

### R11.3 `<link rel="prefetch">` 静态资源预读取
- **Given** 路由表已知下一级页面的静态 assets
- **When** `PreloadEngine.initStaticPrefetch()` 在页面 idle 时执行
- **Then** 动态创建 `<link rel="prefetch" as="script" href="...">` + `<link rel="prefetch" as="style" href="...">` 注入 `<head>`
- 优先级：当前页面 > 高频访问页 > 低频访问页
- 验收：Application > Frames 面板确认 prefetched assets 被浏览器标记

### 🆕 R12: 端侧轻量级推荐算法（P0）

**R12.1 用户画像向量构建**
- **Given** 用户在首页浏览 / 点击 / 收藏游戏
- **When** `EdgeRecommender.trackBehavior(tags, actionType)` 被调用
- **Then**
  1. `localStorage('npher_user_profile')` 读取 `{ vectors: { tag: weight }, lastUpdate: timestamp }`
  2. 历史权重全局时间衰减：`W_new = W_old × e^(-λ × Δt)`，λ = 5×10⁻⁸ ms⁻¹（约 7 天半衰期，避免历史标签永久霸占推荐位）
  3. 新行为权重注入：click=1.0, favorite=3.0, dwell_time_long=2.0（停留 >30s 判定为深度兴趣）
  4. `profile.lastUpdate = Date.now()` 写回
- 实现：`src/js/modules/recommendation.js` → `EdgeRecommender` 类
- 验收：控制台 `trackBehavior(['action','rpg'], 'click')` → localStorage `npher_user_profile` 确认权重

**R12.2 余弦相似度召回**
- **Given** 用户画像 `userVec: { tag: weight }` 已积累 ≥1 个标签
- **When** `getRecommendations(allGames, limit = 4)` 被调用
- **Then**
  1. 对每个游戏构建特征向量 `gameVec: { tag: 1.0 }`（每个标签基准权重 1.0）
  2. 计算余弦相似度：`dotProduct / (||userVec|| × ||gameVec||)`
  3. 过滤 `score > 0` → 按 score 降序 → 截取 `limit` 条
  4. `Telemetry.track('rec_impression', { count, top5Tags })` 埋入展示数据
- 冷启动兜底：`userVec` 无数据 → `shuffle(allGames).slice(0, limit)` 随机召回
- 实现：同上 `EdgeRecommender.getRecommendations()`
- 验收：`getRecommendations([...DB.resources])` → 返回与画像最匹配的 4 款游戏；无画像时返回 4 款随机游戏

**R12.3 推荐位 UI 集成**
- **Given** 首页渲染完成
- **When** `EdgeRecommender.getRecommendations()` 返回推荐列表
- **Then** 首页顶部 "为你推荐" 横滑卡片行展示推荐结果
  - 推荐卡使用缩略卡片样式（`w-36 h-48`），区别于主页全尺寸卡片
  - 用户点击推荐卡 → `Telemetry.track('rec_click', { gameId, rank })`
- 验收：首页顶部显示 "为你推荐" 行；有交互历史时展示个性化结果；新用户展示随机热榜

### 🆕 R13: 网络安全深度加固（P0）

**R13.1 白名单标签/属性沙箱（strictSanitize）**
- **Given** 外部 HTML 字符串（XPath 抓取结果 / 第三方内容）
- **When** `strictSanitize(htmlString)` 被调用
- **Then**
  1. `DOMParser.parseFromString(html, 'text/html')` 解析 → `TreeWalker` 遍历所有元素节点
  2. `ALLOWED_TAGS = {div,span,p,h1,h2,h3,ul,ol,li,img,a,table,tbody,tr,td,th}` — 不在白名单的标签 → 保留子节点文本 → 移除标签自身（倒序处理避免树破坏）
  3. `ALLOWED_ATTRS = {href,src,class,id,alt,title,data-hero-id,style}` — 不在白名单的属性直接移除
  4. `href`/`src` 协议过滤：`startsWith('javascript:')` 或 `startsWith('data:text/html')` → 替换为 `'#'`
  5. 拒绝向量：`<iframe>`, `<object>`, `<embed>`, `<script>`, `javascript:` URI, `data:text/html` URI 全部无效
- 实现：`src/js/modules/securitySandbox.js` → `strictSanitize()`
- 验收：`strictSanitize('<img onerror="alert(1)" src=x><iframe src="evil">')` → 仅保留 `<img src="#">`（onerror 清除，iframe 标签移除）

**R13.2 内容安全策略 (CSP) 治理**
- **Given** Cloudflare Pages 边缘节点响应
- **When** 浏览器请求任意 HTML 页面
- **Then** `_headers` 文件下发 CSP：
  ```
  Content-Security-Policy: default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://images.unsplash.com https://cdn.v2ph.com; connect-src 'self' https://api.steampowered.com https://api.dlsite.com; frame-src 'none'; object-src 'none'; base-uri 'self';
  ```
- CSP 灰度策略：先 `Content-Security-Policy-Report-Only` 48h → 收集 `report-uri` 违规报告 → 确认零误报后切换强制模式
- 前端配合：画廊 `<img crossorigin="anonymous" referrerpolicy="no-referrer">` 防止 Referer 头泄露路由敏感信息（token 等）
- 验收：CSP Evaluator 无违规；Network 面板 `content-security-policy` 头完整

**R13.3 运行时防篡改与劫持防御**
- **Given** 页面 JavaScript 运行时环境
- **When** `lockRuntimePrototypes()` 在 app.js 初始化末尾调用
- **Then**
  1. `Object.deepFreeze(window.__NPHER_V2)` 冻结 Feature Flag 对象防止运行时越权篡改
  2. `isNative(fn)` 检测 `{ [native code] }` → `fetch`, `JSON.parse`, `Document.prototype.evaluate` 三个关键原生函数
  3. 任一检测失败 → `Telemetry.track('runtime_compromised', { fetchNative, xpathNative })` → `window.__NPHER_V2_TAMPERED = true` → 降级整站为静态只读单页
  4. 旧浏览器 `[native code]` 检测不可靠 → 仅 `console.warn` 不降级
- 实现：`src/js/modules/antiTamper.js` → `lockRuntimePrototypes()`
- 验收：手动 `window.fetch = () => {}` 后调用 `lockRuntimePrototypes()` → `__NPHER_V2_TAMPERED === true`；还原原生 fetch 后 `__NPHER_V2_TAMPERED === undefined`

---

## 4. 测试策略

| 测试层 | 工具 | 覆盖 | 执行频率 | 阻断条件 |
|--------|------|------|---------|---------|
| 单元 | vitest + jsdom | Repository CRUD, ErrorType, Shadow XPaths, sanitizer, waitForAnimation, BoundedRingBuffer | 每次 push | 任何失败 |
| 集成 | Playwright | 5 场景（Tab 切换/FLIP 刷新/Hero 过渡/搜索本地刷新/详情 Stagger） | 每次 PR | 任何失败 |
| 性能 | Lighthouse CI | FCP/LCP/CLS/TBT 四项预算 | 每次 PR | 回归 >10% |
| A11y | axe-core + pa11y-ci | WCAG AA 自动扫描 | 每次 PR | 任何 violation |
| 视觉回归 | 手动（Percy 可选） | 详情页五层 / 导航双态 / 骨架屏 / 暗色模式 | 发版前 | 人工判断 |
| 安全 | npm audit + OWASP ZAP Baseline | 依赖漏洞 + XSS 向量 | 每周 | Critical/High |

### 4.1 Playwright 集成测试用例

```javascript
// tests/flip-refresh.spec.js
test('FLIP refresh preserves card identity and animates positions', async ({ page }) => {
  await page.goto('/#home');
  const cardsBefore = await page.$$eval('.glass-card', cards => cards.map(c => c.dataset.id));
  await page.click('[data-testid="refresh-btn"]');
  await page.waitForTimeout(500); // FLIP 400ms + buffer
  const cardsAfter = await page.$$eval('.glass-card', cards => cards.map(c => c.dataset.id));
  expect(cardsAfter.sort()).toEqual(cardsBefore.sort()); // 内容不变，仅重排
});

// tests/hero-transition.spec.js
test('Hero transition animates cover from card to detail', async ({ page }) => {
  await page.goto('/#home');
  const cardImg = page.locator('[data-hero-id]').first();
  const cardBox = await cardImg.boundingBox();
  await cardImg.click();
  await page.waitForSelector('.detail-page-container');
  const detailImg = page.locator('.detail-hero-cover');
  const detailBox = await detailImg.boundingBox();
  expect(detailBox.width).toBeGreaterThan(cardBox.width); // 放大过渡
});
```

---

## 5. CI/CD 与部署管道

### 5.1 GitHub Actions Workflow（建议）

```yaml
name: NiypherGal CI/CD
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint        # ESLint

  test:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx vitest --coverage
      - run: npx playwright install --with-deps
      - run: npx playwright test

  build-and-audit:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - run: npx lighthouse-ci --budget-path=.lighthouse-budget.json
      - run: npx axe-core --dir=dist

  deploy:
    if: github.ref == 'refs/heads/main'
    needs: build-and-audit
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          command: pages deploy dist --project-name=niyphergal
```

### 5.2 Lighthouse 预算配置 (`.lighthouse-budget.json`)

```json
{
  "resourceSizes": [
    { "resourceType": "total", "budget": 350 },
    { "resourceType": "script", "budget": 200 },
    { "resourceType": "stylesheet", "budget": 80 },
    { "resourceType": "image", "budget": 100 },
    { "resourceType": "font", "budget": 20 }
  ],
  "timings": [
    { "metric": "first-contentful-paint", "budget": 1800 },
    { "metric": "largest-contentful-paint", "budget": 2500 },
    { "metric": "total-blocking-time", "budget": 200 },
    { "metric": "cumulative-layout-shift", "budget": 0.1 }
  ]
}
```

---

## 6. 安全审查清单

| 检查项 | 要求 | 验证方式 |
|--------|------|---------|
| XSS (DOM-based) | XPathScraper 沙箱剔除所有内联事件属性 | `sanitize()` 单元测试 |
| XSS (Reflected) | 详情页描述文本 escapeHTML 后渲染 | 输入 `<script>` → 渲染为 `&lt;script&gt;` |
| CSP | 无 `unsafe-inline` script，style 允许 `'self'` | `_headers` 文件 |
| 外部 fetch | 仅允许预配置的商城 origin 白名单 | `ALLOWED_ORIGINS` Set 检查 |
| localStorage 敏感数据 | 不存储 token/password 到 localStorage | grep 审计 |
| 依赖漏洞 | `npm audit --audit-level=high` | CI 阻断 |
| HTTPS | Cloudflare 强制 HTTPS redirect | `_headers` + CF Dashboard |

---

## 7. 浏览器兼容性矩阵

| 特性 | Chrome | Firefox | Safari | Edge | 降级策略 |
|------|--------|---------|--------|------|---------|
| `animationend` | 43+ | 51+ | 9+ | 79+ | — |
| `IntersectionObserver` | 51+ | 55+ | 12.1+ | 79+ | 全量加载 |
| `ResizeObserver` | 64+ | 69+ | 13.1+ | 79+ | 固定 2 列 |
| `overscroll-behavior` | 63+ | 73+ | 16+ | 79+ | 无效果 |
| `AbortController` | 66+ | 57+ | 12.1+ | 79+ | 无超时 |
| `DOMParser` | 1+ | 1+ | 1+ | 12+ | — |
| `CSS Grid` | 57+ | 52+ | 10.1+ | 16+ | Flexbox 单列 |
| `CSS Custom Properties` | 49+ | 31+ | 9.1+ | 15+ | — |
| `scroll-snap-type` | 69+ | 99+ | 11+ | 79+ | 普通 scroll |
| `will-change` | 36+ | 36+ | 9+ | 79+ | — |
| 🆕 `navigator.connection` | 61+ | — | — | 79+ | 全量加载 |
| 🆕 `link rel=prefetch` | 8+ | 2+ | 13+ | 12+ | — |
| 🆕 HTTP Range | 4+ | 3+ | 3.1+ | 12+ | 全量下载 |

---

## 8. 文件变更清单

| 操作 | 文件 | 行数估算 | 风险 |
|------|------|---------|------|
| 🆕 | `src/js/repositories/baseRepository.js` | ~40 | 低 |
| 🆕 | `src/js/repositories/searchRepository.js` | ~30 | 低 |
| 🆕 | `src/js/repositories/themeRepository.js` | ~20 | 低 |
| 🆕 | `src/js/repositories/userRepository.js` | ~20 | 低 |
| 🆕 | `src/js/modules/xpathScraper.js` | ~150 | 中 |
| 🆕 | `src/js/modules/telemetry.js` | ~80 | 低 |
| 🆕 | `src/js/modules/preloadEngine.js` | ~120 | 中 |
| 🆕 | `src/js/modules/chunkDownloader.js` | ~100 | 中 |
| 🆕 | `src/js/modules/recommendation.js` | ~120 | 低 |
| 🆕 | `src/js/modules/preloadEngine.js` | ~60 | 高 |
| 🆕 | `src/js/modules/chunkDownloader.js` | ~50 | 中 |
| 🆕 | `src/js/modules/securitySandbox.js` | ~60 | 中 |
| 🆕 | `src/js/modules/antiTamper.js` | ~40 | 中 |
| 🔧 | `src/js/modules/errorHandler.js` | +30 | 中 |
| 🔧 | `src/js/modules/renderer.js` | -200 +250 | 高 |
| 🔧 | `src/js/modules/navigation.js` | +30 | 中 |
| 🔧 | `src/js/modules/components.js` | +20 | 低 |
| 🔧 | `src/js/modules/store.js` | -20 | 低 |
| 🔧 | `src/js/modules/search.js` | -10 | 低 |
| 🔧 | `src/js/modules/theme.js` | -5 | 低 |
| 🔧 | `src/js/pages/home.js` | +60 | 中 |
| 🔧 | `src/js/pages/detail.js` | +300 | 高 |
| 🔧 | `src/css/styles.css` | +150 -80 | 中 |
| 🔧 | `index.html` | +20 -10 | 中 |
| ❌ | `src/js/modules/pageCache.js` | -60 | 中 |
| 🆕 | `.lighthouse-budget.json` | ~20 | 低 |
