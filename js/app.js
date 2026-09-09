/* ============================================================
   app.js - logika utama Physics Sandbox
   ============================================================ */

const STORAGE_KEY_BACKEND = "physicsSandbox.backendUrl";
const STORAGE_KEY_GEMINI = "physicsSandbox.geminiApiKey";
const STORAGE_KEY_PROGRESS = "physicsSandbox.progress";
const STORAGE_KEY_UNLOCK_ALL = "physicsSandbox.unlockAll";
const STORAGE_KEY_ROLE = "physicsSandbox.userRole"; // "student" | "guest"
const STORAGE_KEY_STUDENT_NAME = "physicsSandbox.studentName";
const STORAGE_KEY_STUDENT_CLASS = "physicsSandbox.studentClass";
let currentTopic = null;
let lastGeneratedHTML = "";
let editCount = 0;
const MAX_FOLLOWUP_EDITS = 5;

/* ============================================================
   Navigasi bertahap (sesuai sintaks pembelajaran)
   ------------------------------------------------------------
   Kuncinya PER TOPIK, bukan antar-topik: siswa boleh mulai dari
   topik mana saja (mis. langsung ke Magnetic Fields tanpa perlu
   menyelesaikan Kinematics dulu), tapi begitu masuk ke sebuah
   topik "ready", tab di dalamnya (Materi -> Eksperimen -> Latihan
   Soal -> Lab Simulasi Virtual) tetap harus dibuka BERURUTAN
   supaya sesuai sintaks inkuiri. Guru bisa membagikan
   TEACHER_UNLOCK_CODE (di js/config.js) untuk siswa yang perlu
   menjelajah bebas tanpa urutan sama sekali.
   ============================================================ */
const TAB_ORDER = ["materi", "eksperimen", "latihan", "lab"];
const TAB_LABELS = { materi: t("tab.materi"), eksperimen: t("tab.eksperimen"), latihan: t("tab.latihan"), lab: t("tab.lab") };

function isUnlockAll() {
  return localStorage.getItem(STORAGE_KEY_UNLOCK_ALL) === "true";
}
function getProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_PROGRESS) || "{}"); }
  catch (e) { return {}; }
}
function saveProgress(p) {
  localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(p));
}
function getReadyTopicsOrder() {
  return TOPICS.filter(tp => tp.status === "ready").sort((a, b) => a.number - b.number).map(tp => tp.id);
}
// Mengembalikan index tab tertinggi (di TAB_ORDER) yang boleh dibuka untuk
// sebuah topik. Setiap topik "ready" SELALU boleh dimulai (index 0 = tab
// Materi), tidak bergantung pada progres topik lain sama sekali.
function getUnlockedTabIndex(topicId) {
  if (isUnlockAll()) return TAB_ORDER.length - 1;
  const progress = getProgress();
  return progress[topicId] !== undefined ? progress[topicId] : 0;
}
function isTabLocked(topicId, tabName) {
  const topic = TOPICS.find(tp => tp.id === topicId);
  if (!topic || topic.status !== "ready") return false;
  // Sesi kelas aktif (dari guru) mengalahkan semua gembok lain (termasuk
  // Kode Eksplorasi Bebas) - selama tergabung, HANYA tab yang sedang
  // ditentukan guru untuk topik ini yang boleh dibuka.
  if (isInClassSession()) {
    if (topicId !== classSession.topicId) return true;
    return TAB_ORDER.indexOf(tabName) !== classSession.tabIndex;
  }
  const unlocked = getUnlockedTabIndex(topicId);
  return TAB_ORDER.indexOf(tabName) > unlocked;
}
function advanceProgress(topicId, tabIndexReached) {
  const progress = getProgress();
  const current = progress[topicId] !== undefined ? progress[topicId] : -1;
  progress[topicId] = Math.max(current, Math.min(tabIndexReached, TAB_ORDER.length - 1));
  saveProgress(progress);
}
function nextReadyTopicId(topicId) {
  const order = getReadyTopicsOrder();
  const idx = order.indexOf(topicId);
  if (idx < 0 || idx >= order.length - 1) return null;
  return order[idx + 1];
}

/* ============================================================
   Sesi Kelas (real-time, dari Panel Guru)
   ------------------------------------------------------------
   Kalau guru sedang menjalankan sesi kelas dan siswa sudah gabung
   (memasukkan kode lewat Pengaturan), browser siswa polling
   backend tiap ~12 detik: melaporkan aktivitas mereka saat ini
   (buat panel guru) DAN mengambil aktivitas yang sedang WAJIB
   dikerjakan bareng. Selama tergabung & sesi aktif, ini
   MENGALAHKAN semua gembok lain (isTabLocked di atas sudah
   menangani ini) - topik lain juga disembunyikan/dikunci di
   renderNav supaya siswa benar-benar fokus ke satu aktivitas.
   ============================================================ */
const STORAGE_KEY_STUDENT_ID = "physicsSandbox.studentId";
const STORAGE_KEY_CLASS_CODE = "physicsSandbox.classSessionCode";
const CLASS_SYNC_INTERVAL_MS = 12000;

let classSession = null; // {active, code, topicId, tabIndex, updatedAt} dari server terakhir
let classSyncTimer = null;
let lastClassActivityKey = null; // untuk deteksi kapan guru GANTI aktivitas

