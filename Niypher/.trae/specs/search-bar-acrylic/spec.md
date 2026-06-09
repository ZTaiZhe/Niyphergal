# 🎨 Feature Spec: 桌面端搜索栏亚克力质感与微交互重构

## 🎯 背景与动机 (Motivation)
当前桌面端搜索栏 (#desktop-search-bar) 采用简单的纯色背景，在日益丰富的页面视觉中缺乏层次感。为了与项目整体的"玻璃态 (Glassmorphism)"设计语言保持统一，我们需要引入亚克力质感 (Backdrop-filter)，赋予搜索栏更好的视觉深度与环境沉浸感。同时，参考 Material Design 的经典交互，为输入框引入底部焦点指示器 (Focus Line) 生长动画，以增强用户的输入反馈与空间感知。

## 💡 核心改动概览 (What Changes)
- **视觉层**：注入亚克力毛玻璃特效 (backdrop-filter: blur)，并重新调配 Light/Dark 模式下的半透明色值
- **交互层**：
  - 维持原有的悬停 (Hover) 提亮逻辑
  - 新增：输入框获取焦点 (Focus) 时，底部触发粉色横线从左至右的生长动画
- **结构层**：为解决 `<input>` 无法使用伪元素的技术限制，需在 HTML 中为 input 增加相对定位的包裹层 `.search-input-wrapper`

## 🔗 影响范围 (Impact)
- **Affected Specs**: 无
- **Affected Code**:
  - 📄 index.html（添加 .search-input-wrapper 包裹层 DOM 结构）
  - 🎨 src/css/styles.css（新增过渡动画与毛玻璃滤镜）

## 📖 核心需求场景 (BDD Scenarios)

### Requirement 1: 亚克力质感与悬停反馈 (Glassmorphism & Hover)
系统 SHALL 为搜索栏提供毛玻璃物理质感，并保留悬停时的透明度变化。

#### Scenario A: 默认静止状态
- **GIVEN** 用户浏览页面且未与搜索栏发生交互
- **WHEN** 搜索栏处于默认的 Idle 状态
- **THEN** 搜索栏呈现亚克力质感背景（模糊半径 12px）
- **AND** 保持基础的半透明视觉（opacity: 0.8）

#### Scenario B: 鼠标悬停提亮
- **GIVEN** 搜索栏处于默认状态
- **WHEN** 用户将鼠标光标悬停 (Hover) 在 #desktop-search-bar 区域内
- **THEN** 亚克力特效保留，但背景色变得更加不透明（趋近 #fff），整体透明度恢复为 1

### Requirement 2: 焦点生长动画与深色模式 (Focus Animation & Dark Mode)
系统 SHALL 在输入激活时提供明确的视觉引导，并完美兼容暗黑模式。

#### Scenario C: 激活输入状态 (Focus)
- **GIVEN** 用户准备进行搜索
- **WHEN** 用户点击 #header-search 输入框，使其获得光标焦点
- **THEN** 输入框背景色平滑过渡为 #e3e5e7
- **AND** 输入框底部出现一条品牌粉色 (#FE007F) 的横线指示器
- **AND** 该横线以顺滑的动画（300ms ease-out）从左向右生长（transform-origin: left），直至与输入框等宽

#### Scenario D: 失焦回退 (Blur)
- **GIVEN** 输入框处于焦点状态
- **WHEN** 用户点击页面空白处使输入框失去焦点
- **THEN** 粉色横线平滑地向左侧收缩消失（非瞬间消失，保留 300ms 退场动画）

#### Scenario E: 深色模式自适应 (Dark Mode)
- **GIVEN** 操作系统或应用当前处于深色 (Dark) 主题
- **WHEN** 渲染搜索栏
- **THEN** 亚克力底色自动切换为深色半透明（rgba(40, 40, 40, 0.6)）
- **AND** 焦点粉色横线自动切换为更柔和的深色适配粉 (#E19CBB)

## ⚙️ 技术实现与代码参考 (Technical Implementation)

### ⚠️ 核心防坑提示：`<input>` 伪元素限制与 DOM 重构
由于 `<input>` 是单标签替换元素（Replaced Element），浏览器不会渲染它的 `::before` 和 `::after`。必须修改 HTML 结构，增加一层 wrapper。

### 1. HTML 结构调整示例

```html
<!-- ❌ 变更前 (Before) -->
<div id="desktop-search-bar">
    <input type="text" id="header-search" placeholder="Search..." />
    <button id="search-btn">🔍</button>
</div>

<!-- ✅ 变更后 (After) -->
<div id="desktop-search-bar">
    <!-- 新增包裹层 -->
    <div class="search-input-wrapper">
        <input type="text" id="header-search" placeholder="Search..." />
    </div>
    <button id="search-btn">🔍</button>
</div>
```

### 2. 生产级 CSS 代码参考

```css
/* 1. 搜索栏主容器 - 亚克力特效 */
#desktop-search-bar {
    transition: background-color 0.3s ease, opacity 0.3s ease, border-color 0.3s ease;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px); /* 必须保留，兼容 Safari */
    opacity: 0.8;
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 6px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

#desktop-search-bar:hover {
    background: rgba(255, 255, 255, 0.9);
    opacity: 1;
}

/* 2. 输入框包裹层 (承载底部横线与 Focus-within 侦测) */
.search-input-wrapper {
    position: relative;
    flex: 1;
    height: 32px;
    display: flex;
}

/* 底部横线 - 初始状态 (宽度缩放为0) */
.search-input-wrapper::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: #FE007F;
    transform: scaleX(0);
    transform-origin: left; /* 动画锚点：靠左侧 */
    transition: transform 0.3s ease-out; /* 进场与退场共用 */
    border-radius: 2px;
    pointer-events: none; /* 防止遮挡 input 响应 */
}

/* 焦点激活时横线展开 */
.search-input-wrapper:focus-within::after {
    transform: scaleX(1);
}

/* 3. 输入框本体 */
#header-search {
    flex: 1;
    width: 100%;
    height: 100%;
    padding: 0 8px;
    outline: none;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    color: #1890a4;
    background: transparent;
    transition: background-color 0.3s ease;
}

#header-search:focus {
    background: #e3e5e7;
}

/* 4. 深色模式 (Dark Mode) */
body.dark #desktop-search-bar {
    background: rgba(40, 40, 40, 0.6);
    border-color: rgba(255, 255, 255, 0.1);
}

body.dark #desktop-search-bar:hover {
    background: rgba(60, 60, 60, 0.9);
}

body.dark #header-search:focus {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
}

body.dark .search-input-wrapper::after {
    background: #E19CBB; /* 低饱和度粉，防刺眼 */
}

/* 5. A11y 性能与无障碍降级 */
@media (prefers-reduced-motion: reduce) {
    #desktop-search-bar,
    #header-search,
    .search-input-wrapper::after {
        transition: none !important; /* 开启减弱动态效果时立刻屏蔽动画 */
    }
}
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 质感与基础交互 (Texture & Basics)
- [ ] 毛玻璃效果：在复杂背景图片上滑动页面，验证搜索栏能透出模糊后的底层图片（不应是一块实心色块）
- [ ] Safari 兼容性：在 macOS/iOS Safari 上打开，确认毛玻璃效果正常工作（测试 -webkit-backdrop-filter）
- [ ] 悬停过渡：鼠标移入/移出 #desktop-search-bar，背景白度和整体透明度有平滑过渡，无突变闪烁

### ✨ 微交互动画 (Micro-Interactions)
- [ ] 触发时机：点击输入框，背景色准确变为 #e3e5e7
- [ ] 横线生长：获取焦点时，底部粉色横线平滑地从左向右生长至全宽
- [ ] 失焦回退：点击页面空白处，粉色横线平滑地向左侧收缩消失
- [ ] 布局稳定性：动画过程中没有引起输入框内文字的跳动，或相邻 DOM 元素（如搜索按钮）的偏移

### 🌙 模式适配与 A11y (Dark Mode & A11y)
- [ ] 深色质感：切换至深色模式，确认搜索栏背景变为深灰半透明，边框变暗
- [ ] 横线对比度：深色模式下获取焦点，底部横线颜色变为 #E19CBB，确保不刺眼且清晰
- [ ] 文字可见性：深色模式下聚焦时，输入框背景色 (rgba(255, 255, 255, 0.1)) 与白色文字对比度良好
- [ ] 动效降级：操作系统开启"减弱动态效果"后，焦点横线瞬间出现/消失，无过渡动画
