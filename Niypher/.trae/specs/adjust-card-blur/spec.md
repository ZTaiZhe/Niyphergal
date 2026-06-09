# 🎨 Feature Spec: 卡片渐变模糊比例与日夜模式色彩重构

## 🎯 1. 背景与动机 (Why)

- **释放原画空间**：当前模糊范围过大，掩盖了过多游戏封面细节。需将模糊区域严格控制在卡片底部的 1/3 黄金比例处
- **主题沉浸感 (Theme Consistency)**：修复当前纯无色模糊在特定底图下文字不清的问题。引入日夜模式（Light/Dark Mode）响应的**"有色衬底"**，使其与页面的背景色/卡片文字颜色完美融合，同时保证底部图片**仍然可见**

## 💡 2. 核心改动概览 (What Changes)

- **纠正 CSS 渲染逻辑**：将颜色赋予 `background`，将透明度渐变赋予 `mask-image`。两者叠加产生"带颜色的渐变模糊"
- **引入主题 CSS 变量**：在 `:root` 和 `.dark` 中统一定义底色变量，实现丝滑切换
- **物理高度约束**：通过 CSS 让模糊层强制固定为卡片高度的 33.33%
- **半透明有色衬底**：颜色必须有一定透明度（如 0.3-0.5），确保底部图片仍然可见

## 🔗 3. 影响范围 (Impact)

- **Affected Code**:
  - 📜 src/css/styles.css (调整主题变量与 `.card-tag-section::before` 样式)

## ⚙️ 4. 技术实现参考 (Technical Implementation)

### 4.1 定义日夜模式颜色变量 (CSS Variables)

```css
/* 🌞 浅色模式：提供微微泛白的有色衬底（半透明，保证看到图片）*/
:root {
    --card-glass-tint: rgba(255, 255, 255, 0.35);
    --card-glass-tint-fade: rgba(255, 255, 255, 0);
}

/* 🌙 深色模式：提供微微泛黑的有色衬底（半透明，保证看到图片）*/
body.dark {
    --card-glass-tint: rgba(0, 0, 0, 0.45);
    --card-glass-tint-fade: rgba(0, 0, 0, 0);
}
```

### 4.2 重构纯净模糊层样式 (src/css/styles.css)

```css
.card-tag-section {
    position: relative;
    z-index: 1;
}

.card-tag-section::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    
    /* 核心 1：强制高度为卡片总高度的三分之一 */
    height: 90px;
    z-index: -1;
    pointer-events: none;
    
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;

    /* 核心 2：使用 background 引入日夜模式颜色（半透明，保证看到图片）*/
    background: linear-gradient(
        to top,
        var(--card-glass-tint) 0%,
        var(--card-glass-tint-fade) 100%
    );
    
    /* 基础模糊值 */
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    
    /* 硬件加速 */
    transform: translateZ(0);
    will-change: transform;

    /* 核心 3：只负责"透明度"衰减的遮罩 (纯黑白) */
    mask-image: linear-gradient(
        to top,
        black 0%,
        black 30%,
        rgba(0,0,0,0.5) 60%,
        transparent 100%
    );
    -webkit-mask-image: linear-gradient(
        to top,
        black 0%,
        black 30%,
        rgba(0,0,0,0.5) 60%,
        transparent 100%
    );
}
```

### 4.3 文字颜色注意

由于底部增加了"日夜变色"的背景衬底（半透明）：
- 深色模式下：底色是黑灰，标签文字必须是白色/浅色
- 浅色模式下：底色是白亮，标签文字必须是黑色/深色

需要在 `renderGameCard` 中确保文字使用 `text-gray-900 dark:text-white` 类似的类

## ✅ 5. QA 验收检查单 (Acceptance Checklist)

### 🧪 功能与视觉断言

- [ ] **1/3 黄金比例验证**：测量模糊区域的总高度，确认其占整个图片容器的高度大约在 33% 左右
- [ ] **图片可见性验证**：确认底部图片仍然可见（不是被完全遮挡），半透明衬底与图片叠加产生柔和效果
- [ ] **深色模式适配 (Dark Mode)**：开启深色模式，确认卡片底部呈现带微黑色的半透明毛玻璃质感，白色的标签文字清晰锐利
- [ ] **浅色模式适配 (Light Mode)**：切换至浅色模式，确认卡片底部呈现明亮（泛白）的半透明磨砂质感，且深色文本不刺眼
- [ ] **无缝缝合验证**：观察模糊层顶部与上方标题区域的衔接，确认没有任何生硬的横线或色块突变
