# 修复网站样式丢失与功能失效 Spec

## Why
网站所有 Tailwind CSS 工具类样式丢失，导致控件样式丢失、缩放失灵、功能无法使用。根本原因是 CSS 入口文件 `main.css` 缺少 `@import "tailwindcss"` 指令。项目使用 Tailwind CSS v4 + `@tailwindcss/vite` 插件，但入口 CSS 文件未引入 Tailwind，导致所有 Tailwind 工具类（如 `flex`, `items-center`, `fixed`, `w-full`, `bg-gray-50`, `h-screen` 等）均未被生成。

## What Changes
- 在 `src/css/main.css` 顶部添加 `@import "tailwindcss"` 指令
- 验证 Tailwind v4 的 `@theme` 配置与现有 CSS 变量兼容性
- 确保 `tokens.css` 中的自定义 CSS 变量在 Tailwind 引入后仍然生效
- 验证构建产物包含正确的 Tailwind CSS

## Impact
- Affected specs: 全站所有页面的样式和布局
- Affected code: `src/css/main.css`, `src/css/base/tokens.css`, `src/css/styles.css`

## ADDED Requirements
### Requirement: Tailwind CSS 入口引入
系统 SHALL 在 CSS 入口文件 `src/css/main.css` 中正确引入 Tailwind CSS v4，确保所有工具类样式生效。

#### Scenario: Tailwind 工具类正常生成
- **WHEN** 执行 `vite build` 或 `vite dev`
- **THEN** 构建产物中包含完整的 Tailwind CSS 工具类样式
- **AND** 页面上所有使用 Tailwind 工具类的元素正确渲染

#### Scenario: 自定义 CSS 变量与 Tailwind 共存
- **WHEN** Tailwind CSS 被引入后
- **THEN** `tokens.css` 和 `styles.css` 中的自定义 CSS 变量仍然正常工作
- **AND** 亚克力效果、暗色模式等自定义样式不受影响

### Requirement: Tailwind v4 主题配置
系统 SHALL 在 `tokens.css` 中使用 Tailwind v4 的 `@theme` 指令注册自定义设计令牌，确保 Tailwind 工具类可以使用项目自定义的颜色和间距变量。

#### Scenario: 自定义颜色变量在 Tailwind 工具类中可用
- **WHEN** HTML 中使用 `bg-primary`, `text-primary` 等基于自定义变量的工具类
- **THEN** 这些工具类能正确应用对应的 CSS 变量值