function getUserRole() {
  return localStorage.getItem(STORAGE_KEY_ROLE) || "";
}
function getStudentName() {
  return (localStorage.getItem(STORAGE_KEY_STUDENT_NAME) || "").trim();
}
function getStudentClass() {
  return (localStorage.getItem(STORAGE_KEY_STUDENT_CLASS) || "").trim();
}
// Kalau siswa sudah isi nama+kelas manual (langkah wajib di gate), pakai itu
// sebagai identitas di roster Panel Guru (bukan ID anonim lagi) - supaya guru
// benar-benar tahu itu progres siapa. Fallback ID anonim tetap ada untuk
// kasus lain (mis. peran "bukan siswa" yang kebetulan ikut sebuah sesi kelas).
function getStudentId() {
  const name = getStudentName();
  if (name) {
    const cls = getStudentClass();
    return cls ? `${name} (${cls})` : name;
  }
  let id = localStorage.getItem(STORAGE_KEY_STUDENT_ID);
  if (!id) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let suffix = "";
    for (let i = 0; i < 4; i++) suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    id = "Siswa-" + suffix;
    localStorage.setItem(STORAGE_KEY_STUDENT_ID, id);
  }
  return id;
}
function getJoinedSessionCode() {
  return (localStorage.getItem(STORAGE_KEY_CLASS_CODE) || "").trim();
}
function isInClassSession() {
  return !!(classSession && classSession.active && getJoinedSessionCode() &&
    classSession.code && classSession.code.toUpperCase() === getJoinedSessionCode().toUpperCase());
}
function leaveClassSession(message) {
  localStorage.removeItem(STORAGE_KEY_CLASS_CODE);
  classSession = null;
  lastClassActivityKey = null;
  stopClassSync();
  renderNav();
  if (currentTopic) {
    const activeTab = document.querySelector(".tab-btn.active")?.dataset.tab;
    if (activeTab) updateTopicProgressUI(activeTab);
  }
  refreshClassSessionUI();
  updateClassSessionBanner();
  if (message) showToast(message);
  // Kalau perannya siswa, situs WAJIB kembali terkunci di gate (minta kode
  // baru) begitu sesi berakhir/tidak valid lagi - bukan cuma kembali ke mode
  // belajar mandiri seperti sebelumnya. Peran "bukan siswa" tidak terpengaruh
  // (aksesnya tetap lewat Kode Eksplorasi Bebas, tidak terkait sesi kelas).
  if (typeof applyGate === "function") applyGate();
}
// Mencoba gabung/menyambung ulang ke sebuah kode sesi kelas lewat backend.
// Dipakai baik oleh langkah wajib di gate maupun tombol "Gabung" di
// Pengaturan. Mengembalikan {ok:true} atau {ok:false, error}.
async function attemptJoinClassSession(code) {
  const trimmed = (code || "").trim();
  if (!trimmed) return { ok: false, error: t("gate.student.code.needcode") };
  const backendUrl = getBackendUrl();
  if (!backendUrl) return { ok: false, error: t("backend.notconfigured.short") };
  try {
    const resp = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ mode: "session_sync", code: trimmed, studentId: getStudentId(), topicId: null, tabIndex: null })
    });
    const data = await resp.json();
    if (data.error) return { ok: false, error: data.error };
    if (!data.active || !data.code || data.code.toUpperCase() !== trimmed.toUpperCase()) {
      localStorage.removeItem(STORAGE_KEY_CLASS_CODE);
      return { ok: false, error: t("classsession.wrongcode") };
    }
    localStorage.setItem(STORAGE_KEY_CLASS_CODE, trimmed);
    classSession = data;
    lastClassActivityKey = data.topicId + "|" + data.tabIndex;
    startClassSync();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: t("classsession.connectfailed", { err: err.message }) };
  }
}
function stopClassSync() {
  if (classSyncTimer) { clearInterval(classSyncTimer); classSyncTimer = null; }
}
function startClassSync() {
  stopClassSync();
  syncClassSession();
  classSyncTimer = setInterval(syncClassSession, CLASS_SYNC_INTERVAL_MS);
}
async function syncClassSession() {
  const backendUrl = getBackendUrl();
  const code = getJoinedSessionCode();
  if (!backendUrl || !code) return;
  try {
    const activeTabName = document.querySelector(".tab-btn.active")?.dataset.tab;
    const resp = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        mode: "session_sync",
        code: code,
        studentId: getStudentId(),
        topicId: currentTopic ? currentTopic.id : null,
        tabIndex: activeTabName ? TAB_ORDER.indexOf(activeTabName) : null
      })
    });
    const data = await resp.json();
    if (!data.active || !data.code || data.code.toUpperCase() !== code.toUpperCase()) {
      leaveClassSession(t("settings.classsession.left"));
      return;
    }
    classSession = data;
    const activityKey = data.topicId + "|" + data.tabIndex;
    const changed = activityKey !== lastClassActivityKey;
    lastClassActivityKey = activityKey;
    renderNav();
    updateClassSessionBanner();
    if (currentTopic) {
      const tabName = document.querySelector(".tab-btn.active")?.dataset.tab;
      if (tabName) updateTopicProgressUI(tabName);
    }
    // Baru gabung, atau guru baru saja ganti aktivitas -> langsung antar
    // siswa ke sana supaya semua benar-benar mulai bersamaan.
    if (changed) goToClassSessionActivity();
  } catch (err) {
    // Gagal konek sesekali (jaringan) bukan hal fatal - coba lagi di
    // polling berikutnya, jangan spam toast tiap 12 detik.
  }
}
function goToClassSessionActivity() {
  if (!isInClassSession() || !classSession.topicId) return;
  const tabName = TAB_ORDER[classSession.tabIndex] || "materi";
  if (!currentTopic || currentTopic.id !== classSession.topicId) {
    selectTopic(classSession.topicId); // aman: id di sini SAMA dengan tujuan yang diizinkan sesi
  }
  if (document.querySelector(".tab-btn.active")?.dataset.tab !== tabName) {
    switchTab(tabName);
  }
  updateClassSessionBanner();
}
function updateClassSessionBanner() {
  const banner = document.getElementById("class-session-banner");
  const textEl = document.getElementById("class-session-text");
  if (!isInClassSession() || !classSession.topicId) { banner.hidden = true; return; }
  const topic = TOPICS.find(tp => tp.id === classSession.topicId);
  const tabLabel = TAB_LABELS[TAB_ORDER[classSession.tabIndex]] || "";
  const onTarget = currentTopic && currentTopic.id === classSession.topicId &&
    document.querySelector(".tab-btn.active")?.dataset.tab === TAB_ORDER[classSession.tabIndex];
  if (onTarget) { banner.hidden = true; return; }
  textEl.textContent = t("classsession.bannertext", { topic: topic ? trContent(topic.title) : "", tab: tabLabel });
  banner.hidden = false;
}
document.getElementById("class-session-go-btn").addEventListener("click", goToClassSessionActivity);

