# 🎨 Feature Spec: 首页卡片动画效果优化

## 🎯 背景与动机 (Motivation)
当前系统中，搜索结果页的列表项已经具备了精致的交互动画（translateY + scale + 荧光笔光效），而首页卡片的交互显得相对平庸，产生了体验上的割裂感。

为了统一全局设计语言 (Design System)，我们需要将搜索页的高级动效下放到首页卡片。同时，为了提升首页的内容鲜活度，需新增一个悬浮的"刷新"按钮 (FAB)，配合阶梯式交错进退场动效 (Staggered Animations)，打造丝滑的无缝数据刷新体验。

## 💡 核心改动概览 (What Changes)
- **交互增强 (Hover Polish)**：引入 0.3s 的 translateY + scale 悬停动效，- **交错时序 (Staggered Timing)**：使用 CSS 变量 `--stagger-index` 实现阶梯式动画
- **刷新流程**：退场 → 数据加载 → 进场，点击刷新后，卡片先依次退场，等待数据加载完成，再依次进场
- **刷新按钮**：在右下角添加刷新按钮，样式与日夜切换键相同

## 🔗 影响范围 (Impact)
- **Affected Specs**: 无
- **Affected Code**:
  - 🎨 src/css/styles.css（卡片动画样式）
  - 📄 index.html（刷新按钮 HTML）
  - 📜 src/js/pages/home.js（加载/刷新动画逻辑）

## 📖 核心需求场景 (BDD Scenarios)

### Requirement 1: 卡片悬停动画优化
系统 SHALL 为首页卡片添加即时悬停动画效果。

#### Scenario A: 悬停状态
- **GIVEN** 用户浏览首页
- **WHEN** 用户悬停卡片
- **THEN** 卡片立即放大上浮（无延迟）
- **AND** 动画时长为 0.3s
- **AND** 卡片放大时边缘不被周围卡片遮盖

### Requirement 2: 加载进入动效
系统 SHALL 为首页卡片添加阶梯式进入动画。

#### Scenario A: 页面加载
- **GIVEN** 用户进入首页
- **WHEN** 卡片加载完成
- **THEN** 卡片依次延时进入（左上 -> 右下阶梯式）
- **AND** 每张卡片有淡入 + 上移动画

### Requirement 3: 刷新退出和载入动效
系统 SHALL 为首页卡片添加完整的刷新动画流程。

#### Scenario A: 点击刷新
- **GIVEN** 用户在首页
- **WHEN** 点击刷新按钮
- **THEN** 卡片依次延时退出（淡出 + 下移）
- **AND** 数据刷新完成
- **AND** 卡片依次延时载入（淡入 + 上移）

### Requirement 4: 刷新按钮
系统 SHALL 在右下角添加刷新按钮。

#### Scenario A: 刷新按钮位置和样式
- **GIVEN** 用户浏览首页
- **WHEN** 查看页面底部
- **THEN** 刷新按钮位于右下角
- **AND** 样式与日夜切换键相同
- **AND** 点击时按钮图标旋转

## ⚙️ 技术实现参考 (Technical Implementation)

### 1. 卡片悬停动画（即时响应）

```css
.game-cards-container .glass-card {
    transition: transform 0.3s ease,
                opacity 0.3s ease,
                box-shadow 0.3s ease;
    z-index: 1;
}

.game-cards-container .glass-card:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 8px 30px rgba(236, 72, 153, 0.2);
    z-index: 10; /* 提权，防止被遮挡 */
}
```

### 2. 阶梯式动画（CSS 变量方案）

```css
.game-cards-container .glass-card {
    --stagger-index: 0;
    opacity: 0;
    transform: translateY(20px);
    transition-delay: calc(var(--stagger-index) * 50ms);
}

.game-cards-container .glass-card.is-loaded {
    opacity: 1;
    transform: translateY(0);
}

.game-cards-container .glass-card.is-exiting {
    opacity: 0;
    transform: translateY(20px);
}
```

### 3. 刷新按钮（右下角，样式与日夜切换键相同）

```html
<!-- 刷新按钮 -->
<button 
    id="refresh-cards-btn" 
    aria-label="Refresh content" 
    class="fixed w-12 h-12 rounded-full glass-card flex items-center justify-center btn-active cursor-pointer z-50 hover:scale-110 transition-transform" 
    style="bottom: max(env(safe-area-inset-bottom, 20px), 5rem); right: 1rem;"
>
    <i class="ri-refresh-line text-xl"></i>
</button>
```

### 4. 刷新流程逻辑

```javascript
let isRefreshing = false;

async function refreshCards() {
    if (isRefreshing) return;
    isRefreshing = true;
    
    const btn = document.getElementById('refresh-cards-btn');
    const icon = btn.querySelector('i');
    const currentCards = document.querySelectorAll('.game-cards-container .glass-card');
    const maxDelay = currentCards.length * 50 + 300;
    
    // 1. 触发退场动画
    currentCards.forEach((card, index) => {
        card.style.setProperty('--stagger-index', index);
        card.classList.remove('is-loaded');
        card.classList.add('is-exiting');
    });
    
    // 2. 等待退场动画完成
    await delay(maxDelay);
    
    // 3. 刷新数据
    await fetchNewData();
    
    // 4. 触发进场动画
    const newCards = document.querySelectorAll('.game-cards-container .glass-card');
    newCards.forEach(card => card.classList.add('is-loaded'));
    
    isRefreshing = false;
}
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 动画与质感 (Animation & Polish)
- [ ] 悬停即时性：鼠标移入卡片瞬间触发放大与上浮
- [ ] 遮挡测试：卡片放大时边缘不被周围卡片遮盖
- [ ] 律动感：首屏加载与刷新时卡片呈现阶梯式加载

### 🛡️ 鲁棒性与异常流 (Robustness & Edge Cases)
- [ ] 狂点测试：疯狂点击刷新按钮不会重复请求或 DOM 错乱
- [ ] 网络异常：刷新失败时卡片恢复正常状态

### 📱 适配与无障碍 (A11y & Mobile)
- [ ] 移动端安全区：刷新按钮不被系统栏遮挡
- [ ] 无障碍：按钮有 aria-label
