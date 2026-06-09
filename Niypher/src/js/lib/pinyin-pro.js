const pinyinData = {
    a: '阿啊',
    ai: '爱埃艾矮碍哀哎',
    an: '安按暗岸氨鞍',
    ang: '昂',
    ao: '奥澳傲熬凹袄',
    ba: '八巴爸把拔芭叭霸',
    bai: '白百拜败摆柏',
    ban: '班半般办扮拌搬版颁瓣',
    bang: '帮邦棒绑膀傍',
    bao: '包宝保报抱暴爆薄堡饱',
    bei: '北被备背悲杯倍贝碑辈卑',
    ben: '本笨奔',
    beng: '崩蹦绷',
    bi: '比笔必毕避壁臂逼鼻彼碧币闭弊',
    bian: '边变便编遍辩辨扁鞭贬',
    biao: '表标彪镖',
    bie: '别憋',
    bin: '宾滨彬斌',
    bing: '兵病冰并饼丙秉',
    bo: '波博播拨伯驳泊勃脖薄搏',
    bu: '不布步怖部补捕卜',
    ca: '擦嚓',
    cai: '才材财菜彩猜裁踩',
    can: '参残惨灿餐蚕',
    cang: '藏仓苍舱',
    cao: '草操曹糙',
    ce: '策侧册厕',
    ceng: '层曾蹭',
    cha: '查差茶察插叉刹',
    chai: '柴拆',
    chan: '产单颤缠蝉铲',
    chang: '长常场唱偿畅昌尝倡猖',
    chao: '超朝抄吵巢炒钞',
    che: '车扯撤',
    chen: '陈沉尘晨衬臣趁忱',
    cheng: '成城程诚承称呈乘惩橙澄',
    chi: '吃尺持迟翅耻池驰斥',
    chong: '重充宠冲崇',
    chou: '抽愁丑臭仇筹绸酬瞅',
    chu: '出处初除楚储触厨础',
    chuan: '川传船穿串喘',
    chuang: '床窗创闯',
    chui: '吹炊锤',
    chun: '春纯唇蠢',
    ci: '次词辞慈瓷此刺',
    cong: '从丛聪匆',
    cu: '粗促醋',
    cuan: '窜篡',
    cui: '翠脆催摧',
    cun: '村存寸',
    cuo: '错措搓',
    da: '大打达答',
    dai: '代带待袋戴贷担呆怠殆',
    dan: '但单担胆弹淡蛋旦诞',
    dang: '当党挡荡',
    dao: '到导道岛倒刀稻蹈盗',
    de: '的得德',
    dei: '得',
    deng: '等灯登凳',
    di: '地低底帝弟递第滴抵敌迪',
    dian: '点电店典殿垫碘',
    diao: '掉调钓雕刁',
    die: '爹跌叠蝶迭',
    ding: '定订钉顶丁盯',
    diu: '丢',
    dong: '东冬动懂洞冻栋',
    dou: '都斗豆逗抖陡',
    du: '度读毒独堵赌杜肚渡镀',
    duan: '短段断锻端缎',
    dui: '对队堆兑',
    dun: '顿吨蹲盾钝',
    duo: '多朵夺躲堕',
    e: '恶俄额鹅饿厄',
    en: '恩',
    er: '而二耳儿尔',
    fa: '发法罚伐乏阀',
    fan: '反饭翻凡烦繁范犯泛帆番',
    fang: '方放房纺仿防访仿芳',
    fei: '飞非费肥废匪肺沸',
    fen: '分份纷坟奋愤粉芬',
    feng: '风封丰锋蜂疯逢缝凤峰',
    fo: '佛',
    fou: '否',
    fu: '父夫服府付副富负复附符幅腐扶浮福辅赴妇傅',
    ga: '嘎尬',
    gai: '改盖概溉',
    gan: '敢感干赶肝杆竿',
    gang: '刚港钢岗纲',
    gao: '高搞告稿糕',
    ge: '个歌格阁隔革割葛',
    gei: '给',
    gen: '根跟',
    geng: '更耕',
    gong: '工公共功攻供宫弓恭躬',
    gou: '够狗购构沟钩苟',
    gu: '古股骨故固顾鼓孤估辜',
    gua: '挂瓜刮寡',
    guai: '怪拐',
    guan: '关观管官馆惯冠灌贯',
    guang: '光广逛',
    gui: '归贵规鬼桂柜轨硅',
    gun: '滚棍',
    guo: '国过果锅裹',
    ha: '哈蛤',
    hai: '还海孩害骇',
    han: '汉喊寒含韩汗旱函涵',
    hang: '行航杭',
    hao: '好号耗豪浩毫',
    he: '合和喝盒贺赫河荷核鹤',
    hei: '黑',
    hen: '很狠恨',
    heng: '横衡哼',
    hong: '红虹宏洪轰烘',
    hou: '后厚候猴喉吼',
    hu: '呼户护湖狐忽胡壶糊蝴虎',
    hua: '花话画华化滑划',
    huai: '坏怀淮',
    huan: '换欢环幻还缓患唤焕',
    huang: '黄皇荒慌煌晃谎凰',
    hui: '回会汇辉灰挥恢绘毁慧辉',
    hun: '婚混魂昏浑',
    huo: '活火获伙货或惑祸豁',
    ji: '机极计记击级际集济技继祭寂籍脊己既忌迹积基寄激即吉辑肌嫉',
    jia: '家加价甲假驾嫁佳夹嘉',
    jian: '见建间健渐剑鉴键箭荐践减简检剪尖坚拣',
    jiang: '江将讲降奖匠酱疆僵桨',
    jiao: '交教觉校角脚较叫骄娇焦搅浇郊缴',
    jie: '接解结界届戒介阶节截竭姐借街杰洁捷',
    jin: '进今金近紧尽仅锦禁筋津斤谨',
    jing: '经景精竞境敬镜惊静净京竟警井晶颈',
    jiu: '九久酒救旧究纠揪',
    ju: '局句举具距剧拒聚居巨惧据矩',
    juan: '卷倦圈捐娟',
    jue: '觉决绝角掘爵',
    jun: '军均君菌俊',
    ka: '卡咖喀',
    kai: '开楷凯慨',
    kan: '看刊砍堪勘',
    kang: '康抗扛慷炕',
    kao: '考靠烤',
    ke: '可科客刻课颗壳渴克棵柯',
    ken: '肯啃',
    keng: '坑',
    kong: '空恐控孔',
    kou: '口扣',
    ku: '苦库哭酷枯',
    kua: '跨夸垮',
    kuai: '快块筷',
    kuan: '宽款',
    kuang: '况矿狂框旷',
    kui: '亏溃愧魁',
    kun: '困昆捆',
    kuo: '扩阔括',
    la: '拉啦辣蜡垃',
    lai: '来赖',
    lan: '蓝兰拦懒烂滥栏',
    lang: '狼浪郎廊',
    lao: '老劳牢捞',
    le: '乐勒',
    lei: '类累雷泪蕾擂',
    leng: '冷愣',
    li: '力立理利历礼李离例里粒丽厉励隶厘黎',
    lia: '俩',
    lian: '连练恋联莲帘脸链怜',
    liang: '两亮良凉量粮梁辆',
    liao: '了料聊辽疗撩',
    lie: '列烈猎裂劣',
    lin: '林临邻淋麟',
    ling: '领令灵零铃陵龄凌岭',
    liu: '六流留柳溜',
    long: '龙隆笼聋弄',
    lou: '楼漏露搂',
    lu: '路录陆鹿炉虏鲁碌露',
    lv: '绿旅律率滤铝',
    luan: '乱卵',
    lue: '略掠',
    lun: '论轮伦',
    luo: '罗落螺骆洛',
    ma: '马妈麻骂吗嘛码',
    mai: '买卖迈麦埋脉',
    man: '满慢瞒漫蔓',
    mang: '忙盲茫芒',
    mao: '毛猫冒貌矛茅锚',
    me: '么',
    mei: '美每没妹眉媒煤霉梅',
    men: '门闷',
    meng: '梦猛蒙盟萌猛朦',
    mi: '米密秘蜜迷谜觅弥',
    mian: '面棉免勉眠缅',
    miao: '苗秒描妙庙渺',
    mie: '灭蔑',
    min: '民敏闽',
    ming: '明名命铭鸣',
    miu: '谬',
    mo: '莫模磨魔末默墨漠摸膜摩摹',
    mou: '某谋牟',
    mu: '母木目牧墓幕慕暮穆牟',
    na: '那拿哪纳',
    nai: '奶耐乃',
    nan: '男南难喃',
    nang: '囊',
    nao: '脑闹恼',
    ne: '呢',
    nei: '内',
    nen: '嫩',
    neng: '能',
    ni: '你泥拟逆尼昵',
    nian: '年念粘碾',
    niang: '娘酿',
    niao: '鸟尿',
    nie: '捏镍涅',
    nin: '您',
    ning: '宁凝柠',
    niu: '牛扭纽',
    nong: '农浓',
    nu: '女努奴',
    nv: '女',
    nuan: '暖',
    nue: '虐',
    nuo: '诺挪',
    o: '哦噢',
    ou: '偶欧呕藕',
    pa: '怕爬帕趴',
    pai: '拍排派牌',
    pan: '盘判攀盼畔',
    pang: '旁胖庞',
    pao: '跑炮泡抛',
    pei: '陪配赔佩培',
    pen: '盆喷',
    peng: '朋碰棚捧蓬膨',
    pi: '皮批劈疲匹披僻',
    pian: '片偏篇骗',
    piao: '票飘漂',
    pie: '瞥撇',
    pin: '品贫频',
    ping: '平评瓶凭萍屏',
    po: '破婆泼颇坡',
    pou: '剖',
    pu: '普铺扑朴谱葡仆浦',
    qi: '七气起期器奇旗骑棋企启弃妻齐欺契汽其祈',
    qia: '恰卡洽',
    qian: '钱前千浅潜签牵铅谦欠嵌迁虔',
    qiang: '强墙抢枪腔',
    qiao: '桥瞧巧敲悄俏窍',
    qie: '切且怯窃',
    qin: '亲琴侵勤秦禽',
    qing: '青清情轻庆请晴倾卿',
    qiong: '穷琼',
    qiu: '秋求球囚丘',
    qu: '去取趣区曲驱趋屈渠',
    quan: '全圈权拳劝泉',
    que: '缺确雀却鹊',
    qun: '群裙',
    ran: '然染燃',
    rang: '让嚷壤',
    rao: '扰绕饶',
    re: '热惹',
    ren: '人认忍刃任仁韧',
    reng: '仍扔',
    ri: '日',
    rong: '容荣融溶蓉绒',
    rou: '肉柔揉',
    ru: '入如乳儒辱',
    ruan: '软',
    rui: '锐瑞蕊',
    run: '润闰',
    ruo: '若弱',
    sa: '撒洒',
    sai: '赛塞腮',
    san: '三散伞',
    sang: '桑丧嗓',
    sao: '扫骚嫂',
    se: '色涩瑟',
    sen: '森',
    seng: '僧',
    sha: '沙杀纱傻刹砂',
    shai: '晒筛',
    shan: '山善闪衫扇删珊',
    shang: '上商伤赏尚',
    shao: '少烧绍勺稍哨',
    she: '社射设涉蛇舌舍赦',
    shen: '身深神甚审申伸慎渗',
    sheng: '生声升胜圣剩牲省绳',
    shi: '是时实世史食市示式势适释饰氏誓逝事使师石视试室识诗驶',
    shou: '手首守受授售兽瘦寿收',
    shu: '书数树熟属术束述输鼠署舒疏叔暑',
    shua: '刷耍',
    shuai: '帅摔衰甩',
    shuan: '栓拴',
    shuang: '双霜爽',
    shui: '水睡税',
    shun: '顺瞬舜',
    shuo: '说硕朔',
    si: '四思死丝司私似寺饲',
    song: '送松宋颂诵',
    sou: '搜艘',
    su: '速素苏诉俗宿肃塑溯',
    suan: '算酸蒜',
    sui: '岁随碎遂穗',
    sun: '孙损笋',
    suo: '所索锁缩梭',
    ta: '他她它塔踏塌',
    tai: '太台态泰抬',
    tan: '谈探贪叹滩坛弹潭坦',
    tang: '糖堂躺趟汤唐塘烫',
    tao: '逃套桃讨淘陶涛',
    te: '特',
    teng: '疼腾',
    ti: '体提替题梯踢蹄',
    tian: '天田添甜填',
    tiao: '条跳挑调',
    tie: '铁帖',
    ting: '听停庭挺厅亭',
    tong: '同通统童痛铜桶筒统',
    tou: '头投透偷',
    tu: '土图途吐兔涂屠',
    tuan: '团',
    tui: '推退腿',
    tun: '吞屯',
    tuo: '脱拖托驼',
    wa: '瓦挖蛙洼娃',
    wai: '外歪',
    wan: '玩完晚万碗弯湾丸挽',
    wang: '王往望网忘亡旺汪',
    wei: '为位未喂卫围威危微违伟维尾委味胃畏谓慰',
    wen: '文问温闻稳纹吻蚊',
    weng: '翁嗡',
    wo: '我握窝蜗',
    wu: '五无物武务舞误悟午吴屋乌污巫伍',
    xi: '西系息喜希席习细戏洗析稀吸牺昔惜',
    xia: '夏下吓虾狭瞎侠霞暇',
    xian: '先现限险线县仙鲜贤闲弦献显陷嫌宪',
    xiang: '向想相降详享象像香乡箱项巷橡',
    xiao: '小笑消校效晓销肖孝萧',
    xie: '些写谢鞋协械斜歇携械',
    xin: '心新信辛薪欣薪',
    xing: '行性形星醒幸兴型姓杏刑',
    xiong: '雄兄凶胸熊',
    xiu: '修休秀绣锈袖嗅',
    xu: '许需续虚序绪蓄须叙',
    xuan: '选宣悬旋玄炫',
    xue: '学雪血穴',
    xun: '寻讯巡训迅询',
    ya: '呀压亚崖牙鸦雅哑鸭',
    yan: '言眼演烟严岩研盐颜沿炎厌验宴掩雁燕',
    yang: '洋样阳养仰扬氧羊杨仰痒',
    yao: '要摇药咬遥钥邀妖腰耀',
    ye: '也夜爷业叶野页液',
    yi: '一已意医疑忆宜移仪益遗倚亿义艺译易异役亦',
    yin: '因音引银印饮隐阴吟',
    ying: '应硬影英营赢迎映颖鹰蝇樱莹',
    yo: '哟',
    yong: '用勇永涌拥泳庸',
    you: '有又右游友优幽悠尤油由犹',
    yu: '于与鱼语育愈屿宇玉域御浴寓裕预余雨遇御豫',
    yuan: '元原远院园愿圆源员冤',
    yue: '月约跃越乐阅',
    yun: '云运允韵晕',
    za: '杂砸',
    zai: '在再载灾栽宰',
    zan: '暂赞攒',
    zang: '脏葬赃',
    zao: '早造遭燥糟',
    ze: '则责择泽',
    zei: '贼',
    zen: '怎',
    zeng: '增赠',
    zha: '扎炸渣眨栅',
    zhai: '债窄寨摘',
    zhan: '站战展占沾斩',
    zhang: '张长章掌帐障胀丈仗账',
    zhao: '找照朝招召兆',
    zhe: '这者浙遮折哲',
    zhen: '真针侦阵震珍镇枕斟',
    zheng: '正整政争征睁挣蒸症',
    zhi: '之知只治制智值指植质志致执纸职直置址止旨秩',
    zhong: '中种重终众忠钟衷',
    zhou: '周州宙粥皱洲',
    zhu: '住注主珠猪竹烛逐驻祝铸助著驻柱',
    zhua: '抓',
    zhuai: '拽',
    zhuan: '转专赚',
    zhuang: '装壮撞状桩',
    zhui: '追坠',
    zhun: '准',
    zhuo: '着桌捉琢',
    zi: '子自字资紫仔姿滋',
    zong: '总纵宗踪综',
    zou: '走奏揍',
    zu: '组足阻祖',
    zuan: '钻',
    zui: '最嘴醉',
    zun: '尊遵',
    zuo: '左做坐作'
};

