/* ============================================================
   content.js
   Data & konten untuk semua topik AS/A Level Cambridge Physics (9702).
   ------------------------------------------------------------
   Cara menambah topik baru:
   1. Cari objek topik dengan id yang sesuai di TOPICS (semua 25 topik
      sudah didaftarkan dengan status "soon").
   2. Ganti status: "soon" -> "ready".
   3. Isi materiHTML, eksperimen{}, latihan[], labConcepts[] mengikuti
      contoh lengkap pada topik "kinematics" di bawah.
   Tidak perlu menyentuh app.js atau index.html untuk menambah topik.
   ============================================================ */

const TOPICS = [
  // ---------------- AS LEVEL (1-11) ----------------
  { id: "quantities", number: 1, level: "AS", title: "Physical Quantities and Units", status: "soon",
    desc: "Besaran pokok & turunan, satuan SI, angka penting, analisis dimensi." },

  { id: "kinematics", number: 2, level: "AS", title: "Kinematics", status: "ready",
    desc: "Mendeskripsikan gerak: jarak, perpindahan, kecepatan, percepatan, GLB, GLBB, gerak jatuh bebas, dan gerak parabola." },

  { id: "dynamics", number: 3, level: "AS", title: "Dynamics", status: "soon",
    desc: "Hukum Newton, momentum, dan konservasi momentum." },

  { id: "forces", number: 4, level: "AS", title: "Forces, Density and Pressure", status: "soon",
    desc: "Gaya, momen gaya, kesetimbangan, densitas, dan tekanan." },

  { id: "work-energy-power", number: 5, level: "AS", title: "Work, Energy and Power", status: "soon",
    desc: "Usaha, energi kinetik & potensial, hukum kekekalan energi, daya." },

  { id: "deformation", number: 6, level: "AS", title: "Deformation of Solids", status: "soon",
    desc: "Hukum Hooke, tegangan, regangan, modulus Young." },

  { id: "waves", number: 7, level: "AS", title: "Waves", status: "soon",
    desc: "Gelombang transversal & longitudinal, besaran gelombang, gelombang elektromagnetik." },

  { id: "superposition", number: 8, level: "AS", title: "Superposition", status: "soon",
    desc: "Interferensi, difraksi, gelombang berdiri, kisi difraksi." },

  { id: "electricity", number: 9, level: "AS", title: "Electricity", status: "soon",
    desc: "Arus listrik, GGL, resistivitas, hukum Ohm." },

  { id: "dc-circuits", number: 10, level: "AS", title: "D.C. Circuits", status: "soon",
    desc: "Rangkaian seri-paralel, hukum Kirchhoff, potensiometer." },

  { id: "particle-physics", number: 11, level: "AS", title: "Particle Physics", status: "soon",
    desc: "Struktur atom, radioaktivitas, model quark, partikel fundamental." },

  // ---------------- A LEVEL TAMBAHAN (12-25) ----------------
  { id: "circular-motion", number: 12, level: "A2", title: "Motion in a Circle", status: "soon",
    desc: "Kecepatan sudut, percepatan sentripetal, gaya sentripetal." },
  { id: "gravitational-fields", number: 13, level: "A2", title: "Gravitational Fields", status: "soon",
    desc: "Hukum gravitasi Newton, medan gravitasi, orbit satelit." },
  { id: "temperature", number: 14, level: "A2", title: "Temperature", status: "ready",
    desc: "Skala suhu, kesetimbangan termal, kapasitas panas." },
  { id: "ideal-gases", number: 15, level: "A2", title: "Ideal Gases", status: "ready",
    desc: "Hukum gas ideal, teori kinetik gas." },
  { id: "thermodynamics", number: 16, level: "A2", title: "Thermodynamics", status: "ready",
    desc: "Energi dalam, hukum pertama termodinamika." },
  { id: "oscillations", number: 17, level: "A2", title: "Oscillations", status: "soon",
    desc: "Gerak harmonik sederhana, resonansi, redaman." },
  { id: "electric-fields", number: 18, level: "A2", title: "Electric Fields", status: "soon",
    desc: "Medan listrik, hukum Coulomb, potensial listrik." },
  { id: "capacitance", number: 19, level: "A2", title: "Capacitance", status: "soon",
    desc: "Kapasitor, energi tersimpan, rangkaian RC." },
  { id: "magnetic-fields", number: 20, level: "A2", title: "Magnetic Fields", status: "ready",
    desc: "Gaya magnetik, medan magnet oleh arus, induksi elektromagnetik." },
  { id: "alternating-currents", number: 21, level: "A2", title: "Alternating Currents", status: "soon",
    desc: "Arus & tegangan AC, nilai rms, transformator." },
  { id: "quantum-physics", number: 22, level: "A2", title: "Quantum Physics", status: "soon",
    desc: "Efek fotolistrik, dualitas gelombang-partikel, tingkat energi." },
  { id: "nuclear-physics", number: 23, level: "A2", title: "Nuclear Physics", status: "soon",
    desc: "Struktur inti, peluruhan radioaktif, energi ikat inti." },
  { id: "medical-physics", number: 24, level: "A2", title: "Medical Physics", status: "soon",
    desc: "Pencitraan medis: ultrasound, X-ray, MRI." },
  { id: "astronomy", number: 25, level: "A2", title: "Astronomy and Cosmology", status: "soon",
    desc: "Jarak astronomis, pergeseran merah, hukum Hubble." },
];

/* ------------------------------------------------------------
   Media kontekstual (foto Wikimedia Commons berlisensi bebas +
   video YouTube dari kanal pendidikan yang sudah dikenal), dipakai
   sebagai ilustrasi kontekstual di Materi Belajar Kinematics.
   Helper mediaRow() merender pasangan foto+video jadi kartu.
   ------------------------------------------------------------ */
function mediaRow(image, video) {
  const imgPart = image ? `
    <div class="media-card">
      <img src="${image.src}" alt="${image.alt}" loading="lazy">
      <p class="media-caption">${image.caption}<br><em>Sumber: Wikimedia Commons, ${image.author} (${image.license})</em></p>
    </div>` : "";
  const vidPart = video ? `
    <div class="media-card">
      <div class="media-video-wrap">
        <iframe src="https://www.youtube.com/embed/${video.id}" title="${video.title}" allowfullscreen loading="lazy"></iframe>
      </div>
      <p class="media-caption"><strong>${video.title}</strong> &middot; ${video.channel}<br>${video.desc}</p>
    </div>` : "";
  return `<div class="media-row">${imgPart}${vidPart}</div>`;
}

/* ------------------------------------------------------------
   Konten lengkap: KINEMATICS (topik pilot)
   ------------------------------------------------------------ */

const KINEMATICS_MATERI = `
<h3>1. Besaran Dasar Kinematika</h3>
<table>
  <tr><th>Besaran</th><th>Jenis</th><th>Definisi singkat</th><th>Satuan SI</th></tr>
  <tr><td>Jarak (distance)</td><td>Skalar</td><td>Total lintasan yang ditempuh</td><td>m</td></tr>
  <tr><td>Perpindahan (displacement)</td><td>Vektor</td><td>Perubahan posisi dari titik awal ke akhir</td><td>m</td></tr>
  <tr><td>Kelajuan (speed)</td><td>Skalar</td><td>Jarak / waktu</td><td>m s⁻¹</td></tr>
  <tr><td>Kecepatan (velocity)</td><td>Vektor</td><td>Perpindahan / waktu</td><td>m s⁻¹</td></tr>
  <tr><td>Percepatan (acceleration)</td><td>Vektor</td><td>Laju perubahan kecepatan</td><td>m s⁻²</td></tr>
</table>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/4/40/Distancedisplacement.svg",
    alt: "Diagram jarak vs perpindahan",
    caption: "Perbandingan jarak (panjang lintasan total, garis putus-putus) dengan perpindahan (garis lurus posisi awal ke akhir).",
    author: "Stannered", license: "CC BY-SA 3.0" },
  { id: "vQCkYm3v3aA", title: "Distance and displacement introduction",
    channel: "Khan Academy", desc: "Penjelasan dasar perbedaan jarak (skalar) dan perpindahan (vektor) dengan contoh sederhana." }
)}

<h3>2. Gerak Lurus Beraturan (GLB)</h3>
<p>Kecepatan konstan, percepatan nol. Grafik $x$-$t$ berupa garis lurus (kemiringan = kecepatan).</p>
<div class="formula-box">$$v = \\dfrac{s}{t}$$</div>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/0/00/Uniform-motion.svg",
    alt: "Grafik x-t, v-t, a-t untuk gerak lurus beraturan",
    caption: "Tiga grafik gerak (posisi-waktu, kecepatan-waktu, percepatan-waktu) untuk benda dengan kecepatan konstan (GLB).",
    author: "MikeRun", license: "CC BY-SA 4.0" },
  { id: "pfTTHx9kCHk", title: "Instantaneous speed and velocity",
    channel: "Khan Academy", desc: "Membedakan kelajuan/kecepatan sesaat dengan rata-rata, dasar untuk memahami gerak dengan kecepatan tetap." }
)}

<h3>3. Gerak Lurus Berubah Beraturan (GLBB)</h3>
<p>Percepatan konstan. Empat persamaan GLBB (sesuai <em>List of Formulae</em> Cambridge 9702):</p>
<div class="formula-box">
$$v = u + at$$
$$s = ut + \\tfrac{1}{2}at^2$$
$$v^2 = u^2 + 2as$$
$$s = \\tfrac{1}{2}(u+v)t$$
</div>
<p>dengan $u$ = kecepatan awal, $v$ = kecepatan akhir, $a$ = percepatan, $s$ = perpindahan, $t$ = waktu.</p>
<p class="muted">Tip mengerjakan soal: tulis dulu variabel yang diketahui (u, v, a, s, t), lalu pilih persamaan yang tidak melibatkan variabel yang tidak diketahui/ditanya.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/4/41/Uniform-acceleration.svg",
    alt: "Grafik x-t, v-t, a-t untuk gerak dengan percepatan konstan",
    caption: "Tiga grafik gerak untuk benda dengan percepatan konstan (GLBB): perhatikan grafik x-t berbentuk parabola dan grafik v-t berupa garis lurus miring.",
    author: "MikeRun", license: "CC BY-SA 4.0" },
  { id: "MAS6mBRZZXA", title: "Average velocity for constant acceleration",
    channel: "Khan Academy", desc: "Menurunkan hubungan kecepatan rata-rata pada gerak dengan percepatan konstan, dasar dari persamaan-persamaan GLBB." }
)}

<h3>4. Gerak Jatuh Bebas</h3>
<p>Kasus khusus GLBB dengan $a = g = 9.81~\\text{m s}^{-2}$ (nilai standar pada data sheet Cambridge), kecepatan awal $u = 0$, arah ke bawah positif.</p>
<div class="formula-box">
$$h = \\tfrac{1}{2}gt^2 \\qquad v = gt \\qquad v^2 = 2gh$$
</div>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/0/02/Falling_ball.jpg",
    alt: "Foto stroboskopik bola jatuh bebas",
    caption: "Foto stroboskopik bola yang dijatuhkan bebas (20 kilatan/detik). Jarak antar posisi bola makin besar seiring waktu, sesuai $h \\propto t^2$.",
    author: "Michael N Maggs", license: "CC BY-SA 3.0" },
  { id: "tKIT68tYKnQ", title: "Free fall 1 body - solved example",
    channel: "Khan Academy", desc: "Contoh soal terpandu menghitung waktu dan kecepatan pada gerak jatuh bebas." }
)}

<h3>5. Gerak Vertikal ke Atas</h3>
<p>Percepatan tetap $g$ tetapi berlawanan arah dengan kecepatan awal (perlambatan). Di titik tertinggi, $v = 0$. Karena gerak simetris (tanpa hambatan udara), waktu naik sama dengan waktu turun.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/2/28/Vertical-projectile-motion-graphs.jpg",
    alt: "Grafik posisi dan kecepatan untuk gerak vertikal ke atas",
    caption: "Grafik posisi-waktu dan kecepatan-waktu untuk benda yang dilempar lurus ke atas lalu jatuh kembali karena gravitasi.",
    author: "MikeRun", license: "CC BY-SA 4.0" },
  { id: "2zj4mjBRuL4", title: "Vertical motion under gravity - ball thrown upwards from a balcony",
    channel: "ExamSolutions", desc: "Contoh soal gerak vertikal di bawah gravitasi untuk bola yang dilempar ke atas dari sebuah balkon." }
)}

<h3>6. Gerak Parabola (Projectile Motion)</h3>
<p>Gerak 2 dimensi: komponen horizontal (kecepatan konstan, GLB) dan vertikal (percepatan $g$, GLBB) bersifat <strong>independen</strong>.</p>
<div class="formula-box">
$$\\text{Waktu di udara: } T = \\dfrac{2u\\sin\\theta}{g} \\qquad
\\text{Tinggi maksimum: } H = \\dfrac{(u\\sin\\theta)^2}{2g} \\qquad
\\text{Jangkauan: } R = \\dfrac{u^2\\sin 2\\theta}{g}$$
</div>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Parabolic_trajectory.svg",
    alt: "Diagram lintasan parabola proyektil",
    caption: "Diagram lintasan parabola sebuah proyektil lengkap dengan vektor kecepatan pada salah satu titik lintasannya.",
    author: "Oleg Alexandrov", license: "Domain Publik" },
  { id: "ZZ39o1rAZWY", title: "Projectile at an angle",
    channel: "Khan Academy", desc: "Menguraikan gerak proyektil yang ditembakkan dengan sudut elevasi menjadi komponen horizontal dan vertikal." }
)}
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Bouncing_ball_strobe_edit.jpg",
    alt: "Foto stroboskopik bola memantul membentuk lintasan parabola",
    caption: "Foto stroboskopik bola yang memantul-mantul (25 frame/detik) - setiap lintasan antar pantulan membentuk kurva parabola akibat gravitasi.",
    author: "MichaelMaggs (edit: Richard Bartz)", license: "CC BY-SA 3.0" },
  { id: "jmSWImPs6fQ", title: "Horizontally launched projectile",
    channel: "Khan Academy", desc: "Kasus khusus gerak parabola: benda ditembakkan mendatar (kecepatan awal vertikal nol) dari suatu ketinggian." }
)}

<h3>7. Grafik Gerak</h3>
<ul>
  <li>Grafik $x$-$t$: gradien = kecepatan sesaat.</li>
  <li>Grafik $v$-$t$: gradien = percepatan; luas di bawah kurva = perpindahan.</li>
  <li>Grafik $a$-$t$: luas di bawah kurva = perubahan kecepatan.</li>
</ul>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Velocity_vs_time_graph.svg",
    alt: "Contoh grafik kecepatan terhadap waktu",
    caption: "Contoh grafik kecepatan terhadap waktu: gradien garis menunjukkan percepatan, dan luas di bawah kurva menunjukkan perpindahan.",
    author: "Titoxd / Stannered", license: "CC BY-SA 3.0" },
  { id: "GtoamALPOP0", title: "Position vs. time graphs",
    channel: "Khan Academy", desc: "Cara membaca dan menginterpretasikan grafik posisi terhadap waktu, termasuk arti kemiringan garisnya." }
)}
`;

const KINEMATICS_EKSPERIMEN = {
  title: "Eksperimen Nyata: GLBB Troli pada Bidang Miring (Pewaktu Ketik)",
  intro: `
    <p class="muted">Ini eksperimen fisik sungguhan yang dilakukan langsung di lab/kelas dengan alat nyata,
    bukan simulasi komputer. Kalau sekolahmu belum punya alatnya, lihat bagian
    <strong>Alternatif tanpa Pewaktu Ketik</strong> di bawah yang hanya butuh stopwatch dan meteran.</p>

    <h4>Tujuan</h4>
    <p>Menyelidiki gerak troli yang meluncur menuruni bidang miring (Gerak Lurus Berubah Beraturan/GLBB),
    mengukur percepatannya dari data eksperimen, dan membandingkannya dengan nilai teoritis.</p>

    <h4>Konsep Dasar</h4>
    <p>Ketika troli meluncur menuruni bidang miring dengan sudut $\\theta$ terhadap horizontal, komponen
    gravitasi sepanjang bidang ($mg\\sin\\theta$) dilawan oleh gaya gesek kinetik ($\\mu mg\\cos\\theta$),
    sehingga percepatan teoritisnya:</p>
    <div class="formula-box">$$a = g(\\sin\\theta - \\mu\\cos\\theta)$$</div>
    <p>dengan $\\theta$ = sudut kemiringan bidang, $\\mu$ = koefisien gesekan kinetik troli-bidang, dan
    $g = 9{,}81$ m s⁻². Karena troli bergerak dari keadaan diam ($u=0$) dengan percepatan tetap, berlaku
    persamaan GLBB: $s = \\frac{1}{2}at^2$ dan $v = at$, inilah yang akan kita verifikasi lewat data pita ketik.</p>

    <h4>Alat &amp; Bahan</h4>
    <ul>
      <li>Papan luncur/rel (runway) sepanjang kurang lebih 1 sampai 1,5 m, dan balok/buku untuk mengganjal salah satu ujungnya membentuk kemiringan (rasio landai sekitar 1:10 untuk permulaan)</li>
      <li>Troli dinamika (dynamics trolley)</li>
      <li>Pewaktu ketik (ticker-timer) beserta catu daya (power supply) AC-nya, dipasang di ujung atas bidang</li>
      <li>Pita ketik (ticker-tape) secukupnya, dan karbon/pita tinta pewaktu ketik</li>
      <li>Selotip, gunting, penggaris (ketelitian mm), busur derajat untuk mengukur sudut $\\theta$</li>
      <li>Kertas grafik/milimeter blok untuk menempel dan menganalisis potongan pita</li>
      <li>Tali/benang untuk direntangkan di ujung bawah papan (pengaman, lihat bagian Keselamatan)</li>
    </ul>

    <h4>Langkah Kerja</h4>
    <ol>
      <li>Susun papan luncur miring dengan sudut $\\theta$ kecil (sekitar 5 sampai 10 derajat), ukur sudutnya dengan busur derajat dan catat.</li>
      <li>Pasang pewaktu ketik di ujung atas papan, sambungkan ke catu daya AC. Untai/pasang pita ketik melalui pewaktu ketik dan tempelkan ujungnya ke troli.</li>
      <li>Rentangkan tali pengaman melintang di ujung bawah papan untuk menahan troli (lihat Keselamatan Kerja).</li>
      <li>Tahan troli diam tepat di ujung atas papan (dekat pewaktu ketik). Nyalakan pewaktu ketik, tunggu sampai berdetak stabil, lalu lepaskan troli bersamaan (satu siswa menyalakan alat, satu lagi menahan tali penarik pita agar tidak kusut).</li>
      <li>Biarkan troli meluncur bebas hingga hampir mencapai ujung bawah papan, lalu matikan pewaktu ketik sebelum troli ditahan tali pengaman.</li>
      <li>Lepaskan pita dari troli. Beri tanda titik awal yang jelas (titik-titik pertama biasanya berdekatan/berhimpit, pilih titik pertama yang jaraknya sudah mulai teratur bertambah sebagai titik awal analisis).</li>
      <li>Ulangi percobaan ini 2 sampai 3 kali untuk sudut yang sama (ambil rata-rata), lalu ulangi seluruh langkah untuk minimal 2 sudut $\\theta$ lain yang berbeda.</li>
    </ol>

    <h4>Cara Menganalisis Pita Ketik</h4>
    <p>Pewaktu ketik listrik AC di Indonesia membuat 50 titik per detik (frekuensi jala-jala PLN 50 Hz), jadi
    selang waktu antar-titik adalah:</p>
    <div class="formula-box">$$\\Delta t_{titik} = \\frac{1}{50\\text{ Hz}} = 0{,}02\\text{ s}$$</div>
    <p>Supaya lebih mudah dibaca dan galat pengukuran panjang per-segmen lebih kecil, potong pita menjadi
    kelompok <strong>10 selang titik (ten-tick tape)</strong>, tiap potongan mewakili $10 \\times 0{,}02 = 0{,}2$ s:</p>
    <ol>
      <li>Dari titik awal yang sudah ditandai, hitung dan gunting tiap 10 selang (11 titik jadi 1 potongan pita, potongan berikutnya mulai dari titik ke-11, dst).</li>
      <li>Tempelkan potongan-potongan pita itu berjajar tegak (vertikal) berdampingan di kertas grafik, urut dari kiri ke kanan sesuai urutan waktu, ini disebut <em>grafik batang kecepatan</em> (tape chart), karena panjang tiap potongan pita sebanding dengan kecepatan rata-rata troli selama 0,2 s itu.</li>
      <li>Ukur panjang tiap potongan pita ($\\Delta s$) dengan penggaris. Kecepatan rata-rata tiap potongan: $v = \\Delta s / 0{,}2\\text{ s}$.</li>
      <li>Plot $v$ (sumbu-y) terhadap waktu di tengah tiap interval (sumbu-x, kelipatan 0,2 s) untuk mendapatkan grafik $v$-$t$.</li>
      <li>Karena GLBB, titik-titik itu harus membentuk garis lurus. <strong>Gradien garis inilah percepatan hasil eksperimen</strong> ($a_{eksperimen} = \\Delta v / \\Delta t$).</li>
    </ol>

    <h4>Tabel Data (contoh, isi dengan data hasil percobaanmu)</h4>
    <table>
      <tr><th>Potongan ke-</th><th>Δs (cm)</th><th>t tengah interval (s)</th><th>v = Δs/0,2s (cm/s)</th></tr>
      <tr><td>1</td><td></td><td>0,1</td><td></td></tr>
      <tr><td>2</td><td></td><td>0,3</td><td></td></tr>
      <tr><td>3</td><td></td><td>0,5</td><td></td></tr>
      <tr><td>4</td><td></td><td>0,7</td><td></td></tr>
      <tr><td>5</td><td></td><td>0,9</td><td></td></tr>
    </table>
    <table>
      <tr><th>θ (°)</th><th>a teori $=g(\\sin\\theta-\\mu\\cos\\theta)$ (m s⁻²)</th><th>a eksperimen (gradien grafik v-t) (m s⁻²)</th><th>Selisih (%)</th></tr>
      <tr><td></td><td></td><td></td><td></td></tr>
      <tr><td></td><td></td><td></td><td></td></tr>
      <tr><td></td><td></td><td></td><td></td></tr>
    </table>

    <h4>Analisis &amp; Perhitungan</h4>
    <ul>
      <li>Hitung $a_{eksperimen}$ dari gradien grafik $v$-$t$ (bukan dari dua titik saja, tarik garis lurus terbaik/<em>line of best fit</em> lewat semua titik, lalu ambil gradiennya).</li>
      <li>Untuk membandingkan dengan teori, kamu perlu memperkirakan $\\mu$ (koefisien gesekan troli-papan), bisa diperkirakan lewat percobaan terpisah "kompensasi gesekan" (miringkan papan sedikit sampai troli yang diberi dorongan pelan bergerak dengan kecepatan konstan; pada kondisi ini $mg\\sin\\theta = \\mu mg\\cos\\theta$, sehingga $\\mu = \\tan\\theta$).</li>
      <li>Hitung persentase selisih antara $a_{eksperimen}$ dan $a_{teori}$: $\\left|\\dfrac{a_{eksperimen}-a_{teori}}{a_{teori}}\\right|\\times 100\\%$.</li>
    </ul>

    <h4>Keselamatan Kerja</h4>
    <ul>
      <li>Papan luncur cukup berat, angkat/pindahkan berdua, jangan sendirian.</li>
      <li>WAJIB pasang tali/benang melintang di ujung bawah papan supaya troli tidak meluncur jatuh mengenai kaki orang lain.</li>
      <li>Pewaktu ketik memakai listrik AC (jala-jala PLN), pastikan kabel dan steker dalam kondisi baik, jangan menyentuh bagian logam pewaktu ketik saat menyala, dan matikan segera setelah selesai satu percobaan.</li>
      <li>Perhatikan jarak antar kelompok di lab supaya papan luncur dan penarik pita tidak saling bertabrakan.</li>
    </ul>

    <h4>Sumber Kesalahan (untuk didiskusikan di laporan)</h4>
    <ul>
      <li>Gesekan troli tidak benar-benar konstan di sepanjang papan (permukaan roda/rel tidak sempurna rata).</li>
      <li>Kesalahan paralaks saat mengukur panjang potongan pita atau sudut kemiringan dengan busur derajat.</li>
      <li>Titik-titik pertama pada pita seringkali terlalu rapat/tidak stabil (troli belum bergerak stabil saat pewaktu ketik baru dinyalakan), sebaiknya diabaikan dari analisis.</li>
      <li>Variasi frekuensi jala-jala PLN pada praktiknya sangat kecil dari 50 Hz nominal, sehingga biasanya diabaikan.</li>
    </ul>

    <h4>Alternatif tanpa Pewaktu Ketik (kalau alat tidak tersedia)</h4>
    <p>Kalau sekolah belum punya pewaktu ketik, percobaan serupa tetap bisa dilakukan hanya dengan
    <strong>stopwatch, papan luncur, troli/bola, dan meteran</strong>:</p>
    <ol>
      <li>Miringkan papan landai (sekitar 1:10), beri tanda jarak setiap 25 cm dari titik pelepasan (misalnya 25 cm, 50 cm, 75 cm, 100 cm, dst).</li>
      <li>Lepaskan troli/bola dari keadaan diam di titik awal, ukur waktu tempuh ke setiap tanda jarak dengan stopwatch. Ulangi tiap jarak 3 kali, ambil rata-rata waktunya untuk mengurangi galat reaksi tangan.</li>
      <li>Hitung kecepatan rata-rata tiap segmen 25 cm ($v = \\Delta s/\\Delta t$), lalu buat grafik $v$ terhadap $t$ (waktu di tengah tiap segmen), gradiennya adalah percepatan, sama seperti metode pita ketik.</li>
      <li>Cara ini lebih sederhana tapi kurang presisi (galat reaksi stopwatch cukup besar untuk gerak cepat), cocok sebagai alternatif, bukan pengganti yang setara.</li>
    </ol>

    <h4>Pertanyaan Diskusi</h4>
    <ul>
      <li>Pada sudut berapa troli tepat akan mulai bergerak dengan kecepatan konstan (percepatan = 0)? Apa artinya kondisi $\\tan\\theta = \\mu$ secara fisis?</li>
      <li>Mengapa titik-titik pertama pada pita ketik biasanya tidak dipakai dalam analisis?</li>
      <li>Jika grafik $v$-$t$ hasil eksperimenmu tidak melewati titik asal (0,0), apa kemungkinan penyebabnya?</li>
      <li>Bagaimana pengaruh memperbesar sudut $\\theta$ terhadap persentase kontribusi gesekan pada percepatan total?</li>
    </ul>

    <h4>Simulasi Prediksi (opsional)</h4>
    <p class="muted">Sebelum atau sesudah praktikum, kamu bisa coba simulasi interaktif di bawah ini untuk
    memprediksi/mengecek percepatan teoritis pada berbagai $\\theta$ dan $\\mu$, tapi ingat, ini hanya model
    komputer untuk membantu prediksi, <strong>bukan pengganti data eksperimen nyata di atas</strong>.</p>

    <h4>Referensi</h4>
    <ul>
      <li><a href="https://spark.iop.org/finding-average-acceleration-ticker-timer" target="_blank" rel="noopener">Finding average acceleration with a ticker-timer, IOPSpark</a></li>
      <li><a href="https://spark.iop.org/timing-trolley-slope" target="_blank" rel="noopener">Timing a trolley on a slope, IOPSpark</a></li>
      <li><a href="https://spark.iop.org/ticker-timers-investigating-speed" target="_blank" rel="noopener">Ticker-timers for investigating speed, IOPSpark</a></li>
    </ul>
  `
};

