# 🎨 Feature Spec: 修复首页卡片重叠问题

## 🎯 背景与动机 (Motivation)
首页的游戏卡片在某些情况下会出现重叠现象，影响用户体验和视觉效果。需要排查并修复导致卡片重叠的根本原因。

## 💡 核心改动概览 (What Changes)
- 排查并修复卡片布局问题
- 确保 CSS Grid 布局正确渲染
- 检查卡片高度和定位相关样式

## 🔗 影响范围 (Impact)
- **Affected Specs**: home-card-render-fix
- **Affected Code**:
  - 📜 src/css/styles.css (`.game-cards-container` 相关样式)
  - 📜 src/js/modules/components.js (`renderGameCard` 函数)

## ⚙️ 技术实现参考 (Technical Implementation)

### 问题分析
可能的原因：
1. **CSS Grid 布局问题**：`.game-cards-container` 的 grid 配置可能存在问题
2. **卡片高度问题**：`aspect-[4/3]` 和 `min-h-[16rem]` 组合可能导致高度计算异常
3. **定位问题**：`isolation: isolate` 或 `position: relative` 可能影响布局
4. **动画状态问题**：`is-hidden` / `is-loaded` 状态切换时可能影响布局

### 当前代码分析

**卡片容器 CSS**:
```css
.game-cards-container {
    display: grid;
    gap: 1.5rem;
}
```

**卡片 HTML 结构**:
```html
<div class="glass-card relative flex flex-col overflow-hidden cursor-pointer group animate-card-in aspect-[4/3] sm:aspect-video min-h-[16rem]" 
     style="--card-delay: ${delay}ms; isolation: isolate;">
```

**卡片状态 CSS**:
```css
.game-cards-container .glass-card.is-hidden {
    opacity: 0;
    transform: translateY(20px);
}
```

### 可能的解决方案

1. **确保 grid-template-rows 正确**：
   - 检查是否需要显式设置 `grid-auto-rows`
   
2. **检查 aspect-ratio 与 min-height 冲突**：
   - `aspect-[4/3]` 设置宽高比
   - `min-h-[16rem]` 设置最小高度
   - 两者可能在小屏幕上产生冲突

3. **检查动画状态是否影响布局**：
   - `is-hidden` 状态下卡片是否仍然占据空间
   - 是否需要添加 `visibility: hidden` 或 `pointer-events: none`

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 视觉效果
- [ ] 卡片之间无重叠
- [ ] 卡片间距均匀
- [ ] 卡片高度一致
- [ ] 响应式布局正常

### 🧪 功能验证
- [ ] 页面加载时卡片正常显示
- [ ] 刷新后卡片正常显示
- [ ] 动画效果正常
- [ ] 图片加载正常
