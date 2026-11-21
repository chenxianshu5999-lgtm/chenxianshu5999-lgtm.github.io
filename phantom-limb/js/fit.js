// Added for the web version: the stage is a fixed 1680 x 800, so on a smaller
// window it is scaled down to fit instead of being cut off. On a phone held
// upright a note asks for landscape.
(function () {
  var W = 1680, H = 800;
  var note = document.createElement('div');
  note.id = 'rotate-note';
  note.textContent = '请把手机横过来';
  document.body.appendChild(note);

  // On a phone the row of colour-filter buttons would cover the bottom of the
  // stage, so it folds into one small button in the corner.
  var controls = document.querySelector('.accessibility-controls');
  if (controls) {
    var toggle = document.createElement('button');
    toggle.id = 'filters-toggle';
    toggle.type = 'button';
    toggle.textContent = '色彩';
    toggle.addEventListener('click', function () { controls.classList.toggle('is-open'); });
    controls.addEventListener('click', function (e) { if (e.target !== toggle && e.target.closest('button')) controls.classList.remove('is-open'); });
    controls.insertBefore(toggle, controls.firstChild);
    var st = document.createElement('style');
    st.textContent = '#filters-toggle{display:none}' +
      '@media (max-height:500px),(max-width:500px){' +
      '.accessibility-controls{left:8px;bottom:8px;flex-direction:column-reverse;align-items:flex-start;gap:6px}' +
      '.accessibility-controls .accessibility-button{display:none;min-width:0;padding:6px 10px;font-size:11px}' +
      '.accessibility-controls.is-open .accessibility-button{display:block}' +
      '#filters-toggle{display:block;padding:5px 9px;font-size:11px;color:#fff;background:rgba(0,0,0,.55);border:1px solid #666;border-radius:4px;opacity:.7}}';
    document.head.appendChild(st);
  }
  function fit() {
    var c = document.querySelector('#game .konvajs-content');
    var vw = window.innerWidth, vh = window.innerHeight;
    var phone = Math.min(screen.width, screen.height) < 600 || ('ontouchstart' in window && Math.min(vw, vh) < 600);
    note.style.display = phone && vh > vw ? 'flex' : 'none';
    if (!c) return;
    var s = Math.min(vw / W, vh / H, 1);
    c.style.flex = 'none';
    c.style.transformOrigin = 'center center';
    c.style.transform = 'scale(' + s + ')';
  }
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', function () { setTimeout(fit, 250); });
  fit();
})();
