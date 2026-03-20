/* ======================================================
 * kk.html — FINAL (PATCH MINIMAL)
 * ======================================================
 * Search & render Kepala Keluarga + Anggota
 * ====================================================== */

const app = document.getElementById("appSection");
if (!localStorage.getItem("userSession") && app) {
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
  window.loadDataGlobal = function () {
    startLoading();

    apiGet("getAllKK")
      .then((rows) => {
        renderKKGlobal(rows);
        endLoading();
      })
      .catch((err) => {
        console.error(err);
        endLoading();
      });

    startLoading();

    apiGet("getAllAnggota")
      .then((rows) => {
        renderAnggotaGlobal(rows);
        endLoading();
      })
      .catch((err) => {
        console.error(err);
        endLoading();
      });
  };

  window.searchKK = function (keyword) {
    kkKeyword = keyword;
    kkPage = 1;
    renderKKGlobal(window.__kkGlobal);
  };

  window.searchAnggota = function (keyword) {
    anggotaKeyword = keyword;
    anggotaPage = 1;
    renderAnggotaGlobal(window.__anggotaGlobal);
  };

  function renderKKGlobal(rows) {
    window.__kkGlobal = rows || [];

    const tbody = document.getElementById("tbodyKKGlobal");

    const filtered = window.__kkGlobal.filter((r) => {
      if (filterRWValue && String(r.rw) !== filterRWValue) return false;
      if (filterRTValue && String(r.rt) !== filterRTValue) return false;

      return (
        contains(r.noKK, kkKeyword) ||
        contains(r.nama, kkKeyword) ||
        contains(r.alamat, kkKeyword)
      );
    });

    const pageData = paginate(filtered, kkPage);

    if (pageData.length === 0) {
      tbody.innerHTML = `
        <tr><td colspan="7" style="text-align:center;color:#777">
          Data tidak ditemukan
        </td></tr>`;
      return;
    }

    tbody.innerHTML = pageData
      .map(
        (r, i) => `
    <tr>
      <td>${r.noKK}</td>
      <td>${r.nama}</td>
      <td>${r.alamat || "-"}</td>
      <td>${r.rt}</td>
      <td>${r.rw}</td>
      <td>${r.status}</td>
      <td>
        <button class="btn ghost"
          onclick="lihatDetailKK(${(kkPage - 1) * PAGE_SIZE + i})">
          👁 Detail
        </button>
        <button class="btn primary"
          onclick="editKK(${r.noKK})">
          ✏ Edit
        </button>

      </td>
    </tr>
  `,
      )
      .join("");

    renderKKPagination(filtered.length);

    // 🔥 panggil SEKALI SAAT PERTAMA LOAD
    if (!window.__rtRwBuilt) {
      buildRTRWFilterFromKK();
      window.__rtRwBuilt = true;
    }
  }

  window.lihatDetailKK = function (index) {
    const r = window.__kkGlobal[index];
    if (!r) return;

    const box = document.getElementById("detailKKBox");

    box.innerHTML = `
      <div><label>No KK</label><span>${r.noKK}</span></div>
      <div><label>NIK Kepala</label><span>${r.nik || "-"}</span></div>
      <div><label>Nama Kepala</label><span>${r.nama}</span></div>
      <div><label>Alamat</label><span>${r.alamat || "-"}</span></div>

      <div><label>RT</label><span>${r.rt}</span></div>
      <div><label>RW</label><span>${r.rw}</span></div>

      <div><label>Desa / Kelurahan</label><span>${r.desa || "-"}</span></div>
      <div><label>Kecamatan</label><span>${r.kecamatan || "-"}</span></div>
      <div><label>Kabupaten / Kota</label><span>${r.kabupaten || "-"}</span></div>
      <div><label>Provinsi</label><span>${r.provinsi || "-"}</span></div>

      <div><label>Kode Pos</label><span>${r.kodepos || "-"}</span></div>
      <div><label>Status Warga</label><span>${r.status}</span></div>
      <div><label>Asal Kota</label><span>${r.asalkota || "-"}</span></div>
    `;

    document.getElementById("modalDetailKK").style.display = "flex";
  };

  window.closeDetailKK = function () {
    document.getElementById("modalDetailKK").style.display = "none";
  };

  function renderKKPagination(total) {
    const maxPage = Math.ceil(total / PAGE_SIZE) || 1;
    document.getElementById("kkPageInfo").innerText =
      `Halaman ${kkPage} / ${maxPage}`;
  }

  window.nextKK = function () {
    const filtered = window.__kkGlobal.filter((r) => {
      if (filterRWValue && String(r.rw) !== filterRWValue) return false;
      if (filterRTValue && String(r.rt) !== filterRTValue) return false;

      return (
        contains(r.noKK, kkKeyword) ||
        contains(r.nama, kkKeyword) ||
        contains(r.alamat, kkKeyword)
      );
    });

    const maxPage = Math.ceil(filtered.length / PAGE_SIZE) || 1;
    if (kkPage < maxPage) {
      kkPage++;
      renderKKGlobal(window.__kkGlobal);
    }
  };

  window.prevKK = function () {
    if (kkPage > 1) {
      kkPage--;
      renderKKGlobal(window.__kkGlobal);
    }
  };

  function buildKKMap() {
    const map = {};
    (window.__kkGlobal || []).forEach((k) => {
      map[k.noKK] = {
        rt: k.rt,
        rw: k.rw,
      };
    });
    return map;
  }

  function renderAnggotaGlobal(rows) {
    const kkMap = buildKKMap();

    // JOIN RT/RW ke anggota
    window.__anggotaGlobal = (rows || []).map((a) => {
      const kk = kkMap[a.noKK] || {};
      return {
        ...a,
        rt: kk.rt || "",
        rw: kk.rw || "",
      };
    });

    const tbody = document.getElementById("tbodyAnggotaGlobal");

    const filtered = window.__anggotaGlobal.filter((r) => {
      if (filterRWValue && String(r.rw) !== filterRWValue) return false;
      if (filterRTValue && String(r.rt) !== filterRTValue) return false;

      return (
        contains(r.noKK, anggotaKeyword) ||
        contains(r.nik, anggotaKeyword) ||
        contains(r.nama, anggotaKeyword) ||
        contains(r.hubungan, anggotaKeyword)
      );
    });

    const pageData = paginate(filtered, anggotaPage);

    if (pageData.length === 0) {
      tbody.innerHTML = `
        <tr><td colspan="6" style="text-align:center;color:#777">
          Data tidak ditemukan
        </td></tr>`;
      return;
    }

    tbody.innerHTML = pageData
      .map(
        (r, i) => `
    <tr>
      <td>${r.noKK}</td>
      <td>${r.nik}</td>
      <td>${r.nama}</td>
      <td>${r.hubungan}</td>
      <td>${r.kelamin || "-"}</td>
      <td>
        <button class="btn ghost"
          onclick="lihatDetailAnggota('${r.nik}')">
          👁 Detail
        </button>
        <button class="btn primary"
          onclick="editAnggota('${r.nik}')">
          ✏ Edit
        </button>
      </td>
    </tr>
  `,
      )
      .join("");

    renderAnggotaPagination(filtered.length);
  }

  function renderAnggotaPagination(total) {
    const maxPage = Math.ceil(total / PAGE_SIZE) || 1;
    document.getElementById("anggotaPageInfo").innerText =
      `Halaman ${anggotaPage} / ${maxPage}`;
  }

  window.nextAnggota = function () {
    const filtered = window.__anggotaGlobal.filter((r) => {
      if (filterRWValue && String(r.rw) !== filterRWValue) return false;
      if (filterRTValue && String(r.rt) !== filterRTValue) return false;

      return (
        contains(r.noKK, anggotaKeyword) ||
        contains(r.nik, anggotaKeyword) ||
        contains(r.nama, anggotaKeyword) ||
        contains(r.hubungan, anggotaKeyword)
      );
    });

    const maxPage = Math.ceil(filtered.length / PAGE_SIZE) || 1;

    if (anggotaPage < maxPage) {
      anggotaPage++;
      renderAnggotaGlobal(window.__anggotaGlobal);
    }
  };

  window.prevAnggota = function () {
    if (anggotaPage > 1) {
      anggotaPage--;
      renderAnggotaGlobal(window.__anggotaGlobal);
    }
  };

  window.lihatDetailAnggota = function (nik) {
    const r = window.__anggotaGlobal.find((x) => x.nik == nik);
    if (!r) return;

    const box = document.getElementById("detailAnggotaBox");

    box.innerHTML = `
      <div><label>No KK</label><span>${r.noKK}</span></div>
      <div><label>NIK</label><span>${r.nik}</span></div>
      <div><label>Nama Lengkap</label><span>${r.nama}</span></div>
      <div><label>Hubungan</label><span>${r.hubungan}</span></div>
      <div><label>Jenis Kelamin</label><span>${r.kelamin || "-"}</span></div>
      <div><label>Tempat Lahir</label><span>${r.tempat || "-"}</span></div>
      <div><label>Tanggal Lahir</label><span>${r.tgl || "-"}</span></div>
      <div><label>Agama</label><span>${r.agama || "-"}</span></div>
      <div><label>Pendidikan</label><span>${r.pendidikan || "-"}</span></div>
      <div><label>Pekerjaan</label><span>${r.pekerjaan || "-"}</span></div>
      <div><label>Status Kawin</label><span>${r.statusKawin || "-"}</span></div>
      <div><label>Kewarganegaraan</label><span>${r.kewarganegaraan || "-"}</span></div>
      <div><label>No Paspor</label><span>${r.paspor || "-"}</span></div>
      <div><label>No KITAP/KITAS</label><span>${r.kitap || "-"}</span></div>
      <div><label>Ayah Kandung</label><span>${r.ayah || "-"}</span></div>
      <div><label>Ibu Kandung</label><span>${r.ibu || "-"}</span></div>
    `;

    document.getElementById("modalDetailAnggota").style.display = "flex";
  };

  window.closeDetailAnggota = function () {
    document.getElementById("modalDetailAnggota").style.display = "none";
  };

  function buildRTRWFilterFromKK() {
    const rwSet = new Set();
    const rtSet = new Set();

    (window.__kkGlobal || []).forEach((k) => {
      if (k.rw) rwSet.add(String(k.rw));
      if (k.rt) rtSet.add(String(k.rt));
    });

    const rwSelect = document.getElementById("filterRW");
    const rtSelect = document.getElementById("filterRT");

    if (!rwSelect || !rtSelect) return;

    rwSelect.innerHTML =
      `<option value="">Semua RW</option>` +
      [...rwSet]
        .sort()
        .map((v) => `<option value="${v}">RW ${v}</option>`)
        .join("");

    rtSelect.innerHTML =
      `<option value="">Semua RT</option>` +
      [...rtSet]
        .sort()
        .map((v) => `<option value="${v}">RT ${v}</option>`)
        .join("");
  }

  window.onFilterChange = function () {
    filterRWValue = document.getElementById("filterRW").value;
    filterRTValue = document.getElementById("filterRT").value;

    kkPage = 1;
    anggotaPage = 1;

    renderKKGlobal(window.__kkGlobal);
    renderAnggotaGlobal(window.__anggotaGlobal);
  };

  window.resetFilter = function () {
    document.getElementById("filterRW").value = "";
    document.getElementById("filterRT").value = "";

    filterRWValue = "";
    filterRTValue = "";

    kkPage = 1;
    anggotaPage = 1;

    renderKKGlobal(window.__kkGlobal);
    renderAnggotaGlobal(window.__anggotaGlobal);
  };

  /* =====================
   * JS MODAL KK DAN ANGGOTA
   * ===================== */

  window.editKK = function (noKK) {
    const r = window.__kkGlobal.find((x) => x.noKK == noKK);
    if (!r) {
      console.warn("Data KK tidak ditemukan");
      return;
    }

    // =====================
    // PASTIKAN WILAYAH READY
    // =====================
    if (!window.__wilayahLoaded) {
      initWilayah();
      window.__wilayahLoaded = true;
    }

    // =====================
    // AMBIL ELEMEN
    // =====================
    const modal = document.getElementById("modalEditKK");

    const elNoKK = document.getElementById("edtA_noKK");
    const elNik = document.getElementById("edtA_nik");
    const elNama = document.getElementById("edtA_nama");
    const elAlamat = document.getElementById("edtA_alamat");

    const elProv = document.getElementById("edtA_provinsi");
    const elKab = document.getElementById("edtA_kabupaten");
    const elKec = document.getElementById("edtA_kecamatan");
    const elDes = document.getElementById("edtA_desa");
    const elRW = document.getElementById("edtA_rw");
    const elRT = document.getElementById("edtA_rt");

    const elKode = document.getElementById("edtA_kodepos");
    const elStatus = document.getElementById("edtA_statuswarga");
    const elAsal = document.getElementById("edtA_asalkota");
    const asalGrp = document.getElementById("edtA_asalkota_group");

    // =====================
    // ISI DATA DASAR
    // =====================
    elNoKK.value = r.noKK || "";
    elNik.value = r.nik || "";
    elNama.value = r.nama || "";
    elNama.readOnly = true;
    elAlamat.value = r.alamat || "";
    elKode.value = r.kodepos || "";
    elStatus.value = r.status || "";

    if (r.status === "Domisili" || r.status === "Kos/Kontrak") {
      asalGrp.style.display = "block";
      elAsal.value = r.asalkota || "";
    } else {
      asalGrp.style.display = "none";
      elAsal.value = "";
    }

    // =====================
    // DROPDOWN WILAYAH (IKUT wilayah.html)
    // =====================
    elProv.value = r.provinsi || "";
    elProv.dispatchEvent(new Event("change"));

    setTimeout(() => {
      elKab.value = r.kabupaten || "";
      elKab.dispatchEvent(new Event("change"));

      setTimeout(() => {
        elKec.value = r.kecamatan || "";
        elKec.dispatchEvent(new Event("change"));

        setTimeout(() => {
          elDes.value = r.desa || "";
          elDes.dispatchEvent(new Event("change"));

          setTimeout(() => {
            elRW.value = r.rw || "";
            elRW.dispatchEvent(new Event("change"));

            setTimeout(() => {
              elRT.value = r.rt || "";
            }, 30);
          }, 30);
        }, 30);
      }, 30);
    }, 30);

    // =====================
    // TAMPILKAN MODAL
    // =====================
    modal.style.display = "flex";
  };

  window.closeModalEditKK = function () {
    document.getElementById("modalEditKK").style.display = "none";
  };

  window.editAnggota = function (nik) {
    const r = window.__anggotaGlobal.find((x) => x.nik == nik);
    if (!r) {
      console.warn("Data anggota tidak ditemukan");
      return;
    }

    document.getElementById("edt_noKK").value = r.noKK || "";
    document.getElementById("edt_nik").value = r.nik || "";
    document.getElementById("edt_nama").value = r.nama || "";
    document.getElementById("edt_hubungan").value = r.hubungan || "";
    document.getElementById("edt_kelamin").value = r.kelamin || "";
    document.getElementById("edt_tempat").value = r.tempat || "";

    // 🔥 TANGGAL — pastikan format yyyy-mm-dd
    document.getElementById("edt_tanggal").value = r.tgl
      ? formatDateInput(r.tgl)
      : "";

    document.getElementById("edt_agama").value = r.agama || "";
    document.getElementById("edt_pendidikan").value = r.pendidikan || "";
    document.getElementById("edt_pekerjaan").value = r.pekerjaan || "";
    document.getElementById("edt_status").value = r.statusKawin || "";
    document.getElementById("edt_kewarganegaraan").value =
      r.kewarganegaraan || "";
    document.getElementById("edt_paspor").value = r.paspor || "";
    document.getElementById("edt_kitap").value = r.kitap || "";
    document.getElementById("edt_ayah").value = r.ayah || "";
    document.getElementById("edt_ibu").value = r.ibu || "";

    document.getElementById("modalEditAnggota").style.display = "flex";
  };

  window.closeModalEditAnggota = function () {
    document.getElementById("modalEditAnggota").style.display = "none";
  };

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
   * LOAD ANGGOTA (DIBIARKAN)
   * ===================== */
  function loadAnggota(noKK) {
    apiGet("getKeluarga", { noKK })
      .then((res) => {
        renderAnggota(res.anggota || []);
      })
      .catch((err) => {
        console.error(err);
        clearAnggotaTable();
      });
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

        loadSummaryGlobal();
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
   * AUTO SYNC KK → ANGGOTA
   * ===================== */

  /* =====================
   * AUTO SYNC KK → ANGGOTA
   * ===================== */

  window.syncKepalaToAnggota = function () {
    const noKK = document.getElementById("kk_no")?.value;
    const nik = document.getElementById("kk_nik")?.value;
    const nama = document.getElementById("kk_nama")?.value;

    const b1 = document.getElementById("b_noKK");
    const b2 = document.getElementById("b_nik");
    const b3 = document.getElementById("b_nama");

    if (b1) b1.value = noKK || "";
    if (b2) b2.value = nik || "";
    if (b3) b3.value = nama || "";
  };

  /* =====================
   * REGISTER EVENT
   * ===================== */

  function initAutoSyncKK() {
    ["kk_no", "kk_nik", "kk_nama"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      el.addEventListener("input", syncKepalaToAnggota);
    });
  }

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
