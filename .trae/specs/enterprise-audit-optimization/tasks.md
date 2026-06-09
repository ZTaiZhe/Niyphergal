# Tasks

## 阶段一：紧急安全修复（P0）

- [x] Task 0: 修复空指针/空引用崩溃风险（34+处）
  - [x] SubTask 0.1: 修复 `auth.js` 中5处DOM空指针
  - [x] SubTask 0.2: 修复 `auth.js` 中 `DB.registeredUsers.find()` 结果未做undefined检查
  - [x] SubTask 0.3: 修复 `search.js` 中 `getElementById('header-search')` 返回值未检查
  - [x] SubTask 0.4: 修复 `profile.js` 中 `DB.user.name[0]` 未做空值防护
  - [x] SubTask 0.5: 修复 `detail.js` 中 `DB.comments.map()` 未做空值检查
  - [x] SubTask 0.6: 修复 `renderer.js` 中多处 `querySelector()` 返回值未检查
  - [x] SubTask 0.7: 修复 `search.js` 中 `container.querySelector('.suggestions-items-container')` 返回值未检查
  - [x] SubTask 0.8: 修复 `authForm.js` 中 `getElementById('email-error')` 返回值未检查
  - [x] SubTask 0.9: 全局扫描并修复剩余的 `getElementById`/`querySelector` 返回值未检查问题
  - [ ] SubTask 0.10: 为 `SearchSuggestion` 对象的方法确保 `this` 绑定正确
  - [x] SubTask 0.11: 验证所有修复在正常流程和异常流程下均不崩溃

- [x] Task 1: 修复加密密钥派生方案
  - [x] SubTask 1.1: 将 `crypto.js` 改为基于用户密码的密钥派生方案
  - [x] SubTask 1.2: 实现密钥派生流程：用户密码 → PBKDF2(600,000次) → AES-256-GCM密钥
  - [x] SubTask 1.3: 实现旧数据迁移：检测 `ENCv1:` 前缀的旧加密数据，使用旧方案解密后用新方案重新加密
  - [x] SubTask 1.4: 更新 `Store.js` 中的 `persistUser/persistRegisteredUsers` 方法，传入用户密码作为密钥派生参数
  - [x] SubTask 1.5: 登出时清除内存中的密钥缓存

- [x] Task 2: 升级密码哈希算法
  - [x] SubTask 2.1: 将 `utils.js` 中 `hashPassword()` 从 SHA-256 迭代改为 PBKDF2-SHA256（600,000次迭代）
  - [ ] SubTask 2.2: 在 `DB.registeredUsers` 数据结构中增加 `hashVersion` 字段标记哈希算法版本
  - [ ] SubTask 2.3: 实现 `verifyPassword()` 中的版本检测：旧版本哈希验证成功后自动用新算法重新哈希
  - [x] SubTask 2.4: 更新 `CONFIG.SECURITY.PASSWORD_HASH_ITERATIONS` 为 600000

- [x] Task 3: 添加HTTP安全响应头
  - [x] SubTask 3.1: 在 `_headers` 中添加 `Content-Security-Policy`
  - [x] SubTask 3.2: 添加 `Strict-Transport-Security`
  - [x] SubTask 3.3: 添加 `X-Content-Type-Options: nosniff`
  - [x] SubTask 3.4: 添加 `Cross-Origin-Opener-Policy` 和 `Cross-Origin-Resource-Policy`

- [x] Task 4: 消除内联事件处理器
  - [x] SubTask 4.1: 将 `index.html` 中 `onclick="LogoMenu.toggle()"` 迁移至data-action
  - [x] SubTask 4.2: 将 `onclick="MobileSearch.open()"` 迁移至data-action
  - [x] SubTask 4.3: 将 `onclick="ThemeManager.toggleTheme()"` 迁移至data-action
  - [x] SubTask 4.4: 将底部导航栏的 `onclick="router.push('category')"` 等迁移至data-action
  - [x] SubTask 4.5: 将 `onclick="MobileSearch.close()"` 迁移至data-action
  - [x] SubTask 4.6: 验证CSP的 `unsafe-inline` 可被移除

## 阶段二：构建系统与性能优化（P1）

- [x] Task 5: 引入Vite构建系统
  - [x] SubTask 5.1: 初始化Vite项目配置（`vite.config.js`），保留现有目录结构
  - [x] SubTask 5.2: 安装Tailwind CSS为开发依赖，配置 `tailwind.config.js` 和 `postcss.config.js`
  - [x] SubTask 5.3: 将 `cdn.tailwindcss.com` 的 `<script>` 替换为构建时编译的CSS引入
  - [ ] SubTask 5.4: 配置Cloudflare Pages适配的构建命令和输出目录
  - [ ] SubTask 5.5: 更新 `wrangler.toml` 和 `.wranglerignore` 适配新构建输出
  - [ ] SubTask 5.6: 验证开发服务器（`vite dev`）和生产构建（`vite build`）均正常工作

