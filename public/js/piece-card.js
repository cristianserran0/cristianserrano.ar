/* A piece's card: click a tile on Home (or a side project's card) and
   its summary opens as a dialog over the page, with the link to the full
   case study, or to the live project.

   The tile is a plain link and stays one: a click with a modifier key, a
   middle click, "open in new tab", or no script at all go straight to
   the case study. Only a plain click opens the card.

   The card's content is the tile's own <template> (WorkTiles.astro), so
   nothing about a piece is written here. It is a modal of the page
   panel (styles/components/modal.css): the page goes inert while it is
   open, the guide does not. Escape, the Close button and a click on the
   backdrop close it, and focus goes back to the tile. */
(function () {
  var wrap = document.querySelector('[data-piece-modal]');
  var page = document.querySelector('.page');
  if (!wrap || !page) return;
  var slot = wrap.querySelector('[data-piece-slot]');
  var opener = null;

  function cardOf(link) { return link.parentElement.querySelector('template[data-piece-card]'); }

  function open(link) {
    opener = link;
    slot.textContent = '';
    slot.appendChild(cardOf(link).content.cloneNode(true));
    page.inert = true;
    wrap.hidden = false;
    wrap.scrollTop = 0;
    var go = slot.querySelector('a.button');
    if (go) go.focus();
  }

  function close() {
    if (wrap.hidden) return;
    wrap.hidden = true;        // it fades out (modal.css); its content stays until the next opening
    page.inert = false;
    if (opener) opener.focus();
    opener = null;
  }

  // tell assistive technology that these links open a dialog
  Array.prototype.forEach.call(document.querySelectorAll('.work-tile > a, .project-card > a'), function (a) {
    if (cardOf(a)) a.setAttribute('aria-haspopup', 'dialog');
  });

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var link = e.target.closest && e.target.closest('.work-tile > a, .project-card > a');
    if (!link || !cardOf(link)) return;
    e.preventDefault();
    open(link);
  });

  wrap.addEventListener('click', function (e) {
    if (e.target === wrap || (e.target.closest && e.target.closest('[data-piece-close]'))) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !wrap.hidden) { e.preventDefault(); close(); }
  });
})();
