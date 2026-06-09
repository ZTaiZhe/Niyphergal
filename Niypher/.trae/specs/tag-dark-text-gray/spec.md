# 🎨 Feature Spec: 标签文字颜色在夜间模式改为中性灰

## 🎯 背景与动机 (Motivation)
当前标签文字在夜间模式下使用白色（`dark:text-white`），在粉色亚克力背景上对比度可能过高。用户希望改为中性灰，使视觉效果更柔和。

## 💡 核心改动概览 (What Changes)
- 标签文字颜色在夜间模式下从白色改为中性灰
- 浅色模式保持粉色文字不变

## 🔗 影响范围 (Impact)
- **Affected Code**:
  - 📜 src/js/modules/components.js (renderTag 函数)

## ⚙️ 技术实现参考 (Technical Implementation)

### 当前代码
```javascript
default: 'text-[10px] border border-pink-500/50 text-pink-600 dark:text-white px-2 py-0.5 rounded-full tag-acrylic'
```

### 修改后代码
```javascript
default: 'text-[10px] border border-pink-500/50 text-pink-600 dark:text-gray-300 px-2 py-0.5 rounded-full tag-acrylic'
```

### 颜色对比
- `white`: #ffffff (纯白)
- `gray-300`: #d1d5db (中性灰)

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 功能验证
- [ ] 浅色模式下标签文字为粉色
- [ ] 夜间模式下标签文字为中性灰
- [ ] 标签文字清晰可读
