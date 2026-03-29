const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const drinksDir = path.join(__dirname, 'public', 'drinks');

async function removeWhiteBg(filePath) {
  const ext = path.extname(filePath);
  const name = path.basename(filePath);

  try {
    const { data, info } = await sharp(filePath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    const pixels = new Uint8Array(data);

    // Make near-white pixels transparent
    const threshold = 240; // pixels with R,G,B all > threshold become transparent
    for (let i = 0; i < pixels.length; i += channels) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      if (r > threshold && g > threshold && b > threshold) {
        pixels[i + 3] = 0; // set alpha to 0
      }
    }

    // Save back as proper PNG
    await sharp(Buffer.from(pixels), { raw: { width, height, channels } })
      .png()
      .toFile(filePath + '.tmp');

    fs.renameSync(filePath + '.tmp', filePath);
    console.log(`✅ ${name}: removed white bg (${width}x${height})`);
  } catch (err) {
    console.error(`❌ ${name}: ${err.message}`);
  }
}

async function main() {
  const files = fs.readdirSync(drinksDir).filter(f => f.endsWith('.png'));
  console.log(`Processing ${files.length} images...`);

  for (const file of files) {
    await removeWhiteBg(path.join(drinksDir, file));
  }

  console.log('\nDone!');
}

main();
