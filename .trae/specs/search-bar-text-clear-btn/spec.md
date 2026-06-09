# 🎨 Feature Spec: 搜索栏文本颜色与清除按钮优化

## 🎯 背景与动机 (Motivation)
当前深色模式下搜索栏失焦时，输入框内文本颜色没有专门设置，可能导致可读性问题。同时，清除搜索栏文本的"X"按钮（浏览器默认的 search 输入框清除按钮）需要优化位置、颜色和样式，使其在日间和夜间模式下都美观协调。

## 💡 核心改动概览 (What Changes)
- **深色模式文本颜色**：为深色模式下失焦状态的搜索栏添加暗灰色文本颜色
- **清除按钮优化**：优化 `input[type="search"]` 的 `::-webkit-search-cancel-button` 伪元素样式

## 🔗 影响范围 (Impact)
- **Affected Specs**: search-bar-acrylic, search-bar-pill-shape
- **Affected Code**:
  - 🎨 src/css/styles.css（`#header-search` 和清除按钮样式）

## 📖 核心需求场景 (BDD Scenarios)

### Requirement 1: 深色模式搜索栏文本颜色
系统 SHALL 为深色模式下失焦状态的搜索栏设置暗灰色文本颜色。

#### Scenario A: 深色模式失焦状态
- **GIVEN** 页面处于深色模式
- **WHEN** 搜索栏处于失焦状态
- **THEN** 输入框内文本显示为暗灰色
- **AND** 文本与深色背景形成良好对比

### Requirement 2: 清除按钮样式优化
系统 SHALL 优化搜索栏清除按钮的位置、颜色和样式。

#### Scenario A: 日间模式清除按钮
- **GIVEN** 页面处于日间模式
- **WHEN** 搜索栏有内容
- **THEN** 清除按钮显示为合适的颜色和位置

#### Scenario B: 深色模式清除按钮
- **GIVEN** 页面处于深色模式
- **WHEN** 搜索栏有内容
- **THEN** 清除按钮显示为合适的颜色和位置

## ⚙️ 技术实现参考 (Technical Implementation)

### CSS 修改

```css
/* 深色模式搜索栏失焦文本颜色 */
body.dark #header-search {
    color: #9ca3af;  /* 暗灰色 */
}

body.dark #header-search::placeholder {
    color: #6b7280;  /* placeholder 更暗 */
}

/* 清除按钮样式 - 日间模式 */
#header-search::-webkit-search-cancel-button {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    margin-right: 8px;
    cursor: pointer;
    background: url("data:image/svg+xml,...") center/contain no-repeat;
    opacity: 0.5;
    transition: opacity 0.2s ease;
}

#header-search::-webkit-search-cancel-button:hover {
    opacity: 0.8;
}

/* 清除按钮样式 - 深色模式 */
body.dark #header-search::-webkit-search-cancel-button {
    opacity: 0.6;
}

body.dark #header-search::-webkit-search-cancel-button:hover {
    opacity: 1;
}
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🌙 深色模式文本颜色
- [ ] 深色模式下搜索栏失焦时文本为暗灰色
- [ ] placeholder 颜色与文本颜色协调

### 🔘 清除按钮优化
- [ ] 日间模式清除按钮位置合适
- [ ] 日间模式清除按钮颜色协调
- [ ] 深色模式清除按钮位置合适
- [ ] 深色模式清除按钮颜色协调
