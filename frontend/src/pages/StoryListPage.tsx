import React from 'react';
import { useParams } from 'react-router-dom';
import { stories, type TStory } from '../stories';
import GameCard from '../components/GameCard';

const StoryListPage: React.FC = () => {
  const { difficulty } = useParams<{ difficulty: TStory['difficulty'] }>();

  const filteredStories = stories.filter(
    (story) => story.difficulty === difficulty
  );

  const getDifficultyTitle = (diff: TStory['difficulty'] | undefined) => {
    switch (diff) {
      case 'easy':
        return '简单模式';
      case 'medium':
        return '中等模式';
      case 'hard':
        return '困难模式';
      default:
        return '所有故事';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-amber-400 p-8">
      <h1 className="text-5xl font-bold mb-8 text-center">
        {getDifficultyTitle(difficulty)} 海龟汤
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredStories.map((story) => (
          <GameCard key={story.id} story={story} />
        ))}
      </div>
      {filteredStories.length === 0 && (
        <p className="text-center text-xl mt-8">暂无此难度故事</p>
      )}
    </div>
  );
};

export default StoryListPage;
