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
    resetForm(modal?.querySelector("form") || modal);
    show(modal);

    // hubungan auto
    const hub = document.getElementById("b_hubungan");
    if (hub) hub.value = "Kepala Keluarga";

    // 🔥 INIT SYNC
    setTimeout(() => {
      initAutoSyncKK();
    }, 50);
  };

  window.closeModal = function () {
    hide($("modalKK"));
  };

  function initAutoSyncKK() {
    ["kk_no", "kk_nik", "kk_nama"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      el.addEventListener("input", syncKepalaToAnggota);
    });
  }
  /* =====================
   * MODAL EDIT KK
   * ===================== */

  window.openModalEditKK = () => {
    show($("modalEditKK"));

    if (typeof initWilayah === "function") {
      initWilayah();
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
