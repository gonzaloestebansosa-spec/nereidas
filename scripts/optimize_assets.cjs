const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processImage(inputPath, outputPath, options = {}) {
  if (!fs.existsSync(inputPath)) {
    console.warn('Input not found:', inputPath);
    return null;
  }
  const origSize = fs.statSync(inputPath).size;
  let pipeline = sharp(inputPath);

  if (options.resize) {
    pipeline = pipeline.resize(options.resize.width, options.resize.height, {
      withoutEnlargement: true,
      fit: options.resize.fit || 'inside'
    });
  }

  if (options.format === 'webp') {
    pipeline = pipeline.webp({ quality: options.quality || 80, effort: 6 });
  } else if (options.format === 'png') {
    pipeline = pipeline.png({ quality: options.quality || 85, compressionLevel: 9 });
  } else if (options.format === 'jpeg') {
    pipeline = pipeline.jpeg({ quality: options.quality || 80, mozjpeg: true });
  }


  await pipeline.toFile(outputPath);
  const newSize = fs.statSync(outputPath).size;
  const pct = (((origSize - newSize) / origSize) * 100).toFixed(1);
  console.log(
    path.basename(inputPath), '->', path.basename(outputPath),
    ':', (origSize / 1024).toFixed(1), 'KB ->', (newSize / 1024).toFixed(1), 'KB (-' + pct + '%)'
  );
  return { origSize, newSize };
}

async function run() {
  console.log('=== INICIANDO OPTIMIZACIÓN@DE ASSETS ===');

  // 1. HERO SLIDESHOW
  console.log('\n--- 1. Hero Slideshow ---');
  for (let i = 1; i <= 5; i++) {
    const num = '0' + i;
    const src = path.join('nereidas_imagenes/Portada', num + '.jpg');
    // Desktop WebP (1600px)
    const outDesk = path.join('nereidas_imagenes/Portada', num + '.webp');
    await processImage(src, outDesk, { format: 'webp', quality: 80, resize: { width: 1600 } });
    // Mobile WebP (800px)
    const outMob = path.join('nereidas_imagenes/Portada', num + '-mobile.webp');
    await processImage(src, outMob, { format: 'webp', quality: 80, resize: { width: 800 } });
  }

  // 2. ATRACCIONES
  console.log('\v--- 2. Atracciones ---');
  const atracciones = [
    { name: 'senderos del bosque.jpeg', width: 1200, mobWidth: 600 },
    { name: 'Querandi.jpeg', width: 1200, mobWidth: 600 },
    { name: 'centro aldea.jpg', width: 800, mobWidth: 500 },
    { name: 'Playas amplias.jpeg', width: 800, mobWidth: 500 }
  ];
  for (const a of atracciones) {
    const src = path.join('nereidas_imagenes/Atracciones', a.name);
    const base = path.basename(a.name, path.extname(a.name));
    const outWebp = path.join('nereidas_imagenes/Atracciones', base + '.webp');
    await processImage(src, outWebp, { format: 'webp', quality: 80, resize: { width: a.width } });
    const outMob = path.join('nereidas_imagenes/Atracciones', base + '-mobile.webp');
    await processImage(src, outMob, { format: 'webp', quality: 80, resize: { width: a.mobWidth } });
  }

  // 3. CONCEPTO / COMPLEJO
  console.log('\n--- 3. Concepto / Servicios ---');
  const conceptoImgs = [
    { dir: 'nereidas_imagenes/Servicios', file: '04.jpg', width: 800 }
  ];
  for (const c of conceptoImgs) {
    const src = path.join(c.dir, c.file);
    const base = path.basename(c.file, path.extname(c.file));
    const out = path.join(c.dir, base + '.webp');
    await processImage(src, out, { format: 'webp', quality: 80, resize: { width: c.width } });
  }

  // 4. PORTADAS DE APARTAMENTOS
  console.log('\n--- 4. Portadas de Apartamentos ---');
  const aptPortadas = [
    { dir: 'nereidas_imagenes/Apart_Miel', file: '08_1725739803_66dcb31be0abd.jpg' },
    { dir: 'nereidas_imagenes/Apart_Premium_A', file: '06_1725739862_66dcb356ccee8.jpg' },
    { dir: 'nereidas_imagenes/Apart_Premium_B', file: 'b4adeece-a0d2-4ea7-8a0e-034e719cb86f_1726508996_66e86fc43031c.jpeg' },
    { dir: 'nereidas_imagenes/Apart_Familiar_A', file: '07_1725894759_66df10678a510.jpg' },
    { dir: 'nereidas_imagenes/Apart_Familiar_B', file: 'IMG_7826_1725926090_66df8aca69952.jpeg' }
  ];
  for (const ap of aptPortadas) {
    const src = path.join(ap.dir, ap.file);
    const base = path.basename(ap.file, path.extname(ap.file));
    const out = path.join(ap.dir, base + '.webp');
    await processImage(src, out, { format: 'webp', quality: 80, resize: { width: 800 } });
  }

  // 5. BRANDING (Logos y Favicon)
  console.log('\n--- 5. Logos y Favicon ---');
  // Favicon
  await processImage('favicon.png', 'favicon-opt.png', { format: 'png', quality: 85, resize: { width: 64, height: 64 } });
  await processImage('favicon.png', 'apple-touch-icon-opt.png', { format: 'png', quality: 85, resize: { width: 180, height: 180 } });
  // Navbar logo
  await processImage('logo.png', 'logo.webp', { format: 'webp', quality: 85, resize: { width: 280 } });
  await processImage('logo.png', 'logo-opt.png', { format: 'png', quality: 85, resize: { width: 280 } });
  // Drawer logo
  await processImage('img/logo_drawer.png', 'img/logo_drawer.webp', { format: 'webp', quality: 85, resize: { width: 280 } });
  await processImage('img/logo_drawer.png', 'img/logo_drawer-opt.png', { format: 'png', quality: 85, resize: { width: 280 } });
  // Footer logo
  await processImage('img/logo_footer_gold.png', 'img/logo_footer_gold.webp', { format: 'webp', quality: 80, resize: { width: 280 } });
  await processImage('img/logo_footer_gold.png', 'img/logo_footer_gold-opt.png', { format: 'png', quality: 85, resize: { width: 280 } });

  console.log('\n=== PROCESAMIENTO COMPLETADO CON ÉXITO ===');
}

run().catch(console.error);

