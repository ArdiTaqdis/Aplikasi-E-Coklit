window.simpanAnggotaKeluarga = function () {
  const get = (id) => document.getElementById(id)?.value || "";

  const data = {
    "NO KK": get("agt_noKK"),
    NIK: get("agt_nik"),
    "Nama Lengkap": get("agt_nama"),
    "Hubungan dlm Klg": get("agt_hubungan"),
    "Jenis Kelamin": get("agt_kelamin"),
    "Tempat Lahir": get("agt_tempat"),
    "Tanggal Lahir": get("agt_tanggal"),
    Agama: get("agt_agama"),
    Pendidikan: get("agt_pendidikan"),
    "Jenis Pekerjaan": get("agt_pekerjaan"),
    "Status Perkawinan": get("agt_status"),
    Kewarganegaraan: get("agt_kewarganegaraan"),
    "No Paspor": get("agt_paspor"),
    "No KITAP_KITAS": get("agt_kitap"),
    "Ayah Kandung": get("agt_ayah"),
    "Ibu Kandung": get("agt_ibu"),
  };

  if (!data["NO KK"]) {
    alert("NO KK belum terisi");
    return;
  }

  if (!data["NIK"]) {
    alert("NIK wajib diisi");
    return;
  }

  showLoading();

  if (!window.api || !api.simpanAnggota) {
    console.error("API belum siap");
    alert("API belum siap");
    return;
  }

  api.simpanAnggota(data);
  showLoading();
};
