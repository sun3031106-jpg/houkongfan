import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Home from './Home.tsx'; // Import the Home component
import StoryListPage from './pages/StoryListPage.tsx';
import GamePage from './pages/GamePage.tsx';
import ResultPage from './pages/ResultPage.tsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add a placeholder route for story list page based on difficulty */}
        <Route path="/stories/:difficulty" element={<StoryListPage />} />
        <Route path="/game/:id" element={<GamePage />} />
        <Route path="/result/:storyId" element={<ResultPage />} />
      </Routes>
    </Router>
  </StrictMode>,
);
