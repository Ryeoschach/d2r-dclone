const regionNames = { Asia: "亚区", Americas: "美区", Europe: "欧区" };
const progressNames = {
  1: "恐怖凝视着庇护之地",
  2: "恐怖正逼近庇护之地",
  3: "恐怖开始在庇护之地形成",
  4: "恐怖蔓延至庇护之地",
  5: "恐怖即将在庇护之地释放",
  6: "迪亚波罗已入侵庇护之地"
};
const modes = [
  { ladder: false, hardcore: false, label: "非天梯 SC" },
  { ladder: false, hardcore: true, label: "非天梯 HC" },
  { ladder: true, hardcore: false, label: "天梯 SC" },
  { ladder: true, hardcore: true, label: "天梯 HC" }
];
const regions = ["Asia", "Americas", "Europe"];
let minProgress = 1;
let autoRefreshTimer = null;
let terrorCountdownTimer = null;
let syncAgeTimer = null;
const storedAutoRefresh = localStorage.getItem("dclone-auto-refresh-enabled");
let autoRefreshEnabled = storedAutoRefresh === null || storedAutoRefresh === "true";
let autoRefreshMinutes = Number(localStorage.getItem("dclone-auto-refresh-minutes")) || 1;

let currentLang = "zhCN";
try {
  const savedLang = localStorage.getItem("d2r-lang");
  if (savedLang === "zhCN" || savedLang === "zhTW" || savedLang === "enUS") currentLang = savedLang;
} catch (e) {}

const UI_I18N = {
  zhCN: {
    docTitle: "暗黑 2 重置版 · 庇护之地实时战报",
    heroTitle: "暗黑 2 重置版 · 庇护之地",
    heroSubtitle: "实时掌握恐怖地带异动与迪亚波罗克隆入侵进度 · 全 99 符文之语 · 词缀模拟 · 物品百科",
    settingsBtn: "⚙ 刷新设置",
    hudTzLabel: "当前恐怖地带",
    hudDcLabel: "地表暗黑最高进度",
    shortcutPrefix: "快捷:",
    shortcutTabs: "切页",
    shortcutSearch: "搜词条",
    tabTerror: "恐怖地带",
    tabDclone: "地表暗黑",
    tabRunewords: "符文之语/记事",
    tabAffixes: "物品词缀",
    tabItems: "物品资讯",
    tzModuleTitle: "恐怖地带监控",
    tzModuleMeta: "区域每 30 分钟切换 · 常见免疫与掉落速查",
    tzCurrentLabel: "当前恐怖区域",
    tzNextLabel: "下一阶段恐怖区域",
    dcModuleTitle: "地表暗黑进度",
    dcModuleMeta: "覆盖 2 DLC · 24 组服务器进度实时监控",
    dcFilterAll: "全部状态",
    dcFilter4: "4 阶以上",
    dcFilter5: "5 阶以上",
    dcLeg13: "1–3 平稳",
    dcLeg4: "4 警戒",
    dcLeg5: "5 临近",
    dcLeg6: "6 已触发",
    dcRefreshBtn: "刷新页面数据",
    rwModuleTitle: "符文之语 100% 记事与符文统计",
    afModuleTitle: "魔法 / 亮金 / 手工物品词缀范围与模拟",
    afModuleMeta: "蓝装极限 · 黄装多词缀 · 橙装固定配方与词缀模拟器",
    afSubRef: "词缀范围与配方速查",
    afSubSim: "物品词缀模拟器",
    itModuleTitle: "物品资讯百科（基础 / 蓝黄 / 绿装 / 暗金）",
    itModuleMeta: "参考 d2r.world · 适配 D2R 3.4 术士君临版本",
    itTabBase: "基础底材",
    itTabMagicRare: "蓝/黄极品",
    itTabSet: "绿色套装",
    itTabUnique: "暗金装备",
    itTabCube: "方块公式",
    itTabDrops: "掉率计算器",
    tabSkills: "技能模拟",
    skModuleTitle: "八大职业技能树与加点模拟器（含 3.4 新职业「术士 Warlock」）",
    skModuleMeta: "全 8 职业 240 技能 · 协同加成与法力/伤害实时演算 · 一键分享配装加点"
  },
  zhTW: {
    docTitle: "暗黑破壞神 2：獄火重生 · 庇護之地即時戰報",
    heroTitle: "暗黑 2 重製版 · 庇護之地",
    heroSubtitle: "即時掌握恐怖地帶異動與地表暗黑入侵進度 · 全 99 符文之語 · 詞綴模擬 · 物品百科",
    settingsBtn: "⚙ 重新整理設定",
    hudTzLabel: "目前恐怖地帶",
    hudDcLabel: "地表暗黑最高進度",
    shortcutPrefix: "快捷:",
    shortcutTabs: "切頁",
    shortcutSearch: "搜尋",
    tabTerror: "恐怖地帶",
    tabDclone: "地表暗黑",
    tabRunewords: "符文之語/記事",
    tabAffixes: "物品詞綴",
    tabItems: "物品資訊",
    tzModuleTitle: "恐怖地帶監控",
    tzModuleMeta: "區域每 30 分鐘切換 · 常見免疫與掉落速查",
    tzCurrentLabel: "目前恐怖區域",
    tzNextLabel: "下一階段恐怖區域",
    dcModuleTitle: "地表暗黑進度",
    dcModuleMeta: "涵蓋 2 DLC · 24 組伺服器進度即時監控",
    dcFilterAll: "全部狀態",
    dcFilter4: "4 階以上",
    dcFilter5: "5 階以上",
    dcLeg13: "1–3 平穩",
    dcLeg4: "4 警戒",
    dcLeg5: "5 臨近",
    dcLeg6: "6 已觸發",
    dcRefreshBtn: "重新整理頁面資料",
    rwModuleTitle: "符文之語 100% 記事與符文統計",
    afModuleTitle: "魔法 / 亮金 / 手工物品詞綴範圍與模擬",
    afModuleMeta: "藍裝極限 · 黃裝多詞綴 · 橙裝固定配方與詞綴模擬器",
    afSubRef: "詞綴範圍與配方速查",
    afSubSim: "物品詞綴模擬器",
    itModuleTitle: "物品資訊百科（基礎 / 藍黃 / 綠裝 / 暗金）",
    itModuleMeta: "參考 d2r.world · 適配 D2R 3.4 術士君臨版本",
    itTabBase: "基礎底材",
    itTabMagicRare: "藍/黃極品",
    itTabSet: "綠色套裝",
    itTabUnique: "暗金裝備",
    itTabCube: "方塊公式",
    itTabDrops: "掉率計算器",
    tabSkills: "技能模擬",
    skModuleTitle: "八大職業技能樹與配點模擬器（含 3.4 新職業「術士 Warlock」）",
    skModuleMeta: "全 8 職業 240 技能 · 協同加成與法力/傷害即時演算 · 一鍵分享配點"
  },
  enUS: {
    docTitle: "Diablo II: Resurrected · Sanctuary Live",
    heroTitle: "Diablo II: Resurrected · Sanctuary",
    heroSubtitle: "Live Terror Zones & Diablo Clone Tracker · 99 Runewords · Affix Simulator · Items DB",
    settingsBtn: "⚙ Settings",
    hudTzLabel: "Terror Zone",
    hudDcLabel: "Hottest DClone",
    shortcutPrefix: "Keys:",
    shortcutTabs: "Tabs",
    shortcutSearch: "Search",
    tabTerror: "Terror Zones",
    tabDclone: "Diablo Clone",
    tabRunewords: "Runewords",
    tabAffixes: "Item Affixes",
    tabItems: "Items DB",
    tzModuleTitle: "Terror Zone Tracker",
    tzModuleMeta: "Rotates every 30 min · Immunities & Tier Ratings",
    tzCurrentLabel: "Current Terror Zone",
    tzNextLabel: "Next Terror Zone",
    dcModuleTitle: "Diablo Clone Progress",
    dcModuleMeta: "2 Expansions · 24 Live Server Trackers",
    dcFilterAll: "All Stages",
    dcFilter4: "Stage 4+",
    dcFilter5: "Stage 5+",
    dcLeg13: "1–3 Calm",
    dcLeg4: "4 Alert",
    dcLeg5: "5 Imminent",
    dcLeg6: "6 Spawned",
    dcRefreshBtn: "Refresh Data",
    rwModuleTitle: "Runewords 100% Tracker & Rune Counter",
    afModuleTitle: "Magic / Rare / Crafted Affixes & Simulator",
    afModuleMeta: "Magic Caps · Rare Multi-Affix · Crafted Recipes & Simulator",
    afSubRef: "Affix Ranges & Recipes",
    afSubSim: "Affix Simulator",
    itModuleTitle: "Items Encyclopedia (Bases / Magic / Sets / Uniques)",
    itModuleMeta: "D2R 3.4 Reign of the Warlock · Official Stats & Icons",
    itTabBase: "Base Items",
    itTabMagicRare: "Magic & Rare",
    itTabSet: "Set Items",
    itTabUnique: "Uniques",
    itTabCube: "Cube Recipes",
    itTabDrops: "Drop Calc",
    tabSkills: "Skill Planner",
    skModuleTitle: "8-Class Skill Tree & Build Planner (incl. 3.4 Warlock)",
    skModuleMeta: "All 8 Classes & 240 Skills · Live Synergies, Mana & Damage · Shareable Build Links"
  }
};

const CN2TW_SRC = "㐷㐹㐽㑇㑈㑔㑩㓥㓰㔉㖊㖞㘎㚯㛀㛣㛤㟆㟥㡎㤘㤽㥪㧏㧐㧑㧟㧰㨫㭎㭏㭤㭴㱩㱮㲿㳔㳕㳠㳡㳽㴋㶉㶶㶽㺍㻅䀥䁖䂵䃅䅉䅟䇲䉤䌶䌷䌸䌹䌺䌻䌼䌽䌾䌿䍀䍁䍠䎬䏝䓓䓕䓖䓨䗖䙌䙓䜣䜤䜧䜩䝙䞍䞐䟢䥺䥽䥾䦂䦃䦅䦆䦶䦷䩄䯄䯅䲝䲟䲠䲡䲢䲣䴓䴔䴕䴖䴗䴘䴙䶮万与丑专业丛东丝丢两严丧个丰临为丽举么义乌乐乔习乡书买乱争于亏云亘亚产亩亲亵亸亿仅仆从仑仓仪们价众优伙会伛伞伟传伡伣伤伥伦伧伪伫体余佣佥侠侣侥侦侧侨侩侪侬侭俣俦俨俩俪俫俭债倾偬偻偾偿傤傥傧储傩儿兑兖党兰关兴兹养兽冁内冈册写军农冯冲决况冻净凄准凉减凑凛几凤凫凭凯凶击凿刍划刘则刚创删别刬刭刹刽刾刿剀剂剐剑剥剧劝办务劢动励劲劳势勋勚匀匦匮区医华协单卖占卢卤卧卫却卺厂厅历厉压厌厍厐厕厘厢厣厦厨厩厮县叁参叆叇双发变叙叠台叶号叹叽吁吃后吓吕吗吨听启吴呐呒呓呕呖呗员呙呛呜咏咙咛咝咤咨咸响哑哒哓哔哕哗哙哜哝哟唇唛唝唠唡唢唤啧啬啭啮啯啰啴啸喷喽喾嗫嗳嘘嘤嘱噜嚣团园囱围囵国图圆圣圹场坏块坚坛坜坝坞坟坠垄垅垆垒垦垩垫垭垯垱垲垴埘埙埚堑堕塆墙壮声壳壶壸处备复够头夸夹夺奁奂奋奖奥妆妇妈妩妪妫姗姹娄娅娆娇娈娱娲娴婳婴婵婶媪媭嫒嫔嫱嬷孙学孪宁宝实宠审宪宫宽宾寝对寻导寿将尔尘尝尧尴尸尽层屃屉届属屡屦屿岁岂岖岗岘岚岛岩岭岳岽岿峃峄峡峣峤峥峦峰崂崃崄崭嵘嵚嵝巅巩巯币帅师帏帐帘帜带帧帮帱帻帼幂干并广庄庆床庐庑库应庙庞废庼廪开异弃弑张弥弪弯弹强归当录彟彦彨彻征径徕忆忏忧忾怀态怂怃怄怅怆怜总怼怿恋恒恳恶恸恹恺恻恼恽悦悫悬悭悮悯惊惧惨惩惫惬惭惮惯愠愤愦愿慑慭懑懒懔戆戋戏戗战戬戯户扑托执扩扪扫扬扰抚抛抟抠抡抢护报担拟拢拣拥拦拧拨择挂挚挛挜挝挞挟挠挡挢挣挤挥挦捝捞损捡换捣据掳掴掷掸掺掼揽揾揿搀搁搂搄搅携摄摅摆摇摈摊撄撑撵撷撸撺擜擞攒敌敚敛敩数斋斓斗斩断无旧时旷旸昙昵昼昽显晋晒晓晔晕晖暂暧术朴机杀杂权杠条来杨杩杰极构枞枢枣枥枧枨枪枫枭柜柠柽栀栅标栈栉栊栋栌栎栏树栖栗样栾桠桡桢档桤桥桦桧桨桩桪梦梼梾梿检棁棂椁椝椟椠椢椤椫椭椮楼榄榅榇榈榉榝槚槛槟槠横樯樱橥橱橹橼檩欢欤欧歼殁殇残殒殓殚殡殴毁毂毕毙毡毵氇气氢氩氲汇汉汤汹沄沟没沣沤沥沦沧沨沩沪泞泪泶泷泸泺泻泼泽泾洁洒洼浃浅浆浇浈浉浊测浍济浏浐浑浒浓浔浕涂涌涚涛涝涞涟涠涡涢涣涤润涧涨涩淀渊渌渍渎渐渑渔渖渗温游湾湿溁溃溅溆溇滗滚滞滟滠满滢滤滥滦滨滩滪潆潇潋潍潜潴澛澜濑濒灏灭灯灵灶灾灿炀炉炖炜炝点炼炽烁烂烃烛烟烦烧烨烩烫烬热焕焖焘煴熏爱爷牍牦牵牺犊状犷犸犹狈狝狞独狭狮狯狰狱狲猃猎猕猡猪猫猬献獭玑玙玚玛玮环现玱玺珐珑珰珲琎琏琐琼瑶瑷瑸璎瓒瓮瓯电画畅畴疖疗疟疠疡疬疭疮疯疱疴痈痉痒痖痨痪痫痴瘅瘆瘗瘘瘪瘫瘾瘿癞癣癫皂皑皱皲盏盐监盖盗盘眍眦眬睁睐睑瞆瞒瞩矫矶矾矿砀码砖砗砚砜砺砻砾础硁硕硖硗硙硚确硵硷碍碛碜碱礼祃祎祢祯祷祸禀禄禅离秃秆种秘积称秽秾稆税稣稳穑穞穷窃窍窎窑窜窝窥窦窭竖竞笃笋笔笕笺笼笾筑筚筛筜筝筹筼签筿简箓箦箧箨箩箪箫篑篓篮篯篱簖籁籴类籼粜粝粤粪粮粽糁糇糍紧絷緼縆纟纠纡红纣纤纥约级纨纩纪纫纬纭纮纯纰纱纲纳纴纵纶纷纸纹纺纻纼纽纾线绀绁绂练组绅细织终绉绊绋绌绍绎经绐绑绒结绔绕绖绗绘给绚绛络绝绞统绠绡绢绣绤绥绦继绨绩绪绫绬续绮绯绰绱绲绳维绵绶绷绸绹绺绻综绽绾绿缀缁缂缃缄缅缆缇缈缉缊缋缌缍缎缏缐缑缒缓缔缕编缗缘缙缚缛缜缝缞缟缠缡缢缣缤缥缦缧缨缩缪缫缬缭缮缯缰缱缲缳缴缵罂网罗罚罢罴羁羟羡群翘翙翚耢耧耸耻聂聋职聍联聩聪肃肠肤肮肴肾肿胀胁胆胜胧胨胪胫胶脉脍脏脐脑脓脔脚脱脶脸腊腌腘腭腻腼腽腾膑膻臜舆舣舰舱舻艰艳艺节芈芗芜芦苁苇苈苋苌苍苎苏苧苹范茎茏茑茔茕茧荆荐荙荚荛荜荝荞荟荠荡荣荤荥荦荧荨荩荪荫荬荭荮药莅莱莲莳莴莶获莸莹莺莼萚萝萤营萦萧萨葱蒀蒇蒉蒋蒌蒏蓝蓟蓠蓣蓥蓦蔂蔷蔹蔺蔼蕰蕲蕴薮藓藴蘖虏虑虚虫虬虮虱虽虾虿蚀蚁蚂蚃蚕蚝蚬蛊蛎蛏蛮蛰蛱蛲蛳蛴蜕蜗蜡蝇蝈蝉蝎蝼蝾螀螨蟏衅衔补衬衮袄袅袆袜袭袯装裆裈裢裣裤裥褛褴襕见观觃规觅视觇览觉觊觋觌觍觎觏觐觑觞触觯訚詟誉誊讠计订讣认讥讦讧讨让讪讫讬训议讯记讱讲讳讴讵讶讷许讹论讻讼讽设访诀证诂诃评诅识诇诈诉诊诋诌词诎诏诐译诒诓诔试诖诗诘诙诚诛诜话诞诟诠诡询诣诤该详诧诨诩诪诫诬语诮误诰诱诲诳说诵诶请诸诹诺读诼诽课诿谀谁谂调谄谅谆谇谈谉谊谋谌谍谎谏谐谑谒谓谔谕谖谗谘谙谚谛谜谝谞谟谠谡谢谣谤谥谦谧谨谩谪谫谬谭谮谯谰谱谲谳谴谵谶豮贝贞负贠贡财责贤败账货质贩贪贫贬购贮贯贰贱贲贳贴贵贶贷贸费贺贻贼贽贾贿赀赁赂赃资赅赆赇赈赉赊赋赌赍赎赏赐赑赒赓赔赕赖赗赘赙赚赛赜赝赞赟赠赡赢赣赪赵赶趋趱趸跃跄跖跞践跶跷跸跹跻踌踪踬踯蹑蹒蹰蹿躏躜躯輼车轧轨轩轪轫转轭轮软轰轱轲轳轴轵轶轷轸轹轺轻轼载轾轿辀辁辂较辄辅辆辇辈辉辊辋辌辍辎辏辐辑辒输辔辕辖辗辘辙辚辞辟辩辫边辽达迁过迈运还这进远违连迟迩迳迹适选逊递逦逻遗遥邓邝邬邮邹邺邻郁郏郐郑郓郦郧郸酂酝酦酱酽酾酿醖采释里鉴銮錾钅钆钇针钉钊钋钌钍钎钏钐钑钒钓钔钕钖钗钘钙钚钛钜钝钞钟钠钡钢钣钤钥钦钧钨钩钪钫钬钭钮钯钰钱钲钳钴钵钶钷钸钹钺钻钼钽钾钿铀铁铂铃铄铅铆铇铈铉铊铋铌铍铎铏铐铑铒铓铔铕铖铗铘铙铚铛铜铝铞铟铠铡铢铣铤铥铦铧铨铩铪铫铬铭铮铯铰铱铲铳铴铵银铷铸铹铺铻铼铽链铿销锁锂锃锄锅锆锇锈锉锊锋锌锍锎锏锐锑锒锓锔锕锖锗锘错锚锛锜锝锞锟锠锡锢锣锤锥锦锧锨锩锪锫锬锭键锯锰锱锲锳锴锵锶锷锸锹锺锻锼锽锾锿镀镁镂镃镄镅镆镇镈镉镊镋镌镍镎镏镐镑镒镓镔镕镖镗镘镙镚镛镜镝镞镟镠镡镢镣镤镥镦镧镨镩镪镫镬镭镮镯镰镱镲镳镴镵镶长门闩闪闫闬闭问闯闰闱闲闳间闵闶闷闸闹闺闻闼闽闾闿阀阁阂阃阄阅阆阇阈阉阊阋阌阍阎阏阐阑阒阓阔阕阖阗阘阙阚阛队阳阴阵阶际陆陇陈陉陕陦陧陨险随隐隶隽难雇雏雠雳雾霁霉霡霭靓靔静靥鞑鞒鞯鞲韦韧韨韩韪韫韬韵页顶顷顸项顺须顼顽顾顿颀颁颂颃预颅领颇颈颉颊颋颌颍颎颏颐频颒颓颔颕颖颗题颙颚颛颜额颞颟颠颡颢颣颤颥颦颧风飏飐飑飒飓飔飕飖飗飘飙飚飞飨餍饣饤饥饦饧饨饩饪饫饬饭饮饯饰饱饲饳饴饵饶饷饸饹饺饻饼饽饾饿馀馁馂馃馄馅馆馇馈馉馊馋馌馍馎馏馐馑馒馓馔馕马驭驮驯驰驱驲驳驴驵驶驷驸驹驺驻驼驽驾驿骀骁骂骃骄骅骆骇骈骉骊骋验骍骎骏骐骑骒骓骔骕骖骗骘骙骚骛骜骝骞骟骠骡骢骣骤骥骦骧髅髋髌鬓鬶魇魉鱼鱽鱾鱿鲀鲁鲂鲃鲄鲅鲆鲇鲈鲉鲊鲋鲌鲍鲎鲏鲐鲑鲒鲓鲔鲕鲖鲗鲘鲙鲚鲛鲜鲝鲞鲟鲠鲡鲢鲣鲤鲥鲦鲧鲨鲩鲪鲫鲬鲭鲮鲯鲰鲱鲲鲳鲴鲵鲶鲷鲸鲹鲺鲻鲼鲽鲾鲿鳀鳁鳂鳃鳄鳅鳆鳇鳈鳉鳊鳋鳌鳍鳎鳏鳐鳑鳒鳓鳔鳕鳖鳗鳘鳙鳚鳛鳜鳝鳞鳟鳠鳡鳢鳣鳤鸟鸠鸡鸢鸣鸤鸥鸦鸧鸨鸩鸪鸫鸬鸭鸮鸯鸰鸱鸲鸳鸴鸵鸶鸷鸸鸹鸺鸻鸼鸽鸾鸿鹀鹁鹂鹃鹄鹅鹆鹇鹈鹉鹊鹋鹌鹍鹎鹏鹐鹑鹒鹓鹔鹕鹖鹗鹘鹙鹚鹛鹜鹝鹞鹟鹠鹡鹢鹣鹤鹥鹦鹧鹨鹩鹪鹫鹬鹭鹮鹯鹰鹱鹲鹳鹴鹾麦麸麹麺麽黄黉黡黩黪黾鼋鼌鼍鼹齐齑齿龀龁龂龃龄龅龆龇龈龉龊龋龌龙龚龛龟鿎鿏鿒鿔";
const CN2TW_DST = "傌㑶偑㑳倲㑯儸劏劃劚噚喎㘚㜄媰㜏孋㠏嵾幓㥮懤慺掆㩳撝擓擽㩜棡椲樢樫殰殨瀇濧灡澾濄瀰潚鸂燶煱獱璯䁻瞜碽磾稏穇筴籔䊷紬縳絅䋙䋚綐綵䋻䋹繿繸䍦䎱膞薵薳藭罃螮䙡襬訢鿁䜀讌貙䝼賰躎釾鏺䥱䥇鐯鐥钁䦛䦟靦騧䯀䱽鮣鰆鰌鰧䱷鳾鵁鴷鶄鶪鷉鸊龑萬與醜專業叢東絲丟兩嚴喪個豐臨爲麗舉麼義烏樂喬習鄉書買亂爭於虧雲亙亞產畝親褻嚲億僅僕從侖倉儀們價衆優夥會傴傘偉傳俥俔傷倀倫傖僞佇體餘傭僉俠侶僥偵側僑儈儕儂儘俁儔儼倆儷倈儉債傾傯僂僨償儎儻儐儲儺兒兌兗黨蘭關興茲養獸囅內岡冊寫軍農馮衝決況凍淨悽準涼減湊凜幾鳳鳧憑凱兇擊鑿芻劃劉則剛創刪別剗剄剎劊㓨劌剴劑剮劍剝劇勸辦務勱動勵勁勞勢勳勩勻匭匱區醫華協單賣佔盧滷臥衛卻巹廠廳歷厲壓厭厙龎廁釐廂厴廈廚廄廝縣叄參靉靆雙發變敘疊臺葉號嘆嘰籲喫後嚇呂嗎噸聽啓吳吶嘸囈嘔嚦唄員咼嗆嗚詠嚨嚀噝吒諮鹹響啞噠嘵嗶噦譁噲嚌噥喲脣嘜嗊嘮啢嗩喚嘖嗇囀齧嘓囉嘽嘯噴嘍嚳囁噯噓嚶囑嚕囂團園囪圍圇國圖圓聖壙場壞塊堅壇壢壩塢墳墜壟壠壚壘墾堊墊埡墶壋塏堖塒壎堝塹墮壪牆壯聲殼壺壼處備復夠頭誇夾奪奩奐奮獎奧妝婦媽嫵嫗嬀姍奼婁婭嬈嬌孌娛媧嫺嫿嬰嬋嬸媼嬃嬡嬪嬙嬤孫學孿寧寶實寵審憲宮寬賓寢對尋導壽將爾塵嘗堯尷屍盡層屓屜屆屬屢屨嶼歲豈嶇崗峴嵐島巖嶺嶽崬巋嶨嶧峽嶢嶠崢巒峯嶗崍嶮嶄嶸嶔嶁巔鞏巰幣帥師幃帳簾幟帶幀幫幬幘幗冪幹並廣莊慶牀廬廡庫應廟龐廢廎廩開異棄弒張彌弳彎彈強歸當錄彠彥彲徹徵徑徠憶懺憂愾懷態慫憮慪悵愴憐總懟懌戀恆懇惡慟懨愷惻惱惲悅愨懸慳悞憫驚懼慘懲憊愜慚憚慣慍憤憒願懾憖懣懶懍戇戔戲戧戰戩戱戶撲託執擴捫掃揚擾撫拋摶摳掄搶護報擔擬攏揀擁攔擰撥擇掛摯攣掗撾撻挾撓擋撟掙擠揮撏挩撈損撿換搗據擄摑擲撣摻摜攬搵撳攙擱摟揯攪攜攝攄擺搖擯攤攖撐攆擷擼攛㩵擻攢敵敓斂斆數齋斕鬥斬斷無舊時曠暘曇暱晝曨顯晉曬曉曄暈暉暫曖術樸機殺雜權槓條來楊榪傑極構樅樞棗櫪梘棖槍楓梟櫃檸檉梔柵標棧櫛櫳棟櫨櫟欄樹棲慄樣欒椏橈楨檔榿橋樺檜槳樁樳夢檮棶槤檢梲欞槨槼櫝槧槶欏樿橢槮樓欖榲櫬櫚櫸樧檟檻檳櫧橫檣櫻櫫櫥櫓櫞檁歡歟歐殲歿殤殘殞殮殫殯毆毀轂畢斃氈毿氌氣氫氬氳匯漢湯洶澐溝沒灃漚瀝淪滄渢潙滬濘淚澩瀧瀘濼瀉潑澤涇潔灑窪浹淺漿澆湞溮濁測澮濟瀏滻渾滸濃潯濜塗湧涗濤澇淶漣潿渦溳渙滌潤澗漲澀澱淵淥漬瀆漸澠漁瀋滲溫遊灣溼濚潰濺漵漊潷滾滯灩灄滿瀅濾濫灤濱灘澦瀠瀟瀲濰潛瀦瀂瀾瀨瀕灝滅燈靈竈災燦煬爐燉煒熗點煉熾爍爛烴燭煙煩燒燁燴燙燼熱煥燜燾熅燻愛爺牘犛牽犧犢狀獷獁猶狽獮獰獨狹獅獪猙獄猻獫獵獼玀豬貓蝟獻獺璣璵瑒瑪瑋環現瑲璽琺瓏璫琿璡璉瑣瓊瑤璦璸瓔瓚甕甌電畫暢疇癤療瘧癘瘍癧瘲瘡瘋皰痾癰痙癢瘂癆瘓癇癡癉瘮瘞瘻癟癱癮癭癩癬癲皁皚皺皸盞鹽監蓋盜盤瞘眥矓睜睞瞼瞶瞞矚矯磯礬礦碭碼磚硨硯碸礪礱礫礎硜碩硤磽磑礄確磠礆礙磧磣鹼禮禡禕禰禎禱禍稟祿禪離禿稈種祕積稱穢穠穭稅穌穩穡穭窮竊竅窵窯竄窩窺竇窶豎競篤筍筆筧箋籠籩築篳篩簹箏籌篔籤篠簡籙簀篋籜籮簞簫簣簍籃籛籬籪籟糴類秈糶糲粵糞糧糉糝餱餈緊縶縕緪糹糾紆紅紂纖紇約級紈纊紀紉緯紜紘純紕紗綱納紝縱綸紛紙紋紡紵紖紐紓線紺紲紱練組紳細織終縐絆紼絀紹繹經紿綁絨結絝繞絰絎繪給絢絳絡絕絞統綆綃絹繡綌綏絛繼綈績緒綾緓續綺緋綽鞝緄繩維綿綬繃綢綯綹綣綜綻綰綠綴緇緙緗緘緬纜緹緲緝縕繢緦綞緞緶線緱縋緩締縷編緡緣縉縛縟縝縫縗縞纏縭縊縑繽縹縵縲纓縮繆繅纈繚繕繒繮繾繰繯繳纘罌網羅罰罷羆羈羥羨羣翹翽翬耮耬聳恥聶聾職聹聯聵聰肅腸膚骯餚腎腫脹脅膽勝朧腖臚脛膠脈膾髒臍腦膿臠腳脫腡臉臘醃膕齶膩靦膃騰臏羶臢輿艤艦艙艫艱豔藝節羋薌蕪蘆蓯葦藶莧萇蒼苧蘇薴蘋範莖蘢蔦塋煢繭荊薦薘莢蕘蓽萴蕎薈薺蕩榮葷滎犖熒蕁藎蓀蔭蕒葒葤藥蒞萊蓮蒔萵薟獲蕕瑩鶯蓴蘀蘿螢營縈蕭薩蔥蒕蕆蕢蔣蔞醟藍薊蘺蕷鎣驀虆薔蘞藺藹薀蘄蘊藪蘚蘊櫱虜慮虛蟲虯蟣蝨雖蝦蠆蝕蟻螞蠁蠶蠔蜆蠱蠣蟶蠻蟄蛺蟯螄蠐蛻蝸蠟蠅蟈蟬蠍螻蠑螿蟎蠨釁銜補襯袞襖嫋褘襪襲襏裝襠褌褳襝褲襉褸襤襴見觀覎規覓視覘覽覺覬覡覿覥覦覯覲覷觴觸觶誾讋譽謄訁計訂訃認譏訐訌討讓訕訖託訓議訊記訒講諱謳詎訝訥許訛論訩訟諷設訪訣證詁訶評詛識詗詐訴診詆謅詞詘詔詖譯詒誆誄試詿詩詰詼誠誅詵話誕詬詮詭詢詣諍該詳詫諢詡譸誡誣語誚誤誥誘誨誑說誦誒請諸諏諾讀諑誹課諉諛誰諗調諂諒諄誶談讅誼謀諶諜謊諫諧謔謁謂諤諭諼讒諮諳諺諦謎諞諝謨讜謖謝謠謗諡謙謐謹謾謫譾謬譚譖譙讕譜譎讞譴譫讖豶貝貞負貟貢財責賢敗賬貨質販貪貧貶購貯貫貳賤賁貰貼貴貺貸貿費賀貽賊贄賈賄貲賃賂贓資賅贐賕賑賚賒賦賭齎贖賞賜贔賙賡賠賧賴賵贅賻賺賽賾贗贊贇贈贍贏贛赬趙趕趨趲躉躍蹌蹠躒踐躂蹺蹕躚躋躊蹤躓躑躡蹣躕躥躪躦軀轀車軋軌軒軑軔轉軛輪軟轟軲軻轤軸軹軼軤軫轢軺輕軾載輊轎輈輇輅較輒輔輛輦輩輝輥輞輬輟輜輳輻輯轀輸轡轅轄輾轆轍轔辭闢辯辮邊遼達遷過邁運還這進遠違連遲邇逕跡適選遜遞邐邏遺遙鄧鄺鄔郵鄒鄴鄰鬱郟鄶鄭鄆酈鄖鄲酇醞醱醬釅釃釀醞採釋裏鑑鑾鏨釒釓釔針釘釗釙釕釷釺釧釤鈒釩釣鍆釹鍚釵鈃鈣鈈鈦鉅鈍鈔鍾鈉鋇鋼鈑鈐鑰欽鈞鎢鉤鈧鈁鈥鈄鈕鈀鈺錢鉦鉗鈷鉢鈳鉕鈽鈸鉞鑽鉬鉭鉀鈿鈾鐵鉑鈴鑠鉛鉚鉋鈰鉉鉈鉍鈮鈹鐸鉶銬銠鉺鋩錏銪鋮鋏鋣鐃銍鐺銅鋁銱銦鎧鍘銖銑鋌銩銛鏵銓鎩鉿銚鉻銘錚銫鉸銥鏟銃鐋銨銀銣鑄鐒鋪鋙錸鋱鏈鏗銷鎖鋰鋥鋤鍋鋯鋨鏽銼鋝鋒鋅鋶鐦鐧銳銻鋃鋟鋦錒錆鍺鍩錯錨錛錡鍀錁錕錩錫錮鑼錘錐錦鑕鍁錈鍃錇錟錠鍵鋸錳錙鍥鍈鍇鏘鍶鍔鍤鍬鍾鍛鎪鍠鍰鎄鍍鎂鏤鎡鐨鎇鏌鎮鎛鎘鑷钂鐫鎳鎿鎦鎬鎊鎰鎵鑌鎔鏢鏜鏝鏍鏰鏞鏡鏑鏃鏇鏐鐔钁鐐鏷鑥鐓鑭鐠鑹鏹鐙鑊鐳鐶鐲鐮鐿鑔鑣鑞鑱鑲長門閂閃閆閈閉問闖閏闈閒閎間閔閌悶閘鬧閨聞闥閩閭闓閥閣閡閫鬮閱閬闍閾閹閶鬩閿閽閻閼闡闌闃闠闊闋闔闐闒闕闞闤隊陽陰陣階際陸隴陳陘陝隯隉隕險隨隱隸雋難僱雛讎靂霧霽黴霢靄靚靝靜靨韃鞽韉韝韋韌韍韓韙韞韜韻頁頂頃頇項順須頊頑顧頓頎頒頌頏預顱領頗頸頡頰頲頜潁熲頦頤頻頮頹頷頴穎顆題顒顎顓顏額顳顢顛顙顥纇顫顬顰顴風颺颭颮颯颶颸颼颻飀飄飆飈飛饗饜飠飣飢飥餳飩餼飪飫飭飯飲餞飾飽飼飿飴餌饒餉餄餎餃餏餅餑餖餓餘餒餕餜餛餡館餷饋餶餿饞饁饃餺餾饈饉饅饊饌饢馬馭馱馴馳驅馹駁驢駔駛駟駙駒騶駐駝駑駕驛駘驍罵駰驕驊駱駭駢驫驪騁驗騂駸駿騏騎騍騅騌驌驂騙騭騤騷騖驁騮騫騸驃騾驄驏驟驥驦驤髏髖髕鬢鬹魘魎魚魛魢魷魨魯魴䰾魺鮁鮃鮎鱸鮋鮓鮒鮊鮑鱟鮍鮐鮭鮚鮳鮪鮞鮦鰂鮜鱠鱭鮫鮮鮺鯗鱘鯁鱺鰱鰹鯉鰣鰷鯀鯊鯇鮶鯽鯒鯖鯪鯕鯫鯡鯤鯧鯝鯢鯰鯛鯨鰺鯴鯔鱝鰈鰏鱨鯷鰮鰃鰓鱷鰍鰒鰉鰁鱂鯿鰠鰲鰭鰨鰥鰩鰟鰜鰳鰾鱈鱉鰻鰵鱅䲁鰼鱖鱔鱗鱒鱯鱤鱧鱣䲘鳥鳩雞鳶鳴鳲鷗鴉鶬鴇鴆鴣鶇鸕鴨鴞鴦鴒鴟鴝鴛鷽鴕鷥鷙鴯鴰鵂鴴鵃鴿鸞鴻鵐鵓鸝鵑鵠鵝鵒鷳鵜鵡鵲鶓鵪鵾鵯鵬鵮鶉鶊鵷鷫鶘鶡鶚鶻鶖鷀鶥鶩鷊鷂鶲鶹鶺鷁鶼鶴鷖鸚鷓鷚鷯鷦鷲鷸鷺䴉鸇鷹鸌鸏鸛鸘鹺麥麩麴麪麼黃黌黶黷黲黽黿鼂鼉鼴齊齏齒齔齕齗齟齡齙齠齜齦齬齪齲齷龍龔龕龜䃮䥑鿓鎶";
const TW_PHRASE_PAIRS = [["更快速跑步/步行","移動速度"],["更快速打击回复","打擊恢復"],["#24 伊司特","#24 伊司特"],["#26 伐克斯","#26 伐克斯"],["神秘的奶牛关","秘密乳牛關"],["更快速格挡率","格擋速度"],["#10 图尔","#10 書爾"],["#11 安姆","#11 安姆"],["#12 索尔","#12 索爾"],["#13 沙伊","#13 夏"],["#14 多尔","#14 多爾"],["#15 海尔","#15 海爾"],["#16 艾欧","#16 埃歐"],["#17 卢姆","#17 盧姆"],["#19 法尔","#19 法爾"],["#20 兰姆","#20 藍姆"],["#21 普尔","#21 普爾"],["#22 乌姆","#22 烏姆"],["#23 玛尔","#23 馬爾"],["#25 古尔","#25 古爾"],["#27 欧姆","#27 歐姆"],["#31 扎哈","#31 喬"],["#32 查姆","#32 查姆"],["#33 佐德","#33 薩德"],["秘密奶牛关","秘密乳牛關"],["统治者大盾","君主盾"],["更快速施法","施法速度"],["压碎性打击","壓碎打擊"],["#1 艾尔","#1 艾爾"],["#2 艾德","#2 艾德"],["#3 提尔","#3 特爾"],["#4 奈夫","#4 那夫"],["#5 艾斯","#5 愛斯"],["#6 伊司","#6 伊司"],["#7 塔尔","#7 塔爾"],["#8 拉尔","#8 拉爾"],["#9 欧特","#9 歐特"],["#18 科","#18 科"],["#28 罗","#28 羅"],["#29 瑟","#29 瑟"],["#30 贝","#30 貝"],["谐角之冠","諧角之冠"],["吉永之脸","吉永之臉"],["塔·拉夏","塔拉夏"],["压碎打击","壓碎打擊"],["双倍打击","致命攻擊"],["致命打击","致命攻擊"],["撕裂伤口","撕開傷口"],["奶牛关","乳牛關"],["普通牛","普通牛關"],["重置版","重製版"],["统盾","君主盾"],["刷新","重新整理"],["设置","設定"],["搜索","搜尋"],["保存","儲存"],["加载","載入"],["默认","預設"]];
const EN_PHRASE_PAIRS = [["地狱恐怖地带掉落潜能(Latent)版，需在盒中用完美黄宝石 + #19 法尔 + 南部世界石碎片升级为焕新(Renewed)版；与无限/格里芬之眼/雷击联动极佳","Latent version drops in Hell Terror Zones; Cube with Perfect Topaz + #19 Fal + Southern Worldstone Shard for Renewed version; pairs with Infinity / Griffon's / Thunderstroke"],["地狱恐怖地带掉落潜能版，盒中用完美紫宝石 + #21 普尔 + 北部世界石碎片升级为焕新版；破物免后可与衰老(死神的丧钟)/伤害加深(圣甲虫)联动进一步压低物抗","Latent version drops in Hell Terror Zones; Cube with Perfect Amethyst + #21 Pul + Northern Worldstone Shard for Renewed version; pairs with Decrepify (Reaper's Toll) / Amplify Damage"],["地狱恐怖地带掉落潜能版，盒中用完美蓝宝石 + #17 卢姆 + 东部世界石碎片升级为焕新版；与冰支配(Cold Mastery)/夜翼面纱/死亡深度联动极佳","Latent version drops in Hell Terror Zones; Cube with Perfect Sapphire + #17 Lum + Eastern Worldstone Shard for Renewed version; pairs with Cold Mastery / Nightwing's / Death's Fathom"],["地狱恐怖地带掉落潜能版，盒中用完美绿宝石 + #18 科 + 西部世界石碎片升级为焕新版；与死亡之网(Death's Web)/塔格奥三件套联动极佳","Latent version drops in Hell Terror Zones; Cube with Perfect Emerald + #18 Ko + Western Worldstone Shard for Renewed version; pairs with Death's Web / Trang-Oul 3pc"],["地狱恐怖地带掉落潜能版，盒中需完美钻石 + #23 玛尔 + 南/深/北三枚世界石碎片升级为焕新版；适合祝福锤骑、骨灵死灵与混沌术士","Latent version drops in Hell Terror Zones; Cube with Perfect Diamond + #23 Mal + South/Deep/North Worldstone Shards for Renewed version; great for Hammerdin, Bone Necro & Chaos Warlock"],["地狱恐怖地带掉落潜能版，盒中用完美红宝石 + #16 艾欧 + 深层世界石碎片升级为焕新版；与凤凰盾/闪烁火焰/掠鸦之风联动极佳","Latent version drops in Hell Terror Zones; Cube with Perfect Ruby + #16 Io + Deep Worldstone Shard for Renewed version; pairs with Phoenix / Flickering Flame / Ravenlore"],["打钱野蛮人与 MF 副手神器，双孔常镶嵌 2 个 #24 伊司特 堆叠高达 150%+ MF 或 #20 兰姆 堆金币","Top Gold Find & MF off-hand; 2 sockets often filled with 2x #24 Ist (150%+ MF) or 2x #20 Lem (GF)"],["TC87 狂战士斧，自带极高攻速与 66% 致命打击，无形(ETH)镶嵌 #33 佐德 为 PvP 狂热/旋风顶级神器","TC87 Berserker Axe with 40% IAS & 66% Deadly Strike; Ethereal socketed with #33 Zod is a top PvP Zeal/WW weapon"],["破魔(黑裂): 完美钻石 + #23 玛尔 + 南/深/北三枚碎片（焕新版会随机新增元素/技能/降抗等强力词缀）","Black Cleft (Magic): Perfect Diamond + #23 Mal + South/Deep/North Shards (Renewed adds bonus affixes)"],["限装备 1 颗，需求 75 级，共享 +3–5% 经验 / +15–35% MF / +25–50% EG","Max 1 equipped, Req Lvl 75, shared +3–5% Exp / +15–35% MF / +25–50% EG"],["用 6 颗完美骷髅重铸黄权冠（权冠 ilvl 虽降但 magic_lvl=18 仍能出 +2 技能）","Reroll Rare Diadem with 6 Perfect Skulls (magic_lvl=18 always allows +2 Skills regardless of ilvl)"],["武器升精华: #17 卢姆 + #21 普尔 + 完美绿宝石（如升级海蛇皮甲、泰坦、蚀肉骑士）","Weapon Exceptional → Elite: #17 Lum + #21 Pul + Perfect Emerald (e.g. Vipermagi, Titan's, Gore Rider)"],["潜能破免板 + 对应完美宝石 + 对应符文 + 世界石碎片(Worldstone Shard)","Latent Sunder Charm + Perfect Gem + Rune + Worldstone Shard"],["最后击杀科力克(Korlic): 护卫者之霜(冰伤)/之石(50% ED/-10%敌物抗)","Last Kill Korlic: Protector's Frost (Cold) / Protector's Stone (50% ED / -10% Enemy Phys Res)"],["注意：超强/有ED或耐久加成的底材不能用方块打孔，需找 A5 拉祖克直接打满孔","Note: Superior bases (with ED/Durability) cannot be Cube-socketed; use Act 5 Larzuk for max sockets"],["挑战巨像先祖(Colossal Ancients) — 最后击杀决定掉落池","Defeat Colossal Ancients — Last Boss Killed Determines Drop Pool"],["可用方块 #18 科 + #20 兰姆 + 完美钻石 升级为恶魔头盖骨面具","Can be upgraded to Demonhead via Cube (#18 Ko + #20 Lem + Perfect Diamond)"],["洗 91+ 级巴尔/TZ 超大护身符 (GC) 出 45 生命技能板","Reroll ilvl 91+ Baal/TZ Grand Charms (GC) for +45 Life Skillers"],["最后击杀马道克(Madawc): 守护者之雷(电伤)/之光(魔伤)","Last Kill Madawc: Guardian's Thunder (Light) / Guardian's Light (Magic)"],["最后击杀塔力克(Talic): 守御者之火(火伤)/之胆(毒伤)","Last Kill Talic: Defender's Fire (Fire) / Defender's Bile (Poison)"],["5 孔 CTA / 野兽、6 孔 6 颗 #24 伊司特 剑替代","5os CTA / Beast, or 6os 6x #24 Ist MF/GF alternative to Crystal Sword"],["破电(天堂之裂): 完美黄宝石 + #19 法尔 + 南部碎片","Crack of the Heavens (Light): Perfect Topaz + #19 Fal + Southern Shard"],["破火(火焰裂隙): 完美红宝石 + #16 艾欧 + 深层碎片","Flame Rift (Fire): Perfect Ruby + #16 Io + Deep Shard"],["破冰(寒冰裂隙): 完美蓝宝石 + #17 卢姆 + 东部碎片","Cold Rupture (Cold): Perfect Sapphire + #17 Lum + Eastern Shard"],["破免护身符升级（潜能 Latent → 焕新 Renewed）","Upgrade Sunder Charms (Latent → Renewed)"],["武器升精华: #19 法尔 + #22 乌姆 + 完美蓝宝石","Rare Weapon Exceptional → Elite: #19 Fal + #22 Um + Perfect Sapphire"],["破毒(腐朽裂隙): 完美绿宝石 + #18 科 + 西部碎片","Rotting Fissure (Poison): Perfect Emerald + #18 Ko + Western Shard"],["武器升扩展: #8 拉尔 + #12 索尔 + 完美绿宝石","Weapon Normal → Exceptional: #8 Ral + #12 Sol + Perfect Emerald"],["防具升扩展: #8 拉尔 + #10 图尔 + 完美紫宝石","Rare Armor Normal → Exceptional: #8 Ral + #10 Thul + Perfect Amethyst"],["防具升精华: #18 科 + #21 普尔 + 完美紫宝石","Rare Armor Exceptional → Elite: #18 Ko + #21 Pul + Perfect Amethyst"],["武器升扩展: #9 欧特 + #11 安姆 + 完美蓝宝石","Rare Weapon Normal → Exceptional: #9 Ort + #11 Amn + Perfect Sapphire"],["破物(裂骨): 完美紫宝石 + #21 普尔 + 北部碎片","Bone Break (Physical): Perfect Amethyst + #21 Pul + Northern Shard"],["防具升扩展: #7 塔尔 + #13 沙伊 + 完美钻石","Armor Normal → Exceptional: #7 Tal + #13 Shael + Perfect Diamond"],["防具升精华: #18 科 + #20 兰姆 + 完美钻石","Armor Exceptional → Elite: #18 Ko + #20 Lem + Perfect Diamond"],["盔甲: #7 塔尔 + #10 图尔 + 完美黄宝石","Armor: #7 Tal + #10 Thul + Perfect Topaz"],["盾牌: #7 塔尔 + #11 安姆 + 完美红宝石","Shield: #7 Tal + #11 Amn + Perfect Ruby"],["武器: #8 拉尔 + #11 安姆 + 完美紫宝石","Weapon: #8 Ral + #11 Amn + Perfect Amethyst"],["头盔: #8 拉尔 + #10 图尔 + 完美蓝宝石","Helm: #8 Ral + #10 Thul + Perfect Sapphire"],["武器回耐久+满充能: #9 欧特 + 任意碎裂宝石","Repair Weapon + Recharge Skills: #9 Ort + Any Chipped Gem"],["防具回耐久+满充能: #8 拉尔 + 任意裂开宝石","Repair Armor + Recharge Skills: #8 Ral + Any Flawed Gem"],["珠宝匠之巨鲸权冠 / 3技能 20FCR 头环","Jeweler's Diadem of the Whale / +3 Tree 20 FCR"],["被击中时 15% 几率施放等级 15 剧毒新星","15% Chance to cast Level 15 Poison Nova when struck"],["蓝色护身符(或任意权冠) + 3 颗完美宝石","Magic Charm (or Rare Diadem) + 3 Perfect Gems (or 6 Perfect Skulls)"],["非无形武器/防具 + 符文 (+ 碎裂宝石)","Non-Ethereal Weapon/Armor + Rune (+ Chipped/Flawed Gem)"],["被击中时 15% 几率施放等级 28 暴风雪","15% Chance to cast Level 28 Blizzard when struck"],["被击中时 1% 几率施放等级 25 气旋护甲","10% Chance to cast Level 25 Cyclone Armor when struck"],["45 生命技能板 / 3/20/20 小符","Skiller +45 Life GC / 3 Max 20 AR 20 Life SC"],["尼拉塞克神殿、痛苦之厅、悲痛之厅与沃特之厅","Nihlathak's Temple, Halls of Anguish, Halls of Pain, and Halls of Vaught"],["白色防具/武器 + 对应符文 + 完美宝石","Normal (White) Armor/Weapon + Runes + Perfect Gem"],["被击中时 25% 几率施放等级 1 传送术","25% Chance to cast Level 1 Teleport when struck"],["击中时 20% 几率施放等级 14 闪电术","20% Chance to cast Level 14 Lightning on striking"],["击中时 10% 几率施放等级 16 闪电术","10% Chance to cast Level 16 Lightning on striking"],["被击中时 5% 几率施放等级 7 天堂之拳","5% Chance to cast Level 7 Fist of the Heavens when struck"],["红白猪 (40 ED / 15 IAS)","Ruby Jewel of Fervor"],["巨像先祖暗金珠宝掉落规则（术士 DLC）","Colossal Ancients Unique Jewels Drop Rules (Warlock DLC)"],["被击中时 5% 几率施放等级 10 骨灵","5% Chance to cast Level 10 Bone Spirit when struck"],["被击中时 10% 几率施放等级 2 骨牢","10% Chance to cast Level 2 Bone Prison when struck"],["被击中时 15% 几率施放等级 1 恐惧","15% Chance to cast Level 1 Terror when struck"],["被击中时 15% 几率施放等级 1 衰老","15% Chance to cast Level 1 Decrepify when struck"],["被击中时 1% 几率施放等级 25 骨甲","10% Chance to cast Level 25 Bone Armor when struck"],["被击中时 1% 几率施放等级 15 消隐","10% Chance to cast Level 15 Fade when struck"],["暗金防具/武器 + 符文 + 完美宝石","Unique Armor/Weapon + Runes + Perfect Gem"],["亮金防具/武器 + 符文 + 完美宝石","Rare Armor/Weapon + Runes + Perfect Gem"],["施法者戒指（#11 安姆 + 完美紫）","Caster Ring (#11 Amn + Perfect Amethyst)"],["施法者鞋子（#10 图尔 + 完美紫）","Caster Boots (#10 Thul + Perfect Amethyst)"],["+3 标枪 / 20 IAS 蓝手套","Lancer's Gloves of Alacrity"],["世界之石要塞、毁灭王座与世界之石大殿","Worldstone Keep, Throne of Destruction, and Worldstone Chamber"],["被动 - 你的攻击有几率造成双倍伤害","passive - your attacks have a chance to do double damage"],["被动 - 提高使用剑和匕首战斗的技巧","passive - improves swords and daggers fighting skill"],["1次充能 - 陨石伤害: %d-%d","Charge 1 - Meteor Damage: %d-%d"],["1次充能 - 闪电伤害: %d-%d","Charge 1 - Lightning Damage: %d-%d"],["1次充能 - 火焰伤害: %d-%d","Charge 1 - Fire Damage: %d-%d"],["2次充能 - 火焰伤害范围: %d码","Charge 2 - Fire Damage Radius: %d yards"],["1次充能 - 冰霜伤害: %d-%d","Charge 1 - Cold Damage: %d-%d"],["2次充能 - 冰霜伤害范围: %d码","Charge 2 - Cold Damage Radius: %d yards"],["1次充能 - 生命偷取: %+d%%","Charge 1 - Life Steal: %+d%%"],["最大火焰抗性: +%d%% (主动)","Maximum Fire Resist: +%d%% (Active)"],["最大火焰抗性: +%d%% (被动)","Maximum Fire Resist: +%d%% (Passive)"],["最大冰霜抗性: +%d%% (主动)","Maximum Cold Resist: +%d%% (Active)"],["最大冰霜抗性: +%d%% (被动)","Maximum Cold Resist: +%d%% (Passive)"],["最大闪电抗性: +%d%% (主动)","Maximum Lightning Resist: +%d%% (Active)"],["最大闪电抗性: +%d%% (被动)","Maximum Lightning Resist: +%d%% (Passive)"],["%s: 每等级 %+d%% 受到伤害","%s: %+d%% Damage Taken per Level"],["%s: 每等级 +%d秒咒术持续时间","%s: Hex Duration +%d seconds per level"],["%s: 每等级+%d%%几率粉碎打击","%s: %+d%% Chance of Crushing Blow per level"],["%s: 每五级创造额外回响数: %d","%s: Additional echoes created every fifth level: %d"],["%s: 每五级劈斩弧度增加: %d度","%s: Cleave Arc increased every fifth level: %d Degrees"],["施法者项链（#8 拉尔 + 完美紫）","Caster Amulet (#8 Ral + Perfect Amethyst)"],["吸血项链（#11 安姆 + 完美红）","Blood Amulet (#11 Amn + Perfect Ruby)"],["安全项链（#10 图尔 + 完美绿）","Safety Amulet (#10 Thul + Perfect Emerald)"],["吸血戒指（#12 索尔 + 完美红）","Blood Ring (#12 Sol + Perfect Ruby)"],["施法者腰带（#6 伊司 + 完美紫）","Caster Belt (#6 Ith + Perfect Amethyst)"],["等级 15 毒花藤 (21 次聚气)","Level 15 Poison Creeper (21 Charges)"],["等级 10 多头蛇 (30 次聚气)","Level 10 Hydra (30 Charges)"],["+6 标枪 / 40 IAS 标枪","Lancer's Matriarchal Javelin of Quickness"],["依森哈特的武器库 (3.4 强化)","Isenhart's Armory"],["伤害: 残骸生命值的%d-%d%%","Damage: %d-%d%% of corpse Life"],["照亮附近的敌人并减慢它们的远程攻击","illuminates nearby enemies and slows their ranged attacks"],["被动 - 骷髅和复活的生物变得更强","passive - better skeletons and revived creatures"],["诅咒一个怪物, 强制它攻击随机目标","curses a monster to force it to attack random targets"],["召唤致命的白骨尖刺, 刺穿你的敌人","summons a deadly spike of bone to impale your enemies"],["光环 - 对附近的敌人造成火焰伤害","aura - flames damage nearby enemies"],["光环 - 降低毒素与诅咒的持续时间","aura - reduces poison and curse duration"],["光环 - 对附近的敌人造成闪电伤害","aura - lightning damages nearby enemies"],["%s: 每 %d 级 %+d 尖刺","%s: %+d Spike per %d Levels"],["%s: 每等级%+d%%圣光弹伤害","%s: %+d%% Holy Bolt Damage per Level"],["跑步/步行速度: %+d-%d%%","Run/Walk Speed: %+d-%d%%"],["发射一枚黑暗弹丸，释放一片熵之云雾","Fires a bolt of darkness that releases a cloud of entropy"],["%s: 每等级 +%d%%爆炸几率","%s: %+d%% Chance to Erupt per level"],["吸血手套（#4 奈夫 + 完美红）","Blood Gloves (#4 Nef + Perfect Ruby)"],["击打手套（#9 欧特 + 完美蓝）","Hit Power Gloves (#9 Ort + Perfect Sapphire)"],["吸血腰带（#7 塔尔 + 完美红）","Blood Belt (#7 Tal + Perfect Ruby)"],["安全盾牌（#5 艾斯 + 完美绿）","Safety Shield (#5 Eth + Perfect Emerald)"],["德鲁伊毛皮头 (鹿角/大地之灵)","Druid Pelts (Antlers / Earth Spirit)"],["亚特兰蒂斯之剑 (3.4 强化)","The Atlantean"],["强力视觉 (Visionary)","Visionary"],["珠宝 +9 力量 / +9 敏捷","of Virility / Daring"],["失落城市、群蛇峡谷与利爪蝮蛇神殿","Lost City, Valley of Snakes, and Claw Viper Temple"],["库拉斯特商场、破败神殿与废弃寺院","Kurast Bazaar, Ruined Temple, and Disused Fane"],["强化戳刺武器使其可以释放连锁闪电","enchants thrusting weapons with chain lightning"],["诅咒 - 敌人将生命返还给攻击者","curse - enemies return life to attacker"],["光环 - 救赎死者获得法力和生命","aura - redeems the dead for mana and life"],["被动 - 提高使用长柄战斗的技巧","passive - improves polearm skill"],["被动 - 提高使用投掷武器的技巧","passive - improves throwing weapon skill"],["被动 - 提高使用长矛战斗的技巧","passive - improves spear fighting skill"],["成功地挥舞两把武器击中时提高速度","successful double swing hit increases speed"],["提高你和小队成员当前所有技能等级","increases all current skill levels for you and your party"],["无法进入游戏。错误的角色技能数据","Unable to enter game. Bad character skills data"],["%s: 每等级%+d%%元素伤害","%s: %+d%% Elemental Damage per Level"],["%s: 每等级%+d%%火焰伤害","%s: %+d%% Fire Damage per Level"],["%s: 每等级%+d%%冰霜伤害","%s: %+d%% Cold Damage per Level"],["%s: 每等级%+d%%闪电伤害","%s: %+d%% Lightning Damage per Level"],["%s: 每等级%+d%%毒素伤害","%s: %+d%% Poison Damage per Level"],["%s: 每等级%+d%%魔法伤害","%s: %+d%% Magic Damage per Level"],["%s: 每 %d 级 %+d 枚","%s: %+d Bolt per %d Levels"],["%s: 每等级%+d%%持续时间","%s: %+d%% Duration per Level"],["%s: 每等级%+d%%冻结时间","%s: %+d%% Freeze Length per Level"],["将%d%%物理伤害转换为元素伤害","Converts %d%% Physical Damage to Elemental Damage"],["将%d%%物理伤害转换为魔法伤害","Converts %d%% Physical Damage to Magic Damage"],["%s: 每等级治愈%+d%%生命","%s: %+d%% Life Healed per Level"],["设下陷阱, 当敌人靠近时喷出烈焰","trap that sprays fire at passing enemies"],["1次充能 - 伤害: %+d%%","Charge 1 - Damage: %+d%%"],["2次充能 - 伤害: %+d%%","Charge 2 - Damage: %+d%%"],["3次充能 - 伤害: %+d%%","Charge 3 - Damage: %+d%%"],["%s: 每等级消耗法力 %d%%","%s: %d%% Mana consumed per Level"],["%s: 每等级 %+d.%d 秒","%s: %+d.%d Seconds per Level"],["被动 - 强化你召唤和束缚的恶魔","Passive - Enhances your summoned and bound demons"],["强制使你的恶魔传送并攻击一名敌人","Forces your demon to teleport to and attack an enemy"],["引爆恶魔红液，对附近敌人造成伤害","Erupt your demon's blood to damage nearby enemies"],["The Achron Magus","The Achron Magus"],["术士君临 DLC (非赛/赛季)","Reign of the Warlock DLC"],["技能板 (GC)：+1 单系技能","Skiller (GC): +1 Skill Tree"],["小护身符 (SC)：+3 最大伤","Small Charm (SC): +3 Max Dmg"],["暗金装备升级（普通→扩展→精华）","Upgrade Unique Items (Normal → Exceptional → Elite)"],["等级 3 涂毒 (11 次聚气)","Level 3 Venom (11 Charges)"],["等级 3 涂毒 (20 次聚气)","Level 3 Venom (20 Charges)"],["野蛮人专用头 (征服者皇冠等)","Barbarian Helms (Conqueror Crown)"],["450 ED 愚人无形自修武器","Cruel + Fool's + 40 IAS + Ethereal + Self-Repair"],["处决者之裁决 (3.4 强化)","Executioner's Justice"],["SC 5 全抗 / 11 单抗","Shimmering / Ruby / Amber"],["强化戳刺武器使其可以释放电荷弹","enchants thrusting weapons with charged bolts"],["被动 - 投射物会继续穿透敌人","passive - missiles may continue through enemies"],["制造一个寒冰碎块减缓敌人的速度","creates a shard of ice that slows enemies"],["一个可以窃取并分享生命力的傀儡","a golem that shares the life it steals"],["诅咒 - 大幅度减缓并弱化敌人","curse - greatly slows and weakens enemies"],["被动 - 召唤出的怪物获得抗性","passive - summoned monsters gain resistances"],["诅咒 - 降低敌人对魔法的抗性","curse - lowers enemies resistance to magic"],["喷出一道不断扩大的浓缩毒素之环","emits an expanding ring of concentrated poison"],["被动 - 提高使用斧战斗的技巧","passive - improves axe fighting skill"],["被动 - 提高使用锤战斗的技巧","passive - improves mace fighting skill"],["激怒怪物, 使其开始鲁莽地攻击","enrages a monster into relentlessly attacking"],["被动 - 提高行走和奔跑的速度","passive - increases walk and run speed"],["%s: 每等级%+d%%命中值","%s: %+d%% Attack Rating per Level"],["%s: 每等级%+d%%防御值","%s: %+d%% Defense per Level"],["%s: 每等级%+d点伤害吸收","%s: %+d Damage Absorbed per Level"],["%s: 每2秒治愈%+d点生命","%s: %+d Life Healed Every 2 Seconds"],["生命偷取怒气攻击 - 狼人形态","life-stealing rage attack - werewolf form"],["平均火焰伤害: 每秒%d-%d","Average Fire Damage: %d-%d per second"],["平均冰霜伤害: 每秒%d-%d","Average Cold Damage: %d-%d per second"],["平均闪电伤害: 每秒%d-%d","Average Lightning Damage: %d-%d per second"],["每点伤害消耗的法力: %d%%","Mana Consumed Per Damage: %d%%"],["命中值: %+d%% (主动）","Attack Rating: +%d%% (Active)"],["命中值: %+d%% (被动）","Attack Rating: +%d%% (Passive)"],["%s: 每等级几率 %+d%%","%s: %+d%% Chance per level"],["在地面放置符徽，减缓并削弱敌人","Lay a sigil on the ground that slows and weakens enemies"],["攻击扩散的弧形范围内的所有敌人","Attack all enemies in an expanding arc"],["通过喂食残骸治疗并强化你的恶魔","Heal and empower your demon by feeding it a corpse"],["平均魔法伤害: 每秒%d-%d","Average Magic Damage: %d-%d per second"],["消灭生命低于 %d%% 的敌人","Slays enemies with less than %d%% health"],["恶魔受到的物理伤害减少%d%%","Physical Damage to your demon Reduced by %d%%"],["束缚目标间伤害分担: %d%%","Damage Shared Between Bound Targets: %d%%"],["偏向统治者大盾 (JMOD)","Jeweler's Monarch of Deflecting"],["损失耐久度的几率: %d%%","Chance of losing durability: %d%%"],["远程攻击飞行速度降至%d%%","Ranged attacks slowed to %d%%"],["跑步/步行速度: %+d%%","Run/Walk Speed: %+d%%"],["多头蛇火焰伤害: %d-%d","Hydra Fire Damage: %d-%d"],["施放时需要的最小法力: %d","Minimum Mana Required to Cast: %d"],["当前技能等级: %d(物品)","Current Skill Level: %d (item)"],["被动 - 有几率造成双倍伤害","passive - chance of doing double damage"],["提高攻击伤害但武器会快速破损","increases attack damage but rapidly degrades the weapon"],["强化箭矢使其可以打击多个目标","enchants arrows to strike multiple targets"],["强化箭矢使其可以冻结多个怪物","enchants arrows to freeze multiple monsters"],["被动 - 提高法力回复的速度","passive - increases the rate at which you recover mana"],["被动 - 降低闪电法术的消耗","passive - reduces cost of lightning spells"],["诅咒 - 加深敌人受到的伤害","curse - amplifies damage taken by enemies"],["诅咒 - 降低怪物的视野范围","curse - reduces vision of monsters"],["诅咒 - 降低敌人造成的伤害","curse - reduces damage done by enemies"],["诅咒 - 敌人对自身造成伤害","curse - enemies damage themselves"],["诅咒 - 怪物成为共同的目标","curse - monster becomes universal target"],["在目标周围制造出石化白骨屏障","creates a barrier of fossilized bone around your target"],["光环 - 提高速度和耐力回复","aura - increases speed and stamina recovery"],["光环 - 击退亡灵并造成伤害","aura - repels and damages undead"],["提高小队的生命, 法力和耐力","improves life, mana and stamina of party"],["制造通往最近城镇的魔法传送门","create a magic portal to the nearest town"],["光环 - 提高攻击速度与伤害","aura - increases attack speed and damage"],["%s: 每等级%+d%%伤害","%s: %+d%% Damage per Level"],["%s: 每等级%+d.%d码","%s: %+d.%d Yards per Level"],["%s: 每等级%+d%%生命","%s: %+d%% Life per Level"],["被动 - 用两个爪类武器格挡","passive - block with two claw class weapons"],["攻击速度: %+d-%d%%","Attack Speed: %+d-%d%%"],["生命偷取: %+d-%d%%","Life Steal: %+d-%d%%"],["每次消灭恢复的生命: +%d","Life After Each Kill: %+d"],["每次消灭恢复的法力: +%d","Mana After Each Kill: %+d"],["受到伤害的%d%%转移给恶魔","%+d%% Damage Taken Goes To your demon"],["%s: 每等级+%d补充生命","%s: +%d Replenish life per level"],["The Treentster","The Treentster"],["非赛已解锁 (原2.6赛季)","Unlocked in Non-Ladder (2.6)"],["死灵法师干瘪头颅 (全系)","Necromancer Shrunken Heads"],["头盔 / 王冠 / 覆面甲","Helm / Crown / Mask"],["2/20/2孔 极品黄权冠","+2 Skills / 20 FCR / 2 Sockets + Stats"],["贝恩的法衣 (术士/通用)","Bane's Garments"],["钢铁面纱 (3.4 强化)","Veil of Steel"],["无形之刃 (3.4 强化)","Ethereal Edge"],["迪亚波罗秘典 (术士魔典)","Ars Al'Diabolos"],["墨菲斯托秘典 (术士魔典)","Ars Dul'Mephistos"],["基德的赌注（术士 DLC）","Gheed's Wager"],["投石索之戒（术士 DLC）","Sling"],["守御者之火（巨像暗金火珠）","Defender's Fire"],["守御者之胆（巨像暗金毒珠）","Defender's Bile"],["护卫者之霜（巨像暗金冰珠）","Protector's Frost"],["护卫者之石（巨像暗金物珠）","Protector's Stone"],["守护者之雷（巨像暗金电珠）","Guardian's Thunder"],["守护者之光（巨像暗金魔珠）","Guardian's Light"],["血腥丘陵、冰冻高地与亚巴顿","Bloody Foothills, Frigid Highlands, and Abaddon"],["敌人的防御值: %+d%%","Enemy Defense: %+d%%"],["目标的命中值: %+d%%","Target's Attack Rating: %+d%%"],["耐力回复速度: %+d%%","Stamina Recovery Rate: %+d%%"],["不被打断的几率: %d%%","Chance uninterruptable: %d%%"],["火焰爆炸伤害: %d-%d","Fire Explosion Damage: %d-%d"],["法力回复速度: %+d%%","Mana Recovery Rate: %+d%%"],["骷髅法师: 生命: %+d","Magi: Life: %+d"],["怪物: 生命: %+d%%","Monsters: Life: %+d%%"],["被动 - 冰霜攻击穿透防御","passive - cold attacks become piercing"],["诅咒 - 怪物在恐惧中逃跑","curse - monsters run away in fear"],["诅咒 - 怪物攻击随机目标","curse - monster attacks random targets"],["喷出一道不断扩大的毒素之环","emits an expanding ring of poison"],["光环 - 将伤害反弹给敌人","aura - reflects damage back at enemies"],["光环 - 提高你的攻击能力","aura - increases your attack ability"],["法力消耗: 每支利刃%d点","Mana Cost: %d per blade"],["重殴你的敌人 - 熊人形态","maul your enemies - werebear form"],["噬咬造成疾病 - 狼人形态","bite causes disease - werewolf form"],["被动 - 提升爪类武器技能","passive - improves claw class weapons ability"],["一阵心灵震爆，摧毁你的敌人","a mind blast to crush your enemies"],["对亡灵的伤害: %+d%%","Damage to Undead: %+d%%"],["%s: 每等级%+d命中值","%s: %+d Attack Rating per Level"],["%s: 每等级%+d防御值","%s: %+d Defense per Level"],["怪物: 伤害: %+d%%","Monsters: Damage: %+d%%"],["足跟火持续时间: %d 秒","Blaze Duration: %d seconds"],["敌人受到伤害: %+d%%","Enemy Damage Taken: %+d%%"],["范围伤害，距离越近伤害越高","Area damage increases at closer range"],["用武器的镜像复制品发动攻击","Attack with mirror duplicates of your weapon"],["强制一只受伤的恶魔为你效命","Force an injured demon to do your bidding"],["恶魔所有抗性: +%d%%","Resist All for your demon: %+d%%"],["治疗恶魔生命: +%d%%","Heal Demon's Life: %+d%%"],["召唤或束缚恶魔以学习其秘密","Summon or Bind a demon to learn its secrets"],["魔法爆炸伤害: %d-%d","Magic Explosion Damage: %d-%d"],["%s: 每等级+%d防御值","%s: %+d Defense per level"],["术士魔典 (全系副手书)","Warlock Grimoires"],["头盔 / 皇冠 / 面具","Helm / Crown / Mask"],["狱守之志（术士 DLC）","Hellwarden's Will"],["亚瑞特的面容（BB 头）","Arreat's Face"],["鬼灵之步（术士 DLC）","Wraithstep"],["维尔登戈的心结（物免腰）","Verdungo's Hearty Cord"],["蛋白石脉（术士 DLC）","Opalvein"],["熵之吊坠（术士 DLC）","Entropy Locket"],["生命（巨像·黄/橙极限）","of the Colossus"],["法力（巴哈姆特·蓝极限）","Bahamut's"],["法力（巨龙·黄/橙极限）","Great Wyrm's"],["珠宝匠 3 孔（蓝专属）","Jeweler's / Artisan's"],["珠宝匠 4 孔（蓝专属）","Jeweler's"],["偏向（盾牌 30/20）","of Deflecting"],["GC 45 生命（维塔）","of Vita (Grand Charm)"],["SC 20 生命（维塔）","of Vita (Small Charm)"],["SC 17 法力（巨蛇）","Serpent's (Small Charm)"],["蓝珠宝 40% 增强伤害","Ruby"],["泰摩高地、外侧回廊与地穴","Tamoe Highland, Outer Cloister, and The Pit"],["敌人的伤害: %+d%%","Enemy Damage: %+d%%"],["骷髅法师: 提高远程伤害","Magi: Improved Missile Damage"],["治愈: %d%%攻击伤害","Heals: %d%% of attack damage"],["将%d%%伤害转化为生命","Converts %d%% damage to life"],["诅咒持续时间缩短%d%%","Reduces curse duration by %d%%"],["圣光弹伤害: %d-%d","Holy Bolt Damage: %d-%d"],["救赎灵魂几率: %d%%","Chance to redeem soul: %d%%"],["使用戳刺武器进行快速攻击","rapid attacks with a thrusting weapon"],["强化箭矢使其可以减速目标","enchants arrows to slow targets"],["强化箭矢使其可以冻结敌人","enchants arrows to freeze enemies"],["强化箭矢使其可以追踪敌人","enchants arrows to seek enemies"],["被动 - 提高你的命中值","passive - increases your attack rating"],["强化标枪使其可以释放毒爆","enchants javelins with poison explosions"],["强化箭矢使其可以灼烧敌人","enchants arrows to burn enemies"],["召唤一位强大的女武神盟友","summons a powerful Valkyrie ally"],["制造一个寒冰飞弹冻结敌人","creates an ice bolt that freezes enemies"],["给近战或远程武器附上火焰","enchants melee or ranged weapons with fire"],["立即移动到视野内的目的地","instantly moves to a destination within your line of sight"],["发射出一排带有倒刺的骨牙","fires a barrage of summoned barbed teeth"],["从目标残骸中复活骷髅战士","reanimate skeletal warrior from target corpse"],["下一次匕首攻击使目标中毒","next dagger attack poisons target"],["强化所有傀儡的速度和生命","Enhances Speed and Life of Golems"],["提高所有傀儡的速度和生命","Enhances Speed and Life of all your Golems"],["从目标残骸中复活骷髅法师","reanimate skeletal mage from target corpse"],["将一具残骸转变为毒气炸弹","turns a corpse into a poison gas bomb"],["在目标周围制造出白骨屏障","creates a barrier of bone around target"],["冲向战场, 攻击一名敌人","charge into battle and attack an enemy"],["光环 - 提高你的命中值","aura - increases your attack rating"],["光环 - 冻结附近的怪物","aura - freezes nearby monsters"],["用神圣的力量强化你的盾牌","enhances your shield with divine power"],["击昏附近的敌人并造成伤害","injures and stuns nearby enemies"],["%s 获得如下技能加成:","%s Receives Bonuses From:"],["队友的伤害: %+d%%","Party Damage: %+d%%"],["每只渡鸦法力消耗: %d","Mana Cost Per Raven: %d"],["释放出混乱的烈焰烧焦敌人","unleash fiery chaos to burn your enemies"],["制造冲击波 - 熊人形态","create shock waves - werebear form"],["3次充能 - 冻结%d秒","Charge 3 - Freezes for %d seconds"],["伤害: %+d-%d%%","Damage: %+d-%d%%"],["盾击伤害: %+d-%d","Smite Damage: %+d-%d"],["持续时间: %d-%d秒","Duration: %d-%d seconds"],["多头蛇最大数量: %d只","Max Hydras: %d"],["%d%% 几率不消耗数量","%d%% Chance to not consume Quantity"],["+%d%% 几率粉碎打击","+%d%% Chance of Crushing Blow"],["恶魔生命消耗: %d%%","Demon's Life Cost: %d%%"],["深渊半径加成: +%d码","Bonus Abyss Radius: +%d Yards"],["镜影锋刃伤害: %d%%","Mirrored Blade Damage: %d%%"],["每码火焰伤害 +%d%%","+%d%% Fire Damage per yard"],["ÿc8不存在的关卡ÿc0","ÿc8a non-existent levelÿc0"],["武器回耐久: #9 欧特","Repair Weapon Durability: #9 Ort"],["防具回耐久: #8 拉尔","Repair Armor Durability: #8 Ral"],["法系头环：+3 单系技能","Caster Circlet: +3 Skill Tree"],["亮金装备升级（黄装升阶）","Upgrade Rare Items (Normal → Exceptional → Elite)"],["重铸蓝色护身符 / 权冠","Reroll Magic Charms / Rare Diadems"],["白骨魔杖 / 邪妖魔杖","Bone Wand / Lich Wand"],["大型刃爪 / 符文刃爪","Greater Talons / Runic Talons"],["塔·拉夏的赫拉迪姆之冠","Tal Rasha's Horadric Crest"],["珠宝匠之巨鲸执政官铠甲","Jeweler's Archon Plate of the Whale"],["阿卡拉小盾 (圣骑士)","Akaran Targe"],["神圣轻圆盾 (圣骑士)","Sacred Rondache"],["库拉斯特盾 (圣骑士)","Kurast Shield"],["撒卡兰姆盾 (圣骑士)","Zakarum Shield"],["白骨手杖 / 巫妖法杖","Bone Wand / Lich Wand"],["赫拉森的荣耀 (术士)","Horazon's Splendor"],["吸血鬼的凝视（物免盔）","Vampire Gaze"],["谢夫特斯坦布（物免甲）","Shaftstop"],["恐惧之牙 (术士君临)","Dreadfang"],["血契碎片 (术士君临)","Bloodpact Shard"],["撒卡兰姆使者（饰金盾）","Herald of Zakarum"],["巴尔秘典 (术士魔典)","Ars Tor'Baalos"],["节制之怒 (术士魔典)","Measured Wrath"],["塔·拉夏的赫拉迪克纹章","Tal Rasha's Horadric Crest"],["施法者项链（橙装固定）","Caster Amulet (Ral + 完美紫)"],["施法者戒指（橙装固定）","Caster Ring (Amn + 完美紫)"],["生命（巨像·黄装极限）","of the Colossus"],["双吸（生命/法力偷取）","of the Lamprey / Wraith"],["单系技能（黄/橙极限）","Spearmaiden's / Fletcher's"],["施法者鞋子（橙装固定）","Caster Boots (Thul + 完美紫)"],["施法者腰带（橙装固定）","Caster Belt (Ith + 完美紫)"],["愚人（等级加伤与命中）","Fool's"],["GC +1 单系技能板","Skiller"],["GC 锐利最大伤/命中","Sharp"],["SC 精细最大伤/命中","Fine"],["SC 7% MF 寻宝","of Good Luck"],["埋骨之地、墓地与大陵墓","Burial Grounds, Crypt, and Mausoleum"],["尼拉塞克神殿与神殿大厅","Nihlathak's Temple and Temple Halls"],["火焰伤害: %d-%d","Fire Damage: %d-%d"],["冰霜伤害: %d-%d","Cold Damage: %d-%d"],["闪电伤害: %d-%d","Lightning Damage: %d-%d"],["毒素伤害: %d-%d","Poison Damage: %d-%d"],["法力消耗: 每秒%d点","Mana Cost: %d per second"],["受到伤害: %+d%%","Damage Taken: %+d%%"],["魔法伤害: %d-%d","Magic Damage: %d-%d"],["%d%%伤害反弹给自身","%d%% damage to Self"],["火焰抗性: %+d%%","Resist Fire: %+d%%"],["冰霜抗性: %+d%%","Resist Cold: %+d%%"],["闪电抗性: %+d%%","Resist Lightning: %+d%%"],["所有抗性: %+d%%","Resist All: %+d%%"],["敌人速度降低 %d%%","Enemies slowed %d%%"],["火焰持续时间: %d秒","Fire Duration: %d seconds"],["骷髅: 生命: %+d","Skeletons: Life: %+d"],["最大生命: %+d%%","Max Life: %+d%%"],["最大法力: %+d%%","Max Mana: %+d%%"],["最大耐力: %+d%%","Max Stamina: %+d%%"],["攻击速度: %+d%%","Attack Speed: %+d%%"],["生命/法力回复: %d","Life/Mana Recovered: %d"],["成功格挡: %+d%%","Successful Blocking: %+d%%"],["你通过物品获得了此技能","You have been granted this skill by an item"],["被动 - 躲避近战攻击","passive - dodges melee attacks"],["被动 - 闪避远程攻击","passive - dodges missiles"],["闪电球击中目标时会分裂","a lightning bolt that splits on impact"],["被动 - 提高法力回复","passive - increases mana recovery rate"],["提高防御值并冻结攻击者","improves defense and freezes attacker"],["制造一个致命的火花力场","creates a field of deadly sparks"],["制造一个爆炸的火焰之球","creates an explosive sphere of fire"],["制造一颗冰冷的寒冰彗星","creates a freezing comet of ice"],["召唤一颗从天而降的陨石","summons a meteor from the heavens"],["召唤巨大的冰块摧毁敌人","summons massive shards of ice to destroy your enemies"],["被动 - 提高火焰伤害","passive - increases fire damage"],["召唤喷吐火焰的多头怪物","summons multi-headed fire beast"],["制造一个冰冷的死亡之球","creates a globe of frozen death"],["制造一道骨甲壳吸收伤害","creates a damage absorbing bone shell"],["使你的匕首攻击附加毒素","adds poison to your dagger attacks"],["制造一个无法穿越的屏障","creates an impassable barrier"],["召唤一根致命的白骨尖刺","summons a deadly spike of bone"],["从一个物品中制造出傀儡","creates a golem from an item"],["光环 - 防御火焰伤害","aura - protects against fire damage"],["神圣能量对亡灵造成伤害","divine energy that damages undead"],["光环 - 防御冰霜伤害","aura - protects against cold damage"],["光环 - 防御闪电伤害","aura - protects against lightning damage"],["召唤一把飞旋的魔法战锤","summon a spiraling magic hammer"],["光环 - 提高法力回复","aura - increases mana recovery"],["光环 - 提高攻击速度","aura - increases attack speed"],["光环 - 防御元素伤害","aura - protects against elemental damage"],["强力挥击造成更高的伤害","powerful blow that increases damage"],["被动 - 提高你的耐力","passive - increases your stamina"],["被动 - 提高自然抗力","passive - increases natural resistances"],["鉴定一个魔法物品的属性","identify a magic item's properties"],["被动 - 提高闪电伤害","passive - increases lightning damage"],["%s: 每等级%+d秒","%s: %+d Seconds per Level"],["你的伤害: %+d%%","Your Damage: %+d%%"],["被动 - 提升变形技能","passive - improves shape-shifting ability"],["多重攻击 - 狼人形态","multiple attacks - werewolf Form"],["设下陷阱, 喷出火焰波","a trap that emits waves of fire"],["生命偷取: %+d%%","Life Steal: %+d%%"],["法力偷取: %+d%%","Mana Steal: %+d%%"],["火焰伤害: %+d%%","Fire Damage: %+d%%"],["冰霜伤害: %+d%%","Cold Damage: %+d%%"],["闪电伤害: %+d%%","Lightning Damage: %+d%%"],["魔法伤害: %+d%%","Magic Damage: %+d%%"],["神圣火焰: %d-%d","Holy Fire: %d-%d"],["骷髅: 伤害: %+d","Skeletons: Damage: %+d"],["每等级几率 %+d%%","%+d%% Chance per level"],["召唤一名羊头人为你而战","Summons a Goatman to fight by your side"],["召唤一只污染魔为你而战","Summons a Tainted to fight by your side"],["牺牲你的恶魔以换取力量","Sacrifice your demon in exchange for power"],["最大束缚灵魂数: %d","Max Bound Souls: %d"],["恶魔生命: +%d%%","Life of your demon: %+d%%"],["魔法抗性: +%d%%","Magic Resist: %+d%%"],["暴击几率: +%d%%","Critical Strike Chance: %+d%%"],["被束缚恶魔获得额外强壮","Bound demons gain Extra Strong"],["+%d%% 敌人命中值","%+d%% to Enemy Attack Rating"],["+%d%% 敌人防御值","%+d%% to Enemy Defense"],["激怒几率: +%d%%","Chance to Enrage: %+d%%"],["爆炸几率: +%d%%","Chance to Erupt: %+d%%"],["瘴气持续时间 +%d秒","+%d Seconds to Miasma Duration"],["咒术持续时间: %d秒","Hex Duration: %d seconds"],["被束缚恶魔获得额外快速","Bound demons gain Extra Fast"],["被束缚恶魔获得鬼魂打击","Bound demons gain Spectral Hit"],["被束缚恶魔获得光环强化","Bound demons gain Aura Enchanted"],["创造镜像武器数: %d","Mirrored Weapons Created: %d"],["Bling Bling","Bling Bling"],["更佳的机会取得魔法装备","Better Chance of Getting Magic Items (MF)"],["非赛已解锁 (原赛季)","Unlocked in Non-Ladder"],["3.4 赛季/离线重做","Patch 3.4 Rework"],["死者面甲 / 护鼻盔","Death Mask / Casque"],["牙刃刀 / 传说匕刺","Fanged Knife / Legend Spike"],["圣·沙略的魂灵解救者","Sazabi's Ghost Liberator"],["神圣小盾 (圣骑士)","Sacred Targe"],["死灵盾 / 巫毒首级","Necromancer Shrunken Heads"],["死亡面具 / 轻钢盔","Death Mask / Casque"],["德鲁伊狼头 / 鹿角","Druid Pelts"],["尖牙小刀 / 传说刺","Fanged Knife / Legend Spike"],["乔丹之石 (SOJ)","The Stone of Jordan"],["地狱火炬 (ULC)","Hellfire Torch"],["吸血项链（橙装固定）","Blood Amulet (Amn + 完美红)"],["安全项链（橙装固定）","Safety Amulet (Thul + 完美绿)"],["生命（巨鲸·蓝极限）","of the Whale"],["吸血戒指（橙装固定）","Blood Ring (Sol + 完美红)"],["吸血手套（橙装固定）","Blood Gloves (Nef + 完美红)"],["击打手套（橙装固定）","Hit Power Gloves (Ort + 完美蓝)"],["吸血腰带（橙装固定）","Blood Belt (Tal + 完美红)"],["彩色全抗（蓝盾专属）","Chromatic"],["安全盾牌（橙装固定）","Safety Shield (Eth + 完美绿)"],["蓝珠宝 15% 攻速","of Fervor"],["蓝珠宝 15% 全抗","Scintillating"],["珠宝 需求 -15%","of Freedom"],["珠宝 +7% FHR","of Truth"],["塔·拉夏的古墓与密室","Tal Rasha's Tombs and Tal Rasha's Chamber"],["亚瑞特高原与冥河深坑","Arreat Plateau and Pit of Acheron"],["冰川小径与漂泊者洞窟","Glacial Trail and Drifter Cavern"],["当前技能等级: %d","Current Skill Level: %d"],["命中值: %+d%%","Attack Rating: %+d%%"],["持续时间缩短%d%%","Duration reduced by %d%%"],["转化几率: %d%%","Chance to convert: %d%%"],["吸收%d%%火焰伤害","Absorbs %d%% fire damage"],["释放一个被召唤的生物","releases a summoned creature"],["照亮并削弱附近的怪物","illuminates and weakens nearby monsters"],["强化箭矢使其可以爆炸","enchant arrows to explode"],["提高伤害但会损耗武器","increases damage but degrades weapon"],["将投掷的标枪变成闪电","changes a thrown javelin into lightning"],["被动 - 提高命中值","passive - increases attack rating"],["被动 - 移动时躲避","passive - dodges when moving"],["创造出燃烧的魔法飞弹","creates a magical flaming missile"],["制造出多个致命的火花","creates multiple deadly sparks"],["在你身后制造火焰尾迹","creates fire in your wake"],["冻结攻击者并造成伤害","freezes and damages attackers"],["制造一道弹射的闪电弹","creates a bolt of lightning that arcs"],["使用你的魔法作为护盾","uses your mana as a shield"],["召唤一股巨大的冰风暴","summons a massive ice storm"],["将一具残骸转变为炸弹","turns a corpse into a bomb"],["制造一个傀儡为你而战","creates a golem to fight for you"],["释放出一个不死的幽灵","releases an undead specter"],["复活一个怪物为你作战","raises a monster to fight for you"],["光环 - 提高防御力","aura - increases defense"],["从目标残骸上寻找药水","targets corpses to find potions"],["警示队友并提高防御力","alerts party and improves defense"],["从目标残骸上寻找物品","targets corpses to find items"],["被动 - 提高防御值","passive - improves defense"],["每等级行走/奔跑速度","Walk/Run Speed per Level"],["减速敌人: %d%%","Slows Enemies: %d%%"],["脚踢伤害: %+d%","Kick Damage: %+d%%"],["让大地开裂，灼烧敌人","open the earth to burn enemies"],["一个放射电荷弹的陷阱","a trap that emits charged bolts"],["一个放射火焰波的陷阱","a trap that emits waves of fire"],["你的武器附加毒素伤害","add poison damage to your weapons"],["持续时间: %+d秒","Duration: %+d seconds"],["束缚几率: %d%%","Chance to Bind: %d%%"],["武器需求 %+d%%","Weapon Requirements %+d%%"],["%d次爆炸后移除咒术","Hex Removed after %d Explosions"],["前往利爪蝮蛇神殿二层","To The Claw Viper Temple Level 2"],["前往利爪蝮蛇神殿一层","To The Claw Viper Temple Level 1"],["前往世界之石要塞一层","To The Worldstone Keep Level 1"],["前往世界之石要塞二层","To The Worldstone Keep Level 2"],["前往世界之石要塞三层","To The Worldstone Keep Level 3"],["进入利爪蝮蛇神殿一层","Entering The Claw Viper Temple Level 1"],["进入利爪蝮蛇神殿二层","Entering The Claw Viper Temple Level 2"],["进入世界之石要塞一层","Entering The Worldstone Keep Level 1"],["进入世界之石要塞二层","Entering The Worldstone Keep Level 2"],["进入世界之石要塞三层","Entering The Worldstone Keep Level 3"],["额外几率获得魔法物品","Better Chance of Getting Magic Items (MF)"],["几率在消灭敌人时施放","Chance to Cast on Kill"],["珠宝匠之巨鲸：3 孔","Jeweler's of the Whale: 3 Sockets"],["格里斯沃尔德的遗产","Griswold's Legacy"],["圣·沙略的伟大颂词","Sazabi's Grand Tribute"],["塔·拉夏的无睑之眼","Tal Rasha's Lidless Eye"],["不朽之王的灵魂之笼","Immortal King's Soul Cage"],["格里斯沃尔德的勇气","Griswold's Valor"],["格里斯沃尔德的赤诚","Griswold's Heart"],["格里斯沃尔德的救赎","Griswold's Redemption"],["格里斯沃尔德的荣耀","Griswold's Honor"],["布尔凯索的神圣职责","Bul-Kathos' Sacred Charge"],["布尔凯索的部族守护","Bul-Kathos' Tribal Guardian"],["圣·沙略的心灵庇护","Sazabi's Mental Sheath"],["圣·沙略的济世之剑","Sazabi's Cobalt Redeemer"],["依森哈特的光之烙印","Isenhart's Lightbrand"],["6 词缀极品黄戒指","10 FCR / Dual Leech / Str / Dex / Life / Res"],["30/10 三抗鞋","30 FRW / 10 FHR / Tri-Res Boots"],["旋风盾 (圣骑士)","Vortex Shield"],["巨鹰爪 / 符文爪","Greater Talons / Runic Talons"],["格里斯瓦尔德的遗产","Griswold's Legacy"],["加尔的长发（狼头）","Jalal's Mane"],["渡鸟之爪（小鸟弓）","Raven Claw"],["暴风之盾（物免盾）","Stormshield"],["剃刀之尾（穿刺腰）","Razortail"],["蜘蛛之网（技能腰）","Arachnid Mesh"],["天堂之裂（破电板）","Crack of the Heavens"],["火焰裂隙（破火板）","Flame Rift"],["寒冰裂隙（破冰板）","Cold Rupture"],["腐朽裂隙（破毒板）","Rotting Fissure"],["塔·拉夏的警惕之眼","Tal Rasha's Lidless Eye"],["塔·拉夏的精织细带","Tal Rasha's Fine-Spun Cloth"],["不朽之王的灵魂牢笼","Immortal King's Soul Cage"],["格里斯瓦尔德的勇气","Griswold's Valor"],["格里斯瓦尔德的救赎","Griswold's Redemption"],["格里斯瓦尔德的荣耀","Griswold's Honor"],["布尔凯索的神圣代价","Bul-Kathos' Sacred Charge"],["沙撒壁的鬼魂释放者","Sazabi's Ghost Liberator"],["沙撒壁的钴蓝救赎者","Sazabi's Cobalt Redeemer"],["依森哈特的光之鸣剑","Isenhart's Lightbrand"],["单系技能（蓝专属）","Lancer's / Cunning / Echoing"],["生命 / 法力偷取","of the Leech / Bat"],["最小 / 最大伤害","of Performance / Maiming"],["巨鲸生命（蓝极限）","of the Whale"],["鲜血荒地与邪恶洞窟","Blood Moor and Den of Evil"],["黑暗森林与地底通道","Dark Wood and Underground Passage"],["干燥高地与死亡之殿","Dry Hills and Halls of the Dead"],["蜘蛛森林与蜘蛛洞窟","Spider Forest and Spider Cavern"],["剥皮丛林与剥皮地窖","Flayer Jungle and Flayer Dungeon"],["外围荒原与绝望平原","Outer Steppes and Plains of Despair"],["诅咒之城与火焰之河","City of the Damned and River of Flame"],["火焰之河与诅咒之城","River of Flame and City of the Damned"],["血腥丘陵与冰冻高地","Bloody Foothills and Frigid Highlands"],["冰冻苔原与炼狱深坑","Frozen Tundra and Infernal Pit"],["伤害: %d-%d","Damage: %d-%d"],["冰冷时间: %d秒","Cold Length: %d seconds"],["持续时间: %d秒","Duration: %d seconds"],["防御: %+d%%","Defense: %+d%%"],["冻结时间: %d秒","Freeze Length: %d seconds"],["击晕时间: %d秒","Stun Length: %d seconds"],["治愈: %d-%d","Heals: %d-%d"],["怪物最多逃离%d码","Monster runs up to %d yards"],["释放出%d枚电荷弹","Releases %d charged bolts"],["攻击最多%d个目标","Attacks up to %d targets"],["你还没有学会此技能","You have not learned this skill yet"],["投掷已经装备的物品","throw equipped item"],["减速敌人的远程攻击","slows ranged attacks of enemies"],["将标枪化为闪电之球","magically converts your javelin into a bolt of lightning"],["制造一个火焰喷射器","creates a jet of flame"],["制造一个充能的电环","creates an electrically charged ring"],["立即移动到目标地点","instantly moves to destination"],["召唤一股强大的风暴","summons a powerful tempest"],["发射出带倒刺的骨牙","fires barbed teeth"],["光环 - 提高伤害","aura - increases damage"],["光环 - 恢复生命","aura - regenerates life"],["攻击邻近的多名敌人","attacks multiple adjacent enemies"],["改变怪物效忠的对象","Change allegiance of monsters"],["光环 - 削弱敌人","aura  - weakens enemies"],["被动 - 提高耐力","passive - increases stamina"],["跃起并攻击目标敌人","leaps and attacks target enemy"],["降低敌人的战斗效率","reduces enemy effectiveness"],["制造一个骇人的图腾","creates a frightening totem"],["每等级+1发射次数","+1 Shot per Level"],["%d%% 几率暴击","%d%% Chance of Critical Strike"],["召唤散播疾疫的藤蔓","summon disease spreading vine"],["召唤吞食残骸的蔓藤","summon corpse eating vine"],["召唤一只被激怒的狼","summon an enraged wolf"],["召唤吞食残骸的藤蔓","summon corpse eating vine"],["噬咬偷取生命与法力","life-and-mana-stealing bite"],["召唤一只狂暴的灰熊","summon a ferocious grizzly bear"],["对你的敌人降下火雨","rain fire on your enemies"],["制造一股巨大的风暴","create a massive wind storm"],["提高攻击与移动速度","increases attack and movement speed"],["引爆附近残骸的陷阱","trap that explodes nearby corpses"],["渡鸦数量上限：%d","Max Ravens: %d"],["群狼数量上限：%d","Max Wolves: %d"],["新的属性点和技能点","New Stats and Skills"],["伤害: %+d%%","Damage: %+d%%"],["治愈: %+d%%","Heals: %+d%%"],["生命: %+d%%","Life: %+d%%"],["敌人防御: %+d","Enemy Defense: %+d"],["%d%% 几率穿刺","%d%% Chance to Pierce"],["射程半径: %d码","Range Radius: %d yards"],["击退半径: %d码","Knockback Radius: %d yards"],["施法延迟: %d秒","Casting Delay: %d second"],["伤害: +%d%%","Damage: %+d%%"],["瘴气半径: %d码","Miasma Radius: %d Yards"],["劈斩弧度: %d度","Cleave Arc: %d Degrees"],["最大锁链数: %d","Max Chains: %d"],["前往被遗忘的藏骨室","To The Forgotten Reliquary"],["前往库拉斯特上层区","To Upper Kurast"],["前往库拉斯特下层区","To Lower Kurast"],["前往塔·拉夏的墓室","To Tal Rasha's Chamber"],["前往尼拉塞克的神殿","To Nihlathak's Temple"],["进入塔·拉夏的墓室","Entering Tal Rasha's Chamber"],["进入库拉斯特下层区","Entering Lower Kurast"],["进入库拉斯特上层区","Entering Upper Kurast"],["进入被遗忘的藏骨室","Entering The Forgotten Reliquary"],["进入尼拉塞克的神殿","Entering Nihlathak's Temple"],["赫拉迪姆法杖的杖身","Shaft of the Horadric Staff"],["赫拉迪姆法杖的杖头","Top of the Horadric Staff"],["Hadeshorn","Hadeshorn"],["Skulltred","Skulltred"],["梅塞施密特的劫掠者","Messerschmidt's Reaver"],["受损伤害转化为法力","Dmg Taken Goes to Mana"],["几率在被击中时施放","Chance to Cast when Struck"],["+力量/生命/全抗","+Str / Life / All Res"],["装备快速维修与充能","Cube Repair Durability & Recharge Skills"],["软帽 / 骷髅帽","Cap / Skull Cap"],["塔·拉夏的裹身布","Tal Rasha's Wrappings"],["艾维娜的战斗诗歌","M'avina's Battle Hymn"],["依森哈特的武器库","Isenhart's Armory"],["摩西尔的神圣圆环","Moser's Blessed Circle"],["彩虹刻面（电珠）","Rainbow Facet (Lightning)"],["彩虹刻面（冰珠）","Rainbow Facet (Cold)"],["彩虹刻面（火珠）","Rainbow Facet (Fire)"],["彩虹刻面（毒珠）","Rainbow Facet (Poison)"],["塔·拉夏的精织带","Tal Rasha's Fine-Spun Cloth"],["不朽之王的碎石锤","Immortal King's Stone Crusher"],["艾尔多的冷酷凝视","Aldur's Stony Gaze"],["阿卡娜的死亡之杖","Arcanna's Deathwand"],["小盾 (圣骑士)","Targe"],["帽子 / 骷髅帽","Cap / Skull Cap"],["巨斧 / 军用斧","War Axe"],["短法杖 / 战杖","Short Staff / War Staff"],["马维娜的战斗赞歌","M'avina's Battle Hymn"],["沙撒壁的伟大贡献","Sazabi's Grand Tribute"],["谐角之冠（军帽）","Harlequin Crest (Shako)"],["年龄之冠（年纪）","Crown of Ages (CoA)"],["巨骷髅（白骨头）","Giant Skull"],["李奥瑞克王的武器","Arm of King Leoric"],["毁灭 (USC)","Annihilus"],["不朽之王的碎魂者","Immortal King's Stone Crusher"],["格里斯瓦尔德之心","Griswold's Heart"],["马维娜的真实之眼","M'avina's True Sight"],["沙撒壁的精神之鞘","Sazabi's Mental Sheath"],["阿卡娜的死亡手杖","Arcanna's Deathwand"],["力量（阿特拉斯）","of the Atlas"],["毒素持续时间缩短","Poison Length Reduced"],["更快速跑步/步行","Faster Run/Walk (FRW)"],["GC 45 生命","of Vita"],["SC 20 生命","of Vita"],["SC 17 法力","Serpent's"],["大教堂与地下墓穴","Cathedral and Catacombs"],["需要等级: %d","Required Level: %d"],["法力消耗: %d","Mana Cost: %d"],["敌人削弱%d%%","Weakens Enemies by %d%%"],["%d%%伤害反弹","%d%% damage returned"],["%伤害转换成生命","percent damage to life"],["每次击退获得法力","mana per knockback"],["投掷左手中的物品","throw left hand item"],["挥舞左手中的武器","swing left hand weapon"],["放出一个你的替身","creates a duplicate of yourself"],["攻击附近所有敌人","attacks all adjacent targets"],["制造一个火焰飞弹","creates a missile of flame"],["制造一道冰冻之环","creates a freezing ring"],["制造一道火焰之墙","creates a wall of flame"],["制造一个火焰傀儡","creates a golem of fire"],["提高准确度和伤害","increased accuracy and damage"],["攻击附加元素伤害","attacks add elemental damage"],["同时挥舞两把武器","swings two weapons at once"],["强制一名怪物攻击","causes a monster to attack"],["同时投掷两把武器","throw two weapons at once"],["不会被打断的攻击","attack that is not interruptible"],["强大而鲁莽的攻击","powerful but reckless attack"],["每等级+1枚飞弹","+1 Missile per Level"],["%d%%武器伤害","%d%% Weapon Damage"],["变身成为一头狼人","transform into a werewolf"],["狼与熊的被动加成","Passive Bonus to Wolves and Bears"],["扔出一块熔岩巨石","launch a molten boulder"],["释放若干小型旋风","release several small whirlwinds"],["召唤你的一个影子","summon a shadow of yourself"],["压迫性的意念冲击","compelling psionic blast"],["释放出%d枚电荷","Releases %d bolts"],["命中值: %+d","Attack Rating: %+d"],["击晕时间: %d","Stun Length: %d"],["防御:  %+d","Defense: %+d"],["魔法伤害提升%d","Magic Damage Increased by %d"],["来自%s的加成:","Bonus from %s:"],["瘴气半径: %d","Miasma Radius: %d"],["最大恶魔数：%d","Max Demons: %d"],["利爪腹蛇神庙二层","Claw Viper Temple Level 2"],["利爪蝮蛇神殿一层","Claw Viper Temple Level 1"],["前往神秘的奶牛关","To The Secret Cow Level"],["前往憎恨囚牢三层","To The Durance of Hate Level 3"],["前往憎恨囚牢二层","To The Durance of Hate Level 2"],["前往憎恨囚牢一层","To The Durance of Hate Level 1"],["前往废弃的藏骨室","To The Disused Reliquary"],["前往被毁的礼拜堂","To The Ruined Fane"],["前往被遗忘的神殿","To The Forgotten Temple"],["前往废弃的礼拜堂","To The Disused Fane"],["前往翠绿监牢一层","To The Flayer Dungeon Level 1"],["前往翠绿监牢二层","To The Flayer Dungeon Level 2"],["前往翠绿监牢三层","To The Flayer Dungeon Level 3"],["前往沼泽陷坑三层","To The Swampy Pit Level 3"],["前往沼泽陷坑二层","To The Swampy Pit Level 2"],["前往沼泽陷坑一层","To The Swampy Pit Level 1"],["前往库拉斯特堤道","To The Kurast Causeway"],["前往库拉斯特集市","To The Kurast Bazaar"],["前往库拉斯特海港","To The Kurast Docks"],["前往塔·拉夏之墓","To Tal Rasha's Tomb"],["前往蛆虫巢穴三层","To The Maggot Lair Level 3"],["前往蛆虫巢穴二层","To The Maggot Lair Level 2"],["前往蛆虫巢穴一层","To The Maggot Lair Level 1"],["前往亡者大殿三层","To The Halls of the Dead Level 3"],["前往碎石古墓二层","To The Stony Tomb Level 2"],["前往亡者大殿二层","To The Halls of the Dead Level 2"],["前往亡者大殿一层","To The Halls of the Dead Level 1"],["前往碎石古墓一层","To The Stony Tomb Level 1"],["前往王宫监牢三层","To The Palace Cellar Level 3"],["前往王宫监牢二层","To The Palace Cellar Level 2"],["前往王宫监牢一层","To The Palace Cellar Level 1"],["前往女眷住处二层","To The Harem Level 2"],["前往女眷住处一层","To The Harem Level 1"],["前往地下墓穴四层","To The Catacombs Level 4"],["前往地下墓穴三层","To The Catacombs Level 3"],["前往地下墓穴二层","To The Catacombs Level 2"],["前往地下墓穴一层","To The Catacombs Level 1"],["前往高塔地窖五层","To The Tower Cellar Level 5"],["前往高塔地窖四层","To The Tower Cellar Level 4"],["前往高塔地窖三层","To The Tower Cellar Level 3"],["前往高塔地窖二层","To The Tower Cellar Level 2"],["前往高塔地窖一层","To The Tower Cellar Level 1"],["前往被遗忘的高塔","To The Forgotten Tower"],["前往地下通道二层","To Underground Passage Level 2"],["前往地下通道一层","To Underground Passage Level 1"],["世界之石要塞一层","Worldstone Keep Level 1"],["世界之石要塞二层","Worldstone Keep Level 2"],["世界之石要塞三层","Worldstone Keep Level 3"],["前往世界之石大殿","To The Worldstone Chamber"],["进入地下通道一层","Entering The Underground Passage Level 1"],["进入地下通道二层","Entering The Underground Passage Level 2"],["进入被遗忘的高塔","Entering The Forgotten Tower"],["进入高塔地窖一层","Entering The Tower Cellar Level 1"],["进入高塔地窖二层","Entering The Tower Cellar Level 2"],["进入高塔地窖三层","Entering The Tower Cellar Level 3"],["进入高塔地窖四层","Entering The Tower Cellar Level 4"],["进入高塔地窖五层","Entering The Tower Cellar Level 5"],["进入地下墓穴一层","Entering The Catacombs Level 1"],["进入地下墓穴二层","Entering The Catacombs Level 2"],["进入地下墓穴三层","Entering The Catacombs Level 3"],["进入地下墓穴四层","Entering The Catacombs Level 4"],["进入女眷住处一层","Entering The Harem Level 1"],["进入女眷住处二层","Entering The Harem Level 2"],["进入王宫监牢一层","Entering The Palace Cellar Level 1"],["进入王宫监牢二层","Entering The Palace Cellar Level 2"],["进入王宫监牢三层","Entering The Palace Cellar Level 3"],["进入碎石古墓一层","Entering The Stony Tomb Level 1"],["进入亡者大殿一层","Entering The Halls of the Dead Level 1"],["进入亡者大殿二层","Entering The Halls of the Dead Level 2"],["进入碎石古墓二层","Entering The Stony Tomb Level 2"],["进入亡者大殿三层","Entering The Halls of the Dead Level 3"],["进入蛆虫巢穴一层","Entering The Maggot Lair Level 1"],["进入蛆虫巢穴二层","Entering The Maggot Lair Level 2"],["进入蛆虫巢穴三层","Entering The Maggot Lair Level 3"],["进入塔·拉夏之墓","Entering Tal Rasha's Tomb"],["进入库拉斯特海港","Entering The Kurast Docks"],["进入库拉斯特集市","Entering The Kurast Bazaar"],["进入库拉斯特堤道","Entering The Kurast Causeway"],["进入沼泽陷坑一层","Entering The Swampy Pit Level 1"],["进入沼泽陷坑二层","Entering The Swampy Pit Level 2"],["进入翠绿监牢一层","Entering The Flayer Dungeon Level 1"],["进入翠绿监牢二层","Entering The Flayer Dungeon Level 2"],["进入沼泽陷坑三层","Entering The Swampy Pit Level 3"],["进入翠绿监牢三层","Entering The Flayer Dungeon Level 3"],["进入废弃的礼拜堂","Entering The Disused Fane"],["进入被遗忘的神殿","Entering The Forgotten Temple"],["进入被毁的礼拜堂","Entering The Ruined Fane"],["进入废弃的藏骨室","Entering The Disused Reliquary"],["进入憎恨囚牢一层","Entering The Durance of Hate Level 1"],["进入憎恨囚牢二层","Entering The Durance of Hate Level 2"],["进入憎恨囚牢三层","Entering The Durance of Hate Level 3"],["进入世界之石大殿","Entering The Worldstone Chamber"],["卡林姆的生命核心","Khalim's Heart"],["墨菲斯托的灵魂石","Mephisto's Soulstone"],["有瑕疵的头骨宝石","Flawed Skull"],["无瑕疵的头骨宝石","Flawless Skull"],["格里斯沃尔德之锋","Griswold's Edge"],["拉扎鲁斯的螺旋杖","Spire of Lazarus"],["格里姆的烈焰亡灵","Grim's Burning Dead"],["夸尔凯克的执行者","Qual-Khek's Enforcer"],["尼布甲尼撒的风暴","Nebuchadnezzar's Storm"],["阿莫蒂斯的操纵者","Amodeus' Manipulator"],["阿斯特隆的陨铁杖","Astreon's Iron Ward"],["阿拉贡的骄阳烈焰","Aragon's Sunfire"],["阿拉贡的冰冷凝视","Aragon's Icy Stare"],["阿拉贡的风暴雷云","Aragon's Storm Cloud"],["战争领主的碾压者","Warlord's Crushers"],["每次消灭恢复法力","Mana After Each Kill (MAEK)"],["每次消灭恢复生命","Life After Each Kill (LAEK)"],["每次击杀恢复法力","Mana After Each Kill (MAEK)"],["每次击杀恢复生命","Life After Each Kill (LAEK)"],["消灭怪物恢复平静","Slain Monsters Rest in Peace"],["对不死生物命中率","AR vs Undead"],["法力恢复速度提高","Regenerate Mana"],["降低所有商人价格","Reduces Vendor Prices"],["几率在攻击时施放","Chance to Cast on Attack"],["几率在击中时施放","Chance to Cast on Striking"],["几率在升级时施放","Chance to Cast on Level-Up"],["几率在死亡时施放","Chance to Cast on Death"],["打孔/拉祖克上限","Socket Caps (Larzuk)"],["术士君临 DLC","Reign of the Warlock DLC"],["白色底材随机打孔","Cube Socket Normal (White) Base Items"],["头环 / 头冠","Circlet / Coronet"],["短杖 / 战杖","Short Staff / War Staff"],["艾尔多的警戒塔","Aldur's Watchtower"],["布尔凯索的子嗣","Bul-Kathos' Children"],["诺吉的古代遗物","Naj's Ancient Vestige"],["西刚的全身甲胄","Sigon's Complete Steel"],["克雷格劳的支柱","Cleglaw's Brace"],["米拉伯佳的王权","Milabrega's Regalia"],["坦克雷的圣战装","Tancred's Battlegear"],["地狱禁卫的意志","Hellwarden's Will"],["安达莉尔的仪容","Andariel's Visage"],["李奥瑞克的臂骨","Arm of King Leoric"],["艾丝屈塔的脾气","Eschuta's Temper"],["萨卡兰姆的使者","Herald of Zakarum"],["迪亚波罗斯之术","Ars Al'Diabolos"],["墨菲斯托斯之术","Ars Dul'Mephistos"],["行刑者的绞首绳","Verdungo's Hearty Cord"],["布尔凯索的婚戒","Bul-Kathos' Wedding Band"],["阿特玛的圣甲虫","Atma's Scarab"],["塔·拉夏的裁决","Tal Rasha's Adjudication"],["塔·拉夏的守护","Tal Rasha's Guardianship"],["不朽之王的意志","Immortal King's Will"],["不朽之王的锤炼","Immortal King's Forge"],["不朽之王的功业","Immortal King's Detail"],["不朽之王的基石","Immortal King's Pillar"],["依森哈特的胸胄","Isenhart's Case"],["依森哈特的号角","Isenhart's Horns"],["依森哈特的格挡","Isenhart's Parry"],["狂战士的半身甲","Berserker's Hauberk"],["萨鲁斯的铁固腰","Hsarus' Iron Stay"],["艾蕾萨的铁围盔","Iratha's Coil"],["艾蕾萨的护颈圈","Iratha's Collar"],["艾蕾萨的袖手套","Iratha's Cuff"],["米拉伯佳的权冠","Milabrega's Diadem"],["米拉伯佳的袍甲","Milabrega's Robe"],["米拉伯佳的权杖","Milabrega's Rod"],["米拉伯佳的宝球","Milabrega's Orb"],["坦克雷的鸦嘴锄","Tancred's Crowbill"],["坦克雷的钉头鞋","Tancred's Hobnails"],["维达拉的扣带靴","Vidala's Fetlock"],["恶魔头盖骨面具","Demonhead"],["头环 / 宝冠","Circlet / Coronet"],["野蛮人专用头盔","Barbarian Helms"],["塔·拉夏的外袍","Tal Rasha's Wrappings"],["布尔凯索的孩子","Bul-Kathos' Children"],["娜吉的古代遗迹","Naj's Ancient Vestige"],["西刚的完整钢铁","Sigon's Complete Steel"],["狂战士的兵工厂","Berserker's Arsenal"],["克雷德劳的装备","Cleglaw's Brace"],["米拉伯佳的战装","Milabrega's Regalia"],["安达利尔的面貌","Andariel's Visage"],["圣堂武士的力量","Templar's Might"],["亚特兰蒂斯之剑","The Atlantean"],["艾斯屈塔的脾气","Eschuta's Temper"],["摩西的祝福圆环","Moser's Blessed Circle"],["维尔登戈的心结","Verdungo's Hearty Cord"],["布·凯索的婚戒","Bul-Kathos' Wedding Band"],["亚特玛的圣甲虫","Atma's Scarab"],["裂骨（破物板）","Bone Break"],["黑裂（破魔板）","Black Cleft"],["塔·拉夏的判决","Tal Rasha's Adjudication"],["不朽之王的熔炉","Immortal King's Forge"],["不朽之王的细节","Immortal King's Detail"],["贝恩的誓约之刃","Bane's Oathmaker"],["依森哈特的招架","Isenhart's Parry"],["狂战士的锁子甲","Berserker's Hauberk"],["克雷德劳的钳子","Cleglaw's Pincers"],["克雷德劳的爪子","Cleglaw's Claw"],["米拉伯佳的宝冠","Milabrega's Diadem"],["米拉伯佳的战袍","Milabrega's Robe"],["米拉伯佳的宝珠","Milabrega's Orb"],["坦克雷的乌鸦嘴","Tancred's Crowbill"],["偏向统治者大盾","Jeweler's Monarch of Deflecting"],["额外金币 EG","of Wealth"],["珠宝匠 3 孔","Jeweler's / Artisan's"],["更快速打击回复","Faster Hit Recovery (FHR)"],["珠宝匠 4 孔","Jeweler's"],["冰冷之原与洞窟","Cold Plains and The Cave"],["黑色荒地与黑洞","Black Marsh and The Hole"],["碎石荒地与石墓","Rocky Waste and Stony Tomb"],["塔·拉夏的古墓","Tal Rasha's Tombs"],["水晶通道与冰河","Crystalline Passage and Frozen River"],["先祖之路与冰窖","Ancient's Way and Icy Cellar"],["半径: %d码","Radius: %d yards"],["持续火焰伤害:","Continuous Fire Damage:"],["吸收%d点伤害","Absorbs %d damage"],["总计%d个骷髅","%d skeletons total"],["范围: %d码","Range: %d yards"],["抵抗元素伤害:","Resist Elemental Damage:"],["已达到最大等级","Maximum Level Reached"],["用火焰强化箭矢","enchants arrows with flame"],["用意念移动物品","moves objects with your mind"],["制造一道闪电弹","creates a bolt of lightning"],["还击远程攻击者","retaliates against ranged attackers"],["冲锋并攻击目标","charge and attack target"],["恐吓附近的怪物","frightens nearby monsters"],["飞旋的死亡之舞","whirling dance of death"],["每等级发射频率","Rate of Fire per Level"],["每等级攻击速度","Attack Speed per Level"],["每等级消耗法力","Mana Cost per Level"],["每等级发射次数","Shots per Level"],["每等级冰冷时间","Cold Length per Level"],["每等级毒素时间","Poison Length per Level"],["%d个骷髅法师","%d skeleton mage"],["基础技能和物品","Basic Skills and Items"],["元素充能伤害:","Elemental Charge-up Damage:"],["暴烈的重殴攻击","fiery, mauling attack"],["制造一道龙卷风","create a tornado"],["投出飞旋的利刃","set a spinning blade"],["投出飞旋的刀刃","throw spinning blades"],["放射闪电的陷阱","a trap that emits lightning"],["喷发火焰的陷阱","trap that sprays fire"],["飞旋的防御刀刃","spinning blades of defense"],["给你的武器上毒","poison your weapon"],["尖刺: %d枚","Spikes: %d"],["作用目标几率:","Chance to afflict target:"],["命中值: %d","Attack Rating: %d"],["治愈: %+d","Heals: %+d"],["伤害: %+d","Damage: %+d"],["射程: %d码","Range: %d yard"],["防御: %+d","Defense: %+d"],["暴击时补充数量","Replenish Quantity on Critical Strike"],["宽度: %d码","Width: %d yards"],["%d个星体武器","%d Astral Weapons"],["被遗忘的藏骨室","Forgotten Reliquary"],["库拉斯特上层区","Upper Kurast"],["库拉斯特下层区","Lower Kurast"],["塔·拉夏的墓室","Tal Rasha's Chamber"],["前往混沌避难所","To The Chaos Sanctuary"],["前往毁灭的神庙","To The Ruined Temple"],["前往神秘避难所","To The Arcane Sanctuary"],["前往下水道三层","To The Sewers Level 3"],["前往下水道二层","To The Sewers Level 2"],["前往下水道一层","To The Sewers Level 1"],["前往修道院大门","To The Monastery Gate"],["前往流亡者营地","To The Rogue Encampment"],["墨菲斯托的丛林","MEPHISTO'S JUNGLE"],["前往阿克隆深渊","To The Pit of Acheron"],["尼拉塞克的神殿","Nihlathak's Temple"],["前往亚瑞特高原","To The Arreat Plateau"],["前往亚瑞特之巅","To The Arreat Summit"],["进入流亡者营地","Entering The Rogue Encampment"],["进入修道院大门","Entering The Monastery Gate"],["进入下水道一层","Entering The Sewers Level 1"],["进入下水道二层","Entering The Sewers Level 2"],["进入下水道三层","Entering The Sewers Level 3"],["进入神秘避难所","Entering The Arcane Sanctuary"],["进入毁灭的神庙","Entering The Ruined Temple"],["进入混沌避难所","Entering Chaos Sanctuary"],["进入亚瑞特高原","Entering The Arreat Plateau"],["进入亚瑞特之巅","Entering The Arreat Summit"],["进入阿克隆深渊","Entering The Pit of Acheron"],["进入主母的巢穴","Entering The Matron's Den"],["进入遗忘的沙丘","Entering The Forgotten Sands"],["进入苦痛的熔炉","Entering The Furnace of Pain"],["鲁·高因下水道","Lut Gholein Sewers"],["库拉斯特下水道","Kurast Sewers"],["兰姆·艾森之书","Lam Esen's Tome"],["有瑕疵的紫宝石","Flawed Amethyst"],["有瑕疵的黄宝石","Flawed Topaz"],["有瑕疵的蓝宝石","Flawed Sapphire"],["有瑕疵的绿宝石","Flawed Emerald"],["有瑕疵的红宝石","Flawed Ruby"],["碎裂的头骨宝石","Chipped Skull"],["完美的头骨宝石","Perfect Skull"],["瑞克撒特的挽歌","Rixot's Keen"],["马哈姆橡木珍品","The Mahim-Oak Curio"],["巴图克的割喉爪","Bartuc's Cut-Throat"],["墨菲斯托的智慧","Mephisto's Brain"],["扭曲的痛苦精华","Twisted Essence of Suffering"],["充能的憎恨精华","Charged Essence of Hatred"],["燃烧的恐惧精华","Burning Essence of Terror"],["腐烂的毁灭精华","Festering Essence of Destruction"],["保存完好的头骨","Preserved Head"],["战争领主的信赖","Warlord's Trust"],["格罗尼莫的怒火","Geronimo's Fury"],["布尔凯索的力量","Bul-Kathos' Might"],["阿拉丁的开膛者","Aladdin's Eviscerator"],["埃里昂的骨柄剑","Erion's Bonehandle"],["默多克的掠夺者","Mordoc's Marauder"],["塔尔博德的律法","Talberd's Law"],["霍拉松的圣餐杯","Horazon's Chalice"],["萨卡兰姆的拯救","Zakarum's Salvation"],["地平线的龙卷风","Horizon's Tornado"],["北方人的碎肉棒","Nord's Tenderizer"],["异教徒的仪式刀","Pagan's Athame"],["塞缪尔的照看者","Samuel's Caretaker"],["莱斯特隆的标记","Lestron's Mark"],["基尔克的避难地","Gerke's Sanctuary"],["罗达门特的领地","Radament's Sphere"],["地狱禁卫的躯壳","Hell Warden's Husk"],["死亡女神的统治","Halaberd's Reign"],["帕克索尔的沉着","Parkersor's Calm"],["布尔凯索的守护","Bul-Kathos' Warden"],["布尔凯索的监护","Bul-Kathos' Custodian"],["弗娄克拉的怒嚎","Flowkrad's Howl"],["弗娄克拉的笑容","Flowkrad's Grin"],["弗娄克拉的皮毛","Flowkrad's Fur"],["弗娄克拉的利爪","Flowkrad's Paws"],["弗娄克拉的肌腱","Flowkrad's Sinew"],["沙卡布拉的难题","Shakabra's Crux"],["维兹杰雷的焦点","Foci of the Vizjerei"],["阿卡拉特保卫者","Akarat's Protector"],["金瑟的破空之痕","Ginther's Rift"],["麦克奥雷的迷信","McAuley's Superstition"],["麦克奥雷的禁忌","McAuley's Taboo"],["麦克奥雷的基石","McAuley's Basis"],["麦克奥雷的誓言","McAuley's Pledge"],["麦克奥雷的愚行","McAuley's Folly"],["战争领主的荣耀","Warlord's Glory"],["战争领主的欲望","Warlord's Lust"],["战争领主的征服","Warlord's Conquest"],["战争领主的斗篷","Warlord's Mantle"],["战争领主的权威","Warlord's Authority"],["布尔凯索的噩梦","Bul-Kathos' Nightmare"],["沃鲁斯克的终结","Worusk's End"],["精华/赦免之证","Essence / Token of Absolution"],["潜在的寒冰裂口","Latent Cold Rupture"],["焕新的寒冰裂口","Renewed Cold Rupture"],["潜在的火焰裂隙","Latent Flame Rift"],["焕新的火焰裂隙","Renewed Flame Rift"],["潜在的天堂裂痕","Latent Crack of the Heavens"],["焕新的天堂裂痕","Renewed Crack of the Heavens"],["潜在的腐烂裂迹","Latent Rotting Fissure"],["焕新的腐烂裂迹","Renewed Rotting Fissure"],["潜在的白骨裂纹","Latent Bone Break"],["焕新的白骨裂纹","Renewed Bone Break"],["潜在的漆黑裂痕","Latent Black Cleft"],["焕新的漆黑裂痕","Renewed Black Cleft"],["更快速施法速度","Faster Cast Rate (FCR)"],["更快速格挡速度","Faster Block Rate (FBR)"],["伤害转化为法力","Dmg Taken Goes to Mana"],["对不死生物伤害","Dmg to Undead"],["对远程攻击防御","Def vs Missiles"],["对近战攻击防御","Def vs Melee"],["攻击者受到伤害","Attacker Takes Dmg of"],["击中使怪物逃跑","Hit Causes Monster to Flee"],["非赛/赛季通用","Non-Ladder / Ladder"],["南部世界石碎片","Southern Worldstone Shard"],["北部世界石碎片","Northern Worldstone Shard"],["东部世界石碎片","Eastern Worldstone Shard"],["西部世界石碎片","Western Worldstone Shard"],["深层世界石碎片","Deep Worldstone Shard"],["地表暗黑破坏神","Diablo Clone"],["超级暗黑破坏神","Diablo Clone"],["蓝/黄/橙通用","Magic/Rare/Craft"],["#24 伊司特","#24 Ist"],["#26 伐克斯","#26 Vex"],["深海巨妖之壳","Kraken Shell"],["塔格奥的化身","Trang-Oul's Avatar"],["娜塔亚的杀意","Natalya's Odium"],["霍拉松的辉煌","Horazon's Splendor"],["狂战士的兵械","Berserker's Arsenal"],["希弗伯的法衣","Civerb's Vestments"],["萨鲁斯的防御","Hsarus' Defense"],["艾蕾萨的华服","Iratha's Finery"],["维达拉的配装","Vidala's Rig"],["阿卡娜的诡计","Arcanna's Tricks"],["吸能鬼的凝视","Vampire Gaze"],["蝮蛇法妖之皮","Skin of the Vipermagi"],["诗寇蒂的愤怒","Skullder's Ire"],["魁黑刚的智慧","Que-Hegan's Wisdom"],["奥玛斯的法袍","Ormus' Robes"],["阿凯尼的荣耀","Arkaine's Valor"],["角斗士的祸根","The Gladiator's Bane"],["圣殿骑士之力","Templar's Might"],["泰瑞尔的力量","Tyrael's Might"],["阿里巴巴之刃","Blade of Ali Baba"],["亚特兰蒂斯剑","The Atlantean"],["行刑者的裁决","Executioner's Justice"],["吸能圣王之圈","Nosferatu's Coil"],["马纳德的治疗","Manald Heal"],["大自然的安宁","Nature's Peace"],["玛拉的万花筒","Mara's Kaleidoscope"],["塔格奥的伪装","Trang-Oul's Guise"],["塔格奥的鳞片","Trang-Oul's Scales"],["塔格奥的飞翼","Trang-Oul's Wing"],["塔格奥的利爪","Trang-Oul's Claws"],["塔格奥的肚带","Trang-Oul's Girth"],["艾尔多的欺骗","Aldur's Deception"],["艾尔多的律动","Aldur's Rhythm"],["艾尔多的成长","Aldur's Advance"],["艾维娜的真视","M'avina's True Sight"],["艾维娜的拥抱","M'avina's Embrace"],["艾维娜的施展","M'avina's Caster"],["艾维娜的冰握","M'avina's Icy Clutch"],["艾维娜的教义","M'avina's Tenet"],["娜塔亚的徽记","Natalya's Totem"],["娜塔亚的阴影","Natalya's Shadow"],["娜塔亚的标记","Natalya's Mark"],["娜塔亚的灵魂","Natalya's Soul"],["霍拉松的面容","Horazon's Countenance"],["霍拉松的统治","Horazon's Dominion"],["霍拉松的握持","Horazon's Hold"],["霍拉松的传承","Horazon's Legacy"],["霍拉松的秘密","Horazon's Secrets"],["祸殃怨魂之肤","Bane's Wraithskin"],["惠斯坦的警戒","Whistan's Guard"],["雄主的皮手套","Magnus' Skin"],["解慕苏的坚定","Haemosu's Adamant"],["诺吉的轻铠甲","Naj's Light Plate"],["诺吉的解密棒","Naj's Puzzler"],["西刚的木底鞋","Sigon's Sabot"],["狂战士的头盔","Berserker's Headgear"],["狂战士的手斧","Berserker's Hatchet"],["希弗伯的短棍","Civerb's Cudgel"],["希弗伯的圣像","Civerb's Icon"],["希弗伯的防护","Civerb's Ward"],["克雷格劳之牙","Cleglaw's Tooth"],["克雷格劳之钳","Cleglaw's Pincers"],["克雷格劳之爪","Cleglaw's Claw"],["萨鲁斯的铁拳","Hsarus' Iron Fist"],["萨鲁斯的铁踵","Hsarus' Iron Heel"],["艾蕾萨的束带","Iratha's Cord"],["坦克雷的头骨","Tancred's Skull"],["坦克雷的支柱","Tancred's Spine"],["坦克雷的怪诞","Tancred's Weird"],["维达拉的倒刺","Vidala's Barb"],["维达拉的突袭","Vidala's Ambush"],["维达拉的陷阱","Vidala's Snare"],["阿卡娜的外壳","Arcanna's Flesh"],["阿卡娜的符号","Arcanna's Sign"],["圣堂武士外衣","Templar Coat"],["巨型鳞铠胸甲","Great Hauberk"],["巨魔巢穴古盾","Troll Nest"],["艾尔多的守卫","Aldur's Watchtower"],["娜塔亚的憎恨","Natalya's Odium"],["赫拉森的荣耀","Horazon's Splendor"],["牛魔王的皮甲","Cow King's Hide"],["克维伯的法衣","Civerb's Vestments"],["依雷撒的仪容","Iratha's Finery"],["坦克雷的战装","Tancred's Battlegear"],["维达拉的装束","Vidala's Rig"],["毕格因的软帽","Biggin's Bonnet"],["吸血鬼的凝视","Vampire Gaze"],["亚瑞特的面容","Arreat's Face"],["谢夫特斯坦布","Shaftstop"],["奥玛斯的长袍","Ormus' Robes"],["核瞳（眼球）","The Oculus"],["处决者之裁决","Executioner's Justice"],["撒卡兰姆使者","Herald of Zakarum"],["侏儒（魔胎）","Homunculus"],["迪亚波罗秘典","Ars Al'Diabolos"],["墨菲斯托秘典","Ars Dul'Mephistos"],["吸血圣王之圈","Nosferatu's Coil"],["玛那得的治疗","Manald Heal"],["马拉的万花筒","Mara's Kaleidoscope"],["不朽之王的柱","Immortal King's Pillar"],["塔格奥的鳞甲","Trang-Oul's Scales"],["塔格奥的魔翼","Trang-Oul's Wing"],["塔格奥的束带","Trang-Oul's Girth"],["艾尔多的欺瞒","Aldur's Deception"],["艾尔多的韵律","Aldur's Rhythm"],["马维娜的拥抱","M'avina's Embrace"],["马维娜的施展","M'avina's Caster"],["马维娜的冰握","M'avina's Icy Clutch"],["马维娜的教义","M'avina's Tenet"],["娜塔亚的图腾","Natalya's Totem"],["娜塔亚的印记","Natalya's Mark"],["赫拉森的面容","Horazon's Countenance"],["赫拉森的统治","Horazon's Dominion"],["赫拉森的掌控","Horazon's Hold"],["赫拉森的传承","Horazon's Legacy"],["赫拉森的秘辛","Horazon's Secrets"],["贝恩的鬼灵皮","Bane's Wraithskin"],["马格纳斯之皮","Magnus' Skin"],["黑摩苏的坚毅","Haemosu's Adamant"],["泰邦克之荣耀","Taebaek's Glory"],["娜吉的解谜者","Naj's Puzzler"],["牛魔王的牛角","Cow King's Horns"],["牛魔王的蹄铁","Cow King's Hooves"],["西刚的护身甲","Sigon's Shelter"],["依森哈特的框","Isenhart's Case"],["狂战士的头饰","Berserker's Headgear"],["克维伯的短棍","Civerb's Cudgel"],["克维伯的符号","Civerb's Icon"],["克维伯的庇护","Civerb's Ward"],["克雷德劳之牙","Cleglaw's Tooth"],["依雷撒的线圈","Iratha's Coil"],["依雷撒的项圈","Iratha's Collar"],["依雷撒的袖口","Iratha's Cuff"],["依雷撒的绳索","Iratha's Cord"],["坦克雷的骷髅","Tancred's Skull"],["坦克雷的脊柱","Tancred's Spine"],["坦克雷的步履","Tancred's Hobnails"],["维达拉的埋伏","Vidala's Ambush"],["维达拉的圈套","Vidala's Snare"],["维达拉的脚镣","Vidala's Fetlock"],["阿卡娜的血肉","Arcanna's Flesh"],["全抗（棱镜）","Prismatic"],["敏捷（完美）","of Perfection"],["精力（巫师）","of Sorcery"],["寻宝率 MF","of Fortune"],["力量（泰坦）","of the Titan"],["敏捷（精准）","of Precision"],["生命（巨像）","of the Colossus"],["全抗（微光）","Scintillating"],["命中率 AR","Platinum"],["技工 2 孔","Mechanic's"],["提高攻击速度","Increased Attack Speed (IAS)"],["力量（巨人）","of the Giant"],["残忍强化伤害","Cruel"],["大师强化伤害","Master's"],["自动恢复耐久","of Self-Repair"],["鲁高因下水道","Lut Gholein Sewers"],["%d%%几率","%d%% chance"],["%d枚电荷弹","%d bolts"],["生命: %d","Life: %d"],["敌人逃跑持续","Enemy runs for"],["目标迟滞持续","Target stutters for"],["保持目标持续","Remains target for"],["闪电球伤害:","Lightning Bolt Damage:"],["降低最大抗性","Lowers Maximum Resistances"],["创造魔法箭矢","creates a magical arrow"],["射出多枚箭矢","fires multiple arrows"],["附加闪电伤害","adds lightning damage"],["附加毒素伤害","adds poison damage"],["复生骷髅法师","Raise Skeletal Mage"],["强化你的盾牌","enhances your shield"],["目标已被放逐","target is banished"],["提高技能等级","increases skill levels"],["城镇传送卷轴","Scroll of Town Portal"],["城镇传送之书","Tome of Town Portal"],["吸收%d%%","Absorbs %d%%"],["每等级飞弹数","Missiles per Level"],["每等级箭矢数","Bolts per Level"],["每等级+1枚","+1 Bolt per Level"],["毒素和白骨术","Poison and Bone"],["%d暴击几率","%d Percent Chance of Critical Strike"],["释放烈焰混乱","unleash fiery chaos"],["抵御元素伤害","shield from elemental damage"],["召唤一个狼灵","summon a wolverine spirit"],["制造一口火山","create a volcano"],["召唤一个棘灵","summon a spirit pet of thorns"],["召唤一头灰熊","summon a grizzly bear"],["投掷火焰炸弹","throw a fire bomb"],["投掷一张电网","throw a web of lightning"],["致盲你的敌人","blind your enemies"],["暂时抵抗所有","temporary resist all"],["召唤你的影子","summon your shadow"],["1次充能 -","Charge 1 -"],["2次充能 -","Charge 2 -"],["3次充能 -","Charge 3 -"],["防御: %d","Defense: %d"],["怪物: %d","Monsters: %d"],["符徽: 迟缓","Sigil: Lethargy"],["符徽: 怨恨","Sigil: Rancor"],["符徽: 死亡","Sigil: Death"],["咒术: 灾祸","Hex: Bane"],["咒术: 吸取","Hex: Siphon"],["咒术: 净化","Hex: Purge"],["伤害提升%d","Damage Increased by %d"],["神秘的奶牛关","The Secret Cow Level"],["憎恨囚牢三层","Durance of Hate Level 3"],["憎恨囚牢二层","Durance of Hate Level 2"],["憎恨囚牢一层","Durance of Hate Level 1"],["废弃的藏骨室","Disused Reliquary"],["被毁的礼拜堂","Ruined Fane"],["被遗忘的神殿","Forgotten Temple"],["废弃的礼拜堂","Disused Fane"],["翠绿监牢三层","Flayer Dungeon Level 3"],["翠绿监牢二层","Flayer Dungeon Level 2"],["翠绿监牢一层","Flayer Dungeon Level 1"],["沼泽陷坑三层","Swampy Pit Level 3"],["沼泽陷坑二层","Swampy Pit Level 2"],["沼泽陷坑一层","Swampy Pit Level 1"],["库拉斯特堤道","Kurast Causeway"],["库拉斯特集市","Kurast Bazaar"],["库拉斯特海港","Kurast Docks"],["塔·拉夏之墓","Tal Rasha's Tomb"],["蛆虫巢穴三层","Maggot Lair Level 3"],["蛆虫巢穴二层","Maggot Lair Level 2"],["蛆虫巢穴一层","Maggot Lair Level 1"],["亡者大殿三层","Halls of the Dead Level 3"],["碎石古墓二层","Stony Tomb Level 2"],["亡者大殿二层","Halls of the Dead Level 2"],["亡者大殿一层","Halls of the Dead Level 1"],["碎石古墓一层","Stony Tomb Level 1"],["王宫监牢三层","Palace Cellar Level 3"],["王宫监牢二层","Palace Cellar Level 2"],["王宫监牢一层","Palace Cellar Level 1"],["女眷住处二层","Harem Level 2"],["女眷住处一层","Harem Level 1"],["利爪蝮蛇神殿","Claw Viper Temple"],["前往火焰之河","To The River of Flame"],["前往外域荒原","To The Outer Steppes"],["前往绝望平原","To The Plains of Despair"],["前往神罚之城","To The City of the Damned"],["前往混沌要塞","To The Pandemonium Fortress"],["前往巨蛛巢穴","To The Arachnid Lair"],["前往蜘蛛洞穴","To The Spider Cavern"],["前往翠绿丛林","To The Flayer Jungle"],["前往庞大湿地","To The Great Marsh"],["前往蜘蛛森林","To The Spider Forest"],["前往古代水道","To The Ancient Tunnels"],["前往法师峡谷","To The Canyon of the Magi"],["前往群蛇峡谷","To The Valley of Snakes"],["前往失落之城","To The Lost City"],["前往偏远绿洲","To The Far Oasis"],["前往干燥高地","To The Dry Hills"],["前往碎石荒野","To The Rocky Waste"],["前往鲁·高因","To Lut Gholein"],["地下墓穴四层","Catacombs Level 4"],["地下墓穴三层","Catacombs Level 3"],["地下墓穴二层","Catacombs Level 2"],["地下墓穴一层","Catacombs Level 1"],["高塔地窖五层","Tower Cellar Level 5"],["高塔地窖四层","Tower Cellar Level 4"],["高塔地窖三层","Tower Cellar Level 3"],["高塔地窖二层","Tower Cellar Level 2"],["高塔地窖一层","Tower Cellar Level 1"],["被遗忘的高塔","Forgotten Tower"],["地下通道二层","Underground Passage Level 2"],["地下通道一层","Underground Passage Level 1"],["前往崔斯特姆","To Tristram"],["前往内侧回廊","To The Inner Cloister"],["前往监牢三层","To The Jail Level 3"],["前往监牢二层","To The Jail Level 2"],["前往监牢一层","To The Jail Level 1"],["前往外侧回廊","To The Outer Cloister"],["前往埋骨之地","To The Burial Grounds"],["前往深渊二层","To The Pit Level 2"],["前往洞坑二层","To The Hole Level 2"],["前往洞穴二层","To The Cave Level 2"],["前往深渊一层","To The Pit Level 1"],["前往洞坑一层","To The Hole Level 1"],["前往洞穴一层","To The Cave Level 1"],["前往邪恶洞穴","To The Den of Evil"],["前往泰摩高地","To The Tamoe Highland"],["前往黑色沼泽","To The Black Marsh"],["前往黑暗森林","To The Dark Wood"],["前往石块旷野","To The Stony Field"],["前往冰冷之原","To The Cold Plains"],["前往精华荒地","To The Blood Moor"],["前往炼狱深渊","To The Infernal Pit"],["世界之石大殿","The Worldstone Chamber"],["前往哈洛加斯","To Harrogath"],["前往嗜战丘陵","To The Bloody Foothills"],["前往冰冻高地","To The Frigid Highlands"],["前往水晶通道","To The Crystalline Passage"],["前往冰冻之河","To The Frozen River"],["前往冰川小径","To The Glacial Trail"],["前往漂流洞窟","To The Drifter Cavern"],["前往冰冻苔原","To The Frozen Tundra"],["前往先祖之路","To The Ancients' Way"],["前往寒冰地窖","To The Icy Cellar"],["前往痛楚大厅","To The Halls of Anguish"],["前往苦痛大厅","To The Halls of Pain"],["前往折磨大厅","To The Halls of Torment"],["前往沃特大厅","To The Halls of Vaught"],["前往毁灭王座","To The Throne of Destruction"],["进入精华荒地","Entering The Blood Moor"],["进入冰冷之原","Entering The Cold Plains"],["进入石块旷野","Entering The Stony Field"],["进入黑暗森林","Entering The Dark Wood"],["进入黑色沼泽","Entering The Black Marsh"],["进入泰摩高地","Entering The Tamoe Highland"],["进入邪恶洞穴","Entering The Den of Evil"],["进入洞穴一层","Entering The Cave Level 1"],["进入洞坑一层","Entering The Hole Level 1"],["进入深渊一层","Entering The Pit Level 1"],["进入洞穴二层","Entering The Cave Level 2"],["进入洞坑二层","Entering The Hole Level 2"],["进入深渊二层","Entering The Pit Level 2"],["进入埋骨之地","Entering The Burial Grounds"],["进入外侧回廊","Entering The Outer Cloister"],["进入监牢一层","Entering The Jail Level 1"],["进入监牢二层","Entering The Jail Level 2"],["进入监牢三层","Entering The Jail Level 3"],["进入内侧回廊","Entering The Inner Cloister"],["进入崔斯特姆","Entering Tristram"],["进入哞哞农场","Entering The Moo Moo Farm"],["进入鲁·高因","Entering Lut Gholein"],["进入碎石荒野","Entering The Rocky Waste"],["进入干燥高地","Entering The Dry Hills"],["进入偏远绿洲","Entering The Far Oasis"],["进入失落之城","Entering The Lost City"],["进入群蛇峡谷","Entering The Valley of Snakes"],["进入法师峡谷","Entering The Canyon of the Magi"],["进入古代水道","Entering The Ancient Tunnels"],["进入蜘蛛森林","Entering The Spider Forest"],["进入庞大湿地","Entering The Great Marsh"],["进入翠绿丛林","Entering The Flayer Jungle"],["进入巨蛛巢穴","Entering The Arachnid Lair"],["进入蜘蛛洞穴","Entering The Spider Cavern"],["进入混沌要塞","Entering The Pandemonium Fortress"],["进入外域荒原","Entering The Outer Steppes"],["进入绝望平原","Entering The Plains of Despair"],["进入神罚之城","Entering The City of the Damned"],["进入火焰之河","Entering The River of Flame"],["进入哈洛加斯","Entering Harrogath"],["进入嗜战丘陵","Entering The Bloody Foothills"],["进入冰冻高地","Entering The Frigid Highlands"],["进入水晶通道","Entering The Crystalline Passage"],["进入冰冻之河","Entering The Frozen River"],["进入冰川小径","Entering The Glacial Trail"],["进入漂流洞窟","Entering The Drifter Cavern"],["进入冰冻苔原","Entering The Frozen Tundra"],["进入先祖之路","Entering The Ancients' Way"],["进入寒冰地窖","Entering The Icy Cellar"],["进入痛楚大厅","Entering The Halls of Anguish"],["进入苦痛大厅","Entering The Halls of Pain"],["进入沃特大厅","Entering The Halls of Vaught"],["进入炼狱深渊","Entering The Infernal Pit"],["进入毁灭王座","Entering The Throne of Destruction"],["世界之石要塞","Worldstone Keep"],["前往巨像之巅","To The Colossal Summit"],["进入巨像之巅","Entering The Colossal Summit"],["卡林姆的连枷","Khalim's Flail"],["卡林姆的意志","Khalim's Will"],["卡林姆的晶体","Khalim's Eye"],["卡林姆的智慧","Khalim's Brain"],["呛息毒气药水","Strangling Gas Potion"],["窒息毒气药水","Choking Gas Potion"],["恶臭毒气药水","Rancid Gas Potion"],["赫拉迪姆之锤","Horadric Malus"],["地狱熔炉之锤","Hell Forge Hammer"],["赫拉迪姆法杖","Horadric Staff"],["完全复苏药水","Full Rejuvenation Potion"],["艾尼弗斯卷轴","Scroll of Inifuss"],["赫拉迪姆魔盒","Horadric Cube"],["赫拉迪姆卷轴","Horadric Scroll"],["碎裂的紫宝石","Chipped Amethyst"],["无瑕的紫宝石","Flawless Amethyst"],["完美的紫宝石","Perfect Amethyst"],["碎裂的黄宝石","Chipped Topaz"],["无瑕的黄宝石","Flawless Topaz"],["完美的黄宝石","Perfect Topaz"],["碎裂的蓝宝石","Chipped Sapphire"],["无瑕的蓝宝石","Flawless Sapphire"],["完美的蓝宝石","Perfect Sapphire"],["碎裂的绿宝石","Chipped Emerald"],["无瑕的绿宝石","Flawless Emerald"],["完美的绿宝石","Perfect Emerald"],["碎裂的红宝石","Chipped Ruby"],["无瑕的红宝石","Flawless Ruby"],["完美的红宝石","Perfect Ruby"],["有瑕疵的钻石","Flawed Diamond"],["初级治疗药水","Minor Healing Potion"],["次级治疗药水","Light Healing Potion"],["高级治疗药水","Greater Healing Potion"],["超级治疗药水","Super Healing Potion"],["初级法力药水","Minor Mana Potion"],["次级法力药水","Light Mana Potion"],["高级法力药水","Greater Mana Potion"],["超级法力药水","Super Mana Potion"],["将军的短连枷","The General's Tan Do Li Ga"],["克林茨的肉叉","Skewer of Krintiz"],["金麦尔的锥子","Kinemil's Awl"],["迪马克的劈斧","Dimoak's Hew"],["贝弗提的壁垒","Bverrit Keep"],["克索恩的征途","Treads of Cthon"],["诺克兰的遗物","Nokozan Relic"],["凯恩的绞刑架","Cain's Gibbet"],["霍拉松的日志","Horazon's Journal"],["迪亚波罗的角","Diablo's Horn"],["战斗缠刃拳套","Battle Cestus"],["吸能鬼骨手套","Vampirebone Gloves"],["吸能鬼牙腰带","Vampirefang Belt"],["阿卡兰轻圆盾","Akaran Rondache"],["精华领主颅骨","Bloodlord Skull"],["屠夫的剁肉刀","Butcher's Cleaver"],["萨卡兰姆之手","Zakarum's Hand"],["贝希尔的漩涡","Baezil's Vortex"],["卡林姆的复仇","Khalim's Vengeance"],["艾里欧克之针","Arioc's Needle"],["因迭戈的幻想","Indiego's Fancy"],["泰瑞尔的怜悯","Tyrael's Mercy"],["华莱士的眼泪","Wallace's Tear"],["圣柯库的复生","Sankekur's Resurrection"],["猎头者的荣耀","Head Hunter's Glory"],["炽天使的圣歌","Seraph's Hymn"],["大天使的拯救","Arch-angel's Deliverance"],["拉苏克的勇士","Larzuk's Champion"],["美杜莎的凝视","Medusa's Gaze"],["阿特玛的哭喊","Atma's Wail"],["艾席拉的铁胄","Asheara's Wired Frame"],["瓦瑞夫的护盾","Warriv's Warder"],["梅塔莱的腰带","Metalite's Girth"],["希嘉德的潜行","Siggard's Stealth"],["吉莉安的火盆","Gillian's Brazier"],["阿尔玛的沉思","Alma's Reflection"],["撒拉森的胜机","Saracen's Chance"],["塔格奥的面具","Trang-Oul's Mask"],["奥古恩的怒容","Ogun's Fierce Visage"],["奥古恩的阴影","Ogun's Shadow"],["奥古恩的鞭笞","Ogun's Lash"],["奥古恩的复仇","Ogun's Vengeance"],["艾尔多的护手","Aldur's Gauntlet"],["阿拉贡的杰作","Aragon's Masterpiece"],["莱姗德的远击","Lycander's Aim"],["巴图克的砍杀","Bartuc's Chop Chop"],["药剂师的小包","Apothecary's Tote"],["维兹杰雷法球","Globe of the Vizjerei"],["被冰冻的安雅","Frozen Anya"],["莱姗德的侧击","Lycander's Flank"],["保卫者科里克","Korlic the Protector"],["守护者马道克","Madawc the Guardian"],["防御者塔力克","Talic the Defender"],["塔力克的痛苦","Talic's Anguish"],["科里克的痛楚","Korlic's Pain"],["马道克的愤怒","Madawc's Ire"],["钥匙（普通）","Keys (Regular)"],["更快速格挡率","Faster Block Rate (FBR)"],["提高格挡几率","Increased Chance of Blocking"],["击杀恢复法力","Mana After Each Kill"],["击杀恢复生命","Life After Each Kill"],["击中偷取生命","Life Stolen per Hit (LL)"],["击中偷取法力","Mana Stolen per Hit (ML)"],["所有技能等级","to All Skills"],["武器增强伤害","Weapon Enhanced Damage"],["防具强化防御","Armor Enhanced Defense"],["敌人火焰抗性","Enemy Fire Res"],["敌人闪电抗性","Enemy Lightning Res"],["敌人冰冷抗性","Enemy Cold Res"],["敌人毒素抗性","Enemy Poison Res"],["敌人魔法抗性","Enemy Magic Res"],["敌人物理抗性","Enemy Physical Res"],["火焰技能伤害","Fire Skill Dmg"],["闪电技能伤害","Lightning Skill Dmg"],["冰冷技能伤害","Cold Skill Dmg"],["毒素技能伤害","Poison Skill Dmg"],["魔法技能伤害","Magic Skill Dmg"],["最大火焰抗性","Max Fire Resist"],["最大闪电抗性","Max Lightning Resist"],["最大冰冷抗性","Max Cold Resist"],["最大毒素抗性","Max Poison Resist"],["火焰抗性上限","Max Fire Res"],["闪电抗性上限","Max Lightning Res"],["冰冷抗性上限","Max Cold Res"],["毒素抗性上限","Max Poison Res"],["所有抗性上限","Max All Res"],["物理伤害减免","Physical Dmg Reduced"],["物理伤害减少","Physical Damage Reduced by"],["魔法伤害减免","Magic Dmg Reduced"],["魔法伤害减少","Magic Damage Reduced by"],["减少魔法伤害","Magic Dmg Reduced"],["无视目标防御","Ignore Target's Defense"],["防止怪物治疗","Prevent Monster Heal"],["半数冰冻时间","Half Freeze Duration"],["冰冻时间减半","Half Freeze Duration"],["毒素时间缩短","Poison Length Reduced"],["对恶魔命中率","AR vs Demons"],["生命上限提高","Increase Max Life"],["法力上限提高","Increase Max Mana"],["攻击者受伤害","Attacker Takes Dmg of"],["受击者受电伤","Attacker Takes Light Dmg"],["额外金币获得","Extra Gold (EG)"],["商人价格降低","Reduces Vendor Prices"],["击中致盲目标","Hit Blinds Target"],["移动速度惩罚","Speed Penalty"],["术士 DLC","Warlock DLC"],["地狱恐怖地带","Hell Terror Zones"],["超级崔斯特姆","Uber Tristram"],["偷取生命诅咒","Life Tap"],["神圣冲击灵气","Holy Shock Aura"],["神圣冰冻灵气","Holy Freeze Aura"],["#10 图尔","#10 Thul"],["#11 安姆","#11 Amn"],["#12 索尔","#12 Sol"],["#13 沙伊","#13 Shael"],["#14 多尔","#14 Dol"],["#15 海尔","#15 Hel"],["#16 艾欧","#16 Io"],["#17 卢姆","#17 Lum"],["#19 法尔","#19 Fal"],["#20 兰姆","#20 Lem"],["#21 普尔","#21 Pul"],["#22 乌姆","#22 Um"],["#23 玛尔","#23 Mal"],["#25 古尔","#25 Gul"],["#27 欧姆","#27 Ohm"],["#31 扎哈","#31 Jah"],["#32 查姆","#32 Cham"],["#33 佐德","#33 Zod"],["全身板链甲","Full Plate Mail"],["圣殿骑士铠","Templar Coat"],["统治者板甲","Archon Plate"],["统治者大盾","Monarch"],["阿卡兰小盾","Akaran Targe"],["神圣轻圆盾","Sacred Rondache"],["库拉斯特盾","Kurast Shield"],["萨卡兰姆盾","Zakarum Shield"],["仕女长之弓","Grand Matron Bow"],["统治者之杖","Archon Staff"],["孤儿的号令","Orphan's Call"],["桓因的威严","Hwanin's Majesty"],["山德的愚行","Sanders' Folly"],["牛魔王之革","Cow King's Leathers"],["天使的装束","Angelic Raiment"],["卡珊的计谋","Cathan's Traps"],["死神的伪装","Death's Disguise"],["女武神之翼","Valkyrie Wing"],["黑牛角面甲","Blackhorn's Face"],["奇拉的守护","Kira's Guardian"],["亚瑞特之貌","Arreat's Face"],["乌鸦的智慧","Ravenlore"],["灵体守护者","Spirit Keeper"],["抽动的挣扎","Twitchthroe"],["督瑞尔之壳","Duriel's Shell"],["肋骨粉碎者","Ribcracker"],["泰坦的复仇","Titan's Revenge"],["墓穴劫掠者","Tomb Reaver"],["死亡切肉斧","Death Cleaver"],["巴洛斯之术","Ars Tor'Baalos"],["德古拉之握","Dracul's Grasp"],["哥布林之趾","Goblin Toe"],["基德的赌注","Gheed's Wager"],["纳格尔之戒","Nagelring"],["艾利奇之眼","The Eye of Etlich"],["基德的好运","Gheed's Fortune"],["防御者之火","Defender's Fire"],["防御者之怒","Defender's Bile"],["保卫者之霜","Protector's Frost"],["保卫者之石","Protector's Stone"],["守护者之雷","Guardian's Thunder"],["守护者之光","Guardian's Light"],["祸殃立誓者","Bane's Oathmaker"],["威廉的威容","Guillaume's Face"],["威廉的骄傲","Wilhelm's Pride"],["温达的全灵","Ondal's Almighty"],["覃君的教导","Dangoon's Teaching"],["泰白的荣耀","Taebaek's Glory"],["桓因的壮美","Hwanin's Splendor"],["桓因的庇佑","Hwanin's Refuge"],["桓因的圣裁","Hwanin's Justice"],["桓因的祝福","Hwanin's Blessing"],["诺吉的头环","Naj's Circlet"],["山德的崇拜","Sander's Paragon"],["山德的迷信","Sander's Superstition"],["山德的禁忌","Sander's Taboo"],["山德的石碓","Sander's Riprap"],["牛魔王之角","Cow King's Horns"],["牛魔王之皮","Cow King's Hide"],["牛魔王之蹄","Cow King's Hooves"],["西刚的面甲","Sigon's Visor"],["西刚的遮蔽","Sigon's Shelter"],["西刚的守护","Sigon's Guard"],["西刚的挑战","Sigon's Gage"],["西刚的腰带","Sigon's Wrap"],["天使的镰刀","Angelic Sickle"],["天使的披风","Angelic Mantle"],["天使的光环","Angelic Halo"],["天使的飞翼","Angelic Wings"],["卡珊的面甲","Cathan's Visage"],["卡珊的札甲","Cathan's Mesh"],["卡珊的统治","Cathan's Rule"],["卡珊的符徽","Cathan's Sigil"],["卡珊的印章","Cathan's Seal"],["阿卡娜的头","Arcanna's Head"],["线羊毛皮甲","Wire Fleece"],["钻石锁子甲","Diamond Mail"],["炎魔皮板甲","Balrog Skin"],["执政官铠甲","Archon Plate"],["阿卡拉小盾","Akaran Targe"],["撒卡兰姆盾","Zakarum Shield"],["巨型长柄斧","Great Poleaxe"],["女族长之矛","Matriarchal Spear"],["大院长之弓","Grand Matron Bow"],["女族长之弓","Matriarchal Bow"],["执政官之杖","Archon Staff"],["贝恩的法衣","Bane's Garments"],["孤儿的呼唤","Orphan's Call"],["天堂的信徒","Heaven's Brethren"],["华宁的威严","Hwanin's Majesty"],["天使的服饰","Angelic Raiment"],["卡珊的陷阱","Cathan's Traps"],["死亡的伪装","Death's Disguise"],["沙萨的防御","Hsarus' Defense"],["炼狱的工具","Infernal Tools"],["塔因的头盔","Tarnhelm"],["黑角的面容","Blackhorn's Face"],["格里芬之眼","Griffon's Eye"],["加尔的长发","Jalal's Mane"],["灵魂守护者","Spirit Keeper"],["督瑞尔的壳","Duriel's Shell"],["斗士的祸根","The Gladiator's Bane"],["死神的丧钟","The Reaper's Toll"],["卓古拉之握","Dracul's Grasp"],["哥布林脚趾","Goblin Toe"],["拿各的戒指","Nagelring"],["鬼火投射者","Wisp Projector"],["投石索之戒","Sling"],["艾利屈之眼","Eye of Etlich"],["基德的运气","Gheed's Fortune"],["守御者之火","Defender's Fire"],["守御者之胆","Defender's Bile"],["护卫者之霜","Protector's Frost"],["护卫者之石","Protector's Stone"],["塔格奥的爪","Trang-Oul's Claws"],["贝恩的权威","Bane's Authority"],["威廉的自尊","Wilhelm's Pride"],["昂达尔之灵","Ondal's Almighty"],["丹弓的教导","Dangoon's Teaching"],["华宁的光辉","Hwanin's Splendor"],["华宁的庇护","Hwanin's Refuge"],["华宁的正义","Hwanin's Justice"],["华宁的祝福","Hwanin's Blessing"],["娜吉的头饰","Naj's Circlet"],["娜吉的轻铠","Naj's Light Plate"],["山德的模范","Sander's Paragon"],["山德的碎步","Sander's Riprap"],["西刚的手甲","Sigon's Gage"],["西刚的裹腰","Sigon's Wrap"],["西刚的木屐","Sigon's Sabot"],["天使的斗篷","Angelic Mantle"],["天使的翅膀","Angelic Wings"],["北极的号角","Arctic Horn"],["北极的毛皮","Arctic Furs"],["北极的绑手","Arctic Mitts"],["北极的束缚","Arctic Binding"],["卡珊的面容","Cathan's Visage"],["卡珊的印记","Cathan's Sigil"],["卡珊的封印","Cathan's Seal"],["沙萨的铁拳","Hsarus' Iron Fist"],["沙萨的铁链","Hsarus' Iron Stay"],["沙萨的铁踵","Hsarus' Iron Heel"],["炼狱的火炬","Infernal Torch"],["炼狱的头骨","Infernal Cranium"],["炼狱的印记","Infernal Sign"],["施法者项链","Caster Amulet"],["全职业技能","of Class Skills"],["更快速施法","Faster Cast Rate (FCR)"],["施法者戒指","Caster Ring"],["更快速跑步","Faster Run/Walk (FRW)"],["施法者鞋子","Caster Boots"],["施法者腰带","Caster Belt"],["监牢与军营","Jail and Barracks"],["崔斯特瑞姆","Tristram"],["秘密奶牛关","Moo Moo Farm"],["神秘避难所","Arcane Sanctuary"],["混沌避难所","The Chaos Sanctuary"],["%d支箭矢","%d arrows"],["至命中值:","To Attack Rating:"],["%d次攻击","%d hits"],["毒素时间:","Poison Length:"],["%d个骨牙","%d teeth"],["攻击加成:","Attack Bonus:"],["防御加成:","Defense Bonus:"],["傀儡等级:","Golem Level:"],["%盾牌强度","percent of shield strength"],["冻结%d秒","Freezes for %d seconds"],["持续%d秒","over %d seconds"],["耐力加成:","Stamina Bonus:"],["元素伤害:","Elemental Damages:"],["用脚踢目标","kick target"],["城镇传送门","Town Portal"],["变形成狼人","transform into a werewolf"],["对近战伤害","to melee attacks"],["每等级几率","Chance per level"],["标枪和长矛","Javelin and Spear"],["被动和魔法","Passive and Magic"],["弓和十字弩","Bow and Crossbow"],["%d次踢击","%d Kick"],["宠物生命:","Pet Life:"],["召唤橡树灵","summon the spirit of the oak"],["变形成熊人","transform into a werebear"],["射出一股冰","shoot a jet of ice"],["眼镜蛇攻击","Cobra Strike"],["发射%d次","Shoots %d Times"],["击晕几率:","Chance to stun:"],["终结技加成","Finishing Move Bonuses"],["%生命偷取","percent life stealing"],["对近战攻击","to melee attacks"],["野生宠物:","Feral Pets:"],["终结技 -","Finishing Move -"],["恢复法力:","Mana Recovered:"],["召唤羊头人","Summon Goatman"],["召唤污染魔","Summon Tainted"],["召唤污秽者","Summon Defiler"],["%d个回响","%d Echoes"],["毁灭的神庙","Ruined Temple"],["下水道三层","Sewers Level 3"],["下水道二层","Sewers Level 2"],["下水道一层","Sewers Level 1"],["前往崔凡克","To Travincal"],["修道院大门","Monastery Gate"],["流亡者营地","Rogue Encampment"],["前往大教堂","To The Cathedral"],["主母的巢穴","Matron's Den"],["遗忘的沙丘","Forgotten Sands"],["苦痛的熔炉","Furnace of Pain"],["修女的挽歌","THE SISTER'S LAMENT"],["阿克隆深渊","Pit of Acheron"],["前往亚巴顿","To Abaddon"],["亚瑞特高原","Arreat Plateau"],["亚瑞特之巅","Arreat Summit"],["进入大教堂","Entering The Cathedral"],["进入崔凡克","Entering Travincal"],["进入亚巴顿","Entering Abaddon"],["鲨鱼皮手套","Sharkskin Gloves"],["恶魔皮手套","Demonhide Gloves"],["大型攻城弓","Large Siege Bow"],["小型攻城弓","Short Siege Bow"],["罗佳伯长斧","Lochaber Axe"],["达契亚镰剑","Dacian Falx"],["赝品吉德宾","Decoy Gidbinn"],["碎裂的钻石","Chipped Diamond"],["无瑕的钻石","Flawless Diamond"],["完美的钻石","Perfect Diamond"],["费屈玛之斧","Axe of Fechmar"],["伊洛的火炬","Torch of Iro"],["婴灵的哀歌","Ume's Lament"],["丧钟敲击者","Knell Striker"],["四叶破甲锤","Crushflange"],["精华搬运者","Bloodthief"],["皮匠的刺枪","The Tannr Gorerod"],["恐怖收割者","The Grim Reaper"],["胜者的丝绸","Silks of the Victor"],["布洛克之手","The Hand of Broc"],["怀特的身体","Wirt's body"],["地狱魔颅骨","Hellspawn Skull"],["巴尔的眼睛","Baal's Eye"],["英雄的旗帜","Standard of Heroes"],["大型手爪刀","Greater Claws"],["剪咬手推剑","Scissors Suwayyah"],["亥伯龙标枪","Hyperion Javelin"],["地狱长标枪","Stygian Pilum"],["蛇发女妖弩","Gorgon Crossbow"],["女族长尖枪","Matriarchal Pike"],["女族长标枪","Matriarchal Javelin"],["复仇者头盔","Avenger Guard"],["剖壳者头骨","Unraveller Head"],["石像鬼头骨","Gargoyle Head"],["圣教军护手","Crusader Gauntlets"],["食肉魔护手","Ogre Gauntlets"],["圣甲虫壳靴","Scarabshell Boots"],["重煞者头盔","Slayer Guard"],["保卫者之盾","Protector Shield"],["木乃伊法器","Mummified Trophy"],["领唱者法器","Cantor Trophy"],["毁灭者头盔","Destroyer Helm"],["征服者王冠","Conqueror Crown"],["守护者王冠","Guardian Crown"],["蛇神守护者","Guardian Naga"],["碎骨者之刃","Boneslayer Blade"],["暗族粉碎者","Dark Clan Crusher"],["德鲁兰之舌","Drulan's Tongue"],["外壳撕裂者","Fleshrender"],["瘟疫散播者","Plague Bearer"],["雅典娜之怒","Athena's Wrath"],["皮肉吞噬者","Husoldal Evo"],["骷髅收集者","Skull Collector"],["深渊嗜战者","Pitblood Thirst"],["温达的智慧","Ondal's Wisdom"],["恰西的好感","Charsi's Favor"],["战争伯劳鸟","Warshrike"],["骨髓碾磨者","Marrow Grinder"],["外壳碎裂者","Gore Ripper"],["流浪者之刃","The Wanderer's Blade"],["石像鬼之牙","Gargoyle's Bite"],["宋满的教训","Mang Song's Lesson"],["寡妇制造者","Widowmaker"],["巨型残害者","Giant Maimer"],["头皮剥离者","The Scalper"],["尹桑的疯狂","Iansang's Frenzy"],["外壳割裂者","Fleshripper"],["冥犬的撕咬","Cerebus' Bite"],["符文重煞者","Rune Slayer"],["兔子重煞者","Rabbit Slayer"],["灵魂收割者","Soul Reaper"],["地狱低语者","Hell Whisper"],["雷登的拐杖","Raiden's Crutch"],["血鸦的冲锋","Blood Raven's Charge"],["覆灵裹身布","The Spirit Shroud"],["剥离者之皮","Skin of Flayed One"],["风暴追逐者","Stormchaser"],["魔龙的斥责","Tiamat's Rebuke"],["侍从的掩护","Squire's Cover"],["高塔的警戒","Hightower's Watch"],["火蜥蜴之爪","Firelizard's Talons"],["人鱼的扣链","Merman's Sprocket"],["舍费尔之锤","Schaefer's Hammer"],["巴拉纳之星","Baranar's Star"],["地狱重煞者","Hellslayer"],["桓因的绶带","Hwanin's Cordon"],["威斯顿之御","Whitstan's Guard"],["武士嘉斯迪","Samurai Justice"],["末日预见者","Doomseer"],["大地的守护","Terra's Guardian"],["杰瑞德之石","Jared's Stone"],["魂灵解救者","Ghost Liberator"],["烛台制造者","The Candlestick Maker"],["卷轴与典籍","Scrolls and Tomes"],["伐克斯符文","Vex Rune"],["伊司特符文","Ist Rune"],["压碎性打击","Crushing Blow (CB)"],["对恶魔伤害","Dmg to Demons"],["对不死伤害","Dmg to Undead"],["对恶魔命中","AR vs Demons"],["对不死命中","AR vs Undead"],["对导弹防御","Def vs Missiles"],["攻击准确率","Attack Rating"],["命中率加成","Bonus to AR"],["加成命中率","Bonus to AR"],["受击者受伤","Attacker Takes Dmg"],["装备后赋予"," Grants "],["装备时赋予"," Grants "],["需求力/敏","Req Str/Dex"],["全职业可用","All Classes"],["完美紫宝石","Perfect Amethyst"],["完美红宝石","Perfect Ruby"],["完美蓝宝石","Perfect Sapphire"],["完美绿宝石","Perfect Emerald"],["完美黄宝石","Perfect Topaz"],["世界石碎片","Worldstone Shard"],["毒素与白骨","Poison & Bone"],["标枪与长矛","Javelin & Spear"],["弓和十字弓","Bow & Crossbow"],["被动与魔法","Passive & Magic"],["庇护所灵气","Sanctuary Aura"],["打钱野蛮人","Gold Find Barb"],["仅蓝装极限","Magic Only Cap"],["黄/橙极限","Rare/Craft Cap"],["无常见免疫","No Common Immunities"],["#1 艾尔","#1 El"],["#2 艾德","#2 Eld"],["#3 提尔","#3 Tir"],["#4 奈夫","#4 Nef"],["#5 艾斯","#5 Eth"],["#6 伊司","#6 Ith"],["#7 塔尔","#7 Tal"],["#8 拉尔","#8 Ral"],["#9 欧特","#9 Ort"],["#18 科","#18 Ko"],["#28 罗","#28 Lo"],["#29 瑟","#29 Sur"],["#30 贝","#30 Ber"],["对远程防御","Defense vs. Missile"],["全身板甲","Field Plate"],["恶魔皮甲","Demonhide Armor"],["镶片铠甲","Trellised Armor"],["重装胸甲","Cuirass"],["鲨齿战甲","Sharktooth Armor"],["浮雕纹甲","Embossed Plate"],["混沌护甲","Chaos Armor"],["花纹战甲","Ornate Plate"],["灰幕寿衣","Dusk Shroud"],["圣甲虫壳","Scarab Husk"],["羊绒皮甲","Wire Fleece"],["大半身甲","Great Hauberk"],["地狱铸甲","Hellforge Plate"],["暗影板甲","Shadow Plate"],["神圣铠甲","Sacred Armor"],["恐怖大盾","Grim Shield"],["亥伯龙盾","Hyperion"],["守护之盾","Ward"],["剑刃屏障","Blade Barrier"],["神圣小盾","Sacred Targe"],["恐怖头盔","Grim Helm"],["白骨面甲","Bone Visage"],["恶魔面甲","Demonhead"],["次元之刃","Dimensional Blade"],["相位之刃","Phase Blade"],["双刃矛戟","Partizan"],["重长柄斧","Great Poleaxe"],["巨型砍斧","Giant Thresher"],["女族长矛","Matriarchal Spear"],["女族长弓","Matriarchal Bow"],["九头蛇弓","Hydra Bow"],["不朽之王","Immortal King"],["祸殃法衣","Bane's Garments"],["天堂同袍","Heaven's Brethren"],["北极装备","Arctic Gear"],["地狱工具","Infernal Tools"],["幼童软帽","Biggin's Bonnet"],["塔恩之盔","Tarnhelm"],["黄昏薄暮","Duskdeep"],["蛆虫头骨","Wormskull"],["农夫兜帽","Peasant Crown"],["偷取颅盔","Stealskull"],["盗贼皇冠","Crown of Thieves"],["谐角之冠","Harlequin Crest"],["狮鹫之眼","Griffon's Eye"],["年纪之冠","Crown of Ages"],["夜翼面纱","Nightwing's Veil"],["巨型颅骨","Giant Skull"],["钢铁面纱","Veil of Steel"],["狼王之鬃","Jalal's Mane"],["黄金之肤","Goldskin"],["守护天使","Guardian Angel"],["赤鸦之爪","Raven Claw"],["自戕树杈","Suicide Branch"],["巫师之刺","Wizardspike"],["海妖之瞳","The Oculus"],["死神丧钟","The Reaper's Toll"],["死亡深渊","Death's Fathom"],["死亡迷网","Death's Web"],["碧蓝怒火","Azurewrath"],["风暴之鞭","Stormlash"],["无形之锋","Ethereal Edge"],["血契碎片","Bloodpact Shard"],["警戒之墙","Lidless Wall"],["暴风之盾","Stormshield"],["魔力肇生","Darkforce Spawn"],["有度之怒","Measured Wrath"],["战损拳套","Bloodfist"],["法师之拳","Magefist"],["吉运守护","Chance Guards"],["战争旅者","War Traveler"],["绯红骑士","Gore Rider"],["沙暴之旅","Sandstorm Trek"],["骨髓行走","Marrowwalk"],["缠腰耳串","String of Ears"],["剃刀之尾","Razortail"],["雷神之力","Thundergod's Vigor"],["冰雪之击","Snowclash"],["蜘蛛网纹","Arachnid Mesh"],["乔丹之石","The Stone of Jordan"],["乌鸦之霜","Raven Frost"],["矮人之星","Dwarf Star"],["鬼火投影","Wisp Projector"],["腐肉之风","Carrion Wind"],["蛋白石脉","Opalvein"],["熵之护符","Entropy Locket"],["大君之怒","Highlord's Wrath"],["金属网格","Metalgrid"],["地狱火炬","Hellfire Torch"],["天堂裂痕","Crack of the Heavens"],["火焰裂隙","Flame Rift"],["寒冰裂口","Cold Rupture"],["腐烂裂迹","Rotting Fissure"],["白骨裂纹","Bone Break"],["漆黑裂痕","Black Cleft"],["祸殃权柄","Bane's Authority"],["赐福念珠","Telling of Beads"],["按手礼套","Laying of Hands"],["隐秘教徒","Dark Adherent"],["信念腰带","Credendum"],["皈依之道","Rite of Passage"],["北极号角","Arctic Horn"],["北极毛皮","Arctic Furs"],["北极手套","Arctic Mitts"],["北极束带","Arctic Binding"],["死神之触","Death's Touch"],["死神之手","Death's Hand"],["死神之卫","Death's Guard"],["地狱颅骨","Infernal Cranium"],["地狱印记","Infernal Sign"],["先祖之誓","Ancients' Pledge"],["濒死之息","Breath of the Dying"],["战争召唤","Call to Arms"],["荣耀之链","Chains of Honor"],["正义之手","Hand of Justice"],["橡树之心","Heart of the Oak"],["临终之愿","Last Wish"],["理智之声","Voice of Reason"],["闪烁火焰","Flickering Flame"],["不屈之志","Unbending Will"],["镶嵌皮甲","Studded Leather"],["轻型装甲","Light Plate"],["实战铠甲","Field Plate"],["钢板铠甲","Plate Mail"],["哥特战甲","Gothic Plate"],["高级战甲","Full Plate Mail"],["古代装甲","Ancient Armor"],["鬼魂战甲","Ghost Armor"],["海蛇皮甲","Skin of the Vipermagi"],["魔皮战甲","Demonhide Armor"],["法师铠甲","Mage Plate"],["铁锈战甲","Russet Armor"],["浮雕战甲","Embossed Plate"],["混沌战甲","Chaos Armor"],["华丽战甲","Ornate Plate"],["灰暮寿衣","Dusk Shroud"],["甲壳铠甲","Loricated Mail"],["骸骨链甲","Boneweave"],["海妖壳甲","Kraken Shell"],["地狱锻甲","Hellforge Plate"],["阴影铠甲","Shadow Plate"],["白骨盾牌","Bone Shield"],["冷酷之盾","Grim Shield"],["海伯利昂","Hyperion"],["刀刃壁垒","Blade Barrier"],["术士魔典","Warlock Grimoires"],["残酷头盔","Grim Helm"],["骸骨面罩","Bone Visage"],["空间之刃","Dimensional Blade"],["幻化之刃","Phase Blade"],["巨神之剑","Colossus Sword"],["巨神之刃","Colossus Blade"],["狂战士斧","Berserker Axe"],["天罚之锤","Scourge"],["神使之杖","Caduceus"],["巨神之斧","Colossus Voulge"],["锐利之斧","Thresher"],["神秘之斧","Cryptic Axe"],["暮光深渊","Duskdeep"],["蠕虫头骨","Wormskull"],["粗野之冠","Peasant Crown"],["偷取骷髅","Stealskull"],["女神之翼","Valkyrie Wing"],["狱守之志","Hellwarden's Will"],["年龄之冠","Crown of Ages"],["掠鸦之风","Ravenlore"],["抽动挣扎","Twitchthroe"],["黄金之皮","Goldskin"],["渡鸟之爪","Raven Claw"],["自杀支系","Suicide Branch"],["宏·森丹","Hone Sundan"],["次元碎片","Death's Fathom"],["死亡之网","Death's Web"],["青色忿怒","Azurewrath"],["暴风之结","Stormlash"],["死亡之刀","Death Cleaver"],["无形之刃","Ethereal Edge"],["恐惧之牙","Dreadfang"],["黑暗力量","Darkforce Spawn"],["巴尔秘典","Ars Tor'Baalos"],["节制之怒","Measured Wrath"],["运气守护","Chance Guards"],["蚀肉骑士","Gore Rider"],["鬼灵之步","Wraithstep"],["金色包袱","Goldwrap"],["长串之耳","String of Ears"],["雪之冲突","Snowclash"],["蜘蛛之网","Arachnid Mesh"],["自然祥和","Nature's Peace"],["熵之吊坠","Entropy Locket"],["旭日东升","The Rising Sun"],["天堂之裂","Crack of the Heavens"],["寒冰裂隙","Cold Rupture"],["腐朽裂隙","Rotting Fissure"],["彩虹刻面","Rainbow Facet"],["吉永之脸","Guillaume's Face"],["述说之珠","Telling of Beads"],["黑暗信徒","Dark Adherent"],["炼狱之步","Rite of Passage"],["天使之光","Angelic Halo"],["卡珊的网","Cathan's Mesh"],["死亡之触","Death's Touch"],["死亡之手","Death's Hand"],["死亡之护","Death's Guard"],["吸血项链","Blood Amulet"],["安全项链","Safety Amulet"],["单系技能","Lancer's / Cunning / Echoing"],["生命恢复","Replenish Life"],["传送聚气","of Teleportation"],["吸血戒指","Blood Ring"],["生命偷取","Life Leech"],["法力偷取","Mana Leech"],["强力视觉","Visionary"],["吸血手套","Blood Gloves"],["击打手套","Hit Power Gloves"],["吸血腰带","Blood Belt"],["巨鲸生命","of the Whale"],["彩色全抗","Chromatic"],["安全盾牌","Safety Shield"],["远古契约","Ancient's Pledge"],["神圣雷击","Holy Thunder"],["王者之恩","King's Grace"],["死亡呼吸","Breath of the Dying"],["迪勒瑞姆","Delirium"],["最后希望","Last Wish"],["理性之声","Voice of Reason"],["不屈意志","Unbending Will"],["歇斯底里","Hysteria"],["石块旷野","Stony Field"],["遗忘之塔","The Forgotten Tower"],["遥远绿洲","Far Oasis"],["古代通道","Ancient Tunnels"],["庞大湿地","Great Marsh"],["憎恨囚牢","Durance of Hate"],["火焰傀儡","Fire Golem"],["钢铁傀儡","Iron Golem"],["精华傀儡","Blood Golem"],["黏土傀儡","Clay Golem"],["火焰伤害","Fire Dmg"],["每个目标","per target"],["毒素伤害","Poison Dmg"],["荆棘伤害","Thorns damage"],["普通攻击","normal attack"],["取消召唤","Unsummon"],["左手投掷","Left Hand Throw"],["左手挥舞","Left Hand Swing"],["致命攻击","Critical Strike"],["电荷攻击","Power Strike"],["剧毒标枪","Poison Javelin"],["飞矢减速","Slow Missiles"],["充能一击","Charged Strike"],["瘟疫标枪","Plague Javelin"],["闪电攻击","Lightning Strike"],["雷霆之怒","Lightning Fury"],["心灵传动","Telekinesis"],["冰霜新星","Frost Nova"],["闪电新星","Nova"],["附魔火焰","Enchant"],["连锁闪电","Chain Lightning"],["火系精通","Fire Mastery"],["雷系精通","Lightning Mastery"],["冰系精通","Cold Mastery"],["伤害加深","Amplify Damage"],["骷髅精通","Skeleton Mastery"],["复生骷髅","Raise Skeleton"],["微暗灵视","Dim Vision"],["傀儡精通","Golem Mastery"],["骷髅法师","Skeletal Mage"],["生命吸取","Life Tap"],["召唤抗性","Summon Resist"],["降低抗性","Lower Resist"],["剧毒新星","Poison Nova"],["盾牌猛击","shield bash"],["神圣之火","Holy Fire"],["祝福瞄准","Blessed Aim"],["祝福之锤","Blessed Hammer"],["神圣之冰","Holy Freeze"],["圣光转化","Conversion"],["神圣之雷","Holy Shock"],["庇护之光","Sanctuary"],["天堂之拳","Fist of the Heavens"],["刀剑精通","Blade Mastery"],["斧类精通","Axe Mastery"],["锤类精通","Mace Mastery"],["跳过障碍","jumps over obstacles"],["双手挥击","Double Swing"],["长柄精通","Polearm Mastery"],["投掷精通","Throwing Mastery"],["长矛精通","Spear Mastery"],["击晕目标","stuns your target"],["双手投掷","Double Throw"],["增强耐力","Increased Stamina"],["钢铁之肤","Iron Skin"],["增强速度","Increased Speed"],["战斗号令","Battle Orders"],["骇物阻吓","Grim Ward"],["自然抗性","Natural Resistance"],["战斗指挥","Battle Command"],["鉴定卷轴","Scroll of Identify"],["鉴定之书","Tome of Identify"],["每等级秒","Second per Level"],["狼人变化","Werewolf"],["多次攻击","Multiple Hits"],["冰系法术","Cold Spells"],["雷系法术","Lightning Spells"],["火系法术","Fire Spells"],["防御光环","Defensive Auras"],["攻击光环","Offensive Auras"],["战斗技能","Combat Skills"],["呐喊技能","Warcries"],["战斗精通","Combat Masteries"],["武学技艺","Martial Arts"],["影身训练","Shadow Disciplines"],["狼防御:","Wolf Defense:"],["召唤渡鸦","summon ravens"],["火焰风暴","Firestorm"],["橡木智灵","Oak Sage"],["召唤灵狼","Summon Spirit Wolf"],["熊人变化","Werebear"],["熔岩巨石","Molten Boulder"],["极地冰暴","Arctic Blast"],["野性狂暴","Feral Rage"],["熔岩裂地","Fissure"],["气旋护甲","Cyclone Armor"],["狼獾之心","Heart of Wolverine"],["召唤狂狼","Summon Dire Wolf"],["召唤灰熊","Summon Grizzly"],["毁天灭地","Armageddon"],["利爪精通","Claw Mastery"],["心灵重锤","Psychic Hammer"],["猛虎攻击","Tiger Strike"],["刀刃守卫","Blade Sentinel"],["速度爆发","Burst of Speed"],["电能守卫","Charged Bolt Sentry"],["武器格挡","Weapon Block"],["暗影斗篷","Cloak of Shadows"],["利刃之怒","Blade Fury"],["影身战士","Shadow Warrior"],["神龙摆尾","Dragon Tail"],["雷光守卫","Lightning Sentry"],["狱火尾焰","Wake of Inferno"],["心灵爆震","Mind Blast"],["飞龙在天","Dragon Flight"],["死亡守卫","Death Sentry"],["刀刃之盾","Blade Shield"],["影身大师","Shadow Master"],["凤凰攻击","Phoenix Strike"],["每次踢击","per kick"],["燃烧伤害","burning damage"],["必定命中","Always Hits"],["无法打断","Uninterruptable"],["巨熊印记","Mark of the Bear"],["恶狼印记","Mark of the Wolf"],["火焰之环","Ring of Fire"],["强化之熵","Enhanced Entropy"],["瘴气锁链","Miasma Chain"],["悬浮精通","Levitation Mastery"],["会心守御","Psychic Ward"],["邪术冲击","Eldritch Blast"],["回响打击","Echoing Strike"],["飞刃传形","Blade Warp"],["镜影锋刃","Mirrored Blades"],["恶魔精通","Demonic Mastery"],["死亡印记","Death Mark"],["红液沸腾","Blood Boil"],["束缚恶魔","Bind Demon"],["混沌要塞","The Pandemonium Fortress"],["火焰之河","River of Flame"],["外域荒原","Outer Steppes"],["绝望平原","Plains of Despair"],["神罚之城","City of the Damned"],["巨蛛巢穴","Arachnid Lair"],["蜘蛛洞穴","Spider Cavern"],["翠绿丛林","Flayer Jungle"],["蜘蛛森林","Spider Forest"],["翠绿监牢","Flayer Dungeon"],["沼泽陷坑","Swampy Pit"],["古代水道","Ancient Tunnels"],["法师峡谷","Canyon of the Magi"],["群蛇峡谷","Valley of Snakes"],["失落之城","Lost City"],["偏远绿洲","Far Oasis"],["干燥高地","Dry Hills"],["碎石荒野","Rocky Waste"],["鲁·高因","Lut Gholein"],["蛆虫巢穴","Maggot Lair"],["亡者大殿","Halls of the Dead"],["碎石古墓","Stony Tomb"],["王宫监牢","Palace Cellar"],["女眷住处","Harem"],["崔斯特姆","Tristram"],["内侧回廊","Inner Cloister"],["监牢三层","Jail Level 3"],["监牢二层","Jail Level 2"],["监牢一层","Jail Level 1"],["外侧回廊","Outer Cloister"],["埋骨之地","Burial Grounds"],["深坑二层","Pit Level 2"],["洞坑二层","Hole Level 2"],["洞穴二层","Cave Level 2"],["深坑一层","Pit Level 1"],["洞坑一层","Hole Level 1"],["洞穴一层","Cave Level 1"],["邪恶洞穴","Den of Evil"],["泰摩高地","Tamoe Highland"],["黑色沼泽","Black Marsh"],["黑暗森林","Dark Wood"],["冰冷之原","Cold Plains"],["精华荒地","Blood Moor"],["前往营房","To The Barracks"],["前往寝陵","To The Mausoleum"],["前往墓穴","To The Crypt"],["沙漠之旅","DESERT JOURNEY"],["踏入地狱","ENTER HELL"],["寻找巴尔","SEARCH FOR BAAL"],["炼狱深渊","Infernal Pit"],["哈洛加斯","Harrogath"],["嗜战丘陵","Bloody Foothills"],["冰冻高地","Frigid Highlands"],["水晶通道","Crystalline Passage"],["冰冻之河","Frozen River"],["冰川小径","Glacial Trail"],["漂流洞窟","Drifter Cavern"],["冰冻苔原","Frozen Tundra"],["先祖之路","The Ancients' Way"],["寒冰地窖","Icy Cellar"],["痛楚大厅","Halls of Anguish"],["苦痛大厅","Halls of Pain"],["折磨大厅","Halls of Torment"],["沃特大厅","Halls of Vaught"],["毁灭王座","Throne of Destruction"],["进入墓穴","Entering The Crypt"],["进入寝陵","Entering The Mausoleum"],["进入营房","Entering The Barracks"],["地下通道","Underground Passage"],["地下墓穴","Catacombs"],["神殿大厅","Temple Halls"],["巨像之巅","Colossal Summit"],["链甲手套","Chain Gloves"],["轻板甲靴","Light Plated Boots"],["板甲腰带","Plated Belt"],["紫杉魔杖","Yew Wand"],["白骨魔杖","Bone Wand"],["恐怖魔杖","Grim Wand"],["战争权杖","War Scepter"],["双手大剑","Claymore"],["投掷小刀","Throwing Knife"],["平衡飞刀","Balanced Knife"],["平衡飞斧","Balanced Axe"],["战争镰刀","War Scythe"],["短战争弓","Short War Bow"],["长战争弓","Long War Bow"],["战争腰带","War Belt"],["战斗腰带","Battle Belt"],["网纹腰带","Mesh Belt"],["鲨鱼皮带","Sharkskin Belt"],["恶魔皮带","Demonhide Sash"],["鲨鱼皮靴","Sharkskin Boots"],["恶魔皮靴","Demonhide Boots"],["战斗护手","Battle Gauntlets"],["铁皮手套","Heavy Bracers"],["固片锁甲","Tigulated Mail"],["死者面甲","Death Mask"],["恐怖镰刀","Grim Scythe"],["鸦喙锤戟","Bec-de-Corbin"],["战斗镰刀","Battle Scythe"],["斧刃戟枪","Spiculum"],["战争标枪","War Javelin"],["法兰飞斧","Francisca"],["五指短剑","Cinquedeas"],["双手重剑","Zweihander"],["西铁大剑","Espandon"],["塔瓦弯刀","Tulwar"],["沙漠弯刀","Shamshir"],["角斗短剑","Gladius"],["锯齿星锤","Jagged Star"],["凸缘钉锤","Flanged Mace"],["神圣权杖","Divine Scepter"],["圣水礼杖","Holy Water Sprinkler"],["符文权杖","Rune Scepter"],["陪葬魔杖","Grave Wand"],["随葬魔杖","Tomb Wand"],["石化魔杖","Petrified Wand"],["烧制魔杖","Burnt Wand"],["塔巴战斧","Tabar"],["爆燃药水","Fulminating Potion"],["爆炸药水","Exploding Potion"],["火油药水","Oil Potion"],["怀特的腿","Wirt's Leg"],["耐力药水","Stamina Potion"],["解毒药水","Antidote Potion"],["复苏药水","Rejuvenation Potion"],["解冻药水","Thawing Potion"],["石阵密文","Key to the Cairn Stones"],["黑塔钥匙","The Black Tower Key"],["玉石雕像","A Jade Figurine"],["治疗药水","Healing Potion"],["法力药水","Mana Potion"],["头骨宝石","Skull"],["粗革皮鞋","Brogues"],["光之烙印","Lightbrand"],["死亡魔杖","Deathwand"],["外壳撕咬","The Gnasher"],["死亡黑桃","Deathspade"],["漩涡之力","Maelstrom"],["支柱雕塑","Gravenspine"],["凶猛橡木","Felloak"],["腐锈权柄","Rusthandle"],["风暴之眼","Stormeye"],["坚硬钉爪","Stoutnail"],["赤色飞星","Bloodrise"],["赤色新月","Blood Crescent"],["寒光镰刀","Gleamscythe"],["地狱瘟疫","Hellplague"],["库文之刺","Culwen's Point"],["暗影之牙","Shadowfang"],["彩虹碎片","Spectral Shard"],["剃刀尖齿","Razortine"],["亚盖长枪","Lance of Yaggai"],["降灾长戟","Woestave"],["祸根之灰","Bane Ash"],["海蛇之王","Serpent Lord"],["凋零之击","Witherstring"],["游猎之弓","Rogue's Bow"],["风暴之击","Stormstrike"],["凋零劲弦","Wizendraw"],["地狱飞啸","Hellclap"],["爆裂喧嚣","Blastbark"],["灵液之刺","Ichorsting"],["狱火投手","Hellcast"],["末日投手","Doomslinger"],["荣光锁帽","Coif of Glory"],["怒号长牙","Howltusk"],["不死王冠","Undead Crown"],["恐惧面容","The Face of Horror"],["火蝠之影","Blinkbat's Form"],["黑暗幽光","Darkglow"],["电光锁甲","Sparking Mail"],["毒液禁区","Venom Ward"],["闪耀冰晶","Iceblink"],["骨肉分离","Boneflesh"],["作响之笼","Rattlecage"],["天界圣衣","Heavenly Garb"],["新月小盾","Pelta Lunata"],["太阳黑轮","Umbral Disk"],["风暴行会","Stormguild"],["无眼之墙","Wall of the Eyeless"],["剑背之架","Swordback Hold"],["鏖战裹脚","Gorefoot"],["刀刃腰扣","Bladebuckle"],["蝮蛇护符","Amulet of the Viper"],["列王之杖","Staff of Kings"],["狂法劲弦","Witchwild String"],["传奇重锤","Legendary Mallet"],["战争护手","War Gauntlets"],["恐惧之钥","Key of Terror"],["憎恨之钥","Key of Hate"],["毁灭之钥","Key of Destruction"],["缠刃拳套","Cestus"],["剪咬拳剑","Scissors Katar"],["刀刃拳套","Fascia"],["大型刃爪","Greater Talons"],["剪咬拳刃","Scissors Quhab"],["战争拳套","War Fist"],["狂野钩爪","Feral Claws"],["符文刃爪","Runic Talons"],["土著战斧","Tomahawk"],["战争尖斧","War Spike"],["狂野利斧","Feral Axe"],["荣耀之斧","Glorious Axe"],["洗练魔杖","Polished Wand"],["幽灵魔杖","Ghost Wand"],["邪妖魔杖","Lich Wand"],["出土魔杖","Unearthed Wand"],["强威权杖","Mighty Scepter"],["炽天使杖","Seraph Rod"],["恶魔流星","Devil Star"],["食肉魔锤","Ogre Maul"],["九头蛇刃","Hydra Edge"],["传说匕刺","Legend Spike"],["幽灵梭戟","Ghost Glaive"],["亥伯龙矛","Hyperion Spear"],["地狱长枪","Stygian Pike"],["战争长枪","War Pike"],["食肉魔斧","Ogre Axe"],["接骨木杖","Elder Staff"],["十字军弓","Crusader Bow"],["鹰眼法珠","Eagle Orb"],["圣洁之球","Sacred Globe"],["烟熏法球","Smoked Sphere"],["握扣法珠","Clasped Orb"],["处子长矛","Maiden Spear"],["处子长枪","Maiden Pike"],["处子标枪","Maiden Javelin"],["闪光宝珠","Glowing Orb"],["水晶之球","Crystalline Globe"],["云雾法球","Cloudy Sphere"],["闪光之球","Sparkling Ball"],["漩涡水晶","Swirling Crystal"],["白蜡木弓","Ashwood Bow"],["仪式长枪","Ceremonial Pike"],["仪式标枪","Ceremonial Javelin"],["怪异法珠","Eldritch Orb"],["恶魔之心","Demon Heart"],["旋云宝珠","Vortex Orb"],["鹰隼面甲","Falcon Mask"],["狼灵面具","Spirit Mask"],["邪身头骨","Zombie Head"],["恶魔头骨","Demon Head"],["多头蛇颅","Hydraskull"],["防刺手套","Bramble Mitts"],["护臂手甲","Vambraces"],["飞龙皮靴","Wyrmhide Boots"],["白骨链靴","Boneweave Boots"],["侍从护胫","Myrmidon Greaves"],["蛛网饰带","Spiderweb Sash"],["秘银腰带","Mithril Coil"],["巨魔腰带","Troll Belt"],["巨型护腰","Colossus Girdle"],["狮鹫头饰","Griffon Headdress"],["猎人伪装","Hunter's Guise"],["图腾面具","Totemic Mask"],["颚骨面甲","Jawbone Visor"],["盛怒面甲","Rage Mask"],["野蛮头盔","Savage Helmet"],["鬼娃法器","Fetish Trophy"],["司事法器","Sexton Trophy"],["圣师法器","Hierophant Trophy"],["天空之灵","Sky Spirit"],["太阳之灵","Sun Spirit"],["大地之灵","Earth Spirit"],["精华之灵","Blood Spirit"],["梦境之灵","Dream Spirit"],["怒火面甲","Fury Visor"],["爪牙颅骨","Minion Skull"],["督军颅骨","Overseer Skull"],["魅魔颅骨","Succubus Skull"],["小型神符","Small Charm"],["大型神符","Large Charm"],["巨型神符","Grand Charm"],["生命核心","Heart"],["屠夫之瞳","Butcher's Pupil"],["海岛之击","Islestrike"],["庞贝之怒","Pompeii's Wrath"],["魔咒之钢","Spellsteel"],["石冢碎片","Cairn Shard"],["黑手钥匙","Blackhand Key"],["恶臭喷杖","The Fetid Sprinkler"],["圣光之手","Hand of Blessed Light"],["神河之霜","Sureshrill Frost"],["赤色木桩","Bloodtree Stump"],["苦痛木槌","The Gavel of Pain"],["冷窃之眼","Coldsteal Eye"],["妖术之火","Hexfire"],["恐惧喷吐","Crainte Vomir"],["邪祟之牙","The Vile Husk"],["索命之焰","Todesfaelle Flamme"],["黑沼之锋","Blackbog's Sharp"],["风暴匕刺","Stormspike"],["水妖捕叉","Kelpie Snare"],["荣耀之巅","Spire of Honor"],["刮肉长戟","The Meat Scraper"],["暗蚀之刃","Blackleach Blade"],["墓石长戟","Pierre Tombale Couant"],["多彩之怒","Chromatic Ire"],["扭曲之矛","Warpspear"],["赤焰之击","Kuko Shakaku"],["无尽冰雹","Endlesshail"],["金击之弧","Goldstrike Arch"],["千步碎击","Langer Briser"],["吐脓毒弩","Pus Spitter"],["暴雪重炮","Buriza-Do Kyanon"],["熔岩痛击","Lava Gout"],["剧毒之握","Venom Grip"],["黑牛之角","Blackhorn"],["恶魔机弩","Demon Machine"],["法师之怒","Magewrath"],["峭壁杀手","Cliffkiller"],["撕裂之钩","Riphook"],["剃刀飞旋","Razorswitch"],["冷钢之眼","Coldsteel Eye"],["伽耶魔杖","Gaya Wand"],["镜像之影","Doppleganger's Shadow"],["死亡之吻","Deathbit"],["剃刀之锋","Razor's Edge"],["恶魔断肢","Demon Limb"],["盖亚之怒","Gaia's Wrath"],["天使之歌","Angel's Song"],["赤色彗星","Blood Comet"],["符文大师","Rune Master"],["黎明使者","Dawn Bringer"],["蛇信长枪","Viperfork"],["精华圣杯","Blood Chalice"],["恶魔角锋","Demonhorn's Edge"],["地狱刑器","Hellrack"],["恶魔扑击","Demon's Arch"],["黑色蝰蛇","The Black Adder"],["凯恩之怒","Wrath of Cain"],["海妖之歌","Siren's Call"],["怨灵之牙","Wraithfang"],["罪恶之刃","Sinblade"],["王者之剑","Excalibur"],["太阳之焰","Fuego Del Sol"],["神之烈焰","El Infierno"],["康的美德","Kang's Virtue"],["生命之扼","Lifechoke"],["风暴柳木","Stormwillow"],["知更鸟蛋","Robin's Yolk"],["微光裂片","Glimmershred"],["怨灵飞行","Wraith Flight"],["女妖之啸","Banshee's Wail"],["泰坦之拳","Titan's Fist"],["磐石头盔","Rockstopper"],["暗视头盔","Darksight Helm"],["灵魂熔炉","Spirit Forge"],["黑色冥王","Black Hades"],["遗体哀悼","Corpsemourn"],["盗墓手套","Gravepalm"],["食腐鬼皮","Ghoulhide"],["地狱之口","Hellmouth"],["地狱阔步","Infernostride"],["阴影陷阱","Gloom's Trap"],["长枪卫士","Lance Guard"],["钢铁支柱","Steel Pillar"],["黑暗恐惧","Darkfear"],["钢铁甲壳","Steel Carapace"],["彩虹魔石","Rainbow Facet"],["白骨阴魂","Boneshade"],["怒焰咆哮","Flamebellow"],["灵体守护","Spirit Ward"],["尖刺荆棘","Spike Thorn"],["冰霜之风","Frostwind"],["天堂之光","Heaven's Light"],["龙兽之焰","Drakeflame"],["布尔凯索","Bul-Kathos"],["黑橡树盾","Blackoak Shield"],["鹰之号角","Eaglehorn"],["寒铁飞刃","Gimmershred"],["风暴穹窿","Stormspire"],["末日使者","Doombringer"],["光之军刀","Lightsabre"],["唐的皇袍","Tang's Imperial Robes"],["唐的先王","Tang's Fore-Fathers"],["唐的统治","Tang's Rule"],["唐的帝座","Tang's Throne"],["唐的战旗","Tang's Battle Standard"],["暗影之触","Shadow Touch"],["死亡新月","Mortal Crescent"],["嚎哭仪容","Howling Visage"],["恶意之颅","Malignant Skull"],["极光之御","Aurora's Guard"],["黎明之冠","Crest of Morn"],["古代之眼","Ancient Eye"],["目盲面纱","Sightless Veil"],["%0%1","%0 %1"],["斧刃拳套","Hatchet Hands"],["职业限定","Class-specific"],["知识卷轴","Scroll of Knowledge"],["紧缩之戒","Constricting Ring"],["死亡法师","Death Mage"],["溃脓附肢","Festering Appendages"],["焦黑文本","Burnt Text"],["黑暗典籍","Dark Tome"],["黑暗法典","Dark Codex"],["魔附纲要","Possessed Compendium"],["魔附魔典","Possessed Grimoire"],["遗世卷册","Forgotten Volume"],["神秘典籍","Occult Tome"],["神秘法典","Occult Codex"],["亵渎纲要","Blasphemous Compendium"],["亵渎魔典","Blasphemous Grimoire"],["死灵法师","Necromancer"],["长柄武器","Polearms"],["投掷武器","Throwing"],["超级奖励","Uber Rewards"],["超级材料","Uber Materials"],["恐惧凭证","Terrorize Tokens"],["身体护甲","Body Armor"],["远程武器","Missile Weapon"],["艾欧符文","Io Rune"],["沙伊符文","Shael Rune"],["扎哈符文","Jah Rune"],["佐德符文","Zod Rune"],["查姆符文","Cham Rune"],["欧姆符文","Ohm Rune"],["古尔符文","Gul Rune"],["玛尔符文","Mal Rune"],["乌姆符文","Um Rune"],["普尔符文","Pul Rune"],["兰姆符文","Lem Rune"],["法尔符文","Fal Rune"],["卢姆符文","Lum Rune"],["海尔符文","Hel Rune"],["多尔符文","Dol Rune"],["索尔符文","Sol Rune"],["安姆符文","Amn Rune"],["图尔符文","Thul Rune"],["欧特符文","Ort Rune"],["拉尔符文","Ral Rune"],["塔尔符文","Tal Rune"],["伊司符文","Ith Rune"],["艾斯符文","Eth Rune"],["奈夫符文","Nef Rune"],["提尔符文","Tir Rune"],["艾德符文","Eld Rune"],["艾尔符文","El Rune"],["破碎誓言","Broken Promise"],["天堂意志","Heaven's Will"],["神圣之泪","Holy Tears"],["骑士之印","Knight's Vigil"],["自然王国","Nature's Kingdom"],["信念之柱","Pillar of Faith"],["疑虑之影","Shadow of Doubt"],["希望之翼","Wings of Hope"],["击杀法力","Mana After Kill"],["击杀生命","Life After Kill"],["压碎打击","Crushing Blow (CB)"],["致命一击","Critical/Deadly Strike"],["致命打击","Deadly Strike (DS)"],["双倍打击","Deadly Strike (DS)"],["撕裂伤口","Open Wounds (OW)"],["开放伤口","Open Wounds (OW)"],["所有技能","to All Skills"],["所有抗性","All Resistances"],["所有属性","to All Attributes"],["强化伤害","Enhanced Damage (ED)"],["增强伤害","Enhanced Damage (ED)"],["强化防御","Enhanced Defense"],["敌人抗性","Enemy Res"],["火焰抗性","Fire Resist"],["闪电抗性","Lightning Resist"],["冰冷抗性","Cold Resist"],["毒素抗性","Poison Resist"],["魔法抗性","Magic Res"],["物理抗性","Physical Res"],["火焰吸收","Fire Absorb"],["闪电吸收","Lightning Absorb"],["冰冷吸收","Cold Absorb"],["魔法吸收","Magic Absorb"],["闪电伤害","Lightning Dmg"],["冰冷伤害","Cold Dmg"],["魔法伤害","Magic Dmg"],["物理伤害","Physical Dmg"],["魔伤减少","Magic Dmg Reduced"],["伤害减少","Damage Reduced"],["减少伤害","Damage Reduced"],["伤转法力","Dmg to Mana"],["无法冰冻","Cannot Be Frozen"],["不可摧毁","Indestructible"],["无法破坏","Indestructible"],["对不死伤","Dmg to Undead"],["对恶魔伤","Dmg to Demons"],["命中加成","Bonus to AR"],["最大伤害","Max Dmg"],["最小伤害","Min Dmg"],["生命上限","Max Life"],["法力上限","Max Mana"],["法力恢复","Regenerate Mana"],["恢复生命","Replenish Life"],["照亮范围","Light Radius"],["额外金币","Extra Gold (EG)"],["穿刺攻击","Piercing Attack"],["减慢目标","Slows Target"],["减缓目标","Slows Target"],["冰冻目标","Freezes Target"],["击中致盲","Hit Blinds Target"],["目标防御","Target Defense"],["怪物防御","Monster Defense"],["几率施放","Chance to Cast"],["几率造成","Chance of"],["击中施放","on Striking Cast"],["被击施放","when Struck Cast"],["攻击施放","on Attack Cast"],["需求等级","Req Lvl"],["需求力量","Req Str"],["需求敏捷","Req Dex"],["基础防御","Base Def"],["底材防御","Base Def"],["基础伤害","Base Dmg"],["底材伤害","Base Dmg"],["基础格挡","Base Block"],["移速惩罚","Speed Penalty"],["无形佣兵","Eth Merc"],["近战武器","Melee Weapon"],["双手法杖","2H Staff"],["符文之语","Runeword"],["术士君临","Reign of the Warlock"],["毁灭之王","Lord of Destruction"],["完美钻石","Perfect Diamond"],["完美骷髅","Perfect Skull"],["碎裂宝石","Chipped Gem"],["裂开宝石","Flawed Gem"],["南部碎片","Southern Shard"],["北部碎片","Northern Shard"],["东部碎片","Eastern Shard"],["西部碎片","Western Shard"],["深层碎片","Deep Shard"],["巨像先祖","Colossal Ancients"],["恐怖地带","Terror Zone"],["恐怖区域","Terror Zone"],["地表暗黑","DClone"],["静电力场","Static Field"],["霜之新星","Frost Nova"],["闪电之怒","Lightning Fury"],["冰封装甲","Frozen Armor"],["寒冰装甲","Chilling Armor"],["白骨装甲","Bone Armor"],["心灵结界","Psychic Ward"],["偷取生命","Life Tap / Life Leech"],["降低抵抗","Lower Resist"],["火焰强化","Enchant"],["橡木智者","Oak Sage"],["钢铁石魔","Iron Golem"],["骷髅支配","Skeleton Mastery"],["支配骷髅","Skeleton Mastery"],["影子训练","Shadow Disciplines"],["战斗支配","Combat Masteries"],["攻击灵气","Offensive Auras"],["防御灵气","Defensive Auras"],["战嚎技能","Warcries"],["元素技能","Elemental Skills"],["变形技能","Shape Shifting"],["召唤技能","Summoning Skills"],["诅咒技能","Curses"],["火焰技能","Fire Skills"],["闪电技能","Lightning Skills"],["冰冷技能","Cold Skills"],["恶魔技能","Demon Skills"],["秘法技能","Eldritch Skills"],["混沌技能","Chaos Skills"],["信念灵气","Conviction Aura"],["狂热灵气","Fanaticism Aura"],["冥思灵气","Meditation Aura"],["救赎灵气","Redemption Aura"],["反抗灵气","Defiance Aura"],["圣火灵气","Holy Fire Aura"],["荆棘灵气","Thorns Aura"],["活力灵气","Vigor Aura"],["净化灵气","Cleansing Aura"],["专注灵气","Concentration Aura"],["力量灵气","Might Aura"],["物理弓马","Phys Bowazon"],["顶球电法","ES Light Sorc"],["祝福锤骑","Hammerdin"],["陷阱刺客","Trapsin"],["踢击刺客","Kicksin"],["武学刺客","MA Assassin"],["混沌术士","Chaos Warlock"],["恶魔术士","Demon Warlock"],["魔法蓝装","Magic Item"],["亮金黄装","Rare Item"],["手工橙装","Crafted Item"],["绿色套装","Set Item"],["暗金装备","Unique Item"],["手工固定","Crafted Fixed"],["橙装固定","Crafted Fixed"],["最高可达","up to "],["任意蓝色","Any Magic "],["限定掉落","Exclusive Drop"],["经验获取","Experience Gained"],["免疫破除","Immunity Sundered"],["常见免疫","Common Immunities"],["腰带空间","Belt Slots"],["内衬甲","Quilted Armor"],["硬皮甲","Hard Leather Armor"],["钉皮甲","Studded Leather"],["鱼鳞甲","Scale Mail"],["胸片甲","Breast Plate"],["锁链甲","Chain Mail"],["板条甲","Splint Mail"],["轻板甲","Light Plate"],["板链甲","Plate Mail"],["哥特甲","Gothic Plate"],["古代甲","Ancient Armor"],["幽灵甲","Ghost Armor"],["蛇皮甲","Serpentskin Armor"],["锁环甲","Ring Mail"],["法师铠","Mage Plate"],["褐锈甲","Russet Armor"],["龙皮甲","Wyrmhide"],["钻石甲","Diamond Mail"],["覆铁甲","Loricated Mail"],["骨织甲","Boneweave"],["炎魔皮","Balrog Skin"],["小圆盾","Buckler"],["巨魔巢","Troll Nest"],["漩涡盾","Vortex Shield"],["水晶剑","Crystal Sword"],["巨神剑","Colossus Sword"],["巨神刃","Colossus Blade"],["双头斧","Ettin Axe"],["狂战斧","Berserker Axe"],["链子锤","Knout"],["使者杖","Caduceus"],["巨神戟","Colossus Voulge"],["秘文斧","Cryptic Axe"],["捕人叉","Mancatcher"],["暗影弓","Shadow Bow"],["摧锋甲","Shaftstop"],["骨寸断","Hone Sundan"],["风之力","Windforce"],["热刺靴","Hotspur"],["水上飘","Waterwalk"],["丝织靴","Silkweave"],["影舞者","Shadow Dancer"],["怨灵步","Wraithstep"],["金织带","Goldwrap"],["投石索","Sling"],["伊司特","Ist"],["伐克斯","Vex"],["弑君者","Kingslayer"],["执法者","Lawbringer"],["女巫团","Coven"],["锁子甲","Chain Mail"],["格子甲","Trellised Armor"],["连扣甲","Linked Mail"],["护胸甲","Cuirass"],["古龙皮","Wyrmhide"],["小型盾","Small Shield"],["大型盾","Large Shield"],["保护盾","Aegis"],["庇护盾","Ward"],["旋风盾","Vortex Shield"],["三重冠","Tiara"],["铁皮鞭","Knout"],["钩镰枪","Voulge"],["巨长斧","Giant Thresher"],["阴影弓","Shadow Bow"],["巨骷髅","Giant Skull"],["盗墓者","Tomb Reaver"],["水上漂","Waterwalk"],["红白猪","Ruby Jewel of Fervor"],["马赛克","Mosaic"],["下水道","Sewers"],["崔凡克","Travincal"],["女武神","Valkyrie"],["传送术","Teleportation"],["多头蛇","Hydra"],["下一级","Next Level"],["第一级","First Level"],["速度:","Velocity:"],["电荷弹","charged bolts"],["抗性:","Resistances:"],["魔法箭","Magic Arrow"],["火焰箭","Fire Arrow"],["冰霜箭","Cold Arrow"],["多重箭","Multiple Shot"],["爆裂箭","Exploding Arrow"],["闪电球","Lightning Bolt"],["急冻箭","Ice Arrow"],["导引箭","Guided Arrow"],["连珠箭","Strafe"],["献祭箭","Immolation Arrow"],["冻结箭","Freezing Arrow"],["火焰弹","Fire Bolt"],["暖身术","Warmth"],["冰霜弹","Ice Bolt"],["冰封甲","Frozen Armor"],["地狱火","Inferno"],["静电场","Static Field"],["冰球爆","Ice Blast"],["足跟火","Blaze"],["火球术","Fire Ball"],["闪电术","Lightning"],["碎冰甲","Shiver Armor"],["火焰墙","Fire Wall"],["冰尖柱","Glacial Spike"],["陨石术","Meteor"],["雷暴术","Thunder Storm"],["能量盾","Energy Shield"],["暴风雪","Blizzard"],["冰棱甲","Chilling Armor"],["冰封球","Frozen Orb"],["铁处女","Iron Maiden"],["圣光弹","Holy Bolt"],["圣盾术","Holy Shield"],["腾空斩","Leap Attack"],["旋风斩","Whirlwind"],["狂战士","Berserk"],["召唤术","Summoning"],["诅咒术","Curses"],["每一击","per hit"],["毒花藤","Poison Creeper"],["变形术","Lycanthropy"],["召唤狼","summon a wolf"],["食腐藤","Carrion Vine"],["小旋风","Twister"],["太阳藤","Solar Creeper"],["火山爆","Volcano"],["龙卷风","Tornado"],["投火弹","Fire Blast"],["雷电网","Shock Web"],["烈焰拳","Fists of Fire"],["双龙爪","Dragon Claw"],["伏地火","Wake of Fire"],["雷电爪","Claws of Thunder"],["寒冰刃","Blades of Ice"],["星星:","Stars:"],["%伤害","percent damage"],["%攻击","Percent Attack"],["%生命","Percent Life"],["瘴气弹","Miasma Bolt"],["烈焰波","Flame Wave"],["大教堂","Cathedral"],["亚巴顿","Abaddon"],["骷髅帽","Skull Cap"],["全护盔","Full Helm"],["覆面甲","Mask"],["哥特盾","Gothic Shield"],["皮手套","Leather Gloves"],["重手套","Heavy Gloves"],["轻护手","Light Gauntlets"],["锁链靴","Chain Boots"],["护胫靴","Greaves"],["轻腰带","Light Belt"],["重腰带","Heavy Belt"],["尖刺盾","Spiked Shield"],["双刃斧","Double Axe"],["宽刃斧","Broad Axe"],["战斗斧","Battle Axe"],["大权杖","Grand Scepter"],["狼牙棒","Spiked Club"],["流星锤","Morning Star"],["弯刃剑","Falchion"],["战争剑","War Sword"],["双手剑","2H Sword"],["手半剑","Bastard Sword"],["焰刃剑","Flamberge"],["长匕首","Dirk"],["波刃剑","Kris"],["投掷斧","Throwing Axe"],["长标枪","Pilum"],["三叉戟","Trident"],["羽剑杖","Brandistock"],["大砍刀","Bardiche"],["长柄斧","Poleaxe"],["多节杖","Gnarled Staff"],["战斗杖","Battle Staff"],["复合弓","Composite Bow"],["短战弓","Short Battle Bow"],["长战弓","Long Battle Bow"],["连击弩","Repeating Crossbow"],["尖刃盾","Barbed Shield"],["战争靴","War Boots"],["网纹靴","Mesh Boots"],["古代盾","Ancient Shield"],["椭圆盾","Scutum"],["防卫盾","Defender"],["宝冠盔","Grand Crown"],["喙面盔","Basinet"],["护鼻盔","Casque"],["战争帽","War Hat"],["巧工弩","Chu-Ko-Nu"],["攻城弩","Siege Crossbow"],["哥特弓","Gothic Bow"],["符文弓","Rune Bow"],["双臂弓","Double Bow"],["雪松弓","Cedar Bow"],["刀锋弓","Razor Bow"],["符文杖","Rune Staff"],["哥特杖","Gothic Staff"],["雪松杖","Cedar Staff"],["铁头棒","Quarterstaff"],["叉戟枪","Fuscina"],["重梭镖","Simbilan"],["重标枪","Great Pilum"],["飞蝠斧","Hurlbat"],["战斗镖","Battle Dart"],["行刑剑","Executioner Sword"],["獠牙剑","Tusk Sword"],["古代剑","Ancient Sword"],["符文剑","Rune Sword"],["战斗剑","Battle Sword"],["短弯刀","Cutlass"],["尖头锤","Martel de Fer"],["战斗锤","Battle Hammer"],["尖刺棒","Barbed Club"],["古代斧","Ancient Axe"],["哥特斧","Gothic Axe"],["蛇妖斧","Naga"],["鸦嘴锄","Crowbill"],["双锋斧","Twin Axe"],["剁肉斧","Cleaver"],["哥特剑","Gothic Sword"],["吉德宾","Gidbinn"],["黄金鸟","The Golden Bird"],["紫宝石","Amethyst"],["黄宝石","Topaz"],["马刺靴","Spur"],["步行鞋","Tread"],["潜行靴","Stalker"],["拓荒靴","Blazer"],["钉头鞋","Nails"],["登山鞋","Trample"],["护身符","Charm"],["大头棒","Bludgeon"],["护颈圈","Collar"],["袖手套","Cuff"],["扣带靴","Fetlock"],["半身甲","Hauberk"],["铁固腰","Iron Stay"],["铁围盔","Coil"],["木底鞋","Sabot"],["凿颅者","Skull Splitter"],["钯肉斧","Rakescar"],["铲肉斧","Goreshovel"],["劈颅者","Brainhew"],["巨无霸","Humongous"],["钢榔头","Steeldriver"],["剥魂者","Soulflay"],["碎肉锯","Ripsaw"],["大族长","The Patriarch"],["迪格勒","The Diggler"],["玉尖刀","The Jade Tan Do"],["钢刺棒","Steelgoad"],["收魂者","Soul Harvest"],["突围者","The Battlebranch"],["沙罗曼","The Salamander"],["铁长棍","The Iron Jang Bong"],["百夫长","The Centurion"],["雄鹰甲","Hawkmail"],["石中毛","Rockfleece"],["刺股靴","Tearhaunch"],["雷尼摩","Lenymo"],["蛇皮索","Snakecord"],["手爪刀","Claws"],["手推剑","Suwayyah"],["新月斧","Small Crescent"],["镀银斧","Silver-edged Axe"],["斩首斧","Decapitator"],["冠军斧","Champion Axe"],["戒律棒","Truncheon"],["暴君棒","Tyrant Club"],["加固锤","Reinforced Mace"],["猎鹰剑","Falcata"],["叶根刀","Ataghan"],["精致剑","Elegant Blade"],["征服剑","Conquest Sword"],["秘文剑","Cryptic Sword"],["神话剑","Mythical Sword"],["传说剑","Legend Sword"],["高地剑","Highland Blade"],["炎魔剑","Balrog Blade"],["冠军剑","Champion Sword"],["秘银刺","Mithril Point"],["牙刃刀","Fanged Knife"],["炎魔矛","Balrog Spear"],["双股叉","Winged Harpoon"],["幽灵矛","Ghost Spear"],["石笋杖","Stalagmite"],["橡木棍","Shillelagh"],["蜘蛛弓","Spider Bow"],["利刃弓","Blade Bow"],["钻石弓","Diamond Bow"],["防护弓","Ward Bow"],["弹丸弓","Pellet Bow"],["巨神弩","Colossus Crossbow"],["恶魔弩","Demon Crossbow"],["铁指套","Knuckles"],["切割刀","Slashers"],["锥头刀","Splay"],["削骨刀","Shank"],["猎鹿弓","Stag Bow"],["双曲弓","Reflex Bow"],["仪式弓","Ceremonial Bow"],["仪式矛","Ceremonial Spear"],["天界石","Heavenly Stone"],["鹿角盔","Antlers"],["颚骨帽","Jawbone Cap"],["牙骨盔","Fanged Helm"],["长角盔","Horned Helm"],["强攻盔","Assault Helmet"],["轻圆盾","Rondache"],["纹章盾","Heraldic Shield"],["艾琳盾","Aerin Shield"],["王冠盾","Crown Shield"],["武装盔","Armet"],["巨贝盔","Giant Conch"],["月神盾","Luna"],["镜化靴","Mirrored Boots"],["圣羽盔","Sacred Feathers"],["头狼盔","Alpha Helm"],["镀金盾","Gilded Shield"],["皇家盾","Royal Shield"],["克害盔","Carnage Helm"],["御雷者","Stormrider"],["牛魔斧","The Minotaur"],["震地者","Earthshaker"],["击破者","Bloodletter"],["斩首者","Headstriker"],["冰之王","Bing Sz Wang"],["裂云剑","Cloudcrack"],["裂柱者","Spineripper"],["剜心者","Heart Carver"],["洞穿者","The Impaler"],["噬魂叉","Soulfeast Tine"],["草木飞","Bush Wacker"],["救赎者","The Redeemer"],["皮肉骨","Fleshbone"],["碎石者","Stone Crusher"],["吸魂者","Soul Drainer"],["利维坦","Leviathan"],["撕裂者","Lacerator"],["邪灵斩","Djinn Slayer"],["鹤嘴锄","Cranebeak"],["食之伤","Gulletwound"],["撼地者","Earth Shifter"],["碧玉爪","Jade Talon"],["蛇信子","Snake Tongue"],["收割者","The Harvester"],["月之影","Moon Shadow"],["恶魔网","Demonweb"],["影之鹰","Shade Falcon"],["大维卡","The Vicar"],["沙尘暴","Dust Storm"],["游掠者","The Prowler"],["三簇棘","Triad's Foliage"],["凤凰蛋","Phoenix Egg"],["飞龙首","Wyvern's Head"],["烘焙师","The Baker"],["野蛮人","Barbarian"],["德鲁伊","Druid"],["圣骑士","Paladin"],["亚马逊","Amazon"],["贝符文","Ber Rune"],["瑟符文","Sur Rune"],["罗符文","Lo Rune"],["科符文","Ko Rune"],["暴风雨","Tempest"],["全技能","to All Skills"],["全属性","to All Attributes"],["敌火抗","Enemy Fire Res"],["敌电抗","Enemy Light Res"],["敌冰抗","Enemy Cold Res"],["敌毒抗","Enemy Poison Res"],["敌魔抗","Enemy Magic Res"],["敌物抗","Enemy Phys Res"],["伤转蓝","Dmg to Mana"],["命中率","Attack Rating"],["最大伤","Max Dmg"],["最小伤","Min Dmg"],["被击中","When Struck"],["次充能","Charges"],["拉祖克","Larzuk"],["全职业","All Classes"],["单手剑","1H Sword"],["十字弓","Crossbow"],["圣骑盾","Paladin Shield"],["死灵盾","Necro Trophy"],["格挡率","Block"],["完美紫","P.Amethyst"],["完美红","P.Ruby"],["完美蓝","P.Sapphire"],["完美绿","P.Emerald"],["完美黄","P.Topaz"],["完美钻","P.Diamond"],["充能弹","Charged Bolt"],["电标马","Light Javazon"],["双热骑","Zealot"],["盾击骑","Smiter"],["复仇骑","Avenger"],["狂乱蛮","Frenzy Barb"],["旋风蛮","WW Barb"],["打钱蛮","Gold Find Barb"],["潜能版","Latent"],["焕新版","Renewed"],["未评级","Unrated"],["皮甲","Leather Armor"],["环甲","Ring Mail"],["漆甲","Lacquered Plate"],["小盾","Targe"],["大盾","Pavise"],["鸢盾","Kite Shield"],["塔盾","Tower Shield"],["骨盾","Bone Shield"],["巨盾","Pavise"],["圣盾","Aegis"],["宝冠","Corona"],["冠冕","Tiara"],["权冠","Diadem"],["阔剑","Broad Sword"],["长剑","Long Sword"],["战斧","War Axe"],["连枷","Flail"],["鞭锤","Scourge"],["雷锤","Thunder Maul"],["斧戟","Voulge"],["巨镰","Scythe"],["砍斧","Thresher"],["门徒","The Disciple"],["排齿","Toothrow"],["海鸥","Gull"],["雷击","Thunderstroke"],["惧牙","Dreadfang"],["魔胎","Homunculus"],["骨焰","Boneflame"],["霜灼","Frostburn"],["碎钢","Steelrend"],["夜烟","Nightsmoke"],["猫眼","Cat's Eye"],["旭日","The Rising Sun"],["毁灭","Destruction"],["艾尔","El"],["艾德","Eld"],["提尔","Tir"],["奈夫","Nef"],["艾斯","Eth"],["伊司","Ith"],["塔尔","Tal"],["拉尔","Ral"],["欧特","Ort"],["图尔","Thul"],["安姆","Amn"],["索尔","Sol"],["沙伊","Shael"],["多尔","Dol"],["海尔","Hel"],["艾欧","Io"],["卢姆","Lum"],["法尔","Fal"],["兰姆","Lem"],["普尔","Pul"],["乌姆","Um"],["玛尔","Mal"],["古尔","Gul"],["欧姆","Ohm"],["扎哈","Jah"],["查姆","Cham"],["佐德","Zod"],["黑色","Black"],["愤怒","Wrath"],["圣雷","Holy Thunder"],["荣耀","Honor"],["王恩","King's Grace"],["叶子","Leaf"],["狮心","Lionheart"],["学识","Lore"],["怨恨","Malice"],["旋律","Melody"],["回忆","Memory"],["天底","Nadir"],["光辉","Radiance"],["韵律","Rhyme"],["沉默","Silence"],["烟雾","Smoke"],["隐秘","Stealth"],["钢铁","Steel"],["力量","Str"],["毒液","Venom"],["财富","Wealth"],["白色","White"],["和风","Zephyr"],["野兽","Beast"],["荆棘","Bramble"],["烙印","Brand"],["混沌","Chaos"],["新月","Crescent Moon"],["殒灭","Death"],["迷狂","Delirium"],["厄运","Doom"],["巨龙","Dragon"],["梦境","Dream"],["强压","Duress"],["锐锋","Edge"],["谜团","Enigma"],["永恒","Eternity"],["流放","Exile"],["信念","Faith"],["饥荒","Famine"],["刚毅","Fortitude"],["阴霾","Gloom"],["悔恨","Grief"],["和谐","Harmony"],["寒冰","Ice"],["无限","Infinity"],["眼光","Insight"],["誓言","Oath"],["顺从","Obedience"],["热情","Passion"],["凤凰","Phoenix"],["骄傲","Pride"],["谨慎","Prudence"],["裂隙","Rift"],["庇护","Sanctuary"],["精神","Spirit"],["壮美","Splendor"],["磐石","Stone"],["疾风","Wind"],["怒火","Wrath"],["白骨","Bone"],["启迪","Enlightenment"],["神话","Myth"],["平和","Peace"],["信条","Credendum"],["暴雨","Rain"],["背叛","Treachery"],["迷雾","Mist"],["执着","Obsession"],["典范","Pattern"],["瘟疫","Plague"],["智慧","Wisdom"],["壁垒","Bulwark"],["解药","Cure"],["接地","Ground"],["壁炉","Hearth"],["癫狂","Mania"],["狂乱","Hysteria"],["变形","Metamorphosis"],["模糊","Mosaic"],["淬火","Temper"],["权威","Authority"],["仪式","Ritual"],["警戒","Vigilance"],["虚空","Void"],["布甲","Quilted Armor"],["鳞甲","Scale Mail"],["胸甲","Breast Plate"],["板甲","Splint Mail"],["头冠","Corona"],["镰刀","Scythe"],["战戟","Partizan"],["核瞳","The Oculus"],["侏儒","Homunculus"],["血拳","Bloodfist"],["霜燃","Frostburn"],["热刺","Hotspur"],["纱织","Silkweave"],["裂骨","Bone Break"],["黑裂","Black Cleft"],["安置","Laying of Hands"],["全抗","All Res"],["单抗","Single Res"],["敏捷","Dex"],["精力","Energy"],["生命","Life"],["法力","Mana"],["双吸","Dual Leech"],["愚人","Fool's"],["偏向","of Deflecting"],["特尔","Tir"],["那夫","Nef"],["爱斯","Eth"],["埃欧","Io"],["马尔","Mal"],["狂怒","Fury"],["知识","Lore"],["毒牙","Venom"],["微风","Zephyr"],["品牌","Brand"],["死神","Death"],["末日","Doom"],["飞龙","Dragon"],["强制","Duress"],["边缘","Edge"],["流亡","Exile"],["信心","Faith"],["幽暗","Gloom"],["冰冻","Ice"],["誓约","Oath"],["遵从","Obedience"],["审慎","Prudence"],["裂缝","Rift"],["圣堂","Sanctuary"],["辉煌","Splendor"],["石块","Stone"],["和平","Peace"],["原则","Principle"],["背信","Treachery"],["执念","Obsession"],["花纹","Pattern"],["治愈","Cure"],["大地","Ground"],["炉火","Hearth"],["狂热","Mania"],["监牢","Jail"],["地穴","The Pit"],["诱饵","Decoy"],["等级","Lvl"],["数量","Quantity"],["平方","squares"],["平均","Average"],["目标","targets"],["怪物","Monster "],["每码","per yard"],["攻击","Attack"],["脚踢","Kick"],["投掷","Throw"],["心眼","Inner Sight"],["戳刺","Jab"],["闪避","Dodge"],["躲避","Avoid"],["刺爆","Impale"],["刺穿","Penetrate"],["回避","Evade"],["猛刺","Fend"],["贯穿","Pierce"],["骨牙","Teeth"],["骨甲","Bone Armor"],["削弱","Weaken"],["毒匕","Poison Dagger"],["邪爆","Corpse Explosion"],["恐惧","Terror"],["骨墙","Bone Wall"],["迷乱","Confuse"],["毒爆","Poison Explosion"],["骨矛","Bone Spear"],["吸引","Attract"],["衰老","Decrepify"],["骨牢","Bone Prison"],["骨灵","Bone Necro"],["重生","Revive"],["牺牲","Sacrifice"],["盾击","Smite / Smiter"],["祈祷","Prayer"],["抗火","Resist Fire"],["反抗","Defiance"],["抗冰","Resist Cold"],["热忱","Zeal"],["冲锋","Charge"],["净化","Cleansing"],["抗雷","Resist Lightning"],["复仇","Vengeance"],["专注","Concentration"],["冥思","Meditation"],["定罪","Conviction"],["救赎","Redemption"],["拯救","Salvation"],["猛击","Bash"],["狂嗥","Howl"],["寻药","Find Potion"],["跳斩","Leap"],["嘲讽","Taunt"],["大吼","Shout"],["击昏","Stun"],["寻物","Find Item"],["战嗥","Battle Cry"],["怒嗥","War Cry"],["鉴定","Identify"],["持续","over"],["元素","Elemental"],["召唤","Summoning"],["陷阱","Traps"],["命中","AR"],["渡鸦","Raven"],["猛槌","Maul"],["狂犬","Rabies"],["焰爪","Fire Claws"],["饥饿","Hunger"],["震波","Shock Wave"],["棘灵","Spirit of Barbs"],["狼怒","Fury"],["飓风","Hurricane"],["龙爪","Dragon Talon"],["消隐","Fade"],["涂毒","Venom"],["狼:","Wolf:"],["尖刺","Spikes"],["附加","Adds"],["深渊","Abyss"],["劈斩","Cleave"],["血誓","Blood Oath"],["暴食","Engorge"],["吞噬","Consume"],["恶魔","Demon"],["邪术","Eldritch"],["一幕","Act 1"],["二幕","Act 2"],["三幕","Act 3"],["四幕","Act 4"],["离开","LEAVE"],["营房","Barracks"],["寝陵","Mausoleum"],["墓穴","Crypt"],["五幕","Act 5"],["洞穴","Cave"],["地洞","Hole"],["深坑","Pit"],["监狱","Jail"],["熟练","Skillful"],["软帽","Cap"],["头盔","Helm"],["重盔","Great Helm"],["王冠","Crown"],["护手","Gauntlets"],["短靴","Boots"],["重靴","Heavy Boots"],["腰带","Belt"],["骨盔","Bone Helm"],["手斧","Hand Axe"],["军镐","Military Pick"],["大斧","Large Axe"],["重斧","Great Axe"],["巨斧","Giant Axe"],["魔杖","Wand"],["木棒","Club"],["权杖","Scepter"],["钉锤","Mace"],["战锤","War Hammer"],["大锤","Maul"],["重锤","Great Maul"],["短剑","Short Sword"],["弯刀","Scimitar"],["军刀","Sabre"],["巨剑","Giant Sword"],["重剑","Great Sword"],["匕首","Dagger"],["短刃","Blade"],["标枪","Javelin"],["短矛","Short Spear"],["梭镖","Glaive"],["投枪","Throwing Spear"],["镋钯","Spetum"],["尖枪","Pike"],["斧枪","Halberd"],["短杖","Short Staff"],["长杖","Long Staff"],["战杖","War Staff"],["短弓","Short Bow"],["猎弓","Hunter's Bow"],["长弓","Long Bow"],["轻弩","Light Crossbow"],["重弩","Heavy Crossbow"],["战靴","Battle Boots"],["龙盾","Dragon Shield"],["圆盾","Round Shield"],["札甲","Mesh Armor"],["轻盔","Sallet"],["弩炮","Ballista"],["巨弩","Arbalest"],["刃弓","Edge Bow"],["杖棍","Jo Staff"],["骑枪","Lance"],["长枪","Yari"],["战叉","War Fork"],["战矛","War Spear"],["鱼叉","Harpoon"],["战镖","War Dart"],["袖匕","Rondel"],["锐匕","Poignard"],["战棒","War Club"],["大棒","Cudgel"],["钩斧","Bearded Axe"],["军斧","Military Axe"],["小斧","Hatchet"],["药剂","Elixir"],["护符","Amulet"],["戒指","Ring"],["箭矢","Arrows"],["火把","Torch"],["弩矢","Bolts"],["钥匙","Key"],["耳朵","Ear"],["顽魔","Imp"],["利锯","Saw"],["哭喊","Cry"],["面罩","Visage"],["头环","Circlet"],["面纱","Veil"],["头罩","Hood"],["护额","Brow"],["战盔","Casque"],["面甲","Visor"],["兜帽","Cowl"],["兽皮","Hide"],["毛皮","Pelt"],["甲壳","Carapace"],["外衣","Coat"],["罩衣","Wrap"],["束衣","Suit"],["披风","Cloak"],["罩袍","Shroud"],["夹克","Jack"],["斗篷","Mantle"],["守卫","Guard"],["纹章","Badge"],["守御","Ward"],["盾牌","Shield"],["飞翼","Wing"],["记号","Mark"],["徽章","Emblem"],["之手","Hand"],["之拳","Fist"],["利爪","Claw"],["之扼","Clutches"],["紧握","Grip"],["掌握","Grasp"],["之握","Hold"],["触摸","Touch"],["护指","Finger"],["指拳","Knuckle"],["护腿","Shank"],["护胫","Greaves"],["足履","Track"],["便鞋","Slippers"],["扣环","Clasp"],["扣带","Buckle"],["束带","Harness"],["扣锁","Lock"],["铰链","Fringe"],["缠腰","Winding"],["腰链","Chain"],["腰绳","Lash"],["腰索","Cord"],["绳结","Knot"],["圆圈","Circle"],["环圈","Loop"],["法瞳","Eye"],["腰环","Turn"],["螺环","Spiral"],["线圈","Coil"],["环带","Gyre"],["指环","Band"],["环盘","Whorl"],["之心","Heart"],["绳套","Noose"],["项链","Amulet"],["项圈","Collar"],["念珠","Beads"],["颈圈","Torc"],["护颈","Gorget"],["木头","Wood"],["隐现","Loom"],["竖琴","Harp"],["主宰","Master"],["木条","Bar"],["劈砍","Hew"],["曲木","Crook"],["残害","Mar"],["之壳","Shell"],["木棍","Stake"],["尖桩","Picket"],["栅木","Pale"],["棱甲","Flange"],["防护","Ward"],["铁踵","Iron Heel"],["尖牙","Tooth"],["倒刺","Barb"],["宝球","Orb"],["统治","Rule"],["颅骨","Cranium"],["死手","Hand"],["号角","Horn"],["印记","Sign"],["圣像","Icon"],["铁拳","Iron Fist"],["克爪","Claw"],["格挡","Block"],["小杖","Rod"],["支柱","Spine"],["遮蔽","Shelter"],["火炬","Torch"],["之御","Guard"],["克钳","Pincers"],["胸胄","Case"],["突袭","Ambush"],["挑战","Gage"],["腰扣","Buckle"],["死触","Touch"],["光环","Halo"],["牛角","Horns"],["长袍","Robe"],["符徽","Sigil"],["手套","Gloves"],["外壳","Flesh"],["封印","Seal"],["头骨","Skull"],["卫肩","Guard"],["刃骨","Bladebone"],["酋长","The Chieftain"],["铁石","Ironstone"],["碎骨","Bonesnap"],["黑舌","Blacktongue"],["龙枪","The Dragon Chang"],["剜眼","Pluckeye"],["铅鸦","Leadcrow"],["灰影","Greyform"],["响钢","Steelclash"],["御敌","The Ward"],["鼠窝","Rat's Nest"],["翼盔","Winged Helm"],["小剑","Stiletto"],["拳剑","Katar"],["腕刃","Wrist Blade"],["刃爪","Blade Talons"],["拳刃","Quhab"],["腕刺","Wrist Spike"],["手镰","Hand Scythe"],["腕剑","Wrist Sword"],["骨刀","Bone Knife"],["飞刀","Flying Knife"],["飞斧","Flying Axe"],["翼刀","Winged Knife"],["翼斧","Winged Axe"],["手杖","Walking Stick"],["重弓","Great Bow"],["裹腿","Wraps"],["手爪","Claws"],["鹰盔","Hawk Helm"],["狼头","Wolf Head"],["军帽","Shako"],["塔盔","Spired Helm"],["斗盾","Heater"],["狮盔","Lion Helm"],["珠宝","Jewels"],["草药","Herb"],["脾脏","Spleen"],["头皮","Scalp"],["灵魂","Soul"],["短匕","Quill"],["旗帜","Flag"],["尾巴","Tail"],["尖角","Horn"],["晶体","Eye"],["颚骨","Jawbone"],["冰殛","Coldkill"],["月陨","Moonfall"],["裂斩","Riftslash"],["卫剑","Swordguard"],["天击","Skystrike"],["刨肠","Visceratuant"],["肉耙","Meatscrape"],["碎胆","Gut Siphon"],["响石","Stone Rattle"],["钢罩","Steel Shade"],["憎恨","Odium"],["斩骨","Bonehew"],["龙牙","Dragontooth"],["灵圣","El Espiritu"],["棍王","The Longest Rod"],["黑魂","Alma Negra"],["刨石","Rockhew"],["肠线","Catgut"],["魂焰","Ghostflame"],["影弑","Shadow Killer"],["鹰风","Eaglewind"],["风锤","Windhammer"],["赤月","Bloodmoon"],["战狼","Warhound"],["石怒","Stonerage"],["赤雨","Blood Rain"],["剑圣","Blade Master"],["石鸦","Stoneraven"],["碎月","Moonrend"],["夜召","Nightsummon"],["狂徒","The Swashbuckler"],["巨木","Palo Grande"],["克害","Carnage Leaver"],["鬼凄","Ghost Leach"],["风击","Windstrike"],["铁皮","Iron Pelt"],["鸦鸣","Crow Caw"],["龙鳞","Dragonscale"],["冥鸦","Nethercrow"],["狼嚎","Wolfhowl"],["圣誓","Sacred Charge"],["护甲","Armor"],["祖父","The Grandfather"],["碎颅","The Cranium Basher"],["烈鞭","Riftlash"],["伪经","Apocrypha"],["奇士","Xenos"],["纳迦","Nagas"],["屠夫","The Butcher"],["莫伊","Moe"],["古书","Old Book"],["典籍","Tome"],["法典","Codex"],["纲要","Compendium"],["魔典","Grimoire"],["靴子","Boots"],["术士","Warlock"],["法杖","Staff"],["刺客","Assassin"],["巫师","Sorceress"],["神符","Charms"],["药水","Potions"],["弹药","Ammunition"],["符文","Rune"],["宝石","Gems"],["武器","Weapon"],["配饰","Accessories"],["杂项","Misc"],["副手","Off-hand"],["近战","Melee"],["美丽","Beauty"],["精华","Elite"],["机遇","Chance"],["黑暗","Darkness"],["白昼","Daylight"],["欺骗","Deception"],["欲望","Desire"],["绝望","Despair"],["惊惧","Dread"],["欢欣","Elation"],["羡慕","Envy"],["鸿运","Fortune"],["友谊","Friendship"],["光华","Glory"],["报复","Revenge"],["谦逊","Humility"],["无辜","Innocence"],["嫉妒","Jealousy"],["审判","Judgement"],["律法","Law"],["闪电","Lightning"],["爱情","Love"],["忠诚","Loyalty"],["疯狂","Madness"],["清晨","Morning"],["谜题","Mystery"],["黑夜","Night"],["湮灭","Oblivion"],["耐心","Patience"],["忏悔","Penitence"],["灾劫","Peril"],["疾病","Pestilence"],["虔敬","Piety"],["赞美","Praise"],["战力","Prowess in Battle"],["惩罚","Punishment"],["纯洁","Purity"],["质问","Question"],["理性","Reason"],["绯红","Red"],["奇遇","Serendipity"],["阴影","Shadow"],["悲伤","Sorrow"],["星光","Starlight"],["止水","Still Water"],["钉刺","Sting"],["风暴","Storm"],["诱惑","Temptation"],["渴求","Thirst"],["思绪","Thought"],["雷霆","Thunder"],["时光","Time"],["传统","Tradition"],["信任","Trust"],["真理","Truth"],["勇气","Valor"],["胜利","Victory"],["声音","Voice"],["战争","War"],["源水","Water"],["低语","Whisper"],["灾祸","Woe"],["奇迹","Wonder"],["青春","Youth"],["火抗","Fire Res"],["电抗","Light Res"],["冰抗","Cold Res"],["毒抗","Poison Res"],["魔抗","Magic Res"],["物抗","Phys Res"],["火吸","Fire Absorb"],["电吸","Light Absorb"],["冰吸","Cold Absorb"],["魔吸","Magic Absorb"],["火伤","Fire Dmg"],["电伤","Light Dmg"],["冰伤","Cold Dmg"],["毒伤","Poison Dmg"],["魔伤","Magic Dmg"],["物伤","Phys Dmg"],["物免","Phys Dmg Reduced (DR)"],["施放","Cast"],["聚气","Charges"],["需求","Req"],["无形","Eth"],["佣兵","Merc"],["死灵","Necro"],["法师","Sorceress"],["限定","Only"],["专属","Exclusive"],["普通","Normal"],["扩展","Exceptional"],["职业","Class"],["独特","Unique"],["通用","Universal"],["盔甲","Armor"],["轻甲","Light Armor"],["中甲","Medium Armor"],["重甲","Heavy Armor"],["单手","1H"],["双手","2H"],["长柄","Polearm"],["长矛","Spear"],["骨杖","Wand"],["法珠","Orb"],["弓弩","Bow/Crossbow"],["鞋子","Boots"],["首饰","Jewelry"],["底材","Base"],["毕业","BiS"],["开荒","Starter"],["过渡","Transitional"],["神器","Top-Tier"],["核心","Core"],["首选","Top Pick"],["必备","Essential"],["极品","GG"],["体力","Vit"],["活力","Vit"],["防御","Def"],["耐力","Stamina"],["耐久","Dur"],["技能","Skills"],["灵气","Aura"],["伤害","Dmg"],["抗性","Res"],["攻速","IAS"],["击退","Knockback"],["件套","Pieces"],["恐吓","Terror"],["标马","Javazon"],["弓马","Bowazon"],["顶球","Energy Shield (ES)"],["电法","Light Sorc"],["冰法","Cold Sorc"],["火法","Fire Sorc"],["纯召","Summon Necro"],["毒召","Poison/Summon Necro"],["毒骨","Poison/Bone Necro"],["火德","Fire Druid"],["风德","Wind Druid"],["狼德","Fury Druid"],["熊德","Bear Druid"],["双热","Zealot"],["锤骑","Hammerdin"],["打钱","Gold Find"],["法系","Caster"],["远程","Ranged"],["物理","Physical"],["火焰","Fire"],["冰冷","Cold"],["毒素","Poison"],["魔法","Magic"],["蓝装","Magic"],["黄装","Rare"],["橙装","Crafted"],["绿装","Set"],["暗金","Unique"],["前缀","Prefix"],["后缀","Suffix"],["最多","Max "],["最大","Max "],["最高","Max "],["最低","Min "],["自带","Built-in "],["额外","Extra "],["随机","Random "],["任意","Any "],["全部","All "],["属性","Stats"],["词缀","Affix"],["掉落","Drop"],["升级","Upgrade"],["打孔","Socket"],["重铸","Reroll"],["维修","Repair"],["充能","Charges"],["潜能","Latent"],["焕新","Renewed"],["经验","Exp"],["压至","Capped at "],["自身","Self "],["免疫","Immune"],["联动","Synergy"],["极佳","Best"],["优秀","Great"],["良好","Good"],["一般","Fair"],["较差","Poor"],["评级","Tier"],["咒符","Charms"],["科","Ko"],["罗","Lo"],["瑟","Sur"],["贝","Ber"],["乔","Jah"],["风","Wind"],["雨","Rain"],["孔","Sockets"],["件","pc"],["级","Lvl"],["与"," & "],["或"," / "],["及"," & "],["防","Def "],["甲","Armor"],["头","Helm"],["盾","Shield"],["剑","Sword"],["锤","Hammer"],["斧","Axe"],["弓","Bow"],["爪","Claw"],["矛","Spear"],["杖","Staff"],["鞋","Boots"],["手","Gloves"],["带","Belt"],["链","Amulet"],["戒","Ring"],["力","Str"],["敏","Dex"],["体","Vit"],["精","Energy"],["血","Life"],["蓝","Mana"],["火","Fire"],["冰","Cold"],["电","Light"],["毒","Poison"],["魔","Magic"],["物","Phys"]];
const CN2TW_MAP = new Map();
for (let i = 0; i < CN2TW_SRC.length; i++) CN2TW_MAP.set(CN2TW_SRC[i], CN2TW_DST[i]);

function toZhTW(str) {
  if (!str) return "";
  let s = String(str);
  for (let i = 0; i < TW_PHRASE_PAIRS.length; i++) {
    const k = TW_PHRASE_PAIRS[i][0];
    if (s.includes(k)) s = s.split(k).join(TW_PHRASE_PAIRS[i][1]);
  }
  let out = "";
  for (const ch of s) out += CN2TW_MAP.get(ch) || ch;
  return out;
}

function toEnUS(str) {
  if (!str) return "";
  let s = String(str);
  if (!/[一-鿿]/.test(s)) return s;
  s = s.replace(/第\s*([一二三四五1-5])\s*幕/g, (_, m) => {
    const map = { "一": 1, "二": 2, "三": 3, "四": 4, "五": 5 };
    return "Act " + (map[m] || m);
  });
  s = s.replace(/可出\s*(\d+)\s*孔/g, "Max $1 Sockets");
  s = s.replace(/最大\s*(\d+)\s*孔/g, "Max $1 Sockets");
  s = s.replace(/(\d+)\s*孔/g, "$1 Sockets");
  s = s.replace(/(\d+)\s*件套/g, "$1-Piece Set");
  s = s.replace(/【(\d+)\s*件】/g, "[$1 Pieces]");
  s = s.replace(/(\d+(?:[–-]\d+)?)\s*件：/g, "$1 Pieces: ");
  s = s.replace(/需求等级\s*(\d+)/g, "Req Lvl $1");
  s = s.replace(/需求力量\s*(\d+)/g, "Req Str $1");
  s = s.replace(/距切换\s*/g, "Next in ");
  s = s.replace(/需\s*(\d+)/g, "Need $1");
  s = s.replace(/总\s*(\d+)/g, "Total $1");
  for (let i = 0; i < EN_PHRASE_PAIRS.length; i++) {
    const k = EN_PHRASE_PAIRS[i][0];
    if (s.includes(k)) s = s.split(k).join(" " + EN_PHRASE_PAIRS[i][1] + " ");
  }
  return s.replace(/\s{2,}/g, " ").trim();
}

function tUI(key) {
  return (UI_I18N[currentLang] && UI_I18N[currentLang][key]) || UI_I18N.zhCN[key] || key;
}

function pickLangTitle(item) {
  if (!item) return "";
  if (currentLang === "zhTW") return (item.i18n && item.i18n.zhTW) || toZhTW(item.nameZh || item.zhName || "");
  if (currentLang === "enUS") return (item.i18n && item.i18n.enUS) || item.nameEn || item.enName || item.name || "";
  return (item.i18n && item.i18n.zhCN) || item.nameZh || item.zhName || "";
}

function pickLangSub(item) {
  if (!item) return "";
  if (currentLang === "enUS") return (item.i18n && item.i18n.zhCN) || item.nameZh || item.zhName || "";
  return (item.i18n && item.i18n.enUS) || item.nameEn || item.enName || item.name || "";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}

function colorFor(progress) {
  if (progress >= 6) return "#da4b38";
  if (progress >= 5) return "#e97832";
  if (progress >= 4) return "#d5a748";
  return "#8e8375";
}

function formatTime(seconds) {
  if (!seconds) return "暂无记录";
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
    hour12: false
  }).format(new Date(seconds * 1000));
}

function serverCell(server, mode) {
  if (!server) return '<div class="cell"><div class="message">' + (currentLang === "enUS" ? "No Data" : "暂无数据") + '</div></div>';
  const bars = Array.from({ length: 6 }, (_, index) =>
    '<span class="bar ' + (index < server.progress ? "on" : "") + '"></span>'
  ).join("");
  const filtered = server.progress < minProgress ? " filtered" : "";
  const modeLabel = currentLang === "enUS"
    ? (mode.ladder ? "Ladder " : "Non-Ladder ") + (mode.hardcore ? "HC" : "SC")
    : (currentLang === "zhTW" ? toZhTW(mode.label) : mode.label);
  const progMsg = currentLang === "enUS"
    ? ("Stage " + server.progress + "/6")
    : (currentLang === "zhTW" ? toZhTW(progressNames[server.progress] || "未知状态") : (progressNames[server.progress] || "未知状态"));
  const updLabel = currentLang === "enUS" ? "Updated " : (currentLang === "zhTW" ? "更新 " : "更新 ");
  const walkLabel = currentLang === "enUS" ? "Last Walk " : (currentLang === "zhTW" ? "上次觸發 " : "上次触发 ");
  return '<article class="cell' + filtered + '" style="--accent:' + colorFor(server.progress) + '">' +
    '<div class="card-top"><span class="mode">' + modeLabel + '</span><span class="level">' +
    server.progress + '/6</span></div><div class="progress">' + bars + '</div>' +
    '<div class="message">' + escapeHtml(progMsg) + '</div>' +
    '<div class="times">' + updLabel + formatTime(server.lastUpdate) +
    '<br>' + walkLabel + formatTime(server.lastWalk) + '</div></article>';
}

function renderDlc(servers, rotw, title) {
  const subset = servers.filter(server => server.rotw === rotw);
  const displayTitle = currentLang === "enUS"
    ? (rotw ? "Reign of the Warlock" : "Lord of Destruction")
    : (currentLang === "zhTW" ? toZhTW(title) : title);
  const cornerLabel = currentLang === "enUS" ? "Region" : (currentLang === "zhTW" ? "區域" : "区域");
  let grid = '<div class="corner">' + cornerLabel + '</div>' +
    modes.map(mode => '<div class="col-head">' + (currentLang === "enUS" ? ((mode.ladder ? "Ladder " : "NL ") + (mode.hardcore ? "HC" : "SC")) : (currentLang === "zhTW" ? toZhTW(mode.label) : mode.label)) + '</div>').join("");
  let mobile = "";
  for (const region of regions) {
    const regLabel = currentLang === "enUS" ? region : (currentLang === "zhTW" ? toZhTW(regionNames[region]) : regionNames[region]);
    grid += '<div class="region">' + regLabel + '</div>';
    let mobileCells = "";
    for (const mode of modes) {
      const server = subset.find(item =>
        item.region.replace(/Rotw$/i, "") === region &&
        item.ladder === mode.ladder &&
        item.hardcore === mode.hardcore
      );
      grid += serverCell(server, mode);
      mobileCells += serverCell(server, mode);
    }
    mobile += '<section class="mobile-region"><h3 class="mobile-region-title">' +
      regLabel + '</h3><div class="mobile-region-grid">' +
      mobileCells + '</div></section>';
  }
  const visible = subset.filter(server => server.progress >= minProgress).length;
  return '<section class="dlc"><header class="dlc-head"><h2>' + displayTitle +
    '</h2><span class="dlc-count">' + visible + (currentLang === "enUS" ? ' / 12 visible' : (currentLang === "zhTW" ? ' / 12 項顯示' : ' / 12 项显示')) + '</span></header>' +
    '<div class="matrix-wrap"><div class="matrix">' + grid + '</div></div>' +
    '<div class="mobile-matrix">' + mobile + '</div></section>';
}

function updateSanctuaryHud(data) {
  const tzNameEl = document.getElementById("hud-tz-name");
  const tzTimerEl = document.getElementById("hud-tz-timer");
  const dcHotEl = document.getElementById("hud-dc-hot");
  const dcLevelEl = document.getElementById("hud-dc-level");
  const dcPillEl = document.getElementById("hud-dc-pill");
  if (!tzNameEl || !dcHotEl) return;

  const tz = data?.terrorZone;
  if (tz && (tz.currentZh || tz.current)) {
    tzNameEl.textContent = currentLang === "enUS"
      ? (tz.current || tz.currentZh)
      : (currentLang === "zhTW" ? toZhTW(tz.currentZh || tz.current) : (tz.currentZh || tz.current));
  }
  const mainCountdown = document.getElementById("terror-countdown");
  if (tzTimerEl && mainCountdown && mainCountdown.textContent) {
    tzTimerEl.textContent = mainCountdown.textContent;
  }

  const servers = Array.isArray(data?.servers) ? data.servers : [];
  if (servers.length > 0) {
    const sorted = [...servers].sort((a, b) => (b.progress || 0) - (a.progress || 0));
    const top = sorted[0];
    const prog = Number(top.progress || 0);
    const reg = regionNames[top.region.replace(/Rotw$/i, "")] || top.region;
    const ver = top.rotw ? "术士" : "毁灭";
    const modeText = (top.ladder ? "天梯" : "非天") + (top.hardcore ? "HC" : "SC");
    dcHotEl.textContent = ver + " · " + reg + " " + modeText;
    dcLevelEl.textContent = prog + "/6";
    dcLevelEl.classList.toggle("hot", prog >= 4);
    dcPillEl.classList.toggle("hud-hot", prog >= 4);
  }
}

function render(data) {
  window.dashboardData = data;
  renderTerrorZone(data.terrorZone);
  updateSanctuaryHud(data);
  if (Array.isArray(data.terrorZoneHistory)) {
    tzHistory = data.terrorZoneHistory;
    renderTzHistory();
  }
  document.getElementById("content").innerHTML =
    renderDlc(data.servers, true, "术士君临") +
    renderDlc(data.servers, false, "毁灭之王");
  updateSyncAge();
  if (syncAgeTimer) clearInterval(syncAgeTimer);
  syncAgeTimer = setInterval(updateSyncAge, 1000);
  document.getElementById("live-dot").classList.add("live");
  if (typeof evaluatePersonalAlerts === "function") {
    evaluatePersonalAlerts(data);
  }
}

/* Terror Zone Directory & History Query Logic */
const IMMUNITY_ICON_MAP = {
  f: "/images/ui/immune_fire.webp",
  c: "/images/ui/immune_ice.webp",
  l: "/images/ui/immune_lightning.webp",
  p: "/images/ui/immune_poison.webp",
  ph: "/images/ui/immune_physical.webp",
  m: "/images/ui/immune_magic.webp"
};

const IMMUNITY_NAME_MAP = {
  f: "火焰",
  c: "冰冷",
  l: "闪电",
  p: "毒素",
  ph: "物理",
  m: "魔法"
};

function renderImmunityIconBadge(imm) {
  const code = (typeof imm === "string" ? imm : (imm?.code || "")).toLowerCase();
  const name = (typeof imm === "object" && imm?.name) || IMMUNITY_NAME_MAP[code] || "未知";
  const iconSrc = IMMUNITY_ICON_MAP[code] || ((typeof imm === "object" && typeof imm?.icon === "string" && imm.icon.startsWith("/")) ? imm.icon : "/images/ui/immune_physical.webp");
  const label = escapeHtml(name + "免疫");
  const codeClass = code ? " immunity-" + escapeHtml(code) : "";
  return '<span class="terror-badge immunity-badge' + codeClass +
    '" data-tip="' + label + '" title="' + label + '" aria-label="' + label + '">' +
    '<img class="ui-imm-icon" src="' + escapeHtml(iconSrc) + '" alt="' + label + '" />' +
    '<span class="ui-imm-text">' + escapeHtml(name) + '</span>' +
  '</span>';
}

let tzCatalog = [];
let tzHistory = [];
let tzActiveTab = "catalog";
let tzSearchQuery = "";
let tzFilterAct = "all";
let tzFilterRating = "all";
let tzFilterImmunity = "all";
let tzPanelOpen = localStorage.getItem("dclone-tz-panel-open") === "true";

function updateTzPanelToggle() {
  const body = document.getElementById("tz-directory-body");
  const icon = document.getElementById("tz-toggle-icon");
  const toggle = document.getElementById("tz-toggle-panel");
  if (tzPanelOpen) {
    body.style.display = "block";
    icon.textContent = "▲ 收起查询";
    toggle.setAttribute("aria-expanded", "true");
  } else {
    body.style.display = "none";
    icon.textContent = "▼ 展开查询";
    toggle.setAttribute("aria-expanded", "false");
  }
}

function toggleTzPanel() {
  tzPanelOpen = !tzPanelOpen;
  localStorage.setItem("dclone-tz-panel-open", String(tzPanelOpen));
  updateTzPanelToggle();
}

async function loadTzCatalog() {
  try {
    const response = await fetch("/api/terror-zones", { cache: "no-store" });
    const data = await response.json();
    if (data.ok && Array.isArray(data.terrorZones)) {
      tzCatalog = data.terrorZones;
      document.getElementById("tz-catalog-count").textContent = tzCatalog.length;
      renderTzCatalog();
      if (typeof renderAlertTzZonesGrid === "function") renderAlertTzZonesGrid();
    }
  } catch (err) {
    console.error("加载恐怖地带图鉴失败", err);
  }
}

function renderTzCatalog() {
  const container = document.getElementById("tz-catalog-grid");
  if (!tzCatalog || tzCatalog.length === 0) {
    container.innerHTML = '<div class="tz-empty">正在加载恐怖地带图鉴...</div>';
    return;
  }

  const filtered = tzCatalog.filter(item => {
    if (tzFilterAct !== "all" && String(item.act) !== String(tzFilterAct)) {
      return false;
    }
    if (tzFilterRating !== "all") {
      if (tzFilterRating === "S" && item.rating !== "S" && item.rating !== "S-A") return false;
      if (tzFilterRating === "A" && item.rating !== "A" && item.rating !== "S-A") return false;
      if (tzFilterRating === "B" && item.rating !== "B") return false;
      if (tzFilterRating === "C" && item.rating !== "C") return false;
      if (tzFilterRating === "F" && item.rating !== "F") return false;
    }
    if (tzFilterImmunity !== "all") {
      if (!item.immunities?.some(imm => imm.code === tzFilterImmunity)) {
        return false;
      }
    }
    if (tzSearchQuery) {
      const q = tzSearchQuery.toLowerCase();
      const matchZh = item.zoneZh.toLowerCase().includes(q);
      const matchEn = item.zone.toLowerCase().includes(q);
      if (!matchZh && !matchEn) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = '<div class="tz-empty">未找到匹配的恐怖地带</div>';
    return;
  }

  container.innerHTML = filtered.map(item => {
    const ratingClass = item.rating
      ? " rating-" + escapeHtml(String(item.rating).toLowerCase().replace(/[^a-z0-9]/g, "-"))
      : "";
    const ratingBadge = item.rating
      ? '<span class="terror-badge terror-rating' + ratingClass + '">' +
        (currentLang === "enUS" ? "Tier " + escapeHtml(item.rating) : "评级 " + escapeHtml(item.rating) + " · " + escapeHtml(item.ratingText)) +
        '</span>'
      : '<span class="terror-badge terror-rating">' + (currentLang === "enUS" ? "Unrated" : "未评级") + '</span>';

    const immunityBadges = item.immunities?.length
      ? item.immunities.map(renderImmunityIconBadge).join("")
      : '<span class="terror-detail-label" style="font-size:11px">' + (currentLang === "enUS" ? "No Immunities" : "无常见免疫") + '</span>';

    const tzTitle = currentLang === "enUS" ? item.zone : item.zoneZh;
    const tzSub = currentLang === "enUS" ? item.zoneZh : item.zone;
    const actLabel = currentLang === "enUS" ? ("Act " + (item.act || 1)) : item.actName;
    const isFav = typeof isTzZoneStarred === "function" && isTzZoneStarred(item.zone);
    return '<div class="tz-catalog-card">' +
      '<div class="tz-card-head">' +
        '<span class="tz-act-badge">' + escapeHtml(actLabel) + '</span>' +
        '<div style="display:inline-flex;align-items:center;gap:5px">' +
          ratingBadge +
          '<button type="button" class="tz-fav-btn' + (isFav ? ' active' : '') + '" data-tz-fav="' + escapeHtml(item.zone) + '" title="订阅/取消该恐怖地带桌面与声音提醒">' + (isFav ? '★ 已关注' : '☆ 提醒') + '</button>' +
        '</div>' +
      '</div>' +
      '<div>' +
        '<h4 class="tz-card-title">' + escapeHtml(tzTitle) + '</h4>' +
        '<div class="tz-card-en">' + escapeHtml(tzSub) + '</div>' +
      '</div>' +
      '<div class="tz-card-footer">' +
        immunityBadges +
      '</div>' +
    '</div>';
  }).join("");
  container.querySelectorAll("[data-tz-fav]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (typeof toggleFavoriteTzZone === "function") toggleFavoriteTzZone(btn.dataset.tzFav);
    });
  });
}

function renderTzHistory() {
  const container = document.getElementById("tz-history-container");
  const countSpan = document.getElementById("tz-history-count");
  countSpan.textContent = tzHistory.length;

  if (!tzHistory || tzHistory.length === 0) {
    container.innerHTML = '<div class="tz-empty">暂无历史轮换记录（Worker 同步后将自动在此记录）</div>';
    return;
  }

  const filtered = tzHistory.filter(item => {
    if (tzFilterAct !== "all" && String(item.act) !== String(tzFilterAct)) {
      return false;
    }
    if (tzFilterRating !== "all") {
      if (tzFilterRating === "S" && item.rating !== "S" && item.rating !== "S-A") return false;
      if (tzFilterRating === "A" && item.rating !== "A" && item.rating !== "S-A") return false;
      if (tzFilterRating === "B" && item.rating !== "B") return false;
      if (tzFilterRating === "C" && item.rating !== "C") return false;
      if (tzFilterRating === "F" && item.rating !== "F") return false;
    }
    if (tzFilterImmunity !== "all") {
      if (!item.immunities?.some(imm => imm.code === tzFilterImmunity)) {
        return false;
      }
    }
    if (tzSearchQuery) {
      const q = tzSearchQuery.toLowerCase();
      const matchZh = (item.zoneZh || "").toLowerCase().includes(q);
      const matchEn = (item.zone || "").toLowerCase().includes(q);
      if (!matchZh && !matchEn) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = '<div class="tz-empty">未找到匹配的历史记录</div>';
    return;
  }

  container.innerHTML = filtered.map(item => {
    const timeStr = item.time ? formatTime(new Date(item.time).getTime() / 1000) : "未知时间";
    const ratingClass = item.rating
      ? " rating-" + escapeHtml(String(item.rating).toLowerCase().replace(/[^a-z0-9]/g, "-"))
      : "";
    const ratingBadge = item.rating
      ? '<span class="terror-badge terror-rating' + ratingClass + '">' +
        (currentLang === "enUS" ? "Tier " + escapeHtml(item.rating) : "评级 " + escapeHtml(item.rating) + " · " + escapeHtml(item.ratingText)) +
        '</span>'
      : '<span class="terror-badge terror-rating">' + (currentLang === "enUS" ? "Unrated" : "未评级") + '</span>';

    const immunityBadges = item.immunities?.length
      ? item.immunities.map(renderImmunityIconBadge).join("")
      : '';

    const histAct = currentLang === "enUS" ? ("Act " + (item.act || 1)) : (item.actName || ("Act " + (item.act || 1)));
    const histName = currentLang === "enUS" ? (item.zone || item.zoneZh) : (item.zoneZh || item.zone);
    return '<div class="tz-history-item">' +
      '<div class="tz-history-main">' +
        '<span class="tz-history-time">' + escapeHtml(timeStr) + '</span>' +
        '<span class="tz-act-badge">' + escapeHtml(histAct) + '</span>' +
        '<span class="tz-history-name">' + escapeHtml(histName) + '</span>' +
      '</div>' +
      '<div class="tz-history-badges">' +
        ratingBadge +
        immunityBadges +
      '</div>' +
    '</div>';
  }).join("");
}

function switchTzTab(tabName) {
  tzActiveTab = tabName;
  document.getElementById("tab-btn-catalog").classList.toggle("active", tabName === "catalog");
  document.getElementById("tab-btn-history").classList.toggle("active", tabName === "history");
  document.getElementById("tz-catalog-view").style.display = tabName === "catalog" ? "block" : "none";
  document.getElementById("tz-history-view").style.display = tabName === "history" ? "block" : "none";
  if (tabName === "catalog") renderTzCatalog();
  if (tabName === "history") renderTzHistory();
}

function updateTzSearch(query) {
  tzSearchQuery = query.trim();
  const clearBtn = document.getElementById("tz-search-clear");
  clearBtn.style.display = tzSearchQuery ? "block" : "none";
  if (tzActiveTab === "catalog") renderTzCatalog();
  if (tzActiveTab === "history") renderTzHistory();
}

function setupTzDirectoryEvents() {
  document.getElementById("tz-toggle-panel").addEventListener("click", toggleTzPanel);
  
  document.querySelectorAll("[data-tz-tab]").forEach(btn => {
    btn.addEventListener("click", () => switchTzTab(btn.dataset.tzTab));
  });

  const searchInput = document.getElementById("tz-search-input");
  const searchClear = document.getElementById("tz-search-clear");
  searchInput.addEventListener("input", (e) => updateTzSearch(e.target.value));
  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    updateTzSearch("");
    searchInput.focus();
  });

  document.querySelectorAll("#tz-act-chips button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#tz-act-chips button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      tzFilterAct = btn.dataset.act;
      if (tzActiveTab === "catalog") renderTzCatalog();
      if (tzActiveTab === "history") renderTzHistory();
    });
  });

  document.querySelectorAll("#tz-rating-chips button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#tz-rating-chips button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      tzFilterRating = btn.dataset.rating;
      if (tzActiveTab === "catalog") renderTzCatalog();
      if (tzActiveTab === "history") renderTzHistory();
    });
  });

  document.querySelectorAll("#tz-immunity-chips button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#tz-immunity-chips button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      tzFilterImmunity = btn.dataset.immunity;
      if (tzActiveTab === "catalog") renderTzCatalog();
      if (tzActiveTab === "history") renderTzHistory();
    });
  });

  updateTzPanelToggle();
  loadTzCatalog();
}

/* 主 Tab（恐怖地带 / 地表暗黑 / 符文之语 100% 记事 / 物品词缀范围 / 物品资讯百科）切换逻辑 */
const MAIN_TABS = [
  { id: "terror", tabId: "main-tab-terror", panelId: "main-panel-terror", hash: "#terror-zone" },
  { id: "dclone", tabId: "main-tab-dclone", panelId: "main-panel-dclone", hash: "#dclone" },
  { id: "runewords", tabId: "main-tab-runewords", panelId: "main-panel-runewords", hash: "#runewords" },
  { id: "affixes", tabId: "main-tab-affixes", panelId: "main-panel-affixes", hash: "#affixes" },
  { id: "items", tabId: "main-tab-items", panelId: "main-panel-items", hash: "#items" },
  { id: "skills", tabId: "main-tab-skills", panelId: "main-panel-skills", hash: "#skills" }
];
let activeMainTab = "terror";

function resolveMainTabFromHash(hashValue) {
  const hash = (hashValue || "").toLowerCase();
  if (hash === "#terror" || hash === "#terror-zone" || hash === "#tz") return "terror";
  if (hash === "#dclone" || hash === "#dc" || hash === "#diablo-clone") return "dclone";
  if (hash === "#runewords" || hash === "#rw" || hash === "#runeword") return "runewords";
  if (hash === "#affixes" || hash === "#affix" || hash === "#craft") return "affixes";
  if (hash === "#items" || hash === "#item" || hash === "#db") return "items";
  if (hash === "#skills" || hash === "#skill" || hash.startsWith("#skills:")) return "skills";
  return null;
}

function switchMainTab(tabId, updateHash = true) {
  const targetTab = MAIN_TABS.find(item => item.id === tabId) || MAIN_TABS[0];
  activeMainTab = targetTab.id;
  document.body.setAttribute("data-tab", targetTab.id);
  try {
    localStorage.setItem("dclone-active-tab", targetTab.id);
  } catch (e) {}

  for (const item of MAIN_TABS) {
    const isSelected = item.id === targetTab.id;
    const tabEl = document.getElementById(item.tabId);
    const panelEl = document.getElementById(item.panelId);
    if (tabEl && panelEl) {
      tabEl.classList.toggle("active", isSelected);
      tabEl.setAttribute("aria-selected", String(isSelected));
      panelEl.classList.toggle("active", isSelected);
    }
  }

  if (targetTab.id === "skills" && typeof scheduleDrawSkillTreeLinks === "function") {
    scheduleDrawSkillTreeLinks();
  }

  if (updateHash) {
    if (window.location.hash !== targetTab.hash) {
      try {
        history.replaceState(null, "", targetTab.hash);
      } catch (e) {
        window.location.hash = targetTab.hash;
      }
    }
  }
}

function initMainTabs() {
  let initialTab = "terror";
  try {
    initialTab = localStorage.getItem("dclone-active-tab") || "terror";
  } catch (e) {}

  const hashTab = resolveMainTabFromHash(window.location.hash);
  if (hashTab) {
    initialTab = hashTab;
  }

  switchMainTab(initialTab, false);

  const tabElements = MAIN_TABS.map(item => ({
    id: item.id,
    el: document.getElementById(item.tabId)
  })).filter(item => item.el);

  tabElements.forEach((item, index) => {
    item.el.addEventListener("click", () => switchMainTab(item.id));
    item.el.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const delta = e.key === "ArrowRight" ? 1 : -1;
        const nextIndex = (index + delta + tabElements.length) % tabElements.length;
        tabElements[nextIndex].el.focus();
        switchMainTab(tabElements[nextIndex].id);
      }
    });
  });

  window.addEventListener("hashchange", () => {
    const nextHashTab = resolveMainTabFromHash(window.location.hash);
    if (nextHashTab) {
      switchMainTab(nextHashTab, false);
    }
  });
}

/* 符文之语 100% 记事与符文数量统计逻辑 */
const RW_STORAGE_KEY = "dclone-runewords-completed";
let rwRunes = [];
let rwList = [];
let rwCompleted = new Set();
let rwSearchQuery = "";
let rwFilterStatus = "all";
let rwFilterType = "all";
let rwFilterSocket = "all";
let rwFilterMode = "all";
let rwFilterPatch = "all";
let rwSelectedRunes = new Set();
let rwNeededOnly = false;

function loadRwCompleted() {
  try {
    const saved = JSON.parse(localStorage.getItem(RW_STORAGE_KEY) || "[]");
    if (Array.isArray(saved)) {
      rwCompleted = new Set(saved);
    }
  } catch (e) {
    rwCompleted = new Set();
  }
}

function saveRwCompleted() {
  try {
    localStorage.setItem(RW_STORAGE_KEY, JSON.stringify([...rwCompleted]));
    if (!window.__cloudApplyingRemote) {
      localStorage.setItem("d2r-builds-local-updated-at", new Date().toISOString());
      if (typeof scheduleCloudSync === "function") scheduleCloudSync();
    }
  } catch (e) {}
}

async function loadRunewordsCatalog() {
  try {
    const response = await fetch("/api/runewords", { cache: "no-store" });
    const data = await response.json();
    if (data.ok && Array.isArray(data.runewords)) {
      rwRunes = data.runes || [];
      rwList = data.runewords || [];
      renderRunewordsAll();
      if (typeof renderPaperdollAll === "function") renderPaperdollAll();
    }
  } catch (err) {
    console.error("加载符文之语图鉴失败", err);
  }
}

function renderRunewordsSummary() {
  const totalCounts = {};
  const remainingCounts = {};
  for (const r of rwRunes) {
    totalCounts[r.name] = 0;
    remainingCounts[r.name] = 0;
  }

  let totalRunes = 0;
  let remainingRunes = 0;
  let completedCount = 0;

  for (const rw of rwList) {
    const done = rwCompleted.has(rw.id);
    if (done) completedCount += 1;
    for (const rName of rw.runes) {
      totalCounts[rName] = (totalCounts[rName] || 0) + 1;
      totalRunes += 1;
      if (!done) {
        remainingCounts[rName] = (remainingCounts[rName] || 0) + 1;
        remainingRunes += 1;
      }
    }
  }

  const totalCount = rwList.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  document.getElementById("rw-completed-count").textContent = completedCount;
  document.getElementById("rw-total-count").textContent = totalCount;
  document.getElementById("rw-progress-pct").textContent = pct + "%";
  document.getElementById("rw-total-runes").textContent = totalRunes;
  document.getElementById("rw-remaining-runes").textContent = remainingRunes;
  document.getElementById("rw-progress-fill").style.width = pct + "%";

  const grid = document.getElementById("rw-rune-grid");
  const runesToDisplay = rwNeededOnly
    ? rwRunes.filter(r => (remainingCounts[r.name] || 0) > 0)
    : rwRunes;

  if (grid.querySelectorAll("[data-rune-filter]").length !== rwRunes.length) {
    grid.innerHTML = rwRunes.map(rune => {
      const runeImg = rune.icon
        ? '<img class="rw-rune-thumb" src="' + escapeHtml(rune.icon) + '" alt="' + escapeHtml(rune.name) + '">'
        : '';
      return '<button type="button" class="rw-rune-card tier-' + escapeHtml(rune.tier) +
        '" data-rune-filter="' + escapeHtml(rune.name) + '">' +
        '<div class="rw-rune-top" data-no-sweep="1"><span class="rw-rune-num">#' + rune.number + '</span>' + runeImg + '<span class="rw-rune-title-text">' + escapeHtml(pickLangTitle(rune)) + '</span></div>' +
        '<div class="rw-rune-name" data-no-sweep="1">' + escapeHtml(pickLangSub(rune)) + '</div>' +
        '<div class="rw-rune-counts">' +
          '<span class="rw-rune-rem"></span>' +
          '<span class="rw-rune-tot"></span>' +
        '</div>' +
      '</button>';
    }).join("") + '<div class="tz-empty" id="rw-rune-empty" style="display:none">🎉 所有符文需求均已清零！</div>';

    grid.querySelectorAll("[data-rune-filter]").forEach(btn => {
      btn.addEventListener("click", () => {
        const rName = btn.dataset.runeFilter;
        if (rwSelectedRunes.has(rName)) {
          rwSelectedRunes.delete(rName);
        } else {
          rwSelectedRunes.add(rName);
        }
        renderRunewordsSummary();
        renderRunewordsList();
      });
    });
  }

  const emptyEl = document.getElementById("rw-rune-empty");
  if (emptyEl) emptyEl.style.display = runesToDisplay.length === 0 ? "" : "none";

  const clearBtn = document.getElementById("rw-clear-runes-btn");
  if (clearBtn) {
    clearBtn.style.display = rwSelectedRunes.size > 0 ? "" : "none";
    if (!clearBtn.dataset.bound) {
      clearBtn.dataset.bound = "1";
      clearBtn.addEventListener("click", () => {
        rwSelectedRunes.clear();
        renderRunewordsSummary();
        renderRunewordsList();
      });
    }
  }

  const runeMap = new Map(rwRunes.map(r => [r.name, r]));
  grid.querySelectorAll("[data-rune-filter]").forEach(btn => {
    const rName = btn.dataset.runeFilter;
    const rune = runeMap.get(rName);
    if (!rune) return;
    const total = totalCounts[rName] || 0;
    const remaining = remainingCounts[rName] || 0;
    const isSelected = rwSelectedRunes.has(rName);
    const isDone = remaining === 0;
    btn.classList.toggle("selected", isSelected);
    btn.classList.toggle("done", isDone);
    btn.style.display = (rwNeededOnly && isDone) ? "none" : "";
    const titleEl = btn.querySelector(".rw-rune-title-text");
    if (titleEl) titleEl.textContent = pickLangTitle(rune);
    const subEl = btn.querySelector(".rw-rune-name");
    if (subEl) subEl.textContent = pickLangSub(rune);
    const remEl = btn.querySelector(".rw-rune-rem");
    if (remEl) remEl.textContent = isDone ? "✓ 0" : "需 " + remaining;
    const totEl = btn.querySelector(".rw-rune-tot");
    if (totEl) totEl.textContent = "总 " + total;
  });
}

function renderRunewordsList() {
  const container = document.getElementById("rw-list");
  if (!rwList || rwList.length === 0) {
    container.innerHTML = '<div class="tz-empty">正在加载符文之语清单...</div>';
    return;
  }

  const runeMap = new Map(rwRunes.map(r => [r.name, r]));
  const filtered = rwList.filter(rw => {
    const done = rwCompleted.has(rw.id);
    if (rwFilterStatus === "todo" && done) return false;
    if (rwFilterStatus === "done" && !done) return false;
    if (rwFilterType !== "all" && !rw.types.includes(rwFilterType)) return false;
    if (rwFilterSocket !== "all" && String(rw.sockets) !== String(rwFilterSocket)) return false;
    if (rwFilterMode !== "all" && (rw.ladderStatus || "universal") !== rwFilterMode) return false;
    if (rwFilterPatch !== "all") {
      if (rwFilterPatch === "classic" && !["1.09", "1.10", "1.11"].includes(rw.patch)) return false;
      if (rwFilterPatch !== "classic" && rw.patch !== rwFilterPatch) return false;
    }
    if (rwSelectedRunes.size > 0) {
      for (const selRune of rwSelectedRunes) {
        if (!rw.runes.includes(selRune)) return false;
      }
    }
    if (rwSearchQuery) {
      const q = rwSearchQuery.toLowerCase();
      const matchZh = rw.zhName.toLowerCase().includes(q) || (rw.i18n && ((rw.i18n.zhTW || "").toLowerCase().includes(q) || (rw.i18n.zhCN || "").toLowerCase().includes(q)));
      const matchEn = rw.name.toLowerCase().includes(q);
      const matchBase = rw.basesZh.toLowerCase().includes(q);
      const matchRune = rw.runes.some(r => {
        const info = runeMap.get(r);
        return r.toLowerCase().includes(q) || (info && info.zhName.includes(q));
      });
      if (!matchZh && !matchEn && !matchBase && !matchRune) return false;
    }
    return true;
  });

  const hint = document.getElementById("rw-selected-rune-hint");
  if (hint) {
    if (rwSelectedRunes.size > 0) {
      hint.textContent = "匹配到 " + filtered.length + " 个符文之语（已选 " + rwSelectedRunes.size + " 颗符文）";
    } else {
      hint.textContent = "匹配到 " + filtered.length + " 个符文之语";
    }
    if (typeof applyDomTraditionalSweep === "function") applyDomTraditionalSweep();
  }

  if (filtered.length === 0) {
    container.innerHTML = '<div class="tz-empty">未找到匹配的符文之语</div>';
    return;
  }

  container.innerHTML = filtered.map(rw => {
    const done = rwCompleted.has(rw.id);
    const patchLabel = rw.patch === "RotW" ? "术士君临" : rw.patch;
    const modeClass = rw.ladderStatus === "ladder-rework"
      ? " rw-badge-ladder"
      : rw.ladderStatus === "rotw"
        ? " rw-badge-rotw"
        : rw.ladderStatus === "unlocked"
          ? " rw-badge-unlocked"
          : "";
    const modeBadge = rw.ladderStatus && rw.ladderStatus !== "universal"
      ? '<span class="rw-badge' + modeClass + '">' + escapeHtml(rw.ladderLabel || "") + '</span>'
      : '<span class="rw-badge">' + escapeHtml(rw.ladderLabel || "非赛/赛季通用") + '</span>';
    const noteHtml = rw.note
      ? '<div class="rw-item-note">📌 ' + escapeHtml(rw.note) + '</div>'
      : "";
    const runePills = rw.runes.map(rName => {
      const info = runeMap.get(rName);
      const tier = info?.tier || "low";
      const num = info?.number || "";
      const label = info ? pickLangTitle(info) : rName;
      const selCls = rwSelectedRunes.has(rName) ? " pill-selected" : "";
      return '<span class="rw-rune-pill tier-' + escapeHtml(tier) + selCls + '" data-no-sweep="1" title="#' + num + ' ' + escapeHtml(rName) + '">' +
        '<span class="rw-rune-pill-num">#' + num + '</span>' +
        escapeHtml(label) +
      '</span>';
    }).join("");

    return '<div class="rw-item' + (done ? " completed" : "") + '" data-rw-card="' + escapeHtml(rw.id) + '">' +
      '<input type="checkbox" class="rw-check" data-rw-id="' + escapeHtml(rw.id) + '"' + (done ? " checked" : "") + '>' +
      '<div class="rw-item-body">' +
        '<div class="rw-item-head">' +
          '<span class="rw-item-title" data-no-sweep="1">' + escapeHtml(pickLangTitle(rw)) + '<span class="rw-item-en">' + escapeHtml(pickLangSub(rw)) + '</span></span>' +
          '<span class="rw-item-badges">' +
            modeBadge +
            '<span class="rw-badge">' + rw.sockets + (currentLang === "enUS" ? ' Sockets' : ' 孔') + '</span>' +
            '<span class="rw-badge rw-badge-patch">' + escapeHtml(patchLabel) + '</span>' +
          '</span>' +
        '</div>' +
        '<div class="rw-item-bases">' + (currentLang === "enUS" ? 'Bases: ' + escapeHtml(rw.basesZh) + ' · Req Lvl ' + rw.reqLevel : '底材：' + escapeHtml(rw.basesZh) + ' · 需求等级 ' + rw.reqLevel) + '</div>' +
        noteHtml +
        '<div class="rw-rune-seq">' + runePills + '<button type="button" class="rw-detail-btn" data-rw-detail="' + escapeHtml(rw.id) + '">查看详情</button></div>' +
      '</div>' +
    '</div>';
  }).join("");

  container.querySelectorAll("[data-rw-id]").forEach(checkbox => {
    checkbox.addEventListener("change", (e) => {
      const id = e.target.dataset.rwId;
      if (e.target.checked) {
        rwCompleted.add(id);
      } else {
        rwCompleted.delete(id);
      }
      saveRwCompleted();
      renderRunewordsAll();
    });
  });

  container.querySelectorAll("[data-rw-card]").forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".rw-check")) return;
      openRunewordDetail(card.dataset.rwCard);
    });
  });
}

let rwModalCurrentId = null;

function openRunewordDetail(id) {
  const rw = rwList.find(item => item.id === id);
  if (!rw) return;
  rwModalCurrentId = id;
  const runeMap = new Map(rwRunes.map(r => [r.name, r]));
  const modal = document.getElementById("rw-detail-modal");
  document.getElementById("rw-modal-title").textContent = pickLangTitle(rw);
  document.getElementById("rw-modal-en").textContent = rw.name;

  const patchLabel = rw.patch === "RotW" ? "术士君临" : rw.patch;
  const modeClass = rw.ladderStatus === "ladder-rework"
    ? " rw-badge-ladder"
    : rw.ladderStatus === "rotw"
      ? " rw-badge-rotw"
      : rw.ladderStatus === "unlocked"
        ? " rw-badge-unlocked"
        : "";

  const runesSeqHtml = rw.runes.map((rName, idx) => {
    const info = runeMap.get(rName);
    const tier = info?.tier || "low";
    const num = info?.number || "";
    const label = info ? pickLangTitle(info) : rName;
    const pill = '<span class="rw-rune-pill tier-' + escapeHtml(tier) + '" data-no-sweep="1">' +
      '<span class="rw-rune-pill-num">#' + num + '</span>' +
      escapeHtml(label) +
    '</span>';
    return idx > 0 ? '<span class="rw-modal-arrow">→</span>' + pill : pill;
  }).join("");

  const groups = Array.isArray(rw.statGroups) && rw.statGroups.length > 0
    ? rw.statGroups
    : [{ label: "符文之语属性", items: rw.stats || ["暂无属性资料"] }];

  const statsHtml = groups.map(group => {
    const ico = group.icon
      ? '<img class="ui-chip-icon" src="' + escapeHtml(group.icon) + '" alt="" />'
      : '';
    return '<div class="rw-stat-group">' +
      '<h4 class="rw-stat-group-title">' + ico + escapeHtml(group.label) + '</h4>' +
      '<ul class="rw-stat-list">' +
        group.items.map(line => '<li>' + escapeHtml(line) + '</li>').join("") +
      '</ul>' +
    '</div>';
  }).join("");

  const noteBlock = rw.note
    ? '<div class="rw-item-note" style="margin:0">📌 ' + escapeHtml(rw.note) + '</div>'
    : "";

  document.getElementById("rw-modal-body").innerHTML =
    '<div class="rw-modal-meta">' +
      '<span class="rw-badge' + modeClass + '">' + escapeHtml(rw.ladderLabel || "非赛/赛季通用") + '</span>' +
      '<span class="rw-badge">' + rw.sockets + ' 孔底材：' + escapeHtml(rw.basesZh) + '</span>' +
      '<span class="rw-badge rw-badge-patch">版本 ' + escapeHtml(patchLabel) + '</span>' +
      '<span class="rw-badge">需求等级 ' + rw.reqLevel + '</span>' +
    '</div>' +
    noteBlock +
    '<div class="rw-modal-runes-box">' +
      '<div class="rw-modal-runes-label">镶嵌顺序（严格从左到右放入白色/灰色底材）：</div>' +
      '<div class="rw-modal-runes">' + runesSeqHtml + '</div>' +
    '</div>' +
    '<div class="rw-modal-stats">' + statsHtml + '</div>';

  updateRwModalFooter();
  modal.classList.add("open");
}

function updateRwModalFooter() {
  if (!rwModalCurrentId) return;
  const done = rwCompleted.has(rwModalCurrentId);
  const statusText = document.getElementById("rw-modal-status-text");
  const toggleBtn = document.getElementById("rw-modal-toggle-done");
  statusText.textContent = done ? "✅ 已计入 100% 记事完成" : "⬜ 尚未完成";
  toggleBtn.textContent = done ? "取消完成" : "标记为已完成";
  toggleBtn.classList.toggle("active", done);
}

function closeRunewordDetail() {
  rwModalCurrentId = null;
  document.getElementById("rw-detail-modal").classList.remove("open");
}

function renderRunewordsAll() {
  renderRunewordsSummary();
  renderRunewordsList();
}

function setupRunewordsEvents() {
  loadRwCompleted();

  const searchInput = document.getElementById("rw-search-input");
  const searchClear = document.getElementById("rw-search-clear");
  searchInput.addEventListener("input", (e) => {
    rwSearchQuery = e.target.value.trim();
    searchClear.style.display = rwSearchQuery ? "block" : "none";
    renderRunewordsList();
  });
  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    rwSearchQuery = "";
    searchClear.style.display = "none";
    renderRunewordsList();
    searchInput.focus();
  });

  document.querySelectorAll("#rw-status-chips button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#rw-status-chips button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      rwFilterStatus = btn.dataset.rwStatus;
      renderRunewordsList();
    });
  });

  document.querySelectorAll("#rw-type-chips button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#rw-type-chips button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      rwFilterType = btn.dataset.rwType;
      renderRunewordsList();
    });
  });

  document.querySelectorAll("#rw-socket-chips button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#rw-socket-chips button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      rwFilterSocket = btn.dataset.rwSocket;
      renderRunewordsList();
    });
  });

  document.querySelectorAll("#rw-mode-chips button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#rw-mode-chips button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      rwFilterMode = btn.dataset.rwMode;
      renderRunewordsList();
    });
  });

  document.querySelectorAll("#rw-patch-chips button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#rw-patch-chips button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      rwFilterPatch = btn.dataset.rwPatch;
      renderRunewordsList();
    });
  });

  const neededBtn = document.getElementById("rw-toggle-needed-only");
  neededBtn.addEventListener("click", () => {
    rwNeededOnly = !rwNeededOnly;
    neededBtn.classList.toggle("active", rwNeededOnly);
    renderRunewordsSummary();
  });

  document.getElementById("rw-reset-progress").addEventListener("click", () => {
    if (rwCompleted.size === 0) return;
    if (confirm("确定要清空所有已勾选的符文之语 100% 进度吗？")) {
      rwCompleted.clear();
      saveRwCompleted();
      renderRunewordsAll();
    }
  });

  const modal = document.getElementById("rw-detail-modal");
  document.getElementById("rw-modal-close").addEventListener("click", closeRunewordDetail);
  document.getElementById("rw-modal-close-btn").addEventListener("click", closeRunewordDetail);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeRunewordDetail();
  });
  document.getElementById("rw-modal-toggle-done").addEventListener("click", () => {
    if (!rwModalCurrentId) return;
    if (rwCompleted.has(rwModalCurrentId)) {
      rwCompleted.delete(rwModalCurrentId);
    } else {
      rwCompleted.add(rwModalCurrentId);
    }
    saveRwCompleted();
    renderRunewordsAll();
    updateRwModalFooter();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeRunewordDetail();
    }
  });

  loadRunewordsCatalog();
}

function updateSyncAge() {
  const checkedAt = window.dashboardData?.checkedAt;
  if (!checkedAt) return;
  const checked = new Date(checkedAt);
  const ageSeconds = Math.max(0, Math.floor((Date.now() - checked.getTime()) / 1000));
  const ageText = ageSeconds < 60
    ? ageSeconds + " 秒前"
    : Math.floor(ageSeconds / 60) + " 分钟前";
  document.getElementById("checked-at").textContent =
    "展示数据最近变更：" + checked.toLocaleString("zh-CN", {
      timeZone: "Asia/Shanghai", hour12: false
    }) + "（" + ageText + "）";
}

function renderTerrorZone(terrorZone) {
  const pickTz = (zh, en) => currentLang === "enUS" ? (en || zh) : (currentLang === "zhTW" ? toZhTW(zh || en) : (zh || en));
  const current = pickTz(terrorZone?.currentZh, terrorZone?.current);
  const next = pickTz(terrorZone?.nextZh, terrorZone?.next);
  const isConfirmed = !isAwaitingTerrorConfirmation(terrorZone);
  document.getElementById("terror-current").textContent = current || "等待数据…";
  document.getElementById("terror-current-original").textContent =
    terrorZone?.current && terrorZone.current !== current ? terrorZone.current : "";
  renderTerrorDetails(
    "terror-current-details",
    terrorZone?.currentDetails,
    "暂无资料"
  );
  document.getElementById("terror-updated").textContent =
    terrorZone?.checkedAt
      ? (isConfirmed ? "已确认 · " : "根据上一轮预测即时切换 · ") +
        formatTime(new Date(terrorZone.checkedAt).getTime() / 1000)
      : "";
  document.getElementById("terror-next").textContent = isConfirmed
    ? (next || "等待数据…")
    : "正在获取下一阶段…";
  document.getElementById("terror-next-original").textContent =
    isConfirmed && terrorZone?.next && terrorZone.next !== next
      ? terrorZone.next
      : "";
  renderTerrorDetails(
    "terror-next-details",
    isConfirmed ? terrorZone?.nextDetails : null,
    isConfirmed ? "暂无资料" : "数据同步中"
  );
  updateTerrorCountdown();
  if (terrorCountdownTimer) clearInterval(terrorCountdownTimer);
  terrorCountdownTimer = setInterval(updateTerrorCountdown, 1000);
}

function isAwaitingTerrorConfirmation(terrorZone) {
  const checkedAt = new Date(terrorZone?.checkedAt).getTime();
  const halfHour = 30 * 60 * 1000;
  return Number.isFinite(checkedAt) &&
    Math.floor(Date.now() / halfHour) > Math.floor(checkedAt / halfHour);
}

function renderTerrorDetails(elementId, details, fallback = "暂无资料") {
  const element = document.getElementById(elementId);
  if (!details) {
    element.innerHTML = '<span class="terror-detail-label">' + fallback + '</span>';
    return;
  }

  const immunityBadges = details.immunities?.length
    ? details.immunities.map(renderImmunityIconBadge).join("")
    : '<span class="terror-detail-label">未标注常见免疫</span>';
  
  const ratingClass = details.rating
    ? " rating-" + escapeHtml(String(details.rating).toLowerCase().replace(/[^a-z0-9]/g, "-"))
    : "";
  const rating = details.rating
    ? '<span class="terror-badge terror-rating' + ratingClass + '">评级 ' +
      escapeHtml(details.rating) + ' · ' + escapeHtml(details.ratingText) + '</span>'
    : '<span class="terror-badge terror-rating">未评级</span>';
  element.innerHTML =
    '<span class="terror-detail-label">常见免疫</span>' + immunityBadges + rating;
}

function updateTerrorCountdown() {
  const now = Date.now();
  const halfHour = 30 * 60 * 1000;
  const nextBoundary = (Math.floor(now / halfHour) + 1) * halfHour;
  const remaining = Math.max(0, nextBoundary - now);
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const countdownText =
    "距切换 " + String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
  document.getElementById("terror-countdown").textContent = countdownText;
  const hudTimerEl = document.getElementById("hud-tz-timer");
  if (hudTimerEl) hudTimerEl.textContent = countdownText;
}

async function load() {
  const button = document.getElementById("refresh");
  button.disabled = true;
  try {
    const response = await fetch("/api/status", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "状态读取失败");
    render(data);
  } catch (error) {
    document.getElementById("content").innerHTML =
      '<div class="error">暂时无法读取状态：' + escapeHtml(error.message) + '</div>';
    document.getElementById("checked-at").textContent = "状态不可用";
  } finally {
    button.disabled = false;
    scheduleAutoRefresh();
  }
}

function scheduleAutoRefresh() {
  if (autoRefreshTimer) clearTimeout(autoRefreshTimer);
  if (autoRefreshEnabled) {
    const configuredDelay = autoRefreshMinutes * 60 * 1000;
    const delay = isAwaitingTerrorConfirmation(window.dashboardData?.terrorZone)
      ? Math.min(configuredDelay, 15 * 1000)
      : configuredDelay;
    autoRefreshTimer = setTimeout(load, delay);
  }
}

async function loadSystemConfig() {
  try {
    const response = await fetch("/api/system-config", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !data.ok) return;
    const footerPull = document.getElementById("footer-pull-interval");
    if (footerPull && data.pullIntervalMinutes) {
      footerPull.textContent = String(data.pullIntervalMinutes);
    }
    if (typeof data.pageAutoRefreshEnabled === "boolean") {
      autoRefreshEnabled = data.pageAutoRefreshEnabled;
    }
    if (Number.isInteger(Number(data.pageAutoRefreshMinutes)) && Number(data.pageAutoRefreshMinutes) >= 1) {
      autoRefreshMinutes = Number(data.pageAutoRefreshMinutes);
    }
    scheduleAutoRefresh();
  } catch (error) {
    console.error("读取系统配置失败", error);
  }
}

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    minProgress = Number(button.dataset.min);
    if (window.dashboardData) render(window.dashboardData);
  });
});
document.getElementById("refresh").addEventListener("click", load);
/* 魔法 / 亮金 / 手工物品词缀范围逻辑 */
let afData = null;
let afSearchQuery = "";
let afFilterSlot = "all";
let afFilterQuality = "all";
let afFilterType = "all";
let afCraftOpen = false;

async function loadAffixesCatalog() {
  try {
    const response = await fetch("/api/affixes", { cache: "no-store" });
    const data = await response.json();
    if (data.ok && Array.isArray(data.affixes)) {
      afData = data;
      renderAffixesRules();
      renderAffixesSlotChips();
      renderAffixesCraftRecipes();
      renderAffixesList();
      initSimulator();
      if (typeof renderPaperdollAll === "function") renderPaperdollAll();
    }
  } catch (err) {
    console.error("加载物品词缀数据失败", err);
  }
}

function renderAffixesRules() {
  const grid = document.getElementById("af-rules-grid");
  if (!afData?.qualityRules) return;
  grid.innerHTML = afData.qualityRules.map(rule => {
    const ico = rule.icon
      ? '<img class="ui-chip-icon" src="' + escapeHtml(rule.icon) + '" alt="" />'
      : '';
    return '<article class="af-rule-card rule-' + escapeHtml(rule.id) + '">' +
      '<div class="af-rule-head"><span>' + escapeHtml(rule.name) + '</span><span style="display:inline-flex;align-items:center">' + ico + escapeHtml(rule.badge) + '</span></div>' +
      '<div class="af-rule-limit">' + escapeHtml(rule.affixLimit) + '</div>' +
      '<p class="af-rule-desc"><strong>特点：</strong>' + escapeHtml(rule.highlight) + '</p>' +
      '<p class="af-rule-desc"><strong>代表极品：</strong>' + escapeHtml(rule.examples) + '</p>' +
    '</article>';
  }).join("");
}

function renderAffixesSlotChips() {
  const wrap = document.getElementById("af-slot-chips");
  if (!afData?.slots) return;
  wrap.innerHTML = '<button class="tz-chip active" data-af-slot="all" type="button">全部部位</button>' +
    afData.slots.map(s => {
      const ico = s.icon
        ? '<img src="' + escapeHtml(s.icon) + '" alt="" style="width:16px;height:16px;object-fit:contain;vertical-align:middle;margin-right:5px">'
        : '';
      return '<button class="tz-chip" data-af-slot="' + escapeHtml(s.id) + '" type="button">' + ico + escapeHtml(s.label) + '</button>';
    }).join("");
  wrap.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      wrap.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      afFilterSlot = btn.dataset.afSlot;
      renderAffixesList();
    });
  });
}

function renderStatList(str, color, splitPlus) {
  if (!str) return '';
  const re = splitPlus ? /\s*(?:·|\||(?:\s\+\s))\s*/ : /\s*(?:·|\|)\s*/;
  const parts = String(str).split(re).map(x => x.trim()).filter(Boolean);
  const st = color ? ' style="color:' + color + '"' : '';
  return '<ul class="it-stat-list"' + st + '>' + parts.map(p => '<li>' + escapeHtml(p) + '</li>').join('') + '</ul>';
}

function renderAffixesCraftRecipes() {
  const grid = document.getElementById("af-craft-grid");
  if (!afData?.craftRecipes) return;
  grid.innerHTML = afData.craftRecipes.map(series => {
    const gemImg = series.gemIcon
      ? '<img src="' + escapeHtml(series.gemIcon) + '" alt="' + escapeHtml(series.gem) + '" style="width:20px;height:20px;object-fit:contain;vertical-align:middle;margin:0 4px">'
      : '';
    return '<article class="af-craft-card">' +
      '<h4 class="af-craft-title">' + escapeHtml(series.series) + ' · ' + gemImg + escapeHtml(series.gem) + '</h4>' +
      '<div class="af-craft-rows">' +
        series.items.map(item =>
          '<div class="af-craft-row">' +
            '<div class="af-craft-row-head"><span>' + escapeHtml(item.slot) + '（' + escapeHtml(item.rune) + '）</span></div>' +
            '<div class="af-craft-row-meta">底材：' + escapeHtml(item.base) + '</div>' +
            renderStatList(String(item.fixed || "").replace(/、/g, " · "), "#ffd5a8", false) +
          '</div>'
        ).join("") +
      '</div>' +
    '</article>';
  }).join("");
}

function renderAffixesList() {
  const container = document.getElementById("af-list");
  if (!afData?.affixes) {
    container.innerHTML = '<div class="tz-empty">正在加载词缀范围...</div>';
    return;
  }

  const slotLabelMap = new Map((afData.slots || []).map(s => [s.id, s.label]));
  const filtered = afData.affixes.filter(item => {
    if (afFilterSlot !== "all" && item.slot !== afFilterSlot) return false;
    if (afFilterType !== "all" && item.type !== afFilterType) return false;
    if (afFilterQuality !== "all") {
      if (afFilterQuality === "generic" && item.quality !== "all") return false;
      if (afFilterQuality !== "generic" && item.quality !== afFilterQuality) return false;
    }
    if (afSearchQuery) {
      const q = afSearchQuery.toLowerCase();
      const hay = (item.nameZh + " " + item.nameEn + " " + item.range + " " + (item.note || "") + " " + (slotLabelMap.get(item.slot) || "")).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = '<div class="tz-empty">未找到匹配的词缀记录</div>';
    return;
  }

  container.innerHTML = filtered.map(item => {
    const typeLabel = currentLang === "enUS"
      ? (item.type === "prefix" ? "Prefix" : item.type === "crafted" ? "Crafted" : "Suffix")
      : (item.type === "prefix" ? "前缀" : item.type === "crafted" ? "手工固定" : "后缀");
    const qualityBadge = item.quality === "magic"
      ? '<span class="rw-badge af-badge-magic">' + (currentLang === "enUS" ? "Magic Cap" : "仅蓝装极限") + '</span>'
      : item.quality === "rare"
        ? '<span class="rw-badge af-badge-rare">' + (currentLang === "enUS" ? "Rare Cap" : "黄/橙极限") + '</span>'
        : item.quality === "crafted"
          ? '<span class="rw-badge af-badge-crafted">' + (currentLang === "enUS" ? "Crafted Fixed" : "橙装固定") + '</span>'
          : '<span class="rw-badge af-badge-all">' + (currentLang === "enUS" ? "All Qualities" : "蓝/黄/橙通用") + '</span>';
    const slotLabel = slotLabelMap.get(item.slot) || item.slot;
    const noteHtml = item.note
      ? '<div class="af-card-note">' + escapeHtml(item.note) + '</div>'
      : "";

    return '<article class="af-card">' +
      '<div class="af-card-head">' +
        '<div><span class="af-card-title">' + escapeHtml(currentLang === "enUS" ? item.nameEn : item.nameZh) + '</span><span class="af-card-en">' + escapeHtml(currentLang === "enUS" ? item.nameZh : item.nameEn) + '</span></div>' +
        '<div class="af-card-badges">' +
          '<span class="rw-badge">' + escapeHtml(slotLabel) + '</span>' +
          '<span class="rw-badge">' + typeLabel + '</span>' +
          qualityBadge +
          '<span class="rw-badge">alvl ' + item.alvl + '</span>' +
        '</div>' +
      '</div>' +
      renderStatList(item.range, "#7fc2ff", false) +
      noteHtml +
    '</article>';
  }).join("");
}

function setupAffixesEvents() {
  const searchInput = document.getElementById("af-search-input");
  const searchClear = document.getElementById("af-search-clear");
  searchInput.addEventListener("input", (e) => {
    afSearchQuery = e.target.value.trim();
    searchClear.style.display = afSearchQuery ? "block" : "none";
    renderAffixesList();
  });
  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    afSearchQuery = "";
    searchClear.style.display = "none";
    renderAffixesList();
    searchInput.focus();
  });

  document.querySelectorAll("#af-quality-chips button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#af-quality-chips button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      afFilterQuality = btn.dataset.afQuality;
      renderAffixesList();
    });
  });

  document.querySelectorAll("#af-type-chips button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#af-type-chips button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      afFilterType = btn.dataset.afType;
      renderAffixesList();
    });
  });

  const craftToggle = document.getElementById("af-craft-toggle");
  const craftBody = document.getElementById("af-craft-body");
  const craftArrow = document.getElementById("af-craft-arrow");
  craftToggle.addEventListener("click", () => {
    afCraftOpen = !afCraftOpen;
    craftBody.style.display = afCraftOpen ? "block" : "none";
    craftArrow.textContent = afCraftOpen ? "▲ 收起配方" : "▼ 展开配方";
    craftToggle.setAttribute("aria-expanded", String(afCraftOpen));
  });

  loadAffixesCatalog();
  setupAffixSubtabs();
}

/* 物品词缀模拟器逻辑 */
let simBaseId = "ring";
let simQuality = "rare";
let simIlvl = 85;
let simClvl = 93;
let simCraftBaseIlvl = 88;
let simCraftRecipeIdx = 0;
let simSelectedPrefixes = [];
let simSelectedSuffixes = [];
let simRolledLines = null;

function setupAffixSubtabs() {
  const refBtn = document.getElementById("af-subtab-ref");
  const simBtn = document.getElementById("af-subtab-sim");
  const refView = document.getElementById("af-view-ref");
  const simView = document.getElementById("af-view-sim");
  const switchSubtab = (name) => {
    const isSim = name === "sim";
    refBtn.classList.toggle("active", !isSim);
    simBtn.classList.toggle("active", isSim);
    refView.style.display = isSim ? "none" : "block";
    simView.style.display = isSim ? "block" : "none";
  };
  refBtn.addEventListener("click", () => switchSubtab("ref"));
  simBtn.addEventListener("click", () => switchSubtab("sim"));
}

function getSimBase() {
  return (afData?.simulatorBases || []).find(b => b.id === simBaseId) || {
    id: "ring", slot: "ring", label: "戒指 (Ring)", icon: "/images/items/misc/ring/ring1.webp", qlvl: 1, magicLvl: 0, supportsCraft: true
  };
}

function computeSimAlvl(ilvl, qlvl, magicLvl) {
  const clampedIlvl = Math.min(99, Math.max(1, Number(ilvl) || 1));
  const effIlvl = Math.max(clampedIlvl, Number(qlvl) || 1);
  let alvl;
  if (magicLvl > 0) {
    alvl = effIlvl + magicLvl;
  } else if (effIlvl < 99 - Math.floor(qlvl / 2)) {
    alvl = effIlvl - Math.floor(qlvl / 2);
  } else {
    alvl = 2 * effIlvl - 99;
  }
  return Math.min(99, Math.max(1, alvl));
}

function getSimOutIlvl() {
  if (simQuality === "crafted") {
    return Math.min(99, Math.max(1, Math.floor(simClvl / 2) + Math.floor(simCraftBaseIlvl / 2)));
  }
  return Math.min(99, Math.max(1, simIlvl));
}

function getSimLimits(outIlvl) {
  const base = getSimBase();
  if (simQuality === "magic") {
    return { maxPrefix: 1, maxSuffix: 1, maxTotal: 2, label: "最多 1 前缀 + 1 后缀" };
  }
  if (simQuality === "crafted") {
    const randMax = outIlvl >= 71 ? 4 : outIlvl >= 51 ? 3 : outIlvl >= 31 ? 2 : 1;
    return {
      maxPrefix: 3,
      maxSuffix: 3,
      maxTotal: randMax,
      label: "固定属性 + " + (outIlvl >= 71 ? "必出 4 条随机" : "最多 " + randMax + " 条随机") + "（前≤3, 后≤3）"
    };
  }
  if (base && base.rareMaxAffixes) {
    return { maxPrefix: 3, maxSuffix: 3, maxTotal: base.rareMaxAffixes, label: "亮金珠宝最多 " + base.rareMaxAffixes + " 条词缀（前≤3, 后≤3）" };
  }
  return { maxPrefix: 3, maxSuffix: 3, maxTotal: 6, label: "最多 3 前缀 + 3 后缀" };
}

function getCraftRecipesForSlot(slot) {
  return (afData?.affixes || []).filter(a => a.slot === slot && a.type === "crafted");
}

function isAffixAllowedInSim(affix, alvl) {
  if (affix.alvl > alvl) return { ok: false, reason: "需 alvl " + affix.alvl };
  if (simQuality !== "magic" && affix.quality === "magic") {
    return { ok: false, reason: "仅蓝装专属" };
  }
  if (simQuality === "magic" && affix.quality === "rare") {
    return { ok: false, reason: "蓝装有更高上限" };
  }
  return { ok: true, reason: "" };
}

function populateSimCraftRecipes() {
  const base = getSimBase();
  const select = document.getElementById("sim-craft-recipe");
  const recipes = getCraftRecipesForSlot(base.slot);
  if (recipes.length === 0) {
    select.innerHTML = '<option value="0">通用橙装模板</option>';
    simCraftRecipeIdx = 0;
    return;
  }
  select.innerHTML = recipes.map((r, idx) =>
    '<option value="' + idx + '">' + escapeHtml(r.nameZh) + ' · ' + escapeHtml(r.nameEn) + '</option>'
  ).join("");
  if (simCraftRecipeIdx >= recipes.length) simCraftRecipeIdx = 0;
  select.value = String(simCraftRecipeIdx);
}

function updateSimStateAndRender() {
  if (!afData) return;
  const base = getSimBase();

  const rareBtn = document.querySelector('#sim-quality-chips [data-sim-quality="rare"]');
  const craftBtn = document.querySelector('#sim-quality-chips [data-sim-quality="crafted"]');
  if (rareBtn) {
    rareBtn.disabled = Boolean(base.magicOnly);
    rareBtn.style.opacity = base.magicOnly ? ".4" : "1";
  }
  if (craftBtn) {
    craftBtn.disabled = !base.supportsCraft;
    craftBtn.style.opacity = base.supportsCraft ? "1" : ".4";
  }
  if (base.magicOnly && simQuality !== "magic") {
    simQuality = "magic";
    document.querySelectorAll("#sim-quality-chips button").forEach(b => {
      b.classList.toggle("active", b.dataset.simQuality === "magic");
    });
  } else if (!base.supportsCraft && simQuality === "crafted") {
    simQuality = "rare";
    document.querySelectorAll("#sim-quality-chips button").forEach(b => {
      b.classList.toggle("active", b.dataset.simQuality === "rare");
    });
  }

  document.getElementById("sim-standard-lvls").style.display = simQuality === "crafted" ? "none" : "flex";
  document.getElementById("sim-craft-opts").style.display = simQuality === "crafted" ? "flex" : "none";

  const outIlvl = getSimOutIlvl();
  const alvl = computeSimAlvl(outIlvl, base.qlvl, base.magicLvl);
  const limits = getSimLimits(outIlvl);

  document.getElementById("sim-out-ilvl").textContent = outIlvl;
  document.getElementById("sim-out-alvl").textContent = alvl;
  document.getElementById("sim-out-limit").textContent = limits.label;

  // 清理已选中但不再满足当前 alvl / 品质的词缀
  const pool = (afData.affixes || []).filter(a => a.slot === base.slot && a.type !== "crafted");
  simSelectedPrefixes = simSelectedPrefixes.filter(idx => {
    const item = pool[idx];
    return item && item.type === "prefix" && isAffixAllowedInSim(item, alvl).ok;
  }).slice(0, limits.maxPrefix);
  simSelectedSuffixes = simSelectedSuffixes.filter(idx => {
    const item = pool[idx];
    return item && item.type === "suffix" && isAffixAllowedInSim(item, alvl).ok;
  }).slice(0, limits.maxSuffix);

  renderSimPools(pool, alvl, limits);
  renderSimPreview(base, pool, outIlvl, alvl, limits);
}

function renderSimPools(pool, alvl, limits) {
  const prefixContainer = document.getElementById("sim-prefix-list");
  const suffixContainer = document.getElementById("sim-suffix-list");
  document.getElementById("sim-prefix-count").textContent = simSelectedPrefixes.length + " / " + limits.maxPrefix;
  document.getElementById("sim-suffix-count").textContent = simSelectedSuffixes.length + " / " + limits.maxSuffix;

  const renderList = (type, selectedArr) => {
    const items = pool
      .map((item, idx) => ({ item, idx }))
      .filter(entry => entry.item.type === type);

    if (items.length === 0) {
      return '<div class="tz-empty">该部位暂无此类型词缀</div>';
    }

    return items.map(({ item, idx }) => {
      const check = isAffixAllowedInSim(item, alvl);
      const isSelected = selectedArr.includes(idx);
      return '<button type="button" class="sim-affix-btn' + (isSelected ? " selected" : "") + '"' +
        ' data-sim-affix="' + idx + '" data-sim-type="' + type + '"' +
        (!check.ok ? " disabled" : "") + '>' +
        '<div class="sim-affix-top">' +
          '<span>' + escapeHtml(item.nameZh) + '</span>' +
          '<span class="sim-affix-req">' + (check.ok ? "alvl " + item.alvl : escapeHtml(check.reason)) + '</span>' +
        '</div>' +
        '<div class="sim-affix-range">' + escapeHtml(item.range) + '</div>' +
      '</button>';
    }).join("");
  };

  prefixContainer.innerHTML = renderList("prefix", simSelectedPrefixes);
  suffixContainer.innerHTML = renderList("suffix", simSelectedSuffixes);

  const bindClicks = (container) => {
    container.querySelectorAll("[data-sim-affix]").forEach(btn => {
      btn.addEventListener("click", () => {
        simRolledLines = null;
        const idx = Number(btn.dataset.simAffix);
        const type = btn.dataset.simType;
        const outIlvl = getSimOutIlvl();
        const limitsNow = getSimLimits(outIlvl);

        if (type === "prefix") {
          if (simSelectedPrefixes.includes(idx)) {
            simSelectedPrefixes = simSelectedPrefixes.filter(i => i !== idx);
          } else {
            const totalNow = simSelectedPrefixes.length + simSelectedSuffixes.length;
            if (simSelectedPrefixes.length < limitsNow.maxPrefix && totalNow < limitsNow.maxTotal) {
              simSelectedPrefixes.push(idx);
            }
          }
        } else {
          if (simSelectedSuffixes.includes(idx)) {
            simSelectedSuffixes = simSelectedSuffixes.filter(i => i !== idx);
          } else {
            const totalNow = simSelectedPrefixes.length + simSelectedSuffixes.length;
            if (simSelectedSuffixes.length < limitsNow.maxSuffix && totalNow < limitsNow.maxTotal) {
              simSelectedSuffixes.push(idx);
            }
          }
        }
        updateSimStateAndRender();
      });
    });
  };

  bindClicks(prefixContainer);
  bindClicks(suffixContainer);
}

function rollNumberInRangeText(text) {
  return String(text).replace(/(d+)s*[–-]s*(d+)/g, (_, a, b) => {
    const min = Number(a);
    const max = Number(b);
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
  });
}

function rollSimulatedItem() {
  if (!afData) return;
  const base = getSimBase();
  const outIlvl = getSimOutIlvl();
  const alvl = computeSimAlvl(outIlvl, base.qlvl, base.magicLvl);
  const limits = getSimLimits(outIlvl);
  const pool = (afData.affixes || []).filter(a => a.slot === base.slot && a.type !== "crafted");

  const validPrefixes = pool.map((item, idx) => ({ item, idx })).filter(e => e.item.type === "prefix" && isAffixAllowedInSim(e.item, alvl).ok);
  const validSuffixes = pool.map((item, idx) => ({ item, idx })).filter(e => e.item.type === "suffix" && isAffixAllowedInSim(e.item, alvl).ok);

  const shuffle = (arr) => arr.slice().sort(() => Math.random() - 0.5);
  const pPool = shuffle(validPrefixes);
  const sPool = shuffle(validSuffixes);

  simSelectedPrefixes = [];
  simSelectedSuffixes = [];

  if (simQuality === "magic") {
    const hasP = pPool.length > 0 && Math.random() < 0.75;
    const hasS = sPool.length > 0 && (Math.random() < 0.75 || !hasP);
    if (hasP) simSelectedPrefixes.push(pPool[0].idx);
    if (hasS) simSelectedSuffixes.push(sPool[0].idx);
  } else {
    const targetCount = simQuality === "crafted"
      ? limits.maxTotal
      : Math.min(limits.maxTotal, 4 + Math.floor(Math.random() * 3));
    let pIdx = 0;
    let sIdx = 0;
    for (let i = 0; i < targetCount; i++) {
      const canP = pIdx < pPool.length && simSelectedPrefixes.length < limits.maxPrefix;
      const canS = sIdx < sPool.length && simSelectedSuffixes.length < limits.maxSuffix;
      if (!canP && !canS) break;
      if (canP && (!canS || Math.random() < 0.5)) {
        simSelectedPrefixes.push(pPool[pIdx++].idx);
      } else {
        simSelectedSuffixes.push(sPool[sIdx++].idx);
      }
    }
  }

  simRolledLines = {};
  for (const idx of [...simSelectedPrefixes, ...simSelectedSuffixes]) {
    simRolledLines[idx] = rollNumberInRangeText(pool[idx].range);
  }
  updateSimStateAndRender();
}

function renderSimPreview(base, pool, outIlvl, alvl, limits) {
  const card = document.getElementById("sim-preview-card");
  card.className = "sim-preview-card q-" + simQuality;
  const qualityName = simQuality === "magic" ? "魔法" : simQuality === "crafted" ? "手工" : "亮金";
  const baseCleanName = base.label.replace(/^[^一-龥A-Za-z]+/, "").split(" (")[0];
  document.getElementById("sim-preview-title").textContent = qualityName + baseCleanName;
  const iconEl = document.getElementById("sim-preview-icon");
  if (iconEl) iconEl.src = base.icon || "/images/items/misc/ring/ring1.webp";

  const totalSelected = simSelectedPrefixes.length + simSelectedSuffixes.length;
  document.getElementById("sim-preview-sub").textContent =
    "ilvl " + outIlvl + " · alvl " + alvl + " · 随机词缀 " + totalSelected + " / " + limits.maxTotal;

  const lines = [];
  if (simQuality === "crafted") {
    const recipes = getCraftRecipesForSlot(base.slot);
    const recipe = recipes[simCraftRecipeIdx];
    if (recipe) {
      lines.push('<li class="fixed-line">【固定】' + escapeHtml(simRolledLines ? rollNumberInRangeText(recipe.range) : recipe.range) + '</li>');
    }
  }

  for (const idx of [...simSelectedPrefixes, ...simSelectedSuffixes]) {
    const item = pool[idx];
    if (!item) continue;
    const valText = simRolledLines?.[idx] || item.range;
    lines.push('<li>' + escapeHtml(valText) + ' <span style="opacity:.65;font-size:11px">(' + escapeHtml(item.nameZh) + ')</span></li>');
  }

  if (lines.length === 0) {
    lines.push('<li style="color:var(--muted)">请从左侧点选前缀/后缀，或点击「随机 Roll 一次」</li>');
  }
  document.getElementById("sim-preview-lines").innerHTML = lines.join("");
}

function initSimulator() {
  const baseSelect = document.getElementById("sim-base-select");
  const bases = afData?.simulatorBases || [];
  baseSelect.innerHTML = bases.map(b =>
    '<option value="' + escapeHtml(b.id) + '">' + escapeHtml(b.label) + '</option>'
  ).join("");
  baseSelect.value = simBaseId;

  baseSelect.addEventListener("change", () => {
    simBaseId = baseSelect.value;
    simSelectedPrefixes = [];
    simSelectedSuffixes = [];
    simRolledLines = null;
    populateSimCraftRecipes();
    updateSimStateAndRender();
  });

  document.querySelectorAll("#sim-quality-chips button").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      document.querySelectorAll("#sim-quality-chips button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      simQuality = btn.dataset.simQuality;
      simRolledLines = null;
      populateSimCraftRecipes();
      updateSimStateAndRender();
    });
  });

  const ilvlInput = document.getElementById("sim-ilvl-input");
  ilvlInput.addEventListener("input", () => {
    simIlvl = Math.min(99, Math.max(1, Number(ilvlInput.value) || 1));
    simRolledLines = null;
    document.querySelectorAll("#sim-ilvl-presets button").forEach(b => {
      b.classList.toggle("active", Number(b.dataset.simIlvl) === simIlvl);
    });
    updateSimStateAndRender();
  });

  document.querySelectorAll("#sim-ilvl-presets button").forEach(btn => {
    btn.addEventListener("click", () => {
      simIlvl = Number(btn.dataset.simIlvl);
      ilvlInput.value = simIlvl;
      simRolledLines = null;
      document.querySelectorAll("#sim-ilvl-presets button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      updateSimStateAndRender();
    });
  });

  document.getElementById("sim-craft-recipe").addEventListener("change", (e) => {
    simCraftRecipeIdx = Number(e.target.value) || 0;
    updateSimStateAndRender();
  });
  document.getElementById("sim-clvl-input").addEventListener("input", (e) => {
    simClvl = Math.min(99, Math.max(1, Number(e.target.value) || 1));
    updateSimStateAndRender();
  });
  document.getElementById("sim-craft-ilvl-input").addEventListener("input", (e) => {
    simCraftBaseIlvl = Math.min(99, Math.max(1, Number(e.target.value) || 1));
    updateSimStateAndRender();
  });

  document.getElementById("sim-roll-btn").addEventListener("click", rollSimulatedItem);
  document.getElementById("sim-clear-btn").addEventListener("click", () => {
    simSelectedPrefixes = [];
    simSelectedSuffixes = [];
    simRolledLines = null;
    updateSimStateAndRender();
  });

  populateSimCraftRecipes();
  updateSimStateAndRender();
}

/* 物品资讯百科逻辑（基础 / 蓝黄 / 绿装 / 暗金 / 方块公式） + 圣杯 100% 收集追踪 */
let itData = null;
let dcData = null;
let dcMode = "source";
let dcSourceId = "andariel-tz";
let dcMf = 250;
let dcPlayers = 1;
let itActiveTab = "base";
let itSubFilter = "all";
let itBaseSocketFilter = "all";
let itGrailFilter = "all";
let itSearchQuery = "";

const GRAIL_UNIQUE_KEY = "d2r-grail-uniques-v1";
const GRAIL_SET_KEY = "d2r-grail-sets-v1";
let grailUniques = new Set();
let grailSetPieces = new Set();

function loadGrailState() {
  try {
    const rawU = localStorage.getItem(GRAIL_UNIQUE_KEY);
    if (rawU) grailUniques = new Set(JSON.parse(rawU));
    const rawS = localStorage.getItem(GRAIL_SET_KEY);
    if (rawS) grailSetPieces = new Set(JSON.parse(rawS));
  } catch (e) {
    console.warn("读取圣杯存档失败", e);
  }
}

function saveGrailState() {
  try {
    localStorage.setItem(GRAIL_UNIQUE_KEY, JSON.stringify([...grailUniques]));
    localStorage.setItem(GRAIL_SET_KEY, JSON.stringify([...grailSetPieces]));
    if (!window.__cloudApplyingRemote) {
      localStorage.setItem("d2r-builds-local-updated-at", new Date().toISOString());
      if (typeof scheduleCloudSync === "function") scheduleCloudSync();
    }
  } catch (e) {
    console.warn("保存圣杯存档失败", e);
  }
}

function renderGrailSummary() {
  if (!itData) return;
  const uniques = itData.uniqueItems || [];
  const sets = itData.setItems || [];
  const allPieces = sets.flatMap(s => (s.detail && s.detail.pieces) ? s.detail.pieces : []);

  const uTotal = uniques.length;
  const uDone = uniques.filter(u => grailUniques.has(u.nameEn)).length;

  const sTotal = allPieces.length;
  const sDone = allPieces.filter(p => grailSetPieces.has(p.nameEn)).length;

  const fullSetTotal = sets.length;
  const fullSetDone = sets.filter(s => {
    const pcs = (s.detail && s.detail.pieces) ? s.detail.pieces : [];
    return pcs.length > 0 && pcs.every(p => grailSetPieces.has(p.nameEn));
  }).length;

  const tc87Uniques = uniques.filter(u => u.baseInfo && u.baseInfo.tc === 87);
  const tc87Pieces = allPieces.filter(p => p.baseInfo && p.baseInfo.tc === 87);
  const tc87Total = tc87Uniques.length + tc87Pieces.length;
  const tc87Done = tc87Uniques.filter(u => grailUniques.has(u.nameEn)).length +
    tc87Pieces.filter(p => grailSetPieces.has(p.nameEn)).length;

  const totalAll = uTotal + sTotal;
  const totalDone = uDone + sDone;
  const pct = totalAll > 0 ? Math.round((totalDone / totalAll) * 1000) / 10 : 0;

  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(val);
  };
  setText("grail-total-done", totalDone);
  setText("grail-total-all", totalAll);
  setText("grail-total-pct", pct + "%");
  setText("grail-unique-done", uDone);
  setText("grail-unique-all", uTotal);
  setText("grail-set-done", sDone);
  setText("grail-set-all", sTotal);
  setText("grail-fullset-done", fullSetDone);
  setText("grail-fullset-all", fullSetTotal);
  setText("grail-tc87-done", tc87Done);
  setText("grail-tc87-all", tc87Total);

  const fillEl = document.getElementById("grail-progress-fill");
  if (fillEl) fillEl.style.width = Math.min(100, pct) + "%";
}

const IT_SUBFILTERS = {
  base: [
    { id: "all", label: "全部底材", icon: "/images/ui/gemsocket.webp" },
    { id: "armor", label: "盔甲", icon: "/images/items/armor/armor/light_plate.webp" },
    { id: "shield", label: "盾牌", icon: "/images/items/armor/shield/kite_shield.webp" },
    { id: "weapon", label: "武器/长柄", icon: "/images/items/weapon/polearm/scythe.webp" },
    { id: "helm", label: "头盔", icon: "/images/items/armor/helmet/bone_helm.webp" }
  ],
  magicRare: [
    { id: "all", label: "全部蓝/黄", icon: "/images/items/armor/circlet/diadem.webp" },
    { id: "magic", label: "蓝装极品", icon: "/images/items/misc/gem/perfect_saphire.webp" },
    { id: "rare", label: "黄装极品", icon: "/images/items/misc/gem/perfect_topaz.webp" }
  ],
  set: [
    { id: "all", label: "全部套装", icon: "/images/items/armor/helmet/horazons_countenance.webp" },
    { id: "class", label: "七大职业套装", icon: "/images/items/armor/helmet/avenger_guard.webp" },
    { id: "generic", label: "通用/开荒套装", icon: "/images/items/armor/shield/tower_shield.webp" }
  ],
  unique: [
    { id: "all", label: "全部暗金", icon: "/images/items/misc/quest/mephisto_soul_stone.webp" },
    { id: "helm", label: "头盔", icon: "/images/items/armor/circlet/tiara.webp" },
    { id: "armor", label: "盔甲", icon: "/images/items/armor/armor/victors_silk.webp" },
    { id: "weapon", label: "武器", icon: "/images/items/weapon/javelin/maiden_javelin.webp" },
    { id: "shield", label: "盾牌", icon: "/images/items/armor/shield/steelclash.webp" },
    { id: "gloves", label: "手套", icon: "/images/items/armor/glove/gaunlets_h.webp" },
    { id: "boots", label: "鞋子", icon: "/images/items/armor/boot/heavy_boots.webp" },
    { id: "belt", label: "腰带", icon: "/images/items/armor/belt/sash_l.webp" },
    { id: "ring", label: "戒指", icon: "/images/items/misc/ring/ring5.webp" },
    { id: "amulet", label: "护身符", icon: "/images/items/misc/amulet/viper_amulet.webp" },
    { id: "charm", label: "咒符", icon: "/images/items/misc/torch/torch.webp" },
    { id: "jewel", label: "珠宝", icon: "/images/items/misc/body_part/fragment_fire.webp" }
  ],
  cube: [],
  drops: [
    { id: "all", label: "全部掉落", icon: "/images/items/misc/shard/mote_of_anguish.webp" },
    { id: "unique", label: "暗金装备", icon: "/images/items/misc/quest/mephisto_soul_stone.webp" },
    { id: "set", label: "绿色套装", icon: "/images/items/armor/helmet/horazons_countenance.webp" },
    { id: "rune", label: "符文 (#1-#33)", icon: "/images/items/misc/rune/ber_rune.webp" },
    { id: "special", label: "钥匙 / 精华 / 3.4 雕像", icon: "/images/items/misc/key/mephisto_key.webp" }
  ]
};

function populateDcSourceSelect() {
  const sel = document.getElementById("dc-source-select");
  if (!sel || !dcData || !Array.isArray(dcData.sources)) return;
  sel.innerHTML = dcData.sources.map(src => {
    const nm = currentLang === "zhTW" ? (src.nameTw || src.nameZh) : currentLang === "enUS" ? src.nameEn : src.nameZh;
    return '<option value="' + escapeHtml(src.id) + '"' + (src.id === dcSourceId ? ' selected' : '') + '>' + escapeHtml(nm) + ' (mlvl ' + src.mlvl + ')</option>';
  }).join("");
}

function syncDcSourceToCurrentTz() {
  if (!dcData || !Array.isArray(dcData.sources)) return;
  const curTzEn = (window.dashboardData && window.dashboardData.terrorZone && window.dashboardData.terrorZone.current) || "";
  const matched = dcData.sources.find(s => s.isTz && s.tzZone && s.tzZone !== "*" && curTzEn.toLowerCase().includes(s.tzZone.toLowerCase().split(",")[0]));
  dcSourceId = matched ? matched.id : "tz-unique-96";
  populateDcSourceSelect();
}

function computePickDropProb(noDrop, probSum, players) {
  if (noDrop <= 0) return 1;
  const n = Math.max(1, Math.floor((1 + Number(players || 1)) / 2));
  if (n <= 1) return probSum / (probSum + noDrop);
  const baseNoDropRatio = noDrop / (noDrop + probSum);
  const powRatio = Math.pow(baseNoDropRatio, n);
  const newNoDrop = Math.floor(probSum * (powRatio / (1 - powRatio)));
  if (newNoDrop <= 0) return 1;
  return probSum / (probSum + newNoDrop);
}

function computeQualityChance(baseChance, divisor, minVal, effMf, tcFactor, mlvl, qlvl) {
  let chance = (baseChance - Math.floor((mlvl - qlvl) / divisor)) * 128;
  if (effMf > 0) {
    chance = Math.floor((chance * 100) / (100 + effMf));
  }
  if (chance < minVal) chance = minVal;
  chance = chance - Math.floor((chance * tcFactor) / 1024);
  if (chance <= 128) return 1;
  return 128 / chance;
}

function computeEquipQualityOdds(code, src, mf) {
  if (!dcData || !dcData.baseMeta) return { unique: 0, set: 0 };
  const meta = dcData.baseMeta[code];
  if (!meta) return { unique: 0, set: 0 };
  const isCs = meta.cs === 1;
  const uBase = isCs ? 240 : 400;
  const uDiv = isCs ? 3 : 1;
  const sBase = isCs ? 120 : 160;
  const sDiv = isCs ? 3 : 2;
  const effMfU = mf > 0 ? Math.floor((mf * 250) / (mf + 250)) : 0;
  const effMfS = mf > 0 ? Math.floor((mf * 500) / (mf + 500)) : 0;
  const pU = src.uniqueFactor > 0 ? computeQualityChance(uBase, uDiv, 6400, effMfU, src.uniqueFactor, src.mlvl, meta.qlvl) : 0;
  const pS = src.setFactor > 0 ? computeQualityChance(sBase, sDiv, 5600, effMfS, src.setFactor, src.mlvl, meta.qlvl) : 0;
  return { unique: pU, set: (1 - pU) * pS };
}

function computeSingleItemDropChance(src, itemType, code, itemNameEn, mf, players) {
  let leafP = Number((src.leaves && src.leaves[code]) || 0);
  const pDrop = computePickDropProb(src.noDrop, src.probSum, players);
  let perPickP = 0;

  if (itemType === "rune" || itemType === "special") {
    perPickP = pDrop * leafP;
    let mainChance = perPickP > 0 ? (1 - Math.pow(1 - perPickP, src.picks)) : 0;
    if (itemType === "rune" && src.extraRune && src.extraRune.leaves && src.extraRune.leaves[code]) {
      const rDrop = computePickDropProb(src.extraRune.noDrop, src.extraRune.probSum, players);
      const rPerPick = rDrop * Number(src.extraRune.leaves[code]);
      const rChance = 1 - Math.pow(1 - rPerPick, src.extraRune.picks);
      mainChance = 1 - (1 - mainChance) * (1 - rChance);
    }
    return mainChance;
  }

  if (leafP <= 0) return 0;
  const qOdds = computeEquipQualityOdds(code, src, mf);

  if (itemType === "unique") {
    const pool = (dcData.uniquePools && dcData.uniquePools[code]) || [];
    const eligible = pool.filter(u => u.qlvl <= src.mlvl);
    const target = eligible.find(u => u.nameEn === itemNameEn);
    if (!target) return 0;
    const sumRarity = eligible.reduce((a, b) => a + b.rarity, 0);
    perPickP = pDrop * leafP * qOdds.unique * (target.rarity / sumRarity);
  } else if (itemType === "set") {
    const pool = (dcData.setPools && dcData.setPools[code]) || [];
    const eligible = pool.filter(s => s.qlvl <= src.mlvl);
    const target = eligible.find(s => s.nameEn === itemNameEn);
    if (!target) return 0;
    const sumRarity = eligible.reduce((a, b) => a + b.rarity, 0);
    perPickP = pDrop * leafP * qOdds.set * (target.rarity / sumRarity);
  }

  if (perPickP <= 0) return 0;
  return 1 - Math.pow(1 - perPickP, src.picks);
}

let cubeUpTargetName = "Titan's Revenge";
let cubeUpEth = false;
let cubeSunderId = "cold";
let cubeSunderRolled = [];

function initCubeSimulators() {
  if (!itData) return;
  const upSel = document.getElementById("cube-up-select");
  const metaMap = itData.uniqueUpgradeMeta || {};
  const tiersMap = itData.baseUpgradeTiers || {};
  if (upSel) {
    const upItems = (itData.uniqueItems || []).filter(u => metaMap[u.nameEn]);
    upSel.innerHTML = upItems.map(u => {
      const m = metaMap[u.nameEn];
      const b = tiersMap[m.code];
      const tLabel = b && b.tier === 1 ? "普通→扩展→精华" : "扩展→精华";
      return '<option value="' + escapeHtml(u.nameEn) + '"' + (u.nameEn === cubeUpTargetName ? ' selected' : '') + '>' + escapeHtml(pickLangTitle(u)) + ' (' + escapeHtml(u.nameEn) + ' · ' + tLabel + ')</option>';
    }).join("");
    upSel.onchange = (e) => {
      cubeUpTargetName = e.target.value;
      renderCubeUpgrader();
    };
  }
  const ethCb = document.getElementById("cube-up-eth");
  if (ethCb) {
    ethCb.onchange = (e) => {
      cubeUpEth = Boolean(e.target.checked);
      renderCubeUpgrader();
    };
  }

  const sunSel = document.getElementById("cube-sunder-select");
  const sunList = itData.sunderCrafts34 || [];
  if (sunSel && sunList.length) {
    sunSel.innerHTML = sunList.map(s =>
      '<option value="' + escapeHtml(s.id) + '"' + (s.id === cubeSunderId ? ' selected' : '') + '>' + escapeHtml(s.nameZh) + ' (' + escapeHtml(s.nameEn) + ')</option>'
    ).join("");
    sunSel.onchange = (e) => {
      cubeSunderId = e.target.value;
      rollAndRenderSunderSim();
    };
  }
  const rollBtn = document.getElementById("cube-sunder-roll-btn");
  if (rollBtn) {
    rollBtn.onclick = () => rollAndRenderSunderSim();
  }
  renderCubeUpgrader();
  rollAndRenderSunderSim();
}

function renderCubeUpgrader() {
  const box = document.getElementById("cube-up-preview");
  if (!box || !itData || !itData.uniqueUpgradeMeta || !itData.baseUpgradeTiers) return;
  const meta = itData.uniqueUpgradeMeta[cubeUpTargetName];
  const uObj = (itData.uniqueItems || []).find(u => u.nameEn === cubeUpTargetName);
  if (!meta || !uObj) return;
  const tiers = itData.baseUpgradeTiers;
  const origBase = tiers[meta.code];
  if (!origBase) return;

  const codesToPreview = origBase.tier === 1
    ? [origBase.norm, origBase.uber, origBase.ultra]
    : [origBase.uber, origBase.ultra];

  const rowsHtml = codesToPreview.map((code, idx) => {
    const b = tiers[code];
    if (!b) return "";
    const isOrig = code === meta.code;
    const stepPenalty = isOrig ? 0 : (origBase.tier === 1 ? (b.tier === 2 ? 5 : 12) : 7);
    const finalReqLvl = Math.max(b.lvl, meta.reqLvl) + stepPenalty;
    const finalStr = Math.max(0, b.str - (cubeUpEth ? 10 : 0));
    const finalDex = Math.max(0, b.dex - (cubeUpEth ? 10 : 0));

    let statText = "";
    if (b.kind === "armor") {
      const minBase = isOrig && meta.ed[1] > 0 ? (b.def[1] + 1) : b.def[0];
      const maxBase = isOrig && meta.ed[1] > 0 ? (b.def[1] + 1) : b.def[1];
      const eMinB = cubeUpEth ? Math.floor(minBase * 1.5) : minBase;
      const eMaxB = cubeUpEth ? Math.floor(maxBase * 1.5) : maxBase;
      const dMin = Math.floor(eMinB * (100 + meta.ed[0]) / 100) + meta.flatDef[0];
      const dMax = Math.floor(eMaxB * (100 + meta.ed[1]) / 100) + meta.flatDef[1];
      statText = "成品防御：" + (dMin === dMax ? dMin : (dMin + " – " + dMax)) + "（底材基础 " + eMinB + "–" + eMaxB + "）";
    } else {
      const calcDmg = (pair) => {
        if (!pair || pair[1] <= 0) return null;
        const eMin = cubeUpEth ? Math.floor(pair[0] * 1.5) : pair[0];
        const eMax = cubeUpEth ? Math.floor(pair[1] * 1.5) : pair[1];
        const mnMin = Math.floor(eMin * (100 + meta.ed[0]) / 100) + meta.flatDmg[0];
        const mxMax = Math.floor(eMax * (100 + meta.ed[1]) / 100) + meta.flatDmg[1];
        return mnMin + " – " + mxMax;
      };
      const d1 = calcDmg(b.d1);
      const d2 = calcDmg(b.d2);
      const dt = calcDmg(b.dt);
      const dParts = [];
      if (d1) dParts.push("单手伤害 " + d1);
      if (d2) dParts.push("双手伤害 " + d2);
      if (dt) dParts.push("投掷伤害 " + dt);
      statText = dParts.join(" · ");
    }

    const tierLabel = b.tier === 1 ? "【普通级】" : b.tier === 2 ? "【扩展级】" : "【精华级】";
    const recipeText = isOrig
      ? "原始掉落阶级"
      : (b.kind === "armor"
          ? (b.tier === 2 ? "升阶公式：#7 塔尔 (Tal) + #13 沙伊 (Shael) + 完美钻石" : "升阶公式：#18 科 (Ko) + #20 兰姆 (Lem) + 完美钻石")
          : (b.tier === 2 ? "升阶公式：#8 拉尔 (Ral) + #12 索尔 (Sol) + 完美绿宝石" : "升阶公式：#17 卢姆 (Lum) + #21 普尔 (Pul) + 完美绿宝石"));
    const bName = currentLang === "zhTW" ? (b.zhTW || b.zhCN) : currentLang === "enUS" ? b.enUS : b.zhCN;

    return '<div class="it-set-bonus-box" style="margin-top:6px;border-color:' + (isOrig ? 'rgba(255,255,255,0.15)' : 'rgba(87,219,112,0.45)') + '">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:4px">' +
        '<strong style="color:' + (isOrig ? '#f5cf7b' : '#8af49f') + '">' + tierLabel + " " + escapeHtml(bName) + ' (' + escapeHtml(b.enUS) + ')</strong>' +
        '<span class="rw-badge">' + escapeHtml(recipeText) + '</span>' +
      '</div>' +
      renderStatList(statText + " · 需求等级 " + finalReqLvl + (finalStr > 0 ? (" · 需求力量 " + finalStr) : "") + (finalDex > 0 ? (" · 需求敏捷 " + finalDex) : ""), "#9ad8ff", false) +
    '</div>';
  }).join("");

  box.innerHTML = rowsHtml;
}

function rollAndRenderSunderSim() {
  const box = document.getElementById("cube-sunder-preview");
  if (!box || !itData || !Array.isArray(itData.sunderCrafts34)) return;
  const sun = itData.sunderCrafts34.find(s => s.id === cubeSunderId) || itData.sunderCrafts34[0];
  const commonPools = itData.sunderCommonPools || [];

  const randInt = (mn, mx) => mn + Math.floor(Math.random() * (mx - mn + 1));
  const pickWeighted = (opts) => {
    const tot = opts.reduce((a, b) => a + (b.weight || 1), 0);
    let r = Math.random() * tot;
    for (const o of opts) {
      r -= (o.weight || 1);
      if (r <= 0) return o;
    }
    return opts[0];
  };

  const rolledLines = [];
  if (Array.isArray(sun.slot1Pool) && sun.slot1Pool.length) {
    const o1 = pickWeighted(sun.slot1Pool);
    const v1 = randInt(o1.min, o1.max);
    rolledLines.push("【词缀 1 · 元素专精】" + o1.label.replace("{v}", String(v1)) + "（范围 " + o1.min + "–" + o1.max + "）");
  }
  for (const pool of commonPools) {
    const opt = pickWeighted(pool.options);
    const val = randInt(opt.min, opt.max);
    rolledLines.push("【" + pool.slotName + "】" + opt.label.replace("{v}", String(val)) + "（范围 " + opt.min + "–" + opt.max + "）");
  }

  box.innerHTML =
    '<div class="it-card-note" style="color:#ffd584;margin-bottom:6px">方块公式：' + escapeHtml(sun.recipeZh) + '</div>' +
    renderStatList(sun.fixedStats.join(" · "), "#f1a7ec", false) +
    renderStatList(rolledLines.join(" · "), "#8af49f", false);
}

async function loadItemsCatalog() {
  try {
    loadGrailState();
    const [response, dropRes] = await Promise.all([
      fetch("/api/items", { cache: "no-store" }),
      fetch("/api/drops", { cache: "no-store" })
    ]);
    const data = await response.json();
    const dropData = await dropRes.json();
    if (dropData && dropData.ok) {
      dcData = dropData;
      populateDcSourceSelect();
    }
    if (data.ok) {
      itData = data;
      renderGrailSummary();
      initCubeSimulators();
      renderItSubfilters();
      renderItemsGrid();
      if (typeof renderPaperdollAll === "function") renderPaperdollAll();
    }
  } catch (err) {
    console.error("加载物品资讯失败", err);
  }
}

function renderItSubfilters() {
  const sockRow = document.getElementById("it-base-sockets-row");
  if (sockRow) {
    sockRow.style.display = itActiveTab === "base" ? "flex" : "none";
  }
  const grailRow = document.getElementById("it-grail-filter-row");
  if (grailRow) {
    grailRow.style.display = (itActiveTab === "unique" || itActiveTab === "set") ? "flex" : "none";
  }
  const dropsConsole = document.getElementById("it-drops-console");
  if (dropsConsole) {
    dropsConsole.style.display = itActiveTab === "drops" ? "flex" : "none";
  }
  const cubeSimConsole = document.getElementById("it-cube-sim-console");
  if (cubeSimConsole) {
    cubeSimConsole.style.display = itActiveTab === "cube" ? "block" : "none";
  }
  const row = document.getElementById("it-subfilter-row");
  const chips = document.getElementById("it-subfilter-chips");
  const options = IT_SUBFILTERS[itActiveTab] || [];
  if (options.length === 0) {
    row.style.display = "none";
    return;
  }
  row.style.display = "flex";
  chips.innerHTML = options.map(opt => {
    const ico = opt.icon
      ? '<img class="ui-chip-icon" src="' + escapeHtml(opt.icon) + '" alt="" />'
      : '';
    return '<button type="button" class="tz-chip' + (itSubFilter === opt.id ? ' active' : '') + '" data-it-filter="' + escapeHtml(opt.id) + '">' + ico + escapeHtml(opt.label) + '</button>';
  }).join("");
  chips.querySelectorAll("[data-it-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      itSubFilter = btn.dataset.itFilter;
      chips.querySelectorAll("[data-it-filter]").forEach(b => {
        b.classList.toggle("active", b.dataset.itFilter === itSubFilter);
      });
      renderItemsGrid();
    });
  });
}

function renderItemsGrid() {
  const grid = document.getElementById("it-grid");
  if (!itData) {
    grid.innerHTML = '<div class="tz-empty">正在加载物品资讯...</div>';
    return;
  }

  const q = itSearchQuery.toLowerCase();
  const matchQuery = (text, itemObj) => {
    if (!q) return true;
    let hay = String(text);
    if (itemObj && itemObj.i18n) {
      hay += " " + (itemObj.i18n.zhCN || "") + " " + (itemObj.i18n.zhTW || "") + " " + (itemObj.i18n.enUS || "");
    }
    return hay.toLowerCase().includes(q);
  };
  let cardsHtml = "";

  const renderItemThumb = (icon, alt) => icon
    ? '<div class="it-thumb-wrap"><img class="it-thumb" src="' + escapeHtml(icon) + '" alt="' + escapeHtml(alt) + '" loading="lazy"></div>'
    : '';

  if (itActiveTab === "base") {
    const targetSock = itBaseSocketFilter === "all" ? 0 : Number(itBaseSocketFilter);
    const list = (itData.baseItems || []).filter(item => {
      if (itSubFilter !== "all" && item.category !== itSubFilter) return false;
      if (targetSock > 0 && item.maxSockets < targetSock) return false;
      return matchQuery(item.nameZh + " " + item.nameEn + " " + item.stats + " " + item.usage + " " + item.tier, item);
    });
    cardsHtml = list.map(item => {
      const s = Array.isArray(item.sockets) ? item.sockets : [item.maxSockets, item.maxSockets, item.maxSockets];
      const ilvlText = "ilvl 1–25: " + s[0] + "孔 · ilvl 26–40(普通牛): " + s[1] + "孔 · ilvl 41+: " + s[2] + "孔";
      const offText = typeof item.officialStats === "object" && item.officialStats
        ? (item.officialStats[currentLang] || item.officialStats.zhCN)
        : item.officialStats;
      const hasCustomBlock = /格挡\s*\d+%/.test(item.stats || "");
      const baseParts = offText
        ? String(offText).split(/\s*·\s*/).map(x => x.trim()).filter(p => p && !(hasCustomBlock && /^(?:基础格挡|基礎格擋|Base Block)/.test(p)))
        : ["需求力量 " + item.reqStr].concat(item.reqDex > 0 ? ["需求敏捷 " + item.reqDex] : []);
      baseParts.push("需求等级 " + item.reqLvl);
      const extraParts = String(item.stats || "")
        .split(/\s*(?:·|\|)\s*/)
        .map(x => x.trim())
        .filter(p => {
          if (!p) return false;
          if (offText && /^防\s*\d/.test(p)) return false;
          if (offText && /^攻速\s*\[/.test(p)) return false;
          if (/^ilvl\s*\d+/i.test(p) || /^\d+[–-]\d+/.test(p) || /^\d+\+\s*:/.test(p)) return false;
          if (/^(?:任何\s*ilvl\s*均)?(?:最多|全系最多|最大)?\s*\d+\s*孔$/.test(p)) return false;
          return true;
        });
      const combinedBaseStats = baseParts.concat(extraParts).join(" · ");
      return '<article class="it-card">' +
        '<div class="it-card-head">' +
          '<div class="it-card-title-row">' + renderItemThumb(item.icon, pickLangTitle(item)) +
          '<div data-no-sweep="1"><span class="it-card-title">' + escapeHtml(pickLangTitle(item)) + '</span><span class="it-card-en">' + escapeHtml(pickLangSub(item)) + '</span></div></div>' +
          '<div class="af-card-badges"><span class="rw-badge">' + escapeHtml(item.tier) + '</span></div>' +
        '</div>' +
        renderStatList(combinedBaseStats, "#9ad8ff", false) +
        renderStatList(ilvlText, "#ffd584", false) +
        '<div class="it-card-note">用途：' + escapeHtml(item.usage) + '</div>' +
      '</article>';
    }).join("");
  } else if (itActiveTab === "magicRare") {
    const list = (itData.magicRareGems || []).filter(item =>
      (itSubFilter === "all" || item.quality === itSubFilter) &&
      matchQuery(item.nameZh + " " + item.nameEn + " " + item.stats + " " + item.value + " " + item.slot, item)
    );
    cardsHtml = list.map(item =>
      '<article class="it-card it-' + escapeHtml(item.quality) + '">' +
        '<div class="it-card-head">' +
          '<div class="it-card-title-row">' + renderItemThumb(item.icon, pickLangTitle(item)) +
          '<div data-no-sweep="1"><span class="it-card-title">' + escapeHtml(pickLangTitle(item)) + '</span><span class="it-card-en">' + escapeHtml(pickLangSub(item)) + '</span></div></div>' +
          '<div class="af-card-badges"><span class="rw-badge">' + escapeHtml(item.slot) + '</span><span class="rw-badge ' + (item.quality === 'magic' ? 'af-badge-magic' : 'af-badge-rare') + '">' + (item.quality === 'magic' ? '魔法蓝装' : '亮金黄装') + '</span></div>' +
        '</div>' +
        renderStatList(item.stats, "", true) +
        '<div class="it-card-note"><img class="ui-chip-icon" src="/images/ui/coins_icon.webp" alt="">价值：' + escapeHtml(item.value) + '</div>' +
      '</article>'
    ).join("");
  } else if (itActiveTab === "set") {
    const list = (itData.setItems || []).filter(item => {
      const isGeneric = item.classZh.includes("通用");
      if (itSubFilter === "class" && isGeneric) return false;
      if (itSubFilter === "generic" && !isGeneric) return false;
      const pcs = (item.detail && item.detail.pieces) ? item.detail.pieces : [];
      const doneCount = pcs.filter(p => grailSetPieces.has(p.nameEn)).length;
      const isAllDone = pcs.length > 0 && doneCount === pcs.length;
      const hasTc87 = pcs.some(p => p.baseInfo && p.baseInfo.tc === 87);
      if (itGrailFilter === "todo" && isAllDone) return false;
      if (itGrailFilter === "done" && !isAllDone) return false;
      if (itGrailFilter === "tc87" && !hasTc87) return false;
      return matchQuery(item.nameZh + " " + item.nameEn + " " + item.classZh + " " + item.pieceList + " " + item.fullBonus + " " + item.usage, item);
    });
    cardsHtml = list.map(item => {
      const pcs = (item.detail && item.detail.pieces) ? item.detail.pieces : [];
      const doneCount = pcs.filter(p => grailSetPieces.has(p.nameEn)).length;
      const isAllDone = pcs.length > 0 && doneCount === pcs.length;
      return '<article class="it-card it-set' + (isAllDone ? ' grail-done' : '') + '" data-it-set="' + escapeHtml(item.id) + '">' +
        '<div class="it-card-head">' +
          '<div class="it-card-title-row">' +
            '<input type="checkbox" class="rw-check grail-set-check" data-grail-set="' + escapeHtml(item.id) + '" title="圣杯收集：勾选/取消整套" ' + (isAllDone ? 'checked' : '') + ' />' +
            renderItemThumb(item.icon, pickLangTitle(item)) +
            '<div data-no-sweep="1"><span class="it-card-title">' + escapeHtml(pickLangTitle(item)) + '</span><span class="it-card-en">' + escapeHtml(pickLangSub(item)) + '</span></div>' +
          '</div>' +
          '<div class="af-card-badges"><span class="rw-badge">' + escapeHtml(item.classZh) + '</span><span class="rw-badge ' + (isAllDone ? 'rw-badge-patch' : '') + '" data-grail-set-badge="' + escapeHtml(item.id) + '">' + doneCount + ' / ' + item.pieces + ' 件</span></div>' +
        '</div>' +
        '<div class="it-card-note">部件：' + escapeHtml(item.pieceList) + '</div>' +
        renderStatList(item.fullBonus, "#8af49f", true) +
        '<div class="it-card-note" style="display:flex;align-items:center;justify-content:space-between;gap:8px">' +
          '<span>定位：' + escapeHtml(item.usage) + '</span>' +
          '<button type="button" class="rw-detail-btn" style="flex:0 0 auto">查看部件详情</button>' +
        '</div>' +
      '</article>';
    }).join("");
  } else if (itActiveTab === "unique") {
    const list = (itData.uniqueItems || []).filter(item => {
      if (itSubFilter !== "all" && item.slot !== itSubFilter) return false;
      const isDone = grailUniques.has(item.nameEn);
      if (itGrailFilter === "todo" && isDone) return false;
      if (itGrailFilter === "done" && !isDone) return false;
      if (itGrailFilter === "tc87" && !(item.baseInfo && item.baseInfo.tc === 87)) return false;
      return matchQuery(item.nameZh + " " + item.nameEn + " " + item.stats + " " + item.note + " " + (item.tier || ""), item);
    });
    cardsHtml = list.map(item => {
      const isDone = grailUniques.has(item.nameEn);
      const baseStatsStr = item.baseInfo
        ? (currentLang === "zhTW" ? (item.baseInfo.baseStatsZhTW || item.baseInfo.baseStats) : currentLang === "enUS" ? (item.baseInfo.baseStatsEnUS || item.baseInfo.baseStats) : item.baseInfo.baseStats)
        : "";
      const baseNameStr = item.baseInfo
        ? ((currentLang === "enUS" ? "Base: " : "底材：") + (currentLang === "zhTW" ? item.baseInfo.baseZhTW : currentLang === "enUS" ? item.baseInfo.baseEnUS : item.baseInfo.baseZhCN))
        : "";
      const baseLine = item.baseInfo
        ? renderStatList(baseNameStr + (baseStatsStr ? " · " + baseStatsStr : ""), "#c4b6a0", false)
        : '';
      return '<article class="it-card it-unique' + (isDone ? ' grail-done' : '') + '">' +
        '<div class="it-card-head">' +
          '<div class="it-card-title-row">' +
            '<input type="checkbox" class="rw-check grail-unique-check" data-grail-unique="' + escapeHtml(item.nameEn) + '" title="圣杯收集：标记已收集" ' + (isDone ? 'checked' : '') + ' />' +
            renderItemThumb(item.icon, pickLangTitle(item)) +
            '<div data-no-sweep="1"><span class="it-card-title">' + escapeHtml(pickLangTitle(item)) + '</span><span class="it-card-en">' + escapeHtml(pickLangSub(item)) + '</span></div>' +
          '</div>' +
          '<div class="af-card-badges">' + (item.tier ? '<span class="rw-badge">' + escapeHtml(item.tier) + '</span>' : '') + '</div>' +
        '</div>' +
        baseLine +
        renderStatList(item.stats, "", false) +
        '<div class="it-card-note" style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">' +
          '<span>说明：' + escapeHtml(item.note) + '</span>' +
          '<span style="display:inline-flex;gap:6px;flex:0 0 auto">' +
            ((itData.uniqueUpgradeMeta && itData.uniqueUpgradeMeta[item.nameEn]) ? '<button type="button" class="rw-detail-btn" data-jump-upgrade="' + escapeHtml(item.nameEn) + '">升阶预览</button>' : '') +
            '<button type="button" class="rw-detail-btn" data-jump-drop="' + escapeHtml(item.nameEn) + '">查掉率</button>' +
          '</span>' +
        '</div>' +
      '</article>';
    }).join("");
  } else if (itActiveTab === "cube") {
    const list = (itData.cubeRecipes || []).filter(item =>
      matchQuery(item.title + " " + item.formula + " " + item.detail)
    );
    cardsHtml = list.map(item =>
      '<article class="it-card">' +
        '<div class="it-card-head"><span class="it-card-title" style="color:#88b3ff">' + escapeHtml(item.title) + '</span></div>' +
        '<div class="it-card-stats" style="color:#f5cf7b">' + escapeHtml(item.formula) + '</div>' +
        renderStatList(item.detail, "#d8cab5", false) +
      '</article>'
    ).join("");
  } else if (itActiveTab === "drops") {
    if (!dcData || !Array.isArray(dcData.sources)) {
      grid.innerHTML = '<div class="tz-empty">正在加载掉率计算器数据...</div>';
      return;
    }
    const uCodeMap = new Map();
    for (const code in (dcData.uniquePools || {})) {
      for (const u of dcData.uniquePools[code]) uCodeMap.set(u.nameEn, code);
    }
    const sCodeMap = new Map();
    for (const code in (dcData.setPools || {})) {
      for (const s of dcData.setPools[code]) sCodeMap.set(s.nameEn, code);
    }

    const allDropItems = [];
    if (itSubFilter === "all" || itSubFilter === "unique") {
      for (const u of (itData.uniqueItems || [])) {
        const c = uCodeMap.get(u.nameEn);
        if (c) allDropItems.push({ type: "unique", code: c, nameEn: u.nameEn, itemObj: u, icon: u.icon, badge: "暗金", color: "#e3bc6d" });
      }
    }
    if (itSubFilter === "all" || itSubFilter === "set") {
      for (const s of (itData.setItems || [])) {
        for (const p of ((s.detail && s.detail.pieces) || [])) {
          const c = sCodeMap.get(p.nameEn);
          if (c) allDropItems.push({ type: "set", code: c, nameEn: p.nameEn, itemObj: p, icon: p.icon || s.icon, badge: s.nameZh, color: "#67e87a" });
        }
      }
    }
    if (itSubFilter === "all" || itSubFilter === "rune") {
      for (const r of (rwRunes || [])) {
        const rCode = "r" + String(r.number).padStart(2, "0");
        allDropItems.push({ type: "rune", code: rCode, nameEn: r.name, itemObj: r, icon: r.icon, badge: "#" + r.number + " 符文", color: "#ff9b42" });
      }
    }
    if (itSubFilter === "all" || itSubFilter === "special") {
      for (const sp of (dcData.specialDrops || [])) {
        allDropItems.push({ type: "special", code: sp.code, nameEn: sp.nameEn, itemObj: sp, icon: sp.icon, badge: "首领专属", color: "#e284db" });
      }
    }

    const filteredItems = allDropItems.filter(entry =>
      matchQuery((entry.itemObj.nameZh || entry.itemObj.zhName || "") + " " + entry.nameEn + " " + entry.badge, entry.itemObj)
    );

    const formatOdds = (p) => {
      if (p <= 0) return null;
      const oneIn = Math.max(1, Math.round(1 / p));
      const pct = (p * 100) >= 1 ? (p * 100).toFixed(2) + "%" : (p * 100).toFixed(4) + "%";
      return { oneIn, pct };
    };

    if (dcMode === "source") {
      const src = dcData.sources.find(s => s.id === dcSourceId) || dcData.sources[0];
      const srcName = currentLang === "zhTW" ? (src.nameTw || src.nameZh) : currentLang === "enUS" ? src.nameEn : src.nameZh;
      const ranked = [];
      for (const entry of filteredItems) {
        const prob = computeSingleItemDropChance(src, entry.type, entry.code, entry.nameEn, dcMf, dcPlayers);
        if (prob > 0) ranked.push({ entry, prob });
      }
      ranked.sort((a, b) => b.prob - a.prob);
      cardsHtml = ranked.slice(0, 120).map(({ entry, prob }) => {
        const odds = formatOdds(prob);
        return '<article class="it-card it-' + escapeHtml(entry.type) + '">' +
          '<div class="it-card-head">' +
            '<div class="it-card-title-row">' +
              renderItemThumb(entry.icon, pickLangTitle(entry.itemObj)) +
              '<div data-no-sweep="1"><span class="it-card-title" style="color:' + entry.color + '">' + escapeHtml(pickLangTitle(entry.itemObj)) + '</span><span class="it-card-en">' + escapeHtml(pickLangSub(entry.itemObj)) + '</span></div>' +
            '</div>' +
            '<div class="af-card-badges"><span class="rw-badge">' + escapeHtml(entry.badge) + '</span></div>' +
          '</div>' +
          renderStatList("目标首领：" + srcName + " (mlvl " + src.mlvl + ") · 单次击杀掉率：1 / " + odds.oneIn.toLocaleString() + " (" + odds.pct + ")", "#9ad8ff", false) +
          '<div class="it-card-note" style="display:flex;align-items:center;justify-content:space-between;gap:8px">' +
            '<span>当前参数：MF ' + dcMf + '% · /players ' + dcPlayers + '</span>' +
            '<button type="button" class="rw-detail-btn" data-jump-drop="' + escapeHtml(entry.nameEn) + '">对比全部首领</button>' +
          '</div>' +
        '</article>';
      }).join("");
    } else {
      const targetList = filteredItems.slice(0, 24);
      cardsHtml = targetList.map(entry => {
        const srcRanks = [];
        for (const src of dcData.sources) {
          const prob = computeSingleItemDropChance(src, entry.type, entry.code, entry.nameEn, dcMf, dcPlayers);
          if (prob > 0) srcRanks.push({ src, prob });
        }
        srcRanks.sort((a, b) => b.prob - a.prob);
        const topLines = srcRanks.slice(0, 6).map((r, idx) => {
          const nm = currentLang === "zhTW" ? (r.src.nameTw || r.src.nameZh) : currentLang === "enUS" ? r.src.nameEn : r.src.nameZh;
          const odds = formatOdds(r.prob);
          return "#" + (idx + 1) + " " + nm + "：1 / " + odds.oneIn.toLocaleString() + " (" + odds.pct + ")";
        }).join(" · ");
        return '<article class="it-card it-' + escapeHtml(entry.type) + '">' +
          '<div class="it-card-head">' +
            '<div class="it-card-title-row">' +
              renderItemThumb(entry.icon, pickLangTitle(entry.itemObj)) +
              '<div data-no-sweep="1"><span class="it-card-title" style="color:' + entry.color + '">' + escapeHtml(pickLangTitle(entry.itemObj)) + '</span><span class="it-card-en">' + escapeHtml(pickLangSub(entry.itemObj)) + '</span></div>' +
            '</div>' +
            '<div class="af-card-badges"><span class="rw-badge">' + escapeHtml(entry.badge) + '</span></div>' +
          '</div>' +
          renderStatList(topLines || "当前难度无直接掉落", "#8af49f", false) +
          '<div class="it-card-note">最佳刷取排行（MF ' + dcMf + '% · /players ' + dcPlayers + '，共 ' + srcRanks.length + ' 个来源可掉落）</div>' +
        '</article>';
      }).join("");
    }
  }

  grid.innerHTML = cardsHtml || '<div class="tz-empty">未找到匹配的物品资料</div>';

  grid.querySelectorAll("[data-jump-drop]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const targetName = btn.dataset.jumpDrop;
      itActiveTab = "drops";
      itSubFilter = "all";
      dcMode = "item";
      itSearchQuery = targetName;
      const inp = document.getElementById("it-search-input");
      const clr = document.getElementById("it-search-clear");
      if (inp) inp.value = targetName;
      if (clr) clr.style.display = "block";
      document.querySelectorAll("#it-subtabs [data-it-tab]").forEach(b => b.classList.toggle("active", b.dataset.itTab === "drops"));
      document.querySelectorAll("#dc-mode-chips [data-dc-mode]").forEach(b => b.classList.toggle("active", b.dataset.dcMode === "item"));
      const srcRow = document.getElementById("dc-source-row");
      if (srcRow) srcRow.style.display = "none";
      renderItSubfilters();
      renderItemsGrid();
    });
  });

  grid.querySelectorAll("[data-jump-upgrade]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      cubeUpTargetName = btn.dataset.jumpUpgrade;
      itActiveTab = "cube";
      itSubFilter = "all";
      document.querySelectorAll("#it-subtabs [data-it-tab]").forEach(b => b.classList.toggle("active", b.dataset.itTab === "cube"));
      const upSel = document.getElementById("cube-up-select");
      if (upSel) upSel.value = cubeUpTargetName;
      renderCubeUpgrader();
      renderItSubfilters();
      renderItemsGrid();
    });
  });

  if (itActiveTab === "unique") {
    grid.querySelectorAll("[data-grail-unique]").forEach(cb => {
      cb.addEventListener("change", (e) => {
        const key = e.target.dataset.grailUnique;
        const checked = e.target.checked;
        if (checked) grailUniques.add(key);
        else grailUniques.delete(key);
        saveGrailState();
        renderGrailSummary();
        if (itGrailFilter === "todo" || itGrailFilter === "done") {
          renderItemsGrid();
        } else {
          const card = e.target.closest(".it-card");
          if (card) card.classList.toggle("grail-done", checked);
        }
      });
    });
  }

  if (itActiveTab === "set") {
    grid.querySelectorAll("[data-grail-set]").forEach(cb => {
      cb.addEventListener("click", (e) => e.stopPropagation());
      cb.addEventListener("change", (e) => {
        const setId = e.target.dataset.grailSet;
        const checked = e.target.checked;
        const setItem = (itData.setItems || []).find(s => s.id === setId);
        const pcs = (setItem && setItem.detail && setItem.detail.pieces) ? setItem.detail.pieces : [];
        pcs.forEach(p => {
          if (checked) grailSetPieces.add(p.nameEn);
          else grailSetPieces.delete(p.nameEn);
        });
        saveGrailState();
        renderGrailSummary();
        if (itGrailFilter === "todo" || itGrailFilter === "done") {
          renderItemsGrid();
        } else {
          const card = e.target.closest(".it-card");
          if (card) card.classList.toggle("grail-done", checked);
          const badge = grid.querySelector('[data-grail-set-badge="' + setId + '"]');
          if (badge && setItem) {
            badge.textContent = (checked ? pcs.length : 0) + " / " + setItem.pieces + " 件";
            badge.classList.toggle("rw-badge-patch", checked);
          }
        }
      });
    });
    grid.querySelectorAll("[data-it-set]").forEach(card => {
      card.addEventListener("click", () => openSetDetail(card.dataset.itSet));
    });
  }
}

function openSetDetail(setId) {
  const setItem = (itData?.setItems || []).find(s => s.id === setId);
  if (!setItem) return;
  const modal = document.getElementById("it-set-modal");
  document.getElementById("it-set-modal-title").textContent = pickLangTitle(setItem);
  document.getElementById("it-set-modal-en").textContent = pickLangSub(setItem) + " · " + setItem.classZh + "（共 " + setItem.pieces + " 件）";
  document.getElementById("it-set-modal-meta").textContent = setItem.usage;

  const detail = setItem.detail;
  if (!detail) {
    const fbParts = String(setItem.fullBonus || "").split(/\s*(?:·|\|)\s*/).map(x => x.trim()).filter(Boolean);
    document.getElementById("it-set-modal-body").innerHTML =
      '<div class="it-set-bonus-box"><h4 class="it-set-bonus-title">全套加成</h4><ul class="it-set-bonus-list">' + fbParts.map(x => '<li>★ ' + escapeHtml(x) + '</li>').join("") + '</ul></div>';
    if (typeof applyDomTraditionalSweep === "function") applyDomTraditionalSweep();
    modal.classList.add("open");
    return;
  }

  const piecesHtml = (detail.pieces || []).map(p => {
    const isPieceDone = grailSetPieces.has(p.nameEn);
    const pBaseStr = p.baseInfo
      ? (currentLang === "zhTW" ? (p.baseInfo.baseStatsZhTW || p.baseInfo.baseStats) : currentLang === "enUS" ? (p.baseInfo.baseStatsEnUS || p.baseInfo.baseStats) : p.baseInfo.baseStats)
      : "";
    const reqLvlLabel = currentLang === "zhTW" ? ("需求等級 " + p.reqLvl) : currentLang === "enUS" ? ("Req Lvl " + p.reqLvl) : ("需求等级 " + p.reqLvl);
    const rawBaseParts = pBaseStr ? String(pBaseStr).split(/\s*·\s*/).filter(Boolean) : [];
    if (p.reqLvl && !rawBaseParts.some(x => /需求等[级級]|Req Lvl/i.test(x))) {
      rawBaseParts.splice(Math.min(2, rawBaseParts.length), 0, reqLvlLabel);
    }
    const pBaseLines = rawBaseParts.map(line => '<li style="color:#c4b6a0" data-no-sweep="1">' + escapeHtml(line) + '</li>').join("");
    const baseLines = pBaseLines + (p.stats || []).flatMap(line => String(line).split(/\s*·\s*/)).filter(Boolean).map(line => '<li>' + escapeHtml(line) + '</li>').join("");
    const greenLines = Array.isArray(p.setPieceBonus) && p.setPieceBonus.length > 0
      ? '<ul class="it-set-piece-bonus">' + p.setPieceBonus.flatMap(b => String(b).split(/\s*·\s*/)).filter(Boolean).map(b => '<li>+ ' + escapeHtml(b) + '</li>').join("") + '</ul>'
      : "";
    const pieceImg = p.icon
      ? '<div class="it-thumb-wrap" style="width:40px;height:40px"><img class="it-thumb" src="' + escapeHtml(p.icon) + '" alt="' + escapeHtml(p.nameZh) + '" loading="lazy"></div>'
      : '';
    return '<div class="it-set-piece' + (isPieceDone ? ' grail-done' : '') + '">' +
      '<div class="it-set-piece-head">' +
        '<div class="it-card-title-row">' +
          '<input type="checkbox" class="rw-check grail-piece-check" data-grail-piece="' + escapeHtml(p.nameEn) + '" title="圣杯收集：标记该部件已收集" ' + (isPieceDone ? 'checked' : '') + ' />' +
          pieceImg +
          '<div data-no-sweep="1"><span class="it-set-piece-title">' + escapeHtml(pickLangTitle(p)) + '</span> <span class="it-set-piece-sub">(' + escapeHtml(pickLangSub(p)) + ')</span></div>' +
        '</div>' +
        '<span class="rw-badge">' + escapeHtml(p.slotZh) + '</span>' +
      '</div>' +
      '<ul class="it-set-piece-stats">' + baseLines + '</ul>' +
      greenLines +
    '</div>';
  }).join("");

  const partialHtml = Array.isArray(detail.partialBonuses) && detail.partialBonuses.length > 0
    ? '<div class="it-set-bonus-box" style="border-color:rgba(87,219,112,0.3)">' +
        '<h4 class="it-set-bonus-title" style="color:#67e87a">部分套装凑齐加成（绿色通用效果）</h4>' +
        '<ul class="it-set-bonus-list" style="color:#8af49f">' +
          detail.partialBonuses.map(pb => (pb.stats || []).flatMap(st => String(st).split(/\s*·\s*/)).filter(Boolean).map(st => '<li><strong>【' + pb.count + ' 件】</strong> ' + escapeHtml(st) + '</li>').join("")).join("") +
        '</ul>' +
      '</div>'
    : "";

  const fullHtml = '<div class="it-set-bonus-box">' +
    '<h4 class="it-set-bonus-title">全套齐备加成（' + setItem.pieces + ' 件套完整激活）</h4>' +
    '<ul class="it-set-bonus-list">' +
      (detail.fullBonuses || []).flatMap(line => String(line).split(/\s*·\s*/)).filter(Boolean).map(line => '<li>★ ' + escapeHtml(line) + '</li>').join("") +
    '</ul>' +
  '</div>';

  const modalBody = document.getElementById("it-set-modal-body");
  modalBody.innerHTML =
    '<div class="it-set-pieces-grid">' + piecesHtml + '</div>' +
    partialHtml +
    fullHtml;

  modalBody.querySelectorAll("[data-grail-piece]").forEach(cb => {
    cb.addEventListener("change", (e) => {
      const pieceKey = e.target.dataset.grailPiece;
      const checked = e.target.checked;
      if (checked) grailSetPieces.add(pieceKey);
      else grailSetPieces.delete(pieceKey);
      saveGrailState();
      renderGrailSummary();
      const pieceCard = e.target.closest(".it-set-piece");
      if (pieceCard) pieceCard.classList.toggle("grail-done", checked);

      const pcs = detail.pieces || [];
      const doneCount = pcs.filter(p => grailSetPieces.has(p.nameEn)).length;
      const isAllDone = pcs.length > 0 && doneCount === pcs.length;
      const outerCard = document.querySelector('[data-it-set="' + setId + '"]');
      if (outerCard) {
        outerCard.classList.toggle("grail-done", isAllDone);
        const outerCb = outerCard.querySelector("[data-grail-set]");
        if (outerCb) outerCb.checked = isAllDone;
        const outerBadge = outerCard.querySelector("[data-grail-set-badge]");
        if (outerBadge) {
          outerBadge.textContent = doneCount + " / " + setItem.pieces + " 件";
          outerBadge.classList.toggle("rw-badge-patch", isAllDone);
        }
      }
    });
  });

  if (typeof applyDomTraditionalSweep === "function") applyDomTraditionalSweep();
  modal.classList.add("open");
}

function closeSetDetail() {
  document.getElementById("it-set-modal").classList.remove("open");
}

function setupItemsEvents() {
  document.querySelectorAll("#it-subtabs [data-it-tab]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#it-subtabs [data-it-tab]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      itActiveTab = btn.dataset.itTab;
      itSubFilter = "all";
      renderItSubfilters();
      renderItemsGrid();
    });
  });

  document.querySelectorAll("#it-grail-chips [data-grail-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#it-grail-chips [data-grail-filter]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      itGrailFilter = btn.dataset.grailFilter;
      renderItemsGrid();
    });
  });

  const exportBtn = document.getElementById("grail-export-btn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const payload = {
        version: 1,
        exportedAt: new Date().toISOString(),
        uniques: [...grailUniques],
        setPieces: [...grailSetPieces],
        runewords: [...rwCompleted]
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "d2r-holy-grail-" + new Date().toISOString().slice(0, 10) + ".json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  const importBtn = document.getElementById("grail-import-btn");
  const importFile = document.getElementById("grail-import-file");
  if (importBtn && importFile) {
    importBtn.addEventListener("click", () => importFile.click());
    importFile.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(String(reader.result || "{}"));
          if (Array.isArray(data.uniques)) grailUniques = new Set(data.uniques);
          if (Array.isArray(data.setPieces)) grailSetPieces = new Set(data.setPieces);
          saveGrailState();
          renderGrailSummary();
          renderItemsGrid();
          if (Array.isArray(data.runewords)) {
            rwCompleted = new Set(data.runewords);
            saveRwCompleted();
            if (typeof renderRunewordsAll === "function") renderRunewordsAll();
          }
        } catch (err) {
          alert("导入圣杯存档失败：JSON 格式无效");
        }
        importFile.value = "";
      };
      reader.readAsText(file);
    });
  }

  const resetBtn = document.getElementById("grail-reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (grailUniques.size === 0 && grailSetPieces.size === 0) return;
      if (!confirm("确定要清空所有暗金与绿色套装的圣杯收集进度吗？")) return;
      grailUniques.clear();
      grailSetPieces.clear();
      saveGrailState();
      renderGrailSummary();
      renderItemsGrid();
    });
  }

  document.querySelectorAll("#it-base-sockets-chips [data-it-sock]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#it-base-sockets-chips [data-it-sock]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      itBaseSocketFilter = btn.dataset.itSock;
      renderItemsGrid();
    });
  });

  document.querySelectorAll("#dc-mode-chips [data-dc-mode]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#dc-mode-chips [data-dc-mode]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      dcMode = btn.dataset.dcMode;
      const srcRow = document.getElementById("dc-source-row");
      if (srcRow) srcRow.style.display = dcMode === "source" ? "flex" : "none";
      renderItemsGrid();
    });
  });

  const dcSrcSelect = document.getElementById("dc-source-select");
  if (dcSrcSelect) {
    dcSrcSelect.addEventListener("change", (e) => {
      dcSourceId = e.target.value;
      renderItemsGrid();
    });
  }

  const dcSyncTzBtn = document.getElementById("dc-sync-tz-btn");
  if (dcSyncTzBtn) {
    dcSyncTzBtn.addEventListener("click", () => {
      dcMode = "source";
      document.querySelectorAll("#dc-mode-chips [data-dc-mode]").forEach(b => b.classList.toggle("active", b.dataset.dcMode === "source"));
      const srcRow = document.getElementById("dc-source-row");
      if (srcRow) srcRow.style.display = "flex";
      syncDcSourceToCurrentTz();
      renderItemsGrid();
    });
  }

  const tzJumpDropsBtn = document.getElementById("tz-jump-drops-btn");
  if (tzJumpDropsBtn) {
    tzJumpDropsBtn.addEventListener("click", () => {
      switchMainTab("items");
      itActiveTab = "drops";
      itSubFilter = "all";
      dcMode = "source";
      document.querySelectorAll("#it-subtabs [data-it-tab]").forEach(b => b.classList.toggle("active", b.dataset.itTab === "drops"));
      document.querySelectorAll("#dc-mode-chips [data-dc-mode]").forEach(b => b.classList.toggle("active", b.dataset.dcMode === "source"));
      const srcRow = document.getElementById("dc-source-row");
      if (srcRow) srcRow.style.display = "flex";
      syncDcSourceToCurrentTz();
      renderItSubfilters();
      renderItemsGrid();
    });
  }

  const dcMfInput = document.getElementById("dc-mf-input");
  if (dcMfInput) {
    dcMfInput.addEventListener("input", () => {
      dcMf = Math.min(1200, Math.max(0, Number(dcMfInput.value) || 0));
      document.querySelectorAll("#dc-mf-presets [data-dc-mf]").forEach(b => b.classList.toggle("active", Number(b.dataset.dcMf) === dcMf));
      renderItemsGrid();
    });
  }

  document.querySelectorAll("#dc-mf-presets [data-dc-mf]").forEach(btn => {
    btn.addEventListener("click", () => {
      dcMf = Number(btn.dataset.dcMf);
      if (dcMfInput) dcMfInput.value = String(dcMf);
      document.querySelectorAll("#dc-mf-presets [data-dc-mf]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderItemsGrid();
    });
  });

  document.querySelectorAll("#dc-players-chips [data-dc-players]").forEach(btn => {
    btn.addEventListener("click", () => {
      dcPlayers = Number(btn.dataset.dcPlayers);
      document.querySelectorAll("#dc-players-chips [data-dc-players]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderItemsGrid();
    });
  });

  const searchInput = document.getElementById("it-search-input");
  const searchClear = document.getElementById("it-search-clear");
  searchInput.addEventListener("input", (e) => {
    itSearchQuery = e.target.value.trim();
    searchClear.style.display = itSearchQuery ? "block" : "none";
    renderItemsGrid();
  });
  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    itSearchQuery = "";
    searchClear.style.display = "none";
    renderItemsGrid();
    searchInput.focus();
  });

  loadItemsCatalog();

  const setModal = document.getElementById("it-set-modal");
  document.getElementById("it-set-modal-close").addEventListener("click", closeSetDetail);
  document.getElementById("it-set-modal-close-btn").addEventListener("click", closeSetDetail);
  setModal.addEventListener("click", (e) => {
    if (e.target === setModal) closeSetDetail();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && setModal.classList.contains("open")) {
      closeSetDetail();
    }
  });
  const hudTzPill = document.getElementById("hud-tz-pill");
  const hudDcPill = document.getElementById("hud-dc-pill");
  if (hudTzPill) hudTzPill.addEventListener("click", () => switchMainTab("terror"));
  if (hudDcPill) hudDcPill.addEventListener("click", () => switchMainTab("dclone"));

  const backToTopBtn = document.getElementById("back-to-top-btn");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      backToTopBtn.classList.toggle("visible", window.scrollY > 360);
    }, { passive: true });
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const authDlg = document.getElementById("auth-dialog");
    if (authDlg && authDlg.open) return;
    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
    if (tag === "input" || tag === "textarea" || tag === "select") return;
    if (e.key >= "1" && e.key <= "6") {
      const idx = Number(e.key) - 1;
      if (MAIN_TABS[idx]) {
        e.preventDefault();
        switchMainTab(MAIN_TABS[idx].id);
      }
      return;
    }
    if (e.key === "/") {
      e.preventDefault();
      const searchMap = {
        terror: "tz-search-input",
        runewords: "rw-search",
        affixes: "af-search",
        items: "it-search"
      };
      if (activeMainTab === "terror") {
        const tzBody = document.getElementById("tz-directory-body");
        const tzToggle = document.getElementById("tz-toggle-panel");
        if (tzBody && tzBody.style.display === "none" && tzToggle) {
          tzToggle.click();
        }
      }
      const targetId = searchMap[activeMainTab];
      const el = targetId ? document.getElementById(targetId) : null;
      if (el) {
        el.focus();
        el.select();
      }
    }
  });
}

/* 八大职业技能树与加点模拟器（含 3.4 新职业术士 Warlock） */
const SK_STORAGE_KEY = "d2r-skill-builds-v1";
const SK_MAX_POINTS = 110;
let skClasses = [];
let skActiveClassId = "war";
let skSelectedSkillKey = null;
let skBonusAll = 0;
let skBonusByTab = { 1: 0, 2: 0, 3: 0 };
let skBonusBySkill = {};
let skBonusFire = 0;
let skBonusClassId = "";
let skBuilds = {};

function getSkillTreeBonusForSkill(sk) {
  if (!sk) return skBonusAll;
  const sameClass = !skBonusClassId || skBonusClassId === skActiveClassId;
  let extra = sameClass ? ((skBonusByTab[sk.page] || 0) + (skBonusBySkill[sk.key] || 0)) : 0;
  if (sameClass && skBonusFire > 0 && sk.dmg && sk.dmg.type === "fire" && !(skActiveClassId === "sor" && sk.page === 1)) {
    extra += skBonusFire;
  }
  return skBonusAll + extra;
}

function renderSkSyncedExtraBadge() {
  const el = document.getElementById("sk-synced-extra-badge");
  if (!el) return;
  const clsObj = getActiveClassObj();
  if (!clsObj || (skBonusClassId && skBonusClassId !== skActiveClassId)) {
    el.style.display = "none";
    return;
  }
  const parts = [];
  (clsObj.tabs || []).forEach(t => {
    const v = skBonusByTab[t.page] || 0;
    if (v > 0) parts.push(t.zhCN + " +" + v);
  });
  if (skBonusFire > 0) parts.push("火焰技能 +" + skBonusFire);
  Object.entries(skBonusBySkill || {}).forEach(([k, v]) => {
    if (v > 0) {
      const s = clsObj.skills.find(x => x.key === k);
      parts.push((s ? s.nameZh : k) + " +" + v);
    }
  });
  if (parts.length) {
    el.style.display = "inline-block";
    el.textContent = "已同步分系/单技能：" + parts.join(" · ");
  } else {
    el.style.display = "none";
  }
}

function loadSkBuilds() {
  try {
    const raw = localStorage.getItem(SK_STORAGE_KEY);
    if (raw) skBuilds = JSON.parse(raw) || {};
  } catch (e) {
    skBuilds = {};
  }
}

function saveSkBuilds() {
  try {
    localStorage.setItem(SK_STORAGE_KEY, JSON.stringify(skBuilds));
    if (!window.__cloudApplyingRemote) {
      localStorage.setItem("d2r-builds-local-updated-at", new Date().toISOString());
      if (typeof scheduleCloudSync === "function") scheduleCloudSync();
    }
  } catch (e) {}
}

function getClassBuild(classId) {
  if (!skBuilds[classId]) skBuilds[classId] = {};
  return skBuilds[classId];
}

function getActiveClassObj() {
  return skClasses.find(c => c.id === skActiveClassId) || skClasses[0] || null;
}

function getClassTotalPoints(classId) {
  const b = skBuilds[classId] || {};
  let sum = 0;
  for (const k in b) sum += Number(b[k] || 0);
  return sum;
}

function computeScaledValue(arr, hitShift, lvl) {
  if (!Array.isArray(arr) || lvl <= 0) return 0;
  let val = Number(arr[0] || 0);
  const l1 = Math.max(0, Math.min(lvl - 1, 7));
  const l2 = Math.max(0, Math.min(lvl - 8, 8));
  const l3 = Math.max(0, Math.min(lvl - 16, 6));
  const l4 = Math.max(0, Math.min(lvl - 22, 6));
  const l5 = Math.max(0, lvl - 28);
  val += l1 * Number(arr[1] || 0) + l2 * Number(arr[2] || 0) + l3 * Number(arr[3] || 0) + l4 * Number(arr[4] || 0) + l5 * Number(arr[5] || 0);
  const shift = typeof hitShift === "number" ? hitShift : 8;
  return Math.round((val * Math.pow(2, shift)) / 256 * 10) / 10;
}

function computeSkillMana(sk, lvl) {
  if (!sk || !sk.mana || lvl <= 0) return 0;
  const raw = (sk.mana.base + (lvl - 1) * sk.mana.lvl) * Math.pow(2, sk.mana.shift) / 256;
  return Math.max(sk.mana.min || 0, Math.round(raw * 10) / 10);
}

function computeSkillDamage(sk, clsObj, build, lvl) {
  if (!sk || !sk.dmg || lvl <= 0) return null;
  const baseMin = computeScaledValue(sk.dmg.min, sk.dmg.hitShift, lvl);
  const baseMax = computeScaledValue(sk.dmg.max, sk.dmg.hitShift, lvl);
  let synPct = 0;
  if (Array.isArray(sk.dmgSynergies)) {
    for (const syn of sk.dmgSynergies) {
      const pts = Number(build[syn.skill] || 0);
      synPct += pts * Number(syn.pct || 0);
    }
  }
  const mult = 1 + synPct / 100;
  return {
    type: sk.dmg.type,
    min: Math.round(baseMin * mult),
    max: Math.round(baseMax * mult),
    synPct
  };
}

function ensureSkillPrereqs(clsObj, build, sk, budgetRem) {
  let needed = 0;
  const toActivate = [];
  const visited = new Set();
  function walk(s) {
    if (!s || visited.has(s.key)) return;
    visited.add(s.key);
    for (const reqKey of (s.reqs || [])) {
      const reqSk = clsObj.skills.find(x => x.key === reqKey);
      if (reqSk) {
        walk(reqSk);
        if (!build[reqSk.key]) {
          needed += 1;
          toActivate.push(reqSk.key);
        }
      }
    }
  }
  walk(sk);
  if (needed > budgetRem) return -1;
  for (const k of toActivate) build[k] = 1;
  return needed;
}

function canRemoveSkillPoint(clsObj, build, sk) {
  const cur = Number(build[sk.key] || 0);
  if (cur <= 0) return false;
  if (cur > 1) return true;
  for (const other of clsObj.skills) {
    if (Number(build[other.key] || 0) > 0 && (other.reqs || []).includes(sk.key)) {
      return false;
    }
  }
  return true;
}

function modifySkillPoint(skillKey, delta) {
  const clsObj = getActiveClassObj();
  if (!clsObj) return;
  const sk = clsObj.skills.find(s => s.key === skillKey);
  if (!sk) return;
  const build = getClassBuild(clsObj.id);

  if (delta > 0) {
    let used = getClassTotalPoints(clsObj.id);
    let rem = SK_MAX_POINTS - used;
    if (rem <= 0) return;
    const cur = Number(build[sk.key] || 0);
    if (cur >= 20) return;
    const preSpent = ensureSkillPrereqs(clsObj, build, sk, rem - 1);
    if (preSpent < 0) return;
    rem -= preSpent;
    const add = Math.min(delta, 20 - cur, rem);
    if (add > 0) {
      build[sk.key] = cur + add;
    }
  } else if (delta < 0) {
    let steps = Math.abs(delta);
    while (steps > 0 && canRemoveSkillPoint(clsObj, build, sk)) {
      build[sk.key] = Number(build[sk.key] || 0) - 1;
      if (build[sk.key] <= 0) delete build[sk.key];
      steps -= 1;
    }
  }

  saveSkBuilds();
  renderSkillsAll();
}

function pickSkLang(obj, zhKey, twKey, enKey) {
  if (!obj) return "";
  if (currentLang === "zhTW") return obj[twKey] || obj[zhKey] || "";
  if (currentLang === "enUS") return obj[enKey] || obj[zhKey] || "";
  return obj[zhKey] || "";
}

function renderSkillsClassTabs() {
  const wrap = document.getElementById("sk-class-tabs");
  if (!wrap || !skClasses.length) return;

  if (wrap.querySelectorAll("[data-sk-class]").length !== skClasses.length) {
    wrap.innerHTML = skClasses.map(cls => {
      const badge34 = cls.isNew34 ? ' <span class="rw-badge rw-badge-patch" style="font-size:10px;padding:1px 4px">3.4</span>' : '';
      return '<button type="button" class="sk-class-btn" data-sk-class="' + escapeHtml(cls.id) + '">' +
        '<img class="sk-class-avatar" src="' + escapeHtml(cls.icon) + '" alt="" />' +
        '<div class="sk-class-meta" data-no-sweep="1">' +
          '<div class="sk-class-name"><span class="sk-cls-title"></span>' + badge34 + '</div>' +
          '<div class="sk-class-pts">0 / 110</div>' +
        '</div>' +
      '</button>';
    }).join("");

    wrap.querySelectorAll("[data-sk-class]").forEach(btn => {
      btn.addEventListener("click", () => {
        const nextCid = btn.dataset.skClass;
        if (nextCid !== skActiveClassId) {
          if (typeof savePaperdollState === "function") savePaperdollState(skActiveClassId);
          skActiveClassId = nextCid;
          bpManualOverride = false;
          if (typeof loadPaperdollStateForClass === "function") loadPaperdollStateForClass(skActiveClassId);
        }
        const clsObj = getActiveClassObj();
        skSelectedSkillKey = null;
        skHoveredSkillKey = null;
        renderSkillsAll();
      });
    });
  }

  wrap.querySelectorAll("[data-sk-class]").forEach(btn => {
    const cid = btn.dataset.skClass;
    const cls = skClasses.find(c => c.id === cid);
    btn.classList.toggle("active", cid === skActiveClassId);
    const titleEl = btn.querySelector(".sk-cls-title");
    if (titleEl && cls) titleEl.textContent = pickSkLang(cls, "nameZh", "nameTw", "nameEn");
    const ptsEl = btn.querySelector(".sk-class-pts");
    if (ptsEl) ptsEl.textContent = getClassTotalPoints(cid) + " / " + SK_MAX_POINTS;
  });
}

const SK_NATIVE_UI_ICONS = {
  "Summon Goatman": "/images/ui/khazra.webp",
  "Summon Tainted": "/images/ui/tainted.webp",
  "Summon Defiler": "/images/ui/defiler.webp",
  "Bind Demon": "/images/ui/binddemon.webp",
  "Valkyrie": "/images/ui/valkarieicon.webp",
  "Raise Skeleton": "/images/ui/skeletonicon.webp",
  "Skeleton Mastery": "/images/ui/skeletonicon.webp",
  "Raise Skeletal Mage": "/images/ui/skeletonmageicon.webp",
  "Clay Golem": "/images/ui/golemicon.webp",
  "Golem Mastery": "/images/ui/earthgolumicon.webp",
  "BloodGolem": "/images/ui/bloodgolumicon.webp",
  "IronGolem": "/images/ui/metalgolumicon.webp",
  "FireGolem": "/images/ui/f_elementicon.webp",
  "Revive": "/images/ui/revivedicon.webp",
  "Raven": "/images/ui/raven.webp",
  "Summon Spirit Wolf": "/images/ui/wolf.webp",
  "Summon Fenris": "/images/ui/wolf.webp",
  "Wearwolf": "/images/ui/wolf.webp",
  "Summon Grizzly": "/images/ui/bear.webp",
  "Wearbear": "/images/ui/bear.webp",
  "Oak Sage": "/images/ui/oaksage.webp",
  "Heart of Wolverine": "/images/ui/heartofwolverine.webp",
  "Spirit of Barbs": "/images/ui/spiritofbarbs.webp",
  "Plague Poppy": "/images/ui/plaguepoppy.webp",
  "Cycle of Life": "/images/ui/cycleoflife.webp",
  "Vines": "/images/ui/vines.webp",
  "Shadow Warrior": "/images/ui/shadowassassin.webp",
  "Shadow Master": "/images/ui/shadowassassin.webp"
};

const SK_ELEM_ICONS = {
  fire: { src: "/images/ui/f_elementicon.webp", cls: "elem-fire" },
  cold: { src: "/images/ui/i_elementicon.webp", cls: "elem-cold" },
  ltng: { src: "/images/ui/l_elementicon.webp", cls: "elem-ltng" },
  pois: { src: "/images/ui/p_elementicon.webp", cls: "elem-pois" }
};

let skHoveredSkillKey = null;
let skTreeResizeObserver = null;
let skTreeDrawRaf = 0;

function getSkillNodeIconHtml(clsId, sk) {
  if (sk && sk.icon) {
    return '<span class="sk-icon-frame is-hd"><img class="sk-node-icon-img" src="' + escapeHtml(sk.icon) + '" alt="" loading="lazy" /></span>';
  }
  const nativeSrc = SK_NATIVE_UI_ICONS[sk.key];
  if (nativeSrc) {
    return '<span class="sk-icon-frame is-native"><img class="sk-node-icon-img" src="' + nativeSrc + '" alt="" loading="lazy" /></span>';
  }
  const elemType = sk.dmg && sk.dmg.type ? String(sk.dmg.type).toLowerCase() : "";
  if (SK_ELEM_ICONS[elemType]) {
    const info = SK_ELEM_ICONS[elemType];
    return '<span class="sk-icon-frame is-elem ' + info.cls + '"><img class="sk-node-icon-img is-elem-img" src="' + info.src + '" alt="" loading="lazy" /></span>';
  }
  // Minimal semantic D2R category emblem (magic / aura / curse / passive / combat)
  let glyphClass = "cat-combat";
  let svgPath = '<path d="M14.5 3.5l2 2-7.8 7.8 1.5 1.5-1.2 1.2-2.2-2.2-2.3 2.3-1.2-1.2 2.3-2.3-2.2-2.2 1.2-1.2 1.5 1.5z"/>';
  if (elemType === "mag" || (clsId === "war" && sk.page === 3)) {
    glyphClass = "cat-magic";
    svgPath = '<path d="M10 2.5l2.1 5.4 5.4 2.1-5.4 2.1L10 17.5l-2.1-5.4L2.5 10l5.4-2.1z"/>';
  } else if (sk.passive) {
    glyphClass = "cat-passive";
    svgPath = '<path d="M10 2.8l6 2.6v4.4c0 3.8-2.5 6.8-6 8.2-3.5-1.4-6-4.4-6-8.2V5.4l6-2.6zm0 3.2L6.8 7.4v2.4c0 2.4 1.5 4.3 3.2 5.2 1.7-.9 3.2-2.8 3.2-5.2V7.4L10 6z"/>';
  } else if (clsId === "pal" && (sk.page === 1 || sk.page === 2)) {
    glyphClass = "cat-aura";
    svgPath = '<circle cx="10" cy="10" r="3.2"/><path d="M10 2v2.4M10 15.6V18M2 10h2.4M15.6 10H18M4.3 4.3l1.7 1.7M14 14l1.7 1.7M15.7 4.3L14 6M6 14l-1.7 1.7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/>';
  } else if ((clsId === "nec" && sk.page === 1) || (clsId === "war" && sk.page === 2)) {
    glyphClass = "cat-curse";
    svgPath = '<path d="M10 3C6.1 3 3 6.1 3 10s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm0 2.2c1.8 0 3.3 1 4.1 2.4-1.3-.5-2.7-.5-4.1-.5s-2.8 0-4.1.5C6.7 6.2 8.2 5.2 10 5.2zm0 9.6c-2.3 0-4.2-1.6-4.7-3.8 1.5.5 3.1.8 4.7.8s3.2-.3 4.7-.8c-.5 2.2-2.4 3.8-4.7 3.8z"/>';
  } else if (clsId === "bar" && sk.page === 3) {
    glyphClass = "cat-warcry";
    svgPath = '<path d="M4 8.5v3h2.8l4.2 3.2V5.3L6.8 8.5H4zm9.6-.9a4 4 0 0 1 0 4.8l-1.2-1a2.4 2.4 0 0 0 0-2.8l1.2-1zm2.2-2a6.8 6.8 0 0 1 0 8.8l-1.2-1a5.2 5.2 0 0 0 0-6.8l1.2-1z"/>';
  } else if (clsId === "sor" || clsId === "ass") {
    glyphClass = "cat-arcane";
    svgPath = '<path d="M11.2 2.2L5.5 11h4.1l-1 6.8L14.5 9h-4.1l.8-6.8z"/>';
  }
  return '<span class="sk-icon-frame is-glyph ' + glyphClass + '"><svg viewBox="0 0 20 20" width="15" height="15" fill="currentColor" aria-hidden="true">' + svgPath + '</svg></span>';
}

function getSkillRelations(clsObj, targetKey) {
  const empty = { ancestors: new Set(), directReqs: new Set(), descendants: new Set(), synergies: new Set(), prereqEdges: new Set(), unlockEdges: new Set() };
  if (!clsObj || !targetKey) return empty;
  const byKey = new Map();
  const childrenMap = new Map();
  clsObj.skills.forEach(s => {
    byKey.set(s.key, s);
    childrenMap.set(s.key, []);
  });
  clsObj.skills.forEach(s => {
    (s.reqs || []).forEach(rk => {
      if (childrenMap.has(rk)) childrenMap.get(rk).push(s.key);
    });
  });

  const target = byKey.get(targetKey);
  if (!target) return empty;

  const ancestors = new Set();
  const directReqs = new Set(target.reqs || []);
  const prereqEdges = new Set();
  const walkUp = (k) => {
    const s = byKey.get(k);
    if (!s) return;
    (s.reqs || []).forEach(rk => {
      prereqEdges.add(rk + "->" + k);
      if (!ancestors.has(rk)) {
        ancestors.add(rk);
        walkUp(rk);
      }
    });
  };
  walkUp(targetKey);

  const descendants = new Set();
  const unlockEdges = new Set();
  const walkDown = (k) => {
    (childrenMap.get(k) || []).forEach(ck => {
      unlockEdges.add(k + "->" + ck);
      if (!descendants.has(ck)) {
        descendants.add(ck);
        walkDown(ck);
      }
    });
  };
  walkDown(targetKey);

  // Bidirectional synergy matching by skill name in synergies descriptions
  const synergies = new Set();
  const matchMention = (synList, skCandidate) => {
    if (!Array.isArray(synList) || !synList.length || !skCandidate) return false;
    const en = (skCandidate.nameEn || skCandidate.key || "").toLowerCase();
    const zh = skCandidate.nameZh || "";
    return synList.some(item => {
      const sEn = (item.enUS || "").toLowerCase();
      const sZh = item.zhCN || "";
      return (en && (sEn.startsWith(en + ":") || sEn.includes(" " + en + ":"))) ||
        (zh && (sZh.startsWith(zh + ":") || sZh.startsWith(zh + "：")));
    });
  };
  clsObj.skills.forEach(other => {
    if (other.key === targetKey) return;
    if (matchMention(target.synergies, other) || matchMention(other.synergies, target)) {
      synergies.add(other.key);
    }
  });

  return { ancestors, directReqs, descendants, synergies, prereqEdges, unlockEdges };
}

function buildSkillEdgePath(src, dst, sRect, dRect, stageWidth, colGap, rowGap, incomingOffset, outgoingOffset) {
  const dr = dst.row - src.row;
  const dc = dst.col - src.col;
  const rad = 5;

  // Case 1: Same-row horizontal (e.g. Summon Goatman -> Demonic Mastery, Raise Skeleton -> Skeleton Mastery, Wearwolf -> Shape Shifting)
  if (dr === 0 && dc !== 0) {
    const y = Math.round(sRect.cy);
    if (dc < 0) {
      return "M " + sRect.left.toFixed(1) + " " + y + " L " + (dRect.right + 4).toFixed(1) + " " + y;
    }
    return "M " + sRect.right.toFixed(1) + " " + y + " L " + (dRect.left - 4).toFixed(1) + " " + y;
  }

  // Case 2: Same-column vertical (straight down)
  if (dc === 0 && dr > 0) {
    const x = dRect.cx + incomingOffset;
    const y1 = sRect.bottom;
    const y2 = dRect.top - 4;
    return "M " + x.toFixed(1) + " " + y1.toFixed(1) + " L " + x.toFixed(1) + " " + y2.toFixed(1);
  }

  // Case 3: Adjacent-row diagonal (rounded orthogonal elbow through row gap)
  if (dr === 1 && dc !== 0) {
    const x1 = sRect.cx + outgoingOffset;
    const y1 = sRect.bottom;
    const x2 = dRect.cx + incomingOffset;
    const y2 = dRect.top - 4;
    const midY = (sRect.bottom + dRect.top) / 2;
    const dirX = x2 > x1 ? 1 : -1;
    const r = Math.min(rad, Math.abs(x2 - x1) / 2, Math.abs(midY - y1), Math.abs(y2 - midY));
    return "M " + x1.toFixed(1) + " " + y1.toFixed(1) +
      " L " + x1.toFixed(1) + " " + (midY - r).toFixed(1) +
      " Q " + x1.toFixed(1) + " " + midY.toFixed(1) + " " + (x1 + dirX * r).toFixed(1) + " " + midY.toFixed(1) +
      " L " + (x2 - dirX * r).toFixed(1) + " " + midY.toFixed(1) +
      " Q " + x2.toFixed(1) + " " + midY.toFixed(1) + " " + x2.toFixed(1) + " " + (midY + r).toFixed(1) +
      " L " + x2.toFixed(1) + " " + y2.toFixed(1);
  }

  // Case 4: Multi-row diagonal (route cleanly through the vertical column gutter, zero card overlap)
  if (dr > 1 && dc !== 0) {
    const goRight = dc > 0;
    const x1 = goRight ? sRect.right : sRect.left;
    const y1 = sRect.cy + 6;
    const gutterX = goRight
      ? (sRect.right + colGap / 2)
      : (sRect.left - colGap / 2);
    const x2 = dRect.cx + incomingOffset;
    const y2 = dRect.top - 4;
    const midY = dRect.top - Math.max(8, rowGap / 2);
    const dirX = x2 > gutterX ? 1 : -1;
    const r1 = Math.min(rad, Math.abs(gutterX - x1));
    const r2 = Math.min(rad, Math.abs(x2 - gutterX) / 2, Math.abs(y2 - midY));
    return "M " + x1.toFixed(1) + " " + y1.toFixed(1) +
      " L " + (gutterX - (goRight ? r1 : -r1)).toFixed(1) + " " + y1.toFixed(1) +
      " Q " + gutterX.toFixed(1) + " " + y1.toFixed(1) + " " + gutterX.toFixed(1) + " " + (y1 + r1).toFixed(1) +
      " L " + gutterX.toFixed(1) + " " + (midY - r2).toFixed(1) +
      " Q " + gutterX.toFixed(1) + " " + midY.toFixed(1) + " " + (gutterX + dirX * r2).toFixed(1) + " " + midY.toFixed(1) +
      " L " + (x2 - dirX * r2).toFixed(1) + " " + midY.toFixed(1) +
      " Q " + x2.toFixed(1) + " " + midY.toFixed(1) + " " + x2.toFixed(1) + " " + (midY + r2).toFixed(1) +
      " L " + x2.toFixed(1) + " " + y2.toFixed(1);
  }

  return "";
}

function drawSkillTreeLinks() {
  const wrap = document.getElementById("sk-trees-wrap");
  const clsObj = getActiveClassObj();
  if (!wrap || !clsObj) return;
  const build = getClassBuild(clsObj.id);
  const byKey = new Map(clsObj.skills.map(s => [s.key, s]));
  const focusKey = skHoveredSkillKey || skSelectedSkillKey || null;
  const rel = getSkillRelations(clsObj, focusKey);

  wrap.querySelectorAll(".sk-matrix-stage").forEach(stage => {
    const svg = stage.querySelector(".sk-links-svg");
    const matrix = stage.querySelector(".sk-matrix");
    if (!svg || !matrix) return;
    if (typeof stage.getBoundingClientRect !== "function") return;
    const stageRect = stage.getBoundingClientRect();
    if (!stageRect || stageRect.width <= 0 || stageRect.height <= 0) return;

    const pageNum = Number(stage.dataset.skPage);
    const pageSkills = clsObj.skills.filter(s => s.page === pageNum);
    const rects = new Map();
    stage.querySelectorAll("[data-sk-node]").forEach(el => {
      const r = el.getBoundingClientRect();
      rects.set(el.dataset.skNode, {
        left: r.left - stageRect.left,
        right: r.right - stageRect.left,
        top: r.top - stageRect.top,
        bottom: r.bottom - stageRect.top,
        w: r.width,
        h: r.height,
        cx: r.left - stageRect.left + r.width / 2,
        cy: r.top - stageRect.top + r.height / 2
      });
    });

    const cs = typeof window !== "undefined" && typeof window.getComputedStyle === "function"
      ? window.getComputedStyle(matrix) : null;
    const colGap = cs ? (parseFloat(cs.columnGap) || 14) : 14;
    const rowGap = cs ? (parseFloat(cs.rowGap) || 20) : 20;

    // Count outgoing edges per source to slightly fan adjacent branches
    const outBySrc = new Map();
    pageSkills.forEach(dst => {
      (dst.reqs || []).forEach(rk => {
        if (!outBySrc.has(rk)) outBySrc.set(rk, []);
        outBySrc.get(rk).push(dst);
      });
    });

    const uid = "skm-" + clsObj.id + "-" + pageNum;
    const defs =
      '<defs>' +
        '<marker id="' + uid + '-idle" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1 1.5L8.5 5L1 8.5z" fill="rgba(212,188,148,0.52)"/></marker>' +
        '<marker id="' + uid + '-ready" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1 1.5L8.5 5L1 8.5z" fill="#78e38d"/></marker>' +
        '<marker id="' + uid + '-active" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M1 1.5L8.5 5L1 8.5z" fill="#f5cf7b"/></marker>' +
        '<marker id="' + uid + '-prereq" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1.5L8.5 5L1 8.5z" fill="#ffbe4f"/></marker>' +
        '<marker id="' + uid + '-unlock" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1.5L8.5 5L1 8.5z" fill="#56d4ff"/></marker>' +
      '</defs>';

    const paths = [];
    pageSkills.forEach(dst => {
      const reqList = (dst.reqs || []).map(rk => byKey.get(rk)).filter(r => r && r.page === pageNum);
      if (!reqList.length) return;
      const dRect = rects.get(dst.key);
      if (!dRect) return;

      reqList.forEach(src => {
        const sRect = rects.get(src.key);
        if (!sRect) return;

        // Avoid arrowhead collision when a skill has 2+ incoming prerequisites
        let incomingOffset = 0;
        if (reqList.length > 1) {
          if (src.col < dst.col) incomingOffset = -12;
          else if (src.col > dst.col) incomingOffset = 12;
        }
        // Avoid exit overlap when a parent fans out to both straight-down and diagonal children
        let outgoingOffset = 0;
        const outs = outBySrc.get(src.key) || [];
        if (outs.length > 1 && dst.col !== src.col) {
          outgoingOffset = dst.col > src.col ? 10 : -10;
        }

        const d = buildSkillEdgePath(src, dst, sRect, dRect, stageRect.width, colGap, rowGap, incomingOffset, outgoingOffset);
        if (!d) return;

        const edgeKey = src.key + "->" + dst.key;
        const srcPts = Number(build[src.key] || 0);
        const dstPts = Number(build[dst.key] || 0);
        let state = "idle";
        if (srcPts > 0 && dstPts > 0) state = "active";
        else if (srcPts > 0) state = "ready";

        let focusCls = "";
        let markerState = state;
        if (focusKey) {
          if (rel.prereqEdges.has(edgeKey)) {
            focusCls = " is-focus-prereq";
            markerState = "prereq";
          } else if (rel.unlockEdges.has(edgeKey)) {
            focusCls = " is-focus-unlock";
            markerState = "unlock";
          } else {
            focusCls = " is-focus-dim";
          }
        }

        paths.push({
          priority: focusCls && focusCls !== " is-focus-dim" ? 2 : (state === "active" ? 1 : 0),
          html: '<path class="sk-link-path is-' + state + focusCls + '" data-edge="' + escapeHtml(edgeKey) + '" d="' + d + '" marker-end="url(#' + uid + '-' + markerState + ')" />'
        });
      });
    });

    // Paint highlighted/active arrows last so they sit cleanly on top of muted ones
    paths.sort((a, b) => a.priority - b.priority);
    svg.setAttribute("viewBox", "0 0 " + stageRect.width.toFixed(1) + " " + stageRect.height.toFixed(1));
    svg.setAttribute("width", String(Math.round(stageRect.width)));
    svg.setAttribute("height", String(Math.round(stageRect.height)));
    svg.innerHTML = defs + paths.map(p => p.html).join("");
  });
}

function scheduleDrawSkillTreeLinks() {
  if (typeof requestAnimationFrame === "function") {
    if (skTreeDrawRaf) cancelAnimationFrame(skTreeDrawRaf);
    skTreeDrawRaf = requestAnimationFrame(() => {
      skTreeDrawRaf = 0;
      drawSkillTreeLinks();
    });
  } else {
    drawSkillTreeLinks();
  }
}

function ensureSkillTreeResizeObserver() {
  if (skTreeResizeObserver || typeof ResizeObserver === "undefined") return;
  const wrap = document.getElementById("sk-trees-wrap");
  if (!wrap) return;
  skTreeResizeObserver = new ResizeObserver(() => {
    scheduleDrawSkillTreeLinks();
  });
  skTreeResizeObserver.observe(wrap);
}

function applySkillRelationHighlight(overrideFocusKey) {
  const wrap = document.getElementById("sk-trees-wrap");
  const clsObj = getActiveClassObj();
  if (!wrap || !clsObj) return;
  const focusKey = overrideFocusKey !== undefined
    ? overrideFocusKey
    : (skHoveredSkillKey || skSelectedSkillKey || null);
  const rel = getSkillRelations(clsObj, focusKey);

  wrap.querySelectorAll("[data-sk-node]").forEach(node => {
    const k = node.dataset.skNode;
    const isFocus = Boolean(focusKey && k === focusKey);
    const isPrereq = Boolean(focusKey && rel.ancestors.has(k));
    const isUnlock = Boolean(focusKey && rel.descendants.has(k));
    const isSynergy = Boolean(focusKey && !isPrereq && !isUnlock && rel.synergies.has(k));
    const isDim = Boolean(focusKey && !isFocus && !isPrereq && !isUnlock && !isSynergy);

    node.classList.toggle("rel-prereq", isPrereq);
    node.classList.toggle("rel-unlock", isUnlock);
    node.classList.toggle("rel-synergy", isSynergy);
    node.classList.toggle("rel-dim", isDim);

    const tag = node.querySelector(".sk-rel-tag");
    if (tag) {
      if (isPrereq) {
        tag.textContent = rel.directReqs.has(k) ? "前置" : "上级";
        tag.className = "sk-rel-tag show is-prereq";
      } else if (isUnlock) {
        tag.textContent = "后续";
        tag.className = "sk-rel-tag show is-unlock";
      } else if (isSynergy) {
        tag.textContent = "协同";
        tag.className = "sk-rel-tag show is-synergy";
      } else {
        tag.textContent = "";
        tag.className = "sk-rel-tag";
      }
    }
  });

  drawSkillTreeLinks();
}

function renderSkillsTrees() {
  const wrap = document.getElementById("sk-trees-wrap");
  const clsObj = getActiveClassObj();
  if (!wrap || !clsObj) return;

  const build = getClassBuild(clsObj.id);
  const totalUsed = getClassTotalPoints(clsObj.id);
  let maxReqLvl = 1;
  for (const sk of clsObj.skills) {
    const pts = Number(build[sk.key] || 0);
    if (pts > 0) {
      const reqForRank = sk.reqLvl + pts - 1;
      if (reqForRank > maxReqLvl) maxReqLvl = reqForRank;
    }
  }
  const reqClvl = totalUsed > 0 ? Math.min(99, Math.max(maxReqLvl, totalUsed - 12 + 1, 1)) : 1;

  const usedEl = document.getElementById("sk-points-used");
  const remEl = document.getElementById("sk-points-rem");
  const clvlEl = document.getElementById("sk-req-clvl");
  if (usedEl) usedEl.textContent = String(totalUsed);
  if (remEl) remEl.textContent = String(Math.max(0, SK_MAX_POINTS - totalUsed));
  if (clvlEl) clvlEl.textContent = String(reqClvl);

  wrap.innerHTML = (clsObj.tabs || []).map(tab => {
    const pageSkills = clsObj.skills.filter(s => s.page === tab.page);
    let tabPoints = 0;
    pageSkills.forEach(s => { tabPoints += Number(build[s.key] || 0); });

    let cellsHtml = "";
    for (let r = 1; r <= 6; r++) {
      for (let c = 1; c <= 3; c++) {
        const sk = pageSkills.find(s => s.row === r && s.col === c);
        if (!sk) {
          cellsHtml += '<div class="sk-cell-empty" aria-hidden="true"></div>';
          continue;
        }
        const basePts = Number(build[sk.key] || 0);
        const totalBonus = getSkillTreeBonusForSkill(sk);
        const effPts = basePts > 0 ? basePts + totalBonus : 0;
        const isSel = skSelectedSkillKey === sk.key;
        const reqsMet = (sk.reqs || []).every(rk => Number(build[rk] || 0) > 0);
        const clsList = ["sk-node"];
        if (basePts > 0) clsList.push("allocated");
        else if (reqsMet && (sk.reqs || []).length > 0) clsList.push("unlocked");
        if (basePts >= 20) clsList.push("maxed");
        if (isSel) clsList.push("selected");

        const rankText = basePts > 0 && totalBonus > 0
          ? (basePts + " (" + effPts + ")/20")
          : (basePts + " / 20");
        const tagText = sk.passive
          ? (currentLang === "enUS" ? "Passive" : "被动")
          : ("Lv." + sk.reqLvl);
        const skTitle = pickSkLang(sk, "nameZh", "nameTw", "nameEn");
        const iconHtml = getSkillNodeIconHtml(clsObj.id, sk);

        cellsHtml += '<div class="' + clsList.join(" ") + '" data-sk-node="' + escapeHtml(sk.key) + '">' +
          '<span class="sk-rel-tag" aria-hidden="true"></span>' +
          '<div class="sk-node-top">' +
            '<span class="sk-node-lvlreq">' + escapeHtml(tagText) + '</span>' +
            '<div class="sk-node-step-btns">' +
              '<button type="button" class="sk-step-btn" data-sk-step="-1" data-sk-key="' + escapeHtml(sk.key) + '" aria-label="减少 ' + escapeHtml(skTitle) + ' 技能点" title="减 1 点（Shift -5）">-</button>' +
              '<button type="button" class="sk-step-btn" data-sk-step="1" data-sk-key="' + escapeHtml(sk.key) + '" aria-label="增加 ' + escapeHtml(skTitle) + ' 技能点" title="加 1 点（Shift +5）">+</button>' +
            '</div>' +
          '</div>' +
          '<button type="button" class="sk-node-pick" data-sk-pick="' + escapeHtml(sk.key) + '" aria-pressed="' + (isSel ? "true" : "false") + '">' +
            iconHtml +
            '<span class="sk-node-title" data-no-sweep="1">' + escapeHtml(skTitle) + '</span>' +
            '<span class="sk-node-foot">' +
              '<span class="sk-node-rank">' + escapeHtml(rankText) + '</span>' +
            '</span>' +
          '</button>' +
        '</div>';
      }
    }

    const tabTitle = pickSkLang(tab, "zhCN", "zhTW", "enUS");
    const tabExtra = (!skBonusClassId || skBonusClassId === skActiveClassId) ? (skBonusByTab[tab.page] || 0) : 0;
    return '<div class="sk-tree-col">' +
      '<div class="sk-tree-head">' +
        '<span class="sk-tree-title" data-no-sweep="1">' + escapeHtml(tabTitle) + (tabExtra > 0 ? (' <span style="color:#9ad8ff;font-size:11px">(+' + tabExtra + ')</span>') : '') + '</span>' +
        '<span class="sk-tree-pts">' + tabPoints + ' 点</span>' +
      '</div>' +
      '<div class="sk-matrix-stage" data-sk-page="' + tab.page + '">' +
        '<svg class="sk-links-svg" aria-hidden="true"></svg>' +
        '<div class="sk-matrix">' + cellsHtml + '</div>' +
      '</div>' +
    '</div>';
  }).join("");
  renderSkSyncedExtraBadge();
  ensureSkillTreeResizeObserver();

  wrap.querySelectorAll("[data-sk-step]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const k = btn.dataset.skKey;
      const step = Number(btn.dataset.skStep) * (e.shiftKey ? 5 : 1);
      modifySkillPoint(k, step);
    });
  });

  const toggleSelectSkillNode = (k) => {
    skSelectedSkillKey = (skSelectedSkillKey === k) ? null : k;
    wrap.querySelectorAll("[data-sk-node]").forEach(n => {
      const isCur = n.dataset.skNode === skSelectedSkillKey;
      n.classList.toggle("selected", isCur);
      const pickBtn = n.querySelector("[data-sk-pick]");
      if (pickBtn) pickBtn.setAttribute("aria-pressed", isCur ? "true" : "false");
    });
    applySkillRelationHighlight();
    renderSkillInspector();
  };

  wrap.querySelectorAll("[data-sk-node]").forEach(node => {
    const k = node.dataset.skNode;
    node.addEventListener("click", (e) => {
      if (e.target && e.target.closest && e.target.closest("[data-sk-step]")) return;
      toggleSelectSkillNode(k);
    });
    node.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      modifySkillPoint(k, e.shiftKey ? -5 : -1);
    });
    node.addEventListener("mouseenter", () => {
      skHoveredSkillKey = k;
      applySkillRelationHighlight(k);
    });
    node.addEventListener("mouseleave", () => {
      if (skHoveredSkillKey === k) skHoveredSkillKey = null;
      applySkillRelationHighlight();
    });
  });

  applySkillRelationHighlight();
  scheduleDrawSkillTreeLinks();
}

function evalDiminishing(lvl, minVal, maxVal) {
  if (lvl <= 0) return 0;
  return minVal + Math.floor(((maxVal - minVal) * Math.floor((110 * lvl) / (lvl + 6))) / 100);
}

function computeWeaponSkillMetaStats(skKey, effLvl, build, maxMode) {
  const meta = (pdData && pdData.skillCombatMeta && pdData.skillCombatMeta[skKey]) || null;
  if (!meta) return null;
  const lvl = Math.max(1, Number(effLvl) || 1);
  const getSynPts = (skillName) => maxMode ? 20 : Number((build && build[skillName]) || 0);

  let baseEd = 0;
  if (meta.dmEdMin !== undefined && meta.dmEdMax !== undefined) {
    baseEd = evalDiminishing(lvl, meta.dmEdMin, meta.dmEdMax);
  } else if (meta.edStartLvl) {
    baseEd = lvl < meta.edStartLvl ? 0 : meta.edBase + (lvl - meta.edStartLvl + 1) * meta.edLvl;
  } else {
    baseEd = meta.edBase + Math.max(0, lvl - 1) * meta.edLvl;
  }

  let synEd = 0;
  const edSynNotes = [];
  if (Array.isArray(meta.edSynergies)) {
    meta.edSynergies.forEach(s => {
      const pts = getSynPts(s.skill);
      if (pts > 0) {
        const add = pts * Number(s.pct || 0);
        synEd += add;
        edSynNotes.push(s.skill + " +" + add + "%");
      }
    });
  }

  const baseAr = (meta.toHitBase || 0) + Math.max(0, lvl - 1) * (meta.toHitLvl || 0);
  let synAr = 0;
  if (Array.isArray(meta.arSynergies)) {
    meta.arSynergies.forEach(s => {
      synAr += getSynPts(s.skill) * Number(s.pct || 0);
    });
  }

  let physFlatSynPct = 0;
  if (Array.isArray(meta.physFlatSynergies)) {
    meta.physFlatSynergies.forEach(s => {
      physFlatSynPct += getSynPts(s.skill) * Number(s.pct || 0);
    });
  }

  let echoCount = 1;
  if (meta.echoSkill) {
    const ep = getSynPts(meta.echoSkill);
    echoCount = ep > 0 ? (1 + Math.floor(ep / 5)) : 1;
  } else if (meta.isBladeCopy) {
    echoCount = Math.min(5, 2 + Math.floor(lvl / 5));
  }

  return {
    meta,
    baseEd,
    synEd,
    totalEd: baseEd + synEd,
    edSynNotes,
    baseAr,
    synAr,
    totalAr: baseAr + synAr,
    physFlatSynPct,
    echoCount
  };
}

// Official D2R 3.4 skilldesc.txt formula for Echoing Strike:
// calc5 = echoCount, calc6 = floor((100 / calc5) / 2), ddam calc1 = calc6 * calc5 * 2,
// desccalca4/b4 = pnma * ((calc6 * calc5 * 2) - 1) / 100 (99% at 1/2/5 echoes, 95% at 3/4 echoes)
function computeEchoingStrikeDisplayScale(echoCount) {
  const c5 = Math.max(1, Math.floor(Number(echoCount) || 1));
  const c6 = Math.floor(Math.floor(100 / c5) / 2);
  const ddamPct = c6 * c5 * 2;
  const tipPct = Math.max(1, ddamPct - 1);
  return { c5, c6, ddamPct, tipPct };
}

function renderSkillInspector() {
  const clsObj = getActiveClassObj();
  if (!clsObj) return;
  const titleEl = document.getElementById("sk-insp-title");
  const subEl = document.getElementById("sk-insp-sub");
  const bodyEl = document.getElementById("sk-insp-body");
  if (!titleEl || !subEl || !bodyEl) return;

  const sk = skSelectedSkillKey ? clsObj.skills.find(s => s.key === skSelectedSkillKey) : null;
  if (!sk) {
    titleEl.textContent = "点击左侧任意技能查看详情";
    subEl.textContent = "单击技能卡标记为已选中并锁定说明（再点一次或点其他技能取消/切换）；右上角「+ / -」（Shift ±5）或右键调整点数";
    bodyEl.innerHTML = '<div class="it-card-note" style="color:var(--muted);font-size:12.5px">点击任意技能卡即可在此锁定查看该技能的完整说明、公式与协同加成；锁定状态下调整其他协同技能的点数，此处伤害数值也会实时更新。</div>';
    return;
  }

  const build = getClassBuild(clsObj.id);
  const basePts = Number(build[sk.key] || 0);
  const totalBonus = getSkillTreeBonusForSkill(sk);
  const effLvl = basePts > 0 ? basePts + totalBonus : 1;

  const skName = pickSkLang(sk, "nameZh", "nameTw", "nameEn");
  titleEl.innerHTML = sk.icon
    ? '<span style="display:inline-flex;align-items:center;gap:10px"><img src="' + escapeHtml(sk.icon) + '" alt="" style="width:36px;height:36px;border-radius:5px;border:1px solid rgba(226,180,92,0.65);flex-shrink:0;box-shadow:0 2px 8px rgba(0,0,0,0.65)" /><span>' + escapeHtml(skName) + '</span></span>'
    : escapeHtml(skName);
  const secName = currentLang === "enUS" ? sk.nameZh : sk.nameEn;
  subEl.textContent = secName + " · 需求等级 " + sk.reqLvl + (sk.passive ? " · 被动技能" : "") +
    " · 当前投入 " + basePts + " 点" + (basePts > 0 && totalBonus > 0 ? ("（含装备/分系共 +" + totalBonus + " → " + effLvl + " 级）") : "") +
    " · 已选中（再次点击该技能取消）";

  const lines = [];
  const descText = pickSkLang(sk, "descZh", "descTw", "descEn");
  if (descText) {
    lines.push('<div class="it-card-note" style="color:#f2e7d5;font-size:13px">' + escapeHtml(descText) + '</div>');
  }

  const statParts = [];
  if (sk.mana) {
    const mCur = computeSkillMana(sk, effLvl);
    const m1 = computeSkillMana(sk, 1);
    const m20 = computeSkillMana(sk, 20);
    statParts.push("法力消耗：当前 " + mCur + "（1级: " + m1 + " · 20级: " + m20 + "）");
  }
  if (sk.cooldown > 0) {
    statParts.push("技能冷却：" + sk.cooldown + " 秒");
  }

  const wsMeta = computeWeaponSkillMetaStats(sk.key, effLvl, build, false);
  if (wsMeta) {
    const m = wsMeta.meta;
    if (m.isBladeCopy) {
      statParts.push("镜影武器伤害（" + effLvl + "级）：" + wsMeta.baseEd + "% · 召唤刀刃总数 " + wsMeta.echoCount + " 把");
    } else if (wsMeta.totalEd !== 0 || (Array.isArray(m.edSynergies) && m.edSynergies.length)) {
      const sign = wsMeta.totalEd >= 0 ? "+" : "";
      const synDetail = wsMeta.synEd > 0 ? ("（技能基础 +" + wsMeta.baseEd + "% + 协同 +" + wsMeta.synEd + "%）") : "";
      statParts.push("武器伤害加成（" + effLvl + "级）：" + sign + wsMeta.totalEd + "%" + synDetail);
    }
    if (m.eleConvEachBase) {
      const baseConv = m.eleConvEachBase + Math.max(0, effLvl - 1) * m.eleConvEachLvl;
      const salPts = Number(build["Salvation"] || 0);
      const fConv = baseConv + Number(build["Resist Fire"] || 0) * 10 + salPts * 2;
      const cConv = baseConv + Number(build["Resist Cold"] || 0) * 10 + salPts * 2;
      const lConv = baseConv + Number(build["Resist Lightning"] || 0) * 10 + salPts * 2;
      statParts.push("元素武器伤害转化（" + effLvl + "级）：火 +" + fConv + "% · 冰 +" + cConv + "% · 电 +" + lConv + "%");
    }
    if (wsMeta.totalAr > 0) {
      statParts.push("技能命中率加成（" + effLvl + "级）：+" + wsMeta.totalAr + "% AR");
    }
    if (m.srcDam > 0 && m.srcDam < 128) {
      statParts.push("武器基础伤害占比：" + Math.floor((m.srcDam * 100) / 128) + "%（精确 " + m.srcDam + "/128）");
    }
    if (m.echoSkill) {
      statParts.push("单次投射回响武器数：" + wsMeta.echoCount + " 把（按施法速度 FCR 施放）");
    }
  }

  if (sk.dmg) {
    const dCur = computeSkillDamage(sk, clsObj, build, effLvl);
    const d1 = computeSkillDamage(sk, clsObj, build, 1);
    const d20 = computeSkillDamage(sk, clsObj, build, 20);
    if (dCur) {
      const physSyn = wsMeta && wsMeta.physFlatSynPct > 0 ? wsMeta.physFlatSynPct : 0;
      const adjMin = physSyn > 0 ? Math.floor((dCur.min * (100 + physSyn)) / 100) : dCur.min;
      const adjMax = physSyn > 0 ? Math.floor((dCur.max * (100 + physSyn)) / 100) : dCur.max;
      const totSyn = dCur.synPct + physSyn;
      if (wsMeta && wsMeta.meta && wsMeta.meta.echoSkill) {
        const esScale = computeEchoingStrikeDisplayScale(wsMeta.echoCount);
        const tipMin = Math.floor((adjMin * esScale.tipPct) / 100);
        const tipMax = Math.floor((adjMax * esScale.tipPct) / 100);
        statParts.push(
          "技能附加物理伤害（" + effLvl + "级，与游戏技能提示一致）：" + tipMin + " – " + tipMax +
          (totSyn > 0
            ? ("（含 +" + totSyn + "% 协同，基础 " + dCur.min + "–" + dCur.max + "；官方 skilldesc 系数 " + esScale.tipPct + "%，未折减原值 " + adjMin + "–" + adjMax + "）")
            : ("（官方 skilldesc 系数 " + esScale.tipPct + "%，未折减原值 " + adjMin + "–" + adjMax + "）"))
        );
        const t1Min = Math.floor((d1.min * 99) / 100), t1Max = Math.floor((d1.max * 99) / 100);
        const t20Min = Math.floor((d20.min * 99) / 100), t20Max = Math.floor((d20.max * 99) / 100);
        statParts.push("基础成长对照（0协同提示值）：1级 " + t1Min + "–" + t1Max + " · 20级 " + t20Min + "–" + t20Max);
      } else {
        const lbl = wsMeta ? "技能附加物理伤害" : (sk.key === "Hex Bane" ? "武器附加魔法伤害" : (sk.key === "Hex Purge" ? "击中触发魔法爆炸伤害" : "技能伤害"));
        statParts.push(lbl + "（" + effLvl + "级）：" + adjMin + " – " + adjMax + (totSyn > 0 ? ("（含 +" + totSyn + "% 协同，基础 " + dCur.min + "–" + dCur.max + "）") : ""));
        statParts.push("基础成长对照：1级 " + d1.min + "–" + d1.max + " · 20级 " + d20.min + "–" + d20.max);
      }
    }
  }

  // Passive masteries & Warlock Hex Buffs live formulas in Skill Inspector
  if (sk.key === "Levitate") {
    const ed = 25 + (effLvl - 1) * 4;
    const ar = 40 + (effLvl - 1) * 5;
    const cs = evalDiminishing(effLvl, 0, 35);
    const reqRed = Math.min(50, 2 + (effLvl - 1) * 2);
    statParts.push("悬浮精通（" + effLvl + "级）：近战武器伤害 +" + ed + "% · 命中率 +" + ar + "% · 致命一击 " + cs + "% · 武器需求 -" + reqRed + "%");
  } else if (sk.key === "Hex Bane") {
    const hexAr = 20 + (effLvl - 1) * 9;
    const defRed = Math.min(50, 30 + (effLvl - 1));
    statParts.push("邪咒：灾祸 Buff（" + effLvl + "级）：武器攻击 +" + hexAr + "% 命中率 · 降低目标防御 -" + defRed + "% · 降低目标命中 -25%（可在配装页开启联动）");
  } else if (sk.key === "Hex Purge") {
    const eias = Math.min(30, 10 + (effLvl - 1));
    const hexAr = 20 + (effLvl - 1) * 9;
    const maxExp = Math.min(3, 1 + Math.floor(effLvl / 10));
    statParts.push("邪咒：消灭 Buff（" + effLvl + "级）：攻击速度 +" + eias + "% EIAS · 命中率 +" + hexAr + "% · 击中引爆上限 " + maxExp + " 次（可在配装页开启联动）");
  } else if (sk.key === "Hex Siphon") {
    const hexAr = 20 + (effLvl - 1) * 9;
    const engPts = Number(build["Engorge"] || 0);
    const lk = effLvl + engPts;
    statParts.push("邪咒：吸取 Buff（" + effLvl + "级）：命中率 +" + hexAr + "% · 每杀恢复生命 +" + lk + " / 法力 +" + lk + " · 降低目标物理伤害 -33%");
  } else if (["Blade Mastery", "Axe Mastery", "Mace Mastery", "Pole Arm Mastery", "Spear Mastery", "Throwing Mastery"].includes(sk.key)) {
    const arBase = ["Pole Arm Mastery", "Spear Mastery", "Throwing Mastery"].includes(sk.key) ? 44 : 40;
    statParts.push("武器专精（" + effLvl + "级）：武器伤害 +" + (28 + (effLvl - 1) * 5) + "% · 命中率 +" + (arBase + (effLvl - 1) * 8) + "% · 致命一击 " + evalDiminishing(effLvl, 0, 35) + "%");
  } else if (sk.key === "Claw Mastery") {
    statParts.push("利爪精通（" + effLvl + "级）：爪类伤害 +" + (35 + (effLvl - 1) * 4) + "% · 命中率 +" + (30 + (effLvl - 1) * 10) + "% · 致命一击 " + evalDiminishing(effLvl, 0, 25) + "%");
  } else if (sk.key === "Critical Strike") {
    statParts.push("致命攻击（" + effLvl + "级）：" + evalDiminishing(effLvl, 5, 80) + "% 几率造成双倍物理伤害");
  } else if (sk.key === "Penetrate") {
    statParts.push("刺穿（" + effLvl + "级）：攻击准确率 +" + (35 + (effLvl - 1) * 10) + "% AR");
  }

  if (statParts.length > 0) {
    lines.push(renderStatList(statParts.join(" · "), "#9ad8ff", false));
  }

  if (Array.isArray(sk.reqs) && sk.reqs.length > 0) {
    const reqNames = sk.reqs.map(rk => {
      const rSk = clsObj.skills.find(x => x.key === rk);
      const hasIt = Number(build[rk] || 0) > 0;
      const nm = rSk ? pickSkLang(rSk, "nameZh", "nameTw", "nameEn") : rk;
      return (hasIt ? "✓ " : "○ ") + nm;
    });
    lines.push('<div class="it-card-note">前置技能：' + escapeHtml(reqNames.join(" → ")) + '（点击技能可自动补齐前置）</div>');
  }

  if (Array.isArray(sk.synergies) && sk.synergies.length > 0) {
    const synItems = sk.synergies.map(s => pickSkLang(s, "zhCN", "zhTW", "enUS")).join(" · ");
    lines.push('<div class="it-set-bonus-box" style="margin-top:4px"><h4 class="it-set-bonus-title" style="color:#67e87a">协同技能加成（仅基础投入点数生效）</h4>' +
      renderStatList(synItems, "#8af49f", false) + '</div>');
  }

  bodyEl.innerHTML = lines.join("");
}

const CLASS_BREAKPOINTS = {
  war: {
    blockFactor: 25,
    iasBaseFrames: 15,
    fcr: [
      { label: "常规施法 (邪术/混沌/恶魔)", frames: [[15,0],[14,9],[13,18],[12,30],[11,48],[10,75],[9,125]] }
    ],
    fhr: [
      { label: "常规武器 / 法杖 / 魔典", frames: [[13,0],[12,5],[11,10],[10,16],[9,26],[8,39],[7,56],[6,86],[5,152],[4,377]] }
    ],
    fbr: [
      { label: "常规格挡 (会心守御可额外加速)", frames: [[7,0],[6,13],[5,32],[4,86],[3,600]] }
    ]
  },
  sor: {
    blockFactor: 20,
    iasBaseFrames: 16,
    fcr: [
      { label: "常规法术 (冰/火/传送/新星)", frames: [[13,0],[12,9],[11,20],[10,37],[9,63],[8,105],[7,200]] },
      { label: "闪电 / 连锁闪电 (L/CL)", frames: [[19,0],[18,7],[17,15],[16,23],[15,35],[14,52],[13,78],[12,117],[11,194]] }
    ],
    fhr: [
      { label: "全部武器", frames: [[15,0],[14,5],[13,9],[12,14],[11,20],[10,30],[9,42],[8,60],[7,86],[6,142],[5,280]] }
    ],
    fbr: [
      { label: "常规格挡", frames: [[9,0],[8,7],[7,15],[6,27],[5,48],[4,86],[3,200]] }
    ]
  },
  pal: {
    blockFactor: 30,
    iasBaseFrames: 15,
    fcr: [
      { label: "全部法术 (祝福之锤/天拳/传送)", frames: [[15,0],[14,9],[13,18],[12,30],[11,48],[10,75],[9,125]] }
    ],
    fhr: [
      { label: "常规武器 (单手/双手剑斧锤)", frames: [[9,0],[8,7],[7,15],[6,27],[5,48],[4,86],[3,200]] },
      { label: "长矛 / 长柄武器 / 法杖", frames: [[13,0],[12,3],[11,7],[10,13],[9,20],[8,32],[7,48],[6,75],[5,129],[4,280]] }
    ],
    fbr: [
      { label: "开启神圣之盾 (Holy Shield)", frames: [[2,0],[1,86]] },
      { label: "未开神圣之盾", frames: [[5,0],[4,13],[3,32],[2,86],[1,600]] }
    ]
  },
  ama: {
    blockFactor: 25,
    iasBaseFrames: 14,
    fcr: [
      { label: "全部法术 (传送/女武神/诱饵)", frames: [[19,0],[18,7],[17,14],[16,22],[15,32],[14,48],[13,68],[12,99],[11,152]] }
    ],
    fhr: [
      { label: "全部武器", frames: [[11,0],[10,6],[9,13],[8,20],[7,32],[6,52],[5,86],[4,174],[3,600]] }
    ],
    fbr: [
      { label: "单手挥砍武器 (剑/斧/锤)", frames: [[17,0],[16,4],[15,6],[14,11],[13,15],[12,23],[11,29],[10,40],[9,56],[8,80],[7,120],[6,200]] },
      { label: "标枪 / 匕首 (穿刺武器)", frames: [[5,0],[4,13],[3,32],[2,86],[1,600]] }
    ]
  },
  nec: {
    blockFactor: 20,
    iasBaseFrames: 16,
    fcr: [
      { label: "人类形态 (骨矛/尸爆/传送)", frames: [[15,0],[14,9],[13,18],[12,30],[11,48],[10,75],[9,125]] },
      { label: "塔格奥吸血鬼形态", frames: [[23,0],[22,6],[21,11],[20,18],[19,24],[18,35],[17,48],[16,65],[15,86],[14,120],[13,180]] }
    ],
    fhr: [
      { label: "常规武器", frames: [[13,0],[12,5],[11,10],[10,16],[9,26],[8,39],[7,56],[6,86],[5,152],[4,377]] }
    ],
    fbr: [
      { label: "常规格挡", frames: [[11,0],[10,6],[9,13],[8,20],[7,32],[6,52],[5,86],[4,174],[3,600]] }
    ]
  },
  bar: {
    blockFactor: 25,
    iasBaseFrames: 14,
    fcr: [
      { label: "全部法术 (战吼/寻宝/传送)", frames: [[13,0],[12,9],[11,20],[10,37],[9,63],[8,105],[7,200]] }
    ],
    fhr: [
      { label: "常规武器", frames: [[9,0],[8,7],[7,15],[6,27],[5,48],[4,86],[3,200]] }
    ],
    fbr: [
      { label: "常规格挡", frames: [[7,0],[6,9],[5,20],[4,42],[3,86],[2,280]] }
    ]
  },
  dru: {
    blockFactor: 20,
    iasBaseFrames: 16,
    fcr: [
      { label: "人类形态 (龙卷风/火山/传送)", frames: [[18,0],[17,4],[16,10],[15,19],[14,30],[13,46],[12,68],[11,99],[10,163]] },
      { label: "狼人变化形态", frames: [[16,0],[15,6],[14,14],[13,26],[12,40],[11,60],[10,95],[9,157]] },
      { label: "熊人变化形态", frames: [[16,0],[15,7],[14,15],[13,26],[12,40],[11,63],[10,99],[9,163]] }
    ],
    fhr: [
      { label: "人类形态 (单手挥砍)", frames: [[14,0],[13,3],[12,7],[11,13],[10,19],[9,29],[8,42],[7,63],[6,99],[5,174],[4,456]] },
      { label: "人类形态 (双手/法杖/长柄)", frames: [[13,0],[12,5],[11,10],[10,16],[9,26],[8,39],[7,56],[6,86],[5,152],[4,377]] },
      { label: "狼人变化形态", frames: [[7,0],[6,9],[5,20],[4,42],[3,86],[2,280]] },
      { label: "熊人变化形态", frames: [[13,0],[12,5],[11,10],[10,16],[9,24],[8,37],[7,54],[6,86],[5,152],[4,360]] }
    ],
    fbr: [
      { label: "人类形态", frames: [[11,0],[10,6],[9,13],[8,20],[7,32],[6,52],[5,86],[4,174],[3,600]] },
      { label: "熊人变化形态", frames: [[12,0],[11,5],[10,10],[9,16],[8,27],[7,40],[6,65],[5,109],[4,223]] },
      { label: "狼人变化形态", frames: [[9,0],[8,7],[7,15],[6,27],[5,48],[4,86],[3,200]] }
    ]
  },
  ass: {
    blockFactor: 25,
    iasBaseFrames: 14,
    fcr: [
      { label: "全部法术 (心灵震爆/传送)", frames: [[16,0],[15,8],[14,16],[13,27],[12,42],[11,65],[10,102],[9,174]] }
    ],
    fhr: [
      { label: "全部武器", frames: [[9,0],[8,7],[7,15],[6,27],[5,48],[4,86],[3,200]] }
    ],
    fbr: [
      { label: "盾牌格挡", frames: [[5,0],[4,13],[3,32],[2,86],[1,600]] }
    ]
  }
};

let bpFcrVariantIdx = 0;
let bpFhrVariantIdx = 0;
let pdLastBreakpointSnapshot = null;
let pdLastShareSummary = null;
let bpAutoSyncEnabled = true;
let bpManualOverride = false;
let bpSyncedExtraEias = 0;
let bpSyncedExtraEiasLabel = "";
let bpSyncingFromPd = false;

function evalIasBreakpoints(baseFrames, curIas, wsm, skillEias) {
  const safeBase = Number(baseFrames) || 15;
  const safeIas = Math.max(0, Number(curIas) || 0);
  const safeWsm = Number(wsm) || 0;
  const safeSkillEias = Number(skillEias) || 0;
  const calcFramesForIas = (iasVal) => {
    const gearEias = Math.floor((120 * iasVal) / (120 + iasVal));
    const eias = Math.min(75, Math.max(-75, gearEias + safeSkillEias - safeWsm));
    return Math.max(7, Math.ceil((256 * safeBase) / Math.floor((256 * (100 + eias)) / 100)) - 1);
  };
  const pairs = [];
  let prevF = 999;
  for (let testIas = 0; testIas <= 250; testIas++) {
    const f = calcFramesForIas(testIas);
    if (f < prevF) {
      pairs.push([f, testIas]);
      prevF = f;
    }
  }
  let activeIdx = 0;
  for (let i = 0; i < pairs.length; i++) {
    if (safeIas >= pairs[i][1]) activeIdx = i;
  }
  const curFrame = pairs[activeIdx] ? pairs[activeIdx][0] : calcFramesForIas(safeIas);
  const curReq = pairs[activeIdx] ? pairs[activeIdx][1] : 0;
  const nextEntry = pairs[activeIdx + 1] || null;
  return {
    curFrame,
    curReq,
    nextNeed: nextEntry ? { frame: nextEntry[0], need: nextEntry[1] - safeIas, bp: nextEntry[1] } : null,
    pairs
  };
}

function renderBpSyncBadge() {
  const badge = document.getElementById("bp-sync-source-badge");
  if (!badge) return;
  if (!bpAutoSyncEnabled) {
    badge.classList.add("is-manual");
    badge.textContent = "⏸️ 已关闭自动跟随（手动试算模式）";
    return;
  }
  if (bpManualOverride) {
    badge.classList.add("is-manual");
    badge.textContent = "✏️ 手动试算模式（点「立即同步纸娃娃」恢复配装值）";
    return;
  }
  const snap = pdLastBreakpointSnapshot;
  if (!snap || snap.classId !== skActiveClassId) {
    badge.classList.add("is-manual");
    badge.textContent = "⏳ 正在读取当前职业纸娃娃配装…";
    return;
  }
  badge.classList.remove("is-manual");
  const parts = [
    snap.className + " Lv." + snap.charLvl,
    "武器 " + snap.weaponName + " [WSM " + snap.mainWsm + "]"
  ];
  if (snap.hasShield) {
    parts.push("盾牌 " + snap.shieldName + " (面板" + snap.shieldPanelBlock + "%" + (snap.holyShieldBlockPct > 0 ? ("+圣盾" + snap.holyShieldBlockPct + "%") : "") + ")");
  } else {
    parts.push("未持盾");
  }
  if (snap.fanaLvl > 0) parts.push("狂热 Lv." + snap.fanaLvl);
  if (snap.hexEias > 0) parts.push("邪咒 +" + snap.hexEias + "% EIAS");
  badge.textContent = "✓ 已直连纸娃娃：" + parts.join(" · ");
}

function syncPaperdollToBreakpoints(silent) {
  if (!pdLastBreakpointSnapshot || pdLastBreakpointSnapshot.classId !== skActiveClassId) {
    if (!bpSyncingFromPd && typeof renderPaperdollLiveStats === "function" && itData && pdData) {
      bpSyncingFromPd = true;
      try { renderPaperdollLiveStats(); } finally { bpSyncingFromPd = false; }
    }
  }
  const snap = pdLastBreakpointSnapshot;
  if (!snap || snap.classId !== skActiveClassId) {
    renderBpSyncBadge();
    return false;
  }
  bpSyncingFromPd = true;
  try {
    const setVal = (id, v) => {
      const el = document.getElementById(id);
      if (el) el.value = String(v);
    };
    setVal("bp-fcr-input", snap.fcr);
    setVal("bp-fhr-input", snap.fhr);
    setVal("bp-ias-input", snap.ias);
    setVal("bp-ias-fana", snap.fanaLvl);
    setVal("bp-ias-bos", snap.bosLvl || 0);
    setVal("bp-fbr-input", snap.fbr);
    setVal("bp-blk-clvl", snap.charLvl);
    setVal("bp-blk-skill", snap.holyShieldBlockPct || 0);

    bpSyncedExtraEias = snap.hexEias || 0;
    bpSyncedExtraEiasLabel = snap.hexEias > 0 ? ("邪咒：消灭 +" + snap.hexEias + "% EIAS") : "";

    const wsmSel = document.getElementById("bp-ias-wsm");
    if (wsmSel && typeof wsmSel.insertBefore === "function") {
      let pdWsmOpt = document.getElementById("bp-ias-wsm-pd");
      if (!pdWsmOpt) {
        pdWsmOpt = document.createElement("option");
        pdWsmOpt.id = "bp-ias-wsm-pd";
        wsmSel.insertBefore(pdWsmOpt, wsmSel.firstChild);
      }
      pdWsmOpt.value = String(snap.mainWsm);
      pdWsmOpt.textContent = "[纸娃娃 WSM " + snap.mainWsm + "] " + snap.weaponName;
      pdWsmOpt.selected = true;
      wsmSel.value = pdWsmOpt.value;
    }

    const shieldSel = document.getElementById("bp-blk-shield");
    if (shieldSel && typeof shieldSel.insertBefore === "function") {
      let pdShieldOpt = document.getElementById("bp-blk-shield-pd");
      if (snap.hasShield && snap.shieldPanelBlock > 0) {
        if (!pdShieldOpt) {
          pdShieldOpt = document.createElement("option");
          pdShieldOpt.id = "bp-blk-shield-pd";
          pdShieldOpt.dataset.includesClassBlock = "1";
          shieldSel.insertBefore(pdShieldOpt, shieldSel.firstChild);
        }
        pdShieldOpt.value = String(snap.shieldPanelBlock);
        pdShieldOpt.textContent = "[纸娃娃] " + snap.shieldName + "（" + snap.shieldPanelBlock + "% 面板格挡）";
        pdShieldOpt.selected = true;
        shieldSel.value = pdShieldOpt.value;
      } else if (pdShieldOpt) {
        if (typeof pdShieldOpt.remove === "function") pdShieldOpt.remove();
        else if (pdShieldOpt.parentNode && typeof pdShieldOpt.parentNode.removeChild === "function") pdShieldOpt.parentNode.removeChild(pdShieldOpt);
      }
    }
  } finally {
    bpSyncingFromPd = false;
  }
  renderBreakpointsAll();
  return true;
}

function renderBpTable(framesArr, curValue, unitLabel) {
  let activeIdx = 0;
  for (let i = 0; i < framesArr.length; i++) {
    if (curValue >= framesArr[i][1]) activeIdx = i;
  }
  const curFrame = framesArr[activeIdx][0];
  const curReq = framesArr[activeIdx][1];
  const nextEntry = framesArr[activeIdx + 1];
  const perSec = (25 / curFrame).toFixed(2);
  const statusHtml = "当前档位：<strong>" + curFrame + " 帧</strong>（每秒 " + perSec + " 次，需 ≥" + curReq + "% " + unitLabel + "）" +
    (nextEntry ? (" · 距离下一档 <strong>" + nextEntry[0] + " 帧</strong>（" + nextEntry[1] + "%）还差 <strong>+" + (nextEntry[1] - curValue) + "%</strong>") : " · 已达最高极限档位！");

  const rowsHtml = framesArr.map((pair, idx) => {
    const f = pair[0];
    const req = pair[1];
    const cps = (25 / f).toFixed(2);
    return '<tr class="' + (idx === activeIdx ? 'bp-active' : '') + '">' +
      '<td>' + f + ' 帧</td>' +
      '<td>' + req + '%</td>' +
      '<td>' + cps + ' 次/秒</td>' +
      '<td>' + (idx === activeIdx ? '★ 当前档位' : (curValue >= req ? '✓ 已达成' : '差 +' + (req - curValue) + '%')) + '</td>' +
    '</tr>';
  }).join("");

  const tableHtml = '<table class="bp-table"><thead><tr><th>动作帧数</th><th>所需 ' + unitLabel + '</th><th>动作频率</th><th>状态</th></tr></thead><tbody>' + rowsHtml + '</tbody></table>';
  return { statusHtml, tableHtml };
}

function renderBreakpointsAll() {
  const bp = CLASS_BREAKPOINTS[skActiveClassId] || CLASS_BREAKPOINTS.war;
  const fcrVarSel = document.getElementById("bp-fcr-variant");
  const fhrVarSel = document.getElementById("bp-fhr-variant");
  if (!fcrVarSel || !fhrVarSel) return;

  renderBpSyncBadge();

  if (bpFcrVariantIdx >= bp.fcr.length) bpFcrVariantIdx = 0;
  if (bpFhrVariantIdx >= bp.fhr.length) bpFhrVariantIdx = 0;

  fcrVarSel.innerHTML = bp.fcr.map((v, i) => '<option value="' + i + '"' + (i === bpFcrVariantIdx ? ' selected' : '') + '>' + escapeHtml(v.label) + '</option>').join("");
  fhrVarSel.innerHTML = bp.fhr.map((v, i) => '<option value="' + i + '"' + (i === bpFhrVariantIdx ? ' selected' : '') + '>' + escapeHtml(v.label) + '</option>').join("");

  const curFcr = Math.max(0, Number(document.getElementById("bp-fcr-input")?.value || 0));
  const fcrRes = renderBpTable(bp.fcr[bpFcrVariantIdx].frames, curFcr, "FCR");
  document.getElementById("bp-fcr-status").innerHTML = fcrRes.statusHtml;
  document.getElementById("bp-fcr-table-wrap").innerHTML = fcrRes.tableHtml;

  const curFhr = Math.max(0, Number(document.getElementById("bp-fhr-input")?.value || 0));
  const fhrRes = renderBpTable(bp.fhr[bpFhrVariantIdx].frames, curFhr, "FHR");
  document.getElementById("bp-fhr-status").innerHTML = fhrRes.statusHtml;
  document.getElementById("bp-fhr-table-wrap").innerHTML = fhrRes.tableHtml;

  // Weapon IAS Breakpoint calculation (shared formula with Paperdoll)
  const wsm = Number(document.getElementById("bp-ias-wsm")?.value || 0);
  const curIas = Math.max(0, Number(document.getElementById("bp-ias-input")?.value || 0));
  const fanaLvl = Math.max(0, Number(document.getElementById("bp-ias-fana")?.value || 0));
  const bosLvl = Math.max(0, Number(document.getElementById("bp-ias-bos")?.value || 0));
  const fanaEias = evalDiminishing(fanaLvl, 10, 40);
  const bosEias = evalDiminishing(bosLvl, 15, 60);
  const isLivePdSynced = Boolean(bpAutoSyncEnabled && !bpManualOverride && pdLastBreakpointSnapshot && pdLastBreakpointSnapshot.classId === skActiveClassId);
  const extraEias = isLivePdSynced ? bpSyncedExtraEias : 0;
  const skillEias = fanaEias + bosEias + extraEias;

  const iasEval = evalIasBreakpoints(bp.iasBaseFrames || 15, curIas, wsm, skillEias);
  const iasRes = renderBpTable(iasEval.pairs, curIas, "IAS");
  const extraIasNote = extraEias > 0 && bpSyncedExtraEiasLabel
    ? (' · 已计入纸娃娃 <strong>' + escapeHtml(bpSyncedExtraEiasLabel) + '</strong>')
    : '';
  document.getElementById("bp-ias-status").innerHTML = iasRes.statusHtml + extraIasNote;
  document.getElementById("bp-ias-table-wrap").innerHTML = iasRes.tableHtml;

  // FBR + 75% Max Block Dexterity calculator
  const curFbr = Math.max(0, Number(document.getElementById("bp-fbr-input")?.value || 0));
  const fbrRes = renderBpTable(bp.fbr[0].frames, curFbr, "FBR");
  const shieldSel = document.getElementById("bp-blk-shield");
  const selectedShieldOpt = shieldSel && shieldSel.selectedOptions && shieldSel.selectedOptions[0];
  const includesClassBlock = Boolean(selectedShieldOpt && selectedShieldOpt.dataset && selectedShieldOpt.dataset.includesClassBlock === "1");
  const shieldBase = Number(shieldSel?.value || 42);
  const clvl = Math.min(99, Math.max(1, Number(document.getElementById("bp-blk-clvl")?.value || 90)));
  const skillBlk = Math.max(0, Number(document.getElementById("bp-blk-skill")?.value || 0));
  const totalShieldBlock = includesClassBlock ? (shieldBase + skillBlk) : (shieldBase + (bp.blockFactor - 20) + skillBlk);
  const reqDex75 = Math.ceil((75 * 2 * clvl) / Math.max(1, totalShieldBlock)) + 15;
  let pdDexComparison = "";
  if (isLivePdSynced && pdLastBreakpointSnapshot) {
    if (pdLastBreakpointSnapshot.hasShield) {
      const pdDex = pdLastBreakpointSnapshot.totalDex;
      if (pdDex >= reqDex75) {
        pdDexComparison = " · 纸娃娃当前敏捷 <strong>" + pdDex + "</strong>（实际格挡 <strong>75%</strong> ✓ 已满格挡" + (pdDex > reqDex75 ? ("，盈余 +" + (pdDex - reqDex75)) : "") + "）";
      } else {
        pdDexComparison = " · 纸娃娃当前敏捷 <strong>" + pdDex + "</strong>（实际格挡 <strong>" + pdLastBreakpointSnapshot.charBlockChance + "%</strong>，距 75% 还差 <strong>+" + (reqDex75 - pdDex) + " 敏</strong>）";
      }
    } else {
      pdDexComparison = ' · <span style="color:var(--muted)">纸娃娃当前未持盾（按所选盾牌试算）</span>';
    }
  }
  document.getElementById("bp-blk-status").innerHTML =
    "<strong>75% 满格挡所需敏捷：" + reqDex75 + " 点</strong>（" + clvl + " 级 · 有效盾牌格挡率 " + totalShieldBlock + "%）" + pdDexComparison + "<br>" + fbrRes.statusHtml;
  document.getElementById("bp-fbr-table-wrap").innerHTML = fbrRes.tableHtml;
}

const MERC_VARIANTS = [
  { id: "a2-might", act: 2, name: "第二幕 · 沙漠米山（进攻 · 力量灵气 Might）", baseLvl: 75, hp: 1430, hpLvl: 40, str: 173, str8: 14, dex: 139, dex8: 12, def: 1027, defLvl: 28, res: 142, res4: 4, baseFrames: 16, skills: [{ name: "戳刺 Jab", base: 23, per32: 0 }, { name: "力量灵气 Might", base: 15, per32: 8, auraDesc: (l) => "全队物理伤害 +" + (30 + l * 10) + "%" }] },
  { id: "a2-hf", act: 2, name: "第二幕 · 沙漠米山（防御 · 神圣冰冻 Holy Freeze）", baseLvl: 75, hp: 1430, hpLvl: 40, str: 173, str8: 14, dex: 139, dex8: 12, def: 1027, defLvl: 28, res: 142, res4: 4, baseFrames: 16, skills: [{ name: "戳刺 Jab", base: 23, per32: 0 }, { name: "神圣冰冻 Holy Freeze", base: 16, per32: 0, auraDesc: (l) => "大范围冰冷控场减速 " + Math.min(58, 25 + l * 2) + "%" }] },
  { id: "a2-prayer", act: 2, name: "第二幕 · 沙漠米山（战斗 · 祈祷灵气 Prayer）", baseLvl: 75, hp: 1430, hpLvl: 40, str: 173, str8: 14, dex: 139, dex8: 12, def: 1027, defLvl: 28, res: 142, res4: 4, baseFrames: 16, skills: [{ name: "戳刺 Jab", base: 24, per32: 10 }, { name: "祈祷灵气 Prayer", base: 18, per32: 0, auraDesc: (l) => "单层每秒回血 +" + (l * 2 - 5) + "（配眼光+治愈头享 3 倍回血协同）" }] },
  { id: "a2-defiance", act: 2, name: "第二幕 · 沙漠米山（防御 · 反抗灵气 Defiance）", baseLvl: 75, hp: 1430, hpLvl: 40, str: 173, str8: 14, dex: 139, dex8: 12, def: 1027, defLvl: 28, res: 142, res4: 4, baseFrames: 16, skills: [{ name: "戳刺 Jab", base: 24, per32: 0 }, { name: "反抗灵气 Defiance", base: 18, per32: 0, auraDesc: (l) => "全队防御 +" + (60 + l * 10) + "%" }] },
  { id: "a2-ba", act: 2, name: "第二幕 · 沙漠米山（进攻 · 祝福瞄准 Blessed Aim）", baseLvl: 75, hp: 1430, hpLvl: 40, str: 173, str8: 14, dex: 139, dex8: 12, def: 1027, defLvl: 28, res: 142, res4: 4, baseFrames: 16, skills: [{ name: "戳刺 Jab", base: 24, per32: 0 }, { name: "祝福瞄准 Blessed Aim", base: 18, per32: 0, auraDesc: (l) => "全队命中率 +" + (60 + l * 15) + "%" }] },
  { id: "a1-cold", act: 1, name: "第一幕 · 萝格斥候（冰冷箭 + 冻结箭 + 内视）", baseLvl: 67, hp: 900, hpLvl: 30, str: 116, str8: 10, dex: 173, dex8: 16, def: 744, defLvl: 23, res: 121, res4: 5, baseFrames: 15, skills: [{ name: "内视 Inner Sight", base: 22, per32: 10, auraDesc: (l) => "降低周围敌人基础防御 -" + (40 + l * 45) }, { name: "冰冷箭 Cold Arrow", base: 22, per32: 10 }, { name: "冻结箭 Freezing Arrow", base: 7, per32: 3 }] },
  { id: "a1-fire", act: 1, name: "第一幕 · 萝格斥候（火焰箭 + 爆裂箭 + 内视）", baseLvl: 67, hp: 900, hpLvl: 30, str: 116, str8: 10, dex: 173, dex8: 16, def: 744, defLvl: 23, res: 121, res4: 5, baseFrames: 15, skills: [{ name: "内视 Inner Sight", base: 22, per32: 10 }, { name: "火焰箭 Fire Arrow", base: 22, per32: 10 }, { name: "爆裂箭 Exploding Arrow", base: 12, per32: 5 }] },
  { id: "a3-fire", act: 3, name: "第三幕 · 东方铁狼法师（火焰 · 强化 Enchant + 火球）", baseLvl: 79, hp: 1224, hpLvl: 34, str: 130, str8: 10, dex: 104, dex8: 8, def: 907, defLvl: 25, res: 155, res4: 5, baseFrames: 16, skills: [{ name: "火焰强化 Enchant", base: 26, per32: 20, auraDesc: (l) => "为主角、召唤物与全队附加高额火焰伤害与 +" + (20 + l * 9) + "% 命中率" }, { name: "火球术 Fire Ball", base: 25, per32: 10 }, { name: "火焰弹 Fire Bolt", base: 27, per32: 10 }] },
  { id: "a3-ltng", act: 3, name: "第三幕 · 东方铁狼法师（闪电 · 静电力场 Static Field + 闪电）", baseLvl: 79, hp: 1224, hpLvl: 34, str: 130, str8: 10, dex: 104, dex8: 8, def: 907, defLvl: 25, res: 155, res4: 5, baseFrames: 16, skills: [{ name: "静电力场 Static Field", base: 18, per32: 8, auraDesc: (l) => "群体削减怪物 25% 当前生命（半径 " + (3.3 + l * 0.66).toFixed(1) + " 码）" }, { name: "闪电 Lightning", base: 24, per32: 10 }, { name: "充能弹 Charged Bolt", base: 25, per32: 10 }] },
  { id: "a3-cold", act: 3, name: "第三幕 · 东方铁狼法师（冰冷 · 冰尖柱 + 寒冰装甲）", baseLvl: 79, hp: 1224, hpLvl: 34, str: 130, str8: 10, dex: 104, dex8: 8, def: 907, defLvl: 25, res: 155, res4: 5, baseFrames: 16, skills: [{ name: "冰尖柱 Glacial Spike", base: 22, per32: 10, auraDesc: () => "群体冻结控场" }, { name: "寒冰装甲 Chilling Armor", base: 27, per32: 15 }, { name: "冰风暴 Ice Blast", base: 27, per32: 10 }] },
  { id: "a5-frenzy", act: 5, name: "第五幕 · 哈洛加斯野蛮人（双持狂乱 Frenzy + 嘲讽 + 铁皮）", baseLvl: 80, hp: 1680, hpLvl: 45, str: 200, str8: 15, dex: 129, dex8: 10, def: 1332, defLvl: 35, res: 148, res4: 4, baseFrames: 14, skills: [{ name: "狂乱 Frenzy", base: 13, per32: 7, auraDesc: (l) => "攻速与移速极速叠加 (Lv." + l + ")" }, { name: "钢铁皮肤 Iron Skin", base: 12, per32: 6 }, { name: "嘲讽 Taunt", base: 17, per32: 6 }] },
  { id: "a5-bash", act: 5, name: "第五幕 · 哈洛加斯野蛮人（双手重剑 · 战吼 Battle Cry + 击晕）", baseLvl: 80, hp: 1680, hpLvl: 45, str: 200, str8: 15, dex: 129, dex8: 10, def: 1332, defLvl: 35, res: 148, res4: 4, baseFrames: 15, skills: [{ name: "战吼 Battle Cry", base: 19, per32: 8, auraDesc: (l) => "降低周围怪物防御 -" + (48 + l * 2) + "% 与伤害 -" + (24 + l) + "%" }, { name: "猛击 Bash", base: 25, per32: 10 }, { name: "击晕 Stun", base: 20, per32: 8 }] }
];

let pdData = null;
let pdActiveTarget = "char"; // "char" | "merc" | "bag"
let pdActiveSlot = "weapon";
let pdActiveBagUid = null;
let pdBagNextUid = 1;
let pdCharBag = [];
let pdActiveCat = "rw"; // "unique" | "set" | "rw" | "craft" | "magic" | "rare" | "base"
let pdItemCombo = null;
let pdRwBaseCombo = null;
let pdAffixFilter = "";
let pdSelectedRwBaseCode = "";
let pdLastCharSkillBonus = 0;
let pdLastSyncPayload = { all: 0, byTab: { 1: 0, 2: 0, 3: 0 }, bySkill: {}, fire: 0 };
let pdActiveOskills = {};
let pdSelectedSkillKey = "";
let pdSkillNotesOpen = false;
let pdStatAlloc = { str: 0, dex: 0, vit: 0, enr: 0 };

function getStatBudget(lvl) {
  return Math.max(0, (Math.min(99, Math.max(1, Number(lvl) || 1)) - 1) * 5 + 15);
}

function clampStatAlloc(lvl) {
  const budget = getStatBudget(lvl);
  ["str", "dex", "vit", "enr"].forEach(k => {
    pdStatAlloc[k] = Math.max(0, Math.floor(Number(pdStatAlloc[k]) || 0));
  });
  let excess = (pdStatAlloc.str + pdStatAlloc.dex + pdStatAlloc.vit + pdStatAlloc.enr) - budget;
  if (excess > 0) {
    for (const k of ["enr", "vit", "dex", "str"]) {
      const cut = Math.min(pdStatAlloc[k], excess);
      pdStatAlloc[k] -= cut;
      excess -= cut;
      if (excess <= 0) break;
    }
  }
  const spent = pdStatAlloc.str + pdStatAlloc.dex + pdStatAlloc.vit + pdStatAlloc.enr;
  return { budget, spent, rem: Math.max(0, budget - spent) };
}

function getCraftedItemDef(id) {
  return (pdData && Array.isArray(pdData.craftedItems) ? pdData.craftedItems : []).find(c => c.id === id) || null;
}

function getBaseSearchText(b) {
  if (!b) return "";
  return (b.nameZh || "") + " " + (b.aliasZh || "") + " " + (b.nameEn || "") + " " + (b.code || "");
}

function getDefaultCraftSkill(cDef, clsObj) {
  if (!cDef || !cDef.skillCapable) return null;
  const lvl = cDef.defaultSkillLvl || 2;
  if (cDef.defaultSkillMode === "none") return { mode: "none", tabPage: 1, lvl };
  if (cDef.defaultSkillMode === "tab") {
    const tabs = (clsObj && Array.isArray(clsObj.tabs)) ? clsObj.tabs : [];
    const matched = (cDef.defaultSkillTabHint && tabs.find(t => t.zhCN.includes(cDef.defaultSkillTabHint))) || tabs[0];
    return { mode: "tab", tabPage: matched ? matched.page : 1, lvl };
  }
  return { mode: "class", tabPage: 1, lvl };
}

function getCraftSkillLine(eq, cDef, clsObj) {
  if (!cDef || !cDef.skillCapable) return "";
  const cs = (eq && eq.craftSkill) || getDefaultCraftSkill(cDef, clsObj);
  if (!cs || cs.mode === "none" || !(cs.lvl > 0)) return "";
  if (cs.mode === "class") return "+" + cs.lvl + " 本职业技能";
  if (cs.mode === "tab") {
    const tabs = (clsObj && Array.isArray(clsObj.tabs)) ? clsObj.tabs : [];
    const tab = tabs.find(t => t.page === Number(cs.tabPage)) || tabs[0];
    return tab ? ("+" + cs.lvl + " " + tab.zhCN) : ("+" + cs.lvl + " 本系技能");
  }
  return "";
}

function getAffixSlotForEquip(slotId, bRule) {
  if (slotId === "amulet") return "amul";
  if (slotId === "ring1" || slotId === "ring2") return "ring";
  if (bRule && bRule.type) return bRule.type;
  if (slotId === "head") return "circ";
  if (slotId === "gloves") return "glov";
  if (slotId === "boots") return "boot";
  if (slotId === "belt") return "belt";
  if (slotId === "torso") return "tors";
  if (slotId === "offhand") return "shie";
  return "swor";
}

function resolveOfficialAffixItemType(affixSlotOrType, bRule) {
  if (pdData && pdData.typeAffixMap && pdData.typeAffixMap[affixSlotOrType]) return affixSlotOrType;
  const legacyMap = {
    amulet: "amul",
    ring: "ring",
    circlet: "circ",
    gloves: "glov",
    boots: "boot",
    belt: "belt",
    weapon: (bRule && bRule.type) || "swor",
    armor_shield: (bRule && bRule.type) || "shie",
    charm_sc: "scha",
    charm_lc: "mcha",
    charm_gc: "lcha"
  };
  return legacyMap[affixSlotOrType] || (bRule && bRule.type) || "ring";
}

function getMagicRareAffixPool(affixSlotOrType, quality, clsObj, bRule) {
  const prefixes = [];
  const suffixes = [];
  if (!pdData || !Array.isArray(pdData.affixCatalog) || !pdData.typeAffixMap) {
    return { prefixes, suffixes };
  }
  const itemType = resolveOfficialAffixItemType(affixSlotOrType, bRule);
  const entry = pdData.typeAffixMap[itemType];
  if (!entry) return { prefixes, suffixes };

  const idxs = quality === "rare" ? (entry.r || []) : (entry.m || []);
  const activeCid = clsObj ? clsObj.id : skActiveClassId;
  const isMercTarget = pdActiveTarget === "merc";
  const mercObj = isMercTarget ? getCurrentMercVariant() : null;
  const maxBaseSocks = bRule ? Number(bRule.maxSockets || 0) : 0;

  for (const idx of idxs) {
    const tuple = pdData.affixCatalog[idx];
    if (!tuple) continue;
    const [side, groupNum, clsOnly, rangeText] = tuple;
    if (clsOnly) {
      if (isMercTarget) {
        if (!(mercObj && mercObj.act === 5 && clsOnly === "bar")) continue;
      } else if (clsOnly !== activeCid) {
        continue;
      }
    }
    // Hide socket prefixes exceeding this specific base item's maxSockets
    if (groupNum === 122 && bRule) {
      if (/^4\s*孔/.test(rangeText) && maxBaseSocks < 4) continue;
      if (/^3\s*孔/.test(rangeText) && maxBaseSocks < 3) continue;
      if (/孔/.test(rangeText) && maxBaseSocks < 1) continue;
    }
    const item = {
      id: "ofc:" + idx,
      type: side === "p" ? "prefix" : "suffix",
      g: Number(groupNum || 0),
      nameZh: rangeText,
      range: rangeText
    };
    if (side === "p") prefixes.push(item);
    else suffixes.push(item);
  }
  return { prefixes, suffixes };
}

function buildCraftedRawStatsText(itemObj, clsObj) {
  const c = getCraftedItemDef(itemObj && itemObj.id);
  if (!c) return "";
  const parts = [];
  // Backwards compatibility only for legacy saved craft items without prefixes/suffixes arrays
  if (itemObj && !Array.isArray(itemObj.prefixes) && !Array.isArray(itemObj.suffixes) && itemObj.craftSkill) {
    const skLine = getCraftSkillLine(itemObj, c, clsObj);
    if (skLine) parts.push(skLine);
  }
  if (c.stats) parts.push(c.stats);
  const afTxt = buildMagicRareStatsText(itemObj);
  if (afTxt) parts.push(afTxt);
  return parts.join(" · ");
}

function preserveRollsAcrossAffixEdit(itemObj, mutateFn) {
  if (!itemObj) return;
  const getRaw = () => itemObj.cat === "craft"
    ? buildCraftedRawStatsText(itemObj, typeof getActiveClassObj === "function" ? getActiveClassObj() : null)
    : buildMagicRareStatsText(itemObj);
  const prevRaw = getRaw();
  const prevVars = extractVariableRanges(prevRaw).vars;
  const savedBySig = new Map();
  const seenPrev = new Map();
  prevVars.forEach(v => {
    const cnt = (seenPrev.get(v.rawLine) || 0) + 1;
    seenPrev.set(v.rawLine, cnt);
    if (itemObj.rolls && itemObj.rolls[v.key] !== undefined) {
      savedBySig.set(v.rawLine + "#" + cnt, itemObj.rolls[v.key]);
    }
  });
  mutateFn();
  const nextRaw = getRaw();
  const nextVars = extractVariableRanges(nextRaw).vars;
  const nextRolls = {};
  const seenNext = new Map();
  nextVars.forEach(v => {
    const cnt = (seenNext.get(v.rawLine) || 0) + 1;
    seenNext.set(v.rawLine, cnt);
    const sig = v.rawLine + "#" + cnt;
    if (savedBySig.has(sig)) {
      nextRolls[v.key] = savedBySig.get(sig);
    }
  });
  itemObj.rolls = nextRolls;
}

function buildMagicRareStatsText(itemObj) {
  if (!itemObj) return "";
  const list = [];
  if (Array.isArray(itemObj.prefixes)) itemObj.prefixes.forEach(p => { if (p && p.range) list.push(p.range); });
  if (Array.isArray(itemObj.suffixes)) itemObj.suffixes.forEach(s => { if (s && s.range) list.push(s.range); });
  return list.join(" · ");
}

function computeMagicRareMaxSockets(eq, bRule) {
  if (!eq || !bRule || !(bRule.maxSockets > 0)) return 0;
  if (["jave", "ajav", "tkni", "taxe", "tpot"].includes(bRule.type)) return 0;
  const raw = buildMagicRareStatsText(eq);
  const rolled = raw ? formatItemLinesWithRolls(raw, eq.rolls) : [];
  for (const line of rolled) {
    const clean = line.replace(/\[[^\]]+\]/g, "").trim();
    const sm = clean.match(/^(\d+)\s*孔$/);
    if (sm) return Math.min(bRule.maxSockets, Math.max(1, Number(sm[1])));
  }
  // Larzuk quest sockets when no socket prefix is chosen (2os max on Magic, 1os on Rare/Crafted)
  return eq.cat === "magic" ? Math.min(bRule.maxSockets, 2) : 1;
}

function getBagItemRawStats(bagItem, def) {
  if (!def) return "";
  if (def.isBlankMagic) return buildMagicRareStatsText(bagItem);
  return def.stats || "";
}

function getMagicCharmShortTag(bagItem, def) {
  if (!def) return "";
  const raw = getBagItemRawStats(bagItem, def);
  if (!raw) return (def.shortZh || def.size) + "(空)";
  const rolled = formatItemLinesWithRolls(raw, bagItem.rolls);
  const parts = [];
  for (const l of rolled) {
    const clean = l.replace(/\[[^\]]+\]/g, "").trim();
    let m;
    if ((m = clean.match(/\+(\d+)\s*([^\d%+\s·]+技能|[^\d%+\s·]+法术|[^\d%+\s·]+灵气|[^\d%+\s·]+技艺|[^\d%+\s·]+训练)/))) { parts.push("+" + m[1] + m[2].slice(0, 2)); }
    else if ((m = clean.match(/\+(\d+)\s*(?:命中值|AR)/i))) { parts.push(m[1] + "AR"); }
    else if ((m = clean.match(/\+(\d+)%\s*(?:快速打击恢复|FHR)/i))) { parts.push(m[1] + "FHR"); }
    else if ((m = clean.match(/\+(\d+)%\s*(?:高速跑步|FRW)/i))) { parts.push(m[1] + "FRW"); }
    else if ((m = clean.match(/\+(\d+)\s*生命/))) { parts.push(m[1] + "命"); }
    else if ((m = clean.match(/\+(\d+)\s*法力/))) { parts.push(m[1] + "蓝"); }
    else if ((m = clean.match(/\+(\d+)%\s*所有抗性/))) { parts.push(m[1] + "全"); }
    else if ((m = clean.match(/(火|冰|电|毒)[^\d+]*\+(\d+)%/))) { parts.push(m[2] + m[1]); }
    else if ((m = clean.match(/\+(\d+)%\s*.*MF/i))) { parts.push(m[1] + "MF"); }
    else if ((m = clean.match(/\+(\d+)\s*最大伤害/))) { parts.push(m[1] + "M"); }
  }
  return parts.length ? parts.slice(0, 2).join("/") : (def.shortZh + "(已选)");
}

const PD_CHAR_SLOTS = [
  { id: "weapon", area: "weapon", label: "主手武器", bg: "/images/ui/inventory_paperdoll_weapon.webp", tall: true },
  { id: "head", area: "head", label: "头盔", bg: "/images/ui/inventory_paperdoll_headarmor.webp" },
  { id: "offhand", area: "offhand", label: "副手/盾/魔典", bg: "/images/ui/inventory_paperdoll_shield.webp", tall: true },
  { id: "torso", area: "torso", label: "盔甲", bg: "/images/ui/inventory_paperdoll_chestarmor.webp", tall: true },
  { id: "gloves", area: "gloves", label: "手套", bg: "/images/ui/inventory_paperdoll_glove.webp" },
  { id: "belt", area: "belt", label: "腰带", bg: "/images/ui/inventory_paperdoll_belt.webp", mini: true },
  { id: "boots", area: "boots", label: "鞋子", bg: "/images/ui/inventory_paperdoll_boots.webp" },
  { id: "ring1", area: "ring1", label: "左戒指", bg: "/images/ui/inventory_paperdoll_ring.webp", mini: true },
  { id: "amulet", area: "amulet", label: "护身符(项链)", bg: "/images/ui/inventory_paperdoll_amulet.webp", mini: true },
  { id: "ring2", area: "ring2", label: "右戒指", bg: "/images/ui/inventory_paperdoll_ring.webp", mini: true }
];

const PD_MERC_SLOTS = [
  { id: "weapon", label: "主手武器", bg: "/images/ui/inventory_paperdoll_weapon.webp", tall: true },
  { id: "head", label: "佣兵头盔", bg: "/images/ui/inventory_paperdoll_headarmor.webp" },
  { id: "offhand", label: "佣兵副手", bg: "/images/ui/inventory_paperdoll_shield.webp", tall: true },
  { id: "torso", label: "佣兵盔甲", bg: "/images/ui/inventory_paperdoll_chestarmor.webp", gridSpan: 3 }
];

const PD_STORAGE_KEY = "d2r_paperdoll_builds_v1";
let pdSavedByClass = {};
let pdStateLoadedForClass = "";

function makeSetEq(nameEn) {
  return { cat: "set", id: nameEn, eth: false, sockets: [], rolls: {} };
}

function getDefaultClassSetLoadout(classId) {
  const empty = {
    head: null, amulet: null, weapon: null, torso: null, offhand: null,
    gloves: null, ring1: null, belt: null, ring2: null, boots: null
  };
  if (classId === "war") {
    return Object.assign(empty, {
      head: makeSetEq("Horazon's Countenance"),
      torso: makeSetEq("Horazon's Dominion"),
      gloves: makeSetEq("Horazon's Hold"),
      boots: makeSetEq("Horazon's Legacy"),
      offhand: makeSetEq("Horazon's Secrets")
    });
  }
  if (classId === "sor") {
    return Object.assign(empty, {
      head: makeSetEq("Tal Rasha's Horadric Crest"),
      amulet: makeSetEq("Tal Rasha's Adjudication"),
      torso: makeSetEq("Tal Rasha's Guardianship"),
      weapon: makeSetEq("Tal Rasha's Lidless Eye"),
      belt: makeSetEq("Tal Rasha's Fine-Spun Cloth")
    });
  }
  if (classId === "bar") {
    return Object.assign(empty, {
      head: makeSetEq("Immortal King's Will"),
      torso: makeSetEq("Immortal King's Soul Cage"),
      weapon: makeSetEq("Immortal King's Stone Crusher"),
      gloves: makeSetEq("Immortal King's Forge"),
      belt: makeSetEq("Immortal King's Detail"),
      boots: makeSetEq("Immortal King's Pillar")
    });
  }
  if (classId === "nec") {
    return Object.assign(empty, {
      head: makeSetEq("Trang-Oul's Guise"),
      torso: makeSetEq("Trang-Oul's Scales"),
      offhand: makeSetEq("Trang-Oul's Wing"),
      gloves: makeSetEq("Trang-Oul's Claws"),
      belt: makeSetEq("Trang-Oul's Girth")
    });
  }
  if (classId === "pal") {
    return Object.assign(empty, {
      head: makeSetEq("Griswold's Valor"),
      torso: makeSetEq("Griswold's Heart"),
      weapon: makeSetEq("Griswold's Redemption"),
      offhand: makeSetEq("Griswold's Honor")
    });
  }
  if (classId === "dru") {
    return Object.assign(empty, {
      head: makeSetEq("Aldur's Stony Gaze"),
      torso: makeSetEq("Aldur's Deception"),
      weapon: makeSetEq("Aldur's Rhythm"),
      boots: makeSetEq("Aldur's Advance")
    });
  }
  if (classId === "ama") {
    return Object.assign(empty, {
      head: makeSetEq("M'avina's True Sight"),
      torso: makeSetEq("M'avina's Embrace"),
      weapon: makeSetEq("M'avina's Caster"),
      gloves: makeSetEq("M'avina's Icy Clutch"),
      belt: makeSetEq("M'avina's Tenet")
    });
  }
  if (classId === "ass") {
    return Object.assign(empty, {
      head: makeSetEq("Natalya's Totem"),
      torso: makeSetEq("Natalya's Shadow"),
      weapon: makeSetEq("Natalya's Mark"),
      boots: makeSetEq("Natalya's Soul")
    });
  }
  return empty;
}

function getDefaultMercLoadout() {
  return {
    head: { cat: "unique", id: "Andariel's Visage", eth: true, sockets: ["r08"], rolls: {} },
    torso: { cat: "rw", id: "fortitude", baseCode: "uar", eth: true, sockets: [], rolls: {} },
    weapon: { cat: "rw", id: "infinity", baseCode: "7wc", eth: true, sockets: [], rolls: {} },
    offhand: null
  };
}

let pdCharLoadout = getDefaultClassSetLoadout("war");
let pdMercLoadout = getDefaultMercLoadout();
let pdActiveWeaponSet = 1;
let pdCharSwapLoadout = { weapon: null, offhand: null };

function cloneJsonSafe(val, fallback) {
  try { return JSON.parse(JSON.stringify(val)); } catch (e) { return fallback; }
}

function loadAllSavedPaperdollBuilds() {
  try {
    const raw = localStorage.getItem(PD_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") pdSavedByClass = parsed;
    }
  } catch (e) {
    pdSavedByClass = {};
  }
}

function savePaperdollState(classId) {
  const cid = classId || skActiveClassId;
  if (!cid || pdStateLoadedForClass !== cid) return;
  try {
    const vSel = document.getElementById("merc-variant-select");
    const mLvl = document.getElementById("merc-lvl-input");
    const cLvl = document.getElementById("pd-char-lvl");
    const ctaEl = document.getElementById("pd-cta-bo");
    const cAuraEl = document.getElementById("pd-char-aura");
    const dAuraEl = document.getElementById("pd-warlock-demon-aura");
    const dMlvlEl = document.getElementById("pd-warlock-demon-mlvl");
    const hexEl = document.getElementById("pd-warlock-hex-buff");
    const debuffEl = document.getElementById("pd-enemy-debuff");
    const maxEl = document.getElementById("pd-skill-max-mode");
    const mEnabledEl = document.getElementById("pd-merc-enabled");
    const mAuraEl = document.getElementById("pd-merc-aura-on");

    pdSavedByClass[cid] = {
      charLoadout: cloneJsonSafe(pdCharLoadout, getDefaultClassSetLoadout(cid)),
      swapLoadout: cloneJsonSafe(pdCharSwapLoadout, { weapon: null, offhand: null }),
      activeWeaponSet: pdActiveWeaponSet === 2 ? 2 : 1,
      mercLoadout: cloneJsonSafe(pdMercLoadout, getDefaultMercLoadout()),
      charBag: cloneJsonSafe(pdCharBag, []),
      bagNextUid: pdBagNextUid,
      statAlloc: cloneJsonSafe(pdStatAlloc, { str: 0, dex: 0, vit: 0, enr: 0 }),
      charLvl: cLvl ? Number(cLvl.value || 90) : 90,
      mercVariant: vSel && vSel.value ? vSel.value : "a2-might",
      mercLvl: mLvl ? Number(mLvl.value || 90) : 90,
      mercEnabled: mEnabledEl ? Boolean(mEnabledEl.checked) : true,
      mercAuraOn: mAuraEl ? Boolean(mAuraEl.checked) : true,
      ctaOn: ctaEl ? Boolean(ctaEl.checked) : true,
      charAura: cAuraEl ? cAuraEl.value : "none",
      demonAura: normalizeDemonAuraId(dAuraEl ? dAuraEl.value : "none"),
      demonMlvl: dMlvlEl ? Math.min(99, Math.max(1, Number(dMlvlEl.value || 96))) : 96,
      warlockHex: hexEl ? hexEl.value : "none",
      enemyDebuff: debuffEl ? debuffEl.value : "none",
      selectedSkillKey: pdSelectedSkillKey || "",
      maxMode: maxEl ? Boolean(maxEl.checked) : false
    };
    localStorage.setItem(PD_STORAGE_KEY, JSON.stringify(pdSavedByClass));
    if (!window.__cloudApplyingRemote) {
      localStorage.setItem("d2r-builds-local-updated-at", new Date().toISOString());
      if (typeof scheduleCloudSync === "function") scheduleCloudSync();
    }
  } catch (e) {}
}

function loadPaperdollStateForClass(classId) {
  const cid = classId || skActiveClassId;
  if (!cid) return;
  const saved = pdSavedByClass && pdSavedByClass[cid];
  if (saved && saved.charLoadout) {
    pdCharLoadout = Object.assign(
      { head: null, amulet: null, weapon: null, torso: null, offhand: null, gloves: null, ring1: null, belt: null, ring2: null, boots: null },
      cloneJsonSafe(saved.charLoadout, {})
    );
    pdCharSwapLoadout = Object.assign(
      { weapon: null, offhand: null },
      cloneJsonSafe(saved.swapLoadout, {})
    );
    pdActiveWeaponSet = saved.activeWeaponSet === 2 ? 2 : 1;
    pdMercLoadout = Object.assign(
      { head: null, torso: null, weapon: null, offhand: null },
      cloneJsonSafe(saved.mercLoadout, getDefaultMercLoadout())
    );
    pdCharBag = Array.isArray(saved.charBag) ? cloneJsonSafe(saved.charBag, []) : [];
    pdBagNextUid = Math.max(Number(saved.bagNextUid || 1), pdCharBag.length + 1);
    pdStatAlloc = Object.assign({ str: 0, dex: 0, vit: 0, enr: 0 }, cloneJsonSafe(saved.statAlloc, {}));
    pdSelectedSkillKey = saved.selectedSkillKey || "";

    const setVal = (id, v) => { const el = document.getElementById(id); if (el && v !== undefined) el.value = String(v); };
    const setChk = (id, v) => { const el = document.getElementById(id); if (el && v !== undefined) el.checked = Boolean(v); };
    setVal("pd-char-lvl", saved.charLvl || 90);
    if (saved.mercVariant) setVal("merc-variant-select", saved.mercVariant);
    setVal("merc-lvl-input", saved.mercLvl || 90);
    setChk("pd-merc-enabled", saved.mercEnabled !== undefined ? saved.mercEnabled : true);
    setChk("pd-merc-aura-on", saved.mercAuraOn !== undefined ? saved.mercAuraOn : true);
    setChk("pd-cta-bo", saved.ctaOn !== undefined ? saved.ctaOn : true);
    setVal("pd-char-aura", saved.charAura || "none");
    setVal("pd-warlock-demon-aura", normalizeDemonAuraId(saved.demonAura || "none"));
    setVal("pd-warlock-demon-mlvl", saved.demonMlvl || 96);
    setVal("pd-warlock-hex-buff", saved.warlockHex || "none");
    setVal("pd-enemy-debuff", saved.enemyDebuff || "none");
    setChk("pd-skill-max-mode", Boolean(saved.maxMode));
  } else {
    pdCharLoadout = getDefaultClassSetLoadout(cid);
    pdCharSwapLoadout = { weapon: null, offhand: null };
    pdActiveWeaponSet = 1;
    pdMercLoadout = getDefaultMercLoadout();
    pdCharBag = [];
    pdBagNextUid = 1;
    pdStatAlloc = { str: 0, dex: 0, vit: 0, enr: 0 };
    pdSelectedSkillKey = "";
    const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = String(v); };
    const setChk = (id, v) => { const el = document.getElementById(id); if (el) el.checked = Boolean(v); };
    setChk("pd-merc-enabled", true);
    setChk("pd-merc-aura-on", true);
    setVal("pd-char-aura", "none");
    setVal("pd-warlock-demon-aura", "none");
    setVal("pd-warlock-demon-mlvl", 96);
    setVal("pd-warlock-hex-buff", "none");
    setVal("pd-enemy-debuff", "none");
  }
  pdActiveTarget = "char";
  pdActiveBagUid = null;
  pdActiveSlot = pdCharLoadout.weapon ? "weapon" : "head";
  pdStateLoadedForClass = cid;
}

function switchPaperdollWeaponSet(targetSet) {
  const nextSet = targetSet === 2 ? 2 : 1;
  if (nextSet === pdActiveWeaponSet) return false;
  const prevWeap = pdCharLoadout.weapon || null;
  const prevOff = pdCharLoadout.offhand || null;
  pdCharLoadout.weapon = pdCharSwapLoadout.weapon || null;
  pdCharLoadout.offhand = pdCharSwapLoadout.offhand || null;
  pdCharSwapLoadout = { weapon: prevWeap, offhand: prevOff };
  pdActiveWeaponSet = nextSet;
  if (itData && pdData) {
    renderPaperdollAll();
  } else {
    renderWeaponSwapBar();
  }
  return true;
}

function togglePaperdollWeaponSet() {
  return switchPaperdollWeaponSet(pdActiveWeaponSet === 1 ? 2 : 1);
}

function applyPaperdollSwapPreset(presetKey) {
  let nextPair = { weapon: null, offhand: null };
  if (presetKey === "cta") {
    const shieldEq = skActiveClassId === "pal"
      ? { cat: "rw", id: "spirit", baseCode: "pab", eth: false, palModType: "res", palRes: 45, sockets: [], rolls: {} }
      : { cat: "rw", id: "spirit", baseCode: "uit", eth: false, sockets: [], rolls: {} };
    nextPair = {
      weapon: { cat: "rw", id: "call-to-arms", baseCode: "crs", eth: false, sockets: [], rolls: {} },
      offhand: shieldEq
    };
  } else if (presetKey === "mf") {
    nextPair = {
      weapon: { cat: "unique", id: "Blade of Ali Baba", eth: false, sockets: ["r24", "r24"], rolls: {} },
      offhand: { cat: "rw", id: "rhyme", baseCode: "xsh", eth: false, sockets: [], rolls: {} }
    };
  }
  if (pdActiveWeaponSet === 2) {
    pdCharLoadout.weapon = nextPair.weapon;
    pdCharLoadout.offhand = nextPair.offhand;
  } else {
    pdCharSwapLoadout = nextPair;
  }
  if (itData && pdData) {
    renderPaperdollAll();
  } else {
    renderWeaponSwapBar();
  }
}

function renderWeaponSwapBar() {
  const btn1 = document.getElementById("pd-wset-1");
  const btn2 = document.getElementById("pd-wset-2");
  const grid = document.getElementById("pd-char-grid");
  const prevEl = document.getElementById("pd-swap-preview");
  const isSet2 = pdActiveWeaponSet === 2;
  if (btn1) {
    btn1.classList.toggle("active", !isSet2);
    btn1.setAttribute("aria-pressed", String(!isSet2));
  }
  if (btn2) {
    btn2.classList.toggle("active", isSet2);
    btn2.setAttribute("aria-pressed", String(isSet2));
  }
  if (grid) {
    grid.classList.toggle("is-swap-active", isSet2);
  }
  if (prevEl) {
    const otherLabel = isSet2 ? "主手组 I" : "副手组 II";
    const wInfo = pdCharSwapLoadout.weapon ? resolveEquippedItemInfo(pdCharSwapLoadout.weapon, { isChar: true }) : null;
    const oInfo = pdCharSwapLoadout.offhand ? resolveEquippedItemInfo(pdCharSwapLoadout.offhand, { isChar: true }) : null;
    const names = [wInfo ? wInfo.titleZh : "", oInfo ? oInfo.titleZh : ""].filter(Boolean);
    prevEl.textContent = otherLabel + "：" + (names.length ? names.join(" + ") : "未装备");
    prevEl.title = prevEl.textContent;
  }
}

function computeRealCtaBoStats(charLvl, maxMode, clsObj) {
  const isCta = (eq) => Boolean(eq && eq.cat === "rw" && eq.id === "call-to-arms");
  const activeCta = isCta(pdCharLoadout.weapon) ? pdCharLoadout.weapon : (isCta(pdCharLoadout.offhand) ? pdCharLoadout.offhand : null);
  const swapCta = !activeCta
    ? (isCta(pdCharSwapLoadout.weapon) ? pdCharSwapLoadout.weapon : (isCta(pdCharSwapLoadout.offhand) ? pdCharSwapLoadout.offhand : null))
    : null;
  const ctaEq = activeCta || swapCta;
  if (!ctaEq || !itData || !pdData) {
    return { real: false, setNum: 0, isSwap: false, bcLvl: 0, boLvl: 11, boPct: 65, boDurSec: 130 };
  }
  const ctaOnActive = Boolean(activeCta);
  const setNum = ctaOnActive ? pdActiveWeaponSet : (pdActiveWeaponSet === 1 ? 2 : 1);
  const ctaLoadout = ctaOnActive
    ? pdCharLoadout
    : Object.assign({}, pdCharLoadout, { weapon: pdCharSwapLoadout.weapon || null, offhand: pdCharSwapLoadout.offhand || null });
  const ctaTot = aggregateLoadoutStats(ctaLoadout, true, charLvl, pdCharBag, { ctaSkillBonus: 0, maxMode });
  const info = resolveEquippedItemInfo(ctaEq, { actorLvl: charLvl, isChar: true });
  let baseBo = 6;
  let baseBc = 6;
  if (info && Array.isArray(info.rolledLines)) {
    for (const line of info.rolledLines) {
      const mBo = String(line).match(/\+(\d+)\s*战斗体制/);
      if (mBo) baseBo = Math.max(1, Number(mBo[1]));
      const mBc = String(line).match(/\+(\d+)\s*战斗指挥/);
      if (mBc) baseBc = Math.max(1, Number(mBc[1]));
    }
  }
  let bcLvl = baseBc + ctaTot.skills;
  let boLvl = baseBo + ctaTot.skills + 1;
  if (skActiveClassId === "bar" && clsObj) {
    const bBuild = getClassBuild("bar");
    const hardBo = Number((bBuild && bBuild["Battle Orders"]) || 0);
    const hardBc = Number((bBuild && bBuild["Battle Command"]) || 0);
    const boSk = (clsObj.skills || []).find(s => s.key === "Battle Orders");
    const bcSk = (clsObj.skills || []).find(s => s.key === "Battle Command");
    const boTab = boSk ? (ctaTot.tabSkills[boSk.page] || 0) : 0;
    const bcTab = bcSk ? (ctaTot.tabSkills[bcSk.page] || 0) : 0;
    bcLvl = hardBc + Math.min(3, baseBc) + ctaTot.skills + (ctaTot.classSkills || 0) + bcTab;
    boLvl = hardBo + Math.min(3, baseBo) + ctaTot.skills + (ctaTot.classSkills || 0) + boTab + 1;
  }
  const boPct = 32 + boLvl * 3;
  const boDurSec = 20 + boLvl * 10;
  return { real: true, setNum, isSwap: !ctaOnActive, bcLvl, boLvl, boPct, boDurSec, allSkillsOnCtaSet: ctaTot.skills };
}

function getBaseRule(code) {
  return (pdData && pdData.baseRules && pdData.baseRules[code]) || null;
}

function normalizeDemonAuraId(v) {
  const s = String(v || "none").trim();
  if (!s || s === "none") return "none";
  return s.replace(/-\d+$/, "");
}

function computeBoundDemonAura(rawAuraId, rawMlvl) {
  const id = normalizeDemonAuraId(rawAuraId);
  if (id === "none") return null;
  const mlvl = Math.min(99, Math.max(1, Math.floor(Number(rawMlvl) || 96)));
  const dm12 = (L, a, b) => a + Math.floor(((b - a) * Math.floor((110 * L) / (L + 6))) / 100);
  if (id === "vigor") {
    const lvl = Math.max(1, Math.floor(mlvl / 7));
    const frw = Math.min(50, dm12(lvl, 7, 50));
    const stamPct = 50 + (lvl - 1) * 25;
    return { id, name: "活力", lvl, divisor: 7, mlvl, frw, detail: "全队 +" + frw + "% 高跑 FRW · +" + stamPct + "% 耐力上限与恢复 (mlvl " + mlvl + "/7)" };
  }
  if (id === "fana") {
    const lvl = Math.max(1, Math.floor(mlvl / 8));
    const eias = dm12(lvl, 10, 40);
    const physEdPct = Math.floor((50 + (lvl - 1) * 17) / 2);
    const arPct = 40 + (lvl - 1) * 5;
    return { id, name: "狂热", lvl, divisor: 8, mlvl, eias, physEdPct, arPct, detail: "全队 +" + eias + "% EIAS 攻速 · +" + physEdPct + "% 物理伤 · +" + arPct + "% AR (mlvl " + mlvl + "/8)" };
  }
  if (id === "conc") {
    const lvl = Math.max(1, Math.floor(mlvl / 6));
    const physEdPct = 60 + (lvl - 1) * 15;
    const hammerEdPct = Math.floor(physEdPct / 2);
    return { id, name: "专注", lvl, divisor: 6, mlvl, physEdPct, hammerEdPct, detail: "全队 +" + physEdPct + "% 物理增伤 (祝福之锤 +" + hammerEdPct + "% · mlvl " + mlvl + "/6，由原力量光环映射)" };
  }
  if (id === "hf") {
    const lvl = Math.max(1, Math.floor(mlvl / 7));
    const slowPct = Math.min(60, dm12(lvl, 25, 60));
    return { id, name: "圣冰", lvl, divisor: 7, mlvl, slowPct, detail: "大范围冰冷减速 -" + slowPct + "% 控场 (mlvl " + mlvl + "/7)" };
  }
  if (id === "thorns") {
    const lvl = Math.max(1, Math.floor(mlvl / 7));
    const retPct = 250 + (lvl - 1) * 40;
    const flatRet = computeScaledValue([4, 4, 8, 12, 16, 20], 8, lvl);
    return { id, name: "荆棘", lvl, divisor: 7, mlvl, detail: "近战受击反伤 +" + retPct + "% + 固定 " + flatRet + " 物理伤 (mlvl " + mlvl + "/7)" };
  }
  if (id === "might") {
    const lvl = Math.max(1, Math.floor(mlvl / 6));
    const physEdPct = 30 + lvl * 10;
    return { id, name: "力量", lvl, divisor: 6, mlvl, physEdPct, detail: "全队 +" + physEdPct + "% 物理伤害 (mlvl " + mlvl + "/6)" };
  }
  if (id === "conv") {
    const lvl = Math.max(1, Math.floor(mlvl / 8));
    const convRes = Math.min(150, 25 + lvl * 5);
    const convDef = Math.min(97, dm12(lvl, 40, 100));
    return { id, name: "信念", lvl, divisor: 8, mlvl, convRes, convDef, detail: "-" + convRes + "% 敌火/冰/电抗 · -" + convDef + "% 敌防 (mlvl " + mlvl + "/8)" };
  }
  if (id === "ba") {
    const lvl = Math.max(1, Math.floor(mlvl / 5));
    const arPct = 60 + lvl * 15;
    return { id, name: "祝福瞄准", lvl, divisor: 5, mlvl, arPct, detail: "全队 +" + arPct + "% 攻击准确率 AR (mlvl " + mlvl + "/5)" };
  }
  return null;
}

function isMercEnabled() {
  const el = document.getElementById("pd-merc-enabled");
  return el ? Boolean(el.checked) : true;
}

function syncMercEnabledUi(enabled) {
  const card = document.getElementById("pd-merc-card");
  if (card) card.classList.toggle("merc-disabled", !enabled);
  ["pd-merc-aura-on", "merc-lvl-input", "merc-variant-select"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = !enabled;
  });
}

function getCurrentMercVariant() {
  const vSel = document.getElementById("merc-variant-select");
  const vid = vSel ? vSel.value : "a2-might";
  return MERC_VARIANTS.find(v => v.id === vid) || MERC_VARIANTS[0];
}

function getSlotRuleDescription(target, slotId) {
  if (target === "char") {
    const cid = skActiveClassId;
    if (slotId === "offhand") {
      const wEq = pdCharLoadout.weapon;
      const wRule = wEq ? getEquippedBaseRule(wEq) : null;
      if (cid === "war") {
        return "术士专属（悬浮精通）：即使主手握持双手武器，副手依然可装备术士专属魔典 (Grimoire) 或常规盾牌";
      }
      if (cid === "bar") {
        return "野蛮人专属：副手可装备盾牌，或双持任意单手近战武器 / 双手剑 (1or2handed)";
      }
      if (cid === "ass") {
        return "刺客专属：主手装备刺客爪时，副手可双持第二把刺客爪，或装备常规盾牌";
      }
      if (wRule && wRule.twoHanded) {
        return "⚠️ 当前主手已装备双手武器（" + wRule.nameZh + "），副手槽位已被占用锁定";
      }
      return "角色副手：可装备盾牌及本职业专属副手（圣骑盾/死灵盾/术士魔典）";
    }
    return "仅显示符合当前部位且满足本职业（" + cid.toUpperCase() + "）专属限制的装备";
  } else {
    const merc = getCurrentMercVariant();
    if (slotId === "weapon") {
      if (merc.act === 1) return "Act 1 萝格斥候武器限制：仅限装备【弓 / 亚马逊专用弓】（不可用十字弓）";
      if (merc.act === 2) return "Act 2 沙漠米山武器限制：仅限装备【长柄武器 (Polearm) / 长矛 (Spear) / 标枪 (Javelin)】";
      if (merc.act === 3) return "Act 3 东方铁狼武器限制：仅限装备【单手剑 (1H Sword)】";
      if (merc.id === "a5-frenzy") return "Act 5 双持狂乱野蛮人武器限制：主手仅限【单手剑 或 可单手握持的双手剑】";
      return "Act 5 战吼野蛮人武器限制：仅限装备【单手剑 或 双手剑】";
    }
    if (slotId === "offhand") {
      if (merc.act === 1 || merc.act === 2 || merc.id === "a5-bash") {
        return "⚠️ 该流派佣兵无法使用副手槽位（仅 Act 3 铁狼可拿盾牌、Act 5 狂乱可副手拿单手剑）";
      }
      if (merc.act === 3) return "Act 3 东方铁狼副手限制：仅限装备【常规盾牌】（不可用职业专属盾）";
      if (merc.id === "a5-frenzy") return "Act 5 双持狂乱野蛮人副手限制：仅限装备第二把【单手剑】";
    }
    if (slotId === "head" && merc.act === 5) return "Act 5 野蛮人佣兵头盔：可装备常规头盔/头环，也可装备【野蛮人专属头盔】";
    return "佣兵防具槽：可装备任意非职业专属头盔/盔甲";
  }
}

function getEquippedBaseRule(eq) {
  if (!eq || !pdData) return null;
  if (eq.cat === "unique") {
    const m = pdData.uniqueMeta && pdData.uniqueMeta[eq.id];
    return m ? getBaseRule(m.code) : null;
  }
  if (eq.cat === "set") {
    const m = pdData.setMeta && pdData.setMeta[eq.id];
    return m ? getBaseRule(m.code) : null;
  }
  if (eq.cat === "craft") {
    const c = getCraftedItemDef(eq.id);
    return c && c.code ? getBaseRule(c.code) : null;
  }
  if (eq.cat === "rw" || eq.cat === "base" || eq.cat === "magic" || eq.cat === "rare") {
    return eq.baseCode ? getBaseRule(eq.baseCode) : null;
  }
  return null;
}

function isOffhandSlotLocked(target) {
  if (target === "merc") {
    const merc = getCurrentMercVariant();
    return !(merc.act === 3 || merc.id === "a5-frenzy");
  }
  const wEq = pdCharLoadout.weapon;
  const wRule = getEquippedBaseRule(wEq);
  if (!wRule || !wRule.twoHanded) return false;
  if (skActiveClassId === "war") return false; // Warlock Levitation Mastery allows Grimoire with 2H weapon
  if (skActiveClassId === "bar" && wRule.oneOrTwoHanded) return false; // Barbarian 1or2handed sword
  return true;
}

function isBaseRuleLegalForTargetSlot(target, slotId, bRule) {
  if (!bRule) return false;
  if (target === "char") {
    const cid = skActiveClassId;
    if (bRule.classOnly && bRule.classOnly !== cid) return false;
    if (slotId === "head") return bRule.slot === "head";
    if (slotId === "torso") return bRule.slot === "torso";
    if (slotId === "gloves") return bRule.slot === "gloves";
    if (slotId === "boots") return bRule.slot === "boots";
    if (slotId === "belt") return bRule.slot === "belt";
    if (slotId === "weapon") return bRule.slot === "weapon";
    if (slotId === "offhand") {
      const wRule = getEquippedBaseRule(pdCharLoadout.weapon);
      if (wRule && wRule.twoHanded) {
        if (cid === "war") return bRule.type === "grim";
        if (cid === "bar" && wRule.oneOrTwoHanded) {
          return bRule.slot === "offhand" || (bRule.slot === "weapon" && (!bRule.twoHanded || bRule.oneOrTwoHanded));
        }
        return false;
      }
      if (bRule.slot === "offhand") return true;
      if (cid === "bar" && bRule.slot === "weapon") {
        return (!bRule.twoHanded || bRule.oneOrTwoHanded) && !["bow", "xbow", "pole", "spea", "staf", "wand"].includes(bRule.type);
      }
      if (cid === "ass" && (bRule.type === "h2h" || bRule.type === "h2h2")) {
        return !wRule || wRule.type === "h2h" || wRule.type === "h2h2";
      }
      return false;
    }
    return false;
  } else {
    const merc = getCurrentMercVariant();
    if (slotId === "head") {
      if (bRule.slot !== "head") return false;
      if (bRule.classOnly) return merc.act === 5 && bRule.classOnly === "bar";
      return true;
    }
    if (slotId === "torso") return bRule.slot === "torso" && !bRule.classOnly;
    if (slotId === "weapon") {
      if (bRule.slot !== "weapon") return false;
      if (merc.act === 1) return bRule.type === "bow" || bRule.type === "abow";
      if (merc.act === 2) return ["pole", "spea", "jave"].includes(bRule.type) && !bRule.classOnly;
      if (merc.act === 3) return bRule.type === "swor" && !bRule.twoHanded;
      if (merc.id === "a5-frenzy") return bRule.type === "swor" && (!bRule.twoHanded || bRule.oneOrTwoHanded);
      if (merc.id === "a5-bash") return bRule.type === "swor";
      return false;
    }
    if (slotId === "offhand") {
      if (merc.act === 3) return bRule.type === "shie";
      if (merc.id === "a5-frenzy") return bRule.type === "swor" && (!bRule.twoHanded || bRule.oneOrTwoHanded);
      return false;
    }
    return false;
  }
}

function doesRwTypeMatchBase(rw, bRule) {
  if (!bRule || !rw) return false;
  const t = bRule.type;
  const tokens = String(rw.basesZh || "").split(/\s*\/\s*/).map(s => s.trim()).filter(Boolean);
  if (!tokens.length) return false;
  return tokens.some(rt => {
    if (rt === "头盔") return bRule.slot === "head";
    if (rt === "德鲁伊头盔") return t === "pelt";
    if (rt === "盔甲") return bRule.slot === "torso";
    if (rt === "盾牌") return ["shie", "head", "ashd", "grim"].includes(t);
    if (rt === "圣骑士盾" || rt === "圣骑士盾牌") return t === "ashd";
    if (rt === "死灵盾") return t === "head";
    if (rt === "术士魔典" || rt === "魔典") return t === "grim";
    if (rt === "剑") return t === "swor";
    if (rt === "斧" || rt === "斧头") return t === "axe";
    if (rt === "锤" || rt === "锤子") return t === "hamm" || t === "mace";
    if (rt === "钉头锤" || rt === "钉锤") return t === "mace";
    if (rt === "棍棒" || rt === "木棒") return t === "club";
    if (rt === "权杖") return t === "scep";
    if (rt === "双手法杖" || rt === "法杖" || rt === "双手杖") return t === "staf";
    if (rt === "死灵法杖" || rt === "手杖" || rt === "魔杖") return t === "wand";
    if (rt === "长柄" || rt === "长柄武器") return t === "pole";
    if (rt === "矛" || rt === "长矛") return t === "spea" || t === "aspe";
    if (rt === "弓弩" || rt === "远程武器" || rt === "弓") return ["bow", "abow", "xbow"].includes(t);
    if (rt === "匕首") return t === "knif";
    if (rt === "爪" || rt === "拳剑" || rt === "刺客爪") return t === "h2h" || t === "h2h2";
    if (rt === "近战武器") return bRule.slot === "weapon" && !["bow", "abow", "xbow", "orb", "wand"].includes(t);
    if (rt === "武器") return bRule.slot === "weapon";
    return false;
  });
}

function getRunewordStatLines(rw, bRule) {
  if (!rw) return [];
  if (Array.isArray(rw.stats)) return rw.stats.slice();
  if (Array.isArray(rw.statGroups)) {
    const slot = bRule ? bRule.slot : "weapon";
    const out = [];
    for (const g of rw.statGroups) {
      const lbl = String(g.label || "");
      const items = Array.isArray(g.items) ? g.items : [];
      if (lbl.includes("通用") || lbl.includes("3.4 赛季")) {
        out.push(...items);
      } else if (slot === "weapon" && (lbl.includes("武器") || lbl.includes("剑"))) {
        out.push(...items);
      } else if (slot === "offhand" && lbl.includes("盾牌")) {
        out.push(...items);
      } else if (slot === "torso" && lbl.includes("盔甲")) {
        out.push(...items);
      } else if (slot === "head" && lbl.includes("头盔")) {
        out.push(...items);
      }
    }
    return out;
  }
  if (typeof rw.stats === "string") return rw.stats.split(/\s*(?:·|\||\n)\s*/).filter(Boolean);
  return [];
}

function expandCompositeStatLines(statsText) {
  const rawParts = Array.isArray(statsText)
    ? statsText.flatMap(x => String(x || "").split(/\s*(?:·|\||\n)\s*/))
    : String(statsText || "").split(/\s*(?:·|\||\n)\s*/);
  const out = [];
  for (const raw of rawParts) {
    const line = String(raw || "").trim();
    if (!line) continue;
    // 1) Split independent stats joined by " / " (e.g. "+10–15 力量 / +10–15 敏捷", "+2–6 战斗指挥 / +1–6 战斗体制 / +1–4 战嚎")
    const normSlash = line.replace(/）\//g, "） / ");
    const subParts = normSlash.split(/\s+\/\s+(?=[+-]?\d|需求|伤害)/).map(x => x.trim()).filter(Boolean);
    for (const p of subParts) {
      let m;
      // 2) Expand shorthand multi-element / multi-stat roll lines into independently adjustable lines
      if ((m = p.match(/^冰\/电\/火抗性\s*(.+)$/))) {
        out.push("冰冷抗性 " + m[1], "闪电抗性 " + m[1], "火焰抗性 " + m[1]);
      } else if ((m = p.match(/^([+-]?\d+(?:[–-]\d+)?%)\s*火\/电抗$/))) {
        out.push("火焰抗性 " + m[1], "闪电抗性 " + m[1]);
      } else if ((m = p.match(/^([+-]?\d+(?:[–-]\d+)?%)\s*冰\/火\/电伤$/))) {
        out.push(m[1] + " 冰冷技能伤害", m[1] + " 火焰技能伤害", m[1] + " 闪电技能伤害");
      } else if ((m = p.match(/^([+-]?\d+(?:[–-]\d+)?%)\s*电\/火伤$/))) {
        out.push(m[1] + " 闪电技能伤害", m[1] + " 火焰技能伤害");
      } else if ((m = p.match(/^([+-]?\d+(?:[–-]\d+)?%)\s*冰冷\s*\/\s*闪电\s*\/\s*火焰技能伤害$/))) {
        out.push(m[1] + " 冰冷技能伤害", m[1] + " 闪电技能伤害", m[1] + " 火焰技能伤害");
      } else if ((m = p.match(/^伤害\/魔伤减少\s*(.+)$/))) {
        out.push("物理伤害减少 " + m[1] + " (PDR)", "魔法伤害减少 " + m[1] + " (MDR)");
      } else if ((m = p.match(/^(\d+(?:[–-]\d+)?)\s*EK\/LK$/i))) {
        out.push("+" + m[1] + " 每杀一个敌人恢复法力 (MAEK)", "+" + m[1] + " 每杀一个敌人恢复生命 (LAEK)");
      } else if ((m = p.match(/^(\+\d+(?:[–-]\d+)?)\s*击杀生命\/法力$/))) {
        out.push(m[1] + " 每杀一个敌人恢复生命 (LAEK)", m[1] + " 每杀一个敌人恢复法力 (MAEK)");
      } else if ((m = p.match(/^(\+\d+(?:[–-]\d+)?)\s*召唤\/毒素与白骨\/诅咒技能$/))) {
        out.push(m[1] + " 召唤技能", m[1] + " 毒素与白骨技能", m[1] + " 诅咒技能");
      } else if ((m = p.match(/^(\+\d+(?:[–-]\d+)?)\s*冰\/火\/电支配(?:（.*?）)?$/))) {
        out.push(m[1] + " 冰冷支配", m[1] + " 火焰支配", m[1] + " 闪电支配");
      } else if ((m = p.match(/^(\+\d+(?:[–-]\d+)?)\s*火焰波\s*\/\s*火焰之环$/))) {
        out.push(m[1] + " 火焰波", m[1] + " 火焰之环");
      } else if ((m = p.match(/^(\+\d+(?:[–-]\d+)?)\s*血沸\/吞噬\/恶魔精通$/))) {
        out.push(m[1] + " 血沸", m[1] + " 吞噬", m[1] + " 恶魔精通");
      } else {
        out.push(p);
      }
    }
  }
  return out;
}

function extractVariableRanges(statsText) {
  const lines = expandCompositeStatLines(statsText);
  const vars = [];
  lines.forEach((line, idx) => {
    if (/^[+-]?\d+\s*[–-]\s*\d+\s*(?:火焰|冰冷|闪电|毒素|魔法)?伤害/i.test(line)) return;
    if (/附加\s*\d+\s*[–-]\s*\d+/i.test(line)) return;
    const m = line.match(/([+-]?)(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)(%?)/);
    if (m) {
      const a = Number(m[2]);
      const b = Number(m[3]);
      if (b > a) {
        const hasDec = m[2].includes(".") || m[3].includes(".");
        const invertBest = /自身\s*-|自身物理承受伤害/.test(line);
        vars.push({
          key: "L" + idx,
          lineIdx: idx,
          rawLine: line,
          prefix: m[1] || "",
          min: a,
          max: b,
          best: invertBest ? a : b,
          invertBest,
          step: hasDec ? 0.125 : 1,
          unit: m[4] || ""
        });
      }
    }
  });
  return { lines, vars };
}

function computePerLevelDisplayValue(line, actorLvl) {
  const lvl = Math.max(1, Math.min(99, Math.floor(Number(actorLvl) || 90)));
  const str = String(line || "");
  let m;
  if ((m = str.match(/([+-]?)\(\s*(\d+(?:\.\d+)?)(%?)\s*\*\s*等级\s*\)(%?)/))) {
    const rate = Number(m[2]);
    const pct = m[3] || m[4] || "";
    if (Number.isFinite(rate) && rate > 0) {
      const sign = m[1] === "-" ? "-" : (m[1] === "+" || !/攻击者受到/.test(str) ? "+" : "");
      return sign + Math.floor(rate * lvl) + pct;
    }
  }
  if ((m = str.match(/([+-]?)(\d+(?:\.\d+)?)(%?)\s*\/\s*级/))) {
    const rate = Number(m[2]);
    const pct = m[3] || "";
    if (Number.isFinite(rate) && rate > 0) {
      return (m[1] || "+") + Math.floor(rate * lvl) + pct;
    }
  }
  if ((m = str.match(/(\d+(?:\.\d+)?)(%)\s*（随等级提升）/))) {
    const rate = Number(m[1]);
    if (Number.isFinite(rate) && rate > 0) {
      return "+" + Math.floor(rate * lvl) + m[2];
    }
  }
  return "";
}

function renderStatLineWithLvlCalcHtml(line, actorLvl) {
  const calc = computePerLevelDisplayValue(line, actorLvl);
  if (!calc) return escapeHtml(line);
  const lvl = Math.max(1, Math.min(99, Math.floor(Number(actorLvl) || 90)));
  return '<span class="lvl-calc-badge" title="按当前 Lv.' + lvl + ' 实时折算">' + escapeHtml(calc) + '</span>' + escapeHtml(line);
}

function formatItemLinesWithRolls(statsText, rollsObj) {
  const { lines, vars } = extractVariableRanges(statsText);
  const varByIdx = new Map(vars.map(v => [v.lineIdx, v]));
  return lines.map((line, idx) => {
    const v = varByIdx.get(idx);
    if (!v) return line;
    const curVal = (rollsObj && rollsObj[v.key] !== undefined) ? Number(rollsObj[v.key]) : v.best;
    return line.replace(/([+-]?)\d+(?:\.\d+)?\s*[–-]\s*\d+(?:\.\d+)?/, "$1" + curVal) + " [" + v.min + "–" + v.max + "]";
  });
}

function getBaseRuleIcon(bRule) {
  if (!bRule) return "/images/ui/gemsocket.webp";
  if (pdData && pdData.baseIcons && pdData.baseIcons[bRule.code]) {
    return pdData.baseIcons[bRule.code];
  }
  const baseMatch = (itData && itData.baseItems || []).find(bi => bi.nameEn.toLowerCase() === bRule.nameEn.toLowerCase());
  if (baseMatch && baseMatch.icon) return baseMatch.icon;
  const typeFallback = {
    swor: "/images/items/weapon/sword/crystal_sword.webp", mace: "/images/items/weapon/mace/flail.webp",
    scep: "/images/items/weapon/scepter/war_scepter.webp", axe: "/images/items/weapon/axe/war_axe.webp",
    taxe: "/images/items/weapon/axe/throwing_axe.webp", club: "/images/items/weapon/club/club.webp",
    hamm: "/images/items/weapon/hammer/war_hammer.webp", knif: "/images/items/weapon/knife/dagger.webp",
    tkni: "/images/items/weapon/knife/throwing_knife.webp", jave: "/images/items/weapon/javelin/javelin.webp",
    ajav: "/images/items/weapon/javelin/maiden_javelin.webp", spea: "/images/items/weapon/spear/spear.webp",
    aspe: "/images/items/weapon/spear/maiden_spear.webp", pole: "/images/items/weapon/polearm/scythe.webp",
    staf: "/images/items/weapon/staff/war_staff.webp", wand: "/images/items/weapon/wand/bone_wand.webp",
    orb: "/images/items/weapon/orb/eagle_orb.webp", bow: "/images/items/weapon/bow/long_bow.webp",
    abow: "/images/items/weapon/bow/stag_bow.webp", xbow: "/images/items/weapon/bow/crossbow.webp",
    h2h: "/images/items/weapon/h2h/claws.webp", h2h2: "/images/items/weapon/h2h/claws.webp",
    ashd: "/images/items/armor/shield/targe.webp", shie: "/images/items/armor/shield/kite_shield.webp",
    grim: "/images/items/armor/grimoires/grimoire.webp", head: "/images/items/armor/voodoo_head/preserved_head.webp",
    tors: "/images/items/armor/armor/light_plate.webp", helm: "/images/items/armor/helmet/helm.webp",
    phlm: "/images/items/armor/helmet/avenger_guard.webp", pelt: "/images/items/armor/pelt/wolf_head.webp",
    circ: "/images/items/armor/circlet/diadem.webp", glov: "/images/items/armor/glove/heavy_gloves.webp",
    boot: "/images/items/armor/boot/chain_boots.webp", belt: "/images/items/armor/belt/light_belt.webp"
  };
  return typeFallback[bRule.type] || "/images/items/weapon/sword/crystal_sword.webp";
}

function computeArmorPieceDefense(bRule, eq, itemOwnDefEd, totalDefEd, flatDef) {
  if (!bRule || !(bRule.maxDef > 0)) return 0;
  const isRwOrBase = Boolean(eq && (eq.cat === "rw" || eq.cat === "base"));
  const supDef = isRwOrBase ? Math.min(15, Math.max(0, Math.floor(Number(eq.supDef || 0)))) : 0;
  const hasSpawnDefEd = isRwOrBase ? (supDef > 0) : (itemOwnDefEd > 0);
  const rawBase = bRule.maxDef + (hasSpawnDefEd ? 1 : 0);
  const ethBase = (eq && eq.eth) ? Math.floor((rawBase * 3) / 2) : rawBase;
  return Math.floor((ethBase * (100 + totalDefEd)) / 100) + flatDef;
}

function isCustomJewelSocket(entry) {
  return Boolean(entry && typeof entry === "object" && (entry.customJewel === "magic" || entry.customJewel === "rare"));
}

function getJewelAffixDef(kind, id) {
  const ja = pdData && pdData.jewelAffixes;
  if (!ja) return null;
  const arr = kind === "pre" ? (ja.prefixes || []) : (ja.suffixes || []);
  return arr.find(x => x.id === id) || null;
}

function clampJewelAffixVal(def, val, isRare) {
  if (!def) return 0;
  const hi = isRare ? (def.rareMax || def.max) : def.max;
  const n = Number(val);
  if (!Number.isFinite(n)) return hi;
  return Math.min(hi, Math.max(def.min, Math.floor(n)));
}

function resolveCustomJewelInfo(entry) {
  if (!isCustomJewelSocket(entry)) return null;
  const isRare = entry.customJewel === "rare";
  const parts = [];
  (Array.isArray(entry.pre) ? entry.pre : []).slice(0, isRare ? 3 : 1).forEach(item => {
    if (!item || !item.id) return;
    const def = getJewelAffixDef("pre", item.id);
    if (!def) return;
    parts.push(def.fmt.replace("{v}", String(clampJewelAffixVal(def, item.val, isRare))));
  });
  (Array.isArray(entry.suf) ? entry.suf : []).slice(0, isRare ? 3 : 1).forEach(item => {
    if (!item || !item.id) return;
    const def = getJewelAffixDef("suf", item.id);
    if (!def || (isRare && def.magicOnly)) return;
    parts.push(def.fmt.replace("{v}", String(clampJewelAffixVal(def, item.val, isRare))));
  });
  return {
    nameZh: isRare ? "自定义黄珠宝" : "自定义蓝珠宝",
    icon: isRare ? "/images/items/misc/body_part/fragment_lightning.webp" : "/images/items/misc/body_part/fragment_magic.webp",
    bonusText: parts.join(" · ")
  };
}

function getSocketableBonusText(sockEntry, bRule) {
  if (isCustomJewelSocket(sockEntry)) {
    const jInfo = resolveCustomJewelInfo(sockEntry);
    return jInfo ? jInfo.bonusText : "";
  }
  if (!pdData || !Array.isArray(pdData.socketables)) return "";
  const s = pdData.socketables.find(x => x.id === sockEntry);
  if (!s) return "";
  const applyMode = bRule ? bRule.gemApplyType : 0;
  if (applyMode === 2) return s.shield;
  if (applyMode === 1) return s.helm;
  return s.weapon;
}

function isEquippedItemLegal(target, slotId, eq) {
  if (!eq || !pdData) return true;
  if (["amulet", "ring1", "ring2"].includes(slotId)) return true;
  const bRule = getEquippedBaseRule(eq);
  if (!bRule) return false;
  return isBaseRuleLegalForTargetSlot(target, slotId, bRule);
}

let pdLastLevitateReq = { lvl: 0, pct: 0 };
let pdLastHoverCtx = { charStr: 0, charDex: 0, mercStr: 0, mercDex: 0, charSetCounts: new Map(), mercSetCounts: new Map() };

function resolveEquippedItemInfo(eq, opts) {
  if (!eq || !itData || !pdData) return null;
  const bRule = getEquippedBaseRule(eq);
  const clsObj = getActiveClassObj();
  let titleZh = "", titleEn = "", icon = "", rawStats = "", maxSocks = 0, qualityClass = "q-unique", setObj = null, pieceObj = null;

  if (eq.cat === "unique") {
    const u = (itData.uniqueItems || []).find(x => x.nameEn === eq.id);
    if (!u) return null;
    titleZh = pickLangTitle(u);
    titleEn = u.nameEn;
    icon = u.icon || "";
    rawStats = u.stats || "";
    const m = pdData.uniqueMeta && pdData.uniqueMeta[u.nameEn];
    maxSocks = m ? m.maxSockets : 0;
    qualityClass = "q-unique";
  } else if (eq.cat === "set") {
    let foundPiece = null;
    for (const s of (itData.setItems || [])) {
      const p = ((s.detail && s.detail.pieces) || []).find(x => x.nameEn === eq.id);
      if (p) { foundPiece = p; setObj = s; break; }
    }
    if (!foundPiece) return null;
    pieceObj = foundPiece;
    titleZh = pickLangTitle(foundPiece);
    titleEn = foundPiece.nameEn;
    icon = foundPiece.icon || (setObj && setObj.icon) || "";
    rawStats = (foundPiece.stats || []).join(" · ");
    const m = pdData.setMeta && pdData.setMeta[foundPiece.nameEn];
    maxSocks = m ? m.maxSockets : 0;
    qualityClass = "q-set";
  } else if (eq.cat === "rw") {
    const rw = (rwList || []).find(x => x.id === eq.id);
    if (!rw) return null;
    titleZh = pickLangTitle(rw) + (bRule ? (" [" + bRule.nameZh + "]") : "");
    titleEn = rw.name;
    icon = getBaseRuleIcon(bRule);
    rawStats = getRunewordStatLines(rw, bRule).join(" · ");
    maxSocks = 0;
    qualityClass = "q-rw";
  } else if (eq.cat === "craft") {
    const c = getCraftedItemDef(eq.id);
    if (!c) return null;
    titleZh = "[手工] " + c.nameZh.replace(/\s*\([^)]*\)$/, "");
    titleEn = c.nameEn;
    icon = c.icon || "/images/items/misc/amulet/amulet1.webp";
    rawStats = buildCraftedRawStatsText(eq, clsObj);
    maxSocks = (c.maxSockets > 0 && bRule) ? computeMagicRareMaxSockets(eq, bRule) : (c.maxSockets || 0);
    qualityClass = "q-craft";
  } else if (eq.cat === "magic" || eq.cat === "rare") {
    const isMagic = eq.cat === "magic";
    const tag = isMagic ? "[蓝装] " : "[黄装] ";
    if (bRule) {
      titleZh = tag + (eq.eth ? "无形" : "") + bRule.nameZh;
      titleEn = (isMagic ? "Magic " : "Rare ") + bRule.nameEn;
      icon = getBaseRuleIcon(bRule);
    } else if (String(eq.id || "").includes("amulet")) {
      titleZh = tag + "护身符(项链)";
      titleEn = isMagic ? "Magic Amulet" : "Rare Amulet";
      icon = "/images/items/misc/amulet/amulet2.webp";
    } else if (String(eq.id || "").includes("ring")) {
      titleZh = tag + "戒指";
      titleEn = isMagic ? "Magic Ring" : "Rare Ring";
      icon = "/images/items/misc/ring/ring2.webp";
    } else {
      return null;
    }
    rawStats = buildMagicRareStatsText(eq);
    maxSocks = computeMagicRareMaxSockets(eq, bRule);
    qualityClass = isMagic ? "q-magic" : "q-rare";
  } else if (eq.cat === "base") {
    if (!bRule) return null;
    titleZh = (eq.eth ? "无形" : "") + bRule.nameZh + " (打孔底材)";
    titleEn = bRule.nameEn;
    icon = getBaseRuleIcon(bRule);
    rawStats = "基础底材（可自由镶嵌最多 " + bRule.maxSockets + " 颗符文/宝石/珠宝）";
    maxSocks = bRule.maxSockets || 0;
    qualityClass = "q-magic";
  }

  const rolledLines = rawStats ? formatItemLinesWithRolls(rawStats, eq.rolls) : [];
  if (bRule && (eq.cat === "rw" || eq.cat === "base")) {
    const supEd = bRule.slot === "weapon" ? Math.min(15, Math.max(0, Math.floor(Number(eq.supEd || 0)))) : 0;
    const supAr = bRule.slot === "weapon" ? Math.min(3, Math.max(0, Math.floor(Number(eq.supAr || 0)))) : 0;
    const supDef = (bRule.slot !== "weapon" && bRule.maxDef > 0) ? Math.min(15, Math.max(0, Math.floor(Number(eq.supDef || 0)))) : 0;
    if (supEd > 0) rolledLines.push("+" + supEd + "% 强化伤害（超强底材）");
    if (supAr > 0) rolledLines.push("+" + supAr + " 攻击准确率（超强底材）");
    if (supDef > 0) rolledLines.push("+" + supDef + "% 强化防御（超强底材）");
  }
  if (bRule && bRule.type === "ashd" && ["rw", "base", "magic", "rare", "craft"].includes(eq.cat)) {
    const palModType = eq.palModType === "dmg" ? "dmg" : "res";
    if (palModType === "dmg") {
      const palEd = Math.min(65, Math.max(0, Math.floor(Number(eq.palEd || 0))));
      const palAr = Math.min(121, Math.max(0, Math.floor(Number(eq.palAr || 0))));
      if (palEd > 0) rolledLines.push("+" + palEd + "% 强化伤害（圣骑士盾底材）");
      if (palAr > 0) rolledLines.push("+" + palAr + " 攻击准确率（圣骑士盾底材）");
    } else {
      const palRes = Math.min(45, Math.max(0, Math.floor(Number(eq.palRes || 0))));
      if (palRes > 0) rolledLines.push("+" + palRes + "% 所有抗性（圣骑士盾底材）");
    }
  }
  const sockLines = [];
  let reqReducePct = 0;
  if (maxSocks > 0 && Array.isArray(eq.sockets)) {
    eq.sockets.slice(0, maxSocks).forEach((sid, idx) => {
      if (!sid) return;
      if (isCustomJewelSocket(sid)) {
        const jInfo = resolveCustomJewelInfo(sid);
        if (jInfo && jInfo.bonusText) {
          sockLines.push("【孔 " + (idx + 1) + " · " + jInfo.nameZh + "】" + jInfo.bonusText);
          const rm = jInfo.bonusText.match(/需求\s*-(\d+)%/);
          if (rm) reqReducePct += Number(rm[1]);
        }
        return;
      }
      const sObj = (pdData.socketables || []).find(x => x.id === sid);
      const bTxt = getSocketableBonusText(sid, bRule);
      if (sObj && bTxt) {
        sockLines.push("【孔 " + (idx + 1) + " · " + sObj.nameZh + "】" + bTxt);
        const rm = bTxt.match(/需求\s*-(\d+)%/);
        if (rm) reqReducePct += Number(rm[1]);
      }
    });
  }
  rolledLines.forEach(l => {
    const rm = l.match(/需求\s*-(\d+)%/);
    if (rm) reqReducePct += Number(rm[1]);
  });

  const extraReqReducePct = (opts && Number(opts.extraReqReducePct)) || 0;
  const extraReqReason = (opts && opts.extraReqReason) || "";
  const totalReqReducePct = reqReducePct + extraReqReducePct;
  const reqMult = Math.max(0, (100 - totalReqReducePct) / 100);
  const baseReqStr = bRule ? Math.max(0, bRule.reqStr - (eq.eth ? 10 : 0)) : 0;
  const baseReqDex = bRule ? Math.max(0, bRule.reqDex - (eq.eth ? 10 : 0)) : 0;
  const reqStr = bRule ? Math.max(0, Math.floor(baseReqStr * reqMult)) : 0;
  const reqDex = bRule ? Math.max(0, Math.floor(baseReqDex * reqMult)) : 0;
  const wsm = bRule ? bRule.wsm : 0;

  // Compute individual item weapon damage / armor defense / shield block for preview & hover tooltip (includes local +Min/+Max/+X-Y/+Max per level!)
  let itemWeapMin = 0, itemWeapMax = 0, itemDef = 0, itemDisplayBlock = 0;
  if (bRule) {
    const tmpAcc = { weapEd: 0, flatMin: 0, flatMax: 0, defEd: 0, flatDef: 0, blockBonus: 0 };
    const isWeapSlot = bRule.slot === "weapon";
    const actorLvl = (opts && Number(opts.actorLvl)) || Math.min(99, Math.max(1, Number(document.getElementById("pd-char-lvl")?.value || 90)));
    const parseLocalMod = (rawLine, stripSockPrefix) => {
      let txt = String(rawLine || "");
      if (stripSockPrefix) txt = txt.replace(/^【[^】]+】/, "");
      txt = txt.replace(/\[[^\]]+\]/g, "").replace(/([+-]?\d+(?:\.\d+)?)\s*\/\s*级/g, "+($1 * 等级)").replace(/([+-]?\d+)%\s*FBR\s*\/\s*格挡/gi, "$1% FBR / $1% 提高格挡几率").trim();
      txt.split(/\s*[\/·]\s*/).forEach(part => {
        const clean = part.trim();
        if (!clean) return;
        let rm;
        if ((rm = clean.match(/\+?\(\s*(\d+(?:\.\d+)?)(%?)\s*\*\s*等级\s*\)(%?)\s*(.*)/))) {
          const val = Math.floor(Number(rm[1]) * actorLvl);
          const hasPct = Boolean(rm[2] || rm[3]);
          const tail = rm[4] || "";
          if (isWeapSlot && hasPct && !tail.includes("对恶魔") && !tail.includes("对不死") && /强化伤害|增强伤害|ED/i.test(tail)) tmpAcc.weapEd += val;
          if (isWeapSlot && tail.includes("最大伤害")) tmpAcc.flatMax += val;
          if (!isWeapSlot && tail.includes("防御")) tmpAcc.flatDef += val;
          return;
        }
        if (isWeapSlot) {
          if (!clean.includes("对恶魔") && !clean.includes("对不死") && (rm = clean.match(/\+(\d+)%\s*(?:强化伤害|增强伤害|ED)(?!%)/i))) {
            tmpAcc.weapEd += Number(rm[1]);
          }
          if (!/火焰|冰冷|闪电|毒素|魔法|对恶魔|对不死|技能/.test(clean) && (rm = clean.match(/\+(\d+)\s*[–-]\s*(\d+)\s*伤害(?!加深|减少|转化)/))) {
            tmpAcc.flatMin += Number(rm[1]);
            tmpAcc.flatMax += Number(rm[2]);
          }
          if ((rm = clean.match(/\+(\d+)\s*最小伤害/))) tmpAcc.flatMin += Number(rm[1]);
          if ((rm = clean.match(/\+(\d+)\s*最大伤害/))) tmpAcc.flatMax += Number(rm[1]);
        } else {
          if ((rm = clean.match(/\+(\d+)%\s*强化防御/))) tmpAcc.defEd += Number(rm[1]);
          else if (!clean.includes("远程") && !clean.includes("目标") && (rm = clean.match(/\+(\d+)\s*防御(?!值?对)/))) tmpAcc.flatDef += Number(rm[1]);
          if ((rm = clean.match(/([+-]?\d+)%\s*(?:提高格挡几率|格挡几率|格挡率|格挡(?!速))/))) tmpAcc.blockBonus += Number(rm[1]);
        }
      });
    };
    rolledLines.forEach(l => parseLocalMod(l, false));
    const itemOwnDefEd = tmpAcc.defEd;
    sockLines.forEach(l => parseLocalMod(l, true));
    const ethMult = eq.eth ? 1.5 : 1;
    if (isWeapSlot) {
      const use2h = bRule.twoHanded && !(skActiveClassId === "bar" && bRule.oneOrTwoHanded && pdCharLoadout && pdCharLoadout.offhand);
      const rawMin = Math.floor((use2h ? (bRule.twoHandMin || bRule.minDmg || 0) : (bRule.minDmg || bRule.twoHandMin || 0)) * ethMult);
      const rawMax = Math.floor((use2h ? (bRule.twoHandMax || bRule.maxDmg || 0) : (bRule.maxDmg || bRule.twoHandMax || 0)) * ethMult);
      itemWeapMin = Math.floor((rawMin * (100 + tmpAcc.weapEd)) / 100) + tmpAcc.flatMin;
      itemWeapMax = Math.floor((rawMax * (100 + tmpAcc.weapEd)) / 100) + tmpAcc.flatMax;
      if (itemWeapMin >= itemWeapMax && itemWeapMax > 0) itemWeapMax = itemWeapMin + 1;
    } else if (bRule.maxDef > 0) {
      itemDef = computeArmorPieceDefense(bRule, eq, itemOwnDefEd, tmpAcc.defEd, tmpAcc.flatDef);
    }
    if (bRule.block > 0) {
      const cBaseForBlock = pdData && pdData.charBaseStats && pdData.charBaseStats[skActiveClassId];
      const clsBlockBonus = cBaseForBlock ? cBaseForBlock.blockFactor : 25;
      itemDisplayBlock = bRule.block + clsBlockBonus + tmpAcc.blockBonus;
    }
  }

  return {
    eq, bRule, titleZh, titleEn, icon, rawStats, rolledLines, sockLines, maxSocks, qualityClass,
    reqStr, reqDex, baseReqStr, baseReqDex, reqReducePct, extraReqReducePct, extraReqReason,
    itemWeapMin, itemWeapMax, itemDef, itemDisplayBlock, wsm, setObj, pieceObj
  };
}

function describeGearAura(name, lvl) {
  const n = String(name || "");
  const l = Math.max(1, Number(lvl) || 1);
  if (n.includes("信念")) {
    const res = Math.min(150, 25 + l * 5);
    const def = Math.min(95, 45 + l * 3);
    return { name: "信念", lvl: l, desc: "-" + res + "% 敌火/冰/电抗 · -" + def + "% 敌防", convRes: res, convDef: def };
  }
  if (n.includes("冥想") || n.includes("冥思")) {
    const regen = 275 + l * 25;
    return { name: "冥想", lvl: l, desc: "+" + regen + "% 法力恢复 (与祈祷协同回血)" };
  }
  if (n.includes("狂热")) {
    const eiasTable = [0, 14, 18, 20, 23, 25, 26, 27, 28, 29, 30, 31, 31, 32, 33, 33, 34, 34, 35, 35, 35];
    const eias = eiasTable[Math.min(20, l)] || 35;
    const partyEd = Math.floor((50 + (l - 1) * 17) / 2);
    const arPct = 40 + (l - 1) * 5;
    return { name: "狂热", lvl: l, desc: "团队 +" + eias + "% EIAS · +" + partyEd + "% 增伤 · +" + arPct + "% AR", eias, edPct: partyEd, arPct };
  }
  if (n.includes("专注")) {
    const ed = 60 + (l - 1) * 15;
    return { name: "专注", lvl: l, desc: "团队 +" + ed + "% 物理/天锤增伤", edPct: ed, hammerEdPct: Math.floor(ed / 2) };
  }
  if (n.includes("净化")) {
    return { name: "净化", lvl: l, desc: "大幅缩短诅咒/中毒时间 (与祈祷协同回血)" };
  }
  if (n.includes("反抗")) {
    const defPct = 60 + l * 10;
    return { name: "反抗", lvl: l, desc: "团队 +" + defPct + "% 防御", defPct };
  }
  if (n.includes("力量")) {
    const ed = 30 + l * 10;
    return { name: "力量", lvl: l, desc: "团队 +" + ed + "% 物理增伤", edPct: ed };
  }
  if (n.includes("庇护所")) {
    return { name: "庇护所", lvl: l, desc: "击退不死生物并无视不死物理免疫" };
  }
  if (n.includes("神圣火焰") || n.includes("神圣冲击") || n.includes("神圣冰冻")) {
    return { name: n, lvl: l, desc: "范围元素脉冲伤害与攻击附伤" };
  }
  if (n.includes("荆棘")) {
    return { name: "荆棘", lvl: l, desc: "反弹怪物近战物理伤害" };
  }
  if (n.includes("活力")) {
    return { name: "活力", lvl: l, desc: "全队大幅提升跑速 FRW 与耐力恢复" };
  }
  return { name: n, lvl: l, desc: "装备赋予光环，角色与佣兵双向共享" };
}

function accumulateStatsFromLine(line, tot, actorLvl, itemSeen, ctx) {
  let cleanRaw = String(line).replace(/^【[^】]+】/, "").replace(/\[\d+(?:\.\d+)?[–-]\d+(?:\.\d+)?\]/g, "");
  // Expand multi-element resistance shorthands like "冰/电/火抗性 +25%" before splitting on "/"
  cleanRaw = cleanRaw.replace(/((?:火|冰|电|毒)(?:\s*\/\s*(?:火|冰|电|毒))+)抗性?\s*([+-]?\d+)%?/g, (_, els, v) => {
    const map = { "火": "火焰抗性", "冰": "冰冷抗性", "电": "闪电抗性", "毒": "毒素抗性" };
    return els.split(/\s*\/\s*/).map(e => (map[e] || e) + " " + v + "%").join(" / ");
  });
  cleanRaw = cleanRaw.replace(/([+-]?\d+)%\s*((?:火|冰|电|毒)(?:\s*\/\s*(?:火|冰|电|毒))+)抗性?/g, (_, v, els) => {
    const map = { "火": "火焰抗性", "冰": "冰冷抗性", "电": "闪电抗性", "毒": "毒素抗性" };
    return els.split(/\s*\/\s*/).map(e => (map[e] || e) + " " + v + "%").join(" / ");
  });
  // Expand multi-stat shorthands like "+30% FBR/格挡", "+20 力/体", "+20 力/敏", "+20 力/精" before splitting on "/"
  cleanRaw = cleanRaw
    .replace(/([+-]?\d+)%\s*FBR\s*\/\s*格挡/gi, "$1% FBR / $1% 提高格挡几率")
    .replace(/([+-]?\d+)\s*力\s*\/\s*体/g, "$1 力量 / $1 体力")
    .replace(/([+-]?\d+)\s*力\s*\/\s*敏/g, "$1 力量 / $1 敏捷")
    .replace(/([+-]?\d+)\s*力\s*\/\s*精/g, "$1 力量 / $1 精力");
  // Normalize short per-level notation "+1.5/级" before splitting on "/"
  cleanRaw = cleanRaw.replace(/\+?(\d+(?:\.\d+)?)\s*\/\s*级/g, "+($1 * 等级)");
  const subParts = cleanRaw.split(/\s*[\/·]\s*/);
  const isWeapon = Boolean(ctx && ctx.isWeapon);
  const itemAcc = ctx && ctx.itemAcc;
  for (const part of subParts) {
    const clean = part.trim();
    if (!clean) continue;
    let m;
    if ((m = clean.match(/\+?\(\s*(\d+(?:\.\d+)?)(%?)\s*\*\s*等级\s*\)(%?)\s*(.*)/))) {
      const val = Math.floor(Number(m[1]) * (actorLvl || 90));
      const hasPct = Boolean(m[2] || m[3]);
      const tail = m[4] || "";
      if (tail.includes("力量")) tot.str += val;
      if (tail.includes("敏捷")) tot.dex += val;
      if (tail.includes("活力") || tail.includes("体力")) tot.vit += val;
      if (tail.includes("魔法物品") || tail.includes("魔法装备") || tail.includes("MF")) tot.mf += val;
      if (tail.includes("致命") || tail.includes("双倍")) tot.ds += val;
      if (tail.includes("生命")) {
        if (tot.nonBoHp !== undefined) tot.nonBoHp += val;
        else tot.flatHp += val;
      }
      if (tail.includes("法力")) {
        if (tot.nonBoMana !== undefined) tot.nonBoMana += val;
        else tot.flatMana += val;
      }
      if (tail.includes("防御")) { tot.flatDef += val; if (itemAcc) itemAcc.flatDef += val; }
      if (tail.includes("命中") || tail.includes("准确")) {
        if (hasPct) tot.arPct += val;
        else tot.flatAr += val;
      }
      if (tail.includes("金币")) tot.eg += val;
      if (tail.includes("最大伤害")) tot.flatMaxDmg += val;
      if (hasPct && !tail.includes("对恶魔") && !tail.includes("对不死") && /强化伤害|增强伤害|ED/i.test(tail)) {
        if (isWeapon && itemAcc) itemAcc.weapEd += val;
        else if (!isWeapon) tot.offWeaponEdPct += val;
      }
      continue;
    }
    if (/\+生命\(按等级\)/.test(clean)) {
      const val = Math.floor(1 * (actorLvl || 90));
      if (tot.nonBoHp !== undefined) tot.nonBoHp += val;
      else tot.flatHp += val;
      continue;
    }
    const cid = (ctx && ctx.classId) || skActiveClassId;
    const isCharActor = ctx ? ctx.isChar !== false : true;

    // Oskills (non-class-restricted granted skills from Sets, Runewords, Uniques — e.g. Horazon +30 Enchant, Trang-Oul Fire Ball/Wall/Meteor, Chaos WW, Passion Zeal/Berserk, Enigma Teleport)
    if (isCharActor && tot.oskills && !clean.includes("限定") && !clean.includes("施放") && !clean.includes("几率")) {
      const oskillDefs = [
        { key: "Enchant", re: /\+(\d+)\s*(?:火焰强化|附魔火焰|附魔)/, charge: false },
        { key: "Enchant", re: /(?:等级\s*(\d+)|(\d+)\s*级)\s*(?:火焰强化|强化|附魔)/, charge: true },
        { key: "Fire Ball", re: /\+(\d+)\s*火球/, charge: false },
        { key: "Fire Wall", re: /\+(\d+)\s*(?:火墙|火焰之墙)/, charge: false },
        { key: "Meteor", re: /\+(\d+)\s*陨石/, charge: false },
        { key: "Whirlwind", re: /\+(\d+)\s*(?:旋风斩|旋风)/, charge: false },
        { key: "Zeal", re: /\+(\d+)\s*(?:热忱|白热)/, charge: false },
        { key: "Berserk", re: /\+(\d+)\s*(?:狂战士|狂暴)/, charge: false },
        { key: "Vengeance", re: /\+(\d+)\s*复仇/, charge: false },
        { key: "Teleport", re: /\+(\d+)\s*(?:传送术|传送)/, charge: false },
        { key: "Werebear", re: /\+(\d+)\s*变熊/, charge: false },
        { key: "Werewolf", re: /\+(\d+)\s*狼人变化/, charge: false },
        { key: "Lycanthropy", re: /\+(\d+)\s*变形术/, charge: false },
        { key: "Feral Rage", re: /\+(\d+)\s*野性狂暴/, charge: false },
        { key: "Valkyrie", re: /\+(\d+)\s*女武神/, charge: false }
      ];
      let matchedOskill = false;
      for (const od of oskillDefs) {
        const om = clean.match(od.re);
        if (om) {
          const lvl = Number(om[1] || om[2] || 0);
          if (lvl > 0) {
            const prev = tot.oskills[od.key];
            if (!prev || (!od.charge && (prev.isCharge || lvl > prev.baseLvl)) || (od.charge && prev.isCharge && lvl > prev.baseLvl)) {
              tot.oskills[od.key] = { key: od.key, baseLvl: lvl, isCharge: od.charge };
            }
            matchedOskill = true;
            break;
          }
        }
      }
      if (matchedOskill) continue;
    }

    if ((m = clean.match(/\+(\d+)\s*(?:所有技能|全部技能|全技能|All Skills)/i))) {
      tot.skills += Number(m[1]);
    } else if (isCharActor && (m = clean.match(/\+(\d+)\s*(?:随机职业技能|本职业全部技能|本职业技能)/))) {
      tot.classSkills += Number(m[1]);
    } else if ((m = clean.match(/\+(\d+)\s*本系技能/))) {
      const p = (ctx && ctx.tabPage) || 1;
      tot.tabSkills[p] = (tot.tabSkills[p] || 0) + Number(m[1]);
    } else if (isCharActor && (m = clean.match(/\+(\d+)\s*(?:随机)?(亚马逊|法师|死灵法师|死灵|圣骑士|野蛮人|德鲁伊|刺客|术士)技能/))) {
      const clsMap = { "亚马逊": "ama", "法师": "sor", "死灵法师": "nec", "死灵": "nec", "圣骑士": "pal", "野蛮人": "bar", "德鲁伊": "dru", "刺客": "ass", "术士": "war" };
      if (clsMap[m[2]] === cid) tot.classSkills += Number(m[1]);
    } else if (isCharActor && (m = clean.match(/\+(\d+)\s*(火焰技能|火系技能)/))) {
      const v = Number(m[1]);
      if (cid === "sor") tot.tabSkills[1] = (tot.tabSkills[1] || 0) + v;
      else tot.fireSkills += v;
    } else if (isCharActor && (m = clean.match(/\+(\d+)\s*([^\d%+\s·|]+)/))) {
      const v = Number(m[1]);
      const lbl = clean.slice(clean.indexOf(m[2]));
      // Tree / Tab skill bonuses (all 24 skill trees across 8 classes)
      const tabRules = [
        { c: "war", p: 1, re: /恶魔技能/ },
        { c: "war", p: 2, re: /邪术技能|秘法技能/ },
        { c: "war", p: 3, re: /混沌技能/ },
        { c: "sor", p: 1, re: /火系法术/ },
        { c: "sor", p: 2, re: /雷系法术|闪电技能(?!伤)/ },
        { c: "sor", p: 3, re: /冰系法术|冰冷技能(?!伤)/ },
        { c: "pal", p: 1, re: /战斗技能(?!.*野蛮人)/ },
        { c: "pal", p: 2, re: /攻击灵气/ },
        { c: "pal", p: 3, re: /防御灵气/ },
        { c: "ama", p: 1, re: /弓与弩|弓和十字弓|弓弩技能/ },
        { c: "ama", p: 2, re: /被动与魔法|被动和魔法/ },
        { c: "ama", p: 3, re: /标枪与长矛|标枪和长矛|^标枪$/ },
        { c: "nec", p: 1, re: /诅咒技能|^诅咒$/ },
        { c: "nec", p: 2, re: /毒素与白骨|毒素和白骨/ },
        { c: "nec", p: 3, re: /召唤技能(?!.*德鲁伊)|^召唤$/ },
        { c: "bar", p: 1, re: /战斗技能(?!.*圣骑士)/ },
        { c: "bar", p: 2, re: /战斗专精|精通类技能/ },
        { c: "bar", p: 3, re: /呐喊技能|战嚎技能|战吼技能/ },
        { c: "dru", p: 1, re: /召唤技能(?!.*死灵)|^召唤$/ },
        { c: "dru", p: 2, re: /变形技能|^变形$/ },
        { c: "dru", p: 3, re: /元素技能|^元素$/ },
        { c: "ass", p: 1, re: /陷阱技能|^陷阱$/ },
        { c: "ass", p: 2, re: /影子训练|影身训练/ },
        { c: "ass", p: 3, re: /武学技艺|武学艺术|武学技能/ }
      ];
      let matchedTab = false;
      for (const tr of tabRules) {
        if (tr.c === cid && tr.re.test(lbl)) {
          tot.tabSkills[tr.p] = (tot.tabSkills[tr.p] || 0) + v;
          matchedTab = true;
          break;
        }
      }
      // Specific single-skill bonuses (e.g. +1-3 深渊, +3 骷髅支配, +1-3 旋风斩, +3 传送术)
      if (!matchedTab && !/力量|敏捷|体力|活力|精力|生命|法力|防御|伤害|命中|准确|抗性|所有属性|全属性|照亮|每杀|每次|持续|冰冻目标|击中/.test(lbl)) {
        const clsObj = typeof getActiveClassObj === "function" ? getActiveClassObj() : null;
        if (clsObj && Array.isArray(clsObj.skills)) {
          const skNameClean = lbl.replace(/[（(].*[）)]/, "").trim();
          const aliasMap = { "旋风斩": "Whirlwind", "旋风": "Whirlwind", "传送术": "Teleport", "传送": "Teleport", "变形术": "Lycanthropy", "野性狂暴": "Fury", "骷髅支配": "Skeleton Mastery", "深渊": "Abyss" };
          const skMatch = (aliasMap[skNameClean] && clsObj.skills.find(s => s.key === aliasMap[skNameClean]))
            || clsObj.skills.find(s => s.nameZh === skNameClean);
          if (skMatch) {
            tot.singleSkills[skMatch.key] = (tot.singleSkills[skMatch.key] || 0) + v;
          }
        }
      }
    }
    if ((m = clean.match(/([+-]?\d+)%\s*(?:快速施法|更快速施法|FCR)/i))) tot.fcr += Number(m[1]);
    if ((m = clean.match(/([+-]?\d+)%\s*(?:快速打击恢复|更快速打击回复|FHR)/i))) tot.fhr += Number(m[1]);
    if ((m = clean.match(/([+-]?\d+)%\s*(?:提高攻击速度|攻击速度|攻速|IAS)/i))) tot.ias += Number(m[1]);
    if ((m = clean.match(/([+-]?\d+)%\s*(?:高速跑步|更快速跑步|高跑|FRW)/i))) tot.frw += Number(m[1]);
    if ((m = clean.match(/([+-]?\d+)%\s*(?:更快速格挡率|快速格挡速度|FBR)/i))) tot.fbr += Number(m[1]);
    if ((m = clean.match(/([+-]?\d+)%\s*(?:提高格挡几率|格挡几率|格挡率|格挡(?!速))/))) tot.blockPct += Number(m[1]);
    if ((m = clean.match(/([+-]?\d+)\s*(?:力量|力(?![量度]))/))) tot.str += Number(m[1]);
    if ((m = clean.match(/([+-]?\d+)\s*敏捷/))) tot.dex += Number(m[1]);
    if ((m = clean.match(/([+-]?\d+)\s*(?:体力|活力)/))) tot.vit += Number(m[1]);
    if ((m = clean.match(/([+-]?\d+)\s*精力/))) tot.enr += Number(m[1]);
    if ((m = clean.match(/([+-]?\d+)\s*(?:所有属性|全属性)/))) {
      const v = Number(m[1]);
      tot.str += v; tot.dex += v; tot.vit += v; tot.enr += v;
    }
    // Flat Life & Mana & % Life/Mana
    if (!clean.includes("偷取") && !clean.includes("恢复") && !clean.includes("上限") && !clean.includes("消灭") && !clean.includes("转化")) {
      if ((m = clean.match(/([+-]\d+)\s*生命(?!上限|偷取|恢复)/))) tot.flatHp += Number(m[1]);
      if ((m = clean.match(/([+-]\d+)\s*法力(?!上限|偷取|恢复)/))) tot.flatMana += Number(m[1]);
    }
    if ((m = clean.match(/生命上限提高\s*(\d+)%|\+(\d+)%\s*生命上限/))) tot.hpPct += Number(m[1] || m[2]);
    if ((m = clean.match(/法力上限提高\s*(\d+)%|\+(\d+)%\s*法力上限/))) tot.manaPct += Number(m[1] || m[2]);

    // Attack Rating (Flat AR & % AR) & ITD & -Target Def
    if (!clean.includes("对恶魔") && !clean.includes("对不死")) {
      if ((m = clean.match(/\+(\d+)\s*(?:命中值|攻击准确率|命中率|命中(?!加成)|AR)(?!%)/i))) tot.flatAr += Number(m[1]);
      if ((m = clean.match(/(\d+)%\s*(?:加成命中率|命中率加成|命中加成|额外攻击准确率|攻击准确率加成|命中(?!率)|AR)/i))) tot.arPct += Number(m[1]);
    }
    if (/无视目标防御|ITD/i.test(clean)) tot.itd = true;
    if ((m = clean.match(/-(\d+)%\s*目标防御/))) tot.targetDefPct += Number(m[1]);

    // Weapon/Off-Weapon ED%, Flat Damage, Min/Max Damage & Flat Elemental Attack Damage
    if (!clean.includes("对恶魔") && !clean.includes("对不死")) {
      if ((m = clean.match(/\+(\d+)%\s*(?:强化伤害|增强伤害|ED)(?!%)/i))) {
        const ed = Number(m[1]);
        if (isWeapon) {
          if (itemAcc) itemAcc.weapEd += ed;
        } else {
          tot.offWeaponEdPct += ed;
        }
      }
    }
    if ((m = clean.match(/^伤害\s*\+(\d+)/))) {
      tot.flatDmg += Number(m[1]);
    } else if (!/火焰|冰冷|闪电|毒素|魔法|对恶魔|对不死|技能/.test(clean) && (m = clean.match(/\+(\d+)\s*[–-]\s*(\d+)\s*伤害(?!加深|减少|转化)/))) {
      tot.flatMinDmg += Number(m[1]);
      tot.flatMaxDmg += Number(m[2]);
    }
    if ((m = clean.match(/\+(\d+)\s*最小伤害/))) tot.flatMinDmg += Number(m[1]);
    if ((m = clean.match(/\+(\d+)\s*最大伤害/))) tot.flatMaxDmg += Number(m[1]);
    if (tot.flatEleMin && (m = clean.match(/\+(\d+)\s*[–-]\s*(\d+)\s*(火焰|冰冷|闪电|毒素|魔法)伤害/))) {
      const ek = m[3] === "火焰" ? "fire" : m[3] === "冰冷" ? "cold" : m[3] === "闪电" ? "ltng" : m[3] === "毒素" ? "pois" : "mag";
      tot.flatEleMin[ek] = (tot.flatEleMin[ek] || 0) + Number(m[1]);
      tot.flatEleMax[ek] = (tot.flatEleMax[ek] || 0) + Number(m[2]);
    } else if (tot.flatEleMin && (m = clean.match(/\+(\d+)\s*(火焰|冰冷|闪电|毒素|魔法)伤害/))) {
      const ek = m[2] === "火焰" ? "fire" : m[2] === "冰冷" ? "cold" : m[2] === "闪电" ? "ltng" : m[2] === "毒素" ? "pois" : "mag";
      const ev = Number(m[1]);
      tot.flatEleMin[ek] = (tot.flatEleMin[ek] || 0) + ev;
      tot.flatEleMax[ek] = (tot.flatEleMax[ek] || 0) + ev;
    }

    // Armor Defense ED% & Flat Defense
    if ((m = clean.match(/\+(\d+)%\s*强化防御/))) {
      if (itemAcc) itemAcc.defEd += Number(m[1]);
    } else if (!clean.includes("远程") && !clean.includes("目标") && (m = clean.match(/\+(\d+)\s*防御(?!值?对)/))) {
      const dVal = Number(m[1]);
      tot.flatDef += dVal;
      if (itemAcc) itemAcc.flatDef += dVal;
      else if (tot.extraFlatDef !== undefined) tot.extraFlatDef += dVal;
    }

    // Resistances & Max Resistances
    if (clean.includes("上限") || clean.includes("最大")) {
      if ((m = clean.match(/\+(\d+)%\s*(?:最大)?(?:所有抗性|全抗)(?:上限)?/))) {
        const mv = Number(m[1]);
        tot.maxFRes += mv; tot.maxCRes += mv; tot.maxLRes += mv; tot.maxPRes += mv;
      }
      if ((m = clean.match(/\+(\d+)%\s*(?:最大)?火焰抗性/))) tot.maxFRes += Number(m[1]);
      if ((m = clean.match(/\+(\d+)%\s*(?:最大)?冰冷抗性/))) tot.maxCRes += Number(m[1]);
      if ((m = clean.match(/\+(\d+)%\s*(?:最大)?闪电抗性/))) tot.maxLRes += Number(m[1]);
      if ((m = clean.match(/\+(\d+)%\s*(?:最大)?毒素抗性/))) tot.maxPRes += Number(m[1]);
    } else {
      if ((m = clean.match(/(?:所有抗性|全抗)\s*([+-]?\d+)%?|([+-]?\d+)%?\s*(?:所有抗性|全抗)/))) {
        const v = Number(m[1] || m[2]);
        tot.fRes += v; tot.cRes += v; tot.lRes += v; tot.pRes += v;
      }
      if ((m = clean.match(/火焰抗性\s*([+-]?\d+)%|([+-]?\d+)%\s*火(?:焰)?抗/))) {
        const v = Number(m[1] || m[2]);
        const sig = "fRes:" + v;
        if (!itemSeen || !itemSeen.has(sig)) { tot.fRes += v; if (itemSeen) itemSeen.add(sig); }
      }
      if ((m = clean.match(/冰冷抗性\s*([+-]?\d+)%|([+-]?\d+)%\s*冰(?:冷)?抗/))) {
        const v = Number(m[1] || m[2]);
        const sig = "cRes:" + v;
        if (!itemSeen || !itemSeen.has(sig)) { tot.cRes += v; if (itemSeen) itemSeen.add(sig); }
      }
      if ((m = clean.match(/闪电抗性\s*([+-]?\d+)%|([+-]?\d+)%\s*(?:闪电|电)抗/))) {
        const v = Number(m[1] || m[2]);
        const sig = "lRes:" + v;
        if (!itemSeen || !itemSeen.has(sig)) { tot.lRes += v; if (itemSeen) itemSeen.add(sig); }
      }
      if ((m = clean.match(/毒素抗性\s*([+-]?\d+)%|([+-]?\d+)%\s*毒(?:素)?抗/))) {
        const v = Number(m[1] || m[2]);
        const sig = "pRes:" + v;
        if (!itemSeen || !itemSeen.has(sig)) { tot.pRes += v; if (itemSeen) itemSeen.add(sig); }
      }
    }

    // Sunder Charms
    if (clean.includes("破除怪物")) {
      if (clean.includes("闪电")) tot.sunders.add("ltng");
      if (clean.includes("火焰")) tot.sunders.add("fire");
      if (clean.includes("冰冷")) tot.sunders.add("cold");
      if (clean.includes("毒素")) tot.sunders.add("pois");
      if (clean.includes("物理")) tot.sunders.add("phys");
      if (clean.includes("魔法")) tot.sunders.add("mag");
    }
    if ((m = clean.match(/自身物理承受伤害\s*\+(\d+)%/))) {
      tot.drPct -= Number(m[1]);
    }

    // Element Skill Damage & Enemy Pierce
    if ((m = clean.match(/\+(\d+)%\s*(火焰|冰冷|闪电|毒素|魔法|火|冰|电|毒)(?:技能)?伤/))) {
      const v = Number(m[1]);
      const k = m[2].startsWith("火") ? "fire" : m[2].startsWith("冰") ? "cold" : m[2].startsWith("电") || m[2].startsWith("闪") ? "ltng" : m[2].startsWith("毒") ? "pois" : "mag";
      tot.eleDmg[k] = (tot.eleDmg[k] || 0) + v;
    }
    if ((m = clean.match(/-(\d+)%\s*敌人(火焰|冰冷|闪电|毒素|物理|魔法|火|冰|电|毒)抗/))) {
      const v = Number(m[1]);
      const k = m[2].startsWith("火") ? "fire" : m[2].startsWith("冰") ? "cold" : m[2].startsWith("电") || m[2].startsWith("闪") ? "ltng" : m[2].startsWith("毒") ? "pois" : m[2].startsWith("物") ? "phys" : "mag";
      tot.elePierce[k] = (tot.elePierce[k] || 0) + v;
      tot.pierce.push(m[2] + " -" + v + "%");
    }

    // Leech, MAEK/LAEK, CB/DS/OW, DR/PDR/MDR, CBF, MF/EG/Exp
    if ((m = clean.match(/([+-]?\d+)%\s*(?:更佳机会取得魔法装备|额外几率获得魔法物品|寻宝|MF)/i))) tot.mf += Number(m[1]);
    if ((m = clean.match(/([+-]?\d+)%\s*(?:额外金币|EG)/i))) tot.eg += Number(m[1]);
    if ((m = clean.match(/\+(\d+)%\s*经验获取/))) tot.expPct += Number(m[1]);
    if ((m = clean.match(/(\d+)%\s*(?:几率造成)?(?:压碎性打击|压碎打击|粉碎打击|CB)/i))) tot.cb += Number(m[1]);
    if ((m = clean.match(/(\d+)%\s*(?:几率造成)?(?:致命一击|致命打击|双倍打击|DS)/i))) tot.ds += Number(m[1]);
    if ((m = clean.match(/(\d+)%\s*(?:几率造成)?(?:撕裂伤口|撕开伤口|OW)/i))) tot.ow += Number(m[1]);
    if ((m = clean.match(/(\d+)%\s*(?:击中偷取生命|生命偷取|LL)/i))) tot.ll += Number(m[1]);
    if ((m = clean.match(/(\d+)%\s*(?:击中偷取法力|法力偷取|ML)/i))) tot.ml += Number(m[1]);
    if ((m = clean.match(/\+(\d+)\s*(?:每杀一个敌人恢复法力|每次消灭恢复法力|MAEK)/i))) tot.maek += Number(m[1]);
    if ((m = clean.match(/\+(\d+)\s*(?:每杀一个敌人恢复生命|每次消灭恢复生命|LAEK)/i))) tot.laek += Number(m[1]);
    if ((m = clean.match(/(?:物理伤害减[少免]|伤害减少)\s*(\d+)%|(\d+)%\s*物理伤害减[少免]/))) tot.drPct += Number(m[1] || m[2]);
    else if ((m = clean.match(/(?:物理伤害减[少免]|伤害减少)\s*(\d+)(?!%)/))) tot.pdr += Number(m[1]);
    if ((m = clean.match(/(?:法术伤害减少|魔法伤害减[少免])\s*(\d+)(?!%)/))) tot.mdr += Number(m[1]);
    if (/无法冰冻|CBF/i.test(clean)) tot.cbf = true;

    if ((m = clean.match(/(?:装备后?赋予|赋予)\s*(\d+)\s*级\s*([^\s（(·]+?)(?:灵气)?(?:\s|$|（|\()/))) {
      const aLvl = Number(m[1]);
      const aName = m[2];
      tot.auras.push(describeGearAura(aName, aLvl));
    }
  }
}

function getBagCharmDef(charmId) {
  return (pdData && Array.isArray(pdData.inventoryCharms) ? pdData.inventoryCharms : []).find(c => c.id === charmId) || null;
}

function layoutInventoryBag(bagItems) {
  const W = 10, H = 4;
  const occ = Array.from({ length: H }, () => Array(W).fill(false));
  const placed = [];
  const overflow = [];
  let usedCells = 0;

  // Place taller items first for authentic column-packed D2R bag look
  const sorted = bagItems.map((it, origIdx) => ({ it, def: getBagCharmDef(it.charmId), origIdx }))
    .filter(x => x.def)
    .sort((a, b) => (b.def.h * 10 + b.def.w) - (a.def.h * 10 + a.def.w) || a.origIdx - b.origIdx);

  for (const entry of sorted) {
    const { it, def } = entry;
    let found = null;
    for (let x = 0; x <= W - def.w && !found; x++) {
      for (let y = 0; y <= H - def.h && !found; y++) {
        let fits = true;
        for (let dx = 0; dx < def.w && fits; dx++) {
          for (let dy = 0; dy < def.h && fits; dy++) {
            if (occ[y + dy][x + dx]) fits = false;
          }
        }
        if (fits) found = { x, y };
      }
    }
    if (found) {
      for (let dx = 0; dx < def.w; dx++) {
        for (let dy = 0; dy < def.h; dy++) occ[found.y + dy][found.x + dx] = true;
      }
      usedCells += def.w * def.h;
      placed.push({ item: it, def, x: found.x, y: found.y, w: def.w, h: def.h });
    } else {
      overflow.push(entry);
    }
  }
  return { placed, overflow, usedCells, freeCells: W * H - usedCells };
}

function showBagMessage(msg) {
  const el = document.getElementById("pd-bag-msg");
  if (!el) return;
  if (!msg) { el.style.display = "none"; el.textContent = ""; return; }
  el.style.display = "block";
  el.textContent = msg;
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.display = "none"; }, 2600);
}

function addItemToBag(charmId, tabPageOverride, copyFromItem) {
  const def = getBagCharmDef(charmId);
  if (!def) return false;
  if (def.unique && pdCharBag.some(x => x.charmId === charmId)) {
    showBagMessage("⚠️ 「" + def.nameZh + "」为唯一物品，背包中最多只能携带 1 个");
    return false;
  }
  const clsObj = getActiveClassObj();
  const defaultTab = tabPageOverride || (clsObj && clsObj.tabs && clsObj.tabs[0] ? clsObj.tabs[0].page : 1);
  const candidate = {
    uid: "b" + (pdBagNextUid++),
    charmId,
    tabPage: def.isSkiller ? Number(defaultTab) : 0,
    prefixes: copyFromItem && Array.isArray(copyFromItem.prefixes) ? copyFromItem.prefixes.map(x => Object.assign({}, x)) : [],
    suffixes: copyFromItem && Array.isArray(copyFromItem.suffixes) ? copyFromItem.suffixes.map(x => Object.assign({}, x)) : [],
    rolls: copyFromItem && copyFromItem.rolls ? Object.assign({}, copyFromItem.rolls) : {}
  };
  const testLayout = layoutInventoryBag([...pdCharBag, candidate]);
  if (testLayout.overflow.length > 0) {
    showBagMessage("⚠️ 背包空间不足（剩余空位无法容纳 " + def.w + "×" + def.h + " 的「" + def.nameZh + "」），请先移出部分咒符");
    return false;
  }
  pdCharBag.push(candidate);
  pdActiveTarget = "bag";
  pdActiveBagUid = candidate.uid;
  showBagMessage("");
  renderPaperdollAll();
  return true;
}

function getPassiveHardPoints(classId, skillKey, maxMode, defaultWhenEmpty) {
  const b = getClassBuild(classId);
  const spent = Number((b && b[skillKey]) || 0);
  if (spent > 0) return { pts: spent, isDefault: false };
  if (getClassTotalPoints(classId) > 0) return { pts: 0, isDefault: false };
  if (maxMode && defaultWhenEmpty > 0) return { pts: defaultWhenEmpty, isDefault: true };
  return { pts: 0, isDefault: false };
}

function aggregateLoadoutStats(loadout, isChar, actorLvl, bagItems, extraOpts) {
  const target = isChar ? "char" : "merc";
  const tot = {
    skills: 0, classSkills: 0, fireSkills: 0, tabSkills: { 1: 0, 2: 0, 3: 0 }, singleSkills: {}, oskills: {},
    fcr: 0, fhr: 0, ias: 0, frw: 0, fbr: 0, blockPct: 0,
    str: 0, dex: 0, vit: 0, enr: 0,
    flatHp: 0, nonBoHp: 0, hpPct: 0, flatMana: 0, nonBoMana: 0, manaPct: 0,
    flatAr: 0, arPct: 0, itd: false, targetDefPct: 0,
    offWeaponEdPct: 0, flatMinDmg: 0, flatMaxDmg: 0, flatDmg: 0,
    flatEleMin: { fire: 0, cold: 0, ltng: 0, pois: 0, mag: 0 },
    flatEleMax: { fire: 0, cold: 0, ltng: 0, pois: 0, mag: 0 },
    totalArmorDef: 0, flatDef: 0, extraFlatDef: 0, shieldBlock: 0,
    mainWeapMin: 1, mainWeapMax: 4, mainWeapStrBonus: 100, mainWeapDexBonus: 0, mainWeapEd: 0, mainWeapType: "",
    shieldSmiteMin: 0, shieldSmiteMax: 0, bootKickMin: 3, bootKickMax: 8,
    fRes: 0, cRes: 0, lRes: 0, pRes: 0,
    maxFRes: 75, maxCRes: 75, maxLRes: 75, maxPRes: 75,
    mf: 0, eg: 0, expPct: 0, cb: 0, ds: 0, ow: 0, ll: 0, ml: 0, maek: 0, laek: 0,
    drPct: 0, pdr: 0, mdr: 0, cbf: false,
    maxReqStr: 0, maxReqDex: 0, mainWsm: 0,
    levitateLvl: 0, levitateReqRedPct: 0,
    eleDmg: { fire: 0, cold: 0, ltng: 0, pois: 0, mag: 0 },
    elePierce: { fire: 0, cold: 0, ltng: 0, pois: 0, mag: 0, phys: 0 },
    sunders: new Set(),
    setCounts: new Map(),
    pierce: [], auras: [], activeSets: [], incompatibleSlots: []
  };
  const offLocked = isOffhandSlotLocked(target);
  const setCounts = tot.setCounts;
  const equippedSetPieces = [];
  let nonWeaponMaxReqStr = 0, nonWeaponMaxReqDex = 0;
  let weaponReqMeta = null;

  for (const slotId in loadout) {
    if (slotId === "offhand" && offLocked) continue;
    const eq = loadout[slotId];
    if (!eq) continue;
    if (!isEquippedItemLegal(target, slotId, eq)) {
      tot.incompatibleSlots.push(slotId);
      continue;
    }
    const info = resolveEquippedItemInfo(eq);
    if (!info) continue;
    const isWeapon = slotId === "weapon";
    if (isWeapon) {
      tot.mainWsm = info.wsm || 0;
      weaponReqMeta = { baseReqStr: info.baseReqStr, baseReqDex: info.baseReqDex, reqReducePct: info.reqReducePct };
    } else {
      if (info.reqStr > nonWeaponMaxReqStr) nonWeaponMaxReqStr = info.reqStr;
      if (info.reqDex > nonWeaponMaxReqDex) nonWeaponMaxReqDex = info.reqDex;
    }
    if (info.reqStr > tot.maxReqStr) tot.maxReqStr = info.reqStr;
    if (info.reqDex > tot.maxReqDex) tot.maxReqDex = info.reqDex;

    const itemAcc = { weapEd: 0, defEd: 0, flatDef: 0 };
    const itemSeen = eq.cat === "craft" ? null : new Set();
    info.rolledLines.forEach(l => accumulateStatsFromLine(l, tot, actorLvl, itemSeen, { isWeapon, itemAcc, isChar }));
    const itemOwnDefEd = itemAcc.defEd;
    info.sockLines.forEach(l => accumulateStatsFromLine(l, tot, actorLvl, null, { isWeapon, itemAcc, isChar }));

    if (info.bRule) {
      const b = info.bRule;
      const ethMult = eq.eth ? 1.5 : 1;
      if (isWeapon) {
        const use2h = b.twoHanded && !(isChar && skActiveClassId === "bar" && b.oneOrTwoHanded && loadout.offhand);
        const rawMin = Math.floor((use2h ? (b.twoHandMin || b.minDmg || 1) : (b.minDmg || 1)) * ethMult);
        const rawMax = Math.floor((use2h ? (b.twoHandMax || b.maxDmg || 4) : (b.maxDmg || 4)) * ethMult);
        tot.mainWeapEd = itemAcc.weapEd;
        tot.mainWeapMin = Math.floor((rawMin * (100 + itemAcc.weapEd)) / 100);
        tot.mainWeapMax = Math.floor((rawMax * (100 + itemAcc.weapEd)) / 100);
        tot.mainWeapStrBonus = b.strBonus || 100;
        tot.mainWeapDexBonus = b.dexBonus || 0;
        tot.mainWeapType = b.type || "";
      } else {
        if (b.maxDef > 0) {
          tot.totalArmorDef += computeArmorPieceDefense(b, eq, itemOwnDefEd, itemAcc.defEd, itemAcc.flatDef);
        }
        if (slotId === "offhand" && b.block > 0) {
          tot.shieldBlock = b.block;
          tot.shieldSmiteMin = b.minDmg || 0;
          tot.shieldSmiteMax = b.maxDmg || 0;
        }
        if (slotId === "boots" && b.maxDmg > 0) {
          tot.bootKickMin = b.minDmg || 3;
          tot.bootKickMax = b.maxDmg || 8;
        }
      }
    }
    if (itemAcc.flatDef > 0 && (isWeapon || !(info.bRule && info.bRule.maxDef > 0))) {
      tot.extraFlatDef += itemAcc.flatDef;
    }

    if (eq.cat === "set" && info.setObj) {
      setCounts.set(info.setObj.id, (setCounts.get(info.setObj.id) || 0) + 1);
      if (info.pieceObj) equippedSetPieces.push({ sid: info.setObj.id, pieceObj: info.pieceObj });
    }
  }

  // Per-piece Set green bonuses (e.g. Horazon's Secrets 3pc -25% enemy fire res, Countenance 2pc +5% life)
  const seenSetPartialBySid = new Map();
  const markSetPartial = (sid, reqCount, txt) => {
    if (!seenSetPartialBySid.has(sid)) seenSetPartialBySid.set(sid, new Set());
    const key = reqCount + ":" + String(txt || "").trim();
    const set = seenSetPartialBySid.get(sid);
    if (set.has(key)) return false;
    set.add(key);
    return true;
  };
  for (const ep of equippedSetPieces) {
    const count = setCounts.get(ep.sid) || 0;
    if (count >= 2 && Array.isArray(ep.pieceObj.setPieceBonus)) {
      ep.pieceObj.setPieceBonus.forEach(pb => {
        const pm = String(pb).match(/(\d+)\s*件/);
        const reqCount = pm ? Number(pm[1]) : 2;
        if (count >= reqCount) {
          const body = String(pb).replace(/^[^:：]*[:：]\s*/, "");
          expandCompositeStatLines(body).forEach(l => {
            if (markSetPartial(ep.sid, reqCount, l)) {
              accumulateStatsFromLine(l, tot, actorLvl, null, { isChar });
            }
          });
        }
      });
    }
  }

  // Set partial & full bonuses (properly supporting { count, stats } objects + detail.fullBonuses, deduplicating piece-level repeats!)
  for (const [sid, count] of setCounts.entries()) {
    const sObj = (itData.setItems || []).find(s => s.id === sid);
    if (sObj && count >= 2) {
      tot.activeSets.push(sObj.nameZh + " (" + count + "/" + sObj.pieces + "件)");
      if (sObj.detail && Array.isArray(sObj.detail.partialBonuses)) {
        sObj.detail.partialBonuses.forEach(pb => {
          if (pb && typeof pb === "object" && Array.isArray(pb.stats)) {
            const reqCount = Number(pb.count) || 2;
            if (count >= reqCount) {
              pb.stats.forEach(st => {
                expandCompositeStatLines(st).forEach(l => {
                  if (markSetPartial(sid, reqCount, l)) {
                    accumulateStatsFromLine(l, tot, actorLvl, null, { isChar });
                  }
                });
              });
            }
          } else {
            const pm = String(pb).match(/(\d+)\s*件/);
            const reqCount = pm ? Number(pm[1]) : 2;
            if (count >= reqCount) {
              const body = String(pb).replace(/^[^:：]*[:：]\s*/, "");
              expandCompositeStatLines(body).forEach(l => {
                if (markSetPartial(sid, reqCount, l)) {
                  accumulateStatsFromLine(l, tot, actorLvl, null, { isChar });
                }
              });
            }
          }
        });
      }
      if (count >= sObj.pieces) {
        if (sObj.detail && Array.isArray(sObj.detail.fullBonuses) && sObj.detail.fullBonuses.length) {
          sObj.detail.fullBonuses.forEach(st => {
            expandCompositeStatLines(st).forEach(l => accumulateStatsFromLine(l, tot, actorLvl, null, { isChar }));
          });
        } else if (sObj.fullBonus) {
          expandCompositeStatLines(sObj.fullBonus).forEach(l => accumulateStatsFromLine(l, tot, actorLvl, null, { isChar }));
        }
      }
    }
  }

  // Accumulate Character Inventory Bag Charms (10x4 bag — including custom blank Magic SC/LC/GC!)
  if (isChar && Array.isArray(bagItems)) {
    const { placed } = layoutInventoryBag(bagItems);
    for (const p of placed) {
      if (p.def.cat === "util") continue;
      const rawStats = getBagItemRawStats(p.item, p.def);
      if (!rawStats) continue;
      const rolledLines = formatItemLinesWithRolls(rawStats, p.item.rolls);
      const itemSeen = new Set();
      rolledLines.forEach(l => accumulateStatsFromLine(l, tot, actorLvl, itemSeen, { isWeapon: false, isChar: true, tabPage: p.item.tabPage || 1 }));
    }
  }

  // Apply Warlock Levitate Mastery (-2% ~ -50% weapon Str/Dex requirements) after all gear/bag/CTA +skills are known
  if (isChar && skActiveClassId === "war") {
    const maxMode = Boolean(extraOpts && extraOpts.maxMode);
    const ctaBonus = Number((extraOpts && extraOpts.ctaSkillBonus) || 0);
    const levInfo = getPassiveHardPoints("war", "Levitate", maxMode, 1);
    const levBase = levInfo.pts;
    tot.levitateIsDefault = levInfo.isDefault;
    if (levBase > 0) {
      const clsObj = getActiveClassObj();
      const levSk = clsObj && Array.isArray(clsObj.skills) ? clsObj.skills.find(s => s.key === "Levitate") : null;
      const levPage = levSk ? levSk.page : 2;
      const levLvl = levBase + tot.skills + (tot.classSkills || 0) + ctaBonus + (tot.tabSkills[levPage] || 0) + ((tot.singleSkills && tot.singleSkills["Levitate"]) || 0);
      const levPct = Math.min(50, 2 + Math.max(0, levLvl - 1) * 2);
      tot.levitateLvl = levLvl;
      tot.levitateReqRedPct = levPct;
      if (weaponReqMeta) {
        const effMult = Math.max(0, (100 - (weaponReqMeta.reqReducePct + levPct)) / 100);
        const effWeapStr = Math.max(0, Math.floor(weaponReqMeta.baseReqStr * effMult));
        const effWeapDex = Math.max(0, Math.floor(weaponReqMeta.baseReqDex * effMult));
        tot.maxReqStr = Math.max(nonWeaponMaxReqStr, effWeapStr);
        tot.maxReqDex = Math.max(nonWeaponMaxReqDex, effWeapDex);
      }
    }
  }
  return tot;
}

function getSlotResolveOpts(target, slotId) {
  const actorLvl = target === "merc"
    ? Math.min(98, Math.max(67, Number(document.getElementById("merc-lvl-input")?.value || 90)))
    : Math.min(99, Math.max(1, Number(document.getElementById("pd-char-lvl")?.value || 90)));
  if (target === "char" && slotId === "weapon" && skActiveClassId === "war" && pdLastLevitateReq && pdLastLevitateReq.pct > 0) {
    return {
      actorLvl,
      extraReqReducePct: pdLastLevitateReq.pct,
      extraReqReason: "悬浮精通 Lv." + pdLastLevitateReq.lvl
    };
  }
  return { actorLvl };
}

function hidePdTooltip() {
  const tt = document.getElementById("pd-hover-tooltip");
  if (tt) {
    tt.style.display = "none";
    tt.setAttribute("aria-hidden", "true");
  }
}

function positionPdTooltip(tt, evt) {
  if (!tt || !evt) return;
  const vw = window.innerWidth || 1280;
  const vh = window.innerHeight || 800;
  const rect = tt.getBoundingClientRect ? tt.getBoundingClientRect() : { width: 320, height: 220 };
  const pad = 14;
  let left = (evt.clientX || 0) + 16;
  let top = (evt.clientY || 0) + 14;
  if (left + rect.width + pad > vw) left = Math.max(pad, (evt.clientX || 0) - rect.width - 16);
  if (top + rect.height + pad > vh) top = Math.max(pad, vh - rect.height - pad);
  tt.style.left = Math.round(left) + "px";
  tt.style.top = Math.round(top) + "px";
}

function showPdTooltip(html, qualityClass, evt) {
  const tt = document.getElementById("pd-hover-tooltip");
  if (!tt) return;
  if (!html) { hidePdTooltip(); return; }
  tt.className = "pd-hover-tooltip" + (qualityClass ? (" " + qualityClass) : "");
  tt.innerHTML = html;
  tt.style.display = "block";
  tt.setAttribute("aria-hidden", "false");
  if (currentLang !== "zhCN") applyDomTraditionalSweep();
  positionPdTooltip(tt, evt);
}

function buildPaperdollHoverTooltipHtml(target, slotOrUid) {
  if (!pdData || !itData) return { html: "", qualityClass: "" };

  if (target === "bag") {
    const bagItem = pdCharBag.find(x => x.uid === slotOrUid);
    const def = bagItem ? getBagCharmDef(bagItem.charmId) : null;
    if (!bagItem || !def) return { html: "", qualityClass: "" };
    const clsObj = getActiveClassObj();
    let tabNote = "";
    if (def.isSkiller && clsObj && clsObj.tabs) {
      const t = clsObj.tabs.find(x => x.page === bagItem.tabPage) || clsObj.tabs[0];
      if (t) tabNote = " · 专精：" + t.zhCN;
    }
    const rawStats = getBagItemRawStats(bagItem, def);
    const rolled = rawStats ? formatItemLinesWithRolls(rawStats, bagItem.rolls) : [];
    const qCls = def.cat === "unique" ? "q-unique" : def.cat === "util" ? "q-rare" : "q-magic";
    const tCol = def.cat === "unique" ? "#ffd573" : def.cat === "util" ? "#f8e97a" : "#7cb6ff";
    const statsHtml = rolled.length
      ? '<ul class="pd-tt-stats">' + rolled.map(l => '<li>' + escapeHtml(l) + '</li>').join("") + '</ul>'
      : '<div style="color:#7cb6ff;font-size:11.5px">空白蓝装咒符（0 属性）· 点击右侧自选 1 前缀 + 1 后缀</div>';
    return {
      qualityClass: qCls,
      html:
        '<div class="pd-tt-head">' +
          '<img class="pd-tt-ico" src="' + escapeHtml(def.icon) + '" alt="" />' +
          '<div><div class="pd-tt-title" style="color:' + tCol + '">' + escapeHtml(def.nameZh) + '</div>' +
          '<div class="pd-tt-sub">' + escapeHtml(def.nameEn) + ' · 占格 ' + def.w + '×' + def.h + escapeHtml(tabNote) + '</div></div>' +
        '</div>' +
        statsHtml +
        '<div class="pd-tt-foot">点击可在右侧微调变量 / 自选词缀 / 复制或移出</div>'
    };
  }

  const loadout = target === "char" ? pdCharLoadout : pdMercLoadout;
  const offLocked = slotOrUid === "offhand" && isOffhandSlotLocked(target);
  if (offLocked) {
    return {
      qualityClass: "",
      html: '<div style="color:#ff9b8f;font-weight:700">⚠️ 副手槽位已锁定</div><div style="font-size:11.5px;color:#c9d6ec;margin-top:4px">' + escapeHtml(getSlotRuleDescription(target, slotOrUid)) + '</div>'
    };
  }
  const eq = loadout[slotOrUid];
  if (!eq) return { html: "", qualityClass: "" };
  const info = resolveEquippedItemInfo(eq, getSlotResolveOpts(target, slotOrUid));
  if (!info) return { html: "", qualityClass: "" };
  const isIllegal = !isEquippedItemLegal(target, slotOrUid, eq);
  const tCol = eq.cat === "magic" ? "#7cb6ff" : eq.cat === "rare" ? "#f8e97a" : eq.cat === "craft" ? "#ffaa4d" : eq.cat === "set" ? "#67e87a" : "#ffd573";
  const curStr = target === "char" ? pdLastHoverCtx.charStr : pdLastHoverCtx.mercStr;
  const curDex = target === "char" ? pdLastHoverCtx.charDex : pdLastHoverCtx.mercDex;

  const metaLines = [];
  if (info.bRule) {
    const b = info.bRule;
    metaLines.push("底材：" + b.nameZh + " (" + b.nameEn + ")" + (eq.eth ? " · 无形 Ethereal" : ""));
    if (b.slot === "weapon" && info.itemWeapMax > 0) {
      metaLines.push("武器面板伤害：" + info.itemWeapMin + " – " + info.itemWeapMax + "（WSM [" + (b.wsm || 0) + "]）");
    } else if (info.itemDef > 0) {
      const blkTxt = b.block > 0 ? (" · 格挡几率 " + (info.itemDisplayBlock || b.block) + "%") : "";
      const smiteTxt = (b.block > 0 && b.maxDmg > 0) ? (" · 盾击伤害 " + (b.minDmg || 0) + "–" + b.maxDmg) : "";
      metaLines.push("防御值：" + info.itemDef + blkTxt + smiteTxt);
    }
  }
  const reqStrTxt = info.reqStr > 0
    ? ('<span style="color:' + (curStr > 0 && curStr < info.reqStr ? '#ff8a75;font-weight:700' : '#a8e6b4') + '">力量需求 ' + info.reqStr + '</span>' +
      (info.reqStr < info.baseReqStr ? (' <span style="color:#9ad8ff;font-size:10.5px">(原 ' + info.baseReqStr + (info.extraReqReason ? ('，' + info.extraReqReason + ' -' + info.extraReqReducePct + '%') : '') + (info.reqReducePct ? ('，装备 -' + info.reqReducePct + '%') : '') + ')</span>') : ''))
    : "";
  const reqDexTxt = info.reqDex > 0
    ? ('<span style="color:' + (curDex > 0 && curDex < info.reqDex ? '#ff8a75;font-weight:700' : '#a8e6b4') + '">敏捷需求 ' + info.reqDex + '</span>' +
      (info.reqDex < info.baseReqDex ? (' <span style="color:#9ad8ff;font-size:10.5px">(原 ' + info.baseReqDex + ')</span>') : ''))
    : "";
  if (reqStrTxt || reqDexTxt) {
    metaLines.push([reqStrTxt, reqDexTxt].filter(Boolean).join(" · "));
  }

  const actorLvlForTt = target === "merc"
    ? Number(document.getElementById("pd-merc-lvl")?.value || 90)
    : Number(document.getElementById("pd-char-lvl")?.value || 90);
  const statsHtml = info.rolledLines.length
    ? '<ul class="pd-tt-stats">' + info.rolledLines.map(l => '<li>' + renderStatLineWithLvlCalcHtml(l, actorLvlForTt) + '</li>').join("") + '</ul>'
    : '<div style="color:' + tCol + ';font-size:11.5px">空白装备（0 属性）· 点击在右侧自选词缀</div>';

  const socksHtml = info.sockLines.length
    ? '<div class="pd-tt-socks">' + info.sockLines.map(l => '<div>' + escapeHtml(l) + '</div>').join("") + '</div>'
    : (info.maxSocks > 0 ? '<div class="pd-tt-socks" style="color:#9ba7be">空孔：0 / ' + info.maxSocks + '（点击右侧可镶嵌符文/宝石/珠宝）</div>' : '');

  let setHtml = "";
  if (eq.cat === "set" && info.setObj) {
    const sCounts = target === "char" ? pdLastHoverCtx.charSetCounts : pdLastHoverCtx.mercSetCounts;
    const cnt = (sCounts && sCounts.get(info.setObj.id)) || 1;
    const setLines = [];
    if (info.pieceObj && Array.isArray(info.pieceObj.setPieceBonus)) {
      info.pieceObj.setPieceBonus.forEach(pb => {
        const pm = String(pb).match(/(\d+)\s*件/);
        const req = pm ? Number(pm[1]) : 2;
        const active = cnt >= req;
        setLines.push('<div style="color:' + (active ? '#67e87a' : '#6f7c91') + '">' + (active ? '✓ ' : '○ ') + renderStatLineWithLvlCalcHtml(pb, actorLvlForTt) + '</div>');
      });
    }
    setLines.push('<div style="margin-top:4px;font-weight:700;color:#ffe08c">' + escapeHtml(info.setObj.nameZh) + '（已穿戴 ' + cnt + '/' + info.setObj.pieces + ' 件）</div>');
    if (info.setObj.detail && Array.isArray(info.setObj.detail.partialBonuses)) {
      info.setObj.detail.partialBonuses.forEach(pb => {
        const req = (pb && typeof pb === "object") ? (Number(pb.count) || 2) : ((String(pb).match(/(\d+)\s*件/) || [])[1] || 2);
        const active = cnt >= Number(req);
        const txt = (pb && typeof pb === "object" && Array.isArray(pb.stats)) ? (req + "件：" + pb.stats.join(" · ")) : String(pb);
        setLines.push('<div style="color:' + (active ? '#67e87a' : '#6f7c91') + '">' + (active ? '✓ ' : '○ ') + escapeHtml(txt) + '</div>');
      });
    }
    if (info.setObj.detail && Array.isArray(info.setObj.detail.fullBonuses) && info.setObj.detail.fullBonuses.length) {
      const activeFull = cnt >= info.setObj.pieces;
      setLines.push('<div style="color:' + (activeFull ? '#ffd573' : '#6f7c91') + '">' + (activeFull ? '★ 全套生效：' : '○ 全套加成：') + escapeHtml(info.setObj.detail.fullBonuses.join(" · ")) + '</div>');
    }
    setHtml = '<div class="pd-tt-set">' + setLines.join("") + '</div>';
  }

  return {
    qualityClass: info.qualityClass,
    html:
      (isIllegal ? '<div style="color:#ff8a75;font-weight:700;margin-bottom:5px">⚠️ 职业/部位不符（未计入面板属性）</div>' : '') +
      '<div class="pd-tt-head">' +
        (info.icon ? '<img class="pd-tt-ico" src="' + escapeHtml(info.icon) + '" alt="" />' : '') +
        '<div><div class="pd-tt-title" style="color:' + tCol + '">' + escapeHtml((eq.eth ? "[无形] " : "") + info.titleZh) + '</div>' +
        '<div class="pd-tt-sub">' + escapeHtml(info.titleEn) + '</div></div>' +
      '</div>' +
      (metaLines.length ? '<div class="pd-tt-meta">' + metaLines.map(l => '<div>' + l + '</div>').join("") + '</div>' : '') +
      statsHtml +
      socksHtml +
      setHtml +
      '<div class="pd-tt-foot">点击该部位可在右侧修改变量 / 镶嵌 / 词缀 / 更换</div>'
  };
}

function renderPaperdollSlotGrid(containerId, target, slotsDef, loadout) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  const offLocked = isOffhandSlotLocked(target);
  grid.innerHTML = slotsDef.map(s => {
    const isLocked = s.id === "offhand" && offLocked;
    const eq = isLocked ? null : loadout[s.id];
    const info = eq ? resolveEquippedItemInfo(eq, getSlotResolveOpts(target, s.id)) : null;
    const isIllegal = Boolean(eq && !isEquippedItemLegal(target, s.id, eq));
    const isActive = pdActiveTarget === target && pdActiveSlot === s.id;
    const classes = ["pd-slot"];
    if (s.tall) classes.push("tall");
    if (s.mini) classes.push("mini");
    if (isActive) classes.push("active-slot");
    if (isLocked || isIllegal) classes.push("locked-slot");
    if (info && !isIllegal) classes.push("equipped", info.qualityClass);

    const sockUsed = (eq && Array.isArray(eq.sockets)) ? eq.sockets.filter(Boolean).length : 0;
    const afCnt = eq ? ((Array.isArray(eq.prefixes) ? eq.prefixes.length : 0) + (Array.isArray(eq.suffixes) ? eq.suffixes.length : 0)) : 0;
    let sockBadge = "";
    if (isIllegal) {
      sockBadge = '<span class="rw-badge" style="font-size:9.5px;padding:0 4px;border-color:#ff6b57;color:#ff9b8f">职业不符</span>';
    } else if (eq && (eq.cat === "magic" || eq.cat === "rare")) {
      const isM = eq.cat === "magic";
      const cap = isM ? 2 : 6;
      const sockTxt = (info && info.maxSocks > 0 && sockUsed > 0) ? ("·" + sockUsed + "/" + info.maxSocks + "孔") : "";
      sockBadge = '<span class="rw-badge" style="font-size:9.5px;padding:0 4px;border-color:' + (isM ? '#69a9ff' : '#f8e97a') + ';color:' + (isM ? '#7cb6ff' : '#f8e97a') + '">' + (isM ? '蓝 ' : '黄 ') + afCnt + '/' + cap + sockTxt + '</span>';
    } else if (eq && eq.cat === "craft") {
      const sockTxt = (info && info.maxSocks > 0 && sockUsed > 0) ? ("·" + sockUsed + "/" + info.maxSocks + "孔") : "";
      sockBadge = '<span class="rw-badge" style="font-size:9.5px;padding:0 4px;border-color:#ff9b38;color:#ffaa4d">手工 ' + afCnt + '/4' + sockTxt + '</span>';
    } else if (info && info.maxSocks > 0) {
      sockBadge = '<span class="rw-badge" style="font-size:9.5px;padding:0 4px">' + sockUsed + '/' + info.maxSocks + '孔</span>';
    } else if (eq && eq.cat === "rw") {
      sockBadge = '<span class="rw-badge rw-badge-patch" style="font-size:9.5px;padding:0 4px">符语</span>';
    }
    const areaStyle = s.area ? ("grid-area:" + s.area + ";") : (s.gridSpan ? ("grid-column:span " + s.gridSpan + ";") : "");

    return '<div class="' + classes.join(" ") + '" data-pd-target="' + target + '" data-pd-slot="' + s.id + '" style="' + areaStyle + 'background-image:url(' + s.bg + ')">' +
      '<div class="pd-slot-label"><span>' + escapeHtml(s.label) + '</span>' + sockBadge + '</div>' +
      (info && info.icon ? '<img class="pd-slot-img" src="' + escapeHtml(info.icon) + '" alt="" />' : '<div style="height:34px"></div>') +
      '<div class="pd-slot-name">' + escapeHtml(isLocked ? "副手已锁定" : (info ? ((eq.eth ? "[无形] " : "") + info.titleZh) : "点击配装")) + '</div>' +
    '</div>';
  }).join("");

  grid.querySelectorAll("[data-pd-slot]").forEach(el => {
    el.addEventListener("mouseenter", (e) => {
      if (el.dataset.pdTarget === "merc" && !isMercEnabled()) return;
      const built = buildPaperdollHoverTooltipHtml(el.dataset.pdTarget, el.dataset.pdSlot);
      showPdTooltip(built.html, built.qualityClass, e);
    });
    el.addEventListener("mousemove", (e) => {
      const tt = document.getElementById("pd-hover-tooltip");
      if (tt && tt.style.display === "block") positionPdTooltip(tt, e);
    });
    el.addEventListener("mouseleave", hidePdTooltip);
    el.addEventListener("click", () => {
      if (el.dataset.pdTarget === "merc" && !isMercEnabled()) return;
      hidePdTooltip();
      pdActiveTarget = el.dataset.pdTarget;
      pdActiveSlot = el.dataset.pdSlot;
      pdActiveBagUid = null;
      pdSelectedRwBaseCode = "";
      pdAffixFilter = "";
      if (pdRwBaseCombo) pdRwBaseCombo.close(false);
      if (pdItemCombo) pdItemCombo.close(false);
      const afFilterInp = document.getElementById("pd-affix-filter");
      if (afFilterInp) afFilterInp.value = "";
      const curEq = (pdActiveTarget === "char" ? pdCharLoadout : pdMercLoadout)[pdActiveSlot];
      if (curEq && curEq.cat) pdActiveCat = curEq.cat;
      else if (["amulet", "ring1", "ring2", "gloves", "boots", "belt"].includes(pdActiveSlot)) {
        if (pdActiveCat === "rw" || pdActiveCat === "base") pdActiveCat = "unique";
      }
      renderPaperdollAll();
    });
  });
}

function renderInventoryBag() {
  const grid = document.getElementById("pd-inv-grid");
  const usageEl = document.getElementById("pd-bag-usage");
  if (!grid || !pdData) return;

  const clsObj = getActiveClassObj();
  const { placed, usedCells, freeCells } = layoutInventoryBag(pdCharBag);
  if (usageEl) usageEl.textContent = "已用 " + usedCells + " / 40 格 · 剩余 " + freeCells + " 格";

  let html = "";
  for (let r = 1; r <= 4; r++) {
    for (let c = 1; c <= 10; c++) {
      html += '<div class="pd-inv-cell" style="grid-column:' + c + ';grid-row:' + r + '"></div>';
    }
  }
  for (const p of placed) {
    const isActive = pdActiveTarget === "bag" && pdActiveBagUid === p.item.uid;
    const cls = ["pd-inv-item"];
    if (p.def.cat === "unique") cls.push("is-unique");
    if (p.def.cat === "util") cls.push("is-util");
    if (p.def.isBlankMagic) cls.push("is-magic-blank");
    if (isActive) cls.push("active-bag");
    let tag = p.def.shortZh || p.def.size;
    if (p.def.isBlankMagic) {
      tag = getMagicCharmShortTag(p.item, p.def);
    } else if (p.def.isSkiller && clsObj && Array.isArray(clsObj.tabs)) {
      const tab = clsObj.tabs.find(t => t.page === p.item.tabPage) || clsObj.tabs[0];
      if (tab) tag = "+" + tab.zhCN.slice(0, 2);
    }
    html += '<div class="' + cls.join(" ") + '" data-bag-uid="' + escapeHtml(p.item.uid) + '" style="grid-column:' + (p.x + 1) + ' / span ' + p.w + ';grid-row:' + (p.y + 1) + ' / span ' + p.h + '">' +
      '<img src="' + escapeHtml(p.def.icon) + '" alt="" />' +
      '<span class="pd-inv-item-tag">' + escapeHtml(tag) + '</span>' +
    '</div>';
  }
  grid.innerHTML = html;

  grid.querySelectorAll("[data-bag-uid]").forEach(el => {
    el.addEventListener("mouseenter", (e) => {
      const built = buildPaperdollHoverTooltipHtml("bag", el.dataset.bagUid);
      showPdTooltip(built.html, built.qualityClass, e);
    });
    el.addEventListener("mousemove", (e) => {
      const tt = document.getElementById("pd-hover-tooltip");
      if (tt && tt.style.display === "block") positionPdTooltip(tt, e);
    });
    el.addEventListener("mouseleave", hidePdTooltip);
    el.addEventListener("click", () => {
      hidePdTooltip();
      pdActiveTarget = "bag";
      pdActiveBagUid = el.dataset.bagUid;
      pdAffixFilter = "";
      const afFilterInp = document.getElementById("pd-affix-filter");
      if (afFilterInp) afFilterInp.value = "";
      renderPaperdollAll();
    });
  });
}

function populateBagAddSelect() {
  const sel = document.getElementById("pd-bag-add-select");
  const tabSel = document.getElementById("pd-bag-skiller-tab");
  if (!sel || !pdData) return;

  const clsObj = getActiveClassObj();
  if (tabSel && clsObj && Array.isArray(clsObj.tabs)) {
    const prevTab = tabSel.value;
    tabSel.innerHTML = clsObj.tabs.map(t =>
      '<option value="' + t.page + '"' + (String(t.page) === prevTab ? ' selected' : '') + '>+1 ' + escapeHtml(t.zhCN) + '</option>'
    ).join("");
  }

  if (!sel.options.length) {
    const groups = [
      { label: "🔵 蓝装空白咒符（放入背包后点击自选前后缀 · 1前+1后）", cat: "magic-blank" },
      { label: "★ 暗金咒符（限 1 块）", cat: "unique" },
      { label: "✦ 本职业专精技能大板 (GC 1×3)", cat: "skiller" },
      { label: "◆ 常用预设蓝咒符 (GC 1×3 / LC 1×2 / SC 1×1)", cat: "magic" },
      { label: "▣ 实战占格工具（方块 / 双书）", cat: "util" }
    ];
    sel.innerHTML = groups.map(g => {
      const items = (pdData.inventoryCharms || []).filter(c => c.cat === g.cat);
      if (!items.length) return "";
      return '<optgroup label="' + escapeHtml(g.label) + '">' +
        items.map(c => '<option value="' + escapeHtml(c.id) + '">' + escapeHtml(c.nameZh) + ' [' + c.w + '×' + c.h + ']</option>').join("") +
      '</optgroup>';
    }).join("");
  }

  const chosenDef = getBagCharmDef(sel.value);
  if (tabSel) tabSel.style.display = (chosenDef && chosenDef.isSkiller) ? "inline-block" : "none";
}

function findAnyClassSkill(skKey) {
  for (const c of (skClasses || [])) {
    const sk = (c.skills || []).find(s => s.key === skKey);
    if (sk) return { cls: c, sk };
  }
  return null;
}

function populatePdSkillSelect() {
  const sel = document.getElementById("pd-skill-select");
  const clsObj = getActiveClassObj();
  if (!sel || !clsObj) return;

  const DEFAULT_SIGNATURES = {
    war: "Apocalypse",
    sor: "Lightning",
    pal: "Blessed Hammer",
    ama: "Lightning Fury",
    nec: "Bone Spear",
    bar: "Whirlwind",
    dru: "Tornado",
    ass: "Lightning Sentry"
  };
  const oskillEntries = Object.values(pdActiveOskills || {}).filter(os => {
    const found = findAnyClassSkill(os.key);
    return Boolean(found && (found.sk.dmg || (pdData && pdData.skillCombatMeta && pdData.skillCombatMeta[os.key]) || os.key === "Enchant"));
  });
  const oskillOptionVals = oskillEntries.map(os => "__oskill__:" + os.key);

  const allKeys = new Set(["__normal__", ...clsObj.skills.map(s => s.key), ...oskillOptionVals]);
  if (!pdSelectedSkillKey || (!allKeys.has(pdSelectedSkillKey) && !(String(pdSelectedSkillKey).startsWith("__oskill__:") && Object.keys(pdActiveOskills || {}).length === 0))) {
    pdSelectedSkillKey = DEFAULT_SIGNATURES[clsObj.id] || (clsObj.skills[0] && clsObj.skills[0].key) || "__normal__";
  }

  const tabs = clsObj.tabs || [];
  let html = '<option value="__normal__"' + (pdSelectedSkillKey === "__normal__" ? ' selected' : '') + '>普通物理攻击 (Normal Attack)</option>';
  if (oskillEntries.length) {
    html += '<optgroup label="✨ 套装 / 装备自带技能 (Oskills)">' +
      oskillEntries.map(os => {
        const found = findAnyClassSkill(os.key);
        const val = "__oskill__:" + os.key;
        const title = found ? (pickLangTitle(found.sk) + " (" + found.sk.nameEn + ")") : os.key;
        return '<option value="' + escapeHtml(val) + '"' + (val === pdSelectedSkillKey ? ' selected' : '') + '>' +
          '✨ ' + escapeHtml(title) + ' [基础 +' + os.baseLvl + (os.isCharge ? ' 聚气' : ' 全职业') + ']' +
        '</option>';
      }).join("") +
    '</optgroup>';
  }
  for (const tab of tabs) {
    const list = clsObj.skills.filter(s => s.page === tab.page && !s.passive);
    if (!list.length) continue;
    html += '<optgroup label="' + escapeHtml(tab.zhCN) + '">' +
      list.map(s => {
        const hasDmg = Boolean(s.dmg || (pdData && pdData.skillCombatMeta && pdData.skillCombatMeta[s.key]));
        return '<option value="' + escapeHtml(s.key) + '"' + (s.key === pdSelectedSkillKey ? ' selected' : '') + '>' +
          escapeHtml(pickLangTitle(s)) + ' (' + escapeHtml(s.nameEn) + ')' + (hasDmg ? '' : ' [辅助/光环]') +
        '</option>';
      }).join("") +
    '</optgroup>';
  }
  sel.innerHTML = html;
}

function renderActiveItemPreview() {
  const prevEl = document.getElementById("pd-item-preview");
  if (!prevEl) return;

  if (pdActiveTarget === "bag") {
    const bagItem = pdCharBag.find(x => x.uid === pdActiveBagUid);
    const def = bagItem ? getBagCharmDef(bagItem.charmId) : null;
    if (!bagItem || !def) {
      prevEl.innerHTML = '<div class="tz-empty" style="padding:12px">请点击左侧 10×4 背包中的任意咒符进行查看或调节变量</div>';
      return;
    }
    const clsObj = getActiveClassObj();
    let tabNote = "";
    if (def.isSkiller && clsObj && clsObj.tabs) {
      const t = clsObj.tabs.find(x => x.page === bagItem.tabPage) || clsObj.tabs[0];
      if (t) tabNote = " · 专精系别：" + t.zhCN;
    }
    const rawStats = getBagItemRawStats(bagItem, def);
    const rolled = rawStats ? formatItemLinesWithRolls(rawStats, bagItem.rolls) : [];
    const statHtml = rolled.length
      ? renderStatList(rolled.join(" · "), "#9ad8ff", false)
      : '<div style="font-size:11.5px;color:#7cb6ff">空白蓝装咒符（0 属性）— 请在上方蓝装前后缀构造器中手动选择最多 1 前缀 + 1 后缀</div>';
    prevEl.innerHTML =
      '<div class="it-set-bonus-box" style="margin-top:4px">' +
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">' +
          '<img src="' + escapeHtml(def.icon) + '" alt="" style="width:30px;height:30px;object-fit:contain">' +
          '<div><strong style="color:' + (def.cat === "unique" ? "#ffd573" : "#7cb6ff") + '">' + escapeHtml(def.nameZh) + '</strong>' +
          '<div style="font-size:11px;color:var(--muted)">' + escapeHtml(def.nameEn) + ' · 占格 ' + def.w + '×' + def.h + escapeHtml(tabNote) + '</div></div>' +
        '</div>' +
        statHtml +
      '</div>';
    return;
  }

  const loadout = pdActiveTarget === "char" ? pdCharLoadout : pdMercLoadout;
  const curEq = loadout[pdActiveSlot] || null;
  const info = curEq ? resolveEquippedItemInfo(curEq, getSlotResolveOpts(pdActiveTarget, pdActiveSlot)) : null;
  if (!info) {
    prevEl.innerHTML = '<div class="tz-empty" style="padding:12px">当前槽位未穿戴装备，请从上方下拉框选择放入</div>';
    return;
  }
  const isIllegal = !isEquippedItemLegal(pdActiveTarget, pdActiveSlot, curEq);
  const reqParts = [];
  if (info.reqStr > 0) {
    const redNote = info.reqStr < info.baseReqStr
      ? (" (原 " + info.baseReqStr + (info.extraReqReason ? ("，" + info.extraReqReason + " -" + info.extraReqReducePct + "%") : "") + (info.reqReducePct ? ("，装备 -" + info.reqReducePct + "%") : "") + ")")
      : "";
    reqParts.push("需力量 " + info.reqStr + redNote);
  }
  if (info.reqDex > 0) {
    const redNote = info.reqDex < info.baseReqDex ? (" (原 " + info.baseReqDex + ")") : "";
    reqParts.push("需敏捷 " + info.reqDex + redNote);
  }
  if (info.bRule && info.bRule.slot === "weapon" && (info.itemWeapMax > 0 || info.bRule.maxDmg > 0 || info.bRule.twoHandMax > 0)) {
    const dMin = info.itemWeapMax > 0 ? info.itemWeapMin : (info.bRule.minDmg || info.bRule.twoHandMin || 0);
    const dMax = info.itemWeapMax > 0 ? info.itemWeapMax : (info.bRule.maxDmg || info.bRule.twoHandMax || 0);
    reqParts.push("武器伤害 " + dMin + "–" + dMax);
  } else if (info.bRule && (info.itemDef > 0 || info.bRule.maxDef > 0)) {
    reqParts.push("防御 " + (info.itemDef > 0 ? info.itemDef : info.bRule.maxDef));
    if (info.bRule.block > 0) {
      reqParts.push("格挡 " + (info.itemDisplayBlock || info.bRule.block) + "%");
      if (info.bRule.maxDmg > 0) reqParts.push("盾击 " + (info.bRule.minDmg || 0) + "–" + info.bRule.maxDmg);
    }
  }
  const titleColor = curEq.cat === "magic" ? "#7cb6ff" : curEq.cat === "rare" ? "#f8e97a" : curEq.cat === "craft" ? "#ffaa4d" : curEq.cat === "set" ? "#67e87a" : "#ffd573";
  const actorLvlForPrev = pdActiveTarget === "merc"
    ? Number(document.getElementById("pd-merc-lvl")?.value || 90)
    : Number(document.getElementById("pd-char-lvl")?.value || 90);
  const allLines = info.rolledLines.concat(info.sockLines);
  const bodyHtml = allLines.length
    ? '<ul class="it-stat-list" style="color:#9ad8ff;margin:4px 0 0">' + allLines.map(l => '<li>' + renderStatLineWithLvlCalcHtml(l, actorLvlForPrev) + '</li>').join("") + '</ul>'
    : '<div style="font-size:11.5px;color:' + titleColor + '">当前为空白底材（0 属性），请在上方前后缀构造器中手动选择词缀</div>';
  prevEl.innerHTML =
    '<div class="it-set-bonus-box" style="margin-top:4px">' +
      (isIllegal ? '<div style="color:#ff9b8f;font-size:11.5px;margin-bottom:6px;font-weight:700">⚠️ 该装备不符合当前职业/主副手穿戴规则，未计入属性统计（可重新选择或卸下）</div>' : '') +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">' +
        (info.icon ? '<img src="' + escapeHtml(info.icon) + '" alt="" style="width:32px;height:32px;object-fit:contain">' : '') +
        '<div><strong style="color:' + titleColor + '">' + escapeHtml((curEq.eth ? "[无形] " : "") + info.titleZh) + '</strong>' +
        '<div style="font-size:11px;color:var(--muted)">' + escapeHtml(info.titleEn) + (reqParts.length ? (' · ' + reqParts.join(' · ')) : '') + '</div></div>' +
      '</div>' +
      bodyHtml +
    '</div>';
}

function renderAffixBuilder(itemObj, affixSlot, quality, clsObj, bRule) {
  const box = document.getElementById("pd-affix-builder");
  const titleEl = document.getElementById("pd-affix-builder-title");
  const lockEl = document.getElementById("pd-affix-lock-status");
  const preSel = document.getElementById("pd-affix-pre-select");
  const preBtn = document.getElementById("pd-affix-pre-add");
  const sufSel = document.getElementById("pd-affix-suf-select");
  const sufBtn = document.getElementById("pd-affix-suf-add");
  const listEl = document.getElementById("pd-affix-chosen-list");
  if (!box || !preSel || !sufSel || !listEl) return;

  if (!itemObj || !affixSlot || (quality !== "magic" && quality !== "rare" && quality !== "craft")) {
    box.style.display = "none";
    box._pdAffixCtx = null;
    return;
  }

  if (!Array.isArray(itemObj.prefixes)) itemObj.prefixes = [];
  if (!Array.isArray(itemObj.suffixes)) itemObj.suffixes = [];

  const isCraft = quality === "craft";
  const isRare = quality === "rare";
  const maxPre = (isRare || isCraft) ? 3 : 1;
  const maxSuf = (isRare || isCraft) ? 3 : 1;
  const maxTotal = isCraft ? 4 : (isRare ? 6 : 2);
  const totalChosen = itemObj.prefixes.length + itemObj.suffixes.length;
  const totalFull = totalChosen >= maxTotal;
  const preFull = itemObj.prefixes.length >= maxPre || totalFull;
  const sufFull = itemObj.suffixes.length >= maxSuf || totalFull;

  box.style.display = "flex";
  box.classList.toggle("is-rare", isRare);
  box.classList.toggle("is-craft", isCraft);
  if (titleEl) {
    titleEl.style.color = isCraft ? "#ffaa4d" : (isRare ? "#f8e97a" : "#7cb6ff");
    titleEl.textContent = isCraft
      ? "🟠 手工橙装随机词缀（固定配方 + 最多 4 条官方亮金词缀，前≤3 / 后≤3）"
      : (isRare
        ? "🟡 黄装前后缀自选（最多 3 前 + 3 后，共 6 条）"
        : "🔵 蓝装前后缀自选（最多 1 前 + 1 后，共 2 条）");
  }
  if (lockEl) {
    lockEl.textContent = isCraft
      ? ("随机词缀 " + totalChosen + "/4" + (totalFull ? " 🔒已满" : "") + "（前 " + itemObj.prefixes.length + "/3 · 后 " + itemObj.suffixes.length + "/3）")
      : ("前缀 " + itemObj.prefixes.length + "/" + maxPre + (preFull ? " 🔒已锁" : "") +
        " · 后缀 " + itemObj.suffixes.length + "/" + maxSuf + (sufFull ? " 🔒已锁" : ""));
  }

  const pool = getMagicRareAffixPool(affixSlot, isCraft ? "rare" : quality, clsObj, bRule);
  const chosenPreIds = new Set(itemObj.prefixes.map(x => x.id));
  const chosenSufIds = new Set(itemObj.suffixes.map(x => x.id));
  const usedPreGroups = new Set(itemObj.prefixes.map(x => Number(x.g || 0)).filter(g => g > 0));
  const usedSufGroups = new Set(itemObj.suffixes.map(x => Number(x.g || 0)).filter(g => g > 0));
  const fq = pdAffixFilter.toLowerCase();
  const matchAf = (a) => !fq || String(a.nameZh || "").toLowerCase().includes(fq);

  const availPres = pool.prefixes.filter(a => !chosenPreIds.has(a.id) && !(a.g > 0 && usedPreGroups.has(a.g)) && matchAf(a));
  const availSufs = pool.suffixes.filter(a => !chosenSufIds.has(a.id) && !(a.g > 0 && usedSufGroups.has(a.g)) && matchAf(a));

  preSel.disabled = preFull;
  if (preBtn) preBtn.disabled = preFull || !availPres.length;
  preSel.innerHTML = preFull
    ? ('<option value="">🔒 ' + (totalFull && isCraft ? '手工随机词缀已满 (4/4) 已自动锁定' : ('前缀已满 (' + maxPre + '/' + maxPre + ') 已自动锁定')) + '</option>')
    : ('<option value="">-- 选择前缀 (' + availPres.length + ' 条官方词缀可选) --</option>' +
      availPres.map(a => '<option value="' + escapeHtml(a.id) + '">' + escapeHtml(a.nameZh) + '</option>').join(""));

  sufSel.disabled = sufFull;
  if (sufBtn) sufBtn.disabled = sufFull || !availSufs.length;
  sufSel.innerHTML = sufFull
    ? ('<option value="">🔒 ' + (totalFull && isCraft ? '手工随机词缀已满 (4/4) 已自动锁定' : ('后缀已满 (' + maxSuf + '/' + maxSuf + ') 已自动锁定')) + '</option>')
    : ('<option value="">-- 选择后缀 (' + availSufs.length + ' 条官方词缀可选) --</option>' +
      availSufs.map(a => '<option value="' + escapeHtml(a.id) + '">' + escapeHtml(a.nameZh) + '</option>').join(""));

  const chips = [];
  itemObj.prefixes.forEach((p, idx) => {
    chips.push('<div class="pd-affix-chip"><span><strong>[前缀 ' + (idx + 1) + ']</strong> ' + escapeHtml(p.nameZh) + '</span><button type="button" class="pd-affix-chip-del" data-del-type="prefix" data-del-idx="' + idx + '" title="移除此前缀">× 移除</button></div>');
  });
  itemObj.suffixes.forEach((s, idx) => {
    chips.push('<div class="pd-affix-chip is-suffix"><span><strong>[后缀 ' + (idx + 1) + ']</strong> ' + escapeHtml(s.nameZh) + '</span><button type="button" class="pd-affix-chip-del" data-del-type="suffix" data-del-idx="' + idx + '" title="移除此后缀">× 移除</button></div>');
  });
  listEl.innerHTML = chips.length
    ? chips.join("")
    : ('<div style="font-size:11px;color:var(--muted)">' + (isCraft
      ? '当前仅含手工固定配方词条，可从上方添加最多 4 条官方随机亮金前后缀（如 +2 本职业/单系技能、+10% FCR、伤害降低 PDR、全抗/单抗、生命/力量/MF 等）'
      : '尚未选择任何词缀，请从上方手动添加官方完整范围前缀/后缀（添加后可在下方滑动或直接输入精确数值）') + '</div>');

  listEl.querySelectorAll("[data-del-type]").forEach(btn => {
    btn.addEventListener("click", () => {
      const t = btn.dataset.delType;
      const idx = Number(btn.dataset.delIdx);
      preserveRollsAcrossAffixEdit(itemObj, () => {
        if (t === "prefix") itemObj.prefixes.splice(idx, 1);
        else itemObj.suffixes.splice(idx, 1);
      });
      renderPaperdollAll();
    });
  });

  box._pdAffixCtx = { itemObj, maxPre, maxSuf, maxTotal, pool };
}

function equipActiveSlot(cat, val, rwBaseCodeOverride) {
  const loadout = pdActiveTarget === "char" ? pdCharLoadout : pdMercLoadout;
  if (!val) {
    loadout[pdActiveSlot] = null;
  } else if (cat === "rw") {
    const bCode = rwBaseCodeOverride || pdSelectedRwBaseCode || "uit";
    loadout[pdActiveSlot] = { cat: "rw", id: val, baseCode: bCode, eth: Boolean(document.getElementById("pd-item-eth")?.checked), sockets: [], rolls: {} };
  } else if (cat === "craft") {
    loadout[pdActiveSlot] = { cat: "craft", id: val, eth: false, prefixes: [], suffixes: [], sockets: [], rolls: {} };
  } else if (cat === "magic" || cat === "rare") {
    const isAcc = ["amulet", "ring1", "ring2"].includes(pdActiveSlot);
    loadout[pdActiveSlot] = { cat, id: val, baseCode: isAcc ? "" : val, eth: isAcc ? false : Boolean(document.getElementById("pd-item-eth")?.checked), prefixes: [], suffixes: [], sockets: [], rolls: {} };
  } else if (cat === "base") {
    loadout[pdActiveSlot] = { cat: "base", id: val, baseCode: val, eth: Boolean(document.getElementById("pd-item-eth")?.checked), sockets: [], rolls: {} };
  } else {
    loadout[pdActiveSlot] = { cat, id: val, eth: Boolean(document.getElementById("pd-item-eth")?.checked), sockets: [], rolls: {} };
  }
  renderPaperdollAll();
}

function renderSlidersForTarget(rawStats, rollsTarget) {
  const sliderSec = document.getElementById("pd-sliders-section");
  const sliderList = document.getElementById("pd-sliders-list");
  if (!sliderSec || !sliderList) return;
  const { vars } = extractVariableRanges(rawStats);
  if (vars.length > 0) {
    sliderSec.style.display = "block";
    sliderList.innerHTML = vars.map(v => {
      const curVal = (rollsTarget.rolls && rollsTarget.rolls[v.key] !== undefined) ? Number(rollsTarget.rolls[v.key]) : v.best;
      const displayLine = v.rawLine.replace(/([+-]?)\d+(?:\.\d+)?\s*[–-]\s*\d+(?:\.\d+)?/, "$1" + curVal);
      return '<div class="pd-slider-row">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px">' +
          '<span data-pd-roll-lbl="' + v.key + '" style="color:#cfe0fa;font-weight:700">' + escapeHtml(displayLine) + '</span>' +
          '<span style="color:#ffd584;font-size:11px">范围 [' + v.min + '–' + v.max + v.unit + ']' + (v.invertBest ? ' (越低越极品)' : '') + '</span>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px">' +
          '<input type="range" min="' + v.min + '" max="' + v.max + '" step="' + v.step + '" value="' + curVal + '" data-pd-roll-key="' + v.key + '" style="flex:1;accent-color:#f5cf7b" />' +
          '<input type="number" class="pd-alloc-input" min="' + v.min + '" max="' + v.max + '" step="' + v.step + '" value="' + curVal + '" data-pd-roll-num="' + v.key + '" title="可直接输入精确数值" style="width:58px" />' +
          (v.unit ? ('<span style="font-size:11px;color:#ffe08c;font-weight:700">' + v.unit + '</span>') : '') +
        '</div>' +
      '</div>';
    }).join("");
    const varMap = new Map(vars.map(v => [v.key, v]));
    const applyRollUpdate = (k, rawNum, fromNumInput) => {
      const v = varMap.get(k);
      if (!v) return;
      const clamped = Math.min(v.max, Math.max(v.min, Number(rawNum)));
      if (Number.isNaN(clamped)) return;
      if (!rollsTarget.rolls) rollsTarget.rolls = {};
      rollsTarget.rolls[k] = clamped;
      const lblEl = sliderList.querySelector('[data-pd-roll-lbl="' + k + '"]');
      const rngEl = sliderList.querySelector('[data-pd-roll-key="' + k + '"]');
      const numEl = sliderList.querySelector('[data-pd-roll-num="' + k + '"]');
      if (lblEl) lblEl.textContent = v.rawLine.replace(/([+-]?)\d+(?:\.\d+)?\s*[–-]\s*\d+(?:\.\d+)?/, "$1" + clamped);
      if (rngEl && fromNumInput) rngEl.value = String(clamped);
      if (numEl && !fromNumInput) numEl.value = String(clamped);
      if (/孔/.test(v.rawLine)) {
        renderPaperdollAll();
        return;
      }
      if (pdActiveTarget === "bag") renderInventoryBag();
      renderPaperdollLiveStats();
    };
    sliderList.querySelectorAll("[data-pd-roll-key]").forEach(rng => {
      rng.addEventListener("input", (e) => applyRollUpdate(e.target.dataset.pdRollKey, e.target.value, false));
    });
    sliderList.querySelectorAll("[data-pd-roll-num]").forEach(num => {
      num.addEventListener("change", (e) => applyRollUpdate(e.target.dataset.pdRollNum, e.target.value, true));
    });
  } else {
    sliderSec.style.display = "none";
  }
}

function createSearchableCombo(cfg) {
  const root = document.getElementById(cfg.rootId);
  const input = document.getElementById(cfg.inputId);
  const clearBtn = document.getElementById(cfg.clearId);
  const toggleBtn = document.getElementById(cfg.toggleId);
  const menu = document.getElementById(cfg.menuId);
  if (!root || !input || !menu) return null;

  const state = {
    items: [],
    selectedValue: "",
    selectedLabel: "",
    placeholder: "",
    isOpen: false,
    isFiltering: false,
    query: "",
    activeIdx: -1,
    renderedItems: [],
    onSelect: cfg.onSelect,
    extraItemsBuilder: null,
    emptyBuilder: null
  };

  const syncClearBtn = () => {
    if (!clearBtn) return;
    clearBtn.style.display = (state.isOpen && input.value.length > 0) ? "inline-flex" : "none";
  };

  const matchQuery = (searchText, q) => {
    if (!q) return true;
    const hay = String(searchText || "").toLowerCase();
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    return tokens.every(t => hay.includes(t));
  };

  const getFilteredItems = () => {
    const q = state.isFiltering ? state.query.trim() : "";
    let list = q ? state.items.filter(it => matchQuery(it.searchText, q)) : state.items.slice();
    if (q && typeof state.extraItemsBuilder === "function") {
      const extras = state.extraItemsBuilder(q) || [];
      if (extras.length) list = list.concat(extras);
    }
    return list;
  };

  const updateActiveHighlight = (shouldScroll) => {
    const opts = menu.querySelectorAll("[data-combo-idx]");
    opts.forEach(el => {
      const idx = Number(el.dataset.comboIdx);
      const isAct = idx === state.activeIdx;
      el.classList.toggle("is-active", isAct);
      if (isAct) {
        input.setAttribute("aria-activedescendant", el.id || "");
        if (shouldScroll && typeof el.scrollIntoView === "function") {
          el.scrollIntoView({ block: "nearest" });
        }
      }
    });
    if (state.activeIdx < 0) input.removeAttribute("aria-activedescendant");
  };

  const renderMenu = (scrollSelectedIntoView) => {
    const q = state.isFiltering ? state.query.trim() : "";
    const list = getFilteredItems();
    state.renderedItems = list;

    if (list.length === 0) {
      state.activeIdx = -1;
      input.removeAttribute("aria-activedescendant");
      if (typeof state.emptyBuilder === "function") {
        menu.innerHTML = state.emptyBuilder(q, api);
        menu.querySelectorAll("[data-jump-cat]").forEach(btn => {
          btn.addEventListener("mousedown", (e) => e.preventDefault());
          btn.addEventListener("click", () => {
            if (typeof cfg.onJump === "function") cfg.onJump(btn.dataset.jumpCat, btn.dataset.jumpBase, api);
          });
        });
      } else {
        menu.innerHTML = '<div class="pd-combo-empty">无匹配项，可点击右侧 × 清空重新浏览全部选项</div>';
      }
      return;
    }

    if (scrollSelectedIntoView && !q && state.selectedValue) {
      const selIdx = list.findIndex(it => it.value === state.selectedValue && !it.kind);
      state.activeIdx = selIdx >= 0 ? selIdx : 0;
    } else if (state.activeIdx < 0 || state.activeIdx >= list.length) {
      state.activeIdx = 0;
    }

    const metaText = q
      ? ('匹配 ' + list.length + ' / ' + state.items.length + ' 项')
      : ('共 ' + state.items.length + ' 项 · 直接输入筛选或滚轮浏览');
    const optPrefix = cfg.menuId + "-opt-";
    menu.innerHTML =
      '<div class="pd-combo-meta-bar"><span>' + escapeHtml(metaText) + '</span><span>↑↓ · Enter</span></div>' +
      list.map((it, idx) => {
        const isSel = !it.kind && state.selectedValue && it.value === state.selectedValue;
        const isAct = idx === state.activeIdx;
        const cls = "pd-combo-opt" + (isSel ? " is-selected" : "") + (isAct ? " is-active" : "") + (it.kind === "rw-base" ? " is-base-jump" : "");
        const tagHtml = isSel
          ? '<span class="pd-combo-opt-tag">✓ 已选</span>'
          : (it.tag ? ('<span class="pd-combo-opt-tag">' + escapeHtml(it.tag) + '</span>') : '');
        return '<button type="button" class="' + cls + '" id="' + optPrefix + idx + '" role="option" aria-selected="' + (isSel ? 'true' : 'false') + '" data-combo-idx="' + idx + '">' +
          '<span class="pd-combo-opt-main">' +
            '<span class="pd-combo-opt-title">' + escapeHtml(it.title) + '</span>' +
            (it.sub ? ('<span class="pd-combo-opt-sub">' + escapeHtml(it.sub) + '</span>') : '') +
          '</span>' +
          tagHtml +
        '</button>';
      }).join("");

    menu.querySelectorAll("[data-combo-idx]").forEach(btn => {
      btn.addEventListener("mousedown", (e) => e.preventDefault());
      btn.addEventListener("mouseenter", () => {
        state.activeIdx = Number(btn.dataset.comboIdx);
        updateActiveHighlight(false);
      });
      btn.addEventListener("click", () => {
        const picked = state.renderedItems[Number(btn.dataset.comboIdx)];
        if (picked) selectItem(picked);
      });
    });

    if (scrollSelectedIntoView) updateActiveHighlight(true);
  };

  const positionMenu = () => {
    const field = root.querySelector(".pd-combo-field") || input;
    const rect = field && typeof field.getBoundingClientRect === "function" ? field.getBoundingClientRect() : null;
    if (rect && typeof window !== "undefined" && window.innerHeight) {
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      menu.classList.toggle("open-up", spaceBelow < 220 && spaceAbove > spaceBelow);
    } else {
      menu.classList.remove("open-up");
    }
  };

  const open = (filtering) => {
    state.isOpen = true;
    state.isFiltering = Boolean(filtering);
    if (!state.isFiltering) state.query = "";
    root.classList.add("is-open");
    input.setAttribute("aria-expanded", "true");
    menu.hidden = false;
    menu.style.display = "block";
    positionMenu();
    renderMenu(!state.isFiltering);
    syncClearBtn();
  };

  const close = (restoreLabel) => {
    state.isOpen = false;
    state.isFiltering = false;
    state.query = "";
    state.activeIdx = -1;
    root.classList.remove("is-open");
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    menu.hidden = true;
    menu.style.display = "none";
    if (restoreLabel !== false) {
      input.value = state.selectedLabel || "";
    }
    syncClearBtn();
  };

  const selectItem = (item) => {
    close(false);
    if (!item.kind) {
      state.selectedValue = item.value;
      state.selectedLabel = item.displayLabel || item.title;
      input.value = state.selectedLabel;
    }
    if (typeof state.onSelect === "function") state.onSelect(item, api);
  };

  input.addEventListener("focus", () => {
    if (!state.isOpen) {
      open(false);
      if (input.value && typeof input.select === "function") {
        try { input.select(); } catch (e) {}
      }
    }
  });

  input.addEventListener("click", () => {
    if (!state.isOpen) open(false);
  });

  input.addEventListener("input", () => {
    state.query = input.value.trim();
    state.isFiltering = state.query.length > 0;
    state.activeIdx = 0;
    if (!state.isOpen) open(state.isFiltering);
    else {
      renderMenu(false);
      syncClearBtn();
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.isComposing || e.keyCode === 229) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!state.isOpen) { open(false); return; }
      if (state.renderedItems.length) {
        state.activeIdx = (state.activeIdx + 1) % state.renderedItems.length;
        updateActiveHighlight(true);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!state.isOpen) { open(false); return; }
      if (state.renderedItems.length) {
        state.activeIdx = (state.activeIdx - 1 + state.renderedItems.length) % state.renderedItems.length;
        updateActiveHighlight(true);
      }
    } else if (e.key === "Enter") {
      if (!state.isOpen) return;
      e.preventDefault();
      const target = state.renderedItems[state.activeIdx] || state.renderedItems[0];
      if (target) selectItem(target);
    } else if (e.key === "Escape") {
      if (state.isOpen) {
        e.preventDefault();
        close(true);
      }
    }
  });

  input.addEventListener("blur", (e) => {
    if (e && e.relatedTarget && typeof root.contains === "function" && root.contains(e.relatedTarget)) return;
    close(true);
  });

  if (toggleBtn) {
    toggleBtn.addEventListener("mousedown", (e) => e.preventDefault());
    toggleBtn.addEventListener("click", () => {
      if (state.isOpen) {
        close(true);
      } else {
        if (typeof input.focus === "function") input.focus();
        open(false);
        if (input.value && typeof input.select === "function") {
          try { input.select(); } catch (e) {}
        }
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("mousedown", (e) => e.preventDefault());
    clearBtn.addEventListener("click", () => {
      input.value = "";
      state.query = "";
      state.isFiltering = false;
      state.activeIdx = 0;
      if (typeof input.focus === "function") input.focus();
      open(false);
    });
  }

  document.addEventListener("mousedown", (e) => {
    if (!state.isOpen) return;
    if (e && e.target && typeof root.contains === "function" && root.contains(e.target)) return;
    close(true);
  });

  const api = {
    setData(data) {
      state.items = Array.isArray(data.items) ? data.items : [];
      state.selectedValue = data.selectedValue || "";
      state.selectedLabel = data.selectedLabel || "";
      state.placeholder = data.placeholder || "";
      state.extraItemsBuilder = data.extraItemsBuilder || null;
      state.emptyBuilder = data.emptyBuilder || null;
      input.placeholder = state.placeholder;
      if (!state.isOpen) {
        input.value = state.selectedLabel || "";
        syncClearBtn();
      } else {
        renderMenu(false);
      }
    },
    open,
    close,
    selectItem,
    getState: () => state
  };
  return api;
}

function applyRwBaseSelection(bCode) {
  pdSelectedRwBaseCode = bCode;
  const loadout = pdActiveTarget === "char" ? pdCharLoadout : pdMercLoadout;
  const cur = loadout[pdActiveSlot];
  if (cur && cur.cat === "rw") {
    const nextBase = getBaseRule(pdSelectedRwBaseCode);
    const rwObj = (rwList || []).find(x => x.id === cur.id);
    if (nextBase && rwObj && rwObj.sockets <= nextBase.maxSockets && doesRwTypeMatchBase(rwObj, nextBase)) {
      cur.baseCode = pdSelectedRwBaseCode;
    }
  }
  renderPaperdollAll();
}

function ensureSlotCombos() {
  if (!pdRwBaseCombo) {
    pdRwBaseCombo = createSearchableCombo({
      rootId: "pd-rw-base-combo",
      inputId: "pd-rw-base-input",
      clearId: "pd-rw-base-clear",
      toggleId: "pd-rw-base-toggle",
      menuId: "pd-rw-base-listbox",
      onSelect(item) {
        if (item && item.value) applyRwBaseSelection(item.value);
      }
    });
  }
  if (!pdItemCombo) {
    pdItemCombo = createSearchableCombo({
      rootId: "pd-item-combo",
      inputId: "pd-item-input",
      clearId: "pd-item-clear",
      toggleId: "pd-item-toggle",
      menuId: "pd-item-listbox",
      onSelect(item) {
        if (!item) return;
        if (item.kind === "rw-base") {
          applyRwBaseSelection(item.value);
        } else {
          equipActiveSlot(item.cat || pdActiveCat, item.value);
        }
      },
      onJump(targetCat, bCode, comboApi) {
        comboApi.close(false);
        pdActiveCat = targetCat;
        if (targetCat === "rw") {
          pdSelectedRwBaseCode = bCode;
          renderSlotEditor();
          comboApi.open(false);
        } else {
          equipActiveSlot(targetCat, bCode);
        }
      }
    });
  }
}

function renderCustomJewelInlineHtml(sockIdx, entry) {
  const ja = (pdData && pdData.jewelAffixes) || { prefixes: [], suffixes: [] };
  const isRare = entry.customJewel === "rare";
  if (!Array.isArray(entry.pre)) entry.pre = [];
  if (!Array.isArray(entry.suf)) entry.suf = [];
  if (!isRare) {
    const preItem = entry.pre[0] || null;
    const sufItem = entry.suf[0] || null;
    const preDef = preItem ? getJewelAffixDef("pre", preItem.id) : null;
    const sufDef = sufItem ? getJewelAffixDef("suf", sufItem.id) : null;
    const preVal = preDef ? clampJewelAffixVal(preDef, preItem.val, false) : 0;
    const sufVal = sufDef ? clampJewelAffixVal(sufDef, sufItem.val, false) : 0;
    return '<div class="pd-jewel-builder" data-jw-box="' + sockIdx + '">' +
      '<div class="pd-jewel-head"><strong style="color:#7cb6ff">💎 自定义蓝珠宝（自选 1 前缀 + 1 后缀 · 可填实际数值）</strong></div>' +
      '<div class="pd-jewel-row">' +
        '<label for="pd-jw-pre-' + sockIdx + '">前缀：</label>' +
        '<select id="pd-jw-pre-' + sockIdx + '" class="sim-select" data-jw-m-sel="pre" data-jw-sock="' + sockIdx + '" style="flex:1;min-width:140px;height:26px;font-size:11.5px">' +
          '<option value="">-- 无前缀 --</option>' +
          ja.prefixes.map(p => '<option value="' + escapeHtml(p.id) + '"' + (preItem && preItem.id === p.id ? ' selected' : '') + '>' + escapeHtml(p.nameZh + ' (' + p.min + (p.max > p.min ? ('–' + p.max) : '') + p.unit + ')') + '</option>').join("") +
        '</select>' +
        (preDef && preDef.max > preDef.min
          ? '<input type="number" inputmode="numeric" class="pd-jewel-val-inp" data-jw-m-val="pre" data-jw-sock="' + sockIdx + '" min="' + preDef.min + '" max="' + preDef.max + '" value="' + preVal + '" aria-label="前缀数值" /><span>' + escapeHtml(preDef.unit) + '</span>'
          : '') +
      '</div>' +
      '<div class="pd-jewel-row">' +
        '<label for="pd-jw-suf-' + sockIdx + '">后缀：</label>' +
        '<select id="pd-jw-suf-' + sockIdx + '" class="sim-select" data-jw-m-sel="suf" data-jw-sock="' + sockIdx + '" style="flex:1;min-width:140px;height:26px;font-size:11.5px">' +
          '<option value="">-- 无后缀 --</option>' +
          ja.suffixes.map(s => '<option value="' + escapeHtml(s.id) + '"' + (sufItem && sufItem.id === s.id ? ' selected' : '') + '>' + escapeHtml(s.nameZh + ' (' + s.min + (s.max > s.min ? ('–' + s.max) : '') + s.unit + ')') + '</option>').join("") +
        '</select>' +
        (sufDef && sufDef.max > sufDef.min
          ? '<input type="number" inputmode="numeric" class="pd-jewel-val-inp" data-jw-m-val="suf" data-jw-sock="' + sockIdx + '" min="' + sufDef.min + '" max="' + sufDef.max + '" value="' + sufVal + '" aria-label="后缀数值" /><span>' + escapeHtml(sufDef.unit) + '</span>'
          : '') +
      '</div>' +
    '</div>';
  }
  const total = entry.pre.length + entry.suf.length;
  const usedPreGroups = new Set(entry.pre.map(x => getJewelAffixDef("pre", x.id)?.group).filter(Boolean));
  const usedSufGroups = new Set(entry.suf.map(x => getJewelAffixDef("suf", x.id)?.group).filter(Boolean));
  const availPre = ja.prefixes.filter(p => !usedPreGroups.has(p.group));
  const availSuf = ja.suffixes.filter(s => !s.magicOnly && !usedSufGroups.has(s.group));
  const renderChips = (kind, arr) => arr.map((it, aIdx) => {
    const def = getJewelAffixDef(kind, it.id);
    if (!def) return "";
    const hi = def.rareMax || def.max;
    const v = clampJewelAffixVal(def, it.val, true);
    return '<div class="pd-jewel-chip">' +
      '<span><strong style="color:' + (kind === "pre" ? "#7cb6ff" : "#ffe08c") + '">' + (kind === "pre" ? "[前] " : "[后] ") + '</strong>' + escapeHtml(def.nameZh) + '</span>' +
      '<span style="display:inline-flex;align-items:center;gap:4px">' +
        (hi > def.min
          ? '<input type="number" inputmode="numeric" class="pd-jewel-val-inp" data-jw-r-val="' + kind + '" data-jw-sock="' + sockIdx + '" data-jw-idx="' + aIdx + '" min="' + def.min + '" max="' + hi + '" value="' + v + '" aria-label="' + escapeHtml(def.nameZh) + '数值" /><span>' + escapeHtml(def.unit) + '</span>'
          : '<span style="color:#ffd573;font-weight:700">' + v + escapeHtml(def.unit) + '</span>') +
        '<button type="button" class="rw-btn" data-jw-r-del="' + kind + '" data-jw-sock="' + sockIdx + '" data-jw-idx="' + aIdx + '" style="padding:1px 6px;font-size:11px" aria-label="移除' + escapeHtml(def.nameZh) + '">×</button>' +
      '</span>' +
    '</div>';
  }).join("");
  return '<div class="pd-jewel-builder is-rare" data-jw-box="' + sockIdx + '">' +
    '<div class="pd-jewel-head">' +
      '<strong style="color:#f8e97a">✨ 自定义黄珠宝（总 ' + total + '/4 · 前 ' + entry.pre.length + '/3 · 后 ' + entry.suf.length + '/3）</strong>' +
      '<span style="color:var(--muted)">遵循黄珠官方上限</span>' +
    '</div>' +
    ((entry.pre.length || entry.suf.length) ? '<div class="pd-jewel-chip-list">' + renderChips("pre", entry.pre) + renderChips("suf", entry.suf) + '</div>' : '') +
    (total < 4 && entry.pre.length < 3 && availPre.length
      ? '<div class="pd-jewel-row">' +
          '<label for="pd-jw-rpre-' + sockIdx + '">加前缀：</label>' +
          '<select id="pd-jw-rpre-' + sockIdx + '" class="sim-select" data-jw-r-add-sel="pre" data-jw-sock="' + sockIdx + '" style="flex:1;min-width:130px;height:26px;font-size:11.5px">' +
            availPre.map(p => '<option value="' + escapeHtml(p.id) + '">' + escapeHtml(p.nameZh + ' (' + p.min + ((p.rareMax || p.max) > p.min ? ('–' + (p.rareMax || p.max)) : '') + p.unit + ')') + '</option>').join("") +
          '</select>' +
          '<button type="button" class="rw-btn" data-jw-r-add-btn="pre" data-jw-sock="' + sockIdx + '" style="padding:2px 8px;font-size:11px">+ 前缀</button>' +
        '</div>'
      : '') +
    (total < 4 && entry.suf.length < 3 && availSuf.length
      ? '<div class="pd-jewel-row">' +
          '<label for="pd-jw-rsuf-' + sockIdx + '">加后缀：</label>' +
          '<select id="pd-jw-rsuf-' + sockIdx + '" class="sim-select" data-jw-r-add-sel="suf" data-jw-sock="' + sockIdx + '" style="flex:1;min-width:130px;height:26px;font-size:11.5px">' +
            availSuf.map(s => '<option value="' + escapeHtml(s.id) + '">' + escapeHtml(s.nameZh + ' (' + s.min + ((s.rareMax || s.max) > s.min ? ('–' + (s.rareMax || s.max)) : '') + s.unit + ')') + '</option>').join("") +
          '</select>' +
          '<button type="button" class="rw-btn" data-jw-r-add-btn="suf" data-jw-sock="' + sockIdx + '" style="padding:2px 8px;font-size:11px">+ 后缀</button>' +
        '</div>'
      : '') +
  '</div>';
}

function renderSlotEditor() {
  const titleEl = document.getElementById("pd-editor-title");
  const tipEl = document.getElementById("pd-editor-rule-tip");
  const unequipBtn = document.getElementById("pd-unequip-btn");
  const equipCtrl = document.getElementById("pd-equip-editor-controls");
  const bagCtrl = document.getElementById("pd-bag-editor-controls");
  const itemComboLabel = document.getElementById("pd-item-combo-label");
  const rwBaseRow = document.getElementById("pd-rw-base-row");
  const craftSkillRow = document.getElementById("pd-craft-skill-row");
  const ethCb = document.getElementById("pd-item-eth");
  const sockSec = document.getElementById("pd-sockets-section");
  const sockList = document.getElementById("pd-sockets-list");
  const sliderSec = document.getElementById("pd-sliders-section");
  if (!titleEl || !itData || !pdData) return;
  ensureSlotCombos();

  const clsObj = getActiveClassObj();

  // Bag Charm Editor Mode
  if (pdActiveTarget === "bag") {
    if (pdRwBaseCombo) pdRwBaseCombo.close(false);
    if (pdItemCombo) pdItemCombo.close(false);
    if (equipCtrl) equipCtrl.style.display = "none";
    if (bagCtrl) bagCtrl.style.display = "flex";
    if (sockSec) sockSec.style.display = "none";
    if (craftSkillRow) craftSkillRow.style.display = "none";
    if (unequipBtn) unequipBtn.textContent = "移出背包";

    const bagItem = pdCharBag.find(x => x.uid === pdActiveBagUid);
    const def = bagItem ? getBagCharmDef(bagItem.charmId) : null;
    if (!bagItem || !def) {
      titleEl.textContent = "角色背包咒符编辑器";
      tipEl.textContent = "请点击左侧 10×4 背包中的任意咒符，或点击装备槽位返回配装";
      if (sliderSec) sliderSec.style.display = "none";
      if (bagCtrl) bagCtrl.style.display = "none";
      renderAffixBuilder(null, "", "", clsObj, null);
      renderActiveItemPreview();
      return;
    }
    titleEl.textContent = "正在编辑背包：" + def.nameZh;
    tipEl.textContent = "占格尺寸：" + def.w + "×" + def.h + "（" + (def.isBlankMagic ? "蓝装空白咒符 · 手动选 1 前缀 + 1 后缀自动锁定" : (def.unique ? "唯一暗金/工具，限带 1 个" : "可多块叠加，受 40 格背包容量限制")) + "）";

    const skRow = document.getElementById("pd-bag-edit-skiller-row");
    const skSel = document.getElementById("pd-bag-edit-skiller-select");
    if (skRow && skSel) {
      if (def.isSkiller && clsObj && clsObj.tabs) {
        skRow.style.display = "flex";
        skSel.innerHTML = clsObj.tabs.map(t =>
          '<option value="' + t.page + '"' + (t.page === bagItem.tabPage ? ' selected' : '') + '>+1 ' + escapeHtml(t.zhCN) + '</option>'
        ).join("");
      } else {
        skRow.style.display = "none";
      }
    }
    const dupBtn = document.getElementById("pd-bag-dup-btn");
    if (dupBtn) {
      dupBtn.style.display = def.unique ? "none" : "inline-block";
    }
    const sizeTip = document.getElementById("pd-bag-item-size-tip");
    if (sizeTip) sizeTip.textContent = def.isBlankMagic ? "选择前后缀后，下方自动生成精确变量滑块" : "背包位置实时生效于人物属性与技能面板";

    if (def.isBlankMagic) {
      renderAffixBuilder(bagItem, def.affixSlot, "magic", clsObj, null);
    } else {
      renderAffixBuilder(null, "", "", clsObj, null);
    }
    renderSlidersForTarget(getBagItemRawStats(bagItem, def), bagItem);
    renderActiveItemPreview();
    return;
  }

  // Equipment Slot Editor Mode
  if (equipCtrl) equipCtrl.style.display = "flex";
  if (bagCtrl) bagCtrl.style.display = "none";
  if (unequipBtn) unequipBtn.textContent = "卸下该槽位";

  const merc = getCurrentMercVariant();
  const slotDefs = pdActiveTarget === "char" ? PD_CHAR_SLOTS : PD_MERC_SLOTS;
  const slotObj = slotDefs.find(s => s.id === pdActiveSlot) || slotDefs[0];
  const loadout = pdActiveTarget === "char" ? pdCharLoadout : pdMercLoadout;
  const actorLabel = pdActiveTarget === "char"
    ? ("角色（" + (clsObj ? clsObj.nameZh : "术士") + "）")
    : ("佣兵（Act " + merc.act + "）");
  titleEl.textContent = "正在编辑：" + actorLabel + " · " + slotObj.label;
  tipEl.textContent = getSlotRuleDescription(pdActiveTarget, pdActiveSlot);

  const isNoSocketSlot = ["amulet", "ring1", "ring2", "gloves", "boots", "belt"].includes(pdActiveSlot);
  if (isNoSocketSlot && (pdActiveCat === "rw" || pdActiveCat === "base")) {
    pdActiveCat = "unique";
  }
  document.querySelectorAll("#pd-cat-chips [data-pd-cat]").forEach(btn => {
    const c = btn.dataset.pdCat;
    btn.disabled = isNoSocketSlot && (c === "rw" || c === "base");
    btn.style.opacity = btn.disabled ? ".38" : "1";
    btn.classList.toggle("active", c === pdActiveCat);
  });

  const curEq = loadout[pdActiveSlot] || null;
  if (ethCb) ethCb.checked = Boolean(curEq && curEq.eth);

  const allLegalBases = Object.values(pdData.baseRules || {}).filter(b =>
    isBaseRuleLegalForTargetSlot(pdActiveTarget, pdActiveSlot, b)
  );
  const legalSocketBases = allLegalBases.filter(b => b.maxSockets > 0);
  const matchTokens = (text, q) => {
    const hay = String(text || "").toLowerCase();
    return String(q || "").toLowerCase().split(/\s+/).filter(Boolean).every(t => hay.includes(t));
  };
  const buildCrossBaseEmptyHtml = (q) => {
    const crossBases = q ? allLegalBases.filter(b => matchTokens(getBaseSearchText(b), q)) : [];
    if (crossBases.length && !isNoSocketSlot) {
      return '<div class="pd-combo-empty">' +
        '<span>当前分类无匹配，但命中 ' + crossBases.length + ' 种底材：</span>' +
        '<div class="pd-combo-jump-row">' +
          '<button type="button" class="pd-search-hit is-base-hit" data-jump-cat="rw" data-jump-base="' + escapeHtml(crossBases[0].code) + '">切到符文之语选用「' + escapeHtml(crossBases[0].nameZh) + '」</button>' +
          '<button type="button" class="pd-search-hit" data-jump-cat="rare" data-jump-base="' + escapeHtml(crossBases[0].code) + '">以此底材建黄装</button>' +
          '<button type="button" class="pd-search-hit" data-jump-cat="magic" data-jump-base="' + escapeHtml(crossBases[0].code) + '">以此底材建蓝装</button>' +
        '</div>' +
      '</div>';
    }
    return '<div class="pd-combo-empty">当前槽位与分类下无匹配项，可点击 × 清空或切换上方品质标签</div>';
  };

  const catLabels = {
    rw: "符文之语：",
    unique: "暗金装备：",
    set: "绿色套装：",
    craft: "手工橙装：",
    magic: ["amulet", "ring1", "ring2"].includes(pdActiveSlot) ? "蓝装首饰：" : "蓝装底材：",
    rare: ["amulet", "ring1", "ring2"].includes(pdActiveSlot) ? "黄装首饰：" : "黄装底材：",
    base: "打孔底材："
  };
  if (itemComboLabel) itemComboLabel.textContent = catLabels[pdActiveCat] || "选择装备：";

  let comboItems = [];
  let selectedVal = "";
  let selectedLabel = "";
  let comboPlaceholder = "输入关键词筛选，或直接点击下拉浏览...";
  let extraItemsBuilder = null;
  let emptyBuilder = buildCrossBaseEmptyHtml;

  if (pdActiveCat === "rw") {
    if (rwBaseRow) rwBaseRow.style.display = "flex";
    let curBaseCode = "";
    if (pdSelectedRwBaseCode && legalSocketBases.some(b => b.code === pdSelectedRwBaseCode)) {
      curBaseCode = pdSelectedRwBaseCode;
    } else if (curEq && curEq.baseCode && legalSocketBases.some(b => b.code === curEq.baseCode)) {
      curBaseCode = curEq.baseCode;
    } else {
      curBaseCode = legalSocketBases[legalSocketBases.length - 1]?.code || "";
    }
    pdSelectedRwBaseCode = curBaseCode;
    const activeBase = getBaseRule(curBaseCode) || legalSocketBases[0];
    if (pdRwBaseCombo) {
      const clsBlkFactor = (pdData && pdData.charBaseStats && pdData.charBaseStats[skActiveClassId] && pdData.charBaseStats[skActiveClassId].blockFactor) || 25;
      const baseItems = legalSocketBases.map(b => {
        const blkInfo = b.block > 0 ? (" · 格挡 " + (b.block + clsBlkFactor) + "%") : "";
        return {
          value: b.code,
          title: b.nameZh,
          displayLabel: b.nameZh + " (" + b.maxSockets + "孔 · 需力" + b.reqStr + blkInfo + ")",
          sub: b.nameEn + " · 最多 " + b.maxSockets + "孔 · 需力 " + b.reqStr + blkInfo + (b.type === "ashd" ? " · 圣骑士专属" : ""),
          tag: b.maxSockets + "孔",
          searchText: getBaseSearchText(b) + " " + b.maxSockets + "孔 " + b.reqStr + (b.type === "ashd" ? " 圣骑士盾" : "")
        };
      });
      const activeBaseItem = baseItems.find(x => x.value === curBaseCode);
      pdRwBaseCombo.setData({
        items: baseItems,
        selectedValue: curBaseCode,
        selectedLabel: activeBaseItem ? activeBaseItem.displayLabel : "",
        placeholder: "输入搜底材/别名（巨神长柄斧、连枷、统盾...），或点击下拉 (" + baseItems.length + " 种)"
      });
    }
    const validRws = (rwList || []).filter(rw => {
      if (!activeBase || rw.sockets > activeBase.maxSockets) return false;
      return doesRwTypeMatchBase(rw, activeBase);
    });
    comboItems = validRws.map(rw => {
      const title = pickLangTitle(rw);
      const rwStatTxt = getRunewordStatLines(rw, activeBase).join(" ");
      return {
        value: rw.id,
        cat: "rw",
        title: title,
        displayLabel: title + " (" + rw.name + " · " + rw.sockets + "孔)",
        sub: rw.name + " · " + rw.sockets + "孔" + (rw.basesZh ? (" · " + rw.basesZh) : ""),
        tag: rw.sockets + "孔",
        searchText: rw.zhName + " " + rw.name + " " + (rw.basesZh || "") + " " + rw.sockets + "孔 " + rwStatTxt
      };
    });
    if (curEq && curEq.cat === "rw") {
      selectedVal = curEq.id;
      const hit = comboItems.find(x => x.value === curEq.id);
      selectedLabel = hit ? hit.displayLabel : "";
    }
    comboPlaceholder = "输入搜符文之语或直接下拉选择 (" + comboItems.length + " 个可用)...";
    extraItemsBuilder = (q) => legalSocketBases
      .filter(b => matchTokens(getBaseSearchText(b), q))
      .slice(0, 6)
      .map(b => ({
        kind: "rw-base",
        value: b.code,
        title: "🎯 切换底材：" + b.nameZh,
        sub: b.nameEn + " · 最多 " + b.maxSockets + "孔 · 需力 " + b.reqStr,
        tag: "切底材"
      }));
  } else {
    if (rwBaseRow) rwBaseRow.style.display = "none";
    if (pdRwBaseCombo) pdRwBaseCombo.close(false);

    if (pdActiveCat === "unique") {
      const validUniques = (itData.uniqueItems || []).filter(u => {
        if (pdActiveSlot === "amulet") return u.slot === "amulet";
        if (pdActiveSlot === "ring1" || pdActiveSlot === "ring2") return u.slot === "ring";
        const m = pdData.uniqueMeta && pdData.uniqueMeta[u.nameEn];
        const b = m ? getBaseRule(m.code) : null;
        return isBaseRuleLegalForTargetSlot(pdActiveTarget, pdActiveSlot, b);
      });
      comboItems = validUniques.map(u => {
        const m = pdData.uniqueMeta && pdData.uniqueMeta[u.nameEn];
        const b = m ? getBaseRule(m.code) : null;
        const title = pickLangTitle(u);
        return {
          value: u.nameEn,
          cat: "unique",
          title: title,
          displayLabel: title + " (" + u.nameEn + ")",
          sub: u.nameEn + (b ? (" · " + b.nameZh) : ""),
          searchText: u.nameZh + " " + u.nameEn + " " + u.stats + " " + getBaseSearchText(b)
        };
      });
      if (curEq && curEq.cat === "unique") {
        selectedVal = curEq.id;
        const hit = comboItems.find(x => x.value === curEq.id);
        selectedLabel = hit ? hit.displayLabel : "";
      }
      comboPlaceholder = "输入搜暗金装备/属性，或点击下拉选择 (" + comboItems.length + " 件可用)...";
    } else if (pdActiveCat === "set") {
      const allSetPieces = [];
      for (const s of (itData.setItems || [])) {
        for (const p of ((s.detail && s.detail.pieces) || [])) {
          allSetPieces.push({ p, s });
        }
      }
      const validPieces = allSetPieces.filter(({ p }) => {
        if (pdActiveSlot === "amulet") return p.slotZh.includes("项链") || p.slotZh.includes("护身符");
        if (pdActiveSlot === "ring1" || pdActiveSlot === "ring2") return p.slotZh.includes("戒指");
        const m = pdData.setMeta && pdData.setMeta[p.nameEn];
        const b = m ? getBaseRule(m.code) : null;
        return isBaseRuleLegalForTargetSlot(pdActiveTarget, pdActiveSlot, b);
      });
      comboItems = validPieces.map(({ p, s }) => {
        const m = pdData.setMeta && pdData.setMeta[p.nameEn];
        const b = m ? getBaseRule(m.code) : null;
        const title = pickLangTitle(p);
        return {
          value: p.nameEn,
          cat: "set",
          title: title,
          displayLabel: title + " [" + s.nameZh + "]",
          sub: s.nameZh + " · " + p.nameEn + (b ? (" · " + b.nameZh) : ""),
          searchText: p.nameZh + " " + p.nameEn + " " + s.nameZh + " " + (p.stats || []).join(" ") + " " + getBaseSearchText(b)
        };
      });
      if (curEq && curEq.cat === "set") {
        selectedVal = curEq.id;
        const hit = comboItems.find(x => x.value === curEq.id);
        selectedLabel = hit ? hit.displayLabel : "";
      }
      comboPlaceholder = "输入搜绿色套装/部位，或点击下拉选择 (" + comboItems.length + " 件可用)...";
    } else if (pdActiveCat === "craft") {
      const validCrafts = (pdData.craftedItems || []).filter(c => {
        if (pdActiveSlot === "amulet") return c.slot === "amulet";
        if (pdActiveSlot === "ring1" || pdActiveSlot === "ring2") return c.slot === "ring";
        const b = c.code ? getBaseRule(c.code) : null;
        return isBaseRuleLegalForTargetSlot(pdActiveTarget, pdActiveSlot, b);
      });
      comboItems = validCrafts.map(c => ({
        value: c.id,
        cat: "craft",
        title: "[" + c.recipe + "] " + c.nameZh,
        displayLabel: "[" + c.recipe + "] " + c.nameZh,
        sub: c.nameEn + " · " + c.stats,
        searchText: c.nameZh + " " + c.nameEn + " " + c.recipe + " " + c.stats
      }));
      if (curEq && curEq.cat === "craft") {
        selectedVal = curEq.id;
        const hit = comboItems.find(x => x.value === curEq.id);
        selectedLabel = hit ? hit.displayLabel : "";
      }
      comboPlaceholder = "输入搜手工橙装配方，或点击下拉选择 (" + comboItems.length + " 件可用)...";
    } else if (pdActiveCat === "magic" || pdActiveCat === "rare") {
      const isM = pdActiveCat === "magic";
      const qLabel = isM ? "蓝装" : "黄装";
      if (pdActiveSlot === "amulet") {
        const accId = isM ? "__magic_amulet__" : "__rare_amulet__";
        comboItems = [{
          value: accId,
          cat: pdActiveCat,
          title: "空白" + qLabel + "护身符(项链)",
          displayLabel: "空白" + qLabel + "护身符(项链)",
          sub: "0 初始属性 · 放入后在下方自选官方前后缀",
          searchText: "项链 护身符 amulet " + qLabel
        }];
        if (curEq && curEq.cat === pdActiveCat && curEq.id === accId) {
          selectedVal = accId;
          selectedLabel = comboItems[0].displayLabel;
        }
        comboPlaceholder = "点击放入空白" + qLabel + "项链（放入后自选词缀）";
      } else if (pdActiveSlot === "ring1" || pdActiveSlot === "ring2") {
        const accId = isM ? "__magic_ring__" : "__rare_ring__";
        comboItems = [{
          value: accId,
          cat: pdActiveCat,
          title: "空白" + qLabel + "戒指",
          displayLabel: "空白" + qLabel + "戒指",
          sub: "0 初始属性 · 放入后在下方自选官方前后缀",
          searchText: "戒指 ring " + qLabel
        }];
        if (curEq && curEq.cat === pdActiveCat && curEq.id === accId) {
          selectedVal = accId;
          selectedLabel = comboItems[0].displayLabel;
        }
        comboPlaceholder = "点击放入空白" + qLabel + "戒指（放入后自选词缀）";
      } else {
        comboItems = allLegalBases.map(b => ({
          value: b.code,
          cat: pdActiveCat,
          title: b.nameZh,
          displayLabel: b.nameZh + " (" + b.nameEn + (b.maxSockets > 0 ? (" · 最多" + b.maxSockets + "孔") : "") + ")",
          sub: b.nameEn + (b.maxSockets > 0 ? (" · 最多 " + b.maxSockets + "孔") : "") + " · 需力 " + b.reqStr,
          tag: b.maxSockets > 0 ? (b.maxSockets + "孔") : "",
          searchText: getBaseSearchText(b) + " " + b.reqStr
        }));
        if (curEq && curEq.cat === pdActiveCat) {
          selectedVal = curEq.baseCode || curEq.id;
          const hit = comboItems.find(x => x.value === selectedVal);
          selectedLabel = hit ? hit.displayLabel : "";
        }
        comboPlaceholder = "输入搜" + qLabel + "底材，或点击下拉选择 (" + comboItems.length + " 种)...";
      }
    } else if (pdActiveCat === "base") {
      comboItems = legalSocketBases.map(b => ({
        value: b.code,
        cat: "base",
        title: b.nameZh,
        displayLabel: b.nameZh + " (" + b.nameEn + " · 最大 " + b.maxSockets + "孔)",
        sub: b.nameEn + " · 最大 " + b.maxSockets + "孔 · 需力 " + b.reqStr,
        tag: b.maxSockets + "孔",
        searchText: getBaseSearchText(b) + " " + b.maxSockets + "孔 " + b.reqStr
      }));
      if (curEq && curEq.cat === "base") {
        selectedVal = curEq.baseCode || curEq.id;
        const hit = comboItems.find(x => x.value === selectedVal);
        selectedLabel = hit ? hit.displayLabel : "";
      }
      comboPlaceholder = "输入搜打孔底材/别名，或点击下拉选择 (" + comboItems.length + " 种)...";
    }
  }

  if (pdItemCombo) {
    pdItemCombo.setData({
      items: comboItems,
      selectedValue: selectedVal,
      selectedLabel: selectedLabel,
      placeholder: comboPlaceholder,
      extraItemsBuilder: extraItemsBuilder,
      emptyBuilder: emptyBuilder
    });
  }

  // Crafted items now use the full Official Rare Affix Builder (up to 4 random affixes including +1~2 Class/Tab skills!), so hide the legacy standalone craft-skill dropdown
  if (craftSkillRow) {
    craftSkillRow.style.display = "none";
  }

  const info = curEq ? resolveEquippedItemInfo(curEq, getSlotResolveOpts(pdActiveTarget, pdActiveSlot)) : null;
  const supRow = document.getElementById("pd-superior-row");
  if (supRow) {
    const canSup = Boolean(curEq && info && info.bRule && (curEq.cat === "rw" || curEq.cat === "base") && (info.bRule.slot === "weapon" || info.bRule.maxDef > 0));
    supRow.style.display = canSup ? "flex" : "none";
    if (canSup) {
      const isWeap = info.bRule.slot === "weapon";
      const edWrap = document.getElementById("pd-sup-ed-wrap");
      const arWrap = document.getElementById("pd-sup-ar-wrap");
      const defWrap = document.getElementById("pd-sup-def-wrap");
      if (edWrap) edWrap.style.display = isWeap ? "inline-flex" : "none";
      if (arWrap) arWrap.style.display = isWeap ? "inline-flex" : "none";
      if (defWrap) defWrap.style.display = isWeap ? "none" : "inline-flex";
      const edInp = document.getElementById("pd-sup-ed");
      const arInp = document.getElementById("pd-sup-ar");
      const defInp = document.getElementById("pd-sup-def");
      if (edInp && document.activeElement !== edInp) edInp.value = String(Math.min(15, Math.max(0, Math.floor(Number(curEq.supEd || 0)))));
      if (arInp && document.activeElement !== arInp) arInp.value = String(Math.min(3, Math.max(0, Math.floor(Number(curEq.supAr || 0)))));
      if (defInp && document.activeElement !== defInp) defInp.value = String(Math.min(15, Math.max(0, Math.floor(Number(curEq.supDef || 0)))));
    }
  }
  const palRow = document.getElementById("pd-pal-shield-row");
  if (palRow) {
    const canPalMod = Boolean(curEq && info && info.bRule && info.bRule.type === "ashd" && ["rw", "base", "magic", "rare", "craft"].includes(curEq.cat));
    palRow.style.display = canPalMod ? "flex" : "none";
    if (canPalMod) {
      const mode = curEq.palModType === "dmg" ? "dmg" : "res";
      const rRes = document.getElementById("pd-pal-mod-res");
      const rDmg = document.getElementById("pd-pal-mod-dmg");
      if (rRes) rRes.checked = mode === "res";
      if (rDmg) rDmg.checked = mode === "dmg";
      const resWrap = document.getElementById("pd-pal-res-wrap");
      const dmgWrap = document.getElementById("pd-pal-dmg-wrap");
      if (resWrap) resWrap.style.display = mode === "res" ? "inline-flex" : "none";
      if (dmgWrap) dmgWrap.style.display = mode === "dmg" ? "inline-flex" : "none";
      const resInp = document.getElementById("pd-pal-res");
      const edInp = document.getElementById("pd-pal-ed");
      const arInp = document.getElementById("pd-pal-ar");
      if (resInp && document.activeElement !== resInp) resInp.value = String(Math.min(45, Math.max(0, Math.floor(Number(curEq.palRes || 0)))));
      if (edInp && document.activeElement !== edInp) edInp.value = String(Math.min(65, Math.max(0, Math.floor(Number(curEq.palEd || 0)))));
      if (arInp && document.activeElement !== arInp) arInp.value = String(Math.min(121, Math.max(0, Math.floor(Number(curEq.palAr || 0)))));
      const blkHint = document.getElementById("pd-pal-block-hint");
      if (blkHint) blkHint.textContent = "底材格挡 " + (info.itemDisplayBlock || (info.bRule.block + 30)) + "% · 盾击 " + (info.bRule.minDmg || 0) + "–" + (info.bRule.maxDmg || 0);
    }
  }
  if (!info) {
    renderAffixBuilder(null, "", "", clsObj, null);
    sockSec.style.display = "none";
    sliderSec.style.display = "none";
    renderActiveItemPreview();
    return;
  }

  // Render Magic / Rare / Crafted Affix Builder for equipped Magic, Rare, or Crafted gear
  if (curEq.cat === "magic" || curEq.cat === "rare" || curEq.cat === "craft") {
    const afSlot = getAffixSlotForEquip(pdActiveSlot, info.bRule);
    renderAffixBuilder(curEq, afSlot, curEq.cat, clsObj, info.bRule);
  } else {
    renderAffixBuilder(null, "", "", clsObj, null);
  }

  // Render dynamic sockets (supports Runes, Perfect Gems, Preset Jewels, and Custom Magic/Rare Jewel Prefix+Suffix Builder)
  if (info.maxSocks > 0) {
    sockSec.style.display = "block";
    document.getElementById("pd-max-sock-num").textContent = String(info.maxSocks);
    const applyType = info.bRule ? info.bRule.gemApplyType : 0;
    const applyLabel = applyType === 2 ? "盾牌/魔典镶嵌属性" : applyType === 1 ? "头盔/盔甲镶嵌属性" : "武器镶嵌属性";
    document.getElementById("pd-sock-mode-tip").textContent = "生效部位：" + applyLabel;

    const allSocks = pdData.socketables || [];
    const jewelPresets = allSocks.filter(x => x.kind === "jewel");
    const runeSocks = allSocks.filter(x => x.kind === "rune");
    const gemSocks = allSocks.filter(x => x.kind === "gem");
    const renderOptList = (arr, selVal) => arr.map(sk => {
      const eff = applyType === 2 ? sk.shield : applyType === 1 ? sk.helm : sk.weapon;
      return '<option value="' + escapeHtml(sk.id) + '"' + (sk.id === selVal ? ' selected' : '') + '>' +
        escapeHtml(sk.nameZh) + ' — ' + escapeHtml(eff) +
      '</option>';
    }).join("");

    let sockRowsHtml = "";
    for (let i = 0; i < info.maxSocks; i++) {
      const curEntry = (curEq.sockets && curEq.sockets[i]) || "";
      const isCust = isCustomJewelSocket(curEntry);
      const curSelVal = isCust ? (curEntry.customJewel === "rare" ? "__jw_rare__" : "__jw_magic__") : curEntry;
      const jInfo = isCust ? resolveCustomJewelInfo(curEntry) : null;
      const sObj = !isCust ? allSocks.find(x => x.id === curEntry) : null;
      const ico = (jInfo && jInfo.icon) || (sObj && sObj.icon) || "/images/ui/gemsocket.webp";
      sockRowsHtml += '<div class="pd-sock-slot-box">' +
        '<div class="pd-sock-item">' +
          '<img class="pd-sock-ico" src="' + escapeHtml(ico) + '" alt="" />' +
          '<select class="sim-select" data-pd-sock-idx="' + i + '" aria-label="孔位 #' + (i + 1) + ' 镶嵌物" style="flex:1;height:30px;font-size:12px">' +
            '<option value="">-- 孔位 #' + (i + 1) + '：空孔 (未镶嵌) --</option>' +
            '<optgroup label="💎 自定义珠宝（自由拆选前后缀与数值）">' +
              '<option value="__jw_magic__"' + (curSelVal === "__jw_magic__" ? ' selected' : '') + '>💎 自定义蓝珠宝（自选 1 前缀 + 1 后缀 · 含 15% IAS）</option>' +
              '<option value="__jw_rare__"' + (curSelVal === "__jw_rare__" ? ' selected' : '') + '>✨ 自定义黄珠宝（自选最多 4 条词缀 · 前/后各上限 3）</option>' +
            '</optgroup>' +
            '<optgroup label="🌈 彩虹刻面 & 常用快捷预设珠宝">' + renderOptList(jewelPresets, curSelVal) + '</optgroup>' +
            '<optgroup label="🪨 符文 (1#–33#)">' + renderOptList(runeSocks, curSelVal) + '</optgroup>' +
            '<optgroup label="💠 完美宝石">' + renderOptList(gemSocks, curSelVal) + '</optgroup>' +
          '</select>' +
        '</div>' +
        (isCust ? renderCustomJewelInlineHtml(i, curEntry) : '') +
      '</div>';
    }
    sockList.innerHTML = sockRowsHtml;

    const syncJewelValLive = () => {
      renderPaperdollSlots();
      renderActiveItemPreview();
      renderPaperdollLiveStats();
      savePaperdollState();
    };

    sockList.querySelectorAll("[data-pd-sock-idx]").forEach(sel => {
      sel.addEventListener("change", (e) => {
        const idx = Number(e.target.dataset.pdSockIdx);
        if (!Array.isArray(curEq.sockets)) curEq.sockets = [];
        const v = e.target.value;
        if (v === "__jw_magic__") {
          curEq.sockets[idx] = { customJewel: "magic", pre: [], suf: [] };
        } else if (v === "__jw_rare__") {
          curEq.sockets[idx] = { customJewel: "rare", pre: [], suf: [] };
        } else {
          curEq.sockets[idx] = v;
        }
        renderPaperdollAll();
      });
    });

    sockList.querySelectorAll("[data-jw-m-sel]").forEach(sel => {
      sel.addEventListener("change", () => {
        const idx = Number(sel.dataset.jwSock);
        const kind = sel.dataset.jwMSel;
        const entry = curEq.sockets && curEq.sockets[idx];
        if (!isCustomJewelSocket(entry)) return;
        const aid = sel.value;
        if (!aid) {
          entry[kind] = [];
        } else {
          const def = getJewelAffixDef(kind, aid);
          entry[kind] = def ? [{ id: def.id, val: def.max }] : [];
        }
        renderPaperdollAll();
      });
    });

    sockList.querySelectorAll("[data-jw-m-val]").forEach(inp => {
      const onChange = () => {
        const idx = Number(inp.dataset.jwSock);
        const kind = inp.dataset.jwMVal;
        const entry = curEq.sockets && curEq.sockets[idx];
        if (!isCustomJewelSocket(entry) || !entry[kind] || !entry[kind][0]) return;
        const def = getJewelAffixDef(kind, entry[kind][0].id);
        entry[kind][0].val = clampJewelAffixVal(def, inp.value, false);
        syncJewelValLive();
      };
      inp.addEventListener("input", onChange);
      inp.addEventListener("change", onChange);
    });

    sockList.querySelectorAll("[data-jw-r-add-btn]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.jwSock);
        const kind = btn.dataset.jwRAddBtn;
        const entry = curEq.sockets && curEq.sockets[idx];
        if (!isCustomJewelSocket(entry)) return;
        const sel = sockList.querySelector('[data-jw-r-add-sel="' + kind + '"][data-jw-sock="' + idx + '"]');
        if (!sel || !sel.value) return;
        const def = getJewelAffixDef(kind, sel.value);
        if (!def) return;
        if (!Array.isArray(entry[kind])) entry[kind] = [];
        const total = (entry.pre?.length || 0) + (entry.suf?.length || 0);
        if (total >= 4 || entry[kind].length >= 3) return;
        entry[kind].push({ id: def.id, val: def.rareMax || def.max });
        renderPaperdollAll();
      });
    });

    sockList.querySelectorAll("[data-jw-r-del]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.jwSock);
        const kind = btn.dataset.jwRDel;
        const aIdx = Number(btn.dataset.jwIdx);
        const entry = curEq.sockets && curEq.sockets[idx];
        if (!isCustomJewelSocket(entry) || !Array.isArray(entry[kind])) return;
        entry[kind].splice(aIdx, 1);
        renderPaperdollAll();
      });
    });

    sockList.querySelectorAll("[data-jw-r-val]").forEach(inp => {
      const onChange = () => {
        const idx = Number(inp.dataset.jwSock);
        const kind = inp.dataset.jwRVal;
        const aIdx = Number(inp.dataset.jwIdx);
        const entry = curEq.sockets && curEq.sockets[idx];
        if (!isCustomJewelSocket(entry) || !entry[kind] || !entry[kind][aIdx]) return;
        const def = getJewelAffixDef(kind, entry[kind][aIdx].id);
        entry[kind][aIdx].val = clampJewelAffixVal(def, inp.value, true);
        syncJewelValLive();
      };
      inp.addEventListener("input", onChange);
      inp.addEventListener("change", onChange);
    });
  } else {
    sockSec.style.display = "none";
  }

  renderSlidersForTarget(info.rawStats, curEq);
  renderActiveItemPreview();
}

function computePassiveMasteryBonuses(clsObj, build, charTot, allSkillBonus, maxMode) {
  const res = { ed: 0, ar: 0, cs: 0, reqRed: 0, notes: [] };
  if (!clsObj) return res;
  const getLvl = (skillKey, defaultEmpty) => {
    const skObj = clsObj.skills.find(s => s.key === skillKey);
    if (!skObj) return 0;
    const hp = getPassiveHardPoints(clsObj.id, skillKey, maxMode, defaultEmpty !== undefined ? defaultEmpty : 20);
    if (hp.pts <= 0) return 0;
    return hp.pts + allSkillBonus + (charTot.tabSkills[skObj.page] || 0) + ((charTot.singleSkills && charTot.singleSkills[skillKey]) || 0);
  };

  if (clsObj.id === "war") {
    const lvl = getLvl("Levitate", 1);
    if (lvl > 0) {
      const ed = 25 + (lvl - 1) * 4;
      const ar = 40 + (lvl - 1) * 5;
      const cs = evalDiminishing(lvl, 0, 35);
      const reqRed = Math.min(50, 2 + (lvl - 1) * 2);
      res.ed += ed; res.ar += ar; res.cs = cs; res.reqRed = reqRed;
      res.notes.push("悬浮精通 Lv." + lvl + "：武器伤害 +" + ed + "% · 命中率 +" + ar + "% · 致命 " + cs + "% · 需求 -" + reqRed + "%");
    }
  } else if (clsObj.id === "bar") {
    const wt = charTot.mainWeapType || "";
    let mKey = "", mZh = "", arBase = 40;
    if (wt === "swor" || wt === "knif") { mKey = "Blade Mastery"; mZh = "刀剑精通"; }
    else if (wt === "axe") { mKey = "Axe Mastery"; mZh = "斧类精通"; }
    else if (["mace", "club", "hamm", "scep", "wand", "staf"].includes(wt)) { mKey = "Mace Mastery"; mZh = "锤类精通"; }
    else if (wt === "pole") { mKey = "Pole Arm Mastery"; mZh = "长柄精通"; arBase = 44; }
    else if (wt === "spea") { mKey = "Spear Mastery"; mZh = "长矛精通"; arBase = 44; }
    else if (["tkni", "taxe", "jave"].includes(wt)) { mKey = "Throwing Mastery"; mZh = "投掷精通"; arBase = 44; }
    if (mKey) {
      const lvl = getLvl(mKey, 20);
      if (lvl > 0) {
        const ed = 28 + (lvl - 1) * 5;
        const ar = arBase + (lvl - 1) * 8;
        const cs = evalDiminishing(lvl, 0, 35);
        res.ed += ed; res.ar += ar; res.cs = cs;
        res.notes.push(mZh + " Lv." + lvl + "：武器伤害 +" + ed + "% · 命中率 +" + ar + "% · 致命 " + cs + "%");
      }
    }
  } else if (clsObj.id === "pal") {
    const baBase = getPassiveHardPoints("pal", "Blessed Aim", maxMode, 0).pts;
    if (baBase > 0) {
      const baAr = baBase * 5;
      res.ar += baAr;
      res.notes.push("祝福瞄准隐藏被动 (" + baBase + "硬点)：+" + baAr + "% 攻击准确率 AR");
    }
  } else if (clsObj.id === "ama") {
    const csLvl = getLvl("Critical Strike", 1);
    if (csLvl > 0) {
      const cs = evalDiminishing(csLvl, 5, 80);
      res.cs = cs;
      res.notes.push("致命攻击 Lv." + csLvl + "：" + cs + "% 双倍物理伤害");
    }
    const penLvl = getLvl("Penetrate", 1);
    if (penLvl > 0) {
      const ar = 35 + (penLvl - 1) * 10;
      res.ar += ar;
      res.notes.push("刺穿 Lv." + penLvl + "：+" + ar + "% AR");
    }
  } else if (clsObj.id === "ass") {
    const wt = charTot.mainWeapType || "";
    if (wt === "h2h" || wt === "h2h2") {
      const lvl = getLvl("Claw Mastery", 20);
      if (lvl > 0) {
        const ed = 35 + (lvl - 1) * 4;
        const ar = 30 + (lvl - 1) * 10;
        const cs = evalDiminishing(lvl, 0, 25);
        res.ed += ed; res.ar += ar; res.cs = cs;
        res.notes.push("利爪精通 Lv." + lvl + "：爪伤 +" + ed + "% · 命中率 +" + ar + "% · 致命 " + cs + "%");
      }
    }
  }
  return res;
}

function computeSelectedSkillCombat(params) {
  const { clsObj, charTot, charLvl, totalStr, totalDex, ctaSkillBonus, teamBuffs, charFcrFrame, charAtkFrame, maxMode } = params;
  const base = (pdData && pdData.charBaseStats && pdData.charBaseStats[skActiveClassId]) || { toHitFactor: 0 };
  const build = getClassBuild(skActiveClassId);
  const allSkillBonus = charTot.skills + (charTot.classSkills || 0) + ctaSkillBonus;
  const mastery = computePassiveMasteryBonuses(clsObj, build, charTot, allSkillBonus, maxMode);

  // Base Attack Rating (AR)
  const baseAr = Math.max(0, totalDex * 5 - 35 + (base.toHitFactor || 0) + charTot.flatAr);
  const calcHitChance = (totalAr, alwaysHit) => {
    if (alwaysHit) return 95;
    if (charTot.itd) return 95;
    const monLvl = 85;
    const totalDefRed = Math.min(95, (teamBuffs.convDef || 0) + (teamBuffs.hexDefReduce || 0) + (charTot.targetDefPct || 0));
    const monDef = Math.max(0, Math.floor((1600 - teamBuffs.innerSightDef) * (1 - totalDefRed / 100)));
    const pct = Math.floor(100 * (totalAr / Math.max(1, totalAr + monDef)) * ((2 * charLvl) / (charLvl + monLvl)));
    return Math.min(95, Math.max(5, pct));
  };

  const dsChance = Math.min(100, charTot.ds);
  const csChance = Math.min(100, mastery.cs || 0);
  // Authentic D2R multiplicative CS + DS double-damage probability: 1 - (1 - DS)*(1 - CS)
  const effDoublePct = Math.round((1 - (1 - dsChance / 100) * (1 - csChance / 100)) * 1000) / 10;
  const dsMult = 1 + effDoublePct / 100;
  const atkPerSec = 25 / Math.max(1, charAtkFrame);
  const castPerSec = 25 / Math.max(1, charFcrFrame);

  // Helper for weapon physical damage (extraBaseMin/Max = skill flat phys added BEFORE off-weapon ED, e.g. Echoing Strike / Blade Fury)
  const calcWeaponHit = (skillEd, srcDamRatio, isSmite, isKick, includeMastery, extraBaseMin, extraBaseMax) => {
    let baseMin = charTot.mainWeapMin + charTot.flatDmg + charTot.flatMinDmg;
    let baseMax = charTot.mainWeapMax + charTot.flatDmg + charTot.flatMaxDmg;
    let statEd = Math.floor((totalStr * (charTot.mainWeapStrBonus || 100) + totalDex * (charTot.mainWeapDexBonus || 0)) / 100);
    if (isSmite) {
      baseMin = (charTot.shieldSmiteMin || 1) + charTot.flatDmg + (teamBuffs.holyShieldSmiteMin || 0);
      baseMax = (charTot.shieldSmiteMax || 4) + charTot.flatDmg + (teamBuffs.holyShieldSmiteMax || 0);
      statEd = totalStr;
    } else if (isKick) {
      baseMin = charTot.bootKickMin + Math.floor((totalStr + totalDex - 20) / 4);
      baseMax = charTot.bootKickMax + Math.floor((totalStr + totalDex - 20) / 3);
      statEd = Math.floor(totalStr * 1.2);
    }
    const mEd = includeMastery && !isSmite && !isKick ? mastery.ed : 0;
    const totalOffEd = statEd + skillEd + mEd + charTot.offWeaponEdPct + teamBuffs.physEdPct;
    const effBaseMin = Math.floor(baseMin * srcDamRatio) + (extraBaseMin || 0);
    const effBaseMax = Math.floor(baseMax * srcDamRatio) + (extraBaseMax || 0);
    const min = Math.max(1, Math.floor(effBaseMin * (1 + totalOffEd / 100)));
    const max = Math.max(min, Math.floor(effBaseMax * (1 + totalOffEd / 100)));
    return { min, max, baseMin, baseMax, totalOffEd, mEd };
  };

  const appendPhysDebuffNotes = (minVal, maxVal, notesArr) => {
    const gearPhysP = charTot.elePierce.phys || 0;
    const debuffP = teamBuffs.debuffPhysRes || 0;
    const resVs50 = Math.max(-100, 50 - gearPhysP - debuffP);
    const mult50 = (100 - resVs50) / 100;
    notesArr.push("对常规地狱怪 (50%物抗 → 实抗 " + resVs50 + "%)：单次物理 " + Math.round(minVal * mult50).toLocaleString() + "–" + Math.round(maxVal * mult50).toLocaleString());
    if (charTot.sunders.has("phys") || debuffP >= 100) {
      const baseImm = charTot.sunders.has("phys") ? 95 : 100;
      const effDebuff = Math.floor(debuffP / 5);
      const resImm = Math.max(-100, baseImm - gearPhysP - effDebuff);
      const multImm = Math.max(0, (100 - resImm) / 100);
      notesArr.push("对物免怪 (" + baseImm + "% → 实抗 " + resImm + "%)：破免有效物理伤害 " + Math.round(minVal * multImm).toLocaleString() + "–" + Math.round(maxVal * multImm).toLocaleString());
    }
  };

  const normalAr = Math.floor(baseAr * (1 + (charTot.arPct + teamBuffs.arPct + mastery.ar) / 100));
  const normalHitPct = calcHitChance(normalAr, false);
  const normalPhys = calcWeaponHit(0, 1, false, false, true);

  // Bonus weapon elemental/magic attack damage (Enchant Oskill / A3 Fire Merc + Warlock Hex: Bane + gear flat elemental/magic damage)
  const gearEleFireMin = Math.round(((charTot.flatEleMin && charTot.flatEleMin.fire) || 0) * (1 + (charTot.eleDmg.fire || 0) / 100));
  const gearEleFireMax = Math.round(((charTot.flatEleMax && charTot.flatEleMax.fire) || 0) * (1 + (charTot.eleDmg.fire || 0) / 100));
  const gearEleOtherMin = Math.round(((charTot.flatEleMin && charTot.flatEleMin.cold) || 0) * (1 + (charTot.eleDmg.cold || 0) / 100))
    + Math.round(((charTot.flatEleMin && charTot.flatEleMin.ltng) || 0) * (1 + (charTot.eleDmg.ltng || 0) / 100))
    + Math.round(((charTot.flatEleMin && charTot.flatEleMin.pois) || 0) * (1 + (charTot.eleDmg.pois || 0) / 100))
    + Math.round(((charTot.flatEleMin && charTot.flatEleMin.mag) || 0) * (1 + (charTot.eleDmg.mag || 0) / 100));
  const gearEleOtherMax = Math.round(((charTot.flatEleMax && charTot.flatEleMax.cold) || 0) * (1 + (charTot.eleDmg.cold || 0) / 100))
    + Math.round(((charTot.flatEleMax && charTot.flatEleMax.ltng) || 0) * (1 + (charTot.eleDmg.ltng || 0) / 100))
    + Math.round(((charTot.flatEleMax && charTot.flatEleMax.pois) || 0) * (1 + (charTot.eleDmg.pois || 0) / 100))
    + Math.round(((charTot.flatEleMax && charTot.flatEleMax.mag) || 0) * (1 + (charTot.eleDmg.mag || 0) / 100));
  const hexMagMin = teamBuffs.hexMagicMin || 0;
  const hexMagMax = teamBuffs.hexMagicMax || 0;
  const weaponBonusEleMin = (teamBuffs.enchantFireMin || 0) + hexMagMin + gearEleFireMin + gearEleOtherMin;
  const weaponBonusEleMax = (teamBuffs.enchantFireMax || 0) + hexMagMax + gearEleFireMax + gearEleOtherMax;
  const normalTotalMin = normalPhys.min + weaponBonusEleMin;
  const normalTotalMax = normalPhys.max + weaponBonusEleMax;

  const appendWeaponBuffNotes = (notesArr) => {
    if (mastery.notes.length) mastery.notes.forEach(n => notesArr.push("⚔️ 被动精通：" + n));
    if (teamBuffs.enchantFireMax > 0) {
      notesArr.push("🔥 火焰强化(附魔) Lv." + teamBuffs.enchantLvl + "：+" + teamBuffs.enchantArPct + "% AR · 武器附加 " + teamBuffs.enchantFireMin.toLocaleString() + "–" + teamBuffs.enchantFireMax.toLocaleString() + " 火焰伤害");
    }
    if (hexMagMax > 0) {
      notesArr.push("🔮 邪咒：灾祸 Lv." + teamBuffs.hexLvl + "：武器附加 " + hexMagMin.toLocaleString() + "–" + hexMagMax.toLocaleString() + " 魔法伤害 · +" + teamBuffs.hexArPct + "% AR · -" + teamBuffs.hexDefReduce + "% 敌防");
    } else if (teamBuffs.hexKey === "Hex Purge" && teamBuffs.hexPurgeMax > 0) {
      notesArr.push("🔮 邪咒：消灭 Lv." + teamBuffs.hexLvl + "：+" + teamBuffs.hexEias + "% EIAS 攻速 · +" + teamBuffs.hexArPct + "% AR · 击中引爆范围魔法伤害 " + teamBuffs.hexPurgeMin.toLocaleString() + "–" + teamBuffs.hexPurgeMax.toLocaleString() + " (最多连爆 " + teamBuffs.hexPurgeMaxExp + " 次)");
    } else if (teamBuffs.hexKey === "Hex Siphon") {
      notesArr.push("🔮 邪咒：虹吸 Lv." + teamBuffs.hexLvl + "：+" + teamBuffs.hexArPct + "% AR · 每杀回血/回蓝 +" + teamBuffs.hexLaek + " · -33% 敌物伤");
    }
    if (gearEleFireMax + gearEleOtherMax > 0) {
      notesArr.push("装备附加元素/魔法伤害：" + (gearEleFireMin + gearEleOtherMin).toLocaleString() + "–" + (gearEleFireMax + gearEleOtherMax).toLocaleString());
    }
  };

  if (pdSelectedSkillKey === "__normal__" || !clsObj) {
    const avgPhys = (normalPhys.min + normalPhys.max) / 2 * dsMult;
    const avgEle = (weaponBonusEleMin + weaponBonusEleMax) / 2;
    const avg = (avgPhys + avgEle) * (normalHitPct / 100);
    const arOffset = (base.toHitFactor || 0) - 35;
    const normalArPctSum = charTot.arPct + teamBuffs.arPct + mastery.ar;
    const normalNotes = [
      "物理部分：" + normalPhys.min.toLocaleString() + "–" + normalPhys.max.toLocaleString() + "（非武器总 ED +" + normalPhys.totalOffEd + "%）",
      "AR 构成：基础 " + baseAr.toLocaleString() + "（敏捷 " + totalDex + "×5" + (arOffset >= 0 ? "+" : "") + arOffset + " + 装备固定 AR " + charTot.flatAr + "）× (1 + " + normalArPctSum + "%) = " + normalAr.toLocaleString(),
      "攻击速度：" + charAtkFrame + " 帧 (" + atkPerSec.toFixed(2) + " 次/秒) · 双倍暴击(CS/DS)期望 " + effDoublePct + "% (×" + dsMult.toFixed(2) + ")"
    ];
    appendWeaponBuffNotes(normalNotes);
    appendPhysDebuffNotes(normalPhys.min, normalPhys.max, normalNotes);
    return {
      title: "普通物理攻击 (Normal Attack)",
      effLvl: 1,
      manaCost: 0,
      dmgType: "phys",
      dmgMin: normalTotalMin,
      dmgMax: normalTotalMax,
      dps: Math.round(avg * atkPerSec),
      skillAr: normalAr,
      hitPct: normalHitPct,
      normalAr,
      normalHitPct,
      normalMin: normalTotalMin,
      normalMax: normalTotalMax,
      extraNotes: normalNotes
    };
  }

  // Handle Set / Gear Granted Oskills (e.g. Horazon +30 Enchant, Trang-Oul Fire Ball/Wall/Meteor, Chaos WW, Passion Zeal/Berserk)
  const isOskillSel = String(pdSelectedSkillKey || "").startsWith("__oskill__:");
  let sk = null, skOwnerCls = clsObj, effLvl = 0, basePts = 0, tabBonus = 0, singleBonus = 0, fireBonus = 0, oskillObj = null;

  if (isOskillSel) {
    const osKey = pdSelectedSkillKey.slice("__oskill__:".length);
    oskillObj = (charTot.oskills && charTot.oskills[osKey]) || null;
    const found = findAnyClassSkill(osKey);
    if (!oskillObj || !found) {
      return { title: "未激活该装备技能", effLvl: 0, manaCost: 0, dmgType: "phys", dmgMin: 0, dmgMax: 0, dps: 0, skillAr: normalAr, hitPct: normalHitPct, normalAr, normalHitPct, normalMin: normalTotalMin, normalMax: normalTotalMax, extraNotes: [] };
    }
    sk = found.sk;
    skOwnerCls = found.cls;
    const isNative = skOwnerCls.id === skActiveClassId;
    const isFireSk = Boolean((sk.dmg && sk.dmg.type === "fire") || sk.key === "Enchant");
    if (oskillObj.isCharge) {
      basePts = oskillObj.baseLvl;
      effLvl = oskillObj.baseLvl;
    } else if (isNative) {
      const treePts = Number(build[sk.key] || 0);
      basePts = (maxMode ? 20 : treePts) + Math.min(3, oskillObj.baseLvl);
      tabBonus = charTot.tabSkills[sk.page] || 0;
      singleBonus = (charTot.singleSkills && charTot.singleSkills[sk.key]) || 0;
      effLvl = basePts + allSkillBonus + tabBonus + singleBonus;
    } else {
      basePts = oskillObj.baseLvl;
      fireBonus = isFireSk ? (charTot.fireSkills || 0) : 0;
      effLvl = basePts + charTot.skills + ctaSkillBonus + fireBonus;
    }
  } else {
    sk = clsObj.skills.find(s => s.key === pdSelectedSkillKey);
    if (!sk) {
      return { title: "未选择技能", effLvl: 0, manaCost: 0, dmgType: "phys", dmgMin: 0, dmgMax: 0, dps: 0, skillAr: normalAr, hitPct: normalHitPct, normalAr, normalHitPct, normalMin: normalTotalMin, normalMax: normalTotalMax, extraNotes: [] };
    }
    const treePts = Number(build[sk.key] || 0);
    basePts = maxMode ? 20 : Math.max(1, treePts);
    tabBonus = charTot.tabSkills[sk.page] || 0;
    singleBonus = (charTot.singleSkills && charTot.singleSkills[sk.key]) || 0;
    fireBonus = (charTot.fireSkills > 0 && sk.dmg && sk.dmg.type === "fire" && !(skActiveClassId === "sor" && sk.page === 1)) ? charTot.fireSkills : 0;
    effLvl = basePts + allSkillBonus + tabBonus + singleBonus + fireBonus;
  }

  const manaCost = computeSkillMana(sk, effLvl);
  const wsMeta = computeWeaponSkillMetaStats(sk.key, effLvl, skOwnerCls.id === skActiveClassId ? build : {}, skOwnerCls.id === skActiveClassId ? maxMode : false);
  const meta = wsMeta ? wsMeta.meta : null;

  // Build effective synergy map (cross-class Oskills have 0 synergies from another class)
  const synBuild = {};
  if (Array.isArray(sk.dmgSynergies) && skOwnerCls.id === skActiveClassId) {
    sk.dmgSynergies.forEach(s => {
      synBuild[s.skill] = maxMode ? 20 : Number(build[s.skill] || 0);
    });
  }

  const spellDmg = computeSkillDamage(sk, skOwnerCls, synBuild, effLvl);
  const isWeaponSkill = Boolean(meta && (meta.srcDam > 0 || meta.isSmite || meta.isKick));
  const skillArPct = wsMeta ? wsMeta.totalAr : 0;
  const effMasteryAr = isWeaponSkill && meta && !meta.isSmite && !meta.isKick ? mastery.ar : 0;
  const skillAr = Math.floor(baseAr * (1 + (charTot.arPct + teamBuffs.arPct + effMasteryAr + skillArPct) / 100));
  const hitPct = calcHitChance(skillAr, Boolean(meta && meta.alwaysHit));

  let dmgMin = 0, dmgMax = 0, lcsMin = 0, lcsMax = 0, dmgType = "phys", dps = 0;
  const extraNotes = [];
  if (isOskillSel && oskillObj) {
    extraNotes.push("✨ 套装/装备赋予技能 (Oskill)：基础 +" + oskillObj.baseLvl + (oskillObj.isCharge ? " (聚气固定等级)" : (skOwnerCls.id === skActiveClassId ? " (本职业上限+3)" : (" + 全技能" + (charTot.skills + ctaSkillBonus) + (fireBonus ? (" + 火焰技能" + fireBonus) : "")))));
  }

  if (sk.key === "Enchant" && spellDmg) {
    dmgType = "fire";
    let fireBoost = charTot.eleDmg.fire || 0;
    if (skActiveClassId === "sor") {
      const mBase = maxMode ? 20 : Number(build["Fire Mastery"] || 0);
      if (mBase > 0) {
        const mLvl = mBase + allSkillBonus + (charTot.tabSkills[1] || 0);
        const mPct = 30 + (mLvl - 1) * 7;
        fireBoost += mPct;
        extraNotes.push("火焰支配 Lv." + mLvl + "：+" + mPct + "% 火焰伤害（近战双倍生效）");
      }
    }
    dmgMin = Math.round(spellDmg.min * (1 + fireBoost / 100));
    dmgMax = Math.round(spellDmg.max * (1 + fireBoost / 100));
    const enchAr = 20 + Math.max(0, effLvl - 1) * 9;
    const avg = (dmgMin + dmgMax) / 2;
    dps = Math.round(avg * atkPerSec * (normalHitPct / 100));
    extraNotes.push("🔥 附魔增益：为角色与佣兵提供 +" + enchAr + "% 攻击准确率 AR，并为每次武器攻击附加此火焰伤害（已自动计入普攻/近战技能）");
    const gearFireP = charTot.elePierce.fire || 0;
    const resVs50 = Math.max(-100, 50 - gearFireP - teamBuffs.convRes - (teamBuffs.debuffEleRes || 0));
    const mult50 = (100 - resVs50) / 100;
    extraNotes.push("附魔火伤对常规地狱怪 (50%火抗 → 实抗 " + resVs50 + "%)：每次附加 " + Math.round(dmgMin * mult50).toLocaleString() + "–" + Math.round(dmgMax * mult50).toLocaleString());
    if (charTot.sunders.has("fire")) {
      const resImm = Math.max(-100, 95 - gearFireP - Math.floor(teamBuffs.convRes / 5) - Math.floor((teamBuffs.debuffEleRes || 0) / 5));
      const multImm = (100 - resImm) / 100;
      extraNotes.push("✓ 破火板对火免怪 (95% → 实抗 " + resImm + "%)：每次附加 " + Math.round(dmgMin * multImm).toLocaleString() + "–" + Math.round(dmgMax * multImm).toLocaleString());
    }
  } else if (isWeaponSkill) {
    const skillEd = meta.isBladeCopy ? 0 : wsMeta.totalEd;
    const baseSrcRatio = (meta.srcDam || 128) / 128;
    const effSrcRatio = meta.isBladeCopy ? (baseSrcRatio * (wsMeta.baseEd / 100)) : baseSrcRatio;
    let preEdFlatMin = 0, preEdFlatMax = 0, preEdFlatSyn = 0;
    const scaleFlatPhysWithEd = Boolean(spellDmg && spellDmg.type === "phys" && sk.key !== "Leap Attack");
    if (scaleFlatPhysWithEd) {
      preEdFlatSyn = wsMeta.physFlatSynPct || 0;
      preEdFlatMin = Math.floor(spellDmg.min * (1 + preEdFlatSyn / 100));
      preEdFlatMax = Math.floor(spellDmg.max * (1 + preEdFlatSyn / 100));
    }
    const wHit = calcWeaponHit(skillEd, effSrcRatio, meta.isSmite, meta.isKick, true, preEdFlatMin, preEdFlatMax);
    let physPartMin = wHit.min;
    let physPartMax = wHit.max;
    dmgType = meta.isMagicConv ? "mag" : "phys";
    let eleAddedMin = 0, eleAddedMax = 0;

    // Vengeance tri-elemental weapon damage conversion
    if (meta.eleConvEachBase) {
      const baseConv = meta.eleConvEachBase + Math.max(0, effLvl - 1) * meta.eleConvEachLvl;
      const getSyn = (k) => (skOwnerCls.id === skActiveClassId ? (maxMode ? 20 : Number(build[k] || 0)) : 0);
      const salPts = getSyn("Salvation");
      const fPct = baseConv + getSyn("Resist Fire") * 10 + salPts * 2;
      const cPct = baseConv + getSyn("Resist Cold") * 10 + salPts * 2;
      const lPct = baseConv + getSyn("Resist Lightning") * 10 + salPts * 2;
      const vMin = Math.round(wHit.baseMin * ((fPct * (1 + (charTot.eleDmg.fire || 0) / 100) + cPct * (1 + (charTot.eleDmg.cold || 0) / 100) + lPct * (1 + (charTot.eleDmg.ltng || 0) / 100)) / 100));
      const vMax = Math.round(wHit.baseMax * ((fPct * (1 + (charTot.eleDmg.fire || 0) / 100) + cPct * (1 + (charTot.eleDmg.cold || 0) / 100) + lPct * (1 + (charTot.eleDmg.ltng || 0) / 100)) / 100));
      eleAddedMin += vMin;
      eleAddedMax += vMax;
      extraNotes.push("复仇三元素附加：火+" + fPct + "% / 冰+" + cPct + "% / 电+" + lPct + "% → +" + vMin.toLocaleString() + "–" + vMax.toLocaleString() + " 元素伤害");
    }

    if (spellDmg) {
      const eType = spellDmg.type;
      if (eType === "phys") {
        if (scaleFlatPhysWithEd) {
          extraNotes.push("技能基底物理伤：" + preEdFlatMin.toLocaleString() + "–" + preEdFlatMax.toLocaleString() + (preEdFlatSyn > 0 ? ("（基础 " + spellDmg.min + "–" + spellDmg.max + "，含协同 +" + preEdFlatSyn + "%，并入武器基底同享非武器总 ED +" + wHit.totalOffEd + "%）") : "（并入武器基底同享非武器总 ED）"));
        } else {
          const flatSyn = wsMeta.physFlatSynPct || 0;
          const pMin = Math.floor(spellDmg.min * (1 + flatSyn / 100));
          const pMax = Math.floor(spellDmg.max * (1 + flatSyn / 100));
          physPartMin += pMin;
          physPartMax += pMax;
          extraNotes.push("技能附加范围物理伤害：" + pMin.toLocaleString() + "–" + pMax.toLocaleString() + (flatSyn > 0 ? ("（基础 " + spellDmg.min + "–" + spellDmg.max + "，含协同 +" + flatSyn + "%）") : ""));
        }
      } else {
        const eleBoost = 1 + ((charTot.eleDmg[eType] || 0) / 100);
        const eMin = Math.round(spellDmg.min * eleBoost);
        const eMax = Math.round(spellDmg.max * eleBoost);
        eleAddedMin += eMin;
        eleAddedMax += eMax;
        extraNotes.push("附带技能元素/魔法伤害：" + eMin.toLocaleString() + "–" + eMax.toLocaleString() + " (" + eType.toUpperCase() + ")");
      }
    }
    if (!meta.isSmite && weaponBonusEleMax > 0) {
      eleAddedMin += weaponBonusEleMin;
      eleAddedMax += weaponBonusEleMax;
    }
    dmgMin = physPartMin + eleAddedMin;
    dmgMax = physPartMax + eleAddedMax;
    const ratePerSec = meta.usesFcr ? castPerSec : atkPerSec;
    const avg = (((physPartMin + physPartMax) / 2) * (meta.isSmite ? 1 : dsMult) + (eleAddedMin + eleAddedMax) / 2) * (hitPct / 100);
    dps = Math.round(avg * ratePerSec);

    if (meta.isBladeCopy) {
      extraNotes.push("镜影锋刃伤害比例：" + wsMeta.baseEd + "% · 召唤刀刃总数 " + wsMeta.echoCount + " 把 · 非武器总 ED +" + wHit.totalOffEd + "% · 技能 AR +" + skillArPct + "%");
    } else {
      const synTag = wsMeta.synEd > 0 ? ("（基础 +" + wsMeta.baseEd + "% + 协同 +" + wsMeta.synEd + "%）") : "";
      extraNotes.push("技能武器 ED +" + skillEd + "%" + synTag + " · 非武器总 ED +" + wHit.totalOffEd + "% · 技能 AR 加成 +" + skillArPct + "%");
    }
    const arOffsetSk = (base.toHitFactor || 0) - 35;
    const totalSkArPct = charTot.arPct + teamBuffs.arPct + effMasteryAr + skillArPct;
    extraNotes.push("AR 构成：基础 " + baseAr.toLocaleString() + "（敏捷 " + totalDex + "×5" + (arOffsetSk >= 0 ? "+" : "") + arOffsetSk + " + 装备固定 AR " + charTot.flatAr + "）× (1 + " + totalSkArPct + "%) = " + skillAr.toLocaleString());
    if (meta.echoSkill) {
      const esScale = computeEchoingStrikeDisplayScale(wsMeta.echoCount);
      const lcsHit = calcWeaponHit(0, effSrcRatio, false, false, true, preEdFlatMin, preEdFlatMax);
      lcsMin = Math.floor((lcsHit.min * esScale.ddamPct) / 100) + eleAddedMin;
      lcsMax = Math.floor((lcsHit.max * esScale.ddamPct) / 100) + eleAddedMax;
      const tipMin = Math.floor((preEdFlatMin * esScale.tipPct) / 100);
      const tipMax = Math.floor((preEdFlatMax * esScale.tipPct) / 100);
      const weapScaledMin = Math.floor(lcsHit.baseMin * effSrcRatio);
      const weapScaledMax = Math.floor(lcsHit.baseMax * effSrcRatio);
      extraNotes.push("C 键面板构成：基底 " + (weapScaledMin + preEdFlatMin) + "–" + (weapScaledMax + preEdFlatMax) + "（武器折算 " + weapScaledMin + "–" + weapScaledMax + " + 技能 " + preEdFlatMin + "–" + preEdFlatMax + "）× (1 + " + lcsHit.totalOffEd + "% 非武器ED) + 元素附伤 " + eleAddedMin + "–" + eleAddedMax + " = " + lcsMin.toLocaleString() + "–" + lcsMax.toLocaleString());
      extraNotes.push("实战真实单次伤害 ≈ " + dmgMin.toLocaleString() + "–" + dmgMax.toLocaleString() + "（D2R 3.4 游戏 C 键面板漏算回响自身 +" + skillEd + "% 技能 ED，且技能提示按 skilldesc " + esScale.tipPct + "% 显示为 " + tipMin + "–" + tipMax + "）");
      extraNotes.push("回响打击机制：武器伤占比 " + Math.floor((meta.srcDam * 100) / 128) + "%（" + meta.srcDam + "/128）· 单次投射 " + wsMeta.echoCount + " 把回响 · 施法速度 " + charFcrFrame + " 帧 (" + castPerSec.toFixed(2) + " 次/秒) · 双倍暴击(CS/DS) " + effDoublePct + "%");
    } else {
      extraNotes.push("攻速 " + charAtkFrame + " 帧 (" + atkPerSec.toFixed(2) + " 次/秒) · 双倍暴击(CS/DS) " + effDoublePct + "% · 对 Lv.85 地狱怪命中率 " + hitPct + "%" + (meta.alwaysHit ? " (必中技能)" : (charTot.itd ? " (ITD 无视小怪防御)" : "")));
    }
    if (!meta.isSmite) appendWeaponBuffNotes(extraNotes);
    if (dmgType === "phys") {
      appendPhysDebuffNotes(physPartMin, physPartMax, extraNotes);
    } else if (meta.isMagicConv) {
      extraNotes.push("狂战士将 100% 物理伤害转化为魔法伤害（无视物理免疫，无法吸血/吸蓝）");
    }
  } else if (spellDmg) {
    dmgType = spellDmg.type;
    let masteryPct = charTot.eleDmg[dmgType] || 0;
    let coldMasteryPierce = 0;
    if (skActiveClassId === "sor") {
      if (dmgType === "ltng") {
        const mBase = maxMode ? 20 : Number(build["Lightning Mastery"] || 0);
        if (mBase > 0) {
          const mLvl = mBase + allSkillBonus + (charTot.tabSkills[2] || 0);
          const mPct = 50 + (mLvl - 1) * 12;
          masteryPct += mPct;
          extraNotes.push("闪电支配 Lv." + mLvl + "：+" + mPct + "% 闪电伤害");
        }
      } else if (dmgType === "fire") {
        const mBase = maxMode ? 20 : Number(build["Fire Mastery"] || 0);
        if (mBase > 0) {
          const mLvl = mBase + allSkillBonus + (charTot.tabSkills[1] || 0);
          const mPct = 30 + (mLvl - 1) * 7;
          masteryPct += mPct;
          extraNotes.push("火焰支配 Lv." + mLvl + "：+" + mPct + "% 火焰伤害");
        }
      } else if (dmgType === "cold") {
        const mBase = maxMode ? 20 : Number(build["Cold Mastery"] || 0);
        if (mBase > 0) {
          const mLvl = mBase + allSkillBonus + (charTot.tabSkills[3] || 0);
          coldMasteryPierce = 20 + (mLvl - 1) * 5;
          extraNotes.push("冰冷支配 Lv." + mLvl + "：-" + coldMasteryPierce + "% 敌冰抗 (破免后按 1/5 = -" + Math.floor(coldMasteryPierce / 5) + "%)");
        }
      }
    }
    if (sk.key === "Blessed Hammer" && teamBuffs.hammerEdPct > 0) {
      masteryPct += teamBuffs.hammerEdPct;
      extraNotes.push("专注灵气祝福之锤增伤：+" + teamBuffs.hammerEdPct + "%");
    }
    dmgMin = Math.round(spellDmg.min * (1 + masteryPct / 100));
    dmgMax = Math.round(spellDmg.max * (1 + masteryPct / 100));
    const avg = (dmgMin + dmgMax) / 2;
    const rate = sk.cooldown > 0 ? (1 / sk.cooldown) : castPerSec;
    dps = Math.round(avg * rate);

    // Effective damage against Hell 50% res & Sundered 95% immune monsters (including Conviction + Lower Resist + Cold Mastery + Gear Pierce)
    const isEleConv = ["fire", "cold", "ltng"].includes(dmgType);
    const isEleLR = ["fire", "cold", "ltng", "pois"].includes(dmgType);
    const gearPierce = charTot.elePierce[dmgType] || 0;
    const convPierceFull = isEleConv ? teamBuffs.convRes : 0;
    const lrPierceFull = isEleLR ? (teamBuffs.debuffEleRes || 0) : 0;
    const physDebuffSpell = dmgType === "phys" ? (teamBuffs.debuffPhysRes || 0) : 0;
    const resVs50 = Math.max(-100, 50 - gearPierce - convPierceFull - lrPierceFull - coldMasteryPierce - physDebuffSpell);
    const effMult50 = (100 - resVs50) / 100;
    extraNotes.push("对常规地狱怪 (50%抗 → 实抗 " + resVs50 + "%)：单次 " + Math.round(dmgMin * effMult50).toLocaleString() + "–" + Math.round(dmgMax * effMult50).toLocaleString());

    if (charTot.sunders.has(dmgType)) {
      const convVsImmune = Math.floor(convPierceFull / 5);
      const lrVsImmune = Math.floor(lrPierceFull / 5);
      const cmVsImmune = Math.floor(coldMasteryPierce / 5);
      const physVsImmune = Math.floor(physDebuffSpell / 5);
      const resVsImm = Math.max(-100, 95 - gearPierce - convVsImmune - lrVsImmune - cmVsImmune - physVsImmune);
      const effMultImm = (100 - resVsImm) / 100;
      extraNotes.push("✓ 已带对应破免板 (95% → 实抗 " + resVsImm + "%)：破免有效伤害 " + Math.round(dmgMin * effMultImm).toLocaleString() + "–" + Math.round(dmgMax * effMultImm).toLocaleString());
    } else {
      extraNotes.push("协同增伤 +" + spellDmg.synPct + "% · 元素增伤 +" + (charTot.eleDmg[dmgType] || 0) + "% · 装备降抗 -" + gearPierce + "%" + (lrPierceFull ? (" · 降抗诅咒 -" + lrPierceFull + "%") : ""));
    }
  } else {
    extraNotes.push("该技能为增益 / 召唤 / 光环类技能，无直接单次面板攻击数值");
  }

  return {
    title: pickLangTitle(sk) + " (" + sk.nameEn + ")",
    effLvl,
    basePts,
    tabBonus: tabBonus + singleBonus + fireBonus,
    manaCost,
    dmgType,
    dmgMin,
    dmgMax,
    lcsMin,
    lcsMax,
    dps,
    isWeaponSkill,
    skillAr: isWeaponSkill ? skillAr : normalAr,
    hitPct: isWeaponSkill ? hitPct : normalHitPct,
    normalAr,
    normalHitPct,
    normalMin: normalTotalMin,
    normalMax: normalTotalMax,
    extraNotes
  };
}

function renderStatAllocator(cBase, charTot, charLvl, effShieldBlock) {
  const box = document.getElementById("pd-stat-alloc-box");
  if (!box) return;
  const { budget, spent, rem } = clampStatAlloc(charLvl);
  const rows = [
    { k: "str", label: "力量 Str", base: cBase.str, gear: charTot.str, req: charTot.maxReqStr },
    { k: "dex", label: "敏捷 Dex", base: cBase.dex, gear: charTot.dex, req: charTot.maxReqDex },
    { k: "vit", label: "体力 Vit", base: cBase.vit, gear: charTot.vit, req: 0 },
    { k: "enr", label: "精力 Enr", base: cBase.enr, gear: charTot.enr, req: 0 }
  ];

  box.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px">' +
      '<strong style="font-size:12px;color:#9ad8ff">📊 角色四维手动配点 (Lv.' + charLvl + ' 总点 ' + budget + ' · 剩余 <span style="color:' + (rem > 0 ? '#ffd573' : '#67e87a') + '">' + rem + '</span> 点)</strong>' +
      '<div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap">' +
        '<button type="button" class="rw-detail-btn" id="pd-stat-auto-vit">够穿+全加体</button>' +
        '<button type="button" class="rw-detail-btn" id="pd-stat-auto-blk">满格挡75%+全加体</button>' +
        '<button type="button" class="rw-btn rw-btn-danger" id="pd-stat-reset" style="padding:2px 7px;font-size:10.5px">重置洗点</button>' +
      '</div>' +
    '</div>' +
    rows.map(r => {
      const alloc = pdStatAlloc[r.k] || 0;
      const naked = r.base + alloc;
      const tot = naked + r.gear;
      const reqBadge = r.req > 0
        ? (tot >= r.req
          ? '<span style="color:#67e87a;font-size:10.5px">✓ 需' + r.req + '</span>'
          : '<span style="color:#ff8a75;font-size:10.5px;font-weight:800">⚠️ 缺' + (r.req - tot) + '</span>')
        : '';
      return '<div class="pd-alloc-row">' +
        '<div><strong style="color:#e6effc">' + r.label + '</strong><div style="font-size:10px;color:var(--muted)">固有 ' + r.base + ' · 已投 ' + alloc + '</div></div>' +
        '<div class="pd-alloc-ctrl">' +
          '<button type="button" class="pd-alloc-btn" data-stat-k="' + r.k + '" data-stat-d="-5">-5</button>' +
          '<button type="button" class="pd-alloc-btn" data-stat-k="' + r.k + '" data-stat-d="-1">-1</button>' +
          '<input type="number" class="pd-alloc-input" min="' + r.base + '" max="' + (r.base + budget) + '" value="' + naked + '" data-stat-inp="' + r.k + '" title="直接输入游戏内裸装基础白字（已含职业固有 ' + r.base + ' 点）" />' +
          '<button type="button" class="pd-alloc-btn" data-stat-k="' + r.k + '" data-stat-d="1">+1</button>' +
          '<button type="button" class="pd-alloc-btn" data-stat-k="' + r.k + '" data-stat-d="5">+5</button>' +
          '<button type="button" class="pd-alloc-btn" data-stat-k="' + r.k + '" data-stat-d="all" title="剩余点数全部投入">全投</button>' +
        '</div>' +
        '<div style="text-align:right;min-width:86px">' +
          '<strong style="color:#ffe08c;font-size:12.5px">' + tot + '</strong>' +
          '<div style="font-size:10px;color:var(--muted)">装+' + r.gear + ' ' + reqBadge + '</div>' +
        '</div>' +
      '</div>';
    }).join("");

  box.querySelectorAll("[data-stat-k]").forEach(btn => {
    btn.addEventListener("click", () => {
      const k = btn.dataset.statK;
      const d = btn.dataset.statD;
      const cur = clampStatAlloc(charLvl);
      if (d === "all") {
        pdStatAlloc[k] = (pdStatAlloc[k] || 0) + cur.rem;
      } else {
        const delta = Number(d);
        if (delta > 0) pdStatAlloc[k] = (pdStatAlloc[k] || 0) + Math.min(delta, cur.rem);
        else pdStatAlloc[k] = Math.max(0, (pdStatAlloc[k] || 0) + delta);
      }
      renderPaperdollLiveStats();
    });
  });

  box.querySelectorAll("[data-stat-inp]").forEach(inp => {
    inp.addEventListener("change", () => {
      const k = inp.dataset.statInp;
      const baseVal = Number(cBase[k] || 0);
      const otherSpent = ["str", "dex", "vit", "enr"].filter(x => x !== k).reduce((s, x) => s + (pdStatAlloc[x] || 0), 0);
      const maxForThis = Math.max(0, getStatBudget(charLvl) - otherSpent);
      const wantAlloc = Math.floor(Number(inp.value) || baseVal) - baseVal;
      pdStatAlloc[k] = Math.min(maxForThis, Math.max(0, wantAlloc));
      renderPaperdollLiveStats();
    });
  });

  const autoVitBtn = document.getElementById("pd-stat-auto-vit");
  if (autoVitBtn) {
    autoVitBtn.addEventListener("click", () => {
      const b = getStatBudget(charLvl);
      const needStr = Math.min(b, Math.max(0, charTot.maxReqStr - (cBase.str + charTot.str)));
      const needDex = Math.min(b - needStr, Math.max(0, charTot.maxReqDex - (cBase.dex + charTot.dex)));
      pdStatAlloc = { str: needStr, dex: needDex, vit: Math.max(0, b - needStr - needDex), enr: 0 };
      renderPaperdollLiveStats();
    });
  }
  const autoBlkBtn = document.getElementById("pd-stat-auto-blk");
  if (autoBlkBtn) {
    autoBlkBtn.addEventListener("click", () => {
      const b = getStatBudget(charLvl);
      const needStr = Math.min(b, Math.max(0, charTot.maxReqStr - (cBase.str + charTot.str)));
      const dexFor75 = effShieldBlock > 0 ? Math.ceil((75 * charLvl * 2) / effShieldBlock) + 15 : charTot.maxReqDex;
      const targetDex = Math.max(charTot.maxReqDex, dexFor75);
      const needDex = Math.min(b - needStr, Math.max(0, targetDex - (cBase.dex + charTot.dex)));
      pdStatAlloc = { str: needStr, dex: needDex, vit: Math.max(0, b - needStr - needDex), enr: 0 };
      renderPaperdollLiveStats();
    });
  }
  const resetBtn = document.getElementById("pd-stat-reset");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      pdStatAlloc = { str: 0, dex: 0, vit: 0, enr: 0 };
      renderPaperdollLiveStats();
    });
  }
}

function computeCharPassiveSheetBonuses(clsObj, build, charTot, allSkillBonus, maxMode, loadout) {
  const out = { allRes: 0, maxFRes: 0, maxCRes: 0, maxLRes: 0, defPct: 0, frw: 0, blockPct: 0, weaponBlock: 0, smiteMin: 0, smiteMax: 0, notes: [] };
  if (!clsObj) return out;
  const getInfo = (k, defEmpty) => {
    const hp = getPassiveHardPoints(clsObj.id, k, maxMode, defEmpty);
    if (hp.pts <= 0) return { base: 0, lvl: 0, isDefault: false };
    const skObj = clsObj.skills.find(s => s.key === k);
    if (!skObj) return { base: hp.pts, lvl: 0, isDefault: hp.isDefault };
    const lvl = hp.pts + allSkillBonus + (charTot.tabSkills[skObj.page] || 0) + ((charTot.singleSkills && charTot.singleSkills[k]) || 0);
    return { base: hp.pts, lvl, isDefault: hp.isDefault };
  };

  if (clsObj.id === "war") {
    if (charTot.levitateReqRedPct > 0) {
      out.notes.push("悬浮精通 Lv." + charTot.levitateLvl + (charTot.levitateIsDefault ? "(默认1硬点)" : "") + "（武器力/敏需求 -" + charTot.levitateReqRedPct + "%）");
    } else {
      out.notes.push("悬浮精通 Lv.0（前往技能树投入 1+ 点后生效武器减需求 -2%～-50%）");
    }
  } else if (clsObj.id === "bar") {
    const nr = getInfo("Natural Resistance", 1);
    if (nr.lvl > 0) {
      out.allRes = evalDiminishing(nr.lvl, 0, 80);
      out.notes.push("自然抵抗 Lv." + nr.lvl + (nr.isDefault ? "(默认1点)" : "") + "（全抗 +" + out.allRes + "%）");
    }
    const is = getInfo("Iron Skin", 1);
    if (is.lvl > 0) {
      out.defPct = 30 + (is.lvl - 1) * 10;
      out.notes.push("钢铁皮肤 Lv." + is.lvl + (is.isDefault ? "(默认1点)" : "") + "（防御 +" + out.defPct + "%）");
    }
    const spd = getInfo("Increased Speed", 1);
    if (spd.lvl > 0) {
      out.frw = evalDiminishing(spd.lvl, 7, 50);
      out.notes.push("加速 Lv." + spd.lvl + (spd.isDefault ? "(默认1点)" : "") + "（高跑 +" + out.frw + "%）");
    }
  } else if (clsObj.id === "pal") {
    const rfBase = getInfo("Resist Fire", 0).base;
    const rcBase = getInfo("Resist Cold", 0).base;
    const rlBase = getInfo("Resist Lightning", 0).base;
    const baBase = getInfo("Blessed Aim", 0).base;
    out.maxFRes = Math.floor(rfBase / 2);
    out.maxCRes = Math.floor(rcBase / 2);
    out.maxLRes = Math.floor(rlBase / 2);
    const pParts = [];
    if (out.maxFRes > 0) pParts.push("抗火上限+" + out.maxFRes + "%");
    if (out.maxCRes > 0) pParts.push("抗冰上限+" + out.maxCRes + "%");
    if (out.maxLRes > 0) pParts.push("抗电上限+" + out.maxLRes + "%");
    if (baBase > 0) pParts.push("祝福瞄准隐藏 +" + (baBase * 5) + "% AR");
    if (pParts.length) out.notes.push("光环硬点被动（" + pParts.join(" · ") + "）");
    const oRule = loadout && loadout.offhand ? getEquippedBaseRule(loadout.offhand) : null;
    if (oRule && oRule.block > 0) {
      const hs = getInfo("Holy Shield", 0);
      if (hs.lvl > 0) {
        out.blockPct = evalDiminishing(hs.lvl, 10, 40);
        const hsDef = 25 + (hs.lvl - 1) * 15;
        out.defPct += hsDef;
        const hsSk = clsObj.skills.find(s => s.key === "Holy Shield");
        if (hsSk && hsSk.dmg) {
          out.smiteMin = computeScaledValue(hsSk.dmg.min, hsSk.dmg.hitShift || 8, hs.lvl);
          out.smiteMax = computeScaledValue(hsSk.dmg.max, hsSk.dmg.hitShift || 8, hs.lvl);
        }
        out.notes.push("圣盾术 Lv." + hs.lvl + "（格挡 +" + out.blockPct + "% · 防御 +" + hsDef + "%" + (out.smiteMax > 0 ? (" · 盾击 +" + out.smiteMin + "–" + out.smiteMax) : "") + "）");
      }
    }
  } else if (clsObj.id === "ass") {
    const wRule = loadout && loadout.weapon ? getEquippedBaseRule(loadout.weapon) : null;
    const oRule = loadout && loadout.offhand ? getEquippedBaseRule(loadout.offhand) : null;
    const isDualClaw = Boolean(wRule && oRule && (wRule.type === "h2h" || wRule.type === "h2h2") && (oRule.type === "h2h" || oRule.type === "h2h2"));
    const wb = isDualClaw ? getInfo("Weapon Block", 1) : { lvl: 0, isDefault: false };
    if (wb.lvl > 0) {
      out.weaponBlock = evalDiminishing(wb.lvl, 20, 65);
      out.notes.push("双爪武器格挡 Lv." + wb.lvl + (wb.isDefault ? "(默认1点)" : "") + "（格挡率 " + out.weaponBlock + "%）");
    }
  } else if (clsObj.id === "ama") {
    const d = getInfo("Dodge", 0);
    const a = getInfo("Avoid", 0);
    const e = getInfo("Evade", 0);
    const p = getInfo("Pierce", 0);
    if (d.lvl > 0) out.notes.push("闪避 Lv." + d.lvl + " (" + evalDiminishing(d.lvl, 10, 65) + "%)");
    if (a.lvl > 0) out.notes.push("躲避 Lv." + a.lvl + " (" + evalDiminishing(a.lvl, 15, 75) + "%)");
    if (e.lvl > 0) out.notes.push("回避 Lv." + e.lvl + " (" + evalDiminishing(e.lvl, 10, 65) + "%)");
    if (p.lvl > 0) out.notes.push("穿刺 Lv." + p.lvl + " (" + evalDiminishing(p.lvl, 10, 100) + "%)");
  } else if (clsObj.id === "sor") {
    const w = getInfo("Warmth", 1);
    if (w.lvl > 0) {
      const regen = 30 + (w.lvl - 1) * 12;
      out.notes.push("温暖 Lv." + w.lvl + (w.isDefault ? "(默认1点)" : "") + "（法力恢复 +" + regen + "%）");
    }
  }
  return out;
}

function renderPaperdollLiveStats() {
  if (!itData || !pdData) return;

  const clsObj = getActiveClassObj();
  const merc = getCurrentMercVariant();
  const mercLvl = Math.min(98, Math.max(merc.baseLvl, Number(document.getElementById("merc-lvl-input")?.value || 90)));
  const charLvl = Math.min(99, Math.max(1, Number(document.getElementById("pd-char-lvl")?.value || 90)));
  const ctaOn = Boolean(document.getElementById("pd-cta-bo")?.checked);
  const ctaSkillBonus = ctaOn ? 1 : 0;
  const maxMode = Boolean(document.getElementById("pd-skill-max-mode")?.checked);
  const charTot = aggregateLoadoutStats(pdCharLoadout, true, charLvl, pdCharBag, { ctaSkillBonus, maxMode });
  const mercTot = aggregateLoadoutStats(pdMercLoadout, false, mercLvl, null);
  pdLastLevitateReq = { lvl: charTot.levitateLvl || 0, pct: charTot.levitateReqRedPct || 0 };
  const charAuraVal = document.getElementById("pd-char-aura")?.value || "none";
  const demonWrap = document.getElementById("pd-warlock-demon-wrap");
  if (demonWrap) demonWrap.style.display = skActiveClassId === "war" ? "inline-flex" : "none";
  const demonAuraVal = skActiveClassId === "war" ? normalizeDemonAuraId(document.getElementById("pd-warlock-demon-aura")?.value || "none") : "none";
  const demonMlvl = Math.min(99, Math.max(1, Number(document.getElementById("pd-warlock-demon-mlvl")?.value || 96)));
  const demonAuraInfo = skActiveClassId === "war" ? computeBoundDemonAura(demonAuraVal, demonMlvl) : null;
  const demonMlvlWrap = document.getElementById("pd-warlock-demon-mlvl-wrap");
  if (demonMlvlWrap) demonMlvlWrap.style.display = demonAuraInfo ? "inline-flex" : "none";
  const demonLvlBadge = document.getElementById("pd-warlock-demon-lvl-badge");
  if (demonLvlBadge) demonLvlBadge.textContent = demonAuraInfo ? ("→ Lv." + demonAuraInfo.lvl) : "";
  const hexWrap = document.getElementById("pd-warlock-hex-wrap");
  if (hexWrap) hexWrap.style.display = skActiveClassId === "war" ? "inline-flex" : "none";
  const warlockHexVal = skActiveClassId === "war" ? (document.getElementById("pd-warlock-hex-buff")?.value || "none") : "none";
  const enemyDebuffVal = document.getElementById("pd-enemy-debuff")?.value || "none";

  // Collect bi-directional team auras & combat buffs (Character + Mercenary + Warlock Bound Demon + Warlock Hex + Set/Gear Oskills + Enemy Debuffs)
  const teamAuras = [];
  const teamBuffs = {
    fanaEias: 0, hexEias: 0, salvRes: 0, hpPct: 0, manaPct: 0, frw: 0,
    physEdPct: 0, mercPhysEdPct: 0, hammerEdPct: 0, arPct: 0, defPct: 0,
    convRes: 0, convDef: 0, hexDefReduce: 0, innerSightDef: 0,
    debuffPhysRes: 0, debuffEleRes: 0,
    holyShieldSmiteMin: 0, holyShieldSmiteMax: 0,
    enchantLvl: 0, enchantArPct: 0, enchantFireMin: 0, enchantFireMax: 0,
    hexKey: "", hexLvl: 0, hexArPct: 0, hexMagicMin: 0, hexMagicMax: 0,
    hexPurgeMin: 0, hexPurgeMax: 0, hexPurgeMaxExp: 0, hexLaek: 0, hexMaek: 0
  };

  // Sync Set / Gear Oskills into #pd-skill-select whenever granted Oskills change
  const nextOsSig = Object.values(charTot.oskills || {}).map(o => o.key + ":" + o.baseLvl).sort().join("|");
  const prevOsSig = Object.values(pdActiveOskills || {}).map(o => o.key + ":" + o.baseLvl).sort().join("|");
  pdActiveOskills = charTot.oskills || {};
  if (nextOsSig !== prevOsSig) {
    populatePdSkillSelect();
  }

  // Authentic D2R same-name aura deduplication: highest level wins per aura name across Char / Bound Demon / Merc / Gear
  const auraPools = new Map();
  const registerTeamAura = (auraKey, lvl, stats, badgeObj) => {
    const idx = teamAuras.push(badgeObj) - 1;
    const prev = auraPools.get(auraKey);
    if (!prev || lvl > prev.lvl || (lvl === prev.lvl && (stats.physEdPct || 0) > (prev.physEdPct || 0))) {
      if (prev && teamAuras[prev.badgeIdx]) {
        teamAuras[prev.badgeIdx].tag += " (同源低级被覆盖)";
        teamAuras[prev.badgeIdx].color = "#9ba7be";
      }
      auraPools.set(auraKey, Object.assign({ lvl, badgeIdx: idx }, stats));
    } else {
      teamAuras[idx].tag += " (同源低级被覆盖)";
      teamAuras[idx].color = "#9ba7be";
    }
  };

  if (ctaOn) {
    const realCta = computeRealCtaBoStats(charLvl, maxMode, clsObj);
    teamBuffs.hpPct += realCta.boPct;
    teamBuffs.manaPct += realCta.boPct;
    if (realCta.real) {
      const setTag = realCta.setNum === 2 ? "副手组 II" : "主手组 I";
      teamAuras.push({
        tag: "战斗体制 Lv." + realCta.boLvl + " + 战斗指挥 Lv." + realCta.bcLvl + " (" + setTag + " 真实 CTA)",
        detail: "全队 +1 所有技能 · +" + realCta.boPct + "% 生命/法力上限 · 持续 " + realCta.boDurSec + " 秒（已计入切手栏全技能 +" + realCta.allSkillsOnCtaSet + "）",
        color: "#ffd573"
      });
    } else {
      teamAuras.push({ tag: "战斗体制 + 战斗命令 (CTA)", detail: "全队 +1 所有技能 · +65% 生命/法力上限（模拟值；在副手组 II 装入 CTA 可自动按真实等级演算）", color: "#ffd573" });
    }
  }

  // Character active aura definitions — auto-resolve level from allocated Skill Tree points + gear/CTA bonuses for the owner class!
  const charAuraDefs = {
    "fana-20": {
      owner: "pal", skillKey: "Fanaticism", auraKey: "狂热", label: "狂热灵气", color: "#ff9b42",
      compute(l, isOwner) {
        const eias = evalDiminishing(l, 10, 40);
        const selfEd = 50 + (l - 1) * 17;
        const partyEd = Math.floor(selfEd / 2);
        const arPct = 40 + (l - 1) * 5;
        return {
          stats: { eias, physEdPct: isOwner ? selfEd : partyEd, mercPhysEdPct: partyEd, arPct },
          detail: (isOwner ? ("自身 +" + selfEd + "% / 佣兵 +" + partyEd + "%") : ("友军 +" + partyEd + "%")) + " 物理伤 · +" + eias + "% EIAS · +" + arPct + "% AR"
        };
      }
    },
    "conc-20": {
      owner: "pal", skillKey: "Concentration", auraKey: "专注", label: "专注灵气", color: "#ff9b42",
      compute(l) {
        const ed = 60 + (l - 1) * 15;
        const hEd = Math.floor(ed / 2);
        return { stats: { physEdPct: ed, mercPhysEdPct: ed, hammerEdPct: hEd }, detail: "全队 +" + ed + "% 物理增伤 (+" + hEd + "% 祝福之锤)" };
      }
    },
    "conv-20": {
      owner: "pal", skillKey: "Conviction", auraKey: "信念", label: "信念灵气", color: "#67e87a",
      compute(l) {
        const convRes = Math.min(150, 25 + l * 5);
        const convDef = Math.min(95, evalDiminishing(l, 38, 100));
        return { stats: { convRes, convDef }, detail: "-" + convRes + "% 敌火/冰/电抗 · -" + convDef + "% 敌防" };
      }
    },
    "might": {
      owner: "pal", skillKey: "Might", auraKey: "力量", label: "力量灵气", color: "#ff9b42",
      compute(l) {
        const ed = 30 + l * 10;
        return { stats: { physEdPct: ed, mercPhysEdPct: ed }, detail: "全队 +" + ed + "% 物理增伤" };
      }
    },
    "ba": {
      owner: "pal", skillKey: "Blessed Aim", auraKey: "祝福瞄准", label: "祝福瞄准", color: "#ffd573",
      compute(l) {
        const arPct = 60 + l * 15;
        return { stats: { arPct }, detail: "全队 +" + arPct + "% AR" };
      }
    },
    "salv-20": {
      owner: "pal", skillKey: "Salvation", auraKey: "救助", label: "救助灵气", color: "#9ad8ff",
      compute(l) {
        const salvRes = evalDiminishing(l, 50, 120);
        return { stats: { salvRes }, detail: "全队火/冰/电抗性 +" + salvRes + "%" };
      }
    },
    "defiance": {
      owner: "pal", skillKey: "Defiance", auraKey: "反抗", label: "反抗灵气", color: "#9ad8ff",
      compute(l) {
        const defPct = 60 + l * 10;
        return { stats: { defPct }, detail: "全队防御 +" + defPct + "%" };
      }
    },
    "vigor": {
      owner: "pal", skillKey: "Vigor", auraKey: "活力", label: "活力灵气", color: "#8af49f",
      compute(l) {
        const frw = evalDiminishing(l, 7, 50);
        return { stats: { frw }, detail: "全队跑速 +" + frw + "% FRW" };
      }
    },
    "oak-20": {
      owner: "dru", skillKey: "Oak Sage", auraKey: null, label: "橡木智者", color: "#8af49f",
      compute(l) {
        const hpPct = 30 + (l - 1) * 5;
        return { hpPct, detail: "全队生命上限 +" + hpPct + "%" };
      }
    },
    "how": {
      owner: "dru", skillKey: "Heart of Wolverine", auraKey: null, label: "狼獾之心", color: "#ff9b42",
      compute(l) {
        const ed = 20 + (l - 1) * 7;
        const arPct = 25 + (l - 1) * 7;
        return { directPhysEd: ed, directArPct: arPct, detail: "全队 +" + ed + "% 物理增伤 · +" + arPct + "% AR" };
      }
    }
  };

  const resolveCharAuraMeta = (def) => {
    if (skActiveClassId === def.owner && clsObj) {
      const skObj = clsObj.skills.find(s => s.key === def.skillKey);
      const cBuild = getClassBuild(skActiveClassId);
      const hardPts = Number((cBuild && cBuild[def.skillKey]) || 0);
      const bonus = charTot.skills + (charTot.classSkills || 0) + ctaSkillBonus
        + (skObj ? (charTot.tabSkills[skObj.page] || 0) : 0)
        + ((charTot.singleSkills && charTot.singleSkills[def.skillKey]) || 0);
      if (hardPts > 0) {
        return { lvl: hardPts + bonus, basePts: hardPts, bonus, isOwner: true, srcTag: "技能树 " + hardPts + "点 + 加成 " + bonus };
      }
      if (maxMode && getClassTotalPoints(skActiveClassId) === 0) {
        return { lvl: 20 + bonus, basePts: 20, bonus, isOwner: true, srcTag: "默认 20点 + 加成 " + bonus };
      }
      return { lvl: 0, basePts: 0, bonus, isOwner: true, srcTag: "技能树未加点" };
    }
    return { lvl: 20, basePts: 20, bonus: 0, isOwner: false, srcTag: "队友模拟 Lv.20" };
  };

  const charAuraSelEl = document.getElementById("pd-char-aura");
  if (charAuraSelEl && charAuraSelEl.options) {
    Array.from(charAuraSelEl.options).forEach(opt => {
      const def = charAuraDefs[opt.value];
      if (!def) return;
      const m = resolveCharAuraMeta(def);
      if (m.lvl > 0) {
        const eff = def.compute(m.lvl, m.isOwner);
        opt.textContent = def.label + " Lv." + m.lvl + " (" + m.srcTag + " · " + eff.detail + ")";
      } else {
        opt.textContent = def.label + " Lv.0（技能树未加点，请先分配点数）";
      }
    });
  }

  const activeCharAuraDef = charAuraDefs[charAuraVal];
  if (activeCharAuraDef) {
    const m = resolveCharAuraMeta(activeCharAuraDef);
    if (m.lvl <= 0) {
      teamAuras.push({
        tag: "⚠️ 角色灵气：" + activeCharAuraDef.label + " Lv.0",
        detail: "当前技能树未给「" + activeCharAuraDef.label + "」分配点数，暂不生效",
        color: "#9ba7be"
      });
    } else {
      const eff = activeCharAuraDef.compute(m.lvl, m.isOwner);
      const tagPrefix = activeCharAuraDef.auraKey ? (m.isOwner ? "角色灵气：" : "队友灵气：") : (m.isOwner ? "角色召唤：" : "队友召唤：");
      const badgeObj = {
        tag: tagPrefix + activeCharAuraDef.label + " Lv." + m.lvl + (m.isOwner ? (" (" + m.srcTag + ")") : ""),
        detail: eff.detail,
        color: activeCharAuraDef.color
      };
      if (activeCharAuraDef.auraKey && eff.stats) {
        registerTeamAura(activeCharAuraDef.auraKey, m.lvl, eff.stats, badgeObj);
      } else {
        if (eff.hpPct) teamBuffs.hpPct += eff.hpPct;
        if (eff.directPhysEd) { teamBuffs.physEdPct += eff.directPhysEd; teamBuffs.mercPhysEdPct += eff.directPhysEd; }
        if (eff.directArPct) teamBuffs.arPct += eff.directArPct;
        teamAuras.push(badgeObj);
      }
    }
  }

  // Warlock Bound Demon Elite Auras (mlvl-scaled via floor(mlvl / divisor); applies to Warlock & Mercenary)
  if (demonAuraInfo) {
    const dBadge = {
      tag: "🔥 束缚恶魔光环：" + demonAuraInfo.name + " Lv." + demonAuraInfo.lvl,
      detail: demonAuraInfo.detail,
      color: "#f0a3ec"
    };
    if (["狂热", "专注", "力量", "信念", "祝福瞄准", "活力"].includes(demonAuraInfo.name)) {
      registerTeamAura(demonAuraInfo.name, demonAuraInfo.lvl, {
        eias: demonAuraInfo.eias || 0,
        physEdPct: demonAuraInfo.physEdPct || 0,
        hammerEdPct: demonAuraInfo.hammerEdPct || 0,
        arPct: demonAuraInfo.arPct || 0,
        convRes: demonAuraInfo.convRes || 0,
        convDef: demonAuraInfo.convDef || 0,
        frw: demonAuraInfo.frw || 0
      }, dBadge);
    } else {
      teamAuras.push(dBadge);
    }
  }

  // Warlock Eldritch Hex Self-Buffs (Hex: Bane / Hex: Purge / Hex: Siphon — 1 active at a time)
  if (skActiveClassId === "war" && warlockHexVal !== "none" && clsObj) {
    const hexSk = clsObj.skills.find(s => s.key === warlockHexVal);
    if (hexSk) {
      const wBuild = getClassBuild("war");
      const hTreePts = Number(wBuild[warlockHexVal] || 0);
      const hBasePts = hTreePts > 0 ? hTreePts : 1;
      const hLvl = hBasePts + charTot.skills + (charTot.classSkills || 0) + ctaSkillBonus + (charTot.tabSkills[hexSk.page] || 0) + ((charTot.singleSkills && charTot.singleSkills[warlockHexVal]) || 0);
      const hArPct = 20 + Math.max(0, hLvl - 1) * 9;
      teamBuffs.arPct += hArPct;
      teamBuffs.hexKey = warlockHexVal;
      teamBuffs.hexLvl = hLvl;
      teamBuffs.hexArPct = hArPct;

      const hSynBuild = {};
      if (Array.isArray(hexSk.dmgSynergies)) {
        hexSk.dmgSynergies.forEach(s => {
          hSynBuild[s.skill] = maxMode ? 20 : Number(wBuild[s.skill] || 0);
        });
      }

      if (warlockHexVal === "Hex Bane") {
        const hDmg = computeSkillDamage(hexSk, clsObj, hSynBuild, hLvl);
        const magMult = 1 + (charTot.eleDmg.mag || 0) / 100;
        teamBuffs.hexMagicMin = hDmg ? Math.round(hDmg.min * magMult) : 0;
        teamBuffs.hexMagicMax = hDmg ? Math.round(hDmg.max * magMult) : 0;
        teamBuffs.hexDefReduce = Math.min(50, 30 + Math.max(0, hLvl - 1));
        teamAuras.push({
          tag: "🔮 邪咒：灾祸 (Hex: Bane) Lv." + hLvl,
          detail: "武器附加 " + teamBuffs.hexMagicMin.toLocaleString() + "–" + teamBuffs.hexMagicMax.toLocaleString() + " 魔法伤害 · +" + hArPct + "% AR · -" + teamBuffs.hexDefReduce + "% 敌防 · -25% 敌命中",
          color: "#9ad8ff"
        });
      } else if (warlockHexVal === "Hex Purge") {
        teamBuffs.hexEias = Math.min(30, 10 + Math.max(0, hLvl - 1));
        const hDmg = computeSkillDamage(hexSk, clsObj, hSynBuild, hLvl);
        const magMult = 1 + (charTot.eleDmg.mag || 0) / 100;
        teamBuffs.hexPurgeMin = hDmg ? Math.round(hDmg.min * magMult) : 0;
        teamBuffs.hexPurgeMax = hDmg ? Math.round(hDmg.max * magMult) : 0;
        teamBuffs.hexPurgeMaxExp = Math.min(3, 1 + Math.floor(hLvl / 10));
        teamAuras.push({
          tag: "🔮 邪咒：消灭 (Hex: Purge) Lv." + hLvl,
          detail: "+" + teamBuffs.hexEias + "% EIAS 攻速 · +" + hArPct + "% AR · 击中引爆 " + teamBuffs.hexPurgeMin.toLocaleString() + "–" + teamBuffs.hexPurgeMax.toLocaleString() + " 范围魔法伤害",
          color: "#9ad8ff"
        });
      } else if (warlockHexVal === "Hex Siphon") {
        const engPts = maxMode ? 20 : Number(wBuild["Engorge"] || 0);
        teamBuffs.hexLaek = hLvl + engPts;
        teamBuffs.hexMaek = hLvl + engPts;
        teamAuras.push({
          tag: "🔮 邪咒：虹吸 (Hex: Siphon) Lv." + hLvl,
          detail: "+" + hArPct + "% AR · 杀回血 +" + teamBuffs.hexLaek + " / 杀回蓝 +" + teamBuffs.hexMaek + " · -33% 敌物伤",
          color: "#9ad8ff"
        });
      }
    }
  }

  // Enemy Curses / Bound Demon "Cursed" Debuffs
  if (enemyDebuffVal === "amp") {
    teamBuffs.debuffPhysRes = 100;
    teamAuras.push({ tag: "💀 对敌减益：伤害加深 (被诅咒)", detail: "-100% 敌人物理抗性 (破物免按 1/5 = -20%)", color: "#ff7a70" });
  } else if (enemyDebuffVal === "decrep") {
    teamBuffs.debuffPhysRes = 50;
    teamAuras.push({ tag: "💀 对敌减益：衰老 Decrepify", detail: "-50% 敌物抗 · -50% 敌攻速/移速与伤害", color: "#ff7a70" });
  } else if (enemyDebuffVal === "lr-10") {
    teamBuffs.debuffEleRes = 55;
    teamAuras.push({ tag: "💀 对敌减益：降低抵抗 Lv.10", detail: "-55% 敌火/冰/电/毒抗 (破免按 1/5 = -11%)", color: "#ff7a70" });
  } else if (enemyDebuffVal === "lr-16") {
    teamBuffs.debuffEleRes = 61;
    teamAuras.push({ tag: "💀 对敌减益：降低抵抗 Lv.16", detail: "-61% 敌火/冰/电/毒抗 (破免按 1/5 = -12%)", color: "#ff7a70" });
  }

  // Mercenary innate aura/buff (only active when Mercenary is enabled; innate aura requires combat outside town, gear auras are always active when merc is present)
  const dLvl = Math.max(0, mercLvl - merc.baseLvl);
  const mercEffBonusSkills = mercTot.skills + ctaSkillBonus;
  const mercEnabled = isMercEnabled();
  syncMercEnabledUi(mercEnabled);
  const mercAuraEl = document.getElementById("pd-merc-aura-on");
  const mercInnateAuraOn = mercEnabled && (mercAuraEl ? Boolean(mercAuraEl.checked) : true);
  let bestEnchantLvl = 0, bestEnchantSource = "";
  if (charAuraVal === "enchant-23") {
    bestEnchantLvl = 23;
    bestEnchantSource = "恶魔肢体聚气";
  }
  const mercSkillSummaries = [];
  if (!mercEnabled) {
    teamAuras.push({ tag: "佣兵：未携带", detail: "已取消勾选「携带佣兵」，佣兵自带与装备灵气均不生效", color: "#9ba7be" });
  }
  merc.skills.forEach(sk => {
    const effL = sk.base + Math.floor((dLvl * sk.per32) / 32) + mercEffBonusSkills;
    if (sk.auraDesc) {
      const statusSuffix = !mercEnabled ? " · 未携带" : (mercInnateAuraOn ? "" : " · 城镇未激活");
      mercSkillSummaries.push(sk.name + " Lv." + effL + "（" + sk.auraDesc(effL) + statusSuffix + "）");
      if (!mercEnabled) return;
      if (mercInnateAuraOn) {
        const mBadge = { tag: "佣兵光环：" + sk.name + " Lv." + effL, detail: sk.auraDesc(effL), color: "#8af49f" };
        if (sk.name.includes("力量灵气")) {
          registerTeamAura("力量", effL, { physEdPct: 30 + effL * 10 }, mBadge);
        } else if (sk.name.includes("反抗灵气")) {
          registerTeamAura("反抗", effL, { defPct: 60 + effL * 10 }, mBadge);
        } else if (sk.name.includes("祝福瞄准")) {
          registerTeamAura("祝福瞄准", effL, { arPct: 60 + effL * 15 }, mBadge);
        } else {
          teamAuras.push(mBadge);
          if (sk.name.includes("火焰强化")) {
            if (effL > bestEnchantLvl) { bestEnchantLvl = effL; bestEnchantSource = "佣兵铁狼"; }
          }
          if (sk.name.includes("内视")) teamBuffs.innerSightDef = Math.max(teamBuffs.innerSightDef, 40 + effL * 45);
        }
      } else {
        teamAuras.push({ tag: "佣兵光环：" + sk.name + " Lv." + effL + " (城镇未激活)", detail: "新房城镇未进战斗时不生效 · 勾选「自带光环生效(野外)」后计入面板", color: "#9ba7be" });
      }
    } else {
      mercSkillSummaries.push(sk.name + " Lv." + effL);
    }
  });

  // Set / Gear Granted Oskills (e.g. Horazon 5pc +30 火焰强化 Enchant, Trang-Oul Fire Ball/Wall/Meteor, Chaos WW, Passion Zeal/Berserk, Enigma Teleport)
  const activeOskillBadges = [];
  for (const os of Object.values(charTot.oskills || {})) {
    const found = findAnyClassSkill(os.key);
    const isNative = Boolean(found && found.cls.id === skActiveClassId);
    const isFireSk = Boolean((found && found.sk.dmg && found.sk.dmg.type === "fire") || os.key === "Enchant");
    const effL = os.isCharge
      ? os.baseLvl
      : (isNative
        ? (Math.min(3, os.baseLvl) + charTot.skills + (charTot.classSkills || 0) + ctaSkillBonus + (found ? (charTot.tabSkills[found.sk.page] || 0) : 0))
        : (os.baseLvl + charTot.skills + ctaSkillBonus + (isFireSk ? (charTot.fireSkills || 0) : 0)));
    const skZh = found ? found.sk.nameZh : os.key;
    if (os.key === "Enchant") {
      if (effL > bestEnchantLvl) { bestEnchantLvl = effL; bestEnchantSource = "套装/装备附魔"; }
      activeOskillBadges.push("火焰强化(附魔) Lv." + effL);
    } else {
      const isCombat = Boolean(found && (found.sk.dmg || (pdData && pdData.skillCombatMeta && pdData.skillCombatMeta[os.key])));
      activeOskillBadges.push(skZh + " Lv." + effL);
      teamAuras.push({
        tag: "✨ 自带技能：" + skZh + " Lv." + effL,
        detail: isCombat ? "全职业可用 · 已加入左侧「技能攻击力模拟」下拉列表" : "全职业可用 (套装/装备赋予)",
        color: "#ffd573"
      });
    }
  }

  if (bestEnchantLvl > 0) {
    const enchArPct = 20 + Math.max(0, bestEnchantLvl - 1) * 9;
    teamBuffs.arPct += enchArPct;
    teamBuffs.enchantLvl = bestEnchantLvl;
    teamBuffs.enchantArPct = enchArPct;
    const enchFound = findAnyClassSkill("Enchant");
    if (enchFound && enchFound.sk && enchFound.sk.dmg) {
      const rawMin = computeScaledValue(enchFound.sk.dmg.min, enchFound.sk.dmg.hitShift, bestEnchantLvl);
      const rawMax = computeScaledValue(enchFound.sk.dmg.max, enchFound.sk.dmg.hitShift, bestEnchantLvl);
      const fireMult = 1 + ((bestEnchantSource === "套装/装备附魔" ? (charTot.eleDmg.fire || 0) : 0) / 100);
      teamBuffs.enchantFireMin = Math.round(rawMin * fireMult);
      teamBuffs.enchantFireMax = Math.round(rawMax * fireMult);
    }
    teamAuras.push({
      tag: "🔥 " + bestEnchantSource + "：火焰强化 Lv." + bestEnchantLvl,
      detail: "全队 +" + enchArPct + "% AR · 武器附加 " + teamBuffs.enchantFireMin.toLocaleString() + "–" + teamBuffs.enchantFireMax.toLocaleString() + " 火焰伤害",
      color: "#ff8552"
    });
  }

  const mergedGearAuras = new Map();
  [...charTot.auras, ...(mercEnabled ? mercTot.auras : [])].forEach(a => {
    const prev = mergedGearAuras.get(a.name);
    if (!prev || a.lvl > prev.lvl) mergedGearAuras.set(a.name, a);
  });
  for (const a of mergedGearAuras.values()) {
    const gBadge = { tag: "装备灵气：" + a.name + " Lv." + a.lvl, detail: a.desc || "角色与佣兵双向共享", color: "#e284db" };
    if (["狂热", "专注", "力量", "信念", "反抗", "祝福瞄准", "活力", "救助"].includes(a.name)) {
      registerTeamAura(a.name, a.lvl, {
        eias: a.eias || 0,
        physEdPct: a.edPct || 0,
        hammerEdPct: a.hammerEdPct || 0,
        arPct: a.arPct || 0,
        defPct: a.defPct || 0,
        convRes: a.convRes || 0,
        convDef: a.convDef || 0
      }, gBadge);
    } else {
      teamAuras.push(gBadge);
    }
  }

  for (const a of auraPools.values()) {
    if (a.eias) teamBuffs.fanaEias = Math.max(teamBuffs.fanaEias, a.eias);
    if (a.physEdPct) teamBuffs.physEdPct += a.physEdPct;
    const mEd = a.mercPhysEdPct !== undefined ? a.mercPhysEdPct : (a.physEdPct || 0);
    if (mEd) teamBuffs.mercPhysEdPct += mEd;
    if (a.hammerEdPct) teamBuffs.hammerEdPct = Math.max(teamBuffs.hammerEdPct, a.hammerEdPct);
    if (a.arPct) teamBuffs.arPct += a.arPct;
    if (a.defPct) teamBuffs.defPct += a.defPct;
    if (a.convRes) teamBuffs.convRes = Math.max(teamBuffs.convRes, a.convRes);
    if (a.convDef) teamBuffs.convDef = Math.max(teamBuffs.convDef, a.convDef);
    if (a.frw) teamBuffs.frw += a.frw;
    if (a.salvRes) teamBuffs.salvRes = Math.max(teamBuffs.salvRes, a.salvRes);
  }
  const activeFanaPool = auraPools.get("狂热");
  teamBuffs.fanaLvl = activeFanaPool ? activeFanaPool.lvl : 0;

  const hasMeditation = mergedGearAuras.has("冥想");
  const hasCleansing = mergedGearAuras.has("净化");
  if (mercEnabled && merc.id === "a2-prayer" && mercInnateAuraOn && hasMeditation && hasCleansing) {
    const pLvl = 18 + mercEffBonusSkills;
    const heal = (pLvl * 2 - 5) * 3;
    teamAuras.push({ tag: "★ 祈祷+眼光+治愈三重回血联动", detail: "角色与佣兵每秒恢复 +" + heal + " 生命", color: "#5ec48e" });
  }

  const auraListEl = document.getElementById("pd-active-auras-list");
  if (auraListEl) {
    auraListEl.innerHTML = teamAuras.map(a =>
      '<span class="rw-badge" style="border-color:' + a.color + ';color:' + a.color + ';background:rgba(0,0,0,0.45)" title="' + escapeHtml(a.detail) + '">' +
        escapeHtml(a.tag + " (" + a.detail + ")") +
      '</span>'
    ).join("");
  }

  // Authentic Character Base Stats (Locked) + Manual Stat Point Allocation
  const cBase = (pdData.charBaseStats && pdData.charBaseStats[skActiveClassId]) || {
    str: 15, dex: 20, vit: 25, enr: 20, hpAdd: 30, toHitFactor: 5, lifePerLvl: 2, manaPerLvl: 1.5, lifePerVit: 3, manaPerEnr: 2, blockFactor: 25
  };
  const allocState = clampStatAlloc(charLvl);
  const allocStr = pdStatAlloc.str;
  const allocDex = pdStatAlloc.dex;
  const allocVit = pdStatAlloc.vit;
  const allocEnr = pdStatAlloc.enr;
  const totalStr = cBase.str + allocStr + charTot.str;
  const totalDex = cBase.dex + allocDex + charTot.dex;
  const totalVit = cBase.vit + allocVit + charTot.vit;
  const totalEnr = cBase.enr + allocEnr + charTot.enr;

  // Apply Class Passive Character-Sheet Bonuses (Warlock Levitate Req, Barb Natural Res/Iron Skin/Speed, Pal Max Res & Holy Shield, Ass Weapon Block)
  const totalAllPlusClass = charTot.skills + (charTot.classSkills || 0) + ctaSkillBonus;
  const passiveSheet = computeCharPassiveSheetBonuses(clsObj, getClassBuild(skActiveClassId), charTot, totalAllPlusClass, maxMode, pdCharLoadout);
  teamBuffs.holyShieldSmiteMin = passiveSheet.smiteMin || 0;
  teamBuffs.holyShieldSmiteMax = passiveSheet.smiteMax || 0;

  const effShieldBlock = charTot.shieldBlock > 0 ? (charTot.shieldBlock + charTot.blockPct + cBase.blockFactor + (passiveSheet.blockPct || 0)) : 0;
  renderStatAllocator(cBase, charTot, charLvl, effShieldBlock);

  // Exact D2R Life & Mana (Gear +Vit/+Enr and +Life/Mana per level are NOT multiplied by BO; D2R truncates with floor!)
  const boableLife = (cBase.hpAdd + cBase.vit) + 60 + (charLvl - 1) * cBase.lifePerLvl + allocVit * cBase.lifePerVit + charTot.flatHp;
  const nonBoLife = charTot.vit * cBase.lifePerVit + (charTot.nonBoHp || 0);
  const charTotalHp = Math.floor(boableLife * (1 + (teamBuffs.hpPct + charTot.hpPct) / 100) + nonBoLife);

  const boableMana = cBase.enr + (charLvl - 1) * cBase.manaPerLvl + allocEnr * cBase.manaPerEnr + charTot.flatMana;
  const nonBoMana = charTot.enr * cBase.manaPerEnr + (charTot.nonBoMana || 0);
  const charTotalMana = Math.floor(boableMana * (1 + (teamBuffs.manaPct + charTot.manaPct) / 100) + nonBoMana);

  // Total Defense & Real Block Chance & FBR (includes set/weapon/ring/charm extraFlatDef e.g. Horazon 4pc +300 Def; passiveSheet.defPct is self-only!)
  const rawDef = charTot.totalArmorDef + (charTot.extraFlatDef || 0) + Math.floor(totalDex / 4);
  const charTotalDef = Math.round(rawDef * (1 + (teamBuffs.defPct + (passiveSheet.defPct || 0)) / 100));
  const charBlockChance = effShieldBlock > 0
    ? Math.min(75, Math.max(0, Math.floor((effShieldBlock * Math.max(0, totalDex - 15)) / (charLvl * 2))))
    : passiveSheet.weaponBlock;

  // Breakpoints (FCR, FHR, FBR, IAS) + next breakpoint gap
  const bp = CLASS_BREAKPOINTS[skActiveClassId] || CLASS_BREAKPOINTS.war;
  const evalBp = (framesArr, val) => {
    let curFrame = framesArr[0][0], nextNeed = null;
    for (const pair of framesArr) {
      if (val >= pair[1]) curFrame = pair[0];
      else if (nextNeed === null) nextNeed = { frame: pair[0], need: pair[1] - val, bp: pair[1] };
    }
    return { curFrame, nextNeed };
  };
  const fcrInfo = evalBp(bp.fcr[0].frames, charTot.fcr);
  const fhrInfo = evalBp(bp.fhr[0].frames, charTot.fhr);
  const fbrInfo = bp.fbr && bp.fbr[0] ? evalBp(bp.fbr[0].frames, charTot.fbr) : { curFrame: "-", nextNeed: null };
  const iasInfo = evalIasBreakpoints(bp.iasBaseFrames || 15, charTot.ias, charTot.mainWsm, teamBuffs.fanaEias + (teamBuffs.hexEias || 0));
  const charAtkFrame = iasInfo.curFrame;

  const weapInfo = pdCharLoadout.weapon ? resolveEquippedItemInfo(pdCharLoadout.weapon, { actorLvl: charLvl, isChar: true }) : null;
  const offInfo = pdCharLoadout.offhand ? resolveEquippedItemInfo(pdCharLoadout.offhand, { actorLvl: charLvl, isChar: true }) : null;
  const weapBaseName = weapInfo && weapInfo.bRule ? weapInfo.bRule.nameZh : "";
  const weaponLabel = weapInfo
    ? (weapInfo.titleZh + (weapBaseName && !weapInfo.titleZh.includes(weapBaseName) ? (" (" + weapBaseName + ")") : ""))
    : "徒手";
  const shieldLabel = (charTot.shieldBlock > 0 && offInfo) ? offInfo.titleZh : "";
  const shieldPanelBlock = charTot.shieldBlock > 0 ? (charTot.shieldBlock + charTot.blockPct + cBase.blockFactor) : 0;

  pdLastBreakpointSnapshot = {
    classId: skActiveClassId,
    className: clsObj ? clsObj.nameZh : skActiveClassId,
    charLvl,
    fcr: charTot.fcr,
    fhr: charTot.fhr,
    fbr: charTot.fbr,
    ias: charTot.ias,
    mainWsm: charTot.mainWsm,
    weaponName: weaponLabel,
    fanaLvl: teamBuffs.fanaLvl || 0,
    fanaEias: teamBuffs.fanaEias || 0,
    hexEias: teamBuffs.hexEias || 0,
    bosLvl: 0,
    hasShield: charTot.shieldBlock > 0,
    shieldName: shieldLabel,
    shieldPanelBlock,
    holyShieldBlockPct: passiveSheet.blockPct || 0,
    effShieldBlock,
    totalDex,
    charBlockChance
  };

  // Hell Resistances with Max Res caps, Barbarian Natural Resistance & Paladin Max Res Passives
  const rawFRes = -70 + charTot.fRes + teamBuffs.salvRes + passiveSheet.allRes;
  const rawCRes = -70 + charTot.cRes + teamBuffs.salvRes + passiveSheet.allRes;
  const rawLRes = -70 + charTot.lRes + teamBuffs.salvRes + passiveSheet.allRes;
  const rawPRes = -70 + charTot.pRes + passiveSheet.allRes;
  const maxF = Math.min(95, charTot.maxFRes + passiveSheet.maxFRes);
  const maxC = Math.min(95, charTot.maxCRes + passiveSheet.maxCRes);
  const maxL = Math.min(95, charTot.maxLRes + passiveSheet.maxLRes);
  const maxP = Math.min(95, charTot.maxPRes);
  const fmtRes = (raw, cap) => {
    const eff = Math.min(cap, raw);
    const over = raw > cap ? (" (溢出+" + (raw - cap) + ")") : "";
    const color = eff >= cap ? "#67e87a" : eff >= 50 ? "#ffd573" : "#ff8a75";
    return '<span style="color:' + color + '">' + eff + '%</span><span style="color:var(--muted);font-size:10.5px">/' + cap + '%' + over + '</span>';
  };

  // Build complete Skill Sync Payload (All + Class + Tabs + Fire + Single skills!)
  pdLastCharSkillBonus = totalAllPlusClass;
  pdLastSyncPayload = {
    all: totalAllPlusClass,
    byTab: { 1: charTot.tabSkills[1] || 0, 2: charTot.tabSkills[2] || 0, 3: charTot.tabSkills[3] || 0 },
    bySkill: Object.assign({}, charTot.singleSkills || {}),
    fire: charTot.fireSkills || 0
  };
  const extraSkillParts = [];
  if (clsObj && clsObj.tabs) {
    clsObj.tabs.forEach(t => {
      if (pdLastSyncPayload.byTab[t.page] > 0) extraSkillParts.push(t.zhCN.slice(0, 2) + "+" + pdLastSyncPayload.byTab[t.page]);
    });
  }
  if (pdLastSyncPayload.fire > 0) extraSkillParts.push("火系+" + pdLastSyncPayload.fire);
  Object.entries(pdLastSyncPayload.bySkill).forEach(([k, v]) => {
    if (v > 0) {
      const sObj = clsObj && clsObj.skills.find(x => x.key === k);
      extraSkillParts.push((sObj ? sObj.nameZh : k) + "+" + v);
    }
  });
  const syncBtn = document.getElementById("pd-sync-skills-btn");
  if (syncBtn) {
    syncBtn.textContent = "同步技能至技能树 (全+" + totalAllPlusClass + (extraSkillParts.length ? (" · " + extraSkillParts.join("/")) : "") + ")";
  }

  // Render Selected Skill Attack Power Card
  const combat = computeSelectedSkillCombat({
    clsObj, charTot, charLvl, totalStr, totalDex, ctaSkillBonus, teamBuffs,
    charFcrFrame: fcrInfo.curFrame, charAtkFrame, maxMode
  });
  const activeShareSk = clsObj && Array.isArray(clsObj.skills) ? clsObj.skills.find(s => s.key === pdSelectedSkillKey) : null;
  const shareSkillDmg = combat.dmgMax > 0
    ? (combat.dmgMin.toLocaleString() + "–" + combat.dmgMax.toLocaleString())
    : "";
  pdLastShareSummary = {
    classId: skActiveClassId,
    hp: charTotalHp,
    mana: charTotalMana,
    def: charTotalDef,
    blockChance: charBlockChance,
    fcr: charTot.fcr,
    fcrFrame: fcrInfo.curFrame,
    fhr: charTot.fhr,
    fhrFrame: fhrInfo.curFrame,
    ias: charTot.ias,
    iasFrame: iasInfo.curFrame,
    fbr: charTot.fbr,
    fbrFrame: typeof fbrInfo.curFrame === "number" ? fbrInfo.curFrame : 0,
    mf: charTot.mf,
    dr: Math.min(50, charTot.drPct),
    resF: Math.min(maxF, rawFRes),
    resC: Math.min(maxC, rawCRes),
    resL: Math.min(maxL, rawLRes),
    resP: Math.min(maxP, rawPRes),
    allSkillBonus: totalAllPlusClass,
    totalStr,
    totalDex,
    totalVit,
    totalEnr,
    skillName: activeShareSk ? activeShareSk.nameZh : "",
    skillLvl: combat.effLvl || 0,
    skillDmg: shareSkillDmg,
    dps: combat.dps || 0,
    weaponName: weaponLabel,
    shieldName: shieldLabel
  };
  const atkResultEl = document.getElementById("pd-skill-atk-result");
  if (atkResultEl) {
    const typeColors = { phys: "#f5cf7b", fire: "#ff7a59", cold: "#64b5f6", ltng: "#ffe066", pois: "#67e87a", mag: "#c792ea" };
    const typeNames = { phys: "物理", fire: "火焰", cold: "冰冷", ltng: "闪电", pois: "毒素", mag: "魔法" };
    const tc = typeColors[combat.dmgType] || "#ffd573";
    const tn = typeNames[combat.dmgType] || "伤害";
    atkResultEl.innerHTML =
      '<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px">' +
        '<div class="pd-sheet-card" style="border-color:rgba(255,138,117,0.35)">' +
          '<div style="font-size:10.5px;color:var(--muted)">选定技能有效等级</div>' +
          '<div style="font-size:15px;font-weight:900;color:#ffe08c">Lv.' + combat.effLvl + '</div>' +
          '<div style="font-size:10.5px;color:var(--muted)">耗蓝 ' + combat.manaCost + (combat.tabBonus ? (' · 含分系/单技+' + combat.tabBonus) : '') + '</div>' +
        '</div>' +
        '<div class="pd-sheet-card" style="border-color:rgba(245,207,123,0.4)">' +
          '<div style="font-size:10.5px;color:var(--muted)">' + (combat.lcsMax > 0 ? ('游戏 C 键面板攻击力 (' + tn + ')') : ('面板技能攻击力 (' + tn + ')')) + '</div>' +
          '<div style="font-size:15px;font-weight:900;color:' + tc + '">' + (combat.lcsMax > 0 ? (combat.lcsMin.toLocaleString() + ' – ' + combat.lcsMax.toLocaleString()) : (combat.dmgMax > 0 ? (combat.dmgMin.toLocaleString() + ' – ' + combat.dmgMax.toLocaleString()) : '辅助技能')) + '</div>' +
          (combat.lcsMax > 0 ? ('<div style="font-size:10.5px;color:#8af49f">实战真实单次 ≈ ' + combat.dmgMin.toLocaleString() + ' – ' + combat.dmgMax.toLocaleString() + '</div>') : '') +
          '<div style="font-size:10.5px;color:var(--muted)">' + (combat.dps > 0 ? ('理论 DPS ≈ ' + combat.dps.toLocaleString() + '/秒' + (combat.lcsMax > 0 ? ' (按真实伤)' : '')) : '无直接单次伤害') + '</div>' +
        '</div>' +
        '<div class="pd-sheet-card" style="border-color:rgba(104,164,255,0.4)">' +
          '<div style="font-size:10.5px;color:var(--muted)">攻击准确率 AR (对 Lv.85)</div>' +
          '<div style="font-size:15px;font-weight:900;color:#9ad8ff">' + combat.skillAr.toLocaleString() + '</div>' +
          '<div style="font-size:10.5px;color:#8af49f">实战命中率 ' + combat.hitPct + '%</div>' +
        '</div>' +
      '</div>' +
      (combat.extraNotes.length
        ? ('<details class="pd-skill-notes-details" id="pd-skill-notes-details"' + (pdSkillNotesOpen ? ' open' : '') + '>' +
            '<summary class="pd-skill-notes-summary"><span>查看伤害构成与增益明细（' + combat.extraNotes.length + ' 项）</span></summary>' +
            '<div class="pd-skill-notes-body">' + renderStatList(combat.extraNotes.join(" · "), "#cfe0fa", false) + '</div>' +
          '</details>')
        : '');
  }

  // Render Comprehensive D2R Character Sheet
  const effDr = Math.min(50, charTot.drPct);
  const sunderLabels = { ltng: "破电", fire: "破火", cold: "破冰", pois: "破毒", phys: "破物", mag: "破魔" };
  const activeSunders = [...charTot.sunders].map(k => sunderLabels[k] || k);
  const eleDmgParts = [];
  if (charTot.eleDmg.fire) eleDmgParts.push("火+" + charTot.eleDmg.fire + "%");
  if (charTot.eleDmg.cold) eleDmgParts.push("冰+" + charTot.eleDmg.cold + "%");
  if (charTot.eleDmg.ltng) eleDmgParts.push("电+" + charTot.eleDmg.ltng + "%");
  if (charTot.eleDmg.pois) eleDmgParts.push("毒+" + charTot.eleDmg.pois + "%");
  if (charTot.eleDmg.mag) eleDmgParts.push("魔+" + charTot.eleDmg.mag + "%");

  const fmtBpGap = (info) => info.nextNeed
    ? (' <span style="color:var(--muted);font-size:10px">(距' + info.nextNeed.frame + '帧差+' + info.nextNeed.need + '%)</span>')
    : ' <span style="color:#67e87a;font-size:10px">(✓满档)</span>';
  const iasBuffTags = [];
  if (teamBuffs.fanaLvl > 0) iasBuffTags.push("狂热Lv." + teamBuffs.fanaLvl);
  if (teamBuffs.hexEias > 0) iasBuffTags.push("邪咒+" + teamBuffs.hexEias + "%EIAS");
  const iasMetaTag = ' <span style="color:var(--muted);font-size:10px">[WSM ' + charTot.mainWsm + (iasBuffTags.length ? (" · " + iasBuffTags.join("·")) : "") + ']</span>';

  const kv = (k, v) => '<div class="pd-sheet-kv"><span class="pd-sheet-k">' + k + '</span><span class="pd-sheet-v">' + v + '</span></div>';
  const charStatsEl = document.getElementById("pd-char-stats");
  if (charStatsEl) {
    const bagLayout = layoutInventoryBag(pdCharBag);
    const gearWarn = (totalStr < charTot.maxReqStr || totalDex < charTot.maxReqDex)
      ? '<span style="color:#ff8a75">⚠️ 力/敏未达穿戴需求</span>'
      : '<span style="color:#67e87a">✓ 穿戴需求达标</span>';
    charStatsEl.innerHTML =
      '<div class="pd-sheet-grid">' +
        '<div class="pd-sheet-card">' +
          '<div class="pd-sheet-title">四维汇总与技能加成 (剩余 ' + allocState.rem + ' 点)</div>' +
          kv("装备穿戴校验", gearWarn) +
          kv("全技能 / 职业技能", '<span style="color:#ffd573">+' + totalAllPlusClass + '</span> <span style="color:var(--muted);font-size:10.5px">(全+' + (charTot.skills + ctaSkillBonus) + ' · 职业+' + (charTot.classSkills || 0) + ')</span>') +
          kv("分系 / 单技能加成", extraSkillParts.length ? ('<span style="color:#9ad8ff">' + extraSkillParts.join(" · ") + '</span>') : "无") +
          kv("体力 / 精力总值", totalVit + ' / ' + totalEnr) +
          (passiveSheet.notes.length ? kv("职业被动联动", '<span style="color:#8af49f;font-size:11px">' + escapeHtml(passiveSheet.notes.join(" · ")) + '</span>') : '') +
        '</div>' +
        '<div class="pd-sheet-card">' +
          '<div class="pd-sheet-title">生存、防御与格挡</div>' +
          kv("总生命值 Life", '<span style="color:#ff8a75">' + charTotalHp.toLocaleString() + '</span>') +
          kv("总法力值 Mana", '<span style="color:#78b7ff">' + charTotalMana.toLocaleString() + '</span>') +
          kv("总防御值 Defense", charTotalDef.toLocaleString() + (teamBuffs.defPct ? (' <span style="color:#8af49f">(+' + teamBuffs.defPct + '%)</span>') : '')) +
          kv("实际格挡率 Block", (charTot.shieldBlock > 0 ? ('<strong>' + charBlockChance + '%</strong> · FBR ' + charTot.fbr + '% → <strong>' + fbrInfo.curFrame + '帧</strong>' + fmtBpGap(fbrInfo)) : (passiveSheet.weaponBlock > 0 ? ('<span style="color:#8af49f">' + passiveSheet.weaponBlock + '% (双爪武器格挡)</span>') : '未持盾 (0%)'))) +
          kv("无法冰冻 CBF", charTot.cbf ? '<span style="color:#67e87a">✓ 已具备</span>' : '<span style="color:#ff9b8f">✗ 未具备</span>') +
        '</div>' +
        '<div class="pd-sheet-card">' +
          '<div class="pd-sheet-title" style="display:flex;align-items:center;justify-content:space-between;gap:6px"><span>攻击、准确 AR 与速度档位</span><button type="button" class="pd-jump-bp-btn" id="pd-jump-bp-btn">📊 完整档位表 →</button></div>' +
          kv("准确值 / 普攻面板", '<span style="color:#9ad8ff">' + combat.normalAr.toLocaleString() + '</span> <span style="color:var(--muted);font-size:10px">(命中' + combat.normalHitPct + '%)</span> · ' + combat.normalMin.toLocaleString() + '–' + combat.normalMax.toLocaleString()) +
          kv("快速施法 FCR", charTot.fcr + '% → <strong>' + fcrInfo.curFrame + ' 帧</strong>' + fmtBpGap(fcrInfo)) +
          kv("打击恢复 FHR", charTot.fhr + '% → <strong>' + fhrInfo.curFrame + ' 帧</strong>' + fmtBpGap(fhrInfo)) +
          kv("攻击速度 IAS", charTot.ias + '%' + iasMetaTag + ' → <strong>' + iasInfo.curFrame + ' 帧</strong>' + fmtBpGap(iasInfo)) +
          kv("高速跑步 FRW", '+' + (charTot.frw + passiveSheet.frw + (teamBuffs.frw || 0)) + '%' + ((passiveSheet.frw || teamBuffs.frw) ? (' <span style="color:var(--muted);font-size:10px">(' + [passiveSheet.frw ? '含加速' : '', teamBuffs.frw ? ('含活力+' + teamBuffs.frw + '%') : ''].filter(Boolean).join('·') + ')</span>') : '')) +
        '</div>' +
        '<div class="pd-sheet-card">' +
          '<div class="pd-sheet-title">地狱四抗 (含安亚+30) 与减伤</div>' +
          kv("火焰抗性 Fire", fmtRes(rawFRes, maxF)) +
          kv("冰冷抗性 Cold", fmtRes(rawCRes, maxC)) +
          kv("闪电抗性 Ltng", fmtRes(rawLRes, maxL)) +
          kv("毒素抗性 Pois", fmtRes(rawPRes, maxP)) +
          kv("物理减伤 / PDR / MDR", 'DR ' + effDr + '% (上限50%) · PDR ' + charTot.pdr + ' · MDR ' + charTot.mdr) +
        '</div>' +
        '<div class="pd-sheet-card">' +
          '<div class="pd-sheet-title">战斗特效与元素穿透</div>' +
          kv("压碎 CB / 致命 DS / 撕裂 OW", charTot.cb + '% / ' + charTot.ds + '% / ' + charTot.ow + '%') +
          kv("吸血 LL / 吸蓝 ML", charTot.ll + '% / ' + charTot.ml + '%') +
          kv("杀回蓝 MAEK / 杀回血 LAEK", '+' + (charTot.maek + (teamBuffs.hexMaek || 0)) + ' / +' + (charTot.laek + (teamBuffs.hexLaek || 0)) + (teamBuffs.hexLaek ? ' <span style="color:#9ad8ff;font-size:10px">(含虹吸)</span>' : '')) +
          kv("元素增伤 / 降抗", (eleDmgParts.length ? eleDmgParts.join(" ") : "无") + (charTot.pierce.length ? (" · " + charTot.pierce.join("/")) : "")) +
          kv("破免板状态", activeSunders.length ? ('<span style="color:#ffd573">' + activeSunders.join(" · ") + '</span>') : '未携带破免板') +
        '</div>' +
        '<div class="pd-sheet-card">' +
          '<div class="pd-sheet-title">收益、套装与背包占格</div>' +
          kv("寻宝率 MF", '<span style="color:#ffd573">+' + charTot.mf + '%</span>') +
          kv("额外金币 EG / 经验 Exp", '+' + charTot.eg + '% / +' + charTot.expPct + '%') +
          kv("背包咒符空间", '已用 ' + bagLayout.usedCells + '/40 格 (' + bagLayout.placed.length + ' 件)') +
          kv("已激活套装", charTot.activeSets.length ? charTot.activeSets.join(", ") : "无") +
          (activeOskillBadges.length ? kv("套装/装备自带技能", '<span style="color:#ffaa4d">' + escapeHtml(activeOskillBadges.join(" · ")) + '</span>') : "") +
        '</div>' +
      '</div>';
  }

  // Render Mercenary total stats & breakpoints (hireling.txt: Str/Dex in 1/8, Resist in 1/4, Poison cap 75% unless +MaxPRes)
  const mBaseStr = merc.str + Math.floor((dLvl * merc.str8) / 8);
  const mBaseDex = merc.dex + Math.floor((dLvl * merc.dex8) / 8);
  const mBaseHp = merc.hp + dLvl * merc.hpLvl + mercTot.flatHp;
  const mBaseDef = merc.def + dLvl * merc.defLvl + mercTot.totalArmorDef + (mercTot.extraFlatDef || 0);
  const mTotalDef = Math.round(mBaseDef * (1 + teamBuffs.defPct / 100));
  const mBaseResHell = merc.res + Math.floor((dLvl * merc.res4) / 4) - 100;

  const mTotalStr = mBaseStr + mercTot.str;
  const mTotalDex = mBaseDex + mercTot.dex;
  const mHpMult = 1 + (teamBuffs.hpPct + mercTot.hpPct) / 100;
  const mTotalHp = Math.floor(mBaseHp * mHpMult) + (mercTot.nonBoHp || 0);
  const mFRes = Math.min(mercTot.maxFRes, mBaseResHell + mercTot.fRes + teamBuffs.salvRes);
  const mCRes = Math.min(mercTot.maxCRes, mBaseResHell + mercTot.cRes + teamBuffs.salvRes);
  const mLRes = Math.min(mercTot.maxLRes, mBaseResHell + mercTot.lRes + teamBuffs.salvRes);
  const mPRes = Math.min(mercTot.maxPRes, mBaseResHell + mercTot.pRes);

  const mGearEias = Math.floor((120 * mercTot.ias) / (120 + mercTot.ias));
  const mEias = Math.min(75, Math.max(-75, mGearEias + teamBuffs.fanaEias - mercTot.mainWsm));
  const mAtkFrame = Math.max(8, Math.ceil((256 * merc.baseFrames) / Math.floor((256 * (100 + mEias)) / 100)) - 1);
  const mAps = (25 / mAtkFrame).toFixed(2);
  const mWeapMin = Math.floor((mercTot.mainWeapMin + mercTot.flatDmg + mercTot.flatMinDmg) * (1 + (mTotalStr + mercTot.offWeaponEdPct + teamBuffs.mercPhysEdPct) / 100)) + (teamBuffs.enchantFireMin || 0);
  const mWeapMax = Math.floor((mercTot.mainWeapMax + mercTot.flatDmg + mercTot.flatMaxDmg) * (1 + (mTotalStr + mercTot.offWeaponEdPct + teamBuffs.mercPhysEdPct) / 100)) + (teamBuffs.enchantFireMax || 0);
  const mAr = Math.floor((mTotalDex * 5 + mercLvl * 18 + mercTot.flatAr) * (1 + (mercTot.arPct + teamBuffs.arPct) / 100));

  const checkEl = document.getElementById("merc-equip-check");
  if (checkEl) {
    if (!mercEnabled) {
      checkEl.innerHTML = "⏸️ <strong>当前未携带佣兵</strong>（已置灰锁定不可修改 · 勾选左上角「携带佣兵」即可恢复配装与灵气加成）";
    } else {
      const canStr = mTotalStr >= mercTot.maxReqStr;
      const canDex = mTotalDex >= mercTot.maxReqDex;
      checkEl.innerHTML = (canStr && canDex)
        ? ("✓ <strong>佣兵属性达标可穿戴全部装备</strong>（总力量 <strong>" + mTotalStr + "</strong>/需 " + mercTot.maxReqStr + " · 总敏捷 <strong>" + mTotalDex + "</strong>/需 " + mercTot.maxReqDex + "）")
        : ("⚠️ <strong>佣兵穿戴属性不足！</strong>当前力量 " + mTotalStr + " (需 " + mercTot.maxReqStr + ") · 敏捷 " + mTotalDex + " (需 " + mercTot.maxReqDex + ")，请镶嵌 #19 法尔/完美紫或调整等级");
    }
  }

  const hpNote = mHpMult > 1 ? (" (含全队增益 x" + mHpMult.toFixed(2) + ")") : "";
  const mercGearAuraTxt = mercTot.auras.length
    ? mercTot.auras.map(a => a.name + " Lv." + a.lvl).join(" / ")
    : "无";
  const mLines = [
    "自带技能与光环：" + mercSkillSummaries.join(" · "),
    "装备赋予光环：" + mercGearAuraTxt + (mercEnabled ? "（装备光环在城里常驻生效）" : "（未携带佣兵 · 未生效）"),
    "生命值：" + mTotalHp.toLocaleString() + hpNote + " · 总防御：" + mTotalDef.toLocaleString(),
    "面板伤害：" + mWeapMin.toLocaleString() + "–" + mWeapMax.toLocaleString() + " · 准确率 AR：" + mAr.toLocaleString(),
    "力量：" + mTotalStr + " (裸 " + mBaseStr + ") · 敏捷：" + mTotalDex + " (裸 " + mBaseDex + ") · 全技能 +" + mercEffBonusSkills,
    "地狱四抗：火 " + mFRes + "% · 冰 " + mCRes + "% · 电 " + mLRes + "% · 毒 " + mPRes + "% (裸抗 " + mBaseResHell + "%)",
    "攻击速度：总 IAS " + mercTot.ias + "%" + (teamBuffs.fanaEias > 0 ? (" (+狂热 EIAS " + teamBuffs.fanaEias + "%)") : "") + " (WSM [" + mercTot.mainWsm + "]) → " + mAtkFrame + " 帧 (" + mAps + " 次/秒)",
    "战斗特效：吸血 LL " + mercTot.ll + "% · 压碎 CB " + mercTot.cb + "% · 致命 DS " + mercTot.ds + "% · 物免 DR " + Math.min(50, mercTot.drPct) + "% · CBF " + (mercTot.cbf ? "✓" : "✗")
  ];
  const mBodyEl = document.getElementById("merc-stats-body");
  if (mBodyEl) mBodyEl.innerHTML = renderStatList(mLines.join(" · "), "#8af49f", false);

  pdLastHoverCtx = {
    charStr: totalStr,
    charDex: totalDex,
    mercStr: mTotalStr,
    mercDex: mTotalDex,
    charSetCounts: charTot.setCounts,
    mercSetCounts: mercTot.setCounts
  };
  renderActiveItemPreview();

  // Auto-persist current class paperdoll, bag, stat allocation, auras, Hex buff & mercenary to localStorage
  if (pdStateLoadedForClass === skActiveClassId) {
    savePaperdollState(skActiveClassId);
  }

  // Auto-sync live Paperdoll stats into Breakpoints calculator when enabled
  if (bpAutoSyncEnabled && !bpManualOverride && !bpSyncingFromPd) {
    syncPaperdollToBreakpoints(true);
  } else {
    renderBpSyncBadge();
  }
}

function renderPaperdollAll() {
  if (!itData || !pdData) return;
  if (!isMercEnabled() && pdActiveTarget === "merc") {
    pdActiveTarget = "char";
    pdActiveSlot = pdCharLoadout.weapon ? "weapon" : "head";
    pdActiveBagUid = null;
  }
  const clsObj = getActiveClassObj();
  const charTitleEl = document.getElementById("pd-char-title");
  if (charTitleEl && clsObj) {
    charTitleEl.innerHTML = '<img class="ui-chip-icon" src="' + escapeHtml(clsObj.icon) + '" alt="">' + escapeHtml(clsObj.nameZh) + ' (' + escapeHtml(clsObj.nameEn) + ') 10 部位配装纸娃娃';
  }

  populateBagAddSelect();
  populatePdSkillSelect();
  renderWeaponSwapBar();
  renderPaperdollSlotGrid("pd-char-grid", "char", PD_CHAR_SLOTS, pdCharLoadout);
  renderPaperdollSlotGrid("pd-merc-grid", "merc", PD_MERC_SLOTS, pdMercLoadout);
  renderInventoryBag();
  renderSlotEditor();
  renderPaperdollLiveStats();
}

async function initMercenarySimulator() {
  let pdJustLoaded = false;
  if (!pdData) {
    try {
      const res = await fetch("/api/paperdoll", { cache: "no-store" });
      const d = await res.json();
      if (d && d.ok) {
        pdData = d;
        pdJustLoaded = true;
      }
    } catch (e) {
      console.error("加载纸娃娃配装数据失败", e);
    }
  }
  const vSel = document.getElementById("merc-variant-select");
  if (!vSel) return;

  if (!vSel.options.length) {
    vSel.innerHTML = MERC_VARIANTS.map(v => '<option value="' + escapeHtml(v.id) + '">' + escapeHtml(v.name) + '</option>').join("");
    loadAllSavedPaperdollBuilds();
    loadPaperdollStateForClass(skActiveClassId);

    vSel.addEventListener("change", () => {
      if (!isMercEnabled()) return;
      const merc = getCurrentMercVariant();
      if (merc.act === 1) {
        pdMercLoadout.weapon = { cat: "rw", id: "faith", baseCode: "amc", eth: false, sockets: [], rolls: {} };
        pdMercLoadout.offhand = null;
      } else if (merc.act === 2) {
        pdMercLoadout.weapon = { cat: "rw", id: "infinity", baseCode: "7wc", eth: true, sockets: [], rolls: {} };
        pdMercLoadout.offhand = null;
      } else if (merc.act === 3) {
        pdMercLoadout.weapon = { cat: "rw", id: "spirit", baseCode: "crs", eth: false, sockets: [], rolls: {} };
        pdMercLoadout.offhand = { cat: "rw", id: "spirit", baseCode: "uit", eth: false, sockets: [], rolls: {} };
      } else if (merc.id === "a5-frenzy") {
        pdMercLoadout.weapon = { cat: "rw", id: "plague", baseCode: "7cr", eth: false, sockets: [], rolls: {} };
        pdMercLoadout.offhand = { cat: "rw", id: "lawbringer", baseCode: "7cr", eth: false, sockets: [], rolls: {} };
      } else {
        pdMercLoadout.weapon = { cat: "rw", id: "last-wish", baseCode: "7fb", eth: true, sockets: [], rolls: {} };
        pdMercLoadout.offhand = null;
      }
      renderPaperdollAll();
    });

    const mercEnabledEl = document.getElementById("pd-merc-enabled");
    if (mercEnabledEl) {
      mercEnabledEl.addEventListener("change", () => {
        if (!mercEnabledEl.checked && pdActiveTarget === "merc") {
          pdActiveTarget = "char";
          pdActiveSlot = pdCharLoadout.weapon ? "weapon" : "head";
          pdActiveBagUid = null;
        }
        renderPaperdollAll();
      });
    }

    ["merc-lvl-input", "pd-merc-aura-on", "pd-char-lvl", "pd-char-aura", "pd-warlock-demon-aura", "pd-warlock-demon-mlvl", "pd-warlock-hex-buff", "pd-enemy-debuff", "pd-cta-bo", "pd-skill-max-mode"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", renderPaperdollLiveStats);
        el.addEventListener("change", renderPaperdollLiveStats);
      }
    });

    const pdSkillSel = document.getElementById("pd-skill-select");
    if (pdSkillSel) {
      pdSkillSel.addEventListener("change", () => {
        pdSelectedSkillKey = pdSkillSel.value;
        renderPaperdollLiveStats();
      });
    }
    // Keep collapsible skill breakdown state across live re-renders (toggle does not bubble, hence capture)
    document.addEventListener("toggle", (e) => {
      if (e.target && e.target.id === "pd-skill-notes-details") {
        pdSkillNotesOpen = Boolean(e.target.open);
      }
    }, { capture: true });

    // Inventory Bag Events
    const bagAddSel = document.getElementById("pd-bag-add-select");
    if (bagAddSel) {
      bagAddSel.addEventListener("change", populateBagAddSelect);
    }
    const bagAddBtn = document.getElementById("pd-bag-add-btn");
    if (bagAddBtn) {
      bagAddBtn.addEventListener("click", () => {
        const cid = document.getElementById("pd-bag-add-select")?.value;
        const tPage = Number(document.getElementById("pd-bag-skiller-tab")?.value || 1);
        if (cid) addItemToBag(cid, tPage);
      });
    }
    document.querySelectorAll("#pd-bag-quick-btns [data-quick-charm]").forEach(btn => {
      btn.addEventListener("click", () => {
        const cid = btn.dataset.quickCharm;
        const clsObj = getActiveClassObj();
        const firstPage = (clsObj && clsObj.tabs && clsObj.tabs[0]) ? clsObj.tabs[0].page : 1;
        addItemToBag(cid, firstPage);
      });
    });
    const bagClearBtn = document.getElementById("pd-bag-clear-btn");
    if (bagClearBtn) {
      bagClearBtn.addEventListener("click", () => {
        pdCharBag = [];
        if (pdActiveTarget === "bag") {
          pdActiveTarget = "char";
          pdActiveBagUid = null;
        }
        showBagMessage("");
        renderPaperdollAll();
      });
    }
    const bagPresetBtn = document.getElementById("pd-bag-preset-btn");
    if (bagPresetBtn) {
      bagPresetBtn.addEventListener("click", () => {
        const clsObj = getActiveClassObj();
        const mainTab = (clsObj && clsObj.tabs && clsObj.tabs[clsObj.tabs.length - 1]) ? clsObj.tabs[clsObj.tabs.length - 1].page : 1;
        const sunderByClass = { war: "sunder-fire", sor: "sunder-ltng", pal: "sunder-mag", ama: "sunder-ltng", nec: "sunder-mag", bar: "sunder-phys", dru: "sunder-phys", ass: "sunder-ltng" };
        const presetIds = [
          "torch", "anni", "gheed", sunderByClass[skActiveClassId] || "sunder-ltng",
          "gc-sk-life", "gc-sk-life", "gc-sk-life", "gc-sk-life", "gc-sk-life",
          "sc-20-5", "sc-20-5", "sc-20-5", "sc-7mf-5ar", "sc-7mf-5ar",
          "util-cube", "util-id", "util-tp"
        ];
        pdCharBag = presetIds.map(cid => ({
          uid: "b" + (pdBagNextUid++),
          charmId: cid,
          tabPage: cid.startsWith("gc-sk") ? mainTab : 0,
          rolls: {}
        }));
        pdActiveTarget = "bag";
        pdActiveBagUid = pdCharBag[0].uid;
        showBagMessage("");
        renderPaperdollAll();
      });
    }
    const bagEditSkSel = document.getElementById("pd-bag-edit-skiller-select");
    if (bagEditSkSel) {
      bagEditSkSel.addEventListener("change", () => {
        const item = pdCharBag.find(x => x.uid === pdActiveBagUid);
        if (item) {
          item.tabPage = Number(bagEditSkSel.value || 1);
          renderPaperdollAll();
        }
      });
    }
    const bagDupBtn = document.getElementById("pd-bag-dup-btn");
    if (bagDupBtn) {
      bagDupBtn.addEventListener("click", () => {
        const item = pdCharBag.find(x => x.uid === pdActiveBagUid);
        if (item) addItemToBag(item.charmId, item.tabPage, item);
      });
    }

    ensureSlotCombos();
    document.querySelectorAll("#pd-cat-chips [data-pd-cat]").forEach(btn => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        pdActiveCat = btn.dataset.pdCat;
        if (pdRwBaseCombo) pdRwBaseCombo.close(false);
        if (pdItemCombo) pdItemCombo.close(false);
        renderSlotEditor();
      });
    });

    // Crafted Item Skill Picker (+0 / +1~2 Class Skills / +1~2 Single Skill Tree)
    const onCraftSkillChange = () => {
      const loadout = pdActiveTarget === "char" ? pdCharLoadout : pdMercLoadout;
      const cur = loadout[pdActiveSlot];
      if (!cur || cur.cat !== "craft") return;
      const tVal = document.getElementById("pd-craft-skill-target")?.value || "none";
      const lVal = Math.min(2, Math.max(1, Number(document.getElementById("pd-craft-skill-lvl")?.value || 2)));
      if (tVal === "none") {
        cur.craftSkill = { mode: "none", tabPage: 1, lvl: lVal };
      } else if (tVal === "class") {
        cur.craftSkill = { mode: "class", tabPage: 1, lvl: lVal };
      } else if (tVal.startsWith("tab:")) {
        cur.craftSkill = { mode: "tab", tabPage: Number(tVal.slice(4) || 1), lvl: lVal };
      }
      renderPaperdollAll();
    };
    const craftSkTarget = document.getElementById("pd-craft-skill-target");
    const craftSkLvl = document.getElementById("pd-craft-skill-lvl");
    if (craftSkTarget) craftSkTarget.addEventListener("change", onCraftSkillChange);
    if (craftSkLvl) craftSkLvl.addEventListener("change", onCraftSkillChange);

    // Magic / Rare / Bag Magic Charm Affix Builder (+Prefix / +Suffix with Auto-Lock & Group Exclusion!)
    const afFilterInp = document.getElementById("pd-affix-filter");
    if (afFilterInp) {
      afFilterInp.addEventListener("input", (e) => {
        pdAffixFilter = e.target.value.trim();
        renderSlotEditor();
      });
    }
    const addAffixFromBuilder = (type) => {
      const box = document.getElementById("pd-affix-builder");
      const ctx = box && box._pdAffixCtx;
      if (!ctx || !ctx.itemObj) return;
      const sel = document.getElementById(type === "prefix" ? "pd-affix-pre-select" : "pd-affix-suf-select");
      if (!sel || !sel.value) return;
      const arr = type === "prefix" ? ctx.itemObj.prefixes : ctx.itemObj.suffixes;
      const cap = type === "prefix" ? ctx.maxPre : ctx.maxSuf;
      const curTotal = (ctx.itemObj.prefixes ? ctx.itemObj.prefixes.length : 0) + (ctx.itemObj.suffixes ? ctx.itemObj.suffixes.length : 0);
      if (arr.length >= cap || curTotal >= (ctx.maxTotal || 99)) return;
      const list = type === "prefix" ? ctx.pool.prefixes : ctx.pool.suffixes;
      const found = list.find(x => x.id === sel.value);
      if (!found) return;
      preserveRollsAcrossAffixEdit(ctx.itemObj, () => {
        arr.push({ id: found.id, g: found.g || 0, nameZh: found.nameZh, range: found.range });
      });
      renderPaperdollAll();
    };
    window.addEventListener("scroll", hidePdTooltip, { passive: true });
    const afPreAddBtn = document.getElementById("pd-affix-pre-add");
    const afSufAddBtn = document.getElementById("pd-affix-suf-add");
    if (afPreAddBtn) afPreAddBtn.addEventListener("click", () => addAffixFromBuilder("prefix"));
    if (afSufAddBtn) afSufAddBtn.addEventListener("click", () => addAffixFromBuilder("suffix"));

    const ethCb = document.getElementById("pd-item-eth");
    if (ethCb) {
      ethCb.addEventListener("change", () => {
        const loadout = pdActiveTarget === "char" ? pdCharLoadout : pdMercLoadout;
        if (loadout[pdActiveSlot]) {
          loadout[pdActiveSlot].eth = Boolean(ethCb.checked);
          renderPaperdollAll();
        }
      });
    }
    [
      { id: "pd-sup-ed", prop: "supEd", max: 15 },
      { id: "pd-sup-ar", prop: "supAr", max: 3 },
      { id: "pd-sup-def", prop: "supDef", max: 15 }
    ].forEach(cfg => {
      const el = document.getElementById(cfg.id);
      if (!el) return;
      const syncSup = () => {
        const loadout = pdActiveTarget === "char" ? pdCharLoadout : pdMercLoadout;
        const cur = loadout[pdActiveSlot];
        if (!cur || (cur.cat !== "rw" && cur.cat !== "base")) return;
        const v = Math.min(cfg.max, Math.max(0, Math.floor(Number(el.value || 0))));
        cur[cfg.prop] = v;
        renderPaperdollAll();
      };
      el.addEventListener("input", syncSup);
      el.addEventListener("change", syncSup);
    });
    ["pd-pal-mod-res", "pd-pal-mod-dmg"].forEach(rid => {
      const rEl = document.getElementById(rid);
      if (!rEl) return;
      rEl.addEventListener("change", () => {
        if (!rEl.checked) return;
        const loadout = pdActiveTarget === "char" ? pdCharLoadout : pdMercLoadout;
        const cur = loadout[pdActiveSlot];
        if (!cur) return;
        cur.palModType = rEl.value === "dmg" ? "dmg" : "res";
        renderPaperdollAll();
      });
    });
    [
      { id: "pd-pal-res", prop: "palRes", max: 45 },
      { id: "pd-pal-ed", prop: "palEd", max: 65 },
      { id: "pd-pal-ar", prop: "palAr", max: 121 }
    ].forEach(cfg => {
      const el = document.getElementById(cfg.id);
      if (!el) return;
      const syncPal = () => {
        const loadout = pdActiveTarget === "char" ? pdCharLoadout : pdMercLoadout;
        const cur = loadout[pdActiveSlot];
        if (!cur) return;
        cur[cfg.prop] = Math.min(cfg.max, Math.max(0, Math.floor(Number(el.value || 0))));
        renderPaperdollAll();
      };
      el.addEventListener("input", syncPal);
      el.addEventListener("change", syncPal);
    });

    const unequipBtn = document.getElementById("pd-unequip-btn");
    if (unequipBtn) {
      unequipBtn.addEventListener("click", () => {
        if (pdActiveTarget === "bag") {
          pdCharBag = pdCharBag.filter(x => x.uid !== pdActiveBagUid);
          pdActiveBagUid = pdCharBag[0] ? pdCharBag[0].uid : null;
          if (!pdActiveBagUid) pdActiveTarget = "char";
          renderPaperdollAll();
          return;
        }
        const loadout = pdActiveTarget === "char" ? pdCharLoadout : pdMercLoadout;
        loadout[pdActiveSlot] = null;
        renderPaperdollAll();
      });
    }

    const maxRollsBtn = document.getElementById("pd-max-rolls-btn");
    if (maxRollsBtn) {
      maxRollsBtn.addEventListener("click", () => {
        if (pdActiveTarget === "bag") {
          const bItem = pdCharBag.find(x => x.uid === pdActiveBagUid);
          if (bItem) {
            bItem.rolls = {};
            renderPaperdollAll();
          }
          return;
        }
        const loadout = pdActiveTarget === "char" ? pdCharLoadout : pdMercLoadout;
        if (loadout[pdActiveSlot]) {
          loadout[pdActiveSlot].rolls = {};
          renderPaperdollAll();
        }
      });
    }

    const syncSkillsBtn = document.getElementById("pd-sync-skills-btn");
    if (syncSkillsBtn) {
      syncSkillsBtn.addEventListener("click", () => {
        skBonusAll = Math.min(35, Math.max(0, pdLastSyncPayload.all || 0));
        skBonusByTab = Object.assign({ 1: 0, 2: 0, 3: 0 }, pdLastSyncPayload.byTab || {});
        skBonusBySkill = Object.assign({}, pdLastSyncPayload.bySkill || {});
        skBonusFire = pdLastSyncPayload.fire || 0;
        skBonusClassId = skActiveClassId;
        const bonusInp = document.getElementById("sk-bonus-all");
        if (bonusInp) bonusInp.value = String(skBonusAll);
        renderSkillsTrees();
        renderSkillInspector();
        const orig = syncSkillsBtn.textContent;
        syncSkillsBtn.textContent = "✓ 已同步全/分系/单技能至技能树";
        setTimeout(() => { syncSkillsBtn.textContent = orig; }, 1800);
      });
    }

    const saveBuildBtn = document.getElementById("pd-save-build-btn");
    if (saveBuildBtn) {
      saveBuildBtn.addEventListener("click", () => {
        pdStateLoadedForClass = skActiveClassId;
        savePaperdollState(skActiveClassId);
        const orig = saveBuildBtn.textContent;
        saveBuildBtn.textContent = "✓ 配装已保存至本地";
        setTimeout(() => { saveBuildBtn.textContent = orig; }, 1800);
      });
    }

    const wset1Btn = document.getElementById("pd-wset-1");
    const wset2Btn = document.getElementById("pd-wset-2");
    const wsetToggleBtn = document.getElementById("pd-wset-toggle-btn");
    const swapCtaBtn = document.getElementById("pd-swap-preset-cta");
    const swapMfBtn = document.getElementById("pd-swap-preset-mf");
    if (wset1Btn) wset1Btn.addEventListener("click", () => switchPaperdollWeaponSet(1));
    if (wset2Btn) wset2Btn.addEventListener("click", () => switchPaperdollWeaponSet(2));
    if (wsetToggleBtn) wsetToggleBtn.addEventListener("click", () => togglePaperdollWeaponSet());
    if (swapCtaBtn) {
      swapCtaBtn.addEventListener("click", () => {
        applyPaperdollSwapPreset("cta");
        if (typeof showAuthToast === "function") {
          showAuthToast("✓ 已在副手组 II 装入战争召唤 CTA + 精神盾（按 W 键切手）");
        }
      });
    }
    if (swapMfBtn) {
      swapMfBtn.addEventListener("click", () => {
        applyPaperdollSwapPreset("mf");
        if (typeof showAuthToast === "function") {
          showAuthToast("✓ 已在副手组 II 装入双 24# 阿里巴巴 + 韵律盾（按 W 键切手）");
        }
      });
    }

    document.addEventListener("keydown", (e) => {
      if (!e || (e.key !== "w" && e.key !== "W") || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target;
      if (t && (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName))) return;
      if (document.querySelector("dialog[open]")) return;
      if (activeMainTab !== "skills") return;
      const mEl = document.getElementById("sk-view-mercenary");
      const bEl = document.getElementById("sk-view-breakpoints");
      const visible = (mEl && mEl.style.display !== "none") || (bEl && bEl.style.display !== "none");
      if (!visible) return;
      e.preventDefault();
      togglePaperdollWeaponSet();
    });

    const resetClassSetBtn = document.getElementById("pd-reset-class-set-btn");
    if (resetClassSetBtn) {
      resetClassSetBtn.addEventListener("click", () => {
        pdCharLoadout = getDefaultClassSetLoadout(skActiveClassId);
        pdActiveTarget = "char";
        pdActiveSlot = pdCharLoadout.weapon ? "weapon" : "head";
        pdStateLoadedForClass = skActiveClassId;
        savePaperdollState(skActiveClassId);
        renderPaperdollAll();
      });
    }

    let pdPresetMode = "caster";
    const charPresetBtn = document.getElementById("pd-char-preset-btn");
    if (charPresetBtn) {
      charPresetBtn.addEventListener("click", () => {
        if (pdPresetMode === "caster") {
          pdPresetMode = "melee";
          charPresetBtn.textContent = "切回法系毕业暗金/符文预设";
          if (skActiveClassId === "war") {
            pdCharLoadout.head = { cat: "unique", id: "Griffon's Eye", eth: false, sockets: ["jw-55-ltng"], rolls: {} };
            pdCharLoadout.amulet = { cat: "unique", id: "Mara's Kaleidoscope", eth: false, sockets: [], rolls: {} };
            pdCharLoadout.torso = { cat: "rw", id: "enigma", baseCode: "xtp", eth: false, sockets: [], rolls: {} };
            pdCharLoadout.weapon = { cat: "rw", id: "infinity", baseCode: "7wc", eth: false, sockets: [], rolls: {} };
            pdCharLoadout.offhand = { cat: "unique", id: "Ars Al'Diabolos", eth: false, sockets: ["jw-55-fire"], rolls: {} };
          } else {
            pdCharLoadout.head = { cat: "set", id: "Guillaume's Face", eth: false, sockets: ["jw-40-15"], rolls: {} };
            pdCharLoadout.amulet = { cat: "unique", id: "Highlord's Wrath", eth: false, sockets: [], rolls: {} };
            pdCharLoadout.torso = { cat: "rw", id: "fortitude", baseCode: "utp", eth: false, sockets: [], rolls: {} };
            pdCharLoadout.weapon = { cat: "rw", id: "grief", baseCode: "7cr", eth: false, sockets: [], rolls: {} };
            pdCharLoadout.offhand = { cat: "unique", id: "Stormshield", eth: false, sockets: ["r22"], rolls: {} };
            pdCharLoadout.gloves = { cat: "set", id: "Laying of Hands", eth: false, sockets: [], rolls: {} };
            pdCharLoadout.ring1 = { cat: "unique", id: "Raven Frost", eth: false, sockets: [], rolls: {} };
            pdCharLoadout.belt = { cat: "unique", id: "String of Ears", eth: false, sockets: [], rolls: {} };
            pdCharLoadout.boots = { cat: "unique", id: "Gore Rider", eth: false, sockets: [], rolls: {} };
          }
        } else {
          pdPresetMode = "caster";
          charPresetBtn.textContent = "切换毕业暗金/符文预设";
          pdCharLoadout.head = { cat: "unique", id: "Harlequin Crest (Shako)", eth: false, sockets: ["r24"], rolls: {} };
          pdCharLoadout.amulet = { cat: "unique", id: "Mara's Kaleidoscope", eth: false, sockets: [], rolls: {} };
          pdCharLoadout.torso = { cat: "rw", id: "enigma", baseCode: "xtp", eth: false, sockets: [], rolls: {} };
          pdCharLoadout.weapon = { cat: "rw", id: "heart-of-the-oak", baseCode: "fla", eth: false, sockets: [], rolls: {} };
          pdCharLoadout.offhand = { cat: "rw", id: "spirit", baseCode: "uit", eth: false, sockets: [], rolls: {} };
          pdCharLoadout.gloves = { cat: "unique", id: "Magefist", eth: false, sockets: [], rolls: {} };
          pdCharLoadout.ring1 = { cat: "unique", id: "The Stone of Jordan", eth: false, sockets: [], rolls: {} };
          pdCharLoadout.ring2 = { cat: "unique", id: "Bul-Kathos' Wedding Band", eth: false, sockets: [], rolls: {} };
          pdCharLoadout.belt = { cat: "unique", id: "Arachnid Mesh", eth: false, sockets: [], rolls: {} };
          pdCharLoadout.boots = { cat: "unique", id: "War Traveler", eth: false, sockets: [], rolls: {} };
        }
        renderPaperdollAll();
      });
    }
  }
  if (pdStateLoadedForClass !== skActiveClassId) {
    loadPaperdollStateForClass(skActiveClassId);
  }
  if (pdJustLoaded) {
    renderSkillInspector();
  }
  renderPaperdollAll();
}

function renderSkillsAll() {
  if (!skClasses.length) return;
  renderSkillsClassTabs();
  renderSkillsTrees();
  renderSkillInspector();
  renderBreakpointsAll();
  initMercenarySimulator();
}

function parseSkillsHashBuild(hashValue) {
  if (!hashValue || !hashValue.startsWith("#skills:")) return;
  const parts = hashValue.slice(8).split(":");
  const cid = parts[0];
  const code = parts[1] || "";
  const clsObj = skClasses.find(c => c.id === cid);
  if (!clsObj) return;
  skActiveClassId = cid;
  if (code) {
    const b = {};
    code.split(",").forEach(pair => {
      const kv = pair.split("-");
      const skId = Number(kv[0]);
      const pts = Math.min(20, Math.max(0, Number(kv[1]) || 0));
      const sk = clsObj.skills.find(s => s.id === skId);
      if (sk && pts > 0) b[sk.key] = pts;
    });
    skBuilds[cid] = b;
    saveSkBuilds();
  }
}

async function loadSkillsCatalog() {
  try {
    loadSkBuilds();
    const response = await fetch("/api/skills", { cache: "no-store" });
    const data = await response.json();
    if (data.ok && Array.isArray(data.classes)) {
      skClasses = data.classes;
      parseSkillsHashBuild(window.location.hash);
      renderSkillsAll();
    }
  } catch (err) {
    console.error("加载职业技能树失败", err);
  }
}

function activateSkillsSubtab(view) {
  document.querySelectorAll("#sk-view-subtabs [data-sk-view]").forEach(b => {
    b.classList.toggle("active", b.dataset.skView === view);
  });
  const pEl = document.getElementById("sk-view-planner");
  const bEl = document.getElementById("sk-view-breakpoints");
  const mEl = document.getElementById("sk-view-mercenary");
  if (pEl) pEl.style.display = view === "planner" ? "block" : "none";
  if (bEl) bEl.style.display = view === "breakpoints" ? "block" : "none";
  if (mEl) mEl.style.display = view === "mercenary" ? "block" : "none";
  if (view === "planner" && typeof scheduleDrawSkillTreeLinks === "function") {
    scheduleDrawSkillTreeLinks();
  }
  if (view === "breakpoints" && bpAutoSyncEnabled && !bpManualOverride && pdLastBreakpointSnapshot && pdLastBreakpointSnapshot.classId === skActiveClassId) {
    syncPaperdollToBreakpoints(true);
  } else {
    renderBreakpointsAll();
  }
  initMercenarySimulator();
}

function setupSkillsEvents() {
  document.querySelectorAll("#sk-view-subtabs [data-sk-view]").forEach(btn => {
    btn.addEventListener("click", () => {
      activateSkillsSubtab(btn.dataset.skView);
    });
  });

  const fcrVarSel = document.getElementById("bp-fcr-variant");
  if (fcrVarSel) fcrVarSel.addEventListener("change", (e) => { bpFcrVariantIdx = Number(e.target.value) || 0; renderBreakpointsAll(); });
  const fhrVarSel = document.getElementById("bp-fhr-variant");
  if (fhrVarSel) fhrVarSel.addEventListener("change", (e) => { bpFhrVariantIdx = Number(e.target.value) || 0; renderBreakpointsAll(); });

  const onManualBpInput = () => {
    if (!bpSyncingFromPd) {
      bpManualOverride = true;
      bpSyncedExtraEias = 0;
      bpSyncedExtraEiasLabel = "";
    }
    renderBreakpointsAll();
  };
  ["bp-fcr-input", "bp-fhr-input", "bp-ias-wsm", "bp-ias-input", "bp-ias-fana", "bp-ias-bos", "bp-fbr-input", "bp-blk-shield", "bp-blk-clvl", "bp-blk-skill"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", onManualBpInput);
      el.addEventListener("change", onManualBpInput);
    }
  });

  const bpAutoToggle = document.getElementById("bp-auto-sync-toggle");
  if (bpAutoToggle) {
    bpAutoToggle.checked = bpAutoSyncEnabled;
    bpAutoToggle.addEventListener("change", () => {
      bpAutoSyncEnabled = Boolean(bpAutoToggle.checked);
      if (bpAutoSyncEnabled) {
        bpManualOverride = false;
        if (itData && pdData) {
          renderPaperdollLiveStats();
        } else {
          initMercenarySimulator();
        }
      } else {
        bpSyncedExtraEias = 0;
        bpSyncedExtraEiasLabel = "";
        renderBreakpointsAll();
      }
    });
  }

  const bpSyncNowBtn = document.getElementById("bp-sync-now-btn");
  if (bpSyncNowBtn) {
    bpSyncNowBtn.addEventListener("click", () => {
      bpAutoSyncEnabled = true;
      bpManualOverride = false;
      if (bpAutoToggle) bpAutoToggle.checked = true;
      if (itData && pdData) {
        renderPaperdollLiveStats();
        syncPaperdollToBreakpoints(false);
      } else {
        initMercenarySimulator();
      }
      const orig = bpSyncNowBtn.textContent;
      bpSyncNowBtn.textContent = "✓ 已同步纸娃娃配装";
      setTimeout(() => { bpSyncNowBtn.textContent = orig; }, 1400);
    });
  }

  const bpBackPdBtn = document.getElementById("bp-back-pd-btn");
  if (bpBackPdBtn) {
    bpBackPdBtn.addEventListener("click", () => {
      activateSkillsSubtab("mercenary");
      const mEl = document.getElementById("sk-view-mercenary");
      if (mEl && typeof mEl.scrollIntoView === "function") {
        mEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  const pdCharStatsEl = document.getElementById("pd-char-stats");
  if (pdCharStatsEl) {
    pdCharStatsEl.addEventListener("click", (e) => {
      const jumpBtn = e.target && e.target.closest ? e.target.closest("#pd-jump-bp-btn") : null;
      if (!jumpBtn) return;
      bpAutoSyncEnabled = true;
      bpManualOverride = false;
      if (bpAutoToggle) bpAutoToggle.checked = true;
      syncPaperdollToBreakpoints(false);
      activateSkillsSubtab("breakpoints");
      const bEl = document.getElementById("sk-view-breakpoints");
      if (bEl && typeof bEl.scrollIntoView === "function") {
        bEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  const bonusInput = document.getElementById("sk-bonus-all");
  if (bonusInput) {
    bonusInput.addEventListener("input", () => {
      skBonusAll = Math.min(35, Math.max(0, Number(bonusInput.value) || 0));
      renderSkillsAll();
    });
  }

  const resetBtn = document.getElementById("sk-reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const clsObj = getActiveClassObj();
      if (!clsObj) return;
      if (getClassTotalPoints(clsObj.id) === 0) return;
      skBuilds[clsObj.id] = {};
      saveSkBuilds();
      renderSkillsAll();
    });
  }

  const shareBtn = document.getElementById("sk-share-btn");
  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      const clsObj = getActiveClassObj();
      if (!clsObj) return;
      const build = getClassBuild(clsObj.id);
      const pairs = clsObj.skills
        .filter(s => Number(build[s.key] || 0) > 0)
        .map(s => s.id + "-" + build[s.key]);
      const hash = "#skills:" + clsObj.id + (pairs.length ? (":" + pairs.join(",")) : "");
      try {
        history.replaceState(null, "", hash);
      } catch (e) {
        window.location.hash = hash;
      }
      const fullUrl = window.location.origin + window.location.pathname + hash;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullUrl).then(() => {
          const old = shareBtn.textContent;
          shareBtn.textContent = "✓ 已复制分享链接";
          setTimeout(() => { shareBtn.textContent = old; }, 1800);
        });
      }
    });
  }

  loadSkillsCatalog();
}

let _twSweeping = false;
function applyDomTraditionalSweep() {
  if (_twSweeping) return;
  _twSweeping = true;
  try {
    const roots = [
      document.querySelector("main.shell"),
      document.getElementById("rw-detail-modal"),
      document.getElementById("it-set-modal"),
      document.getElementById("pd-hover-tooltip"),
      document.getElementById("auth-dialog")
    ].filter(Boolean);
    for (const root of roots) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        const pEl = node.parentElement;
        if (!pEl) continue;
        const tag = pEl.tagName;
        if (tag === "SCRIPT" || tag === "STYLE") continue;
        if (pEl.closest && pEl.closest("[data-no-sweep],[data-i18n]")) continue;
        if (node._origZh === undefined) {
          node._origZh = node.nodeValue;
        }
        if (!node._origZh || !node._origZh.trim()) continue;
        let conv = node._origZh;
        if (currentLang === "zhTW") {
          conv = toZhTW(node._origZh);
        } else if (currentLang === "enUS") {
          conv = toEnUS(node._origZh);
        }
        if (node.nodeValue !== conv) node.nodeValue = conv;
      }
      root.querySelectorAll("input[placeholder]").forEach(inp => {
        if (inp._origPh === undefined) inp._origPh = inp.placeholder;
        let conv = inp._origPh;
        if (currentLang === "zhTW") conv = toZhTW(inp._origPh);
        else if (currentLang === "enUS") conv = toEnUS(inp._origPh);
        if (inp.placeholder !== conv) inp.placeholder = conv;
      });
    }
  } finally {
    _twSweeping = false;
  }
}

function setupLangSwitcher() {
  const container = document.getElementById("lang-switcher");
  if (!container) return;
  const syncActive = () => {
    container.querySelectorAll(".lang-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.lang === currentLang);
    });
  };
  const applyAllLang = () => {
    syncActive();
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (key) {
        const val = tUI(key);
        el.textContent = val;
        if (el.firstChild && el.firstChild.nodeType === 3) el.firstChild._origZh = val;
      }
    });
    document.title = tUI("docTitle");
    document.documentElement.lang = currentLang === "zhTW" ? "zh-TW" : currentLang === "enUS" ? "en" : "zh-CN";
    if (window.dashboardData) render(window.dashboardData);
    if (typeof renderTzCatalog === "function") renderTzCatalog();
    if (typeof renderTzHistory === "function") renderTzHistory();
    if (typeof renderRunewordsAll === "function") renderRunewordsAll();
    if (typeof renderAffixesRules === "function") renderAffixesRules();
    if (typeof renderAffixesSlotChips === "function") renderAffixesSlotChips();
    if (typeof renderAffixesCraftRecipes === "function") renderAffixesCraftRecipes();
    if (typeof renderAffixesList === "function") renderAffixesList();
    if (typeof renderItemsGrid === "function") renderItemsGrid();
    if (typeof renderSkillsAll === "function") renderSkillsAll();
    applyDomTraditionalSweep();
  };
  applyAllLang();
  let _twRaf = null;
  if (typeof MutationObserver !== "undefined") {
    const obs = new MutationObserver(() => {
      if (currentLang === "zhCN" || _twSweeping) return;
      if (_twRaf) cancelAnimationFrame(_twRaf);
      _twRaf = requestAnimationFrame(() => {
        _twRaf = null;
        applyDomTraditionalSweep();
      });
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }
  container.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      currentLang = btn.dataset.lang;
      try { localStorage.setItem("d2r-lang", currentLang); } catch (e) {}
      applyAllLang();
    });
  });
}

/* 用户账号登录（账号密码 / Google OAuth）与云端技能/装备同步 */
let authUser = null;
let authGoogleEnabled = false;
let authAdminInitialized = true;
let cloudPresets = [];
let cloudUpdatedAt = null;
let cloudSyncState = "idle";
let cloudSyncTimer = null;
let cloudLastSyncedDigest = "";
let authToastTimer = null;
window.__cloudApplyingRemote = false;

const AUTH_CLASS_LABELS = {
  ama: "亚马逊", ass: "刺客", nec: "死灵法师", bar: "野蛮人",
  pal: "圣骑士", sor: "法师", dru: "德鲁伊", war: "术士"
};

const AUTH_OAUTH_ERROR_MESSAGES = {
  google_not_configured: "服务端尚未配置 Google OAuth 密钥，请先配置 GOOGLE_CLIENT_ID 与 GOOGLE_CLIENT_SECRET",
  google_denied: "已取消 Google 账号授权登录",
  google_state_invalid: "Google 登录状态校验失败，请重试",
  google_state_expired: "Google 登录请求已过期，请重新点击登录",
  google_token_failed: "无法从 Google 获取访问令牌，请稍后重试",
  google_token_missing: "Google 未返回有效访问令牌，请稍后重试",
  google_profile_failed: "读取 Google 账号信息失败，请稍后重试",
  google_profile_invalid: "Google 账号信息无效，请稍后重试",
  google_exchange_error: "Google 登录通信异常，请稍后重试",
  account_disabled: "该账号已被管理员禁用，请联系站长"
};

function showAuthToast(msg, isError) {
  const el = document.getElementById("auth-toast");
  if (!el) return;
  el.textContent = String(msg || "");
  el.classList.toggle("err", Boolean(isError));
  el.classList.add("show");
  if (authToastTimer) clearTimeout(authToastTimer);
  authToastTimer = setTimeout(() => {
    el.classList.remove("show");
  }, isError ? 4200 : 2800);
}

function setAuthDialogError(msg) {
  const el = document.getElementById("auth-error-msg");
  if (!el) return;
  if (msg) {
    el.textContent = String(msg);
    el.classList.add("show");
  } else {
    el.textContent = "";
    el.classList.remove("show");
  }
}

function formatCloudShortTime(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("zh-CN", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
  } catch (e) {
    return "";
  }
}

function formatCloudDateTime(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("zh-CN", { hour12: false, month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  } catch (e) {
    return "";
  }
}

function createAvatarNode(user, clsImg, clsFallback) {
  if (user && user.avatarUrl && user.avatarUrl.indexOf("https://") === 0) {
    const img = document.createElement("img");
    img.className = clsImg;
    img.src = user.avatarUrl;
    img.alt = "";
    img.referrerPolicy = "no-referrer";
    return img;
  }
  const span = document.createElement("span");
  span.className = clsFallback;
  const base = (user && (user.displayName || user.username || user.email)) || "D";
  span.textContent = base.trim().slice(0, 1).toUpperCase();
  span.setAttribute("aria-hidden", "true");
  return span;
}

function renderCloudPresetsUi() {
  const sel = document.getElementById("cloud-preset-select");
  const list = document.getElementById("auth-presets-list");
  const cnt = document.getElementById("auth-presets-count");
  if (cnt) cnt.textContent = String(cloudPresets.length);

  if (sel) {
    const prevVal = sel.value;
    sel.textContent = "";
    if (!cloudPresets.length) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "暂无云端方案";
      sel.appendChild(opt);
    } else {
      cloudPresets.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        const clsLabel = AUTH_CLASS_LABELS[p.classId] || p.classId;
        opt.textContent = "[" + clsLabel + "] " + p.name;
        sel.appendChild(opt);
      });
      if (prevVal && cloudPresets.some(p => p.id === prevVal)) {
        sel.value = prevVal;
      }
    }
  }

  if (list) {
    list.textContent = "";
    if (!cloudPresets.length) {
      const empty = document.createElement("div");
      empty.style.fontSize = "12px";
      empty.style.color = "var(--muted)";
      empty.style.padding = "10px 6px";
      empty.textContent = "尚未保存命名方案。你可以在「技能模拟」页签顶部输入方案名并点击「保存当前职业方案」。";
      list.appendChild(empty);
    } else {
      cloudPresets.forEach(p => {
        const row = document.createElement("div");
        row.className = "auth-preset-item";

        const info = document.createElement("div");
        info.className = "auth-preset-info";
        const title = document.createElement("div");
        title.className = "auth-preset-title";
        title.setAttribute("data-no-sweep", "");
        title.textContent = p.name;
        const sub = document.createElement("div");
        sub.className = "auth-preset-sub";
        const clsLabel = AUTH_CLASS_LABELS[p.classId] || p.classId;
        const skPts = Object.values(p.skills || {}).reduce((s, v) => s + (Number(v) || 0), 0);
        sub.textContent = clsLabel + " · 技能 " + skPts + " 点 · " + (p.paperdoll ? "含装备" : "仅技能") + (p.updatedAt ? (" · " + formatCloudDateTime(p.updatedAt)) : "");
        info.appendChild(title);
        info.appendChild(sub);

        const acts = document.createElement("div");
        acts.style.display = "inline-flex";
        acts.style.gap = "6px";
        acts.style.flexShrink = "0";

        const loadBtn = document.createElement("button");
        loadBtn.type = "button";
        loadBtn.className = "rw-btn";
        loadBtn.textContent = "载入";
        loadBtn.addEventListener("click", () => {
          loadCloudPresetById(p.id);
          if (typeof switchMainTab === "function") switchMainTab("skills");
          const dlg = document.getElementById("auth-dialog");
          if (dlg && dlg.open) dlg.close();
        });

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "rw-btn rw-btn-danger";
        delBtn.textContent = "删除";
        delBtn.addEventListener("click", () => deleteCloudPresetById(p.id));

        acts.appendChild(loadBtn);
        acts.appendChild(delBtn);
        row.appendChild(info);
        row.appendChild(acts);
        list.appendChild(row);
      });
    }
  }
}

function renderAuthUi() {
  const openBtn = document.getElementById("auth-open-btn");
  const pillIcon = document.getElementById("auth-pill-icon");
  const pillLabel = document.getElementById("auth-pill-label");
  const syncStatusEl = document.getElementById("cloud-sync-status");
  const loginCta = document.getElementById("cloud-login-cta");
  const syncNowBtn = document.getElementById("cloud-sync-now-btn");
  const presetCtrls = document.getElementById("cloud-preset-controls");
  const guestView = document.getElementById("auth-guest-view");
  const accountView = document.getElementById("auth-account-view");
  const dlgTitle = document.getElementById("auth-dialog-title");
  const googleBtn = document.getElementById("auth-google-btn");
  const googleHint = document.getElementById("auth-google-hint");
  const adminEntryLink = document.getElementById("admin-entry-link");
  const adminConsoleLink = document.getElementById("auth-admin-console-link");
  const adminInitLink = document.getElementById("auth-admin-init-link");
  const isAdmin = Boolean(authUser && authUser.isAdmin);
  if (adminEntryLink) {
    if (isAdmin) {
      adminEntryLink.style.display = "inline-flex";
      adminEntryLink.textContent = "🛡 管理后台";
    } else if (!authAdminInitialized) {
      adminEntryLink.style.display = "inline-flex";
      adminEntryLink.textContent = "🛡 初始化后台";
    } else {
      adminEntryLink.style.display = "none";
    }
  }
  if (adminConsoleLink) adminConsoleLink.style.display = isAdmin ? "block" : "none";
  if (adminInitLink) adminInitLink.style.display = !authAdminInitialized ? "block" : "none";

  if (googleBtn && googleHint) {
    googleBtn.disabled = !authGoogleEnabled;
    if (authGoogleEnabled) {
      googleHint.style.display = "none";
      googleHint.textContent = "";
    } else {
      googleHint.style.display = "block";
      googleHint.textContent = "管理员配置 Cloudflare Worker Secret（GOOGLE_CLIENT_ID 与 GOOGLE_CLIENT_SECRET）并在 Google Cloud Console 配置回调地址 " + window.location.origin + "/api/auth/google/callback 后即可一键启用 Google 登录。";
    }
  }

  if (authUser) {
    if (openBtn) openBtn.classList.add("logged-in");
    if (pillIcon) {
      pillIcon.textContent = "";
      pillIcon.appendChild(createAvatarNode(authUser, "auth-avatar", "auth-avatar-fallback"));
    }
    if (pillLabel) pillLabel.textContent = authUser.displayName || authUser.username || authUser.email;

    const existingDot = openBtn ? openBtn.querySelector(".auth-sync-dot") : null;
    if (openBtn) {
      const dot = existingDot || document.createElement("span");
      dot.className = "auth-sync-dot" + (cloudSyncState === "syncing" ? " syncing" : (cloudSyncState === "error" ? " error" : ""));
      dot.setAttribute("aria-hidden", "true");
      if (!existingDot) openBtn.appendChild(dot);
    }

    if (syncStatusEl) {
      const tStr = formatCloudShortTime(cloudUpdatedAt);
      if (cloudSyncState === "syncing") {
        syncStatusEl.textContent = "☁ 正在同步技能与装备至云端…";
      } else if (cloudSyncState === "error") {
        syncStatusEl.textContent = "⚠ 云端同步失败，可点击右侧重试";
      } else if (tStr) {
        syncStatusEl.textContent = "☁ 已云端同步（" + (authUser.displayName || "已登录") + " · " + tStr + "）";
      } else {
        syncStatusEl.textContent = "☁ 已登录云端同步（" + (authUser.displayName || "已登录") + "）";
      }
    }
    if (loginCta) loginCta.style.display = "none";
    if (syncNowBtn) syncNowBtn.style.display = "inline-flex";
    if (presetCtrls) presetCtrls.style.display = "flex";
    if (guestView) guestView.style.display = "none";
    if (accountView) accountView.style.display = "flex";
    if (dlgTitle) dlgTitle.textContent = "账号与云端配装存档";

    const avatarWrap = document.getElementById("auth-profile-avatar-wrap");
    if (avatarWrap) {
      avatarWrap.textContent = "";
      avatarWrap.appendChild(createAvatarNode(authUser, "auth-profile-avatar", "auth-profile-avatar-fb"));
    }
    const pName = document.getElementById("auth-profile-name");
    if (pName) pName.textContent = authUser.displayName || authUser.username || authUser.email;
    const nameEditInp = document.getElementById("auth-display-name-input");
    if (nameEditInp && document.activeElement !== nameEditInp) {
      nameEditInp.value = authUser.displayName || authUser.username || "";
    }
    const pSub = document.getElementById("auth-profile-sub");
    if (pSub) {
      const idLine = [authUser.email, authUser.username].filter(Boolean).join(" · ");
      pSub.textContent = idLine || ("账号 ID: " + authUser.id.slice(0, 8));
    }
    const badges = document.getElementById("auth-provider-badges");
    if (badges) {
      badges.textContent = "";
      if (authUser.isAdmin) {
        const ab = document.createElement("span");
        ab.className = "auth-prov-badge";
        ab.style.borderColor = "rgba(103, 232, 122, 0.55)";
        ab.style.color = "#b7f5c0";
        ab.textContent = "系统管理员";
        badges.appendChild(ab);
      }
      const provs = Array.isArray(authUser.providers) ? authUser.providers : [];
      if (provs.includes("password")) {
        const b = document.createElement("span");
        b.className = "auth-prov-badge";
        b.textContent = "账号密码";
        badges.appendChild(b);
      }
      if (provs.includes("google")) {
        const b = document.createElement("span");
        b.className = "auth-prov-badge";
        b.textContent = "Google 账号";
        badges.appendChild(b);
      }
    }
    const summary = document.getElementById("auth-sync-summary");
    if (summary) {
      summary.textContent = cloudUpdatedAt
        ? ("☁ 最近云端保存时间：" + formatCloudDateTime(cloudUpdatedAt) + " · 所有 8 职业技能加点、纸娃娃配装、圣杯收集与符文之语记事会自动保存。")
        : "☁ 登录后，所有 8 职业技能加点、纸娃娃配装、圣杯收集与符文之语记事会自动同步至云端。";
    }
    const rwSyncBtn = document.getElementById("rw-cloud-sync-btn");
    if (rwSyncBtn) {
      rwSyncBtn.classList.add("active");
      rwSyncBtn.textContent = cloudSyncState === "syncing" ? "☁ 符文同步中…" : (cloudSyncState === "error" ? "⚠ 符文同步失败" : "☁ 符文已云端同步");
    }
    const grailSyncBtn = document.getElementById("grail-cloud-sync-btn");
    if (grailSyncBtn) {
      grailSyncBtn.classList.add("active");
      grailSyncBtn.textContent = cloudSyncState === "syncing" ? "☁ 圣杯同步中…" : (cloudSyncState === "error" ? "⚠ 圣杯同步失败" : "☁ 圣杯已云端同步");
    }
    const remCodes = Number(authUser.recoveryCodesRemaining || 0);
    const remBadge = document.getElementById("auth-sec-remain-badge");
    if (remBadge) remBadge.textContent = "剩余恢复码 " + remCodes + "/5";
    const noCurPw = Boolean(authUser.canSetPasswordWithoutCurrent);
    const curPwWrap = document.getElementById("auth-cur-pw-wrap");
    const curPwInp = document.getElementById("auth-cur-password");
    const googlePwHint = document.getElementById("auth-google-pw-hint");
    const newPwLbl = document.getElementById("auth-new-pw-label");
    const changePwBtn = document.getElementById("auth-change-pw-submit");
    if (curPwWrap) curPwWrap.style.display = noCurPw ? "none" : "flex";
    if (curPwInp) curPwInp.required = !noCurPw;
    if (googlePwHint) googlePwHint.style.display = noCurPw ? "block" : "none";
    if (newPwLbl) newPwLbl.textContent = authUser.hasPassword ? "新密码（至少 8 位）" : "为账号设置登录密码（至少 8 位）";
    if (changePwBtn) changePwBtn.textContent = authUser.hasPassword ? "更新登录密码" : "设置登录密码";
    renderCloudPresetsUi();
  } else {
    if (openBtn) {
      openBtn.classList.remove("logged-in");
      const oldDot = openBtn.querySelector(".auth-sync-dot");
      if (oldDot) oldDot.remove();
    }
    if (pillIcon) pillIcon.textContent = "👤";
    if (pillLabel) pillLabel.textContent = "登录 / 云端存档";
    if (syncStatusEl) syncStatusEl.textContent = "☁ 未登录（当前技能与装备仅保存在本机浏览器）";
    if (loginCta) loginCta.style.display = "inline-flex";
    if (syncNowBtn) syncNowBtn.style.display = "none";
    if (presetCtrls) presetCtrls.style.display = "none";
    if (guestView) guestView.style.display = "flex";
    if (accountView) accountView.style.display = "none";
    if (dlgTitle) dlgTitle.textContent = "账号登录 · 云端存档";
    const rwSyncBtn = document.getElementById("rw-cloud-sync-btn");
    if (rwSyncBtn) { rwSyncBtn.classList.remove("active"); rwSyncBtn.textContent = "☁ 登录云端同步"; }
    const grailSyncBtn = document.getElementById("grail-cloud-sync-btn");
    if (grailSyncBtn) { grailSyncBtn.classList.remove("active"); grailSyncBtn.textContent = "☁ 登录云端同步"; }
  }
}

function captureLocalCloudPayload() {
  loadSkBuilds();
  if (!pdSavedByClass || !Object.keys(pdSavedByClass).length) {
    loadAllSavedPaperdollBuilds();
  }
  if (pdStateLoadedForClass === skActiveClassId) {
    window.__cloudApplyingRemote = true;
    try { savePaperdollState(skActiveClassId); } finally { window.__cloudApplyingRemote = false; }
  }
  const gUniques = typeof grailUniques !== "undefined" && grailUniques instanceof Set
    ? [...grailUniques].sort()
    : [];
  const gSets = typeof grailSetPieces !== "undefined" && grailSetPieces instanceof Set
    ? [...grailSetPieces].sort()
    : [];
  const rDone = typeof rwCompleted !== "undefined" && rwCompleted instanceof Set
    ? [...rwCompleted].sort()
    : [];
  return {
    activeClassId: skActiveClassId || "war",
    skills: cloneJsonSafe(skBuilds || {}, {}),
    paperdoll: cloneJsonSafe(pdSavedByClass || {}, {}),
    grail: { uniques: gUniques, setPieces: gSets },
    runewords: rDone
  };
}

function hasAnyBuildContent(payload) {
  if (!payload) return false;
  const sk = payload.skills || {};
  for (const cid in sk) {
    const cls = sk[cid] || {};
    for (const k in cls) {
      if (Number(cls[k] || 0) > 0) return true;
    }
  }
  const pd = payload.paperdoll || {};
  if (Object.keys(pd).length > 0) return true;
  const g = payload.grail || {};
  if ((Array.isArray(g.uniques) && g.uniques.length > 0) || (Array.isArray(g.setPieces) && g.setPieces.length > 0)) {
    return true;
  }
  if (Array.isArray(payload.runewords) && payload.runewords.length > 0) return true;
  return false;
}

function applyCloudPayloadToLocal(cloudData, opts) {
  const options = opts || {};
  if (!cloudData || typeof cloudData !== "object") return false;
  const localBefore = captureLocalCloudPayload();
  const nextSkills = cloneJsonSafe(cloudData.skills || {}, {});
  const nextPaperdoll = cloneJsonSafe(cloudData.paperdoll || {}, {});
  const cloudGrail = cloudData.grail && typeof cloudData.grail === "object" ? cloudData.grail : { uniques: [], setPieces: [] };
  const nextGrailUniques = new Set(Array.isArray(cloudGrail.uniques) ? cloudGrail.uniques : []);
  const nextGrailSets = new Set(Array.isArray(cloudGrail.setPieces) ? cloudGrail.setPieces : []);
  const nextRunewords = new Set(Array.isArray(cloudData.runewords) ? cloudData.runewords : []);
  let mergedExtraLocal = false;

  if (options.mergeLocalMissing) {
    for (const cid in localBefore.skills) {
      const hasLocalPts = Object.values(localBefore.skills[cid] || {}).some(v => Number(v || 0) > 0);
      const hasCloudPts = Object.values(nextSkills[cid] || {}).some(v => Number(v || 0) > 0);
      if (hasLocalPts && !hasCloudPts) {
        nextSkills[cid] = cloneJsonSafe(localBefore.skills[cid], {});
        mergedExtraLocal = true;
      }
    }
    for (const cid in localBefore.paperdoll) {
      if (localBefore.paperdoll[cid] && !nextPaperdoll[cid]) {
        nextPaperdoll[cid] = cloneJsonSafe(localBefore.paperdoll[cid], {});
        mergedExtraLocal = true;
      }
    }
    (localBefore.grail?.uniques || []).forEach(u => {
      if (!nextGrailUniques.has(u)) { nextGrailUniques.add(u); mergedExtraLocal = true; }
    });
    (localBefore.grail?.setPieces || []).forEach(s => {
      if (!nextGrailSets.has(s)) { nextGrailSets.add(s); mergedExtraLocal = true; }
    });
    (localBefore.runewords || []).forEach(r => {
      if (!nextRunewords.has(r)) { nextRunewords.add(r); mergedExtraLocal = true; }
    });
  }

  window.__cloudApplyingRemote = true;
  try {
    skBuilds = nextSkills;
    pdSavedByClass = nextPaperdoll;
    if (typeof grailUniques !== "undefined") grailUniques = nextGrailUniques;
    if (typeof grailSetPieces !== "undefined") grailSetPieces = nextGrailSets;
    if (typeof rwCompleted !== "undefined") rwCompleted = nextRunewords;
    try {
      localStorage.setItem(SK_STORAGE_KEY, JSON.stringify(skBuilds));
      localStorage.setItem(PD_STORAGE_KEY, JSON.stringify(pdSavedByClass));
      if (typeof GRAIL_UNIQUE_KEY !== "undefined") localStorage.setItem(GRAIL_UNIQUE_KEY, JSON.stringify([...nextGrailUniques]));
      if (typeof GRAIL_SET_KEY !== "undefined") localStorage.setItem(GRAIL_SET_KEY, JSON.stringify([...nextGrailSets]));
      if (typeof RW_STORAGE_KEY !== "undefined") localStorage.setItem(RW_STORAGE_KEY, JSON.stringify([...nextRunewords]));
    } catch (e) {}

    if (options.switchClass && cloudData.activeClassId && AUTH_CLASS_LABELS[cloudData.activeClassId]) {
      skActiveClassId = cloudData.activeClassId;
    }
    if (window.location.hash && window.location.hash.startsWith("#skills:") && skClasses.length) {
      parseSkillsHashBuild(window.location.hash);
    }
    if (skClasses.length && typeof renderSkillsAll === "function") {
      renderSkillsAll();
    }
    if (pdData && typeof loadPaperdollStateForClass === "function") {
      loadPaperdollStateForClass(skActiveClassId);
      if (typeof renderPaperdollAll === "function") renderPaperdollAll();
    }
    if (typeof rwList !== "undefined" && rwList.length && typeof renderRunewordsAll === "function") {
      renderRunewordsAll();
    }
    if (typeof itData !== "undefined" && itData && typeof renderGrailSummary === "function") {
      renderGrailSummary();
      if (typeof renderItemsGrid === "function") renderItemsGrid();
    }
    cloudLastSyncedDigest = JSON.stringify({
      activeClassId: skActiveClassId || "war",
      skills: skBuilds,
      paperdoll: pdSavedByClass,
      grail: { uniques: [...nextGrailUniques].sort(), setPieces: [...nextGrailSets].sort() },
      runewords: [...nextRunewords].sort()
    });
  } finally {
    window.__cloudApplyingRemote = false;
  }
  return mergedExtraLocal;
}

async function pushCloudBuildsNow(silent, keepalive) {
  if (!authUser) return false;
  const payload = captureLocalCloudPayload();
  const digest = JSON.stringify(payload);
  if (silent && digest === cloudLastSyncedDigest) return true;

  cloudSyncState = "syncing";
  renderAuthUi();
  try {
    const res = await fetch("/api/user/builds", {
      method: "PUT",
      credentials: "same-origin",
      keepalive: Boolean(keepalive),
      headers: { "content-type": "application/json" },
      body: digest
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      if (res.status === 401) {
        authUser = null;
        cloudSyncState = "idle";
        renderAuthUi();
        return false;
      }
      throw new Error(data.error || "云端保存失败");
    }
    cloudUpdatedAt = data.updatedAt || new Date().toISOString();
    cloudLastSyncedDigest = digest;
    cloudSyncState = "synced";
    renderAuthUi();
    if (!silent) showAuthToast("已将技能、配装、圣杯与符文之语同步至云端");
    return true;
  } catch (err) {
    cloudSyncState = "error";
    renderAuthUi();
    if (!silent) showAuthToast(err.message || "云端同步失败，请稍后重试", true);
    return false;
  }
}

function scheduleCloudSync() {
  if (!authUser || window.__cloudApplyingRemote) return;
  if (cloudSyncTimer) clearTimeout(cloudSyncTimer);
  cloudSyncTimer = setTimeout(() => {
    cloudSyncTimer = null;
    pushCloudBuildsNow(true, false);
  }, 1400);
}

async function pullCloudBuildsAndSync(opts) {
  if (!authUser) return;
  const options = opts || {};
  cloudSyncState = "syncing";
  renderAuthUi();
  try {
    const res = await fetch("/api/user/builds", {
      credentials: "same-origin",
      cache: "no-store"
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      if (res.status === 401) {
        authUser = null;
        cloudSyncState = "idle";
        renderAuthUi();
        return;
      }
      throw new Error(json.error || "读取云端存档失败");
    }
    const cloud = json.data;
    cloudPresets = (cloud && Array.isArray(cloud.presets)) ? cloud.presets : [];
    cloudUpdatedAt = (cloud && cloud.updatedAt) || null;
    const localPayload = captureLocalCloudPayload();

    if (!cloud || !hasAnyBuildContent(cloud)) {
      if (hasAnyBuildContent(localPayload)) {
        await pushCloudBuildsNow(true, false);
        if (options.showToast) showAuthToast("已将本地技能与装备自动备份至云端");
      } else {
        cloudLastSyncedDigest = JSON.stringify(localPayload);
        cloudSyncState = "synced";
        renderAuthUi();
      }
      return;
    }

    const mergedExtra = applyCloudPayloadToLocal(cloud, {
      mergeLocalMissing: Boolean(options.mergeLocalMissing),
      switchClass: Boolean(options.switchClass)
    });
    if (mergedExtra) {
      await pushCloudBuildsNow(true, false);
    } else {
      cloudSyncState = "synced";
      renderAuthUi();
    }
    if (options.showToast) {
      showAuthToast("已从云端同步您的技能与装备存档");
    }
  } catch (err) {
    cloudSyncState = "error";
    renderAuthUi();
    if (options.showToast) showAuthToast(err.message || "读取云端存档失败", true);
  }
}

async function saveCurrentClassAsPreset() {
  if (!authUser) {
    openAuthDialog("login");
    return;
  }
  const nameInput = document.getElementById("cloud-preset-name");
  const rawName = nameInput ? nameInput.value.trim() : "";
  const cid = skActiveClassId || "war";
  const clsLabel = AUTH_CLASS_LABELS[cid] || cid;
  const nowTime = formatCloudShortTime(new Date().toISOString()).slice(0, 5);
  const name = rawName || (clsLabel + " 方案 " + nowTime);
  const payload = captureLocalCloudPayload();

  try {
    const res = await fetch("/api/user/presets", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        classId: cid,
        skills: payload.skills[cid] || {},
        paperdoll: payload.paperdoll[cid] || null
      })
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      throw new Error(data.error || "保存方案失败");
    }
    cloudPresets = Array.isArray(data.presets) ? data.presets : cloudPresets;
    cloudUpdatedAt = data.updatedAt || new Date().toISOString();
    if (nameInput) nameInput.value = "";
    renderAuthUi();
    if (data.preset && document.getElementById("cloud-preset-select")) {
      document.getElementById("cloud-preset-select").value = data.preset.id;
    }
    showAuthToast("已保存云端方案：" + name);
  } catch (err) {
    showAuthToast(err.message || "保存云端方案失败", true);
  }
}

function loadCloudPresetById(presetId) {
  const preset = cloudPresets.find(p => p.id === presetId);
  if (!preset) {
    showAuthToast("请先选择一个云端方案", true);
    return;
  }
  const cid = preset.classId;
  window.__cloudApplyingRemote = true;
  try {
    skActiveClassId = cid;
    skBuilds[cid] = cloneJsonSafe(preset.skills || {}, {});
    if (preset.paperdoll) {
      pdSavedByClass[cid] = cloneJsonSafe(preset.paperdoll, {});
    }
    try {
      localStorage.setItem(SK_STORAGE_KEY, JSON.stringify(skBuilds));
      localStorage.setItem(PD_STORAGE_KEY, JSON.stringify(pdSavedByClass));
    } catch (e) {}
    if (skClasses.length && typeof renderSkillsAll === "function") {
      renderSkillsAll();
    }
    if (pdData && typeof loadPaperdollStateForClass === "function") {
      loadPaperdollStateForClass(cid);
      if (typeof renderPaperdollAll === "function") renderPaperdollAll();
    }
  } finally {
    window.__cloudApplyingRemote = false;
  }
  scheduleCloudSync();
  showAuthToast("已载入云端方案：" + preset.name);
}

async function deleteCloudPresetById(presetId) {
  if (!authUser || !presetId) return;
  try {
    const res = await fetch("/api/user/presets/" + encodeURIComponent(presetId), {
      method: "DELETE",
      credentials: "same-origin"
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      throw new Error(data.error || "删除方案失败");
    }
    cloudPresets = Array.isArray(data.presets) ? data.presets : [];
    cloudUpdatedAt = data.updatedAt || cloudUpdatedAt;
    renderAuthUi();
    showAuthToast("已删除该云端方案");
  } catch (err) {
    showAuthToast(err.message || "删除方案失败", true);
  }
}

let latestRecoveryCodes = [];

function showRecoveryCodesBanner(codes, titleText) {
  const box = document.getElementById("auth-recovery-box");
  const grid = document.getElementById("auth-recovery-grid");
  const title = document.getElementById("auth-recovery-title");
  if (!box || !grid) return;
  latestRecoveryCodes = Array.isArray(codes) ? codes.slice() : [];
  if (!latestRecoveryCodes.length) {
    box.classList.remove("show");
    grid.textContent = "";
    return;
  }
  if (title && titleText) title.textContent = titleText;
  grid.textContent = "";
  latestRecoveryCodes.forEach(code => {
    const el = document.createElement("div");
    el.className = "auth-recovery-code";
    el.textContent = code;
    grid.appendChild(el);
  });
  box.classList.add("show");
}

function clearRecoveryCodesBanner() {
  latestRecoveryCodes = [];
  const box = document.getElementById("auth-recovery-box");
  const grid = document.getElementById("auth-recovery-grid");
  if (box) box.classList.remove("show");
  if (grid) grid.textContent = "";
}

function switchAuthTab(tabName) {
  const mode = tabName === "register" ? "register" : (tabName === "reset" ? "reset" : "login");
  const loginTab = document.getElementById("auth-tab-login");
  const regTab = document.getElementById("auth-tab-register");
  const loginForm = document.getElementById("auth-login-form");
  const regForm = document.getElementById("auth-register-form");
  const resetForm = document.getElementById("auth-reset-form");
  if (loginTab) {
    loginTab.classList.toggle("active", mode === "login");
    loginTab.setAttribute("aria-selected", String(mode === "login"));
  }
  if (regTab) {
    regTab.classList.toggle("active", mode === "register");
    regTab.setAttribute("aria-selected", String(mode === "register"));
  }
  if (loginForm) loginForm.style.display = mode === "login" ? "flex" : "none";
  if (regForm) regForm.style.display = mode === "register" ? "flex" : "none";
  if (resetForm) resetForm.style.display = mode === "reset" ? "flex" : "none";
  setAuthDialogError("");
  const firstId = mode === "register" ? "auth-reg-account" : (mode === "reset" ? "auth-reset-account" : "auth-login-account");
  const firstInput = document.getElementById(firstId);
  if (firstInput && document.getElementById("auth-dialog")?.open) {
    firstInput.focus();
  }
}

function openAuthDialog(defaultTab) {
  const dlg = document.getElementById("auth-dialog");
  if (!dlg) return;
  setAuthDialogError("");
  renderAuthUi();
  if (!authUser) {
    switchAuthTab(defaultTab === "register" ? "register" : "login");
  }
  if (!dlg.open) {
    dlg.showModal();
  }
}

async function fetchAuthSession(opts) {
  const options = opts || {};
  try {
    const res = await fetch("/api/auth/me", {
      credentials: "same-origin",
      cache: "no-store"
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      authGoogleEnabled = Boolean(data.googleEnabled);
      authAdminInitialized = data.adminInitialized !== false;
      authUser = data.authenticated ? data.user : null;
      renderAuthUi();
      if (authUser) {
        await pullCloudBuildsAndSync({
          mergeLocalMissing: Boolean(options.mergeLocalMissing),
          switchClass: Boolean(options.switchClass),
          showToast: Boolean(options.showToast)
        });
      }
    }
  } catch (err) {
    console.error("检查登录状态失败", err);
  }
}

function setupAuthAndCloudSync() {
  const authDlg = document.getElementById("auth-dialog");
  if (!authDlg) return;

  // Fallback for browsers without native <dialog closedby="any"> support (e.g. Safari)
  if (typeof HTMLDialogElement !== "undefined" && !("closedBy" in HTMLDialogElement.prototype)) {
    const isOutside = (e, dlg) => {
      const r = dlg.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    let pressedOutside = false;
    authDlg.addEventListener("pointerdown", (e) => {
      pressedOutside = isOutside(e, authDlg);
    });
    authDlg.addEventListener("pointerup", (e) => {
      if (pressedOutside && isOutside(e, authDlg)) authDlg.close();
      pressedOutside = false;
    });
  }
  authDlg.addEventListener("close", () => {
    authDlg.returnValue = "";
    setAuthDialogError("");
    clearRecoveryCodesBanner();
  });

  const closeBtn = document.getElementById("auth-dialog-close");
  if (closeBtn) closeBtn.addEventListener("click", () => authDlg.close());

  const openBtn = document.getElementById("auth-open-btn");
  if (openBtn) openBtn.addEventListener("click", () => openAuthDialog("login"));

  const loginCta = document.getElementById("cloud-login-cta");
  if (loginCta) loginCta.addEventListener("click", () => openAuthDialog("login"));

  const manageBtn = document.getElementById("cloud-preset-manage-btn");
  if (manageBtn) manageBtn.addEventListener("click", () => openAuthDialog("login"));

  const tabLogin = document.getElementById("auth-tab-login");
  const tabReg = document.getElementById("auth-tab-register");
  if (tabLogin) tabLogin.addEventListener("click", () => switchAuthTab("login"));
  if (tabReg) tabReg.addEventListener("click", () => switchAuthTab("register"));

  authDlg.querySelectorAll(".auth-pw-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-pw-target");
      const inp = targetId ? document.getElementById(targetId) : null;
      if (!inp) return;
      const showing = inp.type === "text";
      inp.type = showing ? "password" : "text";
      btn.textContent = showing ? "显示" : "隐藏";
      btn.setAttribute("aria-pressed", String(!showing));
    });
  });

  const loginForm = document.getElementById("auth-login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      setAuthDialogError("");
      const submitBtn = document.getElementById("auth-login-submit");
      const account = (document.getElementById("auth-login-account")?.value || "").trim();
      const password = document.getElementById("auth-login-password")?.value || "";
      if (submitBtn) submitBtn.disabled = true;
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ account, password })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setAuthDialogError(data.error || "登录失败，请检查账号密码");
          return;
        }
        authUser = data.user;
        authGoogleEnabled = Boolean(data.googleEnabled);
        loginForm.reset();
        authDlg.close();
        renderAuthUi();
        showAuthToast("登录成功，欢迎回来 " + (authUser.displayName || ""));
        await pullCloudBuildsAndSync({ mergeLocalMissing: true, switchClass: false, showToast: true });
      } catch (err) {
        setAuthDialogError("网络异常，请稍后重试");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  const regForm = document.getElementById("auth-register-form");
  if (regForm) {
    regForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      setAuthDialogError("");
      const submitBtn = document.getElementById("auth-register-submit");
      const account = (document.getElementById("auth-reg-account")?.value || "").trim();
      const displayName = (document.getElementById("auth-reg-name")?.value || "").trim();
      const password = document.getElementById("auth-reg-password")?.value || "";
      if (submitBtn) submitBtn.disabled = true;
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ account, displayName, password })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setAuthDialogError(data.error || "注册失败，请检查输入");
          return;
        }
        authUser = data.user;
        authGoogleEnabled = Boolean(data.googleEnabled);
        regForm.reset();
        renderAuthUi();
        if (Array.isArray(data.recoveryCodes) && data.recoveryCodes.length) {
          showRecoveryCodesBanner(data.recoveryCodes, "🛡 注册成功！请保存这 5 个一次性恢复码（忘记密码唯一自助凭据）");
          if (!authDlg.open) authDlg.showModal();
          showAuthToast("注册成功！请复制保存 5 个恢复码，正在同步本地数据…");
        } else {
          authDlg.close();
          showAuthToast("注册成功！正在同步本地技能与装备…");
        }
        await pullCloudBuildsAndSync({ mergeLocalMissing: true, switchClass: false, showToast: true });
      } catch (err) {
        setAuthDialogError("网络异常，请稍后重试");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  const forgotBtn = document.getElementById("auth-forgot-btn");
  if (forgotBtn) {
    forgotBtn.addEventListener("click", () => {
      const loginAcc = document.getElementById("auth-login-account");
      const resetAcc = document.getElementById("auth-reset-account");
      if (loginAcc && resetAcc && loginAcc.value.trim() && !resetAcc.value.trim()) {
        resetAcc.value = loginAcc.value.trim();
      }
      switchAuthTab("reset");
    });
  }
  const backLoginBtn = document.getElementById("auth-back-login-btn");
  if (backLoginBtn) backLoginBtn.addEventListener("click", () => switchAuthTab("login"));

  const copyRecBtn = document.getElementById("auth-copy-recovery-btn");
  if (copyRecBtn) {
    copyRecBtn.addEventListener("click", async () => {
      if (!latestRecoveryCodes.length) return;
      const text = "D2R 庇护之地账号一次性恢复码：\n" + latestRecoveryCodes.join("\n");
      try {
        await navigator.clipboard.writeText(text);
        showAuthToast("已复制全部 " + latestRecoveryCodes.length + " 个恢复码");
      } catch (e) {
        showAuthToast("复制失败，请手动选中上方恢复码复制", true);
      }
    });
  }
  const dismissRecBtn = document.getElementById("auth-dismiss-recovery-btn");
  if (dismissRecBtn) dismissRecBtn.addEventListener("click", clearRecoveryCodesBanner);

  const resetForm = document.getElementById("auth-reset-form");
  if (resetForm) {
    resetForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      setAuthDialogError("");
      const submitBtn = document.getElementById("auth-reset-submit");
      const account = (document.getElementById("auth-reset-account")?.value || "").trim();
      const code = (document.getElementById("auth-reset-code")?.value || "").trim();
      const newPassword = document.getElementById("auth-reset-password")?.value || "";
      if (submitBtn) submitBtn.disabled = true;
      try {
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ account, code, newPassword })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setAuthDialogError(data.error || "重设密码失败，请核对账号与恢复码");
          return;
        }
        authUser = data.user;
        authGoogleEnabled = Boolean(data.googleEnabled);
        resetForm.reset();
        renderAuthUi();
        if (Array.isArray(data.recoveryCodes) && data.recoveryCodes.length) {
          const titleText = data.usedAdminCode
            ? "🛡 应急重设成功！已自动为您签发全新 5 个恢复码，请妥善保存"
            : "🛡 密码已重设！原恢复码已用尽，系统已自动补发全新 5 个恢复码";
          showRecoveryCodesBanner(data.recoveryCodes, titleText);
          showAuthToast("密码已重设并自动登录，请保存新补发的恢复码");
        } else {
          authDlg.close();
          showAuthToast("密码重设成功！已自动登录（剩余恢复码 " + (authUser.recoveryCodesRemaining || 0) + "/5）");
        }
        await pullCloudBuildsAndSync({ mergeLocalMissing: true, switchClass: false, showToast: false });
      } catch (err) {
        setAuthDialogError("网络异常，请稍后重试");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  const profileEditForm = document.getElementById("auth-profile-edit-form");
  if (profileEditForm) {
    profileEditForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      setAuthDialogError("");
      const nameInp = document.getElementById("auth-display-name-input");
      const saveBtn = document.getElementById("auth-display-name-save-btn");
      const displayName = (nameInp ? nameInp.value : "").trim();
      if (!displayName) {
        setAuthDialogError("昵称不能为空");
        return;
      }
      if (saveBtn) saveBtn.disabled = true;
      try {
        const res = await fetch("/api/user/profile", {
          method: "PATCH",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ displayName })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setAuthDialogError((data && data.error) || "修改昵称失败");
          return;
        }
        authUser = data.user;
        renderAuthUi();
        showAuthToast("✓ 昵称已更新为「" + (authUser.displayName || displayName) + "」");
      } catch (err) {
        setAuthDialogError("网络异常，修改昵称失败");
      } finally {
        if (saveBtn) saveBtn.disabled = false;
      }
    });
  }

  const changePwForm = document.getElementById("auth-change-pw-form");
  if (changePwForm) {
    changePwForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      setAuthDialogError("");
      const submitBtn = document.getElementById("auth-change-pw-submit");
      const currentPassword = document.getElementById("auth-cur-password")?.value || "";
      const newPassword = document.getElementById("auth-new-password")?.value || "";
      if (submitBtn) submitBtn.disabled = true;
      try {
        const res = await fetch("/api/auth/change-password", {
          method: "POST",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ currentPassword, newPassword })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setAuthDialogError(data.error || "更新密码失败");
          return;
        }
        authUser = data.user;
        changePwForm.reset();
        renderAuthUi();
        if (Array.isArray(data.recoveryCodes) && data.recoveryCodes.length) {
          showRecoveryCodesBanner(data.recoveryCodes, "🛡 已设置登录密码，并自动生成 5 个一次性恢复码");
        }
        showAuthToast("登录密码已更新（其他旧设备会话已自动失效）");
      } catch (err) {
        setAuthDialogError("网络异常，请稍后重试");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  const regenBtn = document.getElementById("auth-regen-codes-btn");
  if (regenBtn) {
    regenBtn.addEventListener("click", async () => {
      setAuthDialogError("");
      regenBtn.disabled = true;
      try {
        const res = await fetch("/api/auth/recovery-codes/regenerate", {
          method: "POST",
          credentials: "same-origin"
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setAuthDialogError(data.error || "生成新恢复码失败");
          return;
        }
        authUser = data.user;
        renderAuthUi();
        showRecoveryCodesBanner(data.recoveryCodes, "🛡 已生成全新 5 个恢复码（原有旧恢复码已全部作废）");
        showAuthToast("已重新生成 5 个新恢复码，请复制保存");
      } catch (err) {
        setAuthDialogError("网络异常，请稍后重试");
      } finally {
        regenBtn.disabled = false;
      }
    });
  }

  const googleBtn = document.getElementById("auth-google-btn");
  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      if (!authGoogleEnabled) return;
      captureLocalCloudPayload();
      const ret = window.location.pathname + (window.location.hash || "");
      window.location.href = "/api/auth/google/start?returnTo=" + encodeURIComponent(ret || "/");
    });
  }

  const syncNowBtn = document.getElementById("cloud-sync-now-btn");
  if (syncNowBtn) syncNowBtn.addEventListener("click", () => pushCloudBuildsNow(false, false));

  const rwCloudSyncBtn = document.getElementById("rw-cloud-sync-btn");
  if (rwCloudSyncBtn) {
    rwCloudSyncBtn.addEventListener("click", () => {
      if (authUser) pushCloudBuildsNow(false, false);
      else openAuthDialog("login");
    });
  }

  const grailCloudSyncBtn = document.getElementById("grail-cloud-sync-btn");
  if (grailCloudSyncBtn) {
    grailCloudSyncBtn.addEventListener("click", () => {
      if (authUser) pushCloudBuildsNow(false, false);
      else openAuthDialog("login");
    });
  }

  const uploadNowBtn = document.getElementById("auth-upload-now-btn");
  if (uploadNowBtn) uploadNowBtn.addEventListener("click", () => pushCloudBuildsNow(false, false));

  const downloadNowBtn = document.getElementById("auth-download-now-btn");
  if (downloadNowBtn) {
    downloadNowBtn.addEventListener("click", () =>
      pullCloudBuildsAndSync({ mergeLocalMissing: false, switchClass: true, showToast: true })
    );
  }

  const savePresetBtn = document.getElementById("cloud-preset-save-btn");
  if (savePresetBtn) savePresetBtn.addEventListener("click", saveCurrentClassAsPreset);

  const loadPresetBtn = document.getElementById("cloud-preset-load-btn");
  if (loadPresetBtn) {
    loadPresetBtn.addEventListener("click", () => {
      const sel = document.getElementById("cloud-preset-select");
      if (sel && sel.value) loadCloudPresetById(sel.value);
      else showAuthToast("请先选择一个云端方案", true);
    });
  }

  const logoutBtn = document.getElementById("auth-logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      if (cloudSyncTimer) {
        clearTimeout(cloudSyncTimer);
        cloudSyncTimer = null;
      }
      try {
        await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
      } catch (e) {}
      authUser = null;
      cloudPresets = [];
      cloudUpdatedAt = null;
      cloudSyncState = "idle";
      cloudLastSyncedDigest = "";
      clearRecoveryCodesBanner();
      renderAuthUi();
      authDlg.close();
      showAuthToast("已退出登录（本地数据仍保存在本机）");
    });
  }

  window.addEventListener("pagehide", () => {
    if (authUser && cloudSyncTimer) {
      clearTimeout(cloudSyncTimer);
      cloudSyncTimer = null;
      pushCloudBuildsNow(true, true);
    }
  });

  let fromGoogleOk = false;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") === "google_ok") {
      fromGoogleOk = true;
      params.delete("auth");
      const clean = window.location.pathname + (params.toString() ? ("?" + params.toString()) : "") + window.location.hash;
      history.replaceState(null, "", clean);
    } else if (params.get("auth_error")) {
      const code = params.get("auth_error");
      const msg = AUTH_OAUTH_ERROR_MESSAGES[code] || "Google 登录失败，请重试";
      params.delete("auth_error");
      const clean = window.location.pathname + (params.toString() ? ("?" + params.toString()) : "") + window.location.hash;
      history.replaceState(null, "", clean);
      showAuthToast(msg, true);
    }
  } catch (e) {}

  let hydrated = null;
  try {
    const initEl = document.getElementById("d2r-initial-auth");
    if (initEl && initEl.textContent) {
      hydrated = JSON.parse(initEl.textContent);
    }
  } catch (e) {}

  let pendingImportBuildId = "";
  try {
    const importParams = new URLSearchParams(window.location.search);
    const rawImportId = (importParams.get("import_build") || "").trim().toLowerCase();
    if (/^[a-z0-9]{6,16}$/.test(rawImportId)) {
      pendingImportBuildId = rawImportId;
    }
  } catch (e) {}

  const runPendingImport = () => {
    if (pendingImportBuildId && typeof importSharedBuildById === "function") {
      const idToImport = pendingImportBuildId;
      pendingImportBuildId = "";
      importSharedBuildById(idToImport);
    }
  };

  if (hydrated && typeof hydrated === "object") {
    authGoogleEnabled = Boolean(hydrated.googleEnabled);
    authAdminInitialized = hydrated.adminInitialized !== false;
    authUser = hydrated.authenticated ? hydrated.user : null;
    renderAuthUi();
    if (authUser) {
      pullCloudBuildsAndSync({
        mergeLocalMissing: fromGoogleOk,
        switchClass: false,
        showToast: fromGoogleOk
      }).finally(runPendingImport);
    } else {
      runPendingImport();
    }
  } else {
    fetchAuthSession({
      mergeLocalMissing: fromGoogleOk,
      switchClass: false,
      showToast: fromGoogleOk
    }).finally(runPendingImport);
  }
}

function captureCurrentClassSharePayload() {
  const cid = skActiveClassId || "war";
  if (pdStateLoadedForClass === cid && typeof savePaperdollState === "function") {
    savePaperdollState(cid);
  }
  const clsObj = typeof getActiveClassObj === "function" ? getActiveClassObj() : null;
  const className = clsObj ? clsObj.nameZh : (AUTH_CLASS_LABELS[cid] || cid);
  const skills = cloneJsonSafe(getClassBuild(cid), {});
  const pdEntry = pdSavedByClass && pdSavedByClass[cid] ? cloneJsonSafe(pdSavedByClass[cid], null) : null;
  const summary = pdLastShareSummary && pdLastShareSummary.classId === cid ? cloneJsonSafe(pdLastShareSummary, null) : null;
  const skillPts = Object.values(skills).reduce((acc, v) => acc + (Number(v) || 0), 0);
  const gearCount = pdEntry && pdEntry.charLoadout
    ? Object.values(pdEntry.charLoadout).filter(Boolean).length
    : 0;
  const bagCount = pdEntry && Array.isArray(pdEntry.charBag) ? pdEntry.charBag.length : 0;
  const lvl = (pdEntry && pdEntry.charLvl) || 90;
  const weaponShort = summary && summary.weaponName && summary.weaponName !== "徒手"
    ? (" · " + summary.weaponName.replace(/\s*\([^)]*\)$/, ""))
    : "";
  const defaultTitle = (className + " Lv." + lvl + weaponShort + " 完整 BD").slice(0, 60);
  return { cid, className, lvl, skills, pdEntry, summary, skillPts, gearCount, bagCount, defaultTitle };
}

function openBdShareDialog() {
  const dlg = document.getElementById("bd-share-dialog");
  if (!dlg) return;
  const info = captureCurrentClassSharePayload();
  const previewEl = document.getElementById("bd-share-preview-box");
  const nameInput = document.getElementById("bd-share-name-input");
  const notesInput = document.getElementById("bd-share-notes-input");
  const errEl = document.getElementById("bd-share-error");
  const resBox = document.getElementById("bd-share-result-box");
  if (previewEl) {
    previewEl.textContent = "打包内容：" + info.className + " Lv." + info.lvl +
      " · 技能点 " + info.skillPts + "/110" +
      " · 角色装备 " + info.gearCount + "/10" +
      " · 背包咒符 " + info.bagCount + " 件" +
      (info.pdEntry && info.pdEntry.mercEnabled === false ? " · 未携带佣兵" : " · 含佣兵配装");
  }
  if (nameInput) nameInput.value = info.defaultTitle;
  if (notesInput) notesInput.value = "";
  if (errEl) { errEl.textContent = ""; errEl.classList.remove("show"); }
  if (resBox) resBox.style.display = "none";
  if (!dlg.open) dlg.showModal();
}

async function importSharedBuildById(shareId) {
  if (!shareId) return false;
  try {
    const res = await fetch("/api/builds/share/" + encodeURIComponent(shareId), { cache: "no-store" });
    const data = await res.json();
    if (!res.ok || !data.ok || !data.build) {
      showAuthToast((data && data.error) || "未找到该分享 BD 或链接已失效", true);
      return false;
    }
    const build = data.build;
    const cid = build.classId;
    if (!cid) return false;

    skBuilds[cid] = cloneJsonSafe(build.skills || {}, {});
    saveSkBuilds();
    if (build.paperdoll && typeof build.paperdoll === "object") {
      pdSavedByClass[cid] = cloneJsonSafe(build.paperdoll, null);
      try {
        localStorage.setItem(PD_STORAGE_KEY, JSON.stringify(pdSavedByClass));
        localStorage.setItem("d2r-builds-local-updated-at", new Date().toISOString());
      } catch (e) {}
    }

    skActiveClassId = cid;
    bpManualOverride = false;
    pdStateLoadedForClass = null;
    if (typeof switchMainTab === "function") switchMainTab("skills");
    if (typeof activateSkillsSubtab === "function") {
      activateSkillsSubtab(build.paperdoll ? "mercenary" : "planner");
    }
    if (typeof loadPaperdollStateForClass === "function") loadPaperdollStateForClass(cid);
    if (typeof renderSkillsAll === "function") renderSkillsAll();
    if (typeof scheduleCloudSync === "function") scheduleCloudSync();

    try {
      const cleanParams = new URLSearchParams(window.location.search);
      cleanParams.delete("import_build");
      const cleanUrl = window.location.pathname + (cleanParams.toString() ? ("?" + cleanParams.toString()) : "") + "#skills";
      history.replaceState(null, "", cleanUrl);
    } catch (e) {}

    showAuthToast("✓ 已导入分享 BD「" + (build.title || cid) + "」（技能 + 纸娃娃 + 佣兵）");
    return true;
  } catch (err) {
    showAuthToast("导入分享 BD 失败，请稍后重试", true);
    return false;
  }
}

function setupSharedBuildUi() {
  const dlg = document.getElementById("bd-share-dialog");
  const closeBtn = document.getElementById("bd-share-close-btn");
  const form = document.getElementById("bd-share-form");
  const copyBtn = document.getElementById("bd-share-copy-btn");

  ["pd-share-bd-btn", "sk-share-full-bd-btn"].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", openBdShareDialog);
  });

  if (closeBtn && dlg) {
    closeBtn.addEventListener("click", () => dlg.close());
  }
  if (dlg) {
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg) dlg.close();
    });
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const errEl = document.getElementById("bd-share-error");
      const createBtn = document.getElementById("bd-share-create-btn");
      const resBox = document.getElementById("bd-share-result-box");
      const urlOut = document.getElementById("bd-share-url-output");
      const openLink = document.getElementById("bd-share-open-link");
      if (errEl) { errEl.textContent = ""; errEl.classList.remove("show"); }
      if (createBtn) createBtn.disabled = true;

      try {
        const info = captureCurrentClassSharePayload();
        const title = (document.getElementById("bd-share-name-input")?.value || "").trim() || info.defaultTitle;
        const notes = (document.getElementById("bd-share-notes-input")?.value || "").trim();
        const res = await fetch("/api/builds/share", {
          method: "POST",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            classId: info.cid,
            title,
            notes,
            skills: info.skills,
            paperdoll: info.pdEntry,
            summary: info.summary
          })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          if (errEl) {
            errEl.textContent = (data && data.error) || "生成分享短链失败，请重试";
            errEl.classList.add("show");
          }
          return;
        }
        const shareUrl = data.shareUrl || (window.location.origin + data.sharePath);
        if (urlOut) urlOut.value = shareUrl;
        if (openLink) openLink.href = shareUrl;
        if (resBox) resBox.style.display = "flex";
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(shareUrl).catch(() => {});
        }
        showAuthToast("✓ 已生成公开分享短链并复制到剪贴板");
      } catch (err) {
        if (errEl) {
          errEl.textContent = "网络异常，生成分享短链失败";
          errEl.classList.add("show");
        }
      } finally {
        if (createBtn) createBtn.disabled = false;
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const urlOut = document.getElementById("bd-share-url-output");
      const val = urlOut ? urlOut.value : "";
      if (!val) return;
      if (urlOut) urlOut.select();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(val).then(() => {
          const old = copyBtn.textContent;
          copyBtn.textContent = "✓ 已复制";
          setTimeout(() => { copyBtn.textContent = old; }, 1400);
        }).catch(() => {});
      }
    });
  }
}

/* 个人恐怖地带 (TZ) 与地表暗黑 (DClone) 桌面通知 / 声音提醒引擎 */
const ALERT_STORAGE_KEY = "d2r_personal_alerts_v1";
let alertPrefs = {
  desktop: false,
  sound: true,
  tzTierS: false,
  tzNotifyNext: true,
  tzZones: [],
  dcMinProgress: 5,
  dcDlc: "all",
  dcRegion: "all",
  dcMode: "all"
};
let alertBaselineSeeded = false;
const alertSeenKeys = new Set();
let alertLogEntries = [];

function loadAlertPrefs() {
  try {
    const raw = localStorage.getItem(ALERT_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return;
    alertPrefs = {
      desktop: Boolean(parsed.desktop),
      sound: parsed.sound !== undefined ? Boolean(parsed.sound) : true,
      tzTierS: Boolean(parsed.tzTierS),
      tzNotifyNext: parsed.tzNotifyNext !== undefined ? Boolean(parsed.tzNotifyNext) : true,
      tzZones: Array.isArray(parsed.tzZones) ? parsed.tzZones.filter(z => typeof z === "string" && z).slice(0, 50) : [],
      dcMinProgress: [0, 4, 5, 6].includes(Number(parsed.dcMinProgress)) ? Number(parsed.dcMinProgress) : 5,
      dcDlc: ["all", "rotw", "lod"].includes(parsed.dcDlc) ? parsed.dcDlc : "all",
      dcRegion: ["all", "Asia", "Americas", "Europe"].includes(parsed.dcRegion) ? parsed.dcRegion : "all",
      dcMode: ["all", "ladder-sc", "nl-sc", "ladder-hc", "nl-hc"].includes(parsed.dcMode) ? parsed.dcMode : "all"
    };
  } catch (e) {}
}

function saveAlertPrefs() {
  try {
    localStorage.setItem(ALERT_STORAGE_KEY, JSON.stringify(alertPrefs));
  } catch (e) {}
  renderAlertUi();
}

function isTzZoneStarred(zoneEn) {
  return Boolean(zoneEn && alertPrefs.tzZones.includes(zoneEn));
}

function toggleFavoriteTzZone(zoneEn) {
  if (!zoneEn) return;
  const idx = alertPrefs.tzZones.indexOf(zoneEn);
  if (idx >= 0) alertPrefs.tzZones.splice(idx, 1);
  else alertPrefs.tzZones.push(zoneEn);
  saveAlertPrefs();
  renderAlertTzZonesGrid();
  renderTzCatalog();
}

function playAlertChime(kind) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return false;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const notes = kind === "dclone"
      ? [{ f: 220, t: 0, d: 0.42, g: 0.14 }, { f: 587.33, t: 0.08, d: 0.3, g: 0.11 }, { f: 880, t: 0.24, d: 0.45, g: 0.12 }]
      : [{ f: 440, t: 0, d: 0.28, g: 0.1 }, { f: 659.25, t: 0.12, d: 0.3, g: 0.1 }, { f: 880, t: 0.24, d: 0.42, g: 0.1 }];
    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = kind === "dclone" ? "triangle" : "sine";
      osc.frequency.setValueAtTime(n.f, now + n.t);
      gain.gain.setValueAtTime(0.0001, now + n.t);
      gain.gain.exponentialRampToValueAtTime(n.g, now + n.t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.t + n.d);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + n.t);
      osc.stop(now + n.t + n.d + 0.02);
    });
    setTimeout(() => { try { ctx.close(); } catch (e) {} }, 1200);
    return true;
  } catch (e) {
    return false;
  }
}

function renderAlertHistoryLog() {
  const box = document.getElementById("alert-history-list");
  if (!box) return;
  if (!alertLogEntries.length) {
    box.innerHTML = '<div style="color:var(--muted)">暂无触发记录（开启通道后，轮换命中将自动记录在此）</div>';
    return;
  }
  box.innerHTML = alertLogEntries.map(item =>
    '<div class="alert-log-item" style="border-left-color:' + (item.kind === "dclone" ? "#ef6b5b" : "#e284db") + '">' +
      '<div style="display:flex;justify-content:space-between;gap:8px"><strong>' + escapeHtml(item.title) + '</strong><span style="color:var(--muted);font-size:10.5px">' + escapeHtml(item.time) + '</span></div>' +
      '<div style="color:#b8afa3">' + escapeHtml(item.body) + '</div>' +
    '</div>'
  ).join("");
}

function firePersonalAlert(kind, title, body, tabTarget) {
  const nowStr = new Date().toLocaleTimeString("zh-CN", { hour12: false });
  alertLogEntries.unshift({ kind, title, body, time: nowStr });
  if (alertLogEntries.length > 10) alertLogEntries.length = 10;
  renderAlertHistoryLog();

  if (alertPrefs.sound) {
    playAlertChime(kind);
  }
  if (alertPrefs.desktop && typeof Notification !== "undefined" && Notification.permission === "granted") {
    try {
      const n = new Notification(title, {
        body,
        icon: kind === "dclone" ? "/images/items/misc/charm/annihilus.webp" : "/images/ui/joingame_desecratedindicator.webp",
        tag: "d2r-" + kind + "-" + Date.now()
      });
      n.onclick = () => {
        try { window.focus(); } catch (e) {}
        if (tabTarget && typeof switchMainTab === "function") switchMainTab(tabTarget);
      };
    } catch (e) {}
  }
  if (typeof showAuthToast === "function") {
    showAuthToast(title + " · " + body);
  }
}

function isAlertTzHit(zoneEn, details) {
  if (!zoneEn) return false;
  if (alertPrefs.tzZones.includes(zoneEn)) return true;
  if (alertPrefs.tzTierS) {
    const rating = (details && details.rating) || ((tzCatalog.find(z => z.zone === zoneEn) || {}).rating) || "";
    if (rating === "S" || rating === "S-A") return true;
  }
  return false;
}

function isAlertDcloneHit(server) {
  if (!server || alertPrefs.dcMinProgress <= 0) return false;
  if (Number(server.progress || 0) < alertPrefs.dcMinProgress) return false;
  if (alertPrefs.dcDlc === "rotw" && !server.rotw) return false;
  if (alertPrefs.dcDlc === "lod" && server.rotw) return false;
  const baseReg = String(server.region || "").replace(/Rotw$/i, "");
  if (alertPrefs.dcRegion !== "all" && baseReg !== alertPrefs.dcRegion) return false;
  const modeCode = (server.ladder ? "ladder-" : "nl-") + (server.hardcore ? "hc" : "sc");
  if (alertPrefs.dcMode !== "all" && modeCode !== alertPrefs.dcMode) return false;
  return true;
}

function evaluatePersonalAlerts(data, opts) {
  const triggered = [];
  if (!data) return triggered;
  const forceCheck = Boolean(opts && opts.forceCheck);
  const isChannelOn = Boolean(alertPrefs.sound || alertPrefs.desktop);

  const currentKeys = [];
  const candidates = [];

  const tz = data.terrorZone;
  if (tz && tz.current) {
    const curKey = "tz:cur:" + tz.current;
    currentKeys.push(curKey);
    if (isAlertTzHit(tz.current, tz.currentDetails)) {
      candidates.push({
        key: curKey,
        kind: "tz",
        tab: "terror",
        title: "🌀 恐怖地带命中：" + (tz.currentZh || tz.current),
        body: "当前已轮换至你关注的恐怖地带（" + tz.current + "）"
      });
    }
  }
  if (tz && tz.next) {
    const nextKey = "tz:next:" + tz.next;
    currentKeys.push(nextKey);
    if (alertPrefs.tzNotifyNext && isAlertTzHit(tz.next, tz.nextDetails)) {
      candidates.push({
        key: nextKey,
        kind: "tz",
        tab: "terror",
        title: "⏳ 下阶段恐怖地带预告：" + (tz.nextZh || tz.next),
        body: "即将切换为你关注的恐怖地带（" + tz.next + "），可提前做好刷图准备"
      });
    }
  }

  const servers = Array.isArray(data.servers) ? data.servers : [];
  for (const s of servers) {
    const prog = Number(s.progress || 0);
    const sKey = "dc:" + (s.rotw ? "rotw" : "lod") + ":" + s.region + ":" + (s.ladder ? "L" : "NL") + ":" + (s.hardcore ? "HC" : "SC") + ":" + prog + ":" + (s.lastWalk || 0);
    if (prog >= 4) currentKeys.push(sKey);
    if (isAlertDcloneHit(s)) {
      const baseReg = String(s.region || "").replace(/Rotw$/i, "");
      const regZh = regionNames[baseReg] || baseReg;
      const verZh = s.rotw ? "术士君临" : "毁灭之王";
      const modeZh = (s.ladder ? "天梯" : "非天梯") + " " + (s.hardcore ? "HC" : "SC");
      candidates.push({
        key: sKey,
        kind: "dclone",
        tab: "dclone",
        title: "🔥 地表暗黑 " + prog + "/6：" + verZh + " · " + regZh + " " + modeZh,
        body: progressNames[prog] || ("当前进度已达 " + prog + "/6，请尽快进入对应地狱房间等待入侵")
      });
    }
  }

  if (!alertBaselineSeeded && !forceCheck) {
    currentKeys.forEach(k => alertSeenKeys.add(k));
    alertBaselineSeeded = true;
    return triggered;
  }

  for (const c of candidates) {
    if (alertSeenKeys.has(c.key)) continue;
    alertSeenKeys.add(c.key);
    if (isChannelOn) {
      firePersonalAlert(c.kind, c.title, c.body, c.tab);
      triggered.push(c);
    }
  }
  if (alertSeenKeys.size > 120) {
    const recent = [...alertSeenKeys].slice(-80);
    alertSeenKeys.clear();
    recent.forEach(k => alertSeenKeys.add(k));
  }
  return triggered;
}

function renderAlertTzZonesGrid() {
  const grid = document.getElementById("alert-tz-zones-grid");
  const cntEl = document.getElementById("alert-tz-count");
  if (cntEl) cntEl.textContent = String(alertPrefs.tzZones.length);
  if (!grid) return;
  if (!tzCatalog || !tzCatalog.length) {
    grid.innerHTML = '<div style="font-size:12px;color:var(--muted)">正在加载 37 个恐怖地带…</div>';
    return;
  }
  const sorted = [...tzCatalog].sort((a, b) => {
    const score = (r) => (r === "S" ? 0 : r === "S-A" ? 1 : r === "A" ? 2 : r === "B" ? 3 : 4);
    return (score(a.rating) - score(b.rating)) || ((a.act || 1) - (b.act || 1));
  });
  grid.innerHTML = sorted.map(z => {
    const active = alertPrefs.tzZones.includes(z.zone);
    const tierTag = z.rating ? (" [" + z.rating + "]") : "";
    return '<button type="button" class="alert-zone-chip' + (active ? ' active' : '') + '" data-alert-zone="' + escapeHtml(z.zone) + '">' +
      (active ? '★ ' : '') + escapeHtml(z.zoneZh + tierTag) +
    '</button>';
  }).join("");
  grid.querySelectorAll("[data-alert-zone]").forEach(btn => {
    btn.addEventListener("click", () => toggleFavoriteTzZone(btn.dataset.alertZone));
  });
}

function renderAlertUi() {
  const dot = document.getElementById("alert-active-dot");
  const btnLabel = document.getElementById("alert-btn-label");
  const permEl = document.getElementById("alert-perm-status");
  const reqBtn = document.getElementById("alert-request-perm-btn");

  const hasRules = alertPrefs.tzTierS || alertPrefs.tzZones.length > 0 || alertPrefs.dcMinProgress > 0;
  const hasChannel = alertPrefs.sound || alertPrefs.desktop;
  const isActive = hasRules && hasChannel;
  if (dot) dot.style.display = isActive ? "inline-block" : "none";
  if (btnLabel) {
    btnLabel.textContent = isActive
      ? ("提醒开启" + (alertPrefs.tzZones.length ? ("(" + alertPrefs.tzZones.length + ")") : ""))
      : "个人提醒";
  }

  if (permEl) {
    if (typeof Notification === "undefined") {
      permEl.textContent = "当前浏览器不支持桌面通知";
      permEl.style.color = "#ff9b8f";
      if (reqBtn) reqBtn.style.display = "none";
    } else if (Notification.permission === "granted") {
      permEl.textContent = "✓ 桌面通知已授权";
      permEl.style.color = "#67e87a";
      if (reqBtn) reqBtn.style.display = "none";
    } else if (Notification.permission === "denied") {
      permEl.textContent = "✗ 已被浏览器拦截（请在地址栏左侧解锁）";
      permEl.style.color = "#ff9b8f";
      if (reqBtn) reqBtn.style.display = "none";
    } else {
      permEl.textContent = "待授权桌面通知";
      permEl.style.color = "#ffd573";
      if (reqBtn) reqBtn.style.display = "inline-flex";
    }
  }

  const setChk = (id, v) => { const el = document.getElementById(id); if (el) el.checked = Boolean(v); };
  const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = String(v); };
  setChk("alert-desktop-toggle", alertPrefs.desktop);
  setChk("alert-sound-toggle", alertPrefs.sound);
  setChk("alert-tz-tier-s", alertPrefs.tzTierS);
  setChk("alert-tz-next-toggle", alertPrefs.tzNotifyNext);
  setVal("alert-dc-min-progress", alertPrefs.dcMinProgress);
  setVal("alert-dc-dlc", alertPrefs.dcDlc);
  setVal("alert-dc-region", alertPrefs.dcRegion);
  setVal("alert-dc-mode", alertPrefs.dcMode);
  const cntEl = document.getElementById("alert-tz-count");
  if (cntEl) cntEl.textContent = String(alertPrefs.tzZones.length);
}

function openAlertDialog() {
  const dlg = document.getElementById("alert-dialog");
  if (!dlg) return;
  renderAlertUi();
  renderAlertTzZonesGrid();
  renderAlertHistoryLog();
  if (!dlg.open) dlg.showModal();
}

function setupPersonalAlerts() {
  loadAlertPrefs();
  renderAlertUi();

  const dlg = document.getElementById("alert-dialog");
  ["alert-open-btn", "tz-alert-shortcut-btn"].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", openAlertDialog);
  });
  const closeBtn = document.getElementById("alert-close-btn");
  if (closeBtn && dlg) closeBtn.addEventListener("click", () => dlg.close());
  if (dlg) {
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg) dlg.close();
    });
  }

  const reqPerm = async () => {
    if (typeof Notification === "undefined" || typeof Notification.requestPermission !== "function") {
      renderAlertUi();
      return "denied";
    }
    try {
      const perm = await Notification.requestPermission();
      if (perm === "granted") {
        alertPrefs.desktop = true;
        saveAlertPrefs();
        showAuthToast("✓ 已开启浏览器桌面通知权限");
      } else {
        alertPrefs.desktop = false;
        saveAlertPrefs();
        showAuthToast("浏览器未授予桌面通知权限，已保留网页提示音", true);
      }
      return perm;
    } catch (e) {
      return "denied";
    }
  };

  const reqBtn = document.getElementById("alert-request-perm-btn");
  if (reqBtn) reqBtn.addEventListener("click", reqPerm);

  const deskToggle = document.getElementById("alert-desktop-toggle");
  if (deskToggle) {
    deskToggle.addEventListener("change", async () => {
      if (deskToggle.checked) {
        if (typeof Notification !== "undefined" && Notification.permission === "default") {
          await reqPerm();
          return;
        }
        if (typeof Notification === "undefined" || Notification.permission !== "granted") {
          deskToggle.checked = false;
          alertPrefs.desktop = false;
          saveAlertPrefs();
          showAuthToast("请先在浏览器设置中允许本站桌面通知", true);
          return;
        }
      }
      alertPrefs.desktop = Boolean(deskToggle.checked);
      saveAlertPrefs();
    });
  }

  const bindChk = (id, key) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", () => { alertPrefs[key] = Boolean(el.checked); saveAlertPrefs(); });
  };
  bindChk("alert-sound-toggle", "sound");
  bindChk("alert-tz-tier-s", "tzTierS");
  bindChk("alert-tz-next-toggle", "tzNotifyNext");

  const bindSel = (id, key, isNum) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", () => { alertPrefs[key] = isNum ? Number(el.value || 0) : el.value; saveAlertPrefs(); });
  };
  bindSel("alert-dc-min-progress", "dcMinProgress", true);
  bindSel("alert-dc-dlc", "dcDlc", false);
  bindSel("alert-dc-region", "dcRegion", false);
  bindSel("alert-dc-mode", "dcMode", false);

  const pickSBtn = document.getElementById("alert-tz-pick-s-btn");
  if (pickSBtn) {
    pickSBtn.addEventListener("click", () => {
      const sZones = (tzCatalog || []).filter(z => z.rating === "S" || z.rating === "S-A").map(z => z.zone);
      const merged = new Set([...alertPrefs.tzZones, ...sZones]);
      alertPrefs.tzZones = [...merged];
      saveAlertPrefs();
      renderAlertTzZonesGrid();
      renderTzCatalog();
    });
  }
  const clearTzBtn = document.getElementById("alert-tz-clear-btn");
  if (clearTzBtn) {
    clearTzBtn.addEventListener("click", () => {
      alertPrefs.tzZones = [];
      saveAlertPrefs();
      renderAlertTzZonesGrid();
      renderTzCatalog();
    });
  }

  const testBtn = document.getElementById("alert-test-btn");
  if (testBtn) {
    testBtn.addEventListener("click", () => {
      firePersonalAlert("dclone", "🔔 庇护之地测试提醒", "声音与桌面提醒通道工作正常（恐怖地带 / 地表暗黑就绪）", "terror");
    });
  }
}

/* 客户端离线 .d2s 角色存档解析与导入逻辑 */
let d2sLastMappedResult = null;

function getD2sCatalogBundle() {
  const setPieces = [];
  if (itData && Array.isArray(itData.sets)) {
    itData.sets.forEach(s => {
      (s.pieces || []).forEach(p => setPieces.push(p));
    });
  }
  return {
    classes: skClasses || [],
    charBaseStats: (pdData && pdData.charBaseStats) || {},
    baseRules: (pdData && pdData.baseRules) || {},
    rwList: rwList || [],
    uniqueItems: (itData && itData.uniqueItems) || [],
    setPieces
  };
}

function applyMappedD2sImport(mapped, opts) {
  if (!mapped || !mapped.classId) return false;
  const cid = mapped.classId;
  const doSkills = opts ? Boolean(opts.skills) : true;
  const doStats = opts ? Boolean(opts.stats) : true;
  const doGear = opts ? Boolean(opts.gear) : false;

  if (doSkills) {
    skBuilds[cid] = cloneJsonSafe(mapped.skills || {}, {});
    saveSkBuilds();
  }

  if (doStats || doGear) {
    loadAllSavedPaperdollBuilds();
    const existing = (pdSavedByClass && pdSavedByClass[cid])
      ? cloneJsonSafe(pdSavedByClass[cid], {})
      : {
          charLoadout: getDefaultClassSetLoadout(cid),
          swapLoadout: { weapon: null, offhand: null },
          activeWeaponSet: 1,
          mercLoadout: getDefaultMercLoadout(),
          charBag: [],
          bagNextUid: 1,
          statAlloc: { str: 0, dex: 0, vit: 0, enr: 0 },
          charLvl: 90,
          mercVariant: "a2-might",
          mercLvl: 90,
          mercEnabled: true,
          mercAuraOn: true,
          ctaOn: true,
          charAura: "none",
          demonAura: "none",
          demonMlvl: 96,
          warlockHex: "none",
          enemyDebuff: "none",
          selectedSkillKey: "",
          maxMode: false
        };

    if (doStats) {
      existing.charLvl = mapped.level || 90;
      existing.statAlloc = cloneJsonSafe(mapped.statAlloc, { str: 0, dex: 0, vit: 0, enr: 0 });
      existing.mercEnabled = Boolean(mapped.mercEnabled);
      existing.mercVariant = mapped.mercVariant || "a2-might";
      existing.mercLvl = mapped.mercLvl || existing.charLvl;
      existing.activeWeaponSet = mapped.activeWeaponSet === 2 ? 2 : 1;
    }
    if (doGear) {
      existing.charLoadout = cloneJsonSafe(mapped.charLoadout, existing.charLoadout);
      existing.swapLoadout = cloneJsonSafe(mapped.swapLoadout, { weapon: null, offhand: null });
      existing.charBag = cloneJsonSafe(mapped.charBag || [], []);
      existing.bagNextUid = mapped.bagNextUid || (existing.charBag.length + 1);
      if (mapped.mappedMercCount > 0) {
        existing.mercLoadout = cloneJsonSafe(mapped.mercLoadout, existing.mercLoadout);
      }
    }
    pdSavedByClass[cid] = existing;
    try {
      localStorage.setItem(PD_STORAGE_KEY, JSON.stringify(pdSavedByClass));
      localStorage.setItem("d2r-builds-local-updated-at", new Date().toISOString());
    } catch (e) {}
  }

  skActiveClassId = cid;
  bpManualOverride = false;
  pdStateLoadedForClass = null;
  if (typeof loadPaperdollStateForClass === "function") loadPaperdollStateForClass(cid);
  if (typeof renderSkillsAll === "function") renderSkillsAll();
  if (typeof scheduleCloudSync === "function") scheduleCloudSync();
  return true;
}

function setupD2sImportUi() {
  const dlg = document.getElementById("d2s-import-dialog");
  const closeBtn = document.getElementById("d2s-import-close-btn");
  const pickBtn = document.getElementById("d2s-pick-file-btn");
  const fileInp = document.getElementById("d2s-file-input");
  const dropzone = document.getElementById("d2s-dropzone");
  const errEl = document.getElementById("d2s-import-error");
  const previewPanel = document.getElementById("d2s-preview-panel");
  const previewSum = document.getElementById("d2s-preview-summary");
  const optSkills = document.getElementById("d2s-opt-skills");
  const optStats = document.getElementById("d2s-opt-stats");
  const optGear = document.getElementById("d2s-opt-gear");
  const confirmBtn = document.getElementById("d2s-confirm-import-btn");

  const openDlg = () => {
    if (!dlg) return;
    d2sLastMappedResult = null;
    if (errEl) { errEl.textContent = ""; errEl.classList.remove("show"); }
    if (previewPanel) previewPanel.style.display = "none";
    if (fileInp) fileInp.value = "";
    if (!dlg.open) dlg.showModal();
  };

  ["sk-import-d2s-btn", "pd-import-d2s-btn"].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", openDlg);
  });
  if (closeBtn && dlg) closeBtn.addEventListener("click", () => dlg.close());
  if (dlg) {
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  }
  if (pickBtn && fileInp) {
    pickBtn.addEventListener("click", () => fileInp.click());
  }

  const handleD2sFile = async (file) => {
    if (!file) return;
    if (errEl) { errEl.textContent = ""; errEl.classList.remove("show"); }
    if (previewPanel) previewPanel.style.display = "none";
    if (file.size > 2 * 1024 * 1024) {
      if (errEl) { errEl.textContent = "文件过大（超过 2 MB），请确认是有效的 .d2s 单机存档"; errEl.classList.add("show"); }
      return;
    }
    try {
      if (!pdData && typeof initMercenarySimulator === "function") {
        await initMercenarySimulator();
      }
      const mod = await import("/assets/d2s-parser.js");
      const buf = await file.arrayBuffer();
      const parsed = mod.parseD2sBuffer(buf, file.name);
      const mapped = mod.mapParsedD2sToPaperdoll(parsed, getD2sCatalogBundle());
      d2sLastMappedResult = mapped;

      const clsObj = (skClasses || []).find(c => c.id === mapped.classId);
      const clsLabel = clsObj ? clsObj.nameZh : (AUTH_CLASS_LABELS[mapped.classId] || mapped.classId);
      const topSkills = Object.entries(mapped.skills || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([k, v]) => {
          const sObj = clsObj && clsObj.skills ? clsObj.skills.find(x => x.key === k) : null;
          return (sObj ? sObj.nameZh : k) + " " + v;
        });
      const statusTags = [];
      if (mapped.status && mapped.status.hardcore) statusTags.push("专家 HC");
      if (mapped.status && mapped.status.ladder) statusTags.push("天梯");
      statusTags.push("存档 v" + mapped.version);

      const hasGear = mapped.mappedGearCount > 0 || mapped.charBag.length > 0;
      if (optSkills) optSkills.checked = true;
      if (optStats) optStats.checked = true;
      if (optGear) {
        optGear.checked = hasGear;
        optGear.disabled = !hasGear;
      }

      if (previewSum) {
        previewSum.innerHTML =
          '<div class="alert-section-title"><span>🧙 ' + escapeHtml(mapped.name) + ' · ' + escapeHtml(clsLabel) + ' Lv.' + mapped.level + '</span><span style="font-size:11px;color:#9ad8ff">' + escapeHtml(statusTags.join(" · ")) + '</span></div>' +
          '<div style="font-size:12px;color:#dfd6ca">裸属性已分配：力量 +' + mapped.statAlloc.str + ' · 敏捷 +' + mapped.statAlloc.dex + ' · 体力 +' + mapped.statAlloc.vit + ' · 精力 +' + mapped.statAlloc.enr + '</div>' +
          '<div style="font-size:12px;color:#8af49f">技能树硬点：共 ' + mapped.totalSkillPts + '/110 点' + (topSkills.length ? ('（' + escapeHtml(topSkills.join(" · ")) + '）') : '（未分配技能点）') + '</div>' +
          '<div style="font-size:12px;color:#b8afa3">佣兵：' + (mapped.mercEnabled ? escapeHtml(mapped.mercVariant) : '未携带') + ' · 装备解析：' + (hasGear ? ('已匹配 ' + mapped.mappedGearCount + ' 件装备 + ' + mapped.charBag.length + ' 件背包物') : '未覆盖装备（D2R 压缩位流将保留当前纸娃娃配装）') + '</div>';
      }
      if (previewPanel) previewPanel.style.display = "flex";
    } catch (err) {
      if (errEl) {
        errEl.textContent = (err && err.message) || "解析 .d2s 存档失败，请确认文件格式正确";
        errEl.classList.add("show");
      }
    }
  };

  if (fileInp) {
    fileInp.addEventListener("change", () => {
      const f = fileInp.files && fileInp.files[0];
      if (f) handleD2sFile(f);
    });
  }
  if (dropzone) {
    dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.style.borderColor = "#ffd573"; });
    dropzone.addEventListener("dragleave", () => { dropzone.style.borderColor = ""; });
    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.style.borderColor = "";
      const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) handleD2sFile(f);
    });
  }
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      if (!d2sLastMappedResult) return;
      applyMappedD2sImport(d2sLastMappedResult, {
        skills: optSkills ? optSkills.checked : true,
        stats: optStats ? optStats.checked : true,
        gear: optGear ? (optGear.checked && !optGear.disabled) : false
      });
      if (dlg) dlg.close();
      if (typeof showAuthToast === "function") {
        showAuthToast("✓ 已导入单机存档「" + d2sLastMappedResult.name + "」（Lv." + d2sLastMappedResult.level + "）");
      }
    });
  }
}

setupLangSwitcher();
loadSystemConfig();
setupTzDirectoryEvents();
setupRunewordsEvents();
setupAffixesEvents();
setupItemsEvents();
setupSkillsEvents();
initMainTabs();
setupSharedBuildUi();
setupPersonalAlerts();
setupD2sImportUi();
setupAuthAndCloudSync();
load();
