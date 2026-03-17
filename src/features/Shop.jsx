import React, { useState } from 'react';
import { useGameState } from '../context/GameStateContext';

const SHOP_ITEMS = [
  {
    id: 'gold_frame',
    category: 'frames',
    price: 500,
    title: { ru: 'Золотая рамка', kz: 'Алтын жиек' },
    icon: '👑',
    rarity: 'legendary'
  },
  {
    id: 'neon_frame',
    category: 'frames',
    price: 300,
    title: { ru: 'Неоновый свет', kz: 'Неонды сәуле' },
    icon: '✨',
    rarity: 'rare'
  },
  {
    id: 'khan_title',
    category: 'titles',
    price: 1000,
    title: { ru: 'Титул: Великий Хан', kz: 'Титул: Ұлы Хан' },
    icon: '📜',
    rarity: 'legendary'
  },
  {
    id: 'nomad_title',
    category: 'titles',
    price: 400,
    title: { ru: 'Титул: Еркін Көшпенді', kz: 'Титул: Еркін Көшпенді' },
    icon: '🐎',
    rarity: 'uncommon'
  },
  {
    id: 'golden_man',
    category: 'souvenirs',
    price: 2000,
    title: { ru: 'Сувенир: Золотой человек', kz: 'Кәдесый: Алтын адам' },
    icon: '🛡️',
    rarity: 'mythic'
  },
  {
    id: 'dombra',
    category: 'souvenirs',
    price: 800,
    title: { ru: 'Сувенир: Домбра', kz: 'Кәдесый: Домбыра' },
    icon: '🪕',
    rarity: 'rare'
  }
];

const Shop = () => {
  const { coins, purchasedItems, buyItem, t, language } = useGameState();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems = activeCategory === 'all' 
    ? SHOP_ITEMS 
    : SHOP_ITEMS.filter(item => item.category === activeCategory);

  const categories = ['all', 'frames', 'titles', 'souvenirs'];

  return (
    <div className="shop-container animate-up" style={{ padding: '2rem 0' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 className="font-serif" style={{ fontSize: '3.5rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          {t.shopTitle}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          {t.shopDesc}
        </p>
        
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          background: 'rgba(245, 158, 11, 0.1)', 
          padding: '0.75rem 2rem', 
          borderRadius: 'var(--radius-full)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          marginTop: '2.5rem',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 0 20px rgba(245, 158, 11, 0.1)'
        }}>
          <span style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>💰</span>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent)', letterSpacing: '0.05em' }}>
            {coins} <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{t.shopCoins}</span>
          </span>
        </div>
      </header>

      <div className="shop-filters" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '0.75rem', 
        marginBottom: '4rem',
        flexWrap: 'wrap'
      }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`btn ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.9rem',
              textTransform: 'capitalize'
            }}
          >
            {cat === 'all' ? (language === 'kz' ? 'Барлығы' : 'Все') : t.shopCategories[cat]}
          </button>
        ))}
      </div>

      <div className="shop-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '2.5rem' 
      }}>
        {filteredItems.map(item => {
          const isPurchased = purchasedItems.includes(item.id);
          const canAfford = coins >= item.price;
          
          let rarityColor = 'var(--text-muted)';
          if (item.rarity === 'legendary') rarityColor = '#f59e0b';
          if (item.rarity === 'mythic') rarityColor = '#a855f7';
          if (item.rarity === 'rare') rarityColor = '#3b82f6';
          if (item.rarity === 'uncommon') rarityColor = '#10b981';

          return (
            <div 
              key={item.id}
              className="glass-card shop-item"
              style={{
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                border: isPurchased ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border)',
                background: isPurchased ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-card)'
              }}
            >
              <div style={{ 
                fontSize: '0.65rem', 
                textTransform: 'uppercase', 
                fontWeight: '800', 
                letterSpacing: '0.15em',
                color: rarityColor,
                marginBottom: '1.5rem',
                padding: '0.25rem 0.75rem',
                background: `${rarityColor}15`,
                borderRadius: 'var(--radius-full)'
              }}>
                {item.rarity}
              </div>

              <div style={{ 
                fontSize: '4.5rem', 
                marginBottom: '1.5rem',
                filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))',
                transition: 'transform 0.3s ease'
              }} className="item-icon">
                {item.icon}
              </div>

              <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{item.title[language]}</h3>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                marginBottom: '2.5rem',
                fontWeight: '700',
                color: isPurchased ? '#10b981' : (canAfford ? 'var(--accent)' : '#ef4444')
              }}>
                <span style={{ fontSize: '1.25rem' }}>{item.price}</span>
                <span style={{ fontSize: '1rem' }}>🪙</span>
              </div>

              <button
                disabled={isPurchased}
                onClick={() => buyItem(item)}
                className={`btn ${isPurchased ? 'btn-secondary' : 'btn-primary'}`}
                style={{
                  width: '100%',
                  marginTop: 'auto',
                  opacity: (!canAfford && !isPurchased) ? 0.5 : 1,
                  background: isPurchased ? 'rgba(16, 185, 129, 0.1)' : undefined,
                  borderColor: isPurchased ? '#10b981' : undefined,
                  color: isPurchased ? '#10b981' : undefined
                }}
              >
                {isPurchased ? `✓ ${t.purchased}` : canAfford ? t.buy : (language === 'kz' ? 'Жеткіліксіз' : 'Недостаточно')}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Shop;
