## Preload your Web pages faster and instantly

CDN links
```html
<script data-request="true" src="http://cdn.jsdelivr.net/gh/mp-player/instant-page@master/dist/1.0/instant-page.min.js" crossorgin="anonymous"></script>
```

Add this script before the closing `</body>` tag.

Example:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Instant Pages Loading</title>
  <link rel="stylesheet" data-href="style.css">
</head>
<body>

  <div>Your content here</div>
  <script data-src="script.js"></script>

  <!-- Put script here -->
  <script data-request="true" src="http://cdn.jsdelivr.net/gh/mp-player/instant-page@master/dist/1.0/instant-page.min.js" crossorgin="anonymous"></script>
</body>
</html>
```

**Important**

On value `data-request` must be set to `"true"`.

**Before used**

Change all `link/script` element attributes `href/src` to `data-href/data-src`.

Example:
```html
<link rel="icon" type="image/x-icon" data-href="favicon.ico">
<link rel="stylesheet" data-href="text-fonts.css">
<link rel="manifest" data-href="manifest.json">
<link rel="stylesheet" data-href="style.css">
<script data-src="script.js"></script>
```

**Required support and files**

- Favicons (.jpg/.jpeg/.png/.webp/.ico/.svg)
- Web Fonts (.css or from Google Fonts)
- JSON (.json/.manifest)
- CSS Stylesheet (.css)
- JavaScript (.js)

**Content source `storage`**

All data content is stored in **Local Storage**.

> It is highly recommended not to store a lot of data.

**Content source `update`**

The data will be updated automatically when the file content has new changes.

<hr>

Source code: **[V1.0](https://github.com/mp-player/instant-page/blob/master/dist/1.0/instant-page.js)**

License: **[MIT](https://github.com/mp-player/instant-page/blob/master/LICENSE)**
