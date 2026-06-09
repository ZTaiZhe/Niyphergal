# 底部模糊遮罩高度改为卡片高度的33% - 任务列表

## 任务列表

- [x] Task 1: 修改 `.card-tag-section` 样式
  - 将 `position: relative` 改为 `position: absolute`
  - 添加 `bottom: 0; left: 0; right: 0;`
  - 添加 `height: 33.33%`

- [x] Task 2: 修改 `.card-tag-section::before` 样式
  - 将 `height: 90px` 改为 `inset: 0`

- [x] Task 3: 验证视觉效果
  - 检查不同屏幕尺寸下遮罩高度比例

## 任务依赖
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1, Task 2]
