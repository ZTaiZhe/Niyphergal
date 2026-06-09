# Hero 飞行过渡基于原版参数彻底重构 Spec

## Why
上一版"增强动画"有 **6 个严重冲突**，导致动画完全无效 + 终定位偏差 + 弧线不可见。需要基于 Kazumi 原版 Flutter SDK 的实际动画参数完全重构。

## 冲突分析报告

### 冲突转储（从代码审查结果提取）

| # | 严重度 | 冲突描述 | 文件:行 |
|---|--------|----------|---------|
| C1 | **致命** | `fill: 'none'` 导致动画结束后 clone 立即跳回 fromRect，`animFinish` 中的终态设置在`下一帧`才生效，中间有 1 帧空白 → 闪白 + 跳变 | [animationHelpers.js:172](file:///d:/\.A素材/Niypher/Niypher/src/js/modules/animationHelpers.js#L172) |
| C2 | **致命** | `transform: scaleX/scaleY` 与 `left/top/width/height` 混用 — 前者走合成管线（compositor），后者走布局管线（layout），浏览器**不保证同步插值** | [animationHelpers.js:136,144,152,160,168](file:///d:/\.A素材/Niypher/Niypher/src/js/modules/animationHelpers.js#L136-L168) |
| C3 | **高** | 最后一帧是 `toRect + overshoot(3px)` 而非精确的 `toRect`，配合 `fill:none` 导致终位永远偏移 3px | [animationHelpers.js:164-165](file:///d:/\.A素材/Niypher/Niypher/src/js/modules/animationHelpers.js#L164-L165) |
| C4 | **高** | `arcHeight = 15% × |dy|`（min 20, max 60），典型场景 dy≈150px → 弧高仅 22px，**肉眼不可见** | [animationHelpers.js:103](file:///d:/\.A素材/Niypher/Niypher/src/js/modules/animationHelpers.js#L103) |
| C5 | **中** | `animFinish` 用 5 行 `clone.style.left/top/...` 手动设置终态，与 `fill:none` 的自动重置之间有时序竞态 | [animationHelpers.js:182-187](file:///d:/\.A素材/Niypher/Niypher/src/js/modules/animationHelpers.js#L182-L187) |
| C6 | **中** | `clone.style.cssText` inline 样式覆盖了 CSS `.hero-clone` 的 `position:fixed`、`z-index`、`will-change` 等关键属性 | [animationHelpers.js:57-65](file:///d:/\.A素材/Niypher/Niypher/src/js/modules/animationHelpers.js#L57-L65) |

### 原版 Kazumi / Flutter SDK 实际动画参数

| 参数 | Flutter SDK 源码 | 值 |
|------|-----------------|-----|
| Hero 过渡时长 | `_kHeroTransitionDuration` | **300ms** |
| Hero 弧线高度 | `MaterialRectArcTween._kMaterialArcHeight` | **32.0** 逻辑像素 |
| 页面转场 (Android/iOS) | `CupertinoPageRoute._kTransitionDuration` | 400ms |
| 页面转场 (Win/Linux) | `FadeUpwardsPageTransitionsBuilder` | 200ms |
| Hero 缓动曲线 | Material 默认 | `fastOutSlowIn` ≈ `cubic-bezier(0.4, 0.0, 0.2, 1.0)` |
| 页面转场缓动 | Cupertino 弹簧感 | `Curves.easeOut` + 弹簧阻尼 |
| `flightShuttleBuilder` | 仅做主题继承 + 透明材质包裹 | 无额外变换 |

**关键发现**：Kazumi 的 `flightShuttleBuilder` **极其简单** — 只是包裹了 `Material(type: MaterialType.transparency)` 和 `InheritedTheme.captureAll`，没有自己实现变形/回弹。灵动感源自：
1. `MaterialRectArcTween` 的 32px 弧线高度（抛物线感）
2. 300ms 快节奏时长（干脆利落）
3. `fastOutSlowIn` 曲线（快出慢入的自然感）
4. CupertinoPageRoute 400ms 弹簧感页面转场（整体页面的柔和过渡）

## What Changes
- **BREAKING**：`performHeroNavigate` 的 `clone.animate()` 全部重写
  - `fill: 'none'` → **`fill: 'forwards'`**（消除闪回）
  - 移除所有 `transform: scaleX/scaleY`（消除渲染管线冲突）
  - 从 5 帧回退到 **3 帧 + offset**（0→0.5 弧顶→1.0 精确终点）
  - 弧高 = `max(32, abs(dy) * 0.3)`（以 Flutter 32px 为下限，30% 动态系数）
  - 时长 = **350ms**（Flutter 300ms + web 补偿 50ms）
  - 缓动 = **`cubic-bezier(0.4, 0.0, 0.2, 1.0)`**（Flutter `fastOutSlowIn` 精确等价）
  - `clone.style.cssText` 改为 `clone.style.setProperty()` 仅设动态属性，让 CSS `.hero-clone` 处理固定属性
  - `animFinish` 不再手动设终态样式（`fill:forwards` 已处理），只负责移除 clone + 揭幕
- `prefers-reduced-motion` 降级保持（200ms, ease-out, 2帧）

## Impact
- Affected specs: enhance-hero-flight-animation, fix-hero-flight-positioning, fix-hero-flicker-and-conflicts, fix-hero-animation-reliable
- Affected code: `src/js/modules/animationHelpers.js`（重写）

---

## ADDED Requirements

### Requirement: `fill: 'forwards'` 消除闪回冲突
`clone.animate()` SHALL 使用 `fill: 'forwards'`。动画结束后 clone 自动保持在精确的 toRect 终态，无需任何手动终态设置。

#### Scenario: 动画结束时 clone 精确在目标位置
- **WHEN** 动画到达 100%
- **THEN** clone 的 left/top/width/height/borderRadius 被 `fill:forwards` 锁在精确的 toRect 值
- **AND** `animFinish` 只需调用 `revealDetailContent()` 然后 `clone.remove()`
- **AND** 无闪回、无跳变

### Requirement: 纯布局属性动画，无 transform
keyframes SHALL 仅包含 `left`、`top`、`width`、`height`、`borderRadius`。SHALL NOT 包含 `transform` 或任何合成层属性。

#### Scenario: 无渲染管线冲突
- **WHEN** `clone.animate()` 执行
- **THEN** 所有动画属性在同一渲染管线（layout）中同步插值
- **AND** 无 compositor/layout 管线交叉导致的时序偏差

### Requirement: 基于 Flutter 参数的弧线高度
弧线高度 SHALL = `max(32, abs(dy) * 0.3)`，上限 80px。下限 32px 精确匹配 Flutter `_kMaterialArcHeight`。

#### Scenario: 弧线肉眼可见
- **WHEN** dy = 200px
- **THEN** arcHeight = max(32, 60) = 60px → 飞行路径明显凸起
- **WHEN** dy = 50px
- **THEN** arcHeight = max(32, 15) = 32px → 至少有 Flutter 标准的 32px 弧线

### Requirement: 3 帧 + offset 关键帧结构
keyframes SHALL 包含 3 帧，使用 `offset` 属性控制时间点：

| offset | 位置 | 说明 |
|--------|------|------|
| 0.0 | fromRect | 起始 |
| 0.45 | fromRect + delta×0.45, top 减去 arcHeight | 弧线顶点，略偏前（45% 而非 50%，模拟加速阶段的快速上升） |
| 1.0 | toRect（**精确**，无 overshoot） | 终点，fill:forwards 保持 |

### Requirement: Flutter fastOutSlowIn 缓动
动画缓动 SHALL = `cubic-bezier(0.4, 0.0, 0.2, 1.0)`，此为 Flutter `Curves.fastOutSlowIn` 的 CSS 精确等价。

### Requirement: 350ms 时长
动画时长 SHALL = 350ms。Flutter 原值为 300ms，web 增加 50ms 补偿浏览器渲染开销。

### Requirement: inline style 与 CSS class 职责分离
`clone.style.cssText` SHALL 被移除。改用 `clone.style.setProperty()` 仅设置动态属性（left/top/width/height/border-radius/object-fit/margin），让 CSS `.hero-clone` 规则负责固定属性（position/z-index/pointer-events/overflow/box-shadow/will-change）。

#### Scenario: CSS class 生效
- **WHEN** clone 被创建
- **THEN** `className = 'hero-clone'` 的 CSS 规则生效
- **AND** inline style 仅覆盖动态属性
- **AND** 无属性被 inline style 意外覆盖

### Requirement: animFinish 只做清理
`animFinish` SHALL 不再设置 clone 终态样式。SHALL 仅：清除超时 → `revealDetailContent()` → 移除 clone → 重置标志。

### Requirement: prefers-reduced-motion 降级
SHALL 保持 `prefers-reduced-motion` 检测。降级时：2 帧、200ms、ease-out、无弧线、fill:forwards。
