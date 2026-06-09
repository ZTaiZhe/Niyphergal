# 🎨 Feature Spec: Logo 按钮动效彻底修复

## 🎯 背景与动机 (Motivation)

Logo 菜单动画多次修复仍未生效。经过深入分析，发现：

1. CSS 样式正确，但可能存在层叠顺序问题
2. Tailwind 类的 `position: absolute` 可能没有正确应用
3. 需要确保 z-index 和 position 在 CSS 中明确定义

## 💡 核心改动概览 (What Changes)

* 在 CSS 中明确定义 `position: absolute` 和 `z-index`

* 确保 CSS 规则在样式表中的优先级

* 可能需要使用更具体的选择器

## 🔗 影响范围 (Impact)

* **Affected Code**:

  * 📜 src/css/styles.css

  * 📜 src/js/modules/uiComponents.js

## ⚙️ 技术实现参考 (Technical Implementation)

### 解决方案 1：增强 CSS 选择器优先级

```css
/* Logo下拉菜单样式 */
div#logo-menu {
    position: absolute;
    left: 0;
    top: 100%;
    margin-top: 8px;
    z-index: 100;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-8px);
    transition: opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease;
    pointer-events: none;
}

div#logo-menu.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    pointer-events: auto;
}
```

### 解决方案 2：使用 JavaScript 强制设置样式

如果 CSS 还不行，可以在 JS 中直接操作 style 属性。

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 动画效果

* [ ] Logo 菜单打开时有向下展开动画

* [ ] Logo 菜单关闭时有向上缩回动画

* [ ] 动画流畅无闪烁

