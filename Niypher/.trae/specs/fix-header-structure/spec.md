# 修复标题栏和搜索栏位置结构

## Why
Flutter 版头部与 React 版结构不一致：当前是普通 AppBar（Logo title + 右侧搜索栏），React 版是固定透明 header（Logo 丙烯酸胶囊按钮 + 居中搜索栏）。需要对齐结构。

## What Changes
- 移除 AppBar，改为固定透明 Stack header 叠在内容上方（React: `header.fixed.top-0.bg-transparent`）
- Logo 改为丙烯酸胶囊按钮（`acrylic-panel px-4 py-1.5 rounded-full`），含 "NiypherGal" + 下拉菜单箭头
- 搜索栏居中放置（`desktop-search-container` max-width 380px，丙烯酸 pill 形状）
- 右侧放移动端搜索按钮（隐藏状态，为移动端做准备）

## Impact
- Affected code: `lib/features/home/home_screen.dart`
- Affected specs: fix-layout-not-effective（Header 结构未对齐）

## ADDED Requirements

### Requirement: 透明固定头部
系统 SHALL 显示固定透明 header 叠在页面内容上方（React: `header.fixed.top-0.z-10000`），而非 Material AppBar。

#### Scenario: 头部透明叠加
- **WHEN** 用户打开首页
- **THEN** header 透明背景，覆盖在轮播上方，不占用独立空间

### Requirement: Logo 丙烯酸胶囊按钮
系统 SHALL 在 header 左侧显示 Logo 丙烯酸胶囊按钮（`acrylic-panel.px-4.py-1.5.rounded-full`），含 "NiypherGal" 文字和下拉箭头。

#### Scenario: Logo 胶囊可见
- **WHEN** 用户查看 header
- **THEN** 左侧显示粉色 Logo 文字的丙烯酸毛玻璃胶囊按钮

### Requirement: 居中搜索栏
系统 SHALL 在 header 居中位置显示搜索栏（`desktop-search-container.max-w-380px`），丙烯酸 pill 形状，focus 时粉色边框和阴影。

#### Scenario: 搜索栏居中
- **WHEN** 用户在桌面浏览器查看 header
- **THEN** 搜索栏水平居中，max-width 380px，pill 形状
