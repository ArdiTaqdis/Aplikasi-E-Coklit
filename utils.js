/* =========================
HELPER
========================= */

window.$ = (id) => document.getElementById(id);
function safeString(obj) {
  return encodeURIComponent(JSON.stringify(obj));
}

/* =========================
LOADING
========================= */

window.showLoading = () => {
  const el = $("loadingOverlay");
  if (el) el.style.display = "flex";
};

window.hideLoading = () => {
  const el = $("loadingOverlay");
  if (el) el.style.display = "none";
};

/* =========================
TOAST
========================= */

window.toastSuccess = (msg = "Berhasil") => {
  const toast = $("toastSuccess");
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add("show");

  setTimeout(() => toast.classList.remove("show"), 2500);
};

window.toastError = (msg = "Terjadi kesalahan") => {
  const toast = $("toastError");
  if (!toast) return;

  toast.style.background = "#f97316";
  toast.textContent = msg;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    toast.style.background = "";
  }, 2500);
};

/* =========================
SHOW / HIDE
========================= */

window.show = (el) => el && (el.style.display = "block");
window.hide = (el) => el && (el.style.display = "none");

/* =========================
SYNC KK → ANGGOTA
========================= */

/* =====================
 * AUTO SYNC KK → ANGGOTA
 * ===================== */

window.syncKepalaToAnggota = function () {
  const noKK = document.getElementById("kk_no")?.value;
  const nik = document.getElementById("kk_nik")?.value;
  const nama = document.getElementById("kk_nama")?.value;

  const b_noKK = document.getElementById("b_noKK");
  const b_nik = document.getElementById("b_nik");
  const b_nama = document.getElementById("b_nama");

  if (b_noKK) b_noKK.value = noKK || "";
  if (b_nik) b_nik.value = nik || "";
  if (b_nama) b_nama.value = nama || "";

  console.log("SYNC OK:", noKK, nik, nama);
};

/* =========================
RENDER
========================= */

function renderKepalaKeluarga(k) {
  if (!k) return;

  if ($("kk_nama_view"))
    $("kk_nama_view").innerText = k["Nama Kepala Klg"] || "-";
  if ($("kk_alamat_view")) $("kk_alamat_view").innerText = k["Alamat"] || "-";
}

