# 🎨 Feature Spec: 首页卡片动画类冲突修复

## 🎯 背景与动机 (Motivation)
`renderGameCard` 函数返回的卡片已经包含 `animate-card-in` 类和 `--card-delay` 样式，这与首页的 `is-hidden`/`is-loaded` 动画系统产生冲突，导致动画效果不统一。

## 💡 核心改动概览 (What Changes)
- 在首页渲染时移除 `animate-card-in` 类
- 使用 `--stagger-index` 替代 `--card-delay`
- 统一动画控制逻辑

## 🔗 影响范围 (Impact)
- **Affected Specs**: home-card-animation-optimize, refresh-animation-fix
- **Affected Code**:
  - 📜 src/js/pages/home.js

## ⚙️ 技术实现参考 (Technical Implementation)

### 问题分析
`renderGameCard` 返回的 HTML：
```html
<div class="glass-card ... animate-card-in" style="--card-delay: ${delay}ms;">
```

这会导致：
1. `animate-card-in` 类有自己的动画定义
2. `--card-delay` 与 `--stagger-index` 冲突
3. 多套动画系统同时作用

### 解决方案
在 `renderHome` 和 `refreshCards` 中，替换 `animate-card-in` 类：

```javascript
// renderHome 中
const cardHtml = renderGameCard(res);
return cardHtml
    .replace('animate-card-in', '')
    .replace('class="glass-card', `class="glass-card is-hidden" style="--stagger-index: ${index}"`);

// refreshCards 中
const cardHtml = renderGameCard(res);
// ... 创建 template 后
card.classList.remove('animate-card-in');
card.classList.add('is-hidden');
card.style.setProperty('--stagger-index', index);
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 动画效果
- [ ] 首次加载页面，卡片依次从下方淡入（无闪烁）
- [ ] 点击刷新，旧卡片向上淡出
- [ ] 刷新后新卡片依次从下方淡入（无闪烁）
- [ ] 动画流畅统一
