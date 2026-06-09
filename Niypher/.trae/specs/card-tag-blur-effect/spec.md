# 🎨 Feature Spec: 游戏卡片底部渐进模糊效果

## 🎯 背景与动机 (Motivation)
游戏卡片下半部分（标签区域）需要添加一个从底部向上的渐进模糊效果，使标签区域底部更模糊，向上逐渐清晰。模糊效果必须无色透明，以自动适配日夜模式。最底部模糊程度为 80%~90%，不完全模糊。

## 💡 核心改动概览 (What Changes)
- 在游戏卡片标签区域添加从底部向上的渐进模糊遮罩层
- 使用 CSS `backdrop-filter` + `mask-image` 实现无色渐进模糊
- 模糊效果从卡片底部开始，向上渐进减弱
- 最底部模糊程度为 80%~90%

## 🔗 影响范围 (Impact)
- **Affected Code**:
  - 📜 src/js/modules/components.js (renderGameCard 函数)
  - 📜 src/css/styles.css (新增渐进模糊样式)

## ⚙️ 技术实现参考 (Technical Implementation)

### 卡片结构与模糊方向
```
┌─────────────────────────┐
│                         │
│      图片区域 (h-40)     │ ← 无模糊
│                         │
├─────────────────────────┤ 
│  标题                   │ ← 轻微模糊
│  ┌─────┐ ┌─────┐ ┌─────┐│
│  │标签 │ │标签 │ │标签 ││ ← 中等模糊
│  └─────┘ └─────┘ └─────┘│
└─────────────────────────┘ ← 底部 80%~90% 模糊
    ↑
  从底部开始模糊，向上渐变减弱
```

### 实现方案（无色透明模糊，底部 85% 模糊）

```css
.card-blur-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    mask-image: linear-gradient(
        to top,
        rgba(0,0,0,0.85) 0%,
        rgba(0,0,0,0.6) 20%,
        rgba(0,0,0,0.35) 40%,
        rgba(0,0,0,0.15) 60%,
        transparent 80%
    );
    -webkit-mask-image: linear-gradient(
        to top,
        rgba(0,0,0,0.85) 0%,
        rgba(0,0,0,0.6) 20%,
        rgba(0,0,0,0.35) 40%,
        rgba(0,0,0,0.15) 60%,
        transparent 80%
    );
    pointer-events: none;
    z-index: 1;
    border-radius: 0 0 16px 16px;
    background: transparent;
}
```

### 关键点说明

1. **无色模糊**: `backdrop-filter: blur(6px)` 只做模糊处理，不添加任何颜色
2. **mask-image**: 使用透明度渐变控制模糊程度
   - `rgba(0,0,0,0.85)` 表示底部 85% 模糊（不完全模糊）
   - `transparent` 表示无模糊
3. **自动适配日夜模式**: 由于不添加颜色，模糊效果会自动继承背景色，适配任何主题

### HTML 结构修改
```html
<div class="px-4 pb-4 pt-1 flex gap-2 relative overflow-hidden">
    <!-- 渐进模糊遮罩层（无色透明） -->
    <div class="card-blur-overlay"></div>
    <div class="relative z-10 flex gap-2 flex-wrap">
        ${renderTags(resource.tags)}
    </div>
</div>
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 功能验证
- [ ] 标签区域底部有模糊效果
- [ ] 模糊效果从底部向上渐进减弱
- [ ] 最底部模糊程度为 80%~90%
- [ ] 模糊效果无色透明
- [ ] 图片区域不受影响
- [ ] 标签文字仍然可读
- [ ] 浅色模式下效果正常
- [ ] 深色模式下效果正常
