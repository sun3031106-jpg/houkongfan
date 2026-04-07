import React from 'react';
import { Link } from 'react-router-dom';
import type { TStory } from '../stories';

interface GameCardProps {
  story: TStory;
  index?: number;
}

const GameCard: React.FC<GameCardProps> = ({ story, index = 0 }) => {
  const getDifficultyColor = (difficulty: TStory['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-600 hover:bg-green-500';
      case 'medium':
        return 'bg-amber-600 hover:bg-amber-500';
      case 'hard':
        return 'bg-red-600 hover:bg-red-500';
      default:
        return 'bg-gray-600 hover:bg-gray-500';
    }
  };

  const getDifficultyText = (difficulty: TStory['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return '简单';
      case 'medium':
        return '中等';
      case 'hard':
        return '困难';
      default:
        return '未知';
    }
  };

  return (
    <Link to={`/game/${story.id}`} className="block group">
      <div
        className="bg-slate-800 p-4 sm:p-6 rounded-lg shadow-lg border border-slate-700 hover:border-amber-500 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer flex flex-col justify-between h-full overflow-hidden animate-fade-in"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="group-hover:opacity-90 transition-opacity duration-300">
          <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-amber-400 group-hover:text-amber-300 transition-colors duration-300 group-hover:drop-shadow-md">{story.title}</h3>
          <p className="text-slate-300 text-sm line-clamp-3 group-hover:text-slate-200 transition-colors duration-300 leading-relaxed">{story.surface}</p>
        </div>
        <div className="mt-3 sm:mt-4 flex justify-between items-center pt-2 border-t border-slate-700">
          <span
            className={`inline-block ${getDifficultyColor(story.difficulty)} text-white text-xs font-bold px-3 py-1 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-md`}
          >
            {getDifficultyText(story.difficulty)}
          </span>
          <span className="text-slate-400 text-xs group-hover:text-amber-400 transition-all duration-300 transform group-hover:translate-x-1">开始游戏 →</span>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
