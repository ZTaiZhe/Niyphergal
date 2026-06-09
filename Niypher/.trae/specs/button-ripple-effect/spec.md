# 按钮水波纹效果 Spec

## Why
当前按钮点击反馈仅有简单的缩放动画，缺乏视觉层次感和交互沉浸感。Material Design 风格的水波纹效果能够提供更直观的点击反馈，增强用户交互体验。

## What Changes
- 为所有交互按钮添加以点击位置为中心的水波纹扩散动画
- 水波纹从点击坐标向外扩散，逐渐淡出
- 支持所有按钮类型（排序按钮、筛选按钮、正倒序按钮、导航按钮等）

## Impact
- Affected Specs: 无
- Affected Code:
  - src/css/styles.css（新增水波纹动画 CSS）
  - src/js/modules/renderer.js 或新建 ripple.js（水波纹 JS 逻辑）

## ADDED Requirements

### Requirement: 水波纹点击效果
系统 SHALL 为所有可点击按钮提供以点击位置为中心的水波纹扩散动画效果。

#### Scenario: 点击按钮触发水波纹
- **GIVEN** 用户在页面上看到一个可点击按钮
- **WHEN** 用户点击按钮任意位置
- **THEN** 从点击坐标开始，一个圆形水波纹向外扩散
- **AND** 水波纹在扩散过程中逐渐淡出
- **AND** 动画结束后水波纹元素被移除

#### Scenario: 快速连续点击
- **GIVEN** 用户快速连续点击同一按钮
- **WHEN** 第一次水波纹动画尚未结束
- **THEN** 第二次点击产生独立的新水波纹
- **AND** 多个水波纹可以同时存在并独立动画

## Technical Constraints

### 1. CSS 实现方案
使用 CSS 动画 + CSS 变量实现水波纹效果：

```css
.btn-ripple {
    position: relative;
    overflow: hidden;
}

.btn-ripple .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    transform: scale(0);
    animation: rippleEffect 0.6s ease-out;
    pointer-events: none;
}

@keyframes rippleEffect {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
```

### 2. JS 实现方案
使用事件委托在按钮点击时动态创建水波纹元素：

```javascript
function createRipple(event, button) {
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
```

### 3. 性能与 A11y
- **Compositor-Only**：动画仅使用 `transform` 和 `opacity`
- **A11y**：`@media (prefers-reduced-motion: reduce)` 时禁用水波纹动画

## 适用按钮范围

| 按钮类型 | 类名 | 是否启用 |
|----------|------|----------|
| 排序按钮 | `.sort-btn` | 是 |
| 筛选按钮 | `.filter-btn` | 是 |
| 移动端筛选按钮 | `.filter-btn-mobile` | 是 |
| 正倒序按钮 | `.order-toggle-btn` | 是 |
| 底部导航项 | `.nav-item` | **否** |
| 游戏卡片 | `.glass-card.btn-active` | 是 |
| 其他按钮 | `.btn-active` | 是 |

## QA 验收检查单

### 水波纹效果验证
- [ ] 点击按钮时从点击位置产生圆形水波纹
- [ ] 水波纹向外扩散并逐渐淡出
- [ ] 动画时长约 600ms，过渡平滑
- [ ] 快速连续点击可产生多个独立水波纹
- [ ] 动画结束后水波纹元素被正确移除

### 兼容性验证
- [ ] 所有按钮类型均支持水波纹效果
- [ ] 深色模式下水波纹颜色正确显示
- [ ] `prefers-reduced-motion: reduce` 时水波纹被禁用
- [ ] 触摸设备上水波纹效果正常
- [ ] 水波纹不影响按钮原有功能
