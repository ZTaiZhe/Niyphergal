# Tasks

- [x] Task 1: 修改 render() 开头的 section 移除逻辑
  - [x] 将 `sections.forEach(sec => sec.remove())` 改为：仅移除需要替换内容的 section（首次渲染或内容变化的页面），保留其他 section
  - [x] 对已存在的 section，仅切换 `display` 属性（`block`/`none`），不替换 `innerHTML`
  - [x] 验证：首次导航到页面时 section 正常创建和注入内容

- [x] Task 2: 修改 injectSection() 支持保留模式
  - [x] 添加参数或逻辑判断：当 section 已存在且内容未变时，仅切换 display，不替换 innerHTML
  - [x] 当 section 不存在时，创建新 section 并注入内容（保持现有行为）
  - [x] 当 section 存在但需要更新内容时，替换 innerHTML（保持现有行为）
  - [x] 验证：injectSection 在保留模式下不破坏 DOM 状态

- [x] Task 3: 返回已访问页面时跳过动画初始化
  - [x] 当返回已访问页面（section 已存在）时，不调用 `initHomeAnimations()`、`initDetailAnimations()` 等初始化函数
  - [x] 仅在首次渲染 section 时调用动画初始化
  - [x] Hero exit 路径保持现有逻辑（`revealHomeCardsImmediately` + `revealFlownCard`）
  - [x] 验证：从详情页返回首页后卡片不重新播放入场动画

- [x] Task 4: 确保轮播图状态保持
  - [x] 返回首页时，如果轮播图已初始化，不重新调用 `initCarousel()`
  - [x] 验证：返回首页后轮播图位置不重置

# Task Dependencies
- Task 1 是基础，Task 2 依赖 Task 1
- Task 3 和 Task 4 依赖 Task 1 和 Task 2
- Task 3 和 Task 4 可并行
