# Hero 飞行过渡自适应重构 Spec

## Why
当前 Hero 飞行过渡存在问题：
1. **动效冲突**：飞行与详情页 `animate-fade-in` + `page-transition-new` + `detail-stagger-layer` 三组动画并发
2. **定位错误**：`toRect` 从过渡容器的临时 DOM 获取，坐标漂移
3. **硬编码脆弱**：`.detail-hero-img` 选择器写死在 animationHelpers 中，页面布局改变即崩溃
4. **竞态条件**：`performHeroNavigate` 的 `3×rAF` 等待与 renderer 的 `debounce(fn, 0)` 之间无同步信号
5. **无重复点击防护**：快速双击产生多个 clone 浮层
6. **无图片加载检查**：lazy-load 图片未加载时 clone 为空白

## What Changes
- 引入 `data-hero-role` 属性体系，animationHelpers 零硬编码选择器
- renderer 在 detail 注入完成后派发 `detail:rendered` 自定义事件，`performHeroNavigate` 监听此事件替代 rAF 猜测
- **BREAKING**：详情页飞行期间 `visibility: hidden`，飞行完成后由 `revealDetailContent()` 统一揭幕
- **BREAKING**：renderer.js 中 detail 跳过传统 `page-transition-old/new` 动画
- 增加 `_heroInFlight` 防重复点击、`sourceImg.complete` 加载检查、无目标元素时的优雅降级

## Impact
- Affected specs: refactor-homepage-layout-transitions, fix-audit-5-issues
- Affected code: `src/js/modules/animationHelpers.js`, `src/js/modules/renderer.js`, `src/js/modules/eventDelegation.js`, `src/js/pages/detail.js`, `src/css/styles.css`

---

## ADDED Requirements

### Requirement: data-hero-role 自适应标记
系统 SHALL 使用 `data-hero-role` 属性标记飞行过渡的参与元素。animationHelpers 中禁止出现任何 CSS 类名字面量。

| 值 | 位置 | 说明 |
|----|------|------|
| `source` | 任意页面的卡片封面 `<img>` | 飞行起点，页面布局变更后自动适配 |
| `target` | 详情页 Hero 区域 `<img>` | 飞行终点，重命名/移动元素后无需改 JS |
| `reveal-group` | 详情页需飞行完成后淡入的容器 | 统一由 `revealDetailContent()` 控制 |

#### Scenario: 详情页布局重构
- **WHEN** 开发者将 Hero 图片的 CSS 类从 `.detail-hero-img` 改为 `.hero-banner` 并调整 DOM 结构
- **THEN** `performHeroNavigate` 通过 `[data-hero-role="target"]` 自动找到新元素
- **AND** 从目标元素读取 `getComputedStyle` 获取 `borderRadius`/`objectFit`，clone 自动匹配目标外观
- **AND** 不需要修改 animationHelpers.js

---

### Requirement: renderer 与 performHeroNavigate 事件协调
`injectSection` 在注入 detail 页面后 SHALL 派发 `detail:rendered` 自定义事件。`performHeroNavigate` SHALL 监听此事件以获知目标元素已就位，替代不可靠的固定次数 rAF。

#### Scenario: 正常飞行时序
- **WHEN** `performHeroNavigate` 调用 `router.push('detail', {id})`
- **THEN** renderer → debounce(fn, 0) → `injectSection('detail', content)` → `container.dispatchEvent(new CustomEvent('detail:rendered'))`
- **THEN** `performHeroNavigate` 收到 `detail:rendered` 后查询 `[data-hero-role="target"]`，读取 `toRect`，执行飞行
- **AND** 不使用固定次数的 requestAnimationFrame

#### Scenario: 超时降级
- **WHEN** `detail:rendered` 在 800ms 内未触发
- **THEN** clone 被移除，详情页直接显示（无飞行）

---

### Requirement: 飞行期间详情页不可见
详情页根容器在飞行期间 SHALL 设定 `visibility: hidden`，飞行完成后由 `revealDetailContent()` 统一揭幕。

#### Scenario: 有来源导航（点击卡片）
- **WHEN** 用户点击卡片进入详情页
- **THEN** renderer 渲染的 detail 页面初始 `visibility: hidden`
- **AND** `performHeroNavigate` 执行飞行→移除 clone→调用 `revealDetailContent()`
- **AND** `revealDetailContent()` 将根容器设为 `visibility: visible`，触发 stagger-layer 五层入场

#### Scenario: 无来源导航（URL hash 直入 / 浏览器前进后退）
- **WHEN** renderer 检测到本次渲染非 Hero 飞行触发（`isHeroTransition === false`）
- **THEN** detail 页面以 `visibility: visible` 渲染，`initDetailAnimations()` 立即执行

#### Scenario: 详情页目标元素不存在
- **WHEN** `[data-hero-role="target"]` 查询无结果
- **THEN** 移除 clone，详情页直接显示（降级，无飞行）

---

### Requirement: 重复点击防护
系统 SHALL 在飞行期间阻止第二次触发。

#### Scenario: 快速双击两张不同卡片
- **WHEN** 飞行已在进行中（`_heroInFlight === true`）
- **AND** 用户再次点击另一张卡片
- **THEN** 第二次点击被忽略，`router.push` 不被调用

---

### Requirement: 源图片加载检查
系统 SHALL 在创建 clone 前确认源图片已加载。

#### Scenario: Lazy-load 源图片未下载
- **WHEN** `sourceImg.complete === false`
- **THEN** 等待 `sourceImg.onload` 后再创建 clone
- **AND** 若 300ms 内未触发 onload，直接放弃飞行降级为普通导航

---

### Requirement: 飞行反向动画（返回时）
当用户从详情页按返回键回到上一页时，系统 MAY 执行反向飞行。此项为 **可选**（spec 范围外），但动画框架应预留扩展点。
