/* The mode button in the header: one button that goes round
   System -> Dark -> Light -> System. Its icon is the mode you are in
   (styles/components/appearance.css picks it from <html scheme>).

   "System" removes the attribute, so :root's `color-scheme: light dark`
   follows the OS natively and live -- no matchMedia listener needed, and
   it keeps working with JS disabled. The choice is remembered and applied
   before first paint by appearance-init.js. */
(function () {
  var d = document.documentElement;
  var ORDER = ['system', 'dark', 'light'];
  var button = document.querySelector('[data-scheme-cycle]');
  if (!button) return;

  function current() { var s = d.getAttribute('scheme'); return s === 'light' || s === 'dark' ? s : 'system'; }
  function name() { button.setAttribute('aria-label', 'Mode: ' + current()); }

  function apply(next) {
    if (next === 'system') d.removeAttribute('scheme'); else d.setAttribute('scheme', next);
    try { next === 'system' ? localStorage.removeItem('scheme') : localStorage.setItem('scheme', next); } catch (e) {}
    name();
  }

  // The change is a cross-fade, not a cut: going from dark to light in one
  // frame is a flash in the face. The browser fades the whole page from
  // its old look to its new one (a view transition: nothing moves, so it
  // also runs with reduced motion). Where it cannot, the change is at once.
  button.addEventListener('click', function () {
    var next = ORDER[(ORDER.indexOf(current()) + 1) % ORDER.length];
    if (!document.startViewTransition) { apply(next); return; }
    d.setAttribute('mode-changing', '');
    var fade = document.startViewTransition(function () { apply(next); });
    fade.finished.then(done, done);
    function done() { d.removeAttribute('mode-changing'); }
  });
  name();
})();

/* The Experiments menu: choosing an option applies it at once, with no
   reload, and keeps it for the visit (appearance-init.js restores it on
   the next page). The first option of each experiment is what the site
   does now: it needs no attribute. */
(function () {
  var d = document.documentElement;
  var links = document.querySelectorAll('[data-experiment]');
  if (!links.length) return;
  function mark() {
    Array.prototype.forEach.call(links, function (a) {
      var now = d.getAttribute('experiment-' + a.getAttribute('data-experiment'));
      var on = now ? now === a.getAttribute('data-value') : a.hasAttribute('data-base');
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  Array.prototype.forEach.call(links, function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var key = a.getAttribute('data-experiment'), value = a.getAttribute('data-value'), base = a.hasAttribute('data-base');
      try { base ? sessionStorage.removeItem('experiment:' + key) : sessionStorage.setItem('experiment:' + key, value); } catch (err) {}
      if (base) d.removeAttribute('experiment-' + key); else d.setAttribute('experiment-' + key, value);
      mark();
    });
  });
  mark();
})();
