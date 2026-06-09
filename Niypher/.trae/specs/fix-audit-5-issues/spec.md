# 全量代码审查问题修复 Spec

## Why
全项目逐行审查发现 5 个真实问题：1 个 Critical（Turnstile 裸变量导致 ES Module strict mode 抛 ReferenceError）、1 个 Major（XPath latency 计算用绝对时间减相对时间）、3 个 Minor（CSS 未定义变量、重复 keyframe、navigation 硬编码索引）。

## What Changes
- `auth.js`：4 处裸变量 `turnstile.render/remove` 改为 `window.turnstile`
- `xpathScraper.js`：`latencyMs` 计算改为 `Date.now() - t0`（在函数开头记录 `const t0 = Date.now()`）
- `styles.css`：删除 L1425 重复的 `@keyframes shimmer`（保留 L4466 新定义）；L245 `var(--dark-border-color)` 添加 CSS 变量定义
- `navigation.js`：L45 `el.querySelectorAll('span')[1]` 改为语义化选择器

## Impact
- Affected specs: refactor-homepage-layout-transitions
- Affected code: `src/js/modules/auth.js`, `src/js/modules/xpathScraper.js`, `src/css/styles.css`, `src/js/modules/navigation.js`

---

## MODIFIED Requirements

### Requirement: Turnstile API 调用使用 window 前缀
auth.js 中对 Cloudflare Turnstile API 的调用 SHALL 使用 `window.turnstile` 而非裸变量 `turnstile`，以兼容 ES Module strict mode。

#### Scenario: 初始化 Turnstile widget
- **WHEN** `Actions.initTurnstile()` 被调用
- **THEN** 通过 `window.turnstile.render()` 创建 widget
- **AND** 不抛出 `ReferenceError: turnstile is not defined`

#### Scenario: 销毁 Turnstile widget
- **WHEN** 用户关闭登录弹窗或重置验证状态
- **THEN** 通过 `window.turnstile.remove(widgetId)` 销毁 widget

---

### Requirement: XPath 延迟计算使用同源时间戳
scrapeWithTimeout 的 `latencyMs` 字段 SHALL 使用 `Date.now()` 差值计算，而非混合 `Date.now()` 与 `performance.now()`。

#### Scenario: 抓取成功
- **WHEN** 抓取在超时内完成
- **THEN** `latencyMs` 为 `Date.now() - startTime` 的毫秒差（约 100-5000ms）
- **AND** 不再出现数千亿的无意义数值

---

### Requirement: CSS 变量完整定义
styles.css 中使用的所有 CSS 变量 SHALL 在 `:root` 或 `body.dark` 中有对应定义。

---

### Requirement: 导航栏选择器免责
navigation.js 中查找导航文本 span 时 SHALL 使用语义化选择器而非硬编码索引。
