# 🎨 Feature Spec: 标签背景使用品牌色

## 🎯 背景与动机 (Motivation)
项目定义了品牌色变量 `--accent-color: #ec4897`（玫瑰红）和 `--accent-light: rgba(236, 72, 153, 0.1)`（浅粉色）。标签应该使用品牌色以保持视觉一致性。

## 💡 核心改动概览 (What Changes)
- 标签背景从 `bg-pink-100` 改为 `bg-[var(--accent-light)]`
- 日夜模式统一使用相同的浅粉色背景

## 🔗 影响范围 (Impact)
- **Affected Code**:
  - 📜 src/js/modules/components.js (renderTag 函数，第6行)

## ⚙️ 技术实现参考 (Technical Implementation)

### 当前代码
```javascript
default: 'text-[10px] border border-pink-500/50 text-pink-600 dark:text-white px-2 py-0.5 rounded-full bg-pink-100'
```

### 修改后代码
```javascript
default: 'text-[10px] border border-pink-500/50 text-pink-600 dark:text-white px-2 py-0.5 rounded-full bg-[color:var(--accent-light)]'
```

### 品牌色定义
```css
:root {
    --accent-color: #ec4897;      /* 緋瑰红 */
    --accent-light: rgba(236, 72, 153, 0.1); /* 浅粉色 */
}
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 功能验证
- [ ] 标签背景使用品牌色 `--accent-light`
- [ ] 标签文字清晰可读
- [ ] 日夜模式统一使用相同的浅粉色背景
