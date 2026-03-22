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
<label>No KK</label>
<input id="f_nokk" value="${data["NO KK"]}" readonly>
</div>

<div>
<label>NIK</label>
<input id="f_nik" value="${data["NIK"]}" readonly>
</div>

<div>
<label>Nama Lengkap</label>
<input id="f_nama" value="${data["Nama Lengkap"]}">
</div>

<div>
<label>Hubungan</label>
<input id="f_hubungan" value="${data["Hubungan dlm Klg"]}">
</div>

<div>
<label>Jenis Kelamin</label>
<select id="f_jk">
  <option ${data["Jenis Kelamin"] == "Laki-laki" ? "selected" : ""}>Laki-laki</option>
  <option ${data["Jenis Kelamin"] == "Perempuan" ? "selected" : ""}>Perempuan</option>
</select>
</div>

<div>
<label>Tempat Lahir</label>
<input id="f_tempat" value="${data["Tempat Lahir"]}">
</div>

<div>
<label>Tanggal Lahir</label>
<input type="date" id="f_tgl" value="${formatDateInput(data["Tanggal Lahir"])}">
</div>

<div>
<label>Agama</label>
<input id="f_agama" value="${data["Agama"]}">
</div>

<div>
<label>Pendidikan</label>
<input id="f_pendidikan" value="${data["Pendidikan"]}">
</div>

<div>
<label>Pekerjaan</label>
<input id="f_pekerjaan" value="${data["Jenis Pekerjaan"]}">
</div>

<div>
<label>Status Perkawinan</label>
<select id="f_kawin">
  <option ${data["Status Perkawinan"] == "Belum Kawin" ? "selected" : ""}>Belum Kawin</option>
  <option ${data["Status Perkawinan"] == "Kawin" ? "selected" : ""}>Kawin</option>
  <option ${data["Status Perkawinan"] == "Cerai Hidup" ? "selected" : ""}>Cerai Hidup</option>
  <option ${data["Status Perkawinan"] == "Cerai Mati" ? "selected" : ""}>Cerai Mati</option>
</select>
</div>

<div>
<label>Kewarganegaraan</label>
<input id="f_warga" value="${data["Kewarganegaraan"]}">
</div>

<div>
<label>No Paspor</label>
<input id="f_paspor" value="${data["No Paspor"]}">
</div>

<div>
<label>No KITAP/KITAS</label>
<input id="f_kitap" value="${data["No KITAP_KITAS"]}">
</div>

<div>
<label>Ayah Kandung</label>
<input id="f_ayah" value="${data["Ayah Kandung"]}">
</div>

<div>
<label>Ibu Kandung</label>
<input id="f_ibu" value="${data["Ibu Kandung"]}">
</div>

<!-- 🔥 TAMBAHAN BARU -->
<div style="grid-column: span 2;">
<label>📞 No HP (Kepala Keluarga)</label>
<input id="f_nohp" placeholder="08xxxxxxxxxx">
</div>

</div>
`;

  // set status coklit
  document.getElementById("statusCoklit").value = data["Status"] || "";
  document.getElementById("ketCoklit").value = data["Keterangan"] || "";

  toggleKeterangan();

  document.getElementById("modalCoklit").style.display = "flex";

  // 🔥 LOAD NO HP DARI SHEET KEPALA KELUARGA
  apiGet("getNoHP", { noKK: data["NO KK"] })
    .then((res) => {
      if (res && res.nohp) {
        document.getElementById("f_nohp").value = res.nohp;
      }
    })
    .catch((err) => {
      console.error("Gagal load No HP:", err);
    });
}

function formatDateInput(val) {
  if (!val) return "";

  const parts = val.split("-");
  if (parts.length !== 3) return "";

  return `${parts[2]}-${parts[1]}-${parts[0]}`;
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

  let nohp = document.getElementById("f_nohp").value.trim();

  // 🔥 bersihin selain angka
  nohp = nohp.replace(/\D/g, "");

  // 🔥 validasi format (opsional tapi penting)
  if (nohp && !/^08\d{8,12}$/.test(nohp)) {
    toastError("Nomor HP harus format 08xxxxxxxx");
    return;
  }

  // 🔥 convert ke format WA (62)
  let nohpWA = "";
  if (nohp) {
    nohpWA = nohp.startsWith("0") ? "62" + nohp.slice(1) : nohp;
  }

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

    // 🔥 simpan dua-duanya (opsional tapi bagus)
    nohp: nohp, // asli
    nohp_wa: nohpWA, // format WA
  };

  showLoading();

  apiPost("updateFullData", data)
    .then((res) => {
      hideLoading();

      if (!res.success) {
        toastError(res.message);
        return;
      }

      // 🔥 UX lebih enak
      toastSuccess("Data berhasil disimpan");

      closeModalCoklit();
      loadValidasi();
    })
    .catch((err) => {
      hideLoading();
      console.error(err);
      toastError("Server error");
    });
}
