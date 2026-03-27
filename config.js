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

        loadTableConfig(); // 🔥 reload table
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

function loadTableConfig() {
  const tbody = document.getElementById("bodyConfig");

  tbody.innerHTML = `<tr><td colspan="6">Loading...</td></tr>`;

  apiGet("getAllTPS")
    .then((res) => {
      if (!res.status) {
        tbody.innerHTML = `<tr><td colspan="6">Gagal load data</td></tr>`;
        return;
      }

      const data = res.data || [];

      if (!data.length) {
        tbody.innerHTML = `<tr><td colspan="6">Belum ada data</td></tr>`;
        return;
      }

      let html = "";

      data.forEach((d, i) => {
        html += `
          <tr>
            <td>${i + 1}</td>
            <td>${d.TPS}</td>
            <td>${d.RW}</td>
            <td>${d.RT}</td>
            <td>${d.LOKASI}</td>
            <td>${d.WAKTU}</td>
          </tr>
        `;
      });

      tbody.innerHTML = html;
    })
    .catch((err) => {
      console.error(err);
      tbody.innerHTML = `<tr><td colspan="6">Error server</td></tr>`;
    });
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    loadPengaturan();
    loadTableConfig();
  }, 300);
});
