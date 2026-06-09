# 🎨 Feature Spec: 首页刷新动画统一修复

## 🎯 背景与动机 (Motivation)
当前首页刷新后，新卡片的进入动画没有正确触发。原因是新渲染的卡片在添加 `is-hidden` 类之前已经处于默认显示状态，导致 CSS 过渡没有正确触发。

## 💡 核心改动概览 (What Changes)
- 确保新渲染的卡片初始处于隐藏状态
- 使用 `requestAnimationFrame` 双帧机制确保 CSS 过渡正确触发
- 统一首次加载和刷新后的动画效果

## 🔗 影响范围 (Impact)
- **Affected Specs**: home-card-animation-optimize
- **Affected Code**:
  - 📜 src/js/pages/home.js（refreshCards 函数）

## 📖 核心需求场景 (BDD Scenarios)

### Requirement 1: 刷新后进入动画
系统 SHALL 确保刷新后新卡片有统一的阶梯式进入动画。

#### Scenario A: 点击刷新后新卡片进入
- **GIVEN** 用户在首页
- **WHEN** 点击刷新按钮
- **THEN** 旧卡片向上淡出
- **AND** 新卡片从下方依次淡入

## ⚙️ 技术实现参考 (Technical Implementation)

### 问题分析
当前代码：
```javascript
container.innerHTML = shuffledResources.map(res => renderGameCard(res)).join('');

const newCards = container.querySelectorAll('.glass-card');
newCards.forEach((card, index) => {
    card.style.setProperty('--stagger-index', index);
    card.classList.add('is-hidden');
});
```

问题：`innerHTML` 设置后，卡片已经渲染并处于默认状态（可见），然后才添加 `is-hidden` 类。这导致浏览器可能跳过过渡动画。

### 解决方案
方案：在渲染前先设置容器为"刷新中"状态，渲染后强制重绘再触发动画

```javascript
// 1. 清空容器并设置刷新状态
container.innerHTML = '';

// 2. 创建文档片段，预先设置好卡片状态
const fragment = document.createDocumentFragment();
shuffledResources.forEach((res, index) => {
    const cardHtml = renderGameCard(res);
    const template = document.createElement('template');
    template.innerHTML = cardHtml.trim();
    const card = template.content.firstChild;
    
    card.style.setProperty('--stagger-index', index);
    card.classList.add('is-hidden');
    fragment.appendChild(card);
});

// 3. 批量插入DOM
container.appendChild(fragment);

// 4. 强制重绘后触发动画
requestAnimationFrame(() => {
    requestAnimationFrame(() => {
        const newCards = container.querySelectorAll('.glass-card');
        newCards.forEach(card => {
            card.classList.remove('is-hidden');
            card.classList.add('is-loaded');
        });
    });
});
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 动画效果
- [ ] 首次加载页面，卡片依次从下方淡入
- [ ] 点击刷新，旧卡片向上淡出
- [ ] 刷新后新卡片依次从下方淡入
- [ ] 动画流畅无闪烁
