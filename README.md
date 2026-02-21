## 🚀 Preload Web Pages Faster & Instantly

### CDN Link
Add the following script before the closing `</body>` tag:

```html
<script data-request="true" src="http://cdn.jsdelivr.net/gh/mp-player/instant-page@master/dist/1.1/instant-page.min.js" crossorigin="anonymous"></script>
```

### Example
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

  <!-- Place the script here ->
  <script data-request="true" src="http://cdn.jsdelivr.net/gh/mp-player/instant-page@master/dist/1.1/instant-page.min.js" crossorigin="anonymous"></script>
</body>
</html>
```

---

### ⚠️ Important
- The value of `data-request` must be set to `"true"`.
- Before use, change all `href/src` attributes on `link/script` elements to `data-href/data-src`.

**Example:**
```html
<!-- Support in V1.0/V1.1 -->
<link rel="stylesheet" data-href="text-fonts.css">
<!-- Support in V1.0, V1.1 is not supported -->
<link rel="manifest" data-href="manifest.json">
<!-- Support in V1.0/V1.1 -->
<link rel="stylesheet" data-href="style.css">
<!-- Support in V1.0/V1.1 -->
<script data-src="script.js"></script>
```

---

### 📂 Support & Required Files

**Version `1.0`**
- Web Fonts (.css or Google Fonts)
- JSON (.json / .manifest)
- CSS Stylesheet (.css)
- JavaScript (.js)

**Version `1.1`** *(Recommended - Faster)*
- Web Fonts (.css or Google Fonts)
- CSS Stylesheet (.css)
- JavaScript (.js)

---

### 💾 Content Source
- All data is stored in **Local Storage**.
- The content will be updated automatically when the file changes.

**Note:** Storing too much data is not recommended.

---

### 📜 Source Code
- [V1.1 (Recommended)](https://github.com/mp-player/instant-page/blob/master/dist/1.1/instant-page.js)
- [V1.0](https://github.com/mp-player/instant-page/blob/master/dist/1.0/instant-page.js)

**License:** [MIT](https://github.com/mp-player/instant-page/blob/master/LICENSE)
