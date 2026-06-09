# Tasks

- [x] Task 1: 提取统一后处理函数 `afterPageSwitch(page, shouldPreserve, isHeroExit, heroExitGameId)`
  - [x] 创建 `afterPageSwitch` 函数，包含所有分支中重复的后处理逻辑：scroll 恢复、announcement、bindPasswordCheck、observeExistingMedia、bindSearchControlsDelegated、home 动画初始化（initHomeAnimations/initCarousel/revealHomeCardsImmediately）、detail 动画初始化
  - [x] 验证：函数签名覆盖所有当前分支的后处理场景

- [x] Task 2: 重写 `injectSection`，移除临时容器清理逻辑
  - [x] 移除 `injectSection` 中对 `.page-transition-container` / `.search-page-transition-container` 的清理代码
  - [x] 保留 section 确保和 display 切换逻辑不变
  - [x] 验证：`injectSection` 仅负责 section DOM 管理

- [x] Task 3: 重写主动画分支（原 `animationClass && router.previous` 分支），改为直接在 section 元素上播放动画
  - [x] 移除 `page-transition-container` / `page-transition-old` / `page-transition-new` 临时容器创建
  - [x] 移除 `oldContent` 变量
  - [x] 新逻辑：获取 old section 和 new section 元素，对 old section 添加退出动画 class，对 new section 先设 `display:block` 再添加进入动画 class
  - [x] 动画结束后移除动画 class，调用 `afterPageSwitch`
  - [x] 处理 `prefers-reduced-motion`：跳过动画直接切换
  - [x] 验证：push（home→category）时首页左滑出、分类页右滑入；pop（category→home）时分类页右滑出、首页左滑入

- [x] Task 4: 重写 search-enter 分支，保留搜索页从底部滑入动画
  - [x] 移除 `search-page-transition-container` 临时容器创建
  - [x] 改为：先 injectSection 显示搜索页 section，再对其应用 `page-slide-up-enter-active` 动画
  - [x] 动画结束后调用 `afterPageSwitch`
  - [x] 验证：搜索页从底部滑入，原页面在下方可见

- [x] Task 5: 重写 search-exit-pop 分支，保留搜索页向底部滑出动画
  - [x] 移除 `search-page-transition-container` 临时容器创建
  - [x] 改为：先显示目标 section，再对搜索页 section 应用退出动画，动画结束后隐藏搜索页 section
  - [x] 动画结束后调用 `afterPageSwitch`
  - [x] 验证：搜索页向底部滑出，目标页面在下方可见

- [x] Task 6: 简化 detail 和 fallback 分支
  - [x] detail 分支：保持直接 injectSection + afterPageSwitch，无滑动动画
  - [x] fallback 分支（isProfileTransition/isSearchRefresh/else）：保持现有逻辑，改用 afterPageSwitch
  - [x] 验证：detail 页面切换无滑动动画，profile/search 刷新动画正常

- [x] Task 7: 清理 CSS 中废弃的临时容器样式
  - [x] 移除 `.page-transition-container` / `.page-transition-old` / `.page-transition-new` 样式
  - [x] 移除 `.search-page-transition-container` / `.search-page-underlay` / `.search-page-overlay` 样式
  - [x] 添加 section 动画所需的 CSS（如需要 `position: absolute` 用于动画叠加）
  - [x] 验证：无残留的临时容器样式

- [x] Task 8: 构建验证
  - [x] 运行 `npx vite build` 确认无构建错误
  - [x] 验证：所有页面切换动画方向正确，preserveExisting 时 DOM 状态保持

# Task Dependencies
- [Task 1] 无依赖，可先行
- [Task 2] 无依赖，可先行
- [Task 3] 依赖 Task 1, Task 2
- [Task 4] 依赖 Task 1, Task 2
- [Task 5] 依赖 Task 1, Task 2
- [Task 6] 依赖 Task 1
- [Task 7] 依赖 Task 3, Task 4, Task 5
- [Task 8] 依赖 Task 3, Task 4, Task 5, Task 6, Task 7
