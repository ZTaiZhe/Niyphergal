# 照搬源码重做轮播图 Spec

## Why
当前轮播图实现与源码设计差异太大，用户要求删除当前实现，直接照搬"游戏网站首页轮播图设计.zip"中 GameCarousel.tsx 的源代码逻辑和视觉效果，用纯 JS + Web Animations API 等效实现。

## 源码关键特性（必须照搬）
1. **全屏高度** — `h-screen`（需适配为固定高度，因 SPA 不是全屏布局）
2. **Ken Burns 效果** — 背景图初始 scale:1.08 + x偏移，10s 缓动到 scale:1 x:0
3. **装饰性对角线元素** — 右侧白色半透明对角线（clipPath），0.08 透明度
4. **多层径向渐变遮罩** — 底部 h-56 区域，包含 backdrop-blur + 多层 radial-gradient + frosted glass 纹理
5. **内容动画** — 副标题（accent line 从 0→40px 宽 + 文字从左滑入）、标题（从下 40px 滑入）、描述（从下 30px 滑入）、CTA 按钮（从下 30px 滑入），各有延迟
6. **导航箭头** — w-11 h-11 圆形，bg-black/20 backdrop-blur-xl border-white/10，hover scale:1.1 tap:0.9
7. **进度指示器** — h-1.5 圆角条，当前 w-8 bg-white，其他 w-1.5 bg-white/40
8. **幻灯片切换** — AnimatePresence mode="wait"，initial opacity:0 x:±100，animate opacity:1 x:0，exit opacity:0 x:∓100，0.8s ease [0.25,0.1,0.25,1]

## What Changes
- 删除当前 carousel.js，重写为等效源码的纯 JS 实现
- 删除当前轮播图 CSS，重写为等效源码 Tailwind 类的纯 CSS
- 保留 DB.carouselSlides 数据结构（已确认可用）
- 保留 home.js 和 renderer.js 中的集成点

## Impact
- Affected code: `src/js/modules/carousel.js`（重写）, `src/css/styles.css`（替换轮播图部分）, `src/js/pages/home.js`（微调 HTML 模板）, `src/js/modules/renderer.js`（不变）

## ADDED Requirements

### Requirement: 照搬源码视觉效果
轮播图 SHALL 精确复现 GameCarousel.tsx 的视觉效果，包括 Ken Burns、对角线装饰、多层渐变遮罩、内容入场动画。

### Requirement: 照搬源码交互逻辑
轮播图 SHALL 精确复现 GameCarousel.tsx 的交互逻辑，包括 AnimatePresence 等效的切换动画、方向感知、进度指示器。

### Requirement: 适配 SPA 布局
轮播图高度 SHALL 从 h-screen 改为固定高度（移动端 240px，桌面端 420px），底部渐变遮罩与卡片区域衔接。

### Requirement: CTA 按钮适配
CTA 按钮 SHALL 适配项目需求：游戏推荐类型显示"查看详情"按钮，其他类型根据 action 配置决定。