function refreshClassSessionUI() {
  const statusText = document.getElementById("class-session-status-text");
  const joinRow = document.getElementById("class-session-join-row");
  const leaveBtn = document.getElementById("class-session-leave-btn");
  if (!statusText) return;
  if (isInClassSession()) {
    statusText.textContent = t("settings.classsession.joined");
    statusText.classList.add("ok");
    joinRow.hidden = true;
    leaveBtn.hidden = false;
  } else {
    statusText.textContent = t("settings.classsession.notjoined");
    statusText.classList.remove("ok");
    joinRow.hidden = false;
    leaveBtn.hidden = true;
  }
}
document.getElementById("class-session-join-btn").addEventListener("click", async () => {
  const input = document.getElementById("class-session-code-input");
  const statusText = document.getElementById("class-session-status-text");
  const val = input.value.trim();
  if (!val) return;
  statusText.textContent = t("gate.student.code.connecting");
  statusText.classList.remove("ok");
  const result = await attemptJoinClassSession(val);
  if (result.ok) {
    input.value = "";
  } else {
    showToast(result.error);
  }
  refreshClassSessionUI();
});
document.getElementById("class-session-leave-btn").addEventListener("click", () => {
  leaveClassSession(null);
});

let toastTimer = null;
function showToast(message) {
  let toast = document.getElementById("app-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "app-toast";
    toast.className = "app-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

function getBackendUrl() {
  return localStorage.getItem(STORAGE_KEY_BACKEND) || DEFAULT_BACKEND_URL || "";
}
function getGeminiApiKey() {
  return (localStorage.getItem(STORAGE_KEY_GEMINI) || "").trim();
}
function saveGeminiApiKey(key) {
  const trimmed = (key || "").trim();
  if (trimmed) localStorage.setItem(STORAGE_KEY_GEMINI, trimmed);
  else localStorage.removeItem(STORAGE_KEY_GEMINI);
  refreshKeyStatusUI();
}

/* ---------------- Header height (untuk offset sticky) ---------------- */
function syncHeaderHeight() {
  const header = document.querySelector(".site-header");
  if (header) {
    document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
  }
}
window.addEventListener("resize", syncHeaderHeight);

/* ---------------- Status API key (pill di header + banner lab) ---------------- */
function refreshKeyStatusUI() {
  const hasKey = !!getGeminiApiKey();
  const dot = document.getElementById("key-status-dot");
  const text = document.getElementById("key-status-text");
  const banner = document.getElementById("lab-key-banner");
  const settingsInput = document.getElementById("settings-key-input");

  if (dot) dot.classList.toggle("key-status-on", hasKey);
  if (text) text.textContent = hasKey ? t("header.keystatus.on") : t("header.keystatus.off");
  if (banner) banner.hidden = hasKey;
  if (settingsInput) settingsInput.value = getGeminiApiKey();
}

/* ---------------- Navigasi Topik ---------------- */
function renderNav() {
  const nav = document.getElementById("topic-nav");
  nav.innerHTML = "";
  ["AS", "A2"].forEach(level => {
    const groupTitle = document.createElement("div");
    groupTitle.className = "nav-group-title";
    groupTitle.textContent = level === "AS" ? t("nav.group.as") : t("nav.group.a2");
    nav.appendChild(groupTitle);

    TOPICS.filter(tp => tp.level === level).forEach(topic => {
      const btn = document.createElement("button");
      const blocked = isInClassSession() && topic.id !== classSession.topicId;
      const isSessionFocus = isInClassSession() && topic.id === classSession.topicId;
      btn.className = "nav-item" + (blocked ? " session-locked" : "") + (isSessionFocus ? " session-active" : "");
      btn.dataset.id = topic.id;
      btn.innerHTML =
        `<span class="dot ${topic.status === 'ready' ? 'dot-ready' : 'dot-soon'}"></span>` +
        `<span class="num">${topic.number}.</span>` +
        `<span class="label">${trContent(topic.title)}</span>` +
        (isSessionFocus ? `<span class="session-dot" title="${t("nav.sessiondot.title")}"></span>` : "");
      btn.addEventListener("click", () => {
        selectTopic(topic.id);
        btn.blur();
      });
      nav.appendChild(btn);
    });
  });
}

function selectTopic(id) {
  if (isInClassSession() && id !== classSession.topicId) {
    showToast(t("toast.classlocked"));
    return;
  }
  currentTopic = TOPICS.find(tp => tp.id === id);
  if (!currentTopic) return;

  document.querySelectorAll(".nav-item").forEach(el => {
    el.classList.toggle("active", el.dataset.id === id);
  });
  document.getElementById("welcome-panel").hidden = true;
  document.getElementById("topic-view").hidden = false;

  // Sidebar otomatis menyempit begitu sebuah topik aktif, supaya konten
  // punya lebih banyak ruang - tetap bisa dibuka lagi lewat hover/tombol pin.
  collapseSidebar();

  document.getElementById("topic-badge").innerHTML =
    `<span class="badge ${currentTopic.level === 'AS' ? 'badge-as' : 'badge-a2'}">${currentTopic.level}</span> ` +
    `<span class="badge ${currentTopic.status === 'ready' ? 'badge-ready' : 'badge-soon'}">${currentTopic.status === 'ready' ? t("badge.ready") : t("badge.soon")}</span>`;
  document.getElementById("topic-title").textContent = `${currentTopic.number}. ${trContent(currentTopic.title)}`;
  document.getElementById("topic-desc").textContent = trContent(currentTopic.desc);

  renderMateri();
  renderEksperimen();
  renderLatihan();
  setupLabForTopic();

  if (window.Chatbot) Chatbot.setTopic(currentTopic.id);

  // selalu kembali ke tab pertama saat pindah topik
  switchTab("materi");
  document.getElementById("content-area").scrollIntoView({ behavior: "smooth", block: "start" });
}

document.getElementById("brand-home").addEventListener("click", () => {
  document.getElementById("topic-view").hidden = true;
  document.getElementById("welcome-panel").hidden = false;
  document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));
  expandSidebar();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ---------------- Sidebar auto-hide ---------------- */
const topicNavEl = document.getElementById("topic-nav");
const navToggleBtn = document.getElementById("nav-toggle");
let navPeekTimer = null;

function collapseSidebar() {
  document.body.classList.add("nav-collapsed");
  document.body.classList.remove("nav-pinned", "nav-peek");
}
function expandSidebar() {
  document.body.classList.remove("nav-collapsed", "nav-peek", "nav-pinned");
}
navToggleBtn.addEventListener("click", () => {
  const pinned = document.body.classList.toggle("nav-pinned");
  if (pinned) document.body.classList.remove("nav-peek");
});

// Menu topik sepenuhnya tersembunyi begitu sebuah topik aktif (hanya tombol
// bulat #nav-toggle yang terlihat). Meng-hover tombol ATAU panel nav itu
// sendiri memunculkannya sementara sebagai overlay ("nav-peek"); menjauhkan
// mouse dari keduanya (dengan jeda singkat supaya tidak berkedip saat
// berpindah dari tombol ke panel) menyembunyikannya lagi.
function peekSidebar() {
  clearTimeout(navPeekTimer);
  document.body.classList.add("nav-peek");
}
function scheduleHideSidebarPeek() {
  clearTimeout(navPeekTimer);
  navPeekTimer = setTimeout(() => document.body.classList.remove("nav-peek"), 180);
}
[navToggleBtn, topicNavEl].forEach(el => {
  el.addEventListener("mouseenter", peekSidebar);
  el.addEventListener("mouseleave", scheduleHideSidebarPeek);
  el.addEventListener("focusin", peekSidebar);
  el.addEventListener("focusout", scheduleHideSidebarPeek);
});

/* ---------------- Tabs ---------------- */
function switchTab(tabName) {
  if (currentTopic && isTabLocked(currentTopic.id, tabName)) {
    showToast(t("toast.tablocked"));
    return;
  }
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === tabName));
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.toggle("active", p.id === "panel-" + tabName));
  if (currentTopic) {
    updateTopicProgressUI(tabName);
    renderNav(); // status gembok topik lain di sidebar bisa berubah (mis. topik ini baru selesai)
    document.querySelectorAll(".nav-item").forEach(el => el.classList.toggle("active", currentTopic && el.dataset.id === currentTopic.id));
  }
}
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (currentTopic && isTabLocked(currentTopic.id, btn.dataset.tab)) {
      showToast(t("toast.tablocked"));
      return;
    }
    switchTab(btn.dataset.tab);
  });
});