/* type: "mcq" atau "structured".
   Untuk mcq: options[] dan correct = index jawaban benar. */
const KINEMATICS_LATIHAN = [
  {
    type: "mcq",
    question: "Sebuah mobil bergerak dari keadaan diam dan mengalami percepatan tetap hingga mencapai kecepatan 20 m s⁻¹ dalam waktu 8 s. Berapakah percepatan mobil tersebut?",
    options: ["0.4 m s⁻²", "2.0 m s⁻²", "2.5 m s⁻²", "160 m s⁻²"],
    correct: 2,
    solution: `Gunakan $v = u + at$ dengan $u = 0$, $v = 20~\\text{m s}^{-1}$, $t = 8~\\text{s}$.
    <br>$a = \\dfrac{v-u}{t} = \\dfrac{20-0}{8} = 2.5~\\text{m s}^{-2}$.`
  },
  {
    type: "mcq",
    question: "Menggunakan data soal sebelumnya (dipercepat dari diam menjadi 20 m s⁻¹ dalam 8 s), berapa jarak yang ditempuh mobil selama 8 s tersebut?",
    options: ["40 m", "80 m", "160 m", "200 m"],
    correct: 1,
    solution: `Gunakan $s = \\tfrac{1}{2}(u+v)t = \\tfrac{1}{2}(0+20)(8) = 80~\\text{m}$.
    <br>Bisa juga dicek dengan $s = ut + \\tfrac12 at^2 = 0 + \\tfrac12(2.5)(8^2) = 80~\\text{m}$, hasil konsisten.`
  },
  {
    type: "structured",
    question: "Sebuah batu dijatuhkan (tanpa kecepatan awal) dari puncak tebing setinggi 45 m. Ambil $g = 9.81~\\text{m s}^{-2}$ dan abaikan hambatan udara. Tentukan (a) waktu batu sampai ke dasar tebing, (b) kecepatan batu saat menyentuh tanah.",
    solution: `<strong>(a)</strong> $h = \\tfrac12 gt^2 \\Rightarrow t = \\sqrt{\\dfrac{2h}{g}} = \\sqrt{\\dfrac{2(45)}{9.81}} = \\sqrt{9.17} \\approx 3.03~\\text{s}$.
    <br><strong>(b)</strong> $v = gt = 9.81 \\times 3.03 \\approx 29.7~\\text{m s}^{-1}$
    <br>atau langsung: $v = \\sqrt{2gh} = \\sqrt{2(9.81)(45)} = \\sqrt{882.9} \\approx 29.7~\\text{m s}^{-1}$, konsisten.`
  },
  {
    type: "structured",
    question: "Sebuah bola ditendang secara horizontal dari atas tebing setinggi 20 m dengan kecepatan 15 m s⁻¹. Ambil $g = 9.81~\\text{m s}^{-2}$. Tentukan (a) waktu bola berada di udara, (b) jarak horizontal (jangkauan) bola saat mendarat.",
    solution: `<strong>(a)</strong> Gerak vertikal tidak bergantung pada gerak horizontal. $h = \\tfrac12 gt^2 \\Rightarrow t = \\sqrt{\\dfrac{2(20)}{9.81}} = \\sqrt{4.077} \\approx 2.02~\\text{s}$.
    <br><strong>(b)</strong> Gerak horizontal adalah GLB: $x = v_x \\, t = 15 \\times 2.02 \\approx 30.3~\\text{m}$.`
  },
  {
    type: "structured",
    question: "Data kecepatan-waktu sebuah benda: $t$ (s) = 0, 1, 2, 3, 4 dan $v$ (m s⁻¹) = 0, 5, 10, 15, 20. Tentukan (a) percepatan benda, (b) jarak total yang ditempuh dalam 4 s.",
    solution: `<strong>(a)</strong> Kecepatan bertambah 5 m s⁻¹ setiap 1 s (uniform), jadi $a = \\dfrac{\\Delta v}{\\Delta t} = \\dfrac{5}{1} = 5~\\text{m s}^{-2}$.
    <br><strong>(b)</strong> Jarak = luas di bawah grafik $v$-$t$ (bentuk segitiga) $= \\tfrac12 \\times 4 \\times 20 = 40~\\text{m}$.
    <br>Cek dengan $s = ut + \\tfrac12 at^2 = 0 + \\tfrac12(5)(4^2) = 40~\\text{m}$, konsisten.`
  },
  {
    type: "structured",
    question: "Sebuah bola dilempar vertikal ke atas dengan kecepatan awal 24.5 m s⁻¹ dari permukaan tanah. Ambil $g = 9.81~\\text{m s}^{-2}$ dan abaikan hambatan udara. Tentukan (a) waktu untuk mencapai titik tertinggi, (b) tinggi maksimum yang dicapai, (c) total waktu bola berada di udara sebelum kembali ke titik lempar.",
    solution: `<strong>(a)</strong> Di titik tertinggi $v = 0$: $v = u - gt \\Rightarrow t = \\dfrac{u}{g} = \\dfrac{24.5}{9.81} \\approx 2.50~\\text{s}$.
    <br><strong>(b)</strong> $H = \\dfrac{u^2}{2g} = \\dfrac{24.5^2}{2(9.81)} = \\dfrac{600.25}{19.62} \\approx 30.6~\\text{m}$.
    <br><strong>(c)</strong> Karena gerak simetris (naik = turun): $T = 2t = 2(2.50) \\approx 5.00~\\text{s}$.`
  }
];

/* Lembar rumus ringkas (plain text), dipakai sebagai "grounding" otomatis:
   ditempelkan ke prompt yang dikirim ke AI supaya AI memakai persis rumus
   & nilai yang sudah divalidasi guru, bukan menebak dari pengetahuan umum. */
const KINEMATICS_FORMULA_SHEET = `
- Besaran: jarak & kelajuan (skalar); perpindahan, kecepatan, percepatan (vektor).
- GLB (kecepatan konstan): v = s / t
- GLBB (percepatan konstan), 4 persamaan: v = u + a t ; s = u t + 1/2 a t^2 ; v^2 = u^2 + 2 a s ; s = 1/2 (u+v) t
  (u = kecepatan awal, v = kecepatan akhir, a = percepatan, s = perpindahan, t = waktu)
- Gerak jatuh bebas (kasus khusus GLBB, u=0, a=g): h = 1/2 g t^2 ; v = g t ; v^2 = 2 g h
- Gerak vertikal ke atas: perlambatan g melawan arah gerak; di titik tertinggi v=0; waktu naik = waktu turun (tanpa hambatan udara)
- Gerak parabola (horizontal GLB + vertikal GLBB independen), dengan sudut elevasi θ dan kecepatan awal u:
  waktu di udara T = 2 u sin(θ) / g ; tinggi maksimum H = (u sin θ)^2 / (2g) ; jangkauan R = u^2 sin(2θ) / g
- Nilai standar g = 9.81 m/s^2 (data sheet Cambridge), kecuali diminta lain oleh pengguna.
- Grafik: gradien x-t = kecepatan; gradien v-t = percepatan; luas di bawah v-t = perpindahan.
`;

/* Konsep spesifik untuk dropdown Generator Prompt di Lab Simulasi Virtual */
const KINEMATICS_LAB_CONCEPTS = [
  "Gerak Lurus Beraturan (GLB)",
  "Gerak Lurus Berubah Beraturan (GLBB)",
  "Gerak Jatuh Bebas",
  "Gerak Vertikal ke Atas",
  "Gerak Parabola (Projectile Motion)",
  "Hubungan grafik x-t, v-t, dan a-t",
  "Lainnya (tulis sendiri di instruksi tambahan)"
];

// Default konsep generik untuk topik yang belum "ready" (masih bisa dicoba di Lab)
const DEFAULT_LAB_CONCEPTS = ["Konsep umum topik ini (jelaskan di instruksi tambahan)"];

/* Tempelkan konten lengkap ke objek topik "kinematics" */
(function attachKinematicsContent() {
  const topic = TOPICS.find(t => t.id === "kinematics");
  topic.materiHTML = KINEMATICS_MATERI;
  topic.eksperimen = KINEMATICS_EKSPERIMEN;
  topic.eksperimen.simHTML = INCLINE_TROLLEY_SIM;
  topic.latihan = KINEMATICS_LATIHAN;
  topic.labConcepts = KINEMATICS_LAB_CONCEPTS;
  topic.formulaSheet = KINEMATICS_FORMULA_SHEET;
})();

/* ------------------------------------------------------------
   Konten lengkap: MAGNETIC FIELDS (topik 20)
   ------------------------------------------------------------ */

const MAGNETIC_MATERI = `
<h3>1. Medan Magnet dan Fluks Magnetik</h3>
<p>Medan magnet adalah daerah di sekitar magnet atau penghantar berarus di mana benda magnetik atau muatan
bergerak lain akan mengalami gaya. Kekuatan medan magnet dinyatakan sebagai <strong>rapat fluks magnetik
(magnetic flux density)</strong> $B$, dengan satuan SI tesla (T).</p>
<p>Arah medan magnet digambarkan dengan garis medan (field lines): keluar dari kutub utara, masuk ke kutub
selatan, dan tidak pernah berpotongan. Kerapatan garis menunjukkan kekuatan medan di titik tersebut.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/2/25/Iron-filings-around-magnet.jpg",
    alt: "Pola serbuk besi di sekitar magnet batang menunjukkan garis medan magnet",
    caption: "Serbuk besi yang ditaburkan di sekitar magnet batang menyusun diri mengikuti garis medan magnet, dari kutub utara menuju kutub selatan.",
    author: "Benjamin Crowell (Bcrowell)", license: "CC BY-SA 2.0" },
  null
)}

<h3>2. Medan Magnet oleh Arus Listrik</h3>
<p>Arus listrik yang mengalir dalam penghantar selalu menghasilkan medan magnet di sekitarnya (percobaan
Oersted). Arahnya ditentukan dengan <strong>kaidah genggaman tangan kanan (right-hand grip rule)</strong>:
genggam penghantar dengan ibu jari menunjuk arah arus konvensional, arah lengkungan jari-jari menunjukkan
arah medan magnet.</p>
<table>
  <tr><th>Bentuk penghantar</th><th>Pola medan magnet</th><th>Rapat fluks (di titik acuan)</th></tr>
  <tr><td>Kawat lurus panjang</td><td>Lingkaran konsentris mengelilingi kawat</td><td>Sebanding $I$, berbanding terbalik dengan jarak $d$ dari kawat</td></tr>
  <tr><td>Loop melingkar (satu lilitan)</td><td>Mirip medan magnet batang, terkuat di pusat loop</td><td>Sebanding $I$, berbanding terbalik dengan jari-jari loop</td></tr>
  <tr><td>Solenoida (kumparan panjang)</td><td>Hampir seragam dan sejajar di dalam kumparan, mirip magnet batang</td><td>Sebanding $I$ dan jumlah lilitan per satuan panjang $n$</td></tr>
</table>
<p class="muted">Cambridge 9702 tidak menuntut penurunan rumus $B$ dari hukum Biot-Savart, tetapi menuntut kemampuan
menggambar dan mengenali pola garis medan di atas serta menentukan arahnya dengan kaidah tangan kanan.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/3/34/Right-hand_grip_rule.svg",
    alt: "Kaidah genggaman tangan kanan untuk kawat lurus berarus",
    caption: "Kaidah genggaman tangan kanan: ibu jari menunjuk arah arus konvensional $I$, lengkungan jari menunjukkan arah medan magnet $B$ di sekitar kawat lurus.",
    author: "Schorschi2 (asli), versi SVG oleh Wizard191", license: "Domain Publik" },
  { id: "I809vLGN1B8", title: "Field due to straight wire carrying current",
    channel: "Khan Academy", desc: "Penjelasan pola medan magnet di sekitar kawat lurus berarus dan cara menentukan arahnya." }
)}
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/9/91/Solenoid_field_lines_rough_vector.svg",
    alt: "Pola garis medan magnet di dalam dan luar solenoida",
    caption: "Garis medan magnet pada solenoida: hampir seragam dan sejajar sumbu di bagian dalam kumparan, menyerupai pola medan magnet batang di bagian luar.",
    author: "Ле Лой (Le Loy)", license: "CC0 (Domain Publik)" },
  null
)}

<h3>3. Gaya Magnetik pada Penghantar Berarus</h3>
<p>Penghantar berarus yang berada dalam medan magnet luar akan mengalami gaya (disebut juga efek motor).
Besarnya gaya:</p>
<div class="formula-box">$$F = BIL\\sin\\theta$$</div>
<p>dengan $B$ = rapat fluks magnetik (T), $I$ = arus (A), $L$ = panjang penghantar dalam medan (m), dan
$\\theta$ = sudut antara arah arus dan arah medan magnet. Gaya maksimum ($F=BIL$) terjadi saat penghantar
tegak lurus terhadap medan ($\\theta = 90°$); gaya nol saat penghantar sejajar medan ($\\theta = 0°$).</p>
<p>Arah gaya ditentukan dengan <strong>Kaidah Tangan Kiri Fleming</strong>: telunjuk menunjuk arah medan
magnet (Field), jari tengah menunjuk arah arus (Current), dan ibu jari menunjukkan arah gaya/gerak
(Thrust) - ketiganya saling tegak lurus.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Right_hand_rule_cross_product_F%3DJ%C3%97B.svg",
    alt: "Diagram vektor gaya F, arus I, dan medan magnet B saling tegak lurus",
    caption: "Diagram vektor: gaya $F$ pada penghantar berarus selalu tegak lurus terhadap arah arus $I$ dan medan magnet $B$. Untuk menentukan arahnya dengan tangan, gunakan Kaidah Tangan Kiri Fleming (telunjuk = medan, jari tengah = arus, ibu jari = gaya).",
    author: "Tokamac", license: "CC BY-SA 4.0" },
  { id: "ckllSgcdS7g", title: "Force on a current-carrying conductor in a magnetic field",
    channel: "Khan Academy", desc: "Menjelaskan asal gaya pada penghantar berarus dalam medan magnet dan cara menghitungnya dengan F = BIL sin theta." }
)}

<h3>4. Gaya Magnetik pada Muatan Bergerak</h3>
<p>Sebuah muatan $Q$ yang bergerak dengan kelajuan $v$ di dalam medan magnet $B$ juga mengalami gaya
magnetik (sering disebut gaya Lorentz jika digabung dengan gaya listrik):</p>
<div class="formula-box">$$F = BQv\\sin\\theta$$</div>
<p>dengan $\\theta$ = sudut antara arah kecepatan $v$ dan arah medan $B$. Arah gaya tetap ditentukan dengan
Kaidah Tangan Kiri Fleming (telunjuk = medan, jari tengah = arah gerak muatan positif, ibu jari = gaya).</p>
<p>Karena gaya magnetik selalu tegak lurus terhadap kecepatan, gaya ini <strong>tidak pernah melakukan usaha</strong>
pada muatan (tidak mengubah besar kelajuan, hanya arah geraknya). Jika muatan bergerak tegak lurus terhadap
medan magnet seragam, gaya magnetik berperan sebagai gaya sentripetal sehingga lintasannya berbentuk
<strong>lingkaran</strong> dengan jari-jari:</p>
<div class="formula-box">$$BQv = \\dfrac{mv^2}{r} \\quad\\Rightarrow\\quad r = \\dfrac{mv}{BQ}$$</div>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Lorentz_force.svg",
    alt: "Diagram gaya Lorentz pada muatan bergerak dalam medan magnet",
    caption: "Gaya magnetik pada muatan yang bergerak dalam medan magnet selalu tegak lurus terhadap kecepatannya, menyebabkan lintasan melengkung (melingkar jika medan seragam dan tegak lurus kecepatan).",
    author: "Jaro.p", license: "CC BY-SA 3.0" },
  { id: "NnlAI4ZiUrQ", title: "Magnetic force on a charge",
    channel: "Khan Academy", desc: "Menjelaskan gaya magnetik pada muatan bergerak (F = BQv sin theta) dan mengapa lintasannya bisa berbentuk lingkaran." }
)}

<h3>5. Fluks Magnetik dan Induksi Elektromagnetik</h3>
<p><strong>Fluks magnetik</strong> $\\Phi$ melalui suatu bidang seluas $A$ didefinisikan sebagai:</p>
<div class="formula-box">$$\\Phi = BA\\cos\\theta$$</div>
<p>dengan $\\theta$ = sudut antara arah medan magnet $B$ dan garis normal (tegak lurus) bidang tersebut,
satuan fluks adalah weber (Wb), dengan $1~\\text{Wb} = 1~\\text{T m}^2$.</p>
<p><strong>Hukum Faraday</strong> menyatakan bahwa GGL (gaya gerak listrik) induksi yang timbul pada suatu
rangkaian sebanding dengan laju perubahan fluks magnetik (fluks-linkage $N\\Phi$ untuk kumparan $N$ lilitan)
yang melaluinya:</p>
<div class="formula-box">$$\\varepsilon = -N\\dfrac{\\Delta\\Phi}{\\Delta t}$$</div>
<p>GGL induksi dapat timbul karena magnet/medan bergerak relatif terhadap kumparan, kumparan bergerak dalam
medan magnet, atau medan magnet yang berubah terhadap waktu (misalnya arus bolak-balik pada kumparan lain
di dekatnya).</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Faraday%27s_law_of_induction.svg",
    alt: "Tiga cara menghasilkan GGL induksi sesuai Hukum Faraday",
    caption: "Tiga situasi yang menghasilkan GGL induksi sesuai Hukum Faraday: (a) rangkaian bergerak dalam medan magnet tetap, (b) rangkaian diam dengan magnet/medan yang bergerak, (c) medan magnet yang berubah terhadap waktu.",
    author: "Jähmefyysikko", license: "CC0 (Domain Publik)" },
  { id: "vcStzn55MG0", title: "Faraday's Law Introduction",
    channel: "Khan Academy", desc: "Pengantar Hukum Faraday tentang induksi elektromagnetik dan hubungan GGL induksi dengan laju perubahan fluks magnetik." }
)}

<h3>6. Hukum Lenz</h3>
<p>Tanda negatif pada persamaan Hukum Faraday merepresentasikan <strong>Hukum Lenz</strong>: arah arus
induksi selalu sedemikian rupa sehingga medan magnet yang dihasilkannya <strong>melawan (menentang)
perubahan fluks</strong> yang menyebabkannya. Hukum Lenz sebenarnya adalah konsekuensi dari hukum kekekalan
energi, karena jika arah arus induksi justru memperkuat perubahan fluks, energi akan tercipta tanpa usaha
dari luar (melanggar hukum kekekalan energi).</p>
<p class="muted">Contoh penerapan: saat kutub utara magnet didekatkan ke kumparan, arus induksi mengalir
sedemikian sehingga ujung kumparan yang menghadap magnet menjadi kutub utara juga (menolak magnet yang
mendekat); saat magnet dijauhkan, ujung kumparan itu menjadi kutub selatan (menarik magnet yang menjauh,
melawan gerakannya).</p>
${mediaRow(
  null,
  { id: "xxZenoBs2Pg", title: "Lenz's Law",
    channel: "Khan Academy", desc: "Penjelasan Hukum Lenz: mengapa arah arus induksi selalu melawan perubahan fluks magnetik yang menghasilkannya, dan kaitannya dengan hukum kekekalan energi." }
)}
`;

