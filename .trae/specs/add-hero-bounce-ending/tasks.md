# Tasks

- [x] Task 1: `animationHelpers.js` 添加变形+回弹关键帧
  - [x] 1.1 时长 350ms → 380ms
  - [x] 1.2 计算 0.82 帧过冲值：`toRect + delta×0.06`
  - [x] 1.3 计算 0.82 帧挤压值：`width×0.94, height×1.06`
  - [x] 1.4 keyframes 3 帧 → 4 帧（0 / 0.45 / 0.82 / 1.0）
  - [x] 1.5 降级保持 2 帧
  - **验证**: ✅ 飞行结束有挤压变形+弹簧回弹

- [x] Task 2: 构建并部署验证
  - **验证**: ✅ https://f252571e.niyphergal.pages.dev

# Task Dependencies
- Task 2 依赖 Task 1
