/* =========================================================================
   EL BAÚL DE KATA — interacciones
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Header: sombra/compactado al hacer scroll ---- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Menú móvil ---- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  const closeNav = () => {
    mainNav.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  /* ---- Animaciones al hacer scroll (reveal) ---- */
  const revealTargets = document.querySelectorAll('.reveal, .reveal-stagger');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('in-view'));
  }

  /* ---- Formulario de contacto: valida y arma el mensaje de WhatsApp ---- */
  const form = document.getElementById('contactForm');
  const successBox = document.getElementById('formSuccess');
  const WHATSAPP_NUMBER = '573024595935';

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const fields = {
        nombre: form.querySelector('#nombre'),
        telefono: form.querySelector('#telefono'),
        motivo: form.querySelector('#motivo'),
        mensaje: form.querySelector('#mensaje'),
      };

      let isValid = true;

      Object.entries(fields).forEach(([key, input]) => {
        const wrapper = form.querySelector(`[data-field="${key}"]`);
        const value = input.value.trim();
        const fieldValid = key === 'telefono'
          ? value.length >= 7
          : value.length > 1;

        wrapper.classList.toggle('has-error', !fieldValid);
        if (!fieldValid) isValid = false;
      });

      if (!isValid) {
        successBox.classList.remove('is-visible');
        return;
      }

      const text = [
        `Hola, soy ${fields.nombre.value.trim()}.`,
        `Teléfono: ${fields.telefono.value.trim()}`,
        `Motivo: ${fields.motivo.value.trim()}`,
        `Mensaje: ${fields.mensaje.value.trim()}`,
      ].join('%0A');

      successBox.classList.add('is-visible');
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener');
      form.reset();
    });

    form.querySelectorAll('input, textarea').forEach((input) => {
      input.addEventListener('input', () => {
        input.closest('.form-field').classList.remove('has-error');
      });
    });
  }

});
