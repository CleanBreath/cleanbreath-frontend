if(!self.define){let e,a={};const s=(s,i)=>(s=new URL(s+".js",i).href,a[s]||new Promise((a=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=a,document.head.appendChild(e)}else e=s,importScripts(s),a()})).then((()=>{let e=a[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(i,n)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(a[c])return;let r={};const t=e=>s(e,c),o={module:{uri:c},exports:r,require:t};a[c]=Promise.all(i.map((e=>o[e]||t(e)))).then((e=>(n(...e),r)))}}define(["./workbox-f1770938"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/Notice.svg",revision:"5c884ef25b7153fa32b117ef3e77f3eb"},{url:"/OGImage.png",revision:"82b4c399ccd9f951c6055c1806cb85ae"},{url:"/Password.svg",revision:"b6149da9ad1bcf22280ff2f2f20bb22e"},{url:"/UserEmail.svg",revision:"e2011a8b68abe2ee9aee026bb2d35220"},{url:"/_next/static/chunks/190-10f436313daa144d.js",revision:"wXl3L-N1iTl1dW0KgdgoU"},{url:"/_next/static/chunks/956-85765eebd0b370cf.js",revision:"wXl3L-N1iTl1dW0KgdgoU"},{url:"/_next/static/chunks/app/_not-found/page-12b87eb77202f09a.js",revision:"wXl3L-N1iTl1dW0KgdgoU"},{url:"/_next/static/chunks/app/dashboard/page-1f3505875f6995cd.js",revision:"wXl3L-N1iTl1dW0KgdgoU"},{url:"/_next/static/chunks/app/layout-cf96bd51973949e9.js",revision:"wXl3L-N1iTl1dW0KgdgoU"},{url:"/_next/static/chunks/app/login/page-963925e7126ae3c4.js",revision:"wXl3L-N1iTl1dW0KgdgoU"},{url:"/_next/static/chunks/app/page-b451543e4be5b571.js",revision:"wXl3L-N1iTl1dW0KgdgoU"},{url:"/_next/static/chunks/fd9d1056-23194c5c4767dde6.js",revision:"wXl3L-N1iTl1dW0KgdgoU"},{url:"/_next/static/chunks/framework-f66176bb897dc684.js",revision:"wXl3L-N1iTl1dW0KgdgoU"},{url:"/_next/static/chunks/main-a0f6dcce3460a748.js",revision:"wXl3L-N1iTl1dW0KgdgoU"},{url:"/_next/static/chunks/main-app-28ba97ccc6492bcd.js",revision:"wXl3L-N1iTl1dW0KgdgoU"},{url:"/_next/static/chunks/pages/_app-6a626577ffa902a4.js",revision:"wXl3L-N1iTl1dW0KgdgoU"},{url:"/_next/static/chunks/pages/_error-1be831200e60c5c0.js",revision:"wXl3L-N1iTl1dW0KgdgoU"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-ec6c79285b6357f9.js",revision:"wXl3L-N1iTl1dW0KgdgoU"},{url:"/_next/static/css/1778c026f37216b2.css",revision:"1778c026f37216b2"},{url:"/_next/static/css/75e71da4712041df.css",revision:"75e71da4712041df"},{url:"/_next/static/media/apart.81ecd97d.png",revision:"cfede00a5db6937a128501ba45007036"},{url:"/_next/static/media/bank.9388368e.png",revision:"90256c98f87b009c6883c4a020e6427e"},{url:"/_next/static/media/building.78c789f7.png",revision:"7978b8526bca0ccb45decc20abea529e"},{url:"/_next/static/media/gas.9cfa953c.png",revision:"863b69027dcd014caa6b521ac322a28b"},{url:"/_next/static/media/government.b229c97d.png",revision:"5c50c5a2fba6866a8d806e9c40fc6367"},{url:"/_next/static/media/house.98879770.png",revision:"421b3fcbea9b2b5083d004006b98c14b"},{url:"/_next/static/media/medical.49094127.png",revision:"328af84873bf0e98dc2ebfcfa083a8c9"},{url:"/_next/static/media/park.5949f4dc.png",revision:"0d3232802aa3da06e062ec344fff57b4"},{url:"/_next/static/media/school.7604f23b.png",revision:"67e49824c000544d750694a0d03b2efb"},{url:"/_next/static/media/smokMarker.94b490af.png",revision:"40f939263e7148cb95db80b12f8370f6"},{url:"/_next/static/media/subway.e2e73726.png",revision:"09f48c75864125e09503f44abb6fd665"},{url:"/_next/static/wXl3L-N1iTl1dW0KgdgoU/_buildManifest.js",revision:"2ec694eb52ae4f523f265a46bae4d768"},{url:"/_next/static/wXl3L-N1iTl1dW0KgdgoU/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/add.svg",revision:"f113dc22bff577f54c45a5da2e004c09"},{url:"/apart.png",revision:"cfede00a5db6937a128501ba45007036"},{url:"/apartMarker.svg",revision:"52955d56335f1151419b4e3700967401"},{url:"/back.svg",revision:"757657eeb3bd630c51533129255ecc8b"},{url:"/bank.png",revision:"90256c98f87b009c6883c4a020e6427e"},{url:"/building.png",revision:"7978b8526bca0ccb45decc20abea529e"},{url:"/cleanBreathFavicon.ico",revision:"7550f518547bfca23ff35dfb0849d398"},{url:"/close.svg",revision:"a99ab1b7e035a3ee75d8ead1f5371256"},{url:"/feedback.svg",revision:"4dcea1872d477a301968b6204f5b243f"},{url:"/feedbackicon.svg",revision:"e702afa1643f3a9f8141676da799fcf2"},{url:"/gas.png",revision:"863b69027dcd014caa6b521ac322a28b"},{url:"/government.png",revision:"5c50c5a2fba6866a8d806e9c40fc6367"},{url:"/help.svg",revision:"b4a1389863587e9b665f9c55a9be8eaa"},{url:"/house.png",revision:"421b3fcbea9b2b5083d004006b98c14b"},{url:"/images/icons/icon-128x128.png",revision:"f19a947da5eff208190646cecd43be59"},{url:"/images/icons/icon-144x144.png",revision:"27cf537be78dbc2717ddb934f8ce8238"},{url:"/images/icons/icon-152x152.png",revision:"d56b594681ba6910244facabdab3298d"},{url:"/images/icons/icon-192x192.png",revision:"3168e0b919b0f8c1875c52de1411a532"},{url:"/images/icons/icon-384x384.png",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"/images/icons/icon-512x512.png",revision:"b0df7f76f892ef0b6c311505e7411e85"},{url:"/images/icons/icon-72x72.png",revision:"6317757124722a85add837a3a9c4811c"},{url:"/images/icons/icon-96x96.png",revision:"1bfcf08149a5df4dc013d9c90579ef8f"},{url:"/info.svg",revision:"77fd7f1279c68347564a9b31795a25e5"},{url:"/list.svg",revision:"c887e1e0fcff09e3d7ae7452d58a837f"},{url:"/logo.svg",revision:"76a5c53fe9abd5bce66178c82b19bdba"},{url:"/manifest.json",revision:"3bb90f40d4a98b3eb0375f0275c54e03"},{url:"/medical.png",revision:"328af84873bf0e98dc2ebfcfa083a8c9"},{url:"/mobileinfo.svg",revision:"7648cea6dcaa1f9d2de90fe3f2c9fd29"},{url:"/mobilelogo.svg",revision:"2a0a862441af4b926b92d4d2a98469ef"},{url:"/nonSmok.svg",revision:"2658021469717c2c714e5ebe73e72679"},{url:"/park.png",revision:"0d3232802aa3da06e062ec344fff57b4"},{url:"/pwaIcon/pwaIcon512.png",revision:"00ae1b42cd60067affc3c87693b4c898"},{url:"/pwaIcon/pwaIcon512Rounded.png",revision:"baa7d6eaf9705e7479571c94e748b695"},{url:"/redPill.svg",revision:"c6f6516cfd351c6f3a211a8086602b52"},{url:"/right.svg",revision:"2826181cc23057f0e0014e06c56d431e"},{url:"/school.png",revision:"67e49824c000544d750694a0d03b2efb"},{url:"/search.svg",revision:"c8e33e7b928e877ae35b363e2fe7ac26"},{url:"/searchColor.svg",revision:"5ddd82e674066e0a03e75210c2e93277"},{url:"/setting.svg",revision:"30e04068c79ee11c971e2b7525baccc1"},{url:"/smok.svg",revision:"2c69a017a52b08c42244eaf41e954232"},{url:"/smokMarker.png",revision:"40f939263e7148cb95db80b12f8370f6"},{url:"/subway.png",revision:"09f48c75864125e09503f44abb6fd665"},{url:"/user_icon.svg",revision:"c24dd781e9461e80e72727ea253a2358"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({response:e})=>e&&"opaqueredirect"===e.type?new Response(e.body,{status:200,statusText:"OK",headers:e.headers}):e}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:2592e3})]}),"GET"),e.registerRoute(/\/_next\/static.+\.js$/i,new e.CacheFirst({cacheName:"next-static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4|webm)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:48,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e,url:{pathname:a}})=>!(!e||a.startsWith("/api/auth/callback")||!a.startsWith("/api/"))),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:a},sameOrigin:s})=>"1"===e.headers.get("RSC")&&"1"===e.headers.get("Next-Router-Prefetch")&&s&&!a.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc-prefetch",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:a},sameOrigin:s})=>"1"===e.headers.get("RSC")&&s&&!a.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:{pathname:e},sameOrigin:a})=>a&&!e.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e})=>!e),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
