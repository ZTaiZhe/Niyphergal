# Tasks

- [x] Task 1: 在 renderer.js 中引入页面内容缓存机制
  - [ ] 在 `render()` 函数顶部添加 `_pageCache = {}` 对象
  - [ ] 首次渲染某页面后，将 `contentWithoutAnimation` 存入 `_pageCache[page]`
  - [ ] 再次导航到已缓存页面时，直接从缓存取内容，跳过骨架屏注入和页面渲染函数调用
  - [ ] 缓存内容需跳过动画类注入（使用缓存内容时直接用 `contentWithoutAnimation`）
  - [ ] 验证：首次导航渲染正常，再次导航直接显示缓存内容无闪烁

- [x] Task 2: 移除骨架屏注入逻辑
  - [ ] 删除 `getPageSkeleton()` 调用和骨架屏注入代码（第 1106-1113 行）
  - [ ] 保留 `getPageSkeleton` 和各页面的 `renderXxxSkeleton` 函数定义（不删除，仅不调用）
  - [ ] 验证：导航时不再出现骨架屏闪烁

- [x] Task 3: 修复分类页卡片消失
  - [ ] 检查 `renderCategory()` 输出的 HTML 是否包含正确的 `category-cards-container` class
  - [ ] 确认 `injectSection` 正确设置 `display: block`
  - [ ] 确认缓存机制下分类页内容正确复用
  - [ ] 验证：分类页 6 张卡片正常显示

- [x] Task 4: 修复详情页 visibility 问题
  - [ ] 检查 `renderDetail()` 输出的 `style="visibility:hidden"` 在缓存复用时是否正确被 `_showDetailPage()` 恢复
  - [ ] 确认 `initDetailAnimations()` 和 `revealDetailContent()` 都调用 `_showDetailPage()`
  - [ ] 验证：详情页内容正常显示，stagger 动画正常触发

- [x] Task 5: 修复反飞行过渡被干扰
  - [ ] 确认 hero exit 路径（第 1050-1071 行）使用缓存内容而非骨架屏
  - [ ] 确认 `revealHomeCardsImmediately()` 在缓存内容上正确工作
  - [ ] 验证：从详情页返回首页时 hero exit 动画正常执行

- [x] Task 6: 添加手动刷新清除缓存
  - [ ] 在 `refreshCards()` 和搜索刷新等手动刷新入口中，清除对应页面的 `_pageCache` 条目
  - [ ] 刷新后重新渲染并更新缓存
  - [ ] 验证：手动刷新后页面内容更新

# Task Dependencies
- Task 1 是核心，Task 2-5 依赖 Task 1
- Task 6 依赖 Task 1（缓存机制建立后才能清除）
- Task 3, 4, 5 可并行验证
