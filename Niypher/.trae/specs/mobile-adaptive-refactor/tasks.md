# 移动端弹性适配 - 任务列表

## 🚩 Phase 1: 基础设施与视口重构 (Foundation)

- [x] Task 1: Meta 标签升级
  - 更新 viewport meta 标签，添加 viewport-fit=cover
  - 设置 maximum-scale=5.0（允许适度缩放）

- [x] Task 2: 全局 CSS 变量重写
  - 引入 --app-height: 100dvh 处理动态视口
  - 配置 --font-base: clamp(14px, 1rem + 1vw, 18px) 流式字体
  - 配置 --safe-bottom 和 --safe-top 安全区变量

- [x] Task 3: 安全区 (Safe Area) 垫片注入
  - 为 Footer 注入 padding-bottom: var(--safe-bottom)
  - 为 Bottom Navigation 注入安全区 padding
  - 为 Modal 添加 overscroll-behavior-y: contain 阻断滚动穿透

## 🚩 Phase 2: 布局弹性与组件重构 (Layout & Components)

- [x] Task 4: 搜索栏与导航适配
  - 移动端顶部搜索栏吸顶时增加 padding-top: var(--safe-top)
  - 避开刘海屏区域

- [x] Task 5: 隔离 Hover 态
  - 全局排查所有 :hover 伪类
  - 使用 @media (hover: hover) and (pointer: fine) 进行包裹

- [x] Task 6: 移动端点击反馈 (Active State)
  - 使用 @media (hover: none) and (pointer: coarse) 隔离移动端样式
  - 为按钮添加 :active 缩放反馈 (transform: scale(0.96))
  - 扩大触控热区（伪元素方案，≥ 44px）

## 🚩 Phase 3: 表单与极端场景防御 (Forms & Edge Cases)

- [x] Task 7: 修复 iOS 强制缩放缺陷
  - 强制移动端所有 input、textarea、select 的 font-size 最小为 16px
  - 添加 appearance: none 消除默认外观

- [x] Task 8: 软键盘防遮挡
  - 创建 src/js/modules/form.js 模块
  - 为输入框添加 focus 事件监听
  - 使用 scrollIntoView({ behavior: 'smooth', block: 'center' }) 确保居中

- [x] Task 9: 优化键盘类型
  - 为搜索框添加 enterkeyhint="search"
  - 为数字输入框添加 inputmode="numeric"

## 🚩 Phase 4: 验证

- [x] Task 10: 验证效果
  - 验证刘海屏适配
  - 验证 Home 条适配
  - 验证点击反馈
  - 验证 Hover 粘滞消除
  - 验证表单键盘体验

## 任务依赖
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 2]
- [Task 6] depends on [Task 5]
- [Task 7] depends on [Task 1]
- [Task 8] depends on [Task 7]
- [Task 9] depends on [Task 7]
- [Task 10] depends on [Task 4, Task 6, Task 8, Task 9]
