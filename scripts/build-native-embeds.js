const fs = require('fs');
const path = require('path');

const PROD_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(PROD_DIR, 'dist');
const ASSETS_DIST_DIR = path.join(DIST_DIR, 'assets');
const CORE_DIST_DIR = path.join(DIST_DIR, 'core');
const COMPONENTS_DIST_DIR = path.join(DIST_DIR, 'components');

// Ensure output directories exist
[DIST_DIR, ASSETS_DIST_DIR, CORE_DIST_DIR, COMPONENTS_DIST_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Components to EXCLUDE
const EXCLUDED_COMPONENTS = new Set(['skip-navigation']);

function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*([\{}:;,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .join('');
}

function minifyJS(js) {
  let result = '';
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let inLineComment = false;
  let inBlockComment = false;
  let escape = false;

  for (let i = 0; i < js.length; i++) {
    const char = js[i];
    const next = js[i + 1];

    if (inLineComment) {
      if (char === '\n') {
        inLineComment = false;
        result += '\n';
      }
      continue;
    }

    if (inBlockComment) {
      if (char === '*' && next === '/') {
        inBlockComment = false;
        i++;
      }
      continue;
    }

    if (inSingle) {
      result += char;
      if (escape) {
        escape = false;
      } else if (char === '\\') {
        escape = true;
      } else if (char === "'") {
        inSingle = false;
      }
      continue;
    }

    if (inDouble) {
      result += char;
      if (escape) {
        escape = false;
      } else if (char === '\\') {
        escape = true;
      } else if (char === '"') {
        inDouble = false;
      }
      continue;
    }

    if (inTemplate) {
      if (escape) {
        result += char;
        escape = false;
      } else if (char === '\\') {
        result += char;
        escape = true;
      } else if (char === '`') {
        result += char;
        inTemplate = false;
      } else if (char === '\n' || char === '\r') {
        // Collapse newlines inside template strings
      } else {
        result += char;
      }
      continue;
    }

    // Strip comments outside strings
    if (char === '/' && next === '/') {
      inLineComment = true;
      i++;
      continue;
    }

    if (char === '/' && next === '*') {
      inBlockComment = true;
      i++;
      continue;
    }

    // String literal bounds
    if (char === "'") {
      inSingle = true;
      result += char;
      continue;
    }

    if (char === '"') {
      inDouble = true;
      result += char;
      continue;
    }

    if (char === '`') {
      inTemplate = true;
      result += char;
      continue;
    }

    if (char === '\n' || char === '\r') {
      result += ' ';
      continue;
    }

    result += char;
  }

  return result
    .replace(/\s+/g, ' ')
    .replace(/\s*([={}\(\);,:\?!\<\>\&\+\-\*\/])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

function writeEmbedFile(outPath, html) {
  const minified = html
    .replace(/<style>([\s\S]*?)<\/style>/gi, (_, css) => `<style>${minifyCSS(css)}</style>`)
    .replace(/<script([^>]*)>([\s\S]*?)<\/script>/gi, (_, attrs, js) => `<script${attrs}>${minifyJS(js)}</script>`)
    .trim();
  fs.writeFileSync(outPath, minified, 'utf-8');
  return minified.length;
}

console.log('=== Starting Webflow Native Custom Code Bundle Generator ===\n');

// 1. Build Asset Embeds
console.log('--- Generating Asset Embeds ---');

// Asset: Accordion (index-a83eb4d7.js)
const accordionPath = path.join(PROD_DIR, 'assets/scripts/index-a83eb4d7.js');
if (fs.existsSync(accordionPath)) {
  let content = fs.readFileSync(accordionPath, 'utf-8');
  content = content.replace(/export\s*\{[^}]*\};?/g, '');
  const accordionEmbed = `<script>
(function() {
  window.SH = window.SH || {};
  if (!window.SH.Accordion) {
    ${content.trim()}
    window.SH.Accordion = v;
  }
})();
</script>`;
  const len = writeEmbedFile(path.join(ASSETS_DIST_DIR, 'asset-accordion.html'), accordionEmbed);
  console.log(`✓ Generated dist/assets/asset-accordion.html (${len} chars)`);
}

// Asset: Classes (classes-3fe6b683.js)
const classesPath = path.join(PROD_DIR, 'assets/scripts/classes-3fe6b683.js');
if (fs.existsSync(classesPath)) {
  let content = fs.readFileSync(classesPath, 'utf-8');
  content = content.replace(/export\s*\{[^}]*\};?/g, '');
  const classesEmbed = `<script>
(function() {
  window.SH = window.SH || {};
  if (!window.SH.Classes) {
    ${content.trim()}
    window.SH.Classes = s;
  }
})();
</script>`;
  const len = writeEmbedFile(path.join(ASSETS_DIST_DIR, 'asset-classes.html'), classesEmbed);
  console.log(`✓ Generated dist/assets/asset-classes.html (${len} chars)`);
}

// Asset: Breakpoints (breakpoints-11c55833.js)
const breakpointsPath = path.join(PROD_DIR, 'assets/scripts/breakpoints-11c55833.js');
if (fs.existsSync(breakpointsPath)) {
  let content = fs.readFileSync(breakpointsPath, 'utf-8');
  content = content.replace(/export\s*\{[^}]*\};?/g, '');
  const breakpointsEmbed = `<script>
(function() {
  window.SH = window.SH || {};
  if (!window.SH.Breakpoints) {
    ${content.trim()}
    window.SH.Breakpoints = E;
  }
})();
</script>`;
  const len = writeEmbedFile(path.join(ASSETS_DIST_DIR, 'asset-breakpoints.html'), breakpointsEmbed);
  console.log(`✓ Generated dist/assets/asset-breakpoints.html (${len} chars)`);
}

// Asset: Scroll Lock (scroll-lock-a7e8b431.js)
const scrollLockPath = path.join(PROD_DIR, 'assets/scripts/scroll-lock-a7e8b431.js');
if (fs.existsSync(scrollLockPath)) {
  let content = fs.readFileSync(scrollLockPath, 'utf-8');
  content = content.replace(/import\s*[\s\S]*?from\s*["'][^"']+["'];?/g, '');
  content = content.replace(/export\s*\{[^}]*\};?/g, '');
  const scrollLockEmbed = `<script>
(function() {
  window.SH = window.SH || {};
  if (!window.SH.lockScroll) {
    var t = window.SH.Classes || {};
    ${content.trim()}
    window.SH.lockScroll = e;
    window.SH.unlockScroll = s;
    window.SH.toggleScroll = d;
  }
})();
</script>`;
  const len = writeEmbedFile(path.join(ASSETS_DIST_DIR, 'asset-scroll-lock.html'), scrollLockEmbed);
  console.log(`✓ Generated dist/assets/asset-scroll-lock.html (${len} chars)`);
}

