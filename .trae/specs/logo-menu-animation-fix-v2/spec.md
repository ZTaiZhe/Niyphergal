# 🎨 Feature Spec: Logo 菜单动画彻底修复

## 🎯 背景与动机 (Motivation)
Logo 菜单关闭动画仍未生效。经过全局检查，发现可能存在以下问题：
1. CSS 选择器优先级问题
2. `.glass-card` 类可能覆盖了部分样式
3. 需要使用 `!important` 确保样式生效

## 💡 核心改动概览 (What Changes)
- 使用 `!important` 强制覆盖样式
- 简化 CSS 结构
- 添加调试信息

## 🔗 影响范围 (Impact)
- **Affected Code**:
  - 📜 src/css/styles.css

## ⚙️ 技术实现参考 (Technical Implementation)

### 问题分析
当前 CSS 中 `#logo-menu` 使用 ID 选择器，优先级应该足够高。但可能被其他规则覆盖。

### 解决方案
使用 `!important` 确保样式生效：

```css
#logo-menu {
    z-index: 100 !important;
    transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease !important;
    visibility: hidden !important;
    opacity: 0 !important;
    transform: translateY(-8px);
    pointer-events: none;
}

#logo-menu.show {
    visibility: visible !important;
    opacity: 1 !important;
    transform: translateY(0);
    pointer-events: auto;
}
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 动画效果
- [ ] Logo 菜单打开时有向下展开动画
- [ ] Logo 菜单关闭时有向上缩回动画
- [ ] 动画流畅无闪烁
