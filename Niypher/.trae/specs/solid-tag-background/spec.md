# 🎨 Feature Spec: 标签背景改为实心

## 🎯 背景与动机 (Motivation)
当前标签使用半透明背景（`bg-pink-50/50` 和 `dark:bg-pink-900/30`），用户希望改为95%透明度的实心背景，使标签更加清晰可见。

## 💡 核心改动概览 (What Changes)
- 将标签背景透明度改为95%
- 浅色模式：`bg-pink-50/50` → `bg-pink-50/95`
- 深色模式：`dark:bg-pink-900/30` → `dark:bg-pink-900/95`

## 🔗 影响范围 (Impact)
- **Affected Code**:
  - 📜 src/js/modules/components.js (renderTag 函数，第6行)

## ⚙️ 技术实现参考 (Technical Implementation)

### 当前代码
```javascript
default: 'text-[10px] border border-pink-500/50 text-pink-600 dark:text-pink-300 px-2 py-0.5 rounded-full bg-pink-50/50 dark:bg-pink-900/30'
```

### 修改后代码
```javascript
default: 'text-[10px] border border-pink-500/50 text-pink-600 dark:text-pink-300 px-2 py-0.5 rounded-full bg-pink-50/95 dark:bg-pink-900/95'
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 功能验证
- [ ] 浅色模式下标签背景为95%透明度粉色
- [ ] 深色模式下标签背景为95%透明度深粉色
- [ ] 标签文字清晰可读
