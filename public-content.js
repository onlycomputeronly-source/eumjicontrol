(async()=>{
 const page=document.body.dataset.page;if(!page)return;
 try{
  const r=await fetch((window.EUMJI_API_BASE_URL||"")+"/api/content");if(!r.ok)return;const all=await r.json();const data=all[page];if(!data)return;
  const h=document.querySelector(".titlebar h1");const sub=document.querySelector(".titlebar .subtitle");const article=document.querySelector(".article");
  if(h)h.textContent=data.title;if(sub)sub.textContent=data.subtitle;
  if(page==="home"){const intro=document.querySelector(".welcome p");if(intro)intro.textContent=data.body;}
  if(article){article.replaceChildren();data.body.split(/\n\s*\n/).filter(Boolean).forEach((block)=>{const p=document.createElement("p");p.textContent=block.trim();article.appendChild(p);});}
 }catch(e){console.warn("페이지 콘텐츠를 불러오지 못했습니다.",e)}
})();
