# Niypher 项目规则

## 开发版本约定
- 本项目使用 **Vanilla JS SPA**（`src/` 目录，Vite 构建），构建产物为 `dist/`
- React 组件库（`temp_carousel/`）**仅作参考**，用于 UI 设计参照

## 关键文件
- SPA 源码：`src/js/app.js`, `src/js/modules/`, `src/js/pages/`
- 样式：`src/css/main.css`, `src/css/styles.css`, `src/css/base/tokens.css`
- HTML 入口：`index.html`
- API 后端：`api/`（Cloudflare Workers）

## 技术栈
- 前端：Vanilla JS SPA + Vite + Tailwind CSS
- 依赖：framer-motion, lucide-react, pinyin-pro, zustand
- API：Cloudflare Workers（TypeScript）+ D1
- 部署：Cloudflare Pages

## CI/CD 自动化部署

### 仓库与部署目标
- GitHub 仓库：`https://github.com/ZTaiZhe/Niyphergal`
- Cloudflare Pages 项目名：`niyphergal`
- 部署域名：`https://niyphergal.pages.dev`
- CI/CD 配置文件：`.github/workflows/ci.yml`

### 自动化流程
- **触发条件**：push 到 `main` 分支自动触发构建+部署；PR 到 `main` 仅触发构建验证
- **构建**：`npm install` → `npm run build`（Vite 构建，输出到 `dist/`）
- **部署**：`cloudflare/wrangler-action@v3` 执行 `pages deploy dist --project-name=niyphergal`
- **产物传递**：build job 产物通过 `upload-artifact` 传递给 deploy job，不重复构建

### GitHub Secrets（必须配置）
在仓库 Settings → Secrets and variables → Actions 中添加：
- `CF_API_TOKEN`：Cloudflare API Token（权限：Cloudflare Pages: Edit）
- `CF_ACCOUNT_ID`：Cloudflare Account ID

### 日常开发流程
```
git add <files>
git commit -m "feat: 描述"
git push
```
push 后自动触发：构建 → 部署 → `https://niyphergal.pages.dev` 更新

### 手动部署（备用）
```
npm run build
npx wrangler pages deploy dist --project-name=niyphergal
```

### Cloudflare Pages 配置
- **production_branch 必须设为 `"main"`**：如果设为其他值（如旧 Flutter 分支 `"niyphergal"`），`main` 分支的部署会进入 preview 环境而非 production，导致 `https://niyphergal.pages.dev` 仍提供旧内容
- 检查/修改方法：Cloudflare API `GET/PATCH /accounts/{id}/pages/projects/niyphergal`，字段 `production_branch`
- 或在 Cloudflare Dashboard → Pages → niyphergal → Settings → Builds & deployments 中查看

### CI 环境注意事项
- CI 运行在 Linux（ubuntu-latest），文件名大小写敏感
- `src/js/modules/` 下的 import 路径必须与实际文件名大小写完全一致
- 使用 `npm install`（非 `npm ci`），避免 lockfile 版本格式不兼容
- `vite.config.mjs` 中的 `modulesResolver` 插件使用 `fs.existsSync`，在 Linux 上大小写敏感
- `esbuild` 是必需依赖（`vite.config.mjs` 中 `minify: 'esbuild'`）
