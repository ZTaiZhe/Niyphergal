# 合并刷新按钮到主页导航按钮 - 任务列表

## 任务列表

- [x] Task 1: 删除独立的主页刷新按钮元素
  - 从 index.html 中删除 `#refresh-cards-btn` 按钮
  - 注意：搜索页的 `.btn-retry` 重试按钮保留不变

- [ ] Task 2: 修改主页导航按钮结构
  - 给主页按钮添加 id（如 `#home-nav-btn`）以便 JS 操作
  - 保留原有导航逻辑

- [ ] Task 3: 修改 navigation.js 的 updateNav 函数
  - 检测当前是否在主页
  - 在主页时：切换图标为 ri-refresh-line，绑定刷新逻辑
  - 不在主页时：切换图标为 ri-home-4-line，绑定导航逻辑

- [ ] Task 4: 修改 home.js 的 initRefreshButton 函数
  - 改为操作主页导航按钮而非独立刷新按钮

- [x] Task 5: 验证效果
  - 在主页时点击主页按钮执行刷新
  - 在其他页面时点击主页按钮导航到主页
  - 图标正确切换
  - 搜索页重试按钮功能正常

## 任务依赖
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 4]