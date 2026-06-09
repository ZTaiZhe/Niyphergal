# 游戏卡片标签区域渐进模糊效果重构 - 任务列表

## 任务列表

- [x] Task 1: 重写 CSS 样式
  - 创建 `.card-tag-section` 父容器样式（包含 `isolation: isolate`）
  - 创建 `.card-tag-section::before` 伪元素模糊层（GPU 加速、非线性遮罩）
  - 创建 `.card-tag-content` 内容层样式
  - 删除旧的 `.card-blur-overlay` 样式

- [x] Task 2: 重构 renderGameCard 函数
  - 卡片容器使用响应式 `aspect-[4/3] sm:aspect-video min-h-[16rem]`
  - 添加 `role="button" tabindex="0"` 支持无障碍访问
  - 封面图片改为绝对定位，添加 `will-change-transform transform-gpu`
  - 添加 `onerror` 图片加载兜底
  - 标题区域使用 `line-clamp-2` 多行截断
  - 标签区域使用 `.card-tag-section` 和 `.card-tag-content`

- [x] Task 3: 验证视觉效果
  - 检查全卡覆盖验证
  - 检查极限亮色图验证
  - 检查零杂色污染验证
  - 检查 iOS Safari 兼容验证
  - 检查动画交互验证
  - 检查长文本溢出测试
  - 检查死链图片兜底测试
  - 检查响应式尺寸验证
  - 检查键盘访问测试
  - 检查性能监控

## 任务依赖
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
