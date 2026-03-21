/* =========================
BASE URL (WAJIB GANTI)
========================= */
const BASE_URL =
  "https://script.google.com/macros/s/AKfycbxLXz4lMm9zNdWpm7j6niHEFoJh5IKCAkd6jZojvtuRRjqLV_RHH2lJ9kG2bgp5QKmy/exec";

/* =========================
CORE API
========================= */

function apiGet(action, params = {}) {
  const url = new URL(BASE_URL);
  url.searchParams.append("action", action);

  Object.keys(params).forEach((key) => {
    url.searchParams.append(key, params[key]);
  });

  console.log("🌐 URL:", url.toString());

  return fetch(url)
    .then((res) => {
      console.log("📡 STATUS:", res.status);
      return res.text(); // 🔥 ambil raw dulu
    })
    .then((text) => {
      console.log("📦 RAW:", text); // 🔥 ini kunci

      try {
        return JSON.parse(text);
      } catch (err) {
        console.error("❌ BUKAN JSON:", text);
        throw new Error("Response bukan JSON");
      }
    });
}

function apiPost(action, data = {}) {
  const url = new URL(BASE_URL);

  url.searchParams.append("action", action);

  Object.keys(data).forEach((key) => {
    const val = data[key];

    // ❗ kalau string → kirim langsung
    if (typeof val === "string") {
      url.searchParams.append(key, val);
    } else {
      url.searchParams.append(key, JSON.stringify(val));
    }
  });

  return fetch(url).then((res) => res.json());
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

    apiGet("getWilayah")
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

    apiGet("getKeluarga", { noKK })
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
   * SIMPAN KK
   * ===================== */
  simpanKK(dataA, dataB, cb) {
    showLoading();

    apiPost("simpanKK", { dataA, dataB })
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
   * UPDATE KK
   * ===================== */
  updateKK(data, cb) {
    showLoading();

    apiPost("updateKK", data)
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

  /* =====================
   * HAPUS KK
   * ===================== */
  hapusKK(noKK, cb) {
    if (!confirm("Yakin hapus semua data keluarga?")) return;

    showLoading();

    apiPost("hapusKK", { noKK })
      .then((res) => {
        hideLoading();
        toastSuccess(res.message);
        cb && cb(res);
      })
      .catch(() => {
        hideLoading();
        toastError("Gagal hapus");
      });
  },

  /* =====================
   * ANGGOTA
   * ===================== */
  simpanAnggota(data, cb) {
    showLoading();

    apiPost("simpanAnggota", data)
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

    apiPost("updateAnggota", data)
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

    apiPost("hapusAnggota", { nik })
      .then((res) => {
        hideLoading();
        toastSuccess("Anggota dihapus");
        cb && cb(res);
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
    apiGet("getSummary")
      .then((res) => cb && cb(res))
      .catch(() => toastError("Gagal load statistik"));
  },
};

window.api = API;
