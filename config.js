let isInitPengaturan = false;

function initPengaturan() {
  if (isInitPengaturan) return;
  isInitPengaturan = true;

  const rwEl = document.getElementById("kk_rw");
  const rtEl = document.getElementById("kk_rt");

  if (!rwEl || !rtEl) {
    console.warn("Form belum siap broo...");
    return;
  }

  loadRWRTOnly(); // 🔥 INI WAJIB

  rwEl.addEventListener("change", generateTPS);
  rtEl.addEventListener("change", generateTPS);

  console.log("✅ Event TPS aktif");
}

function generateTPS() {
  const rw = document.getElementById("kk_rw").value;
  const rt = document.getElementById("kk_rt").value;

  if (!rw || !rt) {
    document.getElementById("kk_tps").value = "";
    return;
  }

  const rwFix = rw.padStart(2, "0");
  const rtFix = rt.padStart(2, "0");

  const tps = `TPS ${rwFix}${rtFix}`;
  document.getElementById("set_tps").value = tps;
}

// trigger

function loadPengaturan() {
  apiGet("getConfig")
    .then((res) => {
      if (!res.status) return;

      const cfg = res.data || {};

      if (cfg.TPS) {
        const tps = cfg.TPS.replace("TPS ", "");

        const rwVal = String(parseInt(tps.substring(0, 2)));
        const rtVal = String(parseInt(tps.substring(2, 4)));

        const rwEl = document.getElementById("kk_rw");
        const rtEl = document.getElementById("kk_rt");

        // 🔥 tunggu RW sudah keisi (tanpa delay)
        const checkReady = setInterval(() => {
          if (rwEl.options.length > 1) {
            clearInterval(checkReady);

            rwEl.value = rwVal;
            rwEl.dispatchEvent(new Event("change"));

            // tunggu RT keisi
            const checkRT = setInterval(() => {
              if (rtEl.options.length > 1) {
                clearInterval(checkRT);

                rtEl.value = rtVal;
                generateTPS();
              }
            }, 50);
          }
        }, 50);

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
  const rw = document.getElementById("kk_rw").value.trim();
  const rt = document.getElementById("kk_rt").value.trim();
  const lokasi = document.getElementById("set_lokasi").value.trim();
  const waktu = document
    .getElementById("set_waktu")
    .value.replace(/–/g, "-") // 🔥 fix karakter dash
    .replace(/\s+/g, " ")
    .trim();

  if (!rw || !rt || !lokasi || !waktu) {
    toastError("Lengkapi semua data broo");
    return;
  }

  // 🔥 ambil data global
  const data = window.dataConfigGlobal || [];

  // 🔥 cek apakah sudah ada
  const sudahAda = data.some(
    (d) => String(d.RW).trim() === rw && String(d.RT).trim() === rt,
  );

  const mode = sudahAda ? "update" : "insert";

  showLoading();

  apiPost("saveTPS", {
    rw,
    rt,
    lokasi,
    waktu,
  })
    .then((res) => {
      hideLoading();

      if (res.status) {
        // 🔥 notif beda
        if (mode === "update") {
          toastSuccess(`TPS RW ${rw} RT ${rt} berhasil diupdate 🔄`);
        } else {
          toastSuccess(`TPS RW ${rw} RT ${rt} berhasil ditambahkan ➕`);
        }

        // 🔥 reset form biar clean
        document.getElementById("set_lokasi").value = "";
        document.getElementById("set_waktu").value = "";

        loadTableConfig();
        generateTPS();
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
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="6">Loading...</td></tr>`;

  apiGet("getAllTPS")
    .then((res) => {
      if (!res.status) {
        tbody.innerHTML = `<tr><td colspan="6">Gagal load data</td></tr>`;
        return;
      }

      const data = res.data || [];
      window.dataConfigGlobal = data;

      if (!data.length) {
        tbody.innerHTML = `<tr><td colspan="6">Belum ada data</td></tr>`;
        return;
      }

      let html = "";

      data.forEach((d, i) => {
        html += `
          <tr>
            <td>${i + 1}</td>
            <td>${d.TPS || "-"}</td>
            <td>${d.RW || "-"}</td>
            <td>${d.RT || "-"}</td>
            <td>${d.LOKASI || "-"}</td>
            <td>${d.WAKTU || "-"}</td>
            <td>
              <button class="btn-delete" onclick="hapusTPS('${d.RW}','${d.RT}')">
                🗑
              </button>
            </td>
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

function hapusTPS(rw, rt) {
  showConfirm(`Hapus TPS RW ${rw} RT ${rt}?`, () => {
    showLoading();

    apiPost("deleteTPS", { rw, rt })
      .then((res) => {
        hideLoading();

        if (res.status) {
          toastSuccess(`TPS RW ${rw} RT ${rt} berhasil dihapus 🗑`);
          loadTableConfig();
        } else {
          toastError(res.message);
        }
      })
      .catch((err) => {
        hideLoading();
        console.error(err);
        toastError("Server error");
      });
  });
}

function loadRWRTOnly() {
  apiGet("getWilayah").then((res) => {
    const data = res || {};

    // 🔥 ambil langsung lokasi kamu
    const rwData =
      data["Jawa Barat"]?.["Bekasi"]?.["Babelan"]?.["Kedung Jaya"] || {};

    const rwEl = document.getElementById("kk_rw");
    const rtEl = document.getElementById("kk_rt");

    if (!rwEl || !rtEl) return;

    // 🔥 isi RW
    rwEl.innerHTML =
      '<option value="">Pilih RW</option>' +
      Object.keys(rwData)
        .map((rw) => `<option value="${rw}">${rw}</option>`)
        .join("");

    // 🔥 onchange RW → isi RT
    rwEl.onchange = () => {
      const listRT = rwData[rwEl.value] || [];

      rtEl.innerHTML =
        '<option value="">Pilih RT</option>' +
        listRT.map((rt) => `<option value="${rt}">${rt}</option>`).join("");

      generateTPS(); // 🔥 langsung update TPS
    };
  });
}
