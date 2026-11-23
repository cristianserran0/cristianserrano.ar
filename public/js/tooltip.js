/* Tooltips are drawn by CSS (styles/components/tooltip.css): a control's
   aria-label, shown on hover and on keyboard focus. The one thing CSS
   cannot do is close one with Escape while the pointer or the focus is
   still on the control (WCAG 1.4.13). Escape marks that control; the mark
   comes off when the pointer or the focus leaves it. */
(function () {
  var SELECTOR = '.button[data-has-text="false"], [data-tooltip]';
  var dismissed = [];
  function restore(event) {
    dismissed = dismissed.filter(function (el) {
      if (event && el.contains(event.target)) return true;
      el.removeAttribute('data-tooltip-dismissed');
      return false;
    });
  }
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    Array.prototype.forEach.call(document.querySelectorAll(SELECTOR), function (el) {
      if (!el.matches(':hover, :focus-visible')) return;
      el.setAttribute('data-tooltip-dismissed', '');
      dismissed.push(el);
    });
  });
  document.addEventListener('pointerover', function (event) { if (dismissed.length) restore(event); });
  document.addEventListener('focusin', function (event) { if (dismissed.length) restore(event); });
})();
