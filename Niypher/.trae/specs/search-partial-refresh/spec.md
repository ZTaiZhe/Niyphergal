# 搜索页筛选排序局部刷新 - 规范文档

## Why
当前搜索页更改筛选和排序条件时，整个页面（包括筛选和排序卡片）都会重新渲染，用户体验不佳。用户希望只刷新搜索结果部分，并添加卡片离开和载入的交错动效。

## What Changes
- 更改筛选/排序条件时，只刷新搜索结果部分
- 筛选和排序卡片保持不变，仅更新按钮状态
- 搜索结果卡片添加交错离开动效（淡出+下移）
- 搜索结果卡片添加交错载入动效（淡入+上移）
- 引入 Feature Flag 控制新旧渲染逻辑的分流
- 实现状态回滚机制处理异常情况

## Impact
- Affected specs: recreate-search-page, add-sort-order-toggle
- Affected code: 
  - src/js/pages/search.js (分离渲染逻辑)
  - src/js/modules/renderer.js (局部刷新逻辑)
  - src/css/styles.css (交错动效样式)

## ADDED Requirements

### Requirement: Feature Flag 灰度开关
系统 SHALL 提供 Feature Flag 控制新旧渲染逻辑的分流。

#### Scenario: 灰度开关
- **WHEN** Feature Flag (enable_partial_refresh) 开启
- **THEN** 使用新的局部刷新逻辑
- **WHEN** Feature Flag 关闭
- **THEN** 回退到旧的整页刷新逻辑

### Requirement: 局部刷新功能
系统 SHALL 在更改筛选/排序条件时，仅刷新搜索结果部分，不重新渲染筛选和排序卡片。

#### Scenario: 更改筛选条件
- **WHEN** 用户点击筛选按钮
- **THEN** 筛选卡片保持不变，仅更新按钮激活状态
- **AND** 搜索结果卡片执行离开动效后重新加载

#### Scenario: 更改排序条件
- **WHEN** 用户点击排序按钮或正倒序按钮
- **THEN** 排序卡片保持不变，仅更新按钮激活状态
- **AND** 搜索结果卡片执行离开动效后重新加载

### Requirement: 交错动效
系统 SHALL 为搜索结果卡片提供交错离开和载入动效。

#### Scenario: 卡片离开动效
- **WHEN** 更改筛选/排序条件
- **THEN** 搜索结果卡片按顺序一项项离开（淡出+下移）

#### Scenario: 卡片载入动效
- **WHEN** 新的搜索结果加载完成
- **THEN** 搜索结果卡片按顺序一项项载入（淡入+上移）

### Requirement: 并行处理优化
系统 SHALL 在更改条件时并行执行动效和数据请求。

#### Scenario: 动效与请求并行
- **WHEN** 用户点击筛选/排序按钮
- **THEN** 立即发起数据请求，同时开始执行旧卡片的离开动效
- **AND** 如果数据请求较快，等待离开动效结束后立即执行载入
- **AND** 如果网络较慢，离开动效结束后显示加载状态（骨架屏）

#### Scenario: Promise.all 同步机制
- **WHEN** 并行处理动效和数据请求
- **THEN** 使用 Promise.all 等待动效和数据双重 Resolve
- **AND** 再执行 ENTERING 状态，确保视觉连贯不断层

### Requirement: 防重复点击与竞态处理
系统 SHALL 防止快速连续点击导致的数据混乱。

#### Scenario: 防重复点击
- **WHEN** 动效执行期间或数据请求期间
- **THEN** 短暂禁用筛选按钮（或使用节流/防抖策略）

#### Scenario: 竞态处理
- **WHEN** 发生连续请求
- **THEN** 使用 AbortController 取消上一个请求
- **AND** 只渲染最后一次点击的结果

### Requirement: 空状态处理
系统 SHALL 在新条件无结果时显示平滑过渡。

#### Scenario: 无结果载入
- **WHEN** 新条件搜索结果为 0
- **THEN** 卡片离开后，载入"无匹配结果"的缺省页
- **AND** 缺省页应有平滑的淡入动效

### Requirement: 异常状态处理
系统 SHALL 在接口请求失败/超时时显示错误反馈。

#### Scenario: 网络异常
- **WHEN** 网络断开或接口返回错误
- **THEN** 卡片执行完离开动效后，载入"加载失败/重试"的错误反馈页
- **AND** 允许用户点击重新请求

### Requirement: 状态回滚机制
系统 SHALL 在网络异常时回滚乐观更新的状态。

#### Scenario: 状态回滚
- **WHEN** 网络异常或接口返回错误
- **THEN** 撤销已更新的按钮激活状态
- **AND** 回退 URL 参数到点击前的状态
- **AND** 确保用户刷新页面不会处于错误的数据状态

### Requirement: URL 状态同步
系统 SHALL 在状态变更时同步 URL 参数。

