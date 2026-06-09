# 搜索页全局入场动效优化 - 规范文档

## Why
在当前系统中，用户进入「搜索页」的页面级过渡动画是标准的左右滑动（X轴平移）。在产品空间隐喻中，这通常代表平级的页面流转。然而，全局搜索在交互逻辑上更偏向于一种**"全局覆盖层 (Global Overlay)"或"底部抽屉"**。为了强化搜索操作的全局感与沉浸感，需要重构搜索页的入场视觉流向。同时，为了消除首次加载与局部刷新之间的动效割裂感，需统一补齐结果列表项的交错入场动画。

## What Changes
本次重构将搜索页的路由动效拆分为三种独立的场景响应，外加列表级的初始动效：

- **入场 (Enter)**：从其他页面点击搜索框，整页自下而上推入（translateY(100%) -> 0）
- **退出-后退 (Pop/Back)**：点击返回键或物理手势返回，搜索页整页自上而下退出（translateY(0) -> 100%），底图露出之前的来源页面
- **退出-深入 (Push/Forward)**：在搜索页点击商品卡片跳转详情页，维持原有的左右滑动切换逻辑
- **列表初始化 (List Init)**：首次渲染结果项时，复用局部刷新的 `.is-entering` 类和 `--delay` 变量，实现自下而上的交错淡入

## Impact
- Affected Specs: fix-stagger-animation (UI/UX 动效与路由规范更新)
- Affected Code:
  - 🎨 src/css/styles.css（新增 `.page-slide-up-*` 和 `.page-slide-down-*` 过渡类名）
  - ⚙️ src/js/modules/renderer.js（重构首次渲染时的动画分发逻辑）
  - ⚙️ 路由配置文件（需新增动态 Transition 判定逻辑）

## ADDED Requirements

### Requirement 1: 场景化的页面级过渡 (Contextual Page Transition)
系统 SHALL 能够根据用户的具体导航行为（Push vs. Pop）动态判定并应用不同的路由动效。

#### Scenario A: 激活全局搜索 (Bottom-to-Top Overlay)
- **GIVEN** 用户当前处于首页、分类页或个人中心页等非搜索页面
- **WHEN** 用户点击全局"搜索"入口，触发路由正向跳转 (Push)
- **THEN** 搜索页面的整体 DOM 容器以"自下而上"的方式平滑覆盖当前屏幕

#### Scenario B: 撤销/离开搜索 (Top-to-Bottom Dismiss)
- **GIVEN** 用户当前正处于搜索结果页
- **WHEN** 用户点击页面上的"返回/取消"按钮，或使用手机物理返回键/边缘手势返回 (Pop)
- **THEN** 搜索页整页"向下"滑出屏幕消失 (translateY(0) -> 100%)
- **AND** 退出过程中，底部必须能看到平滑露出的上一级来源页面 (Previous Page)

#### Scenario C: 从搜索结果深入详情 (Right-to-Left Push)
- **GIVEN** 用户当前正处于搜索结果页
- **WHEN** 用户点击某个商品卡片，跳转至商品详情页 (Push)
- **THEN** 页面过渡动效使用系统原有的"左右滑动"逻辑（详情页从右侧滑入，搜索页向左侧滑出）

### Requirement 2: 搜索结果的阶梯式入场 (List Staggering)
系统 SHALL 保证搜索结果列表无论是首次加载还是局部刷新，都具备视觉一致的律动感。

#### Scenario D: 首次进入搜索页的数据加载
- **GIVEN** 用户刚刚自下而上进入了搜索页
- **WHEN** 首次搜索接口返回数据，且 `.glass-card` DOM 挂载完成
- **THEN** 列表容器内的卡片立即应用交错入场动效（自下而上淡入，50ms 交错延迟）

## Technical Constraints

### 1. 动态路由过渡的判定逻辑 ⚠️ (Hard)
前端框架默认较难区分"去往新页面"还是"返回老页面"。

**解决方案**：在路由钩子中监听动作类型（如 `history.action === 'POP'`）。

**动效分发**：
| Action | To/From | 类名 |
|--------|---------|------|
| PUSH && To: Search | 进入搜索页 | `.page-slide-up-enter` |
| POP && From: Search | 返回离开搜索页 | `.page-slide-down-leave` |
| PUSH && From: Search | 深入详情页 | 默认左右横滑类名 |

### 2. 首屏列表跳闪修复：强制重绘 (Reflow Hack)
首次渲染时，若直接赋予最终类名，由于 DOM 处于同一渲染帧，将丢失过渡动画。必须严格遵循以下代码时序：

```javascript
// 1. 初始化挂载 (隐藏态)
newCard.style.opacity = '0';
newCard.style.transform = 'translateY(16px)';
container.appendChild(newCard);

// 2. 强制触发浏览器重绘 (清空渲染队列)
void newCard.offsetHeight; // 关键的一步 ⚠️

// 3. 注入动效状态
newCard.style.transitionDelay = `calc(${index} * 50ms)`;
newCard.classList.add('is-entering');
```

### 3. iOS 边缘手势滑动冲突警告 🍎
已知问题：iOS 的全局屏幕左侧边缘右滑是原生系统级的横向切换，这与设计的"整页向下退出"会在视觉上产生撕裂。

**约束要求**：尽量依赖框架自带的 PWA 路由手势接管，或者在 CSS 中确保被手势拖拽时暂时禁用 `transform: translateY` 过渡。如果无法规避，需与 UX 沟通是否在 iOS Safari 端对原生返回手势进行视觉降级处理。

### 4. 性能与 A11y 降级
- **Compositor-Only**：动画必须严格限制在 `transform` 和 `opacity`
- **A11y (无障碍)**：若 `@media (prefers-reduced-motion: reduce)` 生效，强行应用 `transition: none !important` 覆盖所有位移

## QA 验收检查单 (Acceptance Checklist)

### 🔄 路由与页面跳转验证
- [ ] **入场**：点击搜索框，搜索页从底部推入，覆盖当前页，全程无卡顿
- [ ] **UI 按钮后退**：点击左上角的"返回"或"取消"按钮，搜索页向下滑动退出，露出原来的页面
- [ ] **物理键/手势后退**：使用安卓物理返回键或屏幕手势返回，搜索页同样向下滑动退出（重点验证 iOS 边缘滑动的兼容性视觉表现）
- [ ] **深入详情页**：点击任意商品卡片，详情页面从右侧横向滑入屏幕（不触发下移动效）
- [ ] **从详情页返回**：从详情页点击返回，详情页向右滑出，搜索页从左侧横向滑入还原（位置状态保留）

### ✨ 列表动效验证
- [ ] **首屏律动**：进入搜索页且 loading 结束后，首批数据卡片（.glass-card）呈现 50ms 阶梯式自下而上淡入
- [ ] **弱网无跳闪**：在 DevTools 开启 Slow 3G，确认 DOM 加载瞬间不会"先闪现卡片、再消失、再播放动画"
- [ ] **A11y 降级**：系统设置开启"减弱动态效果"后，所有滑动与交错效果立刻变为无动画的瞬间切换
