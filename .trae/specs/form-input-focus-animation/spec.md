# 🎨 Feature Spec: 表单输入框 Focus 动画统一

## 🎯 背景与动机 (Motivation)
当前表单输入框（邮箱、密码等）使用简单的 `border-b` 底部边框样式，Focus 时仅改变边框颜色。为了与搜索栏的微交互保持一致，需要为所有表单输入框添加底部横线生长动画，提供统一的视觉反馈体验。

## 💡 核心改动概览 (What Changes)
- **视觉层**：将现有的 `border-b` 边框样式替换为与搜索栏一致的底部横线动画
- **交互层**：Focus 时底部横线从左向右生长，失焦时平滑收缩
- **结构层**：为输入框添加 `.form-input-wrapper` 包裹层，解决 `<input>` 无法使用伪元素的限制

## 🔗 影响范围 (Impact)
- **Affected Specs**: search-bar-acrylic (复用相同的动画模式)
- **Affected Code**:
  - 📄 src/js/pages/profile.js（邮箱、密码输入框添加包裹层）
  - 📄 src/js/pages/galgame.js（游戏搜索输入框添加包裹层）
  - 🎨 src/css/styles.css（新增 `.form-input-wrapper` 样式）

## 📖 核心需求场景 (BDD Scenarios)

### Requirement 1: 表单输入框 Focus 动画
系统 SHALL 为所有表单输入框提供与搜索栏一致的底部横线生长动画。

#### Scenario A: 邮箱输入框 Focus
- **GIVEN** 用户在登录/注册页面
- **WHEN** 用户点击邮箱输入框获取焦点
- **THEN** 输入框底部出现品牌粉色 (#FE007F) 横线
- **AND** 横线从左向右生长动画（300ms ease-out）

#### Scenario B: 密码输入框 Focus
- **GIVEN** 用户在登录/注册页面
- **WHEN** 用户点击密码输入框获取焦点
- **THEN** 输入框底部出现品牌粉色横线
- **AND** 横线从左向右生长动画

#### Scenario C: 失焦回退
- **GIVEN** 输入框处于焦点状态
- **WHEN** 用户点击页面其他位置使输入框失去焦点
- **THEN** 粉色横线平滑地向左侧收缩消失（300ms）

#### Scenario D: 深色模式适配
- **GIVEN** 页面处于深色模式
- **WHEN** 输入框获取焦点
- **THEN** 底部横线颜色为柔和粉 (#E19CBB)

## ⚙️ 技术实现参考 (Technical Implementation)

### 1. HTML 结构调整

```html
<!-- ❌ 变更前 -->
<input type="email" id="auth-email" class="w-full bg-transparent border-b border-gray-300 ...">

<!-- ✅ 变更后 -->
<div class="form-input-wrapper">
    <input type="email" id="auth-email" class="form-input" ...>
</div>
```

### 2. CSS 样式

```css
/* 表单输入框包裹层 */
.form-input-wrapper {
    position: relative;
    width: 100%;
}

/* 底部横线 - 初始状态 */
.form-input-wrapper::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: #FE007F;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease-out;
    pointer-events: none;
}

/* 焦点激活时横线展开 */
.form-input-wrapper:focus-within::after {
    transform: scaleX(1);
}

/* 输入框本体 */
.form-input {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 12px 0;
    outline: none;
    font-size: 14px;
    transition: border-color 0.3s ease;
}

.form-input:focus {
    border-bottom-color: transparent;
}

/* 深色模式 */
body.dark .form-input {
    border-bottom-color: rgba(255, 255, 255, 0.1);
}

body.dark .form-input-wrapper::after {
    background: #E19CBB;
}

/* A11y 降级 */
@media (prefers-reduced-motion: reduce) {
    .form-input-wrapper::after {
        transition: none !important;
    }
}
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 基础交互
- [ ] 邮箱输入框 Focus 时底部横线从左向右生长
- [ ] 密码输入框 Focus 时底部横线从左向右生长
- [ ] 游戏搜索输入框 Focus 时底部横线从左向右生长
- [ ] 失焦时横线平滑收缩消失

### 🌙 深色模式
- [ ] 深色模式下横线颜色为 #E19CBB
- [ ] 深色模式下输入框边框颜色正确

### ♿ 无障碍
- [ ] `prefers-reduced-motion` 时禁用动画
