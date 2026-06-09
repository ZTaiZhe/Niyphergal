# 🎨 Feature Spec: 修复 Logo 按钮绑定失效问题（完整分析）

## 🎯 背景与动机 (Motivation)
Logo 按钮绑定失效。经过完整代码分析：

### 代码结构分析
1. **HTML**：`<button onclick="LogoMenu.toggle()">` 直接调用全局 `LogoMenu.toggle()`
2. **app.js**：
   - 定义 `LogoMenu` 对象（第346-403行）
   - 在 `initApp()` 中注册 `window.LogoMenu = LogoMenu`（第435行）
   - `initApp()` 在 `window.addEventListener('load', initApp)` 时执行（第491行）
3. **uiComponents.js**：也定义了 `LogoMenu` 对象（第336-393行）- 重复定义
4. **globals.js**：从 `uiComponents.js` 导入 `LogoMenu`，`initGlobals()` 从未被调用

### 问题根因
`load` 事件在页面所有资源（包括图片等）加载完成后才触发。在此之前：
- `initApp()` 未执行
- `window.LogoMenu` 是 `undefined`
- 用户点击 Logo 按钮会失败

## 💡 核心改动概览 (What Changes)
- 在模块顶层立即注册全局变量（ES 模块同步执行顶层代码）
- 从 `initApp()` 中移除全局变量注册

## 🔗 影响范围 (Impact)
- **Affected Code**:
  - 📜 src/js/app.js (全局变量注册位置)

## ⚙️ 技术实现参考 (Technical Implementation)

### 当前代码
```javascript
// 第491行
window.addEventListener('load', initApp);

async function initApp() {
    window.LogoMenu = LogoMenu;  // 在 load 事件后才注册
    // ...
}
```

### 解决方案
```javascript
// 模块顶层，立即执行（ES 模块同步执行顶层代码）
window.authFlowState = authFlowState;
window.LogoMenu = LogoMenu;
window.ThemeManager = ThemeManager;
window.MobileSearch = MobileSearch;
window.showNotification = showNotification;

async function initApp() {
    // 其他初始化逻辑...
}

window.addEventListener('load', initApp);
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 功能验证
- [ ] 点击 Logo 按钮能够打开菜单
- [ ] 菜单打开时有向下展开动画
- [ ] 点击菜单项能够正确导航
- [ ] 点击外部区域能够关闭菜单
- [ ] 控制台无 JavaScript 错误
