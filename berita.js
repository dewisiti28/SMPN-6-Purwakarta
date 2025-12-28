// 1. KONFIGURASI SUPABASE (Gunakan URL & Key yang sama dengan di admin.js)
const SB_URL = "https://pgsiavnkxrpeyvtmtglp.supabase.co"; 
const SB_KEY = "sb_publishable_jjVemBz_ymH0CCbJhvbaKg_R1yFD6ka";
const _supabase = supabase.createClient(SB_URL, SB_KEY);

// Variabel global untuk menampung data yang sudah diambil
let listBerita = [];

// 2. FUNGSI MENGAMBIL DATA DARI DATABASE
async function fetchBerita() {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '<p>Memuat berita terbaru...</p>';

    try {
        const { data, error } = await _supabase
            .from('berita')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        listBerita = data; // Simpan ke variabel global agar bisa dibuka di modal
        renderBerita(data);

    } catch (err) {
        console.error("Gagal memuat:", err);
        grid.innerHTML = '<p>Gagal memuat berita. Periksa koneksi internet.</p>';
    }
}

// 3. FUNGSI MENAMPILKAN KE HALAMAN
function renderBerita(data) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '';

    if (data.length === 0) {
        grid.innerHTML = '<p>Belum ada berita yang tersedia.</p>';
        return;
    }

    data.forEach(item => {
        const tagClass = item.kategori.toLowerCase() === 'prestasi' ? 'tag-prestasi' : 'tag-kegiatan';
        
        const imgUrl = item.url_gambar || 'https://via.placeholder.com/400x250?text=SMPN6';

        grid.innerHTML += `
            <div class="news-card">
                <div class="news-img" style="background-image: url('${imgUrl}'); background-size: cover; background-position: center; height: 200px;"></div>
                <div class="news-content">
                    <div class="news-meta">
                        <span class="tag ${tagClass}">${item.kategori}</span>
                    </div>
                    <h3>${item.judul}</h3>
                    <p>${item.ringkasan}</p>
                    <div class="read-more" onclick="openModal(${item.id})">
                        Baca Selengkapnya <i class="fas fa-arrow-right"></i>
                    </div>
                </div>
            </div>
        `;
    });
}

// 4. FUNGSI MODAL (BACA SELENGKAPNYA)
function openModal(id) {
    const modal = document.getElementById('newsModal');
    const body = document.getElementById('modalBody');
    
    // Cari data di dalam listBerita berdasarkan ID
    const data = listBerita.find(item => item.id === id);
    if (!data) return;

    const tagClass = data.kategori.toLowerCase() === 'prestasi' ? 'tag-prestasi' : 'tag-kegiatan';

    body.innerHTML = `
        <span class="tag ${tagClass}">${data.kategori}</span>
        <h2 class="modal-title" style="margin-top: 15px;">${data.judul}</h2>
        <img src="${data.url_gambar}" style="width:100%; border-radius:12px; margin: 15px 0;" onerror="this.src='https://via.placeholder.com/600x300?text=Gambar+Tidak+Tersedia'">
        <p class="modal-text">${data.isi_lengkap}</p>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Fungsi Tutup & Menu Mobile
function closeModal() {
    document.getElementById('newsModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('active');
}

// JALANKAN SAAT HALAMAN DIBUKA
window.onload = fetchBerita;