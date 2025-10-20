const bahanRef = db.ref("bahan");
const modal = new bootstrap.Modal(document.getElementById("bahanModal"));
const form = document.getElementById("bahanForm");
const bahanList = document.getElementById("bahanList");
const bahanIdField = document.getElementById("bahanId");

function formatRupiah(angka) {
	return "Rp " + Number(angka).toLocaleString("id-ID");
}

function resetForm() {
	form.reset();
	document.getElementById("bahanModalLabel").textContent = "Tambah Bahan Baru";
	bahanIdField.value = "";
}

bahanRef.on("value", (snapshot) => {
	bahanList.innerHTML = "";
	if (!snapshot.exists()) {
		bahanList.innerHTML = `<tr><td colspan="6" class="text-muted">Belum ada data bahan 😢</td></tr>`;
		return;
	}

	snapshot.forEach((child) => {
		const data = child.val();
		const id = child.key;

		bahanList.innerHTML += `
      <tr>
        <td class="fw-semibold">${data.nama}</td>
        <td>${data.kategori}</td>
        <td>${data.satuan}</td>
        <td>${data.stok}</td>
        <td>${formatRupiah(data.harga)}</td>
        <td>
          <button class="btn btn-warning btn-sm me-1" onclick="editBahan('${id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteBahan('${id}')">Hapus</button>
        </td>
      </tr>
    `;
	});
});

form.addEventListener("submit", (e) => {
	e.preventDefault();

	const id = bahanIdField.value;
	const nama = document.getElementById("namaBahan").value.trim();
	const kategori = document.getElementById("kategoriBahan").value;
	const satuan = document.getElementById("satuanBahan").value;
	const stok = parseFloat(document.getElementById("stokBahan").value) || 0;
	const harga = parseFloat(document.getElementById("hargaBahan").value) || 0;

	if (!nama) {
		alert("Nama bahan wajib diisi!");
		return;
	}

	const bahanData = {
		nama,
		kategori,
		satuan,
		stok,
		harga,
	};

	if (id) {
		db.ref("bahan/" + id)
			.update({
				...bahanData,
				tanggal_diperbarui: new Date().toISOString(),
			})
			.then(() => {
				alert("Data bahan berhasil diperbarui!");
				modal.hide();
				form.reset();
			})
			.catch((err) => alert("Gagal memperbarui: " + err.message));
	} else {
		bahanRef
			.push({
				...bahanData,
				tanggal_dibuat: new Date().toISOString(),
			})
			.then(() => {
				alert("Bahan baru berhasil ditambahkan!");
				modal.hide();
				form.reset();
			})
			.catch((err) => alert("Gagal menambahkan bahan: " + err.message));
	}
});

function editBahan(id) {
	db.ref("bahan/" + id)
		.get()
		.then((snapshot) => {
			if (snapshot.exists()) {
				const data = snapshot.val();
				bahanIdField.value = id;
				document.getElementById("namaBahan").value = data.nama;
				document.getElementById("kategoriBahan").value = data.kategori;
				document.getElementById("satuanBahan").value = data.satuan;
				document.getElementById("stokBahan").value = data.stok;
				document.getElementById("hargaBahan").value = data.harga;
				document.getElementById("bahanModalLabel").textContent = "Edit Bahan";
				modal.show();
			} else {
				alert("Data bahan tidak ditemukan!");
			}
		})
		.catch((err) => alert("Gagal memuat data: " + err.message));
}

function deleteBahan(id) {
	if (confirm("Apakah kamu yakin ingin menghapus bahan ini?")) {
		db.ref("bahan/" + id)
			.remove()
			.then(() => alert("Bahan berhasil dihapus!"))
			.catch((err) => alert("Gagal menghapus bahan: " + err.message));
	}
}
