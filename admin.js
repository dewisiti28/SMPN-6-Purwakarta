// 1. KONFIGURASI SUPABASE
const SB_URL = "https://pgsiavnkxrpeyvtmtglp.supabase.co"; 
const SB_KEY = "sb_publishable_jjVemBz_ymH0CCbJhvbaKg_R1yFD6ka";
const _supabase = supabase.createClient(SB_URL, SB_KEY);

let allBerita = []; // Penampung data agar bisa diedit

// Proteksi: Jika belum login, tendang ke login.html
if (localStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "login.html";
}

// --- FUNGSI 1: AMBIL & TAMPILKAN DATA (READ) ---
async function fetchAdminNews() {
    const list = document.getElementById('adminNewsList');
    list.innerHTML = '<p style="text-align:center;">Memuat data...</p>';
    
    try {
        const { data, error } = await _supabase
            .from('berita')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        allBerita = data;

        list.innerHTML = '';
        if (data.length === 0) {
            list.innerHTML = '<p style="text-align:center; color:#64748b;">Belum ada berita.</p>';
            return;
        }

        data.forEach(item => {
            const img = item.url_gambar || 'https://via.placeholder.com/100?text=No+Img';
            list.innerHTML += `
                <div class="admin-card">
                    <img src="${img}" class="card-thumb">
                    <div class="card-info">
                        <span class="badge">${item.kategori}</span>
                        <h3>${item.judul}</h3>
                    </div>
                    <div class="card-actions">
                        <button onclick="openEditModal(${item.id})" class="btn-action btn-edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteBerita(${item.id})" class="btn-action btn-del">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
    } catch (err) {
        console.error("Error Fetch:", err);
        list.innerHTML = '<p style="color:red; text-align:center;">Gagal mengambil data database.</p>';
    }
}

// --- FUNGSI 2: UPLOAD FOTO KE STORAGE ---
async function uploadImage(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    // Upload ke bucket 'foto_berita'
    const { data, error } = await _supabase.storage
        .from('foto_berita')
        .upload(filePath, file);

    if (error) throw error;

    // Dapatkan URL Public
    const { data: urlData } = _supabase.storage
        .from('foto_berita')
        .getPublicUrl(filePath);

    return urlData.publicUrl;
}

// --- FUNGSI 3: SIMPAN DATA (TAMBAH & EDIT) ---
document.getElementById('newsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btnSubmit = e.target.querySelector('button[type="submit"]');
    const id = document.getElementById('f_id').value;
    const fileInput = document.getElementById('f_file');
    
    btnSubmit.innerText = "Sedang Memproses...";
    btnSubmit.disabled = true;

    try {
        let finalImageUrl = document.getElementById('current_img_url').value;

        // Jika ada file baru yang dipilih, upload dulu
        if (fileInput.files.length > 0) {
            finalImageUrl = await uploadImage(fileInput.files[0]);
        }

        const payload = {
            judul: document.getElementById('f_judul').value,
            kategori: document.getElementById('f_kategori').value,
            ringkasan: document.getElementById('f_ringkasan').value,
            isi_lengkap: document.getElementById('f_isi').value,
            url_gambar: finalImageUrl
        };

        if (id) {
            // Mode EDIT
            const { error } = await _supabase.from('berita').update(payload).eq('id', id);
            if (error) throw error;
        } else {
            // Mode TAMBAH
            const { error } = await _supabase.from('berita').insert([payload]);
            if (error) throw error;
        }

        alert("Berhasil disimpan!");
        closeModal();
        fetchAdminNews();
    } catch (err) {
        alert("Gagal menyimpan: " + err.message);
    } finally {
        btnSubmit.innerText = "Simpan Berita";
        btnSubmit.disabled = false;
    }
});

// --- FUNGSI MODAL & PREVIEW ---
function openAddModal() {
    document.getElementById('modalTitle').innerText = "Tambah Berita Baru";
    document.getElementById('newsForm').reset();
    document.getElementById('f_id').value = "";
    document.getElementById('current_img_url').value = "";
    document.getElementById('imgPreview').style.display = 'none';
    document.getElementById('formModal').style.display = 'flex';
}

function openEditModal(id) {
    const data = allBerita.find(item => item.id === id);
    if (!data) return;

    document.getElementById('modalTitle').innerText = "Edit Berita";
    document.getElementById('f_id').value = data.id;
    document.getElementById('f_judul').value = data.judul;
    document.getElementById('f_kategori').value = data.kategori;
    document.getElementById('f_ringkasan').value = data.ringkasan;
    document.getElementById('f_isi').value = data.isi_lengkap;
    document.getElementById('current_img_url').value = data.url_gambar;

    const preview = document.getElementById('imgPreview');
    if (data.url_gambar) {
        preview.src = data.url_gambar;
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }

    document.getElementById('formModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('formModal').style.display = 'none';
}

// Preview Gambar saat dipilih
document.getElementById('f_file').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('imgPreview');
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// --- FUNGSI LAIN ---
async function deleteBerita(id) {
    if (confirm("Hapus berita ini?")) {
        const { error } = await _supabase.from('berita').delete().eq('id', id);
        if (error) alert(error.message);
        fetchAdminNews();
    }
}

function logout() {
    localStorage.removeItem("adminLoggedIn");
    window.location.href = "login.html";
}

// Jalankan saat pertama buka
window.onload = fetchAdminNews;