/* ======================================================
 * wilayah.js — CLEAN VERSION (GITHUB READY)
 * ====================================================== */

(function () {
  let WILAYAH_DATA = {};

  const qs = (id) => document.getElementById(id);

  function setOptions(select, list, placeholder = "-- Pilih --") {
    if (!select) return;

    select.innerHTML =
      `<option value="">${placeholder}</option>` +
      (list || []).map((v) => `<option value="${v}">${v}</option>`).join("");
  }

  function loadWilayah() {
    return apiGet("getWilayah")
      .then((res) => {
        WILAYAH_DATA = res || {};
        console.log("✅ wilayah loaded", WILAYAH_DATA);
      })
      .catch((err) => {
        console.error("❌ gagal load wilayah", err);
      });
  }

  /* =====================
   * INIT CASCADE
   * ===================== */
  function initCascade(prefix) {
    const prov = qs(prefix + "provinsi");
    const kab = qs(prefix + "kabupaten");
    const kec = qs(prefix + "kecamatan");
    const des = qs(prefix + "desa");
    const rw = qs(prefix + "rw");
    const rt = qs(prefix + "rt");

    if (!prov) return;

    // INIT PROVINSI
    setOptions(prov, Object.keys(WILAYAH_DATA), "Pilih Provinsi");

    // =====================
    // PROVINSI
    // =====================
    prov.onchange = () => {
      setOptions(kab, Object.keys(WILAYAH_DATA[prov.value] || {}), "Pilih Kab");
      setOptions(kec, []);
      setOptions(des, []);
      setOptions(rw, []);
      setOptions(rt, []);
    };

    // =====================
    // KABUPATEN
    // =====================
    kab.onchange = () => {
      setOptions(
        kec,
        Object.keys(WILAYAH_DATA[prov.value]?.[kab.value] || {}),
        "Pilih Kecamatan",
      );
      setOptions(des, []);
      setOptions(rw, []);
      setOptions(rt, []);
    };

    // =====================
    // KECAMATAN
    // =====================
    kec.onchange = () => {
      setOptions(
        des,
        Object.keys(WILAYAH_DATA[prov.value]?.[kab.value]?.[kec.value] || {}),
        "Pilih Desa",
      );
      setOptions(rw, []);
      setOptions(rt, []);
    };

    // =====================
    // DESA → RW
    // =====================
    des.onchange = () => {
      const data =
        WILAYAH_DATA[prov.value]?.[kab.value]?.[kec.value]?.[des.value] || {};

      // 🔥 FIX: pastikan string + sort
      const rwList = Object.keys(data)
        .map((v) => String(v))
        .sort((a, b) => Number(a) - Number(b));

      setOptions(rw, rwList, "Pilih RW");
      setOptions(rt, []);

      // =====================
      // RW → RT
      // =====================
      rw.onchange = () => {
        const rtList = (data[rw.value] || [])
          .map((v) => String(v))
          .sort((a, b) => Number(a) - Number(b));

        setOptions(rt, rtList, "Pilih RT");
      };
    };
  }

  /* =====================
   * PUBLIC INIT
   * ===================== */
  window.initWilayah = async function () {
    // LOAD DATA CUMA SEKALI
    if (!window.__wilayahDataLoaded) {
      await loadWilayah();
      window.__wilayahDataLoaded = true;
    }

    // 🔥 INIT CASCADE SELALU DIJALANKAN
    initCascade("sel_");
    initCascade("edtA_");
  };
  /* =====================
   * AUTO LOAD
   * ===================== */
  document.addEventListener("DOMContentLoaded", () => {
    initWilayah();
  });
})();
