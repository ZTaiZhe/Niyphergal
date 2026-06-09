# 移动端弹性适配 - 检查清单

## 📱 屏幕与布局适配 (Screen & Layout)
- [x] Meta 标签已添加 viewport-fit=cover
- [x] CSS 变量 --app-height: 100dvh 已配置
- [x] CSS 变量 --font-base: clamp() 已配置
- [x] CSS 变量 --safe-bottom 和 --safe-top 已配置
- [x] 刘海屏避让：导航栏不被刘海遮挡
- [x] Home 条保护：底部 TabBar 完全位于 Home 指示条上方
- [x] 动态视口测试：Safari 地址栏收起时，首屏高度平滑适应
- [x] 滚动穿透阻断：Modal 添加 overscroll-behavior-y: contain

## 🖱 交互与体验 (Touch & UX)
- [x] Hover 样式已使用 @media (hover: hover) 隔离
- [x] 移动端 :active 点击反馈已添加 (transform: scale(0.96))
- [x] 触控热区已扩大（伪元素方案，≥ 44px）
- [x] Hover 粘滞验证：手指点击后移开，不保持 Hover 状态
- [x] 橡皮筋阻断：弹窗内滑动到底部，原网页不跟着滚动

## ⌨️ 表单与键盘 (Keyboard)
- [x] 输入框 font-size 最小 16px（防 iOS 自动放大）
- [x] appearance: none 已添加（消除默认外观）
- [x] enterkeyhint 属性已配置（搜索框显示"搜索"按钮）
- [x] inputmode 属性已配置（数字输入框）
- [x] 软键盘弹起时输入框居中（scrollIntoView）