const MAGNETIC_EKSPERIMEN = {
  title: "Eksperimen Nyata: Menentukan Rapat Fluks Magnetik dengan Neraca Arus (Current Balance)",
  intro: `
    <p class="muted">Ini eksperimen fisik sungguhan dengan alat lab nyata (neraca timbang elektronik,
    magnet, dan catu daya), bukan simulasi komputer. Eksperimen ini adalah versi Cambridge/A-Level dari
    praktikum standar untuk memverifikasi $F = BIL$ dan menentukan rapat fluks magnetik $B$ sebuah pasangan
    magnet secara kuantitatif.</p>

    <h4>Tujuan</h4>
    <p>Menyelidiki hubungan antara gaya magnetik $F$ pada penghantar berarus dengan besar arus $I$ yang
    mengalir, serta menentukan rapat fluks magnetik $B$ di antara sepasang magnet dari data eksperimen.</p>

    <h4>Konsep Dasar</h4>
    <p>Ketika kawat berarus diletakkan tegak lurus di antara kutub-kutub magnet, kawat mengalami gaya
    magnetik $F = BIL$ (Hukum III Newton: gaya yang sama besar namun berlawanan arah juga bekerja pada
    magnet). Jika magnet diletakkan di atas neraca timbang elektronik dan kawat dipasang tetap (tidak
    bergerak) tepat di celah magnet, maka gaya reaksi pada magnet ini akan terbaca sebagai <strong>perubahan
    massa terukur</strong> $\\Delta m$ pada neraca:</p>
    <div class="formula-box">$$F = \\Delta m \\times g$$</div>
    <p>dengan $g = 9{,}81$ m s⁻². Karena $F = BIL$ (dengan $\\theta = 90°$ karena kawat tegak lurus medan),
    plot grafik $F$ terhadap $I$ akan berupa garis lurus melalui titik asal dengan gradien $BL$. Karena
    panjang $L$ (lebar magnet yang dilalui kawat) bisa diukur langsung, rapat fluks magnetik dapat dihitung:</p>
    <div class="formula-box">$$B = \\dfrac{\\text{gradien grafik } F\\text{-}I}{L}$$</div>

    <h4>Alat &amp; Bahan</h4>
    <ul>
      <li>Sepasang magnet Magnadur (atau magnet U/ladam) yang dipasang pada yoke besi lunak sehingga membentuk celah dengan medan magnet homogen</li>
      <li>Neraca timbang elektronik (top-pan balance) dengan ketelitian minimal 0,01 g</li>
      <li>Dua batang statif dan penjepit untuk menggantung/menahan kawat tetap horizontal, melewati celah magnet tanpa menyentuhnya</li>
      <li>Kawat tembaga tebal (kaku, tidak mudah melengkung), panjang secukupnya untuk direntangkan di antara dua statif</li>
      <li>Catu daya arus searah (DC) yang dapat diatur (variable power supply), 0 - 6 A</li>
      <li>Amperemeter (atau gunakan pembacaan arus dari catu daya jika sudah terkalibrasi), kabel penghubung, dan rheostat/resistor variabel untuk mengatur arus secara bertahap</li>
      <li>Penggaris atau jangka sorong untuk mengukur panjang $L$ (lebar magnet yang dilalui kawat, dalam arah kawat)</li>
    </ul>

    <h4>Langkah Kerja</h4>
    <ol>
      <li>Letakkan magnet (di atas yoke) tepat di tengah piringan neraca timbang elektronik, lalu <strong>nolkan (tare)</strong> neraca sehingga pembacaannya 0,00 g dengan magnet di atasnya tetapi belum ada arus mengalir.</li>
      <li>Pasang kawat tembaga horizontal di antara dua statif sedemikian rupa sehingga bagian tengah kawat berada tepat di celah antara kutub-kutub magnet, tegak lurus terhadap arah medan, dan tidak menyentuh magnet maupun neraca.</li>
      <li>Hubungkan kawat ke catu daya DC melalui amperemeter dan rheostat, jangan nyalakan dulu.</li>
      <li>Ukur dan catat panjang $L$ (lebar magnet dalam arah sepanjang kawat, yaitu panjang kawat yang benar-benar berada dalam medan magnet).</li>
      <li>Nyalakan arus sebesar 0,50 A, catat pembacaan massa pada neraca setelah stabil. Jika pembacaan berkurang (negatif) alih-alih bertambah, balik arah arus atau posisi kutub magnet supaya pembacaan bertambah (memudahkan pembacaan positif).</li>
      <li>Naikkan arus secara bertahap sebesar 0,50 A setiap kali (0,50 A; 1,00 A; 1,50 A; ... hingga sekitar 4,00-5,00 A, jangan berlebihan agar kawat tidak terlalu panas), catat pembacaan massa pada tiap nilai arus.</li>
      <li>Matikan arus, pastikan neraca kembali ke 0,00 g (jika tidak, ulangi tare dan seluruh pengukuran). Ulangi seluruh rangkaian pengukuran ini 2 kali lagi untuk mendapatkan rata-rata di setiap nilai arus.</li>
    </ol>

    <h4>Tabel Data (contoh, isi dengan data hasil percobaanmu)</h4>
    <table>
      <tr><th>I (A)</th><th>Δm₁ (g)</th><th>Δm₂ (g)</th><th>Δm₃ (g)</th><th>Δm rata-rata (g)</th><th>F = Δm × g (N)</th></tr>
      <tr><td>0,50</td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td>1,00</td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td>1,50</td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td>2,00</td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td>2,50</td><td></td><td></td><td></td><td></td><td></td></tr>
    </table>
    <p class="muted">Ingat: massa pada neraca dalam gram (g) harus diubah ke kilogram (bagi 1000) sebelum
    dikalikan $g = 9{,}81$ m s⁻² untuk mendapatkan gaya $F$ dalam newton.</p>

    <h4>Analisis &amp; Perhitungan</h4>
    <ul>
      <li>Plot grafik $F$ (sumbu-y, satuan N) terhadap $I$ (sumbu-x, satuan A). Data yang benar akan membentuk garis lurus melalui (atau sangat dekat) titik asal (0,0).</li>
      <li>Tarik garis lurus terbaik (line of best fit), hitung gradiennya: gradien $= \\dfrac{\\Delta F}{\\Delta I}$ (satuan T m, karena gradien $= BL$).</li>
      <li>Hitung rapat fluks magnetik: $B = \\dfrac{\\text{gradien}}{L}$, dengan $L$ dalam meter.</li>
      <li>Magnadur sekolah pada umumnya memiliki $B$ di kisaran $0{,}1$ sampai $0{,}5$ T; bandingkan hasilmu dengan rentang ini sebagai pengecekan kewajaran (bukan nilai "benar" mutlak, karena tiap set magnet berbeda).</li>
    </ul>

    <h4>Keselamatan Kerja</h4>
    <ul>
      <li>Arus beberapa ampere membuat kawat menjadi panas, jangan menyentuh kawat saat arus mengalir, terutama setelah beberapa menit pengukuran berturut-turut.</li>
      <li>Matikan catu daya di antara pengukuran jika kawat terasa mulai memanas, biarkan dingin sebelum melanjutkan.</li>
      <li>Pastikan sambungan kabel rapi dan tidak ada bagian logam terbuka yang bisa tersentuh tangan basah.</li>
      <li>Magnet Magnadur bersifat rapuh (mudah retak jika terjatuh), tangani dan letakkan dengan hati-hati.</li>
    </ul>

    <h4>Sumber Kesalahan (untuk didiskusikan di laporan)</h4>
    <ul>
      <li>Arus bolak-balik dari jala-jala yang tidak stabil pada catu daya murah dapat membuat pembacaan amperemeter sedikit berfluktuasi.</li>
      <li>Kawat yang sedikit menyentuh magnet atau statif dapat memberi pembacaan gaya tambahan yang salah (gesekan/beban mekanis, bukan gaya magnetik murni).</li>
      <li>Panjang $L$ yang diukur mungkin tidak persis sama dengan panjang efektif kawat dalam medan homogen (medan magnet melemah secara bertahap di tepi celah magnet, bukan berhenti tiba-tiba).</li>
      <li>Getaran meja atau hembusan angin (draught) dapat mengganggu kestabilan pembacaan neraca elektronik.</li>
    </ul>

    <h4>Alternatif tanpa Neraca Timbang Elektronik (kalau alat tidak tersedia)</h4>
    <p>Kalau sekolah belum punya neraca timbang elektronik yang cukup presisi, percobaan versi kualitatif
    tetap bisa dilakukan dengan <strong>neraca arus sederhana buatan sendiri</strong>: gantungkan sebuah loop
    kawat tipis (atau strip aluminium foil) pada seutas benang di antara kutub-kutub sepasang magnet
    Magnadur, sehingga loop bisa berayun bebas mendekat/menjauh dari magnet ketika dialiri arus. Amati bahwa
    (a) loop bergerak/menyimpang saat arus dinyalakan, (b) arah simpangan berbalik saat arah arus dibalik,
    dan (c) besar simpangan bertambah seiring arus diperbesar, sesuai $F = BIL$. Cara ini tidak memberi nilai
    $B$ secara numerik, tetapi tetap memverifikasi hubungan $F \\propto I$ secara kualitatif.</p>

    <h4>Pertanyaan Diskusi</h4>
    <ul>
      <li>Mengapa grafik $F$ terhadap $I$ seharusnya berupa garis lurus melalui titik asal, bukan kurva?</li>
      <li>Apa yang terjadi pada pembacaan neraca jika arah arus dibalik? Jelaskan dengan Hukum III Newton dan Kaidah Tangan Kiri Fleming.</li>
      <li>Jika jarak antar kutub magnet diperbesar (medan menjadi kurang homogen/lebih lemah), bagaimana pengaruhnya terhadap gradien grafik $F$-$I$ yang kamu peroleh?</li>
      <li>Mengapa penting menolkan (tare) neraca dengan magnet sudah berada di atasnya, sebelum arus dinyalakan?</li>
    </ul>

    <h4>Referensi</h4>
    <ul>
      <li><a href="https://pmt.physicsandmathstutor.com/download/Physics/A-level/Notes/AQA/Practical-Skills/RP%2010%20-%20Magnetic%20Force%20on%20a%20Wire.pdf" target="_blank" rel="noopener">Required Practical 10: Magnetic Force on a Wire, Physics & Maths Tutor (AQA A-level)</a></li>
      <li><a href="https://spark.iop.org/current-balance" target="_blank" rel="noopener">The current balance, IOPSpark</a></li>
      <li><a href="https://spark.iop.org/force-wire-carrying-current-magnetic-field" target="_blank" rel="noopener">Force on a wire carrying a current in a magnetic field, IOPSpark</a></li>
      <li><a href="https://spark.iop.org/episode-412-force-conductor-magnetic-field" target="_blank" rel="noopener">Episode 412: The force on a conductor in a magnetic field, IOPSpark</a></li>
    </ul>
  `
};

const MAGNETIC_LATIHAN = [
  {
    type: "mcq",
    question: "Sebuah kawat lurus sepanjang 0,40 m dialiri arus 3,0 A tegak lurus terhadap medan magnet homogen dengan rapat fluks 0,25 T. Berapakah besar gaya magnetik pada kawat tersebut?",
    options: ["0,030 N", "0,30 N", "3,0 N", "30 N"],
    correct: 1,
    solution: `Karena kawat tegak lurus medan, $\\theta = 90°$ sehingga $\\sin\\theta = 1$.
    <br>$F = BIL\\sin\\theta = 0{,}25 \\times 3{,}0 \\times 0{,}40 \\times 1 = 0{,}30~\\text{N}$.`
  },
  {
    type: "mcq",
    question: "Sebuah kawat horizontal membawa arus mengarah ke timur, berada dalam medan magnet horizontal seragam yang mengarah ke utara. Menurut Kaidah Tangan Kiri Fleming, ke arah manakah gaya magnetik pada kawat tersebut?",
    options: ["Vertikal ke atas (menjauhi tanah)", "Vertikal ke bawah (menuju tanah)", "Ke arah barat", "Ke arah selatan"],
    correct: 0,
    solution: `Kaidah Tangan Kiri Fleming: telunjuk = arah medan (Utara), jari tengah = arah arus (Timur), ibu jari = arah gaya.
    <br>Karena arah arus dan medan saling tegak lurus di bidang horizontal, gaya yang tegak lurus terhadap keduanya haruslah vertikal.
    <br>Dengan telunjuk ke Utara dan jari tengah ke Timur, ibu jari (arah gaya) mengarah <strong>vertikal ke atas</strong>.`
  },
  {
    type: "structured",
    question: "Sebuah kawat sepanjang 25 cm membawa arus 4,0 A tegak lurus terhadap medan magnet homogen. Gaya yang terukur bekerja pada kawat adalah 0,60 N. Tentukan rapat fluks magnetik B.",
    solution: `Karena tegak lurus, $\\sin\\theta = 1$, dan $L = 25~\\text{cm} = 0{,}25~\\text{m}$.
    <br>$F = BIL \\Rightarrow B = \\dfrac{F}{IL} = \\dfrac{0{,}60}{4{,}0 \\times 0{,}25} = \\dfrac{0{,}60}{1{,}0} = 0{,}60~\\text{T}$.`
  },
  {
    type: "structured",
    question: "Sebuah kawat sepanjang 0,50 m membawa arus 2,0 A membentuk sudut 40 derajat terhadap arah medan magnet homogen dengan rapat fluks 0,80 T. Hitunglah gaya magnetik yang bekerja pada kawat.",
    solution: `$F = BIL\\sin\\theta = 0{,}80 \\times 2{,}0 \\times 0{,}50 \\times \\sin 40°$.
    <br>$\\sin 40° \\approx 0{,}643$, sehingga $F \\approx 0{,}80 \\times 2{,}0 \\times 0{,}50 \\times 0{,}643 \\approx 0{,}51~\\text{N}$.`
  },
  {
    type: "structured",
    question: "Sebuah elektron (massa $9{,}11\\times10^{-31}$ kg, muatan $1{,}60\\times10^{-19}$ C) bergerak dengan kelajuan $2{,}0\\times10^{6}$ m s⁻¹ tegak lurus terhadap medan magnet homogen sebesar 0,50 mT. Tentukan (a) besar gaya magnetik pada elektron, (b) jari-jari lintasan melingkarnya.",
    solution: `<strong>(a)</strong> $B = 0{,}50~\\text{mT} = 5{,}0\\times10^{-4}~\\text{T}$, dan karena tegak lurus, $\\sin\\theta=1$.
    <br>$F = BQv = (5{,}0\\times10^{-4})(1{,}60\\times10^{-19})(2{,}0\\times10^{6}) = 1{,}6\\times10^{-16}~\\text{N}$.
    <br><strong>(b)</strong> Gaya magnetik berperan sebagai gaya sentripetal: $r = \\dfrac{mv}{BQ} = \\dfrac{(9{,}11\\times10^{-31})(2{,}0\\times10^{6})}{(5{,}0\\times10^{-4})(1{,}60\\times10^{-19})} = \\dfrac{1{,}822\\times10^{-24}}{8{,}0\\times10^{-23}} \\approx 2{,}3\\times10^{-2}~\\text{m} = 2{,}3~\\text{cm}$.`
  },
  {
    type: "structured",
    question: "Sebuah kumparan datar dengan 200 lilitan dan luas penampang $5{,}0\\times10^{-3}$ m² diletakkan tegak lurus terhadap suatu medan magnet (garis normal kumparan sejajar medan). Medan magnet berubah secara linear dari 0,10 T menjadi 0,50 T dalam waktu 0,20 s. Tentukan (a) besar perubahan fluks magnetik yang melalui satu lilitan, (b) GGL induksi rata-rata pada kumparan.",
    solution: `<strong>(a)</strong> Karena garis normal sejajar medan, $\\theta = 0°$ sehingga $\\Phi = BA$.
    <br>$\\Phi_{awal} = 0{,}10 \\times 5{,}0\\times10^{-3} = 5{,}0\\times10^{-4}~\\text{Wb}$.
    <br>$\\Phi_{akhir} = 0{,}50 \\times 5{,}0\\times10^{-3} = 2{,}5\\times10^{-3}~\\text{Wb}$.
    <br>$\\Delta\\Phi = 2{,}5\\times10^{-3} - 5{,}0\\times10^{-4} = 2{,}0\\times10^{-3}~\\text{Wb}$.
    <br><strong>(b)</strong> $\\varepsilon = N\\dfrac{\\Delta\\Phi}{\\Delta t} = 200 \\times \\dfrac{2{,}0\\times10^{-3}}{0{,}20} = 200 \\times 0{,}010 = 2{,}0~\\text{V}$.`
  }
];

/* Lembar rumus ringkas (plain text), dipakai sebagai "grounding" otomatis:
   ditempelkan ke prompt yang dikirim ke AI supaya AI memakai persis rumus
   & konvensi yang sudah divalidasi guru, bukan menebak dari pengetahuan umum. */
const MAGNETIC_FORMULA_SHEET = `
- Rapat fluks magnetik B, satuan tesla (T). Arah medan: keluar dari kutub utara, masuk ke kutub selatan.
- Medan magnet oleh arus: arah ditentukan kaidah genggaman tangan kanan (ibu jari = arah arus, lengkungan jari = arah medan).
  Pola: kawat lurus -> lingkaran konsentris; loop melingkar -> mirip magnet batang, terkuat di pusat; solenoida -> hampir seragam & sejajar sumbu di dalam kumparan.
- Gaya pada penghantar berarus (efek motor): F = B I L sin(theta), theta = sudut antara arus dan medan. Maksimum saat tegak lurus (theta=90), nol saat sejajar (theta=0).
  Arah gaya: Kaidah Tangan Kiri Fleming (telunjuk = medan/Field, jari tengah = arus/Current, ibu jari = gaya/Thrust).
- Gaya pada muatan bergerak: F = B Q v sin(theta). Gaya magnetik selalu tegak lurus kecepatan sehingga tidak melakukan usaha (kelajuan tetap).
  Jika v tegak lurus B (medan seragam), lintasan berbentuk lingkaran dengan jari-jari r = m v / (B Q) (gaya magnetik = gaya sentripetal).
- Fluks magnetik: Phi = B A cos(theta), theta = sudut antara medan B dan garis normal bidang. Satuan weber (Wb), 1 Wb = 1 T m^2.
- Hukum Faraday: GGL induksi (EMF) = -N (perubahan Phi)/(perubahan waktu) = -N dPhi/dt. GGL timbul dari perubahan fluks (gerak relatif magnet-kumparan, atau medan yang berubah waktu).
- Hukum Lenz (tanda negatif pada Hukum Faraday): arah arus induksi selalu melawan/menentang perubahan fluks yang menyebabkannya, konsekuensi hukum kekekalan energi.
- Nilai standar g = 9.81 m/s^2 dipakai untuk mengubah bacaan massa neraca (gram) menjadi gaya (newton) pada eksperimen current balance, kecuali diminta lain oleh pengguna.
`;

/* Konsep spesifik untuk dropdown Generator Prompt di Lab Simulasi Virtual */
const MAGNETIC_LAB_CONCEPTS = [
  "Medan Magnet oleh Kawat Lurus Berarus (Kaidah Tangan Kanan)",
  "Medan Magnet oleh Solenoida/Kumparan",
  "Gaya Magnetik pada Penghantar Berarus (F = BIL, Kaidah Tangan Kiri Fleming)",
  "Gaya Magnetik pada Muatan Bergerak dan Lintasan Melingkar (F = BQv)",
  "Induksi Elektromagnetik (Hukum Faraday)",
  "Hukum Lenz (arah arus induksi)",
  "Lainnya (tulis sendiri di instruksi tambahan)"
];

/* Tempelkan konten lengkap ke objek topik "magnetic-fields" */
(function attachMagneticFieldsContent() {
  const topic = TOPICS.find(t => t.id === "magnetic-fields");
  topic.materiHTML = MAGNETIC_MATERI;
  topic.eksperimen = MAGNETIC_EKSPERIMEN;
  topic.latihan = MAGNETIC_LATIHAN;
  topic.labConcepts = MAGNETIC_LAB_CONCEPTS;
  topic.formulaSheet = MAGNETIC_FORMULA_SHEET;
})();

/* ------------------------------------------------------------
   Konten lengkap: TEMPERATURE (topik 14, A2)
   ------------------------------------------------------------ */

/* ------------------------------------------------------------
   Konten lengkap: TEMPERATURE (topik 14, A2)
   File draft berdiri sendiri - akan digabungkan manual ke content.js
   Tidak mendefinisikan ulang mediaRow() atau TOPICS (sudah ada di content.js).
   ------------------------------------------------------------ */

