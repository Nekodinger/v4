# Physics Sandbox - Platform Belajar & Lab Simulasi Fisika (AS/A Level Cambridge 9702)

Platform pembelajaran fisika berbasis web yang berisi:

- **Materi Belajar** per topik (rumus, penjelasan, tabel, foto dan video penjelasan yang relevan).
- **Eksperimen** nyata: praktikum fisik yang bisa dilakukan langsung di kelas/lab (tujuan, konsep, alat & bahan, langkah kerja, cara analisis data, keselamatan kerja, sampai pertanyaan diskusi), bukan simulasi komputer.
- **Latihan Soal** dengan pembahasan lengkap yang bisa disembunyikan/ditampilkan.
- **Lab Simulasi Virtual**: siswa mengisi *generator prompt terstruktur*, lalu AI (Google Gemini) menuliskan kode simulasi fisika HTML yang langsung tampil di preview, bisa diedit, dan diunduh. Setiap pengguna memakai API key Gemini gratis miliknya sendiri (lihat bagian 3).

Semua konten disusun mengikuti **25 topik silabus Cambridge International AS & A Level Physics 9702** (lihat `CURRICULUM.md`). Topik **Kinematics** sudah diisi penuh sebagai contoh/pilot; topik lain sudah punya struktur, tinggal diisi.

---

## 1. Struktur Proyek

```
physics-sandbox/
├── index.html              -> halaman utama (satu halaman, semua topik)
├── css/style.css            -> tampilan
├── js/config.js             -> URL backend AI (isi setelah deploy Apps Script)
├── js/content.js            -> SEMUA konten topik (materi, eksperimen, latihan soal)
├── js/demo-simulations.js   -> simulasi jadi (eksperimen Kinematics + mode demo lab)
├── js/app.js                -> logika situs (navigasi, tab, generator prompt, API key, dsb.)
├── apps-script/Code.gs      -> backend relay ke Gemini API (dipasang terpisah di Google Apps Script)
├── README.md                -> file ini
└── CURRICULUM.md            -> peta 25 topik + status pengisian konten
```

---

## 2. Menjalankan/deploy situs dengan GitHub Pages (gratis)

1. Buat akun GitHub (jika belum ada) di https://github.com.
2. Buat repository baru, misalnya `physics-sandbox` (boleh publik atau privat, Pages gratis untuk publik; untuk privat butuh GitHub Pro/organisasi sekolah, biasanya guru bisa cek dulu apakah sekolah punya GitHub Education).
3. Upload semua isi folder `physics-sandbox/` ke repo tersebut (bisa lewat web GitHub: "Add file" -> "Upload files", atau lewat `git push` jika terbiasa command line).
4. Masuk ke **Settings -> Pages** pada repo tersebut.
5. Pada **Branch**, pilih `main` dan folder `/root`, lalu **Save**.
6. Tunggu 1-2 menit, GitHub akan memberi URL seperti `https://<username>.github.io/physics-sandbox/`. Itulah alamat platform kamu, bisa dibagikan ke siswa.
7. Setiap kali mengedit file (menambah topik baru, dsb.), cukup upload ulang / commit, situs otomatis update dalam 1-2 menit.

> **Update konten tanpa coding berat**: sebagian besar pekerjaan menambah topik hanya mengedit `js/content.js` (menambah teks/HTML), tidak perlu menyentuh file lain.

---

## 3. Mengaktifkan AI generator (tab Lab Simulasi Virtual), GRATIS pakai Gemini

Situs GitHub Pages bersifat statis (tidak bisa menyimpan API key dengan aman sendiri), jadi kita pakai **Google Apps Script sebagai backend/perantara** yang aman untuk memanggil **Google Gemini API**. Gemini dipilih karena punya **free tier sungguhan** (tidak seperti Claude/OpenAI yang berbayar per pemakaian), cocok untuk dipakai banyak pengguna tanpa biaya.

