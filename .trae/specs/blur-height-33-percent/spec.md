# 🎨 Feature Spec: 底部模糊遮罩高度改为卡片高度的33%

## 🎯 背景与动机 (Motivation)
当前底部模糊遮罩使用固定的 `height: 90px`，在不同屏幕尺寸下无法保持卡片高度的 33%。需要改为相对于卡片高度的百分比。

## 💡 核心改动概览 (What Changes)
- 将 `.card-tag-section::before` 的 `height: 90px` 改为 `height: 33.33%`
- 调整 `.card-tag-section` 的定位方式，使其能够正确计算百分比高度

## 🔗 影响范围 (Impact)
- **Affected Code**:
  - 📜 src/css/styles.css (`.card-tag-section` 和 `.card-tag-section::before` 样式)

## ⚙️ 技术实现参考 (Technical Implementation)

### 当前代码问题
`.card-tag-section` 的高度由内容（标签）决定，不是卡片高度。因此 `height: 33.33%` 无法正确计算。

### 解决方案
将模糊遮罩层移到卡片容器上，使用 `position: absolute` 和 `height: 33.33%`：

```css
/* 在卡片上添加模糊遮罩层 */
.glass-card::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 33.33%;
    z-index: 1;
    pointer-events: none;
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
    background: linear-gradient(to top, var(--card-glass-tint) 0%, var(--card-glass-tint-fade) 100%);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transform: translateZ(0);
    will-change: transform;
    mask-image: linear-gradient(to top, black 0%, black 30%, rgba(0,0,0,0.5) 60%, transparent 100%);
    -webkit-mask-image: linear-gradient(to top, black 0%, black 30%, rgba(0,0,0,0.5) 60%, transparent 100%);
}
```

### 替代方案（更简单）
直接将 `.card-tag-section::before` 的 `height: 90px` 改为 `height: 33.33%`，并确保 `.card-tag-section` 使用 `position: absolute` 覆盖整个卡片：

```css
.card-tag-section {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 33.33%;
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
    isolation: isolate;
}

.card-tag-section::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
    background: linear-gradient(to top, var(--card-glass-tint) 0%, var(--card-glass-tint-fade) 100%);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transform: translateZ(0);
    will-change: transform;
    mask-image: linear-gradient(to top, black 0%, black 30%, rgba(0,0,0,0.5) 60%, transparent 100%);
    -webkit-mask-image: linear-gradient(to top, black 0%, black 30%, rgba(0,0,0,0.5) 60%, transparent 100%);
}
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 功能验证
- [ ] 模糊遮罩高度为卡片高度的 33%
- [ ] 不同屏幕尺寸下遮罩高度比例保持一致
- [ ] 标签文字清晰可读
