# Tasks

- [x] Task 1: 修改弹簧动画参数
  - [x] 1.1 amplitude 从 `clamp(8, distance×0.06, 24)` 改为 `clamp(3, distance×0.02, 10)`
  - [x] 1.2 duration 从 220 改为 320
  - [x] 1.3 过冲从 `dispX×0.4` 改为 `dispX×0.2`
  - [x] 1.4 easing 从 `cubic-bezier(0.4, 0.0, 0.2, 1.0)` 改为 `cubic-bezier(0.25, 0.1, 0.25, 1.0)`
  - [x] 1.5 springFallback 超时从 400 改为 500（匹配更长时长）
  - **验证**: ✅ 构建无报错

- [x] Task 2: 构建并部署验证
  - **验证**: ✅ 部署到 https://801a3a97.niyphergal.pages.dev

# Task Dependencies
- Task 2 依赖 Task 1
