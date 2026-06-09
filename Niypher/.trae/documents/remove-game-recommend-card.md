# 删除主页"游戏推荐"文字卡片

## 修改文件
`src/js/pages/home.js` — `renderHome()` 函数

## 修改内容
删除 L151-L154 的"游戏推荐"文字卡片 div：
```html
<div class="glass-card p-4 flex items-center justify-between">
    <span class="text-sm font-bold text-gray-500">游戏推荐</span>
    <span class="text-xs bg-pink-600 text-white px-2 py-1 rounded">NEW</span>
</div>
```

## 步骤
1. 编辑 `src/js/pages/home.js`，删除"游戏推荐"卡片 div
2. `npm run build`
3. `npx wrangler pages deploy dist --project-name=niyphergal`
