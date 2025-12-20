/**
 * LifeKlineWorkflow.js
 * 功能：调用 OneDay Workflow SDK 获取命理 K 线数据
 * 应用标识：八字排盘分析2 (916ca035-b39d-4989-8171-e445c7da9922)
 */

import { WorkflowClient } from '@ali/oneday-workflow-sdk';

const APP_ID = '916ca035-b39d-4989-8171-e445c7da9922';

const workflowClient = new WorkflowClient({
  headers: {
    'Authorization': APP_ID,
    'Content-Type': 'application/json',
  },
  baseUrl: 'https://1d.alibaba-inc.com/api/proxy/workflow/v1',
});

/**
 * 安全解析 JSON 字符串
 */
const parseJsonSafely = (jsonStr) => {
  if (typeof jsonStr !== 'string') return jsonStr;
  
  try {
    let cleanStr = jsonStr.trim();
    
    // 提取 Markdown 代码块中的 JSON
    const markdownMatch = cleanStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (markdownMatch) {
      cleanStr = markdownMatch[1];
    }
    
    // 提取 JSON 对象或数组
    const firstBrace = cleanStr.indexOf('{');
    const firstBracket = cleanStr.indexOf('[');
    
    let startIndex = -1;
    let endIndex = -1;
    
    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      startIndex = firstBrace;
      endIndex = cleanStr.lastIndexOf('}');
    } else if (firstBracket !== -1) {
      startIndex = firstBracket;
      endIndex = cleanStr.lastIndexOf(']');
    }
    
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      cleanStr = cleanStr.substring(startIndex, endIndex + 1);
    }
    
    return JSON.parse(cleanStr);
  } catch (error) {
    console.warn('JSON 解析失败:', error.message);
    return null;
  }
};

/**
 * 在对象中查找 timeline 数据
 */
const findTimelineInObject = (obj) => {
  if (!obj || typeof obj !== 'object') return null;
  
  for (const key in obj) {
    const value = obj[key];
    
    // 直接找到 timeline 数组
    if (key === 'timeline' && Array.isArray(value)) {
      return { ...obj, timeline: value };
    }
    
    // 递归查找嵌套对象
    if (typeof value === 'object' && value !== null) {
      if (value.timeline && Array.isArray(value.timeline)) {
        return value;
      }
      
      // 检查是否是时间线数组（包含 age 或 year 字段）
      if (Array.isArray(value) && value.length > 0 && (value[0].age || value[0].year)) {
        return { timeline: value };
      }
    }
    
    // 尝试解析字符串值
    if (typeof value === 'string') {
      const parsed = parseJsonSafely(value);
      if (parsed && parsed.timeline && Array.isArray(parsed.timeline)) {
        return parsed;
      }
    }
  }
  
  return null;
};

/**
 * 生成降级数据
 */
const generateFallbackData = (outputs) => {
  console.log('🎲 生成降级数据');
  
  const currentYear = new Date().getFullYear();
  const birthYear = outputs.birthyear || outputs.birth_year || currentYear - 30;
  const currentAge = currentYear - birthYear;
  
  // 生成基础时间线数据
  const timeline = Array.from({ length: Math.min(80, currentAge + 10) }, (_, index) => {
    const age = index + 1;
    const year = birthYear + age - 1;
    
    // 基于年龄生成模拟 K 线数据
    const baseValue = 50 + Math.sin(age * 0.1) * 15;
    const volatility = 5 + Math.random() * 8;
    
    const open = Math.round(baseValue + (Math.random() - 0.5) * volatility);
    const close = Math.round(baseValue + (Math.random() - 0.5) * volatility);
    const high = Math.round(Math.max(open, close) + Math.random() * volatility);
    const low = Math.round(Math.min(open, close) - Math.random() * volatility);
    
    // 生成干支
    const ganzhiTian = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const ganzhiDi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    const ganzhi = ganzhiTian[(year - 4) % 10] + ganzhiDi[(year - 4) % 12];
    
    return {
      age,
      year,
      ganzhi,
      open: Math.max(0, Math.min(100, open)),
      close: Math.max(0, Math.min(100, close)),
      high: Math.max(0, Math.min(100, high)),
      low: Math.max(0, Math.min(100, low)),
      summary: age <= currentAge ? `${age}岁流年运势` : `${age}岁运势预测`,
      higheventdesc: Math.random() > 0.8 ? '运势高峰期' : '',
      loweventdesc: Math.random() > 0.8 ? '需要谨慎的时期' : '',
      detailstory: `${age}岁时的人生阶段，需要关注个人发展和机遇把握。`
    };
  });
  
  return {
    timeline,
    username: outputs.username || "用户",
    birthyear: birthYear,
    destiny_title: "人生运势 K线图（模拟数据）"
  };
};

/**
 * 标准化数据格式
 */
const standardizeData = (data) => {
  if (!data || !data.timeline) return data;
  
  const standardizedTimeline = data.timeline.map((item, index) => {
    // 统一字段映射
    const standardItem = {
      ...item,
      age: Number(item.age) || index + 1,
      year: Number(item.year) || new Date().getFullYear() - 30 + index,
      open: Math.max(0, Math.min(100, Number(item.open) || 50)),
      close: Math.max(0, Math.min(100, Number(item.close) || 50)),
      high: Math.max(0, Math.min(100, Number(item.high) || 55)),
      low: Math.max(0, Math.min(100, Number(item.low) || 45)),
      ganzhi: String(item.ganzhi || item.gan_zhi || ''),
      summary: String(item.summary || item.description || item.desc || ''),
      higheventdesc: String(item.higheventdesc || item.high_event_desc || item.highlight || ''),
      loweventdesc: String(item.loweventdesc || item.low_event_desc || item.lowlight || ''),
      detailstory: String(item.detailstory || item.detail_story || item.story || '')
    };
    
    // 确保 K 线数据的逻辑正确性
    standardItem.high = Math.max(standardItem.high, standardItem.open, standardItem.close);
    standardItem.low = Math.min(standardItem.low, standardItem.open, standardItem.close);
    
    return standardItem;
  });
  
  return {
    ...data,
    timeline: standardizedTimeline,
    destiny_title: data.destiny_title || data.title || "流年运势 K线图"
  };
};

