# Tasks

- [x] Task 1: 详情页 Hero 主图改为 16:9 比例
  - [x] 修改 `detail.js`：L0 Hero 区域 `<img>` 添加 `aspect-ratio: 16/9` 和 `object-fit: cover`，移除方形 `w-24 h-24 rounded-2xl` 改为完整宽度图片
  - [x] 修改 `styles.css`：添加 `.detail-hero-img` 样式
  - **验证**：打开任意游戏详情页，主图以 16:9 比例显示 ✅

- [x] Task 2: 全局网格最小列数改为双列
  - [x] 修改 `app.js` 中 `initResizeObserverGrid` 函数：列数策略改为 ≤480→2, ≤768→2~3, ≤1200→3~4, >1200→4
  - [x] 修改 `styles.css` 中 `.game-cards-container` 的 grid 定义：`grid-template-columns: repeat(auto-fill, minmax(160px, 1fr))` 改为 `grid-template-columns: repeat(2, 1fr)`（初始回退）
  - **验证**：手机竖屏下游戏卡片始终以 2 列显示，平板 3 列，桌面 4 列 ✅

- [x] Task 3: 创建多源设备检测模块 `deviceDetector.js`
  - [x] 实现 5 种检测手段：
    - UA Parsing：正则匹配 `Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini`
    - CSS Media Query：`matchMedia('(pointer: coarse)')`
    - Window MatchMedia：`matchMedia('(max-width: 768px)')`
    - Hardware Fingerprint：`hardwareConcurrency ≤ 4`、`deviceMemory ≤ 4`、`screen.width ≤ 768`、`ontouchstart`
  - [x] 实现多数投票判定逻辑（≥3/5 票 → mobile）
  - [x] 暴露 `isMobile` / `isDesktop` / `isTablet` / `deviceInfo` 属性
  - [x] 监听 `resize` + `matchMedia` change，触发 `device:changed` 事件
  - **验证**：Console 运行 `deviceDetector.isMobile` 返回正确值 ✅

- [x] Task 4: 设备检测集成到应用入口
  - [x] 修改 `app.js`：在 `initApp()` 中调用 `deviceDetector.init()`
  - [x] 将 `DeviceDetector` 挂载到 `window.__NPHER_V2`
  - [x] 移动端检测结果传递给 ResizeObserver 网格（跳过 >768px 的 matchMedia 重新检测）
  - **验证**：F12 → 切换设备模拟 → 刷新页面 → `window.__NPHER_V2.deviceDetector.isMobile` 正确反映设备类型 ✅

- [x] Task 5: 动态路由重定向
  - [x] 在 `DeviceDetector.init()` 完成后检查当前路由
  - [x] 桌面端首访且无 `#` hash 时，可选择注入桌面优化提示
  - [x] 路由变化时保持设备检测结果的响应性
  - **验证**：桌面端和移动端分别加载，各自获得正确的布局 ✅

# Task Dependencies
- Task 1 和 Task 2 相互独立，可并行
- Task 3 独立，可与 Task 1/2 并行
- Task 4 依赖 Task 3
- Task 5 依赖 Task 3 和 Task 4
