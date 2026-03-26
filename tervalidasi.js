let currentPage = 1;
const rowsPerPage = 10;
const maxPageShow = 5;

function loadTervalidasi() {
  showLoading();

  apiGet("getTervalidasi")
    .then((data) => {
      hideLoading();

      // 🔥 pastikan selalu array
      if (!Array.isArray(data)) {
        console.warn("Data bukan array:", data);
        data = [];
      }

      // 🔥 simpan global (buat search & fitur lain)
      window.dataTervalidasiGlobal = data;

      // 🔥 render 1 pintu (table + card)
      renderTervalidasi(data);
    })
    .catch((err) => {
      hideLoading();
      console.error("Gagal load tervalidasi:", err);

      // 🔥 fallback UI kalau error
      const tbody = document.getElementById("tbodyTervalidasi");
      const cardContainer = document.getElementById("cardTervalidasi");

      if (tbody) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" style="text-align:center;color:#777">
              Gagal load data
            </td>
          </tr>`;
      }

      if (cardContainer) {
        cardContainer.innerHTML = `
          <div style="text-align:center;color:#777;padding:20px">
            Gagal load data
          </div>`;
      }

      toastError("Gagal load data tervalidasi");
    });
}

let searchTimer;

function searchTervalidasi() {
  currentPage = 1; // 🔥 reset halaman

  const keyword = document
    .getElementById("searchTervalidasi")
    .value.toLowerCase()
    .trim();

  const data = window.dataTervalidasiGlobal || [];

  const filtered = data.filter((a) => {
    return (
      String(a["Nama Lengkap"] || "")
        .toLowerCase()
        .includes(keyword) ||
      String(a["NIK"] || "")
        .toLowerCase()
        .includes(keyword) ||
      String(a["NO KK"] || "")
        .toLowerCase()
        .includes(keyword)
    );
  });

  renderTervalidasi(filtered);
}

function renderTervalidasi(data) {
  const tbody = document.getElementById("tbodyTervalidasi");
  const cardContainer = document.getElementById("cardTervalidasi");

  if (!tbody || !cardContainer) return;

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

  // 🔥 PAGINATION CORE
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedData = data.slice(start, end);

  let htmlTable = "";
  let htmlCard = "";

  paginatedData.forEach((a) => {
    const noHP = a["No HP"] || "";
    const urlPDF = a["urlPDF"] || "";
    const isKepala = a["Hubungan dlm Klg"] === "Kepala Keluarga";
    const dataStr = encodeURIComponent(JSON.stringify(a));

    const pdfButton = urlPDF
      ? `<button class="btn btn-pdf-ready" onclick="openModalPDF('${urlPDF}')">📎 PDF</button>`
      : `<button class="btn btn-pdf-generate" onclick="generatePDFKK('${a["NO KK"]}', this)">☁️ PDF</button>`;

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

  // 🔥 render pagination button
  renderPagination(data.length);
}

function renderPagination(totalData) {
  const totalPages = Math.ceil(totalData / rowsPerPage);
  const container = document.getElementById("pagination");

  if (!container) return;

  let html = "";

  // 🔥 PREV
  html += `
    <button 
      class="page-btn"
      ${currentPage === 1 ? "disabled" : ""}
      onclick="goPage(${currentPage - 1})">
      ⬅ Prev
    </button>
  `;

  // 🔥 HITUNG RANGE PAGE
  let startPage = Math.max(1, currentPage - Math.floor(maxPageShow / 2));
  let endPage = startPage + maxPageShow - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxPageShow + 1);
  }

  // 🔥 PAGE NUMBER
  for (let i = startPage; i <= endPage; i++) {
    html += `
      <button 
        class="page-btn ${i === currentPage ? "active" : ""}"
        onclick="goPage(${i})">
        ${i}
      </button>
    `;
  }

  // 🔥 NEXT
  html += `
    <button 
      class="page-btn"
      ${currentPage === totalPages ? "disabled" : ""}
      onclick="goPage(${currentPage + 1})">
      Next ➡
    </button>
  `;

  // 🔥 INFO
  html += `
    <div class="page-info">
      Halaman ${currentPage} dari ${totalPages}
    </div>
  `;

  container.innerHTML = html;
}

function goPage(page) {
  const data = window.dataTervalidasiGlobal || [];

  const keyword =
    document.getElementById("searchTervalidasi")?.value.toLowerCase().trim() ||
    "";

  const filtered = data.filter((a) => {
    return (
      String(a["Nama Lengkap"] || "")
        .toLowerCase()
        .includes(keyword) ||
      String(a["NIK"] || "")
        .toLowerCase()
        .includes(keyword) ||
      String(a["NO KK"] || "")
        .toLowerCase()
        .includes(keyword)
    );
  });

  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  // 🔥 VALIDASI BATAS
  if (page < 1) page = 1;
  if (page > totalPages) page = totalPages;

  currentPage = page;

  renderTervalidasi(filtered);
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
