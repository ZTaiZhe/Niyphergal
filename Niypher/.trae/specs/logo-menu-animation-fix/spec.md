# 🎨 Feature Spec: Logo 菜单关闭动画修复

## 🎯 背景与动机 (Motivation)
Logo 菜单关闭时没有缩回动画效果。虽然 HTML 中有 `transition-all duration-200` 类，但 CSS 中 `#logo-menu` 选择器没有设置 `transition` 属性，导致过渡效果不生效。

## 💡 核心改动概览 (What Changes)
- 在 CSS 中为 `#logo-menu` 添加 `transition` 属性

## 🔗 影响范围 (Impact)
- **Affected Code**:
  - 📜 src/css/styles.css

## ⚙️ 技术实现参考 (Technical Implementation)

### 问题分析
当前 CSS：
```css
#logo-menu {
    z-index: 100;
}

#logo-menu.show {
    opacity: 1;
    transform: translateY(0);
}
```

缺少 `transition` 属性，导致 `opacity` 和 `transform` 变化没有动画。

### 解决方案
添加 transition 属性：
```css
#logo-menu {
    z-index: 100;
    transition: opacity 0.2s ease, transform 0.2s ease;
}
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 动画效果
- [ ] Logo 菜单打开时有向下展开动画
- [ ] Logo 菜单关闭时有向上缩回动画
- [ ] 动画流畅无闪烁
