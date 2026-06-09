# 🎨 Feature Spec: 取消首页游戏卡片上层的渐变模糊效果

## 🎯 背景与动机 (Motivation)
首页游戏卡片图片上方有一个白色渐变遮罩效果（从底部向上渐变），用户希望取消这个效果，让游戏封面图片完整显示。

## 💡 核心改动概览 (What Changes)
- 移除 `renderGameCard` 函数中的渐变遮罩 div 元素

## 🔗 影响范围 (Impact)
- **Affected Code**:
  - 📜 src/js/modules/components.js (第67行)

## ⚙️ 技术实现参考 (Technical Implementation)

### 当前代码
```html
<div class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
```

### 修改后
移除该 div 元素

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 功能验证
- [ ] 游戏卡片封面图片完整显示，无渐变遮罩
- [ ] 标题文字仍然清晰可见
- [ ] 深色模式下标题文字可见
