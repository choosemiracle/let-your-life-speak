import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  CircleUserRound,
  Clapperboard,
  Compass,
  Filter,
  Heart,
  Menu,
  MessageCircle,
  Play,
  Search,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { movieCatalog } from './movieCatalog';
import { doubanMovieInfo } from './doubanMovieInfo';

const themeTranslations = {
  Abandonment: '被遗弃感',
  Acceptance: '接纳',
  Addiction: '成瘾',
  Anger: '愤怒',
  Assignment: '任务',
  Attentiveness: '专注聆听',
  'Authority Problem': '权威议题',
  Awakening: '觉醒',
  'Awareness of Dreaming': '梦境觉察',
  Collaboration: '合作',
  Communication: '沟通',
  Community: '团体',
  Compromise: '妥协',
  'Dare to Take Step': '敢于迈步',
  Death: '死亡',
  Deception: '欺骗',
  Defenselessness: '无防御',
  Denial: '否认',
  Depression: '抑郁',
  Devotion: '奉献',
  Discernment: '辨识',
  'Discover True Identity': '发现真实身份',
  'Divine providence': '神圣安排',
  Doubt: '怀疑',
  'Dropping the Mask': '放下面具',
  'Face of innocence': '纯真面容',
  Faith: '信心',
  'False Perception': '错误知见',
  'False/True Empathy': '真假同理',
  Fame: '名声',
  Family: '家庭',
  Fear: '恐惧',
  'Fear of Sacrifice': '害怕牺牲',
  'Fear of commitment': '承诺恐惧',
  Following: '跟随',
  Forgiveness: '宽恕',
  'Free Will': '自由意志',
  Grievances: '怨恨',
  Guidance: '指引',
  Guilt: '愧疚',
  Happiness: '幸福',
  'Heal Past Associations': '疗愈过去联结',
  Healing: '疗愈',
  'Holy relationship': '神圣关系',
  Injustice: '不公',
  Innocence: '纯真',
  Inspiration: '灵感',
  Intellectualization: '理智化',
  Jealousy: '嫉妒',
  Joy: '喜悦',
  Judgment: '评判',
  'Letting Go of Control': '放下控制',
  'Letting go of form': '放下形式',
  'Letting go of specialness': '放下特殊性',
  Loneliness: '孤独',
  Love: '爱',
  'MIND TRAINING': '心智训练',
  Magic: '魔法思维',
  Marriage: '婚姻',
  'Mighty companions': '同行伙伴',
  'Mind Training': '心智训练',
  Miracles: '奇迹',
  Money: '金钱',
  'No Competition': '无竞争',
  'No Compromise': '不妥协',
  'No People Pleasing': '不取悦',
  'No Private Thoughts': '无私密念头',
  'No Ripping of Symbols': '不撕裂象征',
  'Opening up to love': '向爱敞开',
  'Pain and Pleasure': '痛苦与快乐',
  'People Pleasing': '取悦他人',
  Perfectionism: '完美主义',
  'Power of Thought': '念头的力量',
  Prayer: '祈祷',
  'Present Moment': '当下',
  Pride: '骄傲',
  Projection: '投射',
  Protectionism: '自我保护',
  'Psychic Abilities': '通灵能力',
  Purpose: '目的',
  'Quantum Physics': '量子物理',
  'Real Sight': '真实看见',
  Repression: '压抑',
  Sarcasm: '讽刺',
  Secrets: '秘密',
  Sex: '性',
  Shame: '羞耻',
  Sickness: '疾病',
  'Signs and Symbols': '征兆与象征',
  'Split mind': '分裂心智',
  Stress: '压力',
  Superiority: '优越感',
  'Teacher/Student': '师生关系',
  Temptation: '诱惑',
  'The Script is Written': '剧本已写好',
  Time: '时间',
  'Transcending Roles': '超越角色',
  Trust: '信任',
  'Unhealed Healer': '未疗愈的疗愈者',
  Unworthiness: '不配得感',
  'Vibrational connection': '振动连接',
  Victimization: '受害者心态',
  Vigilance: '警醒',
  'Wake-Up Call': '唤醒信号',
  Willingness: '愿心',
  Workaholism: '工作狂',
  Worthiness: '配得感',
};

