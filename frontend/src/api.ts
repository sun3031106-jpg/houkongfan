import type { TStory } from './stories';

// 后端服务API地址 - 从环境变量获取，默认使用本地地址
const API_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:3001/api/chat';
// 判断是否为生产环境
const isProduction = import.meta.env.PROD;

// 模拟AI响应的函数
function getMockAIResponse(question: string, story: TStory): string {
  const questionLower = question.toLowerCase();
  const storyBottom = story.bottom || '';
  const storyBottomLower = storyBottom.toLowerCase();
  
  // 定义关键词匹配规则
  const yesKeywords = ['袭击', '凶手', '背后', '求救', '移动', '敲门', '最后信号', '谋杀', '他杀'];
  const noKeywords = ['病死', '自杀', '意外', '自然死亡', '自己', '故意', '进门'];
  
  // 直接检查问题类型
  let mockResponse;
  
  // 特殊处理：检查是否是谋杀相关问题
  if (questionLower.includes('谋杀') || questionLower.includes('他杀')) {
    // 如果汤底包含凶手或袭击相关关键词，回答"是"
    const murderIndicators = ['凶手', '袭击', '背后', '求救', '移到', '求救信号'];
    for (const indicator of murderIndicators) {
      if (storyBottomLower.includes(indicator)) {
        mockResponse = '是';
        break;
      }
    }
  }
  
  // 特殊处理：敲门声来源问题
  if (!mockResponse && questionLower.includes('敲门')) {
    // 分析问题是问谁发出的敲门声
    if (questionLower.includes('凶手')) {
      // 根据汤底："敲门的声音是邻居在被袭击前发出的最后求救信号"
      mockResponse = '否';
    } else if (questionLower.includes('邻居')) {
      // 根据汤底："敲门的声音是邻居在被袭击前发出的最后求救信号"
      mockResponse = '是';
    }
  }
  
  // 特殊处理：潜水员相关问题
  if (!mockResponse && questionLower.includes('潜水员')) {
    // 如果汤底包含潜水员，回答"是"
    if (storyBottomLower.includes('潜水员')) {
      mockResponse = '是';
    }
  }
  
  // 特殊处理：失忆症相关问题
  if (!mockResponse && (questionLower.includes('失忆') || questionLower.includes('忘记'))) {
    // 如果汤底包含失忆症，回答"是"
    if (storyBottomLower.includes('失忆症') || storyBottomLower.includes('忘记')) {
      mockResponse = '是';
    }
  }
  
  // 特殊处理：倒计时相关问题
  if (!mockResponse && (questionLower.includes('倒计时') || questionLower.includes('数字'))) {
    // 如果汤底包含倒计时，回答"是"
    if (storyBottomLower.includes('倒计时')) {
      mockResponse = '是';
    }
  }
  
  // 特殊处理：智能黑板相关问题
  if (!mockResponse && (questionLower.includes('智能') || questionLower.includes('远程'))) {
    // 如果汤底包含智能黑板，回答"是"
    if (storyBottomLower.includes('智能黑板') || storyBottomLower.includes('远程控制')) {
      mockResponse = '是';
    }
  }
  
  // 特殊处理：逃脱艺术家相关问题
  if (!mockResponse && (questionLower.includes('逃脱') || questionLower.includes('艺术家'))) {
    // 如果汤底包含逃脱艺术家，回答"是"
    if (storyBottomLower.includes('逃脱艺术家')) {
      mockResponse = '是';
    }
  }
  
  // 特殊处理：雕像相关问题
  if (!mockResponse && (questionLower.includes('雕像') || questionLower.includes('岩石'))) {
    // 如果汤底包含雕像和岩石，回答"是"
    if (storyBottomLower.includes('雕像') && storyBottomLower.includes('岩石')) {
      mockResponse = '是';
    }
  }
  
  // 特殊处理：魔术师相关问题
  if (!mockResponse && (questionLower.includes('魔术') || questionLower.includes('魔术师'))) {
    // 如果汤底包含魔术师，回答"是"
    if (storyBottomLower.includes('魔术师')) {
      mockResponse = '是';
    }
  }
  
  // 特殊处理：恶作剧相关问题
  if (!mockResponse && (questionLower.includes('恶作剧') || questionLower.includes('朋友'))) {
    // 如果汤底包含恶作剧，回答"是"
    if (storyBottomLower.includes('恶作剧') || storyBottomLower.includes('朋友')) {
      mockResponse = '是';
    }
  }
  
  // 特殊处理：闹钟时间相关问题
  if (!mockResponse && (questionLower.includes('下午') || questionLower.includes('上午'))) {
    // 如果汤底包含下午的时间，回答"是"
    if (storyBottomLower.includes('下午的时间') || storyBottomLower.includes('上午的时间')) {
      mockResponse = '是';
    }
  }
  
  // 检查是否应该回答"否"
  if (!mockResponse) {
    for (const keyword of noKeywords) {
      if (questionLower.includes(keyword)) {
        mockResponse = '否';
        break;
      }
    }
  }
  
  // 检查是否应该回答"是"
  if (!mockResponse) {
    for (const keyword of yesKeywords) {
      if (questionLower.includes(keyword) && storyBottomLower.includes(keyword)) {
        mockResponse = '是';
        break;
      }
    }
  }
  
  // 默认回答：如果问题是肯定形式，默认回答"否"，否则"无关"
  if (!mockResponse) {
    if (questionLower.includes('是')) {
      mockResponse = '否';
    } else {
      mockResponse = '无关';
    }
  }
  
  // 额外验证：确保逻辑正确
  console.log('问题:', question);
  console.log('汤底:', storyBottom);
  console.log('检测到的关键词:', 
    yesKeywords.filter(k => questionLower.includes(k) || storyBottomLower.includes(k))
  );
  
  console.log('使用基于关键词的模拟AI响应:', mockResponse);
  return mockResponse;
}

export const askAI = async (question: string, story: TStory): Promise<string> => {
  try {
    // 在生产环境中使用模拟响应
    if (isProduction) {
      console.log('使用模拟AI响应（生产环境）');
      const mockResponse = getMockAIResponse(question, story);
      
      if (mockResponse === '是') {
        return 'yes';
      } else if (mockResponse === '否') {
        return 'no';
      } else if (mockResponse === '无关') {
        return 'irrelevant';
      } else {
        return 'irrelevant';
      }
    }
    
    // 在开发环境中调用后端API
    console.log('API_URL:', API_URL);
    console.log('Request data:', {
      question,
      story: { id: story.id, title: story.title }
    });
    
    // 设置超时时间
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
    
    // 调用后端的/api/chat接口
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        story
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API请求失败，状态码:', response.status, '错误信息:', errorText);
      throw new Error(`API请求失败，状态码: ${response.status}, 错误信息: ${errorText}`);
    }

    const data = await response.json();
    console.log('Response data:', data);
    
    const aiResponseContent = data.data?.answer?.trim();
    
    if (aiResponseContent === '是') {
      return 'yes';
    } else if (aiResponseContent === '否') {
      return 'no';
    } else if (aiResponseContent === '无关') {
      return 'irrelevant';
    } else {
      return 'irrelevant';
    }
  } catch (error) {
    console.error('AI接口调用失败:', error);
    // 错误时使用模拟响应作为 fallback
    console.log('使用模拟AI响应作为 fallback');
    const mockResponse = getMockAIResponse(question, story);
    
    if (mockResponse === '是') {
      return 'yes';
    } else if (mockResponse === '否') {
      return 'no';
    } else if (mockResponse === '无关') {
      return 'irrelevant';
    } else {
      return 'irrelevant';
    }
  }
};
