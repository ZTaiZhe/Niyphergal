# NiypherGal 部署计划

## 当前状态分析

### 项目架构
- **类型**：纯静态前端 SPA（HTML + CSS + JS ES Modules）
- **部署目标**：Cloudflare Pages（已有项目 `niyphergal`）
- **当前问题**：
  1. 项目引入了 Vite 构建系统但尚未正式启用（index.html 仍直接引用 `src/js/app.js`）
  2. Tailwind CSS 仍通过 CDN 运行时编译（`cdn.tailwindcss.com`）
  3. pinyin-pro 通过 CDN 引入（`cdn.jsdelivr.net/npm/pinyin-pro`）
  4. `wrangler.toml` 的 bucket 指向 `.`（项目根目录），未指向构建输出
  5. `_headers` 已配置完整安全头
  6. `_redirects` 已配置 SPA 路由回退

### 部署方案选择

**方案A：直接部署（无构建）** — 将当前源码直接部署到 Cloudflare Pages
- 优点：简单快速，无需构建步骤
- 缺点：Tailwind CDN运行时编译、无代码压缩、无Tree-shaking
- 适合：快速验证部署

**方案B：Vite构建后部署** — 先 `vite build` 再部署 `dist/` 目录
- 优点：构建时编译Tailwind、代码压缩、Tree-shaking、代码分割
- 缺点：需要先安装依赖（npm install）、需处理CDN资源的本地化
- 适合：生产环境

**决策：采用方案A（直接部署）作为当前方案**，因为：
1. Vite构建系统尚未完全集成（index.html仍引用CDN Tailwind）
2. 项目当前可无构建直接运行
3. 后续可渐进迁移到方案B

## 部署步骤

### Step 1: 验证项目完整性
- 检查所有模块导入路径是否正确
- 检查 index.html 中无语法错误
- 检查 _headers/_redirects 配置正确

### Step 2: 更新 wrangler.toml
- 确认 bucket 指向项目根目录 `.`
- 确认排除文件列表完整（.trae、.vscode、node_modules、example、server.js、*.test.js、vitest.config.js、.eslintrc.json、.prettierrc）

### Step 3: 更新 .wranglerignore
- 添加所有不应部署的文件和目录

### Step 4: 执行部署
```bash
npx wrangler pages deploy . --project-name=niyphergal
```

### Step 5: 部署后验证
- 访问网站确认页面加载
- 验证SPA路由（首页、分类、详情、搜索、个人中心）
- 验证深色/浅色模式切换
- 验证搜索功能（拼音搜索、模糊音、联想）
- 验证注册/登录流程
- 验证Turnstile人机验证
- 验证安全响应头（CSP、HSTS等）

### Step 6: 更新 Cloudflare Turnstile 域名配置
- 确认生产域名已在 Turnstile 后台注册
- 确认 SITE_KEY 与域名匹配

## 关键配置文件

### wrangler.toml（需更新）
```toml
name = "niyphergal"
compatibility_date = "2024-01-01"

[site]
bucket = "."
```

### .wranglerignore（需更新）
```
example/
node_modules/
.trae/
.vscode/
.github/
*.log
server.js
vitest.config.js
.eslintrc.json
.prettierrc
package.json
package-lock.json
vite.config.js
src/js/modules/__tests__/
src/css/base/
src/css/main.css
```

## 风险与注意事项

1. **CSP与CDN兼容性**：_headers 中的 CSP 已允许 cdn.tailwindcss.com 和 cdn.jsdelivr.net，部署后需验证CSP不阻断资源加载
2. **ES Module兼容性**：所有JS使用 `<script type="module">` 加载，现代浏览器均支持
3. **Turnstile域名**：如果部署到新域名，需在Cloudflare Dashboard中更新Turnstile的允许域名列表
4. **localStorage加密**：新加密方案基于用户密码派生，旧版ENCv1数据需迁移，首次登录后需重新注册
