# 🎨 Feature Spec: 深色模式横线颜色调暗

## 🎯 背景与动机 (Motivation)
当前深色模式下输入框底部横线的颜色 `#C9184A`（暗粉色）仍然太亮，在深色背景下过于突出。需要调整为更暗的粉色，使其与深色背景更协调。

## 💡 核心改动概览 (What Changes)
- **视觉层**：将深色模式横线颜色从 `#C9184A` 调整为更暗的粉色 `#9A1238`

## 🔗 影响范围 (Impact)
- **Affected Specs**: search-bar-pill-shape
- **Affected Code**:
  - 🎨 src/css/styles.css（`.search-input-wrapper::after` 和 `.form-input-wrapper::after` 深色模式颜色）

## 📖 核心需求场景 (BDD Scenarios)

### Requirement 1: 深色模式横线颜色调暗
系统 SHALL 将深色模式下横线颜色调整为更暗的粉色。

#### Scenario A: 深色模式横线颜色
- **GIVEN** 页面处于深色模式
- **WHEN** 输入框获取焦点
- **THEN** 底部横线显示为更暗的粉色
- **AND** 与深色背景形成柔和对比

## ⚙️ 技术实现参考 (Technical Implementation)

### 颜色对比

| 颜色 | 色值 | 亮度 | 说明 |
|------|------|------|------|
| 当前 | `#C9184A` | 较亮 | 用户反馈太亮 |
| 调整后 | `#9A1238` | 更暗 | 与深色背景更协调 |

### CSS 修改

```css
body.dark .search-input-wrapper::after {
    background: #9A1238;
}

body.dark .form-input-wrapper::after {
    background: #9A1238;
}
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🌙 深色模式
- [ ] 搜索栏横线深色模式颜色为更暗的粉色 #9A1238
- [ ] 表单输入框横线深色模式颜色为更暗的粉色 #9A1238
- [ ] 横线与深色背景对比柔和
