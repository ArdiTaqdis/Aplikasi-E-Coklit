function loadTervalidasi() {
  showLoading();

  apiGet("getTervalidasi")
    .then((data) => {
      hideLoading();

      window.dataTervalidasiGlobal = data;

      const tbody = document.getElementById("tbodyTervalidasi");
      const cardContainer = document.getElementById("cardTervalidasi");

      if (!data || !data.length) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" style="text-align:center;color:#777">
              Tidak ada data tervalidasi
            </td>
          </tr>`;

        cardContainer.innerHTML = `
          <div style="text-align:center;color:#777;padding:20px">
            Tidak ada data tervalidasi
          </div>`;
        return;
      }

      let htmlTable = "";
      let htmlCard = "";

      data.forEach((a) => {
        const noHP = a["No HP"] || "";
        const urlPDF = a["urlPDF"] || "";
        const isKepala = a["Hubungan dlm Klg"] === "Kepala Keluarga";

        const dataStr = encodeURIComponent(JSON.stringify(a));

        const pdfButton = urlPDF
          ? `<button class="btn btn-pdf-ready"
                onclick="openModalPDF('${urlPDF}')">
                📎 PDF
             </button>`
          : `<button class="btn btn-pdf-generate"
                onclick="generatePDFKK('${a["NO KK"]}', this)">
                ☁️ PDF KK
             </button>`;

        // ================= TABLE =================
        htmlTable += `
        <tr>
          <td>${a["NO KK"]}</td>
          <td>${a["NIK"]}</td>
          <td>${a["Nama Lengkap"]}</td>
          <td>${a["Hubungan dlm Klg"]}</td>
          <td>${a["Jenis Kelamin"]}</td>
          <td>${noHP || "-"}</td>
          <td>
            <span class="badge-selesai">✔ Sudah Coklit</span>
          </td>
          <td>

            <button class="btn btn-detail"
              data-item="${dataStr}"
              onclick="detailWarga(this)">
              Detail
            </button>

            ${pdfButton}

            <button class="btn btn-print"
              onclick="cetakKK('${a["NO KK"]}')">
              📄 Cetak
            </button>

            ${
              isKepala
                ? `<button class="btn btn-wa"
                      onclick="kirimWAPDF('${noHP}','${urlPDF}','${a["NO KK"]}')">
                      💬 WA
                   </button>`
                : ""
            }

          </td>
        </tr>`;

        // ================= CARD =================
        htmlCard += `
        <div class="card-item">

          <div class="card-header">
            ${a["Nama Lengkap"]}
          </div>

          <div class="card-info">
            <b>NIK:</b> ${a["NIK"]}<br>
            <b>KK:</b> ${a["NO KK"]}<br>
            ${a["Hubungan dlm Klg"]} • ${a["Jenis Kelamin"]}<br>
            <b>HP:</b> ${noHP || "-"}
          </div>

          <div class="card-actions">

            <button class="btn btn-detail"
              data-item="${dataStr}"
              onclick="detailWarga(this)">Detail</button>

            ${pdfButton}

            <button class="btn btn-print"
              onclick="cetakKK('${a["NO KK"]}')">Cetak</button>

            ${
              isKepala
                ? `<button class="btn btn-wa"
                      onclick="kirimWAPDF('${noHP}','${urlPDF}','${a["NO KK"]}')">WA</button>`
                : ""
            }

          </div>

        </div>`;
      });

      // 🔥 render sekali saja
      tbody.innerHTML = htmlTable;
      cardContainer.innerHTML = htmlCard;
    })
    .catch((err) => {
      hideLoading();
      console.error("Gagal load tervalidasi:", err);
      toastError("Gagal load data tervalidasi");
    });
  renderTervalidasi(data);
}

function detailWarga(el) {
  let a = {};

  try {
    a = JSON.parse(decodeURIComponent(el.getAttribute("data-item")));
  } catch (e) {
    console.error("Parse error:", e);
    return;
  }

  const body = document.getElementById("detailBody");

  body.innerHTML = `
  <div class="card">

    <b>Alamat</b><br>
    ${a["Alamat"] || "-"}<br>

    RT ${a["RT"] || "-"} / RW ${a["RW"] || "-"}<br>
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

function searchTervalidasi() {
  const keyword = document
    .getElementById("searchTervalidasi")
    .value.toLowerCase();

  const data = window.dataTervalidasiGlobal || [];

  const filtered = data.filter((a) => {
    return (
      (a["Nama Lengkap"] || "").toLowerCase().includes(keyword) ||
      (a["NIK"] || "").toLowerCase().includes(keyword) ||
      (a["NO KK"] || "").toLowerCase().includes(keyword)
    );
  });

  renderTervalidasi(filtered);
}

function renderTervalidasi(data) {
  const tbody = document.getElementById("tbodyTervalidasi");
  const cardContainer = document.getElementById("cardTervalidasi");

  if (!data.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center;color:#777">
          Data tidak ditemukan
        </td>
      </tr>`;

    cardContainer.innerHTML = `
      <div style="text-align:center;color:#777;padding:20px">
        Data tidak ditemukan
      </div>`;
    return;
  }

  let htmlTable = "";
  let htmlCard = "";

  data.forEach((a) => {
    const noHP = a["No HP"] || "";
    const urlPDF = a["urlPDF"] || "";
    const isKepala = a["Hubungan dlm Klg"] === "Kepala Keluarga";
    const dataStr = encodeURIComponent(JSON.stringify(a));

    const pdfButton = urlPDF
      ? `<button class="btn btn-pdf-ready" onclick="openModalPDF('${urlPDF}')">📎 PDF</button>`
      : `<button class="btn btn-pdf-generate" onclick="generatePDFKK('${a["NO KK"]}', this)">☁️ PDF</button>`;

    // TABLE
    htmlTable += `
      <tr>
        <td>${a["NO KK"]}</td>
        <td>${a["NIK"]}</td>
        <td>${a["Nama Lengkap"]}</td>
        <td>${a["Hubungan dlm Klg"]}</td>
        <td>${a["Jenis Kelamin"]}</td>
        <td>${noHP || "-"}</td>
        <td><span class="badge-selesai">✔ Sudah Coklit</span></td>
        <td>
          <button class="btn btn-detail" data-item="${dataStr}" onclick="detailWarga(this)">Detail</button>
          ${pdfButton}
          <button class="btn btn-print" onclick="cetakKK('${a["NO KK"]}')">Cetak</button>
          ${
            isKepala
              ? `<button class="btn btn-wa" onclick="kirimWAPDF('${noHP}','${urlPDF}','${a["NO KK"]}')">WA</button>`
              : ""
          }
        </td>
      </tr>`;

    // CARD
    htmlCard += `
      <div class="card-item">
        <div class="card-header">${a["Nama Lengkap"]}</div>
        <div class="card-info">
          NIK: ${a["NIK"]}<br>
          KK: ${a["NO KK"]}<br>
          ${a["Hubungan dlm Klg"]} • ${a["Jenis Kelamin"]}<br>
          HP: ${noHP || "-"}
        </div>
        <div class="card-actions">
          <button class="btn btn-detail" data-item="${dataStr}" onclick="detailWarga(this)">Detail</button>
          ${pdfButton}
          <button class="btn btn-print" onclick="cetakKK('${a["NO KK"]}')">Cetak</button>
          ${
            isKepala
              ? `<button class="btn btn-wa" onclick="kirimWAPDF('${noHP}','${urlPDF}','${a["NO KK"]}')">WA</button>`
              : ""
          }
        </div>
      </div>`;
  });

  tbody.innerHTML = htmlTable;
  cardContainer.innerHTML = htmlCard;
}
