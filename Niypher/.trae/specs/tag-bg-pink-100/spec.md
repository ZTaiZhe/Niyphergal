# 🎨 Feature Spec: 标签背景改为统一的浅粉色

## 🎯 背景与动机 (Motivation)
当前标签使用 `bg-pink-50/95`（非常浅的粉色），用户希望改为更明显的浅粉色，类似于页面主题粉色（如 `pink-100`）。

## 💡 核心改动概览 (What Changes)
- 标签背景从 `bg-pink-50/95` 改为 `bg-pink-100`（更明显的浅粉色）
- 日夜模式统一使用相同的浅粉色背景

## 🔗 影响范围 (Impact)
- **Affected Code**:
  - 📜 src/js/modules/components.js (renderTag 函数，第6行)

## ⚙️ 技术实现参考 (Technical Implementation)

### 当前代码
```javascript
default: 'text-[10px] border border-pink-500/50 text-pink-600 dark:text-white px-2 py-0.5 rounded-full bg-pink-50/95'
```

### 修改后代码
```javascript
default: 'text-[10px] border border-pink-500/50 text-pink-600 dark:text-white px-2 py-0.5 rounded-full bg-pink-100'
```

### 颜色对比
- `pink-50`: #fdf2f8 (非常浅的粉色)
- `pink-100`: #fce7f3 (更明显的浅粉色)

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 功能验证
- [ ] 标签背景为更明显的浅粉色 (pink-100)
- [ ] 浅色模式下标签文字为深粉色
- [ ] 深色模式下标签文字为白色
- [ ] 标签文字清晰可读
