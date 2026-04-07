import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { stories, type TStory } from '../stories';

interface ChatMessage {
  type: 'player' | 'ai';
  text: string;
  answer?: 'yes' | 'no' | 'irrelevant';
}

const ResultPage: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<TStory | undefined>(undefined);
  const [reveal, setReveal] = useState(false);
  const [showBottom, setShowBottom] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const selectedStory = stories.find((s) => s.id === storyId);
    if (selectedStory) {
      setStory(selectedStory);
      
      // Load chat history from localStorage if available
      const savedChatHistory = localStorage.getItem(`chatHistory_${storyId}`);
      if (savedChatHistory) {
        try {
          setChatHistory(JSON.parse(savedChatHistory));
        } catch (error) {
          console.error('Failed to parse chat history:', error);
        }
      }
      
      // Clear chat history from localStorage after loading
      localStorage.removeItem(`chatHistory_${storyId}`);
      
      // Trigger reveal animation after a short delay
      const timer = setTimeout(() => {
        setReveal(true);
      }, 300);
      
      // Trigger汤底 reveal with a longer delay for dramatic effect
      const bottomTimer = setTimeout(() => {
        setShowBottom(true);
      }, 1200);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(bottomTimer);
      };
    } else {
      navigate('/'); // Redirect to home if story not found
    }
  }, [storyId, navigate]);

  if (!story) {
    return (
      <div className="min-h-screen bg-slate-900 text-amber-400 flex items-center justify-center">
        <div className="animate-pulse text-2xl">加载中...</div>
      </div>
    );
  }

  const handlePlayAgain = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-amber-400 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(245,158,11,0.15)_0%,transparent_50%)]"></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-amber-400/5 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* Result Card */}
        <div 
          className="bg-slate-800/95 backdrop-blur-sm p-8 md:p-12 rounded-xl shadow-2xl border border-amber-500/50 transform transition-all duration-1200 ease-out"
          style={{ 
            opacity: reveal ? 1 : 0, 
            transform: `translateY(${reveal ? '0%' : '20%'}) scale(${reveal ? 1 : 0.95})` 
          }}
        >
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-amber-400 drop-shadow-lg">
            游戏结果
          </h1>

          {/* Story Title */}
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-amber-400 mb-3 text-center">谜题</h2>
            <div className="bg-slate-900/80 p-4 rounded-lg border border-amber-500/30">
              <p className="text-slate-200 text-xl md:text-2xl text-center">{story.title}</p>
            </div>
          </div>

          {/* Bottom Reveal Section */}
          <div className="mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center text-amber-400 flex items-center justify-center gap-4">
              <span className="w-16 h-1 bg-amber-400 rounded-full animate-pulse"></span>
              汤底揭晓
              <span className="w-16 h-1 bg-amber-400 rounded-full animate-pulse"></span>
            </h3>
            
            {/* Bottom Text with Reveal Animation */}
            <div className="bg-slate-900/80 p-6 md:p-8 rounded-lg border border-amber-500/30 shadow-inner">
              <p 
                className="text-slate-200 text-lg md:text-xl leading-relaxed whitespace-pre-wrap transition-all duration-1500 ease-out"
                style={{ 
                  opacity: showBottom ? 1 : 0,
                  filter: showBottom ? 'blur(0px)' : 'blur(8px)',
                  transform: `translateY(${showBottom ? '0%' : '10%'})`
                }}
              >
                {story.bottom}
              </p>
            </div>
          </div>

          {/* Chat History (Optional) */}
      {chatHistory.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xl md:text-2xl font-bold mb-4 text-center text-amber-400">对话历史</h3>
          <div className="bg-slate-900/80 p-4 rounded-lg border border-amber-500/30 max-h-96 overflow-y-auto">
            {chatHistory.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-4 ${msg.type === 'player' ? 'text-right' : 'text-left'}`}
              >
                <div className={`inline-block max-w-[80%] p-3 rounded-lg ${msg.type === 'player' ? 'bg-amber-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
                  <p className="text-sm md:text-base">{msg.text}</p>
                  {msg.answer && msg.type === 'ai' && (
                    <div className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${msg.answer === 'yes' ? 'text-green-400' : msg.answer === 'no' ? 'text-red-400' : 'text-gray-400'}`}>
                      {msg.answer === 'yes' ? '是' : msg.answer === 'no' ? '否' : '无关'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

          {/* Play Again Button */}
          <div className="text-center">
            <button
              onClick={handlePlayAgain}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-4 px-12 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 text-xl md:text-2xl"
            >
              再来一局
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
