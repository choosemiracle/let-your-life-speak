import React, { useState, useEffect, useCallback } from 'react';
import { 
  Leaf, Map, Compass, Flower2, Archive, BookOpen, Users, ArrowRight, 
  RefreshCcw, Sparkles, Info, Clock, Trash2, Download, DoorOpen, 
  Footprints, Lightbulb, Sprout, ChevronRight, ChevronLeft, ShieldCheck, 
  FileText, CheckCircle2, Quote, ExternalLink, Heart, Layout
} from 'lucide-react';

// --- 配置与常量 ---
const STORAGE_KEY = 'talent_courtyard_final_data_v4';

// --- 模拟生成算法 ---
const generateInsightReport = (reflection) => {
  const values = Object.values(reflection);
  const totalLength = values.join('').length;
  if (totalLength < 10) return null;

  // 模拟逻辑：基于输入关键词的概率映射
  return {
    naturalAttention: "你似乎拥有一种‘透视’事物的本能，能够轻易捕捉到嘈杂信息背后的核心结构。这种注意力不是训练出来的，而是你生命自带的频率。",
    energySource: "当你处于‘深度解决’或‘真诚连接’的时刻，你的生命能量会从低频转为高频。那种忘记时间的沉浸感，是你天赋发出的信号。",
    repeatedRole: "在人群中，你可能不自觉地承担起‘定心丸’或‘翻译官’的角色。你擅长把模糊的情绪转化为清晰的认知。",
    deepConcern: "你对‘真相是否被扭曲’或‘人是否被误解’有着近乎神圣的关切。这不仅是性格，更是你灵魂守护的疆域。",
    suitableSoil: "你可能更适合那种‘慢节奏、深思考、高信任’的土壤。在过于喧嚣或功利的环境中，你的内在老师会选择闭口不言。",
    drainingEnvironment: "警惕那些需要你长期‘表演’或‘仅做执行’的场域。它们会像干涸的河床一样，慢慢耗尽你的天赋水分。",
    initialClue: "目前显现的线索指向：你可能是一位极具深度的‘生命翻译者’，擅长在复杂中寻找清明。",
    openQuestions: ["哪一段文字最让你感到身体放松？", "如果天赋是一个人，ta现在想对你说什么？", "你还在害怕被谁看见？"]
  };
};

const generateHypothesis = (insight) => {
  if (!insight) return null;
  return {
    lifeTheme: "在复杂与模糊中，看见结构，并帮助人重新找到方向。",
    clues: [
      { title: "整理复杂的能力", description: "自然地将零散信息结构化。", evidence: "来自你高能时刻的描述。", verify: "验证：长期做这件事，你是感到更轻盈还是更沉重？" },
      { title: "深度倾听的倾向", description: "愿意陪别人慢慢说清楚，而不是急着给建议。", evidence: "来自你对他人的自然回应。", verify: "验证：这种倾听是否让你也感到被滋养？" }
    ],
    possibleExpressions: ["深度咨询", "内容策展", "生命教育", "组织共创工作坊", "独立写作"],
    livingQuestions: ["我是否一直在低估自己最自然的那部分贡献？", "那个让我羡慕的人，到底活出了我内心的哪一部分？"],
    gentleSummary: "天赋不是一个终点，而是一段活出来的旅程。请带着这些假设，像孩子一样去生活。"
  };
};