/* ---------------- Progress bar bertahap ---------------- */
function updateTopicProgressUI(activeTab) {
  const bar = document.getElementById("topic-progress");
  const stepsEl = document.getElementById("progress-steps");
  const nextBtn = document.getElementById("progress-next-btn");
  const finishBtn = document.getElementById("progress-finish-btn");
  if (!currentTopic || currentTopic.status !== "ready") {
    bar.hidden = true;
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("locked"));
    return;
  }

  const unlocked = isUnlockAll() ? TAB_ORDER.length - 1 : getUnlockedTabIndex(currentTopic.id);
  const activeIdx = TAB_ORDER.indexOf(activeTab);
  document.querySelectorAll(".tab-btn").forEach(b => {
    b.classList.toggle("locked", isTabLocked(currentTopic.id, b.dataset.tab));
  });
  bar.hidden = false;
  stepsEl.innerHTML = TAB_ORDER.map((tab, i) => {
    let state;
    if (i === activeIdx) state = "current";
    else if (i < activeIdx) state = "done";
    else state = (i <= unlocked) ? "unlocked" : "locked";
    return `<span class="progress-step ${state}"><span class="progress-step-dot"></span>${TAB_LABELS[tab]}</span>`;
  }).join(`<span class="progress-step-line"></span>`);

  const isLastTab = activeIdx === TAB_ORDER.length - 1;
  const nextTopicId = nextReadyTopicId(currentTopic.id);
  if (isLastTab) {
    nextBtn.hidden = true;
    finishBtn.hidden = !nextTopicId || isUnlockAll();
  } else if (activeIdx === unlocked) {
    finishBtn.hidden = true;
    nextBtn.hidden = false;
    document.getElementById("progress-next-label").textContent = TAB_LABELS[TAB_ORDER[activeIdx + 1]];
  } else {
    nextBtn.hidden = true;
    finishBtn.hidden = true;
  }
}
document.getElementById("progress-next-btn").addEventListener("click", () => {
  const activeIdx = TAB_ORDER.indexOf(document.querySelector(".tab-btn.active").dataset.tab);
  if (currentTopic) advanceProgress(currentTopic.id, activeIdx + 1);
  switchTab(TAB_ORDER[activeIdx + 1]);
});
document.getElementById("progress-finish-btn").addEventListener("click", () => {
  const nextId = currentTopic ? nextReadyTopicId(currentTopic.id) : null;
  if (nextId) selectTopic(nextId);
});

/* ---------------- Panel: Materi ---------------- */
function renderMateri() {
  const panel = document.getElementById("panel-materi");
  if (currentTopic.status === "ready" && currentTopic.materiHTML) {
    panel.innerHTML = trContent(currentTopic.materiHTML);
  } else {
    panel.innerHTML = comingSoonHTML("materi");
  }
  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise([panel]);
  }
}

/* ---------------- Panel: Eksperimen ---------------- */
function renderEksperimen() {
  const panel = document.getElementById("panel-eksperimen");
  if (currentTopic.status === "ready" && currentTopic.eksperimen) {
    const ex = currentTopic.eksperimen;
    panel.innerHTML = `<h3>${trContent(ex.title)}</h3>${trContent(ex.intro)}` +
      (ex.simHTML ? `<div class="sim-embed"><iframe sandbox="allow-scripts" srcdoc="${escapeAttr(ex.simHTML)}"></iframe></div>` : "");
  } else {
    panel.innerHTML = comingSoonHTML("eksperimen");
  }
  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise([panel]);
  }
}

/* ---------------- Panel: Latihan Soal ---------------- */
function renderLatihan() {
  const panel = document.getElementById("panel-latihan");
  if (currentTopic.status === "ready" && currentTopic.latihan && currentTopic.latihan.length) {
    panel.innerHTML = currentTopic.latihan.map((q, i) => {
      let optionsHTML = "";
      if (q.type === "mcq") {
        optionsHTML = `<ul class="options">${q.options.map((opt, oi) =>
          `<li>${String.fromCharCode(65 + oi)}. ${trContent(opt)}${oi === q.correct ? ` <span class="muted">${t("answer.correct")}</span>` : ''}</li>`
        ).join("")}</ul>`;
      }
      return `
        <div class="question-card">
          <div class="q-title">${t("question.label", { n: i + 1 })}</div>
          <div>${trContent(q.question)}</div>
          ${optionsHTML}
          <button class="reveal-btn" onclick="this.nextElementSibling.classList.toggle('show')">${t("question.reveal")}</button>
          <div class="solution"><strong>${t("question.solution")}</strong><br>${trContent(q.solution)}</div>
        </div>`;
    }).join("");
  } else {
    panel.innerHTML = comingSoonHTML("latihan");
  }
  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise([panel]);
  }
}

