# 🎨 Feature Spec: 修复 CSS 多行属性值语法警告

## 🎯 背景与动机 (Motivation)
VS Code CSS linter 报告了多个语法错误，这些错误是由于使用了多行 CSS 属性值语法。虽然这种语法在浏览器中是有效的，但为了更好的工具兼容性，需要将多行属性值合并为单行。

## 💡 核心改动概览 (What Changes)
- 将 `.is-leaving` 和 `.is-entering` 类中的多行 `transition` 属性合并为单行

## 🔗 影响范围 (Impact)
- **Affected Code**:
  - 📜 src/css/styles.css (第 3114-3134 行)

## ⚙️ 技术实现参考 (Technical Implementation)

### 当前代码
```css
.is-leaving {
    transition: 
        opacity var(--refresh-duration) var(--refresh-easing) !important,
        transform var(--refresh-duration) var(--refresh-easing) !important;
}
```

### 修改后代码
```css
.is-leaving {
    transition: opacity var(--refresh-duration) var(--refresh-easing) !important, transform var(--refresh-duration) var(--refresh-easing) !important;
}
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 功能验证
- [ ] CSS linter 无语法错误报告
- [ ] 卡片动画效果正常
