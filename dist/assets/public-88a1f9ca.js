const _public = "";
function qs(selector, parent = document) {
  if (!selector) {
    throw new Error(
      "A selector argument is required for the qs function"
    );
  }
  return parent.querySelector(selector);
}
function qsa(selector, parent = document) {
  if (!selector) {
    throw new Error(
      "A selector argument is required for the qsa function"
    );
  }
  return [...parent.querySelectorAll(selector)];
}
function addSafeEventListenerPlugin(el, event, handler, options) {
  if (el && typeof el.addEventListener === "function") {
    el.addEventListener(event, handler, options);
  } else {
    console.warn(
      "el is not a valid EventTarget or does not support addEventListener"
    );
  }
}
const bcgovBlockThemePluginAccessibility = () => {
  window.requestAnimationFrame(() => {
    if (qs(".actions-accordion-header")) {
      const getSiblings = function(elem) {
        const siblings = [];
        let sibling = elem.parentNode.firstChild;
        while (sibling) {
          if (sibling.nodeType === 1 && sibling !== elem) {
            siblings.push(sibling);
          }
          sibling = sibling.nextSibling;
        }
        return siblings;
      };
      const labelEls = qsa(".labelInjector");
      labelEls.forEach((label) => {
        const siblings = getSiblings(label);
        const ariaLabel = label.getAttribute("data-label");
        siblings.forEach((el) => {
          if (el.classList.contains("wp-block-buttons")) {
            const link = qs(".wp-block-button__link", el);
            link.setAttribute("aria-label", ariaLabel);
          }
        });
        label.remove();
      });
    }
  });
};
if ("complete" === document.readyState) {
  bcgovBlockThemePluginAccessibility();
} else {
  addSafeEventListenerPlugin(
    document,
    "DOMContentLoaded",
    bcgovBlockThemePluginAccessibility()
  );
}
const bcgovBlockThemePluginDefnitions = () => {
  window.requestAnimationFrame(() => {
    const links = document.querySelectorAll("a:not(#postFilterApp a)");
    const definitionLinks = Array.from(links).filter(function(link) {
      return link.href.includes("definitions");
    });
    if (definitionLinks.length > 0) {
      let addEventListeners2 = function(element) {
        element.addEventListener("click", handleClick);
        element.addEventListener("keypress", handleKeypress2);
      }, handleKeypress2 = function(event) {
        if (event.key === "Enter" || event.keycode === 13) {
          handleClick(event);
        }
      }, displayContent2 = function(title, content) {
        const dialogContent = document.querySelector(
          "#dialog .dialog-content"
        );
        dialogContent.innerHTML = '<h2 tabindex="0">' + title + "</h2>" + content;
        showDialog2();
        dialogContent.querySelector("h2").focus();
      }, showDialog2 = function() {
        dialog.showModal();
      };
      var addEventListeners = addEventListeners2, handleKeypress = handleKeypress2, displayContent = displayContent2, showDialog = showDialog2;
      const dialog = document.createElement("dialog");
      dialog.id = "dialog";
      dialog.className = "dialog";
      dialog.setAttribute("aria-modal", true);
      dialog.setAttribute("aria-live", "polite");
      dialog.innerHTML = '<div class="dialog-content"></div><button id="close-dialog" aria-label="closes defintion dialog">Close</button>';
      document.body.appendChild(dialog);
      const closeDialogButton = document.getElementById("close-dialog");
      closeDialogButton.addEventListener("click", function() {
        dialog.close();
      });
      definitionLinks.forEach(function(link) {
        link.classList.add("icon-definition");
        link.setAttribute(
          "aria-label",
          "opens definition dialog for: " + link.text
        );
        addEventListeners2(link);
      });
      async function handleClick(event) {
        if (event.type === "click" || event.type === "keypress" && event.key === "Enter") {
          event.preventDefault();
          const url = this.getAttribute("href");
          const cachedData = window.sessionStorage.getItem(url);
          if (cachedData) {
            const { title, content } = JSON.parse(cachedData);
            displayContent2(title, content);
          } else {
            try {
              const response = await fetch(url);
              const html = await response.text();
              const parser = new window.DOMParser();
              const doc = parser.parseFromString(
                html,
                "text/html"
              );
              const title = doc.querySelector(
                "h1.wp-block-post-title"
              ).innerText;
              const content = doc.querySelector(".entry-content").innerHTML;
              const dataToCache = { title, content };
              window.sessionStorage.setItem(
                url,
                JSON.stringify(dataToCache)
              );
              displayContent2(title, content);
            } catch (error) {
              console.error("Error fetching content:", error);
            }
          }
        }
      }
    }
  });
};
if ("complete" === document.readyState) {
  bcgovBlockThemePluginDefnitions();
} else {
  addSafeEventListenerPlugin(
    document,
    "DOMContentLoaded",
    bcgovBlockThemePluginDefnitions()
  );
}
const bcgovBlockThemePluginDomLoader = () => {
  window.requestAnimationFrame(() => {
    const body = document.querySelector("body");
    body.classList.add("cleanbc-plugin");
    const iconButtons = document.querySelectorAll("a.icon");
    if (iconButtons.length) {
      iconButtons.forEach((button) => {
        if (null === button.getAttribute("href")) {
          button.setAttribute("tabindex", "-1");
          button.style.pointerEvents = "none";
        }
      });
    }
    const iconButtonContainers = document.querySelectorAll(
      ".wp-block-button.is-style-icon"
    );
    if (iconButtonContainers.length) {
      iconButtonContainers.forEach((container) => {
        const containerLink = container.querySelector("a");
        if (null !== containerLink && !container.classList.contains("has-size-large")) {
          containerLink.style.outlineOffset = "1rem";
        }
      });
    }
  });
};
if ("complete" === document.readyState) {
  bcgovBlockThemePluginDomLoader();
} else {
  addSafeEventListenerPlugin(
    document,
    "DOMContentLoaded",
    bcgovBlockThemePluginDomLoader()
  );
}
const bcgovBlockThemePluginDriverCategoryQuery = () => {
  window.requestAnimationFrame(() => {
    const queryLoopDriverCardContainer = document.querySelectorAll(
      ".wp-block-query.vue-card-container"
    );
    if (queryLoopDriverCardContainer.length) {
      fetchDataAndReplaceLinks();
    }
    async function fetchDataAndReplaceLinks(page = 1) {
      var _a;
      try {
        const perPage = 100;
        const cachedData = window.localStorage.getItem("apiData");
        const cachedTimestamp = window.localStorage.getItem("apiDataTimestamp");
        const existingData = cachedData ? JSON.parse(cachedData) : [];
        if (cachedData && cachedTimestamp) {
          try {
            const currentTime = (/* @__PURE__ */ new Date()).getTime();
            const timeDiff = currentTime - parseInt(cachedTimestamp, 10);
            const oneDayInMillis = 24 * 60 * 60 * 1e3;
            if (timeDiff < oneDayInMillis) {
              processCategories(existingData);
              return;
            }
          } catch (cacheError) {
            console.error(
              "Error parsing cached data:",
              cacheError.message
            );
          }
        }
        const response = await fetch(
          `${(_a = window.site) == null ? void 0 : _a.domain}/wp-json/wp/v2/project?_embed&per_page=${perPage}&page=${page}&_category_image=true`
        );
        if (!response.ok) {
          throw new Error(
            `HTTP error! Status: ${response.status}`
          );
        }
        const newData = await response.json();
        const mergedData = existingData.concat(newData);
        window.localStorage.setItem(
          "apiData",
          JSON.stringify(mergedData)
        );
        if (newData.length >= perPage) {
          await fetchDataAndReplaceLinks(page + 1);
        }
        processCategories(mergedData);
        window.localStorage.setItem(
          "apiDataTimestamp",
          (/* @__PURE__ */ new Date()).getTime().toString()
        );
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    }
    function processCategories(data) {
      const categories = [];
      const uniqueCategoryNames = /* @__PURE__ */ new Set();
      data.forEach((item) => {
        var _a;
        const terms = ((_a = item == null ? void 0 : item._embedded) == null ? void 0 : _a["wp:term"]) || [];
        terms.forEach((categoryArray) => {
          categoryArray.forEach((category) => {
            var _a2;
            const categoryName = category == null ? void 0 : category.name;
            const categoryImage = (_a2 = category == null ? void 0 : category.acf) == null ? void 0 : _a2.category_image;
            if (categoryName && categoryName !== "Actions we are taking" && !uniqueCategoryNames.has(categoryName)) {
              uniqueCategoryNames.add(categoryName);
              categories.push({
                name: categoryName,
                acf: {
                  category_image: categoryImage || null
                }
              });
            }
          });
        });
      });
      replaceLinks(categories);
    }
    function replaceLinks(categories) {
      document.querySelectorAll("div.taxonomy-category").forEach((categoryDiv) => {
        const links = categoryDiv.querySelectorAll("a");
        const separators = categoryDiv.querySelectorAll(
          "span.wp-block-post-terms__separator"
        );
        separators.forEach((separator) => separator.remove());
        links.forEach((link) => {
          var _a;
          const categoryName = link.innerText.trim();
          if (categoryName === "Actions we are taking") {
            link.remove();
            return;
          }
          const matchingCategory = categories.find(
            (category) => category.name === categoryName
          );
          if (matchingCategory) {
            const categoryImage = (_a = matchingCategory == null ? void 0 : matchingCategory.acf) == null ? void 0 : _a.category_image;
            if (categoryImage) {
              const imgElement = document.createElement("img");
              imgElement.src = categoryImage;
              imgElement.alt = categoryName;
              imgElement.title = categoryName;
              link.replaceWith(imgElement);
            }
          }
        });
        categoryDiv.style.opacity = "1";
      });
    }
  });
};
if ("complete" === document.readyState) {
  bcgovBlockThemePluginDriverCategoryQuery();
} else {
  addSafeEventListenerPlugin(
    document,
    "DOMContentLoaded",
    bcgovBlockThemePluginDriverCategoryQuery()
  );
}
const bcgovBlockThemePluginLandingBanners = () => {
  window.requestAnimationFrame(() => {
    const isHomeBanner = qsa(".home-cover-banner");
    const isLandingBanner = qsa(".landing-cover-banner");
    if (isHomeBanner.length || isLandingBanner.length) {
      const svgNamespace = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNamespace, "svg");
      const clipElementDefs = document.createElementNS(
        svgNamespace,
        "defs"
      );
      const clipElementClipPath = document.createElementNS(
        svgNamespace,
        "clipPath"
      );
      clipElementClipPath.setAttribute("id", "svgPath");
      const clipElementPath = document.createElementNS(
        svgNamespace,
        "path"
      );
      clipElementPath.setAttribute(
        "d",
        "M0,77.2v-24.7c0,-8.6,6.8,-15.6,15.3,-16l901.5,-36.6c44.3,-1.7,81.5,33.1,83.2,77.5l-1000,-0.2z"
      );
      clipElementClipPath.setAttribute("transform", "scale(1.44)");
      svg.appendChild(clipElementDefs);
      clipElementDefs.appendChild(clipElementClipPath);
      clipElementClipPath.appendChild(clipElementPath);
      svg.setAttribute("xmlns", svgNamespace);
      svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
      svg.setAttribute("version", "1.1");
      svg.setAttribute("width", "100");
      svg.setAttribute("height", "100");
      svg.setAttribute("viewBox", "0 0 100 100");
      svg.setAttribute("preserveAspectRatio", "none");
      svg.style.position = "absolute";
      svg.style.top = "0";
      svg.style.left = "0";
      svg.style.visibility = "visible";
      const body = document.getElementsByTagName("body")[0];
      body.insertAdjacentElement("afterbegin", svg);
    }
  });
};
if ("complete" === document.readyState) {
  bcgovBlockThemePluginLandingBanners();
} else {
  addSafeEventListenerPlugin(
    document,
    "DOMContentLoaded",
    bcgovBlockThemePluginLandingBanners()
  );
}
