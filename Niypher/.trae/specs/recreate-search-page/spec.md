# 新搜索页 - Product Requirement Document

## Why
用户需要一个独立的搜索结果页面，与现有的header搜索栏分离，支持排序和筛选功能，提供更专业的搜索体验。

## What Changes
- 创建独立的搜索页面路由
- 搜索页共用header的搜索栏，不单独创建搜索栏
- 点击搜索键或在搜索栏按回车（未选中联想项）后跳转到搜索页并显示搜索结果
- 加入排序和筛选功能
- 从其他页面跳转搜索页采用与docker栏图标相同的平移切换效果
- 保持联想栏布局和功能不变，联想栏回车键映射取消

## Impact
- Affected specs: delete-search-page（反向操作）
- Affected code: 
  - src/js/pages/search.js（新建）
  - src/js/modules/router.js（修改）
  - src/js/modules/renderer.js（修改）
  - src/js/modules/search.js（修改）
  - src/js/app.js（修改）
  - src/js/utils/searchHelper.js（新建/修改）

## ADDED Requirements
### Requirement: FR-9 路由参数
系统 SHALL 搜索页必须支持通过 URL 参数初始化搜索结果（解决刷新丢失问题）。

### Requirement: FR-10 页内更新
系统 SHALL 当用户已在搜索页时，再次触发搜索行为，应原地刷新列表，禁用页面平移动画。

#### Scenario: 搜索页内刷新
- **WHEN** 用户已在搜索页，再次触发搜索
- **THEN** 列表原地刷新，禁用页面平移动画
- **WHEN** 修改筛选/排序条件
- **THEN** 使用路由器更换，列表原地刷新

### Requirement: FR-11 URL 编码
系统 SHALL 在构建跳转 URL 时，必须对 header 搜索栏中的输入文本进行 encodeURIComponent 编码，以支持特殊字符的正确传输。

### Requirement: 排序功能
系统 SHALL 提供排序功能，允许用户按不同方式排序搜索结果。

### Requirement: 筛选功能
系统 SHALL 提供筛选功能，允许用户按不同类型筛选搜索结果。

### Requirement: 页面切换动画
系统 SHALL 在跳转搜索页时采用平移切换效果。

#### Scenario: 页面切换
- **WHEN** 从其他页面跳转到搜索页
- **THEN** 页面采用平移切换动画

### Requirement: 联想栏功能保持
系统 SHALL 保持联想栏的原有功能和布局不变。

#### Scenario: 使用联想栏
- **WHEN** 用户在搜索栏输入内容触发联想
- **THEN** 联想栏显示正常，回车键映射已取消

## Technical Constraints
### PageOrder 定义
- 搜索页设为独立层级，index 值为 3
- 动态计算 slide 方向：Target Index > Current Index ? Slide Left : Slide Right

### Animation Constraints
- 标准场景：基于页面顺序（pageOrder）的平移动画
- 兜底场景（Fallback）：当源页面或目标页面缺少页面顺序索引时（如从外部链接进入），默认使用淡入或SlideUp动画，禁止随机方向滑动

## UI/UX 细节
### 输入框焦点管理
- **场景1（从Header跳转）**：跳转到搜索页后，输入框应失去焦点（Blur），收起软键盘
- **场景2（进入空搜索页）**：如果用户删除了关键词进入空搜索页，输入框应自动获取焦点（Focus）

## Acceptance Criteria
### AC-3: 搜索栏回车键映射取消
- **WHEN** 光标在搜索栏内且未选中联想项时按回车键
- **THEN** 跳转到搜索页

### AC-3.1: 联想栏选中项回车键行为
- **WHEN** 联想栏有选中项时按回车键
- **THEN** 将当前联想项文本输入搜索栏并执行搜索

### AC-3.2: 联想菜单高亮时按Enter
- **WHEN** 联想菜单打开且某项被高亮选中时按Enter
- **THEN** 不会导致路由跳转

### AC-9: 空状态
- **WHEN** 用户进入搜索页但header搜索栏为空
- **THEN** 显示"请输入搜索词"或推荐内容

### AC-12: 网络状态与异常处理
- **WHEN** 搜索页加载或执行搜索操作时出现网络异常
- **THEN** 展示"网络异常"提示及"点击重试"按钮

### AC-13: 特殊字符搜索支持
- **WHEN** 输入包含特殊字符的文本（如"C++ & Java"）
- **THEN** 网址显示为正确编码格式，搜索结果页能正确解码

## MODIFIED Requirements
### Requirement: 搜索栏回车键行为
- **修改**: 未选中联想项时按回车键跳转到搜索页
- **取消**: 原有直接搜索行为

### Requirement: URL 参数处理
- **修改**: 搜索页支持通过 URL 参数（q, sort, filter）初始化搜索结果