/**
 * 简化的数据提取函数 - 使用优先级顺序检查数据源
 */
const extractTimelineData = (outputs) => {
  console.log('🔍 开始解析 Workflow 输出:', outputs);
  
  if (!outputs) {
    console.log('❌ outputs 为空');
    return null;
  }
  
  // 优先级顺序的数据源检查
  const dataSources = [
    // 1. 直接检查顶层 timeline
    () => {
      if (outputs.timeline && Array.isArray(outputs.timeline)) {
        console.log('✅ 直接找到 timeline 数组');
        return outputs;
      }
      return null;
    },
    
    // 2. 检查 arg1 字段
    () => {
      if (outputs.arg1) {
        console.log('🔍 检查 arg1 字段');
        const parsed = parseJsonSafely(outputs.arg1);
        if (parsed && parsed.timeline && Array.isArray(parsed.timeline)) {
          console.log('✅ 从 arg1 中找到 timeline');
          return {
            ...parsed,
            username: outputs.username || parsed.username || "未知",
            birthyear: outputs.birthyear || parsed.birthyear,
            destiny_title: outputs.destiny_title || outputs.title || parsed.destiny_title || parsed.title
          };
        }
      }
      return null;
    },
    
    // 3. 在整个对象中查找
    () => {
      console.log('🔍 在对象中查找 timeline');
      const found = findTimelineInObject(outputs);
      if (found) {
        console.log('✅ 在对象中找到 timeline');
        return {
          ...found,
          username: outputs.username || found.username || "未知",
          birthyear: outputs.birthyear || found.birthyear
        };
      }
      return null;
    },
    
    // 4. 生成降级数据
    () => {
      console.log('🎲 使用降级数据');
      return generateFallbackData(outputs);
    }
  ];
  
  // 按优先级尝试每个数据源
  for (const getSource of dataSources) {
    try {
      const result = getSource();
      if (result && result.timeline && result.timeline.length > 0) {
        console.log(`✅ 数据源成功，timeline 长度: ${result.timeline.length}`);
        return standardizeData(result);
      }
    } catch (error) {
      console.warn('数据源失败:', error.message);
    }
  }
  
  console.log('❌ 所有数据源都失败');
  return null;
};

/**
 * 执行命理 K 线分析
 */
export const runLifeKlineAnalysis = async (params) => {
  const { year, month, day, hour, minute, gender, topic } = params;

  // 准备输入参数
  const inputs = {
    "birth_year": year,
    "birth_month": month,
    "birth_day": day,
    "birth_hour": hour,
    "birth_minute": minute,
    "gender": gender === '男' ? 1 : 0,
    "analysis_topi": topic || "整体命运格局" // 传递主题给 Workflow
  };

  // 获取当前用户信息
  const userWorkId = (window.ONEDAY_CONFIG || window.parent.ONEDAY_CONFIG)?.user?.workid || 'guest';

  console.log('🚀 开始调用 Workflow:', inputs);

  return new Promise(async (resolve, reject) => {
    // 设置超时机制 (5分钟)
    const timeoutId = setTimeout(() => {
      console.warn('⚠️ Workflow 调用超时');
      reject(new Error('天机演算超时，请刷新页面重试'));
    }, 300000);

    try {
      await workflowClient.runStream(
        {
          user: userWorkId,
          inputs
        },
        {
          onWorkflowStarted: (event) => {
            console.log('🔮 工作流开始:', event.data.id);
          },
          
          onNodeStarted: (event) => {
            console.log('⚙️ 节点开始:', event.data.title);
          },
          
          onNodeFinished: (event) => {
            console.log('✅ 节点完成:', event.data.title);
          },
          
          onWorkflowFinished: (event) => {
            console.log('🏁 工作流完成，状态:', event.data.status);
            
            const finalOutputs = event.data.outputs;
            const errorMessage = event.data.error;

            // 尝试解析数据
            let extractedData = null;
            if (finalOutputs) {
              extractedData = extractTimelineData(finalOutputs);
            }

            // 如果解析成功
            if (extractedData && extractedData.timeline && extractedData.timeline.length > 0) {
              console.log('✅ 成功获取数据');
              clearTimeout(timeoutId);
              
              // 优先使用 workflow 返回的标题，如果没有则根据 topic 生成
              const finalTitle = extractedData.destiny_title || extractedData.title || `${topic || '流年'}运势 K线图`;
              
              resolve({
                ...extractedData,
                destiny_title: finalTitle,
                user_name: extractedData.username || "用户",
                gender: gender === '男' ? 'male' : 'female',
                birth_year: year,
                current_age: new Date().getFullYear() - year,
                report: finalOutputs.report || finalOutputs.analysis_report || finalOutputs.summary || null
              });
            } else {
              // 解析失败
              console.warn('⚠️ 数据解析失败');
              clearTimeout(timeoutId);
              reject(new Error('天机演算数据解析失败，请刷新页面重试'));
            }
          },
          
          onWorkflowFailed: (event) => {
            console.error('❌ 工作流执行失败:', event);
            clearTimeout(timeoutId);
            reject(new Error('天机演算过程异常，请刷新页面重试'));
          }
        }
      );

    } catch (error) {
      console.error('❌ 调用工作流发生异常:', error);
      clearTimeout(timeoutId);
      reject(error);
    }
  });
};
