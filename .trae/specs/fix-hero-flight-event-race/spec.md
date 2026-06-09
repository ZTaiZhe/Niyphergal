# Hero 飞行过渡消失修复 Spec

## Why
`fix-page-transition-performance` 移除了 `render()` 中的 `debounce(50ms)` 包装，导致 `detail:rendered` 事件在监听器注册前同步触发，形成事件时序竞争。飞行过渡表现为：hero-clone 在源位置静止约 800ms 后消失，详情页直接出现，无飞行/弹簧动画。

## 根本原因（唯一）

`performHeroNavigate()` 中的事件监听器注册顺序错误：

```javascript
// animationHelpers.js
routerInstance.push('detail', { id: targetId });  // ① 触发 render() → 同步 dispatchEvent('detail:rendered')
// ...                                                                ← 事件已发出！
var container = document.getElementById('main-container');
container.addEventListener('detail:rendered', onRendered, { once: true });  // ② 监听器来晚了
```

原来有 `debounce(50ms)` 时：render 延迟 50ms，监听器有充足时间注册。移除 debounce 后 render 同步执行，事件比监听器先到达。`{ once: true }` 导致监听器静默失效。

## 排除的冲突（已全面审查）

逐一检查了以下环节，**均无问题**：
| 检查项 | 结果 | 说明 |
|--------|------|------|
| `section[data-page]` 移除后再创建 | ✅ | `injectSection` 正确重建 section |
| `hero-clone` CSS z-index:9999 | ✅ | 固定定位在 body，指针事件为 none |
| `navigate-detail` 重复事件处理 | ✅ | 仅在 eventDelegation.js 处理 |
| `_heroInFlight` 死锁 | ✅ | 所有路径（含 fallback）均重置为 false |
| `getHeroTransition()` 控制 | ✅ | 正确阻止 `initDetailAnimations` 重复调用 |
| `_showDetailPage()` 查找 section | ✅ | `injectSection` 后 section 存在 |
| `revealDetailContent()` | ✅ | stagger 动画逻辑正确 |
| `visibility:hidden` vs getBoundingClientRect | ✅ | hidden 元素仍返回正确坐标 |
| `injectSection` transient 清理 | ✅ | detail 分支不存在过渡容器 |
| JS 语法错误 | ✅ | 构建通过 |

## What Changes
- 将 `container.addEventListener('detail:rendered', onRendered, { once: true });` 移至 `routerInstance.push('detail', ...)` **之前**（同一函数内）

## Impact
- Affected specs: hero 飞行过渡动画
- Affected code:
  - `src/js/modules/animationHelpers.js` — `performHeroNavigate` 中调整代码顺序

## MODIFIED Requirements

### Requirement: Hero 飞行过渡事件时序
系统 SHALL 在调用 `routerInstance.push('detail')` 之前注册 `detail:rendered` 事件监听器。

#### Scenario: 用户点击游戏卡片触发 hero 过渡
- **WHEN** 用户点击游戏卡片，`performHeroNavigate(sourceImg, id, router)` 被调用
- **THEN** 监听器先于 `router.push` 注册，`detail:rendered` 触发时 `onRendered` 正常执行，hero-clone 从源位置飞行到目标位置，弹簧动画播放，详情页 stagger 渐显

#### Scenario: hero-clone 正常完成动画
- **WHEN** hero 飞行动画和弹簧动画正常完成
- **THEN** 800ms fallback 被 `clearTimeout` 取消，`cleanup()` 正常清理 clone 并显示详情页
