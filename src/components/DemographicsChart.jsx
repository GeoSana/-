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
    <div className="glass-card animate-up" style={{ padding: '2.5rem', marginTop: '4rem' }}>
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 className="font-serif" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
            {isPop ? t.demographics : (language === 'kz' ? 'Аймақтар Аумағы' : 'Площадь Регионов')}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '800px' }}>
            {isPop ? t.demographicsDesc : (language === 'kz' ? 'Қазақстанның ең үлкен аймақтары шаршы шақырыммен' : 'Самые большие регионы Казахстана в квадратных километрах')}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem', borderRadius: '8px' }}>
          <button 
            onClick={() => setMetric('population')}
            style={{ 
              padding: '0.5rem 1rem', 
              borderRadius: '6px',
              border: 'none',
              background: isPop ? 'var(--primary)' : 'transparent',
              color: isPop ? '#fff' : 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: isPop ? '600' : '400',
              transition: 'all 0.2s'
            }}
          >
            {t.population || (language === 'kz' ? 'Халық саны' : 'Население')}
          </button>
          <button 
            onClick={() => setMetric('area')}
            style={{ 
              padding: '0.5rem 1rem', 
              borderRadius: '6px',
              border: 'none',
              background: !isPop ? 'var(--primary)' : 'transparent',
              color: !isPop ? '#fff' : 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: !isPop ? '600' : '400',
              transition: 'all 0.2s'
            }}
          >
            {t.area || (language === 'kz' ? 'Аумағы' : 'Площадь')}
          </button>
        </div>
      </div>

      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: language === 'kz' ? 120 : 150, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
            <XAxis 
              type="number" 
              stroke="var(--text-muted)" 
              fontSize={12} 
              tickFormatter={(value) => isPop ? `${(value / 1000000).toFixed(1)}M` : `${(value / 1000)}k`}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              dataKey="displayName" 
              type="category" 
              stroke="var(--text-secondary)" 
              fontSize={12} 
              width={language === 'kz' ? 120 : 150}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip t={t} metric={metric} />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Bar dataKey={metric} radius={[0, 4, 4, 0]} barSize={24}>
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
