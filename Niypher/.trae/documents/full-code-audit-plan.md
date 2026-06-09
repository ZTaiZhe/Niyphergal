# 全项目逐行代码审查计划

## 审查范围
**全部核心源码文件**（`src/` 目录下所有 `.js`、`.css`、`index.html`），不包括 `node_modules/`、`dist/`、`.trae/`。

## 审查策略

由于代码量巨大（45 个 JS 模块 + 4000+ 行 CSS + HTML），采用**分批次逐文件审查**策略：

### 阶段 1：入口与关键管线（必查）
按调用链逐文件审查，确保初始化流程完整无误：

1. `index.html` — HTML 结构完整性、属性闭合、CSS 类引用正确性
2. `src/js/app.js` — 入口初始化顺序、模块导入、错误处理
3. `src/js/modules/renderer.js` — 渲染管线（动画切换、injectSection、页面保活）
4. `src/js/modules/router.js` — 路由跳转逻辑
5. `src/js/modules/eventDelegation.js` — 事件委托与 Hero 过渡集成
6. `src/js/modules/navigation.js` — 导航双图标切换逻辑

### 阶段 2：新创建模块（R5.1/R8/R7 相关）
7. `src/js/modules/animationHelpers.js` — 语法正确性、Promise 链、事件监听
8. `src/js/modules/deviceDetector.js` — 初始化逻辑、挂载时序
9. `src/js/modules/navigation.js` — 含新增 HTML 结构一致性问题

### 阶段 3：页面渲染模块
10. `src/js/pages/home.js` — 首页渲染、推荐行、FLIP 刷新
11. `src/js/pages/detail.js` — 详情页五层、16:9 主图
12. `src/js/pages/search.js` — 搜索页渲染
13. `src/js/pages/profile.js` — 个人中心页
14. `src/js/pages/category.js` — 分类页

### 阶段 4：网络与安全模块
15. `src/js/modules/xpathScraper.js` — XPath 抓取
16. `src/js/modules/preloadEngine.js` — 预加载引擎
17. `src/js/modules/chunkDownloader.js` — 分片下载器
18. `src/js/modules/recommendation.js` — 推荐引擎
19. `src/js/modules/securitySandbox.js` — 安全沙箱
20. `src/js/modules/antiTamper.js` — 防篡改
21. `src/js/modules/securityTrustedTypes.js` — Trusted Types

### 阶段 5：数据与工具模块
22. `src/js/modules/data.js` — 数据定义与 DB
23. `src/js/modules/store.js` — 状态管理
24. `src/js/modules/config.js` — 全局配置
25. `src/js/modules/utils.js` — 工具函数
26. `src/js/modules/components.js` — 共享组件渲染

### 阶段 6：UI 与交互模块
27. `src/js/modules/theme.js` — 主题切换
28. `src/js/modules/auth.js` + `authForm.js` — 认证
29. `src/js/modules/errorHandler.js` — 错误处理
30. `src/js/modules/telemetry.js` — 遥测
31. `src/js/modules/ripple.js` — 波纹效果
32. `src/js/modules/form.js` — 表单键盘处理
33. `src/js/modules/uiComponents.js` — UI 组件
34. `src/js/modules/mediaLoader.js` — 媒体加载
35. `src/js/modules/searchIndex.js` — 搜索索引
36. `src/js/modules/searchOrchestrator.js` — 搜索编排
37. `src/js/modules/search.js` — 搜索建议

### 阶段 7：样式与构建配置
38. `src/css/styles.css` — 检查 CSS 变量引用、选择器闭合、媒体查询语法
39. `tailwind.config.js` — Tailwind 配置
40. `vite.config.js` — Vite 构建配置

### 阶段 8：交叉验证
41. 检查所有 import 路径是否存在对应文件
42. 检查函数调用与定义的一致性（参数数量、返回值使用）
43. 检查 DOM 选择器与 HTML 结构的匹配性
44. 检查异步函数的 await/then 使用是否正确

## 审查维度

每行代码检查：
| 维度 | 检查内容 |
|------|----------|
| 语法 | 括号匹配、引号配对、分号遗漏、模板字符串闭合、数组/对象字面量逗号 |
| 逻辑 | 死代码、未定义变量引用、空指针风险、类型错误、条件永远为真/假 |
| 导入 | import 路径是否存在、导出是否被正确导入 |
| DOM | querySelector/ID 引用是否匹配 HTML 中的真实元素 |
| 异步 | Promise 是否正确处理 reject、await 是否遗漏 |
| CSS | 变量是否定义、选择器是否嵌套错误 |

## 输出物

审查完成后输出：
1. 发现的所有问题列表（含文件:行号和建议修复）
2. 按严重程度排序（Critical / Major / Minor）
