/* ============================================================
   teacher.js - Panel Guru (kontrol sesi kelas + monitoring)
   ------------------------------------------------------------
   Halaman terpisah dari index.html, dipakai GURU saja. Butuh
   TEACHER_CONTROL_CODE (didefinisikan server-side di
   apps-script/Code.gs) untuk masuk - kode ini TIDAK ada di kode
   klien mana pun, jadi tidak terlihat siswa lewat "View Source".
   ============================================================ */

const STORAGE_KEY_BACKEND_T = "physicsSandbox.backendUrl"; // sama dengan app.js, satu origin
const SESSION_KEY_CONTROL_CODE = "physicsSandbox.teacherControlCode"; // sessionStorage saja
const ROSTER_POLL_MS = 8000;

let rosterTimer = null;

function getBackendUrlT() {
  return (localStorage.getItem(STORAGE_KEY_BACKEND_T) || DEFAULT_BACKEND_URL || "").trim();
}
function getControlCode() {
  return (sessionStorage.getItem(SESSION_KEY_CONTROL_CODE) || "").trim();
}

function readyTopics() {
  return TOPICS.filter(t => t.status === "ready").sort((a, b) => a.number - b.number);
}
function topicTitle(id) {
  const t = TOPICS.find(x => x.id === id);
  return t ? `${t.number}. ${t.title}` : (id || "-");
}
const TAB_LABELS_T = ["Materi Belajar", "Eksperimen", "Latihan Soal", "Lab Simulasi Virtual"];

function populateTopicSelects() {
  const opts = readyTopics().map(t => `<option value="${t.id}">${t.number}. ${t.title}</option>`).join("");
  document.getElementById("teacher-topic-select").innerHTML = opts;
  document.getElementById("teacher-topic-select-2").innerHTML = opts;
}

async function callBackend(body) {
  const backendUrl = getBackendUrlT();
  if (!backendUrl) {
    return { error: "URL Backend belum diisi. Isi dulu di form login di atas (URL Apps Script Web App yang sama dengan situs utama)." };
  }
  try {
    const resp = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(body)
    });
    return await resp.json();
  } catch (err) {
    return { error: "Gagal terhubung ke backend: " + err.message };
  }
}

function relativeTime(ms) {
  if (!ms) return "-";
  const diff = Math.max(0, Date.now() - ms);
  const s = Math.round(diff / 1000);
  if (s < 5) return "baru saja";
  if (s < 60) return s + " detik lalu";
  const m = Math.round(s / 60);
  if (m < 60) return m + " menit lalu";
  const h = Math.round(m / 60);
  return h + " jam lalu";
}
function statusClass(ms) {
  if (!ms) return "stale";
  const diff = Date.now() - ms;
  if (diff < 20000) return "online";
  if (diff < 60000) return "away";
  return "stale";
}

function renderSessionUI(state) {
  const noSession = document.getElementById("teacher-no-session");
  const hasSession = document.getElementById("teacher-has-session");
  const codeDisplay = document.getElementById("teacher-code-display");
  const statusEl = document.getElementById("teacher-session-status");

  if (state && state.active) {
    noSession.hidden = true;
    hasSession.hidden = false;
    codeDisplay.textContent = state.code || "------";
    if (state.topicId) document.getElementById("teacher-topic-select-2").value = state.topicId;
    if (typeof state.tabIndex === "number") document.getElementById("teacher-tab-select-2").value = String(state.tabIndex);
    statusEl.textContent = `Sesi aktif - aktivitas sekarang: ${topicTitle(state.topicId)} - ${TAB_LABELS_T[state.tabIndex] || ""}.`;
  } else {
    noSession.hidden = false;
    hasSession.hidden = true;
    statusEl.textContent = "Belum ada sesi aktif.";
  }
}

