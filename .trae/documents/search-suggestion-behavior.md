# 搜索联想项点击行为修改计划

## 需求说明
修改搜索联想栏的点击和回车行为，根据联想项类型决定跳转目标：
- **game 类型** -> 跳转到搜索页
- **tag 类型** -> 跳转到搜索页  
- **developer 类型** -> 跳转到搜索页
- **vndb 类型** -> 跳转到详情页（保持原有行为）

## 现状分析
当前 `selectSuggestion` 方法将所有类型的联想项都导航到详情页，需要修改为根据类型区分跳转目标。

## 修改方案
修改 `src/js/modules/search.js` 中的 `selectSuggestion` 方法：
- 根据 `type` 参数判断跳转目标
- game/tag/developer 类型：调用 `navigateToSearch(text)`
- vndb 类型：调用 `navigateToDetail(id)`

## 文件修改
- `src/js/modules/search.js` - 修改 `selectSuggestion` 方法

## 验证要点
- [ ] game 类型联想项点击后跳转到搜索页
- [ ] tag 类型联想项点击后跳转到搜索页
- [ ] developer 类型联想项点击后跳转到搜索页
- [ ] vndb 类型联想项点击后跳转到详情页
- [ ] 选中联想项按回车键行为与点击行为一致
