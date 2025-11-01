/*!
  Copyright (c) 2025 MP-Player (Instant Pages Loading JS)
  Source (https://github.com/mp-player/instant-page/blob/master/dist/1.0/instant-page.js)
  Licensed under MIT (https://github.com/mp-player/instant-page/blob/master/LICENSE)
*/

(function() {
  "use-strict";

  document.documentElement.style.visibility = "hidden";

  const contentScript = document.querySelector("script[data-request]");
  if (contentScript && contentScript.dataset.request === "true") {
    if (window.performance) {
      if (performance.navigation.type == 0) {
        elementLink("link[data-href]");
        elementScript("script[data-src]");
      }
    }
  } else {
    console.error("[Null] Script for data request not found.");
  }

  function elementLink(element) {
    var elems = document.querySelectorAll(element);
    elems.forEach((link) => {
      if (link) {
        var file = link.dataset.href;
        if (file) {
          var fileName = filePath(file);
          var dataItem = storage().get(fileName);
          contentCreate(link, file, fileName, dataItem);
        }
      }
    });
  }

  function elementScript(element) {
    var elems = document.querySelectorAll(element);
    elems.forEach((script) => {
      if (script) {
        var file = script.dataset.src;
        if (file) {
          var fileName = filePath(file);
          var dataItem = storage().get(fileName);
          contentCreate(script, file, fileName, dataItem);
        }
      }
    });
  }

  function contentCreate(elem, file, fileName, dataItem) {
    if (!dataItem) {
      contentParser(elem, file, fileName, true);
    } else {
      contentReload(elem, dataItem);
      setTimeout(() => {
        contentParser(elem, file, fileName, false);
      }, 1000);
    }
  }

  function contentReload(elem, dataItem) {
    var file = createURL(dataItem);
    if (/HTMLLinkElement/i.test(elem)) {
      elem.href = file;
    } else if (/HTMLScriptElement/i.test(elem)) {
      elem.src = file;
    }
    setTimeout(() => {
      document.documentElement.style.visibility = "visible";
    }, 1000);
  }

  function contentParser(elem, file, fileName, dataRequest) {
    if (fileName.match(/\.(jpg|jpeg|png|webp|ico|svg)/)) {
      requestIconFile(elem, file, fileName);
    } else {
      requestTextFile(elem, file, fileName, dataRequest);
    }
  }

  function requestIconFile(elem, file, fileName) {
    var request = new XMLHttpRequest();
    request.open("GET", file, true);
    request.responseType = "blob";
    request.addEventListener("load", async (e) => {
      if (e.target.readyState == 4 || e.target.readyState == "complete") {
        if (e.target.status == 200 || e.target.status == 0) {
          var dataBlob = await e.target.response;
          var dataType = contentType(await e.target.getResponseHeader("Content-Type"), fileName);
          var dataItem = json().input({text: dataBlob, type: dataType});
          storage().set(fileName, dataItem);
          contentReload(elem, dataItem);
        }
      }
    }, false);
    request.addEventListener("error", (e) => {
      request.abort(e);
    }, false);
    request.send(null);
  }

  function requestTextFile(elem, file, fileName, dataRequest) {
    var request = new XMLHttpRequest();
    request.open("GET", file, true);
    request.addEventListener("load", async (e) => {
      if (e.target.readyState == 4 || e.target.readyState == "complete") {
        if (e.target.status == 200 || e.target.status == 0) {
          var dataText = await e.target.responseText;
          var dataType = contentType(await e.target.getResponseHeader("Content-Type"), fileName);
          var dataItem = json().input({text: dataText, type: dataType});
          if (dataRequest !== true) {
            var currentText = json().output(storage().get(fileName)).text();
            if (dataText !== currentText) {
              storage().remove(fileName);
              storage().set(fileName, dataItem);
              setTimeout(() => {
                window.location = document.URL;
              }, 1000);
            }
          } else {
            storage().set(fileName, dataItem);
            contentReload(elem, dataItem);
          }
        }
      }
    }, false);
    request.addEventListener("error", (e) => {
      request.abort(e);
    }, false);
    request.send(null);
  }

  function filePath(file) {
    let fileName;
    if (/^(https|http):\/\//i.test(file)) {
      fileName = new URL(file).pathname.replace(/(\.\.|\/)/g, "-");
    } else {
      fileName = file.replace(/(\.\.|\/)/g, "-");
    }
    return fileName;
  }

  function storage() {
    return {
      get(fileName) {
        return window.localStorage.getItem(fileName);
      },
      set(fileName, dataItem) {
        window.localStorage.setItem(fileName, dataItem);
      },
      remove(fileName) {
        window.localStorage.removeItem(fileName);
      }
    }
  }

  function contentType(mimeType, fileName) {
    if (mimeType !== null) {
      return mimeType;
    } else {
      var types = [{format:".jpg",mime:"image/jpg"},{format:".jpeg",mime:"image/jpg"},{format:".png",mime:"image/png"},{format:".webp",mime:"image/webp"},{format:".ico",mime:"image/x-icon"},{format:".svg",mime:"image/svg+xml"},{format:".json",mime:"application/json"},{format:".manifest",mime:"application/manifest+json"},{format:".css",mime:"text/css"},{format:".js",mime:"application/javascript"}];
      for (let i in types) {
        if (types[i].format.match(fileName)) {
          mimeType = types[i].mime;
        }
      }
      return mimeType;
    }
  }

  function json() {
    return {
      input(dataItem) {
        return JSON.stringify(dataItem);
      },
      output(dataItem) {
        var data = JSON.parse(dataItem);
        return {
          text() {
            return data.text;
          },
          type() {
            return data.type;
          }
        }
      }
    }
  }

  function createURL(dataItem) {
    var dataText = json().output(dataItem).text();
    var dataType = json().output(dataItem).type();
    var dataBlob = new Blob([dataText], {type: dataType});
    var blobURL = window.URL.createObjectURL(dataBlob);
    return blobURL;
    setTimeout(() => {
      window.URL.revokeObjectURL(blobURL);
    }, 1000);
  }
})();
