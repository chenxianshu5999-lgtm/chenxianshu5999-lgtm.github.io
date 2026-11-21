// Added for the web version: the engine listens for "click", which Konva only
// fires for a mouse. On a phone a tap fires "tap" instead, so every "click"
// listener is also registered for "tap".
(function () {
  if (!window.Konva) return;
  var proto = Konva.Node.prototype;
  function widen(evt) {
    if (typeof evt !== 'string') return evt;
    return evt.split(' ').map(function (e) {
      return e === 'click' || e.indexOf('click.') === 0 ? e + ' ' + e.replace('click', 'tap') : e;
    }).join(' ');
  }
  var on = proto.on, off = proto.off;
  proto.on = function (evt, handler) { return on.call(this, widen(evt), handler); };
  proto.off = function (evt, handler) { return off.call(this, widen(evt), handler); };
})();
