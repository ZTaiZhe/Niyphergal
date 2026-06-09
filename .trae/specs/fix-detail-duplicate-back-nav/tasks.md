# Tasks

- [x] Task 1: 移除 detail.js 中内联返回按钮和"详情"文字
  - [x] 移除 `renderDetail()` 中第 25-29 行的条件渲染块（`${getHeroExitContext() ? '' : \`...\`}`）
  - [x] 验证：从轮播图进入详情页时，页面内容区不再显示返回按钮和"详情"文字

- [x] Task 2: 构建验证
  - [x] 运行 `npx vite build` 确认无构建错误
  - [x] 验证：详情页 header 返回箭头正常，页面内容区无重复导航

# Task Dependencies
- [Task 2] 依赖 [Task 1]
