import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function generate() {
  const svgPath = path.resolve('./public/icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  // 1. pwa-192x192.png
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile('./public/pwa-192x192.png');
  console.log('Generated pwa-192x192.png');

  // 2. pwa-512x512.png
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile('./public/pwa-512x512.png');
  console.log('Generated pwa-512x512.png');

  // 3. apple-touch-icon.png (180x180 for iOS Safari)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile('./public/apple-touch-icon.png');
  console.log('Generated apple-touch-icon.png');

  // 4. pwa-maskable-512x512.png (80% scale on dark circular/squircle canvas for 10-15% safe zone)
  const innerIcon = await sharp(svgBuffer)
    .resize(410, 410)
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 7, g: 10, b: 15, alpha: 1 },
    },
  })
    .composite([{ input: innerIcon, top: 51, left: 51 }])
    .png()
    .toFile('./public/pwa-maskable-512x512.png');
  console.log('Generated pwa-maskable-512x512.png');

  // 5. favicon.ico / favicon-32x32.png
  await sharp(svgBuffer)
    .resize(48, 48)
    .png()
    .toFile('./public/favicon.ico');
  console.log('Generated favicon.ico');

  console.log('All PWA icons generated successfully!');
}

generate().catch(console.error);
