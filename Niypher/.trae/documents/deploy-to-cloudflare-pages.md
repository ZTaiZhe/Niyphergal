# 部署 NiypherGal 到 Cloudflare Pages 计划

## 📋 项目分析

### 当前项目结构
```
Niypher/
├── index.html          # 主入口文件
├── server.js           # 本地开发服务器（Node.js）
├── src/
│   ├── css/styles.css  # 样式文件
│   └── js/             # JavaScript 模块
└── example/            # 示例文件（不需要部署）
```

### 项目类型
- **纯静态前端项目**（HTML + CSS + JavaScript）
- 无构建步骤，无 package.json
- 使用 CDN 资源（Tailwind CSS、Remix Icon）

## 🎯 部署目标

部署到已存在的 Cloudflare Pages 项目：`niyphergal`

## 📝 部署方案

### 使用 Wrangler CLI 部署到现有项目

#### 步骤 1: 安装 Wrangler（如未安装）
```bash
npm install -g wrangler
```

#### 步骤 2: 登录 Cloudflare（如未登录）
```bash
wrangler login
```

#### 步骤 3: 部署到现有项目
```bash
wrangler pages deploy . --project-name=niyphergal
```

## ⚙️ 需要创建的配置文件

### 1. wrangler.toml
```toml
name = "niyphergal"
compatibility_date = "2024-01-01"

[site]
bucket = "."
exclude = ["example", "server.js", ".trae", ".github", ".vscode"]
```

### 2. _headers（Cloudflare Pages 头部配置）
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable
```

### 3. _redirects（SPA 路由支持）
```
/*    /index.html   200
```

## 🚀 执行步骤

1. **创建 wrangler.toml 配置文件**
2. **创建 _headers 文件（安全头部）**
3. **创建 _redirects 文件（SPA 路由）**
4. **执行部署命令**

## ⚠️ 注意事项

1. **排除文件**: 部署时应排除 `example/`、`server.js`、`.trae/`、`.vscode/` 等开发文件
2. **Cloudflare Turnstile**: 项目已集成，需确保站点域名已在 Turnstile 后台注册
3. **自定义域名**: 如已配置，部署后自动生效

## 📦 部署后验证

- [ ] 访问 `https://niyphergal.pages.dev` 确认部署成功
- [ ] 检查所有页面路由正常工作
- [ ] 检查深色/浅色模式切换
- [ ] 检查搜索功能
- [ ] 检查 Cloudflare Turnstile 人机验证
