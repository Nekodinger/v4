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
const TAB_LABELS = { materi: "Materi Belajar", eksperimen: "Eksperimen", latihan: "Latihan Soal", lab: "Lab Simulasi Virtual" };

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
  return TOPICS.filter(t => t.status === "ready").sort((a, b) => a.number - b.number).map(t => t.id);
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
  const topic = TOPICS.find(t => t.id === topicId);
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
  if (!trimmed) return { ok: false, error: "Masukkan kode dari guru dulu." };
  const backendUrl = getBackendUrl();
  if (!backendUrl) return { ok: false, error: "Backend belum dikonfigurasi. Hubungi pengelola situs." };
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
      return { ok: false, error: "Kode salah, atau sesi belum/sudah tidak aktif. Tanyakan gurumu." };
    }
    localStorage.setItem(STORAGE_KEY_CLASS_CODE, trimmed);
    classSession = data;
    lastClassActivityKey = data.topicId + "|" + data.tabIndex;
    startClassSync();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: "Gagal terhubung ke server: " + err.message };
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
      leaveClassSession("Sesi kelas sudah berakhir - kamu kembali ke mode belajar mandiri.");
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
  const topic = TOPICS.find(t => t.id === classSession.topicId);
  const tabLabel = TAB_LABELS[TAB_ORDER[classSession.tabIndex]] || "";
  const onTarget = currentTopic && currentTopic.id === classSession.topicId &&
    document.querySelector(".tab-btn.active")?.dataset.tab === TAB_ORDER[classSession.tabIndex];
  if (onTarget) { banner.hidden = true; return; }
  textEl.textContent = `Sesi kelas aktif - guru meminta semua mengerjakan: ${topic ? topic.title : ""} - ${tabLabel} sekarang.`;
  banner.hidden = false;
}
document.getElementById("class-session-go-btn").addEventListener("click", goToClassSessionActivity);

