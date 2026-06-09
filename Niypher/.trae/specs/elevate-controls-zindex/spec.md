# 提升 Docker 栏、搜索栏、标题栏 z-index Spec

## Why
标题栏 z-index 仅为 40，搜索栏在标题栏内部，容易被模态框(z-100)、通知(z-1000)、hero clone(z-9999) 等元素遮挡。Docker 栏 z-index 为 9999，与 hero clone 相同，也存在被遮挡风险。需要确保这三个控件永远位于最上层。

## What Changes
- 标题栏 header 的 z-index 从 `z-40` 提升到 `z-[10000]`
- Docker 导航栏 nav 的 z-index 从 `z-[9999]` 提升到 `z-[10001]`
- 移动搜索遮罩的 z-index 从 `z-[60]` 提升到 `z-[10002]`
- Hero clone 的 z-index 从 `9999` 提升到 `9998`（低于三个控件）

## Impact
- Affected code: `dist/index.html`（header/nav/搜索遮罩的 Tailwind 类）, `src/css/styles.css`（hero-clone z-index）

## ADDED Requirements

### Requirement: 三个控件永远位于最上层
标题栏、Docker 栏、搜索栏 SHALL 具有高于所有其他元素的 z-index，确保不被任何元素遮挡。

#### Scenario: Hero 飞行动画期间
- **WHEN** hero 飞行克隆元素在页面上移动
- **THEN** 标题栏、Docker 栏、搜索栏仍可见且不被克隆元素遮挡

#### Scenario: 模态框/通知显示时
- **WHEN** 公告模态框或通知弹出
- **THEN** 标题栏、Docker 栏仍可见（模态框在三个控件之下）

## MODIFIED Requirements

### Requirement: z-index 层级体系
| 元素 | 旧 z-index | 新 z-index |
|------|-----------|-----------|
| 移动搜索遮罩 | z-[60] | z-[10002] |
| Docker 导航栏 | z-[9999] | z-[10001] |
| 标题栏 | z-40 | z-[10000] |
| Hero clone | 9999 | 9998 |
| 模态框 | z-[100] | z-[100]（不变） |
| 通知 | 1000 | 1000（不变） |
