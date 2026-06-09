# NiypherGal 企业级全面审查与优化规范

## Why
NiypherGal 项目当前处于快速迭代阶段，积累了大量技术债务和架构隐患。在项目进一步扩展前，需要对企业级标准下的代码质量、性能瓶颈、安全漏洞、架构设计、可扩展性、可维护性、测试覆盖率和开发流程效率进行全面审查，并制定可实施的优化路线图，避免技术债务持续累积导致项目不可维护。

## What Changes
- 修复关键安全漏洞（加密方案、认证流程、HTTP安全头、空指针崩溃风险）
- 修复空指针/空引用安全风险（34+处未检查null的DOM操作和数据访问）
- 重构CSS架构（消除4300+行单文件、重复代码、设计系统碎片化）
- 引入构建系统（替代CDN运行时编译、实现代码分割和Tree-shaking）
- 优化性能瓶颈（backdrop-filter滥用、全量数据加载、图片策略）
- 重构状态管理（消除Router/Store职责重叠、全局变量污染）
- 建立测试体系（从零到单元测试+集成测试覆盖）
- 建立开发流程规范（Lint、Pre-commit Hook、CI/CD）
- 数据层架构升级（客户端硬编码→API驱动）

## Impact
- Affected specs: 所有现有spec（涉及CSS、JS模块、HTML模板、部署配置）
- Affected code: 
  - `src/css/styles.css`（4300+行需拆分重构）
  - `src/js/modules/`（所有模块需安全加固和架构优化）
  - `src/js/app.js`（全局变量污染需清理）
  - `index.html`（内联事件处理器需迁移）
  - `server.js`（安全头缺失需修复）
  - `_headers`（CSP等安全策略需补充）
  - `wrangler.toml`（构建配置需更新）

## ADDED Requirements

### Requirement: 安全漏洞修复
系统 SHALL 修复以下已识别的安全漏洞：

#### Scenario: 加密密钥派生方案不安全
- **WHEN** 攻击者获取到浏览器指纹信息
- **THEN** 可通过相同指纹重建加密密钥，解密localStorage中的用户数据
- **预期改进**: 采用用户密码派生密钥方案（PBKDF2 + 用户密码），而非基于浏览器指纹的密钥派生

#### Scenario: 密码哈希算法不合规
- **WHEN** 用户注册时密码通过SHA-256迭代哈希存储
- **THEN** 不符合OWASP推荐的Argon2id/bcrypt/scrypt标准，SHA-256迭代哈希易受GPU暴力破解
- **预期改进**: 迁移至Web Crypto API支持的PBKDF2-SHA256（至少600,000次迭代）或引入Argon2 WASM实现

#### Scenario: HTTP安全头缺失
- **WHEN** 用户访问网站时
- **THEN** 缺少Content-Security-Policy、Strict-Transport-Security等关键安全响应头
- **预期改进**: 在`_headers`中添加CSP、HSTS、X-Content-Type-Options等完整安全头

#### Scenario: 内联事件处理器存在XSS风险
- **WHEN** `index.html`中使用`onclick`内联事件处理器
- **THEN** 绕过CSP的unsafe-inline限制，增加XSS攻击面
- **预期改进**: 将所有内联事件处理器迁移至JS模块中的addEventListener

#### Scenario: Turnstile Token未服务端验证
- **WHEN** 用户完成Turnstile人机验证后
- **THEN** Token仅在客户端检查，未发送至服务端验证，可被伪造绕过
- **预期改进**: 实现服务端Token验证接口（Cloudflare Workers）

### Requirement: 空指针/空引用安全风险修复
系统 SHALL 修复以下已识别的空指针/空引用崩溃风险（共34+处）：

#### Scenario: DOM元素获取后未做空值检查直接访问属性
- **WHEN** `document.getElementById()` 返回 `null`（元素尚未渲染或ID拼写错误）
- **THEN** 直接访问 `.value`、`.focus()` 等属性/方法导致 `TypeError: Cannot read properties of null` 运行时崩溃
- **高风险位置**:
  - `auth.js:189` — `document.getElementById('auth-email').value` 未检查null
  - `auth.js:248` — `document.getElementById('auth-pwd1').value` 未检查null
  - `auth.js:289` — `document.getElementById('auth-pwd2').value` 未检查null
  - `search.js:515` — `document.getElementById('header-search').focus()` 未检查null
  - `search.js:558` — `document.getElementById('header-search').value.trim()` 未检查null
  - `authForm.js:17` — `document.getElementById('email-error').classList.add()` 未检查null
