/* ======================================================
 * kk.html — FINAL (PATCH MINIMAL)
 * ======================================================
 * Search & render Kepala Keluarga + Anggota
 * ====================================================== */

const app = document.getElementById("appSection");
if (app && !localStorage.getItem("userSession")) {
  app.style.display = "none";
}

(function () {
  /* =====================
   * HELPERS
   * ===================== */
  const qs = (id) => document.getElementById(id);

  function show(el) {
    if (el) el.style.display = "block";
  }
  function hide(el) {
    if (el) el.style.display = "none";
  }

  function clearAnggotaTable() {
    const tbody = qs("tbody");
    if (!tbody) return;
    tbody.innerHTML = `
      <tr>
        <td colspan="17" style="text-align:center;color:#777">
          Silakan cari Nomor KK terlebih dahulu.
        </td>
      </tr>`;
  }

  /* =====================
   * RENDER KK
   * ===================== */
  function renderKK(data) {
    const box = qs("kkResult");
    if (!box) return;

    box.innerHTML = `
      <div><b>NO KK:</b> ${data["NO KK"]}</div>
      <div><b>Nama Kepala:</b> ${data["Nama Kepala Klg"]}</div>
      <div><b>Alamat:</b> ${data["Alamat"]}</div>
      <div><b>RT/RW:</b> ${data["RT"]}/${data["RW"]}</div>
      <div><b>Desa:</b> ${data["Desa_Kelurahan"]}</div>
      <div><b>Kecamatan:</b> ${data["Kecamatan"]}</div>
      <div><b>Kab/Kota:</b> ${data["Kabupaten_Kota"]}</div>
      <div><b>Provinsi:</b> ${data["Provinsi"]}</div>
    `;
    show(box);
  }

  /* =====================
   * RENDER LOAD KK DAN ANGGOTA GLOBAL
   * ===================== */

  window.cariKeluarga = function () {
    const noKK = document.getElementById("searchKK").value.trim();

    if (!noKK) {
      alert("Masukkan Nomor KK dulu broo");
      return;
    }

    showLoading();

    apiGet("getKeluargaByKK", { noKK })
      .then((res) => {
        hideLoading();

        if (!res.status) {
          alert("KK tidak ditemukan");
          return;
        }

        renderKK(res.kk);
        renderAnggota(res.anggota);

        document.getElementById("btnTambahAnggota").style.display =
          "inline-block";
        document.getElementById("btnHapusKK").style.display = "inline-block";
      })
      .catch((err) => {
        hideLoading();
        console.error(err);
        alert("Gagal load data");
      });
  };

  function renderAnggota(data) {
    const tbody = document.getElementById("tbody");

    if (!data || data.length === 0) {
      tbody.innerHTML = `
      <tr><td colspan="17" style="text-align:center;color:#777">
        Tidak ada anggota
      </td></tr>`;
      return;
    }

    tbody.innerHTML = data
      .map(
        (r) => `
    <tr>
      <td>${r["NO KK"]}</td>
      <td>${r["NIK"]}</td>
      <td>${r["Nama Lengkap"]}</td>
      <td>${r["Hubungan dalam Keluarga"]}</td>
      <td>${r["Jenis Kelamin"] || "-"}</td>
      <td>${r["Tempat Lahir"] || "-"}</td>
      <td>${r["Tanggal Lahir"] || "-"}</td>
      <td>${r["Agama"] || "-"}</td>
      <td>${r["Pendidikan"] || "-"}</td>
      <td>${r["Jenis Pekerjaan"] || "-"}</td>
      <td>${r["Status Perkawinan"] || "-"}</td>
      <td>${r["Kewarganegaraan"] || "-"}</td>
      <td>${r["No Paspor"] || "-"}</td>
      <td>${r["No KITAP/KITAS"] || "-"}</td>
      <td>${r["Ayah Kandung"] || "-"}</td>
      <td>${r["Ibu Kandung"] || "-"}</td>
      <td>-</td>
    </tr>
  `,
      )
      .join("");
  }

  /* =====================
   * JS MODAL KK DAN ANGGOTA
   * ===================== */

  function formatDateInput(val) {
    if (val instanceof Date) {
      return val.toISOString().slice(0, 10);
    }
    if (typeof val === "string") {
      return val.length >= 10 ? val.slice(0, 10) : "";
    }
    return "";
  }

  /* =====================
   * ACTIONS (TIDAK DIUBAH)
   * ===================== */
  window.hapusKepalaKeluarga = function () {
    const noKK = qs("searchKK").value.trim();

    if (!confirm("Hapus data keluarga ini?")) return;

    showLoading();

    apiPost("hapusKK", { noKK })
      .then((res) => {
        hideLoading();
        toastSuccess(res.message || "Berhasil dihapus");

        qs("searchKK").value = "";
        hide(qs("kkResult"));
        clearAnggotaTable();
      })
      .catch((err) => {
        hideLoading();
        console.error(err);
        toastError("Gagal hapus");
      });
  };

  window.tambahAnggota = function () {
    const searchKK = document.getElementById("searchKK");
    const noKK = searchKK?.value?.trim();

    // ❌ BELUM CARI KK
    if (!noKK) {
      alert("Silakan isi dan cari Nomor KK terlebih dahulu");
      searchKK?.focus();
      return;
    }

    // ✅ BUKA MODAL DULU
    openModalAnggota();

    // ⏱️ TUNGGU MODAL RENDER (AMAN)
    setTimeout(() => {
      const inputKK = document.getElementById("agt_noKK");
      if (inputKK) {
        inputKK.value = noKK;
        console.log("✅ NO KK TERISI:", noKK);
      } else {
        console.error("❌ agt_noKK tidak ditemukan");
      }
    }, 50);
  };

  /* =====================
   * REGISTER EVENT
   * ===================== */

  window.resetFormAnggota = function () {
    const fields = [
      "agt_nik",
      "agt_nama",
      "agt_hubungan",
      "agt_kelamin",
      "agt_tempat",
      "agt_tanggal",
      "agt_agama",
      "agt_pendidikan",
      "agt_pekerjaan",
      "agt_status",
      "agt_kewarganegaraan",
      "agt_paspor",
      "agt_kitap",
      "agt_ayah",
      "agt_ibu",
    ];

    fields.forEach(function (id) {
      const el = document.getElementById(id);
      if (!el) return;

      if (el.tagName === "SELECT") {
        el.selectedIndex = 0;
      } else {
        el.value = "";
      }
    });
  };

  window.closeModalAnggota = function () {
    const modal = document.getElementById("modalAnggota");
    if (modal) modal.style.display = "none";
  };
})();
