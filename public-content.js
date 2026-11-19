(() => {
  const API = (window.EUMJI_API_BASE_URL || window.location.origin).replace(/\/+$/, "");
  const pageMap = {"index.html":"home", "about.html":"about", "duties.html":"duties", "organization.html":"organization", "open.html":"open"};
  const file = location.pathname.split("/").pop() || "index.html";
  const key = pageMap[file];
  const $ = (s) => document.querySelector(s);
  function addBodyText(container, text) {
    container.replaceChildren();
    String(text || "").split(/\r?\n/).forEach((line) => {
      const value = line.trim();
      if (!value) return;

      // 관리자 본문에서 [제목]을 붙인 줄은 항상 동일한 소제목 서식으로 표시
      const markedHeading = value.match(/^\[제목\]\s*(.+)$/);
      // 기존에 작성한 콘텐츠와의 호환성을 위해 기존 제목 표현도 계속 인식
      const legacyHeading = /^(기관 소개|설립 목적|운영 원칙|운영 슬로건|주요 업무|조직 구성|부서 안내|공개 자료실|정보공개 안내|문의 및 제안|기관 표식|\d{2}\s+.+)$/.test(value);

      if (markedHeading || legacyHeading) {
        const h = document.createElement("h2");
        h.textContent = markedHeading ? markedHeading[1].trim() : value;
        container.appendChild(h);
      } else {
        const p = document.createElement("p");
        p.textContent = value;
        container.appendChild(p);
      }
    });
  }
  async function loadPage() {
    if (!key) return;
    try {
      const res = await fetch(`${API}/api/content`, {cache:"no-store", headers:{Accept:"application/json"}});
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const all = await res.json(); const data = all[key]; if (!data) return;
      const h1 = $(".titlebar h1"); if (h1 && data.title) h1.textContent = data.title;
      const sub = $(".titlebar .subtitle"); if (sub && data.subtitle) sub.textContent = data.subtitle;
      const head = $(".content-head h2"); if (head && data.title) head.textContent = data.title;
      if (key === "home") {
        const hero = $(".welcome h2"); if (hero && data.title) hero.textContent = data.title;
        const heroP = $(".welcome p"); if (heroP && data.subtitle) heroP.textContent = data.subtitle;
        const intro = $(".content-head");
        if (intro && data.body) { let p = $("#managedHomeBody"); if (!p) { p=document.createElement("p"); p.id="managedHomeBody"; p.style.cssText="color:#596873;line-height:1.9;margin:0 0 18px"; intro.after(p); } p.textContent=data.body; }
      } else {
        const article = $(".article"); if (article && data.body) addBodyText(article, data.body);
      }
    } catch (e) { console.warn("기관 콘텐츠를 불러오지 못했습니다.", e); }
  }
  async function loadDocuments() {
    const target = $("#publicDocuments"); if (!target) return;
    try {
      const res = await fetch(`${API}/api/documents`, {cache:"no-store",headers:{Accept:"application/json"}});
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const docs = await res.json(); target.replaceChildren();
      if (!Array.isArray(docs) || !docs.length) { const p=document.createElement("p"); p.className="empty"; p.textContent="등록된 공개 자료가 없습니다."; target.appendChild(p); return; }
      docs.forEach(doc => {
        const row=document.createElement("div"); row.className="downloadrow";
        const info=document.createElement("div"); const title=document.createElement("b"); title.textContent=doc.title || "기관 공개자료";
        const meta=document.createElement("span"); meta.textContent=`PDF 자료 · ${doc.uploadedAt || ""}`; info.append(title,meta);
        const link=document.createElement("a"); link.href=`${API}${doc.url}`; link.target="_blank"; link.rel="noopener"; link.textContent="PDF 열람"; link.setAttribute("aria-label",`${title.textContent} PDF 열람`); link.style.cssText="color:#315b79;font-weight:bold;white-space:nowrap";
        row.append(info,link); target.appendChild(row);
      });
    } catch(e) { const p=document.createElement("p"); p.className="empty"; p.textContent="공개 자료를 불러오지 못했습니다."; target.replaceChildren(p); console.warn(e); }
  }
  document.addEventListener("DOMContentLoaded", () => { loadPage(); loadDocuments(); });
})();
