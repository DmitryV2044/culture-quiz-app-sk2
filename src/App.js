import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Quiz from './components/Quiz';
import ModeSelection from './components/ModeSelection';

function Header() {
  const navigate = useNavigate();
  
  return (
    <header className="App-header">
      <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>АВТОРДАТИРОВКА</h1>
    </header>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<ModeSelection />} />
            <Route path="/quiz/:mode" element={<Quiz />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