const TEMPERATURE_MATERI = `
<h3>1. Kesetimbangan Termal dan Konsep Suhu</h3>
<p>Ketika dua benda dengan suhu berbeda disentuhkan (atau dihubungkan sehingga kalor bisa mengalir di
antara keduanya), kalor akan mengalir secara neto dari benda yang <strong>bersuhu lebih tinggi</strong> ke
benda yang <strong>bersuhu lebih rendah</strong>. Aliran neto ini terus berlangsung sampai suhu keduanya
sama - pada kondisi ini dikatakan kedua benda berada dalam <strong>kesetimbangan termal (thermal
equilibrium)</strong>, dan tidak ada lagi aliran kalor neto di antara keduanya (meskipun secara mikroskopis,
molekul-molekul tetap saling bertukar energi ke dua arah, hanya saja jumlahnya sama besar).</p>
<p>Inilah ide dasar mengapa <strong>suhu</strong> didefinisikan sebagai besaran yang menentukan apakah dua
benda berada dalam kesetimbangan termal atau tidak: dua benda dengan suhu yang sama tidak akan saling
memberi/menyerap kalor neto satu sama lain. Gagasan ini kadang disebut sebagai <em>Hukum ke-Nol
Termodinamika</em> dalam pembahasan yang lebih formal (jika benda A setimbang termal dengan benda C, dan
benda B juga setimbang termal dengan benda C, maka A pasti setimbang termal dengan B juga) - konsep inilah
yang membuat termometer bisa dipakai untuk mengukur suhu benda lain secara konsisten.</p>
<p class="muted">Termometer sendiri bekerja dengan prinsip ini: cairan/sensor di dalam termometer dibiarkan
mencapai kesetimbangan termal dengan benda yang diukur, lalu sifat fisis termometer yang berubah terhadap
suhu (misalnya panjang kolom raksa) dibaca sebagai suhu benda tersebut.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Mercury-thermometer.jpg",
    alt: "Foto close-up kolom raksa di dalam termometer medis",
    caption: "Kolom raksa dalam termometer medis mengembang/menyusut mengikuti suhunya sendiri, yang menyesuaikan diri lewat kesetimbangan termal dengan benda yang diukur, sehingga panjang kolom raksa bisa dipakai untuk membaca suhu.",
    author: "Jurii", license: "CC BY 3.0" },
  { id: "-7Gl-yKF6Y4", title: "Thermal energy, temperature, and heat",
    channel: "Khan Academy", desc: "Pengantar hubungan antara energi termal, suhu, dan kalor, serta arah aliran kalor neto antara dua benda yang bersentuhan." }
)}

<h3>2. Skala Suhu: Termodinamika (Kelvin) dan Celsius</h3>
<p>Skala suhu <strong>termodinamika (thermodynamic scale)</strong>, dengan satuan <strong>kelvin (K)</strong>,
adalah skala suhu mutlak yang tidak bergantung pada sifat fisis zat tertentu (misalnya tidak bergantung pada
titik beku/titik didih air seperti skala Celsius). Titik nol skala ini, <strong>0 K (nol mutlak/absolute
zero)</strong>, adalah suhu terendah yang mungkin dicapai secara teoritis, yaitu saat energi kinetik
molekul/partikel zat berada pada nilai minimumnya.</p>
<p>Sesuai <em>syllabus</em> Cambridge 9702 (2025-2027), konversi resmi antara skala Celsius dan Kelvin
adalah:</p>
<div class="formula-box">$$\\dfrac{T}{\\text{K}} = \\dfrac{\\theta}{{}^\\circ\\text{C}} + 273{,}15$$</div>
<p>dengan $T$ = suhu dalam kelvin dan $\\theta$ = suhu dalam derajat Celsius. Artinya $0~{}^\\circ\\text{C} =
273{,}15~\\text{K}$ dan nol mutlak $0~\\text{K} = -273{,}15~{}^\\circ\\text{C}$.</p>
<p class="muted">Catatan praktis: karena selisih $273{,}15$ vs $273$ hanya $0{,}15$ K, banyak soal (terutama
yang menyangkut perbedaan suhu $\\Delta T$, bukan nilai mutlak $T$) memakai pembulatan cepat $T/\\text{K}
\\approx \\theta/{}^\\circ\\text{C} + 273$. Ingat: karena ukuran satu kelvin persis sama dengan satu derajat
Celsius, <strong>perubahan suhu</strong> $\\Delta T$ (K) selalu sama nilainya dengan $\\Delta\\theta$
($^\\circ$C) - konstanta $273{,}15$ hilang saat dikurangkan.</p>
${mediaRow(
  null,
  { id: "eEJqaNaq9v8", title: "Absolute temperature and the kelvin scale",
    channel: "Khan Academy", desc: "Penjelasan konsep suhu mutlak, skala Kelvin, dan mengapa nol mutlak menjadi batas bawah suhu yang mungkin secara teori." }
)}

<h3>3. Skala Suhu Praktis: Termometer Hambatan dan Termokopel</h3>
<p>Skala termodinamika (Kelvin) bersifat teoritis dan sulit diukur langsung di laboratorium sehari-hari,
sehingga dipakai <strong>skala suhu empirik/praktis</strong> yang memanfaatkan sifat fisis suatu bahan yang
berubah secara (kurang lebih) linear terhadap suhu. Dua contoh yang umum dibahas pada Cambridge 9702:</p>
<table>
  <tr><th>Jenis termometer</th><th>Sifat fisis yang diukur</th><th>Rentang &amp; kegunaan</th></tr>
  <tr><td>Termometer hambatan (resistance thermometer, mis. kawat platina)</td><td>Hambatan listrik $R$, yang bertambah hampir linear terhadap suhu</td><td>Rentang lebar, presisi tinggi, respons agak lambat; cocok untuk suhu tetap/berubah perlahan di industri &amp; laboratorium</td></tr>
  <tr><td>Termokopel (thermocouple)</td><td>GGL (tegangan) kecil yang timbul akibat sambungan dua logam berbeda pada suhu berbeda (efek Seebeck)</td><td>Ukurannya kecil, respons cepat, cocok untuk suhu yang berubah cepat atau titik pengukuran yang sulit dijangkau</td></tr>
</table>
<p>Karena sifat fisis $X$ (hambatan atau GGL) yang diukur umumnya <strong>tidak benar-benar linear
sempurna</strong> terhadap suhu di seluruh rentang, termometer praktis perlu <strong>dikalibrasi</strong>
memakai dua titik tetap yang diketahui (misalnya titik lebur es $0~{}^\\circ\\text{C}$ dan titik didih air
$100~{}^\\circ\\text{C}$ pada tekanan atmosfer standar), lalu suhu di antara keduanya diperkirakan dengan
interpolasi linear:</p>
<div class="formula-box">$$\\theta = \\dfrac{X_\\theta - X_0}{X_{100}-X_0}\\times 100~{}^\\circ\\text{C}$$</div>
<p>dengan $X_0$ = nilai sifat fisis pada $0~{}^\\circ\\text{C}$, $X_{100}$ = nilai sifat fisis pada
$100~{}^\\circ\\text{C}$, dan $X_\\theta$ = nilai sifat fisis pada suhu $\\theta$ yang ingin diketahui.
Karena bahan berbeda tidak persis linear dengan cara yang sama, dua jenis termometer praktis yang berbeda
bisa memberi pembacaan suhu yang sedikit berbeda untuk benda yang sama (kecuali tepat di titik-titik
kalibrasinya) - inilah alasan skala termodinamika (Kelvin) tetap dibutuhkan sebagai acuan mutlak yang
tidak bergantung pada bahan.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Thermocouple.png",
    alt: "Diagram prinsip kerja termokopel",
    caption: "Diagram prinsip kerja termokopel: sambungan dua logam berbeda menghasilkan GGL kecil yang bergantung pada perbedaan suhu antara sambungan pengukuran dan sambungan acuan (efek Seebeck).",
    author: "Vivikowski", license: "CC BY-SA 3.0" },
  null
)}

<h3>4. Kapasitas Kalor Jenis (Specific Heat Capacity)</h3>
<p><strong>Kapasitas kalor jenis</strong> $c$ suatu zat didefinisikan sebagai energi kalor yang diperlukan
untuk menaikkan suhu $1~\\text{kg}$ zat tersebut sebesar $1~\\text{K}$ (atau $1~{}^\\circ\\text{C}$, karena
ukuran keduanya sama). Satuan SI-nya adalah $\\text{J kg}^{-1}\\text{K}^{-1}$.</p>
<div class="formula-box">$$Q = mc\\Delta\\theta$$</div>
<p>dengan $Q$ = energi kalor (J), $m$ = massa (kg), $c$ = kapasitas kalor jenis ($\\text{J kg}^{-1}
\\text{K}^{-1}$), dan $\\Delta\\theta$ = perubahan suhu (K atau $^\\circ$C). Nilai $c$ berbeda-beda untuk
setiap zat - air memiliki $c$ yang sangat besar dibanding kebanyakan logam, sehingga air lebih "lambat"
berubah suhunya untuk jumlah kalor yang sama (inilah mengapa air laut/danau menstabilkan suhu di
sekitarnya).</p>
<p class="muted">Nilai-nilai kapasitas kalor jenis (misalnya air, es, atau logam tertentu) <strong>bukan
bagian dari Data and Formulae List</strong> universal Cambridge 9702 (yang hanya memuat konstanta fisika
fundamental seperti $g$, $e$, $h$, $N_A$), sehingga nilai-nilai ini akan selalu <strong>diberikan langsung
di dalam soal</strong> ujian. Nilai yang umum dipakai: $c_{air} \\approx 4200~\\text{J kg}^{-1}\\text{K}^{-1}$,
$c_{es} \\approx 2100~\\text{J kg}^{-1}\\text{K}^{-1}$, $c_{aluminium} \\approx 900~\\text{J kg}^{-1}
\\text{K}^{-1}$.</p>
<p><strong>Metode listrik</strong> adalah cara standar mengukur $c$ suatu zat (padat maupun cair) di
laboratorium: benda dipanaskan dengan pemanas listrik (mis. pemanas celup) yang energi listriknya diketahui
persis lewat $E = VIt$ (tegangan $\\times$ arus $\\times$ waktu), lalu kenaikan suhu $\\Delta\\theta$ diukur.
Dengan mengasumsikan (atau mengoreksi) kehilangan kalor ke lingkungan, berlaku $E \\approx Q = mc\\Delta\\theta$
sehingga:</p>
<div class="formula-box">$$c = \\dfrac{VIt}{m\\Delta\\theta}$$</div>
<p class="muted">Prosedur lengkap metode listrik ini (termasuk cara meminimalkan galat akibat kehilangan
kalor) dibahas tuntas di tab <strong>Eksperimen</strong> topik ini.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Immersion_heater_(zoom).jpg",
    alt: "Foto close-up elemen pemanas celup (immersion heater) listrik",
    caption: "Pemanas celup (immersion heater) listrik: energi listrik yang mengalir melaluinya ($E=VIt$) diubah menjadi kalor, dipakai untuk mengukur kapasitas kalor jenis suatu zat dengan metode listrik.",
    author: "Simon A. Eugster (LivingShadow)", license: "CC BY-SA 3.0" },
  { id: "GNelfJ6IAJw", title: "Specific heat capacity",
    channel: "Khan Academy", desc: "Penjelasan konsep kapasitas kalor jenis dan cara memakai persamaan Q = mcΔθ pada soal-soal dasar." }
)}

<h3>5. Kalor Laten Jenis (Specific Latent Heat)</h3>
<p>Saat suatu zat murni berubah wujud (misalnya es melebur menjadi air, atau air menguap menjadi uap) pada
suhu tetap (misalnya tepat $0~{}^\\circ\\text{C}$ untuk peleburan es, atau $100~{}^\\circ\\text{C}$ untuk
penguapan air pada tekanan atmosfer standar), <strong>suhu zat tidak berubah</strong> meskipun kalor terus
diserap/dilepaskan. Energi ini dipakai untuk memutus/membentuk ikatan antarmolekul (mengubah susunan wujud
zat), bukan untuk menaikkan energi kinetik rata-rata molekul (yang berkaitan dengan suhu).</p>
<p><strong>Kalor laten jenis</strong> $L$ suatu zat didefinisikan sebagai energi kalor yang diperlukan untuk
mengubah wujud $1~\\text{kg}$ zat tersebut, tanpa disertai perubahan suhu:</p>
<div class="formula-box">$$Q = mL$$</div>
<p>dengan $Q$ = energi kalor (J), $m$ = massa zat yang berubah wujud (kg), dan $L$ = kalor laten jenis
($\\text{J kg}^{-1}$). Ada dua jenis kalor laten jenis untuk zat yang sama, dengan nilai yang <strong>tidak
sama besar</strong>:</p>
<ul>
  <li><strong>Kalor lebur jenis (specific latent heat of fusion), $L_f$</strong>: untuk perubahan wujud
  padat $\\leftrightarrow$ cair. Contoh: $L_f$ es $\\approx 3{,}34\\times10^{5}~\\text{J kg}^{-1}$.</li>
  <li><strong>Kalor uap jenis (specific latent heat of vaporization), $L_v$</strong>: untuk perubahan wujud
  cair $\\leftrightarrow$ gas. Contoh: $L_v$ air $\\approx 2{,}26\\times10^{6}~\\text{J kg}^{-1}$.</li>
</ul>
<p class="muted">$L_v$ jauh lebih besar daripada $L_f$ untuk zat yang sama (air), karena menguap berarti
memutuskan hampir seluruh ikatan antarmolekul sehingga molekul-molekul benar-benar terpisah jauh menjadi
gas, sedangkan melebur "hanya" mengubah susunan padat yang kaku menjadi cair yang molekulnya masih saling
berdekatan.</p>
<p>Sama seperti kapasitas kalor jenis, $L$ juga bisa diukur dengan <strong>metode listrik</strong>: pemanas
listrik dengan daya diketahui melelehkan/menguapkan sejumlah massa zat dalam waktu tertentu, dan massa yang
berubah wujud ($m$) ditimbang, sehingga $L = VIt/m$ (dengan koreksi kehilangan kalor bila diperlukan).</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Cooling_curve_pure_metal.svg",
    alt: "Grafik kurva pendinginan logam murni menunjukkan dataran suhu tetap saat membeku",
    caption: "Kurva pendinginan sebuah logam murni: suhu turun landai selagi berwujud cair maupun padat, tetapi mendatar (suhu tetap konstan) selama proses pembekuan berlangsung - kalor terus dilepaskan, namun seluruhnya dipakai untuk perubahan wujud (kalor laten), bukan menurunkan suhu.",
    author: "Wizard191", license: "CC BY-SA 3.0" },
  { id: "7bvqJUszxhs", title: "Specific latent heat / Cambridge International AS & A Level Physics",
    channel: "College Physics", desc: "Penjelasan definisi dan penggunaan kalor laten jenis (Q = mL) dalam konteks kurikulum Cambridge International AS & A Level Physics." }
)}

<h3>6. Menggabungkan Konsep: Grafik Suhu-Waktu Saat Pemanasan</h3>
<p>Bayangkan sebongkah es dipanaskan dengan laju kalor tetap (misalnya dengan pemanas listrik berdaya
konstan) mulai dari suhu di bawah $0~{}^\\circ\\text{C}$ sampai seluruhnya menjadi uap air panas. Grafik
suhu terhadap waktu (atau terhadap energi kalor yang sudah diserap, karena kalor $\\propto$ waktu pada daya
tetap) akan menunjukkan pola naik-turun-naik-datar yang khas, dengan <strong>lima tahap</strong>:</p>
<ol>
  <li>Suhu es naik landai dari $<0~{}^\\circ\\text{C}$ menuju $0~{}^\\circ\\text{C}$ (memakai $c_{es}$).</li>
  <li>Suhu <strong>mendatar tepat di $0~{}^\\circ\\text{C}$</strong> selagi es melebur seluruhnya menjadi air
  (memakai $L_f$ es) - selama fase ini ada campuran es dan air pada suhu yang sama.</li>
  <li>Suhu air (cair) naik landai dari $0~{}^\\circ\\text{C}$ menuju $100~{}^\\circ\\text{C}$ (memakai
  $c_{air}$).</li>
  <li>Suhu <strong>mendatar tepat di $100~{}^\\circ\\text{C}$</strong> selagi air menguap seluruhnya menjadi
  uap (memakai $L_v$ air).</li>
  <li>Suhu uap air naik lagi di atas $100~{}^\\circ\\text{C}$ (memakai kapasitas kalor jenis uap).</li>
</ol>
<p>Karena laju kalor (daya pemanas) tetap, <strong>lebar mendatar</strong> pada grafik (lama waktu suhu
tidak berubah) berbanding lurus dengan besar $L$ pada tahap itu, sedangkan <strong>kemiringan</strong> pada
bagian yang landai berbanding terbalik dengan $c$ pada fase itu (makin besar $c$, makin landai/lambat
kenaikan suhunya untuk laju kalor yang sama). Untuk menghitung total energi yang diperlukan dari satu ujung
proses ke ujung lainnya, kalor pada <strong>setiap tahap dihitung terpisah lalu dijumlahkan</strong> - inilah
jenis soal gabungan yang sering muncul pada ujian (lihat Latihan Soal nomor 5 di bawah untuk contoh
lengkap).</p>
${mediaRow(
  null,
  { id: "hxe7Ce7vUwU", title: "A Level Physics: Specific Heat Capacity Question examples from past papers",
    channel: "ZPhysics", desc: "Latihan mengerjakan beberapa contoh soal kapasitas kalor jenis bergaya soal ujian A Level, sebagai tambahan latihan setelah memahami konsep dasar." }
)}
`;

const TEMPERATURE_EKSPERIMEN = {
  title: "Eksperimen Nyata: Menentukan Kapasitas Kalor Jenis Aluminium dengan Metode Listrik",
  intro: `
    <p class="muted">Ini eksperimen fisik sungguhan dengan alat lab nyata (pemanas celup, ammeter, voltmeter,
    balok logam), bukan simulasi komputer. Ini adalah praktikum klasik dan standar di banyak silabus
    (termasuk sebagai <em>required practical</em> di berbagai kurikulum A-Level) untuk menentukan kapasitas
    kalor jenis $c$ sebuah logam (di sini aluminium) memakai metode listrik.</p>

    <h4>Tujuan</h4>
    <p>Menentukan kapasitas kalor jenis $c$ aluminium dari data eksperimen (energi listrik, massa, dan
    kenaikan suhu), lalu membandingkannya dengan nilai referensi $c_{aluminium} \\approx 900~\\text{J
    kg}^{-1}\\text{K}^{-1}$.</p>

    <h4>Konsep Dasar</h4>
    <p>Sebuah pemanas celup (immersion heater) yang dialiri arus $I$ pada tegangan $V$ selama waktu $t$
    memberikan energi listrik:</p>
    <div class="formula-box">$$E = VIt$$</div>
    <p>Dengan mengasumsikan seluruh energi listrik ini diserap oleh balok logam (tanpa ada yang hilang ke
    udara sekitar, ke termometer, atau ke lubang tempat pemanas), energi ini menaikkan suhu balok sesuai:</p>
    <div class="formula-box">$$E = mc\\Delta\\theta \\quad\\Rightarrow\\quad c = \\dfrac{VIt}{m\\Delta\\theta}$$</div>
    <p>dengan $m$ = massa balok (kg) dan $\\Delta\\theta$ = kenaikan suhu balok (K). Karena pada praktiknya
    selalu ada sedikit kalor yang hilang ke lingkungan (balok tidak sempurna terisolasi), nilai $c$ yang
    dihitung dari data eksperimen biasanya sedikit <strong>lebih besar</strong> daripada nilai referensi
    (karena sebagian energi listrik "terbuang", padahal seluruhnya dianggap masuk ke balok pada rumus di
    atas, seolah-olah tiap kg-K butuh energi lebih banyak).</p>

    <h4>Alat &amp; Bahan</h4>
    <ul>
      <li>Balok aluminium berlubang (silinder aluminium dengan dua lubang: satu untuk pemanas celup, satu
      untuk termometer/sensor suhu), massa sekitar $0{,}20$ - $1{,}0$ kg</li>
      <li>Pemanas celup (immersion heater) listrik yang pas masuk ke lubang balok, dihubungkan ke catu daya
      tegangan rendah (low-voltage power supply) 12 V AC/DC</li>
      <li>Voltmeter (atau pembacaan tegangan pada catu daya jika sudah terkalibrasi) dan ammeter, atau
      alternatifnya sebuah joulemeter yang langsung membaca energi listrik dalam joule</li>
      <li>Termometer (atau termokopel/sensor suhu digital), rentang minimal $-10$ sampai $110~{}^\\circ\\text{C}$</li>
      <li>Neraca timbang (ketelitian minimal 1 g) untuk menimbang massa balok</li>
      <li>Stopwatch (jika daya pemanas tidak konstan sempurna, atau untuk mengontrol lama pemanasan)</li>
      <li>Sedikit oli/minyak pelumas (untuk mengisi celah lubang termometer dan pemanas agar kontak termal
      lebih baik), dan bahan isolasi (kapas/wol/gulungan kertas) untuk membungkus balok mengurangi kehilangan
      kalor ke udara</li>
    </ul>

    <h4>Langkah Kerja</h4>
    <ol>
      <li>Timbang massa balok aluminium ($m$), catat hasilnya.</li>
      <li>Masukkan pemanas celup ke salah satu lubang balok, dan termometer/sensor suhu ke lubang lainnya,
      beri sedikit oli di celah kedua lubang agar kontak termal baik.</li>
      <li>Bungkus balok dengan bahan isolasi (kapas/wol) untuk mengurangi kehilangan kalor ke udara sekitar
      selama pemanasan (tetap sisakan celah kecil untuk membaca termometer).</li>
      <li>Catat suhu awal balok $\\theta_1$ sebelum pemanas dinyalakan.</li>
      <li>Hubungkan pemanas ke catu daya melalui ammeter dan voltmeter. Nyalakan pemanas bersamaan dengan
      menekan start stopwatch. Catat pembacaan $V$ dan $I$ (jika keduanya relatif stabil selama pemanasan).</li>
      <li>Panaskan selama waktu $t$ tertentu (misalnya 5 sampai 10 menit, cukup untuk menaikkan suhu balok
      sekitar 20-30°C), lalu matikan pemanas dan stopwatch bersamaan.</li>
      <li>Aduk/tunggu sebentar agar suhu di seluruh balok merata, lalu catat suhu tertinggi yang tercapai
      $\\theta_2$ (suhu masih bisa naik sedikit setelah pemanas dimatikan karena kalor dari pemanas yang
      belum sempat merata, catat suhu puncaknya).</li>
      <li>Ulangi seluruh langkah ini 2-3 kali (bisa dengan balok logam yang sama setelah didinginkan kembali
      ke suhu ruang, atau logam berbeda seperti tembaga untuk perbandingan) untuk mengecek keterulangan
      hasil.</li>
    </ol>

    <h4>Tabel Data (contoh, isi dengan data hasil percobaanmu)</h4>
    <table>
      <tr><th>Percobaan</th><th>m (kg)</th><th>V (V)</th><th>I (A)</th><th>t (s)</th><th>θ₁ (°C)</th><th>θ₂ (°C)</th><th>Δθ (K)</th><th>c = VIt/(mΔθ) (J kg⁻¹ K⁻¹)</th></tr>
      <tr><td>1</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td>2</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td>3</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
    </table>

    <h4>Analisis &amp; Perhitungan</h4>
    <ul>
      <li>Hitung energi listrik $E = VIt$ untuk tiap percobaan, lalu hitung $c = E/(m\\Delta\\theta)$.</li>
      <li>Hitung rata-rata $c$ dari beberapa percobaan/pengulangan, lalu bandingkan dengan nilai referensi
      $900~\\text{J kg}^{-1}\\text{K}^{-1}$ dengan menghitung persentase selisih:
      $\\left|\\dfrac{c_{eksperimen}-c_{referensi}}{c_{referensi}}\\right|\\times100\\%$.</li>
      <li>Jika alat tersedia untuk memvariasikan lama pemanasan $t$ (dengan $V$, $I$ tetap), buat juga grafik
      $\\Delta\\theta$ (sumbu-y) terhadap $t$ (sumbu-x): grafik ini seharusnya berupa garis lurus melalui
      titik asal dengan gradien $VI/(mc)$, sehingga $c$ bisa dihitung dari gradien tanpa bergantung pada satu
      titik data saja (lebih akurat karena memakai <em>line of best fit</em>).</li>
    </ul>

    <h4>Keselamatan Kerja</h4>
    <ul>
      <li>Pemanas celup memakai listrik tegangan rendah tetapi tetap bisa menjadi sangat panas - jangan
      menyentuh elemen pemanas langsung dengan tangan, gunakan penjepit/tang jika perlu memindahkannya.</li>
      <li>Jangan menyalakan pemanas celup di udara terbuka (di luar lubang balok/tanpa media penyerap panas) -
      elemen pemanas bisa rusak dan menjadi sangat panas tanpa media pendingin.</li>
      <li>Balok aluminium akan menjadi panas (bisa mencapai 40-60°C atau lebih), tunggu sampai cukup dingin
      sebelum dipegang langsung tanpa sarung tangan/lap.</li>
      <li>Matikan catu daya sebelum melepas/memasang sambungan kabel apa pun.</li>
      <li>Jika dipakai varian dengan air (lihat Alternatif di bawah), berhati-hati dengan air panas dan
      pastikan tidak ada tumpahan air mengenai catu daya listrik.</li>
    </ul>

    <h4>Sumber Kesalahan (untuk didiskusikan di laporan)</h4>
    <ul>
      <li>Kehilangan kalor ke udara sekitar dan ke bahan isolasi selama pemanasan (paling signifikan),
      membuat $c$ hasil eksperimen cenderung lebih besar dari nilai sebenarnya.</li>
      <li>Kapasitas kalor jenis termometer/sensor dan pemanas itu sendiri ikut menyerap sedikit kalor
      (diabaikan dalam perhitungan sederhana di atas).</li>
      <li>Keterlambatan respons termometer (tidak langsung menunjukkan suhu balok yang sesungguhnya),
      terutama saat suhu masih terus naik sesaat setelah pemanas dimatikan.</li>
      <li>Fluktuasi kecil pada pembacaan $V$ dan $I$ selama pemanasan jika catu daya kurang stabil.</li>
    </ul>

    <h4>Alternatif Sederhana: Metode Campuran (kalau tidak ada pemanas celup/ammeter/voltmeter)</h4>
    <p>Kalau alat listrik (pemanas celup, ammeter, voltmeter) tidak tersedia, kapasitas kalor jenis logam
    tetap bisa diperkirakan dengan <strong>metode campuran (method of mixtures)</strong> memakai asas Black,
    hanya butuh air, kalorimeter/gelas berisolasi, neraca, dan termometer:</p>
    <ol>
      <li>Timbang sebuah blok/kepingan logam ($m_{logam}$), panaskan dalam air mendidih (di panci terpisah)
      sampai suhunya mendekati $100~{}^\\circ\\text{C}$.</li>
      <li>Timbang sejumlah air ($m_{air}$) di dalam wadah berisolasi (kalorimeter sederhana), catat suhu awal
      air $\\theta_{air}$.</li>
      <li>Pindahkan logam panas secepat mungkin ke dalam air, aduk perlahan, dan catat suhu akhir campuran
      $\\theta_c$ setelah stabil (kesetimbangan termal tercapai).</li>
      <li>Karena kalor yang dilepas logam = kalor yang diserap air (asas Black, dengan asumsi tidak ada kalor
      yang hilang ke wadah/lingkungan): $m_{logam}\\,c_{logam}(100-\\theta_c) = m_{air}\\,c_{air}(\\theta_c -
      \\theta_{air})$, sehingga $c_{logam}$ bisa dihitung.</li>
      <li>Metode ini lebih sederhana dan murah, tetapi galatnya cenderung lebih besar (perpindahan logam dari
      panci ke kalorimeter memakan waktu, sehingga logam sudah sedikit mendingin sebelum tercelup penuh).</li>
    </ol>

    <h4>Pertanyaan Diskusi</h4>
    <ul>
      <li>Mengapa nilai $c$ hasil eksperimen metode listrik biasanya sedikit lebih besar daripada nilai
      referensi, bukan lebih kecil? Jelaskan arah kesalahannya.</li>
      <li>Bagaimana membungkus balok dengan bahan isolasi (kapas/wol) membantu mengurangi galat pada
      eksperimen ini?</li>
      <li>Mengapa pada metode campuran, logam harus dipindahkan "secepat mungkin" dari air mendidih ke
      kalorimeter?</li>
      <li>Jika ternyata terdapat dua logam berbeda dengan massa sama dipanaskan dengan energi listrik yang
      sama persis, logam manakah yang akan mengalami kenaikan suhu lebih besar - logam dengan $c$ besar atau
      $c$ kecil? Jelaskan.</li>
    </ul>

    <h4>Referensi</h4>
    <ul>
      <li><a href="https://spark.iop.org/specific-thermal-capacity-aluminium" target="_blank" rel="noopener">Specific thermal capacity of aluminium, IOPSpark</a></li>
      <li><a href="https://spark.iop.org/specific-thermal-capacity-aluminium-more-accurately" target="_blank" rel="noopener">Specific thermal capacity of aluminium, more accurately, IOPSpark</a></li>
      <li><a href="https://spark.iop.org/episode-607-specific-heat-capacity" target="_blank" rel="noopener">Episode 607: Specific heat capacity, IOPSpark</a></li>
      <li><a href="https://pmt.physicsandmathstutor.com/download/Physics/A-level/Notes/OCR-A/1-Practical-Skills-in-Physics/PAG%2011.2%20-%20Determining%20specific%20heat%20capacity.pdf" target="_blank" rel="noopener">PAG 11.2 - Determining specific heat capacity, Physics & Maths Tutor (OCR A-level)</a></li>
    </ul>
  `
};

/* type: "mcq" atau "structured".
   Untuk mcq: options[] dan correct = index jawaban benar. */
