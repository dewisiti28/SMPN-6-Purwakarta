// Konfigurasi Supabase
const SB_URL = "https://pgsiavnkxrpeyvtmtglp.supabase.co";
const SB_KEY = "sb_publishable_jjVemBz_ymH0CCbJhvbaKg_R1yFD6ka";
const _supabase = supabase.createClient(SB_URL, SB_KEY);

async function loadEkskul() {
    const grid = document.getElementById('ekskul-grid');
    
    try {
        // Ambil data dari tabel ekstrakulikuler
        const { data, error } = await _supabase
            .from('ekstrakulikuler')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Belum ada data ekstrakurikuler.</p>';
            return;
        }

        // Bersihkan kontainer (hapus teks "Memuat data...")
        grid.innerHTML = '';

        // Looping data untuk ditampilkan
        data.forEach(item => {
            grid.innerHTML += `
                <div class="photo-card">
                    <img src="${item.url_gambar || 'https://via.placeholder.com/400x300'}" alt="${item.nama_ekskul}">
                    <div class="photo-info">
                        <h3>${item.nama_ekskul}</h3>
                        <p style="font-size: 0.9rem; opacity: 0.9; margin-top: 5px;">${item.description || ''}</p>
                    </div>
                </div>
            `;
        });
    } catch (err) {
        console.error("Error loading ekskul:", err);
        grid.innerHTML = `<p style="color:red; text-align: center; grid-column: 1/-1;">Gagal memuat data. Pastikan koneksi internet stabil.</p>`;
    }
}

// Jalankan fungsi saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', loadEkskul);