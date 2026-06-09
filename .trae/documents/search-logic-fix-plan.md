# 搜索逻辑修复计划 v4

## 需求明确

| 联想项类型 | 选中后行为 |
|-----------|----------|
| game | 跳转到搜索页 |
| tag | 跳转到搜索页 |
| developer | 跳转到搜索页 |
| vndb | 跳转到详情页 |

## 最终行为

| 场景 | 行为 |
|------|------|
| 点击搜索按钮 | 跳转到搜索页 |
| 未选中联想项按回车 | 跳转到搜索页 |
| 选中 game 类型联想项 | 跳转到搜索页 |
| 选中 tag 类型联想项 | 跳转到搜索页 |
| 选中 developer 类型联想项 | 跳转到搜索页 |
| 选中 vndb 类型联想项 | 跳转到详情页 |

## 修复方案

### 修改 `selectSuggestion` 方法

```javascript
selectSuggestion: function(text, id, type) {
    const searchInput = document.getElementById('header-search');
    searchInput.value = text;
    
    if (type === 'vndb' && id) {
        // vndb 类型：跳转到详情页
        this.navigateToDetail(id);
    } else {
        // game/tag/developer 类型：跳转到搜索页
        this.navigateToSearch(text);
    }
    
    this.clearSuggestions();
}
```

## 修改文件

1. `src/js/modules/search.js` - 修改 `selectSuggestion` 方法
