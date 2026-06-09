# 集成 React 轮播图组件 Spec

## Why
当前轮播图使用 vanilla JS + Web Animations API 重写，视觉效果和交互与源码 GameCarousel.tsx 存在差异。用户要求"直接照搬源代码"，即将 GameCarousel.tsx 以 React 组件形式原封不动集成到项目中，而非用 vanilla JS 等效重写。

## What Changes
- **BREAKING**: 删除当前 `src/js/modules/carousel.js`（vanilla JS 实现）
- **BREAKING**: 删除 `src/css/styles.css` 中所有 `.carousel-*` 样式（约 300 行）
- 新增 React、ReactDOM、motion（Framer Motion）、lucide-react 依赖
- 新增 `@vitejs/plugin-react` 开发依赖
- 修改 `vite.config.js`：添加 React 插件
- 新增 `src/js/components/GameCarousel.tsx`：直接照搬源码，仅做数据源适配
- 新增 `src/js/components/carousel-entry.tsx`：React 挂载入口
- 修改 `src/js/pages/home.js`：`renderCarousel()` 改为输出挂载点 `<div id="carousel-root">`
- 修改 `src/js/modules/renderer.js`：`initCarousel()` 改为调用 React 挂载逻辑
- 修改 `index.html`：无需改动（React 通过 Vite 自动处理）

## Impact
- Affected code: `carousel.js`（删除）、`styles.css`（删除轮播图部分）、`home.js`（模板改动）、`renderer.js`（初始化改动）、`vite.config.js`（添加插件）、`package.json`（添加依赖）
- Bundle size: React (~42KB gzip) + ReactDOM (~130KB gzip) + motion (~30KB gzip) + lucide-react (tree-shakeable, ~5KB for 2 icons) ≈ 增加 ~207KB gzip
- 构建配置: 需要支持 JSX/TSX 编译

## ADDED Requirements

### Requirement: React 轮播图组件集成
系统 SHALL 将 GameCarousel.tsx 以 React 组件形式直接集成到项目中，保持源码的视觉效果和交互逻辑不变。

#### Scenario: 轮播图正常渲染
- **WHEN** 用户访问首页
- **THEN** 轮播图以 React 组件形式渲染，视觉效果与 GameCarousel.tsx 源码一致

#### Scenario: 轮播图交互
- **WHEN** 用户点击导航箭头、指示器或等待自动播放
- **THEN** 切换动画与源码 AnimatePresence mode="wait" 效果一致

#### Scenario: 游戏推荐点击导航
- **WHEN** 用户点击游戏推荐类型的幻灯片
- **THEN** 导航到对应游戏详情页（通过 router.push）

### Requirement: 数据源适配
GameCarousel 组件 SHALL 使用 DB.carouselSlides 作为数据源，而非源码中的硬编码 slides 数组。

#### Scenario: 数据驱动渲染
- **WHEN** DB.carouselSlides 包含 5 条数据
- **THEN** 轮播图渲染 5 个幻灯片，每条数据的 title/subtitle/description/image 正确显示

### Requirement: CTA 按钮适配
CTA 按钮 SHALL 适配项目需求：游戏推荐类型显示"查看详情"+"了解更多"，其他类型显示"立即查看"。

#### Scenario: 游戏推荐 CTA
- **WHEN** 幻灯片类型为 game
- **THEN** 显示"查看详情"主按钮和"了解更多"次按钮

#### Scenario: 非游戏 CTA
- **WHEN** 幻灯片类型非 game
- **THEN** 显示"立即查看"主按钮

### Requirement: 高度适配 SPA 布局
轮播图高度 SHALL 从源码的 h-screen 改为固定高度（移动端 240px，桌面端 420px），底部渐变遮罩与卡片区域衔接。

#### Scenario: 移动端高度
- **WHEN** 视口宽度 < 768px
- **THEN** 轮播图高度为 240px

#### Scenario: 桌面端高度
- **WHEN** 视口宽度 >= 768px
- **THEN** 轮播图高度为 420px

### Requirement: React 组件生命周期管理
轮播图 React 组件 SHALL 在首页渲染时挂载，在离开首页时卸载，避免内存泄漏。

#### Scenario: 进入首页
- **WHEN** 用户导航到首页
- **THEN** React 轮播图组件挂载到 #carousel-root

#### Scenario: 离开首页
- **WHEN** 用户导航到其他页面
- **THEN** React 轮播图组件卸载，清理定时器和事件监听

## MODIFIED Requirements

### Requirement: 首页轮播图渲染
原 `renderCarousel()` 函数返回完整 HTML 字符串，现改为返回挂载点 `<div id="carousel-root"></div>`，由 React 负责实际渲染。

### Requirement: 首页轮播图初始化
原 `initCarousel()` 函数绑定 vanilla JS 事件，现改为调用 `mountCarousel()` 挂载 React 组件。

## REMOVED Requirements

### Requirement: vanilla JS 轮播图实现
**Reason**: 用户要求直接照搬源码，不再使用 vanilla JS 等效重写
**Migration**: 删除 carousel.js，用 React 组件替代
