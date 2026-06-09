# 🎨 亚克力/毛玻璃视觉质感升级 (Glassmorphism UI Refactoring) Spec

## 🎯 1. 背景与动机 (Why)

当前项目中的亚克力（半透明）面板样式较为扁平，缺乏空间深度与光泽感。参考 `example/` 文件夹中基于 uiverse.io 的高品质毛玻璃源码，我们计划对全局的亚克力面板样式进行彻底重构。

通过引入 **渐变背景**、**高光边框（白色半透明）** 和 **更深邃的阴影**，赋予 UI 真实的玻璃物理质感，从而显著提升网站的视觉表现力。

## 💡 2. 核心改动概览 (What Changes)

- **CSS 变量化**: 提取亮/暗模式的毛玻璃专属 CSS 变量，确保主题切换时完美平滑过渡
- **背景材质升级**: 使用 `linear-gradient` 对角线渐变替代单一的 `rgba` 纯色，模拟光线照射的明暗过渡
- **物理高光与阴影**:
  - 引入半透明的白色边框（模拟玻璃边缘的高光切角）
  - 增大 Box Shadow 的扩散半径和 Y 轴偏移，增强悬浮的 Z 轴空间感
- **模糊度微调**: `16px` -> `12px`，在保持文字可读性的同时透出更多背景细节
- **Safari 兼容性**: 添加 `-webkit-backdrop-filter` 支持
- **性能优化**: 添加 `will-change` 和 `transform: translateZ(0)` 开启硬件加速

## 🔗 3. 影响范围 (Impact)

- **Affected Specs**: 全局 UI 规范、深色模式 (Dark Mode) 适配
- **Affected Code**:
  - 📜 src/css/styles.css (全局样式文件)
  - 🧩 所有使用 `.acrylic-panel`、`.glass-card`、`.glass-card-pill` 的组件

## ⚙️ 4. 技术实现参考 (Technical Implementation)

### 4.1 全局 CSS 变量定义

```css
/* 🌞 亮色模式 (Light Mode) 变量 */
:root {
  --acrylic-bg: linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.6) 100%);
  --acrylic-bg-hover: linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.75) 100%);
  --acrylic-border: rgba(255, 255, 255, 0.18); /* 边缘高光 */
  --acrylic-border-hover: rgba(255, 255, 255, 0.25);
  --acrylic-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  --acrylic-shadow-hover: 0 12px 40px rgba(0, 0, 0, 0.18);
  --acrylic-blur: 12px;
}

/* 🌙 深色模式 (Dark Mode) 变量 */
body.dark {
  --acrylic-bg: linear-gradient(135deg, rgba(30, 30, 30, 0.85) 0%, rgba(20, 20, 20, 0.6) 100%);
  --acrylic-bg-hover: linear-gradient(135deg, rgba(40, 40, 40, 0.92) 0%, rgba(30, 30, 30, 0.75) 100%);
  --acrylic-border: rgba(255, 255, 255, 0.08); /* 深色下的微弱高光 */
  --acrylic-border-hover: rgba(255, 255, 255, 0.12);
  --acrylic-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  --acrylic-shadow-hover: 0 12px 40px rgba(0, 0, 0, 0.5);
}
```

### 4.2 核心工具类定义 (Utility Class)

```css
/* 💎 亚克力面板核心样式 */
.acrylic-panel {
  background: var(--acrylic-bg);
  border: 1px solid var(--acrylic-border);
  box-shadow: var(--acrylic-shadow);
  
  /* 核心模糊效果 */
  backdrop-filter: blur(var(--acrylic-blur));
  -webkit-backdrop-filter: blur(var(--acrylic-blur)); /* 必须加！Safari 兼容性 */
  
  /* 性能优化：防止复杂背景下滚动时的重绘卡顿 */
  will-change: transform, backdrop-filter;
  transform: translateZ(0); /* 开启硬件加速 */
  
  /* 过渡动画 */
  transition: background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.acrylic-panel:hover {
  background: var(--acrylic-bg-hover);
  border-color: var(--acrylic-border-hover);
  box-shadow: var(--acrylic-shadow-hover);
}
```

## ✅ 5. QA 验收检查单 (Acceptance Checklist)

### 🧪 UI 与跨平台验证

- [ ] 亮/暗模式切换：触发主题切换时，面板背景色、边框高光和阴影透明度能平滑且正确地切换
- [ ] 渐变与边框质感：检查卡片左上角是否有偏亮的白光（通过 135deg 渐变实现），并且存在半透明白色内边距描边（Border）
- [ ] 底层穿透测试：在有复杂背景图或色彩的页面上滚动时，面板背后的图像能被正确模糊（12px），且色彩透过率适中
- [ ] Safari 兼容性：使用 iOS Safari 或 Mac Safari 打开网页，确认 `backdrop-filter` 正常工作，未降级为纯色，且页面无闪烁 (Flicker) Bug
- [ ] 滚动性能：在移动端快速滚动列表时，毛玻璃渲染没有导致明显的掉帧（FPS 稳定）
- [ ] 一致性排查：NavBar、BottomNav、GameCard、SearchModal 全部统一使用了 `.acrylic-panel` 的 CSS 变量逻辑，没有遗漏的硬编码旧样式
