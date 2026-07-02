const fs = require('fs');
const path = require('path');

const animalsDir = path.join(__dirname, '..', 'content', 'animals');
const animals = fs.readdirSync(animalsDir).filter(f => fs.statSync(path.join(animalsDir, f)).isDirectory());

animals.forEach(animal => {
  const jsonPath = path.join(animalsDir, animal, 'animal.json');
  if (!fs.existsSync(jsonPath)) return;
  
  let content = fs.readFileSync(jsonPath, 'utf8');
  if (content.endsWith('\\n')) {
    content = content.slice(0, -2) + '\n';
    fs.writeFileSync(jsonPath, content, 'utf8');
  }
});
console.log("Fixed trailing characters in JSON files");
