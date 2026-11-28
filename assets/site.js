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

// A click anywhere that is not a text bar puts the bars' borders back.
document.addEventListener('click', (e) => {
  if (e.target.closest && e.target.closest('.pane-line')) return;
  for (const o of document.querySelectorAll('.pane-line.is-current')) o.classList.remove('is-current');
});

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
    row('shop', 'Shop', plural(goods.length, 'item', 'items'), 'Goods, books and prints on sale now.');
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

  // Hidden room: one picture across the whole width, with lines of text laid
  // over it as coloured bars (positions are percentages of the picture).
  t0(data) {
    const d = data.t0, wrap = el('div', 'pane-wrap'), fig = el('div', 'pane');
    wrap.append(fig);
    const img = el('img'); img.src = asset(d.image || '/images/hidden/t0-4.jpg'); img.alt = '';
    fig.append(img);
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Same order of events as the demo: a glowing dot first; a click on it
    // removes the dot and types the bar out. A click on a bar lights its
    // border, a click anywhere else puts it back.
    // Lines can carry followers in `then`: as in the demo, a click on a bar
    // that has finished typing brings the next one in just below it.
    const bars = [];
    // While a visit is being put back as it was left, bars appear already typed.
    let quick = false;
    // Move the lit border to one bar; wait a frame so a bar that has only just
    // been shown fades in instead of appearing already lit.
    let lit = null;
    const light = (bar) => {
      lit = bar;
      for (const o of bars) if (o !== bar) o.classList.remove('is-current');
      requestAnimationFrame(() => requestAnimationFrame(() => { if (lit === bar) bar.classList.add('is-current'); }));
    };
    const slideTo = (l) => {
      const wrap = fig.parentElement;
      if (!wrap || wrap.scrollWidth <= wrap.clientWidth) return;
      const left = fig.offsetWidth * (l.x || 0) / 100;
      const width = Math.min(fig.offsetWidth * (l.w || 36) / 100, wrap.clientWidth - 32);
      if (left < wrap.scrollLeft + 16 || left + width > wrap.scrollLeft + wrap.clientWidth - 16)
        wrap.scrollTo({ left: left - 16, behavior: still ? 'auto' : 'smooth' });
    };
    // `done` runs once the last bar of a line's chain has finished typing.
    // All bars of one line share a `group`; once the line has been read to the
    // end, a click on any of its bars folds them back into the dot, and the dot
    // opens them again as they were, without typing them out a second time.
    const makeBar = (l, chain, done, group) => {
      const bar = el('p', 'pane-line');
      bar.hidden = true;
      bar.style.left = `${l.x || 0}%`; bar.style.top = `${l.y || 0}%`;
      // The bar is only as long as the text typed so far, up to this width.
      if (l.w) bar.style.maxWidth = `${l.w}%`;
      if (l.bg) bar.style.background = l.bg;
      if (l.color) bar.style.color = l.color;
      let typed = false, opened = false;
      const play = () => {
        bar.hidden = false;
        slideTo(l);
        if (still || quick) { bar.textContent = l.text; typed = true; light(bar); finish(); return; }
        const chars = Array.from(l.text);
        let n = 0;
        (function step() {
          if (!bar.isConnected) return;
          bar.textContent = chars.slice(0, ++n).join('');
          if (n < chars.length) setTimeout(step, 18); else { typed = true; light(bar); finish(); }
        })();
      };
      const finish = () => {
        if (chain.length) return;
        group.read = true;
        if (done) { const f = done; done = null; f(bar); }
      };
      bar.addEventListener('click', (e) => {
        e.stopPropagation();
        if (group.read && !quick) { group.fold(); return; }
        light(bar);
        if (!typed || opened || !chain.length) return;
        opened = true;
        const [head, ...rest] = chain;
        const nl = { ...l, ...head, then: undefined };
        nl.x = (l.x || 0) + (head.dx || 0);
        nl.y = (bar.offsetTop + bar.offsetHeight) / fig.offsetHeight * 100 + (head.gap ?? 1.2);
        const next = makeBar(nl, rest, done, group);
        lit = null;
        for (const o of bars) o.classList.remove('is-current');
        next.play();
      });
      bars.push(bar);
      group.bars.push(bar);
      fig.append(bar);
      bar.play = play;
      return bar;
    };
    // Doors stay open once found, until the page is reloaded: coming back to
    // this room the square waits where the line's dot sits.
    const doors = {};
    const opened = () => [...OPENED_DOORS];
    // Doors sit in a row on the pale blue strip painted in the picture, in
    // the order their lines come; the first door takes the first place.
    const shelf = { x: 13.1, y: 35.6, step: 3.6, ...(d.doorShelf || {}) };
    const doorOrder = shown(d.lines).filter((l) => l.door).map((l) => l.door);
    const placeDoor = (l, lastBar) => {
      let door = doors[l.door];
      if (!door) {
        door = doors[l.door] = el('a', 'pane-door');
        door.href = l.door;
        door.setAttribute('aria-label', l.doorLabel || 'Enter');
        if (l.doorLabel) door.dataset.label = l.doorLabel;
        door.addEventListener('click', (e) => e.stopPropagation());
        const slot = Math.max(0, doorOrder.indexOf(l.door));
        door.style.left = `${shelf.x + 0.6 + slot * shelf.step}%`;
        door.style.top = `${shelf.y}%`;
        fig.append(door);
      }
      if (lastBar) OPENED_DOORS.add(l.door);
    };
    // A line marked `after` keeps its dot back until the line before it has
    // been read to the end (its last bar typed out), then the dot fades in.
    // Once a door has been found, the room is put back the way it was left:
    // every line before the door's line already read out, the door's line
    // still a dot, and the door beside it.
    const lines = shown(d.lines).filter((l) => l.text);
    const back = lines.findIndex((l) => l.door && opened().includes(l.door));
    const entries = [];
    let prevDone = null;
    for (let l of lines) {
      // Back from the room behind the door, the door's line asks something else.
      // Left before the end, it asks something else again.
      if (entries.length === back) {
        const t = T1_STATE === 'finished' ? l.againText : T1_STATE === 'started' ? l.quitText : null;
        if (t) l = { ...l, text: t };
      }
      const dot = el('button', 'pane-dot');
      const group = { bars: [], read: false };
      // Folding and unfolding cross-fade: the bars fade as one, the dot fades
      // the other way, and the door fades out, moves, and fades back in.
      const FADE = still ? 0 : 380;
      const fadeIn = (node) => {
        node.classList.add('is-faded');
        requestAnimationFrame(() => requestAnimationFrame(() => node.classList.remove('is-faded')));
      };
      group.fold = () => {
        if (group.busy) return;
        group.busy = true;
        for (const b of group.bars) { b.classList.add('is-faded'); b.classList.remove('is-current'); }
        if (lit && group.bars.includes(lit)) lit = null;
        dot.hidden = false; dot.classList.remove('is-arriving');
        fig.append(dot); fadeIn(dot);
        setTimeout(() => {
          for (const b of group.bars) { b.hidden = true; b.classList.remove('is-faded'); }
          group.busy = false;
        }, FADE);
      };
      group.unfold = () => {
        if (group.busy) return;
        group.busy = true;
        dot.classList.add('is-faded');
        for (const b of group.bars) { b.hidden = false; fadeIn(b); }
        const last = group.bars[group.bars.length - 1];
        setTimeout(() => {
          dot.remove(); dot.classList.remove('is-faded');
          light(last);
          group.busy = false;
        }, FADE);
      };
      let release;
      const ready = new Promise((r) => { release = r; });
      const bar = makeBar(l, (l.then || []).filter((t) => t && t.text), (lastBar) => {
        release();
        // A line can open a door: a black square beside its last bar, leading on to another room.
        if (l.door) placeDoor(l, lastBar);
      }, group);
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Open');
      dot.style.left = bar.style.left; dot.style.top = bar.style.top;
      dot.style.setProperty('--dot', l.dot || l.bg || '#c9d62a');
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        if (group.read) { group.unfold(); return; }
        dot.remove();
        bar.play();
      });
      const i = entries.length;
      if (l.after && prevDone && !(back >= 0 && i <= back)) {
        dot.hidden = true;
        prevDone.then(() => { if (!dot.hidden) return; dot.hidden = false; dot.classList.add('is-arriving'); fig.append(dot); });
      } else fig.append(dot);
      prevDone = ready;
      if (i === back) placeDoor(l, null);
      entries.push({ bar, dot });
    }
    // Things in the picture that are themselves the dot (the cicada): their
    // outline, in the picture's own pixels, is cut out as the place to click.
    // Each keeps its own reading, apart from the lines and their order, and is
    // not put back when coming home from another room.
    const things = shown(d.things).filter((t) => t.text && t.points);
    if (things.length) {
      const NS = 'http://www.w3.org/2000/svg';
      const [W, H] = d.size || [4200, 3455];
      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('class', 'pane-things');
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.setAttribute('preserveAspectRatio', 'none');
      const defs = document.createElementNS(NS, 'defs');
      svg.append(defs);
      // Under the bars and dots, so a bar lying across the cicada still takes its click.
      img.after(svg);
      things.forEach((t, k) => {
        const pts = t.points.map((p) => p.join(',')).join(' ');
        const g = document.createElementNS(NS, 'g');
        g.setAttribute('class', 'pane-thing is-new');
        g.setAttribute('tabindex', '0');
        g.setAttribute('role', 'button');
        g.setAttribute('aria-label', t.label || 'Open');
        // A soft light around the outline with no line in it: many faint white
        // strokes laid over one another, each a little wider, so they add up to
        // a blur that fades outward. No filters, no clipping, so every browser
        // draws it. Widths are in the picture's pixels.
        const lift = document.createElementNS(NS, 'g');
        lift.setAttribute('class', 'pane-lift');
        // Keep the light outside the outline: clip to everything but the cicada
        // (the whole picture with the outline punched out of it).
        const cutId = `pane-out-${Date.now().toString(36)}-${k}`;
        const cut = document.createElementNS(NS, 'clipPath');
        cut.id = cutId;
        const hole = document.createElementNS(NS, 'path');
        hole.setAttribute('d', `M0,0H${W}V${H}H0Z M${t.points.map((p) => p.join(',')).join(' L')}Z`);
        hole.setAttribute('clip-rule', 'evenodd');
        cut.append(hole); defs.append(cut);
        const outside = document.createElementNS(NS, 'g');
        outside.setAttribute('clip-path', `url(#${cutId})`);
        lift.append(outside);
        for (const [w, o] of Array.from({ length: 8 }, (_, k) => [6 + k * 6, 0.075])) {
          const ring = document.createElementNS(NS, 'polygon');
          ring.setAttribute('points', pts);
          ring.setAttribute('fill', 'none');
          ring.setAttribute('stroke', '#fff');
          ring.setAttribute('stroke-width', w);
          ring.setAttribute('stroke-opacity', o);
          ring.setAttribute('stroke-linejoin', 'round');
          outside.append(ring);
        }
        const hit = document.createElementNS(NS, 'polygon');
        hit.setAttribute('class', 'pane-hit');
        hit.setAttribute('points', pts);
        g.append(lift, hit);
        svg.append(g);

        const group = { bars: [], read: false };
        const FADE = still ? 0 : 380;
        group.fold = () => {
          if (group.busy) return;
          group.busy = true;
          for (const b of group.bars) { b.classList.add('is-faded'); b.classList.remove('is-current'); }
          if (lit && group.bars.includes(lit)) lit = null;
          setTimeout(() => {
            for (const b of group.bars) { b.hidden = true; b.classList.remove('is-faded'); }
            group.busy = false;
          }, FADE);
        };
        group.unfold = () => {
          if (group.busy) return;
          group.busy = true;
          for (const b of group.bars) {
            b.hidden = false; b.classList.add('is-faded');
            requestAnimationFrame(() => requestAnimationFrame(() => b.classList.remove('is-faded')));
          }
          setTimeout(() => { light(group.bars[group.bars.length - 1]); group.busy = false; }, FADE);
        };
        const bar = makeBar({ ...t, points: undefined }, (t.then || []).filter((x) => x && x.text), null, group);
        let started = false;
        const open = (e) => {
          e.stopPropagation();
          g.classList.remove('is-new');
          if (!started) { started = true; bar.play(); return; }
          if (!group.read) return;
          if (group.bars[0].hidden) group.unfold(); else group.fold();
        };
        // While any of its bars is on screen, lit or not, the cicada glows: it is the one speaking.
        const speak = () => g.classList.toggle('is-speaking', group.bars.some((b) => !b.hidden && !b.classList.contains('is-faded')));
        new MutationObserver(speak).observe(fig, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'hidden'] });
        // Belt and braces: check again shortly after any click on the page.
        const later = () => { if (!fig.isConnected) { document.removeEventListener('click', later, true); return; } for (const ms of [60, 450, 900, 2500]) setTimeout(speak, ms); };
        document.addEventListener('click', later, true);
        g.addEventListener('click', open);
        g.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(e); }
        });
      });
    }
    if (back > 0) {
      const restore = () => requestAnimationFrame(() => {
        if (!fig.isConnected) return;
        quick = true;
        for (const { bar, dot } of entries.slice(0, back)) {
          dot.remove();
          let b = bar;
          b.play();
          for (;;) {
            const n = bars.length;
            b.click();
            if (bars.length === n) break;
            b = bars[bars.length - 1];
          }
        }
        quick = false;
        lit = null;
        for (const o of bars) o.classList.remove('is-current');
      });
      if (img.complete && img.naturalWidth) restore(); else img.addEventListener('load', restore, { once: true });
    }
    // On a phone the picture fills the height and pans sideways; start with
    // the figure in the middle of the screen.
    requestAnimationFrame(() => {
      if (wrap.scrollWidth <= wrap.clientWidth) return;
      wrap.scrollLeft = fig.offsetWidth * (d.focus || 0.33) - wrap.clientWidth / 2;
      // Then slide the page down so the whole picture is on screen; the top
      // bar stays where it is, one swipe up.
      setTimeout(() => {
        if (!wrap.isConnected) return;
        window.scrollTo({ top: wrap.getBoundingClientRect().top + window.scrollY, behavior: still ? 'auto' : 'smooth' });
      }, 350);
    });
    return wrap;
  },

  // Hidden room: Chen Xiansheng walks the visitor through the two-pillar test,
  // a 3D model with his lines and questions laid over it. The page itself is
  // /t1/index.html; its script is content/t1.json.
  t1() {
    const f = el('iframe', 'lesson-frame');
    f.src = asset('/t1/') + '?v=2611250149';
    f.title = 'T1';
    f.setAttribute('allowfullscreen', '');
    // Fill exactly what is left of the screen below whatever sits above the
    // frame (on a phone, the site's top bar), so the bottom never falls off.
    const fit = () => {
      if (!f.isConnected) { window.removeEventListener('resize', fit); return; }
      const top = f.getBoundingClientRect().top + window.scrollY;
      f.style.height = `${Math.max(360, window.innerHeight - top)}px`;
    };
    requestAnimationFrame(fit);
    window.addEventListener('resize', fit);
    return f;
  },

  // Hidden room: the downlink screen of the Qiyesi space telescope, reached
  // from its row in the register. With no footage set it stays a dead screen.
  telescope(data) {
    const d = data.telescope, frag = document.createDocumentFragment();
    frag.append(head(d.title || '氕叶斯太空望远镜', d.intro));
    const room = el('section', 'scope');
    room.append(el('p', 'scope-label', d.label || 'Facility 019 / Downlink'));

    const screen = el('div', 'scope-screen');
    if (d.ratio > 0) screen.style.aspectRatio = d.ratio;
    for (const c of ['tl', 'tr', 'bl', 'br']) screen.append(el('span', `scope-corner scope-${c}`));
    const ch = el('span', 'scope-tag scope-ch', 'CH 01');
    const clock = el('span', 'scope-tag scope-clock', 'T+ 00:00:00');
    screen.append(ch, clock);

    const bar = el('div', 'scope-bar');
    const play = el('button', 'scope-btn', 'Play'); play.type = 'button';
    const track = el('div', 'scope-track'); const fill = el('span', 'scope-fill'); track.append(fill);
    const time = el('span', 'scope-time', '00:00 / --:--');
    const full = el('button', 'scope-btn', 'Full'); full.type = 'button';
    bar.append(play, track, time, full);

    const pad = (n) => String(Math.floor(n)).padStart(2, '0');
    const mmss = (t) => (isFinite(t) ? `${pad(t / 60)}:${pad(t % 60)}` : '--:--');

    if (d.video) {
      const v = el('video', 'scope-video');
      v.preload = 'metadata'; v.playsInline = true;
      if (d.poster) v.poster = asset(d.poster);
      v.src = /^https?:/.test(d.video) ? d.video : asset(d.video);
      screen.prepend(v);
      const toggle = () => (v.paused ? v.play() : v.pause());
      play.addEventListener('click', toggle);
      v.addEventListener('click', toggle);
      v.addEventListener('play', () => { play.textContent = 'Pause'; screen.classList.add('is-live'); });
      v.addEventListener('pause', () => { play.textContent = 'Play'; });
      v.addEventListener('timeupdate', () => {
        fill.style.width = v.duration ? `${(v.currentTime / v.duration) * 100}%` : '0';
        time.textContent = `${mmss(v.currentTime)} / ${mmss(v.duration)}`;
      });
      v.addEventListener('loadedmetadata', () => { time.textContent = `00:00 / ${mmss(v.duration)}`; });
      track.addEventListener('click', (e) => {
        if (!v.duration) return;
        const r = track.getBoundingClientRect();
        v.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * v.duration;
      });
    } else {
      // Nothing received yet: reticle and a waiting line in the middle.
      const idle = el('div', 'scope-idle');
      idle.innerHTML = '<svg class="scope-reticle" viewBox="0 0 200 200" aria-hidden="true">'
        + '<circle cx="100" cy="100" r="62" /><circle cx="100" cy="100" r="3" />'
        + '<line x1="100" y1="8" x2="100" y2="56" /><line x1="100" y1="144" x2="100" y2="192" />'
        + '<line x1="8" y1="100" x2="56" y2="100" /><line x1="144" y1="100" x2="192" y2="100" /></svg>';
      const msg = el('p', 'scope-msg');
      msg.append(el('span', '', 'NO SIGNAL'), el('span', 'scope-sub', 'Awaiting downlink'));
      idle.append(msg);
      screen.append(idle);
      play.disabled = true; full.disabled = true; track.classList.add('is-off');
    }
    full.addEventListener('click', () => {
      const f = screen.requestFullscreen || screen.webkitRequestFullscreen;
      if (document.fullscreenElement) document.exitFullscreen(); else if (f) f.call(screen);
    });

    // Time since the screen was opened, so the dead channel still ticks.
    const t0 = Date.now();
    const tick = () => {
      if (!clock.isConnected) return;
      const s = (Date.now() - t0) / 1000;
      clock.textContent = `T+ ${pad(s / 3600)}:${pad((s / 60) % 60)}:${pad(s % 60)}`;
      setTimeout(tick, 1000);
    };
    setTimeout(tick, 1000);

    room.append(screen, bar);
    const fl = fields([['Target', d.target || '—'], ['Band', d.band || '—'], ['Received', d.received || '—']]);
    if (fl) room.append(fl);
    const back = el('a', 'scope-back', '← Register'); back.href = '#registry';
    room.append(back);
    frag.append(room);
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
// Doors found in T0 during this visit (forgotten on reload).
const OPENED_DOORS = new Set();
// How the last time through T1 went: 'started' if the visitor left before the
// end, 'finished' if they saw it through. T1 reports this from its frame.
let T1_STATE = null;
window.substanzT1 = (state) => { T1_STATE = state; };
const HIDDEN = { registry: 'Register', 'phantom-limb': 'Phantom Limb', t0: 'T0', t1: 'T1', telescope: 'Qiyesi Telescope' };
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
  const names = ['settings', 'menu', 'home', 'gallery', 'books', 'shop', 'screening', 'demo', 'music', 'registry', 'readers', 't0', 'telescope'];
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
  // The site name: one tap reloads the page with fresh copies of the code and
  // content (the host lets browsers keep old copies for ten minutes); three
  // quick taps open the hidden register.
  const name = document.getElementById('site-title');
  let taps = 0, last = 0, wait = 0;
  name.addEventListener('click', (e) => {
    e.preventDefault();
    const now = Date.now();
    taps = now - last < 600 ? taps + 1 : 1;
    last = now;
    clearTimeout(wait);
    if (taps >= 3) { taps = 0; location.hash = 'registry'; return; }
    wait = setTimeout(() => { if (taps === 1) freshReload(); taps = 0; }, 600);
  });
  async function freshReload() {
    name.classList.add('is-busy');
    const own = performance.getEntriesByType('resource').map((r) => r.name)
      .filter((u) => u.startsWith(location.origin) && /\.(js|css|json)(\?|$)/.test(u));
    for (const n of document.querySelectorAll('script[src], link[rel=stylesheet]')) own.push(n.src || n.href);
    own.push(location.origin + location.pathname);
    await Promise.all(own.map((u) => fetch(u, { cache: 'reload' }).catch(() => {})));
    location.reload();
  }
  startPlayer(data.music);
})();
