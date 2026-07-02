const fs = require('fs');
const path = require('path');

const animalsDir = path.join(__dirname, '..', 'content', 'animals');
const animals = fs.readdirSync(animalsDir).filter(f => fs.statSync(path.join(animalsDir, f)).isDirectory());

animals.forEach(animal => {
  const mdxPath = path.join(animalsDir, animal, 'core.mdx');
  const jsonPath = path.join(animalsDir, animal, 'animal.json');
  
  if (!fs.existsSync(mdxPath) || !fs.existsSync(jsonPath)) return;
  
  let mdx = fs.readFileSync(mdxPath, 'utf8');
  const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  // 1. Remove broken /topics/social-animals link completely.
  mdx = mdx.replace(/.*\[.*?\]\(\/topics\/social-animals\).*\n?/gi, '');
  
  // 2. Fix Tone (remove AI words)
  const toneMap = {
    'colossal': 'massive',
    'marvel': 'fascinating example',
    'extraordinary': 'unique',
    'biological warfare': 'biological defense',
    'Colossal': 'Massive',
    'Marvel': 'Fascinating example',
    'Extraordinary': 'Unique',
    'Biological warfare': 'Biological defense'
  };
  
  for (const [bad, good] of Object.entries(toneMap)) {
    const regex = new RegExp(`\\b${bad}\\b`, 'g');
    mdx = mdx.replace(regex, good);
  }
  
  // 3. Add Inline Citation for Conservation
  const disclaimer = `\n*(Population and conservation trend data sourced from the IUCN Red List of Threatened Species)*\n`;
  if (!mdx.includes(disclaimer.trim())) {
    mdx = mdx.replace(/(## Conservation Status and Threats\n)/, `$1${disclaimer}\n`);
  }
  
  // 4. Inject Internal Links
  const habitat = json.habitat; // e.g. "savanna"
  const diet = json.dietType?.toLowerCase(); // e.g. "carnivore"
  const family = json.taxonomy?.family?.toLowerCase();
  
  function addLink(text, keyword, url) {
    if (!keyword) return text;
    if (!text.includes(url)) {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'i');
      text = text.replace(regex, `[$1](${url})`);
    }
    return text;
  }
  
  if (habitat) {
    mdx = addLink(mdx, habitat, `/habitats/${habitat}`);
  }
  if (diet) {
    mdx = addLink(mdx, diet, `/diets/${diet}`);
  }
  if (family) {
    mdx = addLink(mdx, family, `/families/${family}`);
  }
  
  fs.writeFileSync(mdxPath, mdx, 'utf8');
});

console.log('MDX refinements complete!');
