# Feature Spec: 移动端弹性适配与触控体验重构

## 🎯 背景与动机 (Motivation)
随着业务流量向移动端倾斜，当前 Web 端架构在移动设备（尤其是异形屏设备）上暴露出诸多原生体验的割裂感：
- **视口与布局（Viewport & Layout）**：由于 iOS Safari / Android 浏览器的地址栏动态收缩，传统的 100vh 会导致底部内容被遮挡或页面异常跳动；同时全面屏的"安全区 (Safe Area)"未被充分利用。
- **交互降级（Interaction）**：移动端不存在鼠标，导致 PC 端复用的 :hover 态在触摸后产生严重的"视觉粘滞"；且按钮物理点击热区（Touch Target）过小，极易发生误触。
- **输入灾难（Form & Keyboard）**：在 iOS Safari 上点击输入框常触发系统强制放大（Auto-Zoom）；软键盘弹起时常遮挡关键的输入表单与操作按钮。

**🎯 重构目标**：全面抛弃老旧的媒体查询堆砌，引入现代 CSS（dvh, clamp(), env(), overscroll-behavior），交付一套无限趋近于 Native App 的弹性适配与极致触控方案。

## 🛠 核心重构基石 (Core Strategies)

### 现代化视口与流式排版 (Modern Viewport)
- 彻底废弃 100vh，全面采用动态视口 100dvh (Dynamic Viewport Height)
- 采用 clamp() 实现 Typography 与 Spacing 的无极弹性缩放

### 异形屏与安全区融合 (Safe Area Adaptation)
- 开启 `<meta viewport-fit=cover>` 铺满刘海屏
- 注入 env(safe-area-inset-*) CSS 变量，绝对保护顶部状态栏与底部 Home 指示条

### 触控与输入表单原生化 (Native-feel Touch & Input)
- 防误触：利用伪元素将所有可交互热区扩大至苹果 HIG 标准的 ≥ 44px × 44px
- 隔离 Hover：利用 @media (hover: hover) 精准剥离移动端的悬停粘滞，改用 :active 注入真实的物理按压反馈
- 表单体验：控制 font-size: 16px 免疫 iOS 强制缩放，优化 inputmode 与 enterkeyhint 唤起最合适的系统级键盘

## 🔗 影响范围 (Impact)
- **Affected Specs**: mobile-adaptation-guidelines (新增移动端适配研发规范)
- **Affected Code**:
  - 📄 index.html（Meta 标签升级）
  - 🎨 src/css/styles.css（全局视口变量、Hover 隔离、安全区垫片、滚动穿透拦截）
  - 📜 src/js/modules/form.js（新增软键盘防遮挡的视口滚动逻辑）

## 📖 核心需求场景 (BDD Scenarios)

### Requirement 1: 动态视口与流式缩放

#### Scenario A: 视口高度自适应
- **GIVEN** 用户在移动端浏览器（如 iOS 15+ Safari）打开满屏页面
- **WHEN** 用户上下滑动导致浏览器底部地址栏/工具栏收起或展开
- **THEN** 页面高度 (100dvh) 平滑过渡适应，不产生底部内容被截断或意外的纵向滚动条

#### Scenario B: 流式字体缩放
- **GIVEN** 用户在不同宽度（如 iPhone SE 到 iPad Pro）的设备上浏览
- **WHEN** 页面渲染文本
- **THEN** 核心字体大小基于 clamp 规则自动无缝插值（在 14px - 18px 之间流式过渡）

### Requirement 2: 异形屏安全保护

#### Scenario C: 顶部刘海/灵动岛适配
- **WHEN** 用户使用 iPhone 14/15 Pro 横屏或竖屏浏览
- **THEN** 顶部导航栏元素自动避开传感器区域，不发生遮挡

#### Scenario D: 底部 Home 条防御
- **WHEN** 页面存在 Fixed 吸底操作栏（Bottom Action Bar）
- **THEN** 该栏内部自动追加 padding-bottom，确保所有按钮位于原生 Home 指示条的上方

### Requirement 3: 触控交互优化

