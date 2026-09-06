/* ============================================================
   app.js - logika utama Physics Sandbox
   ============================================================ */

const STORAGE_KEY_BACKEND = "physicsSandbox.backendUrl";
const STORAGE_KEY_GEMINI = "physicsSandbox.geminiApiKey";
const STORAGE_KEY_PROGRESS = "physicsSandbox.progress";
const STORAGE_KEY_UNLOCK_ALL = "physicsSandbox.unlockAll";
let currentTopic = null;
let lastGeneratedHTML = "";
let editCount = 0;
const MAX_FOLLOWUP_EDITS = 5;

/* ============================================================
   Navigasi bertahap (sesuai sintaks pembelajaran)
   ------------------------------------------------------------
   Topik dan tab di dalamnya (Materi -> Eksperimen -> Latihan
   Soal -> Lab Simulasi Virtual) dibuka BERURUTAN, HANYA untuk
   topik yang sudah berstatus "ready" (topik "soon" belum punya
   konten jadi tidak digembok - tidak ada gunanya). Guru bisa
   membagikan TEACHER_UNLOCK_CODE (di js/config.js) untuk siswa
   yang perlu menjelajah bebas.
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
// sebuah topik "ready", atau -1 kalau topiknya sendiri masih terkunci total
// (karena topik "ready" sebelumnya di urutan belum selesai dijelajahi).
function getUnlockedTabIndex(topicId) {
  if (isUnlockAll()) return TAB_ORDER.length - 1;
  const progress = getProgress();
  if (progress[topicId] !== undefined) return progress[topicId];
  const order = getReadyTopicsOrder();
  const idx = order.indexOf(topicId);
  if (idx <= 0) return 0; // topik "ready" pertama, atau bukan bagian urutan ready -> tidak digembok
  const prevProgress = progress[order[idx - 1]];
  return (prevProgress !== undefined && prevProgress >= TAB_ORDER.length - 1) ? 0 : -1;
}
function isTopicLocked(topicId) {
  const topic = TOPICS.find(t => t.id === topicId);
  if (!topic || topic.status !== "ready") return false;
  return getUnlockedTabIndex(topicId) < 0;
}
function isTabLocked(topicId, tabName) {
  const topic = TOPICS.find(t => t.id === topicId);
  if (!topic || topic.status !== "ready") return false;
  const unlocked = getUnlockedTabIndex(topicId);
  if (unlocked < 0) return true;
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
let onboardingForcedOpen = false;
function refreshKeyStatusUI() {
  const hasKey = !!getGeminiApiKey();
  const dot = document.getElementById("key-status-dot");
  const text = document.getElementById("key-status-text");
  const banner = document.getElementById("lab-key-banner");
  const onboardingStatus = document.getElementById("onboarding-status");
  const onboardingInput = document.getElementById("onboarding-key-input");
  const settingsInput = document.getElementById("settings-key-input");
  const onboardingSetup = document.getElementById("onboarding-setup");
  const onboardingDone = document.getElementById("onboarding-done");

  if (dot) dot.classList.toggle("key-status-on", hasKey);
  if (text) text.textContent = hasKey ? "API key tersambung" : "API key belum diatur";
  if (banner) banner.hidden = hasKey;
  if (onboardingStatus) {
    onboardingStatus.textContent = hasKey ? "API key tersimpan di browser ini." : "";
    onboardingStatus.classList.toggle("ok", hasKey);
  }
  if (onboardingInput && !onboardingInput.matches(":focus")) onboardingInput.value = hasKey ? getGeminiApiKey() : "";
  if (settingsInput) settingsInput.value = getGeminiApiKey();
  // Kartu setup di halaman Beranda: begitu key sudah aktif, sembunyikan
  // langkah-langkah setup dan tampilkan konfirmasi ringkas saja (kecuali
  // pengguna sedang sengaja membuka form lewat "Ubah API key").
  if (onboardingSetup && onboardingDone && !onboardingForcedOpen) {
    onboardingSetup.hidden = hasKey;
    onboardingDone.hidden = !hasKey;
  }
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
      const locked = isTopicLocked(topic.id);
      btn.className = "nav-item" + (locked ? " locked" : "");
      btn.dataset.id = topic.id;
      btn.innerHTML =
        `<span class="dot ${topic.status === 'ready' ? 'dot-ready' : 'dot-soon'}"></span>` +
        `<span class="num">${topic.number}.</span>` +
        `<span class="label">${topic.title}</span>` +
        (locked ? `<svg class="lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="10.5" width="15" height="9.5" rx="1.6"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>` : "");
      btn.addEventListener("click", () => {
        if (isTopicLocked(topic.id)) {
          showToast("Selesaikan topik sebelumnya dulu, atau masukkan Kode Eksplorasi Bebas dari guru lewat tombol Pengaturan.");
          btn.blur();
          return;
        }
        selectTopic(topic.id);
        btn.blur();
      });
      nav.appendChild(btn);
    });
  });
}

function selectTopic(id) {
  if (isTopicLocked(id)) {
    showToast("Selesaikan topik sebelumnya dulu, atau masukkan Kode Eksplorasi Bebas dari guru lewat tombol Pengaturan.");
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
  const nextLockedTopic = nextReadyTopicId(currentTopic.id);
  if (isLastTab) {
    nextBtn.hidden = true;
    finishBtn.hidden = !nextLockedTopic || isUnlockAll();
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

document.getElementById("edit-followup-btn").addEventListener("click", async () => {
  const instruction = document.getElementById("edit-followup-input").value.trim();
  const status = document.getElementById("generate-status");
  const banner = document.getElementById("mode-banner");
  const backendUrl = getBackendUrl();
  const apiKey = getGeminiApiKey();

  if (editCount >= MAX_FOLLOWUP_EDITS) return;
  if (!lastGeneratedHTML) {
    status.textContent = "Belum ada simulasi untuk diedit - tekan Generate atau Coba Mode Demo dulu.";
    return;
  }
  if (!instruction) {
    status.textContent = "Tulis dulu instruksi editnya, misalnya bagian apa yang ingin diubah/ditambah.";
    return;
  }
  if (!apiKey) {
    status.textContent = "";
    banner.hidden = false;
    banner.innerHTML = `Edit lanjutan butuh AI sungguhan, jadi perlu API key Gemini pribadi. <button type="button" class="link-btn" id="mode-banner-key-btn-edit">Atur API key sekarang</button>.`;
    document.getElementById("mode-banner-key-btn-edit").addEventListener("click", openSettingsModal);
    return;
  }
  if (!backendUrl) {
    status.textContent = "";
    banner.hidden = false;
    banner.textContent = "Backend belum dikonfigurasi (lihat README.md bagian setup). Hubungi pengelola situs.";
    return;
  }

  const editPrompt = `Berikut kode HTML simulasi fisika yang SUDAH ADA (satu file lengkap, mandiri):\n\n${lastGeneratedHTML}\n\n---\nTolong EDIT/REVISI kode di atas sesuai instruksi berikut. Pertahankan bagian yang tidak diminta berubah dan tetap tentang konsep fisika yang sama. Kembalikan HANYA satu file HTML LENGKAP hasil revisi (bukan potongan - sertakan seluruh <!DOCTYPE html> sampai </html>), tanpa penjelasan tambahan di luar kode, tanpa code fence markdown.\n\nInstruksi edit dari siswa: ${instruction}`;

  status.textContent = `Menerapkan edit ke-${editCount + 1} dari ${MAX_FOLLOWUP_EDITS}, mohon tunggu (bisa 10-30 detik)...`;
  banner.hidden = true;
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
  document.getElementById("backend-url-input").value = getBackendUrl();
  document.getElementById("settings-key-input").value = getGeminiApiKey();
  refreshUnlockStatusUI();
  settingsModal.hidden = false;
}
document.getElementById("settings-btn").addEventListener("click", openSettingsModal);
document.getElementById("key-status-pill").addEventListener("click", openSettingsModal);
document.getElementById("lab-key-banner-btn").addEventListener("click", openSettingsModal);
document.getElementById("settings-close-btn").addEventListener("click", () => settingsModal.hidden = true);
document.getElementById("settings-close-x").addEventListener("click", () => settingsModal.hidden = true);
document.getElementById("settings-save-btn").addEventListener("click", () => {
  const backendVal = document.getElementById("backend-url-input").value.trim();
  if (backendVal) localStorage.setItem(STORAGE_KEY_BACKEND, backendVal);
  else localStorage.removeItem(STORAGE_KEY_BACKEND);

  saveGeminiApiKey(document.getElementById("settings-key-input").value);
  settingsModal.hidden = true;
});

/* ---------------- Onboarding (halaman Beranda) ---------------- */
document.getElementById("onboarding-save-btn").addEventListener("click", () => {
  const val = document.getElementById("onboarding-key-input").value.trim();
  onboardingForcedOpen = false;
  saveGeminiApiKey(val);
  if (val) {
    // Setup selesai: tutup kartu setup, langsung bawa pengguna ke konten
    // (Materi topik pertama yang sudah "Siap") alih-alih tetap di halaman
    // setup yang sudah tidak relevan lagi.
    const firstReady = TOPICS.find(t => t.status === "ready");
    if (firstReady) selectTopic(firstReady.id);
  }
});
document.getElementById("onboarding-change-key-btn").addEventListener("click", () => {
  onboardingForcedOpen = true;
  document.getElementById("onboarding-setup").hidden = false;
  document.getElementById("onboarding-done").hidden = true;
  document.getElementById("onboarding-key-input").focus();
});
document.getElementById("onboarding-toggle-visibility").addEventListener("click", () => {
  const input = document.getElementById("onboarding-key-input");
  input.type = input.type === "password" ? "text" : "password";
});
document.getElementById("onboarding-key-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("onboarding-save-btn").click();
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
