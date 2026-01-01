/**
 * 路由和页面渲染模块
 * 负责处理页面路由和渲染逻辑
 */
import { DB } from './data.js';
import { showNotification } from './utils.js';

// 登录流程状态管理
export let authFlowState = {
    step: 1, // 1: 邮箱输入步骤, 2: 密码/注册步骤
    email: '',
    isRegistered: false
};

// 页面顺序映射，用于决定切换动画方向
const pageOrder = {
    home: 0,
    category: 1,
    galgame: 2,
    profile: 3
};

/**
 * 路由控制对象
 */
export const router = {
    current: 'home',
    previous: 'home',
    params: {},
    
    /**
     * 跳转到指定页面
     * @param {string} page - 页面名称
     * @param {Object} params - 页面参数
     */
    push(page, params = {}) {
        this.previous = this.current;
        this.current = page;
        this.params = params;
        render();
        updateNav();
    }
};

/**
 * 页面组件对象
 */
export const Pages = {
    /**
     * 首页
     * @param {string} animationClass - 动画类名
     * @returns {string} HTML字符串
     */
    home: (animationClass = 'animate-fade-in') => {
        return `
            <div class="${animationClass ? animationClass + ' ' : ''}space-y-5 pt-20">
                <div class="glass-card p-4 flex items-center justify-between">
                    <span class="text-sm font-bold text-gray-500">最新推荐</span>
                    <span class="text-xs bg-pink-600 text-white px-2 py-1 rounded">NEW</span>
                </div>
                <div class="game-cards-container">
                ${DB.resources.map(res => `
                    <div onclick="router.push('detail', {id: ${res.id}})" class="glass-card overflow-hidden btn-active cursor-pointer group">
                        <div class="h-40 overflow-hidden relative">
                            <img src="${res.cover}" loading="lazy" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                            <div class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
                            <div class="absolute bottom-3 left-4">
                                <h3 class="font-bold text-xl">${res.title}</h3>
                            </div>
                        </div>
                        <div class="px-4 pb-4 pt-1 flex gap-2">
                            ${res.tags.map(t => `<span class="text-[10px] border border-pink-500/50 text-pink-600 px-2 py-0.5 rounded-full bg-pink-50/50">${t}</span>`).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            </div>
            <div id="announcement-modal" class="hidden fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onclick="closeAnnouncement(event)">
                <div class="glass-card w-full max-w-sm overflow-hidden" onclick="event.stopPropagation()">
                    <img src="${DB.announcement.image}" loading="lazy" alt="公告图片" class="w-full h-32 object-cover">
                    <div class="p-6">
                        <h2 class="text-xl font-bold mb-2">${DB.announcement.title}</h2>
                        <p class="text-sm text-gray-600">${DB.announcement.content}</p>
                        <button onclick="closeAnnouncement()" class="w-full bg-pink-600 text-white py-3 rounded-xl font-bold text-sm mt-6 btn-active">
                            我知道了
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * 分类页
     * @param {string} animationClass - 动画类名
     * @returns {string} HTML字符串
     */
    category: (animationClass = 'animate-fade-in') => {
        const cats = [
            { name: "纯爱系", icon: "ri-heart-line" },
            { name: "猎奇/致郁", icon: "ri-emotion-sad-line" },
            { name: "幻想/科幻", icon: "ri-sword-line" },
            { name: "剧情向", icon: "ri-book-line" },
            { name: "同人/汉化", icon: "ri-group-line" },
            { name: "游戏工具", icon: "ri-tools-line" }
        ];
        return `
            <div class="${animationClass ? animationClass + ' ' : ''}pt-20">
                <h2 class="text-xl font-bold mb-4 ml-1">Gal 分类</h2>
                <div class="grid gap-4 grid-cols-2">
                    ${cats.map(c => `
                        <div onclick="alert('进入 ${c.name} 分类')" class="glass-card h-24 flex flex-col items-center justify-center gap-2 btn-active cursor-pointer hover:bg-pink-600 hover:text-white transition-colors group">
                            <i class="${c.icon} text-2xl"></i>
                            <span class="font-bold">${c.name}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    /**
     * 引力搜索页
     * @param {string} animationClass - 动画类名
     * @returns {string} HTML字符串
     */
    galgame: (animationClass = '') => {
        return `
            <div class="${animationClass ? animationClass + ' ' : ''}flex flex-col items-center justify-center min-h-[60vh] px-4 pt-20">
                <div class="glass-card wide-card flex flex-col space-y-4">
                    <h2 class="text-2xl font-bold mb-1">Niypher引力搜索</h2>
                    <p class="text-xs text-gray-400 mb-4">聚合搜索全网 Galgame 资源</p>
                    <div class="border-b border-white/50 border-b-2 pb-3">
                        <i class="ri-search-line text-gray-400 mr-2"></i>
                        <input type="text" id="gal-search" placeholder="输入游戏原名或中文名..." class="flex-1 bg-transparent outline-none text-sm">
                    </div>
                    <button onclick="alert('正在调用后端搜索接口...')" class="w-full bg-pink-600 text-white mt-4 py-3 rounded-xl font-bold text-sm btn-active shadow-lg shadow-pink-600/20">开始搜索</button>
                </div>
                
                <div class="mt-6 opacity-40 text-center space-y-2">
                    <i class="ri-database-2-line text-4xl"></i>
                    <p class="text-xs">
                        Source: 基于外部开源数据源<br>
                        <a href="https://github.com/Moe-Sakura/SearchGal" target="_blank" class="text-[10px] text-pink-600 hover:underline">
                            原开源仓库链接: https://github.com/Moe-Sakura/SearchGal
                        </a>
                    </p>
                </div>
            </div>
        `;
    },
    
    /**
     * 个人中心页
     * @param {string} animationClass - 动画类名
     * @returns {string} HTML字符串
     */
    profile: (animationClass = 'animate-fade-in') => {
        if (!DB.user) {
            return `
                <div class="flex flex-col items-center justify-center min-h-[60vh] px-4 pt-20">
                    <h2 class="text-2xl font-bold mb-8">匿影通行证</h2>
                    <div class="${authFlowState.step === 2 ? 'animate-fade-in-right ' : (authFlowState.step === 1 ? 'animate-slide-in-left ' : (animationClass ? animationClass + ' ' : ''))}glass-card responsive-card flex flex-col space-y-4">
                        <!-- 步骤指示器 -->
                        <div class="flex items-center justify-center gap-2 text-xs text-gray-500">
                            <div class="flex items-center gap-1 ${authFlowState.step >= 1 ? 'text-pink-600' : ''}">
                                <span class="w-6 h-6 rounded-full border-2 ${authFlowState.step >= 1 ? 'border-pink-600 text-pink-600' : 'border-gray-300 text-gray-500'} flex items-center justify-center bg-transparent">1</span>
                                <span>邮箱</span>
                            </div>
                            <div class="h-0.5 w-4 bg-gray-300 ${authFlowState.step >= 2 ? 'bg-pink-600' : ''}"></div>
                            <div class="flex items-center gap-1 ${authFlowState.step >= 2 ? 'text-pink-600' : ''}">
                                <span class="w-6 h-6 rounded-full border-2 ${authFlowState.step >= 2 ? 'border-pink-600 text-pink-600' : 'border-gray-300 text-gray-500'} flex items-center justify-center bg-transparent">2</span>
                                <span>${authFlowState.step === 2 ? (authFlowState.isRegistered ? '登录' : '注册') : '注册/登录'}</span>
                            </div>
                        </div>
                        
                        <!-- 步骤 1: 邮箱输入 -->
                        <div id="step-1" class="${authFlowState.step === 1 ? '' : 'hidden'}">
                            <div class="space-y-4">
                                <input type="email" id="auth-email" class="w-full bg-transparent border-b border-white/50 border-b-2 p-3 outline-none focus:border-pink-600 transition-colors text-sm" placeholder="邮箱">
                                <p id="email-error" class="text-[10px] text-red-500 hidden mt-1 ml-1">请正确输入邮箱格式</p>
                            </div>
                            <button id="email-next-btn" onclick="Actions.handleEmailStep()" class="w-full bg-pink-600 text-white mt-6 py-4 rounded-xl font-bold shadow-lg shadow-pink-600/20 btn-active" disabled>
                                下一步
                            </button>
                            <p class="text-center text-xs text-gray-400 mt-4">输入您的邮箱，我们将帮您选择合适的登录方式</p>
                        </div>
                        
                        <!-- 步骤 2: 登录/注册 -->
                        <div id="step-2" class="${authFlowState.step === 2 ? '' : 'hidden'}">
                            <!-- 返回按钮 -->
                            <button onclick="Actions.goBackToEmailStep()" class="flex items-center gap-1 text-sm text-gray-500 hover:text-pink-600 transition-colors">
                                <i class="ri-arrow-left-line"></i>
                                <span>返回邮箱</span>
                            </button>
                            
                            <!-- 邮箱显示 -->
                            <div class="text-center py-2">
                                <p class="text-sm font-medium">${authFlowState.email}</p>
                            </div>
                            
                            <!-- 密码输入 (登录模式) -->
                            <div class="space-y-1">
                                <input type="password" id="auth-pwd1" class="w-full bg-transparent border-b border-white/50 border-b-2 p-3 outline-none focus:border-pink-600 transition-colors text-sm" placeholder="${authFlowState.isRegistered ? '密码' : '设置密码'}">
                                ${!authFlowState.isRegistered ? `
                                <div id="password-feedback" class="text-xs bg-transparent dark:bg-transparent rounded-lg p-3 space-y-1 mt-2">
                                    <div id="check-length" class="flex items-center"><i class="ri-checkbox-circle-line mr-1 text-red-500"></i>至少8位</div>
                                    <div id="check-upper" class="flex items-center"><i class="ri-checkbox-circle-line mr-1 text-red-500"></i>至少1个大写字母</div>
                                    <div id="check-lower" class="flex items-center"><i class="ri-checkbox-circle-line mr-1 text-red-500"></i>至少1个小写字母</div>
                                    <div id="check-number" class="flex items-center"><i class="ri-checkbox-circle-line mr-1 text-red-500"></i>至少1个数字</div>
                                    <div id="check-special" class="flex items-center"><i class="ri-checkbox-circle-line mr-1 text-red-500"></i>至少1个特殊字符</div>
                                </div>` : ''}
                            </div>
                            
                            <!-- 重复密码 (注册模式) -->
                            ${!authFlowState.isRegistered ? `
                            <div class="space-y-1">
                                <input type="password" id="auth-pwd2" class="w-full bg-transparent border-b border-white/50 border-b-2 p-3 outline-none focus:border-pink-600 transition-colors text-sm" placeholder="重复密码">
                                <p id="pwd-match-error" class="text-[10px] text-red-500 bg-red-50/50 dark:bg-red-900/20 rounded-md p-2 hidden mt-1">两次输入的密码不一致</p>
                            </div>` : ''}
                            
                            <!-- Cloudflare Turnstile 人机验证 -->
                            <div class="mt-6 flex justify-center">
                                <div class="cf-turnstile" data-sitekey="0x4AAAAAACJ_rMxcCB0FrOve" data-theme="light"></div>
                            </div>

                            <button id="auth-action-btn" onclick="Actions.handleAuthStep()" class="mt-8 w-full bg-pink-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-pink-600/20 btn-active" disabled>
                                ${authFlowState.isRegistered ? '登录' : '注册'}
                            </button>
                            
                            ${authFlowState.isRegistered ? `
                            <p class="mt-4 text-center text-xs text-gray-400">忘记密码？<a href="#" class="text-pink-600 hover:underline">点击重置</a></p>` : ''}
                        </div>
                        
                        <p class="text-center text-xs text-gray-400">若出现问题，请联系管理员：<span class="text-pink-600">feedback@niypher.com</span></p>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="${animationClass ? animationClass + ' ' : ''}space-y-6 pt-20">
                    <div class="glass-card p-6 flex items-center gap-4">
                        <div class="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-xl font-bold border-2 border-pink-600/50">
                            ${DB.user.name[0]}
                        </div>
                        <div>
                            <h2 class="text-xl font-bold">${DB.user.name}</h2>
                            <p class="text-xs text-gray-400 mt-1">ID: 8848293 • ${DB.user.email}</p>
                        </div>
                    </div>
                    <div class="glass-card p-2 text-sm font-medium">
                        <div onclick="alert('需实现修改头像功能')" class="p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer active:bg-gray-50">
                            <span><i class="ri-image-edit-line mr-2"></i>修改头像</span>
                            <i class="ri-arrow-right-s-line text-gray-300"></i>
                        </div>
                        <div onclick="alert('需实现修改昵称功能')" class="p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer active:bg-gray-50">
                            <span><i class="ri-edit-line mr-2"></i>修改昵称</span>
                            <i class="ri-arrow-right-s-line text-gray-300"></i>
                        </div>
                        <div onclick="alert('邮箱已绑定')" class="p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer active:bg-gray-50">
                            <span><i class="ri-mail-lock-line mr-2"></i>绑定邮箱</span>
                            <span class="text-xs text-green-500">已绑定</span>
                        </div>
                        <div onclick="alert('需实现修改密码功能')" class="p-4 flex justify-between items-center cursor-pointer active:bg-gray-50">
                            <span><i class="ri-key-2-line mr-2"></i>修改密码</span>
                            <i class="ri-arrow-right-s-line text-gray-300"></i>
                        </div>
                    </div>

                    <button onclick="Actions.logout()" class="w-full glass-card py-4 text-red-500 font-bold btn-active">退出登录</button>
                </div>
            `;
        }
    },
    
    /**
     * 详情页
     * @param {number} id - 资源ID
     * @returns {string} HTML字符串
     */
    detail: (id) => {
        const res = DB.resources.find(r => r.id === id);
        if (!res) return `<div class="p-10 text-center">未找到资源</div>`;

        const isLoggedIn = !!DB.user;
        return `
            <div class="animate-fade-in pb-10 pt-20">
                <div class="flex items-center mb-4">
                    <button onclick="router.push('home')" class="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center mr-4 btn-active"><i class="ri-arrow-left-line"></i></button>
                    <span class="font-bold truncate">${res.title}</span>
                </div>
                <div class="glass-card overflow-hidden mb-6">
                    <img src="${res.cover}" loading="lazy" class="w-full h-56 object-cover">
                    <div class="p-5">
                        <h1 class="text-2xl font-bold mb-3">${res.title}</h1>
                        <div class="flex flex-wrap gap-2 mb-4">
                            ${res.tags.map(t => `<span class="text-xs bg-pink-600 text-white px-2 py-1 rounded">${t}</span>`).join('')}
                        </div>
                        <div class="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg mb-4">
                            <h3 class="font-bold text-black mb-1">游戏简介</h3>
                            ${res.intro}
                        </div>
                        ${res.media && res.media.length > 0 ? `
                            <div class="overflow-x-auto hide-scrollbar flex space-x-4 media-scroll-container py-2">
                                ${res.media.map((media, index) => `
                                    <div class="flex-shrink-0 w-64 h-40 bg-gray-100 rounded-xl overflow-hidden shadow-md media-item">
                                        ${media.type === 'image' ? 
                                            `<img src="${media.url}" loading="lazy" alt="游戏截图 ${index + 1}" class="w-full h-full object-cover cursor-pointer">`
                                            : 
                                            `<iframe class="w-full h-full" src="${media.url}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
                                        }
                                    </div>
                                `).join('')}
                            </div>
                            <p class="text-[10px] text-gray-400 mt-2 text-center">可左右滑动切换</p>
                        ` : ''}
                    </div>
                </div>
                <div class="glass-card p-5 mb-6">
                    <h3 class="font-bold border-l-[3px] border-pink-600 pl-3 mb-4 text-lg">资源下载</h3>
                    ${!isLoggedIn ? `<div class="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200"> <i class="ri-lock-2-line text-3xl text-gray-300 mb-2"></i> <p class="text-sm font-bold text-gray-500">登录后查看下载链接</p> <button onclick="router.push('profile')" class="mt-3 text-xs bg-pink-600 text-white px-4 py-2 rounded-full btn-active">去登录</button> </div>` : `<div class="space-y-3">${res.versions.length === 0 ? '<p class="text-sm text-gray-400">暂无资源版本</p>' : ''}${res.versions.map(v => `<div class="bg-gray-50 rounded-xl p-4 border border-gray-100"><div class="flex justify-between items-start mb-2"><div><div class="font-bold text-sm">${v.ver}</div><div class="text-[10px] text-gray-400">更新于 ${v.date} • 大小 ${v.size}</div></div><button class="bg-pink-600 text-white text-xs px-3 py-1.5 rounded-lg btn-active" onclick="alert('调用下载接口')">下载</button></div><div class="flex gap-4 mt-3 pt-3 border-t border-gray-200"><button class="text-[10px] text-gray-400 flex items-center gap-1 hover:text-red-500 btn-active" onclick="alert('调用举报失效接口')"><i class="ri-alarm-warning-line"></i> 举报失效</button><button class="text-[10px] text-gray-400 flex items-center gap-1 hover:text-blue-500 btn-active" onclick="alert('调用反馈问题接口')"><i class="ri-feedback-line"></i> 反馈问题</button></div></div>`).join('')}</div>`}
                </div>
                <div class="glass-card p-5 mb-6">
                    <h3 class="font-bold border-l-[3px] border-pink-600 pl-3 mb-4 text-lg">贡献上传</h3>
                    ${!isLoggedIn ? `<p class="text-xs text-gray-400 pl-4">登录后可提交新版本。</p>` : `<div onclick="alert('打开文件上传窗口')" class="w-full py-4 border-2 border-dashed border-pink-600/30 rounded-xl flex flex-col items-center justify-center text-pink-600/70 hover:border-pink-600/50 hover:text-pink-600 cursor-pointer transition-colors bg-pink-50/50 btn-active"><i class="ri-upload-cloud-2-line text-2xl mb-1"></i><span class="text-xs font-bold">点击上传该游戏的新版本</span><span class="text-[10px] scale-90 opacity-60">需管理员审核</span></div>`}
                </div>
                <div class="glass-card p-5">
                    <h3 class="font-bold border-l-[3px] border-pink-600 pl-3 mb-4 text-lg">评论交流</h3>
                    <div class="space-y-5 mb-6">${DB.comments.map(c => `<div class="flex gap-3"><div class="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div><div><div class="text-xs font-bold text-gray-600">${c.user}</div><div class="text-sm mt-0.5">${c.text}</div></div></div>`).join('')}</div>
                    <div class="flex gap-2"><input type="text" placeholder="友善评论..." class="flex-1 bg-gray-50 border border-transparent focus:border-black/10 rounded-lg px-3 py-2 text-sm outline-none transition-colors"><button onclick="alert('调用评论发送接口')" class="bg-pink-600 text-white px-4 rounded-lg text-sm font-bold btn-active">发送</button></div>
                </div>
            </div>
        `;
    }
};

/**
 * 渲染页面
 */
function render() {
    const container = document.getElementById('main-container');
    window.scrollTo(0, 0);
    
    // 保存旧页面的HTML内容
    const oldContent = container.innerHTML;
    
    // 计算页面切换方向
    const prevIndex = pageOrder[router.previous];
    const currIndex = pageOrder[router.current];
    let animationClass = 'animate-fade-in';
    let oldAnimationClass = '';
    
    // 只有在docker栏的四个页面之间切换时才使用滑动动画
    if (prevIndex !== undefined && currIndex !== undefined) {
        if (currIndex > prevIndex) {
            // 向右切换（例如：home -> category -> galgame -> profile）
            animationClass = 'animate-slide-in-right';
            oldAnimationClass = 'animate-slide-out-left';
        } else if (currIndex < prevIndex) {
            // 向左切换（例如：profile -> galgame -> category -> home）
            animationClass = 'animate-slide-in-left';
            oldAnimationClass = 'animate-slide-out-right';
        }
    }
    
    // 生成新页面内容 - 对于滑动切换，不直接在页面内容中添加动画类
    let newContent = '';
    let contentWithoutAnimation = '';
    
    switch(router.current) {
        case 'home':
            newContent = Pages.home(animationClass);
            contentWithoutAnimation = Pages.home('');
            if (DB.announcement.show) {
                setTimeout(showAnnouncement, 0); 
            }
            break;
        case 'category':
            newContent = Pages.category(animationClass);
            contentWithoutAnimation = Pages.category('');
            break;
        case 'galgame':
            newContent = Pages.galgame(animationClass);
            contentWithoutAnimation = Pages.galgame('');
            break;
        case 'profile':
            newContent = Pages.profile(animationClass);
            contentWithoutAnimation = Pages.profile('');
            // 暂时不绑定事件，等DOM更新后再绑定
            break;
        case 'detail':
            newContent = Pages.detail(router.params.id);
            contentWithoutAnimation = Pages.detail(router.params.id);
            break;
    }
    
    // 如果是滑动切换，实现双页面同时移动效果
    if (oldAnimationClass) {
        // 创建一个包含旧页面和新页面的过渡容器
        // 新页面使用不包含动画类的内容，过渡容器会处理动画
        container.innerHTML = `
            <div class="page-transition-container">
                <div class="page-transition-old ${oldAnimationClass}">${oldContent}</div>
                <div class="page-transition-new ${animationClass}">${contentWithoutAnimation}</div>
            </div>
        `;
        
        // 动画结束后清理旧页面，使用不包含动画类的内容
        setTimeout(() => {
            container.innerHTML = contentWithoutAnimation;
            // 滑动切换结束后，绑定profile页面的事件
            if (router.current === 'profile') {
                setTimeout(() => {
                    bindPasswordCheck();
                    // 手动渲染Turnstile组件
                    if (window.turnstile) {
                        window.turnstile.render('.cf-turnstile', {
                            sitekey: '0x4AAAAAACJ_rMxcCB0FrOve',
                            theme: document.body.classList.contains('dark') ? 'dark' : 'light'
                        });
                    }
                }, 10);
            }
        }, 500); // 500ms 与动画时长一致
    } else {
        // 否则直接替换内容，使用包含动画类的内容
        container.innerHTML = newContent;
        // 直接替换内容后，绑定profile页面的事件
        if (router.current === 'profile') {
            setTimeout(() => {
                bindPasswordCheck();
                // 手动渲染Turnstile组件
                if (window.turnstile) {
                    window.turnstile.render('.cf-turnstile', {
                        sitekey: '0x4AAAAAACJ_rMxcCB0FrOve',
                        theme: document.body.classList.contains('dark') ? 'dark' : 'light'
                    });
                }
            }, 10);
        }
    }
}

/**
 * 更新导航栏状态
 */
export function updateNav() {
    document.querySelectorAll('.nav-item').forEach(el => {
        const icon = el.querySelector('i');
        const target = el.getAttribute('data-target');
        
        if (target === router.current) {
            el.classList.add('active');
            // 更新图标样式
            const lineIcon = icon.className.match(/ri-([\w-]+)-line/);
            if (lineIcon) {
                icon.className = icon.className.replace(lineIcon[0], `ri-${lineIcon[1]}-fill`);
            }
        } else {
            el.classList.remove('active');
            // 更新图标样式
            const fillIcon = icon.className.match(/ri-([\w-]+)-fill/);
            if (fillIcon) {
                icon.className = icon.className.replace(fillIcon[0], `ri-${fillIcon[1]}-line`);
            }
        }
        
        // 根据登录状态更新profile按钮文字
        if (target === 'profile') {
            const span = el.querySelector('span');
            if (span) {
                span.textContent = DB.user ? '我的' : '注册/登录';
            }
        }
    });
}

/**
 * 显示公告
 */
export function showAnnouncement() {
    const modal = document.getElementById('announcement-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

/**
 * 关闭公告
 * @param {Event} event - 点击事件
 */
export function closeAnnouncement(event) {
    const modal = document.getElementById('announcement-modal');
    if (modal) {
        modal.classList.add('hidden');
        DB.announcement.show = false; 
    }
}

/**
 * 绑定输入框事件，实现多步登录流程的实时验证
 */
export function bindPasswordCheck() {
    // 导入工具函数
    import('./utils.js').then(({ validateEmailFormat, validateEmailDomain, checkPasswordValidity }) => {
        // 邮箱输入步骤的验证
        function bindEmailStepEvents() {
            const emailInput = document.getElementById('auth-email');
            const emailNextBtn = document.getElementById('email-next-btn');
            
            if (!emailInput || !emailNextBtn) return;
            
            // 实时验证邮箱格式和域名
            const validateEmail = () => {
                const email = emailInput.value;
                const emailError = document.getElementById('email-error');
                
                if (email.length === 0) {
                    emailError.classList.add('hidden');
                    emailNextBtn.disabled = true;
                    return;
                }
                
                const isEmailValid = validateEmailFormat(email);
                if (!isEmailValid) {
                    emailError.textContent = '请正确输入邮箱格式';
                    emailError.classList.remove('hidden');
                    emailNextBtn.disabled = true;
                    return;
                }
                
                // 只有在邮箱格式正确时才进行域名验证
                const isDomainValid = validateEmailDomain(email);
                if (!isDomainValid) {
                    emailError.textContent = '暂不支持该邮箱';
                    emailError.classList.remove('hidden');
                    emailNextBtn.disabled = true;
                    return;
                }
                
                emailError.classList.add('hidden');
                emailNextBtn.disabled = false;
            };
            
            // 绑定事件
            emailInput.addEventListener('input', validateEmail);
            emailInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && emailNextBtn.disabled === false) {
                    Actions.handleEmailStep();
                }
            });
            
            // 初始检查
            validateEmail();
        }
        
        // 登录/注册步骤的验证
        function bindAuthStepEvents() {
            const pwd1Input = document.getElementById('auth-pwd1');
            const pwd2Input = document.getElementById('auth-pwd2');
            const authActionBtn = document.getElementById('auth-action-btn');
            
            if (!pwd1Input || !authActionBtn) return;
            
            // 实时验证密码
            const validatePassword = () => {
                const { isRegistered } = authFlowState;
                const pwd1 = pwd1Input.value;
                
                if (isRegistered) {
                    // 登录模式：只需密码非空
                    authActionBtn.disabled = pwd1.length === 0;
                } else {
                    // 注册模式：需要密码强度和重复密码验证
                    const pwd2 = pwd2Input.value;
                    const pwdMatchError = document.getElementById('pwd-match-error');
                    const passwordCheck = checkPasswordValidity(pwd1);
                    const pwdMatch = pwd1 === pwd2;
                    
                    // 更新密码强度提示
                    const checkLengthEl = document.getElementById('check-length');
                    const checkUpperEl = document.getElementById('check-upper');
                    const checkLowerEl = document.getElementById('check-lower');
                    const checkNumberEl = document.getElementById('check-number');
                    const checkSpecialEl = document.getElementById('check-special');
                    const greenIcon = 'ri-checkbox-circle-fill';
                    const redIcon = 'ri-checkbox-circle-line';
                    
                    checkLengthEl.innerHTML = `<i class="${passwordCheck.checks.length ? greenIcon : redIcon} mr-1 ${passwordCheck.checks.length ? 'text-green-500' : 'text-red-500'}"></i>至少8位`;
                    checkUpperEl.innerHTML = `<i class="${passwordCheck.checks.upper ? greenIcon : redIcon} mr-1 ${passwordCheck.checks.upper ? 'text-green-500' : 'text-red-500'}"></i>至少1个大写字母`;
                    checkLowerEl.innerHTML = `<i class="${passwordCheck.checks.lower ? greenIcon : redIcon} mr-1 ${passwordCheck.checks.lower ? 'text-green-500' : 'text-red-500'}"></i>至少1个小写字母`;
                    checkNumberEl.innerHTML = `<i class="${passwordCheck.checks.number ? greenIcon : redIcon} mr-1 ${passwordCheck.checks.number ? 'text-green-500' : 'text-red-500'}"></i>至少1个数字`;
                    checkSpecialEl.innerHTML = `<i class="${passwordCheck.checks.special ? greenIcon : redIcon} mr-1 ${passwordCheck.checks.special ? 'text-green-500' : 'text-red-500'}"></i>至少1个特殊字符`;
                    
                    // 更新密码匹配提示
                    if (pwd1.length > 0 && pwd2.length > 0 && !pwdMatch) {
                        pwdMatchError.classList.remove('hidden');
                    } else {
                        pwdMatchError.classList.add('hidden');
                    }
                    
                    // 更新按钮状态
                    authActionBtn.disabled = !passwordCheck.allValid || !pwdMatch;
                }
            };
            
            // 绑定事件
            pwd1Input.addEventListener('input', validatePassword);
            if (pwd2Input) {
                pwd2Input.addEventListener('input', validatePassword);
            }
            
            // 回车键处理
            pwd1Input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && authActionBtn.disabled === false) {
                    Actions.handleAuthStep();
                }
            });
            
            if (pwd2Input) {
                pwd2Input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && authActionBtn.disabled === false) {
                        Actions.handleAuthStep();
                    }
                });
            }
            
            // 初始检查
            validatePassword();
        }
        
        // 检查当前步骤并绑定相应事件
        if (authFlowState.step === 1) {
            bindEmailStepEvents();
        } else if (authFlowState.step === 2) {
            bindAuthStepEvents();
        }
    });
}

/**
 * 交互行为定义
 */
export const Actions = {
    // 处理邮箱步骤
    handleEmailStep: () => {
        import('./utils.js').then(({ validateEmailFormat, validateEmailDomain, showNotification }) => {
            const email = document.getElementById('auth-email').value;
            
            if (!validateEmailFormat(email)) {
                const emailError = document.getElementById('email-error');
                emailError.textContent = '请正确输入邮箱格式';
                emailError.classList.remove('hidden');
                return;
            }
            
            // 验证邮箱域名是否为支持的主流大厂域名
            if (!validateEmailDomain(email)) {
                const emailError = document.getElementById('email-error');
                emailError.textContent = '暂不支持该邮箱';
                emailError.classList.remove('hidden');
                return;
            }

            // 检查邮箱是否已注册
            const existingUser = DB.registeredUsers.find(u => u.email === email);
            const isRegistered = !!existingUser;
            
            // 更新状态
            authFlowState = {
                step: 2,
                email: email,
                isRegistered: isRegistered
            };
            
            // 重新渲染页面
            render();
        });
    },
    
    // 处理登录/注册步骤
    handleAuthStep: () => {
        import('./utils.js').then(({ checkPasswordValidity, showNotification }) => {
            const { email, isRegistered } = authFlowState;
            const pwd1 = document.getElementById('auth-pwd1').value;
            
            // 验证 Cloudflare Turnstile
            if (window.turnstile) {
                const token = window.turnstile.getResponse();
                if (!token) {
                    showNotification("请完成人机验证", 'error');
                    return;
                }
                // --- ⚠️ 真实服务器部署时，需将 token 发送到服务器验证 ---
            }
            
            const authButton = document.getElementById('auth-action-btn');
            authButton.innerText = "处理中...";
            authButton.disabled = true;

            // --- ⚠️ 真实服务器部署时，以下部分需替换为异步 API 调用 ---

            if (isRegistered) {
                // 登录模式
                const existingUser = DB.registeredUsers.find(u => u.email === email);
                if (existingUser.password === pwd1) {
                    DB.user = { name: existingUser.nickname, email: existingUser.email };
                    showNotification(`登录成功: 欢迎回来，${existingUser.nickname}`, 'success');
                    router.push('home');
                } else {
                    showNotification("密码错误", 'error');
                    authButton.innerText = "登录";
                    authButton.disabled = false;
                }
            } else {
                // 注册模式
                const pwd2 = document.getElementById('auth-pwd2').value;
                const passwordCheck = checkPasswordValidity(pwd1);
                
                if (!passwordCheck.allValid || pwd1 !== pwd2) {
                    showNotification("请检查注册密码是否满足强度要求或重复密码是否一致。", 'error');
                    authButton.innerText = "注册";
                    authButton.disabled = false;
                    return;
                }
                
                DB.registeredUsers.push({ email, password: pwd1, nickname: email.split('@')[0] });
                DB.user = { name: email.split('@')[0], email: email };
                showNotification("注册成功！已自动登录。", 'success');
                router.push('home');
            }
        });
    },
    
    // 返回邮箱步骤
    goBackToEmailStep: () => {
        // 保留邮箱输入，只返回步骤1
        authFlowState = {
            step: 1,
            email: authFlowState.email,
            isRegistered: false
        };
        render();
    },
    
    // 退出登录
    logout: () => {
        import('./utils.js').then(({ showNotification }) => {
            DB.user = null;
            showNotification("已退出登录", 'info');
            router.push('profile');
        });
    }
};
