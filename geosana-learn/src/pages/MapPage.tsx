import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { regionsData, type Region } from '../data/regions';
import { Info, Users, Maximize, MapPin, X, ArrowRight } from 'lucide-react';
import { geoMercator, geoPath } from 'd3-geo';
import kazakhstanRegions from '../data/kazakhstan-regions.json';

const REGION_COLORS = [
  "#00A3FF", "#008DE0", "#0077C2", "#0061A3", "#004B85",
  "#00A3FF", "#008DE0", "#0077C2", "#0061A3", "#004B85",
  "#00A3FF", "#008DE0", "#0077C2", "#0061A3", "#004B85",
  "#00A3FF", "#008DE0", "#0077C2", "#0061A3", "#004B85"
];

export default function MapPage() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  // Setup D3 Projection
  const projection = useMemo(() => {
    return geoMercator()
      .center([68, 48]) // Center of Kazakhstan roughly
      .scale(1100) // Zoom level
      .translate([415, 300]); // Center in SVG
  }, []);

  const pathGenerator = useMemo(() => geoPath().projection(projection), [projection]);

  // Handle region click
  const handleRegionClick = (feature: any) => {
    // Try to match the clicked feature to our regionsData
    const featureName = feature.properties.NAME_2 || feature.properties.NAME_1 || '';
    
    let matchedRegion = regionsData.find(r => {
      const name = r.name.toLowerCase();
      const fName = featureName.toLowerCase();
      
      if (fName.includes('almaty')) {
        return feature.properties.TYPE_2 === 'Rayon' ? name.includes('алматы (город)') : name.includes('алматинская');
      }
      
      if (fName.includes('aqmola') && name.includes('акмолинская')) return true;
      if (fName.includes('aqtöbe') && name.includes('актюбинская')) return true;
      if (fName.includes('atyrau') && name.includes('атырауская')) return true;
      if (fName.includes('east kazakhstan') && name.includes('восточно')) return true;
      if (fName.includes('mangghystau') && name.includes('мангистауская')) return true;
      if (fName.includes('north kazakhstan') && name.includes('северо')) return true;
      if (fName.includes('pavlodar') && name.includes('павлодарская')) return true;
      if (fName.includes('qaraghandy') && name.includes('карагандинская')) return true;
      if (fName.includes('qostanay') && name.includes('костанайская')) return true;
      if (fName.includes('qyzylorda') && name.includes('кызылординская')) return true;
      if (fName.includes('south kazakhstan') && name.includes('туркестанская')) return true;
      if (fName.includes('west kazakhstan') && name.includes('западно')) return true;
      if (fName.includes('zhambyl') && name.includes('жамбылская')) return true;
      if (fName.includes('shymkent') && name.includes('шымкент')) return true;
      if (fName.includes('tselinogradskiy') && name.includes('астана')) return true;
      
      return false;
    });

    if (matchedRegion) {
      setSelectedRegion(matchedRegion);
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#060B14] relative">
      {/* Map Area */}
      <div className="flex-1 relative p-2 lg:p-6 flex items-center justify-center min-h-[60vh] lg:min-h-0">
        <div className="w-full max-w-4xl aspect-[4/3] relative">
          <svg viewBox="0 0 800 600" className="w-full h-full drop-shadow-2xl">
            {/* Kazakhstan Regions */}
            <g className="regions">
              {kazakhstanRegions.features.map((feature: any, i: number) => {
                const featureName = feature.properties.NAME_2 || feature.properties.NAME_1 || '';
                let isSelected = false;
                
                if (selectedRegion) {
                  const name = selectedRegion.name.toLowerCase();
                  const fName = featureName.toLowerCase();
                  
                  if (fName.includes('almaty')) {
                    isSelected = feature.properties.TYPE_2 === 'Rayon' ? name.includes('алматы (город)') : name.includes('алматинская');
                  } else if (fName.includes('aqmola') && name.includes('акмолинская')) isSelected = true;
                  else if (fName.includes('aqtöbe') && name.includes('актюбинская')) isSelected = true;
                  else if (fName.includes('atyrau') && name.includes('атырауская')) isSelected = true;
                  else if (fName.includes('east kazakhstan') && name.includes('восточно')) isSelected = true;
                  else if (fName.includes('mangghystau') && name.includes('мангистауская')) isSelected = true;
                  else if (fName.includes('north kazakhstan') && name.includes('северо')) isSelected = true;
                  else if (fName.includes('pavlodar') && name.includes('павлодарская')) isSelected = true;
                  else if (fName.includes('qaraghandy') && name.includes('карагандинская')) isSelected = true;
                  else if (fName.includes('qostanay') && name.includes('костанайская')) isSelected = true;
                  else if (fName.includes('qyzylorda') && name.includes('кызылординская')) isSelected = true;
                  else if (fName.includes('south kazakhstan') && name.includes('туркестанская')) isSelected = true;
                  else if (fName.includes('west kazakhstan') && name.includes('западно')) isSelected = true;
                  else if (fName.includes('zhambyl') && name.includes('жамбылская')) isSelected = true;
                  else if (fName.includes('shymkent') && name.includes('шымкент')) isSelected = true;
                  else if (fName.includes('tselinogradskiy') && name.includes('астана')) isSelected = true;
                }

                const regionColor = REGION_COLORS[i % REGION_COLORS.length];
                
                // Calculate centroid for transform origin
                const centroid = pathGenerator.centroid(feature);
                const hasCentroid = centroid && !isNaN(centroid[0]) && !isNaN(centroid[1]);
                const cx = hasCentroid ? centroid[0] : 0;
                const cy = hasCentroid ? centroid[1] : 0;

                return (
                  <motion.g 
                    key={i} 
                    className="cursor-pointer" 
                    onClick={() => handleRegionClick(feature)}
                    style={{ 
                      '--region-color': regionColor,
                      transformOrigin: hasCentroid ? `${cx}px ${cy}px` : 'center center'
                    } as React.CSSProperties}
                    initial="hidden"
                    animate={isSelected ? "selected" : "visible"}
                    whileHover={isSelected ? "selected" : "hover"}
                    whileTap="tap"
                    variants={{
                      hidden: { 
                        opacity: 0, 
                        scale: 0.8, 
                        filter: 'drop-shadow(0 0 0px rgba(0,0,0,0))' 
                      },
                      visible: { 
                        opacity: 1, 
                        scale: 1, 
                        filter: 'drop-shadow(0 0 0px rgba(0,0,0,0))',
                        transition: { duration: 0.8, delay: i * 0.02, type: "spring", bounce: 0.3 }
                      },
                      hover: { 
                        scale: 1.03, 
                        filter: 'drop-shadow(0 0 8px rgba(0,163,255,0.4))',
                        transition: { duration: 0.3, type: "spring", stiffness: 300 }
                      },
                      selected: { 
                        scale: 1.05, 
                        filter: `drop-shadow(0 0 20px ${regionColor})`,
                        transition: { duration: 0.5, type: "spring", bounce: 0.4 }
                      },
                      tap: {
                        scale: 0.98,
                        transition: { duration: 0.1 }
                      }
                    }}
                  >
                    <motion.path
                      d={pathGenerator(feature) || ''}
                      fill="var(--region-color)"
                      stroke="#060B14"
                      variants={{
                        hidden: { strokeWidth: 0.5, opacity: 0 },
                        visible: { strokeWidth: 0.5, opacity: 0.3 },
                        hover: { strokeWidth: 1, opacity: 0.8 },
                        selected: { strokeWidth: 2, opacity: 1 }
                      }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    />
                    
                    {/* Pulse Animation for Selected Region */}
                    <AnimatePresence>
                      {isSelected && hasCentroid && (
                        <>
                          <motion.circle
                            initial={{ r: 0, opacity: 1, strokeWidth: 4 }}
                            animate={{ r: 60, opacity: 0, strokeWidth: 0 }}
                            exit={{ opacity: 0, transition: { duration: 0.4 } }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                            cx={cx}
                            cy={cy}
                            fill="none"
                            stroke="#ffffff"
                            className="pointer-events-none"
                          />
                          <motion.circle
                            initial={{ r: 0, opacity: 0.8, strokeWidth: 2 }}
                            animate={{ r: 45, opacity: 0, strokeWidth: 0 }}
                            exit={{ opacity: 0, transition: { duration: 0.4 } }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                            cx={cx}
                            cy={cy}
                            fill="none"
                            stroke="#ffffff"
                            className="pointer-events-none"
                          />
                          <motion.circle
                            initial={{ r: 0, opacity: 0.9 }}
                            animate={{ r: 8, opacity: 0.5 }}
                            exit={{ r: 0, opacity: 0, transition: { duration: 0.3 } }}
                            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                            cx={cx}
                            cy={cy}
                            fill="#ffffff"
                            className="pointer-events-none drop-shadow-lg"
                          />
                        </>
                      )}
                    </AnimatePresence>

                    {/* Region Label */}
                    {hasCentroid && (() => {
                      let displayName = featureName;
                      if (displayName.includes('Oblasy')) displayName = displayName.replace(' Oblasy', '');
                      if (displayName.includes('Region')) displayName = displayName.replace(' Region', '');
                      
                      const ruNames: Record<string, string> = {
                        'Almaty': 'Алматинская',
                        'Aqmola': 'Акмолинская',
                        'Aqtöbe': 'Актюбинская',
                        'Atyrau': 'Атырауская',
                        'East Kazakhstan': 'ВКО',
                        'Mangghystau': 'Мангистауская',
                        'North Kazakhstan': 'СКО',
                        'Pavlodar': 'Павлодарская',
                        'Qaraghandy': 'Карагандинская',
                        'Qostanay': 'Костанайская',
                        'Qyzylorda': 'Кызылординская',
                        'South Kazakhstan': 'Туркестанская',
                        'West Kazakhstan': 'ЗКО',
                        'Zhambyl': 'Жамбылская',
                        'Shymkent': 'Шымкент',
                        'Almaty (Alma-Ata)': 'Алматы',
                        'Tselinogradskiy': 'Астана'
                      };
                      
                      const label = ruNames[displayName.trim()] || displayName;

                      return (
                        <motion.text
                          x={cx}
                          y={cy}
                          textAnchor="middle"
                          alignmentBaseline="middle"
                          variants={{
                            hidden: { fill: "rgba(255,255,255,0)", fontSize: "8px", fontWeight: 500 },
                            visible: { fill: "rgba(255,255,255,0.6)", fontSize: "8px", fontWeight: 500 },
                            hover: { fill: "rgba(255,255,255,1)", fontSize: "8px", fontWeight: 500 },
                            selected: { fill: "rgba(255,255,255,1)", fontSize: "10px", fontWeight: 700 }
                          }}
                          transition={{ duration: 0.3 }}
                          className="pointer-events-none select-none drop-shadow-md font-sans"
                        >
                          {label}
                        </motion.text>
                      );
                    })()}
                  </motion.g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      {/* Info Panel */}
      <AnimatePresence>
        {selectedRegion && (
          <>
            {/* Mobile Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRegion(null)}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              key={selectedRegion.id}
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed lg:static top-0 lg:top-auto bottom-0 right-0 z-50 w-full lg:w-96 bg-[#020408] lg:bg-[#020408]/95 backdrop-blur-2xl border-l border-white/5 flex flex-col h-full overflow-y-auto shadow-2xl"
            >
              <div className="p-8 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <div className="inline-flex items-center justify-center p-3 bg-[#00A3FF]/10 rounded-xl border border-[#00A3FF]/20">
                    <MapPin className="w-6 h-6 text-[#00A3FF]" />
                  </div>
                  <button 
                    onClick={() => setSelectedRegion(null)}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-4 font-serif">{selectedRegion.name}</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  {selectedRegion.description}
                </p>

                <div className="space-y-4 mb-8">
                  <div className="bg-[#0A1120] rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-[#00A3FF]" />
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Административный центр</span>
                    </div>
                    <p className="text-base font-semibold text-white pl-6">{selectedRegion.capital}</p>
                  </div>

                  <div className="bg-[#0A1120] rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Maximize className="w-4 h-4 text-[#00A3FF]" />
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Площадь</span>
                    </div>
                    <p className="text-base font-semibold text-white pl-6">{selectedRegion.area}</p>
                  </div>

                  <div className="bg-[#0A1120] rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-[#00A3FF]" />
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Население</span>
                    </div>
                    <p className="text-base font-semibold text-white pl-6">{selectedRegion.population}</p>
                  </div>
                </div>
                
                <div className="mt-auto pb-safe">
                  <button className="w-full py-4 px-6 bg-[#00A3FF] hover:bg-[#008DE0] text-white font-semibold rounded-xl transition-colors shadow-[0_0_20px_rgba(0,163,255,0.3)] hover:shadow-[0_0_30px_rgba(0,163,255,0.5)] flex items-center justify-center gap-2">
                    Изучить подробнее <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Empty State */}
      {!selectedRegion && (
        <div className="hidden lg:flex w-96 bg-[#020408]/95 backdrop-blur-2xl border-l border-white/5 flex-col items-center justify-center p-8 text-center z-10">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <MapPin className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3 font-serif">Выберите регион</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Нажмите на любую точку на карте, чтобы узнать подробную информацию об области или городе.
          </p>
        </div>
      )}
    </div>
  );
}

// Helper for class merging
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
