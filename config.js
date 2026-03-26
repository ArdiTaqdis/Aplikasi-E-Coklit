function generateTPS() {
  const rw = document.getElementById("set_rw").value;
  const rt = document.getElementById("set_rt").value;

  if (!rw || !rt) {
    document.getElementById("set_tps").value = "";
    return;
  }

  const tps = `TPS ${rw}${rt}`;
  document.getElementById("set_tps").value = tps;
}

// trigger
document.addEventListener("change", function (e) {
  if (e.target.id === "set_rw" || e.target.id === "set_rt") {
    generateTPS();
  }
});

function loadPengaturan() {
  apiGet("getConfig")
    .then((res) => {
      if (!res.status) return;

      const cfg = res.data || {};

      // TPS → pecah ke RW RT
      if (cfg.TPS) {
        const tps = cfg.TPS.replace("TPS ", "");

        if (tps.length >= 4) {
          document.getElementById("set_rw").value = tps.substring(0, 2);
          document.getElementById("set_rt").value = tps.substring(2, 4);
        }

        document.getElementById("set_tps").value = cfg.TPS;
      }

      document.getElementById("set_lokasi").value = cfg.LOKASI || "";
      document.getElementById("set_waktu").value = cfg.WAKTU || "";
    })
    .catch((err) => {
      console.error(err);
      toastError("Gagal load pengaturan");
    });
}

function simpanPengaturan() {
  const rw = document.getElementById("set_rw").value;
  const rt = document.getElementById("set_rt").value;
  const lokasi = document.getElementById("set_lokasi").value;
  const waktu = document.getElementById("set_waktu").value;

  if (!rw || !rt || !lokasi || !waktu) {
    toastError("Lengkapi semua data broo");
    return;
  }

  showLoading();

  apiPost("saveTPS", {
    rw: rw,
    rt: rt,
    lokasi: lokasi,
    waktu: waktu,
  })
    .then((res) => {
      hideLoading();

      if (res.status) {
        toastSuccess("TPS berhasil disimpan 🔥");
      } else {
        toastError(res.message);
      }
    })
    .catch((err) => {
      hideLoading();
      console.error(err);
      toastError("Server error");
    });
}

function loadTPSOtomatis() {
  const rw = document.getElementById("set_rw").value;
  const rt = document.getElementById("set_rt").value;

  if (!rw || !rt) return;

  showLoading();

  apiGet("getTPS", { rw, rt })
    .then((res) => {
      hideLoading();

      if (res.status) {
        const data = res.data;

        // isi form
        document.getElementById("set_tps").value = data.TPS;
        document.getElementById("set_lokasi").value = data.LOKASI;
        document.getElementById("set_waktu").value = data.WAKTU;

        toastSuccess("Data TPS ditemukan 🔥");
      } else {
        // reset kalau tidak ada
        document.getElementById("set_lokasi").value = "";
        document.getElementById("set_waktu").value = "";

        generateTPS(); // tetap isi TPS

        toastError("TPS belum ada, silakan isi baru");
      }
    })
    .catch((err) => {
      hideLoading();
      console.error(err);
      toastError("Gagal load TPS");
    });
}

document.getElementById("set_rw").addEventListener("change", () => {
  generateTPS();
  loadTPSOtomatis();
});

document.getElementById("set_rt").addEventListener("change", () => {
  generateTPS();
  loadTPSOtomatis();
});
