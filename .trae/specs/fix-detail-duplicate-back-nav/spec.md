# 修复详情页重复返回导航 Spec

## Why
从轮播图进入详情页时，header 的返回箭头和页面内的返回按钮+"详情"文字同时出现，造成视觉重复。原因是 header 在详情页始终变形为返回箭头，但 detail.js 中的内联返回按钮仅在无 hero exit context 时渲染——从轮播图导航时没有 hero context，导致两处返回同时显示。

## What Changes
- 移除 detail.js 中内联的返回按钮和"详情"文字（第 25-29 行），因为 header 已提供返回导航

## Impact
- Affected code: `src/js/pages/detail.js`（移除内联返回按钮+"详情"文字）
- Hero 动画导航不受影响（原本就不渲染此块）
- Header 返回箭头在所有详情页场景中统一提供返回功能

## MODIFIED Requirements

### Requirement: 详情页内联返回导航
移除 `renderDetail()` 中的内联返回按钮和"详情"文字块。Header logo 变形为返回箭头已覆盖所有详情页的返回导航需求，无需在页面内容区重复渲染。

#### Scenario: 从轮播图进入详情页
- **WHEN** 用户从轮播图点击进入详情页
- **THEN** 仅 header 显示返回箭头，页面内容区不显示额外的返回按钮和"详情"文字

#### Scenario: 从游戏卡片 hero 动画进入详情页
- **WHEN** 用户从游戏卡片点击进入详情页（有 hero 动画）
- **THEN** 仅 header 显示返回箭头，页面内容区不显示额外的返回按钮和"详情"文字（与当前行为一致）
