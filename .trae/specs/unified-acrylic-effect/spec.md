# 🎨 Feature Spec: 全局亚克力面板统一

## 🎯 背景与动机 (Motivation)
当前系统中，搜索栏已经确立了一套高质感的亚克力（毛玻璃）视觉标准。然而，页面上的其他悬浮独立组件（如 Logo 卡片、Docker 导航栏、日夜切换按钮、刷新按钮）仍在使用零散的、硬编码的背景样式。

这导致了两个严重问题：
1. **视觉割裂**：不同组件的模糊度、高光边框和投影不一致，缺乏"全站属于同一套设计系统 (Design System)"的精致感。
2. **维护地狱**：每次微调暗黑模式的透明度，都需要在多个 CSS 或 HTML 文件中逐一修改。

**目标**：将搜索栏的视觉参数抽象为全局通用的 Utility Class（工具类）`.acrylic-panel`，实现全站悬浮组件毛玻璃质感的 100% 统一，并极大降低后续维护成本。

## 💡 核心改动概览 (What Changes)
- **样式抽象 (CSS Refactoring)**：提取搜索栏的光影、模糊度 (12px)、边框与透明度参数，封装为全局复用类 `.acrylic-panel`
- **DOM 深度清洗 (DOM Cleansing)**：清理 index.html 中 Logo 卡片、Docker 栏、日夜/刷新按钮原有的背景色、阴影和毛玻璃旧类名，统一挂载新工具类
- **主题自适应 (Theme Adaptation)**：为该基础类内置完备的 Dark/Light 模式切换逻辑与 Hover 悬停光影反馈

## 🔗 影响范围 (Impact)
- **Affected Specs**: design-system-glassmorphism (全局设计资产与规范更新)
- **Affected Code**:
  - 🎨 src/css/styles.css（新增 `.acrylic-panel` 全局工具类）
  - 📄 index.html（为对应悬浮组件清理冗余样式，并注入新类名）

## 📖 核心需求场景 (BDD Scenarios)

### Requirement 1: 亚克力视觉表现一致性
系统 SHALL 保证所有全局悬浮类组件与搜索栏共享同一套光影与物理质感。

#### Scenario A: 亮色模式静止态 (Light Mode)
- **GIVEN** 用户在默认的白昼模式下浏览页面
- **WHEN** 查看 Logo、Docker 栏或各个悬浮按钮
- **THEN** 组件呈现 12px 模糊度的毛玻璃效果，背景为 85% 透明白，伴随柔和的双层投影

#### Scenario B: 暗色模式静止态 (Dark Mode)
- **GIVEN** 用户切换至夜间模式
- **WHEN** 页面重新渲染
- **THEN** 所有应用该类的组件瞬间无缝过渡为 60% 透明度的深灰底色
- **AND** 边框变为微弱的高光白线 (rgba(255, 255, 255, 0.1))，边缘轮廓清晰但不刺眼

### Requirement 2: 交互与动态反馈一致性

#### Scenario C: 悬停光影增强 (Hover State)
- **GIVEN** 悬浮组件处于静止状态
- **WHEN** 鼠标光标悬停于组件上方
- **THEN** 组件透明度降低（背景色变实），并伴随投影范围的扩散，产生"向上浮起"的 3D 视觉交互暗示

## ⚙️ 技术实现与防坑指南 (Technical Implementation)

### ⚠️ 防坑指南 1：DOM 样式覆盖陷阱 (Class Conflicts)
在给已有组件添加 `.acrylic-panel` 时，必须移除 HTML 中原本的背景和阴影类名（如 Tailwind 的 `bg-white/50`, `backdrop-blur-md`, `shadow-lg` 等），否则会引发 CSS 优先级冲突。

**HTML 改造对比示例**：
```html
<!-- ❌ 修改前：样式散落在 HTML 中，且标准不一 -->
<div class="fixed bottom-4 left-4 bg-white/70 backdrop-blur shadow-md border border-gray-200 rounded-2xl p-4">

<!-- ✅ 修改后：彻底清理背景/阴影/边框控制类，仅保留布局类，挂载 acrylic-panel -->
<div class="fixed bottom-4 left-4 rounded-2xl p-4 acrylic-panel">
```

### ⚠️ 防坑指南 2：层叠与性能控制 (Z-Index & GPU)
- **GPU 消耗**：`backdrop-filter` 是重度 GPU 渲染属性。必须确保 `.acrylic-panel` 只应用于独立悬浮层，严禁用于长列表中成百上千的普通卡片上
- **层叠上下文**：添加了 `transform` 会改变元素的 Z 轴层级。请确保 Docker 栏、悬浮按钮自身带有明确的 `z-index`

### 🌟 生产级 CSS 代码 (附带无障碍降级)
```css
/* =========================================
   Glassmorphism Utility: 全局亚克力面板
   ========================================= */
.acrylic-panel {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06),
                0 1px 2px rgba(0, 0, 0, 0.04);
    transition: background-color 0.3s ease,
                border-color 0.3s ease,
                box-shadow 0.3s ease,
                transform 0.3s ease;
}

.acrylic-panel:hover {
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08),
                0 2px 4px rgba(0, 0, 0, 0.04);
}

/* 🌙 暗黑模式适配 */
body.dark .acrylic-panel {
    background: rgba(40, 40, 40, 0.6);
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

body.dark .acrylic-panel:hover {
    background: rgba(60, 60, 60, 0.9);
    border-color: rgba(255, 255, 255, 0.15);
}

/* ♿️ 无障碍 A11y：操作系统开启"降低透明度"时的降级处理 */
@media (prefers-reduced-transparency: reduce) {
    .acrylic-panel {
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        background: rgb(248, 249, 250) !important;
    }
    body.dark .acrylic-panel {
        background: rgb(33, 37, 41) !important;
    }
}
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 视觉一致性 (Visual Consistency)
- [ ] 色差与模糊比对：Logo 卡片、Docker 栏、日夜按钮、刷新按钮与搜索栏背景白度/灰度、模糊程度完全一致
- [ ] 边框渲染：各组件边缘的 1px 边框清晰可见，未出现"双边框 (Double borders)"现象
- [ ] 圆角自适应：`.acrylic-panel` 注入后，没有破坏组件原有的形状（圆形按钮依然是完美的正圆）

### 🌓 交互与主题适配 (Interaction & Theme)
- [ ] 亮/暗秒切无残影：所有组件背景与边框同步流畅过渡，无单独掉队闪烁
- [ ] 悬停反馈 (Hover)：均能正常触发背景变实与投影扩散的效果
- [ ] 文本与图标对比度：日月图标、刷新图标在亮色和暗色模式下具有足够清晰的阅读对比度

### ♿️ 极限场景测试 (Edge Cases)
- [ ] 降低透明度降级：操作系统开启"降低透明度"后，所有亚克力组件自动降级为不透明的实心背景
