/*!
  Copyright (c) 2026 MP-Player (Instant Pages Loading JS)
  Source (https://github.com/mp-player/instant-page/blob/master/dist/1.1/instant-page.js)
  Licensed under MIT (https://github.com/mp-player/instant-page/blob/master/LICENSE)
*/

"use strict";

/**
 * Main class for managing the loading of dynamic content (links & scripts)
 * with caching using localStorage.
 */
class ContentLoader {
  constructor() {
    // Temporarily hide elements before the page loads
    document.documentElement.style.visibility = "hidden";
    // Find the script with the (data-request) attribute
    const contentScript = document.querySelector("script[data-request]");
    if (contentScript && contentScript.dataset.request === "true") {
      if (window.performance) {
        // Make sure it only runs when the page is first loaded
        const navType = performance.getEntriesByType("navigation")[0]?.type;
        if (navType === "navigate" || navType === "reload") {
          this.getElementAll("link[data-href]");
          this.getElementAll("script[data-src]");
        }
      }
    } else {
      console.error("[Null] Script for data request not found.");
    }
  }

  /**
   * Select all target elements (link/script) based on the selector.
   * @param {string} target - element selector
   */
  getElementAll(target) {
    const elems = document.querySelectorAll(target);
    elems.forEach((elem) => {
      if (!elem) return;
      const link = elem.dataset.href;
      const script = elem.dataset.src;
      if (link) this.contentCreate(elem, link);
      if (script) this.contentCreate(elem, script);
    });
  }

  /**
   * Create content from the file, check the cache in localStorage.
   * @param {HTMLElement} elem - target element
   * @param {string} file - path/URL file
   */
  contentCreate(elem, file) {
    const fileName = this.filePath(file);
    const dataItem = this.storage.get(fileName);
    if (!dataItem) {
      // If it's not yet in the cache, send a new request
      this.requestFiles(elem, file, fileName, true);
    } else {
      // If it's in the cache, reload the content
      this.contentReload(elem, dataItem);
      // After 1 second, check if there are any files that have been updated
      setTimeout(() => {
        this.requestFiles(elem, file, fileName, false);
      }, 1000);
    }
  }

  // Request files from the server except for image files
  requestFiles(elem, file, fileName, dataRequest) {
    if (!/\.(jpg|jpeg|png|webp|ico|svg)$/i.test(fileName)) {
      this.contentParser(elem, file, fileName, dataRequest);
    }
  }

  // Parse content from the file using XMLHttpRequest
  contentParser(elem, file, fileName, dataRequest) {
    const request = new XMLHttpRequest();
    request.open("GET", file, true);
    request.addEventListener("readystatechange", (e) => {
      if (e.target.readyState === 4) {
        if (e.target.status === 200 || e.target.status === 0) {
          const dataText = e.target.responseText;
          const dataType = this.contentType(e.target.getResponseHeader("Content-Type"), fileName);
          const dataItem = this.jsonInput({text: dataText, type: dataType});
          if (!dataRequest) {
            // If it's not the initial request, check if there are any content changes
            const currentText = this.jsonOutput(this.storage.get(fileName)).text();
            if (dataText !== currentText) {
              this.storage.remove(fileName);
              this.storage.set(fileName, dataItem);
              setTimeout(() => {
                window.location.reload(true);
              }, 1000);
            }
          } else {
            // Caching and loading content
            this.storage.set(fileName, dataItem);
            this.contentReload(elem, dataItem);
          }
        }
      }
    });
    request.addEventListener("error", (e) => {
      request.abort();
      console.error("Request error:", e);
    });
    request.send(null);
  }

  // Reload content from the cache to the target element
  contentReload(elem, dataItem) {
    const file = this.createURL(dataItem);
    if (elem instanceof HTMLLinkElement) {
      elem.href = file;
    } else if (elem instanceof HTMLScriptElement) {
      elem.src = file;
    }
    setTimeout(() => {
      document.documentElement.style.visibility = "visible";
    }, 1000);
  }

  // Normalize file names to safely store them in localStorage
  filePath(file) {
    if (/^(https|http):\/\//i.test(file)) {
      return new URL(file).pathname.replace(/(\.\.|\/)/g, "-");
    }
    return file.replace(/(\.\.|\/)/g, "-");
  }

  // Wrapper for localStorage
  storage = {
    set: (fileName, dataItem) => {
      localStorage.setItem(fileName, dataItem);
      return true;
    },
    get: (fileName) => {
      const dataItem = localStorage.getItem(fileName);
      return dataItem || false;
    },
    remove: (fileName) => {
      localStorage.removeItem(fileName);
      return true;
    },
  };

  // Determine the MIME type based on the header or file extension
  contentType(mimeType, fileName) {
    if (mimeType) return mimeType;
    const types = [
      {format: ".css", mime: "text/css"},
      {format: ".js", mime: "application/javascript"},
    ];
    for (const type of types) {
      if (fileName.endsWith(type.format)) return type.mime;
    }
    return "text/plain";
  }

  // JSON helper for input (stringify)
  jsonInput(dataItem) {
    try {
      return JSON.stringify(dataItem);
    } catch (error) {
      console.error(error);
      return "{}";
    }
  }

  // JSON helper for output (parse)
  jsonOutput(dataItem) {
    try {
      const data = JSON.parse(dataItem);
      return {text: () => data.text || "", type: () => data.type || null};
    } catch (error) {
      console.error(error);
      return {text: () => "", type: () => null};
    }
  }

  // Create a Blob URL from cached data
  createURL(dataItem) {
    const dataText = this.jsonOutput(dataItem).text();
    const dataType = this.jsonOutput(dataItem).type();
    const dataBlob = new Blob([dataText], {type: dataType});
    const blobURL = URL.createObjectURL(dataBlob);
    // Revoke the URL after 1 second to avoid memory leaks
    setTimeout(() => {
      URL.revokeObjectURL(blobURL);
    }, 1000);
    return blobURL;
  }
}

// Initialization (class) when the page loads
new ContentLoader();
