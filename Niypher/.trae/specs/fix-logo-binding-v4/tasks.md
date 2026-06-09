# Logo 按钮问题深度排查 - 任务列表

## 任务列表

- [x] Task 1: 添加调试日志
  - 在 `LogoMenu.toggle()` 中添加 `console.log`
  - 在模块顶层添加 `console.log('LogoMenu registered')`
  - 确认代码是否执行

- [x] Task 2: 检查 CSS 问题
  - 发现问题：点击外部关闭菜单的选择器错误
  - 原代码使用 `.glass-card-pill` 但按钮实际使用 `acrylic-panel` 类
  - 修复：改为 `#logo-container button` 选择器

- [x] Task 3: 验证修复效果
  - 修复选择器错误
  - 移除调试日志

## 任务依赖
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
