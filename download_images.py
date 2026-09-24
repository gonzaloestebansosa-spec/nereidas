import os
import zipfile
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor

ASSETS = {
    "Portada": [
        "https://apartnereidas.com.ar/img/sliders/top/01.jpg",
        "https://apartnereidas.com.ar/img/sliders/top/m01.jpg",
        "https://apartnereidas.com.ar/img/sliders/top/02.jpg",
        "https://apartnereidas.com.ar/img/sliders/top/m02.jpg",
        "https://apartnereidas.com.ar/img/sliders/top/03.jpg",
        "https://apartnereidas.com.ar/img/sliders/top/m03.jpg",
        "https://apartnereidas.com.ar/img/sliders/top/04.jpg",
        "https://apartnereidas.com.ar/img/sliders/top/m04.jpg",
        "https://apartnereidas.com.ar/img/fotoinicio.jpg",
    ],
    "Apart_Miel": [
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_1/02_1725894620_66df0fdce4584.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_1/01_1725739803_66dcb31bccfa8.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_1/03_1725739803_66dcb31bd2c57.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_1/04_1725739803_66dcb31bd5af3.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_1/05_1725739803_66dcb31bd880e.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_1/06_1725739803_66dcb31bdb2fb.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_1/07_1725739803_66dcb31bde042.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_1/08_1725739803_66dcb31be0abd.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_1/09_1725739803_66dcb31be4c18.jpg",
    ],
    "Apart_Premium_A": [
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_2/09_1725739863_66dcb35703596.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_2/IMG_7663_1725927514_66df905a53fa1.jpeg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_2/01_1725739862_66dcb3569579c.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_2/IMG_7645_1725927514_66df905a47386.jpeg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_2/IMG_7553_1725927514_66df905a5aedf.jpeg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_2/IMG_7540_1725914765_66df5e8db0ed8.jpeg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_2/02_1725739862_66dcb356a174d.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_2/IMG_7564_1725914765_66df5e8d1b09a.jpeg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_2/08_1725739862_66dcb356e39fb.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_2/07_1725739862_66dcb356d8cf6.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_2/03_1725739862_66dcb356aaf9f.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_2/04_1725739862_66dcb356b71d5.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_2/05_1725739862_66dcb356c1323.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_2/06_1725739862_66dcb356ccee8.jpg",
    ],
    "Apart_Premium_B": [
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_3/6b65f674-6c0e-400c-84ca-f969d0b5e68e%20(1)_1726508996_66e86fc42823d.jpeg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_3/a94c220c-2d28-4539-901f-dc7fe5b85040_1726508996_66e86fc42aebf.jpeg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_3/IMG_7791_1725922793_66df7de9052a7.jpeg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_3/IMG_3968_1725923560_66df80e8f17ce.jpeg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_3/06_1725739929_66dcb399282f0.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_3/05_1725739929_66dcb39920877.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_3/b4adeece-a0d2-4ea7-8a0e-034e719cb86f_1726508996_66e86fc43031c.jpeg",
    ],
    "Apart_Familiar_A": [
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_4/02_1725581702_66da4986912c6.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_4/IMG_7761_1725919592_66df7168907a5.jpeg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_4/01_1725581702_66da49865ef2b.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_4/IMG_7681_1725919592_66df7168950aa.jpeg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_4/14_1725894759_66df10679d629.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_4/03_1725581703_66da49876bfb7.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_4/04_1725581704_66da49884942b.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_4/05_1725894759_66df10678445c.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_4/15_1725894759_66df1067a0240.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_4/06_1725894759_66df106787b06.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_4/IMG_7726_1725919592_66df71688c120.jpeg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_4/07_1725894759_66df10678a510.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_4/20_1725894759_66df1067adcd2.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_4/08_1725894759_66df10678d05d.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_4/16_1725894759_66df1067a2e27.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_4/17_1725894759_66df1067a58de.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_4/18_1725894759_66df1067a8521.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_4/19_1725894759_66df1067ab11c.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_4/09_1725894759_66df10678fca0.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_4/10_1725894759_66df106792728.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_4/11_1725894759_66df106795225.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_4/12_1725894759_66df106797dda.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_4/13_1725894759_66df10679a873.jpg",
    ],
    "Apart_Familiar_B": [
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_5/IMG_7808_1725926090_66df8aca706ec.jpeg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_5/90cfa53e-08ec-4657-b70f-7cd5ad09f9a3_1726512449_66e87d4172eba.jpeg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_5/IMG_7879_1725926091_66df8acb01c34.jpeg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_5/859db912-7b53-4fc0-aa14-0b2ff7bcfeb2_1726512449_66e87d41767c8.jpeg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_5/IMG_7858_1725926090_66df8acaea40a.jpeg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_5/IMG_7856_1725926090_66df8acac0181.jpeg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_5/IMG_7840_1725926090_66df8acab7ccf.jpeg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_5/IMG_7854_1725926090_66df8acacebd1.jpeg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_5/15_1725739978_66dcb3ca1b482.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_5/13_1725739978_66dcb3ca1432c.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_5/14_1725739978_66dcb3ca188d8.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_5/IMG_7826_1725926090_66df8aca69952.jpeg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_5/11_1725739978_66dcb3ca0d2bd.jpg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_5/IMG_7836_1725926090_66df8aca97595.jpeg",
        "https://apartnereidas.com.ar/fotos/apartamentos/depto_5/12_1725739978_66dcb3ca0ff69.jpg",
    ],
    "Servicios": [
        "https://apartnereidas.com.ar/fotos/servicios/03.jpg",
        "https://apartnereidas.com.ar/fotos/servicios/05.jpg",
        "https://apartnereidas.com.ar/fotos/servicios/11.jpg",
        "https://apartnereidas.com.ar/fotos/servicios/14.jpg",
        "https://apartnereidas.com.ar/fotos/servicios/13.jpg",
        "https://apartnereidas.com.ar/fotos/servicios/09.jpg",
        "https://apartnereidas.com.ar/fotos/servicios/06.jpg",
        "https://apartnereidas.com.ar/fotos/servicios/08.jpg",
        "https://apartnereidas.com.ar/fotos/servicios/10.jpg",
        "https://apartnereidas.com.ar/fotos/servicios/04.jpg",
        "https://apartnereidas.com.ar/fotos/servicios/07.jpg",
        "https://apartnereidas.com.ar/fotos/servicios/02.jpg",
        "https://apartnereidas.com.ar/fotos/servicios/01.jpg",
    ],
    "Atracciones": [
        "https://apartnereidas.com.ar/fotos/atracciones/atraccion_1/MardelasPampas.jpeg",
        "https://apartnereidas.com.ar/fotos/atracciones/atraccion_2/caminata-2.png",
        "https://apartnereidas.com.ar/fotos/atracciones/atraccion_3/playaa.jpeg",
        "https://apartnereidas.com.ar/fotos/atracciones/atraccion_4/IMG_8137.jpeg",
    ],
}

def fetch(item):
    folder, url = item
    filename = urllib.parse.unquote(os.path.basename(urllib.parse.urlsplit(url).path))
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = resp.read()
            return f"{folder}/{filename}", data
    except Exception as e:
        print(f"Error en {url}: {e}")
        return None

def main():
    items = [(cat, url) for cat, urls in ASSETS.items() for url in urls]
    print(f"Descargando {len(items)} imágenes...")

    with ThreadPoolExecutor(max_workers=8) as pool:
        results = filter(None, pool.map(fetch, items))

        with zipfile.ZipFile("nereidas_imagenes.zip", "w", zipfile.ZIP_DEFLATED) as zf:
            for path, data in results:
                zf.writestr(path, data)

    print("Archivo 'nereidas_imagenes.zip' generado correctamente.")

if __name__ == "__main__":
    main()
