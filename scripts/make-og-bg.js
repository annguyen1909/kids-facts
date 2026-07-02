const sharp = require('sharp');
const path = require('path');

async function processImage() {
  const inputPath = path.join(__dirname, '../public/images/animals/lion/web/lion-hero-01-1200.webp');
  const outputPath = path.join(__dirname, '../public/brand/og-lion-bg.jpg');

  try {
    await sharp(inputPath)
      .jpeg({ quality: 80 })
      .toFile(outputPath);
    console.log('Successfully converted image to JPG');
  } catch (error) {
    console.error('Error processing image:', error);
  }
}

processImage();
