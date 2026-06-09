# 新搜索页 - Product Requirement Document

## Overview
- **Summary**: 新增一个独立的搜索页面，与现有的header搜索栏分离，支持排序和筛选功能，保持联想栏原有功能但取消回车键映射，采用平移切换效果
- **Purpose**: 解决搜索功能与现有页面耦合的问题，提供更专业的搜索体验
- **Target Users**: 所有使用搜索功能的用户

## Goals
- 创建独立的搜索页面路由
- 搜索页共用header的搜索栏，不单独创建搜索栏
- 点击搜索键或在搜索栏按回车（未选中联想项）后跳转到搜索页并显示搜索结果
- 加入排序和筛选功能（布局由UI智能体重新设计，动效由UX智能体设计）
- 从其他页面跳转搜索页采用与docker栏图标相同的平移切换效果
- 保持联想栏布局和功能不变，仅取消搜索栏（未选中联想项）的回车键映射
- 当选中联想栏项时，回车键行为保持不变（将联想项文本输入搜索栏并执行搜索）

## Non-Goals (Out of Scope)
- 不实现新的搜索算法
- 不改变header搜索栏的布局
- 不修改现有联想栏的UI设计
- 不重新实现搜索索引功能

## Background & Context
- 现有搜索功能直接在header搜索栏中完成，没有独立的搜索结果页
- 用户需要一个更集中的搜索结果展示页面，支持排序和筛选
- docker栏已有主页、分类、引力搜索、我的四个页面
- 现有页面切换使用基于pageOrder的平移动画

## Functional Requirements
- **FR-1**: 创建独立的搜索页面路由
- **FR-2**: 修改搜索逻辑，点击搜索或在搜索栏按回车（未选中联想项）后跳转到搜索页
- **FR-3**: 搜索页读取header搜索栏中的文本并展示结果
- **FR-4**: 取消搜索栏（未选中联想项）的回车键映射
- **FR-4.1**: 保持联想栏选中项时的回车键行为不变（将联想项文本输入搜索栏并执行搜索）
- **FR-5**: 添加排序功能到搜索页
- **FR-6**: 添加筛选功能到搜索页
- **FR-7**: 实现搜索页的平移切换动画
- **FR-8**: 确保联想栏功能、布局、动画不变（除搜索栏未选中项时的回车键外）
- **FR-9**: 搜索页必须支持通过 URL 参数初始化搜索结果（解决刷新丢失问题）
- **FR-10**: 当用户已在搜索页时，再次触发搜索行为，应原地刷新列表，禁用页面平移动画
  - 修改搜索关键词触发的搜索：使用路由器推送（新增历史记录）
  - 修改筛选/排序条件触发的更新：使用路由器更换
  - 通用：触发列表原地刷新，禁用页面平移切换动画
- **FR-11**: 在构建跳转URL时，必须对header搜索栏中的输入文本进行encodeURIComponent编码，以支持特殊字符（如?, &, #, /等）的正确传输

## Non-Functional Requirements
- **NFR-1**: 页面切换动画流畅（500ms内完成）
- **NFR-2**: 联想栏原有功能保持完整
- **NFR-3**: 搜索页加载性能与现有页面一致
- **NFR-4**: 搜索栏和搜索页作为独立模块，互不影响

## Constraints
- **Technical**: 
  - 使用现有的router和renderer架构，保持代码风格一致
  - PageOrder 定义：搜索页的 index 值设为独立层级，或者动态计算 slide 方向（Target Index > Current Index ? Slide Left : Slide Right）
  - 支持 URL Query 参数传递和解析
- **Animation**:
  - 标准场景：基于页面顺序（pageOrder）的平移动画
  - 兜底场景（Fallback）：当源页面或目标页面缺少页面顺序索引时（如从外部链接进入），默认使用淡入或SlideUp（从下弹出）动画，禁止随机方向滑动
- **Business**: 必须保持现有联想栏功能不变
- **Dependencies**: 依赖现有的SearchIndex、SearchSuggestion模块

## Assumptions
- 排序和筛选功能仅在搜索页生效
- URL Query 参数的变化，header 搜索栏仅作为修改 URL 参数的入口
- docker栏不需要添加搜索图标
- 排序和筛选的UI由UI智能体设计，动效由UX智能体设计

## Acceptance Criteria

### AC-1: 搜索页面路由创建
- **Given**: 应用已启动
- **When**: router.push('search')被调用
- **Then**: 搜索页面被正确渲染
- **Verification**: `programmatic`

