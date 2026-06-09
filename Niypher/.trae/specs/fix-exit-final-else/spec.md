# 退出飞行卡片延迟显示 — 遗漏的最终 else 分支 Spec

## Why
`fix-exit-suppress-animation` 仅在动画分支的 inner else（L1232-L1254）中添加了 `isHeroExitInFlight()` 检查，但**遗漏了最终 else 分支（L1326-L1349）**。hero exit 的 `!isHeroExitInFlight()` 阻止了动画分支条件（L1192），代码落入最终 else，该分支无条件调用 `setTimeout(initHomeAnimations, 50)` → 卡片走 `is-hidden` + rAF×2 stagger 路径，延迟约 82ms+index×50ms 才显示。

## 代码路径追踪

```
performHeroExit → _heroExitInFlight = true → router.push('home')
    ↓
render(_mode='push'):
    animationClass = 'animate-slide-in-left' (非空)
    ↓
    L1176 isDetailTransition? → false (router.current = 'home')
    L1192 anim条件: animationClass && router.previous && !isHeroExitInFlight() → FALSE → SKIP
    L1255 isProfileTransition || isSearchRefresh? → FALSE → SKIP
    L1326 最终 else → ENTERED! ← 使用 setTimeout(initHomeAnimations, 50)

    L1232 inner else (在动画块内) → 永远不会到达!
```

## What Changes
- 在 final else (L1326-L1349) 的 home 卡片初始化中增加 `isHeroExitInFlight()` 判断，飞行中使用 `revealHomeCardsImmediately()`

## Impact
- Affected specs: 退出飞行卡片显示
- Affected code:
  - `src/js/modules/renderer.js` — 最终 else 分支 home 初始化

## MODIFIED Requirements

### Requirement: 最终 else 分支也检查飞行状态
渲染器最终 catch-all else 分支 SHALL 在 hero 退出飞行进行中时使用 `revealHomeCardsImmediately()`。