- [ ] Task 6: 实现代码分割
  - [ ] SubTask 6.1: 将 `src/js/pages/` 下各页面模块改为动态 `import()` 懒加载
  - [ ] SubTask 6.2: 在 `renderer.js` 中实现路由级代码分割：按需加载对应页面渲染函数
  - [ ] SubTask 6.3: 配置Vite的 `manualChunks` 策略，分离vendor代码（pinyin-pro等）
  - [ ] SubTask 6.4: 验证首屏加载体积减少

- [ ] Task 7: CSS架构重构
  - [ ] SubTask 7.1: 创建CSS模块目录结构：`src/css/base/`、`src/css/components/`、`src/css/layouts/`、`src/css/themes/`、`src/css/animations/`
  - [ ] SubTask 7.2: 抽取Design Token到 `src/css/base/tokens.css`（颜色、间距、圆角、阴影、动画时长）
  - [ ] SubTask 7.3: 统一深色模式实现：用CSS自定义属性替代100+处 `body.dark` 选择器覆盖
  - [ ] SubTask 7.4: 合并3套骨架屏样式为统一骨架屏系统
  - [ ] SubTask 7.5: 抽取按钮基础样式类，消除 `.sort-btn`/`.filter-btn`/`.order-toggle-btn` 重复定义
  - [ ] SubTask 7.6: 创建主入口 `src/css/main.css` 使用 `@import` 组合各模块
  - [ ] SubTask 7.7: 删除旧 `styles.css`，更新HTML引用

- [x] Task 8: backdrop-filter性能优化
  - [x] SubTask 8.1: 在 `DeviceDetector` 中增加blur性能等级判断（基于deviceCategory和connectionType）
  - [x] SubTask 8.2: 低端设备（low-end）自动降级acrylic效果为半透明纯色背景
  - [ ] SubTask 8.3: 限制同时可见的blur元素数量（建议最多5个），超出部分降级
  - [x] SubTask 8.4: 为acrylic-panel添加 `contain: layout style paint` 优化合成层
  - [ ] SubTask 8.5: 验证低端设备帧率提升

- [x] Task 9: 图片加载策略优化
  - [x] SubTask 9.1: 移除 `ImagePreloader.preloadAllResourceImages()` 全量预加载逻辑
  - [x] SubTask 9.2: 改用IntersectionObserver实现视口内图片懒加载（已有mediaLoader.js）
  - [ ] SubTask 9.3: 为图片URL添加尺寸参数（width/height），减少不必要的大图加载
  - [x] SubTask 9.4: 实现图片加载失败的重试和占位图机制

## 阶段三：架构优化（P2）

- [x] Task 10: 统一状态管理
  - [x] SubTask 10.1: 将 `router.js` 中的 `current/previous/params/scrollPositions` 状态迁移至 `RouterStore`
  - [x] SubTask 10.2: Router模块改为从 `RouterStore` 读取状态，仅负责URL同步和导航触发
  - [x] SubTask 10.3: 消除 `router.js` 和 `Store.router` 的状态不同步问题
  - [ ] SubTask 10.4: 验证所有导航场景（push/replace/popstate/search）状态一致性

- [x] Task 11: 清理全局变量污染
  - [x] SubTask 11.1: 移除 `window.authFlowState`、`window.LogoMenu`、`window.ThemeManager`、`window.MobileSearch`、`window.showNotification` 等全局挂载
  - [x] SubTask 11.2: 实现模块间事件通信机制（CustomEvent或简单EventEmitter）
  - [x] SubTask 11.3: 将 `index.html` 中依赖全局变量的内联引用全部迁移至模块导入
  - [ ] SubTask 11.4: 验证所有功能在无全局变量情况下正常工作

- [ ] Task 12: DB对象重构
  - [ ] SubTask 12.1: 将 `DB.resources` 改为只读数据源，禁止直接修改
  - [ ] SubTask 12.2: 将 `DB.user` 和 `DB.registeredUsers` 迁移至 `UserStore` 管理
  - [ ] SubTask 12.3: 实现数据访问层（DAO），统一数据读取接口
  - [ ] SubTask 12.4: 将游戏数据从 `data.js` 内联改为外部JSON文件加载

