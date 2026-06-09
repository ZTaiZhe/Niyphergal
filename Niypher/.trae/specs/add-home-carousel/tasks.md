# Tasks

- [x] Task 1: 在 data.js 中新增 DB.carouselSlides 硬编码数据
  - [x] 1.1 新增 carouselSlides 数组，包含 5 条示例数据（2 个游戏推荐 + 1 个公告 + 1 个更新 + 1 个活动）
  - [x] 1.2 每条数据包含 id、type、title、subtitle、description、image、action 字段
  - [x] 1.3 游戏推荐使用 DB.resources 中的 cover 图片，其他类型使用 AI 生成图片

- [x] Task 2: 新增 carousel.js 模块
  - [x] 2.1 创建 `initCarousel()` 函数：查找 `.carousel-container`，初始化状态（currentIndex、isPaused、timer）
  - [x] 2.2 实现自动播放：setInterval 每 6 秒切换，isPaused 时暂停
  - [x] 2.3 实现手动切换：左右箭头点击、进度指示器点击
  - [x] 2.4 实现切换动画：使用 Web Animations API，当前幻灯片滑出 + 新幻灯片滑入（0.8s ease）
  - [x] 2.5 实现进度指示器更新：当前项显示为长条，其他为圆点
  - [x] 2.6 鼠标悬停暂停/离开恢复
  - [x] 2.7 点击幻灯片：根据 action 配置执行导航（router.push）或打开链接，action 为 null 时无响应
  - [x] 2.8 导出 `initCarousel` 和 `renderCarousel(slides)` 函数

- [x] Task 3: 在 styles.css 中新增轮播图样式
  - [x] 3.1 `.carousel-container` — 全宽、固定高度（移动端 200px，桌面端 360px）、overflow:hidden、relative、rounded-xl
  - [x] 3.2 `.carousel-slide` — absolute inset-0、背景图 cover + 底部渐变遮罩
  - [x] 3.3 `.carousel-content` — 左下角定位、标题/副标题/描述样式、文字阴影
  - [x] 3.4 `.carousel-arrow` — 半透明圆形按钮、backdrop-blur、左右居中定位、hover 效果
  - [x] 3.5 `.carousel-indicators` — 底部居中、flex gap、当前项长条/其他圆点
  - [x] 3.6 `.carousel-gradient` — 底部渐变遮罩（从透明到页面背景色），与卡片区域自然衔接
  - [x] 3.7 暗色模式适配（渐变遮罩颜色、文字颜色）
  - [x] 3.8 可点击幻灯片 cursor:pointer

- [x] Task 4: 在 home.js 的 renderHome() 中插入轮播图 HTML
  - [x] 4.1 导入 renderCarousel 从 carousel.js
  - [x] 4.2 在 `game-cards-container` 之前插入 `renderCarousel(DB.carouselSlides)` 的输出
  - [x] 4.3 新增 `renderCarousel(slides)` 函数，生成包含所有幻灯片、箭头、指示器的 HTML

- [x] Task 5: 在 renderer.js 中初始化轮播图
  - [x] 5.1 导入 initCarousel 从 carousel.js
  - [x] 5.2 在首页渲染完成后调用 `initCarousel()`（initHomeAnimations 之后）
  - [x] 5.3 在 hero exit 拦截路径中也调用 `initCarousel()`

- [x] Task 6: 构建并部署

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 4] depends on [Task 1] and [Task 2]
- [Task 5] depends on [Task 2] and [Task 4]
- [Task 3] 可与 Task 2 并行
- [Task 6] depends on all previous tasks
