# 搜索后自动关闭联想栏计划

## 需求
搜索后自动关闭联想栏（搜索后立即收起，但搜索一次只收起一次，即收起后再次点击搜索栏不会再重复收起）

## 现状
当前搜索后联想栏可能没有自动收起，或者收起逻辑有问题。

## 修改方案
修改 `src/js/modules/search.js` 中的 `navigateToSearch` 方法：
- 在导航到搜索页后调用 `clearSuggestions()` 关闭联想栏

## 文件
- `src/js/modules/search.js` - navigateToSearch 方法

## 验证
- [ ] 搜索后联想栏立即收起
- [ ] 收起后再次点击搜索栏不会再重复收起
