# 移除个性推荐行并复用推荐算法 Spec

## Why
当前首页存在独立的"为你推荐"个性推荐行，占据额外空间且与下方全部游戏卡片网格重复展示。推荐算法（余弦相似度 + 时间衰减）本身有价值，应将其复用于首页游戏排序和搜索结果排序中，而非作为独立区块展示。

## What Changes
- 移除首页"为你推荐"个性推荐行 UI（`buildRecommendationRow` 及其渲染）
- 将 `EdgeRecommender` 推荐算法复用于首页全部游戏卡片的排序（替代当前的随机打乱）
- 将 `EdgeRecommender` 推荐算法与搜索相关度算法结合，用于搜索结果排序
- 移除推荐行相关的 CSS 样式
- 保留 `EdgeRecommender` 类及其核心算法，新增 `scoreGame` 方法供排序使用
- 保留 `trackBehavior` 行为追踪接口（供未来接入用户交互）
- 清理 `app.js` 中 `edgeRecommender` 功能开关和全局暴露（保留模块本身）

## Impact
- Affected specs: 首页渲染逻辑、搜索结果排序逻辑
- Affected code:
  - `src/js/pages/home.js` — 移除 `buildRecommendationRow`，修改 `renderHome` 和 `refreshCards`
  - `src/js/modules/recommendation.js` — 新增 `scoreGame` / `scoreAllGames` 方法
  - `src/js/pages/search.js` — 搜索结果排序中融合推荐分数
  - `src/js/modules/searchHelper.js` — `processResults` 支持推荐分数融合
  - `src/css/styles.css` — 移除 `.recommendation-*` 相关样式
  - `src/js/modules/animationHelpers.js` — 移除 `.recommendation-card` 选择器引用
  - `src/js/app.js` — 清理功能开关中的 `edgeRecommender` 条件判断

## ADDED Requirements

### Requirement: 首页游戏卡片个性化排序
系统 SHALL 使用 `EdgeRecommender` 的推荐算法对首页全部游戏卡片进行排序，替代当前的 `Math.random() - 0.5` 随机打乱。

#### Scenario: 有用户画像时
- **WHEN** 用户访问首页且存在用户兴趣画像
- **THEN** 游戏卡片按推荐分数（余弦相似度）降序排列，与用户兴趣最匹配的游戏排在最前

#### Scenario: 无用户画像时（冷启动）
- **WHEN** 用户首次访问首页，无用户兴趣画像
- **THEN** 游戏卡片按随机顺序排列（与当前行为一致）

#### Scenario: 刷新首页
- **WHEN** 用户点击刷新按钮
- **THEN** 重新计算推荐分数并重排游戏卡片，使用 FLIP 动画平滑过渡

### Requirement: 搜索结果推荐融合排序
系统 SHALL 在搜索结果排序中将推荐分数与搜索相关度分数结合，使搜索结果既符合查询意图又偏向用户兴趣。

#### Scenario: 有用户画像时的搜索
- **WHEN** 用户执行搜索且存在用户兴趣画像
- **THEN** 搜索结果按综合分数排序：`finalScore = relevanceScore * 0.7 + recommendScore * 0.3`，其中 `recommendScore` 归一化到 0-100 范围

#### Scenario: 无用户画像时的搜索
- **WHEN** 用户执行搜索且无用户兴趣画像
- **THEN** 搜索结果仅按搜索相关度排序（与当前行为一致，推荐权重为 0）

#### Scenario: 用户手动选择排序方式时
- **WHEN** 用户在搜索结果中手动选择按标题或日期排序
- **THEN** 按用户选择的排序方式排序，不融合推荐分数

### Requirement: EdgeRecommender 新增评分方法
系统 SHALL 在 `EdgeRecommender` 类中新增 `scoreAllGames(allGames)` 方法，返回所有游戏的推荐分数映射。

#### Scenario: 计算全部游戏推荐分数
- **WHEN** 调用 `scoreAllGames(allGames)`
- **THEN** 返回 `Map<gameId, score>`，score 为 0-1 范围的余弦相似度值；无画像时所有游戏分数为 0

## MODIFIED Requirements

### Requirement: 首页渲染
首页不再渲染"为你推荐"个性推荐行。首页布局为：顶部"游戏推荐"标签栏 → 全部游戏卡片网格（按推荐分数排序）→ 公告弹窗。

### Requirement: 搜索结果排序
搜索结果默认排序从纯相关度排序变更为相关度 + 推荐融合排序。手动排序（标题/日期）不受影响。

## REMOVED Requirements

### Requirement: 个性推荐行 UI
**Reason**: 推荐算法复用于首页排序和搜索融合，不再需要独立的推荐行 UI
**Migration**: 移除 `buildRecommendationRow()` 函数、`.recommendation-*` CSS 样式、`data-rec-rank` 属性
