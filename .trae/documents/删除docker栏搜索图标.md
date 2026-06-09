## 删除目标
删除底部导航栏（docker栏）上的"搜索"按钮。

## 位置
[index.html:L81-84](file:///d:/.A素材/Niypher/Niypher/index.html#L81-L84)

## 修改内容
删除以下代码块：
```html
<button onclick="router.push('search')" class="nav-item group w-full h-full flex flex-col items-center justify-center text-black/40 hover:text-black transition-colors" data-target="search">
    <i class="ri-search-line text-2xl mb-1 transition-transform"></i>
    <span class="text-[10px] font-medium">搜索</span>
</button>
```

删除后，底部导航栏将从5个按钮变为4个按钮：主页、分类、引力搜索、我的。