const STORAGE_KEY = "pv-middle-be-gov-v1";
const CUSTOM_KEY = "pv-middle-be-gov-custom-v1";

const BASE_MODULES = MODULES.map((mod) => ({
  ...mod,
  theory: mod.theory.map((block) => ({ ...block })),
  questions: mod.questions.map((item) => ({ ...item })),
  quiz: (mod.quiz || []).map((item) => ({ ...item, options: [...item.options] })),
}));

let custom = loadCustom();

const state = {
  moduleId: (MODULES.find((mod) => mod.id === "lo-trinh") || MODULES[0]).id,
  level: "all",
  query: "",
  done: loadDone(),
  screen: null,
  draft: null,
  formError: "",
  notice: "",
};

function loadDone() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function saveDone() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...state.done]));
}

function emptyCustom() {
  return { modules: [], extras: {}, notes: {} };
}

function loadCustom() {
  try {
    const data = JSON.parse(localStorage.getItem(CUSTOM_KEY) || "{}");
    return {
      modules: Array.isArray(data.modules) ? data.modules : [],
      extras: data.extras && typeof data.extras === "object" ? data.extras : {},
      notes: data.notes && typeof data.notes === "object" ? data.notes : {},
    };
  } catch {
    return emptyCustom();
  }
}

function persistCustom() {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom));
}

function newId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function applyCustom() {
  const merged = BASE_MODULES.map((mod) => {
    const extra = custom.extras[mod.id] || { theory: [], questions: [] };
    return {
      ...mod,
      theory: [
        ...mod.theory.map((block) => ({ ...block })),
        ...(extra.theory || []).map((block) => ({ ...block, custom: true })),
      ],
      questions: [
        ...mod.questions.map((item, index) => ({ ...item, _key: `base:${mod.id}:${index}` })),
        ...(extra.questions || []).map((item) => ({ ...item, custom: true, _key: item.id })),
      ],
      quiz: mod.quiz.map((item) => ({ ...item, options: [...item.options] })),
    };
  });
  for (const mod of custom.modules) {
    merged.push({
      ...mod,
      custom: true,
      theory: (mod.theory || []).map((block) => ({ ...block, custom: true })),
      questions: (mod.questions || []).map((item) => ({ ...item, custom: true, _key: item.id })),
      quiz: [],
    });
  }
  MODULES.length = 0;
  for (const mod of merged) MODULES.push(mod);
  if (!MODULES.some((mod) => mod.id === state.moduleId)) state.moduleId = MODULES[0].id;
}

