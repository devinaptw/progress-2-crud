const menuRef = db.ref("menus");
const modal = new bootstrap.Modal(document.getElementById("menuModal"));
const form = document.getElementById("menuForm");
const menuList = document.getElementById("menuList");
const menuIdField = document.getElementById("menuId");

function formatRupiah(angka) {
	return "Rp " + Number(angka).toLocaleString("id-ID");
}

function resetForm() {
	form.reset();
	document.getElementById("menuModalLabel").textContent = "Tambah Menu Baru";
	menuIdField.value = "";
}

menuRef.on("value", (snapshot) => {
	menuList.innerHTML = "";
	if (!snapshot.exists()) {
		menuList.innerHTML = `<tr><td colspan="6" class="text-muted">Belum ada data menu 😢</td></tr>`;
		return;
	}

	snapshot.forEach((child) => {
		const data = child.val();
		const id = child.key;

		menuList.innerHTML += `
      <tr>
        <td class="fw-semibold">${data.nama}</td>
        <td>${data.kategori}</td>
        <td>${formatRupiah(data.harga)}</td>
        <td>${data.porsi}</td>
        <td>${data.stok}</td>
        <td>
          <button class="btn btn-warning btn-sm me-1" onclick="editMenu('${id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteMenu('${id}')">Hapus</button>
        </td>
      </tr>
    `;
	});
});

form.addEventListener("submit", (e) => {
	e.preventDefault();

	const id = menuIdField.value;
	const nama = document.getElementById("nama").value.trim();
	const kategori = document.getElementById("kategori").value;
	const harga = parseInt(document.getElementById("harga").value);
	const porsi = document.getElementById("porsi").value;
	const stok = parseInt(document.getElementById("stok").value) || 0;

	if (!nama || !harga) {
		alert("Nama dan harga wajib diisi!");
		return;
	}

	const menuData = {
		nama,
		kategori,
		harga,
		porsi,
		stok,
	};

	if (id) {
		db.ref("menus/" + id)
			.update({
				...menuData,
				tanggal_diperbarui: new Date().toISOString(),
			})
			.then(() => {
				alert("Menu berhasil diperbarui!");
				modal.hide();
				form.reset();
			})
			.catch((err) => alert("Gagal memperbarui: " + err.message));
	} else {
		menuRef
			.push({
				...menuData,
				tanggal_dibuat: new Date().toISOString(),
			})
			.then(() => {
				alert("Menu baru berhasil ditambahkan!");
				modal.hide();
				form.reset();
			})
			.catch((err) => alert("Gagal menambahkan menu: " + err.message));
	}
});

function editMenu(id) {
	db.ref("menus/" + id)
		.get()
		.then((snapshot) => {
			if (snapshot.exists()) {
				const data = snapshot.val();
				menuIdField.value = id;
				document.getElementById("nama").value = data.nama;
				document.getElementById("kategori").value = data.kategori;
				document.getElementById("harga").value = data.harga;
				document.getElementById("porsi").value = data.porsi;
				document.getElementById("stok").value = data.stok;
				document.getElementById("menuModalLabel").textContent = "Edit Menu";
				modal.show();
			} else {
				alert("Menu tidak ditemukan!");
			}
		})
		.catch((err) => alert("Gagal memuat data: " + err.message));
}

function deleteMenu(id) {
	if (confirm("Apakah kamu yakin ingin menghapus menu ini?")) {
		db.ref("menus/" + id)
			.remove()
			.then(() => alert("Menu berhasil dihapus!"))
			.catch((err) => alert("Gagal menghapus menu: " + err.message));
	}
}
