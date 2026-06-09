# 修复搜索功能与动画失效问题 Spec

## Why
用户报告部署后搜索历史、搜索建议、智能关联（联想搜索）功能不可用，且之前实现的动画修改丢失。代码层面这些功能均已实现，但可能在运行时因JS错误、CSP限制或缓存问题导致功能失效。

## What Changes
- 诊断并修复搜索建议功能在运行时不生效的问题
- 诊断并修复搜索历史不显示的问题
- 诊断并修复联想搜索不工作的问题
- 诊断并修复动画效果丢失的问题
- 确保CSP头不阻止搜索功能所需的CDN资源
- 添加运行时错误诊断和降级处理

## Impact
- Affected specs: fuzzy-pinyin-associative-search（搜索功能）, fix-page-whiteout-encoding（编码修复）
- Affected code: src/js/modules/search.js, src/js/modules/searchIndex.js, src/js/modules/fuzzyPinyin.js, src/js/modules/renderer.js, _headers

## ADDED Requirements

### Requirement: 搜索建议运行时可用
系统 SHALL 确保搜索建议功能在部署后正常运行，用户聚焦搜索框时显示历史/热门搜索，输入时显示联想结果。

#### Scenario: 搜索框聚焦
- **WHEN** 用户点击搜索框
- **THEN** 显示搜索历史和热门搜索（如果有）或默认推荐标签

#### Scenario: 输入联想
- **WHEN** 用户输入搜索关键词
- **THEN** 实时显示匹配的游戏、标签、开发商建议

### Requirement: 动画效果运行时可用
系统 SHALL 确保卡片入场动画、交错动画、刷新动画等在部署后正常运行。

#### Scenario: 首页卡片加载
- **WHEN** 首页卡片加载完成
- **THEN** 卡片以交错动画方式依次入场

## MODIFIED Requirements

### Requirement: CSP头配置
现有CSP头需确保不阻止搜索功能所需的CDN资源加载，包括pinyin-pro CDN。

## REMOVED Requirements
无
