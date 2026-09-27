const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

function findImages(dir) {
  let list = [];
  if (!fs.existsSync(dir)) return list;
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      list = list.concat(findImages(full));
    } else if (/\.(webp)$/i.test(file) && !file.includes('-thumb') && !file.includes('-mobile') && !file.includes('-opt')) {
      list.push(full);
    }
  });
  return list;
}

async function main() {
  const aptDirs = [
    'nereidas_imagenes/Apart_Miel',
    'nereidas_imagenes/Apart_Premium_A',
    'nereidas_imagenes/Apart_Premium_B',
    'nereidas_imagenes/Apart_Familiar_A',
    'nereidas_imagenes/Apart_Familiar_B'
  ];

  let count = 0;
  for (const d of aptDirs) {
    const webps = findImages(d);
    for (const img of webps) {
      const ext = path.extname(img);
      const outThumb = img.slice(0, -ext.length) + '-thumb.webp';
      await sharp(img)
        .resize({ width: 500, withoutEnlargement: true })
        .webp({ quality: 78, effort: 5 })
        .toFile(outThumb);
      count++;
    }
  }
  console.log(`Generados ${count} thumbnails responsive (-thumb.webp) para apartamentos.`);
}

main().catch(console.error);
