// Public pages. Everything shown here comes from content/*.json, which the
// admin at /admin/ edits. Views are switched by the #hash in the address.

const VIEWS = [
  { id: 'overview', label: 'Overview' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'books', label: 'Books' },
  { id: 'shop', label: 'Shop' },
  { id: 'screening', label: 'Screening Room' },
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

const CATEGORIES = ['Oil', 'Illustration', 'Sketch', 'Draft', 'Concept'];

// One work: image (small; a click enlarges it, a second click makes it small again),
// then title, details and note underneath.
function workCard(w) {
  const art = el('article', 'work');
  const fig = el('div', 'work-image');
  if (w.image) {
    const btn = el('button');
    btn.type = 'button';
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', `Enlarge ${w.title || 'image'}`);
    const img = el('img');
    img.src = asset(w.image); img.alt = w.title || ''; img.loading = 'lazy';
    // Known proportions reserve the image's space before it loads, so jumping
    // through the gallery does not drift while pictures above it come in.
    if (w.ratio > 0) { img.classList.add('has-ratio'); img.style.setProperty('--r', w.ratio); }
    btn.append(img); fig.append(btn);
    btn.addEventListener('click', () => {
      const open = !fig.classList.contains('is-open');
      fig.classList.toggle('is-open', open);
      btn.setAttribute('aria-pressed', String(open));
    });
  }
  const side = el('div', 'work-side');
  const title = el('h3', 'work-title', w.title || 'Untitled');
  side.append(title);
  const f = fields([['Year', w.year], ['Medium', w.medium], ['Size', w.size]]);
  if (f) side.append(f);
  if (w.description) {
    const t = md(w.description); t.classList.add('work-text');
    if (w.secret) {
      // Hidden text: three quick taps on the title show it, three more hide it again.
      t.hidden = true;
      title.classList.add('is-knock');
      let taps = 0, last = 0;
      title.addEventListener('click', () => {
        const now = Date.now();
        taps = now - last < 600 ? taps + 1 : 1; last = now;
        if (taps === 3) { taps = 0; t.hidden = !t.hidden; }
      });
    }
    side.append(t);
  }
  art.append(fig, side);
  return art;
}

// The gallery rail is a progress bar in segments, one per category. The segment
// of the category on screen stretches and fills as that category is scrolled through;
// categories already passed are full, the ones ahead are empty.
function spyRail() {
  const items = [...document.querySelectorAll('.rail-item')];
  if (!items.length) return;
  const line = window.innerHeight * 0.35;
  const rects = items.map((it) => document.getElementById(it.dataset.target).getBoundingClientRect());
  let cur = 0;
  rects.forEach((r, i) => { if (r.top <= line) cur = i; });
  items.forEach((it, i) => {
    let p = i < cur ? 1 : 0;
    if (i === cur) p = Math.min(1, Math.max(0, (line - rects[i].top) / Math.max(1, rects[i].height)));
    it.style.setProperty('--p', p.toFixed(4));
    if (i === cur) it.setAttribute('aria-current', 'true');
    else it.removeAttribute('aria-current');
  });
}

// ---------- reading a book ----------
// The first pages of a book are plain images. The rest are stored encrypted
// (AES-GCM); the key is derived in the browser from the passphrase that comes
// with the book, so nothing readable sits on the server.
const b64 = (str) => Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
const keyText = (str) => str.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  del(k) { try { localStorage.removeItem(k); } catch {} },
};
async function openWith(meta, key, bytes) {
  return crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes.slice(0, 12) }, key, bytes.slice(12));
}
async function keyFromPhrase(meta, phrase) {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(keyText(phrase)), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: b64(meta.salt), iterations: meta.iter }, base, 256);
  return new Uint8Array(bits);
}
async function keyIfRight(meta, raw) {
  try {
    const key = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
    await openWith(meta, key, b64(meta.check));
    return key;
  } catch { return null; }
}

