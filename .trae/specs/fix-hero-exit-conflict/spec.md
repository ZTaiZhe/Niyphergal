# 修复反向飞行过渡冲突 Spec

## Why
从详情页返回首页时，hero exit（反向飞行）过渡动画与页面过渡动画冲突。当前 hero exit 路径直接 `return` 跳过了所有页面过渡动画，导致用户看不到页面切换效果。需要让 hero exit 飞行动画和页面过渡动画协调共存。

## What Changes
- 修改 `render()` 的 hero exit 路径，不再直接 `return` 跳过页面过渡，而是走页面过渡动画分支，同时保留 hero exit 飞行的特殊处理
- Hero exit 路径中同步更新 `_pageCache['home']`
- 在页面过渡动画完成后的回调中，正确处理 hero exit 的 `revealHomeCardsImmediately` 和 `revealFlownCard` 逻辑

## Impact
- Affected code: `src/js/modules/search/renderer.js`（render 函数的 hero exit 路径和页面过渡动画分支）
- Affected specs: fix-ui-regressions-cache

## MODIFIED Requirements

### Requirement: Hero exit 路径应与页面过渡动画协调
原 hero exit 路径（第 1051-1071 行）直接 `return`，跳过了页面过渡动画。修改后：
1. Hero exit 路径不再 `return`，而是设置 `contentWithoutAnimation` 和 `newContent`，让代码继续走到页面过渡动画分支
2. 在页面过渡动画分支中，检测 hero exit 状态，使用 `revealHomeCardsImmediately` 替代 `initHomeAnimations`
3. 监听 `hero:exit-complete` 事件来触发 `revealFlownCard`
4. Hero exit 路径同步更新 `_pageCache['home']`

#### Scenario: 从详情页返回首页
- **WHEN** 用户在详情页点击返回按钮或首页导航，触发 hero exit
- **THEN** 页面过渡动画（淡入）正常播放，同时 hero clone 飞行动画从详情页图片位置飞回卡片位置
- **AND** 飞行目标卡片在动画期间 opacity 为 0，动画完成后恢复显示

#### Scenario: Hero exit 后再次导航到首页
- **WHEN** hero exit 动画完成后，用户导航到其他页面再返回首页
- **THEN** 首页显示最新内容（hero exit 路径注入并缓存的内容）
