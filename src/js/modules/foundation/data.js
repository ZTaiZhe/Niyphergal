/**
 *
 *
 */

import { generatePinyinCode } from './utils.js';

export const DB = {
    registeredUsers: [],
    user: null,
    resources: [
        {
            id: 101,
            title: '原神 (Genshin Impact)',
            cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
            tags: ['开放世界', 'RPG'],
            intro: '在七种元素交汇的大陆提瓦特每个人都可以成为神你从世界之外漂流而来降临大地...',
            versions: [
                { ver: 'v4.2 纯净版', date: '2023-11-08', size: '60GB' },
                { ver: 'v4.1 预下载', date: '2023-09-25', size: '58GB' }
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
            title: 'Summer Pockets (夏日口袋)',
            cover: 'https://images.unsplash.com/photo-1472457897821-70d3819a0e24?auto=format&fit=crop&w=800&q=80',
            tags: ['GAL', 'Key社', '治愈'],
            intro: '为了整理祖母的遗物鹰原羽依里利用暑假独自一人来到了鸟白岛...',
            versions: [],
            media: []
        },
        {
            id: 104,
            title: '冒险之旅',
            cover: 'https://picsum.photos/800/600?random=104',
            tags: ['冒险', '动作', '开放世界'],
            intro: '踏上一段充满未知的冒险之旅探索神秘的世界',
            versions: [],
            media: []
        },
        {
            id: 105,
            title: '魔法学院',
            cover: 'https://picsum.photos/800/600?random=105',
            tags: ['魔法', '校园', '恋爱'],
            intro: '在魔法学院中学习魔法结识新的朋友展开浪漫故事',
            versions: [],
            media: []
        },
        {
            id: 106,
            title: '星际探索',
            cover: 'https://picsum.photos/800/600?random=106',
            tags: ['科幻', '冒险', '射击'],
            intro: '驾驶宇宙飞船探索未知的星系与外星文明接触',
            versions: [],
            media: []
        },
        {
            id: 107,
            title: '历史策略',
            cover: 'https://picsum.photos/800/600?random=107',
            tags: ['历史', '策略', '战争'],
            intro: '回到古代制定战略统一国家成为一代帝王',
            versions: [],
            media: []
        },
        {
            id: 108,
            title: '恐怖医院',
            cover: 'https://picsum.photos/800/600?random=108',
            tags: ['恐怖', '解谜', '冒险'],
            intro: '在废弃医院中寻找真相逃离恐怖的追杀',
            versions: [],
            media: []
        },
        {
            id: 109,
            title: '音乐大师',
            cover: 'https://picsum.photos/800/600?random=109',
            tags: ['音乐', '模拟', '养成'],
            intro: '成为音乐大师创作属于你的音乐作品',
            versions: [],
            media: []
        },
        {
            id: 110,
            title: '格斗之王',
            cover: 'https://picsum.photos/800/600?random=110',
            tags: ['格斗', '动作', '体育'],
            intro: '参加格斗比赛成为格斗之王',
            versions: [],
            media: []
        },
        {
            id: 111,
            title: '生存挑战',
            cover: 'https://picsum.photos/800/600?random=111',
            tags: ['生存', '沙盒', '冒险'],
            intro: '在荒岛上生存收集资源建造家园',
            versions: [],
            media: []
        },
        {
            id: 112,
            title: '校园侦探',
            cover: 'https://picsum.photos/800/600?random=112',
            tags: ['推理', '校园', '悬疑'],
            intro: '解决校园内的神秘事件成为校园侦探',
            versions: [],
            media: []
        },
        {
            id: 113,
            title: '农场模拟',
            cover: 'https://picsum.photos/800/600?random=113',
            tags: ['模拟', '养成', '休闲'],
            intro: '经营自己的农场种植作物养殖动物',
            versions: [],
            media: []
        },
        {
            id: 114,
            title: '机甲战士',
            cover: 'https://picsum.photos/800/600?random=114',
            tags: ['科幻', '射击', '动作'],
            intro: '驾驶机甲战士保护地球免受外星入侵',
            versions: [],
            media: []
        },
        {
            id: 115,
            title: '童话世界',
            cover: 'https://picsum.photos/800/600?random=115',
            tags: ['奇幻', '冒险', '魔法'],
            intro: '进入童话世界经历各种奇妙冒险',
            versions: [],
            media: []
        },
        {
            id: 116,
            title: '赛车竞速',
            cover: 'https://picsum.photos/800/600?random=116',
            tags: ['体育', '竞速', '动作'],
            intro: '驾驶各种赛车参加竞速比赛',
            versions: [],
            media: []
        },
        {
            id: 117,
            title: '太空站建设',
            cover: 'https://picsum.photos/800/600?random=117',
            tags: ['模拟', '科幻', '策略'],
            intro: '建设属于自己的太空站探索太空',
            versions: [],
            media: []
        },
        {
            id: 118,
            title: '侦探小说',
            cover: 'https://picsum.photos/800/600?random=118',
            tags: ['推理', '悬疑', '文字'],
            intro: '阅读互动侦探小说做出选择影响故事发展',
            versions: [],
            media: []
        },
        {
            id: 119,
            title: '美食大师',
            cover: 'https://picsum.photos/800/600?random=119',
            tags: ['模拟', '养成', '休闲'],
            intro: '制作各种美食成为美食大师',
            versions: [],
            media: []
        },
        {
            id: 120,
            title: '忍者传说',
            cover: 'https://picsum.photos/800/600?random=120',
            tags: ['动作', '历史', '冒险'],
            intro: '成为一名忍者执行各种任务',
            versions: [],
            media: []
        },
        {
            id: 121,
            title: '宠物乐园',
            cover: 'https://picsum.photos/800/600?random=121',
            tags: ['养成', '模拟', '休闲'],
            intro: '领养宠物照顾它们和它们一起成长',
            versions: [],
            media: []
        },
        {
            id: 122,
            title: '末日生存',
            cover: 'https://picsum.photos/800/600?random=122',
            tags: ['生存', '恐怖', '射击'],
            intro: '在末日世界中生存寻找其他幸存者',
            versions: [],
            media: []
        },
        {
            id: 123,
            title: '科学家模拟',
            cover: 'https://picsum.photos/800/600?random=123',
            tags: ['模拟', '科幻', '教育'],
            intro: '成为科学家进行各种实验',
            versions: [],
            media: []
        },
        {
            id: 124,
            title: '神秘岛屿',
            cover: 'https://picsum.photos/800/600?random=124',
            tags: ['冒险', '解谜', '探索'],
            intro: '探索神秘岛屿的秘密发现隐藏的宝藏和古老文明',
            versions: [],
            media: []
        },
        {
            id: 125,
            title: '未来城市',
            cover: 'https://picsum.photos/800/600?random=125',
            tags: ['科幻', '开放世界', '模拟'],
            intro: '在未来城市中生活体验高科技带来的便利和挑战',
            versions: [],
            media: []
        },
        {
            id: 126,
            title: '武侠世界',
            cover: 'https://picsum.photos/800/600?random=126',
            tags: ['武侠', '动作', '角色扮演'],
            intro: '成为一名武侠学习绝世武功行侠仗义',
            versions: [],
            media: []
        },
        {
            id: 127,
            title: '海洋探险',
            cover: 'https://picsum.photos/800/600?random=127',
            tags: ['冒险', '海洋', '探索'],
            intro: '潜入深海探索未知的海洋世界发现神秘生物',
            versions: [],
            media: []
        },
        {
            id: 128,
            title: '梦幻花园',
            cover: 'https://picsum.photos/800/600?random=128',
            tags: ['养成', '休闲', '模拟'],
            intro: '打造属于自己的梦幻花园种植各种美丽的花朵',
            versions: [],
            media: []
        },
        {
            id: 129,
            title: '黑客帝国',
            cover: 'https://picsum.photos/800/600?random=129',
            tags: ['科幻', '动作', '冒险'],
            intro: '进入虚拟世界成为一名黑客对抗邪恶势力',
            versions: [],
            media: []
        },
        {
            id: 130,
            title: '动物王国',
            cover: 'https://picsum.photos/800/600?random=130',
            tags: ['模拟', '养成', '休闲'],
            intro: '探索动物王国了解各种动物的生活习性',
            versions: [],
            media: []
        },
        {
            id: 131,
            title: '战争策略',
            cover: 'https://picsum.photos/800/600?random=131',
            tags: ['策略', '战争', '模拟'],
            intro: '制定战争策略指挥军队取得胜利',
            versions: [],
            media: []
        },
        {
            id: 132,
            title: '魔法森林',
            cover: 'https://picsum.photos/800/600?random=132',
            tags: ['奇幻', '冒险', '魔法'],
            intro: '进入魔法森林与各种神奇生物交朋友',
            versions: [],
            media: []
        },
        {
            id: 133,
            title: '赛车模拟器',
            cover: 'https://picsum.photos/800/600?random=133',
            tags: ['体育', '竞速', '模拟'],
            intro: '体验真实的赛车驾驶参加各种比赛',
            versions: [],
            media: []
        },
        {
            id: 134,
            title: '太空战争',
            cover: 'https://picsum.photos/800/600?random=134',
            tags: ['科幻', '射击', '战争'],
            intro: '驾驶宇宙飞船参加激烈的太空战争',
            versions: [],
            media: []
        },
        {
            id: 135,
            title: '校园恋爱',
            cover: 'https://picsum.photos/800/600?random=135',
            tags: ['恋爱', '校园', '文字'],
            intro: '在校园中展开浪漫的恋爱故事选择不同的结局',
            versions: [],
            media: []
        },
        {
            id: 136,
            title: '恐龙世界',
            cover: 'https://picsum.photos/800/600?random=136',
            tags: ['冒险', '探索', '教育'],
            intro: '回到恐龙时代探索恐龙的生活环境',
            versions: [],
            media: []
        },
        {
            id: 137,
            title: '经营酒店',
            cover: 'https://picsum.photos/800/600?random=137',
            tags: ['模拟', '经营', '养成'],
            intro: '经营自己的酒店提供优质服务吸引更多客人',
            versions: [],
            media: []
        },
        {
            id: 138,
            title: '超级英雄',
            cover: 'https://picsum.photos/800/600?random=138',
            tags: ['动作', '科幻', '冒险'],
            intro: '成为超级英雄拯救世界免受邪恶势力的威胁',
            versions: [],
            media: []
        },
        {
            id: 139,
            title: '农场物语',
            cover: 'https://picsum.photos/800/600?random=139',
            tags: ['模拟', '养成', '休闲'],
            intro: '经营自己的农场过上宁静的乡村生活',
            versions: [],
            media: []
        },
        {
            id: 140,
            title: '魔法商店',
            cover: 'https://picsum.photos/800/600?random=140',
            tags: ['模拟', '经营', '魔法'],
            intro: '经营一家魔法商店出售各种神奇的魔法物品',
            versions: [],
            media: []
        },
        {
            id: 141,
            title: '荒岛求生',
            cover: 'https://picsum.photos/800/600?random=141',
            tags: ['生存', '冒险', '沙盒'],
            intro: '在荒岛上求生利用资源建造工具和住所',
            versions: [],
            media: []
        },
        {
            id: 142,
            title: '未来战士',
            cover: 'https://picsum.photos/800/600?random=142',
            tags: ['科幻', '动作', '射击'],
            intro: '成为未来战士参加激烈的战斗',
            versions: [],
            media: []
        }
    ],
    comments: [
        { user: 'UserA', text: '资源速度很快感谢分享', avatar: '' },
        { user: 'UserB', text: '解压密码是多少', avatar: '' }
    ],
    carouselSlides: [
        {
            id: 'slide-1',
            type: 'game',
            title: '原神',
            subtitle: '开放世界 RPG',
            description: '在七种元素交汇的提瓦特大陆，开启你的冒险之旅',
            image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
            action: { type: 'navigate', page: 'detail', params: { id: 101 } }
        },
        {
            id: 'slide-2',
            type: 'game',
            title: 'Summer Pockets',
            subtitle: 'Key社 治愈系',
            description: '在鸟白岛的夏日时光中，寻找遗失的记忆',
            image: 'https://images.unsplash.com/photo-1472457897821-70d3819a0e24?auto=format&fit=crop&w=1200&q=80',
            action: { type: 'navigate', page: 'detail', params: { id: 103 } }
        },
        {
            id: 'slide-3',
            type: 'announcement',
            title: 'NiypherGal 公测开启',
            subtitle: '站点公告',
            description: '全新游戏资源站正式上线，海量资源等你探索',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cyberpunk%20gaming%20website%20announcement%20banner%20neon%20lights%20dark%20blue%20purple%20gradient&image_size=landscape_16_9',
            action: null
        },
        {
            id: 'slide-4',
            type: 'update',
            title: '资源系统升级',
            subtitle: '功能更新',
            description: '全新下载体验，更快的速度更稳定的连接',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=technology%20update%20digital%20network%20blue%20cyan%20glow%20modern%20interface&image_size=landscape_16_9',
            action: null
        },
        {
            id: 'slide-5',
            type: 'event',
            title: '社区活动进行中',
            subtitle: '限时活动',
            description: '参与社区互动赢取专属奖励，与玩家一起分享游戏乐趣',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=gaming%20community%20event%20celebration%20colorful%20confetti%20dark%20background&image_size=landscape_16_9',
            action: null
        }
    ],
    announcement: {
        show: true,
        title: 'NiypherGal新站公测公告',
        content: '欢迎来到NiypherGal，本站致力于提供高质量Galgame资源，请遵守社区规范，共同维护和谐环境。',
        image: 'https://images.unsplash.com/photo-1517457210348-181985223e1b?auto=format&fit=crop&w=400&q=80'
    }
};

DB.resources.forEach(resource => {
    resource.pinyin = generatePinyinCode(resource);
});

/**
 *
 *
 */
import { throttle } from './utils.js';
import { initLazyLoad, observeExistingMedia } from '../engine/mediaLoader.js';

export const ImagePreloader = {
    cache: new Set(),

    preloadImages: (urls, priority = 'low') => {
        const newUrls = urls.filter(url => !ImagePreloader.cache.has(url));

        newUrls.forEach(url => {
            const img = new Image();
            img.src = url;
            img.loading = priority === 'high' ? 'eager' : 'lazy';
            img.fetchPriority = priority;
            ImagePreloader.cache.add(url);
        });
    },

    preloadVisibleImages: throttle(() => {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            const rect = img.getBoundingClientRect();
            if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.style.opacity = '1';
                    delete img.dataset.src;
                }
            }
        });

        const lazyVideos = document.querySelectorAll('iframe[data-src]');
        lazyVideos.forEach(iframe => {
            const rect = iframe.getBoundingClientRect();
            if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
                if (iframe.dataset.src) {
                    iframe.src = iframe.dataset.src;
                    delete iframe.dataset.src;
                }
            }
        });
    }, 100),

    preloadVisibleResourceImages: () => {
        const visibleUrls = [];

        if (DB.resources && DB.resources.length > 0) {
            const count = Math.min(DB.resources.length, 6);
            for (let i = 0; i < count; i++) {
                if (DB.resources[i].cover) {
                    visibleUrls.push(DB.resources[i].cover);
                }
            }
        }

        if (DB.announcement && DB.announcement.image) {
            visibleUrls.push(DB.announcement.image);
        }

        ImagePreloader.preloadImages(visibleUrls, 'high');
    },

    init: () => {
        initLazyLoad();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                ImagePreloader.preloadVisibleResourceImages();
                observeExistingMedia();
            });
        } else {
            ImagePreloader.preloadVisibleResourceImages();
            observeExistingMedia();
        }

        window.addEventListener('scroll', ImagePreloader.preloadVisibleImages, { passive: true });
    }
};
