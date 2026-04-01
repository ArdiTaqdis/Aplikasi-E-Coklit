let currentNIK = null;
let filterStatus = "SEMUA";
let dataValidasiGlobal = [];
let searchTimer;
let currentPage = 1;
const PAGE_SIZE = 5;
let dataView = [];

function loadValidasi(page = 1) {
  showLoading();

  const session = JSON.parse(localStorage.getItem("userSession") || "{}");

  apiGet("getValidasi", {
    username: session.username,
    page: page,
    limit: 5,
    search: keyword, //
  })
    .then((res) => {
      console.log("HASIL SERVER:", res);

      hideLoading();

      if (!res || !res.data) {
        console.log("❌ DATA KOSONG");
        return;
      }

      console.log("JUMLAH DATA:", res.data.length);

      dataValidasiGlobal = res.data;
      currentPage = res.page;

      renderValidasi(res.data);
      renderPaginationServer(res.total);
    })
    .catch((err) => {
      hideLoading();
      console.error(err);
    });
}

function setFilter(status, btn) {
  filterStatus = status;

  /* aktifkan tombol */

  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));

  btn.classList.add("active");

  /* filter data */

  let data = dataValidasiGlobal;

  if (status === "BELUM") {
    data = data.filter((d) => d["Status"] !== "Sudah Coklit");
  }

  if (status === "SUDAH") {
    data = data.filter((d) => d["Status"] === "Sudah Coklit");
  }

  renderValidasi(data);
}

function searchValidasi() {
  const keyword = document.getElementById("searchValidasi").value;

  clearTimeout(searchTimer);

  searchTimer = setTimeout(() => {
    loadValidasi(1, keyword); // 🔥 kirim ke server
  }, 400); // debounce biar gak spam
}

function renderValidasi(data) {
  const box = document.getElementById("validasiList");
  if (!box) return;

  box.innerHTML = "";

  let group = {};

  data.forEach((w) => {
    const kk = w["NO KK"];
    if (!group[kk]) group[kk] = [];
    group[kk].push(w);
  });

  Object.keys(group).forEach((kk) => {
    const anggota = group[kk];

    const total = anggota.length;
    const selesai = anggota.filter(
      (a) => a["Status"] === "Sudah Coklit",
    ).length;

    const persen = total ? (selesai / total) * 100 : 0;

    const card = document.createElement("div");
    card.className = "kk-group";

    card.innerHTML = `
      <div class="kk-header">
        <div>
          <div class="kk-title">🏠 No KK : ${kk}</div>
          <div class="kk-progress">Progress : ${selesai}/${total}</div>

          <div class="progress-bar">
            <div class="progress-fill" style="width:${persen}%"></div>
          </div>
        </div>
      </div>
    `;

    anggota.forEach((a) => {
      const row = document.createElement("div");
      row.className = "anggota-item";

      row.innerHTML = `
        <div class="anggota-info">
          <div class="anggota-name">${a["Nama Lengkap"]}</div>
          <div>NIK : ${a["NIK"]}</div>

          ${
            a["Status"] === "Sudah Coklit"
              ? `<span class="badge-selesai">✔ Sudah</span>`
              : `<span class="badge-belum">Belum</span>`
          }
        </div>

        <div>
          ${
            a["Status"] === "Sudah Coklit"
              ? ""
              : `<button onclick="openCoklitByNIK('${a["NIK"]}')" class="btn-coklit">
                  ✔ Coklit
                </button>`
          }
        </div>
      `;

      card.appendChild(row);
    });

    box.appendChild(card);
  });
}

function openCoklitByNIK(nik) {
  const data = dataValidasiGlobal.find((d) => d["NIK"] == nik);
  if (!data) return;

  openCoklitDirect(data);
}

function renderPagination(totalData) {
  const totalPage = Math.ceil(totalData / PAGE_SIZE);

  const container = document.getElementById("paginationValidasi");
  if (!container) return;

  // 🔥 kalau cuma 1 halaman, tetap tampilkan info
  if (totalPage <= 1) {
    container.innerHTML = `<span style="font-size:12px;color:#666;">
      Total ${totalData} data
    </span>`;
    return;
  }

  container.innerHTML = "";

  for (let i = 1; i <= totalPage; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;

    if (i === currentPage) btn.classList.add("active");

    btn.onclick = () => {
      currentPage = i;
      renderValidasi(dataView);
    };

    container.appendChild(btn);
  }
}

