# Tasks

- [x] Task 1: 修改 CSS — 移除 section 动画的 position/absolute 规则，仅保留 z-index
  - [x] 移除 `section[data-page].animate-slide-out-*` 和 `animate-fade-out` 的 `position: absolute; top: 0; left: 0; width: 100%`
  - [x] 保留 `z-index: 5`（退出）和 `z-index: 1`（进入）
  - [x] 验证：CSS 中不再有 section 动画的 position 规则

- [x] Task 2: 提取 `animateSlideTransition()` 函数
  - [x] 创建函数签名：`animateSlideTransition(container, oldSection, newSection, animationClass, oldAnimationClass, onComplete)`
  - [x] 函数内部流程：
    1. 保存容器原始 `overflow` 和 `position`
    2. 设容器 `overflow: hidden; position: relative`
    3. 设新 section 内容（如需）和 `display: block`
    4. 强制 reflow（`void newSection.offsetHeight`）
    5. 捕获旧 section 的 `offsetTop`、`offsetLeft`、`offsetWidth`（此时容器已是 offsetParent）
    6. 设旧 section 内联样式：`position: absolute; top: offsetTop; left: offsetLeft; width: offsetWidth`
    7. 添加退出动画 class 到旧 section
    8. 强制 reflow（`void oldSection.offsetHeight`）
    9. 添加进入动画 class 到新 section
    10. `waitForAnimationEnd(newSection, 500)` 后执行清理：
        - 移除动画 class
        - 移除旧 section 内联 `position/top/left/width` 样式
        - 隐藏旧 section
        - 恢复容器 `overflow` 和 `position`
        - 调用 `onComplete()`
  - [x] 处理 `prefers-reduced-motion`：跳过动画直接切换
  - [x] 验证：函数可独立调用，不依赖外部变量

- [x] Task 3: 重写主动画分支，使用 `animateSlideTransition()`
  - [x] 替换 `else if (animationClass && router.previous)` 分支中的内联动画逻辑
  - [x] 调用 `animateSlideTransition(container, oldSection, newSection, animationClass, effectiveOldAnimationClass, callback)`
  - [x] callback 中执行 `_renderedSections.add()` 和 `afterPageSwitch()`
  - [x] 验证：push 和 pop 方向正确，旧 section 不跳动

- [x] Task 4: 构建验证
  - [x] 运行 `npx vite build` 确认无构建错误
  - [x] 验证：所有页面切换动画方向正确，容器不塌陷，旧 section 不跳动

# Task Dependencies
- [Task 2] 依赖 [Task 1]（CSS 先改，JS 才能正确使用）
- [Task 3] 依赖 [Task 2]
- [Task 4] 依赖 [Task 1, Task 2, Task 3]
