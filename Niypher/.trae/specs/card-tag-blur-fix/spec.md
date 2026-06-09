# 🎨 Feature Spec: 游戏卡片标签区域渐进模糊效果重构 (Production Optimized)

## 🎯 1. 背景与动机 (Why)

之前的羽化模糊方案由于混合了背景色与遮罩，导致模糊效果在透明度渐变时"发虚"甚至不可见。

本次重构的目标是：
1. **图片填满整个卡片**：封面图作为底层背景贯穿全卡，提供丰富的视觉素材
2. **彻底剥离颜色与模糊**：在卡片底部标签区（Tag Section）建立一个绝对无色、纯透明的"光学毛玻璃"层
3. **渐进失焦 (Progressive Bokeh)**：利用非线性 `mask-image` 实现从底部极度模糊向上完全清晰的自然过渡
4. **层级与可读性保障**：文字保持最高清晰度，并在极端底图下依然保证基础可读性
5. **生产级鲁棒性**：响应式长宽比、多行截断、CSP 安全、无障碍访问、图片加载兜底

## 💡 2. 核心改动概览 (What Changes)

### 结构与鲁棒性优化
- **响应式长宽比**: 使用 `aspect-[4/3] sm:aspect-video min-h-[16rem]` 替代固定 `h-64`
- **多行截断**: 使用 `line-clamp-2` 替代单行 `truncate`

### 动画性能优化
- **GPU 加速**: 给 `<img>` 添加 `will-change-transform transform-gpu`，缓解滤镜重绘压力

### 安全与体验优化
- **CSP 安全**: 移除内联 `onload` JS，使用纯 CSS 配合 JS 事件代理
- **图片加载兜底**: 添加 `onerror` 处理，显示备用图片
- **无障碍访问**: 添加 `role="button" tabindex="0"` 支持键盘导航

### CSS 核心优化
- **零色纯净模糊**: `.card-tag-section::before` 仅负责 `backdrop-filter`
- **Safari 圆角溢出修复**: 引入 `isolation: isolate` 和背板隐藏技术

## 🔗 3. 影响范围 (Impact)

- **Affected Code**:
  - 📜 src/css/styles.css (重写并强化 `.card-tag-section` 样式)
  - 📜 src/js/modules/components.js (调整 `renderGameCard` 的 DOM 与 Tailwind 类)

## ⚙️ 4. 技术实现参考 (Technical Implementation)

### 4.1 生产级 CSS 样式 (src/css/styles.css)

```css
/* 1. 标签区域父容器 */
.card-tag-section {
    position: relative;
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
    isolation: isolate; 
}

/* 2. 纯净光学模糊层 (GPU 加速) */
.card-tag-section::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    
    background: transparent;
    
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    
    transform: translateZ(0);
    -webkit-backface-visibility: hidden;
    will-change: transform;

    mask-image: linear-gradient( 
        to top, 
        black 0%,
        black 35%,
        rgba(0,0,0,0.75) 55%,
        rgba(0,0,0,0.3) 75%,
        transparent 100%
    );
    -webkit-mask-image: linear-gradient( 
        to top, 
        black 0%, 
        black 35%, 
        rgba(0,0,0,0.75) 55%, 
        rgba(0,0,0,0.3) 75%, 
        transparent 100% 
    );
}

/* 3. 内容层：确保交互和文字在最上层 */
.card-tag-content {
    position: relative;
    z-index: 1;
}
```

### 4.2 优化后的 JS 模板结构 (src/js/modules/components.js)

```javascript
export function renderGameCard(resource, options = {}) {
    const { delay = 0 } = options;
    
    const fallbackImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 224'%3E%3Crect fill='%23333' width='400' height='224'/%3E%3Ctext x='50%25' y='50%25' font-size='18' text-anchor='middle' alignment-baseline='middle' font-family='sans-serif' fill='%23666'%3EImage Not Found%3C/text%3E%3C/svg%3E";

    return `
        <!-- 优化1: 移除固定 h-64，使用响应式 aspect-ratio，增加 tabindex 提升无障碍体验 -->
        <div data-action="navigate-detail" data-id="${resource.id}" 
             role="button" tabindex="0"
             class="glass-card relative flex flex-col overflow-hidden cursor-pointer group animate-card-in aspect-[4/3] sm:aspect-video min-h-[16rem]" 
             style="--card-delay: ${delay}ms; isolation: isolate;">
            
            <!-- 优化2: 移除破坏 CSP 的 onload内联JS，增加 onerror 兜底，追加 will-change-transform 缓解滤镜重绘压力 -->
            <img 
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 224'%3E%3Crect fill='%231a1a1a' width='400' height='224'/%3E%3C/svg%3E" 
                data-src="${escapeHtml(resource.cover)}" 
                alt="${escapeHtml(resource.title)}"
                loading="lazy"
                class="absolute inset-0 w-full h-full object-cover z-0 lazy-image group-hover:scale-110 transition-transform duration-500 will-change-transform transform-gpu"
                onerror="this.onerror=null; this.src='${fallbackImg}'; this.classList.remove('group-hover:scale-110');"
            >
            
            <!-- 优化3: 极其微弱的文字保护渐变，并将 truncate 替换为 line-clamp-2 -->
            <div class="relative z-10 flex-1 flex flex-col justify-end p-4 bg-gradient-to-t from-black/50 via-black/10 to-transparent">
                <h3 class="font-bold text-lg sm:text-xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-2 leading-snug">
                    ${escapeHtml(resource.title)}
                </h3>
            </div>

            <!-- 下半部：纯净渐进模糊区 -->
            <div class="card-tag-section px-4 pb-4 pt-2">
                <div class="card-tag-content flex flex-wrap gap-1.5 sm:gap-2">
                    ${renderTags(resource.tags)}
                </div>
            </div>
            
        </div>
    `;
}
```

## ✅ 5. QA 验收检查单 (Acceptance Checklist)

### 🧪 功能与边界测试

- [ ] **全卡覆盖验证**：确认 `<img>` 的尺寸与整张 `.glass-card` 完全一致
- [ ] **极限亮色图验证**：强制替换一张纯白色的封面图，确认卡片标题文字依然能够阅读
- [ ] **零杂色污染验证**：在深色系和鲜艳系的图片上，确认标签区域的模糊完全透出底图原本的色彩
- [ ] **iOS Safari 兼容验证**：确认底部两个圆角被完美裁切，没有模糊的直角方块溢出
- [ ] **动画交互验证**：鼠标 Hover 触发卡片图片放大时，底部的渐进式模糊没有闪烁或定位偏移

### 🧪 生产级边缘测试

- [ ] **长文本溢出测试**：将游戏标题修改为极长的三行文本，确认文本会在第二行末尾正确显示 `...`
- [ ] **死链图片兜底测试**：故意传入一个无效的图片 URL，确认卡片能正常显示备用的 Fallback 图片
- [ ] **响应式尺寸验证**：缩放浏览器窗口，确认卡片通过 `aspect-ratio` 能自适应维持优雅的比例
- [ ] **键盘访问测试**：通过键盘按 Tab 键，确认能够选中卡片，并且按下 Enter 键能够触发跳转
- [ ] **性能监控**：在 Chrome DevTools 开启 Frame Rendering Stats，高频 Hover 卡片，确认不会产生严重的重绘闪烁
