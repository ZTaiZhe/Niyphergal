# CSS/HTML 结构和视觉错误修复 Spec

## Why
项目存在多处 CSS/HTML 致命缺陷：index.html 链接了错误的 CSS 入口文件导致 Tailwind CSS 和 tokens.css 变量完全未加载；CSS 中存在变量命名不一致、关键帧冲突、非法嵌套语法等问题，导致全局布局崩溃、颜色混乱、文字异常、动画失效、acrylic 效果缺失。

## What Changes
- **BREAKING** 修复 index.html CSS 入口链接，从 `styles.css` 改为 `main.css`（修复后 Tailwind + tokens 生效）
- 修复 CSS 变量命名不一致：合并 `--color-accent` / `--accent-color` 为统一名称
- 修复 @keyframes rippleEffect 两次定义的致命冲突
- 修复 #search-suggestions 选择器重复定义
- 修复 @media 嵌套语法在纯 CSS 中无效的问题
- 修复 .glass-card:hover transition 中 `border-color` 写成 `.border-color` 的笔误
- 清理 styles.css 中重复的 :root 变量定义（tokens.css 中已定义）
- 修复 index.html 中的 HTML 结构问题

## Impact
- Affected specs: 全局样式、主题系统、搜索栏、卡片布局、按钮动画、acrylic 效果、响应式布局
- Affected code: index.html, styles.css, tokens.css, main.css

## ADDED Requirements

### Requirement: CSS 入口正确加载
系统 SHALL 在 index.html 中通过 `<link>` 引用正确的 CSS 入口文件 `main.css`（而非 `styles.css`），确保 Tailwind CSS 工具类和 tokens.css 变量被正确加载。

#### Scenario: 页面加载 Tailwind 样式
- **WHEN** 浏览器加载 index.html
- **THEN** Tailwind CSS 工具类（如 `bg-gray-50`、`flex`、`h-screen`、`text-lg` 等）应正确生效

#### Scenario: CSS 变量可用
- **WHEN** 浏览器渲染页面
- **THEN** `--color-accent`、`--acrylic-bg`、`--acrylic-blur` 等 tokens.css 变量应被正确解析

### Requirement: CSS 变量命名统一
系统 SHALL 在所有 CSS 文件和 JS 代码中使用统一的 CSS 变量命名规范。清除重复定义，确保 `--color-accent` 与 `--accent-color` 的引用一致。

#### Scenario: acrylic-panel 背景生效
- **WHEN** 页面使用 `acrylic-panel` 类
- **THEN** `backdrop-filter: blur(var(--acrylic-blur))` 应正确解析变量值 12px

### Requirement: @keyframes 不冲突
系统 SHALL 确保同一 CSS 文件中每个 `@keyframes` 名称全局唯一。`rippleEffect` 关键帧应仅定义一次。

#### Scenario: 排序按钮点击水波纹
- **WHEN** 用户点击排序切换按钮
- **THEN** 水波纹动画应正确播放（不因关键帧冲突而失效）

### Requirement: CSS 语法正确
系统 SHALL 不包含无效的 CSS 选择器和属性。@media 嵌套应转换为合法形式。

#### Scenario: CSS 无解析错误
- **WHEN** 浏览器解析 CSS
- **THEN** 不应有 CSS 语法错误或属性名拼写错误

### Requirement: HTML 结构规范
系统 SHALL 确保 HTML 标签正确闭合，CSS 引用路径有效，无多余空白节点。

#### Scenario: HTML 通过验证
- **WHEN** HTML 被解析
- **THEN** 所有标签正确嵌套和闭合，资源引用路径有效

## MODIFIED Requirements

### Requirement: 统一 :root 变量定义
删除 styles.css 中与 tokens.css 重复的 :root 变量定义，仅保留 styles.css 独有的变量定义（如 `--dark-*`、`--header-*`、`--refresh-*` 等）。所有颜色/间距/阴影/accent 变量仅由 tokens.css 定义。

### Requirement: CSS 变量名引用统一
将所有 `--accent-color` / `--dark-accent-color` 的引用统一改为 `--color-accent`（与 tokens.css 的 `body.dark { --color-accent: #ec4899; }` 对齐）。相应地修改所有使用 `--accent-color` 的选择器。

## REMOVED Requirements

### Requirement: 移除 styles.css 重复的 :root 变量
**Reason**: tokens.css 已通过 main.css 的 @import 加载，styles.css 中第1-32行和第44-52行的 :root 变量与 tokens.css 完全重复。
**Migration**: 删除 styles.css 第1-32行（第一个 :root 块），删除第44-52行（第二个 :root 块，acrylic 变量），保留 body.dark 块中的 acrylic 覆盖（第54-65行）。