const TEMPERATURE_LATIHAN = [
  {
    type: "mcq",
    question: "Suhu ruangan laboratorium terbaca 23°C pada termometer Celsius. Berapakah suhu ini jika dinyatakan dalam kelvin? (gunakan T/K = θ/°C + 273,15)",
    options: ["250,15 K", "273,15 K", "296,15 K", "296,00 K"],
    correct: 2,
    solution: `$\\dfrac{T}{\\text{K}} = \\dfrac{\\theta}{{}^\\circ\\text{C}} + 273{,}15 = 23 + 273{,}15 = 296{,}15$.
    <br>Jadi $T = 296{,}15~\\text{K}$. (Opsi "296,00 K" adalah jebakan umum karena melupakan angka desimal $0{,}15$.)`
  },
  {
    type: "mcq",
    question: "Berapa energi kalor yang diperlukan untuk menaikkan suhu 2,0 kg air dari 20°C menjadi 80°C? (kalor jenis air c = 4200 J kg⁻¹ K⁻¹)",
    options: ["5,04 × 10⁴ J", "5,04 × 10⁵ J", "1,01 × 10⁶ J", "2,52 × 10⁵ J"],
    correct: 1,
    solution: `$\\Delta\\theta = 80-20 = 60~\\text{K}$.
    <br>$Q = mc\\Delta\\theta = 2{,}0 \\times 4200 \\times 60 = 504\\,000~\\text{J} = 5{,}04\\times10^{5}~\\text{J}$.`
  },
  {
    type: "structured",
    question: "Sebuah balok aluminium bermassa 0,20 kg dipanaskan menggunakan pemanas celup listrik yang dihubungkan ke catu daya 12 V dengan arus 4,0 A, selama 5,0 menit. Suhu balok naik dari 18,0°C menjadi 90,0°C. (a) Hitung energi listrik total yang diberikan oleh pemanas. (b) Dari data ini, hitung kapasitas kalor jenis aluminium yang terukur pada eksperimen ini. (c) Nilai referensi kapasitas kalor jenis aluminium adalah 900 J kg⁻¹ K⁻¹. Jelaskan mengapa nilai hasil eksperimen ini sedikit lebih tinggi daripada nilai referensi tersebut.",
    solution: `<strong>(a)</strong> $t = 5{,}0$ menit $= 300~\\text{s}$.
    <br>$E = VIt = 12 \\times 4{,}0 \\times 300 = 14\\,400~\\text{J} = 1{,}44\\times10^{4}~\\text{J}$.
    <br><strong>(b)</strong> $\\Delta\\theta = 90{,}0 - 18{,}0 = 72{,}0~\\text{K}$.
    <br>$c = \\dfrac{E}{m\\Delta\\theta} = \\dfrac{14\\,400}{0{,}20 \\times 72{,}0} = \\dfrac{14\\,400}{14{,}4} = 1000~\\text{J kg}^{-1}\\text{K}^{-1}$.
    <br><strong>(c)</strong> Nilai eksperimen ($1000~\\text{J kg}^{-1}\\text{K}^{-1}$) lebih tinggi daripada nilai referensi ($900~\\text{J kg}^{-1}\\text{K}^{-1}$) karena sebagian energi listrik yang diberikan pemanas hilang ke lingkungan sekitar (udara, termometer, dudukan balok) alih-alih seluruhnya menaikkan suhu balok. Karena perhitungan pada bagian (b) mengasumsikan <em>semua</em> energi listrik masuk ke balok, kenaikan suhu yang "seharusnya" terjadi untuk energi sebesar itu jadi tampak lebih kecil dari kenyataan tanpa kehilangan kalor, sehingga $c$ yang dihitung menjadi lebih besar dari nilai sebenarnya.`
  },
  {
    type: "structured",
    question: "Sebanyak 0,50 kg es yang sudah berada tepat pada suhu 0°C dilebur seluruhnya menjadi air pada suhu 0°C menggunakan pemanas listrik. Kalor lebur jenis es adalah 3,34 × 10⁵ J kg⁻¹. (a) Hitung energi kalor yang diperlukan untuk melebur seluruh es tersebut. (b) Jika pemanas tersebut memiliki daya keluaran 60 W dan semua energinya dianggap dipakai untuk peleburan (tanpa kehilangan kalor), berapa lama waktu yang dibutuhkan (dalam menit) untuk melebur seluruh es itu?",
    solution: `<strong>(a)</strong> $Q = mL_f = 0{,}50 \\times 3{,}34\\times10^{5} = 1{,}67\\times10^{5}~\\text{J}$ (167 000 J).
    <br><strong>(b)</strong> $P = \\dfrac{Q}{t} \\Rightarrow t = \\dfrac{Q}{P} = \\dfrac{1{,}67\\times10^{5}}{60} \\approx 2783~\\text{s}$.
    <br>Dalam menit: $t \\approx \\dfrac{2783}{60} \\approx 46{,}4~\\text{menit}$.`
  },
  {
    type: "structured",
    question: "Sebanyak 0,30 kg es pada suhu −10°C dipanaskan hingga seluruhnya menjadi uap air pada suhu 100°C, pada tekanan atmosfer normal. Diberikan: kalor jenis es c_es = 2100 J kg⁻¹ K⁻¹, kalor jenis air c_air = 4200 J kg⁻¹ K⁻¹, kalor lebur jenis es L_f = 3,34 × 10⁵ J kg⁻¹, kalor uap jenis air L_v = 2,26 × 10⁶ J kg⁻¹. Hitung energi kalor pada tiap tahap berikut, lalu hitung total energi keseluruhan: (a) memanaskan es dari −10°C ke 0°C, (b) melebur es pada 0°C, (c) memanaskan air (cair) dari 0°C ke 100°C, (d) menguapkan air pada 100°C, (e) total energi untuk keseluruhan proses.",
    solution: `<strong>(a)</strong> $Q_1 = mc_{es}\\Delta\\theta = 0{,}30 \\times 2100 \\times 10 = 6300~\\text{J}$.
    <br><strong>(b)</strong> $Q_2 = mL_f = 0{,}30 \\times 3{,}34\\times10^{5} = 1{,}002\\times10^{5}~\\text{J}$ (100 200 J).
    <br><strong>(c)</strong> $Q_3 = mc_{air}\\Delta\\theta = 0{,}30 \\times 4200 \\times 100 = 126\\,000~\\text{J}$.
    <br><strong>(d)</strong> $Q_4 = mL_v = 0{,}30 \\times 2{,}26\\times10^{6} = 6{,}78\\times10^{5}~\\text{J}$ (678 000 J).
    <br><strong>(e)</strong> $Q_{total} = Q_1+Q_2+Q_3+Q_4 = 6300 + 100\\,200 + 126\\,000 + 678\\,000 = 910\\,500~\\text{J} \\approx 9{,}11\\times10^{5}~\\text{J}$.
    <br>Perhatikan bahwa tahap penguapan (d) menyerap energi paling besar dari semua tahap, jauh lebih besar daripada tahap peleburan (b), sesuai dengan $L_v \\gg L_f$ untuk air.`
  },
  {
    type: "structured",
    question: "Sebuah blok logam bermassa 0,15 kg dipanaskan hingga 100°C lalu dengan cepat dimasukkan ke dalam 0,20 kg air yang mula-mula bersuhu 20,0°C, di dalam bejana kalorimeter yang terisolasi baik (kapasitas kalor bejana diabaikan). Suhu akhir campuran setelah kesetimbangan termal tercapai adalah 27,3°C. Kalor jenis air adalah 4200 J kg⁻¹ K⁻¹. (a) Jelaskan, menggunakan konsep aliran kalor neto, mengapa pada kesetimbangan termal suhu logam dan air menjadi sama. (b) Dengan asumsi tidak ada kalor yang hilang ke lingkungan, gunakan asas Black (kalor yang dilepas logam = kalor yang diserap air) untuk menghitung kalor jenis logam tersebut.",
    solution: `<strong>(a)</strong> Selama suhu logam masih lebih tinggi daripada suhu air, kalor akan terus mengalir neto dari logam (bersuhu lebih tinggi) ke air (bersuhu lebih rendah). Aliran neto ini baru berhenti ketika suhu keduanya sama persis, karena pada saat itu tidak ada lagi perbedaan suhu yang mendorong aliran kalor neto ke salah satu arah - inilah keadaan kesetimbangan termal.
    <br><strong>(b)</strong> Kalor yang diserap air: $Q_{air} = m_{air}c_{air}\\Delta\\theta_{air} = 0{,}20 \\times 4200 \\times (27{,}3-20{,}0) = 0{,}20 \\times 4200 \\times 7{,}3 = 6132~\\text{J}$.
    <br>Kalor yang dilepas logam sama besar (asas Black): $Q_{logam} = m_{logam}c_{logam}\\Delta\\theta_{logam} = 0{,}15 \\times c_{logam} \\times (100-27{,}3) = 0{,}15 \\times c_{logam} \\times 72{,}7$.
    <br>$0{,}15 \\times 72{,}7 \\times c_{logam} = 6132 \\Rightarrow c_{logam} = \\dfrac{6132}{10{,}905} \\approx 562~\\text{J kg}^{-1}\\text{K}^{-1}$.`
  }
];

/* Lembar rumus ringkas (plain text), dipakai sebagai "grounding" otomatis:
   ditempelkan ke prompt yang dikirim ke AI supaya AI memakai persis rumus
   & nilai yang sudah divalidasi guru, bukan menebak dari pengetahuan umum. */
const TEMPERATURE_FORMULA_SHEET = `
- Kesetimbangan termal: kalor mengalir neto dari benda bersuhu lebih tinggi ke benda bersuhu lebih rendah; ketika keduanya mencapai suhu yang sama, tidak ada lagi aliran kalor neto (kesetimbangan termal). Ide ini mendasari definisi suhu (mirip Hukum ke-Nol Termodinamika secara informal).
- Konversi suhu resmi Cambridge 9702 (syllabus 2025-2027): T/K = theta/degC + 273,15. Pembulatan T/K = theta/degC + 273 kadang dipakai untuk estimasi cepat.
- Nol mutlak (absolute zero): 0 K = -273,15 degC, suhu terendah yang mungkin secara teori.
- Karena ukuran 1 K sama dengan ukuran 1 degC, perubahan suhu delta-T (K) selalu sama nilainya dengan delta-theta (degC); konstanta 273,15 hilang saat dikurangkan.
- Skala termodinamika (Kelvin): mutlak, tidak bergantung sifat bahan tertentu. Skala praktis/empirik (termometer hambatan platina, termokopel): memakai sifat fisis bahan (hambatan R, GGL) yang berubah kurang-lebih linear terhadap suhu, dikalibrasi dengan 2 titik tetap (mis. 0 degC dan 100 degC), lalu theta = (X_theta - X_0)/(X_100 - X_0) x 100 degC.
- Kapasitas kalor jenis c (specific heat capacity): kalor per satuan massa per satuan kenaikan suhu, satuan J/(kg K). Q = m c deltaTheta.
- Metode listrik mengukur c: E = V I t (energi listrik) dikonversi jadi kalor, c = V I t / (m deltaTheta), dengan asumsi/koreksi tanpa kehilangan kalor ke lingkungan.
- Kalor laten jenis L (specific latent heat): kalor per satuan massa untuk mengubah wujud zat TANPA perubahan suhu. Q = m L. Ada L_lebur/fusion (padat<->cair) dan L_uap/vaporization (cair<->gas), nilainya berbeda untuk zat yang sama (L_uap jauh lebih besar dari L_lebur).
- Nilai-nilai umum dipakai pada soal Cambridge 9702 (BUKAN bagian Data and Formulae List universal, biasanya diberikan langsung di soal): c_air = 4200 J/(kg K); c_es kira-kira 2100 J/(kg K); c_aluminium kira-kira 900 J/(kg K); L_lebur es = 3,34 x 10^5 J/kg; L_uap air = 2,26 x 10^6 J/kg.
- Grafik suhu-waktu saat pemanasan laju-kalor-konstan: suhu naik landai selama satu fase (kemiringan berbanding terbalik dengan c fase itu), lalu mendatar selama perubahan wujud (lebar mendatar berbanding lurus dengan L).
- Soal gabungan multi-tahap (mis. es dingin -> lebur -> air -> uap): hitung kalor tiap tahap terpisah (pemanasan pakai Q=mcDeltaTheta, perubahan wujud pakai Q=mL), lalu jumlahkan semua tahap untuk total energi.
- Asas Black (metode campuran/kalorimetri): pada sistem terisolasi, kalor yang dilepas benda bersuhu tinggi = kalor yang diserap benda bersuhu rendah, dipakai untuk menentukan c benda yang tidak diketahui.
`;

/* Konsep spesifik untuk dropdown Generator Prompt di Lab Simulasi Virtual */
const TEMPERATURE_LAB_CONCEPTS = [
  "Kesetimbangan Termal dan Arah Aliran Kalor Neto",
  "Skala Suhu Termodinamika (Kelvin) vs Skala Celsius",
  "Kalibrasi Termometer Praktis (Termometer Hambatan / Termokopel)",
  "Kapasitas Kalor Jenis dan Metode Listrik (Q = mcΔθ)",
  "Kalor Laten Jenis Peleburan dan Penguapan (Q = mL)",
  "Grafik Suhu-Waktu Saat Pemanasan Melalui Perubahan Wujud",
  "Lainnya (tulis sendiri di instruksi tambahan)"
];

/* Tempelkan konten lengkap ke objek topik "temperature" */
(function attachTemperatureContent() {
  const topic = TOPICS.find(t => t.id === "temperature");
  topic.materiHTML = TEMPERATURE_MATERI;
  topic.eksperimen = TEMPERATURE_EKSPERIMEN;
  topic.latihan = TEMPERATURE_LATIHAN;
  topic.labConcepts = TEMPERATURE_LAB_CONCEPTS;
  topic.formulaSheet = TEMPERATURE_FORMULA_SHEET;
})();

/* ------------------------------------------------------------
   Konten lengkap: IDEAL GASES (topik 15, A2)
   ------------------------------------------------------------ */

/* ------------------------------------------------------------
   Konten lengkap: IDEAL GASES (topik 15, A2)
   File draft berdiri sendiri - akan digabung manual ke content.js.
   Tidak mendefinisikan ulang mediaRow() atau TOPICS (sudah ada
   di content.js utama).
   ------------------------------------------------------------ */

const IDEALGASES_MATERI = `
<h3>1. Jumlah Zat: Mol dan Konstanta Avogadro</h3>
<p><strong>Mol (mole)</strong> adalah satuan SI untuk <em>jumlah zat</em> (amount of substance). Satu mol
zat apa pun mengandung jumlah partikel (atom, molekul, ion, dsb.) yang persis sama, yaitu sebesar
<strong>konstanta Avogadro</strong> $N_A$. Sesuai data sheet Cambridge 9702:</p>
<div class="formula-box">$$N_A = 6{,}02 \\times 10^{23}~\\text{mol}^{-1}$$</div>
<p>Jika suatu sampel zat terdiri dari $n$ mol, maka jumlah molekul (atau partikel) di dalamnya adalah:</p>
<div class="formula-box">$$N = nN_A$$</div>
<p>dengan $N$ = jumlah molekul (tanpa satuan, bilangan murni) dan $n$ = jumlah mol (mol). Jumlah mol suatu
sampel juga bisa dihitung dari massanya jika massa molar $M$ zat tersebut diketahui:</p>
<div class="formula-box">$$n = \\dfrac{\\text{massa sampel}}{\\text{massa molar}} = \\dfrac{m}{M}$$</div>
<p class="muted">Hati-hati satuan: massa molar $M$ biasanya diberikan dalam g mol⁻¹ (misalnya oksigen
$M=32~\\text{g mol}^{-1}$), sedangkan rumus gas ideal $pV=nRT$ butuh besaran dalam satuan SI murni. Karena
$n$ (mol) sudah tak berdimensi terhadap kg/g, kamu boleh memakai $M$ dalam g mol⁻¹ maupun kg mol⁻¹ asalkan
satuan massa sampel yang dipakai konsisten (gram dengan gram, atau kilogram dengan kilogram).</p>
${mediaRow(
  null,
  { id: "_Su9Fij7TMQ", title: "The mole and Avogadro's number | Moles and molar mass | High school chemistry | Khan Academy",
    channel: "Khan Academy", desc: "Pengantar konsep mol dan konstanta Avogadro, serta cara mengonversi massa sampel menjadi jumlah mol dan jumlah partikel." }
)}

<h3>2. Persamaan Keadaan Gas Ideal</h3>
<p>Gas ideal adalah model gas yang mematuhi hubungan sederhana antara tekanan $p$, volume $V$, jumlah mol
$n$, dan suhu mutlak $T$ (dalam kelvin) secara persis di semua kondisi. Hubungan ini disebut
<strong>persamaan keadaan gas ideal</strong> (equation of state):</p>
<div class="formula-box">$$pV = nRT$$</div>
<p>dengan $R$ = <strong>konstanta gas molar</strong> (molar gas constant), nilai standar pada data sheet
Cambridge 9702:</p>
<div class="formula-box">$$R = 8{,}31~\\text{J K}^{-1}\\text{mol}^{-1}$$</div>
<p>Karena $n = N/N_A$ (jumlah mol = jumlah molekul dibagi konstanta Avogadro), persamaan keadaan gas ideal
bisa ditulis ulang dalam bentuk per-molekul:</p>
<div class="formula-box">$$pV = nRT = \\dfrac{N}{N_A}RT = NkT$$</div>
<p>dengan $k$ = <strong>konstanta Boltzmann</strong> (Boltzmann constant), yaitu konstanta gas per molekul
(bukan per mol):</p>
<div class="formula-box">$$k = \\dfrac{R}{N_A} = 1{,}38 \\times 10^{-23}~\\text{J K}^{-1}$$</div>
<table>
  <tr><th>Simbol</th><th>Besaran</th><th>Satuan SI</th></tr>
  <tr><td>$p$</td><td>Tekanan gas</td><td>Pa (N m⁻²)</td></tr>
  <tr><td>$V$</td><td>Volume gas</td><td>m³</td></tr>
  <tr><td>$n$</td><td>Jumlah mol</td><td>mol</td></tr>
  <tr><td>$N$</td><td>Jumlah molekul</td><td>tanpa satuan</td></tr>
  <tr><td>$T$</td><td>Suhu mutlak</td><td>K (bukan °C!)</td></tr>
  <tr><td>$R$</td><td>Konstanta gas molar</td><td>J K⁻¹ mol⁻¹</td></tr>
  <tr><td>$k$</td><td>Konstanta Boltzmann</td><td>J K⁻¹</td></tr>
</table>
<p class="muted">Ingat selalu mengubah suhu ke kelvin sebelum menghitung. Sesuai syllabus Cambridge 9702 (2025-2027,
lihat juga topik Suhu): $T(\\text{K}) = T(°\\text{C}) + 273{,}15$. Karena selisihnya cuma $0{,}15$ K, banyak
soal (termasuk latihan di bawah) memakai pembulatan cepat $T(\\text{K}) \\approx T(°\\text{C}) + 273$ untuk
estimasi praktis - keduanya menghasilkan jawaban akhir yang sama pada ketelitian 2-3 angka penting yang
biasa dipakai di soal gas ideal.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/1/12/Isotherms-in-p-V-diagram.svg",
    alt: "Grafik isoterm tekanan terhadap volume gas ideal pada tiga suhu berbeda",
    caption: "Kurva isoterm (garis suhu tetap) pada grafik $p$-$V$ untuk gas ideal, pada tiga suhu berbeda $T_1 < T_2 < T_3$. Setiap kurva adalah hiperbola $pV=\\text{konstan}$ (Hukum Boyle) untuk satu nilai T tertentu; kurva pindah ke kanan-atas jika suhu dinaikkan.",
    author: "MikeRun", license: "CC BY-SA 4.0" },
  { id: "erjMiErRgSQ", title: "Ideal gas equation example 1 | Chemistry | Khan Academy",
    channel: "Khan Academy", desc: "Contoh soal terpandu menghitung salah satu besaran (p, V, n, atau T) yang belum diketahui menggunakan persamaan gas ideal pV=nRT." }
)}

<h3>3. Hukum-Hukum Gas sebagai Kasus Khusus pV = nRT</h3>
<p>Jika jumlah mol gas ($n$) tetap (massa gas tidak berubah), tiga hukum gas klasik berikut adalah kasus
khusus dari $pV=nRT$ ketika salah satu dari $p$, $V$, atau $T$ dijaga konstan:</p>
<table>
  <tr><th>Hukum</th><th>Besaran yang dijaga tetap</th><th>Hubungan</th><th>Bentuk grafik</th></tr>
  <tr><td>Hukum Boyle</td><td>Suhu $T$ (isotermal)</td><td>$p_1V_1 = p_2V_2$</td><td>Grafik $p$-$V$: hiperbola (isoterm). Grafik $p$ terhadap $1/V$: garis lurus lewat titik asal.</td></tr>
  <tr><td>Hukum Tekanan (Gay-Lussac)</td><td>Volume $V$ (isokhorik)</td><td>$\\dfrac{p_1}{T_1} = \\dfrac{p_2}{T_2}$</td><td>Grafik $p$ terhadap $T$: garis lurus lewat titik asal (T dalam kelvin).</td></tr>
  <tr><td>Hukum Charles</td><td>Tekanan $p$ (isobarik)</td><td>$\\dfrac{V_1}{T_1} = \\dfrac{V_2}{T_2}$</td><td>Grafik $V$ terhadap $T$: garis lurus lewat titik asal (T dalam kelvin).</td></tr>
</table>
<p>Ketiga hukum ini bisa digabung menjadi satu <strong>hukum gas gabungan</strong> untuk massa gas tetap
yang mengalami perubahan dari keadaan 1 ke keadaan 2:</p>
<div class="formula-box">$$\\dfrac{p_1V_1}{T_1} = \\dfrac{p_2V_2}{T_2}$$</div>
<p class="muted">Perhatikan bahwa "garis lurus lewat titik asal" pada grafik $p$-$T$ dan $V$-$T$ hanya berlaku
jika suhu diplot dalam <strong>kelvin</strong>; jika suhu diplot dalam °C, garisnya tetap lurus tetapi tidak
melewati titik asal (memotong sumbu suhu di $-273°\\text{C}$, yaitu nol mutlak/absolute zero).</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/3/36/Boyles_law_experiment.png",
    alt: "Diagram set alat percobaan Hukum Boyle menggunakan suntikan (syringe) dan pengukur tekanan",
    caption: "Diagram set percobaan untuk menyelidiki Hukum Boyle: beban ditambahkan di atas piston suntikan (syringe) untuk menaikkan tekanan gas yang terperangkap, sementara pengukur tekanan (pressure meter) mencatat pembacaan tekanannya.",
    author: "Ppritchett", license: "CC BY-SA 3.0" },
  { id: "GZORmhded2I", title: "A Level Physics: The Ideal Gas Equation, pV=nRT",
    channel: "ZPhysics", desc: "Penjelasan bertingkat A-level tentang persamaan gas ideal dan bagaimana hukum Boyle, hukum tekanan, dan hukum Charles muncul sebagai kasus khususnya." }
)}

<h3>4. Model Kinetik Gas Ideal: Asumsi Dasar</h3>
<p>Persamaan $pV=nRT$ adalah hasil pengamatan eksperimen (hukum empiris). <strong>Teori kinetik gas</strong>
(kinetic theory of gases) menjelaskan <em>mengapa</em> gas berperilaku demikian, dengan memodelkan gas
sebagai kumpulan molekul yang bergerak. Model ini dibangun di atas beberapa asumsi dasar (sesuai silabus
Cambridge 9702, learning outcome 15.3.1):</p>
<ol>
  <li>Gas terdiri dari <strong>sejumlah besar molekul</strong> yang bergerak secara <strong>acak (random
  motion)</strong> dengan berbagai kelajuan dan arah.</li>
  <li><strong>Volume molekul-molekul itu sendiri dapat diabaikan</strong> dibandingkan dengan volume total
  gas (molekul diperlakukan seperti titik-titik yang sangat kecil).</li>
  <li><strong>Gaya antarmolekul (tarik-menarik atau tolak-menolak) dapat diabaikan</strong>, kecuali pada
  saat molekul-molekul itu bertumbukan.</li>
  <li>Tumbukan antar molekul, maupun antara molekul dengan dinding wadah, bersifat <strong>lenting sempurna
  (perfectly elastic)</strong> — tidak ada energi kinetik total yang hilang — dan <strong>berlangsung dalam
  waktu yang sangat singkat</strong> dibandingkan waktu selang antar tumbukan.</li>
  <li>Di antara tumbukan, molekul bergerak dalam <strong>lintasan lurus dengan kelajuan tetap</strong>,
  mematuhi hukum-hukum gerak Newton.</li>
</ol>
<p class="muted">Karena tumbukan bersifat lenting sempurna dan berlangsung sangat singkat, energi kinetik
total sistem tetap konstan (tidak berubah menjadi bentuk energi lain), dan gaya antarmolekul yang diabaikan
membuat energi potensial antarmolekul dianggap nol — semua energi dalam gas ideal berupa energi kinetik
translasi molekul-molekulnya.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Kinetic_theory_of_gases.svg",
    alt: "Diagram molekul gas bergerak acak di dalam wadah dan bertumbukan dengan dindingnya",
    caption: "Ide utama teori kinetik gas: molekul-molekul bergerak acak di dalam wadah, dan tumbukan molekul-molekul itu yang terus-menerus dengan dinding wadah dirasakan sebagai tekanan gas.",
    author: "Sharayanan", license: "CC BY-SA 3.0" },
  { id: "UMXSNjjUVt4", title: "Kinetic molecular theory of gases | Physics | Khan Academy",
    channel: "Khan Academy Physics", desc: "Penjelasan asumsi-asumsi dasar model kinetik gas ideal dan bagaimana model mikroskopis ini menjelaskan besaran gas yang teramati secara makroskopis." }
)}

<h3>5. Tekanan Gas dari Teori Kinetik: pV = (1/3) N m &lt;c²&gt;</h3>
<p>Tekanan gas pada dinding wadah berasal dari tumbukan-tumbukan molekul yang terus-menerus dengan dinding
tersebut. Setiap kali sebuah molekul memantul dari dinding, momentumnya berubah arah, artinya dinding
memberi gaya pada molekul (dan menurut Hukum III Newton, molekul memberi gaya balik yang sama besar pada
dinding). Gaya total dari sangat banyak tumbukan per detik inilah yang teramati sebagai tekanan gas.</p>
<p>Logika penurunannya secara garis besar (tanpa perlu dihafalkan langkah matematisnya secara rinci untuk
Cambridge 9702, tetapi penting memahami alurnya):</p>
<ol>
  <li>Tinjau satu molekul bermassa $m$ bergerak dengan komponen kecepatan $c_x$ tegak lurus salah satu
  dinding kotak. Karena tumbukan lenting sempurna, molekul memantul dengan kelajuan sama tapi arah
  terbalik, sehingga perubahan momentumnya adalah $2mc_x$ setiap tumbukan dengan dinding itu.</li>
  <li>Molekul ini menumbuk dinding yang sama berulang kali; makin cepat molekul bergerak dan makin pendek
  jarak bolak-baliknya (makin kecil kotak), makin sering tumbukan terjadi per detik.</li>
  <li>Gaya rata-rata pada dinding dari satu molekul = laju perubahan momentum = (perubahan momentum per
  tumbukan) × (jumlah tumbukan per detik).</li>
  <li>Menjumlahkan kontribusi gaya dari <strong>semua $N$ molekul</strong> dalam kotak (dengan rata-rata
  statistik atas seluruh arah gerak molekul, bukan hanya satu arah $x$), dan membagi gaya total itu dengan
  luas dinding untuk mendapatkan tekanan, diperoleh persamaan tekanan gas ideal dari teori kinetik:</li>
</ol>
<div class="formula-box">$$pV = \\tfrac{1}{3}Nm\\overline{c^2}$$</div>
<p>dengan $N$ = jumlah molekul gas, $m$ = massa satu molekul, dan $\\overline{c^2}$ = <strong>kelajuan
kuadrat rata-rata</strong> (mean square speed) seluruh molekul — yaitu rata-rata dari $c^2$ tiap molekul,
<strong>bukan</strong> kuadrat dari kelajuan rata-rata (karena arah gerak molekul acak ke segala arah,
rata-rata inilah yang benar dipakai, bukan sekadar kelajuan rata-rata biasa).</p>
${mediaRow(
  null,
  { id: "tQcB9BLUoVI", title: "Thermodynamics part 1: Molecular theory of gases | Physics | Khan Academy",
    channel: "Khan Academy", desc: "Penurunan lengkap hubungan pV = (1/3) N m <c²> dari tumbukan molekul dengan dinding wadah, dan bagaimana hasil ini dihubungkan dengan suhu gas." }
)}

<h3>6. Energi Kinetik Molekul dan Suhu</h3>
<p>Inilah bagian yang menghubungkan dunia mikroskopis (gerak & energi kinetik molekul individual) dengan
dunia makroskopis (suhu gas yang bisa diukur dengan termometer) — sering keluar di ujian Cambridge 9702.
Bandingkan dua bentuk persamaan gas ideal yang sudah kita punya:</p>
<div class="formula-box">
$$pV = \\tfrac{1}{3}Nm\\overline{c^2} \\qquad \\text{(dari teori kinetik)}$$
$$pV = NkT \\qquad \\text{(dari persamaan keadaan gas ideal)}$$
</div>
<p>Karena ruas kiri kedua persamaan itu sama-sama $pV$, ruas kanannya juga harus sama:</p>
<div class="formula-box">$$\\tfrac{1}{3}Nm\\overline{c^2} = NkT \\quad\\Rightarrow\\quad \\tfrac{1}{3}m\\overline{c^2} = kT$$</div>
<p>Kalikan kedua ruas dengan $\\tfrac{3}{2}$:</p>
<div class="formula-box">$$\\tfrac{1}{2}m\\overline{c^2} = \\tfrac{3}{2}kT$$</div>
<p>Ruas kiri, $\\tfrac{1}{2}m\\overline{c^2}$, tidak lain adalah <strong>energi kinetik translasi
rata-rata satu molekul gas</strong> (rata-rata dari $\\tfrac12 mc^2$ tiap molekul). Jadi:</p>
<div class="formula-box">$$E_k = \\tfrac{1}{2}m\\overline{c^2} = \\tfrac{3}{2}kT$$</div>
<p><strong>Kesimpulan penting:</strong> energi kinetik translasi rata-rata sebuah molekul gas ideal
<strong>sebanding langsung dengan suhu mutlak $T$</strong> (dalam kelvin) — tidak bergantung pada jenis
gasnya (gas ringan seperti hidrogen dan gas berat seperti karbon dioksida pada suhu $T$ yang sama memiliki
energi kinetik rata-rata per molekul yang <em>sama persis</em>, meskipun kelajuannya berbeda karena
massanya berbeda). Inilah alasan fisis mengapa suhu adalah ukuran dari energi kinetik rata-rata partikel
penyusun suatu zat.</p>
<p class="muted">Jika suhu mutlak suatu gas dinaikkan dua kali lipat (misalnya dari 300 K menjadi 600 K),
energi kinetik translasi rata-rata tiap molekulnya juga menjadi dua kali lipat — tetapi kelajuannya
<strong>tidak</strong> menjadi dua kali lipat, karena $E_k \\propto v^2$, sehingga kelajuan (rms) hanya naik
sebesar faktor $\\sqrt{2}$.</p>

<h3>7. Kelajuan Root-Mean-Square (rms)</h3>
<p>Karena $\\overline{c^2}$ adalah kelajuan kuadrat rata-rata, akar kuadratnya disebut <strong>kelajuan
root-mean-square</strong> (akar dari rata-rata kuadrat), disingkat $c_{rms}$:</p>
<div class="formula-box">$$c_{rms} = \\sqrt{\\overline{c^2}}$$</div>
<p>Dari hasil bagian 5 dan 6 di atas ($\\tfrac13 m\\overline{c^2} = kT$, dan $k=R/N_A$ sementara $M=mN_A$
adalah massa molar), $c_{rms}$ dapat dihitung langsung dari suhu dan massa molar gas:</p>
<div class="formula-box">$$c_{rms} = \\sqrt{\\dfrac{3kT}{m}} = \\sqrt{\\dfrac{3RT}{M}}$$</div>
<p>dengan $M$ = massa molar gas dalam <strong>kg mol⁻¹</strong> (bukan g mol⁻¹ — ingat konversi
$1~\\text{g mol}^{-1} = 1\\times10^{-3}~\\text{kg mol}^{-1}$).</p>
<p><strong>Contoh perhitungan:</strong> Berapa kelajuan rms molekul gas nitrogen (N₂, komponen utama udara,
$M = 28~\\text{g mol}^{-1} = 2{,}8\\times10^{-2}~\\text{kg mol}^{-1}$) pada suhu ruangan $20°\\text{C}$
($T=293$ K)?</p>
<div class="formula-box">$$c_{rms} = \\sqrt{\\dfrac{3RT}{M}} = \\sqrt{\\dfrac{3 \\times 8{,}31 \\times 293}{2{,}8\\times10^{-2}}} \\approx \\sqrt{2{,}61\\times10^{5}} \\approx 511~\\text{m s}^{-1}$$</div>
<p class="muted">Kelajuan ini (sekitar 511 m/s, lebih dari 1800 km/jam!) jauh lebih besar daripada kelajuan
angin biasa, tetapi molekul udara terus-menerus bertumbukan dengan molekul lain (lintasan bebas rata-ratanya
sangat pendek), sehingga perpindahan neto molekul dari satu tempat ke tempat lain (difusi) jauh lebih lambat
daripada kelajuan rms-nya sendiri.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/6/61/Maxwell-Boltzmann-Distribution.svg",
    alt: "Grafik distribusi Maxwell-Boltzmann kelajuan molekul gas pada tiga suhu berbeda",
    caption: "Distribusi Maxwell-Boltzmann: sebaran kelajuan molekul-molekul gas pada tiga suhu berbeda ($T=100$ K, $1200$ K, $5000$ K). Tidak semua molekul punya kelajuan sama; grafik ini bergeser ke kelajuan lebih tinggi dan melebar saat suhu naik. Kelajuan rms terletak sedikit di kanan puncak kurva (kelajuan paling mungkin).",
    author: "MikeRun", license: "CC BY-SA 4.0" },
  null
)}
`;