function renderRoster(roster, serverNow) {
  const body = document.getElementById("roster-body");
  const countEl = document.getElementById("roster-count");
  const ids = Object.keys(roster || {});
  if (ids.length === 0) {
    body.innerHTML = `<tr><td colspan="3" class="muted small">Belum ada siswa yang gabung.</td></tr>`;
    countEl.textContent = "";
    return;
  }
  ids.sort((a, b) => (roster[b].lastSeen || 0) - (roster[a].lastSeen || 0));
  body.innerHTML = ids.map(id => {
    const r = roster[id];
    const cls = statusClass(r.lastSeen);
    const activity = r.topicId ? `${topicTitle(r.topicId)} - ${TAB_LABELS_T[r.tabIndex] || "?"}` : "-";
    return `<tr><td>${id}</td><td>${activity}</td><td><span class="status-dot ${cls}"></span>${relativeTime(r.lastSeen)}</td></tr>`;
  }).join("");
  const onlineCount = ids.filter(id => statusClass(roster[id].lastSeen) === "online").length;
  countEl.textContent = `${ids.length} siswa tercatat - ${onlineCount} online sekarang.`;
}

async function pollRoster() {
  const data = await callBackend({ mode: "teacher_roster", controlCode: getControlCode() });
  if (data.error) {
    document.getElementById("teacher-session-status").textContent = data.error;
    return;
  }
  renderSessionUI(data.state);
  renderRoster(data.roster, data.serverNow);
}
function startRosterPolling() {
  stopRosterPolling();
  pollRoster();
  rosterTimer = setInterval(pollRoster, ROSTER_POLL_MS);
}
function stopRosterPolling() {
  if (rosterTimer) { clearInterval(rosterTimer); rosterTimer = null; }
}

document.getElementById("teacher-login-btn").addEventListener("click", async () => {
  const backendVal = document.getElementById("teacher-backend-input").value.trim();
  const codeVal = document.getElementById("teacher-control-input").value.trim();
  const statusEl = document.getElementById("teacher-login-status");
  if (!codeVal) { statusEl.textContent = "Isi kode kontrol guru dulu."; return; }
  if (backendVal) localStorage.setItem(STORAGE_KEY_BACKEND_T, backendVal);
  sessionStorage.setItem(SESSION_KEY_CONTROL_CODE, codeVal);

  statusEl.textContent = "Memeriksa...";
  const data = await callBackend({ mode: "teacher_roster", controlCode: codeVal });
  if (data.error) {
    statusEl.textContent = data.error;
    sessionStorage.removeItem(SESSION_KEY_CONTROL_CODE);
    return;
  }
  document.getElementById("teacher-login-card").hidden = true;
  document.getElementById("teacher-panel").hidden = false;
  populateTopicSelects();
  renderSessionUI(data.state);
  renderRoster(data.roster, data.serverNow);
  startRosterPolling();
});

document.getElementById("teacher-start-btn").addEventListener("click", async () => {
  const topicId = document.getElementById("teacher-topic-select").value;
  const tabIndex = parseInt(document.getElementById("teacher-tab-select").value, 10);
  const statusEl = document.getElementById("teacher-session-status");
  statusEl.textContent = "Memulai sesi...";
  const data = await callBackend({ mode: "teacher_session", controlCode: getControlCode(), action: "start", topicId, tabIndex });
  if (data.error) { statusEl.textContent = data.error; return; }
  renderSessionUI(data.state);
});

document.getElementById("teacher-update-btn").addEventListener("click", async () => {
  const topicId = document.getElementById("teacher-topic-select-2").value;
  const tabIndex = parseInt(document.getElementById("teacher-tab-select-2").value, 10);
  const statusEl = document.getElementById("teacher-session-status");
  statusEl.textContent = "Menerapkan...";
  const data = await callBackend({ mode: "teacher_session", controlCode: getControlCode(), action: "update", topicId, tabIndex });
  if (data.error) { statusEl.textContent = data.error; return; }
  renderSessionUI(data.state);
});

document.getElementById("teacher-end-btn").addEventListener("click", async () => {
  const statusEl = document.getElementById("teacher-session-status");
  statusEl.textContent = "Mengakhiri sesi...";
  const data = await callBackend({ mode: "teacher_session", controlCode: getControlCode(), action: "end" });
  if (data.error) { statusEl.textContent = data.error; return; }
  renderSessionUI(data.state);
});

// Kalau backend URL sudah tersimpan dari situs utama (satu origin), isikan
// otomatis di form login supaya guru tidak perlu ketik ulang.
document.getElementById("teacher-backend-input").value = getBackendUrlT();
