import type { TStory } from './stories';

// 后端服务API地址 - 从环境变量获取，默认使用本地地址
const API_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:3001/api/chat';

export const askAI = async (question: string, story: TStory): Promise<string> => {
  try {
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
    // 重新抛出错误，让调用者知道发生了什么
    throw error;
  }
};
