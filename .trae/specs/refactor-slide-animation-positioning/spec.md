# 重构页面滑动动画定位 Spec

## Why
经过 4 轮增量修复，页面左右滑动动画仍然不正确。根本原因是：当旧 section 变为 `position: absolute; top: 0; left: 0` 时，它跳过了 `main-container` 的 `pt-4 px-4` padding，导致视觉错位。此外，`width: 100%` 在绝对定位下包含了容器的 padding 区域，使 section 比正常流中更宽。

## What Changes
- **提取统一的 `animateSlideTransition()` 函数**，封装滑动动画的完整生命周期
- **修复定位 bug**：在旧 section 变为 absolute 之前，先设容器 `position: relative`，再捕获 `offsetTop/offsetLeft/offsetWidth`，然后设置精确的内联定位样式
- **简化 CSS**：移除 `styles.css` 中 section 动画的 `position: absolute; top: 0; left: 0; width: 100%` 规则，改为 JS 内联设置
- **确保清理**：动画结束后移除所有内联样式（top/left/width/position）

## Impact
- Affected code: `src/js/modules/search/renderer.js`（主动画分支 + 新增 `animateSlideTransition` 函数）
- Affected CSS: `src/css/styles.css`（section 动画定位规则）
- Search 页面动画不受影响（使用独立的 CSS transition 机制）

## ADDED Requirements

### Requirement: 统一滑动动画函数
系统 SHALL 提供 `animateSlideTransition(container, oldSection, newSection, animationClass, oldAnimationClass, onComplete)` 函数，封装完整的滑动动画生命周期。

#### Scenario: 正常 push 动画（home → category）
- **WHEN** 用户从首页导航到分类页
- **THEN** 旧 section（home）左滑出，新 section（category）右滑入，旧 section 在动画期间保持原始位置不跳动

#### Scenario: 正常 pop 动画（category → home）
- **WHEN** 用户从分类页返回首页
- **THEN** 旧 section（category）右滑出，新 section（home）左滑入，旧 section 在动画期间保持原始位置不跳动

#### Scenario: preserveExisting 时动画正常
- **WHEN** 用户返回已渲染的页面（shouldPreserve=true）
- **THEN** 新 section 不替换 innerHTML，滑动动画正常播放

### Requirement: 精确定位捕获
系统 SHALL 在旧 section 变为 absolute 之前，按以下顺序操作：
1. 设容器 `position: relative`（使其成为 offsetParent）
2. 捕获 `oldSection.offsetTop`、`oldSection.offsetLeft`、`oldSection.offsetWidth`
3. 设旧 section `position: absolute; top: offsetTop; left: offsetLeft; width: offsetWidth`
4. 这样旧 section 视觉位置不变

#### Scenario: 容器有 padding 时定位正确
- **WHEN** main-container 有 `pt-4 px-4` padding
- **THEN** 旧 section 变为 absolute 后仍停留在 padding 内的正确位置，不跳动

### Requirement: 动画后完整清理
系统 SHALL 在动画结束后：
- 移除旧 section 和新 section 的动画 class
- 移除旧 section 的内联 `position/top/left/width` 样式
- 隐藏旧 section（`display: none`）
- 恢复容器的 `overflow` 和 `position`

## MODIFIED Requirements

### Requirement: CSS section 动画定位规则
移除 `styles.css` 中以下规则：
```css
section[data-page].animate-slide-out-left,
section[data-page].animate-slide-out-right,
section[data-page].animate-fade-out {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 5;
}
section[data-page].animate-slide-in-right,
section[data-page].animate-slide-in-left,
section[data-page].animate-fade-in {
    z-index: 1;
}
```

替换为仅 z-index 规则（定位由 JS 内联控制）：
```css
section[data-page].animate-slide-out-left,
section[data-page].animate-slide-out-right,
section[data-page].animate-fade-out {
    z-index: 5;
}
section[data-page].animate-slide-in-right,
section[data-page].animate-slide-in-left,
section[data-page].animate-fade-in {
    z-index: 1;
}
```
