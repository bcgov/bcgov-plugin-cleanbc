const _public = "";
const bcgovBlockThemePluginAccessibility = () => {
  window.requestAnimationFrame(() => {
    const isSameOrigin = (url) => {
      try {
        return new URL(url, window.location.href).origin === window.location.origin;
      } catch {
        return false;
      }
    };
    const hideFromSRContainers = document.querySelectorAll(".hide-from-sr");
    if (hideFromSRContainers.length) {
      hideFromSRContainers.forEach((el) => el.setAttribute("aria-hidden", "true"));
    }
    const breadcrumbContainer = document.querySelector(".aioseo-breadcrumbs");
    if (breadcrumbContainer) {
      breadcrumbContainer.setAttribute("role", "navigation");
      breadcrumbContainer.setAttribute("aria-label", "Breadcrumb");
      const breadcrumbLinks = breadcrumbContainer.querySelectorAll(".aioseo-breadcrumb a");
      if (breadcrumbLinks.length > 0) {
        const lastBreadcrumb = breadcrumbContainer.querySelector(".aioseo-breadcrumb:last-of-type");
        if (lastBreadcrumb && !lastBreadcrumb.querySelector("a")) {
          lastBreadcrumb.setAttribute("aria-current", "page");
        }
      }
      const separators = breadcrumbContainer.querySelectorAll(".aioseo-breadcrumb-separator");
      separators.forEach((separator) => separator.setAttribute("aria-hidden", "true"));
    }
    const pdfLinks = document.querySelectorAll('a[href$=".pdf" i], a[title*="pdf" i], a[class*="pdf" i]');
    if (pdfLinks) {
      setTimeout(() => {
        pdfLinks.forEach((link) => {
          const url = link.href;
          const label = link.textContent.toUpperCase();
          if (label.includes("[PDF") || label.includes("PDF]") || label.includes("KB]") || label.includes("MB]"))
            return;
          if (isSameOrigin(url)) {
            fetch(url, { method: "HEAD" }).then((response) => {
              const size = response.headers.get("Content-Length");
              appendSizeLabel(link, size);
            });
          }
          if (!isSameOrigin(url)) {
            fetch(`${window.site.domain}/index.php?pdf_size_proxy=1&url=${encodeURIComponent(url)}`, {
              headers: {
                "X-WP-Nonce": window.pluginCleanbc.nonce
              }
            }).then((res) => res.text()).then((text) => {
              try {
                const data = JSON.parse(text);
                appendSizeLabel(link, data.size);
              } catch (e) {
                console.error("JSON parse error:", e);
              }
            }).catch((error) => {
              console.error("Proxy fetch failed:", error);
            });
          }
        });
      }, 500);
    }
    const appendSizeLabel = (link, size) => {
      let labelText = " [PDF]";
      if (!size || size <= 0 || void 0 === size) {
        labelText = " [PDF unknown size]";
      } else {
        const kb = size / 1024;
        const mb = kb / 1024;
        const sizeLabel = mb >= 1 ? `${mb.toFixed(1)}MB` : `${kb.toFixed(0)}KB`;
        labelText = ` [PDF ${sizeLabel}]`;
      }
      const pdfSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      pdfSvg.setAttribute("class", "external-link-icon");
      pdfSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      pdfSvg.setAttribute("style", "width: 20px; height: 20px; top: 4px; position: relative;");
      pdfSvg.setAttribute("viewBox", "0 0 384 512");
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M320 480L64 480c-17.7 0-32-14.3-32-32L32 64c0-17.7 14.3-32 32-32l128 0 0 112c0 26.5 21.5 48 48 48l112 0 0 256c0 17.7-14.3 32-32 32zM240 160c-8.8 0-16-7.2-16-16l0-111.5c2.8 .7 5.4 2.1 7.4 4.2L347.3 152.6c2.1 2.1 3.5 4.6 4.2 7.4L240 160zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-284.1c0-12.7-5.1-24.9-14.1-33.9L254.1 14.1c-9-9-21.2-14.1-33.9-14.1L64 0zM208 240c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 121.4-52.7-52.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6l80 80c6.2 6.2 16.4 6.2 22.6 0l80-80c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L208 361.4 208 240z");
      pdfSvg.appendChild(path);
      const span = link.querySelector("span.last-word.no-wrap");
      if (span) {
        const existingSvg = span.querySelector("svg");
        const labelNode = document.createTextNode(labelText);
        if (existingSvg) {
          span.insertBefore(labelNode, existingSvg);
          existingSvg.replaceWith(pdfSvg);
        } else {
          span.appendChild(labelNode);
          span.appendChild(pdfSvg);
        }
      } else {
        link.classList.add("external");
        link.appendChild(document.createTextNode(labelText));
        link.appendChild(pdfSvg);
      }
    };
    const actionsAccordionHeader = document.querySelector(".actions-accordion-header");
    if (null !== actionsAccordionHeader) {
      const getSiblings = (elem) => {
        const siblings = [];
        let sibling = elem.parentNode.firstChild;
        while (sibling) {
          if (1 === sibling.nodeType && sibling !== elem) {
            siblings.push(sibling);
          }
          if (null !== sibling.nextSibling) {
            sibling = sibling.nextSibling;
          }
        }
        return siblings;
      };
      const labelEls = document.querySelectorAll(".labelInjector");
      labelEls.forEach((label) => {
        const siblings = getSiblings(label);
        const ariaLabel = label.getAttribute("data-label");
        siblings.forEach((el) => {
          if (el.classList.contains("wp-block-buttons")) {
            const link = el.querySelector(".wp-block-button__link");
            link.setAttribute("aria-label", ariaLabel);
          }
        });
        label.remove();
      });
    }
    const breadcrumbNav = document.querySelector("#breadcrumb-nav");
    if (null !== breadcrumbNav) {
      breadcrumbNav.setAttribute("role", "navigation");
      breadcrumbNav.setAttribute("aria-label", "Breadcrumb");
      const aioseoBreadcrumb = breadcrumbNav.querySelector(".aioseo-breadcrumbs");
      const aioseoBreadcrumbItems = aioseoBreadcrumb.querySelectorAll(".aioseo-breadcrumb");
      const aioseoBreadcrumbSeparators = aioseoBreadcrumb.querySelectorAll(".aioseo-breadcrumb-separator");
      if (null !== aioseoBreadcrumb && null !== aioseoBreadcrumbItems) {
        aioseoBreadcrumb.setAttribute("role", "list");
        aioseoBreadcrumbItems.forEach((item, index) => {
          item.setAttribute("role", "listitem");
          if (index === aioseoBreadcrumbItems.length - 1) {
            item.setAttribute("role", "link");
            item.setAttribute("aria-current", "page");
          }
        });
      }
      if (null !== aioseoBreadcrumbSeparators) {
        aioseoBreadcrumbSeparators.forEach((separator) => {
          separator.setAttribute("aria-hidden", "true");
        });
      }
    }
    const detailsWithNumbersContainers = document.querySelectorAll(".detail-with-number-container");
    if (detailsWithNumbersContainers.length > 0) {
      const gridGroupDiv = document.createElement("div");
      gridGroupDiv.setAttribute("role", "grid");
      gridGroupDiv.setAttribute("data-wrap-cols", true);
      gridGroupDiv.setAttribute("data-wrap-rows", true);
      const firstDetailContainer = detailsWithNumbersContainers[0];
      firstDetailContainer.parentNode.insertBefore(gridGroupDiv, firstDetailContainer);
      detailsWithNumbersContainers.forEach((detailContainer) => {
        gridGroupDiv.appendChild(detailContainer);
      });
      let determinedHeadingLevel = null;
      detailsWithNumbersContainers.forEach((detailContainer, index) => {
        detailContainer.setAttribute("role", "row");
        const headlineCell = detailContainer.querySelector(".wp-block-column:nth-of-type(1)");
        const detailCell = detailContainer.querySelector(".wp-block-column:nth-of-type(2)");
        const headlines = headlineCell ? headlineCell.querySelectorAll(".wp-block-heading") : [];
        const finalDetailCell = headlines.length > 0 && detailCell ? detailCell : headlineCell;
        if (finalDetailCell) {
          finalDetailCell.setAttribute("role", "gridcell");
          finalDetailCell.setAttribute("tabindex", "0");
          if (headlineCell) {
            const headlines2 = headlineCell.querySelectorAll(".wp-block-heading");
            let concatenatedHeadlineText = "";
            headlines2.forEach((headline) => {
              concatenatedHeadlineText += headline.innerText + " ";
              headline.setAttribute("aria-hidden", true);
            });
            if (concatenatedHeadlineText.trim()) {
              if (0 === index) {
                let nearestHeading = null;
                let currentElement = detailContainer.previousElementSibling;
                while (currentElement && !nearestHeading) {
                  if (currentElement.classList.contains("wp-block-heading")) {
                    nearestHeading = currentElement;
                    break;
                  }
                  const headings = currentElement.querySelectorAll(".wp-block-heading");
                  if (headings.length > 0) {
                    nearestHeading = headings[headings.length - 1];
                    break;
                  }
                  currentElement = currentElement.previousElementSibling;
                }
                let parentElement = detailContainer.parentElement;
                while (!nearestHeading && parentElement) {
                  currentElement = parentElement.previousElementSibling;
                  while (currentElement) {
                    if (currentElement.classList.contains("wp-block-heading")) {
                      nearestHeading = currentElement;
                      break;
                    }
                    const headings = currentElement.querySelectorAll(".wp-block-heading");
                    if (headings.length > 0) {
                      nearestHeading = headings[headings.length - 1];
                      break;
                    }
                    currentElement = currentElement.previousElementSibling;
                  }
                  parentElement = parentElement.parentElement;
                }
                if (nearestHeading) {
                  const nearestHeadingTagName = nearestHeading.tagName.toLowerCase();
                  determinedHeadingLevel = parseInt(nearestHeadingTagName.replace("h", "")) + 1;
                  if (determinedHeadingLevel > 6)
                    determinedHeadingLevel = 6;
                } else {
                  determinedHeadingLevel = 2;
                }
              }
              const newHeading = document.createElement(`h${determinedHeadingLevel}`);
              newHeading.innerText = concatenatedHeadlineText.trim();
              newHeading.classList.add("sr-only");
              finalDetailCell.insertBefore(newHeading, finalDetailCell.firstChild);
            }
          }
        }
        if (0 === index) {
          let nearestHeading = null;
          let currentElement = detailContainer.previousElementSibling;
          while (currentElement && !nearestHeading) {
            if (currentElement.classList.contains("wp-block-heading")) {
              nearestHeading = currentElement;
              break;
            }
            const headings = currentElement.querySelectorAll(".wp-block-heading");
            if (headings.length > 0) {
              nearestHeading = headings[headings.length - 1];
              break;
            }
            currentElement = currentElement.previousElementSibling;
          }
          let parentElement = detailContainer.parentElement;
          while (!nearestHeading && parentElement) {
            currentElement = parentElement.previousElementSibling;
            while (currentElement) {
              if (currentElement.classList.contains("wp-block-heading")) {
                nearestHeading = currentElement;
                break;
              }
              const headings = currentElement.querySelectorAll(".wp-block-heading");
              if (headings.length > 0) {
                nearestHeading = headings[headings.length - 1];
                break;
              }
              currentElement = currentElement.previousElementSibling;
            }
            parentElement = parentElement.parentElement;
          }
          if (nearestHeading) {
            let headingId = nearestHeading.getAttribute("id");
            if (!headingId) {
              headingId = `grid-${Date.now()}`;
              nearestHeading.setAttribute("id", headingId);
            }
            gridGroupDiv.setAttribute("aria-labelledby", headingId);
          }
        }
      });
      gridGroupDiv.addEventListener("keydown", (event) => {
        const activeElement = document.activeElement;
        if ("gridcell" === activeElement.getAttribute("role")) {
          const row = activeElement.parentElement;
          const rows = Array.from(gridGroupDiv.querySelectorAll('[role="row"]'));
          const cells = Array.from(row.querySelectorAll('[role="gridcell"]'));
          const rowIndex = rows.indexOf(row);
          const cellIndex = cells.indexOf(activeElement);
          switch (event.key) {
            case "ArrowRight":
            case "ArrowDown":
              if (rowIndex < rows.length - 1) {
                const nextRowCells = rows[rowIndex + 1].querySelectorAll('[role="gridcell"]');
                nextRowCells[cellIndex].focus();
              }
              break;
            case "ArrowLeft":
            case "ArrowUp":
              if (rowIndex > 0) {
                const prevRowCells = rows[rowIndex - 1].querySelectorAll('[role="gridcell"]');
                prevRowCells[cellIndex].focus();
              }
              break;
            case "PageDown":
              if (rowIndex < rows.length - 1) {
                const nextRowIndex = Math.min(rowIndex + 3, rows.length - 1);
                const nextRowCells = rows[nextRowIndex].querySelectorAll('[role="gridcell"]');
                nextRowCells[cellIndex].focus();
              }
              event.preventDefault();
              break;
            case "PageUp":
              if (rowIndex > 0) {
                const prevRowIndex = Math.max(rowIndex - 3, 0);
                const prevRowCells = rows[prevRowIndex].querySelectorAll('[role="gridcell"]');
                prevRowCells[cellIndex].focus();
              }
              event.preventDefault();
              break;
            case "Home":
              rows[0].querySelector('[role="gridcell"]').focus();
              event.preventDefault();
              break;
            case "End": {
              const lastRow = rows[rows.length - 1];
              lastRow.querySelector('[role="gridcell"]:last-child').focus();
              event.preventDefault();
              break;
            }
          }
        }
      });
    }
    const backToTop = document.querySelector(".back-to-top");
    backToTop.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      const checkIfScrolledToTop = setInterval(() => {
        if (0 === window.scrollY) {
          clearInterval(checkIfScrolledToTop);
          document.body.setAttribute("tabindex", "-1");
          document.body.focus({ preventScroll: true });
        }
      }, 50);
    });
  });
};
if ("complete" === document.readyState) {
  bcgovBlockThemePluginAccessibility();
} else {
  document.addEventListener(
    "DOMContentLoaded",
    bcgovBlockThemePluginAccessibility
  );
}
const bcgovBlockThemePluginDefnitions = () => {
  window.requestAnimationFrame(() => {
    const links = document.querySelectorAll("a:not(#postFilterApp a)");
    const definitionLinks = Array.from(links).filter((link) => {
      return link.href.includes("definitions");
    });
    const addEventListeners = (element) => {
      element.addEventListener("click", handleClick);
      element.addEventListener("keypress", handleKeypress);
    };
    const handleClick = async (event) => {
      if ("click" === event.type || "keypress" === event.type && "Enter" === event.key) {
        event.preventDefault();
        const url = event.currentTarget.getAttribute("href");
        const cachedData = window.sessionStorage.getItem(url);
        if (cachedData) {
          const { title, content } = JSON.parse(cachedData);
          displayContent(title, content);
        } else {
          try {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const html = await response.text();
            const parser = new window.DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const titleElement = doc.querySelector(".wp-block-post-title");
            const contentElement = doc.querySelector(".entry-content");
            if (!titleElement || !contentElement) {
              throw new Error(
                "Required content not found in the fetched HTML."
              );
            }
            const title = titleElement.innerText;
            const content = contentElement.innerHTML;
            const dataToCache = { title, content };
            window.sessionStorage.setItem(url, JSON.stringify(dataToCache));
            displayContent(title, content);
          } catch (error) {
            console.error("Error fetching content:", error);
          }
        }
      }
    };
    const handleKeypress = (event) => {
      if ("Enter" === event.key || 13 === event.keycode) {
        handleClick(event);
      }
    };
    const displayContent = (title, content) => {
      const dialogContent = document.querySelector(
        "#dialog .dialog-content"
      );
      dialogContent.innerHTML = '<h2 tabindex="0">' + title + "</h2>" + content;
      showDialog();
      dialogContent.querySelector("h2").focus();
    };
    const showDialog = () => {
      const dialog = document.getElementById("dialog");
      dialog.showModal();
    };
    if (definitionLinks.length > 0) {
      const dialog = document.createElement("dialog");
      dialog.id = "dialog";
      dialog.className = "dialog";
      dialog.setAttribute("aria-modal", true);
      dialog.setAttribute("aria-live", "polite");
      dialog.innerHTML = '<div class="dialog-content"></div><button id="close-dialog" aria-label="closes defintion dialog">Close</button>';
      document.body.appendChild(dialog);
      const closeDialogButton = document.getElementById("close-dialog");
      closeDialogButton.addEventListener("click", () => {
        dialog.close();
      });
      definitionLinks.forEach((link) => {
        link.classList.add("icon-definition");
        link.setAttribute(
          "aria-label",
          "opens definition dialog for this concept"
        );
        const linkText = link.textContent;
        if (linkText && linkText.trim().length > 0) {
          const words = linkText.trim().split(" ");
          const lastWord = words.pop();
          const restOfText = words.join(" ");
          const span = document.createElement("span");
          span.classList.add("last-word", "no-wrap");
          span.textContent = lastWord;
          link.innerHTML = `${restOfText} `;
          link.appendChild(span);
        }
        addEventListeners(link);
      });
    }
  });
};
if ("complete" === document.readyState) {
  bcgovBlockThemePluginDefnitions();
} else {
  document.addEventListener(
    "DOMContentLoaded",
    bcgovBlockThemePluginDefnitions
  );
}
const bcgovBlockThemePluginDomLoader = () => {
  window.requestAnimationFrame(() => {
    const body = document.querySelector("body");
    const siteHeader = document.querySelector(".bcgov-site-header");
    if (siteHeader) {
      setTimeout(() => {
        document.documentElement.style.scrollPadding = `calc(${window.getComputedStyle(siteHeader).getPropertyValue("height")} + 30px)`;
      }, 500);
    }
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
    const glossaryList = document.querySelector(".glossary-results ul");
    if (glossaryList) {
      const items = Array.from(glossaryList.querySelectorAll("li"));
      let currentLetter = "";
      items.forEach((item) => {
        const titleElement = item.querySelector("h3");
        if (titleElement) {
          const titleText = titleElement.textContent.trim();
          const firstLetter = titleText.charAt(0).toUpperCase();
          if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            const h2 = document.createElement("h2");
            h2.textContent = currentLetter;
            const h2Wrapper = document.createElement("li");
            h2Wrapper.classList.add("glossary-letter-headline");
            h2Wrapper.appendChild(h2);
            glossaryList.insertBefore(h2Wrapper, item);
          }
        }
      });
    }
    const searchFieldContainer = document.querySelector("#search-field-container");
    const toggleSearchBtn = document.querySelector(".toggle-search-btn a");
    if (searchFieldContainer && toggleSearchBtn) {
      searchFieldContainer.addEventListener("keydown", (event) => {
        if ("Escape" === event.code) {
          searchFieldContainer.blur();
          toggleSearchBtn.focus();
          searchFieldContainer.classList.add("hidden");
        }
      });
    }
    const processExternalLinks = () => {
      const observer = new MutationObserver((mutationsList, observer2) => {
        const externalLinks = document.querySelectorAll("a.external:not(#postFilterApp a, #pqeasResults a, #contractorFilterApp a, .vue-card-content a)");
        if (externalLinks.length > 0) {
          observer2.disconnect();
          externalLinks.forEach((link) => {
            if (link.href.startsWith("mailto:") || link.href.startsWith("tel:")) {
              if (link.href.startsWith("mailto:")) {
                const email = link.href.slice(7);
                link.innerHTML = link.innerHTML.replace(email, email.replace(/@/g, "&#8203;@").replace(/\./g, "&#8203;."));
              }
              return;
            }
            const svg = link.querySelector("svg");
            if (svg) {
              const linkText = link.textContent;
              if (linkText && linkText.trim().length > 0) {
                const words = linkText.trim().split(" ");
                const lastWord = words.pop();
                const restOfText = words.join(" ");
                const span = document.createElement("span");
                span.classList.add("last-word", "no-wrap");
                span.textContent = lastWord;
                span.appendChild(svg);
                link.innerHTML = `${restOfText} `;
                link.appendChild(span);
              }
            }
          });
        }
      });
      observer.observe(document.body, {
        childList: true,
        // Watch for added/removed child nodes.
        subtree: true,
        // Watch all descendants.
        attributes: true
        // Watch for attribute changes.
      });
      setTimeout(() => observer.disconnect(), 1e4);
    };
    processExternalLinks();
  });
};
if ("complete" === document.readyState) {
  bcgovBlockThemePluginDomLoader();
} else {
  document.addEventListener(
    "DOMContentLoaded",
    bcgovBlockThemePluginDomLoader
  );
}
const bcgovBlockThemePluginDriverCategoryQuery = () => {
  window.requestAnimationFrame(() => {
    const queryLoopDriverCardContainer = document.querySelectorAll(
      ".wp-block-query.vue-card-container"
    );
    const fetchDataAndReplaceLinks = async (page = 1) => {
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
          // `${window.site?.domain}/wp-json/wp/v2/project?_embed&per_page=${perPage}&page=${page}&_category_image=true`
          `${(_a = window.site) == null ? void 0 : _a.domain}/wp-json/custom/v1/actions`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
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
    };
    const processCategories = (data) => {
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
    };
    const replaceLinks = (categories) => {
      document.querySelectorAll("div.taxonomy-category").forEach((categoryDiv) => {
        const links = categoryDiv.querySelectorAll("a");
        const separators = categoryDiv.querySelectorAll(
          "span.wp-block-post-terms__separator"
        );
        separators.forEach((separator) => separator.remove());
        links.forEach((link) => {
          var _a;
          const categoryName = link.innerText.trim();
          if ("Actions we are taking" === categoryName) {
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
    };
    if (queryLoopDriverCardContainer.length) {
      fetchDataAndReplaceLinks();
    }
  });
};
if ("complete" === document.readyState) {
  bcgovBlockThemePluginDriverCategoryQuery();
} else {
  document.addEventListener(
    "DOMContentLoaded",
    bcgovBlockThemePluginDriverCategoryQuery
  );
}
const bcgovBlockThemePluginLandingBanners = () => {
  window.requestAnimationFrame(() => {
    const isHomeBanner = document.querySelectorAll(".home-cover-banner");
    const isLandingBanner = document.querySelectorAll(".landing-cover-banner");
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
  document.addEventListener(
    "DOMContentLoaded",
    bcgovBlockThemePluginLandingBanners
  );
}
const domNavReady = () => {
  window.requestAnimationFrame(() => {
    const doBoundsCheck = (targetEl) => {
      const container = targetEl;
      const childContainer = container.querySelector("ul");
      const subChildContainer = container.querySelector(
        ".wp-block-navigation__submenu-container .wp-block-navigation__submenu-container"
      );
      let bounding = null;
      if (childContainer) {
        bounding = childContainer.getBoundingClientRect();
      }
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;
      if (bounding) {
        if (subChildContainer) {
          subChildContainer.style.top = "0.85rem";
        }
        if (bounding.right > windowWidth && childContainer) {
          childContainer.classList.add("is-offscreen");
          childContainer.style.left = `calc(4px - ${childContainer.parentNode.parentNode.offsetWidth}px)`;
          childContainer.style.right = "auto";
          childContainer.style.position = "absolute";
        }
      }
    };
    const navContainer = document.querySelector("header nav");
    const topLevelMenuItems = document.querySelectorAll(
      ".wp-block-navigation__container > .wp-block-navigation-item > .wp-block-navigation-item__content"
    );
    const topLevelToggles = document.querySelectorAll(
      ".wp-block-navigation__container > .wp-block-navigation-submenu > .wp-block-navigation-submenu__toggle"
    );
    const submenuContainers = document.querySelectorAll(".wp-block-navigation-submenu");
    const nestedToggles = document.querySelectorAll(
      "ul ul .wp-block-navigation-submenu__toggle"
    );
    if (navContainer) {
      const menuULs = navContainer.querySelectorAll("ul");
      menuULs.forEach((el) => {
        const formattedName = el.parentElement.querySelector("a").text.trim().toLowerCase().replace(/\s+/g, "_");
        el.setAttribute("id", `id_${formattedName}_menu`);
        if ("NAV" === el.parentElement.tagName) {
          el.setAttribute("aria-label", "Main menu");
          el.setAttribute("role", "menubar");
        } else {
          el.setAttribute("role", "menu");
          el.setAttribute("tabindex", -1);
          el.setAttribute("aria-label", el.parentElement.querySelector("a").text);
        }
      });
      const menuLIs = navContainer.querySelectorAll("li");
      menuLIs.forEach((el) => {
        if (el.querySelector("ul")) {
          el.setAttribute("role", "group");
        } else {
          el.setAttribute("role", "none");
        }
      });
      const menuLinks = navContainer.querySelectorAll("a");
      menuLinks.forEach((el, index) => {
        el.setAttribute("tabindex", -1);
        if (0 === index) {
          el.setAttribute("tabindex", 0);
        }
        el.setAttribute("role", "menuitem");
      });
      const menuButtons = navContainer.querySelectorAll("button");
      menuButtons.forEach((el) => {
        const formattedName = el.parentElement.querySelector("a").text.trim().toLowerCase().replace(/\s+/g, "_");
        el.setAttribute("role", "menuitem");
        el.setAttribute("aria-controls", `id_${formattedName}_menu`);
        el.setAttribute("tabindex", -1);
        if (el.parentElement.querySelector("ul")) {
          el.setAttribute("aria-haspopup", "true");
        }
      });
    }
    if (topLevelToggles && topLevelMenuItems) {
      topLevelMenuItems.forEach((menuItem) => {
        menuItem.addEventListener("focus", (event) => {
          topLevelToggles.forEach((other) => {
            if (other.getAttribute("aria-expanded")) {
              other.setAttribute("aria-expanded", "false");
            }
          });
          if (nestedToggles) {
            nestedToggles.forEach((sub) => {
              sub.setAttribute("aria-expanded", "false");
            });
          }
          event.stopImmediatePropagation();
        }, true);
      });
      topLevelToggles.forEach((toggle) => {
        toggle.addEventListener("click", (event) => {
          event.stopImmediatePropagation();
          event.preventDefault();
          const wasOpen = "true" === toggle.getAttribute("aria-expanded");
          if (!wasOpen) {
            toggle.setAttribute("aria-expanded", "true");
          } else {
            toggle.setAttribute("aria-expanded", "false");
          }
        }, true);
        toggle.addEventListener("focus", (event) => {
          topLevelToggles.forEach((other) => {
            if (other.getAttribute("aria-expanded")) {
              other.setAttribute("aria-expanded", "false");
            }
          });
          if (nestedToggles) {
            nestedToggles.forEach((sub) => {
              sub.setAttribute("aria-expanded", "false");
            });
          }
          event.stopImmediatePropagation();
        }, true);
      });
    }
    if (submenuContainers) {
      submenuContainers.forEach((submenu) => {
        submenu.addEventListener(
          "focusout",
          (event) => {
            const navContainerFocus = document.querySelector("header nav");
            if (navContainerFocus && !navContainerFocus.contains(event.relatedTarget)) {
              if (topLevelToggles) {
                topLevelToggles.forEach((toggle) => {
                  toggle.setAttribute("aria-expanded", "false");
                });
              }
              if (nestedToggles) {
                nestedToggles.forEach((toggle) => {
                  toggle.setAttribute("aria-expanded", "false");
                });
              }
            }
            event.stopImmediatePropagation();
          },
          true
        );
      });
    }
    if (nestedToggles) {
      nestedToggles.forEach((toggle) => {
        toggle.addEventListener(
          "click",
          (event) => {
            let target = event.target;
            if (target.tagName !== "LI") {
              target = target.closest("li");
            }
            doBoundsCheck(target);
            event.stopImmediatePropagation();
            event.preventDefault();
            const wasOpen = "true" === toggle.getAttribute("aria-expanded");
            nestedToggles.forEach((other) => {
              other.setAttribute("aria-expanded", "false");
            });
            if (!wasOpen) {
              toggle.setAttribute("aria-expanded", "true");
            }
          },
          true
        );
        toggle.addEventListener(
          "focus",
          () => {
            nestedToggles.forEach((other) => {
              other.setAttribute("aria-expanded", "false");
            });
          },
          true
        );
      });
    }
    const focusMenuItem = (items, index) => {
      if (index < 0) {
        index = items.length - 1;
      } else if (index >= items.length) {
        index = 0;
      }
      items[index].focus();
    };
    const openSubmenu = (menuItemEl) => {
      var _a;
      const submenu = menuItemEl.closest(".wp-block-navigation-submenu");
      const toggle = (_a = menuItemEl.closest(".wp-block-navigation-submenu")) == null ? void 0 : _a.querySelector(".wp-block-navigation-submenu__toggle");
      if (toggle) {
        toggle.setAttribute("aria-expanded", "true");
        const submenuItems = toggle.closest(".wp-block-navigation-submenu").querySelectorAll('button[role="menuitem"]');
        if (submenuItems.length) {
          submenuItems[0].focus();
          doBoundsCheck(submenu);
        }
      }
    };
    const closeSubmenu = (menuItemEl, moveFocusToParent = false) => {
      const submenu = menuItemEl.closest(".wp-block-navigation-submenu");
      if (!submenu)
        return;
      const openToggles = submenu.querySelectorAll(
        '.wp-block-navigation-submenu__toggle[aria-expanded="true"]'
      );
      openToggles.forEach((toggle) => {
        toggle.setAttribute("aria-expanded", "false");
      });
      if (moveFocusToParent) {
        const parentLi = submenu.closest("li");
        if (parentLi) {
          const parentToggle = parentLi.querySelector('button[role="menuitem"]');
          const parentAnchor = parentLi.querySelector('a[role="menuitem"]');
          if (parentToggle) {
            parentToggle.focus();
          }
          if (parentAnchor) {
            parentAnchor.focus();
          }
        }
      }
    };
    const focusFirstElementOfMenu = (currentItem) => {
      const parentUl = currentItem.closest("ul");
      if (!parentUl)
        return;
      const firstLi = parentUl.querySelector("li");
      if (!firstLi)
        return;
      const firstMenuItem = firstLi.querySelector('[role="menuitem"]');
      if (firstMenuItem) {
        firstMenuItem.focus();
      }
    };
    const focusFirstElementOfSiblingMenu = (currentItem, event) => {
      event.preventDefault();
      const parentLi = currentItem.closest("li");
      if (!parentLi)
        return;
      let siblingUl = currentItem.nextElementSibling;
      while (siblingUl && !siblingUl.classList.contains("wp-block-navigation__submenu-container")) {
        siblingUl = siblingUl.nextElementSibling;
      }
      if (!siblingUl) {
        return;
      }
      const firstMenuItem = siblingUl.querySelector('[role="menuitem"]');
      if (firstMenuItem) {
        firstMenuItem.focus();
      }
    };
    const focusLastElementOfMenu = (currentItem) => {
      const parentUl = currentItem.closest("ul");
      if (!parentUl)
        return;
      const directLis = Array.from(parentUl.children).filter(
        (el) => "li" === el.tagName.toLowerCase()
      );
      if (!directLis.length)
        return;
      const lastLi = directLis[directLis.length - 1];
      const directMenuItems = Array.from(lastLi.children).filter(
        (el) => "menuitem" === el.getAttribute("role")
      );
      if (!directMenuItems.length)
        return;
      const lastMenuItem = directMenuItems[directMenuItems.length - 1];
      lastMenuItem.focus();
    };
    const moveDownSiblingMenu = (currentItem) => {
      const parentLi = currentItem.closest("li");
      if (!parentLi)
        return;
      if ("a" === currentItem.localName) {
        const sameLiButton = parentLi.querySelector('button[role="menuitem"]');
        if (sameLiButton && sameLiButton !== currentItem) {
          sameLiButton.focus();
          return;
        }
      }
      let siblingLi = parentLi.nextElementSibling;
      while (siblingLi && siblingLi.tagName.toLowerCase() !== "li") {
        siblingLi = siblingLi.nextElementSibling;
      }
      if (!siblingLi)
        return;
      const siblingAnchor = siblingLi.querySelector('a[role="menuitem"]');
      if (siblingAnchor) {
        siblingAnchor.focus();
      }
    };
    const moveUpSiblingMenu = (currentItem) => {
      const parentLi = currentItem.closest("li");
      if (!parentLi)
        return;
      let siblingLi = parentLi.previousElementSibling;
      while (siblingLi && siblingLi.tagName.toLowerCase() !== "li") {
        siblingLi = siblingLi.previousElementSibling;
      }
      if (!siblingLi)
        return;
      const currentItemMenuItem = parentLi.querySelector('a[role="menuitem"]');
      const itemMenuItem = siblingLi.querySelector('a[role="menuitem"]');
      const buttonMenuItem = siblingLi.querySelector('button[role="menuitem"]');
      if ("a" === currentItem.localName) {
        if (buttonMenuItem) {
          buttonMenuItem.focus();
        } else {
          itemMenuItem.focus();
        }
      } else {
        currentItemMenuItem.focus();
      }
    };
    if (navContainer) {
      const allMenuItems = Array.from(
        navContainer.querySelectorAll('[role="menuitem"]')
      );
      const topLevelItems = Array.from(
        navContainer.querySelectorAll(
          '.wp-block-navigation__container > li > *[role="menuitem"]'
        )
      );
      navContainer.addEventListener("keydown", (event) => {
        const key = event.key;
        const currentItem = document.activeElement;
        if (!allMenuItems.includes(currentItem)) {
          return;
        }
        if ("ArrowDown" === key || "ArrowUp" === key || "ArrowLeft" === key || "ArrowRight" === key || "Home" === key || "End" === key) {
          event.preventDefault();
        }
        const currentIndex = allMenuItems.indexOf(currentItem);
        switch (key) {
          case "Escape": {
            const openToggles = [
              ...document.querySelectorAll(
                '.wp-block-navigation-submenu__toggle[aria-expanded="true"]'
              )
            ];
            if (!openToggles.length)
              return;
            openToggles.forEach((toggle) => {
              toggle.setAttribute("aria-expanded", "false");
              const submenu = toggle.closest(".wp-block-navigation-submenu");
              if (submenu && submenu.contains(document.activeElement)) {
                toggle.focus();
              }
            });
            event.stopPropagation();
            break;
          }
          case "ArrowDown": {
            if (topLevelItems.includes(currentItem)) {
              focusFirstElementOfSiblingMenu(currentItem, event);
            } else {
              if ("button" === currentItem.localName) {
                moveDownSiblingMenu(currentItem);
              } else {
                moveDownSiblingMenu(currentItem);
              }
            }
            break;
          }
          case "ArrowUp": {
            if ("button" === currentItem.localName) {
              focusMenuItem(allMenuItems, currentIndex - 1);
            } else {
              const parentLi = currentItem.closest("li");
              if (!parentLi)
                break;
              const parentUl = parentLi.closest("ul");
              if (!parentUl)
                break;
              const directLis = Array.from(parentUl.children).filter(
                (el) => "li" === el.tagName.toLowerCase()
              );
              if (directLis.length && directLis[0] !== parentLi) {
                moveUpSiblingMenu(currentItem);
              } else {
                closeSubmenu(currentItem);
                focusMenuItem(allMenuItems, currentIndex - 1);
              }
            }
            break;
          }
          case "ArrowRight": {
            if (topLevelItems.includes(currentItem)) {
              const topIndex = topLevelItems.indexOf(currentItem);
              focusMenuItem(topLevelItems, topIndex + 1);
            } else {
              if ("button" === currentItem.localName) {
                openSubmenu(currentItem);
                focusMenuItem(allMenuItems, currentIndex + 1);
              } else {
                moveDownSiblingMenu(currentItem);
              }
            }
            break;
          }
          case "ArrowLeft": {
            if (topLevelItems.includes(currentItem)) {
              const topIndex = topLevelItems.indexOf(currentItem);
              focusMenuItem(topLevelItems, topIndex - 1);
            } else {
              const containerUl = currentItem.closest("ul");
              if (!containerUl)
                return;
              const directLis = Array.from(containerUl.children).filter(
                (node) => "li" === node.tagName.toLowerCase()
              );
              if (!directLis.length)
                return;
              const firstMenuItem = directLis[0].querySelector('a[role="menuitem"]');
              if ("button" === currentItem.localName) {
                focusMenuItem(allMenuItems, currentIndex - 1);
                closeSubmenu(currentItem);
              } else if ("a" === currentItem.localName) {
                if (firstMenuItem === currentItem) {
                  closeSubmenu(currentItem, true);
                } else {
                  moveUpSiblingMenu(currentItem);
                }
              }
            }
            break;
          }
          case "Home": {
            if (topLevelItems.includes(currentItem)) {
              focusMenuItem(allMenuItems, 0);
            } else {
              focusFirstElementOfMenu(currentItem);
            }
            break;
          }
          case "End": {
            if (topLevelItems.includes(currentItem)) {
              focusMenuItem(allMenuItems, allMenuItems.length - 1);
            } else {
              focusLastElementOfMenu(currentItem);
            }
            break;
          }
        }
      });
    }
  });
};
if ("complete" === document.readyState) {
  domNavReady();
} else {
  document.addEventListener("DOMContentLoaded", domNavReady);
}
const bcgovBlockThemePluginSearch = () => {
  window.requestAnimationFrame(() => {
    const searchInput = document.querySelector(".wp-block-search__input");
    const resultDetails = document.querySelector(".result-details");
    const extractWordsAndPhrases = (input) => {
      const regex = /"([^"]+)"|\b(\w+)\b/g;
      const matches = [];
      let match;
      while ((match = regex.exec(input)) !== null) {
        matches.push(match[1] || match[2]);
      }
      return matches;
    };
    const highlightMatches = () => {
      const inputValue = searchInput.value.trim();
      const searchTerms = extractWordsAndPhrases(inputValue);
      const filteredTerms = searchTerms.filter((term) => term.length >= 3);
      const escapedTerms = filteredTerms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
      const regex = new RegExp(`(${escapedTerms.join("|")})`, "gi");
      const walkNodes = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          if (regex.test(node.nodeValue)) {
            const parent = node.parentNode;
            const fragments = node.nodeValue.split(regex);
            const fragmentContainer = document.createDocumentFragment();
            fragments.forEach((fragment) => {
              if (regex.test(fragment)) {
                const mark = document.createElement("mark");
                mark.textContent = fragment;
                fragmentContainer.appendChild(mark);
              } else {
                fragmentContainer.appendChild(document.createTextNode(fragment));
              }
            });
            parent.replaceChild(fragmentContainer, node);
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          node.childNodes.forEach(walkNodes);
        }
      };
      resultDetails.childNodes.forEach(walkNodes);
    };
    if (null !== searchInput && null !== resultDetails) {
      highlightMatches();
    }
    const toggleSearchBtn = document.querySelector(".toggle-search-btn a");
    const searchFieldContainer = document.querySelector("#search-field-container");
    if (!toggleSearchBtn || !searchFieldContainer)
      return;
    const searchField = searchFieldContainer.querySelector("input");
    const searchBtn = searchFieldContainer.querySelector("button");
    const searchFieldLink = searchFieldContainer.querySelector("a");
    if (!searchField || !searchBtn)
      return;
    let linkInteraction = false;
    searchBtn.addEventListener("mousedown", () => {
      linkInteraction = true;
    });
    searchBtn.addEventListener("focusout", () => {
      linkInteraction = true;
    });
    if (searchFieldLink) {
      searchFieldLink.addEventListener("mousedown", () => {
        linkInteraction = true;
      });
      searchFieldLink.addEventListener("focusin", () => {
        linkInteraction = true;
      });
    }
    const overrideBlurIfLinkClicked = (event) => {
      if (linkInteraction) {
        event.stopImmediatePropagation();
        linkInteraction = false;
      }
    };
    searchField.addEventListener("blur", overrideBlurIfLinkClicked, true);
    searchBtn.addEventListener("blur", overrideBlurIfLinkClicked, true);
  });
};
if ("complete" === document.readyState) {
  bcgovBlockThemePluginSearch();
} else {
  document.addEventListener(
    "DOMContentLoaded",
    bcgovBlockThemePluginSearch
  );
}
const bcgovBlockThemePluginSideNav = () => {
  window.requestAnimationFrame(() => {
    const detailsContainer = document.querySelector("#incentive-details-container");
    const sideNav = document.querySelector("#incentive-side-nav");
    if (detailsContainer && sideNav) {
      sideNav.innerHTML = "";
      const headings = detailsContainer.querySelectorAll("h2[id]");
      const navListContainer = document.createElement("nav");
      navListContainer.classList.add("side-nav", "bb-nav", "wp-block-navigation", "is-vertical", "wp-container-core-navigation-layout-2");
      const navList = document.createElement("ul");
      navList.classList.add("side-nav", "bb-nav", "wp-block-navigation", "is-vertical", "wp-block-navigation__container");
      headings.forEach((heading) => {
        const id = heading.id;
        const text = heading.textContent.trim();
        const listItem = document.createElement("li");
        listItem.classList.add("wp-block-navigation-item", "wp-block-navigation-link");
        const link = document.createElement("a");
        link.href = `#${id}`;
        link.textContent = text;
        link.classList.add("wp-block-navigation-item__content");
        listItem.appendChild(link);
        navList.appendChild(listItem);
      });
      navListContainer.appendChild(navList);
      sideNav.appendChild(navListContainer);
      sideNav.classList.remove("admin-instructions");
    }
  });
};
if ("complete" === document.readyState) {
  bcgovBlockThemePluginSideNav();
} else {
  document.addEventListener(
    "DOMContentLoaded",
    bcgovBlockThemePluginSideNav
  );
}
const bcgovBlockThemePluginTables = () => {
  window.requestAnimationFrame(() => {
    const tables = document.querySelectorAll("table");
    tables.forEach((table) => {
      table.setAttribute("role", "table");
      const thead = table.querySelector("thead");
      if (thead) {
        thead.setAttribute("role", "rowgroup");
        const headRow = thead.querySelector("tr");
        if (headRow) {
          headRow.setAttribute("role", "row");
          headRow.querySelectorAll("th").forEach((th) => {
            th.setAttribute("role", "columnheader");
          });
        }
      }
      const tbody = table.querySelector("tbody");
      if (tbody) {
        tbody.setAttribute("role", "rowgroup");
        tbody.querySelectorAll("tr").forEach((row) => {
          row.setAttribute("role", "row");
          row.querySelectorAll("td").forEach((td) => {
            td.setAttribute("role", "cell");
          });
        });
      }
      const headerTexts = [];
      if (thead) {
        thead.querySelectorAll("th").forEach((th) => {
          headerTexts.push(th.textContent.trim());
        });
      }
      if (tbody && headerTexts.length) {
        tbody.querySelectorAll("tr").forEach((row) => {
          row.querySelectorAll("td").forEach((cell, index) => {
            const labelText = headerTexts[index] || "";
            cell.setAttribute("data-label", labelText + ": ");
          });
        });
      }
    });
    document.querySelectorAll('figure.wp-block-table[class*="-span-"]').forEach((figure) => {
      const table = figure.querySelector("table");
      if (!table)
        return;
      const tbody = table.querySelector("tbody");
      if (!tbody)
        return;
      const classList = figure.className.split(" ");
      const spanClasses = classList.filter(
        (cls) => /(col-\d+-span-\d+|row-\d+-span-\d+|col-\d+-row-\d+-span-\d+|row-\d+-col-\d+-span-\d+|cell-\d+-\d+-span-\d+x\d+)/.test(cls)
      );
      const rows = Array.from(tbody.querySelectorAll("tr"));
      spanClasses.forEach((spanClass) => {
        let match;
        if (match = spanClass.match(/cell-(\d+)-(\d+)-span-(\d+)x(\d+)/)) {
          const [, col, row, rowspan, colspan] = match.map(Number);
          const grid = rows.map((r) => Array.from(r.children));
          const baseRow = grid[row - 1];
          if (!baseRow)
            return;
          const baseCell = baseRow[col - 1];
          if (!baseCell)
            return;
          const maxRowSpan = Math.min(rowspan, rows.length - row + 1);
          const maxColSpan = Math.min(colspan, baseRow.length - col + 1);
          baseCell.setAttribute("rowspan", maxRowSpan);
          baseCell.setAttribute("colspan", maxColSpan);
          for (let r = 0; r < maxRowSpan; r++) {
            const currentRow = grid[row - 1 + r];
            if (!currentRow)
              continue;
            for (let c = 0; c < maxColSpan; c++) {
              if (0 === r && 0 === c)
                continue;
              const targetCell = currentRow[col - 1 + c];
              if (targetCell) {
                targetCell.setAttribute("data-label", baseCell.getAttribute("data-label") || "");
                targetCell.innerHTML = baseCell.innerHTML;
                targetCell.setAttribute("aria-hidden", "true");
                targetCell.classList.add("hidden");
              }
            }
          }
        } else if (match = spanClass.match(/col-(\d+)-row-(\d+)-span-(\d+)/)) {
          const [, col, row, span] = match.map(Number);
          const baseRow = rows[row - 1];
          if (!baseRow)
            return;
          const baseCell = baseRow.children[col - 1];
          if (!baseCell)
            return;
          const maxSpan = Math.min(span, rows.length - row + 1);
          baseCell.setAttribute("rowspan", maxSpan);
          for (let i = 1; i < maxSpan; i++) {
            const targetRow = rows[row - 1 + i];
            if (targetRow) {
              const targetCell = targetRow.children[col - 1];
              if (targetCell) {
                targetCell.setAttribute("data-label", baseCell.getAttribute("data-label") || "");
                targetCell.innerHTML = baseCell.innerHTML;
                targetCell.setAttribute("aria-hidden", "true");
                targetCell.classList.add("hidden");
              }
            }
          }
        } else if (match = spanClass.match(/row-(\d+)-col-(\d+)-span-(\d+)/)) {
          const [, row, col, span] = match.map(Number);
          const baseRow = rows[row - 1];
          if (!baseRow)
            return;
          const baseCell = baseRow.children[col - 1];
          if (!baseCell)
            return;
          const maxSpan = Math.min(span, baseRow.children.length - col + 1);
          baseCell.setAttribute("colspan", maxSpan);
          for (let i = 1; i < maxSpan; i++) {
            const targetCell = baseRow.children[col - 1 + i];
            if (targetCell) {
              targetCell.setAttribute("data-label", baseCell.getAttribute("data-label") || "");
              targetCell.innerHTML = baseCell.innerHTML;
              targetCell.setAttribute("aria-hidden", "true");
              targetCell.classList.add("hidden");
            }
          }
        } else if (match = spanClass.match(/col-(\d+)-span-(\d+)/)) {
          const [, col, span] = match.map(Number);
          if (!rows[0])
            return;
          const baseCell = rows[0].children[col - 1];
          if (!baseCell)
            return;
          const maxSpan = Math.min(span, rows.length);
          baseCell.setAttribute("rowspan", maxSpan);
          for (let i = 1; i < maxSpan; i++) {
            const row = rows[i];
            if (row) {
              const targetCell = row.children[col - 1];
              if (targetCell) {
                targetCell.setAttribute("data-label", baseCell.getAttribute("data-label") || "");
                targetCell.innerHTML = baseCell.innerHTML;
                targetCell.setAttribute("aria-hidden", "true");
                targetCell.classList.add("hidden");
              }
            }
          }
        } else if (match = spanClass.match(/row-(\d+)-span-(\d+)/)) {
          const [, row, span] = match.map(Number);
          const baseRow = rows[row - 1];
          if (!baseRow)
            return;
          const cells = Array.from(baseRow.children);
          const baseCell = cells[0];
          if (!baseCell)
            return;
          const maxSpan = Math.min(span, cells.length);
          baseCell.setAttribute("colspan", maxSpan);
          cells.slice(1, maxSpan).forEach((cell) => {
            cell.setAttribute("data-label", baseCell.getAttribute("data-label") || "");
            cell.innerHTML = baseCell.innerHTML;
            cell.setAttribute("aria-hidden", "true");
            cell.classList.add("hidden");
          });
        }
      });
    });
  });
};
if ("complete" === document.readyState) {
  bcgovBlockThemePluginTables();
} else {
  document.addEventListener("DOMContentLoaded", bcgovBlockThemePluginTables);
}
const cleanbcAccessibilityLoader = () => {
  window.requestAnimationFrame(() => {
    if ("cleanbc" === window.site.customBodyClass) {
      const headerLogo = document.querySelector(".custom-logo-link img");
      headerLogo.setAttribute("alt", "BC Government and Clean BC logos");
    }
  });
};
if ("complete" === document.readyState) {
  cleanbcAccessibilityLoader();
} else {
  document.addEventListener(
    "DOMContentLoaded",
    cleanbcAccessibilityLoader
  );
}
const betterhomesAccessibilityLoader = () => {
  window.requestAnimationFrame(() => {
    if ("betterhomesbc" === window.site.customBodyClass) {
      const headerLogo = document.querySelector(".custom-logo-link img");
      headerLogo.setAttribute("alt", "BC Government and Clean BC Better Homes logos");
      const rebatePage = document.querySelector("body.single-incentives");
      if (rebatePage) {
        const newTabLinks = document.querySelectorAll('a[target="_blank"]');
        if (newTabLinks) {
          newTabLinks.forEach((link) => {
            link.removeAttribute("target");
          });
        }
        const addressContainer = document.querySelectorAll(".address");
        if (addressContainer) {
          addressContainer.forEach((section) => {
            let currentHeading = "";
            [...section.children].forEach((child) => {
              if ("H4" === child.tagName) {
                currentHeading = child.textContent.replace(/customers/i, "").trim();
                if ("FortisBC" === currentHeading) {
                  currentHeading = "Fortis BC";
                }
              }
              if ("UL" === child.tagName) {
                child.querySelectorAll("li").forEach((li) => {
                  const link = li.querySelector("a");
                  if (!link)
                    return;
                  const liClass = li.className.trim();
                  if (!liClass)
                    return;
                  let labelType;
                  if ("site" === liClass) {
                    labelType = "website";
                  } else if ("phone" === liClass) {
                    const phoneNumber = link.textContent.trim();
                    labelType = `telephone ${phoneNumber}`;
                  } else if ("form" === liClass) {
                    labelType = "contact form";
                  } else {
                    labelType = liClass;
                  }
                  const ariaLabel = `${currentHeading} ${labelType}`;
                  link.setAttribute("aria-label", ariaLabel);
                });
              }
            });
          });
        }
      }
    }
  });
};
if ("complete" === document.readyState) {
  betterhomesAccessibilityLoader();
} else {
  document.addEventListener(
    "DOMContentLoaded",
    betterhomesAccessibilityLoader
  );
}
const betterbuildingsAccessibilityLoader = () => {
  window.requestAnimationFrame(() => {
    if ("betterbuildingsbc" === window.site.customBodyClass) {
      const headerLogo = document.querySelector(".custom-logo-link img");
      headerLogo.setAttribute("alt", "BC Government and Clean BC Better Buildings logos");
    }
  });
};
if ("complete" === document.readyState) {
  betterbuildingsAccessibilityLoader();
} else {
  document.addEventListener(
    "DOMContentLoaded",
    betterbuildingsAccessibilityLoader
  );
}
const goEVAccessibilityLoader = () => {
  window.requestAnimationFrame(() => {
    if ("goelectricbc" === window.site.customBodyClass) {
      const headerLogo = document.querySelector(".custom-logo-link img");
      headerLogo.setAttribute("alt", "BC Government and Clean BC Go Electric logos");
    }
  });
};
if ("complete" === document.readyState) {
  goEVAccessibilityLoader();
} else {
  document.addEventListener(
    "DOMContentLoaded",
    goEVAccessibilityLoader
  );
}
