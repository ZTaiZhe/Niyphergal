# 表单输入框 Focus 动画 - 任务列表

## 任务列表

- [x] Task 1: 添加 CSS 样式
  - 创建 `.form-input-wrapper` 包裹层样式
  - 创建 `.form-input-wrapper::after` 伪元素作为底部横线
  - 创建 `.form-input` 输入框样式
  - 添加深色模式适配
  - 添加 A11y 降级

- [x] Task 2: 修改 profile.js 输入框结构
  - 为邮箱输入框 `#auth-email` 添加 `.form-input-wrapper` 包裹层
  - 为密码输入框 `#auth-pwd1` 添加包裹层
  - 为重复密码输入框 `#auth-pwd2` 添加包裹层
  - 更新输入框 class 为 `.form-input`

- [x] Task 3: 修改 galgame.js 输入框结构
  - 为游戏搜索输入框 `#gal-search` 添加 `.form-input-wrapper` 包裹层
  - 更新输入框 class 为 `.form-input`

- [x] Task 4: 验证效果
  - 验证邮箱输入框 Focus 动画
  - 验证密码输入框 Focus 动画
  - 验证游戏搜索输入框 Focus 动画
  - 验证深色模式
  - 验证 A11y 降级

## 任务依赖
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 2, Task 3]
