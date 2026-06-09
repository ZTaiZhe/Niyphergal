# 🎨 Feature Spec: 标签颜色统一为浅粉色背景

## 🎯 背景与动机 (Motivation)
当前标签在深色模式下使用深粉色背景，用户希望标签背景颜色在日夜模式下统一为浅粉色，文字颜色根据日夜模式优化可读性。

## 💡 核心改动概览 (What Changes)
- 标签背景统一为浅粉色 `bg-pink-50/95`（日夜模式一致）
- 文字颜色根据日夜模式优化：
  - 浅色模式：`text-pink-600`（深粉色文字，在浅粉背景上清晰）
  - 深色模式：`text-white`（白色文字，在浅粉背景上清晰）

## 🔗 影响范围 (Impact)
- **Affected Code**:
  - 📜 src/js/modules/components.js (renderTag 函数，第6行)

## ⚙️ 技术实现参考 (Technical Implementation)

### 当前代码
```javascript
default: 'text-[10px] border border-pink-500/50 text-pink-600 dark:text-pink-300 px-2 py-0.5 rounded-full bg-pink-50/95 dark:bg-pink-900/95'
```

### 修改后代码
```javascript
default: 'text-[10px] border border-pink-500/50 text-pink-600 dark:text-white px-2 py-0.5 rounded-full bg-pink-50/95'
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 功能验证
- [ ] 浅色模式下标签背景为浅粉色
- [ ] 深色模式下标签背景同样为浅粉色
- [ ] 浅色模式下标签文字为深粉色
- [ ] 深色模式下标签文字为白色
- [ ] 标签文字清晰可读
