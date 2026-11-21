// Added for the web version: the stage is a fixed 1680 x 800, so on a smaller
// window it is scaled down to fit instead of being cut off.
(function () {
  var W = 1680, H = 800;
  function fit() {
    var c = document.querySelector('#game .konvajs-content');
    if (!c) return;
    var s = Math.min(window.innerWidth / W, window.innerHeight / H, 1);
    c.style.flex = 'none';
    c.style.transformOrigin = 'center center';
    c.style.transform = 'scale(' + s + ')';
  }
  window.addEventListener('resize', fit);
  fit();
})();
