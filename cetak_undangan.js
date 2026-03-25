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

    <div class="ttd">
      <p>${new Date().toLocaleDateString()}</p>
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
  const printContent = document.getElementById("printArea").innerHTML;

  const win = window.open("", "", "width=800,height=600");

  win.document.write(`
    <html>
      <head>
        <title>Print</title>
        <style>
          body { font-family: Times New Roman; padding: 40px; }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `);

  win.document.close();
  win.print();
}

function closeModalUndangan() {
  document.getElementById("modalUndangan").style.display = "none";
}

function cetakKK(noKK) {
  const anggota = dataValidasiGlobal.filter((d) => d["NO KK"] === noKK);

  if (!anggota.length) {
    alert("Data KK tidak ditemukan");
    return;
  }

  let rows = "";

  anggota.forEach((a, i) => {
    rows += `
      <tr>
        <td>${i + 1}</td>
        <td>${a["Nama Lengkap"]}</td>
        <td>${a["NIK"]}</td>
        <td>${a["Jenis Kelamin"]}</td>
      </tr>
    `;
  });

  const html = `
  <div class="surat">

    <div class="wm">PILKADES</div>

    <div class="header">
      <img class="logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Coat_of_arms_of_Indonesia_Garuda_Pancasila.svg/512px-Coat_of_arms_of_Indonesia_Garuda_Pancasila.svg.png"/>
      <div class="header-text">
        <h2>PEMERINTAH DESA</h2>
        <h3>DESA ANDA</h3>
      </div>
    </div>

    <div class="line"></div>

    <h3 class="judul">DAFTAR UNDANGAN 1 KARTU KELUARGA</h3>

    <p>No KK : <b>${noKK}</b></p>

    <table border="1" width="100%" cellspacing="0" cellpadding="5">
      <tr>
        <th>No</th>
        <th>Nama</th>
        <th>NIK</th>
        <th>JK</th>
      </tr>

      ${rows}

    </table>

    <div class="ttd">
      <p>${new Date().toLocaleDateString()}</p>
      <p>Panitia</p>
      <br><br><br>
      <p><b>(_____________)</b></p>
    </div>

  </div>
  `;

  document.getElementById("printArea").innerHTML = html;
  document.getElementById("modalUndangan").style.display = "flex";
}
