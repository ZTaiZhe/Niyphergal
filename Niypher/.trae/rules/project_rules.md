# Niypher 项目规则

## 开发版本约定
- 本项目使用 **Vanilla JS SPA**（`src/` 目录，Vite 构建），构建产物为 `dist/`
- React 组件库（`temp_carousel/`）**仅作参考**，用于 UI 设计参照
- 部署命令：`wrangler pages deploy dist`（Vite 构建产物）

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
