# 搜索页排序板块修复 - The Implementation Plan (Decomposed and Prioritized Task List)

## [x] Task 1: 重新设计排序板块HTML结构
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 修改search.js中排序区域的HTML结构
  - 优化排序顺序按钮和折叠箭头的布局
  - 确保元素正确嵌套和对齐
  - 保持标签筛选区域的现有结构
- **Acceptance Criteria Addressed**: [AC-1, AC-2]
- **Test Requirements**:
  - `human-judgement` TR-1.1: 检查HTML结构是否合理，元素正确嵌套 ✓
  - `human-judgement` TR-1.2: 验证排序顺序按钮和折叠箭头在HTML中的位置 ✓
- **Notes**: 先从简单的HTML结构调整开始

## [x] Task 2: 优化CSS样式确保正确对齐
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 修改styles.css中的可折叠组件样式
  - 添加正确的flex布局和对齐属性
  - 确保排序顺序按钮和折叠箭头正确垂直居中
  - 添加适当的间距和尺寸控制
  - 保持深色模式支持
- **Acceptance Criteria Addressed**: [AC-1, AC-2, AC-6]
- **Test Requirements**:
  - `human-judgement` TR-2.1: 检查排序顺序按钮是否正确对齐 ✓
  - `human-judgement` TR-2.2: 检查折叠箭头是否正确对齐 ✓
  - `human-judgement` TR-2.3: 验证深色模式样式正确 ✓
  - `human-judgement` TR-2.4: 验证毛玻璃效果和品牌色保持 ✓
- **Notes**: 重点是flex布局和垂直居中对齐

## [x] Task 3: 确保可折叠功能正常工作
- **Priority**: P1
- **Depends On**: Task 1, Task 2
- **Description**: 
  - 验证toggleCollapsible方法逻辑正确
  - 确保点击头部时展开/收起功能正常
  - 确保排序顺序按钮点击不触发展开/收起
  - 检查箭头旋转动画
- **Acceptance Criteria Addressed**: [AC-3, AC-4, AC-5]
- **Test Requirements**:
  - `human-judgement` TR-3.1: 点击排序区域头部验证展开/收起 ✓
  - `human-judgement` TR-3.2: 点击标签筛选区域头部验证展开/收起 ✓
  - `human-judgement` TR-3.3: 点击排序顺序按钮验证不触发展开/收起 ✓
  - `human-judgement` TR-3.4: 验证箭头旋转动画正确 ✓
- **Notes**: 确保事件冒泡正确处理

## [x] Task 4: 完整UI/UX验证
- **Priority**: P1
- **Depends On**: Task 1, Task 2, Task 3
- **Description**: 
  - 在浅色模式下完整测试所有功能
  - 在深色模式下完整测试所有功能
  - 验证响应式布局
  - 验证所有动画效果
  - 验证所有交互正常
- **Acceptance Criteria Addressed**: [AC-1, AC-2, AC-3, AC-4, AC-5, AC-6]
- **Test Requirements**:
  - `human-judgement` TR-4.1: 浅色模式下完整UI验证 ✓
  - `human-judgement` TR-4.2: 深色模式下完整UI验证 ✓
  - `human-judgement` TR-4.3: 验证所有功能正常工作 ✓
  - `human-judgement` TR-4.4: 验证动画效果流畅 ✓
- **Notes**: 进行端到端的完整测试
