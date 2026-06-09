# 搜索功能完善与动画修复规范

## Why
当前搜索系统的历史记录、搜索建议、智能关联功能虽然代码已存在但运行时未正常工作；首页和搜索页的卡片入场动画因CSS transition属性缺失导致动画效果丢失；卡片和控件悬停时存在不应有的放大效果；首页切换时存在卡片二次加载卡顿问题。

## What Changes
- 修复卡片入场/退场动画CSS transition属性缺失问题（is-hidden → is-loaded 无过渡效果）
- 修复搜索建议联想栏显示/隐藏逻辑和样式问题
- 修复搜索历史记录的持久化和显示问题
- 修复智能关联（模糊拼音搜索）的运行时验证问题
- 修复移动端搜索建议功能
- 移除卡片和控件悬停时的放大效果，改为仅强调（边框/阴影/背景变化）
- 恢复卡片标题的荧光笔动效
- 修复从其它页切换到首页时卡片二次加载导致的卡顿问题

## Impact
- Affected specs: fuzzy-pinyin-associative-search, new-search-page, home-card-animation-optimize, unify-card-hover-effect, add-card-title-highlight
- Affected code:
  - `src/css/styles.css`（卡片动画transition修复、hover效果修改、荧光笔动效）
  - `src/js/modules/search.js`（搜索建议、历史记录修复）
  - `src/js/pages/home.js`（首页动画修复、二次加载修复）
  - `src/js/modules/renderer.js`（搜索页动画修复）
  - `src/js/modules/components.js`（renderGameCard移除animate-card-in）
  - `src/js/app.js`（移动端搜索建议修复、控件hover效果修改）
  - `index.html`（移除hover:scale-105/hover:scale-110）

## ADDED Requirements

### Requirement: 卡片入场动画修复
系统 SHALL 确保首页和搜索页的卡片具有流畅的交错入场动画效果。

#### Scenario: 首页卡片入场
- **WHEN** 用户导航到首页
- **THEN** 卡片以交错延迟从下方淡入滑出，每张卡片延迟50ms，最多15张交错
- **预期效果**: 卡片从 opacity:0 + translateY(20px) 过渡到 opacity:1 + translateY(0)

#### Scenario: 搜索页卡片入场
- **WHEN** 搜索结果加载完成
- **THEN** 搜索结果卡片以交错延迟入场动画显示
- **预期效果**: 与首页卡片动画一致

### Requirement: 卡片悬停仅强调不放大
系统 SHALL 在鼠标悬停卡片时仅提供视觉强调效果（边框高亮、阴影增强、背景变化），不进行缩放放大。

#### Scenario: 卡片悬停效果
- **WHEN** 用户鼠标悬停在游戏卡片上
- **THEN** 卡片仅产生 translateY 上移效果和阴影增强，不产生 scale 缩放
- **THEN** 卡片标题的荧光笔高亮动效正常触发
- **预期修改**: 移除 `transform: translateY(-4px) scale(1.02)` 中的 `scale(1.02)`

#### Scenario: 分类页卡片悬停
- **WHEN** 用户鼠标悬停在分类页卡片上
- **THEN** 仅产生背景色变化，不产生缩放效果

### Requirement: 控件悬停仅强调不放大
系统 SHALL 在鼠标悬停控件按钮时仅提供视觉强调效果，不进行缩放放大。

#### Scenario: 浮动按钮悬停
- **WHEN** 用户鼠标悬停在主题切换、回到顶部、刷新等浮动按钮上
- **THEN** 按钮仅产生边框/阴影/背景强调效果，不产生 scale 缩放
- **预期修改**: 移除 index.html 中的 `hover:scale-105` 和 `hover:scale-110`

### Requirement: 卡片标题荧光笔动效恢复
系统 SHALL 在鼠标悬停卡片时，卡片标题下方显示荧光笔划过高亮动效。

#### Scenario: 荧光笔动效触发
- **WHEN** 用户鼠标悬停在游戏卡片上
- **THEN** 标题下方出现从左到右展开的粉色荧光笔高亮效果
- **预期效果**: `.card-title-highlight` 从 scaleX(0) 过渡到 scaleX(1)

