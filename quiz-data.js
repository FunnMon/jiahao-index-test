(function (root) {
  'use strict';
  const axes = [
    { name: '出场排面', short: '出场', line: '你给登场安排了多少镜头', read: '你会留意出场的角度，也享受被人看见的那一刻。', tip: '想酷的时候就酷，偶尔也给“随便穿穿”一点真实空间。' },
    { name: '高光表达', short: '高光', line: '你把聊天变成名场面的浓度', read: '你很会给一句话寻找落点，普通聊天也有了高光片段。', tip: '你的表达欲有感染力，记得也把麦克风递给别人。' },
    { name: '故事浓度', short: '故事', line: '日常在你脑内加了多少旁白', read: '你善于给日常配上旁白，一场雨也能变成电影里的转场。', tip: '保留你的内心电影，也允许有些日子只是普通的好天气。' },
    { name: '高手姿态', short: '高手', line: '你切换到懂行模式的频率', read: '遇到熟悉的领域，你很容易切进“这题我会”的高手频道。', tip: '分享热爱就很有魅力，不必每一次都成为全场最懂的人。' }
  ];
  const option = (text, score) => ({ text, score });
  const questions = [
    { axis: 0, text: '朋友说：“你今天有点酷。”你的第一反应是？', options: [option('笑着道谢，给朋友也拍张照。',1),option('压低声音：“只是随便穿穿。”',3),option('“刚好干净。”接着聊回正题。',0),option('嘴上否认，心里循环播放三遍。',2)] },
    { axis: 1, text: '聚会突然安静，所有人都在看手机。你会？', options: [option('甩出一句准备很久的梗，等大家接住。',2),option('安心吃东西，沉默也挺舒服。',0),option('“既然大家都不说，那我讲两句。”',3),option('问问旁边的人最近在忙什么。',1)] },
    { axis: 2, text: '下雨了，你一个人走在回家的路上。脑内是？', options: [option('雨声、耳机和路灯，刚好有点氛围。',1),option('一段属于我的长镜头，连背影都有剧情。',3),option('这雨什么时候停，鞋已经湿了。',0),option('想发点什么，配文已经开始自动生成。',2)] },
    { axis: 3, text: '朋友的设备连不上网，大家一筹莫展。你会？', options: [option('“让我看看。”先试着排查一下。',1),option('把它转过来，熟练地说：“典型问题。”',3),option('搜一下解决办法，照着步骤试。',0),option('一边检查，一边解释可能的原理。',2)] },
    { axis: 0, text: '要拍一张新的头像，你最在意什么？', options: [option('别糊，能认出是我就行。',0),option('看似被抓拍，其实角度已经找了很久。',3),option('光线和构图得像一张电影海报。',2),option('好看自然就好，多拍几张挑一张。',1)] },
    { axis: 1, text: '别人问起你擅长的事，你通常怎么回答？', options: [option('“略懂。”接着把细节讲得非常完整。',3),option('直接说做过什么，也说说还不会什么。',0),option('轻描淡写地抛出一个最拿手的经历。',2),option('先看看对方感不感兴趣，再慢慢讲。',1)] },
    { axis: 2, text: '凌晨突然想发一条动态，你更可能写？', options: [option('“有些路，终究要一个人走。”',3),option('发今天吃的东西，字都懒得配。',0),option('一句有点留白的歌词，懂的人会懂。',2),option('“今天还不错。”附一张随手拍。',1)] },
    { axis: 3, text: '聊到你很熟悉的游戏或作品，别人说错了一个细节。你会？', options: [option('如果影响理解，就友好补充一句。',0),option('“这个就说来话长了。”展开背景知识。',2),option('等对方讲完，再说说自己的理解。',1),option('嘴角一扬：“看来你还没接触到核心。”',3)] },
    { axis: 0, text: '你比朋友早到餐厅，选哪个位置？', options: [option('门一开就能看到、光线也刚好的位置。',3),option('离空调合适、坐着舒服的地方。',0),option('靠窗，风景好也方便拍照。',1),option('能看向窗外，朋友来时正好回头。',2)] },
    { axis: 1, text: '你做成了一件挺厉害的事，会怎么告诉大家？', options: [option('发个成果，老实说自己挺开心。',1),option('“也没做什么。”然后贴上完整成果。',3),option('先不提，别人问到再正常分享。',0),option('挑一个自然的话题切进去，顺便带出。',2)] },
    { axis: 2, text: '耳机随机播到一首很有情绪的歌，你会？', options: [option('切一首，我现在想听点轻松的。',0),option('给窗外的人和景都配上了这段音乐。',2),option('已经想好别人将来回忆我时用的片尾曲。',3),option('听完，想起了一些以前的事。',1)] },
    { axis: 3, text: '有人说：“这个东西你不一定会。”你会？', options: [option('“确实，教教我？”',0),option('默默试一下，成功后淡淡说句“还行”。',2),option('先问是什么，能做就认真做。',1),option('“你可能对我的实力有点误解。”',3)] },
    { axis: 0, text: '快到朋友面前时，你发现旁边有一面镜子。你会？', options: [option('顺手整理头发，然后正常过去。',1),option('确认一下表情，切换成最像自己的状态。',2),option('没注意，已经在喊朋友名字了。',0),option('肩膀放松、眼神收住，登场。',3)] },
    { axis: 1, text: '群聊里有人夸你，你最可能回复？', options: [option('“别夸了，容易当真。”',1),option('“这才哪到哪。”发完又看了两遍。',3),option('“谢谢！今天运气确实不错。”',0),option('发个淡定表情，过一会儿再补一句。',2)] },
    { axis: 2, text: '旅行结束，最后一张照片你想留下什么？', options: [option('没吃完的小吃，下次还要来。',0),option('夕阳里的背影，像故事的最后一页。',3),option('大家一起笑的合照，记住这个瞬间。',1),option('一张空景，配一句只有自己明白的话。',2)] },
    { axis: 3, text: '你的拿手操作没有成功，大家还在看。你会？', options: [option('“失误了，再试试。”顺便笑一下。',0),option('“环境不太对，下次给你们看完整版。”',3),option('解释一下哪里出了问题，然后换办法。',1),option('沉默两秒：“刚才只是测试。”',2)] }
  ];
  const types = {
    relaxed: { name:'原生松弛派', quote:'你不是没有主角光环，只是懒得开灯。', story:'被看见很好，不被看见也不耽误你过得舒服。你的镜头感通常让位于“我开心就好”，偶尔认真耍一次帅，反而更像彩蛋。', tag:'生活原片，直接出片' },
    all: { name:'全域嘉豪', quote:'别人过日子，你在更新个人宇宙。', story:'出场、发言、内心旁白和高手模式，你都有自己的导演版本。你的热情很有戏，也很有辨识度；能随时切回普通频道，就是你的隐藏技能。', tag:'主角模式，全频道在线' },
    0: { name:'氛围导演豪', quote:'你还没说话，出场镜头已经拍好了。', story:'比起直接喊“看我”，你更擅长让位置、穿搭和一个回头替你发言。别人记得一场聚会，你还会记得那天光从哪个角度打过来。', tag:'镜头就位，本人入场' },
    1: { name:'高光发言豪', quote:'聊天是聊天，名场面也得顺手安排。', story:'你对一句话的出场时机有自己的理解：既想分享，又想让分享显得不经意。你的表达让现场有了记忆点，偶尔直说“我很开心”也一样好看。', tag:'这句台词，我有准备' },
    2: { name:'故事男主豪', quote:'只是路过一盏灯，你已演完一场戏。', story:'你的内心有一支很勤快的摄制组，擅长替日常加上配乐和转场。这里的“男主”是剧情梗，谁都可以拿到这本剧本；你的浪漫不需要别人批准。', tag:'日常小事，电影质感' },
    3: { name:'技术流嘉豪', quote:'你说“我试试”，语气已经加载高手模式。', story:'一碰到熟悉的领域，你的热爱和胜负欲会一起上线。你不只想解决问题，也想把漂亮的解法展示出来。允许自己偶尔不会，会让你的分享更好接近。', tag:'别急，这个领域我熟' }
  };
  const moments = [
    '一句夸奖被你加上了回放功能。别人看到的是回应，你已经在安排这一刻的余韵。',
    '气氛一静，你就开始寻找自己的入场时机。比起让场子冷掉，你更愿意让一句话留下来。',
    '回家的路在你这里多了一层叙事。雨不只负责下，顺便还要参与今天的情绪表达。',
    '排查问题的同时，你也在展示自己的熟练度。手上的操作和语气里的把握感，一起上线。',
    '头像对你不只是辨认工具，也是一个有构图的出场方式。看起来随意，往往也有你的审美安排。',
    '你想分享擅长的事，也在意别人怎样接收到它。那一点轻描淡写，是你的表达节奏。',
    '动态成了你的留白台词。具体发生了什么可以不全说，但氛围需要被好好保留。',
    '熟悉的领域会让你进入讲解频道。你享受补全细节，也希望大家看见你钻研过的深度。',
    '等人也可以有镜头语言。位置和回头的时机，都能成为你表达自己的小细节。',
    '你给成果找了一个出场位置。既想被注意，也想让这份高光显得顺理成章。',
    '音乐一响，你的脑内画面就开始接管现场。同一段旋律，在你这里还负责剪辑日常。',
    '一句质疑点亮了你的证明欲。你想交出的不只是答案，还有一段漂亮的实力展示。',
    '走向朋友的几步路，你也愿意留给状态调整。你知道自己想以什么样子被看见。',
    '收到夸奖时，你会给回复加一点节奏。那份淡定里面，藏着对这个高光时刻的在意。',
    '旅途要结束了，你仍想替它找到合适的最后一页。照片对你也是一种叙事，而不只是记录。',
    '失误之后，你依然想保住高手频道的连贯性。给自己一个过渡，是你的临场小剧本。'
  ];
  function isAnswer(a) { return Number.isInteger(a) && a >= 0 && a < 4; }
  function score(answers) {
    if (!Array.isArray(answers) || answers.length !== questions.length || !answers.every(isAnswer)) throw new Error('请完成全部 16 道题。');
    const raw = [0,0,0,0];
    questions.forEach((q,i) => { raw[q.axis] += q.options[answers[i]].score; });
    const total = raw.reduce((a,b)=>a+b,0), index = Math.round(total / 48 * 100);
    const dominant = raw.indexOf(Math.max(...raw));
    const key = index < 20 ? 'relaxed' : index >= 80 ? 'all' : String(dominant);
    const evidence = questions.map((q,i)=>({ question:i+1, text:q.text, answer:q.options[answers[i]].text, score:q.options[answers[i]].score, axis:q.axis, read:q.options[answers[i]].score>=2?moments[i]:q.options[answers[i]].score===1?axes[q.axis].read:'你在这里选择了直接又放松的反应，生活本身就足够有趣。' }))
      .sort((a,b)=>b.score-a.score || a.question-b.question).slice(0,3);
    const level = index < 20 ? '原片直出' : index < 40 ? '偶尔开机' : index < 60 ? '局部豪化' : index < 80 ? '主角上线' : '全域开机';
    return { index, total, raw, values:raw.map(v=>Math.round(v/12*100)), dominant, key, type:types[key], evidence, level, tip:axes[dominant].tip };
  }
  function routeFor(type) { return questions.map(q=>q.options.findIndex(o=>o.score === (type === 'relaxed' ? 0 : type === 'all' || q.axis === Number(type) ? 3 : 1))); }
  root.JiahaoQuiz = { axes, questions, types, score, isAnswer, routeFor, version:1 };
})(globalThis);
