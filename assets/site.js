// Public pages. Everything shown here comes from content/*.json, which the
// admin at /admin/ edits. Four views, switched by the #hash in the address.

const VIEWS = [
  { id: 'overview', label: 'Overview' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'books', label: 'Books' },
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
};

(async () => {
  const names = ['settings', 'menu', 'home', 'gallery', 'books', 'demo'];
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
    const label = VIEWS.find((v) => v.id === current).label;
    document.title = current === 'overview' ? (s.title || 'Substanz') : `${label} | ${s.title || 'Substanz'}`;
    if (!first) { window.scrollTo(0, 0); view.focus({ preventScroll: true }); }
    first = false;
  }
  window.addEventListener('hashchange', show);
  show();
})();