#### Scenario: 荧光笔动效收回
- **WHEN** 用户鼠标移出游戏卡片
- **THEN** 标题下方的荧光笔高亮效果从右到左收回
- **预期效果**: `.card-title-highlight` 从 scaleX(1) 过渡到 scaleX(0)

### Requirement: 首页卡片二次加载修复
系统 SHALL 确保从其它页面切换到首页时，卡片只执行一次入场动画，不出现二次加载卡顿。

#### Scenario: 从其它页切换到首页
- **WHEN** 用户从搜索页/分类页/我的页切换回首页
- **THEN** 卡片只执行一次入场动画，不出现闪烁或二次渲染
- **预期修复**: 移除 renderGameCard 中的 animate-card-in 类，统一使用 is-hidden → is-loaded 动画路径

### Requirement: 搜索历史记录功能
系统 SHALL 在搜索框聚焦时显示搜索历史，并支持持久化存储。

#### Scenario: 显示搜索历史
- **WHEN** 用户点击搜索框且输入为空
- **THEN** 显示"搜索历史"分区，展示最近10条搜索记录，每条记录右侧有删除按钮

#### Scenario: 搜索历史持久化
- **WHEN** 用户执行搜索后关闭页面再重新打开
- **THEN** 搜索历史从localStorage正确恢复

#### Scenario: 删除单条历史
- **WHEN** 用户点击某条历史记录右侧的删除图标
- **THEN** 该条记录从历史中移除，联想栏刷新

### Requirement: 搜索建议联想功能
系统 SHALL 在用户输入时实时显示搜索建议。

#### Scenario: 输入时显示联想
- **WHEN** 用户在搜索框输入文字
- **THEN** 实时显示匹配的游戏、标签、开发商等联想建议
- **THEN** 联想建议按匹配度排序（精确匹配 > 拼音匹配 > 首字母匹配）

#### Scenario: 热门搜索显示
- **WHEN** 搜索框聚焦且无输入，且有搜索历史
- **THEN** 显示"搜索历史"和"热门搜索"两个分区
- **THEN** 热门搜索基于搜索频次统计

#### Scenario: 默认标签推荐
- **WHEN** 搜索框聚焦且无输入，且无搜索历史
- **THEN** 显示"猜你想搜"分区，展示默认推荐标签

### Requirement: 智能关联（模糊拼音搜索）
系统 SHALL 支持模糊音匹配搜索，在精确匹配结果不足时自动扩展搜索范围。

#### Scenario: 模糊音搜索
- **WHEN** 用户输入 "sanghai"
- **THEN** 系统能匹配到标题包含"上海"的游戏

#### Scenario: 模糊音触发条件
- **WHEN** 精确匹配结果不足5条
- **THEN** 自动触发模糊音搜索扩展结果

### Requirement: 移动端搜索建议
系统 SHALL 在移动端搜索弹窗中正确显示搜索建议。

#### Scenario: 移动端搜索建议
- **WHEN** 用户在移动端搜索弹窗中输入文字
- **THEN** 显示匹配的搜索建议列表
- **THEN** 点击游戏类建议跳转到详情页

## MODIFIED Requirements

### Requirement: 卡片CSS动画过渡
现有 `.game-cards-container .glass-card` 需增加 opacity 和 transform 的 transition 属性，确保 is-hidden → is-loaded 状态切换时有平滑过渡动画。同时移除 hover 时的 scale 变换。

### Requirement: 搜索建议容器样式
现有 `#search-suggestions` 需确保在移除 hidden 类后正确显示，z-index 层级正确不被其他元素遮挡。

### Requirement: renderGameCard动画类
现有 `renderGameCard()` 中的 `animate-card-in` 类应移除，统一使用 `is-hidden` → `is-loaded` 动画路径，避免二次加载。

## REMOVED Requirements

### Requirement: 卡片悬停放大效果
**Reason**: 用户要求悬停时仅强调不放大，移除所有 scale 变换
**Migration**: 将 `transform: translateY(-4px) scale(1.02)` 改为 `transform: translateY(-4px)`，移除 index.html 中的 hover:scale-105/hover:scale-110

### Requirement: 控件悬停放大效果
**Reason**: 用户要求控件悬停时仅强调不放大
**Migration**: 将 hover:scale-105/hover:scale-110 替换为边框/阴影强调效果
