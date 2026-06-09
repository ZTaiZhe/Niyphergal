# Checklist

## Task 1: animationHelpers.js 彻底重写
- [ ] `fill: 'forwards'`（非 `fill: 'none'`）
- [ ] 3 帧 keyframes，含 `offset: [0.0, 0.45, 1.0]`
- [ ] keyframes 中无 `transform` 属性
- [ ] 弧高 = `min(80, max(32, abs(dy) * 0.3))`
- [ ] 时长 = 350ms
- [ ] 缓动 = `cubic-bezier(0.4, 0.0, 0.2, 1.0)`
- [ ] 最后一帧 = 精确 toRect（无 overshoot）
- [ ] `clone.style.cssText` 已替换为 `clone.style.setProperty()` 逐属性设置
- [ ] `animFinish` 中无手动终态样式设置
- [ ] `animFallback` 超时 = 600ms
- [ ] 降级：2帧、200ms、ease-out、fill:forwards

## Task 2: 端到端验证
- [ ] 飞行弧线明显可见
- [ ] 终位精确无偏差
- [ ] 无闪回
- [ ] 缓动自然（快出慢入）
