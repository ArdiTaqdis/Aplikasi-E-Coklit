function tambahUser(data) {
  const user = getUserSession(data.usernameLogin);

  if (!user || user.role !== "ADMIN") {
    return { status: false, message: "Akses ditolak 🚫" };
  }

  const sheet = _getSS().getSheetByName("Users");
  const all = sheet.getDataRange().getValues();

  // 🔥 CEK DUPLIKAT
  const exists = all.some(
    (r) => String(r[0]).toLowerCase() === String(data.username).toLowerCase(),
  );

  if (exists) {
    return { status: false, message: "Username sudah ada" };
  }

  sheet.appendRow([data.username, data.password, "PETUGAS", data.rw, data.rt]);

  return { status: true };
}

window.loadUsers = function () {
  const session = JSON.parse(localStorage.getItem("userSession") || "{}");

  if (!session.username) {
    toastError("Session tidak ditemukan");
    return;
  }

  showLoading();

  apiGet("getUsers", {
    username: session.username,
  })
    .then((res) => {
      hideLoading();

      if (!res.status) {
        toastError(res.message || "Gagal load user");
        return;
      }

      renderUsers(res.data || []);
    })
    .catch((err) => {
      hideLoading();
      console.error(err);
      toastError("Error load user");
    });
};

function renderUsers(data) {
  const tbody = document.getElementById("tbodyUsers");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="6">Tidak ada data</td></tr>`;
    return;
  }

  data.forEach((u, i) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${u.username}</td>
      <td>${u.role}</td>
      <td>${u.rw}</td>
      <td>${u.rt}</td>
      <td>
        
        <button onclick="hapusUserConfirm('${u.username}')">🗑️</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

window.hapusUserConfirm = function (username) {
  showConfirm(`Hapus user ${username}?`, () => {
    hapusUser(username);
  });
};

window.hapusUser = function (username) {
  const session = JSON.parse(localStorage.getItem("userSession") || "{}");

  showLoading();

  apiPost("hapusUser", {
    usernameLogin: session.username,
    username: username,
  })
    .then((res) => {
      hideLoading();

      if (!res.status) {
        toastError(res.message || "Gagal hapus user");
        return;
      }

      toastSuccess("User berhasil dihapus");

      // 🔥 reload tabel
      loadUsers();
    })
    .catch((err) => {
      hideLoading();
      console.error(err);
      toastError("Error hapus user");
    });
};

window.tambahPetugas = function () {
  const session = JSON.parse(localStorage.getItem("userSession") || "{}");

  const username = $("pt_username").value.trim();
  const password = $("pt_password").value.trim();
  const rw = document.getElementById("sel_rw").value;
  const rt = document.getElementById("sel_rt").value;

  if (!username || !password || !rw || !rt) {
    toastError("Lengkapi semua field ");
    return;
  }

  showLoading();

  apiPost("tambahUser", {
    usernameLogin: session.username,
    username,
    password,
    rw,
    rt,
  })
    .then((res) => {
      hideLoading();

      if (!res.status) {
        toastError(res.message);
        return;
      }

      toastSuccess("Petugas berhasil ditambahkan");

      // 🔥 reset form
      $("pt_username").value = "";
      $("pt_password").value = "";
      document.getElementById("sel_rw").value = "";
      document.getElementById("sel_rt").innerHTML =
        '<option value="">Pilih RT</option>';

      // 🔥 reload tabel
      loadUsers();
    })
    .catch((err) => {
      hideLoading();
      console.error(err);
      toastError("Gagal tambah petugas");
    });
};

let DATA_WILAYAH = {};

function loadRWRT() {
  apiGet("getWilayah").then((res) => {
    DATA_WILAYAH = res || {};

    // 🔥 langsung ambil lokasi fix
    const rwData =
      DATA_WILAYAH["Jawa Barat"]?.["Bekasi"]?.["Babelan"]?.["Kedung Jaya"] ||
      {};

    const selRW = document.getElementById("sel_rw");
    const selRT = document.getElementById("sel_rt");

    // isi RW
    selRW.innerHTML =
      '<option value="">Pilih RW</option>' +
      Object.keys(rwData)
        .map((rw) => `<option value="${rw}">${rw}</option>`)
        .join("");

    // onchange RW → isi RT
    selRW.onchange = () => {
      const listRT = rwData[selRW.value] || [];

      selRT.innerHTML =
        '<option value="">Pilih RT</option>' +
        listRT.map((rt) => `<option value="${rt}">${rt}</option>`).join("");
    };
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadRWRT();
});
