# Tasks

- [ ] Task 1: 安装 React 生态依赖
  - [ ] 1.1 安装运行时依赖: react, react-dom, motion, lucide-react
  - [ ] 1.2 安装开发依赖: @vitejs/plugin-react
  - [ ] 1.3 修改 vite.config.js 添加 react() 插件

- [ ] Task 2: 删除当前 vanilla JS 轮播图实现
  - [ ] 2.1 删除 src/js/modules/carousel.js
  - [ ] 2.2 删除 src/css/styles.css 中所有 .carousel-* 样式（约 L4646-L4942）

- [ ] Task 3: 创建 React 轮播图组件
  - [ ] 3.1 创建 src/js/components/GameCarousel.tsx，照搬源码，适配数据源和高度
  - [ ] 3.2 创建 src/js/components/carousel-entry.tsx，提供 mountCarousel/unmountCarousel 导出

- [ ] Task 4: 修改集成点
  - [ ] 4.1 修改 home.js: renderCarousel() 改为返回 `<div id="carousel-root"></div>`
  - [ ] 4.2 修改 renderer.js: initCarousel() 改为调用 mountCarousel()，页面切换时调用 unmountCarousel()

- [ ] Task 5: 构建验证
  - [ ] 5.1 运行 npm run build 确认无编译错误
  - [ ] 5.2 本地预览确认轮播图渲染和交互正常

# Task Dependencies
- [Task 2] depends on [Task 1] (需要 React 环境就绪才能验证)
- [Task 3] depends on [Task 1] (需要 React 依赖)
- [Task 4] depends on [Task 2] and [Task 3]
- [Task 5] depends on [Task 4]