function renderPaginationServer(totalData) {
  const totalPage = Math.ceil(totalData / PAGE_SIZE);
  const container = document.getElementById("paginationValidasi");

  container.innerHTML = "";

  if (totalPage <= 1) return;

  // 🔥 PREV BUTTON
  if (currentPage > 1) {
    const prev = document.createElement("button");
    prev.innerText = "⬅️";
    prev.onclick = () => loadValidasi(currentPage - 1);
    container.appendChild(prev);
  }

  // 🔥 RANGE (BIAR GAK PENUH)
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPage, currentPage + 2);

  // 🔥 DOT AWAL
  if (start > 1) {
    const first = document.createElement("button");
    first.innerText = "1";
    first.onclick = () => loadValidasi(1);
    container.appendChild(first);

    if (start > 2) {
      const dots = document.createElement("span");
      dots.innerText = "...";
      container.appendChild(dots);
    }
  }

  // 🔥 PAGE NUMBER
  for (let i = start; i <= end; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;

    if (i === currentPage) {
      btn.classList.add("active");
    }

    btn.onclick = () => loadValidasi(i);

    container.appendChild(btn);
  }

  // 🔥 DOT AKHIR
  if (end < totalPage) {
    if (end < totalPage - 1) {
      const dots = document.createElement("span");
      dots.innerText = "...";
      container.appendChild(dots);
    }

    const last = document.createElement("button");
    last.innerText = totalPage;
    last.onclick = () => loadValidasi(totalPage);
    container.appendChild(last);
  }

  // 🔥 NEXT BUTTON
  if (currentPage < totalPage) {
    const next = document.createElement("button");
    next.innerText = "➡️";
    next.onclick = () => loadValidasi(currentPage + 1);
    container.appendChild(next);
  }
}

function openCoklitDirect(data) {
  currentNIK = data["NIK"];

  const detail = document.getElementById("detailPemilih");

  detail.innerHTML = `

<div class="form-grid">

<div>
<label>No KK</label>
<input id="f_nokk" value="${data["NO KK"]}" readonly>
</div>

<div>
<label>NIK</label>
<input id="f_nik" value="${data["NIK"]}" readonly>
</div>

<div>
<label>Nama Lengkap</label>
<input id="f_nama" value="${data["Nama Lengkap"]}">
</div>

<div>
<label>Hubungan</label>
<input id="f_hubungan" value="${data["Hubungan dlm Klg"]}">
</div>

<div>
<label>Jenis Kelamin</label>
<select id="f_jk">
  <option ${data["Jenis Kelamin"] == "Laki-laki" ? "selected" : ""}>Laki-laki</option>
  <option ${data["Jenis Kelamin"] == "Perempuan" ? "selected" : ""}>Perempuan</option>
</select>
</div>

<div>
<label>Tempat Lahir</label>
<input id="f_tempat" value="${data["Tempat Lahir"]}">
</div>

<div>
<label>Tanggal Lahir</label>
<input type="date" id="f_tgl" value="${formatDateInput(data["Tanggal Lahir"])}">
</div>

<div>
<label>Agama</label>
<input id="f_agama" value="${data["Agama"]}">
</div>

<div>
<label>Pendidikan</label>
<input id="f_pendidikan" value="${data["Pendidikan"]}">
</div>

<div>
<label>Pekerjaan</label>
<input id="f_pekerjaan" value="${data["Jenis Pekerjaan"]}">
</div>

<div>
<label>Status Perkawinan</label>
<select id="f_kawin">
  <option ${data["Status Perkawinan"] == "Belum Kawin" ? "selected" : ""}>Belum Kawin</option>
  <option ${data["Status Perkawinan"] == "Kawin" ? "selected" : ""}>Kawin</option>
  <option ${data["Status Perkawinan"] == "Cerai Hidup" ? "selected" : ""}>Cerai Hidup</option>
  <option ${data["Status Perkawinan"] == "Cerai Mati" ? "selected" : ""}>Cerai Mati</option>
</select>
</div>

<div>
<label>Kewarganegaraan</label>
<input id="f_warga" value="${data["Kewarganegaraan"]}">
</div>

<div>
<label>No Paspor</label>
<input id="f_paspor" value="${data["No Paspor"]}">
</div>

<div>
<label>No KITAP/KITAS</label>
<input id="f_kitap" value="${data["No KITAP_KITAS"]}">
</div>

<div>
<label>Ayah Kandung</label>
<input id="f_ayah" value="${data["Ayah Kandung"]}">
</div>

<div>
<label>Ibu Kandung</label>
<input id="f_ibu" value="${data["Ibu Kandung"]}">
</div>

<div style="grid-column: span 2;">
<label>📞 No HP (Kepala Keluarga)</label>
<input id="f_nohp" placeholder="Contoh Format 628xxxxxxxxxx">
</div>

</div>
`;

  // ✅ SET STATUS
  document.getElementById("statusCoklit").value = data["Status"] || "";
  document.getElementById("ketCoklit").value = data["Keterangan"] || "";

  // 🔥 AUTO RULE UMUR
  const umur = hitungUmur(formatDateInput(data["Tanggal Lahir"]));

  if (umur < 17) {
    document.getElementById("statusCoklit").value = "Tersaring";
    document.getElementById("ketCoklit").value = "Dibawah Umur";
    toggleKeterangan();
  }

  // 🔥 TAMPILKAN MODAL
  document.getElementById("modalCoklit").style.display = "flex";

  // 🔥 LOAD NO HP
  apiGet("getNoHP", { noKK: data["NO KK"] })
    .then((res) => {
      if (res && res.nohp !== undefined) {
        document.getElementById("f_nohp").value = res.nohp || "";
      }
    })
    .catch(() => {});
}

