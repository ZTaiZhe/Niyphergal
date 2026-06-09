# 🎨 Feature Spec: 调整日模式页面背景色

## 🎯 背景与动机 (Motivation)
用户希望将日模式（浅色模式）下的所有页面背景色从纯白色 `#ffffff` 调整为浅灰色 `#cccccc`，以获得更柔和的视觉体验。

## 💡 核心改动概览 (What Changes)
- 修改 CSS 变量 `--bg-primary` 的值：`#ffffff` → `#cccccc`
- 可能需要调整 `--bg-secondary` 以保持视觉层次

## 🔗 影响范围 (Impact)
- **Affected Code**:
  - 📜 src/css/styles.css (第10行)

## ⚙️ 技术实现参考 (Technical Implementation)

### 当前代码
```css
:root {
    /* 浅色主题变量 */
    --bg-primary: #ffffff;
    --bg-secondary: #f9fafb;
}
```

### 修改后代码
```css
:root {
    /* 浅色主题变量 */
    --bg-primary: #cccccc;
    --bg-secondary: #d9d9d9;  /* 可选：保持层次感 */
}
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 功能验证
- [ ] 日模式下页面背景色为 #cccccc
- [ ] 深色模式不受影响
- [ ] 所有页面背景色一致
- [ ] 亚克力面板效果与新背景协调
