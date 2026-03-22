let currentNIK = null;
let filterStatus = "SEMUA";
let dataValidasiGlobal = [];

function loadValidasi() {
  showLoading();

  apiGet("getValidasi")
    .then((res) => {
      hideLoading();

      dataValidasiGlobal = res || [];

      renderValidasi(dataValidasiGlobal);
    })
    .catch((err) => {
      hideLoading();
      console.error(err);
      toastError("Gagal load data validasi");
    });
}

function setFilter(status, btn) {
  filterStatus = status;

  /* aktifkan tombol */

  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));

  btn.classList.add("active");

  /* filter data */

  let data = dataValidasiGlobal;

  if (status === "BELUM") {
    data = data.filter((d) => d["Status"] !== "Sudah Coklit");
  }

  if (status === "SUDAH") {
    data = data.filter((d) => d["Status"] === "Sudah Coklit");
  }

  renderValidasi(data);
  searchValidasi();
}

function searchValidasi() {
  const keyword = document.getElementById("searchValidasi").value.toLowerCase();

  let data = dataValidasiGlobal;

  /* filter status dulu */

  if (filterStatus === "BELUM") {
    data = data.filter((d) => d["Status"] !== "Sudah Coklit");
  }

  if (filterStatus === "SUDAH") {
    data = data.filter((d) => d["Status"] === "Sudah Coklit");
  }

  /* search nama atau nik */

  data = data.filter(
    (d) =>
      String(d["Nama Lengkap"]).toLowerCase().includes(keyword) ||
      String(d["NIK"]).toLowerCase().includes(keyword),
  );

  renderValidasi(data);
}

function renderValidasi(data) {
  const box = document.getElementById("validasiList");
  if (!box) return;

  box.innerHTML = "";

  /* GROUP DATA PER KK */

  let group = {};

  data.forEach((w) => {
    const kk = w["NO KK"];

    if (!group[kk]) {
      group[kk] = [];
    }

    group[kk].push(w);
  });

  /* RENDER PER KK */

  Object.keys(group).forEach((kk) => {
    const anggota = group[kk];

    const total = anggota.length;
    const selesai = anggota.filter(
      (a) => a["Status"] === "Sudah Coklit",
    ).length;
    const persen = total ? (selesai / total) * 100 : 0;

    const card = document.createElement("div");
    card.className = "kk-group";

    card.innerHTML = `
<div class="kk-header">

<div>
<div class="kk-title">🏠 No KK : ${kk}</div>
<div class="kk-progress">Progress Coklit : ${selesai}/${total}</div>

<div class="progress-bar">
<div class="progress-fill" style="width:${persen}%"></div>
</div>

</div>

</div>
`;

    anggota.forEach((a) => {
      const row = document.createElement("div");
      row.className = "anggota-item";

      row.innerHTML = `

<div class="anggota-info">

<div class="anggota-name">
${a["Nama Lengkap"]}
</div>

<div>
NIK : ${a["NIK"]}
</div>

<div>
📍 ${a["Tempat Lahir"]} • 🎂 ${a["Tanggal Lahir"]}
</div>

${
  a["Status"] === "Sudah Coklit"
    ? `<span class="badge-selesai">✔ Sudah Coklit</span>`
    : a["Status"] === "Tersaring"
      ? `<span class="badge-tersaring">⚠ Tersaring</span>`
      : `<span class="badge-belum">Belum Coklit</span>`
}

${
  a["Keterangan"]
    ? `
<div class="ket-validasi">
📝 ${a["Keterangan"]}
</div>
`
    : ""
}

</div>

<div>

${
  a["Status"] === "Sudah Coklit"
    ? `<span class="badge-selesai">✔ Sudah Coklit</span>`
    : `<button class="btn-coklit"
        data-item='${JSON.stringify(a)}'
        onclick="openCoklit(this)">
        ✔ Coklit
       </button>`
}

</div>
`;

      card.appendChild(row);
    });

    box.appendChild(card);
  });
}

