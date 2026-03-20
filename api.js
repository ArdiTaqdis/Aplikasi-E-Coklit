/* =========================
BASE URL
========================= */
const BASE_URL =
  "https://script.google.com/macros/s/AKfycbw0eNcuKgze3vo5aoxHsEi3dI01ixdYiXtxiTps5tyhV_pWFMNZbc8W7vtpKWE1X-KR/exec";

/* =========================
HELPER AUTO ENCODE
========================= */
function encodeParams(params = {}) {
  const result = {};

  Object.keys(params).forEach((key) => {
    const val = params[key];

    // kalau object → stringify + encode
    if (typeof val === "object") {
      result[key] = encodeURIComponent(JSON.stringify(val));
    } else {
      result[key] = encodeURIComponent(val);
    }
  });

  return result;
}

/* =========================
CORE API (GET ONLY - ANTI CORS)
========================= */
function api(action, params = {}) {
  const url = new URL(BASE_URL);

  url.searchParams.append("action", action);

  const encoded = encodeParams(params);

  Object.keys(encoded).forEach((key) => {
    url.searchParams.append(key, encoded[key]);
  });

  return fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("HTTP Error");
      return res.json();
    })
    .catch((err) => {
      console.error("API ERROR:", err);
      throw err;
    });
}

/* =========================
API OBJECT
========================= */

const API = {
  /* =====================
   * WILAYAH
   * ===================== */
  getWilayah(cb) {
    showLoading();

    api("getWilayah")
      .then((res) => {
        hideLoading();
        state.wilayah = res || {};
        cb && cb(res);
      })
      .catch(() => {
        hideLoading();
        toastError("Gagal ambil wilayah");
      });
  },

  /* =====================
   * KELUARGA
   * ===================== */
  getKeluarga(noKK, cb) {
    showLoading();

    api("getKeluarga", { noKK })
      .then((res) => {
        hideLoading();

        state.noKKAktif = noKK;
        state.kepala = res?.kepala || null;
        state.anggota = res?.anggota || [];

        cb && cb(res);
      })
      .catch(() => {
        hideLoading();
        toastError("Gagal ambil data keluarga");
      });
  },

  /* =====================
   * SIMPAN KK (AUTO ENCODE 🔥)
   * ===================== */
  simpanKK(dataA, dataB, cb) {
    showLoading();

    api("simpanKK", { dataA, dataB })
      .then((res) => {
        hideLoading();

        if (!res || res.status === false) {
          toastError(res?.message || "Gagal simpan");
          return;
        }

        toastSuccess(res.message || "Berhasil disimpan");
        cb && cb(res);
      })
      .catch(() => {
        hideLoading();
        toastError("Server error");
      });
  },

  /* =====================
   * ANGGOTA
   * ===================== */
  simpanAnggota(data, cb) {
    showLoading();

    api("simpanAnggota", { data })
      .then((res) => {
        hideLoading();

        if (!res.status) {
          toastError(res.message);
          return;
        }

        toastSuccess(res.message || "Berhasil");
        cb && cb(res);
      })
      .catch(() => {
        hideLoading();
        toastError("Server error");
      });
  },

  updateAnggota(data, cb) {
    showLoading();

    api("updateAnggota", data)
      .then((res) => {
        hideLoading();

        if (!res.success) {
          toastError(res.message);
          return;
        }

        toastSuccess("Berhasil update");
        cb && cb(res);
      })
      .catch(() => {
        hideLoading();
        toastError("Server error");
      });
  },

  hapusAnggota(nik, cb) {
    if (!confirm("Hapus anggota ini?")) return;

    showLoading();

    api("hapusAnggota", { nik })
      .then(() => {
        hideLoading();
        toastSuccess("Anggota dihapus");
        cb && cb();
      })
      .catch(() => {
        hideLoading();
        toastError("Gagal hapus");
      });
  },

  /* =====================
   * SUMMARY
   * ===================== */
  getSummary(cb) {
    api("getSummary")
      .then((res) => cb && cb(res))
      .catch(() => toastError("Gagal load statistik"));
  },
};

window.api = API;