// Asset: Swiper via esm.sh (Single clean ESM embed)
const swiperEmbed = `<script type="module">
  import Swiper, { Autoplay, Pagination, Navigation, EffectFade } from 'https://esm.sh/swiper@8';
  window.SH = window.SH || {};
  window.SH.Swiper = Swiper;
  window.SH.SwiperAutoplay = Autoplay;
  window.SH.SwiperPagination = Pagination;
  window.SH.SwiperNavigation = Navigation;
  window.SH.SwiperEffectFade = EffectFade;
</script>`;
const swiperLen = writeEmbedFile(path.join(ASSETS_DIST_DIR, 'asset-swiper.html'), swiperEmbed);
console.log(`✓ Generated dist/assets/asset-swiper.html (${swiperLen} chars)`);

// 2. Build Main Core Embed (main.css + main.js + insert-styles)
console.log('\n--- Generating Core Embed ---');
const mainCssPath = path.join(PROD_DIR, 'main.css');
const mainJsPath = path.join(PROD_DIR, 'main.js');
const insertStylesPath = path.join(PROD_DIR, 'assets/scripts/insert-styles-43b34cac.js');

let mainCss = fs.existsSync(mainCssPath) ? fs.readFileSync(mainCssPath, 'utf-8') : '';
let mainJs = fs.existsSync(mainJsPath) ? fs.readFileSync(mainJsPath, 'utf-8') : '';
let insertStylesContent = fs.existsSync(insertStylesPath) ? fs.readFileSync(insertStylesPath, 'utf-8').replace(/export\s*\{[^}]*\};?/g, '') : '';

const mainCoreEmbed = `<style>
${mainCss.trim()}
</style>

<script>
(function() {
  window.SH = window.SH || {};
  window.SH.registry = window.SH.registry || [];

  // Register function for component embeds
  window.SH.register = function(id, fn) {
    if (window.SH._initialized) {
      try { fn(); } catch(e) { console.warn('[Component ' + id + ']', e); }
    } else {
      window.SH.registry.push({ id: id, fn: fn });
    }
  };

  // Insert Styles Helper
  if (!window.SH.insertStyles) {
    ${insertStylesContent.trim()}
    window.SH.insertStyles = r;
  }

  // Animation Controller Core (main.js)
  ${mainJs.trim()}

  // Master DOMContentLoaded Runner (single listener for all components & animations)
  function runAll() {
    if (window.SH._initialized) return;
    window.SH._initialized = true;

    // 1. Initialize Animation Controller (ot from main.js)
    if (typeof ot !== 'undefined' && ot.init) {
      ot.init();
    }

    // 2. Execute all registered Component functions
    window.SH.registry.forEach(function(item) {
      try {
        item.fn();
      } catch (err) {
        console.warn('[Component ' + item.id + '] Execution error:', err);
        var preloader = document.querySelector('[data-component-id="' + item.id + '"] [data-role="preloader"]');
        if (preloader && window.SH.Classes) preloader.classList.add(window.SH.Classes.DISABLED);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAll);
  } else {
    runAll();
  }
})();
</script>`;

