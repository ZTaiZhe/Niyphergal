# Hero 飞行过渡灵动动画增强 Spec

## Why
当前 Hero 飞行过渡是简单的线性位移+缩放，缺乏物理感和灵动性。原版 Kazumi 使用 Flutter 的 `MaterialRectArcTween`（弧线路径）+ `Curves.fastOutSlowIn`（快出慢入曲线）+ Cupertino 弹簧转场，产生了自然的加速变形和柔和着陆效果。需要在 Web 端复现这些物理动画特性。

## What Changes
- 飞行路径从直线改为**弧线**（模拟 Flutter 的 `MaterialRectArcTween`）
- 添加**加速阶段变形**（squash/stretch）：起飞时水平拉伸、垂直压缩，模拟加速惯性
- 添加**着陆回弹**（bounce/overshoot）：到达终点时略微越过目标再弹回，模拟弹簧阻尼
- 缓动曲线从 `cubic-bezier(0.25, 0.46, 0.45, 0.94)` 改为**自定义弹簧曲线**
- 动画时长从 350ms 延长至 **450ms**（弹簧动画需要更长收敛时间）
- 添加 `prefers-reduced-motion` 降级：减少动效偏好下跳过变形和回弹

## Impact
- Affected specs: fix-hero-flight-positioning, fix-hero-flicker-and-conflicts
- Affected code: `src/js/modules/animationHelpers.js`

---

## ADDED Requirements

### Requirement: 弧线飞行路径
clone 飞行路径 SHALL 从直线改为弧线，模拟 Flutter 的 `MaterialRectArcTween`。弧线向上凸起，高度为起终点垂直距离的 15%（最小 20px，最大 60px）。

#### Scenario: 从卡片飞到详情页 Hero 图
- **WHEN** clone 从 `(fromRect.left, fromRect.top)` 飞到 `(toRect.left, toRect.top)`
- **THEN** clone 沿弧线路径飞行
- **AND** 弧线中点比直线路径向上偏移 15-60px
- **AND** 视觉上呈现自然的抛物线轨迹

### Requirement: 加速阶段变形（Squash & Stretch）
clone 在飞行过程中 SHALL 有 squash/stretch 变形效果，模拟加速惯性和空气阻力。

#### Scenario: 起飞加速阶段（0%-30%）
- **WHEN** 动画进度在 0%-30%
- **THEN** clone 水平方向拉伸至 105%，垂直方向压缩至 95%
- **AND** 变形方向与飞行方向一致

#### Scenario: 巡航阶段（30%-70%）
- **WHEN** 动画进度在 30%-70%
- **THEN** clone 恢复正常比例（100% x 100%）

#### Scenario: 减速着陆阶段（70%-100%）
- **WHEN** 动画进度在 70%-100%
- **THEN** clone 垂直方向拉伸至 103%，水平方向压缩至 97%
- **AND** 模拟减速时的惯性压缩

### Requirement: 着陆回弹效果（Bounce/Overshoot）
clone 到达终点时 SHALL 有弹簧回弹效果，略微越过目标位置再弹回。

#### Scenario: 着陆回弹
- **WHEN** clone 接近终点（进度 >85%）
- **THEN** clone 略微越过目标位置（约 3-5px）
- **AND** 然后弹回精确目标位置
- **AND** 回弹过程柔和自然，无突兀感

### Requirement: 自定义弹簧缓动曲线
飞行动画 SHALL 使用自定义弹簧缓动曲线，替代当前的 `cubic-bezier(0.25, 0.46, 0.45, 0.94)`。

#### Scenario: 弹簧缓动
- **WHEN** 动画播放
- **THEN** 使用 `cubic-bezier(0.22, 1.0, 0.36, 1.0)` 缓动曲线（快出慢入，接近 Flutter 的 `Curves.fastOutSlowIn`）
- **AND** 动画时长 450ms

### Requirement: prefers-reduced-motion 降级
当用户偏好减少动效时，SHALL 跳过变形和回弹效果，仅保留基本位移。

#### Scenario: 减少动效偏好
- **WHEN** `window.matchMedia('(prefers-reduced-motion: reduce)').matches` 为 `true`
- **THEN** 跳过 squash/stretch 变形
- **AND** 跳过回弹效果
- **AND** 使用简单的 `ease-out` 缓动
- **AND** 动画时长缩短为 200ms

---

## MODIFIED Requirements

### Requirement: Web Animations API 多关键帧
`clone.animate()` 的 keyframes 从 2 帧（起/终）扩展为 5 帧，实现弧线路径 + 变形 + 回弹：

| 帧序 | 进度 | left/top | width/height | scaleX/scaleY | borderRadius |
|------|------|----------|-------------|---------------|-------------|
| 0 | 0% | fromRect | fromRect 尺寸 | 1.0, 1.0 | fromBorderRadius |
| 1 | 25% | 弧线 1/4 处 | 过渡中 | 1.05, 0.95 | 过渡中 |
| 2 | 50% | 弧线顶点 | 过渡中 | 1.0, 1.0 | 过渡中 |
| 3 | 75% | 弧线 3/4 处 | 过渡中 | 0.97, 1.03 | 过渡中 |
| 4 | 100% | toRect（+3px overshoot） | toRect 尺寸 | 1.0, 1.0 | toBorderRadius |

**注意**：scaleX/scaleY 使用 `transform` 属性实现，与 `left/top/width/height` 分离。由于 `transform` 不影响布局，不会与直接属性动画冲突。

### Requirement: animFinish 终态设置
`animFinish` 中手动设置 clone 终态时，需额外重置 `transform: ''`（清除回弹残留的 transform 值）。

## REMOVED Requirements

### Requirement: 线性直线路径 + 单一缓动
**Reason**: 缺乏物理感和灵动性，不符合原版 Kazumi 的动画品质
**Migration**: 替换为弧线路径 + squash/stretch + 回弹 + 弹簧缓动
