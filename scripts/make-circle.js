const sharp = require('sharp');

async function processImage() {
  const inputPath = '/Users/annguyen19/.gemini/antigravity/brain/ba353c81-d49c-43c6-8dcf-15b75e69ebf1/colored_lion_logo_1782979469033.png';
  const outputPath = '/Users/annguyen19/Desktop/CODE/wildlifedb/public/brand/logo-colored.png';
  
  try {
    const info = await sharp(inputPath).metadata();
    const size = Math.min(info.width, info.height);
    const r = size / 2;
    
    // Create a circular SVG mask
    const circleSvg = `<svg width="${size}" height="${size}">
      <circle cx="${r}" cy="${r}" r="${r}" fill="white"/>
    </svg>`;
    
    await sharp(inputPath)
      .resize(size, size, {
        fit: 'cover',
        position: 'center'
      })
      .composite([{
        input: Buffer.from(circleSvg),
        blend: 'dest-in'
      }])
      .png()
      .toFile(outputPath);
      
    console.log('Colored circular image saved to', outputPath);
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

processImage();
