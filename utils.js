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

function syncKepalaKeAnggota() {
  if ($("b_noKK")) $("b_noKK").value = $("kk_no")?.value || "";
  if ($("b_nik")) $("b_nik").value = $("kk_nik")?.value || "";
  if ($("b_nama")) $("b_nama").value = $("kk_nama")?.value || "";
}

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

      if (!res) {
        toastError("Data tidak ditemukan");
        return;
      }

      renderKepalaKeluarga(res.kepala);
      renderAnggotaKeluarga(res.anggota || []);

      show($("btnTambahAnggota"));
    })
    .catch(() => {
      hideLoading();
      toastError("Gagal mengambil data");
    });
};

/* =========================
SIMPAN KK (FIX FETCH)
========================= */

window.simpanKepalaDanAnggota = function () {
  const dataA = {
    "NO KK": $("kk_no")?.value,
    NIK: $("kk_nik")?.value,
    "Nama Kepala Klg": $("kk_nama")?.value,
    Alamat: $("kk_alamat")?.value,
    RT: $("sel_rt")?.value,
    RW: $("sel_rw")?.value,
    Desa_Kelurahan: $("sel_desa")?.value,
    Kecamatan: $("sel_kecamatan")?.value,
    Kabupaten_Kota: $("sel_kabupaten")?.value,
    Provinsi: $("sel_provinsi")?.value,
    "Kode Pos": $("kk_kodepos")?.value,
    "Status Warga": $("kk_statuswarga")?.value,
    "Asal Kota": $("kk_asalkota")?.value,
  };

  const dataB = {
    "NO KK": dataA["NO KK"],
    NIK: dataA["NIK"],
    "Nama Lengkap": dataA["Nama Kepala Klg"],
    "Hubungan dlm Klg": "Kepala Keluarga",
    "Jenis Kelamin": $("b_kelamin")?.value,
    "Tempat Lahir": $("b_tempatlahir")?.value,
    "Tanggal Lahir": $("b_tgllahir")?.value,
    Agama: $("b_agama")?.value,
    Pendidikan: $("b_pendidikan")?.value,
    "Jenis Pekerjaan": $("b_pekerjaan")?.value,
    "Status Perkawinan": $("b_status")?.value,
    Kewarganegaraan: $("b_kewarganegaraan")?.value,
    "No Paspor": $("b_paspor")?.value,
    "No KITAP_KITAS": $("b_kitap")?.value,
    "Ayah Kandung": $("b_ayah")?.value,
    "Ibu Kandung": $("b_ibu")?.value,
  };

  showLoading();

  apiPost("simpanKK", {
    dataA,
    dataB,
  })
    .then((res) => {
      hideLoading();

      if (!res.status) {
        toastError(res.message);
        return;
      }

      toastSuccess("Berhasil disimpan");
    })
    .catch((err) => {
      hideLoading();
      console.error(err);
      toastError("Server error");
    });
};

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

/* =========================
INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {
  ["kk_no", "kk_nik", "kk_nama"].forEach((id) => {
    const el = $(id);
    if (el) el.addEventListener("input", syncKepalaKeAnggota);
  });

  const btn = $("btnCariKK");
  if (btn) {
    btn.addEventListener("click", cariKeluarga);
  }
});
