# Substanz（个人网站）

纯静态网站 + 可视化后台（Sveltia CMS）。界面是英文，五个页面：Overview / Gallery / Books / Shop / Phantom Limb。

- 公开页面：`index.html`，内容全部来自 `content/*.json`。
- 后台：访问 `/admin/`，可以加画、加本、填幻肢 demo 的链接、改首页文字和外部链接。
- Shop：微店没有可以给静态网站读取的公开接口，所以在售商品是在后台「Shop」里手动维护的列表，上新、下架时在后台改一下。
- 音乐栏：在后台「音乐栏」里加曲目后，右上角才会出现播放条。浏览器不允许网页一打开就出声，所以实际是访客第一次点页面时开始播；访客按过暂停后，下次来不会再自动播。
- 图片上传到 `images/uploads/`。
- 幻肢 demo：把 demo 的文件（含它自己的 `index.html`）放进 `phantom-limb/` 文件夹，再在后台「Phantom Limb」里把链接填成 `phantom-limb/`。

## 本地预览

```bash
python3 -m http.server 8000
```

打开 http://localhost:8000 看网站，http://localhost:8000/admin/ 进后台（用 Chrome/Edge，选择 “Work with Local Repository” 并选中本文件夹）。

## 上线后登录后台

打开 `你的网址/admin/`，用 GitHub 的 Personal Access Token 登录，保存时会自动提交到仓库并重新发布。

## 改外观

颜色和字体都在 `assets/style.css` 顶部的 `:root` 里。左侧色条的颜色也可以直接在后台「基本设置」改。字体 Atkinson Hyperlegible 和 Markdown 解析器 marked 都放在 `assets/` 里，不依赖外部 CDN。

## 隐藏页

连点三下左上角的网站名（Substanz）会进入 Register：莫比斯小机构登记列表，黑底白字。点一下网站名回到 Overview。条目在后台「Register」里维护，内容在 `content/registry.json`。
