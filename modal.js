/* ======================================================
 * modal.html — FINAL (FIXED)
 * ====================================================== */

(function () {
  /* =====================
   * HELPERS
   * ===================== */

  function show(el) {
    if (el) el.style.display = "flex";
  }

  function hide(el) {
    if (el) el.style.display = "none";
  }

  function resetForm(formEl) {
    if (!formEl) return;
    if (typeof formEl.reset === "function") formEl.reset();

    formEl
      .querySelectorAll("input.readonly-field")
      .forEach((i) => (i.value = ""));
  }

  /* =====================
   * LOADING OVERLAY
   * ===================== */

  window.showLoading = function () {
    show($("loadingOverlay"));
  };

  window.hideLoading = function () {
    hide($("loadingOverlay"));
  };

  /* =====================
   * TOAST
   * ===================== */

  window.showToast = function (text = "Berhasil") {
    const toast = $("toastSuccess");
    if (!toast) return;

    toast.textContent = text;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2600);
  };

  /* =====================
   * MODAL KK
   * ===================== */

  window.openModal = function () {
    const modal = $("modalKK");

    showLoading();

    // 🔥 RESET SEKALI SAJA
    resetModalKK();

    show(modal);

    // 🔥 init ulang wilayah
    initWilayahStaticKK();

    hideLoading();

    // default hubungan
    const hub = $("b_hubungan");
    if (hub) hub.value = "Kepala Keluarga";

    // 🔥 VALIDATION RESET
    updateButtonState();

    initAutoSyncKK();
    initValidationWatcher();
  };

  function resetModalKK() {
    const modal = $("modalKK");
    const form = modal?.querySelector("form");

    if (form) form.reset();

    // 🔥 reset RW/RT
    const rw = $("kk_rw_modal");
    const rt = $("kk_rt_modal");

    if (rw) rw.value = "";
    if (rt) rt.innerHTML = '<option value="">Pilih RT</option>';

    // 🔥 reset kode pos (WAJIB)
    const kodepos = $("kk_kodepos");
    if (kodepos) kodepos.value = "17610";

    // 🔥 reset TPS (kalau ada)
    const tps = $("set_tps");
    if (tps) tps.value = "";

    // 🔥 sembunyikan alamat asal
    const asalGroup = $("kk_asalktp_group");
    if (asalGroup) asalGroup.style.display = "none";
  }

  window.closeModal = function () {
    resetModalKK();
    hide($("modalKK"));
  };

  function initAutoSyncKK() {
    ["kk_no", "kk_nik", "kk_nama"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      // ❌ hapus event lama dulu
      el.removeEventListener("input", syncKepalaToAnggota);

      // ✅ pasang ulang
      el.addEventListener("input", syncKepalaToAnggota);
    });
  }
  /* =====================
   * MODAL EDIT KK
   * ===================== */

  window.openModalEditKK = () => {
    show($("modalEditKK"));

    if (typeof initWilayah === "function" && !window.__wilayahLoaded) {
      initWilayah();
      window.__wilayahLoaded = true;
    }
  };
  window.closeModalEditKK = () => hide($("modalEditKK"));

  /* =====================
   * MODAL ANGGOTA
   * ===================== */

  window.openModalAnggota = function () {
    const modal = $("modalAnggota");
    resetForm(modal?.querySelector("form") || modal);
    show(modal);
  };

  window.closeModalAnggota = () => hide($("modalAnggota"));

  /* =====================
   * MODAL EDIT ANGGOTA
   * ===================== */

  window.openModalEditAnggota = () => show($("modalEditAnggota"));
  window.closeModalEditAnggota = () => hide($("modalEditAnggota"));

  /* =====================
   * CONFIRM DELETE
   * ===================== */

  window.confirmDeleteModal = function (label = "HAPUS") {
    return confirmDelete(label); // dari validation.html
  };
})();
