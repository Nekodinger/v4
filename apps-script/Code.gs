/**
 * ============================================================
 * Code.gs, Backend proxy Google Apps Script untuk Physics Sandbox
 * Provider AI: Google Gemini API (GRATIS, ada free tier).
 * ------------------------------------------------------------
 * Fungsi: menerima prompt terstruktur dari tab "Lab Simulasi
 * Virtual", meneruskannya ke Gemini API untuk menghasilkan satu
 * file HTML simulasi fisika, lalu mengembalikan HTML tersebut ke
 * situs (GitHub Pages).
 *
 * ARSITEKTUR API KEY (PENTING):
 * Script ini TIDAK menyimpan API key siapa pun. Setiap pengguna
 * (guru/siswa) memasukkan API key Gemini MILIK MEREKA SENDIRI di
 * situs (dipandu di halaman Beranda), dan key itu dikirim sebagai
 * bagian dari isi permintaan (request body) setiap kali mereka
 * menekan tombol Generate. Script ini murni relay/perantara CORS:
 * meneruskan key yang dikirim pengguna itu ke Gemini API, tanpa
 * pernah menyimpannya di server mana pun. Ini dipilih supaya:
 * 1. Pemilik/deployer script ini tidak perlu membayar/menyediakan
 *    kuota API untuk semua orang yang memakai situs.
 * 2. Setiap pengguna memakai kuota gratis Gemini miliknya sendiri.
 * 3. Tidak ada API key developer yang tersimpan di server yang
 *    perlu dijaga kerahasiaannya.
 *
 * (Kenapa tetap butuh Apps Script sebagai perantara, bukan
 * langsung dari browser ke Gemini? Karena browser memanggil
 * Gemini API langsung akan kena pemblokiran CORS oleh Google,
 * sedangkan Apps Script Web App bisa dikonfigurasi merespons
 * permintaan lintas-origin untuk kasus "simple request" seperti
 * ini, lihat catatan CORS di jsonResponse() di bawah.)
 *
 * ============================================================
 * CARA SETUP (dilakukan SEKALI oleh pengelola situs, gratis):
 * 1. Buka https://script.google.com -> New project.
 * 2. Hapus kode default, tempel seluruh isi file ini.
 * 3. Klik Deploy -> New deployment -> pilih tipe "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 4. Klik Deploy, salin URL yang berakhiran ".../exec".
 * 5. Tempel URL itu ke js/config.js (DEFAULT_BACKEND_URL) di repo
 *    GitHub, lalu commit & push. URL ini BUKAN rahasia (tidak ada
 *    API key di dalamnya), aman dipublikasikan di kode situs.
 * 6. Setiap kali mengedit script ini, buat "New deployment" lagi
 *    (atau "Manage deployments" -> edit -> versi baru) supaya
 *    perubahan benar-benar aktif.
 *
 * Setiap pengguna situs lalu membuat API key Gemini gratis mereka
 * sendiri di https://aistudio.google.com/apikey (dipandu step by
 * step di halaman Beranda situs) dan memasukkannya sekali di
 * situs, tersimpan di browser mereka masing-masing saja.
 *
 * CATATAN PRIVASI: pada free tier Gemini, Google boleh memakai isi
 * prompt/output untuk peningkatan produk mereka (lihat kebijakan
 * data Gemini API). Jangan minta siswa memasukkan data pribadi ke
 * dalam prompt simulasi.
 * ============================================================
 */

const DEFAULT_MODEL = "gemini-2.5-flash";
// 8192 sering kena potong (finishReason MAX_TOKENS) karena model 2.5 Flash
// memakai sebagian token output untuk "thinking" internal sebelum menulis
// HTML-nya. gemini-2.5-flash mendukung sampai 65535 token output; kita pakai
// 48000 supaya longgar untuk thinking + HTML sekaligus tanpa mepet batas atas.
const MAX_OUTPUT_TOKENS = 48000;
// Sempat dicoba mematikan thinking sepenuhnya (thinkingBudget: 0) untuk
// menghindari truncation, TAPI ternyata menurunkan keandalan kode yang
// dihasilkan, animasi/perhitungan kadang tidak jalan karena model tidak
// sempat "menalar" logika fisika+JS sebelum menulis. -1 = dynamic thinking
// (model sendiri yang menentukan porsi thinking sesuai kerumitan prompt) -
// ini rekomendasi resmi Google, dan MAX_OUTPUT_TOKENS yang sudah besar di
// atas memberi cukup ruang untuk thinking + HTML tanpa kepotong lagi.
const THINKING_BUDGET = -1;

