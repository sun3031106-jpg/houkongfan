import React, { useEffect, useRef, useState } from 'react';
import Message from './Message';
import { type TStory } from '../stories';

// 定义 ChatMessage 接口
interface ChatMessage {
  type: 'player' | 'ai';
  text: string;
  answer?: 'yes' | 'no' | 'irrelevant';
}

interface ChatBoxProps {
  chatHistory: ChatMessage[];
  question: string;
  isThinking: boolean;
  onQuestionChange: (q: string) => void;
  onQuestionSubmit: (q?: string) => void;
  story: TStory; // 添加story属性
}

const ChatBox: React.FC<ChatBoxProps> = ({
  chatHistory,
  question,
  isThinking,
  onQuestionChange,
  onQuestionSubmit,
  story,
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 消息自动滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isThinking]);

  // 显示错误消息后自动隐藏
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // 根据故事生成相关的快速提问
  const generateQuickQuestions = () => {
    const baseQuestions = ['有其他人吗？', '是自然现象吗？', '是人为造成的吗？'];
    
    // 根据不同的故事ID生成相关问题
    switch (story.id) {
      case '1': // 海边的脚印
        return [
          ...baseQuestions,
          '脚印是人类留下的吗？',
          '脚印是被海水冲掉的吗？',
          '这个人是潜水员吗？'
        ];
      case '2': // 深夜的敲门声
        return [
          ...baseQuestions,
          '敲门的是邻居本人吗？',
          '邻居是被谋杀的吗？',
          '凶手在现场吗？'
        ];
      case '3': // 消失的雨伞
        return [
          ...baseQuestions,
          '雨伞是被偷了吗？',
          '这个人忘记带雨伞了吗？',
          '他是故意丢弃雨伞的吗？'
        ];
      case '4': // 镜子中的数字
        return [
          ...baseQuestions,
          '数字是倒计时吗？',
          '数字是朋友写的吗？',
          '朋友生病了吗？'
        ];
      case '5': // 空荡的教室
        return [
          ...baseQuestions,
          '黑板是智能黑板吗？',
          '写字的是老师吗？',
          '有人在远程控制吗？'
        ];
      case '6': // 锁着的房间
        return [
          ...baseQuestions,
          '他是自己把自己锁在里面的吗？',
          '房间有通风口吗？',
          '他是逃脱艺术家吗？'
        ];
      case '7': // 哭泣的雕像
        return [
          ...baseQuestions,
          '雕像是用特殊材料做的吗？',
          '眼泪是雨水吗？',
          '小镇的奇怪事情和雕像有关吗？'
        ];
      case '8': // 消失的乘客
        return [
          ...baseQuestions,
          '乘客是自己离开的吗？',
          '乘客是魔术师吗？',
          '这是一场表演吗？'
        ];
      case '9': // 古老的信件
        return [
          ...baseQuestions,
          '信件是真的古老吗？',
          '有人提前放好信件吗？',
          '这是朋友的恶作剧吗？'
        ];
      case '10': // 不响的闹钟
        return [
          ...baseQuestions,
          '闹钟设置正确吗？',
          '电池没电了吗？',
          '闹钟设置成了下午的时间吗？'
        ];
      default:
        return baseQuestions;
    }
  };

  // 快速提问按钮的点击处理
  const handleQuickQuestion = (quickQuestionText: string) => {
    onQuestionSubmit(quickQuestionText);
  };

  // 输入框回车发送
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (question.trim()) {
        onQuestionSubmit();
      } else {
        showErrorMessage('请输入问题后再发送！');
      }
    }
  };

  // 发送按钮点击处理
  const handleSubmit = () => {
    if (question.trim()) {
      onQuestionSubmit();
    } else {
      showErrorMessage('请输入问题后再发送！');
    }
  };

  // 显示错误消息
  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setShowError(true);
  };

  return (
    <div className="bg-slate-800 p-4 md:p-6 rounded-lg shadow-lg flex flex-col h-full relative">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-amber-400 flex items-center gap-2">
        <span>💬 对话区</span>
      </h2>
      
      {/* 错误提示 */}
      {showError && (
        <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 animate-fade-in">
          <p className="text-sm font-medium">{errorMessage}</p>
        </div>
      )}
      
      {/* 消息列表 */}
      <div 
        ref={chatContainerRef} 
        className="flex-1 overflow-y-auto space-y-4 p-2 pr-3"
      >
        {/* 空状态提示 */}
        {chatHistory.length === 0 && !isThinking && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mb-4">
              <span className="text-2xl">🗨️</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">还没有消息</h3>
            <p className="text-slate-400 mb-6">开始提问，揭开海龟汤的真相吧！</p>
            <div className="flex gap-2 flex-wrap justify-center">
              {generateQuickQuestions().slice(0, 2).map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1 rounded-full text-xs transition-all duration-300"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* 消息列表 */}
        {chatHistory.map((msg, index) => (
          <div 
            key={index} 
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <Message
              role={msg.type === 'player' ? 'user' : 'ai'}
              content={msg.text}
              answer={msg.type === 'ai' ? msg.answer : undefined}
            />
          </div>
        ))}
        
        {/* AI思考状态 */}
        {isThinking && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex-shrink-0 mr-3 mt-1">
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold shadow-md animate-pulse">
                AI
              </div>
            </div>
            <div className="bg-slate-700 text-slate-200 p-4 rounded-lg rounded-bl-none shadow-lg">
              <div className="flex items-center gap-2">
                <span className="animate-pulse">思考中</span>
                <span className="flex gap-1">
                  <span className="animate-ping-slow">•</span>
                  <span className="animate-ping-slow animation-delay-300">•</span>
                  <span className="animate-ping-slow animation-delay-600">•</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 快速提问按钮 */}
      <div className="mt-4 flex flex-wrap gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {generateQuickQuestions().map((question, index) => (
          <button
            key={index}
            onClick={() => handleQuickQuestion(question)}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-full text-sm transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            disabled={isThinking}
          >
            {question}
          </button>
        ))}
      </div>

      {/* 输入框和发送按钮 */}
      <div className="mt-4 flex items-center gap-3 flex-wrap">
        <input
          ref={inputRef}
          type="text"
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入你的问题..."
          className="flex-1 min-w-[180px] p-4 rounded-lg bg-slate-700 text-slate-200 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-slate-400 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isThinking}
          autoFocus
        />
        <button
          onClick={handleSubmit}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-4 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
          disabled={isThinking || !question.trim()}
        >
          <span className="flex items-center gap-2">
            <span>发送</span>
            <span className="hidden md:inline">→</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
