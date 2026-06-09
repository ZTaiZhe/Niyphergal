# 🎨 Feature Spec: 标签背景使用亚克力质感

## 🎯 背景与动机 (Motivation)
当前标签背景使用简单的颜色，用户希望标签背景使用与卡片统一的亚克力质感（`acrylic-panel`），并设置50%不透明度，使标签与整体设计风格一致。

## 💡 核心改动概览 (What Changes)
- 标签背景使用亚克力质感（`backdrop-filter: blur`）
- 背景不透明度为50%
- 日夜模式适配

## 🔗 影响范围 (Impact)
- **Affected Code**:
  - 📜 src/js/modules/components.js (renderTag 函数)
  - 📜 src/css/styles.css (新增 `.tag-acrylic` 样式类)

## ⚙️ 技术实现参考 (Technical Implementation)

### CSS 样式
```css
.tag-acrylic {
    background: rgba(236, 72, 153, 0.5);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
}

body.dark .tag-acrylic {
    background: rgba(236, 72, 153, 0.5);
}
```

### HTML 修改
```javascript
default: 'text-[10px] border border-pink-500/50 text-pink-600 dark:text-white px-2 py-0.5 rounded-full tag-acrylic'
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 功能验证
- [ ] 标签背景使用亚克力质感（模糊效果）
- [ ] 标签背景不透明度为50%
- [ ] 标签文字清晰可读
- [ ] 日夜模式适配正常
