function loadStatistik() {
  apiGet("getStatistik").then((res) => {
    if (!res.status) return;

    const d = res.data;

    animateValue("totalKK", d.jumlah_kk || 0);
    animateValue("totalWarga", d.jumlah_warga || 0);
    animateValue("totalPemilih", d.jumlah_pemilih || 0);

    animateValue("meninggal", d.meninggal || 0);
    animateValue("pindah", d.pindah || 0);
    animateValue("ganda", d.ganda || 0);
    animateValue("dibawahUmur", d.dibawah_umur || 0);

    // 🔥 CHART
    renderChart(d);

    // last update
    const el = document.getElementById("lastUpdate");
    if (el) {
      el.innerText = d.last_update
        ? new Date(d.last_update).toLocaleString()
        : "-";
    }
  });
}

// 🔥 UPDATE BUTTON
function updateStatistik(btn) {
  btn.disabled = true;
  btn.innerText = "⏳ Menghitung...";

  apiGet("generateStatistik")
    .then((res) => {
      if (!res.status) {
        toastError("Gagal update");
        return;
      }

      toastSuccess("Statistik berhasil diupdate");
      loadStatistik();
    })
    .finally(() => {
      btn.disabled = false;
      btn.innerText = "🔄 Update Data Statistik";
    });
}

// 🔥 ANIMASI ANGKA
function animateValue(id, end, duration = 500) {
  const el = document.getElementById(id);
  if (!el) return;

  let start = 0;
  let startTime = null;

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;

    const progress = Math.min((currentTime - startTime) / duration, 1);
    el.innerText = Math.floor(progress * (end - start) + start);

    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

let chartDonut, chartRW;

function renderChart(d) {
  // 🔥 DONUT
  const ctx1 = document.getElementById("chartDonut");

  if (chartDonut) chartDonut.destroy();

  chartDonut = new Chart(ctx1, {
    type: "doughnut",
    data: {
      labels: ["Sudah", "Belum", "Tersaring"],
      datasets: [
        {
          data: [d.sudah || 0, d.belum || 0, d.tersaring || 0],
          backgroundColor: ["#22c55e", "#facc15", "#ef4444"],
        },
      ],
    },
  });

  // 🔥 BAR RW
  const ctx2 = document.getElementById("chartRW");

  if (chartRW) chartRW.destroy();

  const rwData = JSON.parse(d.rw_json || "{}");

  chartRW = new Chart(ctx2, {
    type: "bar",
    data: {
      labels: Object.keys(rwData),
      datasets: [
        {
          label: "Jumlah KK",
          data: Object.values(rwData),
          backgroundColor: "#3b82f6",
        },
      ],
    },
  });

  // 🔥 PROGRESS
  const progress = d.progress || 0;

  document.getElementById("progressFill").style.width = progress + "%";
  document.getElementById("progressText").innerText = progress + "%";
}
