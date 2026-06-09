# 🎨 Feature Spec: 修复 Logo 按钮绑定失效问题（重新排查）

## 🎯 背景与动机 (Motivation)
用户报告左上角 Logo 按钮绑定失效。经过代码分析发现：
1. 存在两个独立的 `LogoMenu` 定义（`app.js` 和 `uiComponents.js`）
2. `globals.js` 中的 `initGlobals()` 从未被调用
3. 需要确认 `window.LogoMenu` 是否正确注册

## 💡 核心改动概览 (What Changes)
- 排查 Logo 按钮点击事件失效的根本原因
- 确保 `window.LogoMenu` 正确注册
- 统一 `LogoMenu` 的定义位置

## 🔗 影响范围 (Impact)
- **Affected Code**:
  - 📜 src/js/app.js (`LogoMenu` 定义和注册)
  - 📜 src/js/modules/uiComponents.js (`LogoMenu` 定义)
  - 📜 src/js/modules/globals.js (`initGlobals` 函数)

## ⚙️ 技术实现参考 (Technical Implementation)

### 当前代码结构

**app.js 第346-403行**：定义 `LogoMenu` 对象
**app.js 第468行**：`window.LogoMenu = LogoMenu`
**uiComponents.js 第336-393行**：定义另一个 `LogoMenu` 对象
**globals.js 第7行**：从 `uiComponents.js` 导入 `LogoMenu`
**globals.js 第36行**：`window.LogoMenu = LogoMenu`（但 `initGlobals()` 未被调用）

### 可能的问题
1. `app.js` 中的 `LogoMenu` 可能缺少某些依赖
2. 模块加载顺序问题
3. `window.LogoMenu` 注册时机问题

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 功能验证
- [ ] 点击 Logo 按钮能够打开菜单
- [ ] 菜单打开时有向下展开动画
- [ ] 点击菜单项能够正确导航
- [ ] 点击外部区域能够关闭菜单
- [ ] 控制台无 JavaScript 错误
