const sharp = require('sharp');
const fs = require('fs');

async function processImage() {
  const inputPath = '/Users/annguyen19/.gemini/antigravity/brain/ba353c81-d49c-43c6-8dcf-15b75e69ebf1/wildlife_logo_icon_1782979129235.png';
  const outputPath = '/Users/annguyen19/Desktop/CODE/wildlifedb/public/brand/logo.png';
  
  try {
    const { data, info } = await sharp(inputPath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
      
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i+1];
      const b = data[i+2];
      
      if (r > 235 && g > 235 && b > 235) {
        data[i+3] = 0;
      } else if (r > 200 && g > 200 && b > 200) {
        data[i+3] = Math.max(0, 255 - (r - 200) * 4); // basic smoothing
      }
    }
    
    await sharp(data, {
      raw: { width: info.width, height: info.height, channels: 4 }
    })
    .trim()
    .png()
    .toFile(outputPath);
    
    console.log('Processed image saved to', outputPath);
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

processImage();
