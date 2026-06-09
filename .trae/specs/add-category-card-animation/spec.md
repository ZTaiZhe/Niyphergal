# 分类页卡片动效规范

## Why
分类页卡片目前没有动画效果，与首页卡片体验不一致，需要添加相同的阶梯式进入动效。

## What Changes
- 为分类页卡片添加 `is-hidden` 类和 `--stagger-index` 样式
- 创建 `initCategoryAnimations` 函数处理动画初始化
- 在 renderer.js 中调用分类页动画初始化函数

## Impact
- Affected specs: 页面动画效果
- Affected code: `src/js/pages/category.js`, `src/js/modules/renderer.js`

## ADDED Requirements

### Requirement: 分类页卡片动效
分类页卡片应当具有与首页卡片相同的阶梯式进入动效。

#### Scenario: 进入分类页
- **WHEN** 用户导航到分类页
- **THEN** 卡片依次延时进入，呈现阶梯式动画效果

#### Scenario: 动画样式
- **WHEN** 分类页加载完成
- **THEN** 卡片具有 `is-hidden` 初始状态，通过 `--stagger-index` 实现延时进入
