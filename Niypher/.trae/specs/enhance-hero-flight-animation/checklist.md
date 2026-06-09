# Checklist

## Task 1: 弧线飞行路径 + 多关键帧动画
- [x] 弧线偏移计算正确（15% 垂直距离，最小 20px，最大 60px）
- [x] 5 个关键帧的 left/top 含弧线偏移
- [x] scaleX/scaleY 变形关键帧正确（25%: 1.05,0.95 → 75%: 0.97,1.03）
- [x] 最后一帧有 3px overshoot
- [x] 缓动曲线为 `cubic-bezier(0.22, 1.0, 0.36, 1.0)`
- [x] 动画时长 450ms
- [x] `animFinish` 中重置 `clone.style.transform = ''`
- [x] `prefers-reduced-motion` 降级：无变形、无回弹、200ms、ease-out

## Task 2: 端到端验证
- [x] 构建成功（vite build 0 errors）
- [x] 部署成功（Cloudflare Pages）
