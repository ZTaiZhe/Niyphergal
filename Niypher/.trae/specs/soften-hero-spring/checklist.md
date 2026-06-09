# Checklist

## Task 1: 弹簧参数修改
- [x] amplitude = `Math.min(10, Math.max(3, distance * 0.02))`
- [x] duration = 320
- [x] 过冲 = dispX × 0.2（原 0.4）
- [x] easing = `cubic-bezier(0.25, 0.1, 0.25, 1.0)`
- [x] springFallback 超时 = 500

## Task 2: 端到端
- [x] 构建成功
- [x] 部署成功
