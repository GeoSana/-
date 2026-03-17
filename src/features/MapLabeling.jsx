import React, { useState, useEffect } from 'react';

const MapLabeling = ({ quiz, onComplete, language, t }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState({}); // { pinId: labelId }
  const [selectedPin, setSelectedPin] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [wrongMatch, setWrongMatch] = useState(null);

  const { mapImage, pins, labels } = quiz.mapLabelingData;

  const handlePinClick = (pinId) => {
    if (matches[pinId]) return;
    setSelectedPin(pinId);
    if (selectedLabel) {
      checkMatch(pinId, selectedLabel);
    }
  };

  const handleLabelClick = (labelId) => {
    if (Object.values(matches).includes(labelId)) return;
    setSelectedLabel(labelId);
    if (selectedPin) {
      checkMatch(selectedPin, labelId);
    }
  };

  const checkMatch = (pinId, labelId) => {
    if (pinId === labelId) {
      const newMatches = { ...matches, [pinId]: labelId };
      setMatches(newMatches);
      setSelectedPin(null);
      setSelectedLabel(null);
      setWrongMatch(null);

      if (Object.keys(newMatches).length === pins.length) {
        onComplete(pins.length);
      }
    } else {
      setWrongMatch({ pinId, labelId });
      setTimeout(() => setWrongMatch(null), 1000);
      setSelectedPin(null);
      setSelectedLabel(null);
    }
  };

  return (
    <div className="map-labeling-game animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem', color: 'white' }}>{t.matchLabels}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>{t.matchLabelsDesc}</p>
      </div>

      <div className="quiz-map-container" style={{ 
        position: 'relative', 
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto', 
        background: '#0a0a1a', 
        borderRadius: '24px', 
        overflow: 'hidden', 
        border: '2px solid var(--border)',
        display: 'block'
      }}>
        {isLoading && (
          <div className="pulsing" style={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'var(--primary)', 
            fontWeight: 'bold',
            zIndex: 5
          }}>
            {language === 'ru' ? 'Загрузка карты...' : 'Карта жүктелуде...'}
          </div>
        )}
        <img 
          src={mapImage.startsWith('http') ? mapImage : (window.location.pathname.startsWith('/-') ? '/-/' : '/') + mapImage.replace(/^\//, '')} 
          alt="Map" 
          onLoad={() => setIsLoading(false)}
          onError={(e) => {
            console.error("Map image failed to load", mapImage);
            e.target.src = "https://placehold.co/1200x675/0a0a1a/0ea5e9?text=Map+Loading+Error";
            setIsLoading(false);
          }}
          style={{ 
            width: '100%', 
            height: 'auto',
            display: 'block', 
            opacity: 0.9
          }} 
        />
        
        {pins.map(pin => {
          const isMatched = matches[pin.id];
          const isSelected = selectedPin === pin.id;
          const isWrong = wrongMatch?.pinId === pin.id;

          return (
            <div 
              key={pin.id}
              onClick={() => handlePinClick(pin.id)}
              style={{
                position: 'absolute',
                left: `${pin.x}%`,
                top: `${pin.y}%`,
                transform: 'translate(-50%, -50%)',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: isMatched ? '#10b981' : isSelected ? 'var(--primary)' : isWrong ? '#ef4444' : 'white',
                border: '3px solid rgba(0,0,0,0.3)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                transition: 'all 0.3s ease',
                boxShadow: isSelected ? '0 0 15px var(--primary)' : 'none'
              }}
            >
              {isMatched && <span style={{ color: 'white', fontSize: '12px' }}>✓</span>}
            </div>
          );
        })}
      </div>

      <div className="labels-tray" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
        {labels.map(label => {
          const isMatched = Object.values(matches).includes(label.id);
          const isSelected = selectedLabel === label.id;
          const isWrong = wrongMatch?.labelId === label.id;

          return (
            <button
              key={label.id}
              onClick={() => handleLabelClick(label.id)}
              disabled={isMatched}
              className="glass-card"
              style={{
                padding: '0.8rem 1.5rem',
                border: isSelected ? '2px solid var(--primary)' : isWrong ? '2px solid #ef4444' : '1px solid var(--border)',
                background: isMatched ? 'rgba(16, 185, 129, 0.1)' : isSelected ? 'rgba(var(--primary-rgb), 0.2)' : 'rgba(255,255,255,0.05)',
                color: isMatched ? '#10b981' : 'white',
                cursor: isMatched ? 'default' : 'pointer',
                opacity: isMatched ? 0.5 : 1,
                transition: 'all 0.2s ease',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}
            >
              {label.text[language]}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MapLabeling;
