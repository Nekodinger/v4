/* ============================================================
   config.js
   Konfigurasi koneksi ke backend AI (Google Apps Script Web App).
   ------------------------------------------------------------
   CARA MENGAKTIFKAN GENERATE AI SUNGGUHAN UNTUK SEMUA SISWA:
   1. Deploy apps-script/Code.gs sebagai Web App (lihat README.md).
   2. Salin URL Web App yang diberikan (diakhiri "/exec").
   3. Tempel di bawah, di antara tanda kutip.
   4. Commit & push perubahan ini ke GitHub -> semua siswa yang
      membuka situs otomatis terhubung, tanpa perlu setting apa pun.

   Jika dikosongkan (""), situs akan otomatis berjalan di
   "Mode Demo" (memakai simulasi contoh yang sudah disiapkan,
   bukan hasil AI sungguhan) sampai URL ini diisi, ATAU sampai
   pengguna mengisi URL secara manual lewat tombol Pengaturan
   di pojok kanan atas (tersimpan di browser mereka masing-masing,
   berguna untuk testing tanpa perlu commit ke repo).
   ============================================================ */

const DEFAULT_BACKEND_URL = ""; // <-- isi URL Apps Script Web App kamu di sini
