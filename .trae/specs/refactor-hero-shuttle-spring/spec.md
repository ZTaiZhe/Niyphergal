# Hero 飞行穿梭弹簧动画重构 Spec

## Why
当前实现将克隆元素作为整体做回弹关键帧（offset=0.82 过冲+挤压），这是错误的。原版 Kazumi 的拆解是：**图片框架**（容器）沿弧线飞到目标位置后**固定**，**图片内容**在框架内以原方向为起始方向、目标位置为平衡点做**弹簧简谐运动**，直到第一次回到平衡点即为结束。两者是独立的两层动画，不是单元素的 bounce keyframe。

## 设计原理

### 两层分离模型

```
┌─────────────────────┐  ← 框架（Frame）：position:fixed, 动画 left/top/width/height
│   ┌─────────────┐   │
│   │  图片内容    │   │  ← 内容（Content）：transform:translate, 弹簧简谐运动
│   └─────────────┘   │
└─────────────────────┘
```

- **框架动画（Phase 1）**：容器从 fromRect 沿弧线飞到 toRect，到达后固定。动画属性：`left/top/width/height/borderRadius`，走布局管线。
- **内容弹簧（Phase 2）**：框架固定后，图片内容在框架内做弹簧简谐运动。动画属性：`transform: translate()`，走合成管线。因为内容是框架的子元素，translate 仅影响内容在框架内的偏移，不与框架的布局属性冲突。

### 弹簧简谐运动分析

"以原方向为开始方向" = 初始位移朝向来源方向（内容"滞后"于框架）
"预定位置为平衡点" = 目标位置（translate(0,0)）为平衡点
"直到第一次回到平衡点" = 从正位移出发，过冲到负位移，再回到平衡点

位移曲线：**+A → 0 → -A' → 0**

```
位移
 ↑ +A (朝来源方向)
 │╲
 │  ╲
 │   ╲
0 ────╳────────╳───→ 时间
 │     过平衡点   回到平衡点
 │              ╱
 │            ╱
 ↓ -A' (过冲，朝目标前方)
```

这是 3/4 周期的阻尼余弦：`x(t) = A·e^(-γt)·cos(ωt)`，取前 3/4 周期。

### 位移量计算

初始位移方向 = 从目标指向来源的归一化向量 × 位移幅度

```
dirX = (fromRect.left - toRect.left) / distance   // 归一化
dirY = (fromRect.top - toRect.top) / distance
amplitude = clamp(8, distance × 0.06, 24)          // 8~24px
dispX = dirX × amplitude
dispY = dirY × amplitude
```

过冲量 = 初始位移 × 0.4（阻尼系数）

## What Changes
- **BREAKING**：克隆元素从单层 `<img>` 改为双层 `<div>` + `<img>` 结构
- **BREAKING**：动画从单元素 4 帧关键帧改为框架 3 帧弧线 + 内容 4 帧弹簧的两阶段动画
- CSS 新增 `.hero-clone-content` 样式
- `animationHelpers.js` 的 `performHeroNavigate` 重写克隆创建和动画逻辑

## Impact
- Affected specs: add-hero-bounce-ending（替代）, rewrite-hero-animation（修改）
- Affected code: `src/js/modules/animationHelpers.js`（重写克隆创建+动画逻辑）, `src/css/styles.css`（新增 .hero-clone-content）

---

## ADDED Requirements

### Requirement: 双层克隆结构
克隆元素 SHALL 为双层结构：
- 外层 `<div class="hero-clone">`：框架容器，承担 `position:fixed`、`overflow:hidden`、`border-radius`、`box-shadow`
- 内层 `<img class="hero-clone-content">`：图片内容，`width:100%; height:100%; object-fit:cover`

#### Scenario: 克隆创建
- **WHEN** `performHeroNavigate` 创建克隆
- **THEN** 创建 `<div>` 作为框架，设置 `className='hero-clone'`，inline style 设置 `left/top/width/height/borderRadius`
- **AND** 创建 `<img>` 作为内容，设置 `className='hero-clone-content'`，`src` 来自源图
- **AND** img 附加到 div，div 附加到 document.body

### Requirement: 框架弧线飞行动画（Phase 1）
框架 SHALL 从 fromRect 沿弧线飞到 toRect，到达后固定。

