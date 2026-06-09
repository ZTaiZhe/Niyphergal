# 修复 UI 回归 + 页面缓存策略 Spec

## Why
页面每次导航都重新渲染导致多个 UI 回归：骨架屏注入干扰了 hero exit 反飞行过渡、分类页卡片消失、详情页布局异常。需要引入页面缓存机制，首次加载后缓存内容，避免不必要的重新渲染。

## What Changes
- 移除骨架屏注入逻辑（`getPageSkeleton` + `injectSection` 在渲染前注入骨架屏）
- 引入页面内容缓存：首次渲染后缓存 HTML，后续导航直接复用缓存内容
- 手动刷新时清除缓存并重新渲染
- 修复分类页卡片消失问题
- 修复详情页布局 visibility 问题
- 修复反飞行过渡被骨架屏干扰的问题

## Impact
- Affected code: `src/js/modules/search/renderer.js`（核心渲染逻辑）
- Affected code: `src/js/modules/foundation/router.js`（导航状态）
- Affected code: `src/js/pages/category.js`（分类页渲染）
- Affected code: `src/js/pages/detail.js`（详情页 visibility）

## MODIFIED Requirements

### Requirement: 页面渲染缓存策略
系统 SHALL 对每个页面的渲染内容进行缓存。首次导航到某页面时正常渲染并缓存 HTML；后续导航到同一页面时直接复用缓存内容，不再重新渲染，也不再注入骨架屏。

#### Scenario: 首次导航到页面
- **WHEN** 用户首次导航到某页面（缓存中无该页面内容）
- **THEN** 正常渲染页面内容并缓存到 `_pageCache[page]`

#### Scenario: 再次导航到已缓存页面
- **WHEN** 用户导航到已缓存的页面
- **THEN** 直接使用缓存内容注入 section，跳过骨架屏和重新渲染

#### Scenario: 手动刷新
- **WHEN** 用户触发手动刷新（下拉刷新或刷新按钮）
- **THEN** 清除该页面的缓存，重新渲染并更新缓存

#### Scenario: 反飞行过渡
- **WHEN** 从详情页返回首页（hero exit）
- **THEN** 使用缓存的首页内容，不注入骨架屏，hero exit 动画正常执行

### Requirement: 分类页卡片不消失
系统 SHALL 确保分类页的 6 张卡片始终正常显示。

#### Scenario: 导航到分类页
- **WHEN** 用户导航到分类页
- **THEN** 6 张分类卡片正常显示在 grid 布局中

### Requirement: 详情页布局正确
系统 SHALL 确保详情页内容正确显示，visibility 不被骨架屏逻辑干扰。

#### Scenario: 导航到详情页
- **WHEN** 用户导航到详情页
- **THEN** 详情页内容正常显示，stagger 动画正常触发
