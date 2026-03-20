/* ======================================================
 * state.html — Global Application State (FINAL)
 * ======================================================
 * - Menyimpan DATA aktif aplikasi (bukan logic)
 * - Satu-satunya sumber kebenaran frontend
 * - Aman untuk refactor & scaling
 * ====================================================== */

window.state = {
  /* =====================
   * DATA AKTIF
   * ===================== */

  // Nomor KK yang sedang ditampilkan
  noKKAktif: null,

  // Data Kepala Keluarga (object dari server)
  kepala: null,

  // Daftar Anggota Keluarga (array of object)
  anggota: [],

  /* =====================
   * DATA WILAYAH
   * ===================== */

  // Cache wilayah (Provinsi → Kab → Kec → Desa → RW → RT)
  wilayah: {},

  // Flag agar wilayah hanya di-load sekali
  wilayahLoaded: false,

  /* =====================
   * STATE UI
   * ===================== */

  // Mode halaman: 'view' | 'edit'
  mode: "view",
};
