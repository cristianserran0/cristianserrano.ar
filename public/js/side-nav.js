/* The site's navigation (styles/components/side-nav.css).
   What CSS cannot do, on a case study: build the index of the page from
   its section headings -- once for the panel on the left, once for the
   drop-down in the top bar -- mark the section in view in both, and
   name it on the drop-down's button. Also: slide one marker behind the
   chosen item instead of switching tints, and travel to a chosen section.

   Travelling: choosing a section scrolls there in one slow-out, slow-in
   move whose time grows with the distance, and the marker goes straight
   to the chosen item on the same curve and in the same time -- it does
   not stop at the sections flown over. The times and the curve are
   tokens (tokens/effects.css); with reduced motion they are zero and
   the page simply arrives. */
/* The menu of pages (Home, CV, About, Contact): the chosen item's tint
   travels with you from page to page. A click on an item notes which
   item you are leaving; the next page starts the marker there and slides
   it to its own item. Only after such a click: arriving any other way,
   the tint is simply in place. */
(function () {
  var KEY = 'menu-from';
  var menu = document.querySelector('.side-nav .menu:not([data-page-index])');
  if (!menu) return;
  var links = Array.prototype.slice.call(menu.querySelectorAll('.menu-item'));
  var here = links.filter(function (a) { return a.hasAttribute('aria-current'); })[0];
  var from = null;
  try { from = sessionStorage.getItem(KEY); sessionStorage.removeItem(KEY); } catch (e) {}

  links.forEach(function (a, i) {
    a.addEventListener('click', function () {
      if (a === here || !here) return;
      try { sessionStorage.setItem(KEY, String(links.indexOf(here))); } catch (e) {}
    });
  });

  var start = from === null ? null : links[+from];
  if (!here || !start || start === here || !here.offsetHeight) return;   // nothing to travel from, or the menu is not showing

  var marker = document.createElement('li');
  marker.className = 'menu-indicator'; marker.setAttribute('aria-hidden', 'true'); marker.setAttribute('role', 'presentation');
  function place(a) { marker.style.translate = '0 ' + a.offsetTop + 'px'; marker.style.height = a.offsetHeight + 'px'; }
  // where you came from, at once and without a fade ...
  marker.style.transition = 'none';
  place(start); marker.setAttribute('data-on', '');
  menu.appendChild(marker);
  marker.getBoundingClientRect();   // (settle that position before it moves)
  // ... then on to this page's item, with the marker's own spring
  requestAnimationFrame(function () { marker.style.transition = ''; place(here); });
  // a later change of layout: stay on the item, without travelling
  window.addEventListener('resize', function () {
    if (!here.offsetHeight) return;
    marker.style.transition = 'none'; place(here);
    requestAnimationFrame(function () { marker.style.transition = ''; });
  });
})();

