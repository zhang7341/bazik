import dayjs from 'dayjs';

    // 模拟干支纪年 (简化版)
    const getGanzhi = (year) => {
      const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
      const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
      const offset = year - 4;
      const stem = heavenlyStems[offset % 10];
      const branch = earthlyBranches[offset % 12];
      return `${stem}${branch}`;
    };

    // 随机生成运势文案
    const summaries = [
      "贵人相助，触底反弹", "驿马星动，奔波劳碌", "桃花泛滥，需防烂桃花", 
      "财库大开，投资获利", "伏吟之年，宜静不宜动", "文昌入命，学业有成",
      "冲犯太岁，诸事小心", "紫微星照，升职加薪", "天乙贵人，逢凶化吉"
    ];

    const events = [
      "获得重要奖项", "遭遇情感挫折", "创业获得融资", "身体抱恙住院", 
      "结识终身伴侣", "购置首套房产", "长途旅行感悟", "亲人离世打击"
    ];

    export const generateLifeData = (birthYear, birthMonth, birthDay, birthHour, gender) => {
      const currentYear = new Date().getFullYear();
      const currentAge = currentYear - birthYear;
      const totalYears = 100; // 预测到100岁
      
      const timeline = [];
      let lastClose = 50; // 初始运势分

      for (let i = 0; i <= totalYears; i++) {
        const year = birthYear + i;
        const age = i;
        
        // 随机生成 OHLC 数据
        // 波动幅度
        const volatility = Math.random() * 20 + 5; 
        const change = (Math.random() - 0.5) * volatility;
        
        const open = lastClose;
        let close = Math.max(10, Math.min(95, open + change)); // 限制在 10-95 之间
        
        // 确保 High 和 Low 包裹 Open 和 Close
        const high = Math.max(open, close) + Math.random() * 5;
        const low = Math.min(open, close) - Math.random() * 5;

        // 关键节点逻辑 (每10年或随机)
        const isKey = i % 10 === 0 || Math.random() > 0.9;
        
        timeline.push({
          age,
          year,
          ganzhi: getGanzhi(year),
          open: parseFloat(open.toFixed(1)),
          close: parseFloat(close.toFixed(1)),
          high: parseFloat(high.toFixed(1)),
          low: parseFloat(low.toFixed(1)),
          is_key_event: isKey,
          trend: close > open ? 'up' : 'down',
          summary: summaries[Math.floor(Math.random() * summaries.length)],
          high_event_desc: events[Math.floor(Math.random() * events.length)],
          low_event_desc: events[Math.floor(Math.random() * events.length)],
          detail_story: `此年${getGanzhi(year)}，流年运势${close > open ? '上扬' : '下行'}。${summaries[Math.floor(Math.random() * summaries.length)]}。需注意${events[Math.floor(Math.random() * events.length)]}。凡事顺势而为，方得始终。`
        });

        lastClose = close;
      }

      return {
        user_name: "User",
        gender: gender === '男' ? 'male' : 'female',
        birth_year: birthYear,
        current_age: currentAge,
        destiny_title: "紫微星照，大器晚成之命",
        timeline
      };
    };
