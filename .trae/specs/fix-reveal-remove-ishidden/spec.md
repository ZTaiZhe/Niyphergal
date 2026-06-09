# 退出飞行中卡片延迟显示修复 Spec

## Why
`renderHome()` 将所有卡片 HTML 硬编码 `is-hidden` 类（[home.js:L120](file:///D:/.A素材/Niypher/Niypher/src/js/pages/home.js#L120)）。`revealHomeCardsImmediately()` 仅添加 `is-loaded` 但未移除 `is-hidden`，导致卡片受双重 CSS 规则影响：`is-hidden` 的 `transition-delay: calc(var(--stagger-index) * 50ms)` 未被覆盖，卡片出现时间被 `--stagger-index` 延迟。高索引卡片（如原神）延迟可达 500ms+，与 clone 飞行时间（~570ms）重叠，用户感知为"飞行结束后才显示"。

## 根因链

```
renderHome() → HTML: glass-card is-hidden (硬编码)
    ↓
revealHomeCardsImmediately() → 仅 add is-loaded, 未 remove is-hidden
    ↓
CSS: is-hidden { transition-delay: calc(var(--stagger-index) * 50ms) }  ← 未被覆盖
     is-loaded { opacity: 1; transform: translateY(0) }                  ← 覆盖了 opacity/transform
     .is-loaded { transition: opacity 0.2s ease-out }                    ← 通用 transition
    ↓
卡片 0.2s 渐入，但延迟 = index × 50ms → 高索引卡片延迟 ≥500ms → 感知为不显示
```

## What Changes
- 在 `revealHomeCardsImmediately()` 中添加 `cards[i].classList.remove('is-hidden');` 移除硬编码的 `is-hidden` 类

## Impact
- Affected specs: 退出飞行卡片显示
- Affected code:
  - `src/js/pages/home.js` — `revealHomeCardsImmediately` 增加 `is-hidden` 移除

## MODIFIED Requirements

### Requirement: 退出飞行时卡片立即可见
`revealHomeCardsImmediately()` SHALL 移除卡片的 `is-hidden` 类并添加 `is-loaded` 类，消除 `is-hidden` 的过渡延迟。

#### Scenario: 从原神详情页返回首页
- **WHEN** 用户点击返回按钮触发反向飞行
- **THEN** 所有游戏卡片（包括原神卡片）在 clone 下方立即可见，不受 stagger-index 延迟
