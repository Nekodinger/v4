/* ============================================================
   app.js - logika utama Physics Sandbox
   ============================================================ */

const STORAGE_KEY_BACKEND = "physicsSandbox.backendUrl";
const STORAGE_KEY_GEMINI = "physicsSandbox.geminiApiKey";
let currentTopic = null;
let lastGeneratedHTML = "";

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
      btn.className = "nav-item";
      btn.dataset.id = topic.id;
      btn.innerHTML =
        `<span class="dot ${topic.status === 'ready' ? 'dot-ready' : 'dot-soon'}"></span>` +
        `<span class="num">${topic.number}.</span>` +
        `<span class="label">${topic.title}</span>`;
      btn.addEventListener("click", () => { selectTopic(topic.id); btn.blur(); });
      nav.appendChild(btn);
    });
  });
}

function selectTopic(id) {
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
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === tabName));
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.toggle("active", p.id === "panel-" + tabName));
}
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
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
  refreshKeyStatusUI();
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
function openSettingsModal() {
  document.getElementById("backend-url-input").value = getBackendUrl();
  document.getElementById("settings-key-input").value = getGeminiApiKey();
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

/* ---------------- Init ---------------- */
renderNav();
refreshKeyStatusUI();
syncHeaderHeight();
