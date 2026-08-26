// ============================================
// GENERADORES ANDINOS — script.js
// Cotizador de planes por capacidad + interacciones básicas
// ============================================

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Menú móvil ---------- */
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

/* ---------- Dataset de precios ----------
   EDITA ESTOS VALORES con tus precios reales.
   Precio referencial en soles (S/) por equipo / mes.
   Ajusta según capacidad (kVA) y marca si tu costo varía por marca.
------------------------------------------------ */
const PRICING = {
  c1: { label: 'Hasta 100 kVA',      esencial: 480,  operativo: 780,  full: 1250 },
  c2: { label: '101–250 kVA',        esencial: 620,  operativo: 980,  full: 1650 },
  c3: { label: '251–500 kVA',        esencial: 850,  operativo: 1350, full: 2200 },
  c4: { label: '501–1000 kVA',       esencial: 1150, operativo: 1850, full: 3100 },
  c5: { label: 'Más de 1000 kVA',    esencial: 1600, operativo: 2600, full: 4300 },
};

// Recargo referencial según marca (algunas marcas requieren repuestos/importación más costosa)
const BRAND_FACTOR = {
  cualquiera: 1,
  cat: 1.08,
  cummins: 1.05,
  perkins: 0.97,
};

const PLAN_META = {
  esencial: {
    name: 'Plan Esencial',
    sla: 'SLA: respuesta en 48 horas',
    led: 'amber',
    features: [
      'Mantenimiento preventivo trimestral',
      'Revisión de niveles, filtros y batería',
      'Informe técnico por visita',
    ],
  },
  operativo: {
    name: 'Plan Operativo',
    sla: 'SLA: respuesta en 24 horas',
    led: 'steel',
    features: [
      'Mantenimiento preventivo mensual',
      'Correctivo prioritario incluido',
      'Descuento en repuestos de desgaste',
    ],
    featured: true,
  },
  full: {
    name: 'Plan Full SLA',
    sla: 'SLA: respuesta en 8 horas',
    led: 'good',
    features: [
      'Preventivo + correctivo sin límite de visitas',
      'Repuestos críticos incluidos',
      'Monitoreo remoto y reporte mensual',
    ],
  },
};

let state = { capacity: 'c1', brand: 'cualquiera' };

function formatPrice(value) {
  return new Intl.NumberFormat('es-PE', { maximumFractionDigits: 0 }).format(Math.round(value));
}

function renderPlans() {
  const grid = document.getElementById('plansGrid');
  const data = PRICING[state.capacity];
  const factor = BRAND_FACTOR[state.brand] ?? 1;

  grid.innerHTML = Object.keys(PLAN_META).map((key) => {
    const meta = PLAN_META[key];
    const price = data[key] * factor;
    return `
      <div class="plan-card ${meta.featured ? 'is-featured' : ''}">
        <div class="plan-top">
          <span class="plan-name">${meta.name}</span>
          <span class="plan-led ${meta.led}"></span>
        </div>
        <div class="plan-price">S/ ${formatPrice(price)}<small> / equipo / mes</small></div>
        <span class="plan-sla">${meta.sla}</span>
        <ul class="plan-features">
          ${meta.features.map((f) => `<li>${f}</li>`).join('')}
        </ul>
        <a href="#contacto" class="btn ${meta.featured ? 'btn-amber' : 'btn-ghost'}">Cotizar este plan</a>
      </div>
    `;
  }).join('');
}

function setupSegmented(groupId, stateKey) {
  const group = document.getElementById(groupId);
  group.addEventListener('click', (e) => {
    const btn = e.target.closest('.seg-btn');
    if (!btn) return;
    group.querySelectorAll('.seg-btn').forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    state[stateKey] = btn.dataset[stateKey];
    renderPlans();
  });
}

setupSegmented('capacityGroup', 'capacity');
setupSegmented('brandGroup', 'brand');
renderPlans();

/* ============================================
   CATÁLOGO DE REPUESTOS — se alimenta de un CSV
   ============================================

   Por defecto lee data/repuestos.csv (dentro de este mismo repositorio).

   ALTERNATIVA RECOMENDADA para que el equipo comercial actualice el
   catálogo directamente desde Excel/Google Sheets sin tocar código:
   1) Sube tu Excel a Google Sheets.
   2) Archivo → Compartir → Publicar en la Web → formato CSV.
   3) Copia el enlace que te da Google y reemplázalo aquí abajo:
        const PARTS_CSV_URL = "https://docs.google.com/.../pub?output=csv";
   Cada vez que el equipo edite el Sheet, la web se actualiza sola
   (no hace falta volver a subir nada a GitHub).
------------------------------------------------ */
const PARTS_CSV_URL = 'data/repuestos.csv';

let PARTS_DATA = [];
let partsFilters = { texto: '', categoria: '', marca: '' };

// Parser de CSV simple, soporta campos entre comillas con comas dentro.
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (char === '"') { inQuotes = false; }
      else { field += char; }
    } else {
      if (char === '"') { inQuotes = true; }
      else if (char === ',') { row.push(field); field = ''; }
      else if (char === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (char === '\r') { /* ignorar */ }
      else { field += char; }
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }

  const headers = rows.shift().map((h) => h.trim());
  return rows
    .filter((r) => r.length === headers.length && r.some((v) => v.trim() !== ''))
    .map((r) => Object.fromEntries(headers.map((h, idx) => [h, (r[idx] || '').trim()])));
}

