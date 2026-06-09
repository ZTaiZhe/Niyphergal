# Tasks

- [x] Task 1: 在 `src/css/main.css` 顶部添加 `@import "tailwindcss"` 指令
  - [x] SubTask 1.1: 在 `@import './base/tokens.css'` 之前添加 `@import "tailwindcss"`
  - [x] SubTask 1.2: 验证 `@charset` 声明位置正确（必须在文件最顶部）

- [x] Task 2: 检查 `tokens.css` 与 Tailwind v4 兼容性
  - [x] SubTask 2.1: 确认 `:root` 中的 CSS 变量在 Tailwind 引入后仍正常工作
  - [x] SubTask 2.2: 检查是否需要使用 `@theme` 指令注册自定义变量到 Tailwind（不需要，标准 CSS 变量兼容）

- [x] Task 3: 检查 `styles.css` 中的 `@charset` 声明是否与 Tailwind 冲突
  - [x] SubTask 3.1: 移除 `styles.css` 中的 `@charset "utf-8"`（因为 Tailwind 会处理编码）
  - [x] SubTask 3.2: 确保编码声明不重复

- [x] Task 4: 运行 `vite build` 验证构建产物
  - [x] SubTask 4.1: 确认构建成功无错误
  - [x] SubTask 4.2: 检查构建产物 CSS 中包含 Tailwind 工具类（72.36 kB CSS 产物）

- [x] Task 5: 运行 `vite dev` 验证开发模式
  - [x] SubTask 5.1: 确认开发服务器启动无错误
  - [x] SubTask 5.2: 确认页面样式恢复正常

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 1
- Task 4 depends on Task 1, Task 2, Task 3
- Task 5 depends on Task 4
