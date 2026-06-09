# 修复搜索页动画与功能异常 Spec

## Why
搜索页进入动画使用 `position: absolute; height: 100%` 的 CSS 类，导致搜索 section 在动画期间脱离正常文档流。当 `waitForAnimationEnd` 回调未正常触发时，section 永久保持绝对定位，造成卡片错位、页内功能丧失（事件绑定在回调中执行）和交互卡死（状态机阻塞）。

## What Changes
- 修复搜索页进入动画：移除 `position: absolute` 方案，改用 `transform` 实现上滑动画，避免脱离文档流
- 修复搜索页退出动画：同样移除 `position: absolute`，确保动画结束后 section 正确恢复
- 添加安全守卫：在 `search-enter` 和 `search-exit-pop` 分支中，确保 `afterPageSwitch` 和 `bindSearchControlsDelegated` 在超时后必定执行
- 修复 `is-visible` 类名冲突：搜索 section 的 `is-visible` 与卡片的 `is-entering.is-visible` 使用相同类名，改为搜索专用类名

## Impact
- Affected code: `src/js/modules/search/renderer.js`（搜索页渲染逻辑）
- Affected code: `src/css/components/components.css`（搜索页动画 CSS）

## ADDED Requirements

### Requirement: 搜索页进入动画不脱离文档流
搜索页进入动画 SHALL 使用纯 `transform: translateY()` 实现，不使用 `position: absolute`。动画期间 section SHALL 保持在正常文档流中，确保容器高度正确计算。

#### Scenario: 从首页进入搜索页
- **WHEN** 用户从首页导航到搜索页
- **THEN** 搜索 section 从底部滑入，动画期间卡片布局正常，动画结束后排序/筛选/排序按钮可正常点击

#### Scenario: 动画回调未触发
- **WHEN** `waitForAnimationEnd` 的 `transitionend` 事件未正常触发
- **THEN** 超时回调 SHALL 确保清理动画类、调用 `afterPageSwitch` 和 `bindSearchControlsDelegated`

### Requirement: 搜索页退出动画不脱离文档流
搜索页退出动画 SHALL 使用纯 `transform` 实现，不使用 `position: absolute`。

#### Scenario: 从搜索页返回上一页
- **WHEN** 用户从搜索页按返回键
- **THEN** 搜索 section 向下滑出，目标页面正常显示

### Requirement: 搜索 section 动画类名与卡片动画类名不冲突
搜索 section 的动画 SHALL 使用专用类名（如 `slide-visible`），不与卡片的 `is-visible` 类名冲突。

#### Scenario: 搜索页进入后卡片入场动画
- **WHEN** 搜索 section 滑入动画完成，卡片开始入场动画
- **THEN** 卡片的 `is-entering.is-visible` 动画正常播放，不受 section 动画类名影响

## MODIFIED Requirements

### Requirement: 搜索页 CSS 动画
`.page-slide-up-enter-active` 和 `.page-slide-down-exit-active` SHALL 移除 `position: absolute; top: 0; left: 0; width: 100%; height: 100%` 属性，改为仅使用 `transform` 和 `z-index` 实现动画效果。`.page-slide-up-enter-active` 的 `is-visible` 状态 SHALL 改为 `slide-visible`。
