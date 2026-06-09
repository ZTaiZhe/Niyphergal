# 剩余 Spec 功能实施计划

## 概述
当前 spec 中尚有 4 项未实现：R5.1（animationend 替代 setTimeout）、R7（导航双图标）、R8（Hero 飞行过渡）、E2（CI/CD 管道）。本计划逐项设计实施步骤。

---

## R5.1 — 动画时序从 setTimeout 改为 animationend 事件

**当前状态：**
- `renderer.js` 中 3 处关键动画切换依赖 `setTimeout(delay)` 估算动画时长：
  - L1111-L1124: 搜索页进入动画 → `setTimeout(callback, SEARCH_PAGE_ENTER_DURATION + 50)`
  - L1143-L1161: 搜索页退出动画 → `setTimeout(callback, SEARCH_PAGE_EXIT_DURATION + 50)`  
  - L1163-L1195: 普通页面过渡 → `setTimeout(callback, 500)`
- 另有内部 `performPartialRefresh` 使用 leaving/entering 双动画 setTimeout 链

**风险：** setTimeout 与实际 CSS animation 结束时间可能偏差（帧率波动、移动端省电降帧），导致内容替换与动画完成不同步。

**实施步骤：**

1. **提取动画辅助工具** `src/js/modules/animationHelpers.js`：
   ```
   // 监听单个元素 animationend，总在第一个结束事件触发时 resolve
   function whenAnimationEnds(el, fallbackMs = 350) { ... }
   
   // 批量监听 N 个元素的 animationend，收集完成后 resolve
   function whenAllAnimationsEnd(elements, fallbackMs = 500) { ... }
   ```

2. **替换搜索页进入 (L1111-L1124)**：
   - 在 overlay 上绑定 `animationend`，监听 `.page-slide-up-enter-active.is-visible` 动画完成
   - 回调中调用 `injectSection()` + `observeExistingMedia()`
   - 保留 `prefersReducedMotion` 分支直接执行

3. **替换搜索页退出 (L1143-L1161)**：
   - 在 overlay 上绑定 `animationend`，监听 `.page-slide-down-exit-active.is-leaving` 动画完成
   - 回调中执行页面还原

4. **替换普通页面过渡 (L1163-L1195)**：
   - 在 `.page-transition-new` 上绑定 `animationend`
   - 两个动画方向（left/right）共用同一个 listener

5. **替换 performPartialRefresh 内部双动画链 (L730-L810 区域)**：
   - leaving 动画 → `whenAnimationEnds(leavingCards)` → 渲染新内容 → entering 动画 → `whenAnimationEnds(enteringCards)` → clean

6. **更新 `animationHelpers.js` 中 `executeEnteringAnimation`/`executeLeavingAnimation`**：
   - 改为返回 Promise，统一使用 `animationend` 作为结束信号

**涉及文件：**
- 🆕 `src/js/modules/animationHelpers.js`
- 🔧 `src/js/modules/renderer.js`（替换所有 setTimeout 动画链）

---

## R7 — 导航栏 fill/line 双图标 + 圆点指示器

**当前状态：**
- HTML 中 4 个导航按钮只有 `ri-xxx-line` 图标（如 `ri-home-4-line`）
- `navigation.js` 已有 fill↔line 切换逻辑，但：
  - 没有对应的 fill 图标作为初始 DOM 元素
  - `updateNav()` 通过 `icon.className.replace('line','fill')` 切换，但找不到 line 图标时会失败

**实施步骤：**

1. **修改 `index.html` 导航栏**：
   每个 `nav-item` 的 `<i>` 标签改为双 span 结构：
   ```
   <span class="nav-icon-wrapper relative">
     <i class="ri-home-4-line nav-icon-line"></i>
     <i class="ri-home-4-fill nav-icon-fill hidden"></i>
   </span>
   ```

2. **改写 `navigation.js` 的 `updateNav()`**：
   - 不再用 `className.replace` 做字符串替换
   - 改为切换 `.nav-icon-line` 和 `.nav-icon-fill` 的 `hidden` 状态
   - 4 个按钮分别处理（home 有特殊刷新逻辑）

3. **CSS 追加**：
   ```css
   .nav-icon-wrapper { position: relative; width: 24px; height: 24px; }
   .nav-icon-line, .nav-icon-fill { position: absolute; top: 0; left: 0; font-size: 1.5rem; transition: opacity 0.3s; }
   .nav-icon-fill { opacity: 0; }
   .nav-item.active .nav-icon-fill { opacity: 1; }
   .nav-item.active .nav-icon-line { opacity: 0; }
   ```

**涉及文件：**
- 🔧 `index.html`（4 个 nav-item 结构）
- 🔧 `src/js/modules/navigation.js`（updateNav 逻辑）
- 🔧 `src/css/styles.css`（nav-icon-wrapper/nav-icon-fill 样式）