const translateTheme = (theme) => themeTranslations[theme] || theme;

const doubanInfoById = new Map(doubanMovieInfo.map((movie) => [movie.id, movie]));

const normalizeMovieTitle = (title) =>
  title.replace(/^(.+),\s*(The|A|An)$/i, '$2 $1');

const knownChineseTitles = {
  '12 Date of Christmas': '十二个圣诞约会',
  '2:22': '2:22',
  '20 Feet from Stardom': '离巨星二十英尺',
  '42': '42号传奇',
  '50 First Dates': '初恋50次',
  'A Beautiful Mind': '美丽心灵',
  'A Little Bit of Heaven': '天堂一角',
  'A Man Called Ove': '一个叫欧维的男人决定去死',
  'About a Boy': '单亲插班生',
  'About Time': '时空恋旅人',
  'After Earth': '重返地球',
  'AI Artificial Intelligence': '人工智能',
  'American Beauty': '美国丽人',
  'Anger Management': '愤怒管理',
  'Apollo 13': '阿波罗13号',
  Arrival: '降临',
  'As Good as It Gets': '尽善尽美',
  'August Rush': '八月迷情',
  Awakenings: '无语问苍天',
  'Batman Begins': '蝙蝠侠：侠影之谜',
  Bedazzled: '神鬼愿望',
  'Before I Fall': '忽然七日',
  'Being There': '富贵逼人来',
  'Black Swan': '黑天鹅',
  'Blind Side, The': '弱点',
  Bliss: '极乐',
  Braveheart: '勇敢的心',
  'Bruce Almighty': '冒牌天神',
  'Cast Away': '荒岛余生',
  Chocolat: '浓情巧克力',
  Click: '人生遥控器',
  'Cloud Atlas': '云图',
  Cocoon: '魔茧',
  Contact: '超时空接触',
  'Dark Knight, The': '蝙蝠侠：黑暗骑士',
  'Dead Poets Society': '死亡诗社',
  'Defending Your Life': '为自己辩护',
  'Eat Pray Love': '美食、祈祷和恋爱',
  'Eternal Sunshine of the Spotless Mind': '暖暖内含光',
  'Field of Dreams': '梦幻之地',
  'Forrest Gump': '阿甘正传',
  'Free Guy': '失控玩家',
  Gandhi: '甘地传',
  'Good Will Hunting': '心灵捕手',
  Gravity: '地心引力',
  'Groundhog Day': '土拨鼠之日',
  Her: '她',
  'I Am Sam': '我是山姆',
  Inception: '盗梦空间',
  'Inside Out': '头脑特工队',
  Interstellar: '星际穿越',
  'It’s a Wonderful Life': '生活多美好',
  'Life of Pi': '少年派的奇幻漂流',
  'Little Miss Sunshine': '阳光小美女',
  'Meet Joe Black': '第六感生死缘',
  'Peaceful Warrior': '深夜加油站遇见苏格拉底',
  Pleasantville: '欢乐谷',
  'Saving Mr. Banks': '大梦想家',
  'Shawshank Redemption, The': '肖申克的救赎',
  'Silver Linings Playbook': '乌云背后的幸福线',
  'Slumdog Millionaire': '贫民窟的百万富翁',
  Soul: '心灵奇旅',
  'The Adjustment Bureau': '命运规划局',
  'The Green Mile': '绿里奇迹',
  'The Matrix': '黑客帝国',
  'The Truman Show': '楚门的世界',
  'The Way': '朝圣之路',
  'What Dreams May Come': '美梦成真',
  Yesterday: '昨日奇迹',
};

const getChineseTitle = (movie) => {
  const doubanInfo = doubanInfoById.get(movie.id);
  if (doubanInfo?.titleCn) {
    return doubanInfo.titleCn;
  }

  const normalizedTitle = normalizeMovieTitle(movie.title);
  if (knownChineseTitles[movie.title] || knownChineseTitles[normalizedTitle]) {
    return knownChineseTitles[movie.title] || knownChineseTitles[normalizedTitle];
  }

  return normalizedTitle;
};

