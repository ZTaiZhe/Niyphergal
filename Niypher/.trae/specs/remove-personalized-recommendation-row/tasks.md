# Tasks

- [x] Task 1: 在 EdgeRecommender 中新增 scoreAllGames 方法
  - [x] SubTask 1.1: 新增 `scoreAllGames(allGames)` 方法，返回 `Map<gameId, score>`，score 为 0-1 范围余弦相似度；无画像时所有游戏分数为 0
  - [x] SubTask 1.2: 新增 `normalizeScore(score, maxScore)` 辅助方法，将推荐分数归一化到 0-100 范围供搜索融合使用

- [x] Task 2: 移除首页个性推荐行 UI
  - [x] SubTask 2.1: 删除 `home.js` 中 `buildRecommendationRow()` 函数
  - [x] SubTask 2.2: 修改 `renderHome()` 函数，移除 `recommendationRow` 变量和模板中的 `${recommendationRow}` 插入
  - [x] SubTask 2.3: 移除 `home.js` 中对 `edgeRecommender` 的 import（改为从 recommendation.js 导入 scoreAllGames）

- [x] Task 3: 首页游戏卡片使用推荐算法排序
  - [x] SubTask 3.1: 修改 `renderHome()` 中游戏卡片的排序逻辑，使用 `scoreAllGames` 替代默认顺序
  - [x] SubTask 3.2: 修改 `refreshCards()` 中的排序逻辑，使用 `scoreAllGames` 替代 `Math.random() - 0.5` 随机打乱；无画像时保留随机打乱

- [x] Task 4: 搜索结果融合推荐分数排序
  - [x] SubTask 4.1: 在 `searchHelper.js` 的 `processResults` 中新增可选参数 `recommendScores`，当传入时融合推荐分数（`finalScore = relevanceScore * 0.7 + recommendScore * 0.3`），仅默认排序时融合
  - [x] SubTask 4.2: 修改 `search.js` 中 `renderSearch`、`renderSearchResults`、`renderSearchResultsOnly` 三个函数，在搜索后调用 `scoreAllGames` 并将推荐分数传入 `processResults`

- [x] Task 5: 清理推荐行相关 CSS 和引用
  - [x] SubTask 5.1: 移除 `styles.css` 中 `.recommendation-row`、`.recommendation-header`、`.recommendation-title`、`.recommendation-scroll`、`.recommendation-card`、`.recommendation-cover`、`.recommendation-info`、`.recommendation-game-title`、`.recommendation-game-tags`、`.recommendation-tag-chip` 样式
  - [x] SubTask 5.2: 修改 `animationHelpers.js` 中 `.recommendation-card` 选择器引用
  - [x] SubTask 5.3: 清理 `app.js` 中 `edgeRecommender` 功能开关条件判断和导入

# Task Dependencies
- [Task 2] depends on [Task 1] (需要 scoreAllGames 方法来替代推荐行功能)
- [Task 3] depends on [Task 1] (需要 scoreAllGames 方法)
- [Task 4] depends on [Task 1] (需要 scoreAllGames 和 normalizeScore 方法)
- [Task 5] 无依赖，可与 Task 2-4 并行
