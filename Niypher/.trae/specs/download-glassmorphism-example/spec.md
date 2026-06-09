# 🎨 Feature Spec: 修复 Logo 按钮绑定失效问题

## 🎯 背景与动机 (Motivation)

Logo 按钮点击后无法打开菜单，原因是全局变量注册时拼写错误：

* `app.js` 和 `globals.js` 中注册为 `window.LogoMenu`（少了一个'g'）

* HTML 中调用的是 `onclick="LogoMenu.toggle()"`（正确的拼写）

* 导致运行时找不到 `LogoMenu` 对象，点击事件失效

## 💡 核心改动概览 (What Changes)

* 修正 `app.js` 中的全局变量注册：`window.LogoMenu` → `window.LogoMenu`

* 修正 `globals.js` 中的全局变量注册：`window.LogoMenu` → `window.LogoMenu`

## 🔗 影响范围 (Impact)

* **Affected Code**:

  * 📜 src/js/app.js (第468行)

  * 📜 src/js/modules/globals.js (第36行)

## ⚙️ 技术实现参考 (Technical Implementation)

### 问题代码

```javascript
// app.js 第468行
window.LogoMenu = LogoMenu;  // ❌ 拼写错误，少了一个'g'

// globals.js 第36行  
window.LogoMenu = LogoMenu;  // ❌ 拼写错误，少了一个'g'
```

### 解决方案

```javascript
// app.js 第468行
window.LogoMenu = LogoMenu;  // ✅ 修正拼写

// globals.js 第36行
window.LogoMenu = LogoMenu;  // ✅ 修正拼写
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 功能验证

* [ ] 点击 Logo 按钮能够打开菜单

* [ ] 菜单打开时有向下展开动画

* [ ] 点击菜单项能够正确导航

* [ ] 点击外部区域能够关闭菜单

* [ ] 控制台无 JavaScript 错误

