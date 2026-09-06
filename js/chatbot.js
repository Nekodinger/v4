/* ============================================================
   chatbot.js
   Tutor Fisika offline: pencocokan kata kunci sederhana di
   browser (TANPA memanggil AI/internet apa pun), memakai bahan
   dari js/chatbot-data.js. Gaya balasannya sengaja Socratic:
   saat sebuah konsep pertama kali terdeteksi, tutor BERTANYA
   BALIK dulu; baru saat siswa membalas lagi, tutor mengungkap
   penjelasan singkat + pertanyaan lanjutan.
   ============================================================ */

window.Chatbot = (function () {
  let topicId = null;
  let pendingConcept = null; // concept yang sedang menunggu balasan siswa
  let initialized = false;

  function currentKB() {
    return (topicId && CHATBOT_KB[topicId]) ? CHATBOT_KB[topicId] : CHATBOT_KB.general;
  }

  function normalize(text) {
    return (text || "").toLowerCase().normalize("NFKD").replace(/[^\w\s]/g, " ");
  }

  // Cocokkan pesan siswa ke concept dengan skor keyword terbanyak yang cocok
  // (substring sederhana, bukan NLP). Mengembalikan concept terbaik atau null.
  function matchConcept(message) {
    const text = normalize(message);
    const kb = currentKB();
    let best = null;
    let bestScore = 0;
    kb.concepts.forEach(c => {
      let score = 0;
      c.keywords.forEach(kw => {
        if (text.includes(normalize(kw))) score += normalize(kw).split(" ").length; // frasa lebih panjang -> skor lebih tinggi
      });
      if (score > bestScore) { bestScore = score; best = c; }
    });
    return bestScore > 0 ? best : null;
  }

  function appendMessage(role, html) {
    const wrap = document.getElementById("chatbot-messages");
    const msg = document.createElement("div");
    msg.className = "chatbot-msg " + (role === "bot" ? "bot" : "user");
    msg.innerHTML = html;
    wrap.appendChild(msg);
    wrap.scrollTop = wrap.scrollHeight;
    if (role === "bot" && window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([msg]);
    }
  }

  function renderChips() {
    const chipsEl = document.getElementById("chatbot-chips");
    const kb = currentKB();
    chipsEl.innerHTML = "";
    (kb.chips || []).forEach(text => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chatbot-chip";
      chip.textContent = text;
      chip.addEventListener("click", () => handleUserMessage(text));
      chipsEl.appendChild(chip);
    });
  }

  function handleUserMessage(text) {
    text = (text || "").trim();
    if (!text) return;
    appendMessage("user", escapeHTML(text));

    const matched = matchConcept(text);

    if (matched && (!pendingConcept || pendingConcept.id !== matched.id)) {
      // Konsep baru terdeteksi -> tanya balik dulu (gaya Socratic).
      pendingConcept = matched;
      appendMessage("bot", escapeHTML(matched.ask));
      return;
    }

    if (pendingConcept) {
      // Siswa sudah membalas pertanyaan balik -> ungkap penjelasan + lanjutan.
      appendMessage("bot", escapeHTML(pendingConcept.explain) + "<br><br><em>" + escapeHTML(pendingConcept.followUp) + "</em>");
      pendingConcept = null;
      return;
    }

    // Tidak ada konsep yang cocok sama sekali.
    appendMessage("bot", "Aku belum kenali istilah fisika spesifik di pesanmu (tutor ini cuma mencocokkan kata kunci, bukan AI beneran). Coba sebutkan istilahnya langsung, misalnya salah satu dari contoh pertanyaan di bawah ini.");
    renderChips();
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  return {
    init() {
      if (initialized) return;
      initialized = true;
      document.getElementById("chatbot-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("chatbot-input");
        const text = input.value;
        input.value = "";
        handleUserMessage(text);
      });
    },

    setTopic(id) {
      topicId = id;
      pendingConcept = null;
      const label = document.getElementById("chatbot-topic-label");
      const kb = currentKB();
      const topic = (typeof TOPICS !== "undefined" ? TOPICS : []).find(t => t.id === id);
      label.textContent = (topic && CHATBOT_KB[id])
        ? `Konteks: ${topic.title}`
        : "Belum ada bahan khusus untuk topik ini - tutor menjawab secara umum.";
      renderChips();
      // Kalau panel sedang terbuka, mulai percakapan baru untuk topik ini.
      if (!document.getElementById("chatbot-panel").hidden) {
        document.getElementById("chatbot-messages").innerHTML = "";
        appendMessage("bot", escapeHTML(kb.greeting));
      }
    },

    onOpen() {
      const wrap = document.getElementById("chatbot-messages");
      if (wrap.children.length === 0) {
        appendMessage("bot", escapeHTML(currentKB().greeting));
        renderChips();
      }
    }
  };
})();
