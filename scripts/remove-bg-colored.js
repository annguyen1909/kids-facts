const sharp = require('sharp');

async function processImage() {
  const inputPath = '/Users/annguyen19/.gemini/antigravity/brain/ba353c81-d49c-43c6-8dcf-15b75e69ebf1/lion_side_profile_1782979600340.png';
  const outputPath = '/Users/annguyen19/Desktop/CODE/wildlifedb/public/brand/logo-side-nobg.png';
  
  try {
    const { data, info } = await sharp(inputPath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
      
    // Remove white background
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i+1];
      const b = data[i+2];
      
      // If it's a very light pixel (white background)
      if (r > 240 && g > 240 && b > 240) {
        data[i+3] = 0; // Set Alpha to 0
      } else if (r > 200 && g > 200 && b > 200) {
        // smooth edges
        data[i+3] = Math.max(0, 255 - (r - 200) * 4);
      }
    }
    
    await sharp(data, {
      raw: { width: info.width, height: info.height, channels: 4 }
    })
    .trim()
    .png()
    .toFile(outputPath);
    
    console.log('Colored no-bg image saved to', outputPath);
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

processImage();
