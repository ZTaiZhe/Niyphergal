# Tasks

- [x] Task 1: 修复动画分支条件，pop 模式不进入过渡动画
  - [x] SubTask 1.1: 在 renderer.js 第1187行动画条件中新增 `_mode !== 'pop'` 判断

- [x] Task 2: 修复公告弹窗显示时机
  - [x] SubTask 2.1: 从 home switch case 移除 `showAnnouncement` 调用
  - [x] SubTask 2.2: 在动画分支 injectSection 之后添加公告调用
  - [x] SubTask 2.3: 在 else 分支 injectSection 之后添加公告调用
  - [x] SubTask 2.4: 在最终 else 分支 injectSection 之后添加公告调用

- [x] Task 3: 修复 hero 飞行过渡 — injectSection 清理范围限定
  - [x] SubTask 3.1: injectSection 中仅在有过渡容器时才清理

- [x] Task 4: 提高 docker 栏 z-index
  - [x] SubTask 4.1: index.html 中 nav z-40 → z-[9999]

# Task Dependencies
- Task 1 是核心修复，影响 Task 2 和 Task 3
- Task 2 依赖 Task 1（公告的修复方式取决于动画分支是否执行）
- Task 3、4 独立于其他任务，可并行执行
