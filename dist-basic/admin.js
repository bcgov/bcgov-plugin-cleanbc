(()=>{"use strict";const e=window.React,t=window.wp.blocks,o=window.wp.blockEditor,n=window.wp.serverSideRender,i=window.wp.components,c=window.wp.i18n;(0,t.registerBlockType)("bcgovcleanbc/rebates-page-info",{title:(0,c.__)("CleanBC - Rebates Page Info Section"),description:"Used to display a section of a rebates page",category:"plugin",icon:"cart",edit:t=>{const c=(0,o.useBlockProps)();return(0,e.createElement)("div",{...c},(0,e.createElement)(o.InspectorControls,null,(0,e.createElement)(i.PanelBody,{title:"Options"},(0,e.createElement)(i.SelectControl,{label:"Select Section",value:t.attributes.section,options:t.attributes.section_options,onChange:e=>{t.setAttributes({section:e})}}))),(0,e.createElement)(n,{block:"bcgovcleanbc/rebates-page-info",attributes:t.attributes}))}})})();