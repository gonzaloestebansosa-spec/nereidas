const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Hero fallbacks
html = html.replace('src="nereidas_imagenes/Portada/01.jpg"', 'src="nereidas_imagenes/Portada/01.webp"');
html = html.replace('data-src="nereidas_imagenes/Portada/02.jpg"', 'data-src="nereidas_imagenes/Portada/02.webp"');
html = html.replace('data-src="nereidas_imagenes/Portada/03.jpg"', 'data-src="nereidas_imagenes/Portada/03.webp"');
html = html.replace('data-src="nereidas_imagenes/Portada/04.jpg"', 'data-src="nereidas_imagenes/Portada/04.webp"');
html = html.replace('data-src="nereidas_imagenes/Portada/05.jpg"', 'data-src="nereidas_imagenes/Portada/05.webp"');

// Apart thumbnails (200px)
html = html.replace('nereidas_imagenes/Apart_Miel/08_1725739803_66dcb31be0abd.jpg', 'nereidas_imagenes/Apart_Miel/08_1725739803_66dcb31be0abd-thumb.webp');
html = html.replace('nereidas_imagenes/Apart_Premium_A/06_1725739862_66dcb356ccee8.jpg', 'nereidas_imagenes/Apart_Premium_A/06_1725739862_66dcb356ccee8-thumb.webp');
html = html.replace('nereidas_imagenes/Apart_Premium_B/b4adeece-a0d2-4ea7-8a0e-034e719cb86f_1726508996_66e86fc43031c.jpeg', 'nereidas_imagenes/Apart_Premium_B/b4adeece-a0d2-4ea7-8a0e-034e719cb86f_1726508996_66e86fc43031c-thumb.webp');
html = html.replace('nereidas_imagenes/Apart_Familiar_A/07_1725894759_66df10678a510.jpg', 'nereidas_imagenes/Apart_Familiar_A/07_1725894759_66df10678a510-thumb.webp');
html = html.replace('nereidas_imagenes/Apart_Familiar_B/IMG_7826_1725926090_66df8aca69952.jpeg', 'nereidas_imagenes/Apart_Familiar_B/IMG_7826_1725926090_66df8aca69952-thumb.webp');

// Concept mosaic
html = html.replace('src="nereidas_imagenes/Portada/02.jpg"', 'src="nereidas_imagenes/Portada/02.webp"');
html = html.replace('src="nereidas_imagenes/Portada/03.jpg"', 'src="nereidas_imagenes/Portada/03.webp"');

fs.writeFileSync('index.html', html, 'utf8');
console.log('[OK] Fallbacks y thumbnails actualizados a WebP en index.html');
