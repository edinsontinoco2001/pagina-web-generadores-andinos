// Generadores Andinos SAC — comportamiento base del sitio
document.addEventListener('DOMContentLoaded', function () {
  // Menú móvil
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  if (toggle && header) {
    toggle.addEventListener('click', function () {
      header.classList.toggle('open');
      var expanded = header.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
    // cerrar menú al elegir un link (móvil)
    document.querySelectorAll('.main-nav a').forEach(function (a) {
      a.addEventListener('click', function () { header.classList.remove('open'); });
    });
  }

  // Año dinámico en footer
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Reveal on scroll (respeta prefers-reduced-motion)
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // Formulario de contacto: arma un mailto con los datos ingresados
  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var nombre = encodeURIComponent(data.get('nombre') || '');
      var empresa = encodeURIComponent(data.get('empresa') || '');
      var telefono = encodeURIComponent(data.get('telefono') || '');
      var servicio = encodeURIComponent(data.get('servicio') || '');
      var mensaje = encodeURIComponent(data.get('mensaje') || '');
      var asunto = encodeURIComponent('Solicitud de asesoría — ' + (data.get('empresa') || data.get('nombre') || ''));
      var cuerpo = 'Nombre: ' + nombre + '%0ANombre de empresa: ' + empresa + '%0ATeléfono: ' + telefono +
        '%0AServicio de interés: ' + servicio + '%0A%0AMensaje:%0A' + mensaje;
      window.location.href = 'mailto:ventas@generadoresandinos.pe?subject=' + asunto + '&body=' + cuerpo;
    });
  }

  // Carrusel de imágenes en tarjetas de proyecto
  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('.carousel-track');
    var slides = Array.prototype.slice.call(track.children);
    if (slides.length <= 1) return; // no hace falta carrusel con 1 sola imagen

    var index = 0;
    var dotsWrap = document.createElement('div');
    dotsWrap.className = 'car-dots';
    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'car-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Ir a la imagen ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(dot);
    });
    carousel.appendChild(dotsWrap);

    var prevBtn = document.createElement('button');
    prevBtn.className = 'car-btn prev';
    prevBtn.setAttribute('aria-label', 'Imagen anterior');
    prevBtn.innerHTML = '‹';
    var nextBtn = document.createElement('button');
    nextBtn.className = 'car-btn next';
    nextBtn.setAttribute('aria-label', 'Imagen siguiente');
    nextBtn.innerHTML = '›';
    carousel.appendChild(prevBtn);
    carousel.appendChild(nextBtn);

    function update() {
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
        d.classList.toggle('active', i === index);
      });
    }
    function goTo(i) { index = (i + slides.length) % slides.length; update(); }

    prevBtn.addEventListener('click', function (e) { e.stopPropagation(); goTo(index - 1); });
    nextBtn.addEventListener('click', function (e) { e.stopPropagation(); goTo(index + 1); });

    // Deslizar con el dedo (touch) en móvil
    var startX = null;
    carousel.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 40) { diff > 0 ? goTo(index - 1) : goTo(index + 1); }
      startX = null;
    });
  });
});
