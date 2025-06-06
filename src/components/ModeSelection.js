import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ModeSelection.css';

const ModeSelection = () => {
  const navigate = useNavigate();

  const handleModeSelect = (mode) => {
    navigate(`/quiz/${mode}`);
  };

  return (
    <div className="mode-selection-container">
      <h1>Выберите режим теста</h1>
      <div className="mode-buttons">
        <button 
          className="mode-button"
          onClick={() => handleModeSelect('author')}
        >
          Угадай автора
        </button>
        <button 
          className="mode-button"
          onClick={() => handleModeSelect('date')}
        >
          Угадай дату
        </button>
      </div>
    </div>
  );
};

export default ModeSelection; 