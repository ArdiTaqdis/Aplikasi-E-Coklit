function cetakUndangan(data) {
  const win = window.open("", "_blank");

  win.document.write(`
  <html>
  <head>
    <title>Undangan Pilkades</title>

    <style>
      body {
        font-family: "Times New Roman", serif;
        margin: 0;
        padding: 40px;
        color: #000;
        position: relative;
      }

      /* 🔥 WATERMARK */
      .watermark {
        position: fixed;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 100px;
        color: rgba(0,0,0,0.05);
        z-index: 0;
        white-space: nowrap;
      }

      /* 🔥 HEADER */
      .header {
        display: flex;
        align-items: center;
        gap: 15px;
        z-index: 2;
        position: relative;
      }

      .logo {
        width: 70px;
      }

      .header-text {
        text-align: center;
        flex: 1;
      }

      .header-text h2 {
        margin: 0;
        font-size: 20px;
      }

      .header-text h3 {
        margin: 2px 0;
        font-size: 18px;
      }

      .header-text p {
        margin: 0;
        font-size: 12px;
      }

      .line {
        border-top: 3px solid black;
        margin: 10px 0 20px;
      }

      /* 🔥 CONTENT */
      .content {
        position: relative;
        z-index: 2;
        font-size: 15px;
        line-height: 1.7;
      }

      .table {
        margin: 10px 0;
      }

      .table td {
        padding: 4px 10px;
        vertical-align: top;
      }

      .judul {
        text-align: center;
        font-weight: bold;
        text-decoration: underline;
        margin: 20px 0;
      }

      /* 🔥 TTD */
      .ttd {
        margin-top: 60px;
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }

      .ttd-box {
        text-align: center;
      }

      @media print {
        body {
          margin: 0;
        }
      }
    </style>
  </head>

  <body>

    <!-- WATERMARK -->
    <div class="watermark">PILKADES</div>

    <!-- HEADER -->
    <div class="header">
      <img class="logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Coat_of_arms_of_Indonesia_Garuda_Pancasila.svg/512px-Coat_of_arms_of_Indonesia_Garuda_Pancasila.svg.png" />

      <div class="header-text">
        <h2>PEMERINTAH DESA</h2>
        <h3>DESA ANDA</h3>
        <p>Kecamatan XXXX, Kabupaten XXXX</p>
      </div>
    </div>

    <div class="line"></div>

    <!-- JUDUL -->
    <div class="judul">
      SURAT UNDANGAN PEMILIHAN KEPALA DESA
    </div>

    <!-- CONTENT -->
    <div class="content">

      <p>Nomor : 001/UND/PILKADES/2026</p>

      <p>Kepada Yth :</p>

      <table class="table">
        <tr>
          <td>Nama</td>
          <td>: ${data["Nama"] || data["Nama Lengkap"]}</td>
        </tr>
        <tr>
          <td>NIK</td>
          <td>: ${data["NIK"]}</td>
        </tr>
        <tr>
          <td>No KK</td>
          <td>: ${data["NO.KK"] || data["NO KK"]}</td>
        </tr>
      </table>

      <p>
        Dengan hormat, <br><br>
        Sehubungan dengan pelaksanaan <b>Pemilihan Kepala Desa</b>,
        kami mengundang Saudara/i untuk hadir dan menggunakan hak pilih pada:
      </p>

      <table class="table">
        <tr>
          <td>Hari / Tanggal</td>
          <td>: Minggu, 10 Mei 2026</td>
        </tr>
        <tr>
          <td>Waktu</td>
          <td>: 07.00 WIB - Selesai</td>
        </tr>
        <tr>
          <td>Tempat</td>
          <td>: TPS Sesuai Undangan</td>
        </tr>
      </table>

      <p>
        Diharapkan kehadiran Saudara/i tepat waktu.
        Atas perhatian dan partisipasinya kami ucapkan terima kasih.
      </p>

    </div>

    <!-- TTD -->
    <div class="ttd">
      <div class="ttd-box">
        <p>Desa Anda, ${new Date().toLocaleDateString()}</p>
        <p>Panitia Pemilihan</p>

        <br><br><br>

        <p><b>(_____________________)</b></p>
      </div>
    </div>

    <script>
      window.print();
    </script>

  </body>
  </html>
  `);

  win.document.close();
}
