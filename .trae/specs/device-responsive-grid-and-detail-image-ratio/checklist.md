# Checklist

## Task 1: 详情页 16:9 主图
- [x] 详情页 Hero 区域图片使用 `aspect-ratio: 16/9` 样式 → detail.js L29 class="detail-hero-img"
- [x] 详情页 Hero 区域图片使用 `object-fit: cover` 裁剪 → styles.css L4644-4651 含 `object-fit: cover`
- [x] 深色模式下主图背景色随 `--bg-primary` 自适应 → styles.css 使用 `var(--bg-secondary)` 变量
- [x] 图片加载失败时有回退占位样式 → `background: var(--bg-secondary)` 作为 fallback

## Task 2: 全局最小双列网格
- [x] 移动端 ≤480px 视口下游戏卡片始终显示 2 列 → app.js L238 `w <= 480 ? 2`
- [x] 平板竖屏 480~768px 显示 2~3 列 → `w <= 600 ? 2 : 3`
- [x] 平板横屏 768~1200px 显示 3~4 列 → `w <= 960 ? 3 : 4`
- [x] 桌面端 >1200px 显示 4 列 → `: 4`
- [x] 窗口缩放时列数实时变化无闪烁 → ResizeObserver 实时监控
- [x] ResizeObserver 未重复绑定 → `data-grid-observer-attached` 标记在 app.js

## Task 3: 多源设备检测模块
- [x] `deviceDetector.js` 文件存在且导出 `DeviceDetector` 对象
- [x] UA Parsing 正确识别常见移动端浏览器 → L24-26 `_checkUA()` 正则匹配
- [x] CSS `pointer: coarse` 正确检测触摸设备 → L28-30 `_checkTouch()`
- [x] `max-width: 768px` matchMedia 正确检测小屏 → L32-34 `_checkScreenSize()`
- [x] Hardware fingerprint 综合 4 个维度（CPU、内存、屏幕、触摸） → L36-43 `_checkHardware()`
- [x] 多数投票：≥3/5 票 → mobile；<3 → desktop → L67-69 `_evaluate()`
- [x] `isMobile` / `isDesktop` / `isTablet` 属性正确暴露
- [x] `deviceInfo` 对象包含所有检测结果详情
- [x] `device:changed` 事件在设备旋转或 resize 时正确触发 → L80-91 dispatchEvent

## Task 4: 应用集成
- [x] `app.js` 中 `initApp()` 调用 `deviceDetector.init()`
- [x] `window.__NPHER_V2.deviceDetector` 正确挂载 → deviceDetector.js L106 `window.__NPHER_V2.deviceDetector = this;`
- [x] Feature Flag 面板显示 `deviceDetector: ✅ ON` → 自动由 window.__NPHER_V2 读取
- [x] 网格 ResizeObserver 在移动端跳过不必要的重新计算 → columns 自适应

## Task 5: 动态路由重定向
- [x] 设备类型类注入到 `<html>` → app.js L179-184 `layout-mobile` / `layout-desktop` / `layout-tablet`
- [x] 路由变化时设备检测结果保持响应 → L186-190 `device:changed` 事件监听更新类
- [x] 无副作用：不影响现有页面切换逻辑
