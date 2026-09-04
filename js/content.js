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
  { id: "temperature", number: 14, level: "A2", title: "Temperature", status: "soon",
    desc: "Skala suhu, kesetimbangan termal, kapasitas panas." },
  { id: "ideal-gases", number: 15, level: "A2", title: "Ideal Gases", status: "soon",
    desc: "Hukum gas ideal, teori kinetik gas." },
  { id: "thermodynamics", number: 16, level: "A2", title: "Thermodynamics", status: "soon",
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
