# Tasks

- [x] Task 1: 为 `.modal-overlay` 添加 CSS 样式
  - [x] 在 `src/css/components/components.css` 中添加 `.modal-overlay` 样式：`position: fixed; inset: 0; z-index: 50; display: flex; align-items: flex-start; justify-content: center; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); overflow-y: auto;`
  - [x] 确保 `.modal-overlay.hidden` 使用 `display: none !important` 覆盖 flex 布局（Tailwind 的 `hidden` 类是 `display: none`，需确认优先级足够）
  - [x] 验证：首页加载后公告弹窗以覆盖层形式显示在屏幕顶层

# Task Dependencies
- 无依赖
