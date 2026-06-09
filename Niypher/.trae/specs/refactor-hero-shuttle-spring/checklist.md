# Checklist

## Task 1: CSS 样式
- [x] `.hero-clone-content` 规则存在且包含 `width:100%; height:100%; object-fit:cover; display:block; will-change:transform;`
- [x] `.hero-clone` 规则保持 `position:fixed; z-index:9999; pointer-events:none; overflow:hidden; box-shadow; will-change`

## Task 2: 双层克隆结构
- [x] 克隆为 `<div class="hero-clone"><img class="hero-clone-content"></div>` 结构
- [x] 框架 div 的 inline style 仅含 `left/top/width/height/borderRadius`
- [x] 内容 img 的 src 正确（含 data: 占位符回退）
- [x] 无旧的单层 `<img>` 克隆代码残留

## Task 3: 框架飞行动画
- [x] 3 帧关键帧（offset: 0 / 0.45 / 1.0）
- [x] 弧高 = `max(32, abs(dy) × 0.3)`，上限 80
- [x] 时长 = 350ms
- [x] 缓动 = `cubic-bezier(0.4, 0.0, 0.2, 1.0)`
- [x] fill = 'forwards'
- [x] 动画属性仅 `left/top/width/height/borderRadius`
- [x] prefers-reduced-motion 降级：2 帧 200ms ease-out

## Task 4: 内容弹簧简谐运动
- [x] 弹簧在框架 `onfinish` 后启动
- [x] 位移方向 = 从目标指向来源的归一化向量
- [x] 位移幅度 = `clamp(8, distance × 0.06, 24)`
- [x] 4 帧关键帧：0 `(dispX,dispY)` → 0.40 `(0,0)` → 0.72 `(-dispX×0.4,-dispY×0.4)` → 1.0 `(0,0)`
- [x] 时长 = 220ms
- [x] 缓动 = `cubic-bezier(0.4, 0.0, 0.2, 1.0)`
- [x] fill = 'forwards'
- [x] 动画属性仅 `transform`
- [x] prefers-reduced-motion 降级：跳过弹簧

## Task 5: 动画清理逻辑
- [x] 清理在内容弹簧 `onfinish` 中执行
- [x] 降级模式下清理在框架 `onfinish` 中执行
- [x] 超时兜底 800ms 存在
- [x] 清理内容：revealDetailContent → clone.remove → _heroInFlight=false → setHeroTransition(false)

## Task 6: 端到端
- [x] 构建成功（0 errors）
- [ ] 点击卡片：框架沿弧线飞到目标位置并固定
- [ ] 框架固定后：图片内容有弹簧振荡（朝来源偏移 → 过平衡点 → 过冲 → 回到平衡点）
- [ ] 动画结束后：克隆移除，详情页内容正常显示
- [ ] prefers-reduced-motion 下：简化动画，无弹簧
