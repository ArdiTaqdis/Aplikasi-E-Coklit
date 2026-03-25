function cetakUndangan(data) {
  const html = `
  <div class="surat">

    <!-- WATERMARK -->
    <div class="wm">PILKADES</div>

    <!-- HEADER -->
    <div class="header">
      <img class="logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Coat_of_arms_of_Indonesia_Garuda_Pancasila.svg/512px-Coat_of_arms_of_Indonesia_Garuda_Pancasila.svg.png"/>
      
      <div class="header-text">
        <h2>PEMERINTAH DESA</h2>
        <h3>DESA ANDA</h3>
        <p>Kecamatan XXX • Kabupaten XXX</p>
      </div>
    </div>

    <div class="line"></div>

    <h3 class="judul">SURAT UNDANGAN PILKADES</h3>

    <p>Nomor: 001/UND/2026</p>

    <p>Kepada Yth:</p>

    <table class="table">
      <tr><td>Nama</td><td>: ${data["Nama Lengkap"]}</td></tr>
      <tr><td>NIK</td><td>: ${data["NIK"]}</td></tr>
      <tr><td>No KK</td><td>: ${data["NO KK"]}</td></tr>
    </table>

    <p>
      Sehubungan dengan pelaksanaan <b>Pemilihan Kepala Desa</b>,
      kami mengundang Saudara/i untuk hadir pada:
    </p>

    <table class="table">
      <tr><td>Hari</td><td>: Minggu</td></tr>
      <tr><td>Tanggal</td><td>: 10 Mei 2026</td></tr>
      <tr><td>Waktu</td><td>: 07.00 WIB</td></tr>
      <tr><td>Tempat</td><td>: TPS</td></tr>
    </table>

    const tgl = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
    });

    <div class="ttd">
      <p>${tgl}</p>
      <p>Panitia</p>
      <br><br><br>
      <p><b>(_____________)</b></p>
    </div>

  </div>
  `;

  document.getElementById("printArea").innerHTML = html;
  document.getElementById("modalUndangan").style.display = "flex";
}

function printUndangan() {
  window.print();
}

function closeModalUndangan() {
  document.getElementById("modalUndangan").style.display = "none";
}

function cetakKK(noKK) {
  // 🔥 ambil data dari global
  const anggota = (window.dataTervalidasiGlobal || []).filter(
    (d) => String(d["NO KK"]).trim() === String(noKK).trim(),
  );

  // ❌ kalau tidak ada data
  if (!anggota.length) {
    console.warn("KK tidak ditemukan:", noKK, window.dataTervalidasiGlobal);
    alert("Data KK tidak ditemukan");
    return;
  }

  // 🔥 generate row tabel
  let rows = "";

  anggota.forEach((a, i) => {
    rows += `
      <tr>
        <td>${i + 1}</td>
        <td>${a["Nama Lengkap"] || "-"}</td>
        <td>${a["NIK"] || "-"}</td>
        <td>${a["Jenis Kelamin"] || "-"}</td>
      </tr>
    `;
  });

  // 🔥 HTML SURAT
  const html = `
  <div class="surat">

    <!-- WATERMARK -->
    <div class="wm">PILKADES</div>

    <!-- HEADER -->
    <div class="header">
      <img class="logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Coat_of_arms_of_Indonesia_Garuda_Pancasila.svg/512px-Coat_of_arms_of_Indonesia_Garuda_Pancasila.svg.png"/>
      
      <div class="header-text">
        <h2>PEMERINTAH DESA</h2>
        <h3>DESA ANDA</h3>
        <p>Kecamatan XXX • Kabupaten XXX</p>
      </div>
    </div>

    <div class="line"></div>

    <p style="text-align:center; font-size:12px;">
    Nomor : 001/UND/PILKADES/2026
    </p>

    <h3 class="judul">SURAT UNDANGAN PILKADES</h3>

    <!-- PEMBUKA -->
    <p style="text-align:justify">
      Berdasarkan pelaksanaan Pemilihan Kepala Desa, bersama ini disampaikan
      daftar anggota keluarga yang terdaftar sebagai pemilih:
    </p>

    <!-- INFO KK -->
    <p>No KK : <b>${noKK}</b></p>
    <p>Jumlah Pemilih : <b>${anggota.length} Orang</b></p>

    <!-- TABEL -->
    <table border="1" style="border-collapse:collapse" width="100%" cellpadding="5">
      <tr>
        <th>No</th>
        <th>Nama</th>
        <th>NIK</th>
        <th>JK</th>
      </tr>

      ${rows}
    </table>

    <!-- TPS -->
    <div class="info-tps">

      <p><b>Tempat Pemungutan Suara (TPS)</b></p>

      <table class="table">
        <tr>
          <td>TPS</td>
          <td>: TPS 01</td>
        </tr>
        <tr>
          <td>Lokasi</td>
          <td>: Balai Desa</td>
        </tr>
        <tr>
          <td>Waktu</td>
          <td>: 07.00 - 13.00 WIB</td>
        </tr>
      </table>

      <p style="margin-top:4px">
        * Harap membawa undangan ini saat hadir ke TPS
      </p>

      <p style="margin-top:4px">
        Demikian undangan ini disampaikan untuk dipergunakan sebagaimana mestinya.
      </p>

    </div>

    <!-- TTD -->
    <div class="ttd">
      <p>Desa Anda, ${new Date().toLocaleDateString()}</p>
      <p>Panitia Pemilihan</p>

      <br><br><br>

      <p><b>(_____________________)</b></p>
    </div>

  </div>
  `;

  // 🔥 render ke modal
  document.getElementById("printArea").innerHTML = html;
  document.getElementById("modalUndangan").style.display = "flex";
}