let readerUrls = [];
function readerView(data, id) {
  for (const u of readerUrls) URL.revokeObjectURL(u);
  readerUrls = [];
  const meta = data.readers[id];
  const book = shown(data.books.items).find((b) => b.reader === id) || {};
  const frag = document.createDocumentFragment();
  const back = el('p', 'reader-back');
  const backLink = el('a', '', 'Books');
  backLink.href = '#books';
  back.append(backLink);
  frag.append(back, head(book.title || 'Untitled', [book.year, book.format].filter(Boolean).join(', ')));

  const wrap = el('div', 'reader');
  let version = meta.versions.find((v) => v.lang === store.get(`substanz-lang-${id}`)) || meta.versions[0];
  let key = null;
  let run = 0;

  const langs = el('div', 'reader-langs');
  const pagesBox = el('div', 'reader-pages');
  const lock = el('form', 'reader-lock');
  wrap.append(langs, pagesBox, lock);

  function paintLangs() {
    langs.replaceChildren();
    if (meta.versions.length < 2) return;
    for (const v of meta.versions) {
      const b = el('button', 'reader-lang', v.label);
      b.type = 'button';
      if (v === version) b.setAttribute('aria-pressed', 'true');
      b.addEventListener('click', () => { version = v; store.set(`substanz-lang-${id}`, v.lang); paint(); });
      langs.append(b);
    }
  }

  function pageBox(i) {
    const [w, h] = version.pages[i - 1];
    const box = el('div', 'page');
    box.style.aspectRatio = `${w} / ${h}`;
    box.addEventListener('click', () => box.classList.toggle('is-zoom'));
    return box;
  }

  async function paint() {
    const mine = ++run;
    paintLangs();
    pagesBox.replaceChildren();
    const base = `books/${id}/${version.lang}/`;
    const rev = meta.rev ? `?v=${meta.rev}` : ''; // changes whenever pages are replaced, so old copies are not reused
    const n = version.pages.length;
    const upto = key ? n : Math.min(n, version.free);
    const boxes = [];
    for (let i = 1; i <= upto; i++) {
      const box = pageBox(i);
      if (i <= version.free) {
        const img = el('img');
        img.src = `${base}p${String(i).padStart(2, '0')}.jpg${rev}`;
        img.alt = `Page ${i}`; img.loading = 'lazy';
        box.append(img);
      }
      boxes.push(box);
      pagesBox.append(box);
    }
    paintLock(n);
    // locked pages: fetch, decrypt, show, one after another
    for (let i = version.free + 1; i <= upto; i++) {
      try {
        const res = await fetch(`${base}p${String(i).padStart(2, '0')}.bin${rev}`);
        const plain = await openWith(meta, key, new Uint8Array(await res.arrayBuffer()));
        if (mine !== run) return;
        const url = URL.createObjectURL(new Blob([plain], { type: 'image/jpeg' }));
        readerUrls.push(url);
        const img = el('img');
        img.src = url; img.alt = `Page ${i}`;
        boxes[i - 1].append(img);
      } catch {
        if (mine !== run) return;
        boxes[i - 1].append(el('p', 'page-fail', `Page ${i} could not be opened.`));
      }
    }
  }

  function paintLock(n) {
    lock.replaceChildren();
    if (n <= version.free) return;
    if (key) {
      const p = el('p', 'reader-note', 'Unlocked on this device. ');
      const out = el('button', 'reader-forget', 'Lock again');
      out.type = 'button';
      out.addEventListener('click', () => { key = null; store.del(`substanz-key-${id}`); paint(); });
      p.append(out);
      lock.append(p);
      return;
    }
    const note = el('p', 'reader-note', `Pages ${version.free + 1} to ${n} are locked. ` +
      (book.link ? 'Enter the key that comes with the book. ' : 'Enter the key.'));
    if (book.link) {
      const buy = el('a', '', book.link_label || 'Get this book');
      buy.href = book.link; buy.target = '_blank'; buy.rel = 'noopener';
      note.append(buy);
    }
    lock.append(note);
    const row = el('div', 'reader-row');
    const input = el('input');
    input.type = 'text'; input.autocomplete = 'off'; input.spellcheck = false;
    input.setAttribute('aria-label', 'Key');
    const go = el('button', 'button', 'Unlock');
    go.type = 'submit';
    row.append(input, go);
    const msg = el('p', 'reader-msg');
    msg.setAttribute('role', 'status');
    lock.append(row, msg);
    lock.onsubmit = async (e) => {
      e.preventDefault();
      if (!input.value.trim()) return;
      if (!(window.crypto && crypto.subtle)) { msg.textContent = 'This browser cannot open locked pages.'; return; }
      go.disabled = true; msg.textContent = 'Checking the key.';
      const raw = await keyFromPhrase(meta, input.value);
      const k = await keyIfRight(meta, raw);
      go.disabled = false;
      if (!k) { msg.textContent = 'That key does not open this book.'; return; }
      key = k;
      store.set(`substanz-key-${id}`, btoa(String.fromCharCode(...raw)));
      paint();
    };
  }

  // a key used before on this device
  const saved = store.get(`substanz-key-${id}`);
  if (saved && window.crypto && crypto.subtle) {
    keyIfRight(meta, b64(saved)).then((k) => { if (k) { key = k; paint(); } else store.del(`substanz-key-${id}`); });
  }
  paint();
  frag.append(wrap);
  return frag;
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
    const films = shown(data.screening.films);
    if (films.length) row('screening', data.screening.title || 'Screening Room', plural(films.length, 'film', 'films'), 'Moving images.');
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
    // Works are grouped by category, in the order given in gallery.json.
    // Anything without a known category goes last, under Other.
    const order = (data.gallery.categories && data.gallery.categories.length) ? data.gallery.categories : CATEGORIES;
    const groups = order.map((c) => ({ label: c, works: works.filter((w) => w.category === c) }));
    const rest = works.filter((w) => !order.includes(w.category));
    if (rest.length) groups.push({ label: 'Other', works: rest });
    const filled = groups.filter((g) => g.works.length);

    const wrap = el('div', 'gallery');
    const main = el('div', 'gallery-main');
    const rail = el('nav', 'rail');
    rail.setAttribute('aria-label', 'Categories');

    filled.forEach((g, i) => {
      const sec = el('section', 'g-section');
      sec.id = `g-${i}`;
      const h = el('h2', 'g-head');
      h.append(el('span', '', g.label), el('span', 'g-count', String(g.works.length)));
      sec.append(h);
      for (const w of g.works) sec.append(workCard(w));
      main.append(sec);

      const b = el('button', 'rail-item');
      b.type = 'button';
      b.dataset.target = sec.id;
      const track = el('span', 'rail-track');
      track.append(el('span', 'rail-fill'));
      b.append(track, el('span', 'rail-label', g.label), el('span', 'rail-count', String(g.works.length)));
      b.addEventListener('click', (e) => {
        if (e.detail > 0) b.blur(); // pointer click: no focus ring left behind
        if (rail.dataset.scrubbed) { delete rail.dataset.scrubbed; return; }
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      rail.append(b);
    });

    // The rail doubles as the page's scrollbar: press or drag inside the long
    // (current) segment to move through that category.
    let scrub = null;
    const scrubTo = (y) => {
      const r = scrub.item.getBoundingClientRect();
      const f = Math.min(1, Math.max(0, (y - r.top) / Math.max(1, r.height)));
      const s = scrub.sec.getBoundingClientRect();
      window.scrollTo(0, window.scrollY + s.top - (window.innerHeight * 0.35 - f * s.height));
    };
    rail.addEventListener('pointerdown', (e) => {
      const item = e.target.closest('.rail-item');
      if (!item || item.getAttribute('aria-current') !== 'true' || e.button) return;
      scrub = { item, sec: document.getElementById(item.dataset.target) };
      rail.dataset.scrubbed = '1';
      rail.setPointerCapture(e.pointerId);
      scrubTo(e.clientY);
      e.preventDefault();
    });
    rail.addEventListener('pointermove', (e) => { if (scrub) scrubTo(e.clientY); });
    const endScrub = () => { scrub = null; setTimeout(() => delete rail.dataset.scrubbed, 0); };
    rail.addEventListener('pointerup', endScrub);
    rail.addEventListener('pointercancel', endScrub);
    wrap.append(main, rail);
    frag.append(wrap);
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
      const actions = el('p', 'book-link');
      if (b.reader && data.readers[b.reader]) {
        const a = el('a', 'button', 'Read');
        a.href = `#read/${b.reader}`;
        actions.append(a);
        cover.classList.add('is-link');
        cover.addEventListener('click', () => { location.hash = `read/${b.reader}`; });
      }
      if (b.link) {
        const a = el('a', 'button button-quiet', b.link_label || 'Get this book');
        a.href = b.link; a.target = '_blank'; a.rel = 'noopener';
        actions.append(a);
      }
      if (actions.children.length) side.append(actions);
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
      if (!sh.url) frag.append(el('p', 'empty', 'Nothing is listed here yet. Add what is on sale from the admin under Shop.'));
      return frag;
    }
    const grid = el('div', 'goods');
    for (const g of items) {
      const link = g.link || sh.url;
      const card = el(link ? 'a' : 'div', 'good');
      if (link) { card.href = link; card.target = '_blank'; card.rel = 'noopener'; }
      if (g.image) { const img = el('img'); img.referrerPolicy = 'no-referrer'; img.src = asset(g.image); img.alt = ''; img.loading = 'lazy'; card.append(img); }
      card.append(el('span', 'good-name', g.name || 'Untitled'));
      const line = [g.price, g.status].filter(Boolean).join(', ');
      if (line) card.append(el('span', 'good-line', line));
      grid.append(card);
    }
    frag.append(grid);
    return frag;
  },

  screening(data) {
    const sc = data.screening, frag = document.createDocumentFragment();
    const films = shown(sc.films);
    frag.append(head(sc.title || 'Screening Room', sc.intro));
    if (!films.length) { frag.append(el('p', 'empty', 'Nothing is showing yet.')); return frag; }
    for (const f of films) {
      const art = el('article', 'film');
      const v = el('video');
      v.controls = true; v.preload = 'metadata'; v.playsInline = true;
      if (f.poster) v.poster = asset(f.poster);
      v.src = asset(f.video);
      if (f.ratio > 0) v.style.aspectRatio = f.ratio;
      art.append(v);
      const side = el('div', 'film-side');
      side.append(el('h3', 'work-title', f.title || 'Untitled'));
      const fl = fields([['Year', f.year], ['Length', f.length], ['Medium', f.medium]]);
      if (fl) side.append(fl);
      if (f.description) { const t = md(f.description); t.classList.add('work-text'); side.append(t); }
      art.append(side);
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
      const a = el('a', 'button', 'Play the demo');
      a.href = d.url; a.target = '_blank'; a.rel = 'noopener';
      p.append(a); side.append(p);
    } else {
      side.append(el('p', 'empty', 'The demo is not loaded yet. Put its files in the phantom-limb folder, then set the link in the admin.'));
    }
    if (d.note) side.append(el('p', 'demo-note', d.note));
    if (d.cover) wrap.append(cover);
    wrap.append(side);
    // The cover is a square exactly as tall as the button and the note beside it.
    if (d.cover && window.ResizeObserver) {
      new ResizeObserver(() => {
        const wide = window.matchMedia('(min-width: 821px)').matches;
        cover.style.width = cover.style.height = wide ? side.offsetHeight + 'px' : '';
      }).observe(side);
    }
    frag.append(wrap);
    return frag;
  },

  // Hidden room: one picture, as large as the window allows.
  t0() {
    const fig = el('div', 'pane');
    const img = el('img'); img.src = 'images/hidden/t0.jpg'; img.alt = '';
    fig.append(img);
    return fig;
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
      const name = el('span', 'reg-name');
      if (e.link) {
        const a = el('a', '', e.name || 'Unnamed');
        a.href = e.link;
        if (/^https?:/.test(e.link)) { a.target = '_blank'; a.rel = 'noopener'; }
        name.append(a);
      } else name.textContent = e.name || 'Unnamed';
      li.append(
        el('span', 'reg-no', e.no || String(i + 1).padStart(3, '0')),
        name,
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
const HIDDEN = { registry: 'Register', 'phantom-limb': 'Phantom Limb', t0: 'T0' };
// Hidden rooms that get a row in the left menu, shown only inside the black side.
const HIDDEN_NAV = ['t0'];

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
  const names = ['settings', 'menu', 'home', 'gallery', 'books', 'shop', 'screening', 'demo', 'music', 'registry', 'readers'];
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
    screening: shown(data.screening.films).length,
  };
  const nav = document.getElementById('site-nav');
  for (const v of VIEWS) {
    const a = el('a');
    a.href = `#${v.id}`;
    a.dataset.view = v.id;
    a.append(el('span', 'nav-label', v.id === 'phantom-limb' ? (data.demo.title || v.label) : v.label));
    if (v.id in counts) a.append(el('span', 'nav-count', String(counts[v.id])));
    // An empty section stays out of the menu until something is in it.
    if (v.id === 'screening' && !counts.screening) continue;
    nav.append(a);
  }
  for (const id of HIDDEN_NAV) {
    const a = el('a', 'nav-hidden');
    a.href = `#${id}`;
    a.dataset.view = id;
    a.append(el('span', 'nav-label', HIDDEN[id]));
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
    const reading = id.startsWith('read/') && data.readers[id.slice(5)] ? id.slice(5) : null;
    const current = reading ? 'books' : (render[id] ? id : 'overview');
    view.replaceChildren(reading ? readerView(data, reading) : render[current](data));
    for (const a of nav.children) {
      if (a.dataset.view === current) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    }
    const label = HIDDEN[current] || VIEWS.find((v) => v.id === current).label;
    document.body.classList.toggle('is-hidden-room', current in HIDDEN);
    document.documentElement.classList.toggle('has-rail', !!view.querySelector('.rail'));
    document.title = current === 'overview' ? (s.title || 'Substanz') : `${label} | ${s.title || 'Substanz'}`;
    if (!first) { window.scrollTo(0, 0); view.focus({ preventScroll: true }); }
    first = false;
    spyRail();
  }
  window.addEventListener('hashchange', show);
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; spyRail(); });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
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
