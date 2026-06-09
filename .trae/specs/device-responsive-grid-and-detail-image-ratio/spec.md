# 设备自适应网格、详情图比例与设备检测 Spec

## Why
当前系统中存在三个问题：
1. 详情页游戏主图比例与首页卡片不一致，视觉跳脱
2. 移动端最小列数只有 1 列，信息密度低，用户体验不佳
3. 缺乏系统级的设备端类型判定能力，无法根据设备做差异化优化

## What Changes
- **BREAKING**：详情页 Hero 主图比例从方形(1:1)改为 16:9，与首页卡片封面一致
- **BREAKING**：全局网格最小列数从 1 列改为 2 列（移动端默认双列）
- 新增设备检测模块，聚合 5 种检测手段判断移动端/桌面端
- 接入动态路由重定向，桌面端可跳转到优化版布局

## Impact
- Affected specs: refactor-homepage-layout-transitions
- Affected code: `src/js/pages/detail.js`, `src/css/styles.css`, `src/js/modules/renderer.js`, `src/js/app.js`, `.trae/specs/refactor-homepage-layout-transitions/`
- New files: `src/js/modules/deviceDetector.js`

---

## ADDED Requirements

### Requirement: Detail Page Hero Image 16:9 Ratio
详情页游戏主图 SHALL 使用 16:9 比例，与首页卡片封面一致。

#### Scenario: 进入详情页
- **WHEN** 用户点击任意游戏卡片进入详情页
- **THEN** Hero 区域的主图以 16:9 宽高比显示（`aspect-ratio: 16/9`）
- **AND** 图片使用 `object-fit: cover` 裁剪适配

#### Scenario: 深色模式
- **WHEN** 系统处于深色模式
- **THEN** 16:9 主图背景色随主题变量自适应

---

### Requirement: Minimum Two-Column Grid
全局游戏卡片网格在移动端 SHALL 至少显示 2 列。

#### Scenario: 手机竖屏（<480px）
- **WHEN** 视口宽度 ≤ 480px
- **THEN** 游戏卡片以 2 列网格显示

#### Scenario: 平板竖屏（480px ~ 768px）
- **WHEN** 视口宽度在 480px 到 768px 之间
- **THEN** 游戏卡片以 2~3 列网格显示

#### Scenario: 平板横屏（768px ~ 1200px）
- **WHEN** 视口宽度在 768px 到 1200px 之间
- **THEN** 游戏卡片以 3~4 列网格显示

#### Scenario: 桌面端（>1200px）
- **WHEN** 视口宽度 > 1200px
- **THEN** 游戏卡片以 4 列网格显示

---

### Requirement: Multi-Source Device Detection
系统 SHALL 通过 5 种独立手段综合判定设备类型：

1. **UA Parsing**：解析 `navigator.userAgent`，匹配 `Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini` 关键字
2. **CSS Media Query**：检查 `matchMedia('(pointer: coarse)').matches` 判断触摸设备
3. **Window MatchMedia**：检查 `matchMedia('(max-width: 768px)').matches` 判断小屏设备
4. **Hardware Fingerprint Audit**：综合维度：
   - `navigator.hardwareConcurrency ≤ 4`（低端 CPU）
   - `navigator.deviceMemory ≤ 4`（低内存）
   - `screen.width ≤ 768 || screen.height ≤ 768`（小屏）
   - `'ontouchstart' in window`（触摸支持）
5. **Dynamic Route Redirect**：当检测结果与当前路由不匹配时，自动重定向

#### Scenario: 移动端判定
- **WHEN** 5 种检测中 ≥ 3 种判定为移动端
- **THEN** `DeviceDetector.isMobile` 返回 `true`
- **AND** 应用启用移动端优化布局（双列、缩小间距、增大触控区域）

#### Scenario: 桌面端判定
- **WHEN** 5 种检测中 < 3 种判定为移动端
- **THEN** `DeviceDetector.isMobile` 返回 `false`
- **AND** 应用启用桌面端优化布局（更多列、正常间距）

#### Scenario: 动态路由重定向
- **WHEN** 桌面端用户首次加载页面
- **THEN** 可选择重定向到桌面优化版路由（如 `#/desktop`）
- **AND** 移动端用户保持当前路由

---

### Requirement: Device Detection Module
系统 SHALL 提供独立的 `deviceDetector.js` 模块，暴露设备检测结果。

#### Scenario: 模块初始化
- **WHEN** 应用启动时调用 `DeviceDetector.init()`
- **THEN** 执行全部 5 种检测手段
- **AND** 将结果挂载到 `window.__NPHER_V2.deviceDetector`

#### Scenario: 响应式变化监听
- **WHEN** 设备旋转或窗口大小变化触发 `matchMedia` 回调
- **THEN** `DeviceDetector` 重新评估设备类型
- **AND** 触发 `device:changed` 自定义事件
