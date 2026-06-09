# Checklist

- [x] flightShuttleBuilder 使用 animation.value 控制 opacity 过渡
- [x] Hero child 为纯 CachedNetworkImage，无 NetworkImgLayer 包装
- [x] Hero 外部 ClipRRect 处理圆角，而非内部
- [x] GameCard 点击时 Hero tag 坐标不受 AnimatedScale 中间态影响
- [x] GameCard Hero 路径无 GlassCard（BackdropFilter）包裹
- [x] 详情页返回前 scroll 归零，Hero 飞回位置准确
- [x] 首页卡片到详情页 Hero 飞行无卡顿/无闪烁/无定位偏移/无大小变形
- [x] 详情页返回首页 Hero 飞行无卡顿/无闪烁/无定位偏移/无大小变形
- [x] flutter build web 编译通过（项目无 Windows 桌面配置，以 web 编译验证）
