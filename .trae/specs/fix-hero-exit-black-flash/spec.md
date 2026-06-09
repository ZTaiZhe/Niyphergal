# 修复反向飞行图片黑闪 Spec

## Why
`performHeroExit()` 中创建克隆图片后立即启动帧动画，此时 `img` 元素可能尚未完成解码渲染。由于 `.hero-clone-content` 无背景色，空图片区间呈现黑色闪屏。

## What Changes
- `performHeroExit()` 中在启动帧动画前等待克隆图片 `img` 加载完成
- `.hero-clone-content` 添加后备背景色，兜底防止黑闪

## Impact
- Affected code: `src/js/modules/animationHelpers.js`（`performHeroExit` 函数）, `src/css/styles.css`（`.hero-clone-content`）

## MODIFIED Requirements

### Requirement: 反向飞行无黑闪
反向飞回（详情→首页）时，飞行图片 SHALL 不会出现黑色闪烁。

#### Scenario: 反向飞行正常
- **WHEN** 用户在详情页点击返回触发 hero exit 动画
- **THEN** 克隆飞行图片从开始到结束始终有图像内容，无黑屏闪现
- **AND** 飞回动画结束后目标卡片正常恢复显示
