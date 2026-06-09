# 重构页面切换动画系统 Spec

## Why
当前 `render()` 函数的页面切换动画系统存在根本性架构缺陷：使用临时容器（`page-transition-container`）克隆 innerHTML 播放动画，再通过 `injectSection` 替换真实 DOM。这种方式导致：1) 动画层与真实 DOM 脱节，`preserveExisting` 时新内容来自旧 section 而非动画层；2) 6 个分支各自重复后处理逻辑（scroll 恢复、animation init 等），代码膨胀且易出错；3) `oldContent` 来源问题导致视觉错位。需要重构为直接在真实 section 元素上播放动画。

## What Changes
- **BREAKING** 移除 `page-transition-container` / `search-page-transition-container` 临时容器方案
- 改为直接在 `section[data-page]` 元素上使用 CSS transform 播放滑动动画
- 将后处理逻辑（scroll 恢复、animation init、media observe 等）提取为统一的 `afterPageSwitch()` 函数
- 简化 `render()` 的分支结构：search-enter/search-exit 仍保留特殊处理，其余页面切换统一走 section 动画路径

## Impact
- Affected code: `src/js/modules/search/renderer.js`（`render()` 函数）
- Affected CSS: `src/css/styles.css`（移除 `page-transition-container` 相关样式，添加 section 动画样式）
- Affected specs: fix-page-slide-animation-conflict, fix-page-slide-animation-comprehensive, preserve-page-state-on-back

## ADDED Requirements

### Requirement: 直接在 section 元素上播放滑动动画
系统 SHALL 在页面切换时，直接对 `section[data-page]` 元素应用 CSS transform 动画，而非创建临时容器克隆 innerHTML。

#### Scenario: 首页→分类（push）
- **WHEN** 用户从首页导航到分类页
- **THEN** 首页 section 应用 `animate-slide-out-left` 动画
- **AND** 分类 section 先设为 `display:block`，再应用 `animate-slide-in-right` 动画
- **AND** 动画结束后移除动画 class

#### Scenario: 分类→首页（pop）
- **WHEN** 用户从分类页返回首页
- **THEN** 分类 section 应用 `animate-slide-out-right` 动画
- **AND** 首页 section 先设为 `display:block`，再应用 `animate-slide-in-left` 动画
- **AND** 首页 DOM 状态保持（`preserveExisting=true`）

#### Scenario: 首次加载（无 previous page）
- **WHEN** 应用首次加载，`router.previous` 为 null
- **THEN** 当前 section 直接显示，无动画或仅 fade-in

### Requirement: 统一的后处理函数
系统 SHALL 在所有页面切换路径完成后调用统一的 `afterPageSwitch(page, shouldPreserve)` 函数，处理：
- 滚动位置恢复（`shouldPreserve` 时恢复保存的 scrollY）
- 首页动画初始化（`!shouldPreserve` 时 initHomeAnimations + initCarousel）
- hero exit 特殊处理
- media observer 绑定
- search 控件绑定
- profile 密码检查绑定
- 公告显示

### Requirement: preserveExisting 语义简化
当 `preserveExisting=true` 时，`injectSection` 仅切换 section 的 display 属性，不设置 innerHTML。动画直接在现有 section 元素上播放，无需克隆内容。

## MODIFIED Requirements

### Requirement: search-enter/search-exit 保留独立动画路径
搜索页面的进入（从底部滑入）和退出（向底部滑出）动画 SHALL 保留独立的动画路径，不使用 section 滑动动画。但后处理逻辑仍通过统一的 `afterPageSwitch()` 函数执行。

### Requirement: detail 页面导航
detail 页面导航 SHALL 不播放 section 滑动动画，直接切换显示。

## REMOVED Requirements

### Requirement: page-transition-container 临时容器
**Reason**: 临时容器方案导致动画层与真实 DOM 脱节，`preserveExisting` 时内容来源不一致
**Migration**: 改为直接在 section 元素上播放 CSS transform 动画

### Requirement: oldContent 变量
**Reason**: 不再需要克隆旧页面内容到临时容器
**Migration**: 直接在旧 section 元素上播放退出动画