function formatDateInput(val) {
  if (!val) return "";

  const parts = val.split("-");
  if (parts.length !== 3) return "";

  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function closeModalCoklit() {
  document.getElementById("modalCoklit").style.display = "none";
}

function toggleKeterangan() {
  const status = document.getElementById("statusCoklit").value;

  const ket = document.getElementById("ketCoklit");

  if (status === "Tersaring") {
    ket.style.display = "block";
  } else {
    ket.style.display = "none";
  }
}

window.simpanCoklit = function () {
  try {
    const val = (id) => {
      const el = document.getElementById(id);
      return el ? el.value : "";
    };

    let nohpInput = val("f_nohp");
    let nohp = normalizeNoHP(nohpInput);

    const tgl = val("f_tgl");
    const umur = hitungUmur(tgl);

    // ✅ VALIDASI NO HP
    // ✅ VALIDASI NO HP (opsional)
    if (nohpInput && !nohp) {
      toastError("Format nomor HP tidak valid (contoh: 628123456789)");
      return;
    }

    // 🔥 AMBIL STATUS AWAL
    let status = val("statusCoklit");
    let ket = val("ketCoklit");

    // 🔥 AUTO RULE UMUR
    if (umur < 17) {
      status = "Tersaring";
      ket = "Dibawah Umur";

      document.getElementById("statusCoklit").value = status;
      document.getElementById("ketCoklit").value = ket;

      toggleKeterangan();
    }

    // ✅ VALIDASI STATUS SETELAH RULE
    if (!status) {
      toastError("Pilih status Terlebih dahulu");
      return;
    }

    const userSession = JSON.parse(localStorage.getItem("userSession") || "{}");
    const userName = userSession.username || "Admin";

    const data = {
      nik: currentNIK,
      nokk: val("f_nokk"),
      nama: val("f_nama"),
      hubungan: val("f_hubungan"),
      jk: val("f_jk"),
      tempat: val("f_tempat"),
      tanggal: tgl,
      agama: val("f_agama"),
      pendidikan: val("f_pendidikan"),
      pekerjaan: val("f_pekerjaan"),
      kawin: val("f_kawin"),
      warga: val("f_warga"),
      paspor: val("f_paspor"),
      kitap: val("f_kitap"),
      ayah: val("f_ayah"),
      ibu: val("f_ibu"),
      status: status,
      keterangan: ket,
      user: userName,
      nohp: nohp,
    };

    if (typeof showLoading === "function") showLoading();

    apiPost("updateFullData", data)
      .then((res) => {
        if (typeof hideLoading === "function") hideLoading();

        if (!res || !res.success) {
          toastError(res?.message || "Gagal menyimpan");
          return;
        }

        toastSuccess("Berhasil disimpan 🔥");

        // 🔥 PRIORITAS UI
        closeModalCoklit();

        // 🔥 PROSES BERAT DI BELAKANG
        setTimeout(() => {
          loadValidasi();
        }, 200);
      })
      .catch((err) => {
        if (typeof hideLoading === "function") hideLoading();

        console.error("❌ ERROR API:", err);
        toastError("Server error");
      });
  } catch (err) {
    console.error("❌ ERROR JS:", err);
    alert("Terjadi error di sistem");
  }
};

function normalizeNoHP(nohp) {
  if (!nohp) return "";

  // hapus semua selain angka
  nohp = nohp.replace(/\D/g, "");

  if (nohp.startsWith("0")) {
    return "62" + nohp.slice(1);
  }

  if (nohp.startsWith("62")) {
    return nohp;
  }

  return ""; // tidak valid
}

function hitungUmur(tglLahir) {
  if (!tglLahir) return 0;

  const today = new Date();
  const birth = new Date(tglLahir);

  let umur = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    umur--;
  }

  return umur;
}