**Penting, arsitektur API key:** backend (Apps Script) di proyek ini TIDAK menyimpan API key siapa pun. Setiap pengguna situs (guru maupun siswa) memasukkan API key Gemini **milik mereka sendiri**, dipandu langkah demi langkah langsung di halaman Beranda situs (dan bisa diubah lagi kapan saja lewat tombol **Pengaturan** di header). Key itu tersimpan hanya di browser pengguna masing-masing (localStorage) dan dikirim langsung ke Google setiap kali mereka menekan Generate, tidak pernah melewati atau disimpan di server pengelola situs. Keuntungannya:

- Pengelola/deployer situs tidak perlu membayar atau menyediakan kuota API untuk semua orang yang memakai situs.
- Setiap pengguna memakai kuota gratis Gemini miliknya sendiri.
- Tidak ada API key developer yang tersimpan di server dan perlu dijaga kerahasiaannya.

**Langkah setup backend relay (dilakukan sekali oleh pengelola situs, gratis):**

1. Buka https://script.google.com -> **New project**.
2. Hapus kode contoh, salin-tempel seluruh isi file `apps-script/Code.gs` dari proyek ini.
3. Klik **Deploy -> New deployment** -> pilih tipe **Web app**.
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Klik **Deploy**, salin URL yang diakhiri `/exec`. URL ini BUKAN rahasia (tidak berisi API key siapa pun), aman dipublikasikan di kode situs.
5. Buka `js/config.js` di repo GitHub kamu, isi:
   ```js
   const DEFAULT_BACKEND_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";
   ```
6. Commit & push perubahan itu. Semua pengguna yang membuka situs otomatis terhubung ke relay AI ini (mereka tetap perlu memasukkan API key Gemini pribadi masing-masing, lihat di bawah).

**Testing cepat tanpa commit ke repo:** klik tombol **Pengaturan** di situs, buka bagian "Pengaturan lanjutan", lalu tempel URL Web App di sana, tersimpan di browser kamu saja (untuk uji coba sebelum di-commit untuk semua orang).

**Bagaimana pengguna (guru/siswa) mendapatkan API key mereka sendiri:** situs memandu ini otomatis di halaman Beranda: buka https://aistudio.google.com/apikey, login dengan akun Google, klik **Create API key** (gratis), lalu tempel key itu di kolom yang disediakan di halaman Beranda atau di tombol Pengaturan. *(Free tier ada batas kecepatan/kuota harian, cek angka terbaru di https://ai.google.dev/gemini-api/docs/rate-limits karena bisa berubah. Untuk pemakaian satu orang/kelas biasanya sudah cukup.)*

**Jika API key belum diisi**, tab Lab Simulasi Virtual tetap menawarkan **Mode Demo** (tombol "Coba Mode Demo"): menampilkan simulasi contoh yang sudah disiapkan (bukan hasil AI sungguhan sesuai prompt), supaya pengguna tetap bisa mencoba alurnya sebelum menyiapkan API key.

**Catatan privasi**: pada free tier Gemini, Google boleh memakai isi prompt/output untuk peningkatan produk mereka (ini kebijakan standar layanan gratis mereka, cek detail terbaru di halaman pricing/data policy Gemini API). Wajar untuk prompt simulasi fisika, tapi ingatkan siswa untuk tidak memasukkan data pribadi ke dalam prompt.

**Mau ganti ke Claude nanti?** Bisa, tinggal ganti bagian yang memanggil API di `Code.gs` (endpoint, format request/response, dan cara membaca API key dari body permintaan) mengikuti dokumentasi di docs.claude.com; struktur proxy & sisi front-end tidak perlu diubah sama sekali.

### Troubleshooting koneksi AI

