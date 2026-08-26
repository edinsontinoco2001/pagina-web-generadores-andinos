# Generadores Andinos — Sitio web

Sitio de una página para **Generadores Andinos**, especialistas en mantenimiento
de grupos electrógenos bajo contratos con SLA, con cotizador de planes
filtrable por capacidad (kVA) y marca.

## Archivos
- `index.html` — estructura de la página
- `styles.css` — estilos (paleta, tipografía, layout)
- `script.js` — lógica del cotizador de planes y del formulario de contacto
- `assets/logo.svg` — logo vectorial (edítalo con cualquier editor de SVG o texto)

## 1. Editar precios y datos de contacto
Antes de publicar, abre `script.js` y edita el objeto `PRICING` con tus precios
reales por capacidad y plan. También cambia en `index.html` el correo,
teléfono y WhatsApp por los reales (búscalos con Ctrl+F: `999 999 999` y
`contacto@generadoresandinos.pe`).

## 2. Subir a GitHub (sin instalar nada, desde el navegador)
1. Entra a [github.com](https://github.com) y crea un repositorio nuevo, por
   ejemplo `generadores-andinos`.
2. Sube estos 4 archivos/carpetas usando el botón **"Add file" → "Upload files"**,
   o ábrelos con el editor en línea presionando el punto `.` en el repo
   (se abre como `https://github.dev/tu-usuario/generadores-andinos`).
3. Haz commit de los cambios (mensaje: "Primera versión del sitio").

## 3. Activar GitHub Pages
1. En el repositorio, ve a **Settings → Pages**.
2. En "Branch" selecciona `main` y la carpeta `/ (root)`.
3. Guarda. En unos minutos tu sitio estará en:
   `https://tu-usuario.github.io/generadores-andinos/`

## 4. Conectar tu dominio de GoDaddy
1. En GitHub: **Settings → Pages → Custom domain**, escribe tu dominio
   (ej. `generadoresandinos.pe`) y guarda. Esto crea un archivo `CNAME`
   automáticamente en tu repo.
2. En GoDaddy: entra a **Mis Dominios → DNS** de tu dominio y agrega:
   - 4 registros tipo **A** apuntando a las IPs de GitHub Pages:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Un registro **CNAME** con nombre `www` apuntando a
     `tu-usuario.github.io`
3. Espera la propagación del DNS (minutos a 48 horas).
4. En GitHub Pages, activa la casilla **"Enforce HTTPS"** cuando aparezca
   disponible (puede tardar un rato tras conectar el dominio).

## 5. Formulario de contacto
El formulario actual abre el correo del usuario con los datos precargados
(no requiere servidor, funciona en GitHub Pages). Si prefieres que el envío
sea silencioso (sin abrir el correo), conecta el formulario a un servicio
gratuito como [Formspree](https://formspree.io) o [Web3Forms](https://web3forms.com)
y reemplaza el bloque final de `script.js` según sus instrucciones.

## Personalización rápida
- **Colores:** están definidos como variables al inicio de `styles.css`
  (`:root { --amber-500: ...; --steel-500: ...; }`).
- **Logo:** `assets/logo.svg` es editable como texto o en Figma/Illustrator.
  También se usa una copia del dibujo directamente dentro de `index.html`
  (dentro de `<svg class="brand-mark">`) para que cambie de color con el tema;
  si rediseñas el logo, actualiza ambos lugares.
