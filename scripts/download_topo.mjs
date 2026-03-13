import { writeFileSync } from 'fs';

async function downloadTopo() {
  const url = 'https://unpkg.com/world-atlas@2.0.2/countries-110m.json';
  const res = await fetch(url);
  const data = await res.json();
  
  writeFileSync('src/data/world-110m.json', JSON.stringify(data));
  console.log('Saved src/data/world-110m.json');
}

downloadTopo().catch(console.error);
