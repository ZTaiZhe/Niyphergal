# Hero 飞行过程变形 + 结束回弹 Spec

## Why
原版 Kazumi 的 Hero 飞行有两层物理感：(1) `fastOutSlowIn` 曲线产生的加速/减速感 (2) Cupertino 弹簧转场产生的柔和着陆感。当前实现只有弧线路径，缺少着陆时的形变+回弹，动画收尾生硬。

## 设计思路

**核心约束**：只用 `left/top/width/height/borderRadius`（纯布局管线），不用 `transform`（避免跨管线冲突）。

**变形原理**：利用 `object-fit: cover` 的特性——改变元素宽高会改变图片的可见裁剪区域，大脑将其解读为物理形变。例如宽度缩小 6% + 高度放大 6%，看起来像"撞墙挤压"。

**4 帧 keyframe 结构**：

| offset | 位置 | 宽高 | 视觉 |
|--------|------|------|------|
| 0.0 | fromRect（起始） | fromRect 尺寸 | 正常 |
| 0.45 | 弧线顶点 | 正常插值 | 正常（弧线最高点） |
| 0.82 | toRect + 6% 过冲 | 宽×0.94, 高×1.06（挤压变形） | 撞墙挤压 |
| 1.0 | **精确** toRect | **精确** toRect 尺寸 | 弹回正常 |

- 0.82→1.0 耗时 = 380ms × 18% ≈ **68ms**（快速弹回）
- `fill: 'forwards'` → 终态精确锁定
- 缓动：`cubic-bezier(0.4, 0.0, 0.2, 1.0)`（fastOutSlowIn，不变）

## What Changes
- 时长 350ms → **380ms**（为回弹留 68ms）
- keyframes 3 帧 → **4 帧**（新增 offset=0.82 过冲+变形帧）
- 降级保持 2 帧无效果

## Impact
- Affected code: `src/js/modules/animationHelpers.js`（仅修改 keyframes 和 duration）

---

## ADDED Requirements

### Requirement: 过冲 + 挤压变形关键帧（offset=0.82）
动画 SHALL 在 offset=0.82 处有过冲+挤压变形关键帧：
- left/top 越过 toRect **6%**（`toRect + delta×0.06`）
- width 缩小 **6%**（`toRect.width × 0.94`）
- height 放大 **6%**（`toRect.height × 1.06`）

### Requirement: 回弹至精确终态（offset=1.0 + fill:forwards）
offset=1.0 SHALL 为精确 toRect 值，配合 `fill:'forwards'` 锁定终态。

### Requirement: 动画时长 380ms
动画时长 SHALL 为 380ms，其中 0.82→1.0 回弹段 = 68ms。

### Requirement: 纯布局属性，无 transform
全部 4 帧 SHALL 仅含 `left`、`top`、`width`、`height`、`borderRadius`。