- **预期改进**: 所有 `getElementById`/`querySelector` 返回值必须先进行空值检查再使用

#### Scenario: Array.find()返回undefined后直接访问属性
- **WHEN** `Array.find()` 未找到匹配项返回 `undefined`
- **THEN** 后续访问 `.salt`、`.password` 等属性导致运行时崩溃
- **高风险位置**:
  - `auth.js:214` — `DB.registeredUsers.find(u => u.email === email)` 结果作为 `existingUser` 使用，但后续 `existingUser.salt`/`existingUser.password` 未做undefined检查（虽然外层有 `isRegistered` 判断，但 `find` 与 `isRegistered` 判断之间存在竞态窗口）
  - `auth.js:258` — 同上，登录流程中 `find` 结果直接访问 `.salt`/`.password`
  - `detail.js:16` — `DB.resources.find(r => r.id === id)` 有null检查（良好实践），但其他页面模块未遵循
- **预期改进**: 所有 `Array.find()` 结果必须进行undefined检查，或使用可选链 `?.`

#### Scenario: DB.user属性访问未做空值防护
- **WHEN** 用户数据结构不完整（如 `DB.user.name` 为空字符串或undefined）
- **THEN** 访问 `DB.user.name[0]` 导致 `Cannot read properties of undefined (reading '0')` 崩溃
- **高风险位置**:
  - `profile.js:118` — `DB.user.name[0]` 取首字符，若name为undefined/null则崩溃
  - `profile.js:121` — `DB.user.name` 未做空值防护
  - `profile.js:122` — `DB.user.email` 未做空值防护
- **预期改进**: 使用可选链 `DB.user?.name?.[0] ?? 'U'` 或在渲染前进行完整的数据验证

#### Scenario: DB.comments未定义时直接调用.map()
- **WHEN** `DB.comments` 为 `undefined` 或 `null`
- **THEN** `DB.comments.map(...)` 导致运行时崩溃
- **高风险位置**:
  - `detail.js:36` — `DB.comments.map(c => renderComment(c)).join('')` 无空值检查
- **预期改进**: 使用 `(DB.comments || []).map(...)` 或可选链

#### Scenario: renderer.js中querySelector结果未检查
- **WHEN** 页面DOM结构不完整或渲染时序异常
- **THEN** `querySelector` 返回null后直接访问属性导致崩溃
- **高风险位置**:
  - `renderer.js` 中多处 `container.querySelector(...)` 结果直接调用 `.innerHTML`、`.classList` 等方法
  - `search.js` 中 `container.querySelector('.suggestions-items-container')` 未检查null
- **预期改进**: 所有querySelector结果必须进行空值检查，或使用可选链

#### Scenario: 事件回调中this指向丢失
- **WHEN** 对象方法作为事件回调时，`this` 指向DOM元素而非对象本身
- **THEN** 访问 `this.suggestions`、`this.currentPage` 等属性返回undefined，后续操作崩溃
- **预期改进**: 使用箭头函数、`.bind(this)` 或在闭包中捕获 `self = this`

### Requirement: CSS架构重构
系统 SHALL 重构CSS架构以消除维护性隐患：

#### Scenario: 单文件CSS过于庞大
- **WHEN** 开发者需要修改某个组件样式
- **THEN** 需在4300+行单文件中定位，效率极低且易产生冲突
- **预期改进**: 按功能模块拆分CSS（base、components、layouts、themes、utilities、animations），使用构建工具合并

#### Scenario: CSS重复代码严重
- **WHEN** 查看styles.css时
- **THEN** 存在大量重复的深色模式覆盖规则（`body.dark`选择器重复100+次）、重复的骨架屏样式定义（3套）、重复的按钮样式
- **预期改进**: 使用CSS自定义属性统一深色模式、合并骨架屏样式系统、抽取按钮基础样式类

#### Scenario: 设计系统碎片化
- **WHEN** 新增UI组件时
- **THEN** 缺乏统一的设计Token系统，颜色/间距/圆角等散落在各处硬编码
- **预期改进**: 建立Design Token体系（颜色、间距、圆角、阴影、动画时长），所有组件引用Token变量

