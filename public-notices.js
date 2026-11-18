(() => {
  const apiBase = (window.EUMJI_API_BASE_URL || window.location.origin).replace(/\/+$/, "");
  const $ = (id) => document.getElementById(id);

  function makeCell(tag, text, className) {
    const el = document.createElement(tag);
    el.textContent = text ?? "";
    if (className) el.className = className;
    return el;
  }

  async function fetchNotices() {
    const response = await fetch(`${apiBase}/api/notices`, {
      method: "GET",
      cache: "no-store",
      headers: { "Accept": "application/json" }
    });
    if (!response.ok) throw new Error(`서버 응답 오류 (${response.status})`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("공지사항 응답 형식이 올바르지 않습니다.");
    return data;
  }

  function showError(container, message) {
    if (!container) return;
    container.replaceChildren();
    const tr = document.createElement("tr");
    const td = makeCell("td", message);
    td.colSpan = 4;
    td.style.textAlign = "center";
    td.style.padding = "22px";
    td.style.color = "#8a5555";
    tr.appendChild(td);
    container.appendChild(tr);
  }

  function renderHome(notices) {
    const tbody = $("homeNoticeRows");
    if (!tbody) return;
    tbody.replaceChildren();
    const latest = notices.slice(0, 3);
    if (!latest.length) {
      const tr = document.createElement("tr");
      const td = makeCell("td", "등록된 공지사항이 없습니다.");
      td.colSpan = 3;
      td.style.textAlign = "center";
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }
    latest.forEach((notice) => {
      const tr = document.createElement("tr");
      tr.appendChild(makeCell("td", notice.category || "공지"));
      const titleCell = document.createElement("td");
      const link = document.createElement("a");
      link.href = `news.html?id=${encodeURIComponent(notice.id)}`;
      link.textContent = notice.title || "(제목 없음)";
      titleCell.appendChild(link);
      tr.appendChild(titleCell);
      tr.appendChild(makeCell("td", notice.date || ""));
      tbody.appendChild(tr);
    });
  }

  function renderNewsList(notices) {
    const tbody = $("noticeRows");
    if (!tbody) return;
    tbody.replaceChildren();
    if (!notices.length) {
      const tr = document.createElement("tr");
      const td = makeCell("td", "등록된 공지사항이 없습니다.");
      td.colSpan = 4;
      td.className = "empty";
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }
    notices.forEach((notice, index) => {
      const tr = document.createElement("tr");
      tr.appendChild(makeCell("td", String(notices.length - index)));
      tr.appendChild(makeCell("td", notice.category || "공지"));
      const titleCell = document.createElement("td");
      const link = document.createElement("a");
      link.href = `news.html?id=${encodeURIComponent(notice.id)}`;
      link.textContent = notice.title || "(제목 없음)";
      titleCell.appendChild(link);
      tr.appendChild(titleCell);
      tr.appendChild(makeCell("td", notice.date || ""));
      tbody.appendChild(tr);
    });
  }

  function renderNoticeDetail(notices) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return;
    const notice = notices.find((item) => String(item.id) === id);
    const list = $("noticeListView");
    const detail = $("noticeDetailView");
    if (!list || !detail) return;

    list.hidden = true;
    detail.hidden = false;
    detail.replaceChildren();

    if (!notice) {
      detail.appendChild(makeCell("h3", "공지사항을 찾을 수 없습니다."));
      const back = makeCell("a", "목록으로 돌아가기");
      back.href = "news.html";
      detail.appendChild(back);
      return;
    }

    const title = makeCell("h3", notice.title);
    title.style.fontSize = "20px";
    title.style.margin = "0 0 10px";
    detail.appendChild(title);

    const meta = makeCell("p", `${notice.category || "공지"}　|　${notice.date || ""}`);
    meta.style.color = "#74808a";
    meta.style.fontSize = "12px";
    meta.style.borderBottom = "1px solid #dce1e5";
    meta.style.paddingBottom = "13px";
    detail.appendChild(meta);

    const body = makeCell("div", notice.body || "");
    body.style.whiteSpace = "pre-wrap";
    body.style.lineHeight = "2";
    body.style.minHeight = "130px";
    body.style.padding = "12px 0 25px";
    detail.appendChild(body);

    const back = makeCell("a", "← 공지사항 목록");
    back.href = "news.html";
    back.className = "back-link";
    detail.appendChild(back);
  }

  async function init() {
    const homeRows = $("homeNoticeRows");
    const newsRows = $("noticeRows");
    if (!homeRows && !newsRows) return;

    try {
      const notices = await fetchNotices();
      if (homeRows) renderHome(notices);
      if (newsRows) {
        renderNewsList(notices);
        renderNoticeDetail(notices);
      }
    } catch (error) {
      const message = "공지사항을 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.";
      if (homeRows) showError(homeRows, message);
      if (newsRows) showError(newsRows, message);
      console.error("공지사항 API 오류:", error);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
