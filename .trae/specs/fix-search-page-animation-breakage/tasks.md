# Tasks

- [x] Task 1: 修改搜索页 CSS 动画，移除 `position: absolute` 方案
  - [x] SubTask 1.1: 修改 `.page-slide-up-enter-active` — 移除 `position: absolute; top: 0; left: 0; width: 100%; height: 100%`，保留 `transform: translateY(100%); z-index: 100; transition` 等属性
  - [x] SubTask 1.2: 将 `.page-slide-up-enter-active.is-visible` 改为 `.page-slide-up-enter-active.slide-visible`，避免与卡片 `is-visible` 冲突
  - [x] SubTask 1.3: 修改 `.page-slide-down-exit-active` — 移除 `position: absolute; top: 0; left: 0; width: 100%; height: 100%`，保留 `transform; z-index; transition`
  - [x] SubTask 1.4: 将 `.page-slide-down-exit-active.is-leaving` 保持不变（`is-leaving` 不与卡片类名冲突）

- [x] Task 2: 修改 `renderer.js` 搜索页进入动画逻辑
  - [x] SubTask 2.1: 将 `searchSection.classList.add('is-visible')` 改为 `searchSection.classList.add('slide-visible')`
  - [x] SubTask 2.2: 将 `searchSection.classList.remove('page-slide-up-enter-active', 'is-visible')` 改为 `searchSection.classList.remove('page-slide-up-enter-active', 'slide-visible')`
  - [x] SubTask 2.3: 在 `waitForAnimationEnd` 回调外添加安全超时守卫，确保 `afterPageSwitch` 和 `bindSearchControlsDelegated` 必定执行

- [x] Task 3: 修改 `renderer.js` 搜索页退出动画逻辑
  - [x] SubTask 3.1: 在 `search-exit-pop` 分支中，确保 `targetSection` 在搜索 section 动画期间可见（当前逻辑已存在，验证是否需要调整以适配非绝对定位方案）
  - [x] SubTask 3.2: 在 `waitForAnimationEnd` 回调外添加安全超时守卫

- [x] Task 4: 构建验证并部署
  - [x] SubTask 4.1: 运行 `npx vite build` 验证构建成功
  - [x] SubTask 4.2: 部署到 Cloudflare Pages

# Task Dependencies
- Task 2 depends on Task 1（CSS 类名需先修改）
- Task 3 depends on Task 1
- Task 4 depends on Task 1, 2, 3
