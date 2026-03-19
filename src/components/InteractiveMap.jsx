import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { regionsData } from '../data/regions';
import { useGameState } from '../context/GameStateContext';
import geoData from '../data/kazakhstan-regions.json';

const InteractiveMap = () => {
  const [activeRegion, setActiveRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const { discoverRegion, t, language } = useGameState();
  const svgRef = useRef(null);

  const getRegionId = (properties) => {
    const name1 = properties.NAME_1;
    const name2 = properties.NAME_2;

    if (name2 === 'Shymkent') return 'shymkent';
    if (name2 === 'Almaty (Alma-Ata)') return 'almaty-city';
    if (name2 === 'Tselinogradskiy') return 'astana';

    const mapping = {
      'Almaty': 'almaty',
      'Aqmola': 'akmola',
      'Aqtöbe': 'aktobe',
      'Atyrau': 'atyrau',
      'East Kazakhstan': 'east-kazakhstan',
      'Mangghystau': 'mangystau',
      'Mangystau': 'mangystau',
      'North Kazakhstan': 'north-kazakhstan',
      'Pavlodar': 'pavlodar',
      'Qaraghandy': 'karaganda',
      'Karaganda': 'karaganda',
      'Qostanay': 'kostanay',
      'Qyzylorda': 'kyzylorda',
      'South Kazakhstan': 'turkistan',
      'Turkistan': 'turkistan',
      'West Kazakhstan': 'west-kazakhstan',
      'Zhambyl': 'jambyl',
      'Almaty City': 'almaty-city',
      'Astana': 'astana',
      'Shymkent': 'shymkent'
    };
    return mapping[name1] || name1?.toLowerCase().replace(/\s+/g, '-');
  };

  useEffect(() => {
    // Kazakhstan is very wide. A wider aspect ratio prevents the sides from being cut off.
    const width = 1200;
    const height = 650;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`);

    svg.selectAll('*').remove();

    // Define Glow Filter
    const defs = svg.append('defs');
    const filter = defs.append('filter')
      .attr('id', 'premium-glow')
      .attr('x', '-20%')
      .attr('y', '-20%')
      .attr('width', '140%')
      .attr('height', '140%');
    
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '5')
      .attr('result', 'blur');
    
    filter.append('feComposite')
      .attr('in', 'SourceGraphic')
      .attr('in2', 'blur')
      .attr('operator', 'over');

    // Create a projection that automatically centers and scales to fit the container
    const projection = d3.geoMercator()
      .fitSize([width, height], geoData);

    const pathGenerator = d3.geoPath().projection(projection);

    // Draw background paths for all features in GeoJSON
    svg.append('g')
      .selectAll('path')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('d', pathGenerator)
      .attr('fill', 'rgba(255, 255, 255, 0.02)')
      .attr('stroke', 'rgba(255, 255, 255, 0.1)')
      .attr('stroke-width', 1);

    // Draw interactive paths
    const interactiveLayer = svg.append('g');

    interactiveLayer.selectAll('.region-path')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('class', 'region-path')
      .attr('d', pathGenerator)
      .style('cursor', 'pointer')
      .style('transition', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)')
      .attr('fill', d => {
        const id = getRegionId(d.properties);
        const isActive = activeRegion?.id === id;
        const isHovered = hoveredRegion === id;
        const rData = regionsData.find(r => r.id === id);
        const baseColor = rData?.color || '#2A9D8F';
        
        if (isActive) return baseColor;
        if (isHovered) return `${baseColor}44`;
        return 'transparent';
      })
      .attr('stroke', d => {
        const id = getRegionId(d.properties);
        const isActive = activeRegion?.id === id;
        const isHovered = hoveredRegion === id;
        const rData = regionsData.find(r => r.id === id);
        const baseColor = rData?.color || '#2A9D8F';

        if (isActive || isHovered) return baseColor;
        return 'rgba(255,255,255,0.2)';
      })
      .attr('stroke-width', d => {
        const id = getRegionId(d.properties);
        return (activeRegion?.id === id) ? 2.5 : (hoveredRegion === id) ? 2 : 1;
      })
      .style('filter', d => {
        const id = getRegionId(d.properties);
        return activeRegion?.id === id ? 'url(#premium-glow)' : 'none';
      })
      .on('mouseenter', (event, d) => {
        if (window.matchMedia('(hover: hover)').matches) {
          setHoveredRegion(getRegionId(d.properties));
        }
      })
      .on('mouseleave', () => {
        if (window.matchMedia('(hover: hover)').matches) {
          setHoveredRegion(null);
        }
      })
      .on('click', (event, d) => {
        const id = getRegionId(d.properties);
        const data = regionsData.find(r => r.id === id);
        if (data) {
          setActiveRegion(data);
          discoverRegion(id);
        }
      });

  }, [activeRegion, hoveredRegion, language, discoverRegion]);

  return (
    <div className="map-section-wrapper">
      <div className="map-grid-container mobile-responsive-grid">
        {/* D3 Map Card */}
        <div className="map-svg-container">
          <svg
            ref={svgRef}
            className="interactive-svg"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          ></svg>

          <div style={{
            position: 'absolute', bottom: '1.5rem', right: '1.5rem',
            fontSize: '0.75rem', color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            <span style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%' }}></span>
            {t.selectRegionOnMap}
          </div>
        </div>

        {/* Info Panel Card */}
        <div className="info-panel-wrapper">
          {activeRegion ? (
            <div className="animate-up" key={activeRegion.id} style={{ padding: '1rem', height: '100%', borderLeft: `4px solid ${activeRegion.color || 'var(--primary)'}` }}>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'white' }}>{activeRegion.name[language]}</h3>
                <span style={{ color: activeRegion.color || 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                  {activeRegion.capital[language]}
                </span>
              </div>

              <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '800', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>{t.area?.toUpperCase()}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'white' }}>{activeRegion.area}</div>
                </div>
                <div style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '800', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>{t.population?.toUpperCase()}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'white' }}>{activeRegion.population}</div>
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                {activeRegion.description[language]}
              </p>

              <button 
                className="btn btn-primary" 
                style={{ width: '100%', background: activeRegion.color || 'var(--primary)' }}
                onClick={() => {
                  const wikiLang = language === 'kz' ? 'kk' : 'ru';
                  const wikiUrl = `https://${wikiLang}.wikipedia.org/wiki/${encodeURIComponent(activeRegion.name[language])}`;
                  window.open(wikiUrl, '_blank');
                }}
              >
                {t.moreDetails}
              </button>
            </div>
          ) : (
            <div style={{ padding: '2.5rem', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: 0.6 }}>
              <div>
                <div style={{ fontSize: '3rem', marginBottom: '1.5rem', opacity: '0.3' }}>🗺️</div>
                <h4 style={{ marginBottom: '1rem', color: 'white' }}>{t.selectRegionOnMap}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '280px', margin: '0 auto' }}>
                  {t.subtitle}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .map-section-wrapper {
          padding-top: 2rem;
        }
        @media (max-width: 1024px) {
          .map-grid-container {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .info-panel-wrapper {
            background: rgba(255, 255, 255, 0.02);
            border-radius: 24px;
            border: 1px solid var(--border);
          }
        }
        @media (max-width: 768px) {
          .map-grid-container {
            gap: 1.5rem !important;
          }
          .info-panel-wrapper h3 {
            font-size: 1.8rem !important;
          }
          .stats-grid {
            gap: 1rem !important;
          }
        }
        @media (max-width: 480px) {
          .map-section-wrapper {
            padding-top: 1rem;
          }
          .interactive-svg {
            margin: 0 -15px;
            width: calc(100% + 30px) !important;
          }
          .info-panel-wrapper {
             padding: 0.5rem !important;
          }
          .info-panel-wrapper h3 {
            font-size: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InteractiveMap;
