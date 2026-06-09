# Tasks

- [x] Task 1: 修复卡片入场/退场动画CSS
  - [x] SubTask 1.1: 为 `.game-cards-container .glass-card` 添加 opacity 和 transform 的 transition 属性
  - [x] SubTask 1.2: 修复 `.is-hidden` → `.is-loaded` 状态切换的过渡效果
  - [x] SubTask 1.3: 确保 `.is-entering` / `.is-leaving` 动画在搜索页正确触发
  - [x] SubTask 1.4: 验证首页 initHomeAnimations() 动画效果正常
  - [x] SubTask 1.5: 验证搜索页 executeEnteringAnimation() 动画效果正常

- [x] Task 2: 移除卡片和控件悬停放大效果，改为仅强调
  - [x] SubTask 2.1: 修改 `.game-cards-container .glass-card:hover` 移除 scale(1.02)，保留 translateY(-4px) 和阴影增强
  - [x] SubTask 2.2: 修改 `.game-cards-container .glass-card:active` 移除 scale(0.96)
  - [x] SubTask 2.3: 移除 index.html 中浮动按钮的 hover:scale-105 和 hover:scale-110
  - [x] SubTask 2.4: 为浮动按钮添加替代的悬停强调效果（边框/阴影/背景变化）
  - [x] SubTask 2.5: 验证分类页卡片悬停效果无缩放

- [x] Task 3: 恢复卡片标题荧光笔动效
  - [x] SubTask 3.1: 验证 `.card-title-highlight` CSS 动画定义正确
  - [x] SubTask 3.2: 验证悬停时荧光笔从左到右展开（scaleX 0→1）
  - [x] SubTask 3.3: 验证移出时荧光笔收回（scaleX 1→0）
  - [x] SubTask 3.4: 确保荧光笔动效不受 hover scale 移除的影响

- [x] Task 4: 修复首页卡片二次加载卡顿
  - [x] SubTask 4.1: 从 renderGameCard() 中移除 animate-card-in 类
  - [x] SubTask 4.2: 统一使用 is-hidden → is-loaded 动画路径
  - [x] SubTask 4.3: 修复 renderHome() 中的字符串替换逻辑，确保不残留 animate-card-in
  - [x] SubTask 4.4: 验证从其它页切换到首页时卡片只执行一次入场动画

- [x] Task 5: 修复搜索建议联想栏功能
  - [x] SubTask 5.1: 验证搜索框聚焦时 showDefaultSuggestions() 正确触发
  - [x] SubTask 5.2: 验证输入时 handleInput() → getSuggestions() → displaySuggestions() 链路正常
  - [x] SubTask 5.3: 修复联想栏 z-index 层级问题（确保不被搜索页内容遮挡）
  - [x] SubTask 5.4: 验证联想栏显示/隐藏动画（animate-fade-in / animate-fade-out）正常
  - [x] SubTask 5.5: 验证联想栏分页功能正常

- [x] Task 6: 修复搜索历史记录功能
  - [x] SubTask 6.1: 验证 loadSearchHistory() 从 localStorage 正确读取
  - [x] SubTask 6.2: 验证 saveSearchHistory() 正确写入 localStorage（去重、限10条）
  - [x] SubTask 6.3: 验证搜索历史在联想栏中正确显示（图标、文字、删除按钮）
  - [x] SubTask 6.4: 验证删除单条历史记录功能正常
  - [x] SubTask 6.5: 验证热门搜索（searchFrequency）统计和显示正常

- [x] Task 7: 修复智能关联（模糊拼音搜索）
  - [x] SubTask 7.1: 验证 SearchIndex.search() 中模糊音索引搜索逻辑正确触发
  - [x] SubTask 7.2: 运行时验证输入 "sanghai" 能匹配到 "上海"
  - [x] SubTask 7.3: 运行时验证输入 "zidao" 能匹配到 "知道"
  - [x] SubTask 7.4: 验证模糊音搜索仅在精确匹配不足5条时触发
  - [x] SubTask 7.5: 验证联想建议中模糊音匹配结果正确显示

- [x] Task 8: 修复移动端搜索建议
  - [x] SubTask 8.1: 验证移动端搜索弹窗中输入时显示建议
  - [x] SubTask 8.2: 修复移动端搜索建议点击跳转逻辑
  - [x] SubTask 8.3: 验证移动端搜索历史和热门搜索显示

# Task Dependencies
- [Task 1] 无前置依赖，可立即开始
- [Task 2] 无前置依赖，可与 Task 1 并行
- [Task 3] 依赖 [Task 2]（荧光笔动效需在移除 scale 后验证）
- [Task 4] 依赖 [Task 1]（二次加载修复需在动画CSS修复后进行）
- [Task 5] 无前置依赖，可与 Task 1/2 并行
- [Task 6] 依赖 [Task 5]（历史记录在联想栏中显示）
- [Task 7] 无前置依赖，可与 Task 1/2/5 并行
- [Task 8] 依赖 [Task 5, Task 6]（移动端建议依赖桌面端建议功能正常）
