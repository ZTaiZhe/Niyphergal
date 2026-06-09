# 🎨 Feature Spec: Docker 栏图标垂直居中（新方案）

## 🎯 背景与动机 (Motivation)
之前尝试通过 CSS padding 和移除 h-full 来解决 Docker 栏图标太靠上的问题，但效果不理想。现在采用更简单直接的方案：在 nav 容器上添加上下内边距，让图标有更多空间居中显示。

## 💡 核心改动概览 (What Changes)
- **方案**：在 nav 容器上添加 `py-2`（上下 padding 8px），让图标有更多空间
- **移除**：移除之前添加的 `.nav-item { padding: 6px 0; }` CSS 样式

## 🔗 影响范围 (Impact)
- **Affected Specs**: docker-nav-icon-centering
- **Affected Code**:
  - 📄 index.html（nav 添加 py-2 类）
  - 🎨 src/css/styles.css（移除 .nav-item padding 样式）

## 📖 核心需求场景 (BDD Scenarios)

### Requirement 1: 图标垂直居中
系统 SHALL 将 Docker 栏图标垂直居中显示。

#### Scenario A: 默认状态
- **GIVEN** 用户浏览页面
- **WHEN** 查看 Docker 栏
- **THEN** 四个导航图标垂直居中显示
- **AND** 图标不会超出 Docker 栏卡片边界

## ⚙️ 技术实现参考 (Technical Implementation)

### HTML 修改

```html
<!-- 当前 -->
<nav class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 glass-card rounded-full flex justify-around items-center h-16 px-6 max-w-md w-full">

<!-- 修改后：添加 py-2 -->
<nav class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 glass-card rounded-full flex justify-around items-center h-16 px-6 py-2 max-w-md w-full">
```

### CSS 修改

```css
/* 移除之前的样式 */
/* .nav-item {
    padding: 6px 0;
} */
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 视觉效果
- [ ] Docker 栏图标垂直居中显示
- [ ] 图标不会超出 Docker 栏卡片上边界
- [ ] 四个导航项对齐一致
