# 添加排序正倒序按钮 - 任务列表

## 任务列表

- [x] Task 1: 修改 router.js 添加 order 参数支持
  - 在 URL 参数中添加 order 参数
  - 确保 push/replace 模式正确处理 order 参数

- [x] Task 2: 修改 searchHelper.js 处理排序顺序逻辑
  - 在 processResults 函数中添加 order 参数处理
  - 实现升序/降序排序逻辑

- [x] Task 3: 修改 search.js 添加正倒序按钮
  - 在排序按钮后面添加正倒序切换按钮
  - 读取 URL 中的 order 参数
  - 添加 order 参数到 URL 切换逻辑

- [x] Task 4: 调用 UI 智能体设计正倒序按钮样式
  - 设计按钮视觉样式
  - 设计移动端适配

- [x] Task 5: 调用 UX 智能体设计动效
  - 设计按钮点击动效
  - 设计切换状态过渡动效

- [x] Task 6: 验证功能完整性
  - 验证正倒序切换功能
  - 验证 URL 参数正确更新
  - 验证动效正常运行

## 任务依赖
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] 和 [Task 5] depends on [Task 3]
- [Task 6] depends on [Task 4, Task 5]
