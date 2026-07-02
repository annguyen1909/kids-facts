const fs = require('fs');
const https = require('https');
const path = require('path');

const url = 'https://raw.githubusercontent.com/googlefonts/playfair/main/fonts/ttf/PlayfairDisplay-SemiBold.ttf';
const dest = path.join(__dirname, '../public/fonts/PlayfairDisplay-SemiBold.ttf');

https.get(url, (res) => {
  if (res.statusCode === 200) {
    const file = fs.createWriteStream(dest);
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Downloaded Playfair Display');
    });
  } else {
    console.log('Failed to download, status:', res.statusCode);
  }
}).on('error', (err) => {
  console.log('Error:', err.message);
});
