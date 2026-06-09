# Tasks

- [x] Task 1: 修复公告弹窗显示异常
  - [x] 将 `src/js/pages/home.js` 第 196 行 `'鎴戠煡閬撳簡'` 改为 `'我知道了'`
  - [x] 检查 `src/js/modules/foundation/data.js` 第 444 行公告内容，添加适当标点分隔提升可读性：`'欢迎来到NiypherGal，本站致力于提供高质量Galgame资源，请遵守社区规范，共同维护和谐环境。'`
  - [x] 验证：公告弹窗标题、内容、按钮文字均正确显示，无乱码

- [x] Task 2: 修复分类页 `.join()` 多余文字
  - [x] 将 `src/js/pages/category.js` 第 23 行 `.join('Pure Love')` 改为 `.join('')`
  - [x] 验证：分类页卡片之间无"Pure Love"文字

- [x] Task 3: 修复分类页动画类注入失败
  - [x] 修改 `src/js/modules/search/renderer.js`，分类页直接调用 `renderCategory(animationClass || '')` 传入动画类，不再使用失败的字符串替换
  - [x] 验证：导航到分类页时有淡入动画

- [x] Task 4: 修复底部导航"推荐"按钮未触发反飞行过渡
  - [x] 修改 `src/js/modules/ui/navigation.js` homeNavHandler，检查 `getHeroExitContext()`，若存在则调用 `performHeroExit(routerInstance)`
  - [x] 在文件顶部导入 `getHeroExitContext` 和 `performHeroExit`
  - [x] 验证：从详情页点底部"推荐"按钮时有反飞行过渡动画

- [x] Task 5: 修复骨架屏在页面切换时被隐藏
  - [x] 修改 `src/js/modules/search/renderer.js`，移除 `_willOverlayTransition` 时骨架屏 `display:none` 的逻辑
  - [x] 验证：导航到新页面时先看到骨架屏再看到真实内容

# Task Dependencies
- Task 1, 2 独立，可并行
- Task 3 依赖 Task 2（先修 join 再修动画注入）
- Task 4, 5 独立，可并行
