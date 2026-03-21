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
  const data = JSON.parse(el.getAttribute("data-item"));
  currentNIK = data["NIK"];

  const detail = document.getElementById("detailPemilih");

  detail.innerHTML = `

<div class="form-grid">

<div>
<label>NIK</label>
<input id="f_nik" value="${data["NIK"]}" readonly>
</div>

<div>
<label>Nama</label>
<input id="f_nama" value="${data["Nama Lengkap"]}">
</div>

<div>
<label>Tempat Lahir</label>
<input id="f_tempat" value="${data["Tempat Lahir"]}">
</div>

<div>
<label>Tanggal Lahir</label>
<input id="f_tgl" value="${data["Tanggal Lahir"]}">
</div>

<div>
<label>Jenis Kelamin</label>
<select id="f_jk">
  <option ${data["Jenis Kelamin"] == "Laki-laki" ? "selected" : ""}>Laki-laki</option>
  <option ${data["Jenis Kelamin"] == "Perempuan" ? "selected" : ""}>Perempuan</option>
</select>
</div>

<div>
<label>Agama</label>
<input id="f_agama" value="${data["Agama"]}">
</div>

<div>
<label>Pekerjaan</label>
<input id="f_pekerjaan" value="${data["Jenis Pekerjaan"]}">
</div>

<div>
<label>Status Perkawinan</label>
<input id="f_kawin" value="${data["Status Perkawinan"]}">
</div>

</div>
`;

  // set status coklit
  document.getElementById("statusCoklit").value = data["Status"] || "";
  document.getElementById("ketCoklit").value = data["Keterangan"] || "";

  toggleKeterangan();

  document.getElementById("modalCoklit").style.display = "flex";
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
    nama: document.getElementById("f_nama").value,
    tempat: document.getElementById("f_tempat").value,
    tanggal: document.getElementById("f_tgl").value,
    jk: document.getElementById("f_jk").value,
    agama: document.getElementById("f_agama").value,
    pekerjaan: document.getElementById("f_pekerjaan").value,
    kawin: document.getElementById("f_kawin").value,
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
