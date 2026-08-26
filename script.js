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
