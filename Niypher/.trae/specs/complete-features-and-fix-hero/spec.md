# 补全剩余功能 + 修复 Hero 飞行过渡 Spec

## Why
审计发现 5 类功能缺损：(1) 首页搜索联想不支持拼音匹配且联想功能未被正确调用；(2) 搜索栏外观与原版不一致——缺少搜索按钮、清空按钮、焦点下划线动画、默认联想（搜索历史/热门/猜你想搜）；(3) 游戏卡片未强制 16:9 比例；(4) Logo 按钮无点击响应 + 公告弹窗从未被调用；(5) Hero 飞行过渡因源/目标尺寸严重不匹配导致卡顿、变形和定位不准。

## What Changes
- 首页搜索联想接入 `pinyinMatch()`，支持拼音首字母/全拼联想
- 搜索栏外观对齐原版：添加搜索按钮（右侧圆形按钮）、清空按钮、焦点下划线动画、默认联想面板（搜索历史/热门搜索/猜你想搜三段式）
- 游戏卡片和网格强制 16:9 宽高比（统一 `AspectRatio(aspectRatio: 16/9)`）
- Logo 按钮添加下拉菜单（关于/版本/社交链接等）
- 公告弹窗在首页打开时自动展示，支持关闭后持久化记忆
- Hero 飞行过渡：统一源/目标尺寸与宽高比，增强 `flightShuttleBuilder`，消除内容跳跃

## Impact
- Affected specs: migrate-to-flutter（已完成）
- Affected code:
  - `lib/shared/widgets/search_bar_widget.dart`（外观重做 + 联想逻辑修复）
  - `lib/features/search/search_suggestion.dart`（接入拼音匹配）
  - `lib/shared/widgets/game_card.dart`
  - `lib/shared/widgets/network_img_layer.dart`
  - `lib/features/home/home_screen.dart`
  - `lib/features/detail/detail_screen.dart`
  - `lib/shared/widgets/announcement_modal.dart`

## ADDED Requirements

### Requirement: 首页搜索联想拼音匹配
首页搜索栏的联想下拉 SHALL 使用 `pinyinMatch()` 进行拼音首字母和全拼模糊匹配。

#### Scenario: 拼音首字母联想
- **WHEN** 用户在首页搜索栏输入 "ys"
- **THEN** 联想下拉显示"原神"等匹配游戏

#### Scenario: 全拼联想
- **WHEN** 用户在首页搜索栏输入 "yuanshen"
- **THEN** 联想下拉显示"原神"

### Requirement: 搜索栏外观对齐原版
搜索栏 SHALL 对齐 React 原版的外观和交互，包含以下元素：

1. **搜索按钮**：右侧 40x40 圆形按钮，内含搜索图标（`ri-search-2-line` 等效），点击触发搜索导航
2. **清空按钮**：输入内容非空时，搜索图标左侧显示清空按钮（×），点击清空输入
3. **焦点下划线**：搜索栏获得焦点时，底部从左到右展开品牌粉色（#FE007F）下划线动画，失焦时收回
4. **默认联想面板**：搜索栏获得焦点且输入为空时，显示三段式默认联想：
   - 搜索历史（最近 5 条，每条右侧有删除按钮）
   - 热门搜索（前 3 条，火焰图标）
   - 猜你想搜（标签列表：冒险/恋爱/悬疑/校园/奇幻）
5. **联想项类型图标**：每条联想项左侧显示类型图标（游戏=gamepad、标签=hash、历史=clock、热门=fire）
6. **联想项点击**：点击联想项直接导航到搜索页或详情页

#### Scenario: 搜索栏布局
- **WHEN** 首页渲染搜索栏
- **THEN** 搜索栏为圆角胶囊形（borderRadius: 9999），左侧搜索图标 + 中间输入框 + 右侧搜索按钮，与原版一致

#### Scenario: 聚焦时显示默认联想
- **WHEN** 用户点击搜索栏（输入为空）
- **THEN** 显示默认联想面板（搜索历史/热门/猜你想搜）

#### Scenario: 输入时显示拼音联想
- **WHEN** 用户输入 "ys"
- **THEN** 联想面板显示拼音匹配结果

#### Scenario: 点击搜索按钮
- **WHEN** 用户点击右侧搜索按钮
- **THEN** 导航到搜索页并显示结果

#### Scenario: 清空输入
- **WHEN** 输入框有内容时显示清空按钮
- **THEN** 点击清空按钮后输入框清空，联想面板切换为默认联想

### Requirement: 游戏卡片 16:9 比例
所有游戏卡片封面图 SHALL 使用 16:9 宽高比显示。

#### Scenario: 首页网格卡片
- **WHEN** 首页渲染游戏卡片网格
- **THEN** 每张卡片的封面图区域维持 16:9 比例，不随屏幕宽度变化

#### Scenario: 搜索结果卡片
- **WHEN** 搜索页显示结果卡片
- **THEN** 每张卡片的封面图区域维持 16:9 比例

#### Scenario: 详情页缩略图
- **WHEN** 详情页显示封面图缩略图
- **THEN** 缩略图维持 16:9 比例

### Requirement: Logo 按钮交互
首页 Logo 按钮 SHALL 响应点击，展开下拉菜单。

#### Scenario: 点击 Logo 按钮
- **WHEN** 用户点击首页左上角 Logo 按钮
- **THEN** 展开下拉菜单，显示关于/版本/公告等选项

#### Scenario: 选中菜单项
- **WHEN** 用户点击菜单中的"公告"选项
- **THEN** 显示公告弹窗

### Requirement: 公告弹窗自动展示
系统 SHALL 在首页首次打开时自动展示公告弹窗，关闭后持久化记忆不再重复展示同一公告。

#### Scenario: 首次进入首页
- **WHEN** 用户首次打开首页且未关闭过当前公告
- **THEN** 自动弹出公告弹窗

#### Scenario: 关闭公告后再次进入
- **WHEN** 用户已关闭公告弹窗，再次进入首页
- **THEN** 不再自动弹出同一公告

### Requirement: Hero 飞行过渡修复
游戏卡片到详情页的 Hero 过渡 SHALL 流畅、无卡顿、无大小变形、无定位不准。

#### Scenario: 卡片→详情页过渡流畅
- **WHEN** 用户点击游戏卡片
- **THEN** 封面图平滑飞行到详情页，源和目标尺寸/宽高比一致，无跳动

#### Scenario: 详情页→返回过渡流畅
- **WHEN** 用户从详情页返回首页
- **THEN** 封面图平滑飞回原卡片位置，无错位

#### Scenario: 过渡期间文字不跳跃
- **WHEN** Hero 飞行过渡进行中
- **THEN** 卡片上的文字/标签渐变消失，详情页文字在飞行结束后渐入

## MODIFIED Requirements

### Requirement: 游戏卡片 Grid 布局
首页 SliverGrid SHALL 从固定 `mainAxisExtent: 256` 改为基于 16:9 比例的动态 `mainAxisExtent`：
`mainAxisExtent = (屏幕宽度 - 内边距 - 间距) / crossAxisCount / 1.778 + 标题区域高度`

### Requirement: 详情页 Hero 图片尺寸
详情页 Hero 图片 SHALL 从固定 120x180（2:3）改为与卡片封面一致的 16:9 尺寸，确保 Hero 飞行过渡源/目标尺寸匹配。
