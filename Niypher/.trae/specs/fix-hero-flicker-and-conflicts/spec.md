# Hero 飞行过渡闪烁与动效冲突全面修复 Spec

## Why
Hero 飞行过渡仍存在闪烁，根因是多层动效冲突和时序竞态。具体有 5 个问题：

1. **`fill: 'forwards'` 导致闪烁**：`clone.animate()` 用 `fill: 'forwards'` 保持终态，但 `animation.onfinish` 触发时 `revealDetailContent()` 将 L0 stagger 层设为 `is-visible`（opacity:1），同时 clone 仍以 `fill: 'forwards'` 占据终态位置。当 clone 被移除时，详情页 L0 层的 `transition: opacity 0.4s` 正在执行中（从 0→1），而 clone 突然消失，导致短暂可见的图片跳变。

2. **L0 stagger 层 transition 与 clone 重叠**：`revealDetailContent()` 给 L0 添加 `is-visible` 触发 `transition: opacity 0.4s ease-out, transform 0.4s ease-out`，但此时 clone 还覆盖在上面。clone 移除后 L0 的 transition 可能才进行到一半，造成视觉跳变。

3. **`_heroTransition` 标志未重置**：`performHeroNavigate` 结束后只重置 `_heroInFlight`，但 `detail.js` 中的 `_heroTransition` 标志从未被重置为 `false`，导致后续非 Hero 导航（如浏览器后退再前进）仍走 Hero 路径。

4. **`_descToggleBound` 跨渲染残留**：`_descToggleBound` 是模块级变量，只在 `true` 后永不重置。当详情页重新渲染时（导航到另一个资源），旧的按钮已从 DOM 移除，新按钮无法绑定事件。

5. **推荐卡片无 `data-action="navigate-detail"` 父级**：`sourceImg.closest('[data-action="navigate-detail"]')` 对推荐卡片可能找不到父级，回退到 `sourceImg.parentElement`（可能是 `.recommendation-info` 而非卡片容器），导致 `fromBorderRadius` 读取错误。

## What Changes
- 移除 `fill: 'forwards'`，改为在 `onfinish` 中手动设置 clone 终态样式，确保 clone 在移除前已与目标完全重合
- L0 stagger 层在 Hero 飞行期间跳过 transition，直接设置 `opacity: 1; transform: none`（无动画），其余层保持 stagger
- `performHeroNavigate` 结束时调用 `setHeroTransition(false)` 重置标志
- `_descToggleBound` 在 `revealDetailContent` 和 `initDetailAnimations` 入口重置
- 推荐卡片的 `fromBorderRadius` 查找逻辑增加 `.recommendation-card` 回退

## Impact
- Affected specs: fix-hero-flight-positioning, fix-hero-transition-conflict
- Affected code: `src/js/modules/animationHelpers.js`, `src/js/pages/detail.js`, `src/css/styles.css`

---

## ADDED Requirements

### Requirement: clone 终态手动设置替代 fill:forwards
`clone.animate()` SHALL NOT 使用 `fill: 'forwards'`。动画完成后 SHALL 在 `onfinish` 回调中手动将 clone 的 `left/top/width/height/borderRadius` 设置为终态值，然后再移除 clone。

#### Scenario: 动画完成时 clone 与目标完全重合
- **WHEN** `animation.onfinish` 触发
- **THEN** clone 的 inline style 已被设为终态值（与 toRect 一致）
- **AND** `revealDetailContent()` 被调用，L0 层立即可见
- **AND** clone 在同一帧内被移除
- **AND** 无视觉跳变

### Requirement: L0 stagger 层 Hero 飞行期间跳过 transition
当 Hero 飞行过渡完成时，L0 stagger 层（含 Hero 目标图片）SHALL 直接设置 `opacity: 1; transform: none`，不触发 CSS transition。

#### Scenario: Hero 飞行完成后 L0 立即显示
- **WHEN** `revealDetailContent()` 在 Hero 飞行上下文中被调用
- **THEN** L0 stagger 层的 `is-visible` 类被添加
- **AND** L0 的 `transition` 属性被临时设为 `none`
- **AND** L0 立即显示（无 0.4s transition 延迟）
- **AND** 其余 stagger 层（L1-L4）保持正常 stagger transition

### Requirement: 推荐卡片 border-radius 查找
`fromBorderRadius` 的查找逻辑 SHALL 支持推荐卡片结构。

#### Scenario: 推荐卡片点击
- **WHEN** 源图片位于 `.recommendation-card` 内
- **THEN** `fromBorderRadius` 从 `.recommendation-card` 读取
- **AND** 圆角动画正确

---

## MODIFIED Requirements

### Requirement: _heroTransition 标志重置
`performHeroNavigate` 的所有退出路径 SHALL 调用 `setHeroTransition(false)` 重置标志。

#### Scenario: Hero 飞行完成后再次导航
- **WHEN** Hero 飞行完成，用户从详情页返回首页，再点击另一张卡片
- **THEN** `_heroTransition` 已被重置为 `false`
- **AND** 新的 Hero 飞行正常触发

### Requirement: _descToggleBound 重置
`_descToggleBound` SHALL 在每次详情页渲染时重置为 `false`，允许重新绑定事件。

#### Scenario: 导航到不同资源的详情页
- **WHEN** 用户从资源 A 的详情页导航到资源 B 的详情页
- **THEN** 资源 B 的描述切换按钮正常工作
