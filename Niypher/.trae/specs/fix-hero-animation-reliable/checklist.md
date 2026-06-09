# Checklist

## Task 1: animationHelpers.js 彻底修复
- [ ] `fill: 'forwards'`（非 `fill: 'none'`）
- [ ] 3 帧 keyframes，含 `offset`：0.0, 0.5, 1.0
- [ ] keyframes 中无 `transform` 属性
- [ ] 弧线高度 = `max(50, abs(dy) * 0.4)`（含 max 60 上限防止极端值）
- [ ] 动画时长 = 650ms
- [ ] 缓动 = `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- [ ] `animFinish` 中无手动终态样式设置
- [ ] `animFinish` 中无 `clone.style.transform = ''`
- [ ] `prefers-reduced-motion` 降级：2帧、200ms、ease-out、无弧线

## Task 2: 端到端验证
- [ ] 飞行弧线明显可见
- [ ] 终位精确无偏差
- [ ] 无闪回