const charToPinyin = {};

for (const [pinyin, chars] of Object.entries(pinyinData)) {
    for (const char of chars) {
        if (!charToPinyin[char]) {
            charToPinyin[char] = pinyin;
        }
    }
}

const PinyinPro = {
    pinyin: function(text, options = {}) {
        const { pattern = 'pinyin', toneType = 'none', type = 'array', v = true } = options;
        
        let result = [];
        
        // 处理字母输入的特殊情况
        if (/^[a-zA-Z]+$/.test(text)) {
            if (pattern === 'first') {
                // 对于纯字母输入，直接返回首字母（如果是单个字母）或原字符串
                if (text.length === 1) {
                    result.push(text.toLowerCase());
                } else {
                    result.push(text.toLowerCase());
                }
            } else {
                result.push(text.toLowerCase());
            }
            
            if (type === 'string') {
                return result.join('');
            }
            
            return result;
        }
        
        for (const char of text) {
            if (charToPinyin[char]) {
                let pinyin = charToPinyin[char];
                
                if (toneType === 'none') {
                    pinyin = pinyin.replace(/[1-5]/g, '');
                } else if (toneType === 'symbol') {
                    const toneMap = { '1': 'ā', '2': 'á', '3': 'ǎ', '4': 'à', '5': 'a' };
                    const tone = pinyin.match(/[1-5]/);
                    if (tone) {
                        const toneNum = tone[0];
                        const base = pinyin.replace(/[1-5]/g, '');
                        const toneChar = toneMap[toneNum];
                        if (toneChar) {
                            const vowels = ['a', 'e', 'i', 'o', 'u', 'v'];
                            for (const v of vowels) {
                                if (base.includes(v)) {
                                    pinyin = base.replace(v, toneChar);
                                    break;
                                }
                            }
                        }
                    }
                }
                
                if (v) {
                    pinyin = pinyin.replace(/v/g, 'v');
                }
                
                if (pattern === 'first') {
                    pinyin = pinyin.charAt(0);
                }
                
                result.push(pinyin);
            } else {
                result.push(char);
            }
        }
        
        if (type === 'string') {
            return result.join('');
        }
        
        return result;
    },
    
    match: function(text, keyword, options = {}) {
        const { precision = 'start' } = options;
        
        const textPinyin = this.pinyin(text, { pattern: 'pinyin', toneType: 'none', type: 'array' });
        const textFirst = this.pinyin(text, { pattern: 'first', toneType: 'none', type: 'array' });
        const keywordPinyin = this.pinyin(keyword, { pattern: 'pinyin', toneType: 'none', type: 'array' });
        const keywordFirst = this.pinyin(keyword, { pattern: 'first', toneType: 'none', type: 'array' });
        
        const textPinyinStr = textPinyin.join('');
        const textFirstStr = textFirst.join('');
        const keywordPinyinStr = keywordPinyin.join('');
        const keywordFirstStr = keywordFirst.join('');
        
        if (precision === 'start') {
            if (textPinyinStr.startsWith(keywordPinyinStr)) return true;
            if (textFirstStr.startsWith(keywordFirstStr)) return true;
            if (text.toLowerCase().startsWith(keyword.toLowerCase())) return true;
        } else if (precision === 'anywhere') {
            if (textPinyinStr.includes(keywordPinyinStr)) return true;
            if (textFirstStr.includes(keywordFirstStr)) return true;
            if (text.toLowerCase().includes(keyword.toLowerCase())) return true;
        } else if (precision === 'fuzzy') {
            if (this.fuzzyMatch(textPinyinStr, keywordPinyinStr)) return true;
            if (this.fuzzyMatch(textFirstStr, keywordFirstStr)) return true;
            if (this.fuzzyMatch(text.toLowerCase(), keyword.toLowerCase())) return true;
        }
        
        return false;
    },
    
    fuzzyMatch: function(text, pattern) {
        if (!text || !pattern) return false;
        
        let textIndex = 0;
        let patternIndex = 0;
        
        while (textIndex < text.length && patternIndex < pattern.length) {
            if (text[textIndex].toLowerCase() === pattern[patternIndex].toLowerCase()) {
                patternIndex++;
            }
            textIndex++;
        }
        
        return patternIndex === pattern.length;
    },
    
    matchSimple: function(text, keyword) {
        const textPinyin = this.pinyin(text, { pattern: 'pinyin', toneType: 'none', type: 'array' });
        const textFirst = this.pinyin(text, { pattern: 'first', toneType: 'none', type: 'array' });
        const keywordPinyin = this.pinyin(keyword, { pattern: 'pinyin', toneType: 'none', type: 'array' });
        const keywordFirst = this.pinyin(keyword, { pattern: 'first', toneType: 'none', type: 'array' });
        
        const textPinyinStr = textPinyin.join('');
        const textFirstStr = textFirst.join('');
        const keywordPinyinStr = keywordPinyin.join('');
        const keywordFirstStr = keywordFirst.join('');
        
        if (textPinyinStr.includes(keywordPinyinStr)) return true;
        if (textFirstStr.includes(keywordFirstStr)) return true;
        if (text.toLowerCase().includes(keyword.toLowerCase())) return true;
        
        return false;
    },
    
    matchFirstLetter: function(text, keyword) {
        const textFirst = this.pinyin(text, { pattern: 'first', toneType: 'none', type: 'string' });
        const keywordFirst = this.pinyin(keyword, { pattern: 'first', toneType: 'none', type: 'string' });
        
        return textFirst.includes(keywordFirst);
    },
    
    getScore: function(text, keyword) {
        const textLower = text.toLowerCase();
        const keywordLower = keyword.toLowerCase();
        
        const textPinyin = this.pinyin(text, { pattern: 'pinyin', toneType: 'none', type: 'string' });
        const textFirst = this.pinyin(text, { pattern: 'first', toneType: 'none', type: 'string' });
        const keywordPinyin = this.pinyin(keyword, { pattern: 'pinyin', toneType: 'none', type: 'string' });
        const keywordFirst = this.pinyin(keyword, { pattern: 'first', toneType: 'none', type: 'string' });
        
        let score = 0;
        
        if (textLower === keywordLower) score += 100;
        else if (textLower.startsWith(keywordLower)) score += 80;
        else if (textLower.includes(keywordLower)) score += 60;
        
        if (textPinyin === keywordPinyin) score += 90;
        else if (textPinyin.startsWith(keywordPinyin)) score += 70;
        else if (textPinyin.includes(keywordPinyin)) score += 50;
        
        if (textFirst === keywordFirst) score += 85;
        else if (textFirst.startsWith(keywordFirst)) score += 65;
        else if (textFirst.includes(keywordFirst)) score += 45;
        
        return score;
    }
};

export default PinyinPro;