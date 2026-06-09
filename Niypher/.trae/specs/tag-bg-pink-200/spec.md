# 🎨 Feature Spec: 标签背景改为更明显的浅粉色

## 🎯 背景与动机 (Motivation)
`pink-100` (#fce7f3) 和 `pink-50/95` (#fdf2f8) 颜色非常接近，视觉上几乎没有区别。用户希望标签背景使用更明显的浅粉色。

## 💡 核心改动概览 (What Changes)
- 标签背景从 `bg-pink-100` 改为 `bg-pink-200`（更明显的浅粉色）

## 🔗 影响范围 (Impact)
- **Affected Code**:
  - 📜 src/js/modules/components.js (renderTag 函数，第6行)

## ⚙️ 技术实现参考 (Technical Implementation)

### 颜色对比
- `pink-50`: #fdf2f8 (非常浅的粉色)
- `pink-100`: #fce7f3 (浅粉色)
- `pink-200`: #fbcfe8 (更明显的浅粉色)

### 当前代码
```javascript
default: 'text-[10px] border border-pink-500/50 text-pink-600 dark:text-white px-2 py-0.5 rounded-full bg-pink-100'
```

### 修改后代码
```javascript
default: 'text-[10px] border border-pink-500/50 text-pink-600 dark:text-white px-2 py-0.5 rounded-full bg-pink-200'
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 功能验证
- [ ] 标签背景为更明显的浅粉色 (pink-200)
- [ ] 标签文字清晰可读
