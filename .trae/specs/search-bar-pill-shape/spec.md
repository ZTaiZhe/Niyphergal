# 🎨 Feature Spec: 搜索栏药丸型样式与深色模式横线颜色修正

## 🎯 背景与动机 (Motivation)
当前搜索栏使用 `border-radius: 8px` 的圆角样式，与底部 docker 栏的全圆角药丸型样式不统一。同时，深色模式下输入框底部横线的颜色 `#E19CBB` 是主题色的发白版本，视觉效果不够协调。需要：
1. 将搜索栏改为长条药丸型（全圆角），与 docker 栏风格保持一致
2. 将深色模式下横线颜色改为暗粉色，而非发白粉色

## 💡 核心改动概览 (What Changes)
- **视觉层**：
  - 将 `#desktop-search-bar` 的 `border-radius` 从 `8px` 改为 `9999px`（全圆角药丸型）
  - 子元素圆角适配
- **深色模式修正**：
  - 将所有输入框底部横线深色模式颜色从 `#E19CBB`（发白粉）改为暗粉色

## 🔗 影响范围 (Impact)
- **Affected Specs**: search-bar-acrylic, form-input-focus-animation
- **Affected Code**:
  - 🎨 src/css/styles.css（圆角样式 + 深色模式横线颜色）

## 📖 核心需求场景 (BDD Scenarios)

### Requirement 1: 药丸型搜索栏
系统 SHALL 将搜索栏改为全圆角的药丸型样式。

#### Scenario A: 默认状态
- **GIVEN** 用户浏览页面
- **WHEN** 搜索栏处于默认状态
- **THEN** 搜索栏显示为长条药丸型（全圆角）
- **AND** 与底部 docker 栏风格一致

### Requirement 2: 深色模式横线颜色修正
系统 SHALL 将深色模式下输入框底部横线颜色改为暗粉色。

#### Scenario B: 深色模式横线颜色
- **GIVEN** 页面处于深色模式
- **WHEN** 输入框获取焦点
- **THEN** 底部横线显示为暗粉色（而非发白粉色）
- **AND** 与深色背景形成良好对比

## ⚙️ 技术实现参考 (Technical Implementation)

### 1. 搜索栏圆角修改

```css
/* 搜索栏主容器 - 药丸型 */
#desktop-search-bar {
    border-radius: 9999px;
}

/* 输入框圆角适配 */
#header-search {
    border-radius: 9999px;
}

/* 搜索按钮圆角适配 */
#header-search-btn {
    border-radius: 9999px;
}
```

### 2. 深色模式横线颜色修正

```css
/* 搜索栏横线 - 深色模式 */
body.dark .search-input-wrapper::after {
    background: #C9184A; /* 暗粉色，而非 #E19CBB 发白粉 */
}

/* 表单输入框横线 - 深色模式 */
body.dark .form-input-wrapper::after {
    background: #C9184A; /* 暗粉色 */
}
```

**颜色说明：**
- `#E19CBB`：发白粉色（当前使用，不够协调）
- `#C9184A`：暗粉色（更深的品牌粉色变体，与深色背景对比更好）

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 药丸型样式
- [ ] 搜索栏显示为长条药丸型（全圆角 border-radius: 9999px）
- [ ] 输入框圆角与整体协调
- [ ] 搜索按钮圆角与整体协调
- [ ] Focus 状态背景圆角正确
- [ ] 与底部 docker 栏风格一致

### 🌙 深色模式横线颜色
- [ ] 搜索栏横线深色模式颜色为暗粉色
- [ ] 表单输入框横线深色模式颜色为暗粉色
- [ ] 横线与深色背景对比良好
