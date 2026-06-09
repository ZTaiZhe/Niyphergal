# 首页轮播图 Spec

## Why
需要在首页游戏卡片上方添加轮播图，展示混合内容（游戏推荐、公告通知、新功能/更新、活动推广）。设计参考来自"游戏网站首页轮播图设计.zip"中的 GameCarousel 组件，需适配到现有纯 JS 项目（无 React/framer-motion），不影响原有卡片样式。

## What Changes
- 在 `data.js` 中新增 `DB.carouselSlides` 数组，先硬编码示例数据（游戏推荐+公告+更新+活动），后续改为动态
- 在 `home.js` 的 `renderHome()` 中，在 `game-cards-container` 之前插入轮播图 HTML
- 在 `styles.css` 中新增轮播图相关 CSS 样式
- 新增 `carousel.js` 模块处理轮播图交互逻辑（自动播放、手动切换、进度指示器）
- 轮播图使用 Web Animations API 替代 framer-motion，纯 JS 实现
- 轮播图**不使用** hero 飞行过渡，部分幻灯片可点击导航，部分仅展示

## Impact
- Affected code: `src/js/modules/data.js`, `src/js/pages/home.js`, `src/css/styles.css`, 新增 `src/js/modules/carousel.js`
- 不影响现有卡片样式和功能

## ADDED Requirements

### Requirement: 轮播图组件
首页 SHALL 在游戏卡片上方展示轮播图，展示混合内容。

#### Scenario: 轮播图自动播放
- **WHEN** 首页加载完成
- **THEN** 轮播图每 6 秒自动切换到下一张
- **AND** 切换时有水平滑动动画（0.8s ease）

#### Scenario: 手动切换
- **WHEN** 用户点击左右箭头或进度指示器
- **THEN** 轮播图切换到对应幻灯片
- **AND** 鼠标悬停时暂停自动播放

#### Scenario: 轮播图与卡片衔接
- **WHEN** 轮播图显示在首页
- **THEN** 轮播图位于游戏卡片上方
- **AND** 底部有渐变遮罩与卡片区域自然衔接
- **AND** 不影响原有卡片的样式和入场动画

### Requirement: 轮播图数据来源
轮播图数据 SHALL 从 `DB.carouselSlides` 数组获取。当前先硬编码示例数据，包含 4 种类型：游戏推荐、公告通知、新功能/更新、活动推广。

#### Scenario: 数据结构
- **WHEN** 应用初始化
- **THEN** `DB.carouselSlides` 包含 5 条数据，每条包含：
  - `id` — 唯一标识
  - `type` — 类型：'game' | 'announcement' | 'update' | 'event'
  - `title` — 主标题
  - `subtitle` — 副标题
  - `description` — 描述文字
  - `image` — 背景图片 URL
  - `action` — 点击行为：null（不可点击）| { type: 'navigate', page: string, params: object } | { type: 'link', url: string }

### Requirement: 轮播图点击行为
轮播图 SHALL 支持部分幻灯片可点击、部分仅展示。点击时不使用 hero 飞行过渡。

#### Scenario: 游戏推荐幻灯片点击
- **WHEN** 用户点击类型为 'game' 的幻灯片
- **THEN** 导航到对应游戏详情页（router.push('detail', { id })），无飞行过渡

#### Scenario: 公告/更新/活动幻灯片点击
- **WHEN** 用户点击类型为 'announcement'/'update'/'event' 的幻灯片
- **THEN** 根据 action 配置执行对应操作（导航到指定页面或打开链接）

#### Scenario: 不可点击幻灯片
- **WHEN** 幻灯片的 action 为 null
- **THEN** 点击无响应，仅展示内容

### Requirement: 轮播图视觉设计
轮播图 SHALL 参考设计稿的视觉效果：全宽横幅、背景图片+渐变遮罩、标题/副标题/描述文字、左右导航箭头、底部进度指示器。

#### Scenario: 视觉效果
- **WHEN** 轮播图显示
- **THEN** 背景图片全宽显示，底部有渐变遮罩过渡到卡片区域
- **AND** 左下角显示标题（大字）、副标题和描述
- **AND** 左右两侧有半透明圆形导航箭头
- **AND** 底部中央有进度指示器（当前项为长条，其他为圆点）
- **AND** 可点击的幻灯片有视觉提示（如鼠标指针变为 pointer）

### Requirement: 暗色模式适配
轮播图 SHALL 适配暗色模式。

#### Scenario: 暗色模式
- **WHEN** 用户切换到暗色模式
- **THEN** 轮播图底部渐变遮罩过渡到暗色背景
- **AND** 文字和控件在暗色背景下清晰可见