(function () {
  var main = document.querySelector('main');
  var page = document.querySelector('.page');
  var lists = document.querySelectorAll('[data-page-index]');
  var menu = document.getElementById('page-menu');
  var label = document.querySelector('[data-menu-current]');
  if (!main || !lists.length) return;
  var title = label ? label.textContent : '';

  var root = getComputedStyle(document.documentElement);
  // a duration token in milliseconds (the build may have rewritten 900ms as .9s)
  function ms(token) {
    var v = root.getPropertyValue(token).trim(), n = parseFloat(v) || 0;
    return /ms$/.test(v) ? n : n * 1000;
  }
  var travelling = null;   // the entry being travelled to, while on the way
  var frame = 0;

  function panelScrolls() { return page && getComputedStyle(page).overflowY === 'auto'; }
  function scrollTop(v) {
    var el = panelScrolls() ? page : (document.scrollingElement || document.documentElement);
    if (v === undefined) return el.scrollTop;
    el.scrollTop = v;
  }
  // the scroll's curve: the same shape as --ease-travel
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function travel(entry) {
    var h = entry.heading;
    var from = scrollTop();
    var by = entry.top ? -from
           : h.getBoundingClientRect().top - (parseFloat(getComputedStyle(h).scrollMarginTop) || 0)
             - (panelScrolls() ? page.getBoundingClientRect().top : 0);
    var time = Math.min(ms('--duration-travel-max'), Math.max(ms('--duration-travel-min'), Math.abs(by) * 0.25));
    cancelAnimationFrame(frame);
    if (!time || Math.abs(by) < 1) { scrollTop(from + by); travelling = null; update(); return; }

    travelling = entry;
    markers.forEach(function (m) {
      m.style.transition = 'translate ' + time + 'ms ' + root.getPropertyValue('--ease-travel') +
                           ', height ' + time + 'ms ' + root.getPropertyValue('--ease-travel');
    });
    update();   // marker and label go to the chosen section now
    var start = performance.now();
    (function step(now) {
      var t = Math.min(1, (now - start) / time);
      scrollTop(from + by * ease(t));
      if (t < 1 && travelling === entry) frame = requestAnimationFrame(step);
      else arrive();
    })(start);
  }
  function arrive() {
    cancelAnimationFrame(frame);
    travelling = null;
    markers.forEach(function (m) { m.style.transition = ''; });
    update();
  }
  // the visitor takes over: scrolling by hand ends the journey where it is
  ['wheel', 'touchstart', 'keydown'].forEach(function (type) {
    window.addEventListener(type, function () { if (travelling) arrive(); }, { passive: true });
  });

  // one sliding marker per index (styles/components/menu-item.css)
  var markers = Array.prototype.map.call(lists, function (list) {
    var m = document.createElement('li');
    m.className = 'menu-indicator'; m.setAttribute('aria-hidden', 'true'); m.setAttribute('role', 'presentation');
    list.appendChild(m);
    return m;
  });

  var entries = [];
  function add(h, text, top) {
    var entry = { heading: h, top: top, links: null };
    entry.links = Array.prototype.map.call(lists, function (list) {
      var a = document.createElement('a');
      a.className = 'menu-item'; a.href = top ? '#content' : '#' + h.id;
      var s = document.createElement('span'); s.textContent = text; a.appendChild(s);
      var li = document.createElement('li'); li.appendChild(a); list.appendChild(li);
      a.addEventListener('click', function (e) {
        e.preventDefault();
        history.replaceState(null, '', top ? location.pathname + location.search : '#' + h.id);
        travel(entry);
      });
      return a;
    });
    entries.push(entry);
  }
  // first, the case study itself: its title, which leads back to the top
  var opening = main.querySelector('h1');
  if (opening) add(opening, title || opening.textContent, true);
  Array.prototype.forEach.call(main.querySelectorAll('section h2'), function (h, i) {
    if (!h.id) h.id = 'section-' + (i + 1);
    add(h, h.textContent, false);
  });

  // choosing a section closes the drop-down; opening it places its marker
  if (menu) {
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a') && menu.hidePopover) menu.hidePopover();
    });
    menu.addEventListener('toggle', function () { update(); });
  }

  function update() {
    // the section in view: the last heading above the upper third of the view
    // (while travelling, it is the destination, whatever is passing by)
    // (until the first section arrives, it is the case study's opening)
    var line = (window.innerHeight || 0) / 3, now = entries[0] && entries[0].top ? entries[0] : null;
    if (travelling) now = travelling;
    else entries.forEach(function (e) { if (!e.top && e.heading.getBoundingClientRect().top <= line) now = e; });
    entries.forEach(function (e) {
      e.links.forEach(function (a) {
        if (e === now) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
    });
    // the drop-down's button names where you are; at the top, the case study
    if (label) label.textContent = now && !now.top ? now.heading.textContent : title;
    // each marker sits behind its list's chosen item (a hidden list measures 0: skipped)
    markers.forEach(function (m, i) {
      var a = now && now.links[i];
      if (!a || !a.offsetHeight) { m.removeAttribute('data-on'); return; }
      m.style.translate = '0 ' + a.offsetTop + 'px';
      m.style.height = a.offsetHeight + 'px';
      requestAnimationFrame(function () { m.setAttribute('data-on', ''); });
    });
  }

  var queued = false;
  function onScroll() { if (queued) return; queued = true; requestAnimationFrame(function () { queued = false; update(); }); }
  window.addEventListener('scroll', onScroll, { passive: true });
  if (page) page.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', update);
  update();
})();
