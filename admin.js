const SB_URL = "https://pgsiavnkxrpeyvtmtglp.supabase.co"; 
const SB_KEY = "sb_publishable_jjVemBz_ymH0CCbJhvbaKg_R1yFD6ka";
const _supabase = supabase.createClient(SB_URL, SB_KEY);

let currentTable = 'berita'; 
let allData = [];

// Proteksi Login
if (localStorage.getItem("adminLoggedIn") !== "true") { window.location.href = "login.html"; }

// 1. Fungsi Ganti Tab
function switchTab(table, el) {
    currentTable = table;
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    el.classList.add('active');
    
    const titles = { 
        'berita': 'Kelola Berita', 
        'fasilitas': 'Kelola Fasilitas', 
        'ekstrakulikuler': 'Kelola Ekskul' 
    };
    document.getElementById('tabTitle').innerText = titles[table];
    
    fetchData();
}

// 2. Ambil Data
async function fetchData() {
    const list = document.getElementById('adminDataList');
    list.innerHTML = '<p style="text-align:center; padding: 20px;">Memuat data...</p>';
    
    try {
        const { data, error } = await _supabase.from(currentTable).select('*').order('created_at', { ascending: false });
        if (error) throw error;
        
        allData = data;
        list.innerHTML = data.length === 0 ? '<p style="text-align:center; padding: 20px;">Belum ada data.</p>' : '';

        data.forEach(item => {
            let title = "";
            let img = item.url_gambar; // Konsisten menggunakan url_gambar

            if (currentTable === 'berita') {
                title = item.judul;
            } else if (currentTable === 'fasilitas') {
                title = item.nama_fasilitas; 
            } else if (currentTable === 'ekstrakulikuler') {
                title = item.nama_ekskul; // Menggunakan nama_ekskul
            }

            list.innerHTML += `
                <div class="admin-card">
                    <img src="${img || 'https://via.placeholder.com/80'}" class="card-thumb">
                    <div class="card-info">
                        ${item.kategori ? `<span class="badge">${item.kategori}</span>` : ''}
                        <h3>${title || 'Tanpa Nama'}</h3>
                    </div>
                    <div class="card-actions">
                        <button onclick="openEditModal('${item.id}')" class="btn-action btn-edit"><i class="fas fa-edit"></i></button>
                        <button onclick="deleteData('${item.id}')" class="btn-action btn-del"><i class="fas fa-trash"></i></button>
                    </div>
                </div>`;
        });
    } catch (err) {
        list.innerHTML = `<p style="color:red; text-align:center;">Error: ${err.message}</p>`;
    }
}

// 3. Upload Gambar (Arahkan ke bucket yang benar)
async function uploadImg(file) {
    const bucketMap = {
        'berita': 'foto_berita',
        'fasilitas': 'foto_fasilitas',
        'ekstrakulikuler': 'foto-ekskul' // Sesuai nama bucket di screenshot Storage Anda
    };
    
    const targetBucket = bucketMap[currentTable];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const path = `uploads/${fileName}`;

    const { data, error } = await _supabase.storage.from(targetBucket).upload(path, file);
    if (error) throw error;

    const { data: urlData } = _supabase.storage.from(targetBucket).getPublicUrl(path);
    return urlData.publicUrl;
}

