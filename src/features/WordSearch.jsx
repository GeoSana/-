import React, { useState, useEffect, useRef } from 'react';

const WordSearch = ({ quiz, onComplete, language, t }) => {
  const [foundWords, setFoundWords] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [selectedCells, setSelectedCells] = useState([]);
  const gridRef = useRef(null);

  const { grid: grids, words } = quiz.wordSearchData;
  const grid = grids[language] || grids['ru'];

  const getCellCoords = (e) => {
    const rect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cellSize = rect.width / grid[0].length;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
      return { row, col };
    }
    return null;
  };

  const handleMouseDown = (e) => {
    const coords = getCellCoords(e);
    if (coords) {
      setIsSelecting(true);
      setSelectionStart(coords);
      setSelectionEnd(coords);
      setSelectedCells([coords]);
    }
  };

  const handleMouseMove = (e) => {
    if (!isSelecting) return;
    const coords = getCellCoords(e);
    if (coords && (coords.row !== selectionEnd?.row || coords.col !== selectionEnd?.col)) {
      setSelectionEnd(coords);
      calculateSelection(selectionStart, coords);
    }
  };

  const handleMouseUp = () => {
    if (!isSelecting) return;
    setIsSelecting(false);
    checkSelectedWord();
    setSelectionStart(null);
    setSelectionEnd(null);
    setSelectedCells([]);
  };

  const calculateSelection = (start, end) => {
    const dr = end.row - start.row;
    const dc = end.col - start.col;
    
    // Allow horizontal, vertical, and diagonal (at 45 degrees)
    const isHorizontal = dr === 0;
    const isVertical = dc === 0;
    const isDiagonal = Math.abs(dr) === Math.abs(dc);

    if (isHorizontal || isVertical || isDiagonal) {
      const steps = Math.max(Math.abs(dr), Math.abs(dc));
      const rStep = dr === 0 ? 0 : dr / steps;
      const cStep = dc === 0 ? 0 : dc / steps;
      
      const newSelected = [];
      for (let i = 0; i <= steps; i++) {
        newSelected.push({
          row: start.row + i * rStep,
          col: start.col + i * cStep
        });
      }
      setSelectedCells(newSelected);
    }
  };

  const checkSelectedWord = () => {
    if (selectedCells.length < 2) return;
    
    const word = selectedCells.map(cell => grid[cell.row][cell.col]).join('');
    const reversedWord = [...word].reverse().join('');
    
    const matchedWord = words.find(w => 
      (w[language].toUpperCase() === word || w[language].toUpperCase() === reversedWord) && 
      !foundWords.some(f => f.word === w[language].toUpperCase())
    );

    if (matchedWord) {
      const newFound = [...foundWords, { 
        word: matchedWord[language].toUpperCase(), 
        cells: [...selectedCells] 
      }];
      setFoundWords(newFound);
      if (newFound.length === words.length) {
        setTimeout(() => onComplete(100), 500);
      }
    }
  };

  // Touch support
  const handleTouchStart = (e) => {
    e.preventDefault(); // prevent scroll and text selection
    const touch = e.touches[0];
    const coords = getCellCoords(touch);
    if (coords) {
      setIsSelecting(true);
      setSelectionStart(coords);
      setSelectionEnd(coords);
      setSelectedCells([coords]);
    }
  };
  const handleTouchMove = (e) => {
    e.preventDefault(); // always prevent scroll while on grid
    if (!isSelecting) return;
    const touch = e.touches[0];
    const coords = getCellCoords(touch);
    if (coords && (coords.row !== selectionEnd?.row || coords.col !== selectionEnd?.col)) {
      setSelectionEnd(coords);
      calculateSelection(selectionStart, coords);
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    handleMouseUp();
  };

  const isCellInFoundWords = (r, c) => {
    return foundWords.some(fword => 
      fword.cells.some(cell => cell.row === r && cell.col === c)
    );
  };

  return (
    <div className="ws-container animate-fade-in">
      <div className="ws-header">
        <h2 className="font-serif" style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'white' }}>
          {t.findWords}
        </h2>
        <div className="ws-progress-capsule">
          <span style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '1.2rem' }}>
            {foundWords.length} / {words.length}
          </span>
          <div style={{ width: '1px', height: '20px', background: 'var(--border)' }}></div>
          <span style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem' }}>
            {t.wordsFound}
          </span>
        </div>
      </div>

      <div className="ws-game-layout">
        <div className="ws-grid-wrapper">
          <div 
            ref={gridRef}
            className="ws-grid-card"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              gridTemplateRows: `repeat(${grid.length}, 1fr)`,
              gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
            }}
          >
            {grid.map((row, rIdx) => row.map((char, cIdx) => {
              const isSelected = selectedCells.some(cell => cell.row === rIdx && cell.col === cIdx);
              const isFound = isCellInFoundWords(rIdx, cIdx);

              let className = "ws-letter-tile";
              if (isSelected) className += " selected";
              if (isFound) className += " found";

              return (
                <div 
                  key={`${rIdx}-${cIdx}`}
                  className={className}
                >
                  {char}
                </div>
              );
            }))}
          </div>
        </div>

        <aside className="ws-word-list-card">
          <h3 className="ws-word-list-title font-serif">
            <span>📋</span> {t.list}
          </h3>
          
          <div className="ws-word-items">
            {words.map((w, idx) => {
              const upper = w[language].toUpperCase();
              const isFound = foundWords.some(f => f.word === upper);
              return (
                <div 
                  key={idx} 
                  className={`ws-word-item ${isFound ? 'found' : ''}`}
                >
                  <div className="ws-word-check">
                    {isFound ? '✓' : idx + 1}
                  </div>
                  <span className="ws-word-text">
                    {upper}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ 
            marginTop: '2rem', 
            padding: '1.5rem', 
            background: 'rgba(14, 165, 233, 0.05)', 
            borderRadius: '16px',
            border: '1px solid rgba(14, 165, 233, 0.1)',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.5'
          }}>
            💡 {language === 'ru' ? 'Выделяйте слова в сетке!' : 'Сөздерді тордан белгілеңіз!'}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default WordSearch;