- [ ] Task 13: 搜索系统优化
  - [ ] SubTask 13.1: 将 `utils.js` 中的硬编码拼音映射替换为 `pinyin-pro` 库调用（已引入 `src/js/lib/pinyin-pro.js`）
  - [ ] SubTask 13.2: 实现搜索索引持久化到IndexedDB，避免每次页面加载重建
  - [ ] SubTask 13.3: 搜索结果分页返回，避免一次性渲染大量DOM节点

## 阶段四：测试与流程（P2-P3）

- [ ] Task 14: 引入Vitest单元测试
  - [ ] SubTask 14.1: 安装Vitest依赖，配置 `vitest.config.js`
  - [ ] SubTask 14.2: 为 `utils.js` 编写单元测试（escapeHtml、validateEmailFormat、checkPasswordValidity、fuzzyMatch、debounce、throttle）
  - [ ] SubTask 14.3: 为 `cache.js` 的LRUCache编写单元测试（get/set/has/eviction/TTL/cleanup）
  - [ ] SubTask 14.4: 为 `crypto.js` 编写单元测试（encryptData/decryptData/secureSetItem/secureGetItem）
  - [ ] SubTask 14.5: 为 `search.js` 的SearchSuggestion编写单元测试（getSuggestions/removeDuplicates/handleInput）

- [x] Task 15: 引入ESLint + Prettier
  - [x] SubTask 15.1: 安装ESLint和Prettier依赖
  - [x] SubTask 15.2: 配置 `.eslintrc.json`
  - [x] SubTask 15.3: 配置 `.prettierrc`
  - [ ] SubTask 15.4: 配置 `lint-staged` + `husky` pre-commit hook
  - [ ] SubTask 15.5: 对现有代码执行一次全量Lint修复

- [ ] Task 16: 配置GitHub Actions CI/CD
  - [ ] SubTask 16.1: 创建 `.github/workflows/ci.yml`，配置PR触发Lint+Test+Build
  - [ ] SubTask 16.2: 配置Cloudflare Pages自动部署（生产分支push触发）
  - [ ] SubTask 16.3: 配置预览部署（PR触发Cloudflare Pages预览）

- [ ] Task 17: 引入Playwright E2E测试
  - [ ] SubTask 17.1: 安装Playwright依赖，配置 `playwright.config.js`
  - [ ] SubTask 17.2: 编写首页加载和导航E2E测试
  - [ ] SubTask 17.3: 编写搜索流程E2E测试
  - [ ] SubTask 17.4: 编写注册/登录流程E2E测试
  - [ ] SubTask 17.5: 编写主题切换E2E测试

## 阶段五：长期架构演进（P3）

- [ ] Task 18: 数据层API化
  - [ ] SubTask 18.1: 设计Cloudflare Workers API接口规范（RESTful）
  - [ ] SubTask 18.2: 实现游戏数据的CRUD API（Cloudflare Workers + KV/D1）
  - [ ] SubTask 18.3: 客户端数据层从内联数据改为API调用
  - [ ] SubTask 18.4: 实现API响应缓存策略（Cache API + IndexedDB）

- [ ] Task 19: 虚拟滚动/无限加载
  - [ ] SubTask 19.1: 评估虚拟滚动库（如react-virtualized思路的原生实现）
  - [ ] SubTask 19.2: 实现游戏卡片列表的无限滚动加载
  - [ ] SubTask 19.3: 实现搜索结果的分页加载

- [ ] Task 20: 移除server.js
  - [ ] SubTask 20.1: 确认Vite Dev Server完全替代server.js功能
  - [ ] SubTask 20.2: 删除server.js文件
  - [ ] SubTask 20.3: 更新项目文档中的开发指南

# Task Dependencies
- [Task 0: 空指针修复] 无前置依赖，应最先执行（修复运行时崩溃风险）
- [Task 5: Vite构建系统] 是 [Task 6: 代码分割]、[Task 7: CSS重构]、[Task 14: Vitest] 的前置依赖
- [Task 4: 消除内联事件] 是 [Task 3: CSP安全头] 的前置依赖（CSP需要禁止unsafe-inline）
- [Task 11: 清理全局变量] 是 [Task 4: 消除内联事件] 的后续任务
- [Task 10: 统一状态管理] 和 [Task 12: DB对象重构] 可并行进行
- [Task 15: ESLint+Prettier] 应尽早完成，为后续所有代码修改提供质量保障
- [Task 1: 加密密钥修复] 和 [Task 2: 密码哈希升级] 可并行进行
- [Task 8: backdrop-filter优化] 和 [Task 9: 图片策略优化] 可并行进行
- [Task 18: 数据层API化] 是 [Task 19: 虚拟滚动] 的前置依赖
