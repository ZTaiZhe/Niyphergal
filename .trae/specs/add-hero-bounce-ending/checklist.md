# Checklist

## Task 1: 变形+回弹关键帧
- [x] 动画时长 = 380ms
- [x] 4 帧 keyframes（offset: 0, 0.45, 0.82, 1.0）
- [x] offset 0.82: left/top = toRect + delta×0.06
- [x] offset 0.82: width = toRect.width × 0.94, height = toRect.height × 1.06
- [x] offset 1.0: 精确 toRect
- [x] fill = forwards
- [x] 无 transform 属性
- [x] prefers-reduced-motion 降级 2 帧 200ms

## Task 2: 端到端
- [x] 构建成功（vite build 0 errors）
- [x] 部署成功（Cloudflare Pages）
