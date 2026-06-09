# 修复 Logo 按钮绑定失效问题（重新排查） - 任务列表

## 任务列表

- [x] Task 1: 排查 Logo 按钮失效的根本原因
  - 发现问题：`window.LogoMenu` 在 `initApp()` 异步函数中注册，但位于 `await Store.init()` 之后
  - 如果用户在 Store 初始化完成前点击按钮，`LogoMenu` 将是 `undefined`

- [x] Task 2: 修复 Logo 按钮绑定问题
  - 将全局变量注册移到 `initApp()` 函数开头，在任何异步操作之前执行

- [x] Task 3: 验证修复效果
  - 全局变量已在 `initApp()` 开头同步注册
  - Logo 按钮点击事件将立即生效

## 任务依赖
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