// --- 子组件：进度小径 ---
const LifeProgressPath = ({ currentStep }) => {
  const steps = [
    { id: 'L', label: '回听', icon: <DoorOpen size={16} /> },
    { id: 'I', label: '辨认', icon: <Footprints size={16} /> },
    { id: 'F', label: '假设', icon: <Lightbulb size={16} /> },
    { id: 'E', label: '验证', icon: <Sprout size={16} /> }
  ];

  return (
    <div className="flex items-center gap-4 py-6 justify-center animate-fade-in">
      {steps.map((step, idx) => (
        <React.Fragment key={step.id}>
          <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${currentStep === step.id ? 'opacity-100 scale-110' : 'opacity-30'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === step.id ? 'bg-[#7FA88B] text-white shadow-lg' : 'bg-[#DDD4C5] text-[#2F2F2A]'}`}>
              {step.icon}
            </div>
            <span className="text-[10px] font-bold tracking-widest text-[#7A7468]">{step.label}</span>
          </div>
          {idx < steps.length - 1 && <div className="h-[1px] w-8 md:w-16 bg-[#DDD4C5] mb-6"></div>}
        </React.Fragment>
      ))}
    </div>
  );
};

// --- 主应用组件 ---
export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isExploring, setIsExploring] = useState(false);
  const [lifeStep, setLifeStep] = useState('L');
  const [reflectionIndex, setReflectionIndex] = useState(0);

  // 数据状态
  const [reflection, setReflection] = useState({
    highEnergyMoment: '', childhoodClue: '', repeatedHelp: '', envyAndLonging: '', closedDoor: '', bodySignal: ''
  });
  const [insight, setInsight] = useState(null);
  const [hypothesis, setHypothesis] = useState(null);
  const [experiment, setExperiment] = useState({
    clueToTest: '', action: '', successSignal: '', nextAdjustment: ''
  });
  const [archive, setArchive] = useState([]);
  const [takeaway, setTakeaway] = useState('');

  const reflectionConfigs = [
    { key: 'highEnergyMoment', title: '高能时刻', sub: '回忆一个忘记时间、心里变亮的具体瞬间。', q: '有什么时候，你觉得自己特别“活着”？', ph: '那时我正在……我感到……因为……' },
    { key: 'childhoodClue', title: '童年线索', sub: '在外界要求你“懂事”之前，你喜欢做什么？', q: '小时候，你自然会靠近什么？', ph: '小时候，我常常会……不需要任何人要求。' },
    { key: 'repeatedHelp', title: '他人反馈', sub: '别人总是找你帮什么忙？那往往是你的自然天赋。', q: '别人通常因为什么事来找你？', ph: '他们似乎相信我可以……我对此感到……' },
    { key: 'envyAndLonging', title: '羡慕与渴望', sub: '羡慕是灵魂的罗盘，指向你被压抑的潜能。', q: '你最近一次真心羡慕别人是因为什么？', ph: '我羡慕他/她能……如果我也可以，我会……' },
    { key: 'closedDoor', title: '关闭之门', sub: '关闭可能是一种保护。', q: '有没有一条路，很想走却没走成？', ph: '曾经我以为我会……现在回看，我发现……' },
    { key: 'bodySignal', title: '身体知觉', sub: '身体知道灵魂的真相。', q: '想到现在的方向，你的身体有什么反应？', ph: '当我想到这件事，我感到肩膀……呼吸……' },
  ];

  // 数据持久化
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setArchive(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse archive data", e);
      }
    }
  }, []);

  const handleStart = () => {
    setIsExploring(true);
    setLifeStep('L');
    setReflectionIndex(0);
    // 使用 requestAnimationFrame 确保 DOM 渲染后再滚动
    requestAnimationFrame(() => {
      const anchor = document.getElementById('life-model-anchor');
      if (anchor) anchor.scrollIntoView({ behavior: 'smooth' });
    });
  };

  const nextStep = () => {
    if (lifeStep === 'L') {
      if (reflectionIndex < reflectionConfigs.length - 1) {
        setReflectionIndex(reflectionIndex + 1);
      } else {
        const report = generateInsightReport(reflection);
        setInsight(report);
        setLifeStep('I');
      }
    } else if (lifeStep === 'I') {
      const hyp = generateHypothesis(insight);
      setHypothesis(hyp);
      setLifeStep('F');
    } else if (lifeStep === 'F') {
      setLifeStep('E');
    }
  };

  const saveReport = () => {
    const newReport = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      reflection,
      insight,
      hypothesis,
      experiment,
      takeaway
    };
    const updated = [newReport, ...archive];
    setArchive(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setIsExploring(false);
    setActiveSection('archive');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exportText = () => {
    const text = `天赋小院 LIFE 生命线索报告\n时间：${new Date().toLocaleString()}\n\n[生命主题假设]\n${hypothesis?.lifeTheme || '无'}\n\n[天赋线索]\n${hypothesis?.clues ? hypothesis.clues.map(c => `- ${c.title}: ${c.description}`).join('\n') : '无'}\n\n[实验规划]\n线索：${experiment.clueToTest || '无'}\n行动：${experiment.action || '无'}\n\n[感悟]\n${takeaway || '无'}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `天赋小院报告-${Date.now()}.txt`;
    a.click();
  };

  // --- 导航 ---
  const Nav = () => (
    <nav className="fixed top-0 w-full z-50 bg-[#F7F2E8]/90 backdrop-blur-md border-b border-[#DDD4C5] px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => {setIsExploring(false); setActiveSection('home');}}>
        <div className="w-8 h-8 bg-[#7FA88B] rounded-full flex items-center justify-center">
          <Flower2 size={18} className="text-white" />
        </div>
        <div className="hidden sm:block">
          <h1 className="font-serif text-lg font-bold tracking-widest text-[#2F2F2A]">天赋小院</h1>
          <p className="text-[9px] text-[#7A7468] tracking-tighter uppercase">让生命发声</p>
        </div>
      </div>
      <div className="flex gap-4 md:gap-8 text-sm text-[#7A7468]">
        {['首页', '生命档案'].map((label, idx) => (
          <button 
            key={idx}
            onClick={() => { setIsExploring(false); setActiveSection(['home', 'archive'][idx]); }}
            className={`hover:text-[#2F2F2A] transition-colors ${!isExploring && activeSection === ['home', 'archive'][idx] ? 'text-[#2F2F2A] font-bold border-b border-[#C7A45D]' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#F7F2E8] text-[#2F2F2A] font-sans selection:bg-[#7FA88B]/20">
      <Nav />
      
      <main className="pt-20">
        {activeSection === 'home' && (
          <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
              <div className="max-w-3xl space-y-8">
                <h2 className="text-4xl md:text-6xl font-serif leading-tight text-[#2F2F2A]">
                  天赋，不是测出来的。<br />
                  是在生命里，被慢慢听见的。
                </h2>
                <p className="text-lg text-[#7A7468] font-light max-w-2xl mx-auto leading-relaxed">
                  欢迎来到天赋小院。这里不算命，不贴标签，不急着给答案。<br/>
                  我们陪你回看真实经历，辨认生命线索，听见内在的召唤。
                </p>
                <button onClick={handleStart} className="px-12 py-5 bg-[#7FA88B] text-white rounded-full hover:bg-[#5F8A72] shadow-xl flex items-center gap-3 mx-auto transition-all text-lg font-serif">
                  开启 LIFE 探索路径 <ArrowRight size={20} />
                </button>
              </div>
            </section>

            {/* LIFE Model Anchor */}
            <div id="life-model-anchor" className="h-4"/>

            {/* Interaction Section */}
            {isExploring && (
              <section className="py-20 px-6 bg-white/40 border-y border-[#DDD4C5]/30">
                <div className="max-w-4xl mx-auto space-y-12">
                  <LifeProgressPath currentStep={lifeStep} />

                  {/* L Phase: Walking */}
                  {lifeStep === 'L' && (
                    <div className="animate-fade-in space-y-8">
                      <div className="bg-white p-10 md:p-14 rounded-[50px] border border-[#DDD4C5] shadow-sm space-y-8 relative">
                        <div className="flex justify-between items-center text-[10px] text-[#C7A45D] font-bold tracking-[0.2em]">
                          <span>{reflectionConfigs[reflectionIndex].title}</span>
                          <span>{reflectionIndex + 1} / {reflectionConfigs.length}</span>
                        </div>
                        <h4 className="text-2xl font-serif leading-relaxed text-[#2F2F2A]">
                          {reflectionConfigs[reflectionIndex].q}
                        </h4>
                        <p className="text-sm text-[#7A7468] font-light italic">{reflectionConfigs[reflectionIndex].sub}</p>
                        <textarea 
                          key={reflectionIndex}
                          value={reflection[reflectionConfigs[reflectionIndex].key]}
                          onChange={(e) => setReflection({...reflection, [reflectionConfigs[reflectionIndex].key]: e.target.value})}
                          className="w-full h-44 p-6 bg-[#F7F2E8]/40 border-none rounded-3xl outline-none focus:ring-2 focus:ring-[#7FA88B]/20 transition-all resize-none text-base"
                          placeholder={reflectionConfigs[reflectionIndex].ph}
                        />
                        <div className="flex justify-between items-center gap-4 pt-4">
                          <button 
                            disabled={reflectionIndex === 0}
                            onClick={() => setReflectionIndex(reflectionIndex - 1)}
                            className="p-4 rounded-full border border-[#DDD4C5] text-[#7A7468] disabled:opacity-10 hover:bg-[#F7F2E8] transition-all"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <div className="flex-1 h-[2px] bg-[#F7F2E8] rounded-full overflow-hidden">
                            <div className="h-full bg-[#7FA88B] transition-all duration-700" style={{ width: `${((reflectionIndex + 1) / reflectionConfigs.length) * 100}%` }} />
                          </div>
                          <button onClick={nextStep} className="px-10 py-4 bg-[#7FA88B] text-white rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
                            {reflectionIndex === reflectionConfigs.length - 1 ? '整理线索' : '下一步'} <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* I Phase: Insights */}
                  {lifeStep === 'I' && (
                    <div className="animate-fade-in space-y-12">
                      <div className="text-center space-y-3">
                        <h3 className="text-2xl font-serif">I｜线索正在浮现</h3>
                        <p className="text-sm text-[#7A7468]">系统不给你定论，只整理出你生命中反复出现的共鸣。</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {insight && Object.entries(insight).filter(([k]) => k !== 'openQuestions').map(([key, val]) => (
                          <div key={key} className="p-10 bg-white border border-[#DDD4C5] rounded-[40px] space-y-4 hover:shadow-md transition-all">
                            <span className="text-[10px] font-bold text-[#C7A45D] uppercase tracking-widest">
                              {key === 'naturalAttention' ? '自然注意力' : key === 'energySource' ? '能量来源' : '生命观察'}
                            </span>
                            <p className="text-sm leading-relaxed text-[#2F2F2A] font-light">{String(val)}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-center gap-6 pt-8">
                        <button onClick={() => setLifeStep('L')} className="px-8 py-3 border border-[#7A7468] rounded-full text-sm">返回修改</button>
                        <button onClick={nextStep} className="px-10 py-4 bg-[#7FA88B] text-white rounded-full shadow-lg">形成生命假设</button>
                      </div>
                    </div>
                  )}

                  {/* F Phase: Hypothesis */}
                  {lifeStep === 'F' && hypothesis && (
                    <div className="animate-fade-in space-y-12">
                      <div className="p-12 md:p-16 bg-white rounded-[60px] border-2 border-[#C7A45D]/20 space-y-12 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F7F2E8] rounded-full -mr-16 -mt-16 opacity-50" />
                        <div className="space-y-4">
                          <span className="text-xs font-bold text-[#C7A45D] tracking-[0.3em] uppercase">核心生命主题假设</span>
                          <h4 className="text-3xl font-serif text-[#2F2F2A] leading-relaxed border-l-8 border-[#C7A45D] pl-8 italic">
                            “{hypothesis.lifeTheme}”
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-[#F7F2E8] pt-10">
                          <div className="space-y-5">
                            <h5 className="text-sm font-bold text-[#7FA88B] tracking-widest">可能表达方式</h5>
                            <ul className="space-y-3 text-sm text-[#7A7468]">
                              {hypothesis.possibleExpressions.map((e, i) => (
                                <li key={i} className="flex items-center gap-3"><CheckCircle2 size={14} className="text-[#7FA88B] opacity-50"/>{e}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-5">
                            <h5 className="text-sm font-bold text-[#B96A5B] tracking-widest">待验证的问题</h5>
                            <ul className="space-y-3 text-sm italic text-[#7A7468]">
                              {hypothesis.livingQuestions.map((q, i) => <li key={i}>· {q}</li>)}
                            </ul>
                          </div>
                        </div>
                        <p className="text-center text-sm font-serif italic text-[#7A7468] pt-10 border-t border-[#F7F2E8]/50">
                          {hypothesis.gentleSummary}
                        </p>
                      </div>
                      <div className="flex justify-center pt-8">
                        <button onClick={nextStep} className="px-14 py-5 bg-[#7FA88B] text-white rounded-full shadow-2xl text-lg font-serif">设计小步实验</button>
                      </div>
                    </div>
                  )}

                  {/* E Phase: Experiment */}
                  {lifeStep === 'E' && (
                    <div className="animate-fade-in space-y-12">
                      <div className="text-center space-y-3">
                        <h3 className="text-2xl font-serif">E｜小步验证</h3>
                        <p className="text-sm text-[#7A7468]">一个真实的呼召，不怕被生活轻轻验证。</p>
                      </div>
                      <div className="bg-white p-12 rounded-[50px] border border-[#DDD4C5] space-y-10 shadow-sm">
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-[#7A7468] uppercase tracking-widest">我要验证的线索</label>
                            <input value={experiment.clueToTest} onChange={(e) => setExperiment({...experiment, clueToTest: e.target.value})} className="w-full p-4 bg-[#F7F2E8] rounded-2xl border-none outline-none text-sm" placeholder="例如：我可能擅长在复杂中寻找清明。" />
                          </div>
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-[#7A7468] uppercase tracking-widest">实验行动清单</label>
                            <textarea value={experiment.action} onChange={(e) => setExperiment({...experiment, action: e.target.value})} className="w-full h-32 p-4 bg-[#F7F2E8] rounded-2xl border-none outline-none text-sm resize-none" placeholder="例如：下周三找一位朋友进行40分钟深度倾听。" />
                          </div>
                        </div>
                        <div className="pt-8 border-t border-[#F7F2E8] space-y-4">
                          <label className="text-sm font-bold text-[#2F2F2A] font-serif">此刻，我想对自己说：</label>
                          <input value={takeaway} onChange={(e) => setTakeaway(e.target.value)} className="w-full p-4 border-b border-[#DDD4C5] text-2xl italic outline-none font-serif text-[#7FA88B] bg-transparent" placeholder="保持诚实，慢慢走……" />
                        </div>
                      </div>
                      <div className="flex justify-center gap-6 pt-8">
                        <button onClick={saveReport} className="px-14 py-5 bg-[#7FA88B] text-white rounded-full shadow-2xl text-xl font-serif">存入档案，完成探索</button>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Philosophy Cards */}
            <section className="py-24 px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { t: "不修复，只倾听", c: "在小院里，我们不急着修理任何人，只是为灵魂创造一个安全的停机坪。", icon: <Users size={24}/> },
                { t: "借由第三物", c: "有些真话不能直说。借由诗歌、图画、故事，我们慢慢靠近那个害羞的自我。", icon: <BookOpen size={24}/> },
                { t: "独自相聚", c: "我们坐成一个圈。各自独处，却又互相支持，在宁静中辨识内在的声音。", icon: <Heart size={24}/> }
              ].map((item, idx) => (
                <div key={idx} className="p-10 bg-white border border-[#DDD4C5] rounded-[40px] space-y-4 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-[#EFE4D0] rounded-full flex items-center justify-center text-[#C7A45D] mb-4">{item.icon}</div>
                  <h4 className="font-serif font-bold text-lg">{item.t}</h4>
                  <p className="text-sm text-[#7A7468] leading-relaxed font-light">{item.c}</p>
                </div>
              ))}
            </section>
          </div>
        )}

        {activeSection === 'archive' && (
          <section className="min-h-screen py-24 px-6 max-w-4xl mx-auto animate-fade-in">
            <div className="flex justify-between items-end border-b border-[#DDD4C5] pb-8 mb-12">
              <div className="space-y-2">
                <h3 className="text-3xl font-serif">生命档案</h3>
                <p className="text-sm text-[#7A7468]">这是你生命曾经发出的声音，请珍藏它们。</p>
              </div>
              <div className="flex gap-4">
                <button onClick={exportText} className="text-xs text-[#7FA88B] flex items-center gap-2 hover:bg-[#7FA88B]/10 p-2 rounded-lg transition-all"><Download size={14}/> 导出报告</button>
                <button onClick={() => {if(window.confirm('清空所有记录？')) {setArchive([]); localStorage.removeItem(STORAGE_KEY);}}} className="text-xs text-[#B96A5B] flex items-center gap-2 hover:bg-red-50 p-2 rounded-lg transition-all"><Trash2 size={14}/> 清空档案</button>
              </div>
            </div>

            {archive.length === 0 ? (
              <div className="py-32 text-center opacity-30 flex flex-col items-center gap-4">
                <Archive size={64}/>
                <p className="font-serif text-xl tracking-widest uppercase">暂无探索足迹</p>
                <button onClick={() => setActiveSection('home')} className="text-sm text-[#7FA88B] border-b border-[#7FA88B]">回首页开启旅程</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8">
                {archive.map((entry, idx) => (
                  <div key={idx} className="p-12 bg-white border border-[#DDD4C5] rounded-[50px] space-y-8 group hover:shadow-2xl transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all">
                      <ExternalLink size={20} className="text-[#C7A45D] cursor-pointer" />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-[#C7A45D] tracking-widest uppercase border-b border-[#F7F2E8] pb-4">
                      <span>{entry.date}</span>
                      <span className="flex items-center gap-2"><Quote size={12}/> 探索记录</span>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-2xl font-serif italic text-[#2F2F2A] border-l-8 border-[#7FA88B] pl-6 leading-relaxed">
                        “{entry.hypothesis?.lifeTheme || '正在显露的生命主题'}”
                      </h4>
                      <p className="text-base text-[#7FA88B] font-serif italic pt-4">—— {entry.takeaway || '未留下感言'}</p>
                    </div>
                    <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-light">
                      <div className="space-y-2">
                        <p className="font-bold text-[#7A7468] uppercase text-[10px]">实验行动</p>
                        <p className="line-clamp-2">{entry.experiment?.action || '暂无行动规划'}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-bold text-[#7A7468] uppercase text-[10px]">线索摘要</p>
                        <p className="line-clamp-2">{entry.insight?.initialClue || '正在整理线索...'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Boundary Note */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="p-10 bg-[#EFE4D0]/60 rounded-[40px] border border-[#DDD4C5]/50 flex flex-col md:flex-row items-center gap-8">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#7FA88B] shrink-0 shadow-sm"><ShieldCheck size={28}/></div>
          <div className="space-y-2">
            <h5 className="font-serif text-lg font-bold">温柔提醒</h5>
            <p className="text-xs text-[#7A7468] leading-relaxed">
              天赋小院不是心理治疗，也不提供职业诊断。我们相信每个人内在都有自己的光。LIFE 模型通过结构化的回听，旨在陪伴你发现那些被忽视的生命线索。
            </p>
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-[#DDD4C5] text-center bg-white/10">
        <div className="max-w-xl mx-auto space-y-6 px-6">
          <p className="text-[10px] text-[#7A7468] tracking-[0.5em] uppercase">天赋小院 · 让生命发声</p>
          <div className="flex justify-center gap-4 text-[#7FA88B] opacity-50">
            <Compass size={18} /> <Layout size={18} /> <RefreshCcw size={18} />
          </div>
          <p className="text-xs text-[#7A7468] leading-relaxed font-light">
            本项目深受帕克·帕尔默（Parker J. Palmer）关于 vocation、true self 与 Circle of Trust 等思想启发。<br/>
            愿你在嘈杂的世界中，降落到真实的生命里。
          </p>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&family=Noto+Sans+SC:wght@300;400;700&display=swap');
        body { font-family: 'Noto Sans SC', sans-serif; background-color: #F7F2E8; overflow-x: hidden; scroll-behavior: smooth; }
        h1, h2, h3, h4, h5, h6, .font-serif { font-family: 'Noto Serif SC', serif; }
        .animate-fade-in { animation: fadeIn 1.2s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #F7F2E8; }
        ::-webkit-scrollbar-thumb { background: #DDD4C5; border-radius: 10px; }
      `}} />
    </div>
  );
}