# Tasks

- [x] Task 1: CSS 新增 `.hero-clone-content` 样式
  - [x] 1.1 在 `styles.css` 的 Hero Transition 区域添加 `.hero-clone-content` 规则：`width:100%; height:100%; object-fit:cover; display:block; will-change:transform;`
  - [x] 1.2 更新 `.hero-clone` 的 `will-change` 为 `left, top, width, height, border-radius`（保持不变）
  - **验证**: ✅ 构建无报错

- [x] Task 2: 重写 `animationHelpers.js` 克隆创建逻辑（双层结构）
  - [x] 2.1 创建 `<div>` 作为框架，`className='hero-clone'`，inline style 设置 `left/top/width/height/borderRadius`
  - [x] 2.2 创建 `<img>` 作为内容，`className='hero-clone-content'`，设置 `src`（含 data: 占位符回退逻辑）
  - [x] 2.3 img 附加到 div，div 附加到 document.body
  - [x] 2.4 移除旧的单层 `<img>` 克隆创建代码
  - **验证**: ✅ 克隆为 `<div.hero-clone><img.hero-clone-content></div>` 结构

- [x] Task 3: 重写框架飞行动画（Phase 1）
  - [x] 3.1 框架动画保持 3 帧弧线关键帧（offset: 0 / 0.45 / 1.0），属性仅 `left/top/width/height/borderRadius`
  - [x] 3.2 时长 350ms，缓动 `cubic-bezier(0.4, 0.0, 0.2, 1.0)`，`fill:'forwards'`
  - [x] 3.3 `prefers-reduced-motion` 降级：2 帧 200ms ease-out 无弧线
  - **验证**: ✅ 框架从卡片位置沿弧线飞到详情页主图位置并固定

- [x] Task 4: 实现内容弹簧简谐运动（Phase 2）
  - [x] 4.1 在框架动画 `onfinish` 中启动内容弹簧动画
  - [x] 4.2 计算位移：归一化方向向量 × `clamp(8, distance×0.06, 24)`
  - [x] 4.3 弹簧关键帧 4 帧：offset 0 `(dispX,dispY)` → 0.40 `(0,0)` → 0.72 `(-dispX×0.4,-dispY×0.4)` → 1.0 `(0,0)`
  - [x] 4.4 弹簧参数：时长 220ms，缓动 `cubic-bezier(0.4, 0.0, 0.2, 1.0)`，`fill:'forwards'`
  - [x] 4.5 `prefers-reduced-motion` 降级：跳过弹簧动画
  - **验证**: ✅ 框架固定后，图片内容有弹簧振荡效果

- [x] Task 5: 重写动画清理逻辑
  - [x] 5.1 清理逻辑移到内容弹簧动画的 `onfinish` 中
  - [x] 5.2 降级模式下（无弹簧），清理逻辑在框架动画的 `onfinish` 中
  - [x] 5.3 保留超时兜底（800ms）
  - **验证**: ✅ 动画结束后克隆被移除，详情页内容正常显示

- [x] Task 6: 构建并部署验证
  - **验证**: ✅ 构建成功，部署到 https://ab308d4d.niyphergal.pages.dev

# Task Dependencies
- Task 2 依赖 Task 1（CSS 先就位）
- Task 3 依赖 Task 2（需要双层结构）
- Task 4 依赖 Task 3（弹簧在框架完成后启动）
- Task 5 依赖 Task 4（清理在弹簧完成后执行）
- Task 6 依赖 Task 5
