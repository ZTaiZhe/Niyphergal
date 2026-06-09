# Tasks

- [x] Task 1: 扩充拼音库覆盖范围
  - [x] SubTask 1.1: 检查 pinyin-pro npm 包是否可用，评估替换本地精简版的可行性
  - [x] SubTask 1.2: 在index.html中添加CDN完整版pinyin-pro，utils.js中优先使用CDN版
  - [x] SubTask 1.3: 保留本地pinyin-pro.js作为fallback
  - [x] SubTask 1.4: 更新 utils.js 中 chineseToPinyin/getFirstLetters 的pinyinInstance初始化方式
  - [ ] SubTask 1.5: 验证所有游戏标题的拼音转换正确性

- [x] Task 2: 实现模糊音映射模块
  - [x] SubTask 2.1: 创建 `src/js/modules/fuzzyPinyin.js`，定义9组模糊音映射表
  - [x] SubTask 2.2: 实现 `expandFuzzyPinyin(pinyin)` 函数
  - [x] SubTask 2.3: 实现 `getFuzzyVariants(pinyin)` 函数
  - [x] SubTask 2.4: 实现模糊音匹配评分
  - [ ] SubTask 2.5: 编写模糊音模块单元测试

- [x] Task 3: 优化SearchIndex增加模糊音索引层
  - [x] SubTask 3.1: 在 `searchIndex.js` 的 `buildIndex` 中新增 `fuzzyPinyinIndex` Map
  - [x] SubTask 3.2: 对每个游戏的拼音项，调用 `expandFuzzyPinyin` 生成模糊音变体
  - [x] SubTask 3.3: 在 `search` 方法中增加模糊音索引搜索逻辑
  - [x] SubTask 3.4: 模糊音搜索仅在精确匹配结果不足5条时触发
  - [x] SubTask 3.5: 处理多音字：导入chineseToPinyinArray和getFirstLettersArray

- [x] Task 4: 实现联想搜索功能
  - [x] SubTask 4.1: 在 `search.js` 中新增 `searchHistory`/`hotSearches`/`searchFrequency`
  - [x] SubTask 4.2: 实现 `loadSearchHistory()` 从localStorage读取
  - [x] SubTask 4.3: 实现 `saveSearchHistory(query)` 去重、限制10条
  - [x] SubTask 4.4: 实现 `getHotSearches()` 基于搜索频次
  - [x] SubTask 4.5: 搜索框focus且无输入时显示搜索历史+热门搜索
  - [x] SubTask 4.6: navigateToSearch时保存搜索历史
  - [x] SubTask 4.7: 实现联想建议UI（区分"搜索历史"/"热门搜索"/"猜你想搜"分区）

- [x] Task 5: 修复搜索模块空指针风险
  - [x] SubTask 5.1: 修复 `selectSuggestion` 中 `searchInput` 可能为null
  - [x] SubTask 5.2: 修复 `navigateToDetail`/`navigateToSearch` 中 `router` 未导入
  - [x] SubTask 5.3: 修复 `clearSuggestions` 中 `container` 可能为null
  - [x] SubTask 5.4: 修复 `handleKeydown` 中 `container` 可能为null

- [x] Task 6: 优化拼音工具函数
  - [x] SubTask 6.1: 优化 `chineseToPinyin` 使用getPinyinInstance()
  - [x] SubTask 6.2: 新增 `chineseToPinyinArray(text)` 函数
  - [x] SubTask 6.3: 优化 `getFirstLetters` 使用getPinyinInstance()
  - [x] SubTask 6.4: 新增 `getFirstLettersArray(text)` 函数

# Task Dependencies
- [Task 2: 模糊音映射模块] 是 [Task 3: SearchIndex模糊音索引] 的前置依赖
- [Task 1: 拼音库扩充] 是 [Task 6: 拼音工具函数优化] 的前置依赖
- [Task 3: SearchIndex模糊音索引] 是 [Task 4: 联想搜索] 的前置依赖
- [Task 5: 空指针修复] 无前置依赖，可并行执行
- [Task 2] 和 [Task 5] 可并行进行