#### Scenario E: 点击物理反馈与 Hover 剥离
- **WHEN** 用户手指点击商品卡片或按钮
- **THEN** 元素立即产生 :active 的缩放/变暗反馈，且手指移开后，绝对不会残留 :hover 的高亮样式

#### Scenario F: 隐形热区扩大
- **WHEN** 用户尝试点击视觉尺寸仅为 20x20px 的关闭图标 (X)
- **THEN** 即便手指落点存在轻微偏差（但在 44px 范围内），依然能成功触发点击，不引发用户的"瞄准焦虑"

### Requirement 4: 输入与软键盘体验

#### Scenario G: 免疫强制放大 (iOS Auto-Zoom)
- **WHEN** 用户在 iOS Safari 点击任一输入框获取焦点
- **THEN** 网页整体视口保持 100% 比例，绝不触发令用户晕眩的系统级 Zoom-in

#### Scenario H: 键盘智能弹开
- **WHEN** 用户点击页面底部的输入框，系统软键盘弹起
- **THEN** 页面自动将该输入框平滑滚动至屏幕中上方（可视区域内），确保输入内容不被键盘遮挡

## ⚙️ 技术实现参考 (Technical Implementation)

### 1. 视口 Meta 与安全区 CSS

```html
<!-- index.html: 开启 viewport-fit=cover 允许突破安全区绘制 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover">
```

```css
:root {
  --app-height: 100dvh;
  --font-base: clamp(14px, 1rem + 1vw, 18px);
  --safe-bottom: max(env(safe-area-inset-bottom), 16px);
  --safe-top: max(env(safe-area-inset-top), 0px);
}

.bottom-action-bar {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding-bottom: var(--safe-bottom);
}

.modal-overlay {
  overscroll-behavior-y: contain;
}
```

### 2. 精准的悬停隔离与触控反馈

```css
@media (hover: hover) and (pointer: fine) {
  .btn:hover {
    background-color: #E3E5E7;
  }
}

@media (hover: none) and (pointer: coarse) {
  .btn:active {
    transform: scale(0.96);
    transition: transform 0.1s;
  }
  
  .icon-small {
    position: relative;
  }
  .icon-small::after {
    content: '';
    position: absolute;
    top: -10px; right: -10px; bottom: -10px; left: -10px;
  }
}
```

### 3. 表单与软键盘防御

```css
input, textarea, select {
  font-size: 16px !important;
  appearance: none;
  -webkit-appearance: none;
}
```

```javascript
// src/js/modules/form.js
document.querySelectorAll('input, textarea').forEach(el => {
  el.addEventListener('focus', (e) => {
    setTimeout(() => {
      e.target.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 300);
  });
});
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 📱 屏幕与布局适配 (Screen & Layout)
- [ ] 刘海屏避让：在真实 iOS 设备（横/竖屏）测试，导航栏不被刘海遮挡
- [ ] Home 条保护：底部吸底元素（TabBar 或提交按钮）完全位于 Home 指示条上方
- [ ] 动态视口测试：移动端 Safari 滚动隐藏/呼出地址栏时，首屏高度平滑缩放

### 🖱 交互与体验 (Touch & UX)
- [ ] 原生按压感：手机点击所有 Button/Card 均有明显的 :active 按压反馈
- [ ] Hover 粘滞阻断：手指点击带悬停效果的 UI 元素，移开手指后立即恢复原态
- [ ] 闭眼盲点测试：极小图标（如弹窗关闭按钮）极易触发，不需要精准瞄准
- [ ] 橡皮筋阻断：弹窗内滑动到底部继续拖拽，原网页绝对不跟着滚动

### ⌨️ 表单与键盘 (Keyboard)
- [ ] 免疫放大：iOS Safari 点击搜索框，页面不发生任何 Zoom-in 放大
- [ ] 智能防挡：点击贴近屏幕底部的输入框，软键盘弹起后输入框自动上推至可视区
- [ ] 智能键盘类型：搜索框键盘右下角显示"搜索"按钮；数字输入框呼出数字九宫格