// 4. Simpan Data (Insert/Update)
document.getElementById('mainForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnSubmit');
    btn.disabled = true; btn.innerText = "Sedang Menyimpan...";

    try {
        const file = document.getElementById('f_file').files[0];
        let url = document.getElementById('current_img_url').value;
        if (file) url = await uploadImg(file);

        const id = document.getElementById('f_id').value;
        let payload = {};

        if (currentTable === 'berita') {
            payload = { 
                judul: document.getElementById('f_judul').value, 
                kategori: document.getElementById('f_kategori').value, 
                ringkasan: document.getElementById('f_ringkasan').value, 
                isi_lengkap: document.getElementById('f_isi').value, 
                url_gambar: url 
            };
        } else if (currentTable === 'fasilitas') {
            payload = { 
                nama_fasilitas: document.getElementById('f_judul').value, 
                description: document.getElementById('f_isi').value, 
                url_gambar: url 
            };
        } else if (currentTable === 'ekstrakulikuler') {
            // SAMA PERSIS DENGAN FASILITAS
            payload = { 
                nama_ekskul: document.getElementById('f_judul').value, 
                description: document.getElementById('f_isi').value, 
                url_gambar: url 
            };
        }

        const { error } = id ? await _supabase.from(currentTable).update(payload).eq('id', id) 
                            : await _supabase.from(currentTable).insert([payload]);
        
        if (error) throw error;

        alert("Data berhasil disimpan!");
        closeModal(); fetchData();
    } catch (err) {
        alert("Gagal menyimpan: " + err.message);
    } finally {
        btn.disabled = false; btn.innerText = "Simpan Data";
    }
});

// --- Fungsi Modal & UI ---
function openAddModal() {
    document.getElementById('mainForm').reset();
    document.getElementById('f_id').value = "";
    document.getElementById('current_img_url').value = "";
    document.getElementById('imgPreview').style.display = 'none';
    document.getElementById('uploadFileName').innerText = "Klik untuk pilih gambar";
    
    const isBerita = currentTable === 'berita';
    document.getElementById('groupKategori').style.display = isBerita ? 'block' : 'none';
    document.getElementById('groupRingkasan').style.display = isBerita ? 'block' : 'none';
    
    // Penyesuaian Label Form
    if (currentTable === 'berita') {
        document.getElementById('labelJudul').innerText = "Judul Berita";
        document.getElementById('labelIsi').innerText = "Isi Berita";
    } else {
        document.getElementById('labelJudul').innerText = "Nama " + (currentTable === 'fasilitas' ? 'Fasilitas' : 'Ekskul');
        document.getElementById('labelIsi').innerText = "Keterangan / Deskripsi";
    }
    
    document.getElementById('modalTitle').innerText = "Tambah " + currentTable;
    document.getElementById('formModal').style.display = 'flex';
}

function openEditModal(id) {
    const item = allData.find(d => d.id == id);
    if (!item) return;

    openAddModal();
    document.getElementById('f_id').value = item.id;
    document.getElementById('current_img_url').value = item.url_gambar;
    
    if (currentTable === 'berita') {
        document.getElementById('f_judul').value = item.judul;
        document.getElementById('f_isi').value = item.isi_lengkap;
        document.getElementById('f_kategori').value = item.kategori;
        document.getElementById('f_ringkasan').value = item.ringkasan;
    } else if (currentTable === 'fasilitas') {
        document.getElementById('f_judul').value = item.nama_fasilitas;
        document.getElementById('f_isi').value = item.description;
    } else if (currentTable === 'ekstrakulikuler') {
        document.getElementById('f_judul').value = item.nama_ekskul;
        document.getElementById('f_isi').value = item.description;
    }
    
    if(item.url_gambar) { 
        document.getElementById('imgPreview').src = item.url_gambar; 
        document.getElementById('imgPreview').style.display = 'block'; 
    }
}

async function deleteData(id) {
    if (confirm("Hapus data ini?")) {
        const { error } = await _supabase.from(currentTable).delete().eq('id', id);
        if(error) alert(error.message);
        fetchData();
    }
}

function closeModal() { document.getElementById('formModal').style.display = 'none'; }
function logout() { localStorage.removeItem("adminLoggedIn"); window.location.href = "login.html"; }

// Preview Gambar saat pilih file
document.getElementById('f_file').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        document.getElementById('uploadFileName').innerText = file.name;
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imgPreview').src = e.target.result;
            document.getElementById('imgPreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

window.onload = fetchData;