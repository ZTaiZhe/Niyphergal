# 退出详情页时采用反向飞行过渡 Spec

## Why
进入详情页有流畅的 hero 飞行过渡（源卡片 → 详情大图 + 弹簧），退出时只有普通滑动/淡入动画，体验不对称。应在退出时采用反向飞行过渡：详情大图飞回源页面卡片位置。

## What Changes
- 在 `animationHelpers.js` 中新增 `performHeroExit()` 反向飞行函数
- 在 `performHeroNavigate()` 中存储退出上下文 `{ gameId, sourcePage }`
- 在 `renderer.js` 的 `injectSection` 中派发 `page:rendered` 事件
- 在 `eventDelegation.js` 中新增 `navigate-hero-back` action
- 修改 `detail.js` 返回按钮根据 hero 上下文切换 action

## ⚠️ 实施陷阱预测与防护

### 陷阱 1: 导航后 DOM 已被替换，目标图片消失
**严重度** 🔴 致命
**描述**：`router.push(sourcePage)` → `render()` → `sections.forEach(sec => sec.remove())` 会移除 detail section（含 `[data-hero-role="target"]` 图片）。如果先导航再获取图片位置，`getBoundingClientRect()` 返回 0。
**防护**：**在导航前**捕获 `targetImg.getBoundingClientRect()` 和 `targetImg.currentSrc`。

### 陷阱 2: page:rendered 后卡片仍被 is-hidden 隐藏
**严重度** 🟡 中
**描述**：home 页面的游戏卡片初始带有 `is-hidden` class（`opacity: 0; transform: translateY(20px)`）。`page:rendered` 派发后，`initHomeAnimations()` 才会在 `setTimeout(50)` 或 `requestAnimationFrame` 中触发 stager 动画显示卡片。如果过早查找卡片，`getBoundingClientRect` 仍返回有效坐标（元素在 DOM 中只是不可见），但用户视觉上卡片不可见。
**防护**：先调用 `initHomeAnimations()` 让卡片立即显示，再查找和飞行。或者使用 `requestAnimationFrame × 2` 等待卡片渲染完成。

### 陷阱 3: 飞行方向与进入动画冲突
**严重度** 🟡 中
**描述**：退出时 renderer 也会执行页面切换动画（从 detail 的 `page-transition-container` 滑动到 source page）。hero clone 的飞行和页面滑动动画同时发生会视觉混乱。
**防护**：在 `performHeroExit` 导航时，可能需要跳过页面过渡动画。最简单做法：导航后立即隐藏过渡容器中的内容，只让 clone 飞行可见，飞行结束后才显示页面。或者降低页面滑动透明度。

### 陷阱 4: 并发飞行冲突（_heroInFlight 共享）
**严重度** 🟡 中
**描述**：`performHeroNavigate` 使用 `_heroInFlight` 防重入。如果退出飞行也与它共享这个标志，可能相互阻塞。如果使用独立标志，可能两个动画同时运行。
**防护**：使用独立的 `_heroExitInFlight` 标志，同时在两个函数中互相检查对方标志。

### 陷阱 5: 上下文泄漏
**严重度** 🟡 中
**描述**：如果用户通过 hero 进入 detail，然后通过 docker 导航到其他页面（而非返回按钮），`_heroExitContext` 未被清除。下次点击返回按钮（在另一个页面）时会错误地触发飞行。
**防护**：在 `performHeroExit()` 的 cleanup 中清除上下文；同时在 `render()` 函数中检测如果离开 detail 且非 hero exit 路径，清除上下文。

### 陷阱 6: 源页面可能不是 home
**严重度** 🟡 中
**描述**：`renderGameCard` 仅在 home 和 search 页面使用。从 category 或 galgame 页面不会触发 `navigate-detail`（这些页面没有游戏卡片）。但通过 URL 直接进入 detail 再返回时，sourcePage 可能不是 home。
**防护**：`_heroExitContext.sourcePage` 只在 `performHeroNavigate` 设置（仅从 home/search 触发），始终为 home 或 search。返回按钮在无上下文时降级为 `navigate-home`。