const getMovieIntro = (movie) => {
  const themes = movie.themes.slice(0, 3).map(translateTheme).join('、') || '内在探索';
  const doubanInfo = doubanInfoById.get(movie.id);
  const doubanLead = doubanInfo?.doubanTitle
    ? `豆瓣条目显示为《${doubanInfo.doubanTitle}》。`
    : '';
  return `${doubanLead}这部影片可作为观察「${themes}」的入口。观影时不急着评判角色，而是留意哪些情节让你紧张、羡慕、抗拒或放松。`;
};

const getMovieFocus = (movie) => {
  const themes = movie.themes.slice(0, 5).map(translateTheme);
  return [
    `观察角色如何把内在信念投射到外在处境，并留意自己是否有相同模式。`,
    `当影片触及${themes[0] || '某个主题'}时，暂停一下，感受身体最先出现的反应。`,
    themes[1]
      ? `把「${themes[1]}」当作今天的观影关键词，记录它在剧情中如何反复出现。`
      : '记录一个最触动你的画面，并写下它让你想起的生活处境。',
  ];
};

const getPracticeSteps = (movie) => {
  const primary = movie.themes[0] ? translateTheme(movie.themes[0]) : '当下经验';
  const secondary = movie.themes[1] ? translateTheme(movie.themes[1]) : '关系中的反应';

  return [
    `观影前写下：我最近在哪件事上最需要看见「${primary}」？`,
    `观影中标记三个身体有反应的片段，只记录感受，不分析对错。`,
    `观影后完成一句话：我在角色身上看见了自己关于「${secondary}」的信念。`,
    `选择一个小行动，在 24 小时内练习少一点防御、多一点诚实。`,
  ];
};

const enrichMovie = (movie) => ({
  ...movie,
  douban: doubanInfoById.get(movie.id) || null,
  titleCn: getChineseTitle(movie),
  intro: getMovieIntro(movie),
  focus: getMovieFocus(movie),
  practices: getPracticeSteps(movie),
  hasVerifiedChineseTitle: Boolean(
    doubanInfoById.get(movie.id)?.titleCn ||
      knownChineseTitles[movie.title] ||
      knownChineseTitles[normalizeMovieTitle(movie.title)],
  ),
});

const buildThemeGroups = (movies) => {
  const counts = new Map();
  movies.forEach((movie) => {
    movie.themes.forEach((theme) => counts.set(theme, (counts.get(theme) || 0) + 1));
  });

  const popular = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 36)
    .map(([name, count]) => ({ name, count }));

  return [
    {
      title: '热门主题',
      items: popular,
    },
    {
      title: '卡点',
      items: ['Projection', 'Judgment', 'People Pleasing', 'Guilt', 'Fear', 'Denial', 'Letting Go of Control', 'Victimization']
        .filter((name) => counts.has(name))
        .map((name) => ({ name, count: counts.get(name) || 0 })),
    },
    {
      title: '心灵果实',
      items: ['Forgiveness', 'Healing', 'Awakening', 'Joy', 'Love', 'Trust', 'Miracles', 'Defenselessness']
        .filter((name) => counts.has(name))
        .map((name) => ({ name, count: counts.get(name) || 0 })),
    },
    {
      title: '关系',
      items: ['Family', 'Marriage', 'Holy relationship', 'Communication', 'Community', 'Mighty companions', 'Fear of commitment', 'Opening up to love']
        .filter((name) => counts.has(name))
        .map((name) => ({ name, count: counts.get(name) || 0 })),
    },
  ];
};

