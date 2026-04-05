const RW_RT = {
  1: ["01", "02", "03"],
  2: ["04", "05", "06"],
  3: ["01", "02", "03"],
  4: ["04", "06", "07"],
  5: ["05", "08", "09"],
  6: ["01", "02", "03"],
  7: ["04", "05", "12"],
  8: ["06", "07", "08"],
  9: ["09", "10", "11"],
  10: ["15", "16", "21"],
  11: ["17", "18", "19"],
  12: ["13", "14", "20"],
  13: ["22", "23", "24"],
  14: ["07", "08", "09", "10"],
  15: ["25", "26", "27"],
  16: ["01", "02"],
  17: ["03", "04"],
  18: ["01", "02"],
  19: ["01", "02", "03"],
  20: ["01", "02", "03"],
  21: ["01", "02"],
  22: ["01", "02", "03"],
  23: ["01", "02", "03"],
  24: ["01", "02", "03"],
  25: ["01", "02", "03"],
  26: ["01", "02", "03"],
};

function initWilayahStaticKK() {
  const rwSelect = document.getElementById("kk_rw_modal");
  const rtSelect = document.getElementById("kk_rt_modal");

  rwSelect.innerHTML = `<option value="">Pilih RW</option>`;
  rtSelect.innerHTML = `<option value="">Pilih RT</option>`;

  Object.keys(RW_RT).forEach((rw) => {
    const label = String(rw).padStart(2, "0");

    rwSelect.innerHTML += `<option value="${rw}">RW ${label}</option>`;
  });

  rwSelect.onchange = function () {
    const rw = Number(this.value);
    const listRT = RW_RT[rw] || [];

    rtSelect.innerHTML = `<option value="">Pilih RT</option>`;

    listRT.forEach((rt) => {
      rtSelect.innerHTML += `<option value="${rt}">RT ${rt}</option>`;
    });
  };
}