### Requirement: 构建系统引入
系统 SHALL 引入现代构建系统：

#### Scenario: Tailwind CSS运行时编译
- **WHEN** 用户加载页面时
- **THEN** 通过`cdn.tailwindcss.com`在浏览器中运行时编译CSS，增加约300KB加载和显著CPU开销
- **预期改进**: 使用Vite构建系统，Tailwind CSS构建时编译，输出仅包含使用到的样式

#### Scenario: 无代码分割
- **WHEN** 用户访问首页时
- **THEN** 加载所有页面模块代码（search.js、detail.js、profile.js等），增加初始加载体积
- **预期改进**: 实现路由级代码分割，按需加载页面模块

#### Scenario: 无Tree-shaking
- **WHEN** 构建输出时
- **THEN** 包含所有导入的模块代码，即使部分函数未被使用
- **预期改进**: ES Module静态分析+Tree-shaking，消除未使用代码

### Requirement: 性能优化
系统 SHALL 优化以下性能瓶颈：

#### Scenario: backdrop-filter性能问题
- **WHEN** 页面包含多个acrylic-panel组件时
- **THEN** 每个组件的`backdrop-filter: blur(12px)`触发独立GPU合成层，低端设备出现严重掉帧
- **预期改进**: 限制同时可见的blur元素数量、低端设备降级为半透明背景、使用`contain: layout style paint`优化

#### Scenario: 全量数据预加载
- **WHEN** 应用初始化时
- **THEN** 30+条游戏数据全部内联在JS中，包含封面URL等大字符串，增加初始包体积
- **预期改进**: 数据外置为JSON文件，按需加载；首页仅加载前N条，滚动时增量加载

#### Scenario: 图片加载策略不优
- **WHEN** 应用初始化时
- **THEN** `ImagePreloader.preloadAllResourceImages()`尝试预加载所有游戏封面图
- **THEN** 使用外部unsplash/picsum URL，无尺寸优化、无WebP/AVIF格式、无CDN缓存
- **预期改进**: 使用IntersectionObserver懒加载、图片CDN+格式转换、移除全量预加载

### Requirement: 状态管理重构
系统 SHALL 重构状态管理以消除职责重叠：

#### Scenario: Router与Store职责重叠
- **WHEN** 页面导航发生时
- **THEN** `router.js`维护`current/previous/params`状态，同时`Store.router`也维护`current/previous/params/history`状态，两者不同步
- **预期改进**: 统一为单一状态源，Router作为Store的消费者而非独立状态持有者

#### Scenario: 全局变量污染
- **WHEN** 模块间需要通信时
- **THEN** 通过`window.authFlowState`、`window.LogoMenu`、`window.ThemeManager`等全局变量暴露，破坏模块封装性
- **预期改进**: 使用事件总线或依赖注入模式，消除window挂载

#### Scenario: DB对象作为全局可变状态
- **WHEN** 任何模块需要游戏数据时
- **THEN** 直接读写`DB.resources`、`DB.user`等可变全局对象，无变更追踪、无响应式更新
- **预期改进**: DB改为只读数据源，用户状态通过Store管理，实现响应式数据绑定

### Requirement: 测试体系建设
系统 SHALL 建立自动化测试体系：

#### Scenario: 零测试覆盖率
- **WHEN** 修改任何模块代码时
- **THEN** 无法自动验证功能正确性，只能手动测试，回归风险极高
- **预期改进**: 引入Vitest测试框架，优先覆盖工具函数（utils.js）、加密模块（crypto.js）、缓存模块（cache.js）、搜索逻辑（search.js）

#### Scenario: 无E2E测试
- **WHEN** 进行重大重构时
- **THEN** 无法验证用户核心流程（注册、登录、搜索、导航）是否正常
- **预期改进**: 引入Playwright，覆盖5条核心用户路径的E2E测试

### Requirement: 开发流程规范化
系统 SHALL 建立开发流程规范：

#### Scenario: 无代码质量检查
- **WHEN** 开发者提交代码时
- **THEN** 无Lint检查、无格式化验证、无类型检查，代码风格不一致
- **预期改进**: 引入ESLint + Prettier，配置规则集，集成pre-commit hook

