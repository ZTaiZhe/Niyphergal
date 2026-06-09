# 取消首页游戏卡片上层的渐变模糊效果 - 任务列表

## 任务列表

- [x] Task 1: 移除 renderGameCard 函数中的渐变遮罩
  - 删除 `<div class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white via-white/80 to-transparent"></div>`

- [x] Task 2: 调整标题样式以适应无渐变背景
  - 添加文字阴影或背景，确保标题在图片上清晰可见

- [x] Task 3: 验证视觉效果
  - 检查浅色模式下标题可见性
  - 检查深色模式下标题可见性

## 任务依赖
- [Task 3] depends on [Task 1, Task 2]
