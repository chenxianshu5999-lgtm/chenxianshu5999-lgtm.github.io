# 个人网站

纯静态网站 + 可视化后台（Sveltia CMS，兼容 Decap/Netlify CMS 配置）。

- 公开页面：`index.html`，内容来自 `content/*.json`，目前全部为空，所以页面是空白的。
- 后台：访问 `/admin/`，左侧有「基本设置」「导航菜单」「首页板块」，板块可添加、删除、拖动排序、临时隐藏。
- 图片上传到 `images/uploads/`。

## 本地预览

```bash
python3 -m http.server 8000
```

打开 http://localhost:8000 看网站，http://localhost:8000/admin/ 进后台（用 Chrome/Edge，选择 “Work with Local Repository” 并选中本文件夹，改动直接写回本地文件）。

## 上线后登录后台

把 `admin/config.yml` 里的 `repo` 改成你的 GitHub 仓库，部署到 GitHub Pages 后打开 `你的网址/admin/`，用 GitHub 的 Personal Access Token 登录即可，保存时会自动提交到仓库并重新发布。

## 新增板块类型

1. `assets/site.js` 的 `renderers` 里加一个渲染函数；
2. `admin/config.yml` 的 `sections.types` 里加同名类型和字段。
