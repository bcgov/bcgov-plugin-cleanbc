const bcgovBlockThemePluginAccessibility=()=>{window.requestAnimationFrame((()=>{if(null!==document.querySelector(".actions-accordion-header")){const getSiblings=elem=>{const siblings=[];let sibling=elem.parentNode.firstChild;for(;sibling;)1===sibling.nodeType&&sibling!==elem&&siblings.push(sibling),null!==sibling.nextSibling&&(sibling=sibling.nextSibling);return siblings};document.querySelectorAll(".labelInjector").forEach((label=>{const siblings=getSiblings(label),ariaLabel=label.getAttribute("data-label");siblings.forEach((el=>{if(el.classList.contains("wp-block-buttons")){el.querySelector(".wp-block-button__link").setAttribute("aria-label",ariaLabel)}})),label.remove()}))}}))};"complete"===document.readyState?bcgovBlockThemePluginAccessibility():document.addEventListener("DOMContentLoaded",bcgovBlockThemePluginAccessibility);const bcgovBlockThemePluginDefnitions=()=>{window.requestAnimationFrame((()=>{const links=document.querySelectorAll("a:not(#postFilterApp a)"),definitionLinks=Array.from(links).filter((link=>link.href.includes("definitions"))),handleClick=async event=>{if("click"===event.type||"keypress"===event.type&&"Enter"===event.key){event.preventDefault();const url=event.currentTarget.getAttribute("href"),cachedData=window.sessionStorage.getItem(url);if(cachedData){const{title:title,content:content}=JSON.parse(cachedData);displayContent(title,content)}else try{const response=await fetch(url);if(!response.ok)throw new Error(`HTTP error! Status: ${response.status}`);const html=await response.text(),doc=(new window.DOMParser).parseFromString(html,"text/html"),titleElement=doc.querySelector(".wp-block-post-title"),contentElement=doc.querySelector(".entry-content");if(!titleElement||!contentElement)throw new Error("Required content not found in the fetched HTML.");const title=titleElement.innerText,content=contentElement.innerHTML,dataToCache={title:title,content:content};window.sessionStorage.setItem(url,JSON.stringify(dataToCache)),displayContent(title,content)}catch(error){console.error("Error fetching content:",error)}}},handleKeypress=event=>{"Enter"!==event.key&&13!==event.keycode||handleClick(event)},displayContent=(title,content)=>{const dialogContent=document.querySelector("#dialog .dialog-content");dialogContent.innerHTML='<h2 tabindex="0">'+title+"</h2>"+content,showDialog(),dialogContent.querySelector("h2").focus()},showDialog=()=>{document.getElementById("dialog").showModal()};if(definitionLinks.length>0){const dialog=document.createElement("dialog");dialog.id="dialog",dialog.className="dialog",dialog.setAttribute("aria-modal",!0),dialog.setAttribute("aria-live","polite"),dialog.innerHTML='<div class="dialog-content"></div><button id="close-dialog" aria-label="closes defintion dialog">Close</button>',document.body.appendChild(dialog);document.getElementById("close-dialog").addEventListener("click",(()=>{dialog.close()})),definitionLinks.forEach((link=>{var element;link.classList.add("icon-definition"),link.setAttribute("aria-label","opens definition dialog for this concept"),(element=link).addEventListener("click",handleClick),element.addEventListener("keypress",handleKeypress)}))}}))};"complete"===document.readyState?bcgovBlockThemePluginDefnitions():document.addEventListener("DOMContentLoaded",bcgovBlockThemePluginDefnitions);const bcgovBlockThemePluginDomLoader=()=>{window.requestAnimationFrame((()=>{document.querySelector("body").classList.add("cleanbc-plugin");const iconButtons=document.querySelectorAll("a.icon");iconButtons.length&&iconButtons.forEach((button=>{null===button.getAttribute("href")&&(button.setAttribute("tabindex","-1"),button.style.pointerEvents="none")}));const iconButtonContainers=document.querySelectorAll(".wp-block-button.is-style-icon");iconButtonContainers.length&&iconButtonContainers.forEach((container=>{const containerLink=container.querySelector("a");null===containerLink||container.classList.contains("has-size-large")||(containerLink.style.outlineOffset="1rem")}));const glossaryList=document.querySelector(".glossary-results ul");if(glossaryList){const items=Array.from(glossaryList.querySelectorAll("li"));let currentLetter="";items.forEach((item=>{const titleElement=item.querySelector("h3");if(titleElement){const firstLetter=titleElement.textContent.trim().charAt(0).toUpperCase();if(firstLetter!==currentLetter){currentLetter=firstLetter;const h2=document.createElement("h2");h2.textContent=currentLetter;const h2Wrapper=document.createElement("li");h2Wrapper.classList.add("glossary-letter-headline"),h2Wrapper.appendChild(h2),glossaryList.insertBefore(h2Wrapper,item)}}}))}}))};"complete"===document.readyState?bcgovBlockThemePluginDomLoader():document.addEventListener("DOMContentLoaded",bcgovBlockThemePluginDomLoader);const bcgovBlockThemePluginDriverCategoryQuery=()=>{window.requestAnimationFrame((()=>{const queryLoopDriverCardContainer=document.querySelectorAll(".wp-block-query.vue-card-container"),fetchDataAndReplaceLinks=async(page=1)=>{var _a;try{const perPage=100,cachedData=window.localStorage.getItem("apiData"),cachedTimestamp=window.localStorage.getItem("apiDataTimestamp"),existingData=cachedData?JSON.parse(cachedData):[];if(cachedData&&cachedTimestamp)try{const timeDiff=(new Date).getTime()-parseInt(cachedTimestamp,10);if(timeDiff<864e5)return void processCategories(existingData)}catch(cacheError){console.error("Error parsing cached data:",cacheError.message)}const response=await fetch(`${null==(_a=window.site)?void 0:_a.domain}/wp-json/wp/v2/project?_embed&per_page=${perPage}&page=${page}&_category_image=true`);if(!response.ok)throw new Error(`HTTP error! Status: ${response.status}`);const newData=await response.json(),mergedData=existingData.concat(newData);window.localStorage.setItem("apiData",JSON.stringify(mergedData)),newData.length>=perPage&&await fetchDataAndReplaceLinks(page+1),processCategories(mergedData),window.localStorage.setItem("apiDataTimestamp",(new Date).getTime().toString())}catch(error){console.error("Error fetching data:",error.message)}},processCategories=data=>{const categories=[],uniqueCategoryNames=new Set;data.forEach((item=>{var _a;((null==(_a=null==item?void 0:item._embedded)?void 0:_a["wp:term"])||[]).forEach((categoryArray=>{categoryArray.forEach((category=>{var _a2;const categoryName=null==category?void 0:category.name,categoryImage=null==(_a2=null==category?void 0:category.acf)?void 0:_a2.category_image;categoryName&&"Actions we are taking"!==categoryName&&!uniqueCategoryNames.has(categoryName)&&(uniqueCategoryNames.add(categoryName),categories.push({name:categoryName,acf:{category_image:categoryImage||null}}))}))}))})),replaceLinks(categories)},replaceLinks=categories=>{document.querySelectorAll("div.taxonomy-category").forEach((categoryDiv=>{const links=categoryDiv.querySelectorAll("a");categoryDiv.querySelectorAll("span.wp-block-post-terms__separator").forEach((separator=>separator.remove())),links.forEach((link=>{var _a;const categoryName=link.innerText.trim();if("Actions we are taking"===categoryName)return void link.remove();const matchingCategory=categories.find((category=>category.name===categoryName));if(matchingCategory){const categoryImage=null==(_a=null==matchingCategory?void 0:matchingCategory.acf)?void 0:_a.category_image;if(categoryImage){const imgElement=document.createElement("img");imgElement.src=categoryImage,imgElement.alt=categoryName,imgElement.title=categoryName,link.replaceWith(imgElement)}}})),categoryDiv.style.opacity="1"}))};queryLoopDriverCardContainer.length&&fetchDataAndReplaceLinks()}))};"complete"===document.readyState?bcgovBlockThemePluginDriverCategoryQuery():document.addEventListener("DOMContentLoaded",bcgovBlockThemePluginDriverCategoryQuery);const bcgovBlockThemePluginLandingBanners=()=>{window.requestAnimationFrame((()=>{const isHomeBanner=document.querySelectorAll(".home-cover-banner"),isLandingBanner=document.querySelectorAll(".landing-cover-banner");if(isHomeBanner.length||isLandingBanner.length){const svgNamespace="http://www.w3.org/2000/svg",svg=document.createElementNS(svgNamespace,"svg"),clipElementDefs=document.createElementNS(svgNamespace,"defs"),clipElementClipPath=document.createElementNS(svgNamespace,"clipPath");clipElementClipPath.setAttribute("id","svgPath");const clipElementPath=document.createElementNS(svgNamespace,"path");clipElementPath.setAttribute("d","M0,77.2v-24.7c0,-8.6,6.8,-15.6,15.3,-16l901.5,-36.6c44.3,-1.7,81.5,33.1,83.2,77.5l-1000,-0.2z"),clipElementClipPath.setAttribute("transform","scale(1.44)"),svg.appendChild(clipElementDefs),clipElementDefs.appendChild(clipElementClipPath),clipElementClipPath.appendChild(clipElementPath),svg.setAttribute("xmlns",svgNamespace),svg.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink"),svg.setAttribute("version","1.1"),svg.setAttribute("width","100"),svg.setAttribute("height","100"),svg.setAttribute("viewBox","0 0 100 100"),svg.setAttribute("preserveAspectRatio","none"),svg.style.position="absolute",svg.style.top="0",svg.style.left="0",svg.style.visibility="visible";document.getElementsByTagName("body")[0].insertAdjacentElement("afterbegin",svg)}}))};"complete"===document.readyState?bcgovBlockThemePluginLandingBanners():document.addEventListener("DOMContentLoaded",bcgovBlockThemePluginLandingBanners);const bcgovBlockThemePluginSearch=()=>{window.requestAnimationFrame((()=>{const searchInput=document.querySelector(".wp-block-search__input"),resultDetails=document.querySelector(".result-details");null!==searchInput&&null!==resultDetails&&(()=>{const escapedTerms=(input=>{const regex=/"([^"]+)"|\b(\w+)\b/g,matches=[];let match;for(;null!==(match=regex.exec(input));)matches.push(match[1]||match[2]);return matches})(searchInput.value.trim()).filter((term=>term.length>=3)).map((term=>term.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"))),regex=new RegExp(`(${escapedTerms.join("|")})`,"gi"),walkNodes=node=>{if(node.nodeType===Node.TEXT_NODE){if(regex.test(node.nodeValue)){const parent=node.parentNode,fragments=node.nodeValue.split(regex),fragmentContainer=document.createDocumentFragment();fragments.forEach((fragment=>{if(regex.test(fragment)){const mark=document.createElement("mark");mark.textContent=fragment,fragmentContainer.appendChild(mark)}else fragmentContainer.appendChild(document.createTextNode(fragment))})),parent.replaceChild(fragmentContainer,node)}}else node.nodeType===Node.ELEMENT_NODE&&node.childNodes.forEach(walkNodes)};resultDetails.childNodes.forEach(walkNodes)})()}))};"complete"===document.readyState?bcgovBlockThemePluginSearch():document.addEventListener("DOMContentLoaded",bcgovBlockThemePluginSearch);const bcgovBlockThemePluginSideNav=()=>{window.requestAnimationFrame((()=>{const detailsContainer=document.querySelector("#incentive-details-container");console.log("detailsContainer",detailsContainer);const sideNav=document.querySelector("#incentive-side-nav");if(console.log("sideNav",sideNav),detailsContainer&&sideNav){sideNav.innerHTML="";const headings=detailsContainer.querySelectorAll("h2[id]"),navListContainer=document.createElement("nav");navListContainer.classList.add("side-nav","wp-block-navigation","is-vertical","wp-container-core-navigation-layout-2");const navList=document.createElement("ul");navList.classList.add("side-nav","wp-block-navigation","is-vertical","wp-block-navigation__container"),headings.forEach((heading=>{const id=heading.id,text=heading.textContent.trim(),listItem=document.createElement("li");listItem.classList.add("wp-block-navigation-item","wp-block-navigation-link");const link=document.createElement("a");link.href=`#${id}`,link.textContent=text,link.classList.add("wp-block-navigation-item__content"),listItem.appendChild(link),navList.appendChild(listItem)})),navListContainer.appendChild(navList),sideNav.appendChild(navListContainer)}}))};"complete"===document.readyState?bcgovBlockThemePluginSideNav():document.addEventListener("DOMContentLoaded",bcgovBlockThemePluginSideNav);
//# sourceMappingURL=public-f1b7c8b5.js.map