const coreLen = writeEmbedFile(path.join(CORE_DIST_DIR, 'main-core.html'), mainCoreEmbed);
console.log(`✓ Generated dist/core/main-core.html (${coreLen} chars)`);

// 3. Build Component Embeds
console.log('\n--- Generating Component Embeds ---');
const componentsDir = path.join(PROD_DIR, 'components');
const componentFolders = fs.readdirSync(componentsDir).filter(f => {
  const fullPath = path.join(componentsDir, f);
  return fs.statSync(fullPath).isDirectory() && !EXCLUDED_COMPONENTS.has(f);
});

componentFolders.forEach(compName => {
  const compIndexPath = path.join(componentsDir, compName, 'index.js');
  if (!fs.existsSync(compIndexPath)) return;

  let code = fs.readFileSync(compIndexPath, 'utf-8');

  const importsMap = [];
  const importRegex = /import\s*(?:(?:\{([^}]+)\})|(?:(\*\s+as\s+\w+))|(?:(\w+)))?\s*from\s*["']\.\.\/\.\.\/assets\/scripts\/([^"']+)["'];?/g;

  let match;
  let cleanCode = code.replace(/import\s*["']\.\.\/\.\.\/assets\/scripts\/[^"']+["'];?/g, '');

  while ((match = importRegex.exec(code)) !== null) {
    const namedImportsStr = match[1];
    const fileChunk = match[4];

    if (namedImportsStr) {
      const parts = namedImportsStr.split(',').map(s => s.trim());
      parts.forEach(p => {
        const [exportedName, localName] = p.split(/\s+as\s+/).map(s => s.trim());
        const targetLocal = localName || exportedName;

        let globalTarget = '';
        if (fileChunk.includes('insert-styles')) globalTarget = 'window.SH.insertStyles';
        else if (fileChunk.includes('classes')) globalTarget = 'window.SH.Classes';
        else if (fileChunk.includes('breakpoints')) globalTarget = 'window.SH.Breakpoints';
        else if (fileChunk.includes('index-a83eb4d7')) globalTarget = 'window.SH.Accordion';
        else if (fileChunk.includes('scroll-lock')) {
          if (exportedName === 'l') globalTarget = 'window.SH.lockScroll';
          else if (exportedName === 'u') globalTarget = 'window.SH.unlockScroll';
          else if (exportedName === 't') globalTarget = 'window.SH.toggleScroll';
        }
        else if (fileChunk.includes('core-b8cf')) globalTarget = 'window.SH.Swiper';
        else if (fileChunk.includes('autoplay')) globalTarget = 'window.SH.SwiperAutoplay';
        else if (fileChunk.includes('pagination')) {
          globalTarget = (exportedName === 'N') ? 'window.SH.SwiperNavigation' : 'window.SH.SwiperPagination';
        }
        else if (fileChunk.includes('effect-fade')) globalTarget = 'window.SH.SwiperEffectFade';

        if (globalTarget) {
          importsMap.push(`const ${targetLocal} = ${globalTarget};`);
        }
      });
    }
  }

  cleanCode = cleanCode.replace(importRegex, '');
  const prelude = importsMap.length ? importsMap.join('\n  ') + '\n  ' : '';
  const isAsync = cleanCode.includes('await ');

  const compEmbed = `<script>
(window.SH = window.SH || {}).register?.('${compName}', ${isAsync ? 'async ' : ''}function() {
  ${prelude}${cleanCode.trim()}
});
</script>`;

  const outPath = path.join(COMPONENTS_DIST_DIR, `${compName}.html`);
  const compLen = writeEmbedFile(outPath, compEmbed);

  const isOverLimit = compLen > 50000;
  const status = isOverLimit ? '❌ OVER 50K LIMIT' : '✓ OK';
  console.log(`${status} Generated dist/components/${compName}.html (${compLen} chars)`);
});

console.log('\n=== Bundle Generation Complete! ===');
