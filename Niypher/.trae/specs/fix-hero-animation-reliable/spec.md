# Hero 飞行过渡彻底修复 Spec

## Why
上一版"增强动画"有 3 个致命缺陷，导致完全没效果：

1. **`fill: 'none'` 导致 clone 闪回**：动画结束后 clone 立即跳回 `fromRect` 起始位置，`animFinish` 中的终态设置在下一帧才生效，导致先闪回再跳正 → 最终位置偏差
2. **`transform` 与 `left/top` 混用冲突**：`scaleX/scaleY`（合成层属性）和 `left/top/width/height`（布局属性）处于不同渲染管线，浏览器无法保证同步插值
3. **弧线幅度太小**：`arcHeight = 15% * |dy|`、min 20px、max 60px。对于大多数场景 dy < 200px，弧高仅 20-30px，肉眼不可见

**修复策略**：回到最可靠的基础方案 → `fill: 'forwards'` + 纯布局属性动画 + 更大弧线 + 更长时长

## What Changes
- **BREAKING**：`fill: 'none'` → `fill: 'forwards'`，消除闪回
- **BREAKING**：移除所有 `transform: scaleX() scaleY()`，动画仅使用 `left/top/width/height/borderRadius`
- 弧线高度从 15%×|dy| 改为 **40%×|dy| + min 50px**，确保肉眼可见
- 动画时长从 450ms 延长至 **650ms**
- 3 帧关键帧（非 5 帧）：起始 → 弧顶(50%) → 过冲(88%) → 精确定位(100%，`fill:forwards` 保持)
- 缓动曲线：`cubic-bezier(0.25, 0.46, 0.45, 0.94)`（经典 ease-out，配合过冲关键帧自然产生回弹感）
- `animFinish` 中 clone 已在终态（`fill:forwards`），只需移除 clone + 揭幕

## Impact
- Affected specs: enhance-hero-flight-animation, fix-hero-flight-positioning, fix-hero-flicker-and-conflicts
- Affected code: `src/js/modules/animationHelpers.js`

---

## ADDED Requirements

### Requirement: fill:forwards 消除闪回
`clone.animate()` SHALL 使用 `fill: 'forwards'`。动画结束后 clone 自动保持在终态，无需 `animFinish` 中手动设置终态样式。

#### Scenario: 动画结束时 clone 精确在目标位置
- **WHEN** 动画到达 100% 进度
- **THEN** clone 的 left/top/width/height/borderRadius 精确等于 toRect 值
- **AND** clone 不闪回 fromRect
- **AND** `animFinish` 只需移除 clone 和调用 `revealDetailContent()`

### Requirement: 纯布局属性动画
动画 SHALL 仅使用 `left`、`top`、`width`、`height`、`borderRadius` 属性。SHALL NOT 使用 `transform` 属性。

#### Scenario: 无 Transform 冲突
- **WHEN** `clone.animate()` 被调用
- **THEN** keyframes 中不含 `transform` 属性
- **AND** `animFinish` 中无 `clone.style.transform = ''`

### Requirement: 大弧线高度
弧线高度 SHALL 为起终点垂直距离的 40%，最小 50px，确保肉眼可见。

#### Scenario: 明显的弧线轨迹
- **WHEN** 起终点垂直距离为 150px
- **THEN** 弧线高度为 max(50, 150*0.4) = 60px
- **AND** 飞行轨迹明显向上凸起

### Requirement: 3 帧关键帧 + offset
keyframes SHALL 包含 3 帧（通过 `offset` 精确控制）：

| offset | 位置 | 说明 |
|--------|------|------|
| 0.0 | fromRect | 起始 |
| 0.5 | fromRect + delta*0.5, top 减去弧高 | 弧线顶点 |
| 1.0 | toRect（精确） | 终点，fill:forwards 保持 |

### Requirement: 延长动画时长
动画时长 SHALL 为 650ms，确保弧线和缓动效果完整呈现。

### Requirement: prefers-reduced-motion 降级
SHALL 保持 `prefers-reduced-motion` 检测，降级时使用 2 帧 + 200ms + ease-out。降级时不使用弧线。
