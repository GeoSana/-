import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useGameState } from '../context/GameStateContext';

const CustomTooltip = ({ active, payload, label, t }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card" style={{ padding: '1rem', border: '1px solid var(--border)', fontSize: '0.85rem' }}>
        <p style={{ fontWeight: '700', marginBottom: '0.25rem' }}>{label}</p>
        <p style={{ color: 'var(--primary)' }}>
          {payload[0].value.toLocaleString()} {t.people}
        </p>
      </div>
    );
  }
  return null;
};

const DemographicsChart = () => {
  const { language, t } = useGameState();

  const data = [
    { name: { ru: 'Алматы', kz: 'Алматы' }, population: 2147000, color: '#0ea5e9' },
    { name: { ru: 'Туркестанская', kz: 'Түркістан' }, population: 2110000, color: '#38bdf8' },
    { name: { ru: 'Алматинская', kz: 'Алматы обл.' }, population: 1497000, color: '#7dd3fc' },
    { name: { ru: 'Астана', kz: 'Астана' }, population: 1350000, color: '#0ea5e9' },
    { name: { ru: 'Жамбылская', kz: 'Жамбыл' }, population: 1215000, color: '#38bdf8' },
    { name: { ru: 'Шымкент', kz: 'Шымкент' }, population: 1191000, color: '#7dd3fc' },
    { name: { ru: 'Карагандинская', kz: 'Қарағанды' }, population: 1134000, color: '#0ea5e9' },
    { name: { ru: 'Актюбинская', kz: 'Ақтөбе' }, population: 924000, color: '#38bdf8' },
    { name: { ru: 'Костанайская', kz: 'Қостанай' }, population: 832000, color: '#7dd3fc' },
    { name: { ru: 'Кызылординская', kz: 'Қызылорда' }, population: 830000, color: '#0ea5e9' },
  ];

  const localizedData = data.map(item => ({
    ...item,
    displayName: item.name[language]
  }));

  return (
    <div className="glass-card animate-up" style={{ padding: '2.5rem', marginTop: '4rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 className="font-serif" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{t.demographics}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '800px' }}>
          {t.demographicsDesc}
        </p>
      </div>

      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={localizedData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
            <XAxis 
              type="number" 
              stroke="var(--text-muted)" 
              fontSize={12} 
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              dataKey="displayName" 
              type="category" 
              stroke="var(--text-secondary)" 
              fontSize={12} 
              width={100}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip t={t} />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Bar dataKey="population" radius={[0, 4, 4, 0]} barSize={24}>
              {localizedData.map((entry, index) => (
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