---

## R8 — Hero 共享元素封面飞行过渡

**当前状态：**
- 首页卡片已有 `data-hero-id` 属性
- 详情页 Hero badge 有 `data-hero-role="detail-badge"` 标记
- 但两页面间没有共享元素过渡动画

**视觉效果：**
- 点击首页卡片封面 → 封面图片从卡片位置「飞行」到详情页 Hero 的方形图标位置
- 返回时反向飞行

**实施步骤：**

1. **首页注入点击拦截**：
   - 在 `eventDelegation.js` 的事件处理中，`navigate-detail` 分支增加 Hero 动画流程
   - 获取被点击卡片中的封面 `<img>` 的 `getBoundingClientRect()`
   - 创建一个 `hero-clone` 浮层 `<img>`（`position:fixed`, z-index=999）

2. **Hero Clone 动画**：
   - 克隆元素初始位置 = 卡片封面 rect → 目标位置 = 详情页 Hero badge rect（估算 Y 轴偏移 + square 尺寸）
   - 使用 `requestAnimationFrame` 驱动 transform + scale
   - 动画持续时间 ~350ms cubic-bezier
   - 动画完成后移除 clone 并渲染详情页内容

3. **返回反向飞行**：
   - 监听 `popstate`，当从 detail 返回时
   - 从详情 badge 反向飞行到首页卡片位置
   - 动画完成后清理

4. **在 `animationHelpers.js` 中封装 `doHeroTransition()`**：
   ```js
   // fromRect: 首页卡片封面位置
   // toSelector: 详情页目标元素选择器
   // 返回 Promise<boolean>，完成时 resolve
   ```

**涉及文件：**
- 🔧 `src/js/modules/animationHelpers.js`（新增 doHeroTransition）
- 🔧 `src/js/modules/renderer.js`（detail 入口/出口处调用）
- 🔧 `src/js/modules/eventDelegation.js`（navigate-detail 拦截）
- 🔧 `src/css/styles.css`（`.hero-clone` 已有基础样式，可能需要微调）

---

## E2 — CI/CD 管道 + Lighthouse Budget

**当前状态：**
- 无 `.github/workflows/` 目录
- 无 `lighthouse-budget.json`
- 手动通过 `npx wrangler pages deploy` 部署

**实施步骤：**

1. **创建 `d:\.A素材\Niypher\Niypher\.github\workflows\deploy.yml`**：
   ```yaml
   name: Deploy to Cloudflare Pages
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
         - run: npm ci
         - run: npm run build
         - uses: cloudflare/wrangler-action@v3
           with:
             apiToken: ${{ secrets.CF_API_TOKEN }}
             accountId: ${{ secrets.CF_ACCOUNT_ID }}
             command: pages deploy dist --project-name niyphergal
   ```

2. **创建 `d:\.A素材\Niypher\Niypher\.lighthouse-budget.json`**：
   ```json
   {
     "resourceSizes": [
       { "resourceType": "script", "budget": 200 },
       { "resourceType": "stylesheet", "budget": 150 },
       { "resourceType": "image", "budget": 500 },
       { "resourceType": "total", "budget": 800 }
     ],
     "timings": [
       { "metric": "first-contentful-paint", "budget": 1800 },
       { "metric": "largest-contentful-paint", "budget": 2500 },
       { "metric": "total-blocking-time", "budget": 300 }
     ]
   }
   ```

**涉及文件：**
- 🆕 `.github/workflows/deploy.yml`
- 🆕 `.lighthouse-budget.json`

---

## 实施顺序（按依赖关系）

```
Step 1: R5.1 animationHelpers.js（无依赖，其他步骤可复用）
  ↓
Step 2: R7 导航双图标（独立，可与 Step 1 并行）
  ↓
Step 3: R8 Hero 飞行过渡（依赖 Step 1 的 animationHelpers）
  ↓
Step 4: E2 CI/CD 管道（独立，最后一步配置文件）
```

**总计改动文件：**
- 🆕 新建 3 个文件（animationHelpers.js, deploy.yml, lighthouse-budget.json）
- 🔧 修改 4 个文件（renderer.js, index.html, navigation.js, eventDelegation.js）
- 🔧 追加 CSS（styles.css）

**预估风险：**
- R5.1: **中风险** — animationend 在部分浏览器可能有兼容性问题（Chrome/Safari/Firefox 都支持，需 fallback setTimeout）
- R7: **低风险** — 纯 CSS + HTML 结构调整
- R8: **中高风险** — GPU 合成层 + 浮层坐标系计算需精确，可能受滚动位置和 layout shift 影响
- E2: **低风险** — 纯配置文件，不影响运行时