function $(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function textToHtml(value) {
  const source = String(value || "").trim();
  if (!source) return "";
  return source
    .split(/\n{2,}/)
    .map((part) => `<p>${escapeHtml(part).replaceAll("\n", "<br>")}</p>`)
    .join("");
}

function ownedModule(id) {
  return custom.modules.find((mod) => mod.id === id);
}

function extraBucket(moduleId) {
  if (!custom.extras[moduleId]) custom.extras[moduleId] = { theory: [], questions: [] };
  return custom.extras[moduleId];
}

function listFor(moduleId, kind) {
  const owned = ownedModule(moduleId);
  if (owned) {
    owned[kind] = owned[kind] || [];
    return owned[kind];
  }
  const bucket = extraBucket(moduleId);
  bucket[kind] = bucket[kind] || [];
  return bucket[kind];
}

function removeItem(moduleId, kind, id) {
  const list = listFor(moduleId, kind);
  const index = list.findIndex((item) => item.id === id);
  if (index >= 0) list.splice(index, 1);
}

function blankDraft(kind, moduleId) {
  return {
    kind,
    id: "",
    originModuleId: moduleId,
    moduleId,
    level: "Trung cấp",
    group: "Ghi chú của tôi",
    title: "",
    summary: "",
    h: "",
    q: "",
    text: "",
    tip: "",
  };
}

function renderNav() {
  const nav = $("nav");
  const groups = [];
  for (const mod of MODULES) {
    if (!groups.includes(mod.group)) groups.push(mod.group);
  }
  nav.innerHTML = groups
    .map((group) => {
      const items = MODULES.filter((m) => m.group === group)
        .map((mod) => {
          const done = state.done.has(mod.id) ? "done" : "";
          const active = state.moduleId === mod.id && !state.query && state.screen !== "editor" ? "active" : "";
          const mine = mod.custom ? " · của bạn" : "";
          return `<button type="button" class="${done} ${active}" data-id="${mod.id}"><span class="dot"></span><span>${escapeHtml(mod.title)}${mine}</span></button>`;
        })
        .join("");
      return `<div class="nav-group">${escapeHtml(group)}</div>${items}`;
    })
    .join("");
  const learned = MODULES.filter((m) => state.done.has(m.id)).length;
  $("progress-text").textContent = `${learned}/${MODULES.length}`;
  $("progress-bar").style.width = `${(learned / MODULES.length) * 100}%`;
  const exp = $("exp-tab");
  if (exp) {
    exp.classList.toggle(
      "active",
      state.moduleId === "kinh-nghiem" && !state.query.trim() && state.screen !== "editor"
    );
  }
}

function levelBadge(level) {
  const cls = level === "Nâng cao" ? "adv" : level === "Trung cấp" ? "warn" : "";
  return `<span class="badge ${cls}">${escapeHtml(level)}</span>`;
}

function customActions(actionEdit, actionDelete, id, moduleId) {
  return `<button type="button" class="ghost" data-action="${actionEdit}" data-id="${id}" data-module="${moduleId}">Sửa</button>
    <button type="button" class="danger" data-action="${actionDelete}" data-id="${id}" data-module="${moduleId}">Xóa</button>`;
}

function renderTheory(mod) {
  if (!mod.theory.length) return `<p class="empty">Chưa có mục lý thuyết.</p>`;
  return mod.theory
    .map((block) => {
      const mine = block.custom ? `<span class="badge mine">Bạn thêm</span>` : "";
      const actions = block.custom
        ? `<div class="inline-actions">${customActions("edit-theory", "delete-theory", block.id, mod.id)}</div>`
        : "";
      return `<article class="card theory" data-side="${escapeHtml(block.h)}">${mine ? `<div class="q-meta">${mine}</div>` : ""}<h3>${escapeHtml(block.h)}</h3>${block.html || textToHtml(block.text)}${actions}</article>`;
    })
    .join("");
}

function renderQuestions(mod) {
  const questions = mod.questions.filter((q) => state.level === "all" || q.level === state.level);
  if (!questions.length) return `<p class="empty">Chương này không có câu ở mức đang lọc.</p>`;
  return questions
    .map((item, index) => {
      const key = item._key || `${mod.id}-${index}`;
      const note = custom.notes[key] || "";
      const mine = item.custom ? `<span class="badge mine">Bạn thêm</span>` : "";
      const noted = note.trim() ? `<span class="badge mine">Có ghi chú</span>` : "";
      const actions = item.custom
        ? customActions("edit-question", "delete-question", item.id, mod.id)
        : "";
      return `<article class="card q-card" data-q="${key}">
        <div class="q-head">
          <div class="q-meta">${levelBadge(item.level)}${mine}${noted}<span class="badge">Câu ${index + 1}</span></div>
          <h3>${escapeHtml(item.q)}</h3>
        </div>
        <div class="q-actions">
          <button type="button" class="reveal" data-reveal="${key}">Xem đáp án</button>
          ${actions}
        </div>
        <div class="answer">
          ${item.html || textToHtml(item.text)}
          ${item.tip ? `<div class="tip"><strong>Cách nói trong phòng phỏng vấn.</strong> ${escapeHtml(item.tip)}</div>` : ""}
          <div class="note-box">
            <label class="field">Ghi chú của bạn
              <textarea data-note="${escapeHtml(key)}" placeholder="Thêm ví dụ dự án của bạn, thuật ngữ cần nhớ, hoặc câu trả lời theo cách bạn nói...">${escapeHtml(note)}</textarea>
            </label>
            <p class="note-status" hidden>Đã lưu trên trình duyệt này.</p>
          </div>
        </div>
      </article>`;
    })
    .join("");
}

function renderQuiz(mod) {
  if (!mod.quiz?.length) return "";
  return `<h3 class="section-title">Tự kiểm tra</h3>${mod.quiz
    .map((item, index) => {
      const key = `${mod.id}-quiz-${index}`;
      const options = item.options
        .map(
          (opt, optIndex) =>
            `<button type="button" class="quiz-opt" data-quiz="${key}" data-pick="${optIndex}" data-correct="${item.correct}">${escapeHtml(opt)}</button>`
        )
        .join("");
      return `<article class="card"><h3>${index + 1}. ${escapeHtml(item.q)}</h3>${options}<p class="explain" id="ex-${key}" hidden>${escapeHtml(item.explain)}</p></article>`;
    })
    .join("")}`;
}

function moduleOptions(selected) {
  return MODULES.map(
    (mod) => `<option value="${escapeHtml(mod.id)}" ${mod.id === selected ? "selected" : ""}>${escapeHtml(mod.group)} — ${escapeHtml(mod.title)}</option>`
  ).join("");
}

function levelOptions(selected) {
  return ["Cơ bản", "Trung cấp", "Nâng cao"]
    .map((level) => `<option value="${level}" ${level === selected ? "selected" : ""}>${level}</option>`)
    .join("");
}

function renderEditor() {
  const draft = state.draft;
  const editing = Boolean(draft.id);
  const groups = [...new Set(MODULES.map((mod) => mod.group).concat("Ghi chú của tôi"))];
  const fields = {
    question: `
      <label class="field">Chương
        <select name="moduleId">${moduleOptions(draft.moduleId)}</select>
      </label>
      <label class="field">Mức
        <select name="level">${levelOptions(draft.level)}</select>
      </label>
      <label class="field">Câu hỏi
        <textarea name="q" required placeholder="Ví dụ: Idempotency là gì?">${escapeHtml(draft.q)}</textarea>
      </label>
      <label class="field">Đáp án
        <textarea name="text" required placeholder="Viết đáp án. Xuống dòng hai lần để tách đoạn.">${escapeHtml(draft.text)}</textarea>
      </label>
      <label class="field">Cách nói ngắn (không bắt buộc)
        <input name="tip" value="${escapeHtml(draft.tip)}" placeholder="Một câu nhắc khi đứng trước interviewer" />
      </label>`,
    theory: `
      <label class="field">Chương
        <select name="moduleId">${moduleOptions(draft.moduleId)}</select>
      </label>
      <label class="field">Tiêu đề mục
        <input name="h" required value="${escapeHtml(draft.h)}" placeholder="Ví dụ: Transaction trong dự án của tôi" />
      </label>
      <label class="field">Nội dung
        <textarea name="text" required placeholder="Viết lý thuyết bằng chữ thường. Xuống dòng hai lần để tách đoạn.">${escapeHtml(draft.text)}</textarea>
      </label>`,
    module: `
      <label class="field">Nhóm trong mục lục
        <input name="group" list="group-list" required value="${escapeHtml(draft.group)}" />
        <datalist id="group-list">${groups.map((group) => `<option value="${escapeHtml(group)}"></option>`).join("")}</datalist>
      </label>
      <label class="field">Tên chương
        <input name="title" required value="${escapeHtml(draft.title)}" placeholder="Ví dụ: Dự án liên thông của tôi" />
      </label>
      <label class="field">Mức
        <select name="level">${levelOptions(draft.level)}</select>
      </label>
      <label class="field">Mô tả ngắn
        <textarea name="summary" required placeholder="Chương này để ôn điều gì?">${escapeHtml(draft.summary)}</textarea>
      </label>`,
  };
  const ownCount = custom.modules.length + Object.values(custom.extras).reduce((sum, bucket) => sum + (bucket.theory?.length || 0) + (bucket.questions?.length || 0), 0);
  $("content").className = "content";
  $("content").innerHTML = `
    <p class="kicker">Ghi chú của bạn</p>
    <h2>${editing ? "Cập nhật nội dung" : "Thêm mới"}</h2>
    <p class="lead">Phần bạn thêm được lưu trên trình duyệt này, tách khỏi bài có sẵn. Xuất file JSON nếu đổi máy hoặc xóa dữ liệu duyệt web.</p>
    <div class="tabs">
      <button type="button" class="chip ${draft.kind === "question" ? "active" : ""}" data-kind="question">Câu hỏi và đáp án</button>
      <button type="button" class="chip ${draft.kind === "theory" ? "active" : ""}" data-kind="theory">Mục lý thuyết</button>
      <button type="button" class="chip ${draft.kind === "module" ? "active" : ""}" data-kind="module">Chương mới</button>
    </div>
    <form class="card" id="editor-form">
      ${fields[draft.kind]}
      ${state.formError ? `<p class="form-error">${escapeHtml(state.formError)}</p>` : ""}
      <div class="form-actions">
        <button class="done-btn" type="submit">${editing ? "Cập nhật" : "Lưu"}</button>
        <button class="ghost" type="button" data-action="close-editor">Hủy</button>
        <button class="ghost" type="button" data-action="export-notes">Xuất file JSON</button>
        <button class="ghost" type="button" data-action="pick-import">Nhập file JSON</button>
      </div>
      <input id="import-file" type="file" accept="application/json,.json" hidden />
    </form>
    <p class="empty">Đang có ${ownCount} mục bạn tự thêm. Ghi chú gắn dưới từng đáp án được lưu riêng khi bạn rời ô chữ.</p>
  `;
  $("done-btn").hidden = true;
}

let railObserver = null;

function panelFor(moduleId, heading) {
  const book = window.SIDE_PANELS || {};
  const chapter = book[moduleId] || {};
  return chapter[heading] || chapter.default || book.default;
}

function renderRail(heading) {
  const rail = $("rail");
  if (!rail) return;
  document.querySelectorAll(".theory[data-side]").forEach((card) => {
    card.classList.toggle("is-current", card.dataset.side === heading);
  });
  const panel = panelFor(state.moduleId, heading);
  if (!panel) {
    rail.innerHTML = "";
    return;
  }
  const steps = (panel.steps || [])
    .map((step, index, all) => {
      const node = `<div class="node"><strong>${escapeHtml(step.name)}</strong>${step.note ? `<span>${escapeHtml(step.note)}</span>` : ""}</div>`;
      const arrow = index < all.length - 1 ? `<div class="arrow">${escapeHtml(step.arrow || "xuống")}</div>` : "";
      return node + arrow;
    })
    .join("");
  rail.innerHTML = `
    <article class="card">
      <p class="rail-label">Mô hình</p>
      <h3>${escapeHtml(panel.title || heading)}</h3>
      ${panel.note ? `<p>${escapeHtml(panel.note)}</p>` : ""}
      <div class="flow">${steps}</div>
    </article>
    ${
      panel.code
        ? `<article class="card"><p class="rail-label">Code ví dụ</p><h3>${escapeHtml(panel.codeTitle || "Ví dụ")}</h3><pre><code>${escapeHtml(panel.code)}</code></pre></article>`
        : ""
    }
  `;
}

function syncRail() {
  const cards = [...document.querySelectorAll(".theory[data-side]")];
  if (!cards.length || !$("rail")) return;
  let chosen = cards[0];
  for (const card of cards) {
    if (card.getBoundingClientRect().top < 180) chosen = card;
  }
  if (chosen.dataset.side === state.railKey) return;
  state.railKey = chosen.dataset.side;
  renderRail(chosen.dataset.side);
}

if (!window.__railScroll) {
  window.__railScroll = () => syncRail();
  window.addEventListener("scroll", window.__railScroll, { passive: true });
}

function watchRail() {
  if (railObserver) railObserver.disconnect();
  state.railKey = "";
  syncRail();
  const cards = [...document.querySelectorAll(".theory[data-side]")];
  railObserver = new IntersectionObserver(
    (entries) => {
      const hits = entries.filter((entry) => entry.isIntersecting);
      if (!hits.length) return;
      const latest = hits.sort((a, b) => b.time - a.time)[0];
      const side = latest.target.dataset.side;
      if (side === state.railKey) return;
      state.railKey = side;
      renderRail(side);
    },
    { rootMargin: "-70px 0px -60% 0px", threshold: 0 }
  );
  cards.forEach((card) => railObserver.observe(card));
}

function renderModule() {
  const mod = MODULES.find((m) => m.id === state.moduleId);
  const done = state.done.has(mod.id);
  $("done-btn").textContent = done ? "Đã học chương này" : "Đánh dấu đã học";
  $("done-btn").classList.toggle("is-done", done);
  $("done-btn").hidden = false;
  const moduleActions = mod.custom
    ? `<div class="inline-actions">
        <button type="button" class="ghost" data-action="edit-module" data-id="${mod.id}">Sửa chương</button>
        <button type="button" class="danger" data-action="delete-module" data-id="${mod.id}">Xóa chương</button>
      </div>`
    : "";
  const notice = state.notice ? `<p class="notice">${escapeHtml(state.notice)}</p>` : "";
  state.notice = "";
  $("content").className = "content with-rail";
  $("content").innerHTML = `
    <div class="reading">
      <p class="kicker">${escapeHtml(mod.group)}</p>
      <h2>${escapeHtml(mod.title)}</h2>
      <p class="lead">${escapeHtml(mod.summary)}</p>
      ${notice}
      <div class="badges">${levelBadge(mod.level)}<span class="badge">${mod.questions.length} câu hỏi</span>${mod.custom ? `<span class="badge mine">Chương của bạn</span>` : ""}</div>
      ${moduleActions}
      <div class="inline-actions">
        <button type="button" class="ghost" data-action="add-question">Thêm câu hỏi vào chương này</button>
        <button type="button" class="ghost" data-action="add-theory">Thêm mục lý thuyết</button>
      </div>
      <h3 class="section-title">Lý thuyết</h3>
      ${renderTheory(mod)}
      <h3 class="section-title">Câu hỏi phỏng vấn</h3>
      ${renderQuestions(mod)}
      ${renderQuiz(mod)}
    </div>
    <aside class="rail" id="rail" aria-label="Mô hình và code ví dụ"></aside>
  `;
  const first = mod.theory[0]?.h || "";
  renderRail(first);
  watchRail();
}

function renderSearch() {
  const q = state.query.trim().toLowerCase();
  $("done-btn").hidden = true;
  const hits = [];
  for (const mod of MODULES) {
    for (const item of mod.questions) {
      const blob = `${item.q} ${item.html || ""} ${item.text || ""} ${item.tip || ""}`.toLowerCase();
      if (!blob.includes(q)) continue;
      if (state.level !== "all" && item.level !== state.level) continue;
      hits.push({ mod, item });
    }
  }
  $("content").className = "content";
  $("content").innerHTML = `
    <p class="kicker">Tìm kiếm</p>
    <h2>${hits.length} kết quả</h2>
    <p class="lead">Bấm một kết quả để mở chương và đọc đáp án.</p>
    ${
      hits.length
        ? hits
            .map(
              (hit) => `<article class="card search-hit" data-open="${hit.mod.id}">
                <div class="q-meta">${levelBadge(hit.item.level)}<span class="badge">${escapeHtml(hit.mod.title)}</span></div>
                <h3>${escapeHtml(hit.item.q)}</h3>
              </article>`
            )
            .join("")
        : `<p class="empty">Không thấy câu nào khớp.</p>`
    }
  `;
}

function render() {
  renderNav();
  if (state.screen === "editor") renderEditor();
  else if (state.query.trim()) renderSearch();
  else renderModule();
}

function openEditor(draft) {
  state.screen = "editor";
  state.draft = draft;
  state.formError = "";
  state.query = "";
  $("search").value = "";
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function readForm(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function saveEditor(form) {
  const data = { ...state.draft, ...readForm(form) };
  const text = (data.text || "").trim();
  if (data.kind === "module") {
    if (!data.title.trim() || !data.summary.trim() || !data.group.trim()) {
      state.formError = "Điền nhóm, tên chương và mô tả.";
      state.draft = data;
      render();
      return;
    }
    if (data.id) {
      const mod = ownedModule(data.id);
      mod.group = data.group.trim();
      mod.title = data.title.trim();
      mod.level = data.level;
      mod.summary = data.summary.trim();
      state.moduleId = mod.id;
    } else {
      const mod = {
        id: newId("chuong"),
        group: data.group.trim(),
        title: data.title.trim(),
        level: data.level,
        summary: data.summary.trim(),
        theory: [],
        questions: [],
      };
      custom.modules.push(mod);
      state.moduleId = mod.id;
    }
    state.notice = "Đã lưu chương. Bạn có thể thêm câu hỏi hoặc mục lý thuyết ngay bên dưới.";
  } else if (data.kind === "question") {
    if (!data.q.trim() || !text) {
      state.formError = "Điền cả câu hỏi và đáp án.";
      state.draft = data;
      render();
      return;
    }
    const item = {
      id: data.id || newId("cau"),
      level: data.level,
      q: data.q.trim(),
      text,
      tip: (data.tip || "").trim(),
    };
    if (data.id && data.originModuleId && data.originModuleId !== data.moduleId) {
      removeItem(data.originModuleId, "questions", data.id);
    }
    const list = listFor(data.moduleId, "questions");
    const index = list.findIndex((question) => question.id === item.id);
    if (index >= 0) list[index] = item;
    else list.push(item);
    state.moduleId = data.moduleId;
    state.notice = "Đã lưu câu hỏi.";
  } else {
    if (!data.h.trim() || !text) {
      state.formError = "Điền tiêu đề và nội dung lý thuyết.";
      state.draft = data;
      render();
      return;
    }
    const item = { id: data.id || newId("ly"), h: data.h.trim(), text };
    if (data.id && data.originModuleId && data.originModuleId !== data.moduleId) {
      removeItem(data.originModuleId, "theory", data.id);
    }
    const list = listFor(data.moduleId, "theory");
    const index = list.findIndex((block) => block.id === item.id);
    if (index >= 0) list[index] = item;
    else list.push(item);
    state.moduleId = data.moduleId;
    state.notice = "Đã lưu mục lý thuyết.";
  }
  persistCustom();
  applyCustom();
  state.screen = null;
  state.draft = null;
  state.formError = "";
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function exportNotes() {
  const blob = new Blob([JSON.stringify(custom, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "so-tay-ghi-chu.json";
  link.click();
  URL.revokeObjectURL(link.href);
}

function importNotes(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result || ""));
      if (!data || typeof data !== "object" || (!Array.isArray(data.modules) && !data.extras && !data.notes)) {
        throw new Error("định dạng");
      }
      const replace = confirm("Thay toàn bộ ghi chú đang có trên trình duyệt bằng file này?");
      if (!replace) return;
      custom = {
        modules: Array.isArray(data.modules) ? data.modules : [],
        extras: data.extras && typeof data.extras === "object" ? data.extras : {},
        notes: data.notes && typeof data.notes === "object" ? data.notes : {},
      };
      persistCustom();
      applyCustom();
      state.screen = null;
      state.notice = "Đã nhập ghi chú từ file.";
      render();
    } catch {
      state.formError = "Không đọc được file. Hãy chọn đúng file JSON đã xuất từ trang này.";
      render();
    }
  };
  reader.readAsText(file);
}

function findQuestion(moduleId, id) {
  return listFor(moduleId, "questions").find((item) => item.id === id);
}

function findTheory(moduleId, id) {
  return listFor(moduleId, "theory").find((item) => item.id === id);
}

document.addEventListener("click", (event) => {
  const navBtn = event.target.closest("#nav button");
  if (navBtn) {
    state.moduleId = navBtn.dataset.id;
    state.query = "";
    state.screen = null;
    $("search").value = "";
    $("sidebar").classList.remove("open");
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const tab = event.target.closest("[data-tab]");
  if (tab) {
    state.moduleId = tab.dataset.tab;
    state.query = "";
    state.screen = null;
    $("search").value = "";
    $("sidebar").classList.remove("open");
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const kind = event.target.closest("[data-kind]");
  if (kind && state.screen === "editor") {
    const form = $("editor-form");
    state.draft = { ...state.draft, ...readForm(form), kind: kind.dataset.kind, id: "" };
    state.formError = "";
    render();
    return;
  }

  const chip = event.target.closest("#filters .chip");
  if (chip && chip.dataset.level) {
    state.level = chip.dataset.level;
    document.querySelectorAll("#filters .chip[data-level]").forEach((el) => el.classList.toggle("active", el === chip));
    render();
    return;
  }

  const actionEl = event.target.closest("[data-action]");
  if (actionEl) {
    const { action, id, module: moduleId } = actionEl.dataset;
    if (action === "close-editor") {
      state.screen = null;
      state.formError = "";
      render();
      return;
    }
    if (action === "export-notes") {
      exportNotes();
      return;
    }
    if (action === "pick-import") {
      $("import-file").click();
      return;
    }
    if (action === "add-question") {
      openEditor(blankDraft("question", state.moduleId));
      return;
    }
    if (action === "add-theory") {
      openEditor(blankDraft("theory", state.moduleId));
      return;
    }
    if (action === "edit-question") {
      const item = findQuestion(moduleId, id);
      openEditor({ ...blankDraft("question", moduleId), ...item, originModuleId: moduleId, kind: "question" });
      return;
    }
    if (action === "edit-theory") {
      const item = findTheory(moduleId, id);
      openEditor({ ...blankDraft("theory", moduleId), ...item, text: item.text || "", originModuleId: moduleId, kind: "theory" });
      return;
    }
    if (action === "edit-module") {
      const mod = ownedModule(id);
      openEditor({ ...blankDraft("module", id), ...mod, kind: "module", id: mod.id, originModuleId: id });
      return;
    }
    if (action === "delete-question" && confirm("Xóa câu hỏi này?")) {
      removeItem(moduleId, "questions", id);
      persistCustom();
      applyCustom();
      render();
      return;
    }
    if (action === "delete-theory" && confirm("Xóa mục lý thuyết này?")) {
      removeItem(moduleId, "theory", id);
      persistCustom();
      applyCustom();
      render();
      return;
    }
    if (action === "delete-module" && confirm("Xóa cả chương bạn đã thêm?")) {
      custom.modules = custom.modules.filter((mod) => mod.id !== id);
      persistCustom();
      applyCustom();
      state.notice = "Đã xóa chương.";
      render();
    }
    return;
  }

  const reveal = event.target.closest("[data-reveal]");
  if (reveal) {
    const card = reveal.closest(".q-card");
    const open = card.classList.toggle("open");
    reveal.textContent = open ? "Ẩn đáp án" : "Xem đáp án";
    return;
  }

  const quiz = event.target.closest("[data-quiz]");
  if (quiz) {
    const key = quiz.dataset.quiz;
    const wrap = quiz.parentElement;
    wrap.querySelectorAll(".quiz-opt").forEach((btn) => {
      btn.disabled = true;
      if (Number(btn.dataset.pick) === Number(btn.dataset.correct)) btn.classList.add("correct");
    });
    if (Number(quiz.dataset.pick) !== Number(quiz.dataset.correct)) quiz.classList.add("wrong");
    document.getElementById(`ex-${key}`).hidden = false;
    return;
  }

  const hit = event.target.closest("[data-open]");
  if (hit) {
    state.moduleId = hit.dataset.open;
    state.query = "";
    state.screen = null;
    $("search").value = "";
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.id !== "editor-form") return;
  event.preventDefault();
  saveEditor(event.target);
});

document.addEventListener("change", (event) => {
  if (event.target.id !== "import-file" || !event.target.files[0]) return;
  importNotes(event.target.files[0]);
  event.target.value = "";
});

document.addEventListener("focusout", (event) => {
  const box = event.target.closest("[data-note]");
  if (!box) return;
  custom.notes[box.dataset.note] = box.value;
  persistCustom();
  const status = box.closest(".note-box").querySelector(".note-status");
  status.hidden = false;
});

$("search").addEventListener("input", (event) => {
  state.query = event.target.value;
  state.screen = null;
  render();
});

$("done-btn").addEventListener("click", () => {
  if (state.done.has(state.moduleId)) state.done.delete(state.moduleId);
  else state.done.add(state.moduleId);
  saveDone();
  render();
});

$("add-btn").addEventListener("click", () => {
  openEditor(blankDraft("question", state.moduleId));
});

$("menu-btn").addEventListener("click", () => {
  $("sidebar").classList.toggle("open");
});

applyCustom();
render();
