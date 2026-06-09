# 为 Docker 栏按钮添加水波纹效果

## 问题分析

### 当前状态
- 只有 `.order-toggle-btn`（正倒序按钮）有波纹效果
- 波纹效果使用 CSS `::before` 伪元素实现，从按钮中心扩散
- docker 栏的 `.nav-item` 按钮没有波纹效果

### 技术限制
- CSS `::before` 伪元素无法获取点击位置，只能从固定位置（如中心）扩散
- 要实现"以点击位置为中心"的水波纹，需要 JS 动态创建波纹元素

## 解决方案

### 方案：CSS + JS 混合实现

**CSS 部分**：
- 为 `.nav-item` 添加 `position: relative; overflow: hidden`
- 创建 `.ripple` 类定义波纹样式（圆形、半透明、从中心扩散）
- 使用 `@keyframes rippleAnimation` 定义扩散动画

**JS 部分**：
- 监听 `.nav-item` 的 `click` 事件
- 计算点击位置相对于按钮的坐标
- 动态创建 `.ripple` 元素，设置位置和尺寸
- 动画结束后移除元素

## 实现计划

### Task 1: 添加水波纹 CSS 样式
- 为 `.nav-item` 添加 `overflow: hidden`
- 创建 `.ripple` 类（绝对定位、圆形、半透明白色）
- 创建 `@keyframes rippleAnimation`（scale 0→4, opacity 1→0）
- 添加深色模式适配
- 添加 `@media (prefers-reduced-motion: reduce)` 支持

### Task 2: 添加水波纹 JS 逻辑
- 在 `navigation.js` 或新建 `ripple.js` 中添加水波纹创建函数
- 使用事件委托监听 `.nav-item` 点击
- 计算点击坐标，动态创建波纹元素
- 动画结束后移除元素

### Task 3: 验证效果
- 验证点击位置为波纹中心
- 验证波纹扩散和淡出动画
- 验证深色模式适配
- 验证无障碍回退

## 代码示例

### CSS
```css
.nav-item {
    position: relative;
    overflow: hidden;
}

.nav-item .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(254, 0, 127, 0.3);
    transform: scale(0);
    animation: rippleAnimation 0.6s ease-out;
    pointer-events: none;
}

@keyframes rippleAnimation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
```

### JS
```javascript
function createRipple(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    button.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
}

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', createRipple);
});
```

## 影响范围
- `src/css/styles.css` - 新增水波纹 CSS
- `src/js/modules/navigation.js` - 新增水波纹 JS 逻辑