function renderAnggotaKeluarga(list) {
  const tbody = $("tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="17">Tidak ada anggota</td></tr>`;
    return;
  }

  list.forEach((a) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${a["NO KK"] || "-"}</td>
      <td>${a.NIK || "-"}</td>
      <td>${a["Nama Lengkap"] || "-"}</td>
      <td>${a["Hubungan dlm Klg"] || "-"}</td>
      <td>${a["Jenis Kelamin"] || "-"}</td>
      <td>${a["Tempat Lahir"] || "-"}</td>
      <td>${a["Tanggal Lahir"] || "-"}</td>
      <td>${a["Agama"] || "-"}</td>
      <td>${a["Pendidikan"] || "-"}</td>
      <td>${a["Jenis Pekerjaan"] || "-"}</td>
      <td>${a["Status Perkawinan"] || "-"}</td>
      <td>${a["Kewarganegaraan"] || "-"}</td>
      <td>${a["No Paspor"] || "-"}</td>
      <td>${a["No KITAP_KITAS"] || "-"}</td>
      <td>${a["Ayah Kandung"] || "-"}</td>
      <td>${a["Ibu Kandung"] || "-"}</td>
      <td>
        ${
          a["Hubungan dlm Klg"] === "Kepala Keluarga"
            ? `🔒`
            : `<button onclick="api.hapusAnggota('${a.NIK}')">🗑️</button>`
        }
      </td>
    `;

    tbody.appendChild(tr);
  });
}

/* =========================
API CALL (FIX FETCH)
========================= */
window.cariKeluarga = function () {
  const noKK = $("searchKK")?.value?.trim();

  if (!noKK) {
    toastError("Masukkan Nomor KK");
    return;
  }

  showLoading();

  apiGet("getKeluarga", { noKK })
    .then((res) => {
      hideLoading();

      console.log("RESULT:", res); // 🔥 DEBUG

      if (!res || !res.kepala) {
        toastError("Data tidak ditemukan");
        return;
      }

      renderKepalaKeluarga(res.kepala);
      renderAnggotaKeluarga(res.anggota || []);

      show($("btnTambahAnggota"));
      show($("btnHapusKK"));
      show($("btnEditKK"));
    })
    .catch((err) => {
      hideLoading();
      console.error(err);
      toastError("Gagal mengambil data");
    });
};

/* =========================
SIMPAN KK (FIX FETCH)
========================= */

window.simpanKepalaDanAnggota = function () {
  if (!isValidFormKK()) {
    toastError("Lengkapi semua data dulu broo 😅");
    return;
  }

  const val = (id) => $(id)?.value || "";

  const dataA = {
    "NO KK": val("kk_no"),
    NIK: val("kk_nik"),
    "Nama Kepala Klg": val("kk_nama"),
    Alamat: val("kk_alamat"),
    RT: val("sel_rt"),
    RW: val("sel_rw"),
    Desa_Kelurahan: val("sel_desa"),
    Kecamatan: val("sel_kecamatan"),
    Kabupaten_Kota: val("sel_kabupaten"),
    Provinsi: val("sel_provinsi"),
    "Kode Pos": val("kk_kodepos"),
    "Status Warga": val("kk_statuswarga"),
    "Asal Kota": val("kk_asalkota"),
  };

  const dataB = {
    "NO KK": dataA["NO KK"],
    NIK: dataA["NIK"],
    "Nama Lengkap": dataA["Nama Kepala Klg"],
    "Hubungan dlm Klg": "Kepala Keluarga",
    "Jenis Kelamin": val("b_kelamin"),
    "Tempat Lahir": val("b_tempatlahir"),
    "Tanggal Lahir": val("b_tgllahir"),
    Agama: val("b_agama"),
    Pendidikan: val("b_pendidikan"),
    "Jenis Pekerjaan": val("b_pekerjaan"),
    "Status Perkawinan": val("b_status"),
    Kewarganegaraan: val("b_kewarganegaraan"),
    "No Paspor": val("b_paspor"),
    "No KITAP_KITAS": val("b_kitap"),
    "Ayah Kandung": val("b_ayah"),
    "Ibu Kandung": val("b_ibu"),
  };

  showLoading();

  const btn = $("btnSimpanKK");
  if (btn) btn.disabled = true;

  apiPost("simpanKK", { dataA, dataB })
    .then((res) => {
      hideLoading();

      if (!res.status) {
        toastError(res.message);
        updateButtonState();
        return;
      }

      toastSuccess("Berhasil disimpan");

      // 🔥 AUTO SEARCH
      const noKK = dataA["NO KK"];

      const inputSearch = $("searchKK");
      if (inputSearch) {
        inputSearch.value = noKK;
      }

      if (typeof cariKeluarga === "function") {
        cariKeluarga();
      }

      show($("btnTambahAnggota"));

      // reset
      [
        "kk_no",
        "kk_nik",
        "kk_nama",
        "kk_alamat",
        "kk_kodepos",
        "kk_asalkota",
        "b_kelamin",
        "b_tempatlahir",
        "b_tgllahir",
        "b_agama",
        "b_pendidikan",
        "b_pekerjaan",
        "b_status",
        "b_kewarganegaraan",
        "b_paspor",
        "b_kitap",
        "b_ayah",
        "b_ibu",
      ].forEach((id) => {
        if ($(id)) $(id).value = "";
      });

      syncKepalaToAnggota();

      closeModal();
      updateButtonState();
    })
    .catch((err) => {
      hideLoading();
      console.error(err);
      toastError("Server error");
      updateButtonState();
    });
};

function isValidFormKK() {
  const val = (id) => $(id)?.value?.trim();

  // wajib isi
  if (!val("kk_no") || val("kk_no").length !== 16) return false;
  if (!val("kk_nik") || val("kk_nik").length !== 16) return false;
  if (!val("kk_nama")) return false;
  if (!val("kk_alamat")) return false;

  // wilayah
  if (!val("sel_provinsi")) return false;
  if (!val("sel_kabupaten")) return false;
  if (!val("sel_kecamatan")) return false;
  if (!val("sel_desa")) return false;
  if (!val("sel_rw")) return false;
  if (!val("sel_rt")) return false;

  // anggota minimal
  if (!val("b_kelamin")) return false;

  return true;
}

function updateButtonState() {
  const btn = $("btnSimpanKK");
  if (!btn) return;

  if (isValidFormKK()) {
    btn.disabled = false;
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
  } else {
    btn.disabled = true;
    btn.style.opacity = "0.5";
    btn.style.cursor = "not-allowed";
  }
}

function initValidationWatcher() {
  const ids = [
    "kk_no",
    "kk_nik",
    "kk_nama",
    "kk_alamat",
    "sel_provinsi",
    "sel_kabupaten",
    "sel_kecamatan",
    "sel_desa",
    "sel_rw",
    "sel_rt",
    "b_kelamin",
  ];

  ids.forEach((id) => {
    const el = $(id);
    if (!el) return;

    el.addEventListener("input", updateButtonState);
    el.addEventListener("change", updateButtonState);
  });
}

function toggleAlamatAsal() {
  const status = document.getElementById("kk_statuswarga").value;
  const box = document.getElementById("kk_asalktp_group");

  if (!box) return;

  if (status === "Domisili" || status === "Kos/Kontrak") {
    box.style.display = "block";
  } else {
    box.style.display = "none";
  }
}

function openTab(tabId, el) {
  // 🔹 sembunyikan semua tab
  document
    .querySelectorAll(".tab-content")
    .forEach((tab) => tab.classList.remove("active"));

  // 🔹 hilangkan active di semua tombol
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));

  // 🔹 tampilkan tab yang dipilih
  document.getElementById(tabId).classList.add("active");

  // 🔹 aktifkan tombol yang diklik
  if (el) el.classList.add("active");
}

/* =========================
INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {
  ["kk_no", "kk_nik", "kk_nama"].forEach((id) => {
    const el = $(id);
    if (el) el.addEventListener("input", syncKepalaToAnggota); // ✅ FIX
  });

  // 🔥 TAMBAHAN WAJIB
  initValidationWatcher();
  updateButtonState();

  const btn = $("btnCariKK");
  if (btn) {
    btn.addEventListener("click", cariKeluarga);
  }
});