#### Scenario: URL 同步
- **WHEN** 更改筛选/排序条件并发起局部刷新
- **THEN** 使用 history.replaceState 无刷新地更新 URL Query 参数
- **AND** 确保用户复制链接分享或按 F5 刷新时，能还原当前界面状态

### Requirement: 路由历史记录闭环
系统 SHALL 正确响应浏览器的后退/前进操作。

#### Scenario: 浏览器后退/前进
- **WHEN** 用户点击浏览器的后退或前进按钮（触发 popstate 事件）
- **THEN** 系统解析当前 URL 参数
- **AND** 自动触发局部刷新逻辑（包含正确的离开与载入动效），还原对应状态的搜索结果

### Requirement: 分页重置
系统 SHALL 在更改筛选/排序条件时重置分页状态。

#### Scenario: 分页重置
- **WHEN** 用户更改筛选或排序条件
- **THEN** 当前页码重置为 Page 1
- **AND** 销毁底部的"加载更多"或重置分页器状态

### Requirement: 视图滚动重置
系统 SHALL 在新结果载入时重置用户的视觉焦点。

#### Scenario: 滚动条复位
- **WHEN** 搜索结果执行 ENTERING (载入) 动效前
- **THEN** 检查当前页面的滚动位置
- **AND** 如果用户已经向下滚动超过了搜索结果容器的顶部，平滑滚动（scroll-behavior: smooth）回容器顶部

### Requirement: 无障碍访问
系统 SHALL 确保局部刷新对屏幕阅读器友好。

#### Scenario: ARIA 实时区域
- **WHEN** 搜索结果更新
- **THEN** 屏幕阅读器能通过 aria-live="polite" 提示用户

#### Scenario: 键盘焦点管理
- **WHEN** DOM 局部被替换后
- **THEN** 如果焦点原本在被销毁的卡片上
- **AND** 系统将焦点平滑转移到搜索结果列表容器或第一条新加载的卡片
- **AND** 确保使用 Tab 键导航的连贯性

### Requirement: 性能与用户行为度量 (Telemetry)
系统 SHALL 收集局部刷新的核心性能与业务指标。

#### Scenario: 埋点监控
- **WHEN** 局部刷新流程结束（ENTERING 完成）
- **THEN** 上报 `Filter_Applied` 业务事件
- **AND** 上报 `Time_to_New_Results`（从点击到首屏图片加载完毕的真实耗时）以便持续监控用户体验

## Technical Constraints

### 动画参数定义
- 卡片动画持续时间：300ms
- 每张卡片交错延迟：30ms
- 缓动函数：ease-out
- 最大交错延迟限制：前 10-15 个卡片加延迟，后续同时出现

### 性能优化约束
- **必须且仅使用** `transform: translateY(...)` 和 `opacity` 实现动画
- **禁止使用** `top`、`margin-top` 等会引起页面重排的 CSS 属性
- 使用 CSS 变量 `--delay` 控制交错延迟
- 使用 `DocumentFragment` 批量更新 DOM

### 无障碍与性能约束 (A11y & Performance)
- **动画禁用回退**：必须使用 `@media (prefers-reduced-motion: reduce)`，系统开启减弱动画时取消交错和位移，仅保留极快的透明度过渡（1ms 或简单淡入淡出）
- **Promise 同步机制**：并行处理需通过 `Promise.all` 等待动效和数据双重 Resolve，再执行 ENTERING，确保视觉连贯不断层

### URL同步与路由闭环
- 核心筛选条件改变使用 `history.pushState`（产生历史记录）
- 分页等微小状态改变使用 `history.replaceState`（不堆叠历史记录）
- 全局监听 `window.addEventListener('popstate')` 以接管浏览器导航

### 缓存与网络体验约束 (Network & Caching)
- **内存缓存 (SWR)**：对相同参数的请求结果进行短时内存缓存（如 3-5 分钟），命中缓存时跳过 FETCHING 等待，动效无缝衔接
- **骨架屏防闪烁 (Anti-Flicker)**：离开动效结束且网络请求耗时超过 200ms 时，才渲染骨架屏；避免超快网络下的页面闪烁

### 动效状态机
```
IDLE (静止) -> UPDATING (执行动效与发请求并行) -> 判断（若动效先结束则展示骨架屏等待请求；若请求先结束则等待动效完毕） -> ENTERING (进入中) -> IDLE
```
- 任意阶段被中断时，都有对应的清理（Cleanup）逻辑

### 事件代理
- 筛选和排序按钮的点击事件使用父容器事件代理
- 减少内存消耗并提高初始化速度

### 图片预加载优化
- 在使用 DocumentFragment 组装 DOM 时，监听首屏内卡片（前几张）的 img.onload 事件
- 当首屏核心图片加载完成（或设定的极短超时时间到达）后，再触发 ENTERING 动效
- 优化 LCP (Largest Contentful Paint) 体验
