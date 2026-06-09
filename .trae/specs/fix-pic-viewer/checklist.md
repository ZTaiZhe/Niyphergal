# 图片查看器功能修复检查清单

## ImageViewer 组件（JS 逻辑）
- [x] ImageViewer.open(mediaList, index) 方法正确创建并显示查看器 DOM
- [x] ImageViewer.close() 方法正确销毁查看器 DOM 并恢复页面滚动
- [x] 图片加载成功后正确显示，加载失败显示错误占位图
- [x] 滚轮缩放在 0.5x ~ 5x 范围内工作正常
- [x] 缩放中心为鼠标位置
- [ ] **[FAIL]** 放大(+)按钮每次放大 1.25x — `viewer-zoom-in` 传入 delta=0.25，zoom() 内部计算 `scale * 0.25` 会导致缩小而非放大；应传 1.25
- [ ] **[FAIL]** 缩小(-)按钮每次缩小 1.25x — `viewer-zoom-out` 传入 delta=-0.25，导致负值被 clamp 到 0.5，无法正常缩小；应传 0.8（或改用加法模式）
- [x] 重置按钮恢复图片到适应屏幕大小
- [x] 缩放超出视口时可拖拽平移
- [x] 多张图片时左右箭头正确切换
- [x] 触摸滑动可切换图片（移动端）
- [x] 首尾循环切换正常
- [x] ESC 键关闭查看器
- [x] 点击背景关闭查看器
- [ ] **[WARN]** 控件 3 秒无操作后自动淡出 — 实际值为 2500ms（2.5秒），与规格的 3 秒有 500ms 偏差
- [x] 鼠标移动/触摸时控件重新显示

## ImageViewer 样式（CSS）
- [x] 查看器遮罩层全屏覆盖（fixed inset-0, z-index: 200）
- [x] 背景为半透明黑色 + backdrop-blur 效果
- [x] 图片居中显示，不超过视口范围
- [x] 关闭按钮：右上角圆形玻璃态卡片，含 X 图标
- [x] 缩放按钮组：右下角玻璃态面板，含 + / - / 重置按钮
- [x] 导航箭头：左右两侧半透明玻璃态圆形按钮
- [x] 底部图片计数指示器（如 "2 / 5"）样式正确
- [x] 控件淡出动画平滑（opacity transition ~350ms）
- [x] 图片切换滑动过渡动画正常

## 事件绑定
- [x] media-item 图片元素包含 data-action="open-image-viewer"
- [x] media-item 图片元素包含 data-index 属性
- [x] EventDelegation 中 open-image-viewer action 正确调用 ImageViewer.open()
- [x] 当前游戏的所有 media 数据正确传递给 ImageViewer

## 构建验证
- [x] npm run build 无错误
- [x] 构建产物包含 ImageViewer 相关代码（JS 和 CSS 均已确认）

---

## 验证摘要

| 分类 | 总数 | 通过 | 失败 | 警告 |
|------|------|------|------|------|
| JS 逻辑 | 16 | 13 | 2 | 1 |
| CSS 样式 | 9 | 9 | 0 | 0 |
| 事件绑定 | 4 | 4 | 0 | 0 |
| 构建验证 | 2 | 2 | 0 | 0 |
| **合计** | **31** | **28** | **2** | **1** |

### 失败项详情

#### 1. 放大(+)按钮缩放方向错误 (CP-JS-06)
- **文件**: [eventDelegation.js:123-124](file:///d:/\.A素材/Niypher/Niypher/src/js/modules/eventDelegation.js#L123-L124)
- **问题**: `ImageViewer.zoom(0.25, ...)` 传入 delta=0.25
- **实际行为**: zoom() 计算 `newScale = scale * 0.25`，如 scale=1 则 newScale=0.25（被 clamp 到 0.5），结果是**缩小**
- **预期行为**: 每次点击放大 1.25 倍（即 newScale = scale * 1.25）
- **修复建议**: 将 delta 从 `0.25` 改为 `1.25`

#### 2. 缩小(-)按钮无效 (CP-JS-07)
- **文件**: [eventDelegation.js:127-128](file:///d:/\.A素材/Niypher/Niypher/src/js/modules/eventDelegation.js#L127-L128)
- **问题**: `ImageViewer.zoom(-0.25, ...)` 传入 delta=-0.25
- **实际行为**: zoom() 计算 `newScale = scale * (-0.25)` 为负值，被 clamp 到 0.5，**始终跳到最小值**
- **预期行为**: 每次点击缩小为原来的 1/1.25（即 0.8 倍）
- **修复建议**: 将 delta 从 `-0.25` 改为 `0.8`

### 警告项详情

#### 3. 控件自动淡出时间偏差 (CP-JS-15)
- **文件**: [components.js:427](file:///d:/\.A素材/Niypher/Niypher/src/js/modules/components.js#L427)
- **问题**: `setTimeout(() => this.hideControls(), 2500)` 使用 2500ms
- **规格要求**: 3 秒（3000ms）
- **影响**: 功能正常，仅时间差 500ms，用户体验影响极小
