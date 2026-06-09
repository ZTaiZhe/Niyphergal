# 🎨 Feature Spec: Docker 栏图标垂直居中修正（修复 h-full 冲突）

## 🎯 背景与动机 (Motivation)
之前添加的 `.nav-item { padding: 6px 0; }` 样式没有生效，因为 HTML 中 `.nav-item` 有 `h-full` 类，导致 padding 被忽略或产生冲突。需要移除 `h-full` 类，让 CSS 的 padding 生效。

## 💡 核心改动概览 (What Changes)
- **HTML 层**：移除 `.nav-item` 按钮的 `h-full` 类
- **原因**：`h-full` 设置 `height: 100%`，与 padding 冲突

## 🔗 影响范围 (Impact)
- **Affected Specs**: docker-nav-icon-centering
- **Affected Code**:
  - 📄 index.html（移除 `.nav-item` 的 `h-full` 类）

## 📖 核心需求场景 (BDD Scenarios)

### Requirement 1: 图标垂直居中
系统 SHALL 将 Docker 栏图标垂直居中显示。

#### Scenario A: 默认状态
- **GIVEN** 用户浏览页面
- **WHEN** 查看 Docker 栏
- **THEN** 四个导航图标垂直居中显示
- **AND** 图标不会超出 Docker 栏卡片边界

## ⚙️ 技术实现参考 (Technical Implementation)

### 问题分析

```html
<!-- 当前：h-full 与 padding 冲突 -->
<button class="nav-item h-full ...">

<!-- 修复后：移除 h-full -->
<button class="nav-item ...">
```

### CSS 样式（已存在）

```css
.nav-item {
    padding: 6px 0;
}
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 视觉效果
- [ ] Docker 栏图标垂直居中显示
- [ ] 图标不会超出 Docker 栏卡片上边界
- [ ] 四个导航项对齐一致
