function loadTervalidasi() {
  showLoading();

  apiGet("getTervalidasi")
    .then((data) => {
      hideLoading();

      window.dataTervalidasiGlobal = data;

      const tbody = document.getElementById("tbodyTervalidasi");

      if (!data || !data.length) {
        tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center;color:#777">
            Tidak ada data tervalidasi
          </td>
        </tr>`;
        return;
      }

      let html = ""; // 🔥 pindah ke luar

      data.forEach((a) => {
        const noHP = a["No HP"] || "";
        const urlPDF = a["urlPDF"] || "";

        const pdfButton = urlPDF
          ? `<button class="btn-pdf-link" onclick="openModalPDF('${urlPDF}')">📎 PDF</button>`
          : `<button onclick="generatePDFKK('${a["NO KK"]}', this)">☁️ PDF KK</button>`;

        const dataStr = encodeURIComponent(JSON.stringify(a));

        html += `
        <tr>
          <td>${a["NO KK"]}</td>
          <td>${a["NIK"]}</td>
          <td>${a["Nama Lengkap"]}</td>
          <td>${a["Hubungan dlm Klg"]}</td>
          <td>${a["Jenis Kelamin"]}</td>
          <td>${noHP || "-"}</td>
          <td><span class="badge-selesai">✔ Sudah Coklit</span></td>
          <td>

            <button class="btn"
              data-item="${dataStr}"
              onclick="detailWarga(this)">
              Detail
            </button>        
         

            <button onclick="cetakKK('${a["NO KK"]}')">
              📄 Cetak
            </button>

            <button class="btn-wa"
              onclick="kirimWAPDF('${noHP}','${urlPDF}','${a["NO KK"]}')">
              💬 WA
            </button>

          </td>
        </tr>`;
      });

      tbody.innerHTML = html; // 🔥 sekali saja
    })
    .catch((err) => {
      hideLoading();
      console.error("Gagal load tervalidasi:", err);
      toastError("Gagal load data tervalidasi");
    });
}

function detailWarga(el) {
  const a = JSON.parse(el.getAttribute("data-item"));

  const body = document.getElementById("detailBody");

  body.innerHTML = `
  <div class="card">

  <b>Alamat</b><br>
  ${a["Alamat"] || "-"}<br>

  RT ${a["RT"] || "-"} 
  / RW ${a["RW"] || "-"}<br>

  ${a["Desa_Kelurahan"] || "-"}

  </div>

  <div class="summary-list">

  <div class="summary-item">
  <span class="label">NIK</span>
  <span class="value">${a["NIK"]}</span>
  </div>

  <div class="summary-item">
  <span class="label">Nama</span>
  <span class="value">${a["Nama Lengkap"]}</span>
  </div>

  <div class="summary-item">
  <span class="label">No KK</span>
  <span class="value">${a["NO KK"]}</span>
  </div>

  <div class="summary-item">
  <span class="label">Hubungan</span>
  <span class="value">${a["Hubungan dlm Klg"]}</span>
  </div>

  <div class="summary-item">
  <span class="label">Jenis Kelamin</span>
  <span class="value">${a["Jenis Kelamin"]}</span>
  </div>

  <div class="summary-item">
  <span class="label">Tempat Lahir</span>
  <span class="value">${a["Tempat Lahir"]}</span>
  </div>

  <div class="summary-item">
  <span class="label">Tanggal Lahir</span>
  <span class="value">${a["Tanggal Lahir"]}</span>
  </div>

  <div class="summary-item">
  <span class="label">Agama</span>
  <span class="value">${a["Agama"]}</span>
  </div>

  <div class="summary-item">
  <span class="label">Pendidikan</span>
  <span class="value">${a["Pendidikan"]}</span>
  </div>

  <div class="summary-item">
  <span class="label">Pekerjaan</span>
  <span class="value">${a["Jenis Pekerjaan"]}</span>
  </div>

  <div class="summary-item">
  <span class="label">Status</span>
  <span class="value">
  <span class="badge-selesai">✔ Sudah Coklit</span>
  </span>
  </div>

  </div>
  `;

  document.getElementById("modalDetail").style.display = "flex";
}

function closeModalDetail() {
  document.getElementById("modalDetail").style.display = "none";
}