function printSemuaKK() {
  const data = window.dataTervalidasiGlobal || [];

  if (!data.length) {
    alert("Data kosong");
    return;
  }

  // 🔥 GROUP BY KK
  const group = {};

  data.forEach((d) => {
    const kk = String(d["NO KK"]).trim();
    if (!group[kk]) group[kk] = [];
    group[kk].push(d);
  });

  let allHTML = "";

  Object.keys(group).forEach((kk, index) => {
    const anggota = group[kk];

    let rows = "";

    anggota.forEach((a, i) => {
      rows += `
        <tr>
          <td>${i + 1}</td>
          <td>${a["Nama Lengkap"] || "-"}</td>
          <td>${a["NIK"] || "-"}</td>
          <td>${a["Jenis Kelamin"] || "-"}</td>
        </tr>
      `;
    });

    const html = `
    <div class="surat page-break">

      <div class="wm">PILKADES</div>

      <div class="header">
        <img class="logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Coat_of_arms_of_Indonesia_Garuda_Pancasila.svg/512px-Coat_of_arms_of_Indonesia_Garuda_Pancasila.svg.png"/>
        
        <div class="header-text">
          <h2>PEMERINTAH DESA</h2>
          <h3>DESA ANDA</h3>
          <p>Kecamatan XXX • Kabupaten XXX</p>
        </div>
      </div>

      <div class="line"></div>

      <p style="text-align:center; font-size:12px;">
        Nomor : 001/UND/PILKADES/2026
      </p>

      <h3 class="judul">DAFTAR PEMILIH DALAM 1 KARTU KELUARGA</h3>

      <p style="text-align:justify">
        Berdasarkan pelaksanaan Pemilihan Kepala Desa, bersama ini disampaikan
        daftar anggota keluarga yang terdaftar sebagai pemilih:
      </p>

      <p>No KK : <b>${kk}</b></p>
      <p>Jumlah Pemilih : <b>${anggota.length} Orang</b></p>

      <table border="1" style="border-collapse:collapse" width="100%" cellpadding="5">
        <tr>
          <th>No</th>
          <th>Nama</th>
          <th>NIK</th>
          <th>JK</th>
        </tr>
        ${rows}
      </table>

      <div class="info-tps">
        <p><b>Tempat Pemungutan Suara (TPS)</b></p>

        <table class="table">
          <tr><td>TPS</td><td>: TPS 01</td></tr>
          <tr><td>Lokasi</td><td>: Balai Desa</td></tr>
          <tr><td>Waktu</td><td>: 07.00 - 13.00 WIB</td></tr>
        </table>

        <p style="margin-top:4px">
          * Harap membawa undangan ini saat hadir ke TPS
        </p>

        <p style="margin-top:4px">
          Demikian undangan ini disampaikan untuk dipergunakan sebagaimana mestinya.
        </p>
      </div>

      <div class="ttd">
        <p>Desa Anda, ${new Date().toLocaleDateString("id-ID")}</p>
        <p>Panitia Pemilihan</p>

        <br><br><br>

        <p><b>(_____________________)</b></p>
      </div>

    </div>
    `;

    allHTML += html;
  });

  // 🔥 render semua ke modal
  document.getElementById("printArea").innerHTML = allHTML;
  document.getElementById("modalUndangan").style.display = "flex";
}

function generatePDFDrive(data) {
  API.generatePDF(data, (res) => {
    if (res.url) {
      window.open(res.url, "_blank");
    }
  });
}

function generatePDFKK(noKK, btn) {
  const anggota = (window.dataTervalidasiGlobal || []).filter(
    (d) => String(d["NO KK"]).trim() === String(noKK).trim(),
  );

  if (!anggota.length) {
    toastError("Data KK tidak ditemukan");
    return;
  }

  showLoading();

  apiPost("generatePDFKK", {
    noKK: noKK,
    anggota: anggota,
  })
    .then((res) => {
      hideLoading();

      if (res.status) {
        toastSuccess("PDF KK berhasil dibuat 🎉");

        // 🔥 buka pdf
        window.open(res.url, "_blank");

        // =========================
        // 🔥 UPDATE DATA GLOBAL (FULL)
        // =========================
        window.dataTervalidasiGlobal.forEach((d) => {
          if (String(d["NO KK"]) === String(noKK)) {
            d.urlPDF = res.url;
          }
        });

        // =========================
        // 🔥 GANTI TOMBOL LANGSUNG (TIDAK NIMPAH)
        // =========================
        btn.outerHTML = `
        <button class="btn-pdf-link" onclick="openModalPDF('${res.url}')">
            📎 PDF
        </button>
        `;
      } else {
        toastError(res.message || "Gagal membuat PDF");
      }
    })
    .catch((err) => {
      hideLoading();
      console.error(err);
      toastError("Error server");
    });
}

function openModalPDF(url) {
  document.getElementById("iframePDF").src = url;
  document.getElementById("modalPDF").style.display = "block";
}

function closeModalPDF() {
  document.getElementById("modalPDF").style.display = "none";
  document.getElementById("iframePDF").src = "";
}
