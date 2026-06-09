# Copilot 指南 — Niypher 密码示例项目 🔧

简短说明：本仓库是用于演示密码哈希与认证流程的示例项目（非生产就绪）。包含：一个单文件前端 `index.html`（大量客户端逻辑、UI 与模拟后端），一个演示用后端 `server.js`（Express + bcryptjs），以及一个用于验证内联脚本语法的 `validate_js.js`。

## 项目架构（高层）
- 前端：`index.html`
  - 单文件 SPA 风格，内嵌大量 JS（UI、验证、模拟用户数据库 `DB.registeredUsers`、客户端 Argon2 哈希等）。
  - 使用 CDN 引入 Tailwind、RemixIcon、Cloudflare Turnstile、argon2-browser。
- 后端：`server.js`
  - Express demo，使用 `bcryptjs` 在服务器端进行密码哈希（salt rounds = 12），并保存在内存 `db.users`（仅演示用途）。
  - 提供 REST 端点：POST `/api/register`、POST `/api/login`、GET `/api/user/:id`。
- 工具：`validate_js.js` — 用 Node 的 vm 模块解析并验证 `index.html` 中所有内联 `<script>` 的语法（模拟大量浏览器 global 以避免误报）。

## 重要开发/调试命令 🧭
- 安装依赖：
  - `npm install`
- 启动服务器：
  - 生产演示： `npm start`（运行 `node server.js`，默认端口 3000）
  - 开发热重载： `npm run dev`（使用 `nodemon server.js`）
- 验证客户端内联 JS 语法：
  - `node validate_js.js`（脚本会在发现语法错误时以非 0 状态码退出）

## 项目特有的约定与模式 📌
- 密码策略：
  - 客户端：使用 `argon2-browser` 在 `index.html` 的 `hashPassword()` 中对原始密码进行 Argon2id 哈希（time=3, mem=65536, hashLen=32, parallelism=4），并将 `result.encoded` 存到 `DB.registeredUsers`（模拟流程）。
  - 服务器：`server.js` 使用 `bcryptjs`，`genSalt(12)` + `hash()`，并在 `validatePasswordStrength()` 中要求：>=8 长度、含大写、含小写、数字和特殊字符。
  - 说明：当前仓库同时包含客户端 Argon2 示例与服务器端 bcrypt 示例；它们用于演示不同的位置（客户端 vs 服务器）进行哈希的差异，并非完整生产架构。若要把前端连接到后端，请替换客户端的本地 `DB.registeredUsers` 操作为对服务器 API 的 `fetch` 调用。
- 验证规则来源：`index.html` 中的 `BackendValidation.getValidationRules()` 定义了每个 API 路径期望的字段与长度，可作为前后端一致性参考。
- Turnstile：Cloudflare Turnstile 被集成在前端（`turnstile` 对象与 `window.turnstileToken` 的使用），在客户端 auth 流中被检查（若缺失则阻止注册/登录流程）。
- 风格与语言：注释和文本多数为中文；代码使用常见的 camelCase 命名。

## 可直接引用的代码示例（快速上手）
- 启动本地后端：
  - `npm run dev` → 监听在 http://localhost:3000
  - 控制台打印示例 cURL：`curl -X POST -H "Content-Type: application/json" -d '{"email":"newuser@example.com","password":"SecurePass123!","nickname":"NewUser"}' http://localhost:3000/api/register`
- 验证前端脚本语法：
  - `node validate_js.js`（会解析 `index.html` 内联 `<script>` 并报告语法错误）
- 将客户端注册逻辑替换为服务器 API（示例意图）：
  - 当前：`DB.registeredUsers.push({ email, password: hash, nickname })`（见 `index.html` 附近的注册逻辑）
  - 替换为：`await fetch('/api/register', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password: hash, nickname }) })`

## 改动/贡献注意点 (对 AI 代理友好) ⚠️
- 这个仓库是示例/教学目的：很多 "DB" 为内存对象，直接改动数据库逻辑需替换为持久层实现。
- 在修改任何验证规则时，同时更新 `BackendValidation.getValidationRules()`（客户端参考）和 `server.js` 中的 `validatePasswordStrength()`，以保持前后端一致。
- 运行 `node validate_js.js` 来捕获意外的语法错误，尤其是在编辑 `index.html` 的内联脚本时。

---

如需要，我可以：
- 把 `index.html` 的大型脚本拆分为 `src/` 模块并添加构建脚本；或
- 把客户端的模拟 auth 流替换为真实的 `fetch` 调用并演示一个最小端到端流程（前端 Argon2 或后端 bcrypt 的一致策略）。

请告诉我哪个部分需要更详细的示例或更深的改动建议。✅