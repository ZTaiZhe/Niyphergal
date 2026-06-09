# 搜索页筛选排序局部刷新 - 检查清单

## 🚩 Milestone 1: 基础设施与状态层重构 (PR 1)

### Task 1: UI/UX 规范与样式引擎层
- [x] CSS 交错动效类已实现（.is-leaving, .is-entering，使用 transform/opacity）
- [x] CSS 变量 `--delay` 已实现交错延迟控制
- [x] 最大交错延迟限制已实现（前 10-15 个卡片）
- [x] 加载骨架屏样式已设计
- [x] 空状态缺省页样式已设计
- [x] 网络异常页样式已设计
- [x] @media (prefers-reduced-motion: reduce) 已添加（transition 设为 0ms 或 1ms）
- [x] 动画参数已确定（300ms, ease-out, 30ms）

### Task 2: 数据层与状态机抽象
- [x] Feature Flag (enable_partial_refresh) 已引入
- [x] renderSearchResults 函数已分离
- [x] updateFilterButtons 函数已分离
- [x] history.pushState 用于核心条件改变
- [x] history.replaceState 用于微小状态改变
- [x] popstate 事件监听已实现
- [x] **🛡️ history.scrollRestoration = 'manual' 已设置**
- [x] 分页重置逻辑已实现

## 🚩 Milestone 2: 核心调度与闭环渲染 (PR 2)

### Task 3: 网络层与并发调度
- [x] AbortController 竞态处理已实现
- [x] SWR 内存缓存机制已实现（参数哈希）
- [x] Promise.all 同步机制已实现
- [x] 骨架屏防闪烁机制已实现（> 200ms）
- [x] **🛡️ 核心 Unit Test 已编写**（竞态拦截与 SWR 缓存命中率）

### Task 4: 视图层局部渲染与异常流
- [x] 动效状态机已实现（IDLE -> UPDATING -> ENTERING -> IDLE）
- [x] **🛡️ 内存优化**：DocumentFragment 批量更新已实现
- [x] **🛡️ 内存优化**：旧 DOM 销毁前清理非代理事件/组件实例
- [x] 事件代理已实现
- [x] 图片预加载 (LCP) 已实现（前 3 张）
- [x] **🌟 异常闭环已实现**：
  - [x] 断网/接口 5xx 时状态回滚（按钮激活态 + URL 参数）
  - [x] 断网/接口 5xx 时显示错误反馈页
  - [x] 重试功能已实现
  - [x] 空状态缺省页过渡已实现

## 🚩 Milestone 3: 体验打磨、监控与验收 (PR 3)

### Task 5: 焦点流转与无障碍体验
- [x] aria-live="polite" 已添加
- [x] aria-busy="true/false" 已添加
- [x] 键盘焦点管理已实现
- [x] 滚动位置重置已实现

### Task 6: 性能度量与埋点监控
- [x] Filter_Applied 业务事件埋点已实现（附带筛选项参数）
- [x] Time_to_New_Results 性能指标埋点已实现（Performance API）
- [x] Fetch_Abort_Count 监控已实现
- [x] Fallback_Error_Count 监控已实现

### Task 7: QA 与端到端回归验证
- [x] Feature Flag 开启/关闭降级逻辑验证通过
- [x] **🛡️ SEO 与首屏验证通过**（SSR 不受破坏）
- [x] 动效流畅度验证通过（≥ 50fps）
- [x] 极限压力测试验证通过
- [x] 减弱动态效果回退验证通过
- [x] 3G 弱网骨架屏逻辑验证通过
- [x] Offline 状态回滚验证通过
- [x] Tab 键焦点流转验证通过
