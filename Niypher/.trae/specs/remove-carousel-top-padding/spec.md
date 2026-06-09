# 移除轮播图上方空白并添加圆角 Spec

## Why
1. 首页轮播图 wrapper 的 `pt-20`（80px 上边距）留下不必要的空白
2. 轮播图边缘为直角，与项目中卡片等其他圆角元素风格不统一

## What Changes
- 首页 `renderHome()` 中包裹轮播图的 div 从 `space-y-5 pt-20` 改为 `space-y-5`
- `.carousel-container` 添加 `border-radius` 圆角

## Impact
- Affected code: `src/js/pages/home.js`（第 151 行）, `src/css/styles.css`（`.carousel-container`）

## MODIFIED Requirements

### Requirement: 轮播图紧贴页面顶部
首页轮播图 SHALL 紧贴页面顶部显示，上方无多余空白。

#### Scenario: 首页加载
- **WHEN** 用户进入首页
- **THEN** 轮播图顶部与页面内容区域顶部对齐
- **AND** 轮播图与下方卡片区域之间保持 `space-y-5` 间距

### Requirement: 轮播图圆角
轮播图容器 SHALL 具有圆角，与项目中卡片等元素风格保持一致。

#### Scenario: 所有视口
- **WHEN** 轮播图在任意视口下显示
- **THEN** 轮播图容器四角为圆角
