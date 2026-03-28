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
        <button onclick="editUser('${u.username}')">✏️</button>
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

window.tambahPetugas = function () {
  const session = JSON.parse(localStorage.getItem("userSession") || "{}");

  const username = $("pt_username").value.trim();
  const password = $("pt_password").value.trim();
  const rw = $("pt_rw").value.trim();
  const rt = $("pt_rt").value.trim();

  if (!username || !password || !rw || !rt) {
    toastError("Lengkapi semua field broo 😅");
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
      $("pt_rw").value = "";
      $("pt_rt").value = "";

      // 🔥 reload tabel
      loadUsers();
    })
    .catch((err) => {
      hideLoading();
      console.error(err);
      toastError("Gagal tambah petugas");
    });
};
