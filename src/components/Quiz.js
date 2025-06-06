import React, { useState, useEffect } from 'react';
import './Quiz.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Функция для перемешивания массива (алгоритм Фишера-Йейтса)
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    // Загрузка вопросов из JSON файла
    fetch('/quiz_data.json')
      .then(response => response.json())
      .then(data => {
        // Выбираем 25 случайных картин
        const shuffledData = shuffleArray([...data]);
        const selectedQuestions = shuffledData.slice(0, 25);

        // Преобразуем данные в формат, который нам нужен
        const formattedQuestions = selectedQuestions.map((item, index) => {
          // Создаем массив всех возможных ответов, исключая текущий
          const allAnswers = data
            .filter(d => d.author !== item.author)
            .map(d => d.author);
          
          // Выбираем 3 случайных неправильных ответа
          const wrongAnswers = shuffleArray([...allAnswers]).slice(0, 3);
          
          // Создаем массив всех вариантов ответов и перемешиваем его
          const options = shuffleArray([...wrongAnswers, item.author]);

          return {
            image: item.image,
            question: "Кто автор этой картины?",
            options: options,
            correct_answer: item.author,
            correct_id: item.id,
            option_ids: options.map(opt => {
              const matchingItem = data.find(d => d.author === opt);
              return matchingItem ? matchingItem.id : null;
            })
          };
        });
        setQuestions(formattedQuestions);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading questions:', error);
        setIsLoading(false);
      });
  }, []);

  const handleAnswerClick = (answer) => {
    if (!questions[currentQuestion]) return;
    
    setSelectedAnswer(answer);
    
    if (answer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }
  };

  const handleContinue = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
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

  if (isLoading) {
    return <div className="loading">Loading questions...</div>;
  }

  if (questions.length === 0) {
    return <div className="loading">No questions available</div>;
  }

  if (showScore) {
    return (
      <div className="score-section">
        <h2>Quiz completed!</h2>
        <p>You scored {score} out of {questions.length}</p>
        <button onClick={resetQuiz}>Restart Quiz</button>
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
          <span>Question {currentQuestion + 1}</span>/{questions.length}
        </div>
        <div className="question-image">
          <img 
            src={currentQuestionData.image} 
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
             {/* (ID: {currentQuestionData.option_ids[index]}) */}
          </button>
        ))}
        {selectedAnswer !== null && (
          <button 
            className="continue-button"
            onClick={handleContinue}
          >
            Продолжить
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz; 