### 陷阱 7: 动画后页面滚动位置
**严重度** 🟢 低
**描述**：`router.push` 调用 `_scrollTo(0)` 滚动到顶部。克隆动画的目标坐标基于 GBCR（视口相对坐标），滚动不影响 GBCR 值。但如果导航后在动画帧之间有滚动介入，目标位置可能偏移。
**防护**：在导航后立即捕获目标卡片坐标（此时已在顶部），或使用 `scrollTop` 补偿。

### 陷阱 8: waitForAnimationEnd 的 500ms fallback 叠加
**严重度** 🟢 低
**描述**：退出飞行如果走动画分支（`animationClass && router.previous && _mode !== 'pop'`），renderer 会等 500ms 才调用 `injectSection` 派发 `page:rendered`。但 exit flight 需要页面早点渲染完成来获取目标卡片坐标。
**防护**：在 `performHeroExit` 中导航后，不走动画分支（避免 500ms 等待）。可以考虑使用 `router.replace` 或直接修改渲染模式。或者调整动画分支逻辑，让 exit flight 走更快的路径。

## Impact
- Affected specs: hero 飞行过渡、详情页导航、页面渲染事件
- Affected code:
  - `src/js/modules/animationHelpers.js` — 新增 `performHeroExit`、hero 上下文存取函数
  - `src/js/modules/eventDelegation.js` — 新增 `navigate-hero-back` action
  - `src/js/modules/renderer.js` — `injectSection` 后派发 `page:rendered` 事件；离开 detail 时清除 hero 上下文
  - `src/js/pages/detail.js` — 返回按钮条件式渲染

## ADDED Requirements

### Requirement: 反向飞行过渡
系统 SHALL 在用户通过返回按钮从详情页退出时，执行反向 hero 飞行过渡：详情大图 clone 从当前视口位置飞回到源页面卡片位置，伴随弹簧弹跳。

#### Scenario: 从首页卡片进入详情后点击返回
- **WHEN** 用户点击首页游戏卡片进入详情（hero 飞行），然后点击返回按钮
- **THEN** 详情大图创建 clone，从详情位置反向飞回首页对应卡片位置（弧线路径），弹簧弹跳后 clone 消失并 clear 上下文，首页 stagger 内容正常显示

#### Scenario: 直接进入详情（无 hero 上下文）后点击返回
- **WHEN** 用户通过 URL 直接进入详情页（无 hero 上下文）
- **THEN** 返回按钮执行普通 `navigate-home`，无飞行过渡

### Requirement: Hero 退出上下文存储与清理
系统 SHALL 在 `performHeroNavigate()` 中存储 `{ gameId, sourcePage }`，在 `performHeroExit()` 完成或用户从 detail 通过其他方式离开时清除。

#### Scenario: hero 进入后存储上下文
- **WHEN** `performHeroNavigate(sourceImg, targetId, router)` 被调用
- **THEN** `_heroExitContext = { gameId: targetId, sourcePage: routerInstance.current }`

#### Scenario: 通过 docker 导航离开 detail 清除上下文
- **WHEN** 用户在 detail 页面通过 docker 跳转到其他页面
- **THEN** `_heroExitContext` 被清除

### Requirement: 页面渲染完成信号
系统 SHALL 在 `injectSection()` 完成后派发 `page:rendered` CustomEvent 到 `#main-container`。

#### Scenario: 页面渲染完成
- **WHEN** `injectSection('home', content)` 执行完毕
- **THEN** `page:rendered` 事件派发，`detail.page` 为渲染的页面名称

### Requirement: 退出飞行防并发
系统 SHALL 在 `performHeroExit` 运行时阻止 concurrent 进入飞行和退出飞行。

#### Scenario: 退出飞行进行中再次点击
- **WHEN** 退出飞行进行中，用户再次点击返回按钮或其他卡片
- **THEN** 第二次操作被忽略，不执行

## REMOVED Requirements

（无移除项）
