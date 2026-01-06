// 1. Konfigurasi Supabase
const SB_URL = "https://pgsiavnkxrpeyvtmtglp.supabase.co";
const SB_KEY = "sb_publishable_jjVemBz_ymH0CCbJhvbaKg_R1yFD6ka";
const _supabase = supabase.createClient(SB_URL, SB_KEY);

// 2. Fungsi Ambil Data Fasilitas
async function loadFasilitas() {
    const grid = document.getElementById('fasilitas-grid');
    
    try {
        const { data, error } = await _supabase
            .from('fasilitas') // Pastikan nama tabel di Supabase adalah 'fasilitas'
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Jika data kosong
        if (!data || data.length === 0) {
            grid.innerHTML = `
                <div style="text-align:center; grid-column: 1/-1; padding: 50px;">
                    <i class="fas fa-folder-open" style="font-size: 40px; color: #cbd5e1; margin-bottom: 15px;"></i>
                    <p style="color: #64748b;">Belum ada foto fasilitas yang ditambahkan.</p>
                </div>`;
            return;
        }

        grid.innerHTML = ''; // Hapus loading spinner

        // Tampilkan Data
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'photo-card';
            card.innerHTML = `
                <div class="card-image">
                    <img src="${item.url_gambar}" alt="${item.nama_fasilitas}" loading="lazy">
                    <span class="category-badge">Fasilitas</span>
                </div>
                <div class="photo-info">
                    <h3>${item.nama_fasilitas}</h3>
                    <p>${item.description || 'Sarana prasarana penunjang belajar SMPN 6 Purwakarta.'}</p>
                </div>
            `;
            grid.appendChild(card);
        });

    } catch (err) {
        console.error("Fetch error:", err);
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center;">Gagal memuat data. Periksa koneksi atau database.</p>`;
    }
}

// 3. Toggle Sidebar Mobile
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Jalankan saat halaman siap
document.addEventListener('DOMContentLoaded', loadFasilitas);