const featuredMovies = [
  {
    title: '心灵奇旅',
    year: '2020',
    type: '动画 / 音乐',
    level: '入门',
    themes: ['临在', '真实身份', '执着', '喜悦'],
    image:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80',
    guide:
      '当“人生目标”变成新的枷锁，灵魂会错过当下正在发生的简单喜悦。',
    question: '如果不需要证明这一生有用，我今天会怎样更真实地活着？',
  },
  {
    title: '楚门的世界',
    year: '1998',
    type: '剧情 / 寓言',
    level: '进阶',
    themes: ['觉醒', '控制', '恐惧', '真实身份'],
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    guide:
      '熟悉的世界不一定真实。看见剧本，是离开自动反应的第一步。',
    question: '我最害怕走出哪个“被安排好的安全区”？',
  },
  {
    title: '降临',
    year: '2016',
    type: '科幻 / 关系',
    level: '深潜',
    themes: ['沟通', '时间', '臣服', '悲伤'],
    image:
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80',
    guide:
      '当线性时间松动，爱不再被结果定义，选择也不再只是防御。',
    question: '若我已经知道会失去，我还愿意全然去爱吗？',
  },
  {
    title: '海街日记',
    year: '2015',
    type: '家庭 / 日常',
    level: '入门',
    themes: ['家庭', '宽恕', '疗愈', '羞耻'],
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
    guide:
      '疗愈常常不是激烈的和解，而是在一餐一饭里重新允许彼此存在。',
    question: '我是否仍在替上一代没有说出口的痛苦背负责任？',
  },
  {
    title: '美丽心灵',
    year: '2001',
    type: '传记 / 剧情',
    level: '进阶',
    themes: ['投射', '信任', '关系', '无防御'],
    image:
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=80',
    guide:
      '头脑会制造看似完整的故事。温柔地辨认它，而不是与它作战。',
    question: '我正在把哪个内在恐惧投射到他人身上？',
  },
  {
    title: '少年派的奇幻漂流',
    year: '2012',
    type: '冒险 / 灵性',
    level: '深潜',
    themes: ['信任', '分离感', '奇迹', '恐惧'],
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    guide:
      '信仰不是解释苦难，而是在未知中选择不关闭心。',
    question: '我讲述自己的故事时，选择了恐惧版本还是恩典版本？',
  },
  {
    title: '她',
    year: '2013',
    type: '爱情 / 科幻',
    level: '进阶',
    themes: ['亲密关系', '孤独', '放下特殊性', '沟通'],
    image:
      'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80',
    guide:
      '关系中的对象会变化，但真正被邀请看见的是自己的需要与依恋。',
    question: '我爱的是眼前这个人，还是他满足我想象中的空缺？',
  },
  {
    title: '千与千寻',
    year: '2001',
    type: '动画 / 成长',
    level: '入门',
    themes: ['勇气', '真实身份', '执着', '家庭'],
    image:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80',
    guide:
      '名字象征记忆与身份。被世界催眠时，记得自己是谁。',
    question: '我为了适应环境，遗忘了自己的哪一个名字？',
  },
];

const spotlights = [
  '本周焦点：用《楚门的世界》观看“安全感”的幻象',
  '周六线上观影会：电影、静默、分享与心智练习',
  '新手路线：三部电影练习从情绪到信念的回看',
];

const PAGE_SIZE = 24;

