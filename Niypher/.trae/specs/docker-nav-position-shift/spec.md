# 🎨 Feature Spec: Docker 栏卡片位置上移

## 🎯 背景与动机 (Motivation)
之前尝试通过 CSS padding 和移除 h-full 来解决 Docker 栏图标太靠上的问题，但效果不理想。现在采用更直接的方案：将整个 Docker 栏卡片上移 5px，让图标有更多空间居中显示。

## 💡 核心改动概览 (What Changes)
- **位置层**：将 Docker 栏卡片的 `bottom-4` (16px) 改为 `bottom-5` (20px)，实际上移 4px
- **或**：通过 CSS `transform: translateY(-5px)` 上移 5px

## 🔗 影响范围 (Impact)
- **Affected Specs**: docker-nav-icon-centering
- **Affected Code**:
  - 📄 index.html（修改 nav 的 bottom 类）
  - 或 🎨 src/css/styles.css（添加 transform）

## 📖 核心需求场景 (BDD Scenarios)

### Requirement 1: Docker 栏卡片上移
系统 SHALL 将 Docker 栏卡片上移 5px。

#### Scenario A: 默认状态
- **GIVEN** 用户浏览页面
- **WHEN** 查看 Docker 栏
- **THEN** Docker 栏卡片位置上移 5px
- **AND** 图标有更多空间居中显示

## ⚙️ 技术实现参考 (Technical Implementation)

### 方案 A：修改 Tailwind 类

```html
<!-- 当前 -->
<nav class="fixed bottom-4 ...">

<!-- 修改后 -->
<nav class="fixed bottom-5 ...">
```

### 方案 B：CSS transform

```css
nav.fixed.bottom-4.left-1\/2.transform.-translate-x-1\/2 {
    transform: translateX(-50%) translateY(-5px);
}
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 视觉效果
- [ ] Docker 栏卡片上移 5px
- [ ] 图标有更多空间居中显示
- [ ] 不影响安全区适配
