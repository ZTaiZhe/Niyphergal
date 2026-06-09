# Tasks

- [ ] Task 1: 重写 `animationHelpers.js` — `clone.animate()` 调用
  - [ ] 1.1 `fill: 'none'` → `fill: 'forwards'`
  - [ ] 1.2 keyframes 改为 3 帧 + offset（0.0 / 0.45 / 1.0）
  - [ ] 1.3 移除所有 `transform: scaleX/scaleY`
  - [ ] 1.4 弧高 = `Math.min(80, Math.max(32, Math.abs(dy) * 0.3))`
  - [ ] 1.5 时长 350ms
  - [ ] 1.6 缓动 = `cubic-bezier(0.4, 0.0, 0.2, 1.0)`
  - [ ] 1.7 最后一帧是精确 toRect（无 overshoot）
  - [ ] 1.8 `clone.style.cssText` 改为 `clone.style.setProperty()` 逐属性设置
  - [ ] 1.9 `animFinish` 移除所有手动终态样式设置
  - [ ] 1.10 `animFallback` 超时保持 600ms
  - [ ] 1.11 `prefers-reduced-motion` 降级：2帧、200ms、ease-out、fill:forwards
  - **验证**: 点击卡片飞行流畅，弧线可见，终位精确

- [ ] Task 2: 构建并部署验证
  - **验证**: 飞行弧线明显，无闪回，定位精确

# Task Dependencies
- Task 2 依赖 Task 1
