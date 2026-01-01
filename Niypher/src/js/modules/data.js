/**
 * 数据模块
 * 包含应用的核心数据和图片预加载功能
 */

// 核心数据中心
export const DB = {
    // 注意：这是用于模拟用户会话和前端演示数据的结构。实际应用中，用户数据应从服务器获取。
    registeredUsers: [
        { email: "user@example.com", password: "Password1", nickname: "AdminUser" }
    ],
    user: null, // 登录后变为对象
    resources: [
        { 
            id: 101, 
            title: "原神 (Genshin Impact)", 
            cover: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80", 
            tags: ["开放世界", "RPG"], 
            intro: "在七种元素交汇的大陆——「提瓦特」，每个人都可以成为神。你从世界之外漂流而来，降临大地...", 
            versions: [
                { ver: "v4.2 纯净版", date: "2023-11-08", size: "60GB" },
                { ver: "v4.1 预下载", date: "2023-09-25", size: "58GB" }
            ],
            media: [
                { type: 'image', url: 'https://images.unsplash.com/photo-1627287135549-06443c5a611c?auto=format&fit=crop&w=800&q=80' },
                { type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?controls=0' },
                { type: 'image', url: 'https://images.unsplash.com/photo-1625471908709-66c3a8e9e262?auto=format&fit=crop&w=800&q=80' },
                { type: 'image', url: 'https://images.unsplash.com/photo-1627878891544-77e436c64160?auto=format&fit=crop&w=800&q=80' }
            ]
        },
        { 
            id: 103,
            title: "Summer Pockets (夏日口袋)",
            cover: "https://images.unsplash.com/photo-1472457897821-70d3819a0e24?auto=format&fit=crop&w=800&q=80",
            tags: ["GAL", "Key社", "治愈"],
            intro: "为了整理祖母的遗物，鹰原羽依里利用暑假独自一人来到了鸟白岛...",
            versions: [],
            media: []
        },
        { 
            id: 104, 
            title: "冒险之旅", 
            cover: "https://picsum.photos/800/600?random=104", 
            tags: ["冒险", "动作", "开放世界"], 
            intro: "踏上一段充满未知的冒险之旅，探索神秘的世界！", 
            versions: [],
            media: []
        },
        { 
            id: 105, 
            title: "魔法学院", 
            cover: "https://picsum.photos/800/600?random=105", 
            tags: ["魔法", "校园", "恋爱"], 
            intro: "在魔法学院中学习魔法，结识新的朋友，展开浪漫故事。", 
            versions: [],
            media: []
        },
        { 
            id: 106, 
            title: "星际探索", 
            cover: "https://picsum.photos/800/600?random=106", 
            tags: ["科幻", "冒险", "射击"], 
            intro: "驾驶宇宙飞船，探索未知的星系，与外星文明接触。", 
            versions: [],
            media: []
        },
        { 
            id: 107, 
            title: "历史策略", 
            cover: "https://picsum.photos/800/600?random=107", 
            tags: ["历史", "策略", "战争"], 
            intro: "回到古代，制定战略，统一国家，成为一代帝王。", 
            versions: [],
            media: []
        },
        { 
            id: 108, 
            title: "恐怖医院", 
            cover: "https://picsum.photos/800/600?random=108", 
            tags: ["恐怖", "解谜", "冒险"], 
            intro: "在废弃医院中寻找真相，逃离恐怖的追杀。", 
            versions: [],
            media: []
        },
        { 
            id: 109, 
            title: "音乐大师", 
            cover: "https://picsum.photos/800/600?random=109", 
            tags: ["音乐", "模拟", "养成"], 
            intro: "成为音乐大师，创作属于你的音乐作品。", 
            versions: [],
            media: []
        },
        { 
            id: 110, 
            title: "格斗之王", 
            cover: "https://picsum.photos/800/600?random=110", 
            tags: ["格斗", "动作", "体育"], 
            intro: "参加格斗比赛，成为格斗之王。", 
            versions: [],
            media: []
        },
        { 
            id: 111, 
            title: "生存挑战", 
            cover: "https://picsum.photos/800/600?random=111", 
            tags: ["生存", "沙盒", "冒险"], 
            intro: "在荒岛上生存，收集资源，建造家园。", 
            versions: [],
            media: []
        },
        { 
            id: 112, 
            title: "校园侦探", 
            cover: "https://picsum.photos/800/600?random=112", 
            tags: ["推理", "校园", "悬疑"], 
            intro: "解决校园内的神秘事件，成为校园侦探。", 
            versions: [],
            media: []
        },
        { 
            id: 113, 
            title: "农场模拟", 
            cover: "https://picsum.photos/800/600?random=113", 
            tags: ["模拟", "养成", "休闲"], 
            intro: "经营自己的农场，种植作物，养殖动物。", 
            versions: [],
            media: []
        },
        { 
            id: 114, 
            title: "机甲战士", 
            cover: "https://picsum.photos/800/600?random=114", 
            tags: ["科幻", "射击", "动作"], 
            intro: "驾驶机甲战士，保护地球免受外星入侵。", 
            versions: [],
            media: []
        },
        { 
            id: 115, 
            title: "童话世界", 
            cover: "https://picsum.photos/800/600?random=115", 
            tags: ["奇幻", "冒险", "魔法"], 
            intro: "进入童话世界，经历各种奇妙冒险。", 
            versions: [],
            media: []
        },
        { 
            id: 116, 
            title: "赛车竞速", 
            cover: "https://picsum.photos/800/600?random=116", 
            tags: ["体育", "竞速", "动作"], 
            intro: "驾驶各种赛车，参加竞速比赛。", 
            versions: [],
            media: []
        },
        { 
            id: 117, 
            title: "太空站建设", 
            cover: "https://picsum.photos/800/600?random=117", 
            tags: ["模拟", "科幻", "策略"], 
            intro: "建设属于自己的太空站，探索太空。", 
            versions: [],
            media: []
        },
        { 
            id: 118, 
            title: "侦探小说", 
            cover: "https://picsum.photos/800/600?random=118", 
            tags: ["推理", "悬疑", "文字"], 
            intro: "阅读互动侦探小说，做出选择，影响故事发展。", 
            versions: [],
            media: []
        },
        { 
            id: 119, 
            title: "美食大师", 
            cover: "https://picsum.photos/800/600?random=119", 
            tags: ["模拟", "养成", "休闲"], 
            intro: "制作各种美食，成为美食大师。", 
            versions: [],
            media: []
        },
        { 
            id: 120, 
            title: "忍者传说", 
            cover: "https://picsum.photos/800/600?random=120", 
            tags: ["动作", "历史", "冒险"], 
            intro: "成为一名忍者，执行各种任务。", 
            versions: [],
            media: []
        },
        { 
            id: 121, 
            title: "宠物乐园", 
            cover: "https://picsum.photos/800/600?random=121", 
            tags: ["养成", "模拟", "休闲"], 
            intro: "领养宠物，照顾它们，和它们一起成长。", 
            versions: [],
            media: []
        },
        { 
            id: 122, 
            title: "末日生存", 
            cover: "https://picsum.photos/800/600?random=122", 
            tags: ["生存", "恐怖", "射击"], 
            intro: "在末日世界中生存，寻找其他幸存者。", 
            versions: [],
            media: []
        },
        { 
            id: 123, 
            title: "科学家模拟", 
            cover: "https://picsum.photos/800/600?random=123", 
            tags: ["模拟", "科幻", "教育"], 
            intro: "成为科学家，进行各种实验。", 
            versions: [],
            media: []
        },
        { 
            id: 124, 
            title: "神秘岛屿", 
            cover: "https://picsum.photos/800/600?random=124", 
            tags: ["冒险", "解谜", "探索"], 
            intro: "探索神秘岛屿的秘密，发现隐藏的宝藏和古老文明。", 
            versions: [],
            media: []
        },
        { 
            id: 125, 
            title: "未来城市", 
            cover: "https://picsum.photos/800/600?random=125", 
            tags: ["科幻", "开放世界", "模拟"], 
            intro: "在未来城市中生活，体验高科技带来的便利和挑战。", 
            versions: [],
            media: []
        },
        { 
            id: 126, 
            title: "武侠世界", 
            cover: "https://picsum.photos/800/600?random=126", 
            tags: ["武侠", "动作", "角色扮演"], 
            intro: "成为一名武侠，学习绝世武功，行侠仗义。", 
            versions: [],
            media: []
        },
        { 
            id: 127, 
            title: "海洋探险", 
            cover: "https://picsum.photos/800/600?random=127", 
            tags: ["冒险", "海洋", "探索"], 
            intro: "潜入深海，探索未知的海洋世界，发现神秘生物。", 
            versions: [],
            media: []
        },
        { 
            id: 128, 
            title: "梦幻花园", 
            cover: "https://picsum.photos/800/600?random=128", 
            tags: ["养成", "休闲", "模拟"], 
            intro: "打造属于自己的梦幻花园，种植各种美丽的花朵。", 
            versions: [],
            media: []
        },
        { 
            id: 129, 
            title: "黑客帝国", 
            cover: "https://picsum.photos/800/600?random=129", 
            tags: ["科幻", "动作", "冒险"], 
            intro: "进入虚拟世界，成为一名黑客，对抗邪恶势力。", 
            versions: [],
            media: []
        },
        { 
            id: 130, 
            title: "动物王国", 
            cover: "https://picsum.photos/800/600?random=130", 
            tags: ["模拟", "养成", "休闲"], 
            intro: "探索动物王国，了解各种动物的生活习性。", 
            versions: [],
            media: []
        },
        { 
            id: 131, 
            title: "战争策略", 
            cover: "https://picsum.photos/800/600?random=131", 
            tags: ["策略", "战争", "模拟"], 
            intro: "制定战争策略，指挥军队，取得胜利。", 
            versions: [],
            media: []
        },
        { 
            id: 132, 
            title: "魔法森林", 
            cover: "https://picsum.photos/800/600?random=132", 
            tags: ["奇幻", "冒险", "魔法"], 
            intro: "进入魔法森林，与各种神奇生物交朋友。", 
            versions: [],
            media: []
        },
        { 
            id: 133, 
            title: "赛车模拟器", 
            cover: "https://picsum.photos/800/600?random=133", 
            tags: ["体育", "竞速", "模拟"], 
            intro: "体验真实的赛车驾驶，参加各种比赛。", 
            versions: [],
            media: []
        },
        { 
            id: 134, 
            title: "太空战争", 
            cover: "https://picsum.photos/800/600?random=134", 
            tags: ["科幻", "射击", "战争"], 
            intro: "驾驶宇宙飞船，参加激烈的太空战争。", 
            versions: [],
            media: []
        },
        { 
            id: 135, 
            title: "校园恋爱", 
            cover: "https://picsum.photos/800/600?random=135", 
            tags: ["恋爱", "校园", "文字"], 
            intro: "在校园中展开浪漫的恋爱故事，选择不同的结局。", 
            versions: [],
            media: []
        },
        { 
            id: 136, 
            title: "恐龙世界", 
            cover: "https://picsum.photos/800/600?random=136", 
            tags: ["冒险", "探索", "教育"], 
            intro: "回到恐龙时代，探索恐龙的生活环境。", 
            versions: [],
            media: []
        },
        { 
            id: 137, 
            title: "经营酒店", 
            cover: "https://picsum.photos/800/600?random=137", 
            tags: ["模拟", "经营", "养成"], 
            intro: "经营自己的酒店，提供优质服务，吸引更多客人。", 
            versions: [],
            media: []
        },
        { 
            id: 138, 
            title: "超级英雄", 
            cover: "https://picsum.photos/800/600?random=138", 
            tags: ["动作", "科幻", "冒险"], 
            intro: "成为超级英雄，拯救世界免受邪恶势力的威胁。", 
            versions: [],
            media: []
        },
        { 
            id: 139, 
            title: "农场物语", 
            cover: "https://picsum.photos/800/600?random=139", 
            tags: ["模拟", "养成", "休闲"], 
            intro: "经营自己的农场，过上宁静的乡村生活。", 
            versions: [],
            media: []
        },
        { 
            id: 140, 
            title: "魔法商店", 
            cover: "https://picsum.photos/800/600?random=140", 
            tags: ["模拟", "经营", "魔法"], 
            intro: "经营一家魔法商店，出售各种神奇的魔法物品。", 
            versions: [],
            media: []
        },
        { 
            id: 141, 
            title: "荒岛求生", 
            cover: "https://picsum.photos/800/600?random=141", 
            tags: ["生存", "冒险", "沙盒"], 
            intro: "在荒岛上求生，利用资源建造工具和住所。", 
            versions: [],
            media: []
        },
        { 
            id: 142, 
            title: "未来战士", 
            cover: "https://picsum.photos/800/600?random=142", 
            tags: ["科幻", "动作", "射击"], 
            intro: "成为未来战士，参加激烈的战斗。", 
            versions: [],
            media: []
        }
    ],
    comments: [
        { user: "UserA", text: "资源速度很快，感谢分享！", avatar: "" },
        { user: "UserB", text: "解压密码是多少？", avatar: "" }
    ],
    announcement: {
        show: true,
        title: "【匿影Gal】新站公测公告",
        content: "欢迎来到匿影Gal！本站致力于提供高质量Galgame资源，请遵守社区规范，共同维护和谐环境。",
        image: "https://images.unsplash.com/photo-1517457210348-181985223e1b?auto=format&fit=crop&w=400&q=80"
    }
};

/**
 * 图片预加载器
 * 优化图片加载性能，支持优先级和缓存
 */
export const ImagePreloader = {
    // 图片缓存
    cache: new Set(),
    
    /**
     * 预加载图片
     * @param {Array} urls - 图片URL数组
     * @param {string} priority - 优先级：high, medium, low
     */
    preloadImages: (urls, priority = 'low') => {
        // 过滤掉已经缓存的图片
        const newUrls = urls.filter(url => !ImagePreloader.cache.has(url));
        
        newUrls.forEach(url => {
            const img = new Image();
            img.src = url;
            img.loading = priority === 'high' ? 'eager' : 'lazy';
            img.fetchPriority = priority;
            
            // 添加到缓存
            ImagePreloader.cache.add(url);
        });
    },
    
    /**
     * 预加载可见区域和即将可见的图片
     */
    preloadVisibleImages: () => {
        const visibleImages = document.querySelectorAll('img[loading="lazy"]');
        visibleImages.forEach(img => {
            img.loading = 'eager';
        });
    },
    
    /**
     * 预加载所有资源图片
     */
    preloadAllResourceImages: () => {
        const allImageUrls = [];
        
        // 收集所有资源的封面图
        DB.resources.forEach(resource => {
            if (resource.cover) {
                allImageUrls.push(resource.cover);
            }
            // 收集媒体库图片
            if (resource.media) {
                resource.media.forEach(media => {
                    if (media.type === 'image' && media.url) {
                        allImageUrls.push(media.url);
                    }
                });
            }
        });
        
        // 收集公告图片
        if (DB.announcement && DB.announcement.image) {
            allImageUrls.push(DB.announcement.image);
        }
        
        // 预加载图片，核心图片设置为高优先级
        const highPriorityUrls = allImageUrls.slice(0, 10); // 前10个作为高优先级
        const lowPriorityUrls = allImageUrls.slice(10);
        
        ImagePreloader.preloadImages(highPriorityUrls, 'high');
        ImagePreloader.preloadImages(lowPriorityUrls, 'low');
    },
    
    /**
     * 初始化图片预加载
     */
    init: () => {
        // 页面加载完成后预加载核心图片
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', ImagePreloader.preloadAllResourceImages);
        } else {
            ImagePreloader.preloadAllResourceImages();
        }
        
        // 滚动时预加载可见图片
        window.addEventListener('scroll', () => {
            ImagePreloader.preloadVisibleImages();
        });
    }
};