function stockBadge(stock) {
  const isStock = (stock || '').toLowerCase() === 'en_stock';
  return `<span class="stock-badge ${isStock ? 'in' : 'low'}">${isStock ? 'En stock' : 'Bajo pedido'}</span>`;
}

function formatPartPrice(value) {
  const num = parseFloat(value);
  return isNaN(num) ? value : `S/ ${new Intl.NumberFormat('es-PE').format(num)}`;
}

function renderPartsFilters(data) {
  const categorias = [...new Set(data.map((p) => p.categoria).filter(Boolean))].sort();
  const marcas = [...new Set(data.map((p) => p.marca_compatible).filter(Boolean))].sort();

  const catSelect = document.getElementById('partsCategoria');
  const brandSelect = document.getElementById('partsMarca');
  if (!catSelect || !brandSelect) return;

  catSelect.innerHTML = '<option value="">Todas las categorías</option>' +
    categorias.map((c) => `<option value="${c}">${c}</option>`).join('');
  brandSelect.innerHTML = '<option value="">Todas las marcas</option>' +
    marcas.map((m) => `<option value="${m}">${m}</option>`).join('');
}

function renderParts() {
  const grid = document.getElementById('partsGrid');
  const countEl = document.getElementById('partsCount');
  if (!grid || !countEl) return;

  const texto = partsFilters.texto.toLowerCase();
  const filtered = PARTS_DATA.filter((p) => {
    const matchTexto = !texto || [p.nombre, p.codigo, p.modelo_compatible, p.caracteristicas]
      .join(' ').toLowerCase().includes(texto);
    const matchCategoria = !partsFilters.categoria || p.categoria === partsFilters.categoria;
    const matchMarca = !partsFilters.marca || p.marca_compatible === partsFilters.marca;
    return matchTexto && matchCategoria && matchMarca;
  });

  countEl.textContent = `${filtered.length} repuesto${filtered.length === 1 ? '' : 's'} encontrado${filtered.length === 1 ? '' : 's'}`;

  grid.innerHTML = filtered.map((p) => `
    <article class="part-card">
      <div class="part-top">
        <div>
          <span class="part-code">${p.codigo}</span>
          <h3 class="part-name">${p.nombre}</h3>
        </div>
        ${stockBadge(p.stock)}
      </div>
      <ul class="part-specs">
        <li><strong>Marca:</strong> ${p.marca_compatible || '—'}</li>
        <li><strong>Compatible con:</strong> ${p.modelo_compatible || '—'}</li>
        <li><strong>Tamaño:</strong> ${p.tamano || '—'} · <strong>Peso:</strong> ${p.peso_kg ? p.peso_kg + ' kg' : '—'}</li>
      </ul>
      <p class="part-desc">${p.caracteristicas || ''}</p>
      <div class="part-price">${formatPartPrice(p.precio)}</div>
    </article>
  `).join('') || '<p class="config-note">No se encontraron repuestos con ese filtro. Prueba con otro término o marca.</p>';
}

async function loadParts() {
  const countEl = document.getElementById('partsCount');
  try {
    const res = await fetch(PARTS_CSV_URL);
    if (!res.ok) throw new Error('No se pudo leer el archivo CSV');
    const text = await res.text();
    PARTS_DATA = parseCSV(text);
    renderPartsFilters(PARTS_DATA);
    renderParts();
  } catch (err) {
    console.error(err);
    if (countEl) {
      countEl.textContent = 'No se pudo cargar el catálogo. Si estás probando el sitio abriendo index.html directamente desde tu computadora, usa un servidor local (ej. la extensión "Live Server") o súbelo a GitHub Pages: los navegadores bloquean la lectura de archivos CSV locales por seguridad.';
    }
  }
}

document.getElementById('partsSearch')?.addEventListener('input', (e) => {
  partsFilters.texto = e.target.value;
  renderParts();
});
document.getElementById('partsCategoria')?.addEventListener('change', (e) => {
  partsFilters.categoria = e.target.value;
  renderParts();
});
document.getElementById('partsMarca')?.addEventListener('change', (e) => {
  partsFilters.marca = e.target.value;
  renderParts();
});

loadParts();

/* ---------- Formulario de contacto ----------
   Nota: GitHub Pages no procesa formularios en servidor.
   Este envío abre el correo del usuario con los datos precargados.
   Si prefieres un formulario "silencioso" sin abrir el correo,
   conecta este form a un servicio como Formspree o Web3Forms
   (cambia el fetch de abajo por la URL que ellos te den).
------------------------------------------------ */
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const nombre = data.get('nombre');
  const correo = data.get('correo');
  const equipo = data.get('equipo');
  const mensaje = data.get('mensaje');

  const asunto = encodeURIComponent(`Solicitud de cotización — ${nombre}`);
  const cuerpo = encodeURIComponent(
    `Nombre/Empresa: ${nombre}\nCorreo: ${correo}\nEquipo: ${equipo}\n\nMensaje:\n${mensaje}`
  );

  window.location.href = `mailto:contacto@generadoresandinos.pe?subject=${asunto}&body=${cuerpo}`;
  formNote.textContent = 'Abriendo tu cliente de correo para enviar la solicitud…';
});
