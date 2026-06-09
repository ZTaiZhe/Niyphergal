# 🎨 Feature Spec: 删除卡片标题区域的黑色遮罩

## 🎯 背景与动机 (Motivation)
卡片标题区域有一个从底部向上的黑色渐变遮罩（`bg-gradient-to-t from-black/50 via-black/10 to-transparent`），用户希望删除这个遮罩，让标题直接显示在图片上。

## 💡 核心改动概览 (What Changes)
- 删除标题区域容器的 `bg-gradient-to-t from-black/50 via-black/10 to-transparent` 类

## 🔗 影响范围 (Impact)
- **Affected Code**:
  - 📜 src/js/modules/components.js (renderGameCard 函数，第74行)

## ⚙️ 技术实现参考 (Technical Implementation)

### 当前代码
```html
<div class="relative z-10 flex-1 flex flex-col justify-end p-4 bg-gradient-to-t from-black/50 via-black/10 to-transparent">
```

### 修改后代码
```html
<div class="relative z-10 flex-1 flex flex-col justify-end p-4">
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 功能验证
- [ ] 标题区域无黑色渐变遮罩
- [ ] 标题文字仍然清晰可读（依靠 `drop-shadow` 效果）
