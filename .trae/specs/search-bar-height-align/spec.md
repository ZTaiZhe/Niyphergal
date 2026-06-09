# 🎨 Feature Spec: 搜索栏 input 和按钮高度与 box 一致

## 🎯 背景与动机 (Motivation)
当前搜索栏 box 高度为 40px，但 input wrapper 和搜索按钮高度为 32px，导致垂直方向有空白。用户希望 input 和搜索按钮的高度与 box 一致（40px），使整体更加紧凑统一。

## 💡 核心改动概览 (What Changes)
- **布局层**：将 `.search-input-wrapper` 和 `#header-search-btn` 的高度从 32px 改为 40px

## 🔗 影响范围 (Impact)
- **Affected Specs**: search-bar-boundary-align
- **Affected Code**:
  - 🎨 src/css/styles.css（`.search-input-wrapper` 和 `#header-search-btn` 高度）

## 📖 核心需求场景 (BDD Scenarios)

### Requirement 1: 高度一致
系统 SHALL 使 input 和按钮高度与 box 一致。

#### Scenario A: 高度对齐
- **GIVEN** 用户浏览页面
- **WHEN** 查看搜索栏
- **THEN** input 高度与 box 高度一致（40px）
- **AND** 搜索按钮高度与 box 高度一致（40px）

## ⚙️ 技术实现参考 (Technical Implementation)

### CSS 修改

```css
/* 当前 */
.search-input-wrapper {
    height: 32px;
}

#header-search-btn {
    width: 32px;
    height: 32px;
}

/* 修改后 */
.search-input-wrapper {
    height: 40px;
}

#header-search-btn {
    width: 40px;
    height: 40px;
}
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 视觉效果
- [ ] input 高度与 box 高度一致（40px）
- [ ] 搜索按钮高度与 box 高度一致（40px）
- [ ] 整体布局紧凑统一
