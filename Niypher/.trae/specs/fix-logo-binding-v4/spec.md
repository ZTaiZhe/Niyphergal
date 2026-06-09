# 🎨 Feature Spec: Logo 按钮问题深度排查

## 🎯 背景与动机 (Motivation)
Logo 按钮绑定问题仍未解决。需要深度排查所有可能的原因。

## 当前代码状态

### 模块加载
- `index.html` 第102行：`<script type="module" src="src/js/app.js"></script>`
- ES 模块在 HTML 解析完成后执行

### 全局变量注册
- `app.js` 第405-409行：
```javascript
window.authFlowState = authFlowState;
window.LogoMenu = LogoMenu;
window.ThemeManager = ThemeManager;
window.MobileSearch = MobileSearch;
window.showNotification = showNotification;
```

### HTML 按钮绑定
- `index.html` 第16行：`onclick="LogoMenu.toggle()"`

## 可能的问题

### 1. 模块加载时机
ES 模块在 HTML 解析完成后才执行，但 `onclick` 是在用户点击时才执行代码，此时模块应该已加载完成。

### 2. 模块导入链问题
`LogoMenu` 使用了 `router` 和 `DB`，这些模块可能有加载问题。

### 3. CSS 隐藏问题
`#logo-menu` 默认是隐藏的（opacity: 0, visibility: hidden），可能看起来像是没有响应。

### 4. 事件冒泡问题
点击事件可能被其他元素拦截。

## 排查任务

1. 检查浏览器控制台是否有错误
2. 检查 `window.LogoMenu` 是否正确注册
3. 检查 CSS 显示逻辑
4. 检查事件是否被正确触发

## ✅ QA 验收检查单
- [ ] 浏览器控制台无 JavaScript 错误
- [ ] `window.LogoMenu` 在页面加载后存在
- [ ] 点击按钮时 `LogoMenu.toggle()` 被调用
- [ ] 菜单正确显示/隐藏
