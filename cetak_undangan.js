function cetakUndangan(data) {
  const html = `
  <div class="surat">

    <div style="text-align:center">
      <h2>PEMERINTAH DESA</h2>
      <h3>DESA ANDA</h3>
      <hr>
    </div>

    <h3 style="text-align:center;text-decoration:underline">
      SURAT UNDANGAN PILKADES
    </h3>

    <p>Nomor: 001/UND/2026</p>

    <p>Kepada Yth:</p>

    <table>
      <tr><td>Nama</td><td>: ${data["Nama Lengkap"]}</td></tr>
      <tr><td>NIK</td><td>: ${data["NIK"]}</td></tr>
      <tr><td>No KK</td><td>: ${data["NO KK"]}</td></tr>
    </table>

    <p>
      Sehubungan dengan Pemilihan Kepala Desa, kami mengundang
      Saudara/i untuk hadir pada:
    </p>

    <table>
      <tr><td>Hari</td><td>: Minggu</td></tr>
      <tr><td>Tanggal</td><td>: 10 Mei 2026</td></tr>
      <tr><td>Waktu</td><td>: 07.00 WIB</td></tr>
      <tr><td>Tempat</td><td>: TPS</td></tr>
    </table>

    <br><br>

    <div style="text-align:right">
      <p>${new Date().toLocaleDateString()}</p>
      <p>Panitia</p>
      <br><br><br>
      <p>(___________)</p>
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
