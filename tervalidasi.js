function loadTervalidasi() {
  showLoading();

  apiGet("getTervalidasi")
    .then((data) => {
      hideLoading();

      const tbody = document.getElementById("tbodyTervalidasi");
      tbody.innerHTML = "";

      if (!data || !data.length) {
        tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center;color:#777">
            Tidak ada data tervalidasi
          </td>
        </tr>`;
        return;
      }

      data.forEach((a) => {
        tbody.innerHTML += `
        <tr>
          <td>${a["NO KK"]}</td>
          <td>${a["NIK"]}</td>
          <td>${a["Nama Lengkap"]}</td>
          <td>${a["Hubungan dlm Klg"]}</td>
          <td>${a["Jenis Kelamin"]}</td>
          <td>
            <span class="badge-selesai">✔ Sudah Coklit</span>
          </td>
          <td>
            <button class="btn"
              data-item='${JSON.stringify(a).replace(/'/g, "&apos;")}'
              onclick="detailWarga(this)">
              Detail
            </button>

            <button onclick='cetakUndangan(${JSON.stringify(row)})'>
              🖨 Cetak
            </button>
          </td>
        </tr>`;
      });
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
