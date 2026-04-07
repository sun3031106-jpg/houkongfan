import React from 'react';

interface MessageProps {
  role: 'user' | 'ai';
  content: string;
  answer?: 'yes' | 'no' | 'irrelevant';
}

const Message: React.FC<MessageProps> = ({ role, content, answer }) => {
  const isUser = role === 'user';

  const getAnswerColor = (ans?: 'yes' | 'no' | 'irrelevant') => {
    switch (ans) {
      case 'yes': return 'text-green-400';
      case 'no': return 'text-red-400';
      case 'irrelevant': return 'text-gray-400';
      default: return '';
    }
  };

  const getAnswerText = (ans?: 'yes' | 'no' | 'irrelevant') => {
    switch (ans) {
      case 'yes': return '是';
      case 'no': return '否';
      case 'irrelevant': return '无关';
      default: return '';
    }
  };

  return (
    <div className={`flex items-start mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* AI Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 mr-2 sm:mr-3 mt-1">
          <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold shadow-md transition-all duration-300 hover:scale-110">
            AI
          </div>
        </div>
      )}

      {/* Message Content */}
      {isUser ? (
        // User message
        <div className={`max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl bg-amber-600 text-white rounded-br-none hover:bg-amber-700`}>
          <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">{content}</p>
        </div>
      ) : content ? (
        // AI message with content
        <div className={`max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl bg-slate-700 text-slate-200 rounded-bl-none hover:bg-slate-600`}>
          <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">{content}</p>
          
          {/* Answer Badge for AI Messages with content */}
          {answer && (
            <div className={`mt-1 sm:mt-2 inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold transition-all duration-300 hover:scale-105 ${getAnswerColor(answer)} bg-slate-800/50`}>
              {getAnswerText(answer)}
            </div>
          )}
        </div>
      ) : answer ? (
        // Only Answer Badge for AI Messages without content
        <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 ${getAnswerColor(answer)} bg-slate-800/80 shadow-lg`}>
          {getAnswerText(answer)}
        </div>
      ) : null}

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 ml-2 sm:ml-3 mt-1">
          <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold shadow-md transition-all duration-300 hover:scale-110">
            你
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