function comingSoonHTML(section) {
  return `<p class="muted">${t("content.comingsoon", { section: t("content.section." + section) })}</p>`;
}

function escapeAttr(str) {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

/* ---------------- Panel: Lab Simulasi Virtual ---------------- */
function setupLabForTopic() {
  const select = document.getElementById("pf-concept");
  const concepts = (currentTopic.labConcepts && currentTopic.labConcepts.length)
    ? currentTopic.labConcepts : DEFAULT_LAB_CONCEPTS;
  select.innerHTML = concepts.map(c => {
    const label = trContent(c);
    return `<option value="${escapeAttr(label)}">${label}</option>`;
  }).join("");

  // Reset SELURUH form generator prompt setiap ganti topik - termasuk
  // variabel/tujuan/instruksi tambahan yang diketik manual - supaya teks
  // dari topik/konsep sebelumnya tidak pernah tercampur/ketinggalan dan
  // secara diam-diam mengubah hasil generate topik yang baru dipilih.
  document.getElementById("pf-variables").value = "";
  document.getElementById("pf-goal").value = "";
  document.getElementById("pf-extra").value = "";
  document.getElementById("pf-vistype").selectedIndex = 0;
  document.getElementById("pf-level").selectedIndex = 1;
  document.getElementById("final-prompt").value = "";
  document.getElementById("preview-frame").removeAttribute("srcdoc");
  document.getElementById("preview-frame").hidden = false;
  document.getElementById("code-editor").value = "";
  document.getElementById("code-editor").hidden = true;
  document.getElementById("toggle-code-label").textContent = t("lab.togglecode.view");
  document.getElementById("generate-status").textContent = "";
  document.getElementById("mode-banner").hidden = true;
  ["rerun-btn", "toggle-code-btn", "download-btn"].forEach(id => document.getElementById(id).disabled = true);
  document.getElementById("lab-edit-followup").hidden = true;
  document.getElementById("edit-followup-input").value = "";
  document.getElementById("edit-followup-status").textContent = "";
  resetEditCount();
  refreshKeyStatusUI();
}

function resetEditCount() {
  editCount = 0;
  updateEditCounterUI();
}
function updateEditCounterUI() {
  const counter = document.getElementById("edit-followup-counter");
  const btn = document.getElementById("edit-followup-btn");
  const input = document.getElementById("edit-followup-input");
  const remaining = MAX_FOLLOWUP_EDITS - editCount;
  if (remaining > 0) {
    counter.textContent = t("lab.editfollowup.remaining", { n: remaining, max: MAX_FOLLOWUP_EDITS });
  } else {
    counter.textContent = t("lab.editfollowup.limitreached", { max: MAX_FOLLOWUP_EDITS });
  }
  btn.disabled = remaining <= 0;
  input.disabled = remaining <= 0;
}

// Ganti konsep fisika spesifik juga membersihkan variabel/tujuan/instruksi
// tambahan - field-field itu biasanya ditulis khusus untuk satu konsep, jadi
// membiarkannya menempel ke konsep lain gampang bikin prompt akhir jadi
// campur aduk (mis. tujuan pembelajaran tentang gerak melingkar tertinggal
// padahal konsep yang dipilih sekarang GLBB atau jatuh bebas).
document.getElementById("pf-concept").addEventListener("change", () => {
  document.getElementById("pf-variables").value = "";
  document.getElementById("pf-goal").value = "";
  document.getElementById("pf-extra").value = "";
});

document.getElementById("pf-build-btn").addEventListener("click", () => {
  const concept = document.getElementById("pf-concept").value;
  const vistype = document.getElementById("pf-vistype").value;
  const variables = document.getElementById("pf-variables").value.trim();
  const goal = document.getElementById("pf-goal").value.trim();
  const level = document.getElementById("pf-level").value;
  const extra = document.getElementById("pf-extra").value.trim();

  const topicTitle = trContent(currentTopic.title);
  let prompt = t("promptgen.header", { topic: topicTitle, concept: concept });
  prompt += t("promptgen.langdirective");
  prompt += t("promptgen.mainfocus", { concept: concept });
  prompt += t("promptgen.vistype", { vistype: vistype });
  if (variables) {
    prompt += t("promptgen.variables", { variables: variables });
  }
  if (goal) {
    prompt += t("promptgen.goal", { concept: concept, goal: goal });
  }
  prompt += t("promptgen.level", { level: level });
  prompt += t("promptgen.footer");
  if (extra) {
    prompt += t("promptgen.extra", { extra: extra });
  }

  // "Grounding": tempelkan rumus/konsep topik yang sudah divalidasi guru
  // supaya AI memakai nilai & rumus yang tepat, bukan menebak dari memori umum.
  if (currentTopic.formulaSheet) {
    prompt += t("promptgen.formularef", { sheet: trContent(currentTopic.formulaSheet) });
  }

  document.getElementById("final-prompt").value = prompt;
});

document.getElementById("generate-btn").addEventListener("click", async () => {
  const promptText = document.getElementById("final-prompt").value.trim();
  const status = document.getElementById("generate-status");
  const banner = document.getElementById("mode-banner");
  const backendUrl = getBackendUrl();
  const apiKey = getGeminiApiKey();

  if (!promptText) {
    status.textContent = t("lab.generate.needprompt");
    return;
  }

  if (!apiKey) {
    status.textContent = "";
    banner.hidden = false;
    banner.innerHTML = t("lab.generate.needkey");
    document.getElementById("mode-banner-key-btn").addEventListener("click", openSettingsModal);
    return;
  }

  if (!backendUrl) {
    status.textContent = "";
    banner.hidden = false;
    banner.textContent = t("lab.generate.needbackend");
    return;
  }

  status.textContent = t("lab.generate.loading");
  banner.hidden = true;
  document.getElementById("generate-btn").disabled = true;

  try {
    const resp = await fetch(backendUrl, {
      method: "POST",
      // Content-Type text/plain sengaja dipakai agar tidak memicu CORS preflight
      // ke Google Apps Script (lihat catatan di apps-script/Code.gs & README.md)
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ prompt: promptText, apiKey: apiKey })
    });
    const data = await resp.json();
    if (data.error) throw new Error(data.error);
    let html = (data.html || "").trim();
    html = stripCodeFence(html);

    // Pengecekan dasar supaya HTML yang jelas-jelas rusak/terpotong tidak
    // langsung ditampilkan seolah berhasil (dulu ini bikin bingung: preview
    // kosong, animasi/kalkulasi tidak jalan, dan kode yang muncul saat
    // "Lihat Kode" cuma potongan tidak lengkap tanpa penjelasan kenapa).
    const problem = checkGeneratedHtml(html);
    setPreview(html);
    resetEditCount();
    if (problem) {
      status.textContent = problem + t("lab.generate.retryhint");
    } else {
      status.textContent = data.warning ? data.warning : t("lab.generate.success");
    }
  } catch (err) {
    status.textContent = t("lab.generate.failed") + err.message + t("lab.generate.failedsuffix");
  } finally {
    document.getElementById("generate-btn").disabled = false;
  }
});