const IDEALGASES_EKSPERIMEN = {
  title: "Eksperimen Nyata: Menyelidiki Hukum Boyle dengan Kolom Udara Terjebak",
  intro: `
    <p class="muted">Ini eksperimen fisik sungguhan dengan alat lab nyata (tabung Hukum Boyle berskala,
    pengukur tekanan, dan pompa), bukan simulasi komputer. Ini adalah praktikum standar untuk memverifikasi
    Hukum Boyle ($pV=\\text{konstan}$ pada suhu tetap) yang umum dipakai di banyak silabus A-Level
    (termasuk sebagai <em>Required/Core Practical</em> pada AQA dan Edexcel, dan didokumentasikan di
    IOPSpark dan CLEAPSS).</p>

    <h4>Tujuan</h4>
    <p>Menyelidiki hubungan antara tekanan $p$ dan volume $V$ sejumlah tetap gas (udara) pada suhu konstan,
    dan memverifikasi Hukum Boyle ($pV = \\text{konstan}$).</p>

    <h4>Konsep Dasar</h4>
    <p>Selama suhu $T$ dan jumlah mol gas $n$ dijaga tetap, persamaan keadaan gas ideal $pV=nRT$ meramalkan
    bahwa hasil kali $pV$ haruslah konstan:</p>
    <div class="formula-box">$$p_1V_1 = p_2V_2 \\quad (\\text{Hukum Boyle, } T \\text{ dan } n \\text{ tetap})$$</div>
    <p>Karena volume kolom udara yang terjebak dalam tabung berpenampang seragam (luas penampang $A$
    konstan) berbanding lurus dengan panjang kolomnya ($V = A \\times L$), mengukur panjang kolom udara $L$
    saja sudah cukup untuk mewakili volume $V$ — kita tidak perlu tahu nilai $A$ untuk memverifikasi bentuk
    hubungannya, karena $A$ tetap konstan sepanjang percobaan (akan tereliminasi saat membandingkan data).</p>

    <h4>Alat &amp; Bahan</h4>
    <ul>
      <li>Alat Hukum Boyle (Boyle's law apparatus): tabung kaca tebal berskala panjang, berisi kolom udara
      kering yang terjebak di atas kolom minyak (oli), dilengkapi pengukur tekanan Bourdon (Bourdon gauge)
      yang membaca tekanan mutlak gas secara langsung</li>
      <li>Pompa tangan/pompa kaki (foot pump atau pompa ban sepeda/mobil) yang tersambung ke reservoir
      minyak alat, untuk menaikkan tekanan</li>
      <li>Keran pelepas tekanan (release valve) pada reservoir, untuk menurunkan tekanan secara terkendali</li>
      <li>Penyangga/klem atau pemberat di dasar alat supaya tabung tegak dan tidak mudah terguling</li>
      <li>Sekat pengaman (safety screen) transparan untuk dipasang di depan alat</li>
      <li>Kacamata pengaman (safety goggles) untuk setiap siswa yang terlibat</li>
      <li>Stopwatch (untuk memberi jeda waktu penyetimbangan suhu setelah tiap perubahan tekanan)</li>
    </ul>

    <h4>Langkah Kerja</h4>
    <ol>
      <li>Sebelum menyalakan apa pun, pasang sekat pengaman di depan alat dan pastikan semua siswa memakai
      kacamata pengaman. Pastikan alat berdiri tegak dan stabil (diklem atau diberi pemberat).</li>
      <li>Catat pembacaan awal: tekanan pada pengukur Bourdon (biasanya sudah menunjukkan tekanan atmosfer
      sebelum pompa dipakai) dan panjang kolom udara $L_0$ yang terjebak di tabung.</li>
      <li>Pompa perlahan (secara vertikal, tekan pompa dengan hati-hati terutama saat tekanan sudah tinggi)
      untuk menaikkan tekanan sedikit demi sedikit. Pada setiap kenaikan tekanan, <strong>tunggu beberapa
      saat</strong> (gunakan stopwatch, biasanya 30-60 detik) supaya suhu gas yang sempat naik akibat
      kompresi kembali stabil ke suhu ruangan sebelum membaca panjang kolom (mata harus sejajar horizontal
      dengan skala/meniskus saat membaca, untuk menghindari kesalahan paralaks).</li>
      <li>Catat pasangan data (tekanan $p$, panjang kolom $L$) di setiap langkah kenaikan tekanan, sampai
      mendekati batas maksimum alat (jangan berlebihan).</li>
      <li>Setelah mencapai tekanan maksimum yang aman, lepaskan pompa dan gunakan keran pelepas untuk
      menurunkan tekanan secara bertahap (buka keran sedikit demi sedikit), catat kembali pasangan data
      (p, L) pada arah menurun sebagai pengulangan/pengecekan.</li>
      <li>Ulangi seluruh rangkaian pengukuran (naik dan turun) sekali lagi untuk memastikan data konsisten
      dan mendapati rata-rata jika ada sedikit perbedaan.</li>
    </ol>

    <h4>Tabel Data (contoh, isi dengan data hasil percobaanmu)</h4>
    <table>
      <tr><th>p (× 10⁵ Pa)</th><th>L (cm)</th><th>V &prop; L (cm, sebagai wakil volume)</th><th>1/L (cm⁻¹)</th><th>p × L (× 10⁵ Pa cm)</th></tr>
      <tr><td>1,0</td><td></td><td></td><td></td><td></td></tr>
      <tr><td>1,5</td><td></td><td></td><td></td><td></td></tr>
      <tr><td>2,0</td><td></td><td></td><td></td><td></td></tr>
      <tr><td>2,5</td><td></td><td></td><td></td><td></td></tr>
      <tr><td>3,0</td><td></td><td></td><td></td><td></td></tr>
    </table>

    <h4>Analisis &amp; Perhitungan</h4>
    <ul>
      <li>Cara 1 (uji konstanta): hitung kolom terakhir tabel, $p \\times L$, untuk setiap baris data. Jika
      Hukum Boyle berlaku, semua nilai $p \\times L$ seharusnya kurang lebih sama (konstan dalam batas
      ketidakpastian pengukuran).</li>
      <li>Cara 2 (grafik, lebih meyakinkan secara statistik): plot grafik $p$ (sumbu-y) terhadap $1/L$
      (sumbu-x). Karena $pV=p(AL)=\\text{konstan}$, maka $p = \\dfrac{\\text{konstan}}{A}\\times\\dfrac{1}{L}$,
      sehingga grafik $p$ vs $1/L$ seharusnya berupa <strong>garis lurus melalui titik asal (0,0)</strong>.
      Tarik garis lurus terbaik (line of best fit) dan periksa apakah memang melewati titik asal.</li>
      <li>Sebagai pembanding, plot juga grafik $p$ terhadap $L$ secara langsung — bentuknya seharusnya kurva
      melengkung (hiperbola), <strong>bukan</strong> garis lurus, ini menegaskan bahwa hubungan $p$-$V$
      memang tidak linear secara langsung.</li>
    </ul>

    <h4>Keselamatan Kerja</h4>
    <ul>
      <li>WAJIB memakai kacamata pengaman dan memasang sekat pengaman transparan di depan alat sepanjang
      percobaan — tabung kaca bertekanan tinggi berisiko retak/pecah.</li>
      <li>Jangan pernah melampaui batas tekanan maksimum yang tertera pada alat (biasanya ditandai warna
      merah pada pengukur Bourdon).</li>
      <li>Pompa secara perlahan dan hati-hati, terutama saat tekanan sudah tinggi, karena dorongan pompa
      makin berat melawan tekanan balik gas.</li>
      <li>Pastikan alat diklem/diberi pemberat di dasar sehingga tidak mudah terguling atau tergeser dari
      tepi meja saat dipompa.</li>
      <li>Amati alat dari jarak aman di belakang sekat pengaman; jangan meletakkan wajah terlalu dekat
      dengan tabung kaca.</li>
    </ul>

    <h4>Sumber Kesalahan (untuk didiskusikan di laporan)</h4>
    <ul>
      <li>Kompresi gas yang terlalu cepat menaikkan suhu gas sesaat (proses mendekati adiabatik, bukan
      isotermal sepenuhnya) sebelum sempat kembali setimbang dengan suhu ruangan — inilah alasan pentingnya
      jeda waktu sebelum membaca panjang kolom.</li>
      <li>Kesalahan paralaks saat membaca posisi meniskus minyak terhadap skala panjang tabung.</li>
      <li>Sedikit gas/udara mungkin bocor perlahan melalui sambungan pompa/keran selama percobaan
      berlangsung, menyebabkan jumlah mol gas $n$ tidak benar-benar tetap sempurna.</li>
      <li>Ketelitian pembacaan pengukur Bourdon terbatas pada skala terkecilnya (biasanya dalam kelipatan
      puluhan kPa).</li>
    </ul>

    <h4>Alternatif Sederhana dengan Suntikan (Syringe) — jika alat Boyle's law tidak tersedia</h4>
    <p>Kalau sekolah tidak memiliki alat Hukum Boyle standar, hubungan $p$-$V$ tetap bisa diselidiki secara
    kuantitatif dengan <strong>suntikan (gas syringe) berskala</strong> dan beban tambahan:</p>
    <ol>
      <li>Tutup rapat ujung suntikan (misalnya dengan lem karet/sumbat) sehingga sejumlah tetap udara
      terjebak di dalamnya, catat volume awal $V_0$ langsung dari skala suntikan pada saat piston bebas
      (tanpa beban tambahan, hanya ditahan mendatar).</li>
      <li>Pasang suntikan tegak (piston menghadap ke atas) dan tambahkan beban dengan massa diketahui secara
      bertahap di atas piston; catat volume gas (dari skala suntikan) pada setiap penambahan beban.</li>
      <li>Hitung tekanan gas pada tiap keadaan: $p = p_{atm} + \\dfrac{mg}{A_{piston}}$, dengan $p_{atm}
      \\approx 1{,}0\\times10^5$ Pa (tekanan atmosfer), $m$ = massa beban total di atas piston, $g=9{,}81$
      m s⁻², dan $A_{piston}$ = luas penampang piston suntikan (dihitung dari diameter suntikan yang
      tertera, $A = \\pi r^2$).</li>
      <li>Analisis datanya sama seperti metode utama: plot $p$ terhadap $1/V$, harus berupa garis lurus
      lewat titik asal.</li>
      <li>Metode ini lebih murah dan aman (tanpa tabung kaca bertekanan tinggi), tetapi jangkauan tekanan
      yang bisa dicapai jauh lebih kecil dibanding alat Hukum Boyle standar, sehingga perubahan volumenya
      relatif kecil dan galat pengukurannya secara proporsional lebih besar.</li>
    </ol>

    <h4>Pertanyaan Diskusi</h4>
    <ul>
      <li>Mengapa penting menunggu beberapa saat setelah menaikkan/menurunkan tekanan sebelum mencatat
      panjang kolom udara?</li>
      <li>Jika grafik $p$ terhadap $1/L$ hasil percobaanmu tidak tepat melewati titik asal (ada nilai
      intersep kecil), apa kemungkinan penyebabnya?</li>
      <li>Bagaimana cara memastikan bahwa suhu gas selama percobaan benar-benar tetap (bukan hanya
      diasumsikan tetap)?</li>
      <li>Pada metode alternatif suntikan, mengapa suntikan perlu dipasang tegak (vertikal) saat beban
      ditambahkan, bukan mendatar?</li>
    </ul>

    <h4>Referensi</h4>
    <ul>
      <li><a href="https://spark.iop.org/boyles-law" target="_blank" rel="noopener">Boyle's law, IOPSpark (Institute of Physics)</a></li>
      <li><a href="https://science.cleapss.org.uk/resource-info/pp028-investigating-gas-laws-1-pressure-volume-boyle-s-law.aspx" target="_blank" rel="noopener">PP028 — Investigating gas laws 1: pressure/volume (Boyle's law), CLEAPSS</a></li>
      <li><a href="https://qualifications.pearson.com/content/dam/pdf/A%20Level/Physics/2015/teaching-and-learning-materials/AS-and-A-level-Physics-Core-Practical-14-Pressure-and-Volume-(Student,-Teacher,-Technician-Worksheets).pdf" target="_blank" rel="noopener">Core Practical 14: Pressure and Volume of a Gas, Pearson Edexcel AS/A Level Physics</a></li>
      <li><a href="https://www.3bscientific.com/product-manual/U30046_EN.pdf" target="_blank" rel="noopener">Boyle's Law Apparatus U30046, Instruction Sheet, 3B Scientific</a></li>
    </ul>
  `
};

/* type: "mcq" atau "structured".
   Untuk mcq: options[] dan correct = index jawaban benar. */