const SYSTEM_PROMPT = [
  "Kamu adalah asisten pembuat simulasi fisika interaktif untuk siswa AS & A Level Cambridge Physics (9702). Kamu menguasai fisika secara akurat, coding HTML/CSS/JS yang bersih, DAN prinsip desain visual untuk media pembelajaran.",
  "",
  "ATURAN OUTPUT (WAJIB DIIKUTI PERSIS):",
  "1. Balas HANYA dengan satu dokumen HTML lengkap, dimulai dari '<!DOCTYPE html>' dan diakhiri '</html>'.",
  "2. JANGAN menambahkan penjelasan, komentar di luar kode, atau markdown code fence (```) apa pun sebelum/sesudah HTML.",
  "3. Semua CSS dan JavaScript harus inline di dalam file itu (tag <style> dan <script>), TANPA memuat library/CDN eksternal apa pun (karena akan dijalankan di sandbox tanpa akses internet).",
  "",
  "ATURAN AKURASI FISIKA:",
  "4. Gunakan rumus fisika yang benar dan satuan SI, konsisten dengan silabus Cambridge International AS & A Level Physics 9702. Jika pengguna menyertakan 'Referensi rumus & konsep' di prompt, WAJIB memakai persis rumus/nilai itu, jangan mengganti dengan rumus lain dari memorimu meskipun terlihat mirip.",
  "5. Sebelum menulis kode, pastikan hubungan antar-variabel benar secara dimensi (satuan konsisten) dan hasil numeriknya masuk akal (misalnya kecepatan/percepatan tidak menghasilkan nilai negatif yang tidak masuk akal secara fisis kecuali memang dimaksudkan sebagai arah).",
  "",
  "ATURAN DESAIN VISUAL (PENTING, simulasi harus enak dipahami, bukan cuma benar):",
  "6. Gunakan palet warna yang kontras dan konsisten: satu warna tetap untuk satu besaran/objek di sepanjang simulasi (mis. selalu biru untuk kecepatan, oranye untuk percepatan/gaya), jangan berganti-ganti warna acak.",
  "7. Semua sumbu grafik WAJIB diberi label + satuan (mis. 't (s)', 'v (m/s)'), dan skala harus otomatis menyesuaikan rentang data supaya kurva selalu terlihat jelas di dalam area gambar.",
  "8. Tampilkan nilai numerik kunci (misalnya percepatan, kecepatan saat ini, waktu) secara real-time dan mudah dibaca, dengan pembulatan yang wajar (2-3 angka desimal), bukan angka mentah `toString()`.",
  "9. Gunakan animasi yang halus lewat requestAnimationFrame (bukan setInterval kasar), dengan kecepatan animasi yang masuk akal untuk diamati mata manusia (percepat/skalakan waktu simulasi bila perlu, dan jelaskan skalanya bila dipercepat).",
  "10. Jaga kontras teks terhadap latar (hindari teks abu-abu tipis di atas latar terang/gelap yang sulit dibaca), gunakan ukuran font yang cukup besar untuk dibaca di proyektor kelas, dan beri jarak/whitespace yang cukup supaya tidak terasa penuh sesak.",
  "11. Letakkan kontrol (slider/input) berkelompok rapi di satu sisi/panel, dan area visualisasi di sisi lain, sehingga siswa bisa mengubah variabel sambil tetap melihat hasilnya tanpa perlu scroll.",
  "12. Bila relevan, gambarkan diagram/vektor secara skematik (misalnya panah gaya atau kecepatan) alih-alih hanya angka, karena representasi visual membantu pemahaman konsep, beri legenda singkat jika ada lebih dari satu elemen visual.",
  "",
  "ATURAN KEBENARAN FUNGSIONAL (SANGAT PENTING, kode harus benar-benar berjalan, bukan cuma terlihat benar):",
  "13. Sebelum menuliskan HTML final, telusuri ULANG di kepalamu setiap event listener dan setiap fungsi animasi/hitung yang kamu tulis: pastikan semua variabel yang dipakai sudah dideklarasikan, semua id elemen yang dirujuk lewat getElementById/querySelector benar-benar ada di HTML, dan tidak ada function yang dipanggil sebelum didefinisikan. Satu error kecil (typo id, variabel belum dideklarasikan, dsb.) akan membuat SELURUH script gagal jalan tanpa pesan apa pun yang terlihat siswa, ini kegagalan paling fatal, lebih penting dihindari daripada menambah fitur.",
  "14. Jika simulasi butuh tombol 'Mulai/Jalankan' untuk memulai animasi, WAJIB: (a) beri label tombol yang jelas (mis. '▶ Mulai Simulasi'), (b) letakkan di posisi mencolok di bagian atas panel kontrol, dan (c) begitu halaman dimuat, gambar SATU frame kondisi awal (posisi awal, grafik kosong dengan sumbu, nilai t=0) memakai fungsi gambar yang SAMA dengan yang dipakai animasi, supaya siswa langsung tahu tombolnya perlu diklik alih-alih mengira simulasinya rusak/kosong.",
  "15. requestAnimationFrame HARUS memanggil ulang dirinya sendiri di akhir setiap frame (selama animasi belum selesai), jangan lupakan pemanggilan rekursif ini, ini penyebab paling umum animasi 'macet di frame pertama'.",
  "",
  "16. Tulis kode yang bersih dan diberi komentar singkat pada bagian-bagian penting, karena siswa yang memakainya juga sedang belajar coding dan mungkin membaca/mengedit kodenya."
].join("\n");

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const userPrompt = (body.prompt || "").toString().trim();
    if (!userPrompt) {
      return jsonResponse({ error: "Prompt kosong." });
    }
    if (userPrompt.length > 6000) {
      return jsonResponse({ error: "Prompt terlalu panjang (maks ~6000 karakter)." });
    }

    // API key dikirim oleh pengguna dari browser mereka sendiri (localStorage
    // di situs, diisi lewat panduan di halaman Beranda) - script ini TIDAK
    // menyimpan API key siapa pun. Lihat catatan arsitektur di atas.
    const apiKey = (body.apiKey || "").toString().trim();
    const model = (body.model || "").toString().trim() || DEFAULT_MODEL;

    if (!apiKey) {
      return jsonResponse({ error: "API key Gemini belum diisi. Buka halaman Beranda situs untuk memasukkan API key pribadimu (gratis dari Google AI Studio)." });
    }
    // Validasi format ringan supaya kesalahan salin-tempel cepat terdeteksi
    // (key Gemini asli dari AI Studio umumnya diawali 'AIza').
    if (apiKey.length < 20) {
      return jsonResponse({ error: "API key yang dikirim terlihat tidak valid (terlalu pendek). Periksa kembali API key yang kamu tempel di Pengaturan." });
    }

    const payload = {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: {
        maxOutputTokens: MAX_OUTPUT_TOKENS,
        temperature: 0.6,
        thinkingConfig: { thinkingBudget: THINKING_BUDGET }
      }
    };

    const url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + encodeURIComponent(apiKey);

    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    const status = response.getResponseCode();
    const data = JSON.parse(response.getContentText());

    if (status !== 200) {
      let msg = (data.error && data.error.message) ? data.error.message : ("HTTP " + status);
      if (status === 400 || status === 403) {
        msg = "API key ditolak Google (" + msg + "). Periksa kembali apakah API key yang kamu masukkan benar dan masih aktif di Google AI Studio.";
      }
      return jsonResponse({ error: "Gemini API error: " + msg });
    }

    const candidate = data.candidates && data.candidates[0];
    const finishReason = candidate && candidate.finishReason;
    const html = (candidate && candidate.content && candidate.content.parts && candidate.content.parts[0] && candidate.content.parts[0].text) || "";

    if (!html) {
      if (finishReason === "SAFETY") {
        return jsonResponse({ error: "Permintaan diblokir oleh filter keamanan Gemini. Coba ubah kata-kata prompt." });
      }
      return jsonResponse({ error: "Respons AI kosong, coba lagi (finishReason: " + finishReason + ")." });
    }
    if (finishReason === "MAX_TOKENS") {
      // Tetap kembalikan apa yang berhasil dibuat, tapi beri tahu kemungkinan terpotong.
      return jsonResponse({ html: html, warning: "Output mungkin terpotong (melebihi batas token). Coba kurangi kompleksitas yang diminta." });
    }

    return jsonResponse({ html: html });

  } catch (err) {
    return jsonResponse({ error: "Terjadi kesalahan di server: " + err.message });
  }
}

// Diperlukan agar mengunjungi URL Web App lewat browser tidak error
// (opsional, sekadar pesan status; permintaan sesungguhnya pakai POST).
function doGet(e) {
  return ContentService
    .createTextOutput("Physics Sandbox backend (Gemini relay) aktif. Kirim permintaan lewat POST dari situs, bukan lewat browser langsung. Backend ini tidak menyimpan API key siapa pun.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function jsonResponse(obj) {
  // Catatan CORS: front-end mengirim Content-Type "text/plain" (bukan
  // "application/json") supaya browser menganggapnya "simple request"
  // dan TIDAK melakukan preflight OPTIONS, karena Apps Script Web App
  // tidak bisa merespons preflight dengan benar. Respons ContentService
  // dari Apps Script Web App otomatis dapat diakses lintas origin (CORS)
  // untuk permintaan sederhana semacam ini.
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
