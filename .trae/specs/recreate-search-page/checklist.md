# 重建搜索页 - 验证清单

## Task 0: 工具函数验证
- [ ] searchHelper.js 文件存在
- [ ] processResults 纯函数存在
- [ ] URLSearchParams 工具函数存在（parseSearchParams, serializeSearchParams）
- [ ] debounce 函数存在

## 搜索页渲染模块验证
- [ ] src/js/pages/search.js 文件已创建
- [ ] renderSearch 函数只接受 params 作为输入（URL 驱动）
- [ ] 搜索页不包含单独的搜索栏
- [ ] 能正确显示搜索结果
- [ ] 搜索结果与 Query 严格匹配，且无重复项；搜索词为空时，列表清空
- [ ] 空状态处理正确（AC-9）
- [ ] 骨架屏实现（aria-hidden="true"）
- [ ] 网络异常处理正确（AC-12）
- [ ] 输入框焦点管理（Blur/.focus）
- [ ] document.title 同步为 "关键词 - 搜索"
- [ ] ARIA 无障碍支持（aria-live="polite"）
- [ ] 前置清理机制（container.innerHTML = ''）
- [ ] AbortController 防止异步竞态

## router.js 验证
- [ ] pageOrder 中已添加 search: 3
- [ ] _updateURL 支持 q, sort, filter 参数（使用 URLSearchParams 原生 API）
- [ ] push/replace 模式区分正确
  - [ ] 新关键词搜索 -> history.pushState（新增历史记录）
  - [ ] 页内刷新/排序/筛选 -> history.replaceState
- [ ] popstate 事件正确处理
- [ ] 滚动位置管理正确
  - [ ] push 时滚动到顶部 window.scrollTo(0, 0)
  - [ ] replace 时保持当前滚动位置
  - [ ] popstate 时恢复之前的滚动位置

## renderer.js 验证
- [ ] 已添加 renderSearch 导入
- [ ] switch 语句包含 case 'search'
- [ ] 搜索页内原地刷新正确实现（isSearchRefresh 检测）
- [ ] bindSearchControls 函数正确实现
- [ ] PageOrder 兜底逻辑正确
  - [ ] const direction = (to.index === undefined || from.index === undefined) ? 'fade' : (to.index > from.index ? 'slide-left' : 'slide-right')
- [ ] 动画防抖正确实现（使用 debounce）

## search.js 验证
- [ ] 搜索按钮点击调用 navigateToSearch
- [ ] Enter 键处理事件拦截顺序正确：
  - [ ] if (hasHighlightedItem) { selectItem(); return; }
  - [ ] if (!hasHighlightedItem) { triggerSearchRoute(); }
- [ ] navigateToSearch 方法正确实现
- [ ] syncInputFromURL 方法正确实现
  - [ ] 只有当输入框没有焦点时才同步（document.activeElement !== input）
- [ ] 强制编码：encodeURIComponent(keyword)
- [ ] 输入框失焦：input.blur()
- [ ] 联想栏回车键映射已取消

## app.js 验证
- [ ] parseInitialRoute 函数正确实现
- [ ] initApp 正确使用 parseInitialRoute

## 搜索行为验证
- [ ] 点击搜索按钮后跳转到搜索页
- [ ] 按回车键（未选中建议项）跳转到搜索页
- [ ] 搜索栏和搜索页作为独立模块

## 联想栏功能验证
- [ ] 联想栏布局保持不变
- [ ] 联想栏显示/隐藏动画保持不变
- [ ] 输入触发联想功能正常
- [ ] 上下箭头选择功能正常
- [ ] 左右箭头翻页功能正常
- [ ] 点击建议项功能正常
- [ ] 回车键映射已取消
- [ ] 移动端适配检查通过（Z-Index 正确）
- [ ] 点击穿透验证通过

## 排序功能验证
- [ ] 搜索页有排序 UI 组件
- [ ] 排序功能正常工作
- [ ] 排序状态保存到 URL 参数
- [ ] 单向数据流：Click -> URL -> Render
- [ ] Toggle/Reset 逻辑正确（再次点击已选中的项取消选择）
- [ ] UI 回显正确（根据 URL 参数高亮按钮）
- [ ] 当 results.length === 0 时，排序控件自动禁用或隐藏

## 筛选功能验证
- [ ] 搜索页有筛选 UI 组件
- [ ] 筛选功能正常工作
- [ ] 筛选状态保存到 URL 参数
- [ ] 单向数据流正确
- [ ] Toggle/Reset 逻辑正确
- [ ] UI 回显正确
- [ ] 当 results.length === 0 时，筛选控件自动禁用或隐藏

## 页面切换动画验证
- [ ] 从其他页面跳转到搜索页采用平移切换效果
- [ ] 搜索页内刷新不触发平移动画
- [ ] 兜底场景使用淡入或 SlideUp 动画
- [ ] 原地刷新使用 opacity 渐变（Fade Out -> Update Data -> Fade In）

## URL 参数验证
- [ ] URL 参数能正确初始化搜索结果
- [ ] 刷新页面后搜索结果保持
- [ ] 浏览器后退功能正常
- [ ] 特殊字符正确编码/解码
- [ ] XSS/特殊字符测试：搜索 <script>, &, %, / 等字符，页面无报错，URL 参数无乱码

## 浏览器历史与导航 (Browser History & Navigation)
- [ ] 后退键验证（新搜索）：搜索 A -> 搜索 B -> 后退 -> 回到 A 且搜索栏恢复为 "A"
- [ ] 后退键验证（筛选/排序）：搜索 A -> 点击"按价格排序" -> 后退 -> 回到"默认排序"状态
- [ ] 滚动位置恢复：在搜索结果页向下滚动 -> 进入详情页 -> 后退 -> 停留在原来的垂直位置

## 竞态与防抖 (Race Conditions & Debounce)
- [ ] 快速输入测试：快速连续输入字符，URL 和结果只更新最后一次
- [ ] 异步竞态测试：先搜 "A"（慢）立刻搜 "B"（快），最终显示 "B" 的结果

## 移动端专项 (Mobile Specifics)
- [ ] 虚拟键盘交互：键盘弹出时不遮挡联想栏或导致布局错乱
- [ ] 键盘类型确认：enterkeyhint="search"
- [ ] 点击穿透：点击联想栏背景不触发下方搜索结果页的卡片点击

## 无障碍访问 (Accessibility / A11y)
- [ ] 屏幕阅读器：搜索结果更新时能自动朗读
- [ ] 键盘导航 (Tab Order)：Tab 键能顺畅切换

## 破坏性与边界测试 (Destructive Testing)
- [ ] 超长文本测试：输入超过 100 个字符，Header 不崩坏，URL 不截断
- [ ] 无结果交互：结果为 0 时排序和筛选按钮禁用或隐藏
- [ ] 极速切换路由：快速切换页面不报错
- [ ] 手动修改 URL：错误参数时页面容错（显示默认排序）而不是白屏

## 端到端测试
- [ ] 完整搜索流程正常工作
- [ ] 所有现有功能正常工作
- [ ] 状态同步死锁预防测试通过
- [ ] 长搜索词测试通过
