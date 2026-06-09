# 重建搜索页 - 任务列表

## 任务列表

### [x] Task 0: 工具函数准备
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 检查 src/js/utils/searchHelper.js 是否存在
  - 确保 processResults(results, sortKey, filterType) 纯函数存在
  - 使用 URLSearchParams 原生 API：parseSearchParams, serializeSearchParams
  - 确保 debounce 函数存在于 utils.js 中
- **Notes**: 优先使用 URLSearchParams 原生 API，自动处理编码/解码边缘情况

### [x] Task 1: 创建搜索页渲染模块
- **Priority**: P0
- **Depends On**: Task 0
- **Description**: 
  - 创建 src/js/pages/search.js 文件
  - 严格遵循 URL 驱动：renderSearch 函数只接受 params.q 作为输入
  - 搜索页不包含单独的搜索栏，仅显示搜索结果
  - 使用 SearchIndex 获取搜索结果
  - 实现空状态处理（AC-9）
  - 实现骨架屏（aria-hidden="true"）
  - 实现网络异常处理（AC-12）
  - 实现输入框焦点管理（Blur/.focus）
  - 同步文档标题：document.title = `${keyword} - 搜索`
  - 实现 ARIA 无障碍支持：结果容器设置 aria-live="polite"
  - 实现前置清理机制：container.innerHTML = ''
  - 实现 AbortController 防止异步竞态
- **Notes**: 记得更新 document.title；实现 abort 机制防止异步竞态

### [x] Task 2: 更新 router.js
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 在 pageOrder 中添加 search: 3
  - 实现 URL 参数支持（q, sort, filter）- 使用 URLSearchParams 原生 API
  - push/replace 模式区分
  - 实现滚动位置管理：
    - push (新搜索): 强制滚动到顶部 window.scrollTo(0, 0)
    - replace (筛选/排序): 保持当前滚动位置
    - popstate (后退): 恢复之前的滚动位置（手动记录 scrollY 到 history.state）
- **Notes**: 实现 Scroll Restoration 滚动位置管理

### [x] Task 3: 更新 renderer.js
- **Priority**: P0
- **Depends On**: Task 2
- **Description**: 
  - 添加 renderSearch 导入
  - 添加 case 'search' 渲染分支
  - 实现搜索页内原地刷新（禁用平移动画）- isSearchRefresh 检测
  - 实现 bindSearchControls 函数
  - 实现 PageOrder 兜底逻辑
    - const direction = (to.index === undefined || from.index === undefined) ? 'fade' : (to.index > from.index ? 'slide-left' : 'slide-right')
  - 实现动画防抖（使用 debounce）
- **Notes**: 实现方向判断的伪代码已提供；使用 debounce 防止动画防抖

### [x] Task 4: 修改 search.js
- **Priority**: P0
- **Depends On**: Task 3
- **Description**: 
  - 修改搜索按钮点击事件，调用 navigateToSearch
  - 修改 Enter 键处理，明确事件拦截顺序：
    - if (hasHighlightedItem) { selectItem(); return; }
    - if (!hasHighlightedItem) { triggerSearchRoute(); }
  - 添加 navigateToSearch 方法
  - 添加 syncInputFromURL 方法
  - 强制编码：encodeURIComponent(keyword)
  - 输入框失焦：input.blur()
- **Notes**: 严重警告：同步 URL 到 Input 时，必须检查 document.activeElement，防止覆盖用户正在输入的文字

### [x] Task 5: 更新 app.js
- **Priority**: P0
- **Depends On**: Task 4
- **Description**: 
  - 添加 parseInitialRoute 函数支持 URL 参数解析
  - 修改 initApp 使用 parseInitialRoute
- **Verification**:
  - app.js 能正确解析 URL 参数

### [x] Task 6: 排序和筛选功能
- **Priority**: P1
- **Depends On**: Task 1
- **Description**: 
  - 纯函数逻辑：processResults 处理排序筛选
  - 排序和筛选的点击事件调用 router.replace
  - 单向数据流：Click -> URL -> Render
  - Toggle/Reset 逻辑：再次点击已激活的按钮，取消该条件
  - UI 回显：根据 URL 参数高亮对应的按钮
  - 当 results.length === 0 时，自动禁用排序/筛选控件
- **Notes**: 当 results.length === 0 时，自动禁用排序/筛选控件

### [x] Task 7: 动画和动效设计
- **Priority**: P1
- **Depends On**: Task 6
- **Description**: 
  - 由 UX 智能体设计页面切换动画
  - 设计排序和筛选组件的交互动效
  - 设计搜索结果展示动效
  - 原地刷新优化：opacity 渐变（Fade Out -> Update Data -> Fade In）
  - 列表动效：FLIP 动画
- **Notes**: 重点关注性能和原地刷新体验

### [x] Task 8: 验证联想栏功能
- **Priority**: P1
- **Depends On**: Task 4
- **Description**: 
  - 验证联想栏功能完整性
  - 验证布局和动画不变
  - 移动端适配检查
  - 点击穿透验证
- **Notes**: 确保没有破坏现有功能

### [x] Task 9: 端到端测试
- **Priority**: P2
- **Depends On**: Task 5, Task 7, Task 8
- **Description**: 
  - 完整搜索流程测试
  - URL 参数持久化测试
  - 浏览器后退测试
  - 特殊字符测试
  - 长搜索词测试
  - 状态同步死锁预防测试
  - 滚动位置恢复测试
- **Notes**: 重点测试边界情况

## 任务依赖
- [Task 1] depends on [Task 0]
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 4]
- [Task 6] depends on [Task 1]
- [Task 7] depends on [Task 6]
- [Task 8] depends on [Task 4]
- [Task 9] depends on [Task 5, Task 7, Task 8]
