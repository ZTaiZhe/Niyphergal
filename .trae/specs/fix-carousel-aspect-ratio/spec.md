# 修复轮播图比例 Spec

## Why
当前轮播图使用固定像素高度（移动端 240px / 桌面端 420px），导致在不同视口宽度下轮播图宽高比不一致。项目中其他图片展示（详情页 Hero、首页卡片封面）已统一使用 16:9 比例，轮播图应与之一致。

## What Changes
- 轮播图容器从固定 `height` 改为 `aspect-ratio: 16/9`，保持与项目其他图片区域一致的宽高比
- 移除 `@media (min-width: 768px)` 中的高度覆盖，让 `aspect-ratio` 在所有断点生效
- 内部元素（`.carousel-slide`、`.carousel-content` 等）保持 `inset: 0` / `height: 100%` 的相对定位不受影响

## Impact
- Affected specs: device-responsive-grid-and-detail-image-ratio（与 16:9 统一比例一致）
- Affected code: `src/css/styles.css`（`.carousel-container` 样式）

## MODIFIED Requirements

### Requirement: Carousel Responsive Aspect Ratio
轮播图容器 SHALL 使用 `aspect-ratio: 16/9` 替代固定像素高度，确保在所有视口宽度下保持统一的 16:9 宽高比。

#### Scenario: 桌面端宽屏
- **WHEN** 视口宽度 >= 768px
- **THEN** 轮播图以 16:9 宽高比自适应显示
- **AND** 背景图通过 `background-size: cover` 正常裁剪

#### Scenario: 移动端窄屏
- **WHEN** 视口宽度 < 768px
- **THEN** 轮播图以 16:9 宽高比自适应显示
- **AND** 内容区域文字和按钮正常展示

#### Scenario: 窗口缩放
- **WHEN** 用户拖拽调整浏览器窗口大小
- **THEN** 轮播图高度随宽度按 16:9 比例实时变化
- **AND** 切换动画、渐变遮罩等视觉效果不受影响
