# 🎨 Feature Spec: 搜索栏与表单横线失焦动画方向修正

## 🎯 背景与动机 (Motivation)
当前搜索栏输入框的底部横线失焦动画方向已修正为向右收缩，但表单输入框（`.form-input-wrapper`）的横线仍然使用旧的 `transform-origin: left`，导致失焦时向左收缩。需要统一两者的动画方向。

## 💡 核心改动概览 (What Changes)
- **搜索栏**：已修正（`transform-origin: right` 初始，`:focus-within` 时 `left`）
- **表单输入框**：需要修正，应用相同的动画方向逻辑

## 🔗 影响范围 (Impact)
- **Affected Specs**: search-bar-blur-direction-fix, form-input-focus-animation
- **Affected Code**:
  - 🎨 src/css/styles.css（`.form-input-wrapper::after` 动画样式）

## 📖 核心需求场景 (BDD Scenarios)

### Requirement 1: 统一失焦动画方向
系统 SHALL 将所有输入框的横线失焦动画方向统一为向右收缩。

#### Scenario A: 搜索栏横线（已实现）
- **GIVEN** 搜索栏输入框处于焦点状态
- **WHEN** 用户点击其他位置使输入框失去焦点
- **THEN** 横线向右收缩（从左边开始消失）

#### Scenario B: 表单输入框横线（待修正）
- **GIVEN** 表单输入框（邮箱、密码等）处于焦点状态
- **WHEN** 用户点击其他位置使输入框失去焦点
- **THEN** 横线向右收缩（从左边开始消失）

## ⚙️ 技术实现参考 (Technical Implementation)

### CSS 样式修改

```css
/* 表单输入框横线 - 初始状态 */
.form-input-wrapper::after {
    /* ... 其他样式 ... */
    transform: scaleX(0);
    transform-origin: right;  /* 改为 right */
    transition: transform 0.3s ease-out;
}

/* 焦点激活时横线展开 */
.form-input-wrapper:focus-within::after {
    transform: scaleX(1);
    transform-origin: left;   /* 添加此行 */
}
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 动画效果
- [ ] 搜索栏 Focus 时横线从左向右展开
- [ ] 搜索栏失焦时横线向右收缩
- [ ] 表单输入框 Focus 时横线从左向右展开
- [ ] 表单输入框失焦时横线向右收缩
