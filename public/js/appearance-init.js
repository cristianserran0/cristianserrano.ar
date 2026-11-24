/* Resolve the stored appearance before first paint, so there is no flash.
   Loaded render-blocking in <head>, as a file rather than inline, so a
   strict Content-Security-Policy (script-src 'self') does not block it. */
(function () {
  var d = document.documentElement;
  // Until the page has loaded, nothing in the shell may animate
  // (styles/shell.css, [loading]): a style or a width that settles a frame
  // late must not play as a move. Taken off once the page stands still.
  d.setAttribute('loading', '');
  window.addEventListener('load', function () {
    requestAnimationFrame(function () { requestAnimationFrame(function () { d.removeAttribute('loading'); }); });
  });
  try {
    var s = localStorage.getItem('scheme');
    if (s === 'light' || s === 'dark') d.setAttribute('scheme', s);
    // (Temperature and accent are no longer offered: the site is cold and
    // blue, as written on <html>. A choice saved by an earlier version is
    // dropped, so nobody is left on a colour they cannot change back.)
    localStorage.removeItem('temperature'); localStorage.removeItem('accent');
    if (localStorage.getItem('assistant') === 'open') d.setAttribute('assistant', 'open');
    localStorage.removeItem('guide-type'); localStorage.removeItem('guide-measure');   // choices the guide no longer offers
    sessionStorage.removeItem('nav-variant');   // a trial that is over (the diamond stayed)
    sessionStorage.removeItem('shell-variant');   // likewise (edge to edge, content stays)
    // Experiments (data/experiments.ts): the menu shows everywhere but on
    // the live address. A choice is <html experiment-KEY="VALUE">, kept
    // for the visit; ?experiment=KEY:VALUE sets one from an address
    // ("base" as the value clears it).
    if (!/(^|\.)cristianserrano\.ar$/.test(location.hostname)) {
      d.setAttribute('experiments', '');
      var ex = location.search.match(/[?&]experiment=([a-z0-9-]+):([a-z0-9-]+)/);
      if (ex) { if (ex[2] === 'base') sessionStorage.removeItem('experiment:' + ex[1]); else sessionStorage.setItem('experiment:' + ex[1], ex[2]); }
      for (var i = 0; i < sessionStorage.length; i++) {
        var k = sessionStorage.key(i);
        if (k.indexOf('experiment:') === 0) d.setAttribute('experiment-' + k.slice(11), sessionStorage.getItem(k));
      }
    }
    var w = +localStorage.getItem('assistant-width');
    if (w) d.style.setProperty('--assistant-width', w + 'px');   // CSSOM: allowed by the CSP
  } catch (e) {}
})();
