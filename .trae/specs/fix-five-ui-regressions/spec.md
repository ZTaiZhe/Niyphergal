# 修复六项 UI 回归 Bug Spec

## Why
近期代码变更引入了多个 UI 回归：公告弹窗乱码及显示异常、反飞行过渡消失、详情页布局异常、分类页渲染混乱、骨架屏不再显示。需逐一修复恢复正确行为。

## What Changes
- 修复 `home.js` 中公告弹窗按钮 UTF-8 乱码文字 `'鎴戠煡閬撳簡'` → `'我知道了'`
- 修复公告弹窗内容显示异常（检查公告标题、内容、图片是否正确渲染）
- 修复 `category.js` 中 `.join('Pure Love')` → `.join('')`
- 修复 `renderer.js` 中分类页动画类注入失败（模板无 `space-y-5`）
- 修复底部导航"推荐"按钮未检查 hero exit context，导致反飞行过渡丢失
- 修复骨架屏在页面切换时被 `display:none` 隐藏的问题

## Impact
- Affected code: `src/js/pages/home.js`, `src/js/pages/category.js`, `src/js/modules/search/renderer.js`, `src/js/modules/ui/navigation.js`, `src/js/modules/ui/announcement.js`

## ADDED Requirements

### Requirement: 修复公告弹窗显示异常
系统 SHALL 在公告弹窗中正确显示标题、内容、图片和按钮文字。按钮文字应为 `'我知道了'`，而非 UTF-8 编码损坏的乱码 `'鎴戠煡閬撳簡'`。公告内容应有适当的标点分隔以提升可读性。

#### Scenario: 公告弹窗显示
- **WHEN** 用户打开首页且公告弹窗出现
- **THEN** 标题正确显示为"NiypherGal新站公测公告"
- **AND** 内容文字正确显示，无乱码
- **AND** 按钮文字显示为"我知道了"
- **AND** 点击按钮后公告弹窗正确关闭

### Requirement: 修复分类页卡片间多余文字
系统 SHALL 在分类页卡片之间不插入任何分隔字符串。

#### Scenario: 分类页渲染
- **WHEN** 用户导航到分类页
- **THEN** 6 张分类卡片正常排列，卡片之间无"Pure Love"文字

### Requirement: 修复分类页入场动画
系统 SHALL 在导航到分类页时正确注入动画类，使卡片有淡入动画效果。

#### Scenario: 分类页动画
- **WHEN** 用户从其他页导航到分类页
- **THEN** 分类页内容有淡入动画

### Requirement: 修复反飞行过渡
系统 SHALL 在从详情页返回首页时，若存在 hero exit context，执行反飞行过渡动画而非直接跳转。

#### Scenario: 底部导航返回首页
- **WHEN** 用户在详情页点击底部导航"推荐"按钮
- **AND** hero exit context 存在
- **THEN** 执行 `performHeroExit()` 反飞行过渡动画

#### Scenario: Logo 按钮返回首页
- **WHEN** 用户在详情页点击 Logo 按钮
- **AND** hero exit context 存在
- **THEN** 执行 `performHeroExit()` 反飞行过渡动画

### Requirement: 修复页面切换骨架屏
系统 SHALL 在页面切换时先显示骨架屏占位，再替换为真实内容，而非直接隐藏骨架屏。

#### Scenario: 非搜索页导航显示骨架屏
- **WHEN** 用户导航到新页面（非搜索页）
- **THEN** 先显示该页面的骨架屏，随后替换为真实内容

## MODIFIED Requirements

### Requirement: 分类页动画类注入
分类页模板使用 `class="${animationClass} pt-20"` 而非 `class="space-y-5"`，`renderer.js` 中的 `.replace('class="space-y-5'` 匹配失败。需改为匹配分类页模板中实际存在的 class 模式。