const IDEALGASES_LATIHAN = [
  {
    type: "mcq",
    question: "Sebuah tabung berisi 16 g gas oksigen (O₂, massa molar 32 g mol⁻¹). Konstanta Avogadro N_A = 6,02 × 10²³ mol⁻¹. Berapakah jumlah molekul oksigen dalam tabung tersebut?",
    options: ["1,5 × 10²³", "3,0 × 10²³", "6,0 × 10²³", "9,6 × 10²⁴"],
    correct: 1,
    solution: `Jumlah mol: $n = \\dfrac{\\text{massa}}{\\text{massa molar}} = \\dfrac{16}{32} = 0{,}50~\\text{mol}$.
    <br>Jumlah molekul: $N = nN_A = 0{,}50 \\times 6{,}02\\times10^{23} = 3{,}01\\times10^{23} \\approx 3{,}0\\times10^{23}$ molekul.`
  },
  {
    type: "mcq",
    question: "Sejumlah tetap gas ideal pada suhu tetap memiliki volume 480 cm³ pada tekanan 1,0 × 10⁵ Pa. Gas itu kemudian dimampatkan (dikompresi) pada suhu yang sama hingga volumenya menjadi 320 cm³. Berapakah tekanan gas setelah dimampatkan?",
    options: ["0,67 × 10⁵ Pa", "1,0 × 10⁵ Pa", "1,5 × 10⁵ Pa", "2,25 × 10⁵ Pa"],
    correct: 2,
    solution: `Suhu tetap sehingga berlaku Hukum Boyle: $p_1V_1 = p_2V_2$.
    <br>$p_2 = \\dfrac{p_1V_1}{V_2} = \\dfrac{(1{,}0\\times10^5)(480)}{320} = 1{,}5\\times10^{5}~\\text{Pa}$.
    <br>Masuk akal: volume mengecil (dimampatkan), jadi tekanan harus membesar, sesuai jawaban di atas.`
  },
  {
    type: "structured",
    question: "Sebuah silinder bervolume 0,025 m³ berisi gas ideal pada tekanan 2,4 × 10⁵ Pa dan suhu 22 °C. Konstanta gas molar R = 8,31 J K⁻¹ mol⁻¹. Tentukan (a) suhu gas dalam kelvin, (b) jumlah mol gas dalam silinder.",
    solution: `<strong>(a)</strong> $T = 22 + 273 = 295~\\text{K}$.
    <br><strong>(b)</strong> Dari $pV=nRT$: $n = \\dfrac{pV}{RT} = \\dfrac{(2{,}4\\times10^5)(0{,}025)}{(8{,}31)(295)} = \\dfrac{6000}{2451{,}45} \\approx 2{,}4~\\text{mol}$.`
  },
  {
    type: "structured",
    question: "Sejumlah tetap gas ideal (massa gas tidak berubah) mula-mula memiliki volume 300 cm³, tekanan 1,0 × 10⁵ Pa, dan suhu 27 °C. Gas kemudian mengembang hingga volumenya menjadi 500 cm³ sementara tekanannya turun menjadi 8,0 × 10⁴ Pa. Tentukan (a) suhu awal gas dalam kelvin, (b) suhu akhir gas setelah perubahan keadaan ini.",
    solution: `<strong>(a)</strong> $T_1 = 27 + 273 = 300~\\text{K}$.
    <br><strong>(b)</strong> Karena jumlah mol gas tetap, berlaku hukum gas gabungan: $\\dfrac{p_1V_1}{T_1} = \\dfrac{p_2V_2}{T_2}$.
    <br>$T_2 = T_1 \\times \\dfrac{p_2V_2}{p_1V_1} = 300 \\times \\dfrac{(8{,}0\\times10^4)(500)}{(1{,}0\\times10^5)(300)} = 300 \\times \\dfrac{4{,}0\\times10^7}{3{,}0\\times10^7} = 300 \\times 1{,}333 \\approx 400~\\text{K}$
    <br>(setara dengan $400 - 273 = 127°\\text{C}$). Catatan: karena $V$ dalam cm³ muncul di pembilang dan penyebut yang sama, satuan volumenya boleh tidak diubah ke m³ karena akan saling menghilangkan (tereliminasi) dalam perbandingan ini.`
  },
  {
    type: "structured",
    question: "Konstanta Boltzmann k = 1,38 × 10⁻²³ J K⁻¹. Tentukan (a) energi kinetik translasi rata-rata sebuah molekul gas ideal pada suhu 300 K, (b) suhu (dalam kelvin) yang diperlukan agar energi kinetik translasi rata-rata molekul tersebut menjadi dua kali lipat dari nilai pada bagian (a).",
    solution: `<strong>(a)</strong> $E_k = \\tfrac{3}{2}kT = \\tfrac{3}{2}(1{,}38\\times10^{-23})(300) = 6{,}21\\times10^{-21}~\\text{J}$.
    <br><strong>(b)</strong> Karena $E_k = \\tfrac32 kT$, energi kinetik rata-rata berbanding lurus langsung dengan suhu mutlak $T$. Agar $E_k$ menjadi dua kali lipat, $T$ juga harus menjadi dua kali lipat:
    <br>$T_{baru} = 2 \\times 300 = 600~\\text{K}$.
    <br>(Cek: $E_k = \\tfrac32(1{,}38\\times10^{-23})(600) = 1{,}242\\times10^{-20}~\\text{J}$, tepat dua kali $6{,}21\\times10^{-21}$ J, konsisten.)`
  },
  {
    type: "structured",
    question: "Molar gas constant R = 8,31 J K⁻¹ mol⁻¹. Molekul nitrogen (N₂) memiliki massa molar 28 g mol⁻¹. Tentukan (a) massa molar nitrogen dalam kg mol⁻¹, (b) kelajuan root-mean-square (rms) molekul nitrogen pada suhu 20 °C.",
    solution: `<strong>(a)</strong> $M = 28~\\text{g mol}^{-1} = 28\\times10^{-3}~\\text{kg mol}^{-1} = 2{,}8\\times10^{-2}~\\text{kg mol}^{-1}$.
    <br><strong>(b)</strong> $T = 20 + 273 = 293~\\text{K}$.
    <br>$c_{rms} = \\sqrt{\\dfrac{3RT}{M}} = \\sqrt{\\dfrac{3(8{,}31)(293)}{2{,}8\\times10^{-2}}} = \\sqrt{\\dfrac{7304{,}3}{2{,}8\\times10^{-2}}} = \\sqrt{2{,}609\\times10^{5}} \\approx 5{,}1\\times10^{2}~\\text{m s}^{-1}$ (sekitar 511 m s⁻¹).`
  }
];

/* Lembar rumus ringkas (plain text), dipakai sebagai "grounding" otomatis:
   ditempelkan ke prompt yang dikirim ke AI supaya AI memakai persis rumus
   & nilai yang sudah divalidasi guru, bukan menebak dari pengetahuan umum. */
const IDEALGASES_FORMULA_SHEET = `
- Mol dan konstanta Avogadro: N = n * NA, dengan NA = konstanta Avogadro = 6.02 x 10^23 mol^-1 (data sheet Cambridge)
- Jumlah mol dari massa: n = massa sampel / massa molar (M). Hati-hati satuan massa molar (g/mol vs kg/mol) harus konsisten dengan satuan massa sampel yang dipakai.
- Persamaan keadaan gas ideal: pV = nRT, dengan R = konstanta gas molar = 8.31 J K^-1 mol^-1 (data sheet Cambridge)
- Bentuk per-molekul: pV = NkT, dengan k = konstanta Boltzmann = 1.38 x 10^-23 J K^-1 (data sheet Cambridge), dan k = R / NA
- T harus dalam kelvin di semua rumus gas ideal: T(K) = T(derajat C) + 273,15 (syllabus 9702 2025-2027); pembulatan cepat +273 sering dipakai untuk estimasi praktis pada soal (bedanya cuma 0,15 K, tidak mengubah jawaban akhir pada 2-3 angka penting).
- Hukum Boyle (T dan n tetap): p1 V1 = p2 V2. Grafik p-V berupa hiperbola/isoterm; grafik p vs 1/V garis lurus lewat titik asal.
- Hukum Tekanan / Gay-Lussac (V dan n tetap): p1/T1 = p2/T2. Grafik p vs T (kelvin) garis lurus lewat titik asal.
- Hukum Charles (p dan n tetap): V1/T1 = V2/T2. Grafik V vs T (kelvin) garis lurus lewat titik asal.
- Hukum gas gabungan (n tetap): p1 V1 / T1 = p2 V2 / T2
- Asumsi dasar teori kinetik gas ideal (silabus 9702 15.3.1): (1) sejumlah besar molekul bergerak acak (random motion); (2) volume molekul diabaikan terhadap volume gas; (3) gaya antarmolekul diabaikan kecuali saat tumbukan; (4) tumbukan antar molekul & dengan dinding bersifat lenting sempurna (elastis) dan berlangsung sangat singkat dibanding waktu antar tumbukan; (5) molekul bergerak lurus dengan kelajuan tetap di antara tumbukan, mematuhi hukum gerak Newton.
- Tekanan gas dari teori kinetik: pV = 1/3 N m <c^2>, dengan N = jumlah molekul, m = massa satu molekul, <c^2> = kelajuan kuadrat rata-rata (mean square speed, BUKAN kuadrat dari kelajuan rata-rata)
- Menghubungkan ke suhu (bandingkan pV=1/3 N m<c^2> dengan pV=NkT): (1/2) m <c^2> = (3/2) k T -> energi kinetik translasi rata-rata satu molekul E_k = (3/2) k T, sebanding langsung dengan suhu mutlak T, tidak bergantung jenis gas.
- Kelajuan root-mean-square: c_rms = sqrt(<c^2>) = sqrt(3 k T / m) = sqrt(3 R T / M), dengan M = massa molar gas dalam kg/mol.
- Nilai standar data sheet Cambridge 9702: R = 8.31 J K^-1 mol^-1 ; NA = 6.02 x 10^23 mol^-1 ; k = 1.38 x 10^-23 J K^-1 ; g = 9.81 m/s^2 (untuk eksperimen terkait, jika diperlukan).
`;

/* Konsep spesifik untuk dropdown Generator Prompt di Lab Simulasi Virtual */
const IDEALGASES_LAB_CONCEPTS = [
  "Konsep Mol dan Konstanta Avogadro (N = n x NA)",
  "Persamaan Keadaan Gas Ideal (pV = nRT dan pV = NkT)",
  "Hukum Boyle, Hukum Tekanan, dan Hukum Charles (grafik p-V, p-T, V-T)",
  "Asumsi Dasar Teori Kinetik Gas Ideal",
  "Tekanan Gas dari Teori Kinetik (pV = 1/3 N m <c^2>)",
  "Hubungan Energi Kinetik Molekul dengan Suhu ((1/2) m <c^2> = (3/2) k T) dan Kelajuan rms",
  "Lainnya (tulis sendiri di instruksi tambahan)"
];

/* Tempelkan konten lengkap ke objek topik "ideal-gases" */
(function attachIdealGasesContent() {
  const topic = TOPICS.find(t => t.id === "ideal-gases");
  topic.materiHTML = IDEALGASES_MATERI;
  topic.eksperimen = IDEALGASES_EKSPERIMEN;
  topic.latihan = IDEALGASES_LATIHAN;
  topic.labConcepts = IDEALGASES_LAB_CONCEPTS;
  topic.formulaSheet = IDEALGASES_FORMULA_SHEET;
})();

/* ------------------------------------------------------------
   Konten lengkap: THERMODYNAMICS (topik 16, A2)
   ------------------------------------------------------------ */

/* ------------------------------------------------------------
   Konten lengkap: THERMODYNAMICS (topik 16, A2)
   ------------------------------------------------------------ */

const THERMODYNAMICS_MATERI = `
<h3>1. Energi Dalam (Internal Energy)</h3>
<p><strong>Energi dalam</strong> $U$ suatu sistem (misalnya sejumlah gas) didefinisikan sebagai
<strong>jumlah dari energi kinetik acak dan energi potensial acak seluruh molekul</strong> dalam sistem
tersebut, akibat gerak dan susunan molekul yang tidak beraturan.</p>
<div class="formula-box">$$U = \\sum(\\text{EK molekul}) + \\sum(\\text{EP molekul})$$</div>
<ul>
  <li><strong>Energi kinetik molekul</strong> berasal dari gerak translasi (dan pada molekul poliatomik, juga
  rotasi/getaran) molekul-molekul yang bergerak acak. Komponen ini berkaitan langsung dengan suhu mutlak gas.</li>
  <li><strong>Energi potensial molekul</strong> berasal dari gaya tarik/tolak antar molekul (gaya
  antarmolekul). Untuk gas ideal, gaya antarmolekul diasumsikan diabaikan sehingga energi potensial ini
  dianggap nol.</li>
</ul>
<p class="muted"><strong>Energi dalam BUKAN sama dengan suhu.</strong> Suhu hanya berkaitan dengan energi
kinetik rata-rata molekul (lihat topik Ideal Gases: $\\tfrac12 m\\overline{c^2} \\propto T$). Energi dalam
mencakup energi kinetik <em>dan</em> energi potensial total seluruh molekul. Contoh: saat es mencair menjadi
air pada suhu tetap 0°C, suhu (dan karenanya energi kinetik rata-rata molekul) tidak berubah, tetapi energi
dalam tetap bertambah karena kalor laten yang diserap digunakan untuk mengubah susunan/jarak antarmolekul,
sehingga energi potensial molekulnya meningkat. Untuk <strong>gas ideal</strong> saja (karena energi potensial
antarmolekulnya nol), energi dalam sepenuhnya berupa energi kinetik, sehingga perubahan energi dalam gas ideal
berbanding lurus dengan perubahan suhu mutlaknya.</p>

<h3>2. Kerja yang Dilakukan pada/oleh Gas</h3>
<p>Ketika gas memuai atau dimampatkan oleh sebuah piston, terjadi perpindahan energi dalam bentuk kerja
mekanik. Untuk gas pada <strong>tekanan tetap</strong> $p$ yang volumenya berubah sebesar $\\Delta V$, besar
kerja yang terlibat adalah:</p>
<div class="formula-box">$$W = p\\,\\Delta V$$</div>
<p>Secara lebih umum (tekanan tidak harus tetap), besar kerja pada suatu proses sama dengan
<strong>luas daerah di bawah kurva pada grafik $p$-$V$</strong> antara volume awal dan volume akhir; rumus
$W = p\\Delta V$ hanyalah kasus khusus ketika kurva itu berupa garis mendatar (tekanan konstan), sehingga
luasnya berbentuk persegi panjang.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/2/29/P-V_diagram_work_closed_system.svg",
    alt: "Grafik tekanan terhadap volume menunjukkan luas daerah sebagai kerja yang dilakukan gas",
    caption: "Grafik $p$-$V$ untuk gas yang memuai dalam sistem tertutup: luas daerah di bawah kurva (diarsir) sama dengan besar kerja yang terlibat pada proses tersebut.",
    author: "Olivier Cleynen", license: "CC0 (Domain Publik)" },
  { id: "Xcrco59p40o", title: "PV diagrams - part 1: Work and isobaric processes",
    channel: "Khan Academy", desc: "Menjelaskan cara menghitung kerja dari grafik p-V, termasuk kasus khusus proses isobarik (tekanan tetap) W = p ΔV." }
)}
<p>Penting membedakan <strong>arah</strong> perpindahan energi ini:</p>
<ul>
  <li>Saat gas <strong>memuai</strong> ($\\Delta V > 0$) mendorong piston keluar, gas <strong>melakukan kerja
  pada lingkungan</strong> (energi meninggalkan gas melalui kerja).</li>
  <li>Saat gas <strong>dimampatkan</strong> ($\\Delta V < 0$) oleh piston yang didorong dari luar, lingkungan
  <strong>melakukan kerja pada gas</strong> (energi masuk ke gas melalui kerja).</li>
</ul>
<p class="muted">Perbedaan ini akan sangat menentukan tanda (+/-) suku kerja $w$ pada hukum pertama
termodinamika di bagian berikutnya — lihat baik-baik konvensi tanda yang dipakai Cambridge 9702.</p>

<h3>3. Hukum Pertama Termodinamika</h3>
<p>Hukum pertama termodinamika adalah pernyataan <strong>hukum kekekalan energi</strong> yang diterapkan pada
sistem termodinamika (misalnya sejumlah gas tertutup). Sesuai <em>syllabus</em> resmi Cambridge International
AS &amp; A Level Physics 9702, hukum ini dituliskan sebagai:</p>
<div class="formula-box">$$\\Delta U = q + w$$</div>
<p><strong>Definisi istilah menurut konvensi Cambridge 9702 (penting, hafalkan persis):</strong></p>
<table>
  <tr><th>Simbol</th><th>Arti</th><th>Bertanda POSITIF jika&hellip;</th><th>Bertanda NEGATIF jika&hellip;</th></tr>
  <tr><td>$\\Delta U$</td><td>Perubahan energi dalam sistem</td><td>Energi dalam sistem <strong>bertambah</strong></td><td>Energi dalam sistem <strong>berkurang</strong></td></tr>
  <tr><td>$q$</td><td>Kalor yang <strong>diterima</strong> sistem (energi yang berpindah ke sistem melalui pemanasan)</td><td>Kalor <strong>masuk</strong> ke sistem (sistem dipanaskan)</td><td>Kalor <strong>keluar</strong> dari sistem (sistem melepas kalor ke lingkungan)</td></tr>
  <tr><td>$w$</td><td>Kerja yang dilakukan <strong>pada</strong> sistem/gas</td><td>Gas <strong>dimampatkan</strong> (lingkungan melakukan kerja pada gas)</td><td>Gas <strong>memuai</strong> (gas melakukan kerja pada lingkungan)</td></tr>
</table>
<p class="muted"><strong>Peringatan penting:</strong> beberapa buku teks (terutama buku kimia/teknik lama)
memakai konvensi fisika klasik $\\Delta U = Q - W$ dengan $W$ = kerja yang dilakukan <em>oleh</em> sistem.
Cambridge 9702 <strong>TIDAK</strong> memakai konvensi itu. Selalu gunakan $\\Delta U = q + w$ dengan $w$ =
kerja <em>pada</em> sistem seperti pada data sheet dan <em>syllabus</em> Cambridge, supaya tanda kerja tidak
tertukar saat mengerjakan soal maupun menjawab pertanyaan ujian.</p>

<p><strong>Contoh kualitatif penerapan tanda:</strong></p>
<ul>
  <li>Gas dimampatkan (menerima kerja, $w > 0$) <em>sekaligus</em> dipanaskan (menerima kalor, $q > 0$)
  &rarr; kedua suku positif &rarr; $\\Delta U$ jelas bertambah (bertanda positif besar).</li>
  <li>Gas memuai melakukan kerja pada lingkungan tanpa menerima kalor sama sekali ($q = 0$, proses
  <strong>adiabatik</strong>) &rarr; $w < 0$ dan $q = 0$ &rarr; $\\Delta U = w < 0$, energi dalam
  <strong>berkurang</strong>, sehingga suhu gas turun. Inilah prinsip di balik <strong>pendinginan adiabatik</strong>
  (contoh: udara yang naik dan memuai di atmosfer menjadi lebih dingin).</li>
</ul>
${mediaRow(
  null,
  { id: "Xb05CaG7TsQ", title: "First law of thermodynamics / internal energy",
    channel: "Khan Academy", desc: "Pengantar hukum pertama termodinamika ΔU = Q + W dan penjelasan konsep energi dalam sebagai jumlah energi kinetik dan potensial molekul." }
)}

<h3>4. Kasus Khusus: Volume Tetap dan Proses Adiabatik</h3>
<table>
  <tr><th>Kasus</th><th>Syarat</th><th>Akibat pada hukum pertama</th></tr>
  <tr><td><strong>Volume tetap (isokhorik)</strong></td><td>Gas dalam wadah kaku/tertutup rapat, tidak ada perubahan volume ($\\Delta V = 0$)</td><td>$w = 0$ (tidak ada kerja karena tidak ada piston yang bergerak), sehingga $\\Delta U = q$: seluruh kalor yang diterima langsung menjadi pertambahan energi dalam.</td></tr>
  <tr><td><strong>Adiabatik</strong></td><td>Sistem terisolasi secara termal (tidak ada kalor yang masuk/keluar), atau perubahan terjadi sangat cepat sehingga kalor tidak sempat berpindah</td><td>$q = 0$, sehingga $\\Delta U = w$: seluruh perubahan energi dalam berasal murni dari kerja yang dilakukan pada/oleh gas.</td></tr>
</table>
<p>Kasus volume tetap ($\\Delta U = q$) inilah yang menjadi dasar teoretis mengapa pengukuran kalor pada
proses dengan volume tetap (misalnya memanaskan padatan/zat cair dalam wadah kaku) dapat langsung dipakai
untuk menentukan <strong>kapasitas kalor jenis</strong> (specific heat capacity, lihat topik Temperature):
$q = mc\\Delta\\theta$, dan karena $w \\approx 0$ untuk padatan/zat cair (pemuaiannya dapat diabaikan),
$\\Delta U = q = mc\\Delta\\theta$ secara langsung.</p>
${mediaRow(
  { src: "https://upload.wikimedia.org/wikipedia/commons/5/58/Fire_piston.jpg",
    alt: "Fire piston, tabung kaca dengan piston yang memampatkan udara secara adiabatik hingga menyalakan kapas",
    caption: "Fire piston: sepotong kecil kapas/serat dalam tabung transparan terbakar akibat panas yang dihasilkan dari pemampatan udara yang sangat cepat (mendekati adiabatik, $q \\approx 0$), sehingga $\\Delta U = w$ cukup besar untuk menaikkan suhu udara hingga titik nyala.",
    author: "Chocolateoak", license: "CC BY-SA 3.0 / GFDL" },
  { id: "6sP3kV-zgZk", title: "First law of thermodynamics problem solving",
    channel: "Khan Academy", desc: "Latihan menerapkan hukum pertama termodinamika ΔU = q + w pada berbagai kasus soal, termasuk proses volume tetap dan adiabatik." }
)}

<h3>5. Contoh Numerik: Menerapkan $\\Delta U = q + w$</h3>
<p><strong>Soal:</strong> Suatu gas ideal di dalam silinder berpiston berada pada tekanan tetap
$2{,}0\\times10^{5}$ Pa. Gas dipanaskan sehingga volumenya bertambah dari $3{,}0\\times10^{-4}$ m³ menjadi
$5{,}0\\times10^{-4}$ m³, sementara total kalor sebesar 90 J diberikan pada gas. Tentukan perubahan energi
dalam gas.</p>
<p><strong>Penyelesaian:</strong></p>
<p>Langkah 1 - hitung besar kerja yang dilakukan <em>oleh</em> gas terhadap lingkungan saat memuai pada
tekanan tetap:</p>
<div class="formula-box">$$\\Delta V = (5{,}0-3{,}0)\\times10^{-4} = 2{,}0\\times10^{-4}~\\text{m}^3$$
$$W_{\\text{oleh gas}} = p\\,\\Delta V = (2{,}0\\times10^{5})(2{,}0\\times10^{-4}) = 40~\\text{J}$$</div>
<p>Langkah 2 - karena gas <em>memuai</em> (melakukan kerja pada lingkungan), kerja yang dilakukan
<strong>pada</strong> gas ($w$, sesuai konvensi Cambridge) bertanda <strong>negatif</strong>:</p>
<div class="formula-box">$$w = -40~\\text{J}$$</div>
<p>Langkah 3 - kalor diberikan <em>pada</em> gas sehingga $q$ bertanda positif: $q = +90$ J. Terapkan hukum
pertama termodinamika:</p>
<div class="formula-box">$$\\Delta U = q + w = (+90) + (-40) = +50~\\text{J}$$</div>
<p>Jadi energi dalam gas <strong>bertambah 50 J</strong>. Masuk akal: dari 90 J kalor yang diberikan, 40 J
"dipakai" gas untuk melakukan kerja mendorong piston keluar, sisanya (50 J) tetap tersimpan sebagai
pertambahan energi dalam (dan menaikkan suhu gas).</p>
`;

