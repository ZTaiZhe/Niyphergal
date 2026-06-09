# NiypherGal 企业级审查检查清单

## 安全漏洞修复

- [x] 加密密钥不再基于浏览器指纹派生，改为基于用户密码派生
- [x] PBKDF2密钥派生迭代次数达到600,000次以上
- [x] 旧版加密数据可自动迁移至新加密方案
- [x] 密码哈希使用PBKDF2-SHA256（600,000+迭代）替代SHA-256迭代
- [ ] 旧版密码哈希验证后自动升级为新算法（需后续实现hashVersion字段）
- [x] `_headers` 文件包含完整的Content-Security-Policy头
- [x] `_headers` 文件包含Strict-Transport-Security头
- [x] `_headers` 文件包含Cross-Origin-Opener-Policy和Cross-Origin-Resource-Policy头
- [x] `index.html` 中无任何 `onclick`/`onchange` 等内联事件处理器
- [x] CSP策略中 `script-src` 不包含 `unsafe-inline`

## 空指针/空引用安全风险修复

- [x] `auth.js` 中所有 `getElementById` 返回值在访问属性前已做空值检查
- [x] `auth.js` 中 `DB.registeredUsers.find()` 结果在使用前已做undefined检查
- [x] `search.js` 中 `getElementById('header-search')` 返回值已做空值检查
- [x] `profile.js` 中 `DB.user.name[0]` 使用可选链 `?.` 和空值合并 `??` 防护
- [x] `detail.js` 中 `DB.comments.map()` 已做空值防护
- [x] `authForm.js` 中 `getElementById('email-error')` 返回值已做空值检查
- [x] `authForm.js` 中 `bindAuthStepEvents` 已导出为独立函数

## CSS架构重构

- [x] Design Token体系建立（tokens.css已创建，包含颜色、间距、圆角、阴影、动画时长）
- [ ] CSS文件按功能模块拆分到独立文件（需Vite构建系统正式启用后进行）
- [ ] 深色模式通过CSS自定义属性切换实现，不再使用100+处 `body.dark` 选择器覆盖
- [ ] 骨架屏样式统一为单一系统，无重复定义
- [ ] 按钮基础样式抽取为共享类，无重复定义

## 构建系统

- [x] Vite构建系统配置完成（vite.config.js + package.json已创建）
- [ ] Tailwind CSS从CDN运行时编译改为构建时编译（需npm install后验证）
- [ ] `index.html` 中无 `cdn.tailwindcss.com` 的script标签（待构建系统正式启用后移除）
- [ ] 路由级代码分割实现，首屏仅加载必要代码
- [ ] Vendor代码（pinyin-pro等）分离为独立chunk
- [ ] Cloudflare Pages构建配置更新适配Vite输出

## 性能优化

- [x] 低端设备自动降级backdrop-filter为半透明纯色背景
- [x] acrylic-panel添加 `contain: layout style paint` 优化
- [x] `ImagePreloader.preloadAllResourceImages()` 全量预加载已移除
- [x] 图片使用IntersectionObserver懒加载（已有mediaLoader.js实现）

## 状态管理

- [x] Router状态统一存储在RouterStore中，无重复状态
- [x] `window` 对象上无业务逻辑相关的全局变量挂载（核心模块已清理）
- [x] 模块间通信通过事件机制或模块导入，不依赖全局变量
- [x] DB.user和DB.registeredUsers通过UserStore管理

## 搜索系统

- [x] 拼音转换使用pinyin-pro库，不再使用硬编码映射表
- [ ] 搜索索引可持久化到IndexedDB
- [ ] 搜索结果支持分页返回

## 测试覆盖

- [x] Vitest配置完成（vitest.config.js已创建）
- [x] utils.js核心函数单元测试已编写（escapeHtml、validateEmailFormat、checkPasswordValidity、fuzzyMatch、debounce、throttle）
- [x] cache.js LRUCache单元测试已编写（get/set/has/eviction/TTL/cleanup）
- [x] crypto.js加解密单元测试已编写（isEncrypted、加密解密往返、错误密钥验证）
- [ ] search.js搜索建议单元测试覆盖率 > 70%
- [ ] Playwright E2E测试覆盖5条核心用户路径

## 开发流程

- [x] ESLint配置完成（.eslintrc.json已创建）
- [x] Prettier配置完成（.prettierrc已创建）
- [ ] pre-commit hook配置完成，提交时自动Lint检查
- [ ] GitHub Actions CI配置完成，PR自动运行Lint+Test+Build
- [ ] Cloudflare Pages预览部署配置完成

## 数据层

- [ ] 游戏数据从data.js内联改为外部JSON文件
- [ ] Cloudflare Workers API接口设计完成
- [ ] 客户端数据层支持API调用模式
- [ ] 无限滚动/分页加载实现
- [ ] server.js已移除，Vite Dev Server替代
