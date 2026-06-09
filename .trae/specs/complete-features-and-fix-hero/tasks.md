# Tasks

## Task 1: 搜索栏外观对齐原版 + 联想功能修复
- [x] 1.1 重做 `search_bar_widget.dart` 布局：左侧搜索图标 + 中间输入框（含清空按钮 suffixIcon）+ 右侧 40x40 圆形搜索按钮，与原版 `#desktop-search-bar` 一致
- [x] 1.2 实现焦点下划线动画：搜索栏获得焦点时底部从左到右展开品牌粉色（#FE007F）下划线，失焦收回
- [x] 1.3 实现清空按钮：输入非空时在输入框内右侧显示 × 按钮，点击清空输入并切换为默认联想
- [x] 1.4 实现默认联想面板：搜索栏获得焦点且输入为空时，显示三段式默认联想（搜索历史/热门搜索/猜你想搜）
- [x] 1.5 修改 `search_suggestion.dart`：`searchSuggestion()` 函数集成 `pinyinMatch()`，对每个游戏的标题同时做直接匹配和拼音匹配
- [x] 1.6 联想项添加类型图标：游戏=gamepad、标签=hash、历史=clock、热门=fire
- [x] 1.7 验证：输入 "ys" 联想出"原神"；点击搜索按钮导航到搜索页；聚焦空输入显示默认联想；清空按钮正常工作

## Task 2: 游戏卡片 16:9 比例
- [x] 2.1 修改 `game_card.dart`：封面图用 `AspectRatio(aspectRatio: 16/9)` 包裹 NetworkImgLayer，卡片高度自适应
- [x] 2.2 修改 `home_screen.dart`：SliverGrid 的 `mainAxisExtent` 改为基于 16:9 的动态计算
- [x] 2.3 修改 `search_screen.dart`：搜索页网格同样使用 16:9 比例动态计算 `mainAxisExtent`
- [x] 2.4 验证：不同屏幕宽度下卡片封面区域维持 16:9 比例

## Task 3: Logo 按钮下拉菜单 + 公告弹窗自动展示
- [x] 3.1 修改 `home_screen.dart`：Logo 按钮添加 `onTap`，点击展开下拉菜单，包含"关于"、"公告"、"联系"等选项
- [x] 3.2 修改 `home_screen.dart`：首页 `initState` 中调用 `AnnouncementModal.show(context)`，仅在首次打开或公告未关闭时
- [x] 3.3 修改 `announcement_modal.dart`：关闭公告时写入 SharedPreferences，标记已关闭；每次 `show()` 前检查
- [x] 3.4 验证：Logo 点击弹出菜单，菜单项可交互；首次进入显示公告，关闭后不再弹出

## Task 4: Hero 飞行过渡修复
- [x] 4.1 统一源/目标尺寸：修改 `detail_screen.dart` 的 `_buildHeroSection`，封面图从 120x180 改为 16:9 比例
- [x] 4.2 增强 `flightShuttleBuilder`：在 `network_img_layer.dart` 中添加 `AnimatedBuilder`，圆角过渡 + easeOutCubic 曲线
- [x] 4.3 修复内容跳跃：确认 GameCard Hero 只包裹封面图，标题/标签在 Hero 外部
- [x] 4.4 验证：点击卡片→详情页过渡无卡顿，图片大小不变形，返回时图片精确回到原位

## Task 5: 构建与部署验证
- [x] 5.1 `flutter build web` 成功，无编译错误
- [x] 5.2 部署到 Cloudflare Pages，线上验证所有功能

# Task Dependencies
- [Task 2] 和 [Task 4] 互相依赖（16:9 统一尺寸后，Hero 源/目标才能匹配）
- [Task 3] 可与 [Task 1] 并行
- [Task 5] 依赖 [Task 1-4] 全部完成