document.getElementById("demo-btn").addEventListener("click", () => {
  const promptText = document.getElementById("final-prompt").value.trim();
  const status = document.getElementById("generate-status");
  const banner = document.getElementById("mode-banner");
  status.textContent = "";
  banner.hidden = false;
  banner.textContent = t("lab.demo.active");
  const html = getDemoSimHTML(promptText);
  setPreview(html);
  resetEditCount();
});

// PENTING: pesan status untuk aksi ini SENGAJA ditampilkan di elemen lokal
// #edit-followup-status (tepat di bawah tombol ini), BUKAN di #generate-status
// / #mode-banner yang letaknya jauh di atas (dekat tombol Generate Simulasi).
// Panel "Prompt Lanjutan" ini muncul di BAWAH preview simulasi yang bisa
// cukup tinggi, jadi kalau pesan hasil klik ditulis ke elemen yang jauh di
// atas, siswa yang sedang melihat tombol ini di layar tidak akan pernah
// melihat pesannya tanpa scroll manual ke atas - dari sudut pandang siswa
// ini terlihat PERSIS seperti "tombol tidak melakukan apa-apa" walau
// sebenarnya requestnya berjalan (berhasil ATAU gagal) di baliknya. Dulu
// pernah dilaporkan bug "klik Edit Simulasi Ini, tidak terjadi apa-apa,
// sisa edit tetap 5/5" - root cause-nya persis ini (dikombinasikan dengan
// kemungkinan request yang gagal di background karena Gemini overload,
// yang pesan error-nya juga tidak pernah terlihat karena masalah yang sama).
document.getElementById("edit-followup-btn").addEventListener("click", async () => {
  const instruction = document.getElementById("edit-followup-input").value.trim();
  const status = document.getElementById("edit-followup-status");
  const backendUrl = getBackendUrl();
  const apiKey = getGeminiApiKey();

  if (editCount >= MAX_FOLLOWUP_EDITS) {
    status.textContent = t("lab.editfollowup.limitreached", { max: MAX_FOLLOWUP_EDITS });
    return;
  }
  if (!lastGeneratedHTML) {
    status.textContent = t("lab.editfollowup.needsim");
    return;
  }
  if (!instruction) {
    status.textContent = t("lab.editfollowup.needinstruction");
    return;
  }
  if (!apiKey) {
    status.innerHTML = t("lab.editfollowup.needkey");
    document.getElementById("edit-followup-key-btn").addEventListener("click", openSettingsModal);
    return;
  }
  if (!backendUrl) {
    status.textContent = t("lab.editfollowup.needbackend");
    return;
  }

  const editPrompt = t("promptgen.editheader", {
    html: lastGeneratedHTML,
    langdirective: t("promptgen.editlangdirective"),
    instruction: instruction
  });

  status.textContent = t("lab.editfollowup.loading", { n: editCount + 1, max: MAX_FOLLOWUP_EDITS });
  document.getElementById("edit-followup-btn").disabled = true;

  try {
    const resp = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ mode: "edit", prompt: editPrompt, apiKey: apiKey })
    });
    const data = await resp.json();
    if (data.error) throw new Error(data.error);
    let html = (data.html || "").trim();
    html = stripCodeFence(html);
    const problem = checkGeneratedHtml(html);
    setPreview(html);
    editCount += 1;
    updateEditCounterUI();
    document.getElementById("edit-followup-input").value = "";
    status.textContent = problem
      ? problem + t("lab.editfollowup.retryhint")
      : t("lab.editfollowup.success");
  } catch (err) {
    status.textContent = t("lab.editfollowup.failed") + err.message + t("lab.editfollowup.failedsuffix");
  } finally {
    updateEditCounterUI();
  }
});

function stripCodeFence(html) {
  return html.replace(/^```(?:html)?\s*/i, "").replace(/```\s*$/i, "");
}

// Pengecekan ringan (bukan parser lengkap) untuk menangkap kasus paling umum
// HTML hasil AI yang rusak/terpotong, supaya siswa dapat pesan yang jelas
// alih-alih preview kosong atau kode setengah jadi tanpa keterangan.
// Mengembalikan string pesan masalah, atau null kalau terlihat aman.
function checkGeneratedHtml(html) {
  if (!html || html.length < 200) {
    return t("check.htmltooshort");
  }
  if (!/<\/html>\s*$/i.test(html)) {
    return t("check.htmltruncated");
  }
  if (!/<script[\s>]/i.test(html)) {
    return t("check.noscript");
  }
  // Cek kasar keseimbangan kurung kurawal di dalam <script>: kalau sangat
  // tidak seimbang, hampir pasti ada JavaScript yang terpotong/rusak.
  const scriptContents = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]).join("\n");
  const openBraces = (scriptContents.match(/\{/g) || []).length;
  const closeBraces = (scriptContents.match(/\}/g) || []).length;
  if (Math.abs(openBraces - closeBraces) > 1) {
    return t("check.unbalancedbraces");
  }
  return null;
}

