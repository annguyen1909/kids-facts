const fs = require('fs');
const path = require('path');

const animalsDir = path.join(__dirname, '..', 'content', 'animals');
const animals = fs.readdirSync(animalsDir).filter(f => fs.statSync(path.join(animalsDir, f)).isDirectory());

function truncate(str, maxLen) {
  if (!str || str.length <= maxLen) return str;
  // Truncate to maxLen and try not to break words if possible, but strict limit is more important for SEO
  let truncated = str.substr(0, maxLen - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxLen - 20) {
    truncated = truncated.substr(0, lastSpace);
  }
  return truncated + '...';
}

animals.forEach(animal => {
  const jsonPath = path.join(animalsDir, animal, 'animal.json');
  if (!fs.existsSync(jsonPath)) return;
  
  const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  let changed = false;
  
  if (json.metaTitle && json.metaTitle.length > 60) {
    json.metaTitle = truncate(json.metaTitle, 60);
    changed = true;
  }
  
  if (json.metaDescription && json.metaDescription.length > 160) {
    json.metaDescription = truncate(json.metaDescription, 160);
    changed = true;
  }
  
  if (json.summary && json.summary.length > 160) {
    json.summary = truncate(json.summary, 160);
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2) + '\\n', 'utf8');
  }
});

console.log('JSON SEO truncation complete!');