function refreshClassSessionUI() {
  const statusText = document.getElementById("class-session-status-text");
  const joinRow = document.getElementById("class-session-join-row");
  const leaveBtn = document.getElementById("class-session-leave-btn");
  if (!statusText) return;
  if (isInClassSession()) {
    statusText.textContent = "Tergabung dalam sesi kelas - navigasi mengikuti aktivitas yang ditentukan guru.";
    statusText.classList.add("ok");
    joinRow.hidden = true;
    leaveBtn.hidden = false;
  } else {
    statusText.textContent = "Belum gabung sesi kelas manapun.";
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
  statusText.textContent = "Menghubungkan...";
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
  if (text) text.textContent = hasKey ? "API key tersambung" : "API key belum diatur";
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
    groupTitle.textContent = level === "AS" ? "AS Level (Topik 1 - 11)" : "A Level Tambahan (Topik 12 - 25)";
    nav.appendChild(groupTitle);

    TOPICS.filter(t => t.level === level).forEach(topic => {
      const btn = document.createElement("button");
      const blocked = isInClassSession() && topic.id !== classSession.topicId;
      const isSessionFocus = isInClassSession() && topic.id === classSession.topicId;
      btn.className = "nav-item" + (blocked ? " session-locked" : "") + (isSessionFocus ? " session-active" : "");
      btn.dataset.id = topic.id;
      btn.innerHTML =
        `<span class="dot ${topic.status === 'ready' ? 'dot-ready' : 'dot-soon'}"></span>` +
        `<span class="num">${topic.number}.</span>` +
        `<span class="label">${topic.title}</span>` +
        (isSessionFocus ? `<span class="session-dot" title="Aktivitas kelas sekarang"></span>` : "");
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
    showToast("Ada sesi kelas aktif - ikuti aktivitas yang sedang ditentukan guru dulu.");
    return;
  }
  currentTopic = TOPICS.find(t => t.id === id);
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
    `<span class="badge ${currentTopic.status === 'ready' ? 'badge-ready' : 'badge-soon'}">${currentTopic.status === 'ready' ? 'Siap' : 'Segera'}</span>`;
  document.getElementById("topic-title").textContent = `${currentTopic.number}. ${currentTopic.title}`;
  document.getElementById("topic-desc").textContent = currentTopic.desc;

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
    showToast("Selesaikan tab sebelumnya dulu supaya sesuai urutan belajar, atau masukkan Kode Eksplorasi Bebas dari guru.");
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
      showToast("Selesaikan tab sebelumnya dulu supaya sesuai urutan belajar, atau masukkan Kode Eksplorasi Bebas dari guru.");
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
    panel.innerHTML = currentTopic.materiHTML;
  } else {
    panel.innerHTML = comingSoonHTML("materi belajar");
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
    panel.innerHTML = `<h3>${ex.title}</h3>${ex.intro}` +
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
          `<li>${String.fromCharCode(65 + oi)}. ${opt}${oi === q.correct ? ' <span class="muted">(jawaban benar)</span>' : ''}</li>`
        ).join("")}</ul>`;
      }
      return `
        <div class="question-card">
          <div class="q-title">Soal ${i + 1}</div>
          <div>${q.question}</div>
          ${optionsHTML}
          <button class="reveal-btn" onclick="this.nextElementSibling.classList.toggle('show')">Lihat Pembahasan</button>
          <div class="solution"><strong>Pembahasan:</strong><br>${q.solution}</div>
        </div>`;
    }).join("");
  } else {
    panel.innerHTML = comingSoonHTML("latihan soal");
  }
  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise([panel]);
  }
}

function comingSoonHTML(section) {
  return `<p class="muted">Konten ${section} untuk topik ini belum diisi. Strukturnya sudah siap di <code>js/content.js</code>,
    tinggal ditambahkan mengikuti contoh topik <strong>Kinematics</strong>. Sementara itu, tab
    <strong>Lab Simulasi Virtual</strong> tetap bisa dicoba untuk topik ini.</p>`;
}

function escapeAttr(str) {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

/* ---------------- Panel: Lab Simulasi Virtual ---------------- */
function setupLabForTopic() {
  const select = document.getElementById("pf-concept");
  const concepts = (currentTopic.labConcepts && currentTopic.labConcepts.length)
    ? currentTopic.labConcepts : DEFAULT_LAB_CONCEPTS;
  select.innerHTML = concepts.map(c => `<option value="${c}">${c}</option>`).join("");

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
  document.getElementById("toggle-code-label").textContent = "Lihat Kode";
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
    counter.textContent = `Sisa edit lanjutan: ${remaining}/${MAX_FOLLOWUP_EDITS}`;
  } else {
    counter.textContent = `Batas ${MAX_FOLLOWUP_EDITS}x edit lanjutan untuk simulasi ini sudah tercapai - tekan Generate untuk membuat versi baru.`;
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

  let prompt = `Buatlah SATU file HTML lengkap dan mandiri (HTML, CSS, dan JavaScript semuanya inline dalam satu file, TANPA dependensi/CDN eksternal) yang berisi simulasi fisika interaktif tentang topik "${currentTopic.title}", khususnya konsep: ${concept}.\n\n`;
  prompt += `PENTING: konsep fisika di atas ("${concept}") adalah topik UTAMA dan SATU-SATUNYA untuk simulasi ini. Semua kontrol, animasi, grafik, dan penjelasan di dalam simulasi harus tentang konsep ini saja.\n\n`;
  prompt += `Jenis visualisasi yang diinginkan: ${vistype}.\n\n`;
  if (variables) {
    prompt += `Sediakan kontrol interaktif (slider/input angka) agar siswa bisa mengubah variabel berikut: ${variables}. Tampilkan juga nilai numerik dan/atau grafik yang relevan secara real-time saat variabel diubah.\n\n`;
  }
  if (goal) {
    prompt += `Tujuan pembelajaran simulasi ini (catatan tambahan dari guru/siswa, TETAP harus konsisten dengan konsep utama "${concept}" di atas, jika ada bagian yang tampak membahas konsep fisika lain, abaikan bagian itu): ${goal}.\n\n`;
  }
  prompt += `Tingkat kompleksitas tampilan: ${level}.\n\n`;
  prompt += `Gunakan satuan SI dan rumus fisika yang akurat sesuai kurikulum Cambridge International AS & A Level Physics (9702). Tuliskan kode yang rapi dan diberi komentar singkat agar mudah dipahami siswa yang juga sedang belajar coding.\n`;
  if (extra) {
    prompt += `\nInstruksi tambahan: ${extra}\n`;
  }

  // "Grounding": tempelkan rumus/konsep topik yang sudah divalidasi guru
  // supaya AI memakai nilai & rumus yang tepat, bukan menebak dari memori umum.
  if (currentTopic.formulaSheet) {
    prompt += `\nReferensi rumus & konsep topik ini yang WAJIB dipakai (jangan memakai rumus lain yang bertentangan dengan ini):\n${currentTopic.formulaSheet}\n`;
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
    status.textContent = "Susun atau tulis prompt terlebih dahulu.";
    return;
  }

  if (!apiKey) {
    status.textContent = "";
    banner.hidden = false;
    banner.innerHTML = `Kamu belum memasukkan API key Gemini pribadi. <button type="button" class="link-btn" id="mode-banner-key-btn">Atur API key sekarang</button>, atau tekan "Coba Mode Demo" untuk melihat contoh simulasi tanpa AI.`;
    document.getElementById("mode-banner-key-btn").addEventListener("click", openSettingsModal);
    return;
  }

  if (!backendUrl) {
    status.textContent = "";
    banner.hidden = false;
    banner.textContent = "Backend belum dikonfigurasi (lihat README.md bagian setup). Hubungi pengelola situs.";
    return;
  }

  status.textContent = "Menghubungi AI, mohon tunggu (bisa 10-30 detik)...";
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
      status.textContent = problem + " Coba klik Generate lagi (hasil AI bisa berbeda tiap percobaan), atau sederhanakan promptnya.";
    } else {
      status.textContent = data.warning ? data.warning : "Simulasi berhasil dibuat.";
    }
  } catch (err) {
    status.textContent = "Gagal generate: " + err.message + " - coba lagi, atau cek README bagian troubleshooting.";
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
  banner.textContent = "Mode Demo aktif: menampilkan simulasi contoh yang sudah disiapkan (bukan hasil AI sesungguhnya), sekadar untuk melihat alur Lab Simulasi Virtual.";
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
    status.textContent = `Batas ${MAX_FOLLOWUP_EDITS}x edit lanjutan untuk simulasi ini sudah tercapai - tekan Generate untuk membuat versi baru.`;
    return;
  }
  if (!lastGeneratedHTML) {
    status.textContent = "Belum ada simulasi untuk diedit - tekan Generate atau Coba Mode Demo dulu.";
    return;
  }
  if (!instruction) {
    status.textContent = "Tulis dulu instruksi editnya, misalnya bagian apa yang ingin diubah/ditambah.";
    return;
  }
  if (!apiKey) {
    status.innerHTML = `Edit lanjutan butuh AI sungguhan, jadi perlu API key Gemini pribadi. <button type="button" class="link-btn" id="edit-followup-key-btn">Atur API key sekarang</button>.`;
    document.getElementById("edit-followup-key-btn").addEventListener("click", openSettingsModal);
    return;
  }
  if (!backendUrl) {
    status.textContent = "Backend belum dikonfigurasi (lihat README.md bagian setup). Hubungi pengelola situs.";
    return;
  }

  const editPrompt = `Berikut kode HTML simulasi fisika yang SUDAH ADA (satu file lengkap, mandiri):\n\n${lastGeneratedHTML}\n\n---\nTolong EDIT/REVISI kode di atas sesuai instruksi berikut. Pertahankan bagian yang tidak diminta berubah dan tetap tentang konsep fisika yang sama. Kembalikan HANYA satu file HTML LENGKAP hasil revisi (bukan potongan - sertakan seluruh <!DOCTYPE html> sampai </html>), tanpa penjelasan tambahan di luar kode, tanpa code fence markdown.\n\nInstruksi edit dari siswa: ${instruction}`;

  status.textContent = `Menerapkan edit ke-${editCount + 1} dari ${MAX_FOLLOWUP_EDITS}, mohon tunggu (biasanya 10-30 detik, kadang lebih lama kalau server Gemini sedang sibuk)...`;
  document.getElementById("edit-followup-btn").disabled = true;

  try {
    const resp = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ prompt: editPrompt, apiKey: apiKey })
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
      ? problem + " Coba edit lagi dengan instruksi yang lebih sederhana."
      : "Edit berhasil diterapkan pada simulasi.";
  } catch (err) {
    status.textContent = "Gagal menerapkan edit: " + err.message + " - coba lagi.";
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
    return "Hasil AI kosong atau terlalu pendek untuk jadi simulasi utuh.";
  }
  if (!/<\/html>\s*$/i.test(html)) {
    return "Kode HTML sepertinya terpotong (tidak diakhiri tag </html>).";
  }
  if (!/<script[\s>]/i.test(html)) {
    return "Kode tidak mengandung <script> sama sekali, jadi animasi/perhitungan tidak akan berjalan.";
  }
  // Cek kasar keseimbangan kurung kurawal di dalam <script>: kalau sangat
  // tidak seimbang, hampir pasti ada JavaScript yang terpotong/rusak.
  const scriptContents = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]).join("\n");
  const openBraces = (scriptContents.match(/\{/g) || []).length;
  const closeBraces = (scriptContents.match(/\}/g) || []).length;
  if (Math.abs(openBraces - closeBraces) > 1) {
    return "Kode JavaScript sepertinya tidak lengkap/rusak (kurung kurawal { } tidak seimbang), kemungkinan animasi atau perhitungan tidak akan berjalan.";
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
  document.getElementById("toggle-code-label").textContent = "Lihat Kode";
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
  label.textContent = showingCodeNext ? "Lihat Preview" : "Lihat Kode";
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
    ? "Aktif - semua topik & tab sudah terbuka bebas di perangkat ini."
    : "Belum aktif - topik & tab masih terbuka bertahap.";
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
    showToast("Semua topik dan tab sudah terbuka!");
  } else {
    showToast("Kode salah. Tanyakan kode Eksplorasi Bebas ke gurumu.");
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
  if (!name || !cls) { showToast("Isi nama dan kelas dulu."); return; }
  localStorage.setItem(STORAGE_KEY_STUDENT_NAME, name);
  localStorage.setItem(STORAGE_KEY_STUDENT_CLASS, cls);
  showToast("Data diri tersimpan.");
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
  if (!val) { status.textContent = "Tempel API key Gemini dulu."; status.classList.remove("ok"); return; }
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
  if (!name || !cls) { status.textContent = "Isi nama dan kelas dulu."; return; }
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
  if (!code) { status.textContent = "Masukkan kode dari guru dulu."; status.classList.remove("ok"); return; }
  status.textContent = "Menghubungkan...";
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
  if (!code) { status.textContent = "Masukkan kode eksplorasi dulu."; status.classList.remove("ok"); return; }
  if (TEACHER_UNLOCK_CODE && code.toLowerCase() === TEACHER_UNLOCK_CODE.toLowerCase()) {
    localStorage.setItem(STORAGE_KEY_UNLOCK_ALL, "true");
    input.value = "";
    status.textContent = "";
    applyGate();
  } else {
    status.textContent = "Kode salah. Tanyakan Kode Eksplorasi Bebas ke guru/pengelola situs.";
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
renderNav();
refreshKeyStatusUI();
refreshUnlockStatusUI();
syncHeaderHeight();
if (window.Chatbot) Chatbot.init();
initGate();
