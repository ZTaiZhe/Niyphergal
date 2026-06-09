# Hero 飞行过渡定位重构 Spec

## Why
当前 Hero 飞行过渡定位始终存在偏差。根本原因是 `transform: translate(dx,dy) scale(sx,sy)` 配合默认 `transform-origin: 50% 50%` 时，scale 围绕元素中心缩放会产生 `width*(1-sx)/2` 的左上角偏移，而 dx/dy 未补偿此偏移，导致 clone 无法精确落在目标位置。需要换一种完全不同的定位策略。

## What Changes
- **BREAKING**：废弃 `transform: translate() scale()` 方案，改用 **直接属性动画**（animate `left/top/width/height`），彻底消除 transform-origin 偏移问题
- **BREAKING**：用 **Web Animations API** (`Element.animate()`) 替代 CSS transition + transitionend + setTimeout 三件套，简化动画控制
- 移除 `transitionend` 监听和手动 `setTimeout` fallback，改用 `animation.onfinish` + `animation.cancel()` 超时兜底
- clone 初始样式添加 `will-change: left, top, width, height, border-radius` 提示浏览器优化合成
- CSS `.hero-clone` 规则更新，移除不再需要的属性

## Impact
- Affected specs: fix-hero-transition-conflict
- Affected code: `src/js/modules/animationHelpers.js`（主要重写）, `src/css/styles.css`（.hero-clone 规则更新）

---

## ADDED Requirements

### Requirement: 直接属性动画替代 Transform 动画
系统 SHALL 使用 `left`/`top`/`width`/`height` CSS 属性动画替代 `transform: translate() scale()` 来实现 clone 从源位置到目标位置的飞行。

#### Scenario: clone 从卡片封面飞到详情页 Hero 图
- **WHEN** `performHeroNavigate` 收到 `detail:rendered` 事件并读取到 `toRect`
- **THEN** clone 通过 Web Animations API 从 `(fromRect.left, fromRect.top, fromRect.width, fromRect.height)` 动画到 `(toRect.left, toRect.top, toRect.width, toRect.height)`
- **AND** 不使用任何 `transform` 属性
- **AND** 动画结束后 clone 位置精确等于 `toRect`

#### Scenario: 源图片与目标图片宽高比不同
- **WHEN** 源卡片封面为正方形比例，目标 Hero 图为 16:9
- **THEN** clone 从源的宽高平滑过渡到目标的宽高
- **AND** `object-fit: cover` 确保 clone 内图片内容始终填满无留白

---

### Requirement: Web Animations API 替代 CSS transition
系统 SHALL 使用 `Element.animate()` 执行飞行动画，替代 CSS transition + transitionend + setTimeout。

#### Scenario: 正常飞行完成
- **WHEN** `Element.animate()` 返回的 Animation 对象触发 `onfinish`
- **THEN** clone 被移除，`revealDetailContent()` 被调用，`_heroInFlight` 重置

#### Scenario: 动画超时（Animation 挂起未完成）
- **WHEN** 动画启动后 600ms 仍未触发 `onfinish`
- **THEN** 调用 `animation.cancel()` 强制终止，clone 被移除，详情页直接显示

#### Scenario: 浏览器不支持 Web Animations API
- **WHEN** `Element.prototype.animate` 不存在
- **THEN** 降级为直接设置目标位置（无动画），clone 立即移除，详情页直接显示

---

### Requirement: will-change 性能提示
clone 元素 SHALL 设置 `will-change: left, top, width, height, border-radius` 以提示浏览器提前创建合成层。

#### Scenario: 浏览器合成优化
- **WHEN** clone 被添加到 DOM
- **THEN** 浏览器收到 will-change 提示，将 clone 提升为独立合成层
- **AND** left/top/width/height 动画不触发主线程布局重算（仅合成层属性变更）

---

## MODIFIED Requirements

### Requirement: performHeroNavigate 函数签名与流程
函数签名保持 `performHeroNavigate(sourceImg, targetId, routerInstance)` 不变，内部流程修改为：

1. 防重复点击（`_heroInFlight`）
2. 读取 `fromRect`、`fromSrc`、`fromStyle`
3. 创建 clone，设置初始位置为 fromRect，添加 `will-change`
4. 调用 `routerInstance.push('detail', { id: targetId })`
5. 监听 `detail:rendered` 事件
6. 收到事件后读取 `toRect`、`toStyle`
7. 调用 `clone.animate(keyframes, options)` 执行飞行
8. `onfinish` 回调中移除 clone、揭幕详情页、重置标志
9. 800ms 超时兜底：`animation.cancel()` + 降级显示

### Requirement: CSS .hero-clone 规则
`.hero-clone` CSS 规则 SHALL 更新为：
```css
.hero-clone {
    position: fixed;
    z-index: 999;
    pointer-events: none;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    will-change: left, top, width, height, border-radius;
}
```
移除硬编码的 `border-radius: 0.75rem`（改为 JS 动态设置）。

## REMOVED Requirements

### Requirement: transform + transitionend 动画方案
**Reason**: transform-origin 偏移导致定位永远不准确，且 transitionend + setTimeout 的完成检测不可靠
**Migration**: 替换为 Web Animations API 直接属性动画
