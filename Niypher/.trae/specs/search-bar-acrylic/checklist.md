# 搜索栏亚克力质感 - 检查清单

## 🧪 质感与基础交互 (Texture & Basics)
- [x] 毛玻璃效果：搜索栏能透出模糊后的底层图片（backdrop-filter 生效）
- [x] Safari 兼容性：`-webkit-backdrop-filter` 前缀已添加
- [x] 悬停过渡：鼠标移入/移出，背景白度和透明度平滑过渡

## ✨ 微交互动画 (Micro-Interactions)
- [x] HTML 结构：`.search-input-wrapper` 包裹层已添加
- [x] 触发时机：点击输入框，背景色变为 #e3e5e7
- [x] 横线生长：获取焦点时，底部粉色横线从左向右生长至全宽
- [x] 失焦回退：失去焦点时，横线平滑地向左侧收缩消失
- [x] 布局稳定性：动画使用 transform，无布局抖动

## 🌙 模式适配与 A11y (Dark Mode & A11y)
- [x] 深色质感：搜索栏背景变为深灰半透明 rgba(40, 40, 40, 0.6)
- [x] 深色 Hover：背景变为 rgba(60, 60, 60, 0.9)
- [x] 横线对比度：深色模式横线颜色 #E19CBB
- [x] 文字可见性：深色模式 Focus 背景色与文字对比度符合无障碍要求
- [x] 动效降级：`@media (prefers-reduced-motion: reduce)` 已添加
