// Public pages. Everything shown here comes from content/*.json, which the
// admin at /admin/ edits. Views are switched by the #hash in the address.

const VIEWS = [
  { id: 'overview', label: 'Overview' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'books', label: 'Books' },
  { id: 'shop', label: 'Shop' },
  { id: 'phantom-limb', label: 'Phantom Limb' },
];

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};
const md = (src) => {
  const d = el('div', 'prose');
  d.innerHTML = window.marked ? marked.parse(src || '') : (src || '');
  return d;
};
// The admin stores uploads as /images/uploads/x.jpg; make that work under any base path.
const asset = (p) => (p && p.startsWith('/') ? p.slice(1) : p || '');
const shown = (list) => (list || []).filter((x) => x && !x.hidden);
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

async function load(name) {
  try {
    const res = await fetch(`content/${name}.json`, { cache: 'no-cache' });
    return res.ok ? await res.json() : {};
  } catch { return {}; }
}

function head(title, lede) {
  const h = el('div', 'view-head');
  h.append(el('h1', 'view-title', title));
  if (lede) h.append(el('p', 'view-lede', lede));
  return h;
}

function fields(pairs) {
  const dl = el('dl', 'fields');
  for (const [k, v] of pairs) {
    if (!v) continue;
    dl.append(el('dt', '', k), el('dd', '', String(v)));
  }
  return dl.children.length ? dl : null;
}

