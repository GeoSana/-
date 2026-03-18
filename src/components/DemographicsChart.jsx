import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useGameState } from '../context/GameStateContext';
import { regionsData } from '../data/regions';

const CustomTooltip = ({ active, payload, label, t, metric }) => {
  if (active && payload && payload.length) {
    const isPop = metric === 'population';
    return (
      <div className="glass-card" style={{ padding: '1rem', border: '1px solid var(--border)', fontSize: '0.85rem' }}>
        <p style={{ fontWeight: '700', marginBottom: '0.25rem' }}>{label}</p>
        <p style={{ color: payload[0].payload.color || 'var(--primary)' }}>
          {payload[0].value.toLocaleString()} {isPop ? t.people : 'км²'}
        </p>
      </div>
    );
  }
  return null;
};

const DemographicsChart = () => {
  const { language, t } = useGameState();
  const [metric, setMetric] = useState('population');
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const yAxisWidth = isMobile ? (language === 'kz' ? 90 : 100) : (language === 'kz' ? 120 : 150);

  const cleanNumber = (str) => parseInt(str.replace(/\D/g, ''), 10);

  const parsedData = regionsData.map(r => ({
    name: r.name,
    displayName: r.name[language],
    population: cleanNumber(r.population),
    area: cleanNumber(r.area),
    color: r.color || '#0ea5e9'
  }));

  const sortedData = [...parsedData]
    .sort((a, b) => b[metric] - a[metric])
    .slice(0, 10);

  const isPop = metric === 'population';

  return (
    <div className="glass-card animate-up demographics-card" style={{ marginTop: '4rem' }}>
      <div className="chart-header-area">
        <div className="chart-title-area">
          <h3 className="font-serif chart-title">
            {isPop ? t.demographics : (language === 'kz' ? 'Аймақтар Аумағы' : 'Площадь Регионов')}
          </h3>
          <p className="chart-subtitle">
            {isPop ? t.demographicsDesc : (language === 'kz' ? 'Қазақстанның ең үлкен аймақтары шаршы шақырыммен' : 'Самые большие регионы Казахстана в квадратных километрах')}
          </p>
        </div>
        
        <div className="chart-toggle-buttons">
          <button 
            onClick={() => setMetric('population')}
            className={`chart-type-btn ${isPop ? 'active' : ''}`}
          >
            {t.population || (language === 'kz' ? 'Халық саны' : 'Население')}
          </button>
          <button 
            onClick={() => setMetric('area')}
            className={`chart-type-btn ${!isPop ? 'active' : ''}`}
          >
            {t.area || (language === 'kz' ? 'Аумағы' : 'Площадь')}
          </button>
        </div>
      </div>

      <div className="chart-container-inner" style={{ width: '100%', height: isMobile ? 350 : 450, minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 5, right: isMobile ? 10 : 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
            <XAxis 
              type="number" 
              stroke="var(--text-muted)" 
              fontSize={isMobile ? 10 : 12} 
              tickFormatter={(value) => isPop ? `${(value / 1000000).toFixed(1)}M` : `${(value / 1000)}k`}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              dataKey="displayName" 
              type="category" 
              stroke="var(--text-secondary)" 
              fontSize={isMobile ? 10 : 12} 
              width={yAxisWidth}
              axisLine={false}
              tickLine={false}
              tick={{ width: yAxisWidth }}
            />
            <Tooltip content={<CustomTooltip t={t} metric={metric} />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Bar dataKey={metric} radius={[0, 4, 4, 0]} barSize={isMobile ? 16 : 24}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DemographicsChart;
