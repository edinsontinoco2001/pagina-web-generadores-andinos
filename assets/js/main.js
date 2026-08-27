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
});
