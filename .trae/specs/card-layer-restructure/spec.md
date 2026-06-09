# 🎨 Feature Spec: 调整卡片层级结构

## 🎯 背景与动机 (Motivation)
当前标签区域有独立的模糊遮罩层，但用户希望标签和标题在同一层，模糊遮罩在标题下一层，形成更统一的视觉效果。

## 💡 核心改动概览 (What Changes)
- 标签和标题合并到同一层（z-10）
- 模糊遮罩独立为一层（z-1），覆盖底部 33% 区域
- 移除 `.card-tag-section` 的模糊遮罩

## 🔗 影响范围 (Impact)
- **Affected Code**:
  - 📜 src/js/modules/components.js (renderGameCard 函数)
  - 📜 src/css/styles.css (`.card-tag-section` 样式)

## ⚙️ 技术实现参考 (Technical Implementation)

### 当前层级结构
```
┌─────────────────────────┐
│      图片 (z-0)          │
├─────────────────────────┤
│   标题区域 (z-10)        │
├─────────────────────────┤
│ 标签区域 + 模糊遮罩      │
└─────────────────────────┘
```

### 目标层级结构
```
┌─────────────────────────┐
│      图片 (z-0)          │
├─────────────────────────┤
│   模糊遮罩 (z-1)         │ ← 底部 33%
├─────────────────────────┤
│ 标题 + 标签 (z-10)       │ ← 同一层
└─────────────────────────┘
```

### HTML 结构修改
```html
<div class="glass-card relative ...">
    <!-- 图片层 (z-0) -->
    <img class="absolute inset-0 ... z-0" ...>
    
    <!-- 模糊遮罩层 (z-1) - 底部 33% -->
    <div class="card-blur-overlay"></div>
    
    <!-- 内容层 (z-10) - 标题和标签 -->
    <div class="relative z-10 flex flex-col h-full">
        <div class="flex-1 flex flex-col justify-end p-4">
            <h3>标题</h3>
        </div>
        <div class="px-4 pb-4 pt-2">
            标签
        </div>
    </div>
</div>
```

### CSS 样式修改
```css
.card-blur-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 33.33%;
    z-index: 1;
    pointer-events: none;
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
    background: linear-gradient(to top, var(--card-glass-tint) 0%, var(--card-glass-tint-fade) 100%);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transform: translateZ(0);
    will-change: transform;
    mask-image: linear-gradient(to top, black 0%, black 30%, rgba(0,0,0,0.5) 60%, transparent 100%);
    -webkit-mask-image: linear-gradient(to top, black 0%, black 30%, rgba(0,0,0,0.5) 60%, transparent 100%);
}

.card-tag-section {
    /* 移除模糊遮罩相关样式 */
    position: relative;
}
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 功能验证
- [ ] 标签和标题在同一层（z-10）
- [ ] 模糊遮罩在标题下一层（z-1）
- [ ] 模糊遮罩覆盖底部 33% 区域
- [ ] 标签文字清晰可读
