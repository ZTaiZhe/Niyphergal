# Tasks

- [x] Task 1: 移除 fast path，恢复动画流程
  - [x] 删除 `render()` 中 `sectionAlreadyRendered` 时直接切换 display 并 return 的 fast path 代码块（约 1081-1107 行）
  - [x] 验证：页面间导航不再瞬间切换

- [x] Task 2: 修改动画覆盖分支支持 pop 模式
  - [x] 修改 `animationClass` 赋值逻辑：`pop` 模式下也计算动画方向（反向）
  - [x] 修改动画覆盖分支条件：移除 `_mode !== 'pop'` 限制，允许 pop 模式进入滑动动画分支
  - [x] pop 模式下：新页面用 `animate-slide-in-left`，旧页面用 `animate-slide-out-right`
  - [x] 验证：从分类页返回首页时，首页从左侧滑入

- [x] Task 3: 确保动画完成后保留 DOM 状态
  - [x] 在动画覆盖分支的 `waitForAnimationEnd` 回调中，`_shouldPreserve` 逻辑保持不变（`injectSection` 的 `preserveExisting` 参数）
  - [x] 在 `else` 分支中也确保 `_shouldPreserve` 正确传递
  - [x] 添加滚动位置恢复逻辑（所有分支）
  - [x] 验证：动画播放完成后，返回的页面 DOM 状态保持（卡片不重播动画、轮播图位置不重置）

- [x] Task 4: 处理动画覆盖分支中 oldContent 的来源
  - [x] `oldContent = container.innerHTML` 已包含所有 section，动画容器正确显示旧页面内容
  - [x] 动画完成后 `injectSection` 使用 `preserveExisting` 保留 DOM 状态
  - [x] 验证：动画过程中旧页面内容正确显示

# Task Dependencies
- Task 1 是基础，Task 2 依赖 Task 1
- Task 3 和 Task 4 可与 Task 2 并行，但需在 Task 1 之后
- Task 4 依赖 Task 1（移除 fast path 后才能测试动画覆盖分支）
