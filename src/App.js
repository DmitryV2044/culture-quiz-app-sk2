import React from 'react';
import './App.css';
import Quiz from './components/Quiz';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Art Quiz</h1>
      </header>
      <main>
        <Quiz />
      </main>
    </div>
  );
}

export default App;