const render = {
  overview(data) {
    const frag = document.createDocumentFragment();
    frag.append(head(data.settings.title || 'Substanz', data.settings.description));
    for (const s of shown(data.home.sections)) {
      if (s.type !== 'text') continue;
      const block = md((s.title ? `## ${s.title}\n\n` : '') + (s.body || ''));
      if (s.anchor) block.id = s.anchor;
      frag.append(block);
    }
    const rooms = el('div', 'rooms');
    const row = (id, name, count, note) => {
      const a = el('a');
      a.href = `#${id}`;
      a.append(el('span', 'room-name', name), el('span', 'room-count', count));
      if (note) a.append(el('span', 'room-note', note));
      rooms.append(a);
    };
    const works = shown(data.gallery.works), books = shown(data.books.items);
    row('gallery', 'Gallery', plural(works.length, 'work', 'works'), 'Paintings, prints and drawings.');
    row('books', 'Books', plural(books.length, 'title', 'titles'), 'Printed and digital books.');
    const goods = shown(data.shop.items);
    row('shop', data.shop.title || 'Shop', plural(goods.length, 'item', 'items'), 'Goods, books and prints on sale now.');
    row('phantom-limb', data.demo.title || 'Phantom Limb', data.demo.url ? 'Playable' : 'Not loaded yet', 'A hypertext visual novel, playable in the browser.');
    frag.append(rooms);
    return frag;
  },

  gallery(data) {
    const frag = document.createDocumentFragment();
    const works = shown(data.gallery.works);
    frag.append(head('Gallery', data.gallery.intro));
    if (!works.length) {
      frag.append(el('p', 'empty', 'No works are filed here yet. Add one from the admin under Gallery.'));
      return frag;
    }
    for (const w of works) {
      const art = el('article', 'work');
      const fig = el('div', 'work-image');
      if (w.image) {
        const a = el('a');
        a.href = asset(w.image);
        a.target = '_blank'; a.rel = 'noopener';
        a.setAttribute('aria-label', `Open ${w.title || 'image'} at full size`);
        const img = el('img');
        img.src = asset(w.image); img.alt = w.title || ''; img.loading = 'lazy';
        a.append(img); fig.append(a);
      }
      const side = el('div', 'work-side');
      side.append(el('h2', 'work-title', w.title || 'Untitled'));
      const f = fields([['Year', w.year], ['Medium', w.medium], ['Size', w.size]]);
      if (f) side.append(f);
      if (w.description) { const t = md(w.description); t.classList.add('work-text'); side.append(t); }
      art.append(fig, side);
      frag.append(art);
    }
    return frag;
  },

  books(data) {
    const frag = document.createDocumentFragment();
    const items = shown(data.books.items);
    frag.append(head('Books', data.books.intro));
    if (!items.length) {
      frag.append(el('p', 'empty', 'No books are filed here yet. Add one from the admin under Books.'));
      return frag;
    }
    for (const b of items) {
      const art = el('article', 'book');
      const cover = el('div', 'book-cover');
      if (b.cover) { const img = el('img'); img.src = asset(b.cover); img.alt = `Cover of ${b.title || 'the book'}`; img.loading = 'lazy'; cover.append(img); }
      const side = el('div');
      side.append(el('h2', 'book-title', b.title || 'Untitled'));
      const meta = [b.year, b.format].filter(Boolean).join(', ');
      if (meta) side.append(el('p', 'book-meta', meta));
      if (b.description) { const t = md(b.description); t.classList.add('book-text'); side.append(t); }
      if (b.link) {
        const p = el('p', 'book-link');
        const a = el('a', 'button', b.link_label || 'Get this book');
        a.href = b.link; a.target = '_blank'; a.rel = 'noopener';
        p.append(a); side.append(p);
      }
      art.append(cover, side);
      frag.append(art);
    }
    return frag;
  },

  shop(data) {
    const sh = data.shop, frag = document.createDocumentFragment();
    const items = shown(sh.items);
    frag.append(head(sh.title || 'Shop', sh.intro));
    if (sh.url) {
      const p = el('p', 'shop-open');
      const a = el('a', 'button', 'Open the shop on Weidian');
      a.href = sh.url; a.target = '_blank'; a.rel = 'noopener';
      p.append(a); frag.append(p);
    }
    if (!items.length) {
      frag.append(el('p', 'empty', 'Nothing is listed here yet. Add what is on sale from the admin under Shop.'));
      return frag;
    }
    const grid = el('div', 'goods');
    for (const g of items) {
      const link = g.link || sh.url;
      const card = el(link ? 'a' : 'div', 'good');
      if (link) { card.href = link; card.target = '_blank'; card.rel = 'noopener'; }
      if (g.image) { const img = el('img'); img.src = asset(g.image); img.alt = ''; img.loading = 'lazy'; card.append(img); }
      card.append(el('span', 'good-name', g.name || 'Untitled'));
      const line = [g.price, g.status].filter(Boolean).join(', ');
      if (line) card.append(el('span', 'good-line', line));
      grid.append(card);
    }
    frag.append(grid);
    return frag;
  },

  'phantom-limb'(data) {
    const d = data.demo, frag = document.createDocumentFragment();
    frag.append(head(d.title || 'Phantom Limb', d.tagline));
    const wrap = el('div', 'demo');
    const cover = el('div', 'demo-cover');
    if (d.cover) { const img = el('img'); img.src = asset(d.cover); img.alt = ''; cover.append(img); }
    const side = el('div', 'demo-side');
    if (d.description) side.append(md(d.description));
    if (d.url) {
      const p = el('p');
      const a = el('a', 'button', 'Play in the browser');
      a.href = d.url;
      p.append(a); side.append(p);
    } else {
      side.append(el('p', 'empty', 'The demo is not loaded yet. Put its files in the phantom-limb folder, then set the link in the admin.'));
    }
    if (d.note) side.append(el('p', 'demo-note', d.note));
    if (d.cover) wrap.append(cover);
    wrap.append(side);
    frag.append(wrap);
    return frag;
  },

  // Hidden room: not in the directory. Reached by tapping the site name three times.
  registry(data) {
    const r = data.registry, frag = document.createDocumentFragment();
    const entries = shown(r.entries);
    frag.append(head(r.title || 'Mobius: Register of Minor Bodies', r.intro));
    if (!entries.length) {
      frag.append(el('p', 'empty', 'Nothing is registered yet. Add an entry from the admin under Register.'));
      return frag;
    }
    const tally = {};
    for (const e of entries) { const k = e.status || 'Registered'; tally[k] = (tally[k] || 0) + 1; }
    frag.append(el('p', 'reg-tally', Object.entries(tally).map(([k, n]) => `${k} ${n}`).join(' / ')));
    const list = el('ol', 'reg');
    entries.forEach((e, i) => {
      const li = el('li', 'reg-row');
      li.append(
        el('span', 'reg-no', e.no || String(i + 1).padStart(3, '0')),
        el('span', 'reg-name', e.name || 'Unnamed'),
        el('span', 'reg-status', e.status || 'Registered'),
      );
      const sub = [e.kind, e.note].filter(Boolean).join('. ');
      if (sub) li.append(el('span', 'reg-note', sub));
      list.append(li);
    });
    frag.append(list);
    return frag;
  },
};
const HIDDEN = { registry: 'Register' };

