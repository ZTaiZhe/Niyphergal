# 对齐 React 版布局、卡片和遮罩样式

## Why
Flutter 版的卡片、搜索框、标题栏、Docker 栏、标签样式与原 React 版差异较大，需要照搬 React 版的视觉设计，确保品牌一致性。

## What Changes
- **GameCard**：改为 React 版布局——图片全铺 + 底部 50% 渐变遮罩（card-blur-overlay）+ 标题在图片上方（白色+阴影）+ 标签在底部
- **TagChip**：改为 React 版 tag-acrylic 样式——粉色半透明背景 + backdrop-filter + 圆角
- **DockerNav**：改为 React 版浮动毛玻璃底部栏——居中、圆角、毛玻璃背景、固定在底部
- **SearchBarWidget**：改为 React 版 pill 形状——全圆角、毛玻璃背景、粉色 focus 下划线
- **GlassCard**：增加 React 版 acrylic 渐变背景（135deg 线性渐变）和 hover 效果
- **主题色**：亮色背景改为 `#f8fafc`，暗色背景改为 `#0f172a`（与 React 版一致）

## Impact
- Affected code: `game_card.dart`、`tag_chip.dart`、`docker_nav.dart`、`search_bar_widget.dart`、`glass_card.dart`、`theme.dart`

## ADDED Requirements

### Requirement: GameCard 照搬 React 版布局
系统 SHALL 将 GameCard 改为 React 版的布局：图片全铺卡片 + 底部 50% 渐变遮罩 + 标题白色带阴影 + 标签在底部。

#### Scenario: 卡片视觉与 React 版一致
- **WHEN** 用户查看游戏卡片
- **THEN** 图片铺满整个卡片，底部有从下到上的渐变遮罩，标题为白色带文字阴影，标签在底部

### Requirement: TagChip 照搬 React 版 tag-acrylic 样式
系统 SHALL 将 TagChip 改为 React 版的 tag-acrylic 样式：粉色半透明背景 + 毛玻璃 + 圆角。

#### Scenario: 标签样式与 React 版一致
- **WHEN** 用户查看标签
- **THEN** 标签为粉色半透明背景（rgba(236,72,153,0.5)）+ backdrop-filter blur + 圆角

### Requirement: DockerNav 照搬 React 版浮动毛玻璃底部栏
系统 SHALL 将 DockerNav 改为浮动毛玻璃底部栏：居中、圆角、毛玻璃背景、固定在底部，与页面内容有间距。

#### Scenario: 底部导航与 React 版一致
- **WHEN** 用户查看底部导航
- **THEN** 导航栏浮动在底部，毛玻璃背景，居中显示，圆角，宽度 min(600px, 95vw)

### Requirement: SearchBarWidget 照搬 React 版 pill 形状
系统 SHALL 将搜索框改为 React 版 pill 形状：全圆角、毛玻璃背景、粉色 focus 下划线。

#### Scenario: 搜索框与 React 版一致
- **WHEN** 用户查看搜索框
- **THEN** 搜索框为全圆角（pill 形状），毛玻璃背景，focus 时底部有粉色下划线

### Requirement: 主题色与 React 版一致
系统 SHALL 将亮色背景改为 `#f8fafc`，暗色背景改为 `#0f172a`。

#### Scenario: 背景色与 React 版一致
- **WHEN** 应用使用亮色主题
- **THEN** 背景色为 `#f8fafc`
- **WHEN** 应用使用暗色主题
- **THEN** 背景色为 `#0f172a`
