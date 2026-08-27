# Generadores Andinos SAC — Sitio web corporativo

Sitio web institucional de **Generadores Andinos SAC** (RUC 20612604381), especialistas en:
- **Sincronismo de grupos electrógenos** (paralelismo, tableros ATS/AMF, mantenimiento).
- **Sistemas híbridos de energía** (grupo electrógeno diésel/gas + paneles solares + BESS).

Sitio estático (HTML + CSS + JS puro), sin frameworks ni build step, pensado para publicarse directamente en **GitHub Pages**.

## Estructura del proyecto

```
├── index.html          # Inicio
├── nosotros.html        # La Empresa
├── servicios.html        # Servicios (sincronismo + híbridos, detallado)
├── proyectos.html        # Proyectos (⚠ contiene datos de EJEMPLO)
├── contacto.html         # Contacto + formulario
├── assets/
│   ├── css/styles.css    # Estilos (tokens de diseño, layout, responsive)
│   ├── js/main.js        # Menú móvil, scroll reveal, formulario de contacto
│   └── img/
│       ├── logo.png              # Logo original (fondo blanco)
│       └── logo-transparent.png  # Logo con fondo transparente (para footer oscuro)
└── README.md
```

## ⚠️ Antes de publicar — reemplazar datos de ejemplo

Este sitio se entregó con información de contacto y proyectos **de ejemplo**. Antes de publicarlo:

1. **Teléfono / WhatsApp**: reemplazar `+51 900 000 000` y `51900000000` (en el botón flotante de WhatsApp) en las 5 páginas.
2. **Correo**: reemplazar `ventas@generadoresandinos.pe` por el correo real, en las 5 páginas y en `assets/js/main.js` (línea del `mailto:`).
3. **Proyectos** (`proyectos.html` e `index.html`): reemplazar las 6 fichas de ejemplo (marcadas con `[ejemplo]`) por proyectos reales: nombre del proyecto, sector, potencia/capacidad y año. Por confidencialidad, se recomienda usar nombres genéricos de sector en vez del nombre del cliente si no tiene autorización para publicarlo (p. ej. "Proyecto minero, región centro" en vez del nombre de la mina).
4. **Dirección física**, si desea agregarla (actualmente solo dice "Lima, Perú").
5. **Formulario de contacto**: actualmente arma un `mailto:` con los datos ingresados (no requiere backend). Si prefiere que llegue a una base de datos o a un servicio como Formspree/Google Forms, se puede reemplazar fácilmente el `action` del formulario.

Busque el texto `[ejemplo]` y el comentario `⚠` en el código para ubicar rápidamente todo lo que falta reemplazar.

## Cómo verlo en su computadora

No requiere instalación. Basta con abrir `index.html` en el navegador, o levantar un servidor local simple:

```bash
# Con Python
python3 -m http.server 8080
# Luego abrir http://localhost:8080
```

## Cómo subirlo a GitHub

```bash
cd generadores-andinos-web
git init
git add .
git commit -m "Sitio web inicial - Generadores Andinos SAC"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/generadores-andinos-web.git
git push -u origin main
```

## Cómo publicarlo gratis con GitHub Pages

1. En GitHub, entre al repositorio → **Settings** → **Pages**.
2. En "Build and deployment" → **Source**, seleccione **Deploy from a branch**.
3. En **Branch**, seleccione `main` y la carpeta `/ (root)`.
4. Guarde. En 1-2 minutos el sitio quedará publicado en:
   `https://TU_USUARIO.github.io/generadores-andinos-web/`

Si más adelante desea usar un dominio propio (por ejemplo `www.generadoresandinos.pe`), agregue un archivo `CNAME` en la raíz con ese dominio y configure el DNS del proveedor apuntando a GitHub Pages.

## Tecnologías

- HTML5 semántico
- CSS puro (variables/custom properties, grid y flexbox, sin frameworks)
- JavaScript vanilla (sin dependencias)
- Tipografías de Google Fonts: Oswald, Inter, IBM Plex Mono
