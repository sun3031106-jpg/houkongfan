import React from 'react';
import { stories } from './stories';
import GameCard from './components/GameCard';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-amber-400 flex flex-col items-center justify-start p-4 pt-12 font-sans relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.1)_0%,transparent_50%)]"></div>
      <div className="absolute top-20 right-20 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-amber-400/5 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-amber-400/8 rounded-full blur-2xl animate-pulse animation-delay-500"></div>
      
      {/* 页面内容 */}
      <div className="relative z-10 w-full max-w-6xl">
        {/* 标题区域 */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 text-amber-400 drop-shadow-lg animate-pulse relative inline-block">
            <span className="relative z-10">AI 海龟汤</span>
            <span className="absolute inset-0 blur-md bg-amber-400/30 animate-pulse animation-delay-300"></span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 text-slate-300 max-w-2xl mx-auto leading-relaxed">
            欢迎来到神秘的海龟汤世界！在这里，真相永远隐藏在表象之下。你将通过提问来揭开每个故事的真相，
            而AI只会用「是」、「否」或「无关」来回答你。准备好挑战你的推理能力了吗？
          </p>
        </div>

        {/* 故事卡片区域 */}
        <div className="mt-6 md:mt-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center text-amber-400 flex items-center justify-center gap-3 animate-fade-in animation-delay-300">
            <span className="w-8 sm:w-12 h-1 bg-amber-400 rounded-full animate-pulse"></span>
            选择你的谜题
            <span className="w-8 sm:w-12 h-1 bg-amber-400 rounded-full animate-pulse animation-delay-300"></span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {stories.map((story, index) => (
              <GameCard key={story.id} story={story} index={index} />
            ))}
          </div>
        </div>

        {/* 游戏规则提示 */}
        <div className="mt-12 md:mt-16 bg-slate-800/80 border border-slate-700 rounded-lg p-4 sm:p-6 shadow-lg backdrop-blur-sm animate-fade-in animation-delay-600">
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-amber-400 flex items-center gap-2">
            <span className="text-2xl">📋</span>
            游戏规则
          </h3>
          <ul className="text-slate-300 space-y-2 text-sm md:text-base">
            <li className="flex items-start gap-2 transition-all duration-200 hover:translate-x-1">
              <span className="text-amber-400 font-bold mt-1">•</span>
              <span>根据汤面（故事表面）提出问题，AI只能回答「是」、「否」或「无关」</span>
            </li>
            <li className="flex items-start gap-2 transition-all duration-200 hover:translate-x-1">
              <span className="text-amber-400 font-bold mt-1">•</span>
              <span>通过提问逐步缩小范围，推理出完整的故事真相</span>
            </li>
            <li className="flex items-start gap-2 transition-all duration-200 hover:translate-x-1">
              <span className="text-amber-400 font-bold mt-1">•</span>
              <span>如果遇到困难，可以查看提示或直接揭晓答案</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