// Music bar in the top-right corner. Tracks come from content/music.json.
// Browsers refuse to start sound before the visitor has touched the page, so
// if the first attempt is refused, playback starts on their first click or key.
function startPlayer(music) {
  const tracks = shown(music.tracks).filter((t) => t.file);
  if (!tracks.length) return;
  const box = document.getElementById('player');
  const toggle = document.getElementById('player-toggle');
  const next = document.getElementById('player-next');
  const now = document.getElementById('player-now');
  const audio = new Audio();
  audio.preload = 'none';
  audio.volume = 0.6;

  const remember = (v) => { try { localStorage.setItem('substanz-music', v); } catch {} };
  const remembered = () => { try { return localStorage.getItem('substanz-music'); } catch { return null; } };

  let order = tracks.map((_, i) => i);
  if (music.shuffle) order.sort(() => Math.random() - 0.5);
  let at = 0;

  function load(i) {
    at = (i + order.length) % order.length;
    const t = tracks[order[at]];
    audio.src = /^https?:/.test(t.file) ? t.file : asset(t.file);
    now.textContent = [t.title, t.artist].filter(Boolean).join(' / ') || 'Untitled';
    now.title = now.textContent;
  }
  function paint() {
    const playing = !audio.paused;
    box.classList.toggle('is-playing', playing);
    toggle.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
  }
  const play = () => audio.play().then(paint, paint);

  toggle.addEventListener('click', () => {
    if (audio.paused) { remember('on'); play(); } else { audio.pause(); remember('off'); }
  });
  next.addEventListener('click', () => { load(at + 1); remember('on'); play(); });
  audio.addEventListener('ended', () => { load(at + 1); play(); });
  audio.addEventListener('error', () => { if (order.length > 1) { load(at + 1); if (box.classList.contains('is-playing')) play(); } paint(); });
  audio.addEventListener('pause', paint);
  audio.addEventListener('play', paint);
  next.hidden = order.length < 2;

  load(0);
  box.hidden = false;
  document.body.classList.add('has-player');

  // Start by itself unless the visitor paused it last time.
  if (music.autoplay !== false && remembered() !== 'off') {
    audio.play().then(paint, () => {
      const kick = (e) => {
        document.removeEventListener('pointerdown', kick, true);
        document.removeEventListener('keydown', kick, true);
        if (e.target.closest && e.target.closest('#player')) return; // their own click decides
        if (remembered() !== 'off') play();
      };
      document.addEventListener('pointerdown', kick, true);
      document.addEventListener('keydown', kick, true);
    });
  }
}

(async () => {
  const names = ['settings', 'menu', 'home', 'gallery', 'books', 'shop', 'demo', 'music', 'registry'];
  const loaded = await Promise.all(names.map(load));
  const data = Object.fromEntries(names.map((n, i) => [n, loaded[i] || {}]));
  const s = data.settings;

  document.documentElement.lang = s.language || 'en';
  document.querySelector('meta[name=description]').content = s.description || '';
  if (s.accent) document.documentElement.style.setProperty('--sign', s.accent);
  document.getElementById('site-title').textContent = s.title || 'Substanz';

  const counts = {
    gallery: shown(data.gallery.works).length,
    books: shown(data.books.items).length,
    shop: shown(data.shop.items).length,
  };
  const nav = document.getElementById('site-nav');
  for (const v of VIEWS) {
    const a = el('a');
    a.href = `#${v.id}`;
    a.dataset.view = v.id;
    a.append(el('span', 'nav-label', v.id === 'phantom-limb' ? (data.demo.title || v.label) : v.label));
    if (v.id in counts) a.append(el('span', 'nav-count', String(counts[v.id])));
    nav.append(a);
  }

  const links = document.getElementById('site-links');
  for (const i of (data.menu.items || []).filter((x) => x.label && x.link)) {
    const li = el('li'), a = el('a', '', i.label);
    a.href = i.link;
    if (/^https?:/.test(i.link)) { a.target = '_blank'; a.rel = 'noopener'; }
    li.append(a); links.append(li);
  }

  const view = document.getElementById('view');
  let first = true;
  function show() {
    const id = decodeURIComponent(location.hash.slice(1)) || 'overview';
    const current = render[id] ? id : 'overview';
    view.replaceChildren(render[current](data));
    for (const a of nav.children) {
      if (a.dataset.view === current) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    }
    const label = HIDDEN[current] || VIEWS.find((v) => v.id === current).label;
    document.body.classList.toggle('is-hidden-room', current in HIDDEN);
    document.title = current === 'overview' ? (s.title || 'Substanz') : `${label} | ${s.title || 'Substanz'}`;
    if (!first) { window.scrollTo(0, 0); view.focus({ preventScroll: true }); }
    first = false;
  }
  window.addEventListener('hashchange', show);
  show();

  // Three quick taps on the site name open the hidden register.
  // One or two taps still go to Overview as usual, which is also the way back out.
  const name = document.getElementById('site-title');
  let taps = 0, last = 0;
  name.addEventListener('click', (e) => {
    const now = Date.now();
    taps = now - last < 600 ? taps + 1 : 1;
    last = now;
    if (taps >= 3) {
      taps = 0;
      e.preventDefault();
      location.hash = 'registry';
    }
  });
  startPlayer(data.music);
})();
