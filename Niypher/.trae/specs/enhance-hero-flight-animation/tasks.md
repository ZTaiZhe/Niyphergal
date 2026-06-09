# Tasks

- [x] Task 1: 实现弧线飞行路径 + 多关键帧动画
  - [x] 1.1 计算弧线偏移：`arcHeight = Math.min(60, Math.max(20, Math.abs(dy) * 0.15))`
  - [x] 1.2 计算 5 个关键帧的 left/top 值（含弧线偏移）
  - [x] 1.3 添加 scaleX/scaleY 变形关键帧（0%: 1,1 → 25%: 1.05,0.95 → 50%: 1,1 → 75%: 0.97,1.03 → 100%: 1,1）
  - [x] 1.4 最后一帧 left/top 添加 3px overshoot
  - [x] 1.5 缓动曲线改为 `cubic-bezier(0.22, 1.0, 0.36, 1.0)`，时长改为 450ms
  - [x] 1.6 `animFinish` 中重置 `clone.style.transform = ''`
  - [x] 1.7 添加 `prefers-reduced-motion` 检测降级
  - **验证**: ✅ 构建成功

- [x] Task 2: 构建并部署验证
  - **验证**: ✅ https://9595cfaf.niyphergal.pages.dev

# Task Dependencies
- Task 2 依赖 Task 1
