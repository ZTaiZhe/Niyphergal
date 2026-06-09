# 模糊音与联想搜索优化规范

## Why
当前搜索系统存在三个核心问题：1）pinyin-pro.js 本地库仅包含约200个常用汉字映射，覆盖范围极小，大量游戏标题中的汉字无法正确转换拼音；2）缺少模糊音匹配（如 zh/z、c/ch、s/sh、an/ang、en/eng 等南方口音常见混淆），导致用户输入近似拼音时无法命中；3）缺少输入法式的联想搜索，用户输入部分拼音时无法自动推荐相关游戏。

## What Changes
- 替换本地精简版 pinyin-pro.js 为 npm pinyin-pro 完整库（覆盖2万+汉字）
- 新增模糊音映射表（zh/z、ch/c、sh/s、an/ang、en/eng、in/ing、l/n、f/h、r/l 等9组常见混淆）
- 新增 FuzzyPinyinMatcher 模块，实现模糊音扩展搜索
- 新增联想搜索功能（输入时自动推荐热门/最近搜索/相关游戏）
- 优化 SearchIndex 的拼音索引构建，增加模糊音索引层
- 修复 SearchSuggestion 中 `selectSuggestion` 的空指针风险
- 修复 `navigateToDetail`/`navigateToSearch` 中 `router` 未导入的问题

## Impact
- Affected specs: enterprise-audit-optimization（搜索系统部分）
- Affected code:
  - `src/js/lib/pinyin-pro.js`（替换为完整版或改用npm包）
  - `src/js/modules/utils.js`（chineseToPinyin/getFirstLetters 优化）
  - `src/js/modules/searchIndex.js`（增加模糊音索引层）
  - `src/js/modules/search.js`（增加联想搜索、修复空指针）
  - `src/js/modules/config.js`（新增搜索配置项）

## ADDED Requirements

### Requirement: 完整拼音库覆盖
系统 SHALL 使用覆盖全部常用汉字的拼音转换库，确保任意游戏标题中的汉字均可正确转换为拼音。

#### Scenario: 生僻汉字拼音转换
- **WHEN** 用户搜索包含非常用汉字的游戏标题（如"纭"、"翎"、"曜"等）
- **THEN** 系统能正确将其转换为拼音并匹配搜索结果
- **预期改进**: 拼音覆盖率从约200字提升至2万+字

### Requirement: 模糊音匹配
系统 SHALL 支持以下9组常见模糊音映射，在精确匹配无结果时自动扩展搜索范围：

| 模糊音组 | 示例 |
|----------|------|
| zh ↔ z | "知道" → zhidao/zidao 均可匹配 |
| ch ↔ c | "吃饭" → chifan/cifan 均可匹配 |
| sh ↔ s | "上海" → shanghai/sanghai 均可匹配 |
| an ↔ ang | "安装" → anzhuang/angzhuang 均可匹配 |
| en ↔ eng | "认真" → renzhen/renzheng 均可匹配 |
| in ↔ ing | "心灵" → xinling/xinlin 均可匹配 |
| l ↔ n | "老师" → laoshi/naoshi 均可匹配 |
| f ↔ h | "发现" → faxian/huaxian 均可匹配 |
| r ↔ l | "人民" → renmin/lenmin 均可匹配 |

#### Scenario: 模糊音搜索
- **WHEN** 用户输入 "sanghai"（将shanghai的sh误输入为s）
- **THEN** 系统仍能匹配到标题包含"上海"的游戏，但匹配得分略低于精确匹配
- **预期改进**: 搜索召回率提升，减少因口音差异导致的搜索失败

### Requirement: 联想搜索
系统 SHALL 在用户输入时提供智能联想建议：

#### Scenario: 热门搜索联想
- **WHEN** 用户聚焦搜索框但尚未输入任何文字
- **THEN** 显示热门搜索词（基于搜索频次统计）和最近搜索历史

#### Scenario: 输入中联想
- **WHEN** 用户输入部分拼音（如 "yx"）
- **THEN** 系统联想推荐匹配的游戏标题（如"游戏"、"影像"、"银河"等开头的游戏）
- **THEN** 联想结果按匹配度排序，精确匹配优先，模糊音匹配次之

#### Scenario: 搜索历史
- **WHEN** 用户多次使用搜索功能
- **THEN** 系统记录最近10条搜索历史，在搜索框聚焦时展示
- **THEN** 搜索历史持久化到localStorage，跨会话保留

### Requirement: 搜索空指针修复
系统 SHALL 修复搜索模块中残留的空指针风险：

#### Scenario: selectSuggestion空指针
- **WHEN** `selectSuggestion` 被调用时 `searchInput` 为null
- **THEN** 不崩溃，静默返回
- **预期改进**: 消除 `searchInput.value = text` 处的TypeError风险

#### Scenario: router未导入
- **WHEN** `navigateToDetail`/`navigateToSearch` 被调用
- **THEN** 使用已导入的router模块而非全局变量
- **预期改进**: 消除对 `typeof router !== 'undefined'` 的全局变量检查

## MODIFIED Requirements

### Requirement: SearchIndex搜索评分优化
现有搜索评分需进行以下修改：
- 精确匹配：100分（不变）
- 前缀匹配：80分（不变）
- 包含匹配：60分（不变）
- 模糊音精确匹配：新增70分
- 模糊音前缀匹配：新增55分
- 模糊音包含匹配：新增40分
- 模糊音模糊匹配：新增30分

### Requirement: chineseToPinyin函数优化
现有 `chineseToPinyin` 和 `getFirstLetters` 函数需进行以下修改：
- 使用 pinyin-pro 的 `match` 方法替代手动字符串匹配
- 增加 `pattern: 'pinyin'` 的 array 模式输出，用于构建更精确的索引
- 增加多音字处理：取所有可能读音的并集

## REMOVED Requirements

### Requirement: 硬编码拼音映射表
**Reason**: 已在上轮优化中替换为pinyin-pro库调用，但本地pinyin-pro.js库覆盖范围不足
**Migration**: 替换为npm pinyin-pro完整包或扩充本地库至2万+汉字
