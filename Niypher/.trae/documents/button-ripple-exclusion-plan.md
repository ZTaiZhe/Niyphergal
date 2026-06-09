# 按钮水波纹效果 - 排除底部导航栏

## 需求变更

用户反馈：**底部导航栏（docker栏）按钮不需要水波纹效果**

## 变更内容

### 修改 spec.md

更新"适用按钮范围"表格，将导航项 `.nav-item` 排除：

| 按钮类型 | 类名 | 是否启用 |
|----------|------|----------|
| 排序按钮 | `.sort-btn` | 是 |
| 筛选按钮 | `.filter-btn` | 是 |
| 移动端筛选按钮 | `.filter-btn-mobile` | 是 |
| 正倒序按钮 | `.order-toggle-btn` | 是 |
| ~~导航项~~ | ~~`.nav-item`~~ | ~~是~~ → **否** |
| 游戏卡片 | `.glass-card.btn-active` | 是 |
| 其他按钮 | `.btn-active` | 是 |

### JS 实现调整

在事件委托中排除 `.nav-item`：

```javascript
// 事件委托选择器排除 nav-item
document.addEventListener('click', (e) => {
    const button = e.target.closest('.btn-ripple:not(.nav-item)');
    if (button) {
        createRipple(e, button);
    }
});
```

或使用 CSS 类控制：

```css
/* 底部导航栏禁用水波纹 */
.nav-item {
    overflow: visible; /* 覆盖 overflow: hidden */
}
.nav-item .ripple {
    display: none;
}
```

## 推荐方案

**方案 A：CSS 类排除**（推荐）
- 不为 `.nav-item` 添加 `.btn-ripple` 类
- 简单直接，无需额外 JS 逻辑

**方案 B：选择器排除**
- 在 JS 事件委托中使用 `:not(.nav-item)` 排除
- 更灵活，但增加选择器复杂度

## 执行步骤

1. 更新 `spec.md` 适用范围表格
2. 更新 `checklist.md` 验收项
3. 实现时确保 `.nav-item` 不添加 `.btn-ripple` 类
