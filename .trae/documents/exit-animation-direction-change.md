# 首页卡片退场动效方向修改计划

## 目标
将首页卡片的退场动效方向从向下改为向上。

## 当前状态
- 退场动效：卡片向下移动消失 (`translateY(20px)`)
- 相关CSS类：`.is-exiting`

## 修改内容

### 文件：`src/css/styles.css`

修改 `.game-cards-container .glass-card.is-exiting` 样式：

```css
/* 当前 */
.game-cards-container .glass-card.is-exiting {
    opacity: 0;
    transform: translateY(20px);
}

/* 修改后 */
.game-cards-container .glass-card.is-exiting {
    opacity: 0;
    transform: translateY(-20px);
}
```

### 文件：`src/js/pages/home.js`

修改 `refreshCards()` 函数中的退场动画逻辑，确保方向一致。

## 影响范围
- 首页卡片刷新时的退场动画
- 不影响进场动画（进场仍为从下往上）

## 验证要点
- [ ] 点击刷新按钮，卡片向上淡出消失
- [ ] 新卡片从下方淡入进入
- [ ] 动画流畅无闪烁
