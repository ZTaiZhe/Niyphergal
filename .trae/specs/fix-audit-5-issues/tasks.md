# Tasks

- [x] Task 1: 修复 auth.js 中 4 处裸变量 turnstile 为 window.turnstile
  - [x] L174: `turnstile.render(container, {` → `window.turnstile.render(container, {`
  - [x] L360: `turnstile.remove(authFlowState.turnstileWidgetId)` → `window.turnstile.remove(...)`
  - [x] L376: `turnstile.remove(authFlowState.turnstileWidgetId)` → `window.turnstile.remove(...)`
  - [x] L385: `turnstile.render('#turnstile-container', {` → `window.turnstile.render(...)`
  - **验证**: ✅ grep `turnstile.render|turnstile.remove` 全部为 `window.turnstile.*`

- [x] Task 2: 修复 xpathScraper.js L185 latencyMs 计算逻辑
  - [x] 在 scrapeWithTimeout 函数开头添加 `var t0 = Date.now()`
  - [x] L186 改为 `latencyMs: Date.now() - t0`
  - **验证**: ✅ `Date.now() - t0` 差值毫秒级

- [x] Task 3: CSS 问题修复
  - [x] 删除 styles.css L1425-L1429 的旧 `@keyframes shimmer`（保留 L4467 新定义）
  - [x] `:root` 中添加 `--dark-border-color: rgba(0, 0, 0, 0.12)`
  - [x] `body.dark` 中添加 `--dark-border-color: rgba(255, 255, 255, 0.12)`
  - **验证**: ✅ `@keyframes shimmer` 仅 1 个定义；`--dark-border-color` 出现 2 次（定义+引用）

- [x] Task 4: navigation.js L45 硬编码索引改为语义化选择器
  - [x] `el.querySelectorAll('span')[1]` 改为 `el.querySelector('.text-\\[10px\\]')`
  - **验证**: ✅ 文件内不存在 `querySelectorAll('span')[N]` 硬编码

# Task Dependencies
- 4 个 Task 互不依赖，可并行执行
