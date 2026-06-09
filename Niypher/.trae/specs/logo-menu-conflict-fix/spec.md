# 🎨 Feature Spec: Logo 菜单动画 - 修复重复定义冲突

## 🎯 背景与动机 (Motivation)
经过全工作区检查，发现问题根源：
1. `app.js` 和 `uiComponents.js` 中都定义了 `LogoMenu`
2. `app.js` 中的版本使用了 `hidden` 类（会立即隐藏，无动画）
3. `app.js` 中的版本通过 `window.LogoMenu` 注册到全局，覆盖了正确版本

## 💡 核心改动概览 (What Changes)
- 修改 `app.js` 中的 `LogoMenu`，移除 `hidden` 类的使用
- 使用与 `uiComponents.js` 一致的逻辑

## 🔗 影响范围 (Impact)
- **Affected Code**:
  - 📜 src/js/app.js

## ⚙️ 技术实现参考 (Technical Implementation)

### 问题代码（app.js）
```javascript
if (this.isOpen) {
    menu.classList.remove('show');
    menu.classList.add('hidden');  // 这会立即隐藏！
    arrow.classList.remove('rotated');
} else {
    menu.classList.remove('hidden');
    setTimeout(() => menu.classList.add('show'), 10);
    arrow.classList.add('rotated');
}
```

### 解决方案
```javascript
if (this.isOpen) {
    menu.classList.remove('show');
    arrow.classList.remove('rotated');
} else {
    menu.classList.add('show');
    arrow.classList.add('rotated');
}
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 动画效果
- [ ] Logo 菜单打开时有向下展开动画
- [ ] Logo 菜单关闭时有向上缩回动画
- [ ] 动画流畅无闪烁
