/* Home remembers where you were. Open a case study from the middle of
   Home and come back -- by the Back arrow or by the browser's own back
   button -- and Home is where you left it, not at its top.

   Only for the visit (sessionStorage), and only on the way BACK: arriving
   at Home any other way (its address, the menu) starts at the top, and
   forgets the old position.

   On wide screens the page scrolls inside its panel (.page), which a
   browser does not put back by itself; on phones the window scrolls. */
(function () {
  var KEY = 'home:scroll', RETURNING = 'home:returning';
  var page = document.querySelector('.page');
  function scroller() {
    return page && getComputedStyle(page).overflowY === 'auto' ? page : (document.scrollingElement || document.documentElement);
  }
  function get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { v === null ? sessionStorage.removeItem(k) : sessionStorage.setItem(k, v); } catch (e) {} }

  if (location.pathname !== '/') {
    // leaving for Home by one of the site's own ways back
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href="/"]');
      if (a && a.getAttribute('aria-label') === 'Back') set(RETURNING, '1');
    });
    return;
  }

  var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  var back = nav && nav.type === 'back_forward';
  var saved = parseFloat(get(KEY));
  if ((back || get(RETURNING)) && saved > 0) scroller().scrollTop = saved;
  else set(KEY, null);
  set(RETURNING, null);

  var waiting = false;
  function note() {
    if (waiting) return;
    waiting = true;
    requestAnimationFrame(function () { waiting = false; set(KEY, String(Math.round(scroller().scrollTop))); });
  }
  if (page) page.addEventListener('scroll', note, { passive: true });
  window.addEventListener('scroll', note, { passive: true });
})();
