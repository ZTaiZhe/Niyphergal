# 修复 Logo 按钮绑定失效问题 - 任务列表

## 任务列表

- [x] Task 1: 修正 app.js 中的全局变量拼写错误
  - 已确认 `window.LogoMenu = LogoMenu` 拼写正确（第468行）

- [x] Task 2: 修正 globals.js 中的全局变量拼写错误
  - 已确认 `window.LogoMenu = LogoMenu` 拼写正确（第36行）
  - 注意：`globals.js` 中的 `initGlobals()` 未被调用，但 `app.js` 中已正确注册

- [x] Task 3: 验证 Logo 按钮功能
  - 点击 Logo 按钮能够打开菜单
  - 菜单打开时有向下展开动画
  - 点击菜单项能够正确导航
  - 点击外部区域能够关闭菜单

## 任务依赖
- [Task 3] depends on [Task 1, Task 2]
