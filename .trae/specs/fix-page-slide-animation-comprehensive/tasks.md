# Tasks

- [x] Task 1: 修复 pop 模式动画方向逻辑
  - [x] 将 pop 模式下的字符串替换逻辑替换为直接使用 `getAnimationDirection(prevIndex, currIndex)` 的返回值
  - [x] 当前错误代码：对 `getAnimationDirection` 结果做 `.replace()` 反转，导致方向二次反转
  - [x] 修复后：pop 模式直接使用 `const direction = getAnimationDirection(prevIndex, currIndex); animationClass = direction.animationClass; oldAnimationClass = direction.oldAnimationClass;`
  - [x] 验证：从分类页返回首页时，首页从左侧滑入（不是从右侧）

- [x] Task 2: 修复动画覆盖分支中 oldContent 的来源
  - [x] 当前 `oldContent = container.innerHTML` 包含所有 section，导致旧页面层显示多个 section
  - [x] 修改为：仅提取旧页面 section 的 innerHTML 作为 `oldContent`
  - [x] 代码：`const oldPageSection = router.previous ? container.querySelector('section[data-page="${router.previous}"]') : null; const oldContent = oldPageSection ? oldPageSection.innerHTML : container.innerHTML;`
  - [x] 验证：动画过程中旧页面层仅显示旧页面内容，不会出现视觉错位

- [x] Task 3: 构建并部署验证
  - [x] `npx vite build`
  - [x] `npx wrangler pages deploy dist --project-name=niypher`
  - [x] 验证所有页面间切换动画方向正确

# Task Dependencies
- Task 1 和 Task 2 可并行
- Task 3 依赖 Task 1 和 Task 2
