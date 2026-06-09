# Docker 栏页面切换动画重构文档

## 📋 问题描述

Docker 栏（底部导航栏）页面左右切换动画消失，用户点击导航按钮时没有看到滑动动画效果。

## 🔍 问题根源分析

### 1. prefers-reduced-motion 设置影响

代码中有多处检查 `prefers-reduced-motion` 设置，如果浏览器或系统启用了"减少动画"选项，会完全跳过动画：

- `renderer.js:1205` - 检查 `prefersReducedMotion` 并跳过动画等待
- `styles.css:3872` - 多个 `prefers-reduced-motion` 媒体查询禁用动画类

### 2. 动画逻辑复杂

`renderer.js` 中的动画逻辑嵌套多层条件分支：
- 第 1035 行：`animationClass` 初始化为 `'animate-fade-in'`
- 第 1038-1041 行：搜索页特殊处理
- 第 1042-1046 行：正常页面切换使用 `getAnimationDirection()`
- 第 1180 行：执行页面切换动画

### 3. 缺少 null 检查

`getAnimationDirection()` 函数没有检查 `null` 值，只检查 `undefined`。

### 4. CSS 优先级冲突

多个 `prefers-reduced-motion` 媒体查询可能意外影响页面切换动画类。

## ✅ 修复方案

### 1. 重构 `getAnimationDirection()` 函数

**文件**: `src/js/modules/renderer.js`

**修改内容**:
- 添加 `null` 值检查
- 添加调试日志
- 为 `oldAnimationClass` 提供默认值 `'animate-fade-out'`

**修改前**:
```javascript
function getAnimationDirection(fromIndex, toIndex) {
    if (fromIndex === undefined || toIndex === undefined) {
        return { animationClass: 'animate-fade-in', oldAnimationClass: '' };
    }
    if (toIndex > fromIndex) {
        return { animationClass: 'animate-slide-in-right', oldAnimationClass: 'animate-slide-out-left' };
    } else if (toIndex < fromIndex) {
        return { animationClass: 'animate-slide-in-left', oldAnimationClass: 'animate-slide-out-right' };
    }
    return { animationClass: 'animate-fade-in', oldAnimationClass: '' };
}
```

**修改后**:
```javascript
function getAnimationDirection(fromIndex, toIndex) {
    if (fromIndex === undefined || toIndex === undefined || fromIndex === null || toIndex === null) {
        console.log('[Animation] Invalid indices, using fade animation');
        return { animationClass: 'animate-fade-in', oldAnimationClass: 'animate-fade-out' };
    }
    
    if (toIndex > fromIndex) {
        console.log('[Animation] Sliding right (forward navigation)');
        return { animationClass: 'animate-slide-in-right', oldAnimationClass: 'animate-slide-out-left' };
    } else if (toIndex < fromIndex) {
        console.log('[Animation] Sliding left (backward navigation)');
        return { animationClass: 'animate-slide-in-left', oldAnimationClass: 'animate-slide-out-right' };
    }
    
    console.log('[Animation] Same page, using fade animation');
    return { animationClass: 'animate-fade-in', oldAnimationClass: 'animate-fade-out' };
}
```

### 2. 优化 CSS 动画定义

**文件**: `src/css/styles.css`

**修改内容**:
- 在动画类定义后添加 `prefers-reduced-motion: reduce` 媒体查询
- 为页面切换动画提供更短的动画时长（0.25s 而不是完全禁用）

**添加位置**: 动画类定义后（约第 362 行）

**修改内容**:
```css
@media (prefers-reduced-motion: reduce) {
    .animate-slide-in-left,
    .animate-slide-in-right,
    .animate-slide-out-left,
    .animate-slide-out-right {
        animation-duration: 0.25s !important;
        animation-timing-function: ease-out !important;
    }
    
    .animate-fade-in,
    .animate-fade-out {
        animation-duration: 0.2s !important;
    }
}
```

### 3. 修改动画等待逻辑

**文件**: `src/js/modules/renderer.js`

**修改内容**:
- 移除 `prefersReducedMotion` 跳过动画的逻辑
- 始终等待动画完成，但根据设置调整等待时间
- 添加详细的调试日志

**修改前**:
```javascript
if (newPageEl && !prefersReducedMotion) {
    waitForAnimationEnd(newPageEl, 500).then(function() { ... });
} else {
    injectSection(router.current, contentWithoutAnimation);
    // ... 直接注入，跳过动画
}
```

**修改后**:
```javascript
console.log('[Animation] Page transition:', {
    animationClass: animationClass,
    oldAnimationClass: effectiveOldAnimationClass,
    prefersReducedMotion: prefersReducedMotion,
    routerCurrent: router.current,
    routerPrevious: router.previous
});

if (newPageEl) {
    const animationDuration = prefersReducedMotion ? 250 : 500;
    waitForAnimationEnd(newPageEl, animationDuration).then(function() {
        injectSection(router.current, contentWithoutAnimation);
        // ... 等待动画完成后注入
    });
} else {
    console.error('[Animation] Animation element not found!');
    injectSection(router.current, contentWithoutAnimation);
    observeExistingMedia();
}
```

## 🎯 改进效果

1. **动画健壮性提升**: 即使系统启用了 `prefers-reduced-motion`，动画仍会执行（只是更快）
2. **更好的降级方案**: 动画时长从 0.5s 缩短到 0.25s，而不是完全禁用
3. **调试能力增强**: 添加了详细的控制台日志，方便诊断问题
4. **代码质量提升**: 添加了 null 检查，避免潜在的运行时错误

## 🧪 测试建议

### 1. 正常动画测试
1. 点击底部导航栏的不同按钮
2. 观察页面是否从左/右滑入
3. 检查控制台是否有 `[Animation]` 日志输出

### 2. prefers-reduced-motion 测试
1. 在浏览器开发者工具中启用"减少动画"选项
2. 再次点击导航按钮
3. 确认动画仍然执行（只是更快）

### 3. 控制台日志检查
打开浏览器控制台（F12），查看以下日志：
```
[Animation] Page transition: { ... }
[Animation] Sliding right (forward navigation)
[Animation] Sliding left (backward navigation)
```

## 📝 注意事项

1. **动画时长调整**: 0.25s 的动画时长已经很快，但仍能提供视觉反馈
2. **CSS !important**: 在 `prefers-reduced-motion` 媒体查询中使用了 `!important` 来确保覆盖默认动画时长
3. **向后兼容**: 修改不会影响不支持 `prefers-reduced-motion` 的旧浏览器

## 🔧 调试技巧

如果在测试中发现问题，可以：
1. 打开浏览器控制台（F12）
2. 查看 `[Animation]` 相关的日志输出
3. 检查 `prefersReducedMotion` 的值
4. 确认动画类是否正确应用

如果动画仍然不工作，可能是：
- 浏览器/系统强制启用了 `prefers-reduced-motion`
- CSS 规则被其他样式覆盖
- JavaScript 错误导致代码没有执行

---

**修改文件列表**:
- `src/js/modules/renderer.js` - 动画逻辑重构
- `src/css/styles.css` - CSS 动画优化

**修改时间**: 2026-05-23
