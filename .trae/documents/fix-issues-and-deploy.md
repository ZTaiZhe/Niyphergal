# 修复问题并部署计划

## 问题清单

### 问题1：构建产物中残留 CDN tailwindcss 脚本
**现状**：`index.html` 中有 `<script src="https://cdn.tailwindcss.com"></script>`，Vite 构建后这个 CDN 脚本仍保留在 `dist/index.html` 中。项目已使用 `@tailwindcss/vite` 插件进行构建时编译，CDN 版本不仅冗余，还会导致：
- 生产环境加载不必要的 ~400KB 脚本
- CDN 版本与本地版本样式可能冲突
- Tailwind CSS 已通过 Vite 编译到 `dist/assets/index-*.css` 中

**修复**：从 `index.html` 中移除 `<script src="https://cdn.tailwindcss.com"></script>`

### 问题2：构建产物中残留 CDN pinyin-pro 脚本
**现状**：`index.html` 中有 `<script src="https://cdn.jsdelivr.net/npm/pinyin-pro@3.18.2/dist/index.js" defer></script>`，但项目已有本地 `src/js/lib/pinyin-pro.js` 模块，通过 ES Module import 使用。CDN 版本冗余且：
- `utils.js` 中 `getPinyinInstance()` 优先使用 `window.pinyinPro`（CDN 注入的全局变量），但本地模块已足够
- CDN 版本 ~300KB，本地精简版已包含所需功能

**修复**：从 `index.html` 中移除 CDN pinyin-pro 脚本标签

### 问题3：Vite 配置中 vendor chunk 为空
**现状**：`vite.config.js` 中 `manualChunks: { vendor: ['pinyin-pro'] }` 但项目并未从 npm 包 `pinyin-pro` 导入（使用的是本地 `src/js/lib/pinyin-pro.js`），导致构建输出空的 `vendor-*.js` 文件

**修复**：移除 `rollupOptions.output.manualChunks` 配置

### 问题4：CSS 中残留未使用的 animate-card-in 规则
**现状**：`styles.css` 中有3处 `.animate-card-in` 定义（行281、288、349），但 JS 中已不再使用此类（仅 `classList.remove('animate-card-in')` 残留调用）。这些规则不会造成功能问题，但增加 CSS 体积

**修复**：保留 CSS 中的 `.animate-card-in` 规则（因为 `renderer.js` 中仍有 `classList.remove('animate-card-in')` 调用，移除 CSS 规则不影响功能，但保留更安全），清理 JS 中残留的 `classList.remove('animate-card-in')` 和 `style.removeProperty('--card-delay')` 调用

### 问题5：selectSuggestion 中 id 类型问题
**现状**：`selectSuggestion(text, id, type)` 中，`id` 从 `data-id` HTML 属性获取，始终为字符串。当 `id` 为 `"null"` 字符串时，`id` 是 truthy 值，会错误地导航到详情页。移动端已修复（使用 `parseInt` + `isNaN` 检查），但桌面端未修复

**修复**：在 `selectSuggestion()` 中添加 `parseInt` + `isNaN` 检查，与移动端一致

### 问题6：构建和部署
**现状**：上次构建成功但存在上述问题

**修复**：修复问题后重新构建

## 实施步骤

1. 从 `index.html` 移除 CDN tailwindcss 脚本标签
2. 从 `index.html` 移除 CDN pinyin-pro 脚本标签
3. 从 `vite.config.js` 移除空的 `manualChunks` 配置
4. 修复 `search.js` 中 `selectSuggestion()` 的 id 类型检查
5. 清理 `renderer.js` 和 `home.js` 中残留的 `animate-card-in` 和 `--card-delay` 引用
6. 运行 `npm run build` 构建生产版本
7. 验证构建产物正确性
