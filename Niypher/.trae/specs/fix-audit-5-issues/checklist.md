# Checklist

## Task 1: Turnstile 裸变量修复
- [x] auth.js 中不再存在裸 `turnstile.render(` 调用（全部为 `window.turnstile.render(`）
- [x] auth.js 中不再存在裸 `turnstile.remove(` 调用（全部为 `window.turnstile.remove(`）
- [x] ES Module strict mode 下 Turnstile 初始化不抛 ReferenceError

## Task 2: XPath latency 修复
- [x] `scrapeWithTimeout` 函数开头有 `var t0 = Date.now()`
- [x] L186 为 `latencyMs: Date.now() - t0`
- [x] latencyMs 值在合理范围（>0 且 <超时值）

## Task 3: CSS 问题修复
- [x] styles.css 中仅存在 1 个 `@keyframes shimmer` 定义（L4467）
- [x] `--dark-border-color` 在 `:root`（rgba(0,0,0,0.12)）和 `body.dark`（rgba(255,255,255,0.12)）中有定义
- [x] `border-bottom-color: var(--dark-border-color)` 不产生未定义变量警告

## Task 4: navigation 选择器修复
- [x] `el.querySelectorAll('span')[1]` 已被 `el.querySelector('.text-\\[10px\\]')` 替换
- [x] 导航按钮文字在 "推荐"/"刷新" 切换时正确显示