const THERMODYNAMICS_EKSPERIMEN = {
  title: "Eksperimen Nyata: Fire Piston (Pemantik Api Kompresi) - Peragaan Hukum Pertama Termodinamika",
  intro: `
    <p class="muted">Ini eksperimen fisik/peragaan sungguhan dengan alat nyata (fire piston/fire syringe),
    bukan simulasi komputer. Peragaan ini adalah demonstrasi klasik yang banyak dipakai laboratorium fisika
    universitas dan koleksi peraga fisika sekolah untuk menunjukkan proses adiabatik secara nyata dan
    dramatis. Kalau alat fire piston tidak tersedia di sekolahmu, lihat bagian <strong>Alternatif</strong> di
    bawah yang memberi versi kuantitatif memakai alat pemanas listrik biasa.</p>

    <h4>Tujuan</h4>
    <p>Mengamati dan menjelaskan secara kualitatif bagaimana kompresi (pemampatan) udara yang sangat cepat
    dapat menaikkan suhunya secara signifikan (proses mendekati adiabatik), sebagai penerapan langsung hukum
    pertama termodinamika $\\Delta U = q + w$ pada kasus $q \\approx 0$.</p>

    <h4>Konsep Dasar</h4>
    <p>Fire piston adalah tabung silinder kaca/logam tertutup di salah satu ujungnya, dengan piston yang pas
    (rapat) di ujung lainnya. Jika piston didorong ke dalam tabung <strong>dengan sangat cepat</strong> (satu
    hentakan tangan yang kuat), udara di dalam tabung dimampatkan dalam waktu yang sangat singkat, sehingga
    <strong>tidak ada cukup waktu bagi kalor untuk berpindah keluar</strong> melalui dinding tabung. Proses ini
    mendekati proses <strong>adiabatik</strong> ($q \\approx 0$), sehingga hukum pertama termodinamika menjadi:</p>
    <div class="formula-box">$$\\Delta U = q + w \\approx 0 + w = w$$</div>
    <p>Karena piston melakukan kerja <em>pada</em> udara (memampatkannya, $\\Delta V < 0$), $w$ bertanda
    <strong>positif</strong> dan cukup besar (hentakan tangan manusia dapat memampatkan udara hingga rasio
    kompresi 20:1 atau lebih dalam waktu kurang dari 0,1 detik). Akibatnya $\\Delta U$ juga besar dan positif,
    menaikkan suhu udara di dalam tabung secara drastis (bisa melebihi 250-300°C) dalam sekejap, cukup panas
    untuk membakar sepotong kecil kapas/serat kering (tinder) yang diletakkan di dasar tabung, hingga terlihat
    percikan api singkat. Prinsip fisis yang sama inilah yang dipakai pada mesin diesel untuk menyalakan bahan
    bakar tanpa busi.</p>

    <h4>Alat &amp; Bahan</h4>
    <ul>
      <li>Fire piston / fire syringe (silinder kaca atau logam transparan dengan piston berperapat karet/kulit di ujungnya) - alat peraga fisika yang cukup umum tersedia sebagai alat edukasi</li>
      <li>Sepotong kecil kapas kering, serat char-cloth, atau tinder/sumbu kering sebagai bahan yang akan dibakar</li>
      <li>Kacamata pelindung (safety goggles) untuk pengamat dan operator</li>
      <li>Ruangan dengan pencahayaan agak redup (memudahkan melihat percikan api singkat yang dihasilkan)</li>
      <li>Alas tahan panas/non-mudah terbakar di bawah alat (jaga-jaga)</li>
      <li>(Opsional) termometer inframerah untuk memperkirakan kenaikan suhu jika tersedia</li>
    </ul>

    <h4>Langkah Kerja</h4>
    <ol>
      <li>Guru/instruktur yang berpengalaman memeriksa kondisi fire piston (perapat piston harus dalam kondisi baik agar udara benar-benar tidak bocor saat dimampatkan).</li>
      <li>Letakkan sepotong kecil kapas/tinder kering di dasar tabung (ujung tertutup).</li>
      <li>Tarik piston keluar hingga posisi awal (udara di dalam tabung pada tekanan dan volume awal, mendekati tekanan atmosfer).</li>
      <li>Redupkan lampu ruangan agar percikan api lebih mudah teramati.</li>
      <li>Dengan sekali hentakan cepat dan kuat (bukan dorongan pelan-pelan), tekan piston masuk sepenuhnya ke dalam tabung, lalu segera amati dasar tabung melalui dinding transparan.</li>
      <li>Amati adanya percikan/kilatan cahaya singkat dan/atau asap tipis di dasar tabung, tanda kapas mulai terbakar akibat panas kompresi.</li>
      <li>Tarik kembali piston perlahan, amati kondisi kapas (biasanya sedikit gosong/berasap).</li>
      <li>Ulangi 2-3 kali dengan kapas baru untuk memastikan hasil konsisten, dan bandingkan hasil hentakan cepat dengan dorongan lambat (lihat Pertanyaan Diskusi).</li>
    </ol>

    <h4>Tabel Pengamatan (kualitatif, isi dengan hasil percobaanmu)</h4>
    <table>
      <tr><th>Percobaan ke-</th><th>Kecepatan dorongan piston</th><th>Ada percikan api/asap?</th><th>Kondisi kapas setelahnya</th></tr>
      <tr><td>1</td><td>Cepat (hentakan)</td><td></td><td></td></tr>
      <tr><td>2</td><td>Cepat (hentakan)</td><td></td><td></td></tr>
      <tr><td>3</td><td>Lambat (didorong pelan)</td><td></td><td></td></tr>
    </table>

    <h4>Analisis</h4>
    <ul>
      <li>Pada hentakan cepat, proses mendekati adiabatik ($q \\approx 0$) karena waktu terlalu singkat bagi kalor untuk merambat keluar melalui dinding tabung, sehingga seluruh kerja $w$ (yang bertanda positif karena udara dimampatkan) langsung menjadi kenaikan energi dalam: $\\Delta U = w$.</li>
      <li>Pada dorongan lambat, sebagian besar kalor yang dihasilkan sempat merambat keluar ($q$ bertanda negatif, mengurangi kenaikan $\\Delta U$ meskipun $w$ tetap positif), sehingga suhu akhir udara jauh lebih rendah dan biasanya tidak cukup untuk membakar kapas. Ini menunjukkan pentingnya syarat "cepat" agar proses mendekati adiabatik sungguhan.</li>
      <li>Estimasi kasar: dengan rasio kompresi tinggi ($V_1/V_2 \\approx 20$-$25$), model gas ideal adiabatik memprediksi kenaikan suhu dari sekitar 20°C menjadi lebih dari 250°C, jauh melebihi titik nyala kapas kering (sekitar 200°C), sehingga penyalaan dapat terjadi meski hanya berlangsung sepersekian detik.</li>
    </ul>

    <h4>Keselamatan Kerja</h4>
    <ul>
      <li><strong>Wajib memakai kacamata pelindung</strong> - meskipun nyala api sangat kecil dan singkat, percikan atau pecahan alat (jika perapat/tabung rusak) berisiko mengenai mata.</li>
      <li>Demonstrasi ini sebaiknya <strong>dilakukan oleh guru/instruktur atau di bawah pengawasan langsung</strong>, bukan dicoba bebas oleh siswa tanpa supervisi, karena membutuhkan teknik hentakan yang benar agar aman dan alat tidak rusak.</li>
      <li>Jauhkan segala bahan mudah terbakar (kertas, alkohol, gas, rambut/pakaian longgar) dari area demonstrasi.</li>
      <li>Lakukan di ruangan dengan ventilasi cukup; meskipun asap yang dihasilkan sangat sedikit, hindari menghirupnya dari jarak dekat berulang kali.</li>
      <li>Periksa kondisi fisik tabung kaca sebelum digunakan (retak/gores dapat pecah akibat tekanan mendadak); jangan gunakan alat yang tampak rusak.</li>
      <li>Setelah demonstrasi, pastikan kapas yang terbakar benar-benar padam sebelum dibuang.</li>
    </ul>

    <h4>Sumber Kesalahan/Keterbatasan</h4>
    <ul>
      <li>Proses ini tidak benar-benar 100% adiabatik ($q$ tidak persis nol) - selalu ada sedikit kalor yang merambat keluar lewat dinding tabung, terutama jika hentakan kurang cepat atau tabung sudah hangat dari percobaan sebelumnya.</li>
      <li>Kekuatan dan kecepatan hentakan berbeda-beda antar orang, sehingga hasil (berhasil menyala atau tidak) tidak selalu konsisten - ini adalah demonstrasi kualitatif, bukan pengukuran presisi.</li>
      <li>Kelembapan kapas/tinder yang dipakai sangat memengaruhi keberhasilan penyalaan (kapas lembap sulit terbakar meski suhu sudah cukup tinggi).</li>
      <li>Kebocoran kecil di sekitar perapat piston (jika sudah aus) mengurangi rasio kompresi efektif, menurunkan kenaikan suhu yang dicapai.</li>
    </ul>

    <h4>Alternatif: Metode Pemanasan Listrik untuk Kapasitas Kalor Jenis (Kuantitatif, Volume Tetap)</h4>
    <p>Fire piston hanya memberi bukti <strong>kualitatif</strong> bahwa kerja dapat menaikkan energi dalam
    tanpa kalor (kasus $q=0$). Untuk melengkapi dengan bukti <strong>kuantitatif</strong> hukum pertama pada
    kasus sebaliknya ($w=0$, volume tetap, sehingga $\\Delta U = q$ langsung), lakukan praktikum standar
    menentukan <strong>kapasitas kalor jenis padatan dengan metode pemanasan listrik</strong>:</p>
    <ol>
      <li>Timbang massa $m$ sebuah blok logam (misalnya aluminium atau tembaga) yang punya dua lubang: satu untuk elemen pemanas listrik, satu untuk termometer (diberi sedikit oli agar kontak termal baik).</li>
      <li>Pasang elemen pemanas dan termometer pada lubangnya masing-masing. Karena blok padatan praktis tidak memuai secara berarti, <strong>tidak ada kerja mekanik yang dilakukan gas terhadap lingkungan</strong> ($w \\approx 0$).</li>
      <li>Catat suhu awal $\\theta_1$. Alirkan arus listrik $I$ pada tegangan $V$ yang diketahui selama waktu $t$ (diukur stopwatch), sehingga energi listrik yang diberikan adalah $q = VIt$.</li>
      <li>Catat suhu akhir $\\theta_2$ segera setelah pemanas dimatikan (agar kalor yang sempat hilang ke lingkungan minimal).</li>
      <li>Karena $w=0$, hukum pertama memberi $\\Delta U = q = VIt$. Karena $\\Delta U = mc\\Delta\\theta$ untuk padatan, kapasitas kalor jenis dapat dihitung: $c = \\dfrac{VIt}{m(\\theta_2-\\theta_1)}$.</li>
      <li>Untuk hasil yang lebih akurat, ulangi dengan blok terisolasi (dibungkus wol/gabus) untuk meminimalkan kalor yang hilang ke udara sekitar, dan bandingkan nilai $c$ yang diperoleh dengan nilai referensi (misalnya aluminium $\\approx 900$ J kg⁻¹ K⁻¹, tembaga $\\approx 385$ J kg⁻¹ K⁻¹).</li>
    </ol>
    <p class="muted">Perhatikan bagaimana kedua eksperimen ini saling melengkapi: fire piston menunjukkan kasus
    $q=0 \\Rightarrow \\Delta U = w$ (adiabatik), sedangkan metode pemanasan listrik pada padatan menunjukkan
    kasus $w=0 \\Rightarrow \\Delta U = q$ (volume tetap) - dua kasus khusus dari hukum pertama termodinamika
    yang sama.</p>

    <h4>Pertanyaan Diskusi</h4>
    <ul>
      <li>Mengapa fire piston hanya berhasil menyalakan kapas jika piston ditekan <strong>dengan cepat</strong>, bukan perlahan-lahan? Kaitkan jawabanmu dengan nilai $q$ pada kedua kasus.</li>
      <li>Pada fire piston, apakah $\\Delta U$ yang dihasilkan berasal dari kalor atau dari kerja? Jelaskan dengan hukum pertama termodinamika, lengkap dengan tanda tiap suku.</li>
      <li>Jika fire piston ditekan lalu dibiarkan diam (piston tidak dilepas) selama beberapa menit sebelum ditarik keluar, apa yang akan terjadi pada suhu udara di dalamnya, dan mengapa?</li>
      <li>Pada eksperimen alternatif (pemanasan listrik blok logam), mengapa penting mencatat suhu akhir <em>segera</em> setelah pemanas dimatikan, bukan menunggu beberapa menit?</li>
    </ul>

    <h4>Referensi</h4>
    <ul>
      <li><a href="https://en.wikipedia.org/wiki/Fire_piston" target="_blank" rel="noopener">Fire piston, Wikipedia (latar belakang sejarah dan prinsip kerja)</a></li>
      <li><a href="https://www.physics.purdue.edu/demos/display_page.php?item=3E-03" target="_blank" rel="noopener">Fire Syringe Demo (3E-03), Purdue University Physics Lecture Demonstrations</a></li>
      <li><a href="https://www.isu.edu/physics/outreach/physics-class-demos/thermodynamics/fire-syringe/" target="_blank" rel="noopener">Fire Syringe, Idaho State University Physics Outreach</a></li>
      <li><a href="https://web.physics.ucsb.edu/~lecturedemonstrations/Composer/Pages/52.24.html" target="_blank" rel="noopener">52.24 - Fire syringe, UC Santa Barbara Lecture Demonstrations</a></li>
      <li><a href="https://spark.iop.org/episode-607-specific-heat-capacity" target="_blank" rel="noopener">Episode 607: Specific heat capacity (metode elektrik), IOPSpark</a></li>
    </ul>
  `
};

/* type: "mcq" atau "structured".
   Untuk mcq: options[] dan correct = index jawaban benar.
   Konvensi Cambridge 9702: delta U = q + w, q = kalor DITERIMA sistem, w = kerja DILAKUKAN PADA sistem. */
const THERMODYNAMICS_LATIHAN = [
  {
    type: "mcq",
    question: "Suatu gas dimampatkan oleh sebuah piston sehingga menerima kerja sebesar 180 J dari lingkungan. Pada saat yang sama, gas tersebut juga menerima kalor sebesar 60 J. Berapakah perubahan energi dalam gas $\\Delta U$?",
    options: ["120 J", "180 J", "240 J", "300 J"],
    correct: 2,
    solution: `Gas menerima kerja (dimampatkan) sehingga menurut konvensi Cambridge $w$ bertanda positif: $w = +180~\\text{J}$.
    <br>Gas juga menerima kalor sehingga $q$ bertanda positif: $q = +60~\\text{J}$.
    <br>Dengan hukum pertama termodinamika: $\\Delta U = q + w = 60 + 180 = 240~\\text{J}$.
    <br>Kedua suku positif (gas menerima kalor DAN menerima kerja) sehingga energi dalam gas jelas bertambah, sesuai jawaban <strong>240 J</strong>.`
  },
  {
    type: "mcq",
    question: "Suatu gas mengalami proses adiabatik (tidak ada kalor yang masuk atau keluar sistem). Selama proses ini gas memuai dan melakukan kerja sebesar 95 J terhadap lingkungan. Berapakah perubahan energi dalam gas $\\Delta U$?",
    options: ["-95 J", "+95 J", "0 J", "-190 J"],
    correct: 0,
    solution: `Proses adiabatik berarti $q = 0$ (tidak ada perpindahan kalor sama sekali).
    <br>Gas <em>memuai</em> dan melakukan kerja PADA lingkungan (bukan menerima kerja), sehingga menurut konvensi Cambridge, kerja yang dilakukan PADA gas bertanda negatif: $w = -95~\\text{J}$.
    <br>$\\Delta U = q + w = 0 + (-95) = -95~\\text{J}$.
    <br>Energi dalam gas berkurang 95 J - gas menggunakan energi dalamnya sendiri untuk melakukan kerja mendorong lingkungan, karena tidak ada kalor yang masuk untuk menggantikannya. Ini adalah prinsip pendinginan adiabatik.`
  },
  {
    type: "structured",
    question: "Sejumlah gas dimampatkan secara adiabatik oleh sebuah piston. Piston melakukan kerja sebesar $3{,}4\\times10^{2}$ J pada gas selama proses ini. (a) Nyatakan nilai q untuk proses ini, disertai alasan. (b) Hitung perubahan energi dalam gas $\\Delta U$. (c) Apa yang terjadi pada suhu gas? Jelaskan menggunakan konsep energi dalam gas ideal.",
    solution: `<strong>(a)</strong> Proses adiabatik berarti sistem tidak bertukar kalor dengan lingkungan sama sekali, sehingga $q = 0$.
    <br><strong>(b)</strong> Gas dimampatkan (menerima kerja dari piston), sehingga $w = +3{,}4\\times10^{2}~\\text{J}$ (positif, sesuai konvensi Cambridge: kerja pada gas saat kompresi bertanda positif).
    <br>$\\Delta U = q + w = 0 + 3{,}4\\times10^{2} = 3{,}4\\times10^{2}~\\text{J}$ (energi dalam bertambah 340 J).
    <br><strong>(c)</strong> Untuk gas ideal, energi dalam sepenuhnya berupa energi kinetik molekul (energi potensial antarmolekul diabaikan), dan energi kinetik rata-rata molekul berbanding lurus dengan suhu mutlak. Karena $\\Delta U$ positif (energi dalam bertambah), maka <strong>suhu gas naik</strong>.`
  },
  {
    type: "structured",
    question: "Sebuah blok tembaga bermassa 0,20 kg (kapasitas kalor jenis tembaga $c = 385~\\text{J kg}^{-1}\\text{K}^{-1}$) dipanaskan secara elektrik di dalam wadah kaku yang tertutup rapat, sehingga volumenya tidak berubah selama pemanasan. Pemanas listrik memberikan energi sebesar 770 J kepada blok tersebut. (a) Jelaskan mengapa $w = 0$ untuk proses ini. (b) Gunakan hukum pertama termodinamika untuk menentukan $\\Delta U$ blok tembaga. (c) Hitung kenaikan suhu blok tembaga tersebut.",
    solution: `<strong>(a)</strong> Karena wadah kaku dan tertutup rapat, volume blok (dan udara di sekitarnya di dalam wadah) tidak berubah ($\\Delta V = 0$). Tidak ada piston/permukaan yang berpindah sehingga tidak ada kerja mekanik yang dilakukan pada atau oleh sistem: $w = 0$.
    <br><strong>(b)</strong> Energi listrik yang diberikan pemanas adalah kalor yang diterima sistem, sehingga $q = +770~\\text{J}$.
    <br>Dengan $w = 0$: $\\Delta U = q + w = 770 + 0 = 770~\\text{J}$.
    <br><strong>(c)</strong> Karena volume tetap (tidak ada kerja), seluruh energi ini menaikkan suhu blok padat sesuai $\\Delta U = mc\\Delta\\theta$:
    <br>$\\Delta\\theta = \\dfrac{\\Delta U}{mc} = \\dfrac{770}{0{,}20 \\times 385} = \\dfrac{770}{77{,}0} = 10{,}0~\\text{K}$.
    <br>Jadi suhu blok tembaga naik sebesar <strong>10,0 K (atau 10,0°C)</strong>.`
  },
  {
    type: "structured",
    question: "Gas di dalam sebuah silinder dimampatkan oleh piston sehingga volumenya berkurang. Selama proses kompresi ini, gas melepaskan kalor sebesar 25 J ke lingkungan sekitarnya, sementara piston melakukan kerja sebesar 60 J pada gas. (a) Tentukan tanda (positif/negatif) dari q dan w untuk proses ini, disertai alasannya. (b) Hitung perubahan energi dalam gas $\\Delta U$. (c) Apakah energi dalam gas bertambah atau berkurang?",
    solution: `<strong>(a)</strong> Gas <em>melepaskan</em> kalor (kalor meninggalkan sistem menuju lingkungan), sehingga menurut konvensi Cambridge $q$ bertanda <strong>negatif</strong>: $q = -25~\\text{J}$.
    <br>Piston melakukan kerja PADA gas (gas dimampatkan, menerima kerja dari luar), sehingga $w$ bertanda <strong>positif</strong>: $w = +60~\\text{J}$.
    <br><strong>(b)</strong> $\\Delta U = q + w = (-25) + (+60) = +35~\\text{J}$.
    <br><strong>(c)</strong> Karena $\\Delta U$ bertanda positif, energi dalam gas <strong>bertambah</strong> sebesar 35 J - meskipun gas kehilangan sebagian energi lewat pelepasan kalor, kerja yang diterimanya dari piston jauh lebih besar sehingga secara total energi dalamnya tetap naik.`
  },
  {
    type: "structured",
    question: "Gas ideal berada dalam silinder berpiston pada tekanan tetap $2{,}0\\times10^{5}$ Pa. Gas tersebut dipanaskan sehingga volumenya bertambah dari $3{,}0\\times10^{-4}$ m³ menjadi $5{,}0\\times10^{-4}$ m³, sementara total kalor sebesar 90 J diberikan pada gas selama proses ini. (a) Hitung besar kerja yang dilakukan OLEH gas terhadap lingkungan selama pemuaian ini. (b) Nyatakan nilai w (kerja pada gas, sesuai konvensi hukum pertama termodinamika) untuk proses ini, disertai alasan tandanya. (c) Hitung perubahan energi dalam gas $\\Delta U$.",
    solution: `<strong>(a)</strong> Karena tekanan tetap, kerja yang dilakukan gas terhadap lingkungan dihitung dari luas di bawah grafik $p$-$V$ (persegi panjang):
    <br>$\\Delta V = (5{,}0-3{,}0)\\times10^{-4} = 2{,}0\\times10^{-4}~\\text{m}^3$.
    <br>$W_{\\text{oleh gas}} = p\\,\\Delta V = (2{,}0\\times10^{5})(2{,}0\\times10^{-4}) = 40~\\text{J}$.
    <br><strong>(b)</strong> Karena gas <em>memuai</em> (melakukan kerja PADA lingkungan, bukan menerima kerja), kerja yang dilakukan PADA gas bertanda negatif: $w = -40~\\text{J}$.
    <br><strong>(c)</strong> Kalor diberikan pada gas sehingga $q = +90~\\text{J}$.
    <br>$\\Delta U = q + w = 90 + (-40) = +50~\\text{J}$.
    <br>Energi dalam gas bertambah 50 J: dari 90 J kalor yang diberikan, 40 J dipakai gas untuk melakukan kerja mendorong piston keluar, sisanya (50 J) menjadi pertambahan energi dalam gas.`
  }
];

/* Lembar rumus ringkas (plain text), dipakai sebagai "grounding" otomatis:
   ditempelkan ke prompt yang dikirim ke AI supaya AI memakai persis rumus
   & konvensi tanda yang sudah diverifikasi dari syllabus resmi Cambridge 9702,
   bukan menebak dari pengetahuan umum (banyak buku teks memakai konvensi tanda
   yang BERBEDA/terbalik, jadi ini WAJIB dipatuhi persis). */
const THERMODYNAMICS_FORMULA_SHEET = `
- Energi dalam U = jumlah energi kinetik acak + energi potensial acak seluruh molekul dalam sistem.
  U BUKAN sama dengan suhu: suhu hanya terkait energi kinetik rata-rata molekul; U juga mencakup energi potensial antarmolekul (mis. berubah saat perubahan wujud pada suhu tetap).
  Untuk gas ideal, energi potensial antarmolekul diabaikan, sehingga U gas ideal sepenuhnya berupa energi kinetik dan sebanding dengan suhu mutlak.
- Kerja pada tekanan tetap: W = p * delta_V. Secara umum, kerja = luas daerah di bawah kurva pada grafik p-V.
  Gas memuai (delta_V > 0) -> gas melakukan kerja PADA lingkungan. Gas dimampatkan (delta_V < 0) -> lingkungan melakukan kerja PADA gas.
- KONVENSI TANDA RESMI CAMBRIDGE 9702 (WAJIB, jangan dibalik): Hukum pertama termodinamika: delta U = q + w
  * delta U = perubahan energi dalam sistem. Positif jika energi dalam BERTAMBAH.
  * q = kalor yang DITERIMA sistem (energi berpindah ke sistem melalui pemanasan). Positif jika kalor MASUK ke sistem (dipanaskan). Negatif jika sistem MELEPASKAN kalor ke lingkungan.
  * w = kerja yang DILAKUKAN PADA sistem/gas. Positif jika gas DIMAMPATKAN (menerima kerja dari luar). Negatif jika gas MEMUAI (melakukan kerja pada lingkungan, bukan menerima kerja).
  * PERINGATAN: ini BERBEDA dari konvensi fisika klasik/kimia delta U = Q - W (W = kerja OLEH sistem). Cambridge 9702 SELALU pakai delta U = q + w dengan w = kerja PADA sistem. Jangan pernah membalik tanda w.
- Kasus khusus volume tetap (isokhorik): delta_V = 0 sehingga w = 0, maka delta U = q secara langsung.
  Untuk padatan/zat cair yang dipanaskan (pemuaian diabaikan, w kira-kira 0): delta U = q = m c delta_theta (c = kapasitas kalor jenis, lihat topik Temperature).
- Kasus khusus adiabatik: tidak ada kalor berpindah (isolasi termal sempurna, atau proses sangat cepat) sehingga q = 0, maka delta U = w secara langsung.
  Contoh: fire piston/fire syringe - kompresi udara sangat cepat (mendekati adiabatik, q kira-kira 0) menaikkan suhu udara drastis (delta U = w > 0 besar) hingga bisa menyalakan kapas kering.
  Contoh lain: ekspansi adiabatik (gas memuai tanpa menerima kalor, w negatif, q=0) menyebabkan delta U negatif, gas menjadi dingin (pendinginan adiabatik).
- Nilai standar g = 9.81 m/s^2 dan konstanta gas R = 8.31 J/(mol K) dipakai jika relevan pada soal gas ideal terkait, kecuali diminta lain oleh pengguna.
`;

/* Konsep spesifik untuk dropdown Generator Prompt di Lab Simulasi Virtual */
const THERMODYNAMICS_LAB_CONCEPTS = [
  "Energi Dalam (Internal Energy) sebagai Jumlah EK dan EP Molekul",
  "Kerja pada Gas: W = p delta V dan Luas di Bawah Grafik p-V",
  "Hukum Pertama Termodinamika: delta U = q + w (Konvensi Tanda Cambridge)",
  "Proses Volume Tetap (Isokhorik): w = 0, delta U = q",
  "Proses Adiabatik: q = 0, delta U = w (Pendinginan/Pemanasan Adiabatik)",
  "Identifikasi Tanda q dan w dari Deskripsi Proses Termodinamika",
  "Lainnya (tulis sendiri di instruksi tambahan)"
];

/* Tempelkan konten lengkap ke objek topik "thermodynamics" */
(function attachThermodynamicsContent() {
  const topic = TOPICS.find(t => t.id === "thermodynamics");
  topic.materiHTML = THERMODYNAMICS_MATERI;
  topic.eksperimen = THERMODYNAMICS_EKSPERIMEN;
  topic.latihan = THERMODYNAMICS_LATIHAN;
  topic.labConcepts = THERMODYNAMICS_LAB_CONCEPTS;
  topic.formulaSheet = THERMODYNAMICS_FORMULA_SHEET;
})();