#### Scenario: 框架飞行动画
- **WHEN** 框架动画开始
- **THEN** 使用 3 帧关键帧（offset: 0 / 0.45 / 1.0），包含弧线偏移
- **AND** 弧高 = `max(32, abs(dy) × 0.3)`，上限 80px
- **AND** 时长 = 350ms
- **AND** 缓动 = `cubic-bezier(0.4, 0.0, 0.2, 1.0)`（fastOutSlowIn）
- **AND** `fill: 'forwards'`
- **AND** 动画属性仅含 `left/top/width/height/borderRadius`

### Requirement: 内容弹簧简谐运动（Phase 2）
框架动画完成后，图片内容 SHALL 在框架内做弹簧简谐运动。

#### Scenario: 弹簧动画启动
- **WHEN** 框架动画的 `onfinish` 触发
- **THEN** 启动内容的弹簧动画

#### Scenario: 弹簧关键帧
- **WHEN** 弹簧动画执行
- **THEN** 使用 4 帧关键帧：

| offset | translate | 说明 |
|--------|-----------|------|
| 0.0 | `(dispX, dispY)` | 初始位移，朝来源方向 |
| 0.40 | `(0, 0)` | 第一次过平衡点 |
| 0.72 | `(-dispX×0.4, -dispY×0.4)` | 过冲，朝目标前方（阻尼至 40%） |
| 1.0 | `(0, 0)` | 回到平衡点，动画结束 |

- **AND** 位移量 `amplitude = clamp(8, distance × 0.06, 24)`
- **AND** 位移方向 = 从目标指向来源的归一化向量
- **AND** 过冲量 = 初始位移 × 0.4

#### Scenario: 弹簧动画参数
- **WHEN** 弹簧动画执行
- **THEN** 时长 = 220ms
- **AND** 缓动 = `cubic-bezier(0.4, 0.0, 0.2, 1.0)`
- **AND** `fill: 'forwards'`
- **AND** 动画属性仅含 `transform`

### Requirement: 两阶段动画时序
框架动画和内容弹簧 SHALL 顺序执行，框架先完成，弹簧后启动。

#### Scenario: 时序保证
- **WHEN** 框架动画 `onfinish` 触发
- **THEN** 才启动内容弹簧动画
- **AND** 弹簧动画 `onfinish` 触发后才执行清理（revealDetailContent + 移除克隆 + 重置标志）

### Requirement: 内容弹簧使用 transform
内容弹簧动画 SHALL 仅使用 `transform: translate()` 属性。SHALL NOT 使用 `left/top/margin` 等布局属性。

#### Scenario: 无布局管线冲突
- **WHEN** 内容弹簧动画执行
- **THEN** transform 在合成管线执行，不影响框架的布局属性
- **AND** 框架已固定在 toRect，内容偏移仅在框架内部

### Requirement: prefers-reduced-motion 降级
SHALL 保持 `prefers-reduced-motion` 检测。降级时：框架 2 帧 200ms ease-out，无弧线，无内容弹簧。

#### Scenario: 减少动效偏好
- **WHEN** `window.matchMedia('(prefers-reduced-motion: reduce)').matches` 为 `true`
- **THEN** 框架动画简化为 2 帧、200ms、ease-out、无弧线
- **AND** 跳过内容弹簧动画

### Requirement: CSS .hero-clone-content 样式
SHALL 新增 `.hero-clone-content` CSS 规则。

#### Scenario: 内容图片样式
- **WHEN** `.hero-clone-content` 渲染
- **THEN** `width: 100%; height: 100%; object-fit: cover; display: block;`
- **AND** `will-change: transform;`

## MODIFIED Requirements

### Requirement: 克隆创建逻辑
`performHeroNavigate` 中的克隆创建 SHALL 从创建单个 `<img>` 改为创建 `<div>` + `<img>` 双层结构。框架 div 继承原 `.hero-clone` 的 CSS，内容 img 使用新的 `.hero-clone-content` CSS。

### Requirement: 动画清理逻辑
动画清理 SHALL 在内容弹簧的 `onfinish` 中执行（而非框架动画的 `onfinish`）。清理内容：`revealDetailContent()` → 移除克隆 → `_heroInFlight = false` → `setHeroTransition(false)`。

## REMOVED Requirements

### Requirement: 过冲 + 挤压变形关键帧（offset=0.82）
**Reason**: 单元素 bounce keyframe 方案不正确，原版是框架+内容两层分离动画
**Migration**: 替换为框架弧线飞行 + 内容弹簧简谐运动的两阶段方案
