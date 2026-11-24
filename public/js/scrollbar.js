/* The page's scrollbar rests out of sight (shell.css). It shows while the
   page scrolls and for --delay-scrollbar after, and while the pointer is
   over it, so it can be found and dragged. Wide screens only: on phones
   the window scrolls and the system already hides its scrollbar. */
(function () {
  var d = document.documentElement, page = document.querySelector('.page');
  if (!page) return;
  var v = getComputedStyle(d).getPropertyValue('--delay-scrollbar').trim(), n = parseFloat(v) || 1000;
  var wait = /ms$/.test(v) || !v ? n : n * 1000;
  var EDGE = 20;   // px from the panel's right edge that count as "over the scrollbar"
  var timer, over = false;
  function rest() { if (!over) d.setAttribute('scrollbar', 'resting'); }
  function show() { d.removeAttribute('scrollbar'); clearTimeout(timer); timer = setTimeout(rest, wait); }
  page.addEventListener('scroll', show, { passive: true });
  page.addEventListener('pointermove', function (e) {
    var now = e.pointerType !== 'touch' && e.clientX >= page.getBoundingClientRect().right - EDGE;
    if (now === over) return;
    over = now;
    if (over) { d.removeAttribute('scrollbar'); clearTimeout(timer); } else timer = setTimeout(rest, wait);
  }, { passive: true });
  page.addEventListener('pointerleave', function () { if (over) { over = false; timer = setTimeout(rest, wait); } });
  timer = setTimeout(rest, wait);   // visible for a moment on arrival, then it rests
})();
