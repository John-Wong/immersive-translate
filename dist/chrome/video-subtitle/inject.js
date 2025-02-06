(()=>{var f="imt-subtitle-inject",g=class{from;to;constructor(e,s){this.from=e,this.to=s}sendMessages(e){globalThis.postMessage({type:f,to:this.to,from:this.from,action:e.action,data:e.data,id:e.id||new Date().getTime(),isAsync:!1})}getRandomId(){return(new Date().getTime()+Math.random())*Math.random()}sendAsyncMessages({action:e,data:s}){return new Promise(t=>{let n=this.getRandomId();globalThis.postMessage({type:f,to:this.to,from:this.from,action:e,data:s,id:n,isAsync:!0});let a=({data:o})=>{f===o.type&&o.id===n&&o.to===this.from&&(t(o.data),globalThis.removeEventListener("message",a))};globalThis.addEventListener("message",a)})}handleMessageOnce(e){return new Promise(s=>{let t=({data:n})=>{f===n.type&&n.action===e&&n.to===this.from&&(s(n.data),globalThis.removeEventListener("message",t))};globalThis.addEventListener("message",t)})}handleMessage(e,s){let t=({data:n})=>{f===n.type&&n.action===e&&n.to===this.from&&s(n)};return globalThis.addEventListener("message",t),()=>{globalThis.removeEventListener("message",t)}}handleMessages(e){let s=({data:t})=>{f===t.type&&t.to===this.from&&e(t)};return globalThis.addEventListener("message",s),()=>{globalThis.removeEventListener("message",s)}}},q=new g("content-script","inject"),c=new g("inject","content-script"),v={get(r,e,s){return e in r?(...t)=>{let n=r[e];return typeof n=="function"?n.apply(r,t):Reflect.get(r,e,s)}:t=>r.sendAsyncMessages({action:e,data:t})}},x=new Proxy(c,v),I=new Proxy(q,v);function d(r){if(!r)return null;try{let e=r;return r.startsWith("//")?e=globalThis.location.protocol+r:r.startsWith("/")?e=`${globalThis.location.protocol}//${globalThis.location.host}${r}`:r.startsWith("http")||(e=`${globalThis.location.protocol}//${r}`),new URL(e).toString()}catch(e){return console.error(e),r}}var i=class{content=x;config;constructor(e){this.config=e,c.handleMessages(async({action:s,id:t,data:n})=>{let a=this[s];if(!a)return;let o=a.apply(this,[n]);o instanceof Promise&&(o=await o),c.sendMessages({id:t,data:o})})}triggerSubtitle(e){}async translateSubtitle(e){let s=await this.content.requestSubtitle({url:d(e._url)});if(s){if(this.config.responseType=="document"){let n=new DOMParser().parseFromString(s,"text/xml");Object.defineProperty(e,"responseXML",{value:n,writable:!1}),Object.defineProperty(e,"response",{value:n,writable:!1});return}let t=s;(e.responseType=="arraybuffer"||this.config.responseType=="arraybuffer")&&typeof s=="string"&&(t=new TextEncoder().encode(s).buffer),Object.defineProperty(e,"responseText",{value:t,writable:!1}),Object.defineProperty(e,"response",{value:t,writable:!1})}}async translateSubtitleWithResponse(e,s){return await this.content.requestSubtitle({url:d(e),responseText:s})}startRequestSubtitle(e){this.content.startRequestSubtitle({url:d(e)})}async isOnlyResponse(){return this.config.hookType.includes("xhr_response")}async translateSubtitleWithFetch(e,s){let t={...s},n;return typeof e=="string"?n={url:e,method:"GET",headers:{}}:n=await P(e),t?.body&&(t.body=T(t.body)),this.content.requestSubtitle({fetchInfo:JSON.stringify({input:n,options:t})})}async getVideoMeta(e){}isSubtitleRequest(e){return!this.config||!this.config.subtitleUrlRegExp||!e?!1:new RegExp(this.config.subtitleUrlRegExp).test(e||"")}};function P(r){if(r instanceof URL)return{url:r.href,method:"GET",headers:{}};let e=r.clone(),s={url:r.url,method:r.method,headers:Object.fromEntries(r.headers.entries())};if(e.body){let t=T(e.body);if(e.body!==t)return e.text().then(n=>(s.body=n,s));s.body=t}return Promise.resolve(s)}function T(r){if(!r)return r;if(r instanceof FormData||r instanceof URLSearchParams){let e={};for(let[s,t]of r.entries())e[s]=t;return e._formatBodyType="FormData",e}return r}var m=class extends i{timer=null;triggerSubtitle({force:e}){setTimeout(()=>{if(this.config?.subtitleButtonSelector){let s=document.querySelector(this.config.subtitleButtonSelector);if(s){let t=s.getAttribute("aria-pressed")==="true";t&&e?(s.click(),setTimeout(()=>{s.click()},100)):t||s.click();return}}if(this.config?.videoPlayerSelector){let s=document.querySelector(this.config.videoPlayerSelector);s?.toggleSubtitles(),setTimeout(()=>{s?.toggleSubtitles()},100)}},1e3)}async getVideoMeta(){if(!this.config.videoPlayerSelector)return null;try{return await this.sleep(100),document.querySelector(this.config.videoPlayerSelector)?.getPlayerResponse()}catch{return null}}async isOnlyResponse(){let e=await super.isOnlyResponse();return!e||(await this.getVideoMeta())?.videoDetails?.isLive?!1:e}getCurrentTime(){try{return this.config.videoPlayerSelector?document.querySelector(this.config.videoPlayerSelector)?.getCurrentTime():null}catch{return null}}sleep(e){return new Promise(s=>{setTimeout(()=>{s(null)},e)})}};var y=class extends i{timer=null;videoMeta={};lastVideoMeta=null;constructor(e){super(e),this.hookJSON()}hookJSON(){let e=JSON.parse;JSON.parse=s=>{let t=e(s);try{t&&t.result&&t.result.timedtexttracks&&t.result.movieId&&(this.videoMeta[t.result.movieId]=t.result,this.lastVideoMeta=t.result)}catch(n){console.log(n)}return t}}getVideoMeta(e){return this.lastVideoMeta}};var p=class extends i{timer=null;videoMeta={};constructor(e){super(e),this.hookJSON()}hookJSON(){let e=JSON.parse;JSON.parse=s=>{let t=e(s);try{t?.asset?.captions?.length?this.videoMeta[t.id]=t?.asset:t?.previews&&t?.course&&t?.previews?.forEach(n=>{this.videoMeta[n.id]=n})}catch(n){console.error(n)}return t}}getVideoMeta(e){return this.videoMeta[e]}};var b=class extends i{timer=null;videoMeta={};constructor(e){super(e),this.hookJSON()}hookJSON(){let e=JSON.parse;JSON.parse=s=>{let t=e(s);try{if(t?.stream?.sources?.length&&t?.stream?.sources[0]?.complete?.url){let n=window.location.pathname.split("/");n.length>2&&n[n.length-2]==="video"&&(this.videoMeta[n[n.length-1]]=t.stream.sources[0].complete.url)}}catch(n){console.error(n)}return t}}getVideoMeta(e){return this.videoMeta[e]}};var S=class extends i{constructor(e){super(e)}async translateSubtitleWithFetch(e,s){this.main(e,s)}async main(e,s){let t=globalThis.__originalFetch;if(!t)return;let n=e;e instanceof Request&&(n=e.clone());let a=await t(n,s);if(!a.ok)return;let o=await a.json();o.transcripts_urls&&this.requestSubtitle(o.transcripts_urls)}async requestSubtitle(e){await u(),await this.content.requestSubtitle(e)}};var R=class extends i{constructor(e){super(e)}lang="";async translateSubtitleWithFetch(e,s){this.main(e,s)}async main(e,s){let t=globalThis.__originalFetch;if(!t)return;let n=this.getUrl(e);return/textstream_/.test(n)?this.parseLang(n):this.parseAllSubs(e,s,t)}getUrl(e){return e.toString()}async parseLang(e){let t=e.match(/textstream_(\w+)=/)?.[1];return!t||t==this.lang||(this.lang=t,await u(),this.content.changeLang(t)),null}async parseAllSubs(e,s,t){if(!t)return;let n=e;e instanceof Request&&(n=e.clone());let a=await t(n,s);if(!a.ok)return;let o=await a.json();o.text_track_urls&&this.requestSubtitle(o.text_track_urls)}async requestSubtitle(e){await u(),await this.content.requestSubtitle(e)}};var w={hookRequest:()=>{}};async function L(){let r=await c.sendAsyncMessages({action:"getConfig"});if(!r)return;let s={youtube:m,netflix:y,webvtt:i,khanacademy:i,udemy:p,general:i,ebutt:i,hulu:S,mubi:R,disneyplus:b,"fmp4.xml":i,multi_attach_vtt:i,twitter:i,subsrt:i,xml:i,text_track_dynamic:i,av:i}[r.type||""];if(!s)return;let t=new s(r);w.hookRequest(t,r)}w.hookRequest=(r,e)=>{if(e.hookType.includes("xhr")){let s=XMLHttpRequest.prototype.open,t=XMLHttpRequest.prototype.send,n=function(){return this._url=arguments[1],s.apply(this,arguments)},a=async function(){let o=this._url,h=r.isSubtitleRequest(o);return!o||!h?t.apply(this,arguments):(await u(),await r.isOnlyResponse()?(r.startRequestSubtitle(o),this.onreadystatechange=()=>{this.readyState===XMLHttpRequest.DONE&&this.status===200&&r.translateSubtitleWithResponse(o,this.responseText)}):await r.translateSubtitle(this),t.apply(this,arguments))};Object.defineProperty(XMLHttpRequest.prototype,"open",{value:n,writable:!0}),Object.defineProperty(XMLHttpRequest.prototype,"send",{value:a,writable:!0})}if(e.hookType.includes("fetch")){let s=globalThis.fetch;globalThis.__originalFetch=s,globalThis.fetch=async function(t,n){let a=typeof t=="string"?t:t.url||t.href;if(!r.isSubtitleRequest(a))return s(t,n);await u();let h=await r.translateSubtitleWithFetch(t,n);return h?new Response(h):s(t,n)}}};var M=!1;async function u(){return M||(await c.handleMessageOnce("contentReady"),M=!0),M}u();L();})();