- **Error CORS di console browser**: pastikan front-end mengirim `Content-Type: text/plain` (sudah begitu di `app.js`), jangan diubah ke `application/json`, karena Apps Script tidak bisa menjawab *preflight request* dengan benar.
- **"API key Gemini belum diisi"**: pengguna perlu memasukkan API key pribadinya dulu lewat halaman Beranda atau tombol Pengaturan.
- **"API key ditolak Google"**: API key yang dimasukkan salah, sudah dihapus, atau bukan API key Gemini yang valid, minta pengguna membuat/menyalin ulang dari https://aistudio.google.com/apikey.
- **Deployment lama masih terpanggil**: setiap edit `Code.gs`, buat deployment versi baru lewat **Manage deployments**.
- **Respons AI terlalu panjang/terpotong (finishReason MAX_TOKENS)**: naikkan `MAX_OUTPUT_TOKENS` di `Code.gs` (defaultnya 48000), atau minta kompleksitas visual yang lebih rendah di prompt.
- **"Permintaan diblokir oleh filter keamanan Gemini"**: ubah kata-kata di prompt (jarang terjadi untuk topik fisika, tapi filter otomatis kadang terlalu sensitif terhadap kata tertentu).
- **Animasi/perhitungan di preview tidak jalan, atau tombol "Lihat Kode" menampilkan kode yang terlihat tidak lengkap**: hasil AI generatif tidak selalu 100% sempurna di setiap percobaan, situs otomatis mendeteksi hasil yang jelas rusak/terpotong (HTML tidak diakhiri `</html>`, tidak ada `<script>`, atau kurung kurawal tidak seimbang) dan menampilkan peringatan supaya kamu tahu harus generate ulang, bukan diam-diam menampilkan simulasi yang rusak. Kalau muncul peringatan ini (atau animasinya memang tidak berjalan meski tidak ada peringatan), coba klik **Generate** sekali lagi, cukup sering hasil berikutnya sudah benar, atau sederhanakan permintaan di prompt (kurangi jumlah grafik/kontrol sekaligus). Banyak simulasi juga sengaja perlu diklik tombol **"Mulai Simulasi"** di dalam preview dulu sebelum animasinya berjalan (ini disengaja, bukan bug, supaya siswa bisa atur variabel dulu sebelum menjalankan).

---

## 4. Menambah topik baru

Semua 25 topik silabus sudah terdaftar di `js/content.js` (array `TOPICS`) dengan status `"soon"`. Untuk mengisi salah satu topik:

1. Buka `js/content.js`.
2. Tulis konten materi (HTML biasa, boleh pakai `$...$` untuk rumus matematika, sudah otomatis dirender oleh MathJax), eksperimen, dan latihan soal, ikuti pola pada blok `KINEMATICS_...` yang sudah ada. Gunakan helper `mediaRow(image, video)` untuk menambahkan foto (Wikimedia Commons berlisensi bebas) dan video (YouTube embed) yang relevan, ikuti contoh di `KINEMATICS_MATERI`.
3. Ubah `status: "soon"` menjadi `status: "ready"` pada topik tersebut.
4. Tempelkan konten itu ke objek topik lewat kode seperti pola `attachKinematicsContent()` di bagian bawah file (tinggal duplikasi & ganti nama).
5. (Opsional) Isi `labConcepts` topik itu supaya dropdown generator prompt lebih relevan.

Tidak perlu mengubah `app.js` atau `index.html` sama sekali.

---

## 5. Ide pengembangan lanjutan

- Menambahkan sistem akun siswa & pelacakan progres (misalnya via Google Sheets + Apps Script sebagai database ringan, atau Firebase untuk skala lebih besar).
- Menyimpan simulasi hasil karya siswa (galeri kelas), bisa memakai Google Drive API dari Apps Script.
- Menambahkan bank soal gaya Cambridge past-paper yang lebih banyak per topik.
- Rate-limiting / kuota generate AI per siswa per hari (bisa ditambahkan di `Code.gs` menggunakan `PropertiesService` atau Google Sheets sebagai pencatat pemakaian), berguna jika suatu saat kembali memakai satu API key bersama.

---

## Sumber referensi silabus

- [Cambridge International AS & A Level Physics 9702 - ringkasan topik 2025-2027 (Gamatrain)](https://gamatrain.com/blog/54/cambridge-international-as-a-level-physics-9702-syllabus-content-assessment-and-routes-for-2025-2026-and-2027)
