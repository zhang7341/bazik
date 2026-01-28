/**
 * LifeKlineWorkflow.js
 * 功能：生成命理 K 线模拟数据（公网部署版本）
 */

/**
 * 生成模拟 K 线数据
 */
const generateMockData = (params) => {
  const { year, month, day, hour, gender, topic } = params;
  
  const currentYear = new Date().getFullYear();
  const birthYear = year || currentYear - 30;
  const currentAge = currentYear - birthYear;
  
  // 天干地支
  const ganzhiTian = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const ganzhiDi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  
  // 生成运势描述
  const summaries = [
    '平稳发展期，宜守不宜攻',
    '贵人相助，事业有望突破',
    '财运亨通，投资需谨慎',
    '感情运势上升，桃花旺盛',
    '学业进步，考试顺利',
    '健康需注意，多加休息',
    '人际关系和谐，合作顺利',
    '变动之年，需灵活应对',
    '稳中求进，脚踏实地',
    '运势高涨，把握机遇'
  ];
  
  const highEvents = [
    '事业突破期',
    '财运高峰',
    '贵人相助',
    '学业有成',
    '感情甜蜜',
    '健康良好',
    ''
  ];
  
  const lowEvents = [
    '需谨慎决策',
    '注意健康',
    '财务需节制',
    '人际需圆融',
    '压力较大',
    ''
  ];
  
  const detailStories = [
    '此年运势平稳，宜稳扎稳打，不宜冒进。事业上有贵人相助，但需注意人际关系的维护。',
    '财运亨通之年，投资理财可有所收获，但切忌贪心。感情方面桃花运旺，单身者有望脱单。',
    '学业事业双丰收，努力付出终有回报。健康方面需注意作息规律，避免过度劳累。',
    '变动之年，可能面临工作或生活上的转变。保持积极心态，灵活应对各种挑战。',
    '人际关系和谐，合作项目顺利推进。财务状况稳定，可适当进行长期投资规划。'
  ];
  
  // 基于出生信息生成种子
  const seed = (year * 10000 + month * 100 + day + hour) % 1000;
  const seededRandom = (index) => {
    const x = Math.sin(seed + index) * 10000;
    return x - Math.floor(x);
  };
  
  // 生成时间线数据
  const timeline = Array.from({ length: Math.min(85, currentAge + 15) }, (_, index) => {
    const age = index + 1;
    const itemYear = birthYear + age - 1;
    
    // 基于年龄和种子生成 K 线数据
    const baseValue = 50 + Math.sin(age * 0.15 + seed * 0.01) * 20;
    const volatility = 8 + seededRandom(age * 3) * 12;
    
    const open = Math.round(baseValue + (seededRandom(age * 7) - 0.5) * volatility);
    const close = Math.round(baseValue + (seededRandom(age * 11) - 0.5) * volatility);
    const high = Math.round(Math.max(open, close) + seededRandom(age * 13) * volatility * 0.8);
    const low = Math.round(Math.min(open, close) - seededRandom(age * 17) * volatility * 0.8);
    
    // 生成干支
    const ganzhi = ganzhiTian[(itemYear - 4) % 10] + ganzhiDi[(itemYear - 4) % 12];
    
    // 选择描述文本
    const summaryIndex = Math.floor(seededRandom(age * 19) * summaries.length);
    const highIndex = Math.floor(seededRandom(age * 23) * highEvents.length);
    const lowIndex = Math.floor(seededRandom(age * 29) * lowEvents.length);
    const detailIndex = Math.floor(seededRandom(age * 31) * detailStories.length);
    
    return {
      age,
      year: itemYear,
      ganzhi,
      open: Math.max(10, Math.min(95, open)),
      close: Math.max(10, Math.min(95, close)),
      high: Math.max(15, Math.min(100, high)),
      low: Math.max(5, Math.min(90, low)),
      summary: summaries[summaryIndex],
      higheventdesc: seededRandom(age * 37) > 0.6 ? highEvents[highIndex] : '',
      loweventdesc: seededRandom(age * 41) > 0.7 ? lowEvents[lowIndex] : '',
      detailstory: detailStories[detailIndex]
    };
  });
  
  // 确保 K 线数据逻辑正确
  timeline.forEach(item => {
    item.high = Math.max(item.high, item.open, item.close);
    item.low = Math.min(item.low, item.open, item.close);
  });
  
  return {
    timeline,
    username: "用户",
    birthyear: birthYear,
    destiny_title: `${topic || '流年'}运势 K线图`
  };
};

/**
 * 生成模拟报告
 */
const generateMockReport = (params) => {
  const { year, gender, topic } = params;
  const genderText = gender === '男' ? '男命' : '女命';
  
  return `## ${topic || '整体命运'}分析报告

### 命主信息
- 出生年份：${year}年
- 性别：${genderText}

### 总体运势概述
根据命理分析，命主整体运势呈现稳中有升的态势。人生道路虽有起伏，但总体向好。建议把握关键节点，顺势而为。

### 重要年份提示
- **青年期**：学业事业打基础的关键时期，宜勤奋努力
- **中年期**：事业发展的黄金阶段，有望取得重要突破
- **成熟期**：收获与沉淀并重，注重健康与家庭

### 建议
保持积极乐观的心态，把握每一个机遇，人生必将精彩纷呈。

---
*本报告仅供娱乐参考*`;
};

/**
 * 执行命理 K 线分析（模拟版本）
 */
export const runLifeKlineAnalysis = async (params) => {
  const { year, month, day, hour, minute, gender, topic } = params;

  console.log('🚀 开始生成模拟数据:', params);

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

  try {
    const data = generateMockData(params);
    const report = generateMockReport(params);
    
    console.log('✅ 模拟数据生成完成:', {
      timelineLength: data.timeline.length,
      title: data.destiny_title
    });

    return {
      ...data,
      user_name: "用户",
      gender: gender === '男' ? 'male' : 'female',
      birth_year: year,
      current_age: new Date().getFullYear() - year,
      report: report
    };
  } catch (error) {
    console.error('❌ 数据生成失败:', error);
    throw new Error('数据生成失败，请刷新页面重试');
  }
};
