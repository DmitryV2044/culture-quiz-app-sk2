import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Quiz.css';

const Quiz = () => {
  const { mode } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReportButton, setShowReportButton] = useState(false);
  const [showCorrectId, setShowCorrectId] = useState(false);
  const [dateRange, setDateRange] = useState({ min: 0, max: 0 });

  // Функция для перемешивания массива (алгоритм Фишера-Йейтса)
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    fetch('/quiz_data.json')
      .then(response => response.json())
      .then(data => {
        const shuffledData = shuffleArray([...data]);
        const selectedQuestions = shuffledData.slice(0, 25);

        const formattedQuestions = selectedQuestions.map((item, index) => {
          if (mode === 'date') {
            // Get all unique dates from the data
            const allDates = [...new Set(data.map(d => d.date))];
            const wrongDates = allDates
              .filter(d => d !== item.date)
              .slice(0, 3);
            
            const options = shuffleArray([...wrongDates, item.date]);

            return {
              image: item.image,
              question: "Когда было создано это произведение?",
              options: options,
              correct_answer: item.date,
              correct_id: item.id,
              caption: item.caption,
              date: item.date,
              author: item.author
            };
          } else {
            // Original author mode logic
            const usedAuthors = new Set();
            selectedQuestions.slice(0, index).forEach(q => usedAuthors.add(q.author));
            
            const allAnswers = data
              .filter(d => d.author !== item.author && !usedAuthors.has(d.author))
              .map(d => d.author);
            
            const wrongAnswers = shuffleArray([...allAnswers]).slice(0, 3);
            const options = shuffleArray([...wrongAnswers, item.author]);

            return {
              image: item.image,
              question: "Кто автор этого произведения?",
              options: options,
              correct_answer: item.author,
              correct_id: item.id,
              caption: item.caption,
              date: item.date,
              option_ids: options.map(opt => {
                const matchingItem = data.find(d => d.author === opt);
                return matchingItem ? matchingItem.id : null;
              })
            };
          }
        });
        setQuestions(formattedQuestions);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading questions:', error);
        setIsLoading(false);
      });
  }, [mode]);

  const handleAnswerClick = (answer) => {
    if (!questions[currentQuestion]) return;
    
    setSelectedAnswer(answer);
    
    if (answer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
      setShowReportButton(false);
    } else {
      setShowReportButton(true);
    }
  };

  const handleReportError = () => {
    setShowCorrectId(true);
  };

  const handleContinue = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowReportButton(false);
    } else {
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
  };

  const handleFinishQuiz = () => {
    if (window.confirm('Вы уверены, что хотите завершить тест?')) {
      setShowScore(true);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading questions...</div>;
  }

  if (questions.length === 0) {
    return <div className="loading">No questions available</div>;
  }

  if (showScore) {
    return (
      <div className="score-section">
        <h2>Тест завершен!</h2>
        <p>Вы набрали {score} из {questions.length}</p>
        <button onClick={resetQuiz}>Перезапустить тест</button>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  if (!currentQuestionData) {
    return <div className="loading">Error: Question data not found</div>;
  }

  return (
    <div className="quiz-container">
      <div className="question-section">
        <div className="question-count">
          <span>Вопрос {currentQuestion + 1}</span>/{questions.length}
          <button 
            className="finish-quiz-button"
            onClick={handleFinishQuiz}
          >
            Завершить тест
          </button>
        </div>
        <div className="question-image">
          <img 
            src={`/${currentQuestionData.image}`} 
            alt="Question"
            className="artwork-image"
          />
        </div>
        <div className="question-text">
          {currentQuestionData.question}
        </div>
      </div>
      <div className="answer-section">
        {currentQuestionData.options && currentQuestionData.options.map((option, index) => (
          <button
            key={index}
            className={`answer-button ${
              selectedAnswer !== null
                ? option === currentQuestionData.correct_answer
                  ? 'correct'
                  : selectedAnswer === option
                    ? 'incorrect'
                    : ''
                : ''
            }`}
            onClick={() => handleAnswerClick(option)}
            disabled={selectedAnswer !== null}
          >
            {option}
          </button>
        ))}
        {selectedAnswer !== null && (
          <>
            <div className={`answer-info ${selectedAnswer === currentQuestionData.correct_answer ? 'correct' : 'incorrect'}`}>
              <p>Название: {currentQuestionData.caption}</p>
              <p>Датировка: {currentQuestionData.date}</p>
              {mode === 'date' && <p>Автор: {currentQuestionData.author}</p>}
            </div>
            {showReportButton && (
              <button 
                className="report-button"
                onClick={handleReportError}
              >
                Ошибка в тесте?
              </button>
            )}
            {showCorrectId && (
              <div className="correct-id-info">
                <p>ID правильного ответа: {currentQuestionData.correct_id}, отправь скрин куда следует</p>
              </div>
            )}
            <button 
              className="continue-button"
              onClick={handleContinue}
            >
              Продолжить
            </button>
          </>
        )}
      </div>
      <footer className="quiz-footer">
        <p>Data by: Veronika Kirillova</p>
        <p>Design by: Alex Busy</p>
      </footer>
    </div>
  );
};

export default Quiz; 