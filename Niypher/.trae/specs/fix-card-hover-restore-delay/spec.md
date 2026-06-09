# 修复推荐页卡片悬停恢复延迟规范

## Why
推荐页（首页）卡片在鼠标离开时，卡片落下的等待时间过长，原因是 `transition-delay: calc(var(--stagger-index) * 50ms)` 影响了悬停恢复动画。搜索页卡片没有这个问题，因为搜索页卡片没有设置 `--stagger-index` 属性。

## What Changes
- 修改 CSS，确保悬停恢复动画不受 `transition-delay` 影响
- 添加 `:not(:hover)` 状态或在默认状态中覆盖 transition-delay

## Impact
- Affected specs: 游戏卡片交互效果
- Affected code: `src/css/styles.css`

## MODIFIED Requirements

### Requirement: 卡片悬停恢复即时响应
卡片在鼠标离开时应当立即开始恢复动画，不受 `transition-delay` 影响。

#### Scenario: 鼠标离开卡片
- **WHEN** 用户鼠标离开推荐页卡片
- **THEN** 卡片立即开始恢复动画（无延迟）
- **THEN** 效果与搜索页一致
