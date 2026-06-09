# 🎨 Feature Spec: 首页卡片渲染修复

## 🎯 背景与动机 (Motivation)
`renderHome` 中的字符串替换逻辑破坏了 HTML 结构，导致：
1. `overflow-hidden` 等类被断开，卡片圆角丢失
2. 刷新后图片懒加载未被触发

## 💡 核心改动概览 (What Changes)
- 修复字符串替换逻辑，正确插入类和样式
- 刷新后重新触发懒加载观察器

## 🔗 影响范围 (Impact)
- **Affected Specs**: card-animation-class-fix
- **Affected Code**:
  - 📜 src/js/pages/home.js

## ⚙️ 技术实现参考 (Technical Implementation)

### 问题分析
当前替换逻辑：
```javascript
.replace('class="glass-card', `class="glass-card is-hidden" style="--stagger-index: ${index}"`)
```

这会把：
```html
class="glass-card overflow-hidden btn-active ..."
```
变成：
```html
class="glass-card is-hidden" style="--stagger-index: 0" overflow-hidden btn-active ..."
```
`overflow-hidden` 等类被断开变成无效属性！

### 解决方案
使用正则表达式正确匹配并替换：

```javascript
// 方案：在 class 属性末尾添加类，在元素上添加 style
const cardHtml = renderGameCard(res);
return cardHtml
    .replace('animate-card-in', '')
    .replace(/style="--card-delay: \d+ms;"/, '')
    .replace(/class="glass-card([^"]*)"/, `class="glass-card$1 is-hidden"`)
    .replace(/class="glass-card([^"]*) is-hidden"/, `class="glass-card$1 is-hidden" style="--stagger-index: ${index}"`);
```

或者更简洁的方案：直接在 class 属性后添加 style：

```javascript
const cardHtml = renderGameCard(res);
return cardHtml
    .replace('animate-card-in ', '')
    .replace(/style="--card-delay: \d+ms;"/, `style="--stagger-index: ${index}"`)
    .replace('class="glass-card', 'class="glass-card is-hidden');
```

### 图片懒加载问题
刷新后需要重新调用 `observeExistingMedia()` 来触发懒加载。

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 视觉效果
- [ ] 卡片上方圆角正常显示
- [ ] 刷新后图片正常加载
- [ ] 动画效果正常
