# Tasks

- [x] Task 1: 修复返回箭头不可见问题
  - [x] 移除 `index.html` 中返回箭头 `<i>` 元素的 `style="display:none"` 内联样式
  - [x] 验证：进入详情页后返回箭头图标可见，返回首页后箭头隐藏

- [x] Task 2: 修复 Logo 展开动效丢失问题
  - [x] 修改 `src/js/modules/navigation.js` 中 `morphBackToLogo()` 函数，在测量目标尺寸时临时禁用 CSS transition
  - [x] 验证：从详情页返回首页时 Logo 按钮从圆形平滑展开为药丸形

- [x] Task 3: 补充 navigate-home action 处理
  - [x] 在 `src/js/app.js` 的 click 事件委托 switch 中添加 `case 'navigate-home'` 处理
  - [x] 验证：点击详情页内返回按钮可正确导航回首页

# Task Dependencies
- Task 2 依赖 Task 1（返回箭头可见是展开动效的前提）
- Task 3 独立于 Task 1 和 Task 2
