# 🎨 Feature Spec: Logo 菜单动画修复（参考 mobile-search-overlay 模式）

## 🎯 背景与动机 (Motivation)
Logo 菜单关闭动画仍未生效。参考 `#mobile-search-overlay` 的成功实现模式，发现：
1. `#mobile-search-overlay` 没有使用 `!important`
2. `#mobile-search-overlay` 使用简单的 `opacity` + `visibility` 组合
3. `#logo-menu` 的 `!important` 可能导致样式冲突

## 💡 核心改动概览 (What Changes)
- 移除 `!important`
- 完全模仿 `#mobile-search-overlay` 的 CSS 模式
- 简化样式结构

## 🔗 影响范围 (Impact)
- **Affected Code**:
  - 📜 src/css/styles.css

## ⚙️ 技术实现参考 (Technical Implementation)

### 成功模式参考
```css
/* mobile-search-overlay - 工作正常 */
#mobile-search-overlay {
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

#mobile-search-overlay.show {
    opacity: 1;
    visibility: visible;
}
```

### 解决方案
```css
/* Logo下拉菜单样式 - 模仿成功模式 */
#logo-menu {
    opacity: 0;
    visibility: hidden;
    transform: translateY(-8px);
    transition: opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease;
    pointer-events: none;
}

#logo-menu.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    pointer-events: auto;
}
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 动画效果
- [ ] Logo 菜单打开时有向下展开动画
- [ ] Logo 菜单关闭时有向上缩回动画
- [ ] 动画流畅无闪烁
