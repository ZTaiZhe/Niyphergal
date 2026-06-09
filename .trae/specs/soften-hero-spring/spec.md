# Hero 弹簧动画柔化 Spec

## Why
当前弹簧动画行程长（8~24px）、速度快（220ms）、过冲大（40%），视觉上像"摔了之后抖了一下"。需要改为"轻轻晃一下"的感觉——小幅度、慢节奏、低过冲的柔和弹簧。

## 问题分析

| 参数 | 当前值 | 问题 |
|------|--------|------|
| amplitude | `clamp(8, distance×0.06, 24)` | 最大 24px，行程太长，像撞击抖动 |
| duration | 220ms | 太快，来不及感受弹簧的柔和 |
| overshoot | 40%（0.4） | 过冲太大，二次振荡太明显 |
| easing | `cubic-bezier(0.4, 0.0, 0.2, 1.0)` | fastOutSlowIn 偏急促 |

## What Changes
- 弹簧振幅从 `clamp(8, distance×0.06, 24)` 缩小为 `clamp(3, distance×0.02, 10)`
- 弹簧时长从 220ms 延长为 320ms
- 过冲从 40% 缩小为 20%
- 弹簧缓动从 `cubic-bezier(0.4, 0.0, 0.2, 1.0)` 改为 `cubic-bezier(0.25, 0.1, 0.25, 1.0)`（更柔和的 ease-in-out）

## Impact
- Affected specs: refactor-hero-shuttle-spring（修改弹簧参数）
- Affected code: `src/js/modules/animationHelpers.js`（仅修改弹簧参数）

---

## MODIFIED Requirements

### Requirement: 弹簧位移幅度
弹簧位移幅度 SHALL = `clamp(3, distance × 0.02, 10)`。

#### Scenario: 典型距离 300px
- **WHEN** distance = 300px
- **THEN** amplitude = clamp(3, 6, 10) = 6px（轻柔偏移）

#### Scenario: 近距离 100px
- **WHEN** distance = 100px
- **THEN** amplitude = clamp(3, 2, 10) = 3px（最小幅度）

#### Scenario: 远距离 800px
- **WHEN** distance = 800px
- **THEN** amplitude = clamp(3, 16, 10) = 10px（最大幅度封顶）

### Requirement: 弹簧时长
弹簧动画时长 SHALL = 320ms。

### Requirement: 弹簧过冲量
过冲关键帧（offset=0.72）的位移 SHALL 为初始位移的 20%（`-dispX×0.2, -dispY×0.2`）。

### Requirement: 弹簧缓动曲线
弹簧动画缓动 SHALL = `cubic-bezier(0.25, 0.1, 0.25, 1.0)`（柔和的 ease-in-out，而非急促的 fastOutSlowIn）。
