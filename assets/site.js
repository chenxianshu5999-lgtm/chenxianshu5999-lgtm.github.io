// 公开页面：读取 content/*.json，按顺序渲染后台里配置的板块。
// 新增板块类型时，在 renderers 里加一个同名渲染函数，并在 admin/config.yml 里加对应字段。
const renderers = {
  text(s) {
    const el = document.createElement('section');
    if (s.title) {
      const h = document.createElement('h2');
      h.textContent = s.title;
      el.append(h);
    }
    const body = document.createElement('div');
    body.innerHTML = window.marked ? marked.parse(s.body || '') : (s.body || '');
    el.append(body);
    return el;
  },
};

async function load(name) {
  const res = await fetch(`content/${name}.json`, { cache: 'no-cache' });
  return res.ok ? res.json() : {};
}

(async () => {
  const [settings, menu, home] = await Promise.all(['settings', 'menu', 'home'].map(load));

  document.title = settings.title || '';
  document.documentElement.lang = settings.language || 'zh-CN';
  document.querySelector('meta[name=description]').content = settings.description || '';
  if (settings.accent) document.documentElement.style.setProperty('--accent', settings.accent);

  const items = (menu.items || []).filter((i) => i.label);
  if (settings.show_header || items.length) {
    document.getElementById('site-header').hidden = false;
    document.getElementById('site-title').textContent = settings.title || '';
    const nav = document.getElementById('site-nav');
    for (const i of items) {
      const a = document.createElement('a');
      a.textContent = i.label;
      a.href = i.link || '#';
      nav.append(a);
    }
  }

  const main = document.getElementById('sections');
  for (const s of home.sections || []) {
    if (s.hidden || !renderers[s.type]) continue;
    const el = renderers[s.type](s);
    el.classList.add('section', `section-${s.type}`);
    if (s.anchor) el.id = s.anchor;
    main.append(el);
  }
})();