function setPreview(html) {
  lastGeneratedHTML = html;
  document.getElementById("preview-frame").srcdoc = html;
  document.getElementById("code-editor").value = html;
  // Setiap kali ada hasil generate/rerun baru, selalu mulai dari tampilan
  // preview (bukan kode) supaya konsisten, dan reset label tombolnya.
  document.getElementById("preview-frame").hidden = false;
  document.getElementById("code-editor").hidden = true;
  document.getElementById("toggle-code-label").textContent = t("lab.togglecode.view");
  ["rerun-btn", "toggle-code-btn", "download-btn"].forEach(id => document.getElementById(id).disabled = false);
  document.getElementById("lab-edit-followup").hidden = false;
  // Bersihkan pesan status edit-lanjutan lama (kalau ada dari simulasi
  // sebelumnya) supaya tidak nyangkut/membingungkan di simulasi baru ini.
  document.getElementById("edit-followup-status").textContent = "";
}

document.getElementById("rerun-btn").addEventListener("click", () => {
  const edited = document.getElementById("code-editor").value;
  document.getElementById("preview-frame").srcdoc = edited;
  lastGeneratedHTML = edited;
});

document.getElementById("toggle-code-btn").addEventListener("click", () => {
  // Tombol ini harus SALING MENUKAR tampilan preview <-> kode (bukan cuma
  // menampilkan textarea kode di bawah iframe yang tetap terlihat), supaya
  // benar-benar terasa seperti "Lihat Kode" mengganti area sandbox.
  const editor = document.getElementById("code-editor");
  const frame = document.getElementById("preview-frame");
  const label = document.getElementById("toggle-code-label");
  const showingCodeNext = editor.hidden; // true jika saat ini kode masih disembunyikan
  editor.hidden = !showingCodeNext;
  frame.hidden = showingCodeNext;
  label.textContent = showingCodeNext ? t("lab.togglecode.preview") : t("lab.togglecode.view");
});

