(function () {
  const qs = (id) => document.getElementById(id);

  function setText(id, value) {
    const el = qs(id);
    if (el) el.textContent = value ?? 0;
  }

  function renderSummary(data) {
    if (!data) return;

    setText("sm_total", data.total);
    setText("sm_asli", data.asli);
    setText("sm_domisili", data.domisili);
    setText("sm_kos", data.kos);
    setText("sm_laki", data.laki);
    setText("sm_perempuan", data.perempuan);
  }

  window.loadSummaryGlobal = function () {
    showLoading();

    apiGet("getSummary")
      .then((res) => {
        hideLoading();
        renderSummary(res);
      })
      .catch((err) => {
        hideLoading();
        console.error("Gagal load summary:", err);
        toastError("Gagal load statistik");
      });
  };

  document.addEventListener("DOMContentLoaded", () => {
    loadSummaryGlobal();
  });
})();
