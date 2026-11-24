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

/* The menu moves between the side and the top when the page panel
   crosses the "side" width (a window resize, the guide opening). Without
   help the two layouts simply swap. Here each thing travels from where it
   was to where it now is: Back, each page's item (the side
   item and the bar's item are two elements, matched by where they lead),
   and the Guide and Display buttons. What has no counterpart -- a case
   study's index, the drop-down's button -- fades in.

   Never diagonally. The move has two steps: first the things gather into
   one pile, along the direction they were spread in (a column closes up
   vertically, a row closes up sideways); then the pile opens out along
   the other direction, into the new layout, with the small spring. Both
   steps together take --duration-shuffle (zero with reduced motion).

   The page's content moves with them, on the same two steps: when the
   menu's panel comes or goes the content area changes place and height,
   and the content travels there instead of jumping -- sideways while the
   menu gathers or spreads sideways, up or down while it does.

   A pile is not a blob: as things gather they fade away under the one on
   top, and fade back as they spread. On top stay the first page's item
   and the Guide button (styles: [data-pile-top], side-nav.css). */
(function () {
  var frame = document.querySelector('.page-frame');
  var side = document.querySelector('.side-nav');
  if (!frame || !side || !window.ResizeObserver || !Element.prototype.animate) return;
  var root = getComputedStyle(document.documentElement);
  function ms(token) { var v = root.getPropertyValue(token).trim(), n = parseFloat(v) || 0; return /ms$/.test(v) ? n : n * 1000; }

  // everything that travels, under a key that is the same in both layouts
  function things() {
    var list = [];
    function add(key, el) { if (el) list.push({ key: key, el: el }); }
    Array.prototype.forEach.call(document.querySelectorAll('.side-nav a.button, .site-nav > a.button'), function (el) { add('mark', el); });
    Array.prototype.forEach.call(document.querySelectorAll('.side-nav .menu:not([data-page-index]) .menu-item, .site-links .menu-item'), function (el) { add('page:' + el.getAttribute('href'), el); });
    add('display', document.querySelector('.site-actions [data-scheme-cycle]'));
    add('guide', document.querySelector('.site-actions [data-assistant-toggle]'));
    add('experiments', document.querySelector('.site-actions [data-experiments-toggle]'));
    Array.prototype.forEach.call(document.querySelectorAll('.side-nav [data-page-index], .site-nav .menu-trigger'), function (el, i) { add('only:' + i, el); });
    // the content itself: it shifts sideways when the menu's panel comes or goes
    add('content:main', document.querySelector('.page-body > main'));
    add('content:footer', document.querySelector('.page-body > .site-footer'));
    return list;
  }
  // Where a thing is, measured from the PANEL, not the window: the menu
  // from the panel's left edge, the two controls from its right. While
  // the guide opens the panel's right edge is itself moving, and measured
  // from the window the controls would seem to have come from further
  // right every frame -- they flew in from the edge and settled.
  var panel = document.querySelector('.page');
  function shown(t) {
    var r = t.el.getBoundingClientRect();
    if (!(r.width > 0 && r.height > 0)) return null;
    var p = panel.getBoundingClientRect();
    var fromRight = t.key === 'display' || t.key === 'guide' || t.key === 'experiments';
    var top = r.top;
    // How far down the content sits is read from its first piece -- the
    // title, or a case study's opening image -- not from its box: the room
    // above the content is INSIDE the box. And when the page is scrolled,
    // the browser holds what is on screen in place, which this reading
    // then reports as "did not move", correctly.
    if (t.key.indexOf('content:') === 0 && opening) top = opening.getBoundingClientRect().top;
    return { left: fromRight ? r.left - p.right : r.left - p.left, top: top - p.top };
  }
  var opening = document.querySelector('.page-body > main .piece figure, .page-body > main h1');
  function snapshot() {
    var at = {};
    things().forEach(function (t) { var r = shown(t); if (r) at[t.key] = r; });
    return at;
  }
  function mode() { return getComputedStyle(side).display !== 'none' ? 'side' : 'top'; }

  // Only a change the visitor causes is animated. While a page is still
  // loading its layout can settle in steps (styles arriving, the guide's
  // width being restored), and that must not play as a move: nothing is
  // animated until the page has loaded and stood still for a moment.
  var armed = false;
  function arm() { setTimeout(function () { last = mode(); before = snapshot(); keep(); armed = true; }, 400); }
  // how far the page is scrolled, and whether its opening is still on screen
  var kept = { at: 0, opening: false };
  function keep() {
    kept.at = panel.scrollTop;
    kept.opening = !!opening && opening.getBoundingClientRect().bottom > panel.getBoundingClientRect().top;
  }
  if (document.readyState === 'complete') arm(); else window.addEventListener('load', arm);

  // What stays on top of its pile: the first page (the site's own item)
  // over the other pages, and Guide over Display.
  var TOPS = '.side-nav .menu:not([data-page-index]) li:first-child .menu-item, .site-links li:first-child .menu-item, .site-actions [data-assistant-toggle]';

  var last = mode(), before = snapshot();
  new ResizeObserver(function () {
    var now = mode();
    // The visitor's place on the page is kept. When the layout changes the
    // browser holds a paragraph still and moves the scroll position to do
    // it, which near the top of a page pushed the title out of view. So:
    // if the page's opening was on screen, the scroll position stays what
    // it was (at the very top, it stays at the very top). Further down,
    // the browser's holding still is the right thing and is left alone.
    if (armed && now !== last && kept.opening && panel.scrollTop !== kept.at) panel.scrollTop = kept.at;
    var settled = snapshot();   // where things are now, read before anything is set in motion
    if (!armed) { last = now; before = settled; return; }
    if (now !== last) {
      var time = ms('--duration-shuffle'), spring = root.getPropertyValue('--ease-spring').trim() || 'ease';
      busyUntil = performance.now() + time + 60;
      setTimeout(function () { if (mode() === last) { before = snapshot(); keep(); } }, time + 80);   // once it has landed, read again
      var gather = root.getPropertyValue('--ease-travel').trim() || 'ease-in-out';
      var toTop = now === 'top';   // the column closes up first; going to the side, the row does
      // the top of each pile stays whole and in front while the rest pass under it
      if (time) Array.prototype.forEach.call(document.querySelectorAll(TOPS), function (el) {
        el.setAttribute('data-pile-top', '');
        setTimeout(function () { el.removeAttribute('data-pile-top'); }, time);
      });
      if (time) things().forEach(function (t) {
        var to = shown(t); if (!to) return;
        var from = before[t.key];
        if (from && t.key.indexOf('content:') === 0) {
          // The content makes the same two-step journey as the menu, in
          // step with it and without fading. Going to the side: while the
          // row closes up to the left the content crosses to the right,
          // then while the column opens downward the content rises. Going
          // to the top, the reverse: it sinks first, then crosses back.
          var cx = Math.round(from.left - to.left), cy = Math.round(from.top - to.top);
          if (cx || cy) t.el.animate([
            { translate: cx + 'px ' + cy + 'px', easing: gather },
            { translate: toTop ? cx + 'px 0' : '0 ' + cy + 'px', offset: 0.5, easing: gather },
            { translate: '0 0' }
          ], { duration: time });
        } else if (from && t.key.indexOf('only:') !== 0) {
          var dx = Math.round(from.left - to.left), dy = Math.round(from.top - to.top);
          if (dx || dy) {
            var path = [
              { translate: dx + 'px ' + dy + 'px', easing: gather },
              { translate: toTop ? dx + 'px 0' : '0 ' + dy + 'px', offset: 0.5, easing: spring },   // the pile
              { translate: '0 0' }
            ];
            var fade = [{ opacity: 1, easing: gather }, { opacity: 0, offset: 0.5, easing: spring }, { opacity: 1 }];   // gone under the pile's top
            t.el.animate(path, { duration: time });
            t.el.animate(fade, { duration: time });
            // The chosen item's tint may be a separate marker (it is, after
            // arriving by a click in the menu). It belongs to the item: it
            // makes the same journey, added to its own place, and fades
            // with it -- otherwise it sat at the journey's end, waiting.
            var marker = t.el.hasAttribute('aria-current') && t.el.closest('.menu') && t.el.closest('.menu').querySelector('.menu-indicator[data-on]');
            if (marker) {
              marker.animate(path, { duration: time, composite: 'add' });
              marker.animate(fade, { duration: time });
            }
          }
        } else {
          t.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: time, easing: 'ease' });
        }
      });
      last = now;
    }
    before = settled;
  }).observe(frame);

  // The content's place on screen also changes when the visitor scrolls,
  // with no change of layout. Keep "where things were" current, so a move
  // starts from where the content really was, not where it was before the
  // last scroll.
  var noting = false, busyUntil = 0;
  function note() {
    if (noting) return; noting = true;
    // (not while a move is playing: things are then read mid-flight)
    requestAnimationFrame(function () { noting = false; if (armed && mode() === last && performance.now() > busyUntil) { before = snapshot(); keep(); } });
  }
  window.addEventListener('scroll', note, { passive: true });
  if (panel) panel.addEventListener('scroll', note, { passive: true });
})();

