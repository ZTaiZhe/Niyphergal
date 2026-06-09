# Tasks

- [ ] Task 1: 重写 `animationHelpers.js` `clone.animate()` 调用
  - [ ] 1.1 `fill: 'none'` → `fill: 'forwards'`
  - [ ] 1.2 keyframes 从 5 帧改为 3 帧（含 offset）
  - [ ] 1.3 移除所有 `transform: scaleX/scaleY` 属性
  - [ ] 1.4 弧线高度改为 `max(50, abs(dy) * 0.4)`
  - [ ] 1.5 动画时长改为 650ms
  - [ ] 1.6 缓动曲线改为 `cubic-bezier(0.25, 0.46, 0.45, 0.94)`（classic ease-out）
  - [ ] 1.7 `animFinish` 中移除 `clone.style.left/top/width/height/borderRadius` 手动设置（`fill:forwards` 已处理）
  - [ ] 1.8 `animFinish` 中移除 `clone.style.transform = ''`
  - [ ] 1.9 `prefers-reduced-motion` 降级保持（200ms, ease-out, 2帧, 无弧线）
  - **验证**: 点击卡片飞行有清晰弧线，终位精确无偏差

- [ ] Task 2: 构建并部署验证
  - **验证**: 飞行轨迹弧线明显，定位精确，无闪回

# Task Dependencies
- Task 2 依赖 Task 1
