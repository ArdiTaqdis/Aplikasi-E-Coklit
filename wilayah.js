/* ======================================================
 * wilayah.html — FINAL
 * ======================================================
 * Dropdown wilayah bertingkat:
 * Provinsi → Kab/Kota → Kecamatan → Desa → RW → RT
 * Sumber: Code.gs getWilayah()
 * ====================================================== */

(function () {
  /* =====================
   * STATE
   * ===================== */
  let WILAYAH_DATA = null;

  /* =====================
   * HELPERS
   * ===================== */
  const qs = (id) => document.getElementById(id);

  function setOptions(select, list, placeholder = "-- Pilih --") {
    if (!select) return;
    select.innerHTML = `<option value="">${placeholder}</option>`;
    (list || []).forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      select.appendChild(opt);
    });
  }

  function clearChain(ids) {
    ids.forEach((id) => setOptions(qs(id), []));
  }

  /* =====================
   * LOAD DATA
   * ===================== */
  function loadWilayahData(cb) {
    if (WILAYAH_DATA) {
      cb && cb();
      return;
    }

    google.script.run
      .withSuccessHandler((data) => {
        WILAYAH_DATA = data || {};
        cb && cb();
      })
      .withFailureHandler((err) => {
        console.error("Gagal load wilayah:", err);
        WILAYAH_DATA = {};
      })
      .getWilayah();
  }

  /* =====================
   * INIT — TAMBAH KK
   * ===================== */
  function initWilayahTambah() {
    const selProv = qs("sel_prov");
    const selKab = qs("sel_kab");
    const selKec = qs("sel_kec");
    const selDesa = qs("sel_desa");
    const selRW = qs("sel_rw");
    const selRT = qs("sel_rt");

    if (!selProv) return;

    setOptions(selProv, Object.keys(WILAYAH_DATA), "Pilih Provinsi");
    clearChain(["sel_kab", "sel_kec", "sel_desa", "sel_rw", "sel_rt"]);

    selProv.onchange = () => {
      const p = selProv.value;
      setOptions(
        selKab,
        p ? Object.keys(WILAYAH_DATA[p] || {}) : [],
        "Pilih Kab/Kota",
      );
      clearChain(["sel_kec", "sel_desa", "sel_rw", "sel_rt"]);
    };

    selKab.onchange = () => {
      const p = selProv.value,
        k = selKab.value;
      setOptions(
        selKec,
        k ? Object.keys(WILAYAH_DATA[p][k] || {}) : [],
        "Pilih Kecamatan",
      );
      clearChain(["sel_desa", "sel_rw", "sel_rt"]);
    };

    selKec.onchange = () => {
      const p = selProv.value,
        k = selKab.value,
        c = selKec.value;
      setOptions(
        selDesa,
        c ? Object.keys(WILAYAH_DATA[p][k][c] || {}) : [],
        "Pilih Desa",
      );
      clearChain(["sel_rw", "sel_rt"]);
    };

    selDesa.onchange = () => {
      const p = selProv.value,
        k = selKab.value,
        c = selKec.value,
        d = selDesa.value;
      setOptions(
        selRW,
        d ? Object.keys(WILAYAH_DATA[p][k][c][d] || {}) : [],
        "Pilih RW",
      );
      clearChain(["sel_rt"]);
    };

    selRW.onchange = () => {
      const p = selProv.value,
        k = selKab.value,
        c = selKec.value,
        d = selDesa.value,
        r = selRW.value;
      setOptions(selRT, r ? WILAYAH_DATA[p][k][c][d][r] || [] : [], "Pilih RT");
    };
  }

  /* =====================
   * INIT — EDIT KK
   * ===================== */
  function initWilayahEdit() {
    const map = {
      prov: "edtA_provinsi",
      kab: "edtA_kabupaten",
      kec: "edtA_kecamatan",
      des: "edtA_desa",
      rw: "edtA_rw",
      rt: "edtA_rt",
    };

    const selProv = qs(map.prov);
    if (!selProv) return;

    const selKab = qs(map.kab);
    const selKec = qs(map.kec);
    const selDesa = qs(map.des);
    const selRW = qs(map.rw);
    const selRT = qs(map.rt);

    setOptions(selProv, Object.keys(WILAYAH_DATA), "Pilih Provinsi");

    selProv.onchange = () => {
      const p = selProv.value;
      setOptions(selKab, p ? Object.keys(WILAYAH_DATA[p] || {}) : []);
      clearChain([map.kec, map.des, map.rw, map.rt]);
    };

    selKab.onchange = () => {
      const p = selProv.value,
        k = selKab.value;
      setOptions(selKec, k ? Object.keys(WILAYAH_DATA[p][k] || {}) : []);
      clearChain([map.des, map.rw, map.rt]);
    };

    selKec.onchange = () => {
      const p = selProv.value,
        k = selKab.value,
        c = selKec.value;
      setOptions(selDesa, c ? Object.keys(WILAYAH_DATA[p][k][c] || {}) : []);
      clearChain([map.rw, map.rt]);
    };

    selDesa.onchange = () => {
      const p = selProv.value,
        k = selKab.value,
        c = selKec.value,
        d = selDesa.value;
      setOptions(selRW, d ? Object.keys(WILAYAH_DATA[p][k][c][d] || {}) : []);
      clearChain([map.rt]);
    };

    selRW.onchange = () => {
      const p = selProv.value,
        k = selKab.value,
        c = selKec.value,
        d = selDesa.value,
        r = selRW.value;
      setOptions(selRT, r ? WILAYAH_DATA[p][k][c][d][r] || [] : []);
    };
  }

  /* =====================
   * PUBLIC INIT
   * ===================== */
  window.initWilayah = function () {
    loadWilayahData(() => {
      initWilayahTambah();
      initWilayahEdit();
    });
  };

  /* =====================
   * AUTO INIT
   * ===================== */
  document.addEventListener("DOMContentLoaded", () => {
    if (typeof google !== "undefined") {
      initWilayah();
    }
  });
})();