### AC-2: 搜索栏跳转逻辑
- **Given**: 用户在任意页面的header搜索栏中输入文本
- **When**: 用户点击搜索按钮或按回车键
- **Then**: 页面跳转到搜索页，搜索页显示搜索结果
- **Verification**: `programmatic`

### AC-3: 搜索栏回车键映射取消（联想栏选中项保持原有行为）
- **Given**: 用户在搜索栏输入文本，未选中任何联想项
- **When**: 用户在搜索栏按回车键
- **Then**: 不执行原有的直接搜索行为，而是跳转到搜索页
- **Verification**: `programmatic`

### AC-3.1: 联想栏选中项回车键行为保持
- **Given**: 用户在联想栏中选中了某项建议
- **When**: 用户按回车键
- **Then**: 将当前联想项文本输入搜索栏并执行搜索（原有行为）
- **Verification**: `programmatic`

### AC-3.2: 联想菜单高亮时按Enter不路由跳转
- **Given**: 联想菜单打开且某项被高亮选中
- **When**: 用户按回车键
- **Then**: 不会导致路由跳转，而是执行原有选中联想项的行为
- **Verification**: `programmatic`

### AC-4: 排序功能集成
- **Given**: 搜索页已加载并显示搜索结果
- **When**: 用户使用排序功能
- **Then**: 搜索结果按所选方式排序
- **Verification**: `human-judgment`

### AC-5: 筛选功能集成
- **Given**: 搜索页已加载并显示搜索结果
- **When**: 用户使用筛选功能
- **Then**: 搜索结果按所选条件筛选
- **Verification**: `human-judgment`

### AC-6: 页面切换动画
- **Given**: 用户在非搜索页面
- **When**: 触发搜索跳转（点击搜索或回车）
- **Then**: 页面采用与docker栏图标相同的平移切换效果
- **Verification**: `human-judgment`

### AC-7: 联想栏功能完整性
- **Given**: 用户在任意页面使用header搜索栏
- **When**: 用户输入内容触发联想
- **Then**: 联想栏布局、动画、功能保持不变（除回车键外）
- **Verification**: `human-judgment`

### AC-8: 模块独立性
- **Given**: 搜索页和header搜索栏都存在
- **When**: 搜索页加载或操作
- **Then**: header搜索栏功能不受影响，两者作为独立模块
- **Verification**: `programmatic`

### AC-9: 搜索页空状态处理
- **Given**: 用户进入搜索页但header搜索栏为空（或删除了关键词）
- **When**: 搜索页渲染
- **Then**: 显示"请输入搜索词"或推荐内容，而不是空白或报错
- **Verification**: `human-judgment`

### AC-10: 支持通过URL参数初始化搜索结果
- **Given**: URL中包含搜索查询参数（如 ?q=关键词）
- **When**: 用户刷新页面或直接访问带参数的URL
- **Then**: 搜索页正确读取URL参数并显示对应的搜索结果
- **Verification**: `programmatic`

### AC-11: 搜索页内原地刷新（禁用平移动画）
- **Given**: 用户已在搜索页
- **When**: 用户再次触发搜索行为（点击搜索或回车）
- **Then**: 列表原地刷新，不触发页面平移动画
- **Verification**: `programmatic`

### AC-12: 网络状态与异常处理
- **Given**: 搜索页加载或执行搜索操作时出现网络异常
- **When**: 网络异常发生
- **Then**: 搜索页展示"网络异常"提示及"点击重试"按钮，不显示空白页
- **Verification**: `human-judgment`

### AC-13: 特殊字符搜索支持
- **Given**: 用户在header搜索栏中输入包含特殊字符的文本（如"C++ & Java"）
- **When**: 触发搜索跳转
- **Then**: 网址显示为.../search?q=C%2B%2B%20%26%20Java，且搜索结果页能正确解码并显示"C++ & Java"的结果
- **Verification**: `programmatic`

## UI/UX 细节
### 输入框焦点（Focus）管理
- **场景1（从Header跳转）**：跳转到搜索页后，输入框应失去焦点（Blur），收起软键盘，以便用户浏览结果
- **场景2（进入空搜索页）**：如果用户删除了关键词进入空搜索页，输入框应自动获取焦点（Focus），弹出软键盘，引导输入

## Open Questions
- [ ] 排序和筛选的具体功能选项需要UI智能体设计时确定
- [ ] 搜索页的具体布局需要UI智能体设计
- [ ] 页面切换动画的具体方向需要确认
- [ ] 加载中骨架屏的具体设计需要UI智能体确定
- [ ] 网络异常/重试页面的具体设计需要UI智能体确定