document.getElementById("download-btn").addEventListener("click", () => {
  const blob = new Blob([lastGeneratedHTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `simulasi-${(currentTopic ? currentTopic.id : "fisika")}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

/* ---------------- Pengaturan (modal) ---------------- */
const settingsModal = document.getElementById("settings-modal");
function refreshUnlockStatusUI() {
  const text = document.getElementById("unlock-status-text");
  if (!text) return;
  text.textContent = isUnlockAll()
    ? t("settings.unlock.on")
    : t("settings.unlock.off");
  text.classList.toggle("ok", isUnlockAll());
}
document.getElementById("unlock-code-btn").addEventListener("click", () => {
  const input = document.getElementById("unlock-code-input");
  const val = input.value.trim();
  if (!val) return;
  if (TEACHER_UNLOCK_CODE && val.toLowerCase() === TEACHER_UNLOCK_CODE.toLowerCase()) {
    localStorage.setItem(STORAGE_KEY_UNLOCK_ALL, "true");
    input.value = "";
    refreshUnlockStatusUI();
    renderNav();
    if (currentTopic) updateTopicProgressUI(document.querySelector(".tab-btn.active").dataset.tab);
    showToast(t("settings.unlock.success"));
  } else {
    showToast(t("settings.unlock.wrong"));
  }
});
function openSettingsModal() {
  document.getElementById("settings-key-input").value = getGeminiApiKey();
  refreshUnlockStatusUI();
  refreshClassSessionUI();
  const studentDetails = document.getElementById("settings-student-info-details");
  if (studentDetails) {
    const isStudent = getUserRole() === "student";
    studentDetails.hidden = !isStudent;
    if (isStudent) {
      document.getElementById("settings-student-name-input").value = getStudentName();
      document.getElementById("settings-student-class-input").value = getStudentClass();
    }
  }
  settingsModal.hidden = false;
}
document.getElementById("settings-btn").addEventListener("click", openSettingsModal);
document.getElementById("key-status-pill").addEventListener("click", openSettingsModal);
document.getElementById("lab-key-banner-btn").addEventListener("click", openSettingsModal);
document.getElementById("settings-close-btn").addEventListener("click", () => settingsModal.hidden = true);
document.getElementById("settings-close-x").addEventListener("click", () => settingsModal.hidden = true);
document.getElementById("settings-save-btn").addEventListener("click", () => {
  saveGeminiApiKey(document.getElementById("settings-key-input").value);
  settingsModal.hidden = true;
  // Kalau API key sengaja dikosongkan lagi lewat Pengaturan, gate wajib
  // tampil lagi (situs terkunci sampai diisi ulang) - konsisten dengan
  // aturan "wajib setup API key dulu" di awal.
  applyGate();
});
document.getElementById("settings-student-info-save-btn").addEventListener("click", () => {
  const name = document.getElementById("settings-student-name-input").value.trim();
  const cls = document.getElementById("settings-student-class-input").value.trim();
  if (!name || !cls) { showToast(t("gate.student.needinfo")); return; }
  localStorage.setItem(STORAGE_KEY_STUDENT_NAME, name);
  localStorage.setItem(STORAGE_KEY_STUDENT_CLASS, cls);
  showToast(t("settings.studentinfo.saved"));
});
document.getElementById("settings-reset-onboarding-btn").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY_ROLE);
  localStorage.removeItem(STORAGE_KEY_STUDENT_NAME);
  localStorage.removeItem(STORAGE_KEY_STUDENT_CLASS);
  localStorage.removeItem(STORAGE_KEY_UNLOCK_ALL);
  leaveClassSession(null);
  settingsModal.hidden = true;
  applyGate();
});

/* ============================================================
   Onboarding gate (wajib, layar penuh, sebelum situs bisa diakses)
   ------------------------------------------------------------
   Urutan: API key -> pilih peran -> (siswa) nama+kelas -> kode dari
   guru, ATAU (bukan siswa) Kode Eksplorasi Bebas. #site-shell baru
   ditampilkan setelah computeGateStep() mengembalikan null.
   ============================================================ */
const GATE_STEPS = ["apikey", "role", "student-info", "student-code", "guest-code"];

function computeGateStep() {
  if (!getGeminiApiKey()) return "apikey";
  const role = getUserRole();
  if (role === "student") {
    if (!getStudentName() || !getStudentClass()) return "student-info";
    if (!isInClassSession()) return "student-code";
    return null;
  }
  if (role === "guest") {
    if (!isUnlockAll()) return "guest-code";
    return null;
  }
  return "role";
}
function showGateStep(step) {
  GATE_STEPS.forEach(s => {
    const el = document.getElementById("gate-step-" + s);
    if (el) el.hidden = (s !== step);
  });
  if (step === "student-info") {
    document.getElementById("gate-student-name-input").value = getStudentName();
    document.getElementById("gate-student-class-input").value = getStudentClass();
  }
}
function applyGate() {
  const step = computeGateStep();
  const gate = document.getElementById("onboarding-gate");
  const shell = document.getElementById("site-shell");
  if (step) {
    gate.hidden = false;
    shell.hidden = true;
    showGateStep(step);
  } else {
    gate.hidden = true;
    shell.hidden = false;
    // Begitu gate baru saja terlewati (atau memang sudah lengkap sejak
    // awal) dan siswa ternyata sedang dalam sesi kelas aktif, langsung
    // antarkan ke aktivitas yang ditentukan guru alih-alih diam di Beranda.
    if (isInClassSession()) goToClassSessionActivity();
  }
}
async function initGate() {
  // Kalau perangkat ini sebelumnya sudah pernah gabung sebuah kode sesi,
  // coba sambungkan ulang dulu secara diam-diam sebelum memutuskan langkah
  // gate mana yang ditampilkan - supaya me-reload halaman di tengah sesi
  // yang masih berjalan tidak tiba-tiba meminta kode dari awal lagi.
  if (getJoinedSessionCode() && !classSession) {
    await attemptJoinClassSession(getJoinedSessionCode());
  }
  applyGate();
}

document.getElementById("gate-key-toggle-visibility").addEventListener("click", () => {
  const input = document.getElementById("gate-key-input");
  input.type = input.type === "password" ? "text" : "password";
});
document.getElementById("gate-key-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("gate-key-save-btn").click();
});
document.getElementById("gate-key-save-btn").addEventListener("click", () => {
  const val = document.getElementById("gate-key-input").value.trim();
  const status = document.getElementById("gate-key-status");
  if (!val) { status.textContent = t("gate.key.needkey"); status.classList.remove("ok"); return; }
  saveGeminiApiKey(val);
  status.textContent = "";
  applyGate();
});

document.getElementById("gate-role-student-btn").addEventListener("click", () => {
  localStorage.setItem(STORAGE_KEY_ROLE, "student");
  applyGate();
});
document.getElementById("gate-role-guest-btn").addEventListener("click", () => {
  localStorage.setItem(STORAGE_KEY_ROLE, "guest");
  applyGate();
});

document.getElementById("gate-student-info-btn").addEventListener("click", () => {
  const name = document.getElementById("gate-student-name-input").value.trim();
  const cls = document.getElementById("gate-student-class-input").value.trim();
  const status = document.getElementById("gate-student-info-status");
  if (!name || !cls) { status.textContent = t("gate.student.needinfo"); return; }
  localStorage.setItem(STORAGE_KEY_STUDENT_NAME, name);
  localStorage.setItem(STORAGE_KEY_STUDENT_CLASS, cls);
  status.textContent = "";
  applyGate();
});
document.getElementById("gate-student-info-back-btn").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY_ROLE);
  applyGate();
});

document.getElementById("gate-student-code-btn").addEventListener("click", async () => {
  const input = document.getElementById("gate-student-code-input");
  const status = document.getElementById("gate-student-code-status");
  const btn = document.getElementById("gate-student-code-btn");
  const code = input.value.trim();
  if (!code) { status.textContent = t("gate.student.code.needcode"); status.classList.remove("ok"); return; }
  status.textContent = t("gate.student.code.connecting");
  status.classList.remove("ok");
  btn.disabled = true;
  const result = await attemptJoinClassSession(code);
  btn.disabled = false;
  if (result.ok) {
    input.value = "";
    status.textContent = "";
    applyGate();
  } else {
    status.textContent = result.error;
    status.classList.remove("ok");
  }
});
document.getElementById("gate-student-code-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("gate-student-code-btn").click();
});
document.getElementById("gate-student-code-back-btn").addEventListener("click", () => {
  showGateStep("student-info");
});

document.getElementById("gate-guest-code-btn").addEventListener("click", () => {
  const input = document.getElementById("gate-guest-code-input");
  const status = document.getElementById("gate-guest-code-status");
  const code = input.value.trim();
  if (!code) { status.textContent = t("gate.guest.code.needcode"); status.classList.remove("ok"); return; }
  if (TEACHER_UNLOCK_CODE && code.toLowerCase() === TEACHER_UNLOCK_CODE.toLowerCase()) {
    localStorage.setItem(STORAGE_KEY_UNLOCK_ALL, "true");
    input.value = "";
    status.textContent = "";
    applyGate();
  } else {
    status.textContent = t("gate.guest.code.wrong");
    status.classList.remove("ok");
  }
});
document.getElementById("gate-guest-code-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("gate-guest-code-btn").click();
});
document.getElementById("gate-guest-code-back-btn").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY_ROLE);
  applyGate();
});

/* ---------------- Chatbot toggle ---------------- */
const chatbotPanel = document.getElementById("chatbot-panel");
document.getElementById("chatbot-toggle-btn").addEventListener("click", () => {
  chatbotPanel.hidden = !chatbotPanel.hidden;
  if (!chatbotPanel.hidden && window.Chatbot) Chatbot.onOpen();
});
document.getElementById("chatbot-close-btn").addEventListener("click", () => { chatbotPanel.hidden = true; });

/* ---------------- Init ---------------- */
applyStaticI18n();
initLangSwitch();
renderNav();
refreshKeyStatusUI();
refreshUnlockStatusUI();
syncHeaderHeight();
if (window.Chatbot) Chatbot.init();
// Kalau reload ini dipicu oleh ganti bahasa (lihat setLang() di i18n.js),
// kembalikan siswa ke topik/tab yang sedang dibuka sebelumnya alih-alih
// diam di Beranda - ditunggu (.then) sampai SETELAH initGate() selesai
// memutuskan step gate mana yang tampil (initGate itu sendiri async karena
// bisa menyambung ulang sesi kelas lebih dulu ke backend).
initGate().then(restoreLangSwitchState);
