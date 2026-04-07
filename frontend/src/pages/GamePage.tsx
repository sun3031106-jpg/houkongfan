import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { stories, type TStory } from '../stories';
import { askAI } from '../api'; // 引入askAI函数
import ChatBox from '../components/ChatBox'; // 引入ChatBox组件
import Modal from '../components/Modal'; // 引入Modal组件

interface ChatMessage {
  type: 'player' | 'ai';
  text: string;
  answer?: 'yes' | 'no' | 'irrelevant';
}

const GamePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [story, setStory] = useState<TStory | undefined>(undefined);
  const [question, setQuestion] = useState<string>(''); // 保持question状态，由GamePage管理
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [unansweredCount, setUnansweredCount] = useState<number>(0); // 连续无关回答计数
  const [noCount, setNoCount] = useState<number>(0); // 连续否回答计数
  const [combinedCount, setCombinedCount] = useState<number>(0); // 否和无关的总计数
  const [usedHints, setUsedHints] = useState<number[]>([]); // 跟踪已使用的提示索引
  // 模态框状态
  const [exitModalOpen, setExitModalOpen] = useState<boolean>(false);
  const [hintModalOpen, setHintModalOpen] = useState<boolean>(false);
  // Removed showAnswer state as ResultPage will handle it

  useEffect(() => {
    const selectedStory = stories.find((s) => s.id === id);
    if (selectedStory) {
      setStory(selectedStory);
      setChatHistory([
        { type: 'ai', text: `欢迎来到海龟汤游戏！请根据以下汤面开始提问：\n\n${selectedStory.surface}` },
      ]);
    } else {
      navigate('/'); // Redirect to home if story not found
    }
  }, [id, navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else if (!isRunning && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleExitGame = () => {
    setExitModalOpen(true);
  };

  const handleExitConfirm = () => {
    navigate('/');
    setExitModalOpen(false);
  };

  const handleExitCancel = () => {
    setExitModalOpen(false);
  };

  const handleQuestionSubmit = async (quickQuestionText?: string) => {
    const currentQuestion = quickQuestionText || question.trim();

    if (currentQuestion === '' || !story) return;

    const newQuestion: ChatMessage = { type: 'player', text: currentQuestion };
    setChatHistory((prev) => [...prev, newQuestion]);
    setQuestionCount((prev) => prev + 1);
    setQuestion(''); // Clear the input box after sending
    setIsThinking(true);

    try {
      const aiAnswer = await askAI(currentQuestion, story); // 调用askAI函数
      let aiResponse: 'yes' | 'no' | 'irrelevant';

      // 根据askAI的返回值判断aiResponse
      if (aiAnswer === 'yes' || aiAnswer === 'no' || aiAnswer === 'irrelevant') {
        aiResponse = aiAnswer;
      } else {
        // 如果askAI返回了意料之外的字符串，默认处理为'irrelevant'
        aiResponse = 'irrelevant';
      }

      const aiMessage: ChatMessage = {
        type: 'ai',
        text: '', // 简化AI消息文本内容，只保留标签显示
        answer: aiResponse,
      };

      setChatHistory((prev) => [...prev, aiMessage]);

      // 计数逻辑更新
      if (aiResponse === 'irrelevant') {
        const newUnansweredCount = unansweredCount + 1;
        setUnansweredCount(newUnansweredCount);
        setNoCount(0); // 重置否回答计数
        
        const newCombinedCount = combinedCount + 1;
        setCombinedCount(newCombinedCount);
        
        // 检查是否需要触发提示
        checkIfNeedHint(newUnansweredCount, 0, newCombinedCount);
        
      } else if (aiResponse === 'no') {
        const newNoCount = noCount + 1;
        setNoCount(newNoCount);
        setUnansweredCount(0); // 重置无关回答计数
        
        const newCombinedCount = combinedCount + 1;
        setCombinedCount(newCombinedCount);
        
        // 检查是否需要触发提示
        checkIfNeedHint(0, newNoCount, newCombinedCount);
        
      } else {
        // 回答为yes，重置所有计数
        setUnansweredCount(0);
        setNoCount(0);
        setCombinedCount(0);
      }
    } catch (error) {
      console.error('AI API 调用失败:', error);
      // 显示更具体的错误信息
      const errorMessage = error instanceof Error ? 
        `AI 服务暂时不可用: ${error.message}` : 
        'AI 服务暂时不可用，请稍后再试。';
      setChatHistory((prev) => [
        ...prev,
        { type: 'ai', text: errorMessage }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  // 检查是否需要给出提示
  const checkIfNeedHint = (currentUnanswered: number, currentNo: number, currentCombined: number) => {
    // 检查触发条件
    if (currentUnanswered >= 3 || currentNo >= 3 || currentCombined >= 5) {
      setTimeout(() => {
        // 打开提示模态框
        setHintModalOpen(true);
      }, 500);
    }
  };

  const handleHintConfirm = () => {
    handleGiveHint();
    setHintModalOpen(false);
    // 重置所有计数
    setUnansweredCount(0);
    setNoCount(0);
    setCombinedCount(0);
  };

  const handleHintCancel = () => {
    // 用户不需要提示，鼓励用户继续
    setChatHistory(prev => [
      ...prev,
      { type: 'ai', text: '好哒～相信你一定可以的👍' }
    ]);
    setHintModalOpen(false);
    // 重置所有计数
    setUnansweredCount(0);
    setNoCount(0);
    setCombinedCount(0);
  };

  // 添加提示用完模态框状态
  const [hintExhaustedModalOpen, setHintExhaustedModalOpen] = useState<boolean>(false);

  const handleGiveHint = () => {
    if (!story) return;

    // 获取所有未使用的提示索引
    const availableHintIndices = story.hints
      .map((_, index) => index)
      .filter(index => !usedHints.includes(index));

    if (availableHintIndices.length === 0) {
      // 如果所有提示都已使用
      setHintExhaustedModalOpen(true);
      return;
    }

    // 随机选择一个未使用的提示
    const randomIndex = Math.floor(Math.random() * availableHintIndices.length);
    const selectedHintIndex = availableHintIndices[randomIndex];
    const selectedHint = story.hints[selectedHintIndex];

    // 将选择的提示索引添加到已使用列表
    setUsedHints(prev => [...prev, selectedHintIndex]);

    // 添加提示消息到聊天记录
    setChatHistory(prev => [
      ...prev,
      { type: 'ai', text: selectedHint }
    ]);
  };

  const handleViewAnswer = () => {
    if (story) {
      // Save chat history to localStorage for ResultPage
      localStorage.setItem(`chatHistory_${story.id}`, JSON.stringify(chatHistory));
      navigate(`/result/${story.id}`); // Navigate to ResultPage
      setIsRunning(false);
    }
  };

  // const handleNextQuestion = () => {
  //   alert('下一题功能待实现！');
  //   // TODO: Implement logic to go to the next random story of the same difficulty or back to story list
  // };

  if (!story) {
    return <div className="min-h-screen bg-slate-900 text-amber-400 flex items-center justify-center">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-amber-400 flex flex-col p-4 md:p-8 font-sans relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(245,158,11,0.08)_0%,transparent_50%)]"></div>
      <div className="absolute top-10 right-10 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-amber-400/3 rounded-full blur-3xl"></div>

      {/* 退出游戏模态框 */}
      <Modal
        isOpen={exitModalOpen}
        title="确认退出"
        message="确定要退出游戏吗？游戏进度将不会保存。"
        onConfirm={handleExitConfirm}
        onCancel={handleExitCancel}
        confirmText="确认退出"
        cancelText="继续游戏"
        confirmColor="red"
      />

      {/* 提示模态框 */}
      <Modal
        isOpen={hintModalOpen}
        title="遇到瓶颈了吗？"
        message="喵～看来你遇到瓶颈了呢😺\n需要给你一点小提示吗？"
        onConfirm={handleHintConfirm}
        onCancel={handleHintCancel}
        confirmText="需要提示"
        cancelText="继续思考"
        confirmColor="indigo"
      />

      {/* 提示用完模态框 */}
      <Modal
        isOpen={hintExhaustedModalOpen}
        title="提示用完啦～"
        message="所有提示都已用完，你已经很接近答案了，继续加油哦！"
        onConfirm={() => setHintExhaustedModalOpen(false)}
        onCancel={() => setHintExhaustedModalOpen(false)}
        confirmText="好的"
        cancelText="好的"
        confirmColor="amber"
      />
      
      {/* 顶部信息栏 */}
      <div className="relative z-10 flex flex-wrap justify-between items-center bg-slate-800/90 backdrop-blur-sm p-4 rounded-lg shadow-xl mb-8 border border-slate-700">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-amber-400 relative inline-block">
            <span className="relative z-10">AI 海龟汤</span>
            <span className="absolute inset-0 blur-md bg-amber-400/30 animate-pulse"></span>
          </h1>
          <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded-full">DeepSeek API</span>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
          <div className="bg-slate-700/80 px-3 py-1 rounded-full text-sm">
            <span className="text-slate-300">提问次数:</span>
            <span className="ml-1 font-semibold">{questionCount}</span>
          </div>
          <div className="bg-slate-700/80 px-3 py-1 rounded-full text-sm">
            <span className="text-slate-300">用时:</span>
            <span className="ml-1 font-semibold">{formatTime(timer)}</span>
          </div>
          <button
            onClick={handleExitGame}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            结束游戏
          </button>
        </div>
      </div>

      {/* 游戏内容区域 */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 汤面区域 */}
        <div className="bg-slate-800/90 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-slate-700 flex flex-col">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-10 h-1 bg-amber-400 rounded-full"></span>
            <h2 className="text-2xl md:text-3xl font-bold text-amber-400">谜题</h2>
            <span className="w-10 h-1 bg-amber-400 rounded-full"></span>
          </div>
          <h3 className="text-xl md:text-2xl font-semibold text-slate-200 mb-6 text-center">{story.title}</h3>
          <div className="flex-1 bg-slate-900/70 p-6 rounded-lg border border-slate-600 shadow-inner">
            <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap italic">
              {story.surface}
            </p>
          </div>
        </div>

        {/* 聊天区域 */}
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-700 overflow-hidden">
          <ChatBox
            chatHistory={chatHistory}
            question={question}
            isThinking={isThinking}
            onQuestionChange={setQuestion}
            onQuestionSubmit={handleQuestionSubmit}
            story={story}
          />
        </div>
      </div>

      {/* 底部操作按钮 */}
      <div className="relative z-10 flex justify-center gap-6">
        <button
          onClick={handleGiveHint}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg border border-indigo-500"
        >
          需要提示
        </button>
        <button
          onClick={handleViewAnswer}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg border border-purple-500"
        >
          查看汤底
        </button>
        {/* <button
          onClick={handleNextQuestion}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg border border-green-500"
        >
          下一题
        </button> */}
      </div>
    </div>
  );
};

export default GamePage;