#### Scenario: 无CI/CD流程
- **WHEN** 代码推送到仓库时
- **THEN** 无自动化构建验证、无部署前检查
- **预期改进**: 配置GitHub Actions，实现PR自动Lint+Test+Build验证

### Requirement: 数据层架构升级
系统 SHALL 升级数据层架构以支持扩展：

#### Scenario: 数据硬编码在客户端
- **WHEN** 需要新增或更新游戏数据时
- **THEN** 必须修改`data.js`源码并重新部署，无法动态更新
- **预期改进**: 数据存储在Cloudflare KV或D1数据库，通过API接口提供，支持后台管理

#### Scenario: 无分页机制
- **WHEN** 游戏数据量增长到数百条时
- **THEN** 首页一次性渲染所有卡片，DOM节点过多导致性能下降
- **预期改进**: 实现服务端分页API + 客户端虚拟滚动或无限加载

## MODIFIED Requirements

### Requirement: 认证流程安全加固
现有认证流程需进行以下修改：
- 密码哈希从SHA-256迭代迁移至PBKDF2-SHA256（600,000+迭代）
- 加密密钥从浏览器指纹派生改为用户密码派生
- 新增服务端Turnstile Token验证
- 新增登录失败次数限制（5次锁定15分钟）
- 新增会话超时机制（30分钟无操作自动登出）

### Requirement: 搜索系统优化
现有搜索系统需进行以下修改：
- 拼音映射从硬编码字典改为使用pinyin-pro库（已引入但未用于搜索）
- 搜索索引从内存构建改为可持久化索引（IndexedDB）
- 搜索结果从全量返回改为分页返回

## REMOVED Requirements

### Requirement: ImagePreloader全量预加载
**Reason**: 全量预加载所有游戏封面图在数据量增长后严重浪费带宽和内存，应改为按需懒加载
**Migration**: 使用IntersectionObserver + 媒体懒加载模块替代

### Requirement: server.js开发服务器
**Reason**: 生产环境使用Cloudflare Pages，开发环境应使用Vite Dev Server，Node.js静态服务器无存在必要
**Migration**: 配置Vite Dev Server替代，移除server.js

## 优化优先级矩阵

| 优先级 | 类别 | 具体项 | 预期效果 | 风险 |
|--------|------|--------|----------|------|
| P0-紧急 | 安全 | 加密密钥派生方案修复 | 防止用户数据被轻易解密 | 需数据迁移方案 |
| P0-紧急 | 安全 | 密码哈希算法升级 | 防止密码被暴力破解 | 需兼容旧哈希 |
| P0-紧急 | 安全 | CSP安全头添加 | 防止XSS注入攻击 | 可能影响内联脚本 |
| P0-紧急 | 稳定性 | 空指针/空引用风险修复(34+处) | 消除运行时TypeError崩溃 | 需逐个验证修复 |
| P1-高 | 性能 | Tailwind构建时编译 | 减少300KB+加载、消除运行时编译 | 需引入构建系统 |
| P1-高 | 性能 | backdrop-filter降级策略 | 低端设备性能提升50%+ | 视觉效果降级 |
| P1-高 | 架构 | CSS拆分重构 | 维护效率提升、冲突减少 | 大规模文件变更 |
| P1-高 | 流程 | ESLint+Prettier引入 | 代码风格统一、潜在错误提前发现 | 需团队适配 |
| P2-中 | 架构 | 状态管理统一 | 消除状态不同步bug | 需重构Router |
| P2-中 | 架构 | 全局变量清理 | 模块封装性提升 | 需修改事件通信模式 |
| P2-中 | 性能 | 代码分割 | 首屏加载体积减少40%+ | 需构建系统支持 |
| P2-中 | 数据 | 数据外置为JSON/API | 支持动态更新、减少包体积 | 需后端支持 |
| P2-中 | 测试 | Vitest单元测试 | 核心模块回归保护 | 时间投入 |
| P3-低 | 架构 | 设计Token体系 | 设计一致性保障 | 渐进式改造 |
| P3-低 | 测试 | Playwright E2E测试 | 核心流程保护 | 时间投入 |
| P3-低 | 流程 | GitHub Actions CI/CD | 自动化质量保障 | 配置成本 |
| P3-低 | 数据 | 虚拟滚动/无限加载 | 大数据量性能保障 | 实现复杂度 |
