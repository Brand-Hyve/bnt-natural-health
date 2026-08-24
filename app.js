/* ============================================================
   B&T Natural Health — shared behaviour
   ============================================================ */
(function () {
  // Mobile navigation
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    var panel = item.querySelector('.faq-a');
    if (!btn || !panel) return;

    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      if (isOpen) {
        panel.style.height = panel.scrollHeight + 'px';
        void panel.offsetHeight; // force reflow so the transition has a start value
        item.classList.remove('open');
        panel.style.height = '0px';
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        panel.style.height = '0px';
        void panel.offsetHeight;
        panel.style.height = panel.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    panel.addEventListener('transitionend', function (e) {
      if (e.propertyName !== 'height') return;
      if (item.classList.contains('open')) panel.style.height = 'auto';
    });
  });
})();
