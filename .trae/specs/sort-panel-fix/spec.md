# 搜索页排序板块修复 - Product Requirement Document

## Overview
- **Summary**: 修复搜索页排序板块的布局和功能问题，包括排序顺序按钮和折叠箭头的错位问题
- **Purpose**: 解决用户反馈的排序板块出错、右侧箭头错位的问题，提供一致的用户体验
- **Target Users**: Niypher应用的所有用户

## Goals
- 修复排序板块的布局问题，确保所有元素正确对齐
- 确保排序顺序按钮和折叠箭头位置正确
- 保持毛玻璃效果和粉色品牌色
- 保持深色模式支持
- 保持可折叠功能正常工作

## Non-Goals (Out of Scope)
- 不重新设计整个搜索页的UI
- 不修改标签筛选板块的现有功能
- 不添加新的排序选项

## Background & Context
- 当前排序板块存在布局问题，排序顺序按钮和折叠箭头位置不对
- 从用户提供的图片可以看到元素错位
- 之前的修复没有完全解决问题

## Functional Requirements
- **FR-1**: 排序板块的所有元素正确对齐
- **FR-2**: 排序顺序按钮在排序区域头部正确显示
- **FR-3**: 折叠箭头在正确位置且能正常旋转
- **FR-4**: 可折叠展开/收起功能正常工作
- **FR-5**: 点击排序顺序按钮不触发展开/收起

## Non-Functional Requirements
- **NFR-1**: 保持毛玻璃效果
- **NFR-2**: 保持粉色品牌色 (#ec4899, #db2777)
- **NFR-3**: 支持深色模式
- **NFR-4**: 平滑的动画效果
- **NFR-5**: 响应式设计

## Constraints
- **Technical**: 必须在现有代码基础上修改，使用现有的框架和库
- **Dependencies**: 依赖现有的CSS类和HTML结构
- **Design**: 必须保持与现有设计系统一致

## Assumptions
- 用户期望排序顺序按钮和折叠箭头在同一行但正确对齐
- 用户希望可折叠功能继续正常工作
- 深色模式和毛玻璃效果需要保持

## Acceptance Criteria

### AC-1: 排序板块布局正确
- **Given**: 用户进入搜索页并输入搜索词
- **When**: 查看搜索结果的筛选和排序区域
- **Then**: 排序板块的所有元素正确对齐，没有错位
- **Verification**: `human-judgment`
- **Notes**: 检查排序顺序按钮和折叠箭头的位置

### AC-2: 排序顺序按钮正确显示
- **Given**: 用户在搜索结果页面
- **When**: 查看排序区域头部
- **Then**: 排序顺序按钮在正确位置，大小合适，样式正确
- **Verification**: `human-judgment`

### AC-3: 折叠箭头功能正常
- **Given**: 用户在搜索结果页面
- **When**: 点击排序区域头部或标签筛选区域头部
- **Then**: 折叠箭头正确旋转，内容区域平滑展开/收起
- **Verification**: `human-judgment`

### AC-4: 可折叠功能正常
- **Given**: 用户在搜索结果页面
- **When**: 点击排序区域或标签筛选区域的头部
- **Then**: 对应的内容区域平滑展开或收起
- **Verification**: `human-judgment`

### AC-5: 排序顺序按钮独立工作
- **Given**: 用户在搜索结果页面，排序区域已展开
- **When**: 点击排序顺序按钮
- **Then**: 排序顺序改变，但不触发折叠功能
- **Verification**: `human-judgment`

### AC-6: 保持视觉风格
- **Given**: 用户在搜索结果页面
- **When**: 查看排序和筛选区域
- **Then**: 毛玻璃效果、粉色品牌色、深色模式都正常显示
- **Verification**: `human-judgment`

## Open Questions
- [ ] 用户希望排序顺序按钮具体在什么位置？（当前是在左侧内容和右侧箭头之间）
