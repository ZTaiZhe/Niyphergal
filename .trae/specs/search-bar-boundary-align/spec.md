# 🎨 Feature Spec: 搜索栏 input 和按钮边界对齐

## 🎯 背景与动机 (Motivation)
当前搜索栏的 input 和搜索按钮与 box 边界有 6px 的间距（`padding: 0 6px`）。用户希望 input 左圆角边界与 box 左边界重合，搜索按钮右边界与 box 右边界相切，使整体更加紧凑。

## 💡 核心改动概览 (What Changes)
- **布局层**：移除 `#desktop-search-bar` 的左右 padding，使 input 和按钮与 box 边界对齐
- **调整**：`padding: 0 6px` → `padding: 0`

## 🔗 影响范围 (Impact)
- **Affected Specs**: search-bar-pill-shape
- **Affected Code**:
  - 🎨 src/css/styles.css（`#desktop-search-bar` padding 样式）

## 📖 核心需求场景 (BDD Scenarios)

### Requirement 1: 边界对齐
系统 SHALL 使 input 和按钮与 box 边界对齐。

#### Scenario A: input 左边界对齐
- **GIVEN** 用户浏览页面
- **WHEN** 查看搜索栏
- **THEN** input 左圆角边界与 box 左边界重合

#### Scenario B: 按钮右边界对齐
- **GIVEN** 用户浏览页面
- **WHEN** 查看搜索栏
- **THEN** 搜索按钮右边界与 box 右边界相切

## ⚙️ 技术实现参考 (Technical Implementation)

### CSS 修改

```css
/* 当前 */
#desktop-search-bar {
    padding: 0 6px;
}

/* 修改后 */
#desktop-search-bar {
    padding: 0;
}
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 视觉效果
- [ ] input 左圆角边界与 box 左边界重合
- [ ] 搜索按钮右边界与 box 右边界相切
- [ ] 整体布局紧凑美观
