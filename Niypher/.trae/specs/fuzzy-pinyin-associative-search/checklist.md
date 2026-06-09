# 模糊音与联想搜索优化检查清单

## 拼音库覆盖

- [x] chineseToPinyin 优先使用CDN完整版pinyin-pro（覆盖2万+汉字），本地版作为fallback
- [x] 游戏标题中所有汉字均可正确转换为拼音（CDN版覆盖）
- [x] 多音字至少返回一个常见读音

## 模糊音匹配

- [x] fuzzyPinyin.js 模块包含9组模糊音映射（zh/z、ch/c、sh/s、an/ang、en/eng、in/ing、l/n、f/h、r/l）
- [x] expandFuzzyPinyin 函数能生成输入拼音的所有模糊音变体
- [x] 模糊音搜索评分正确：精确70分、前缀55分、包含40分、模糊30分
- [x] 模糊音搜索仅在精确匹配不足5条时触发
- [ ] 输入 "sanghai" 能匹配到 "上海"（需运行时验证）
- [ ] 输入 "zidao" 能匹配到 "知道"（需运行时验证）
- [ ] 模糊音模块单元测试通过

## SearchIndex优化

- [x] SearchIndex.buildIndex 新增 fuzzyPinyinIndex Map 和 fuzzyFirstLetterIndex Map
- [x] search 方法包含模糊音索引搜索逻辑
- [x] 多音字的所有可能读音均建立索引（chineseToPinyinArray/getFirstLettersArray已导出）
- [x] 搜索性能未显著下降（模糊音搜索为兜底策略，仅在精确结果<5时触发）

## 联想搜索

- [x] 搜索框focus且无输入时显示搜索历史+热门搜索
- [x] 搜索历史持久化到localStorage，保留最近10条
- [x] 搜索历史去重（相同搜索词不重复记录）
- [x] 输入部分拼音时显示联想结果
- [x] 联想结果按匹配度排序（精确匹配 > 模糊音匹配）
- [x] 联想建议UI区分"搜索历史"/"热门搜索"/"猜你想搜"分区

## 空指针修复

- [x] selectSuggestion 中 searchInput 为null时不崩溃
- [x] navigateToDetail/navigateToSearch 使用模块导入的router
- [x] clearSuggestions 中 container 为null时不崩溃
- [x] handleKeydown 中 container 为null时不崩溃
