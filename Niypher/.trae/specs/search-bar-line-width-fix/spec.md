# 🎨 Feature Spec: 搜索栏动画横线宽度修正

## 🎯 背景与动机 (Motivation)
当前搜索栏输入框的底部动画横线宽度为 `100%`，覆盖了整个 `.search-input-wrapper` 的宽度。由于输入框采用药丸型设计（`border-radius: 9999px`），横线延伸到了圆角区域，视觉效果不够精确。需要将横线宽度限制在输入框的"直边"部分，不包括两端的圆角区域。

## 💡 核心改动概览 (What Changes)
- **视觉层**：调整 `.search-input-wrapper::after` 的 `left` 和 `width`，使横线只覆盖输入框的直边部分
- **计算方式**：横线从左圆角结束处开始，到右圆角开始处结束

## 🔗 影响范围 (Impact)
- **Affected Specs**: search-bar-acrylic, search-bar-pill-shape
- **Affected Code**:
  - 🎨 src/css/styles.css（`.search-input-wrapper::after` 样式）

## 📖 核心需求场景 (BDD Scenarios)

### Requirement 1: 横线宽度与输入框直边一致
系统 SHALL 将动画横线宽度限制在输入框的直边部分。

#### Scenario A: 横线位置
- **GIVEN** 搜索栏输入框采用药丸型设计
- **WHEN** 输入框获取焦点显示底部横线
- **THEN** 横线从左圆角结束处开始
- **AND** 横线到右圆角开始处结束
- **AND** 横线不延伸到圆角区域

## ⚙️ 技术实现参考 (Technical Implementation)

### CSS 样式修改

```css
/* 底部横线 - 修正宽度 */
.search-input-wrapper::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 16px;           /* 左圆角半径（输入框高度32px的一半） */
    width: calc(100% - 32px); /* 减去两端圆角（16px * 2） */
    height: 2px;
    background: #FE007F;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease-out;
    border-radius: 2px;
    pointer-events: none;
}
```

**计算说明：**
- 输入框高度：32px
- 圆角半径：16px（高度的一半，因为 border-radius: 9999px）
- 横线 left：16px（跳过左圆角）
- 横线 width：calc(100% - 32px)（减去两端圆角 16px × 2）

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 视觉效果
- [ ] 横线从左圆角结束处开始
- [ ] 横线到右圆角开始处结束
- [ ] 横线不延伸到圆角区域
- [ ] 动画效果正常（从左向右生长）
