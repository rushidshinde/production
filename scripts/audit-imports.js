const fs = require('fs');
const path = require('path');

const compDir = path.resolve(__dirname, '../components');
const excluded = new Set();

console.log('Component Name | Raw Import Chunks in Source | Asset Embeds Required in dist');
console.log('---|---|---');

fs.readdirSync(compDir).forEach(compName => {
  if (excluded.has(compName)) return;
  const filePath = path.join(compDir, compName, 'index.js');
  if (!fs.existsSync(filePath)) return;

  const code = fs.readFileSync(filePath, 'utf-8');
  const importLines = code.match(/import[^;\n]+;/g) || [];

  const files = new Set();
  importLines.forEach(line => {
    const fileMatch = line.match(/assets\/scripts\/([^"']+)/);
    if (fileMatch) files.add(fileMatch[1]);
  });

  const assetEmbeds = new Set();
  files.forEach(f => {
    if (f.includes('insert-styles')) assetEmbeds.add('main-core.html (Core)');
    else if (f.includes('classes')) assetEmbeds.add('asset-classes.html');
    else if (f.includes('breakpoints')) assetEmbeds.add('asset-breakpoints.html');
    else if (f.includes('index-a83eb4d7')) assetEmbeds.add('asset-accordion.html');
    else if (f.includes('scroll-lock')) assetEmbeds.add('asset-scroll-lock.html');
    else if (f.includes('core-b8cf') || f.includes('autoplay') || f.includes('pagination') || f.includes('effect-fade')) {
      assetEmbeds.add('asset-swiper.html');
    } else if (f.includes('SmoothScroll')) {
      assetEmbeds.add('(SmoothScroll - Excluded)');
    }
  });

  console.log(`${compName} | ${Array.from(files).join(', ')} | ${Array.from(assetEmbeds).join(', ')}`);
});
