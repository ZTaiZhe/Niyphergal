# Tasks

- [x] Task 1: 修复 index.html CSS 入口链接（致命）
  - [x] SubTask 1.1: 将 `<link href="src/css/styles.css">` 改为 `<link href="src/css/main.css">`
  - [x] SubTask 1.2: 验证构建后 Tailwind 工具类生效

- [x] Task 2: 清理 styles.css 重复 :root 变量定义
  - [x] SubTask 2.1: 删除 styles.css 第1-32行的第一个 :root 块
  - [x] SubTask 2.2: 删除 styles.css 第44-52行的第二个 :root 块（acrylic 变量重复）
  - [x] SubTask 2.3: 保留 styles.css 独有的 :root 变量块

- [x] Task 3: 统一 CSS 变量命名 `--accent-color` → `--color-accent`
  - [x] SubTask 3.1: 将所有 `var(--accent-color)` 替换为 `var(--color-accent)`（67处）
  - [x] SubTask 3.2: 将所有 `var(--dark-accent-color)` 替换为 `var(--color-accent)`
  - [x] SubTask 3.3: 确认 tokens.css body.dark 中已定义 `--color-accent`

- [x] Task 4: 修复 @keyframes rippleEffect 命名冲突
  - [x] SubTask 4.1: 排序按钮 @keyframes 重命名为 `btnRippleEffect`
  - [x] SubTask 4.2: animation 引用更新为 `btnRippleEffect`
  - [x] SubTask 4.3: 图片查看器区域的 `rippleEffect` 保持原名

- [x] Task 5: 合并 #search-suggestions 重复选择器
  - [x] SubTask 5.1: 将 `border-radius: 16px` 合并到第一个块，删除第二个块
  - [x] SubTask 5.2: 确认无残留重复

- [x] Task 6: 修复 .glass-card:hover transition 属性名笔误
  - [x] SubTask 6.1: 确认 transition 属性无点号笔误（已验证正确）

- [x] Task 7: 修复 @media 嵌套语法
  - [x] SubTask 7.1: 4处 @media 嵌套全部转换为组合媒体查询
  - [x] SubTask 7.2: 确认无残留嵌套

- [x] Task 8: 修复 tokens.css body.dark 缺少 `--color-accent` 变量
  - [x] SubTask 8.1: 添加 `--color-accent: #ec4899;`
  - [x] SubTask 8.2: 添加 `--color-accent-light` 和 `--color-accent-hover`

# Task Dependencies
- [Task 2] 在 [Task 3] 之前完成
- [Task 4-8] 并行执行