function openCoklit(el) {
  document.getElementById("btnSimpan").disabled = true;

  const data = JSON.parse(el.getAttribute("data-item"));
  currentNIK = data["NIK"];

  const detail = document.getElementById("detailPemilih");

  detail.innerHTML = `

<label style="font-size:12px;color:#64748b;">
✔ Centang jika data sudah sesuai
</label>

<div class="form-grid">

<div>
<label>NIK</label>
<div class="field-check">
<input type="checkbox" class="chk">
<input id="f_nik" value="${data["NIK"]}" readonly>
</div>
</div>

<div>
<label>Nama</label>
<div class="field-check">
<input type="checkbox" class="chk">
<input id="f_nama" value="${data["Nama Lengkap"]}">
</div>
</div>

<div>
<label>Tanggal Lahir</label>
<div class="field-check">
<input type="checkbox" class="chk">
<input type="date" id="f_tgl" value="${formatDateInput(data["Tanggal Lahir"])}">
</div>
</div>

<div>
<label>Status Coklit</label>
<div class="field-check">
<input type="checkbox" class="chk">
<select id="statusCoklit">
  <option value="">Pilih Status</option>
  <option value="Sudah Coklit">Pemilih Sesuai</option>
  <option value="Tersaring">Pemilih Tersaring</option>
</select>
</div>
</div>

</div>
`;

  document.getElementById("statusCoklit").value = data["Status"] || "";

  document.getElementById("modalCoklit").style.display = "flex";

  document.querySelectorAll(".chk").forEach((c) => {
    c.onchange = cekValidasiForm;
  });

  document.getElementById("statusCoklit").onchange = cekValidasiForm;
}

function formatDateInput(val) {
  if (!val) return "";

  const parts = val.split("-");
  if (parts.length !== 3) return "";

  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function cekValidasiForm() {
  const checks = document.querySelectorAll(".chk");
  const status = document.getElementById("statusCoklit").value;
  const btn = document.getElementById("btnSimpan");

  let allChecked = true;

  checks.forEach((c) => {
    if (!c.checked) allChecked = false;
  });

  if (allChecked && status) {
    btn.disabled = false;
  } else {
    btn.disabled = true;
  }
}

function closeModalCoklit() {
  document.getElementById("modalCoklit").style.display = "none";
}

function toggleKeterangan() {
  const status = document.getElementById("statusCoklit").value;

  const ket = document.getElementById("ketCoklit");

  if (status === "Tersaring") {
    ket.style.display = "block";
  } else {
    ket.style.display = "none";
  }
}

function simpanCoklit() {
  const status = document.getElementById("statusCoklit").value;
  const ket = document.getElementById("ketCoklit").value;

  const userSession = JSON.parse(localStorage.getItem("userSession"));
  const userName = userSession?.username || "Admin";

  const data = {
    nik: currentNIK,
    nokk: document.getElementById("f_nokk").value,
    nama: document.getElementById("f_nama").value,
    hubungan: document.getElementById("f_hubungan").value,
    jk: document.getElementById("f_jk").value,
    tempat: document.getElementById("f_tempat").value,
    tanggal: document.getElementById("f_tgl").value,
    agama: document.getElementById("f_agama").value,
    pendidikan: document.getElementById("f_pendidikan").value,
    pekerjaan: document.getElementById("f_pekerjaan").value,
    kawin: document.getElementById("f_kawin").value,
    warga: document.getElementById("f_warga").value,
    paspor: document.getElementById("f_paspor").value,
    kitap: document.getElementById("f_kitap").value,
    ayah: document.getElementById("f_ayah").value,
    ibu: document.getElementById("f_ibu").value,
    status: status,
    keterangan: ket,
    user: userName,
  };

  showLoading();

  apiPost("updateFullData", data)
    .then((res) => {
      hideLoading();

      if (!res.success) {
        toastError(res.message);
        return;
      }

      closeModalCoklit();
      loadValidasi();
    })
    .catch((err) => {
      hideLoading();
      console.error(err);
      toastError("Server error");
    });
}
