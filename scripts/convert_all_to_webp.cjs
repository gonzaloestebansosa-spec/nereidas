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
    } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
      list.push(full);
    }
  });
  return list;
}

async function convertImage(srcPath) {
  const ext = path.extname(srcPath);
  const outWebp = srcPath.slice(0, -ext.length) + '.webp';

  try {
    const meta = await sharp(srcPath).metadata();
    let pipeline = sharp(srcPath);

    // Si la imagen es más ancha de 1200px, redimensionar suavemente a 1200px manteniendo aspecto
    if (meta.width && meta.width > 1200) {
      pipeline = pipeline.resize({ width: 1200, withoutEnlargement: true });
    }

    await pipeline
      .webp({ quality: 80, effort: 6 })
      .toFile(outWebp);

    const origSize = fs.statSync(srcPath).size;
    const newSize = fs.statSync(outWebp).size;
    const pct = (((origSize - newSize) / origSize) * 100).toFixed(1);
    console.log(`[OK] ${srcPath} -> ${path.basename(outWebp)} (${(origSize/1024).toFixed(0)}KB -> ${(newSize/1024).toFixed(0)}KB, -${pct}%)`);
    return { origSize, newSize };
  } catch (err) {
    console.error(`[ERROR] ${srcPath}:`, err.message);
    return null;
  }
}

async function main() {
  console.log('=== CONVERSIÓN MASIVA A WEBP ===');
  const dirs = ['nereidas_imagenes', 'img/highlights'];
  let totalOrig = 0;
  let totalNew = 0;
  let count = 0;

  for (const d of dirs) {
    const images = findImages(d);
    for (const img of images) {
      const res = await convertImage(img);
      if (res) {
        totalOrig += res.origSize;
        totalNew += res.newSize;
        count++;
      }
    }
  }

  console.log('\n=== RESUMEN ===');
  console.log(`Imágenes convertidas: ${count}`);
  console.log(`Peso original: ${(totalOrig / (1024*1024)).toFixed(2)} MB`);
  console.log(`Peso optimizado WebP: ${(totalNew / (1024*1024)).toFixed(2)} MB`);
  console.log(`Ahorro total: -${(((totalOrig - totalNew) / totalOrig) * 100).toFixed(1)}%`);
}

main().catch(console.error);