function App() {
  const [activeTheme, setActiveTheme] = useState('全部');
  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const themeGroups = useMemo(() => buildThemeGroups(movieCatalog), []);
  const enrichedMovies = useMemo(() => movieCatalog.map(enrichMovie), []);

  const filteredMovies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return enrichedMovies.filter((movie) => {
      const matchesTheme =
        activeTheme === '全部' || movie.themes.includes(activeTheme);
      const matchesQuery =
        !normalizedQuery ||
        [
          movie.title,
          movie.titleCn,
          movie.intro,
          ...movie.themes,
          ...movie.themes.map((theme) => translateTheme(theme)),
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesTheme && matchesQuery;
    });
  }, [activeTheme, enrichedMovies, query]);

  const totalPages = Math.max(1, Math.ceil(filteredMovies.length / PAGE_SIZE));
  const pagedMovies = filteredMovies.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const selectedThemeLabel =
    activeTheme === '全部' ? '全部' : `${translateTheme(activeTheme)} / ${activeTheme}`;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTheme, query]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#1f2723]">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/20 bg-[#17231f]/88 text-white backdrop-blur-xl">
        <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded bg-[#d6a647] text-[#17231f]">
              <Clapperboard size={22} />
            </span>
            <span>
              <span className="block font-serif text-lg font-semibold tracking-wide">
                光影内观
              </span>
              <span className="block text-[11px] tracking-[0.24em] text-white/55">
                MOVIES FOR AWAKENING
              </span>
            </span>
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium text-white/75 md:flex">
            <a className="hover:text-white" href="#movies">
              电影库
            </a>
            <a className="hover:text-white" href="#dive-in">
              深入练习
            </a>
            <a className="hover:text-white" href="#spotlight">
              焦点
            </a>
            <a className="hover:text-white" href="#join">
              加入
            </a>
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center rounded border border-white/20 md:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="打开菜单"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
        {mobileOpen && (
          <div className="border-t border-white/10 bg-[#17231f] px-5 py-4 md:hidden">
            {['电影库', '深入练习', '焦点', '加入'].map((item, index) => (
              <a
                key={item}
                className="block py-3 text-sm text-white/80"
                href={['#movies', '#dive-in', '#spotlight', '#join'][index]}
                onClick={() => setMobileOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        )}
      </header>

      <main id="top">
        <section className="relative min-h-[92vh] overflow-hidden">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2200&q=80"
            alt="电影院座椅与银幕"
          />
          <div className="absolute inset-0 bg-[#101916]/70" />
          <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-32 sm:px-8 lg:pb-24">
            <div className="max-w-4xl">
              <div className="mb-7 inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.24em] text-[#f0c86a] backdrop-blur">
                中文电影觉察资料库
              </div>
              <h1 className="font-serif text-5xl font-semibold leading-[1.08] text-white sm:text-6xl lg:text-7xl">
                借由观影，
                <span className="block">看见内在正在发生什么</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/78">
                这里为华人观众整理电影、主题与观影提问。你可以按情绪、关系、卡点或心灵果实筛选影片，把每一次观影变成一次温柔而诚实的自我回看。
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#movies"
                  className="inline-flex items-center justify-center gap-3 bg-[#d6a647] px-6 py-4 text-sm font-bold text-[#17231f] transition hover:bg-[#efc35d]"
                >
                  浏览电影库 <ArrowRight size={18} />
                </a>
                <a
                  href="#dive-in"
                  className="inline-flex items-center justify-center gap-3 border border-white/30 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  如何观影练习 <Play size={18} />
                </a>
              </div>
            </div>

            <div className="mt-14 grid max-w-5xl grid-cols-1 border border-white/15 bg-[#17231f]/72 backdrop-blur md:grid-cols-3">
              {spotlights.map((item, index) => (
                <a
                  key={item}
                  href="#spotlight"
                  className="group flex min-h-24 items-center justify-between gap-5 border-b border-white/12 px-5 py-5 text-sm text-white/76 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
                >
                  <span>
                    <span className="mb-2 block text-[11px] font-bold tracking-[0.18em] text-[#d6a647]">
                      0{index + 1}
                    </span>
                    {item}
                  </span>
                  <ChevronDown className="-rotate-90 opacity-40 group-hover:opacity-100" size={18} />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="movies" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[300px_minmax(0,1fr)]">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="border border-[#d9cbbb] bg-[#fffaf2] p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="font-serif text-2xl font-semibold">主题</h2>
                  <Filter className="text-[#9b6d22]" size={20} />
                </div>

                <button
                  className={`mb-5 flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold ${
                    activeTheme === '全部'
                      ? 'bg-[#17231f] text-white'
                      : 'bg-[#efe4d6] text-[#1f2723]'
                  }`}
                  onClick={() => setActiveTheme('全部')}
                >
                  全部影片 <span>{movieCatalog.length}</span>
                </button>

                <div className="space-y-6">
                  {themeGroups.map((group) => (
                    <div key={group.title}>
                      <h3 className="mb-3 text-xs font-bold tracking-[0.2em] text-[#8a7a66]">
                        {group.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map((theme) => (
                          <button
                            key={`${group.title}-${theme.name}`}
                            onClick={() => setActiveTheme(theme.name)}
                            className={`px-3 py-2 text-xs transition ${
                              activeTheme === theme.name
                                ? 'bg-[#d6a647] font-bold text-[#17231f]'
                                : 'bg-white text-[#5f5548] hover:bg-[#efe4d6]'
                            }`}
                          >
                            {translateTheme(theme.name)}
                            <span className="ml-1 text-[10px] opacity-60">
                              {theme.count}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <div>
              <div className="mb-8 flex flex-col gap-5 border-b border-[#d9cbbb] pb-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="mb-2 text-xs font-bold tracking-[0.24em] text-[#9b6d22]">
                    MOVIE ARCHIVE
                  </p>
                  <h2 className="font-serif text-4xl font-semibold">电影库</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[#665d52]">
                    当前电影库共收录 {movieCatalog.length} 部。当前筛选：
                    {selectedThemeLabel}，显示 {filteredMovies.length} 部。当前第 {currentPage} / {totalPages} 页。
                  </p>
                </div>

                <label className="flex h-12 min-w-0 items-center gap-3 border border-[#d9cbbb] bg-white px-4 lg:w-80">
                  <Search className="shrink-0 text-[#9b6d22]" size={18} />
                  <input
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="搜索电影或主题"
                  />
                </label>
              </div>

              <div className="mb-8 grid grid-cols-1 gap-4 xl:grid-cols-2">
                {featuredMovies.slice(0, 4).map((movie) => (
                  <article
                    key={movie.title}
                    className="grid overflow-hidden border border-[#d9cbbb] bg-[#fffaf2] shadow-sm sm:grid-cols-[170px_minmax(0,1fr)]"
                  >
                    <img
                      className="h-40 w-full object-cover sm:h-full"
                      src={movie.image}
                      alt={`${movie.title} 观影意象`}
                    />
                    <div className="p-5">
                      <p className="text-xs font-bold tracking-[0.18em] text-[#9b6d22]">
                        精选引导 · {movie.level}
                      </p>
                      <h3 className="mt-2 font-serif text-2xl font-semibold">
                        {movie.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[#5f5548]">{movie.guide}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="overflow-hidden border border-[#d9cbbb] bg-[#fffaf2]">
                {pagedMovies.map((movie) => (
                  <article
                    key={movie.id}
                    className="grid gap-4 border-b border-[#eadfD1] p-5 last:border-b-0 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_auto] xl:items-center"
                  >
                    <div>
                      <p className="text-[11px] font-bold tracking-[0.18em] text-[#9b6d22]">
                        编号 #{movie.id}
                      </p>
                      <h3 className="mt-1 font-serif text-xl font-semibold leading-tight">
                        {movie.titleCn}
                      </h3>
                      <p className="mt-1 text-xs text-[#8a7a66]">
                        {movie.title}
                        {!movie.hasVerifiedChineseTitle && ' · 中文名待校对'}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {movie.themes.map((theme) => (
                        <button
                          key={`${movie.id}-${theme}`}
                          onClick={() => setActiveTheme(theme)}
                          className="bg-[#efe4d6] px-2.5 py-1.5 text-xs text-[#5f5548] hover:bg-[#d6a647] hover:text-[#17231f]"
                        >
                          {translateTheme(theme)}
                        </button>
                      ))}
                    </div>
                    <p className="text-sm leading-6 text-[#5f5548]">
                      {movie.intro}
                    </p>
                    <div className="flex flex-wrap gap-2 xl:justify-end">
                      <button
                        className="inline-flex items-center justify-center gap-2 bg-[#17231f] px-4 py-2 text-xs font-bold text-white hover:bg-[#263a34]"
                        onClick={() => setSelectedMovie(movie)}
                      >
                        查看详情 <ArrowRight size={14} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {filteredMovies.length > 0 && (
                <div className="mt-6 flex flex-col gap-4 border border-[#d9cbbb] bg-[#fffaf2] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-[#665d52]">
                    第 {(currentPage - 1) * PAGE_SIZE + 1}-
                    {Math.min(currentPage * PAGE_SIZE, filteredMovies.length)} 部，共 {filteredMovies.length} 部
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="border border-[#17231f] px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-35"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    >
                      上一页
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => index + 1)
                      .filter((page) => {
                        if (totalPages <= 7) return true;
                        return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2;
                      })
                      .map((page, index, pages) => {
                        const previous = pages[index - 1];
                        return (
                          <span key={page} className="flex items-center gap-2">
                            {previous && page - previous > 1 && (
                              <span className="px-1 text-sm text-[#8a7a66]">...</span>
                            )}
                            <button
                              className={`min-w-10 px-3 py-2 text-sm font-bold ${
                                page === currentPage
                                  ? 'bg-[#d6a647] text-[#17231f]'
                                  : 'border border-[#d9cbbb] bg-white text-[#5f5548] hover:bg-[#efe4d6]'
                              }`}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </button>
                          </span>
                        );
                      })}
                    <button
                      className="border border-[#17231f] px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-35"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    >
                      下一页
                    </button>
                  </div>
                </div>
              )}

              {filteredMovies.length === 0 && (
                <div className="border border-dashed border-[#cbbba8] bg-white/60 px-6 py-16 text-center">
                  <p className="font-serif text-2xl">没有找到匹配影片</p>
                  <button
                    className="mt-5 bg-[#17231f] px-5 py-3 text-sm font-semibold text-white"
                    onClick={() => {
                      setQuery('');
                      setActiveTheme('全部');
                    }}
                  >
                    清除筛选
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="dive-in" className="bg-[#17231f] px-5 py-16 text-white sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="mb-3 text-xs font-bold tracking-[0.24em] text-[#d6a647]">
                DIVE IN
              </p>
              <h2 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl">
                观影不是逃离生活，
                <span className="block">而是练习看见心念</span>
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/72">
                你可以一个人静静观看，也可以与同伴分享。重点不是分析电影好坏，而是留意：哪个片段触动了我？我在哪里抗拒？我把谁看成了问题？
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: <Compass size={22} />,
                  title: '选主题',
                  text: '从当下最强烈的情绪或关系困扰开始，而不是从“必看片单”开始。',
                },
                {
                  icon: <Play size={22} />,
                  title: '慢下来',
                  text: '暂停、回放、记录身体反应。被触动的地方通常比剧情更重要。',
                },
                {
                  icon: <MessageCircle size={22} />,
                  title: '说真话',
                  text: '分享时使用“我看见我自己……”而不是评价角色和别人。',
                },
                {
                  icon: <Check size={22} />,
                  title: '带回生活',
                  text: '把一个观影洞见转成一周内可以实践的小行动。',
                },
              ].map((item) => (
                <div key={item.title} className="border border-white/12 bg-white/7 p-6">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center bg-[#d6a647] text-[#17231f]">
                    {item.icon}
                  </div>
                  <h3 className="font-serif text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/68">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="spotlight" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div className="relative min-h-[420px] overflow-hidden">
              <img
                className="absolute inset-0 h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1400&q=80"
                alt="电影放映厅"
              />
              <div className="absolute inset-0 bg-[#17231f]/35" />
            </div>
            <div className="flex flex-col justify-center border border-[#d9cbbb] bg-[#fffaf2] p-8 sm:p-12">
              <p className="mb-3 text-xs font-bold tracking-[0.24em] text-[#9b6d22]">
                THE SPOTLIGHT
              </p>
              <h2 className="font-serif text-4xl font-semibold leading-tight">
                周六全天观影工作坊
              </h2>
              <p className="mt-5 text-base leading-8 text-[#5f5548]">
                和同路人一起线上观看一部电影，穿插静默、引导提问与小组分享。适合想把灵性学习落回日常关系、工作与情绪的人。
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ['形式', '线上共修'],
                  ['节奏', '观影 + 分享'],
                  ['适合', '华语学习者'],
                ].map(([label, value]) => (
                  <div key={label} className="border-t border-[#d9cbbb] pt-4">
                    <p className="text-xs font-bold tracking-[0.18em] text-[#8a7a66]">
                      {label}
                    </p>
                    <p className="mt-2 font-serif text-xl">{value}</p>
                  </div>
                ))}
              </div>
              <a
                id="join"
                href="mailto:hello@example.com?subject=报名观影工作坊"
                className="mt-9 inline-flex w-fit items-center gap-3 bg-[#17231f] px-6 py-4 text-sm font-bold text-white hover:bg-[#263a34]"
              >
                预约下一场 <CalendarDays size={18} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#d9cbbb] bg-[#fffaf2] px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-[#5f5548] md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="text-[#9b6d22]" size={20} />
            <span>光影内观：以电影为镜，回到当下的心。</span>
          </div>
          <div className="flex flex-wrap gap-4">
            <span className="inline-flex items-center gap-2">
              <BookOpen size={16} /> 观影笔记
            </span>
            <span className="inline-flex items-center gap-2">
              <Heart size={16} /> 同伴分享
            </span>
            <span className="inline-flex items-center gap-2">
              <CircleUserRound size={16} /> 内在练习
            </span>
            <span className="inline-flex items-center gap-2">
              <Star size={16} /> 中文资源
            </span>
          </div>
        </div>
      </footer>

      {selectedMovie && (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-[#101916]/78 px-4 py-6 backdrop-blur-sm sm:py-10">
          <div className="mx-auto max-w-4xl border border-[#d9cbbb] bg-[#fffaf2] shadow-2xl">
            <div className="flex items-start justify-between gap-5 border-b border-[#d9cbbb] p-6 sm:p-8">
              <div>
                <p className="text-xs font-bold tracking-[0.24em] text-[#9b6d22]">
                  观影指南 · 编号 #{selectedMovie.id}
                </p>
                <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight sm:text-4xl">
                  {selectedMovie.titleCn}
                </h2>
                <p className="mt-2 text-sm text-[#665d52]">
                  原名：{selectedMovie.title}
                  {!selectedMovie.hasVerifiedChineseTitle && ' · 中文名待校对'}
                </p>
                {selectedMovie.douban && (
                  <p className="mt-2 text-xs text-[#8a7a66]">
                    豆瓣：{selectedMovie.douban.doubanTitle}
                  </p>
                )}
              </div>
              <button
                className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#17231f] text-[#17231f] hover:bg-[#17231f] hover:text-white"
                onClick={() => setSelectedMovie(null)}
                aria-label="关闭详情"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-6">
                <section>
                  <h3 className="mb-3 font-serif text-xl font-semibold">简介</h3>
                  <p className="text-sm leading-7 text-[#4d463c]">
                    {selectedMovie.intro}
                  </p>
                  {!selectedMovie.douban && (
                    <p className="mt-3 text-xs leading-6 text-[#8a7a66]">
                      这部影片暂未匹配到高置信豆瓣条目，中文名和豆瓣链接需要后续校对。
                    </p>
                  )}
                </section>

                <section>
                  <h3 className="mb-3 font-serif text-xl font-semibold">主题</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMovie.themes.map((theme) => (
                      <button
                        key={`modal-${theme}`}
                        className="bg-[#efe4d6] px-3 py-2 text-xs text-[#5f5548] hover:bg-[#d6a647] hover:text-[#17231f]"
                        onClick={() => {
                          setActiveTheme(theme);
                          setSelectedMovie(null);
                          requestAnimationFrame(() => {
                            document.getElementById('movies')?.scrollIntoView({ behavior: 'smooth' });
                          });
                        }}
                      >
                        {translateTheme(theme)}
                        <span className="ml-1 opacity-60">{theme}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="border-l-4 border-[#d6a647] bg-white p-5">
                  <h3 className="font-serif text-xl font-semibold">核心提问</h3>
                  <p className="mt-3 text-sm font-semibold leading-7 text-[#17231f]">
                    这部电影让我把谁、哪件事或哪种处境看成了问题？如果问题其实是我的知见，我愿意重新看见什么？
                  </p>
                </section>
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="mb-3 font-serif text-xl font-semibold">观影看点</h3>
                  <ul className="space-y-3">
                    {selectedMovie.focus.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-7 text-[#4d463c]">
                        <Check className="mt-1 shrink-0 text-[#9b6d22]" size={16} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="mb-3 font-serif text-xl font-semibold">操练方法</h3>
                  <ol className="space-y-3">
                    {selectedMovie.practices.map((item, index) => (
                      <li key={item} className="grid grid-cols-[32px_minmax(0,1fr)] gap-3 text-sm leading-7 text-[#4d463c]">
                        <span className="flex h-8 w-8 items-center justify-center bg-[#17231f] text-xs font-bold text-white">
                          {index + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </section>

                <div className="flex flex-col gap-3 border-t border-[#d9cbbb] pt-5 sm:flex-row">
                  {selectedMovie.douban && (
                    <a
                      className="inline-flex items-center justify-center gap-2 bg-[#17231f] px-5 py-3 text-sm font-bold text-white hover:bg-[#263a34]"
                      href={selectedMovie.douban.doubanUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      打开豆瓣条目 <ArrowRight size={16} />
                    </a>
                  )}
                  <button
                    className="inline-flex items-center justify-center gap-2 border border-[#17231f] px-5 py-3 text-sm font-bold text-[#17231f] hover:bg-[#17231f] hover:text-white"
                    onClick={() => setSelectedMovie(null)}
                  >
                    回到列表
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
