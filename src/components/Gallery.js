import React, { useState, useEffect } from 'react';
import './Gallery.css';

const Gallery = () => {
  const [paintings, setPaintings] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedAuthor, setSelectedAuthor] = useState('all');
  const [sortBy, setSortBy] = useState('author');

  // Определяем хронологический порядок эпох
  const periodOrder = [
    'До нашей эры',
    'Раннее Средневековье',
    'Средневековье',
    'Возрождение',
    'Барокко',
    'Новое время',
    'Современное искусство',
    'Неизвестный период'
  ];

  // Функция для получения индекса эпохи в хронологическом порядке
  const getPeriodIndex = (period) => {
    const index = periodOrder.indexOf(period);
    return index === -1 ? periodOrder.length : index; // Неизвестные эпохи в конец
  };

  useEffect(() => {
    fetch('/quiz_data_with_russian_periods.json')
      .then(response => response.json())
      .then(data => {
        // Sort the data based on the current sortBy value
        const sortedData = [...data].sort((a, b) => {
          if (sortBy === 'author') {
            // First sort by author
            const authorCompare = a.author.localeCompare(b.author);
            if (authorCompare !== 0) return authorCompare;
            
            // Then by period using chronological order
            const periodCompare = getPeriodIndex(a.period) - getPeriodIndex(b.period);
            if (periodCompare !== 0) return periodCompare;
            
            // Finally by year, handling negative years correctly
            if (a.year === null && b.year === null) return 0;
            if (a.year === null) return 1;
            if (b.year === null) return -1;
            return a.year - b.year;
          } else {
            // Sort by date (year), handling negative years correctly
            if (a.year === null && b.year === null) return 0;
            if (a.year === null) return 1;
            if (b.year === null) return -1;
            const yearCompare = a.year - b.year;
            if (yearCompare !== 0) return yearCompare;
            
            // Then by period using chronological order
            const periodCompare = getPeriodIndex(a.period) - getPeriodIndex(b.period);
            if (periodCompare !== 0) return periodCompare;
            
            // Finally by author
            return a.author.localeCompare(b.author);
          }
        });
        
        setPaintings(sortedData);
      })
      .catch(error => {
        console.error('Error loading paintings:', error);
      });
  }, [sortBy]);

  // Get unique periods and authors, maintaining chronological order for periods
  const periods = ['all', ...periodOrder.filter(period => 
    paintings.some(p => p.period === period)
  )];
  
  const authors = ['all', ...new Set(paintings
    .filter(p => selectedPeriod === 'all' || p.period === selectedPeriod)
    .map(p => p.author))];

  // Filter paintings based on selected period and author
  const filteredPaintings = paintings.filter(painting => {
    const periodMatch = selectedPeriod === 'all' || painting.period === selectedPeriod;
    const authorMatch = selectedAuthor === 'all' || painting.author === selectedAuthor;
    return periodMatch && authorMatch;
  });

  return (
    <div className="gallery-container">
      <h1>Галерея картин</h1>
      
      <div className="filters">
        <div className="filter-section">
          <h3>Сортировка</h3>
          <div className="filter-buttons">
            <button 
              className={sortBy === 'author' ? 'active' : ''}
              onClick={() => setSortBy('author')}
            >
              По авторам
            </button>
            <button 
              className={sortBy === 'date' ? 'active' : ''}
              onClick={() => setSortBy('date')}
            >
              По дате
            </button>
          </div>
        </div>

        <div className="filter-section">
          <h3>Фильтр по эпохе</h3>
          <div className="filter-buttons">
            {periods.map(period => (
              <button
                key={period}
                className={selectedPeriod === period ? 'active' : ''}
                onClick={() => {
                  setSelectedPeriod(period);
                  setSelectedAuthor('all');
                }}
              >
                {period === 'all' ? 'Все эпохи' : period}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Фильтр по автору</h3>
          <div className="filter-buttons">
            {authors.map(author => (
              <button
                key={author}
                className={selectedAuthor === author ? 'active' : ''}
                onClick={() => setSelectedAuthor(author)}
              >
                {author === 'all' ? 'Все авторы' : author}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="paintings-grid">
        {filteredPaintings.map(painting => (
          <div key={painting.id} className="painting-card">
            <img src={`/${painting.image}`} alt={painting.caption} />
            <div className="painting-info">
              <h3>{painting.caption}</h3>
              <p className="author">{painting.author}</p>
              <p className="date">{painting.date}</p>
              <p className="period">{painting.period}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery; 