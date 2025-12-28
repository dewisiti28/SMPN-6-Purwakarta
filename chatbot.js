// Knowledge Base
const knowledgeBase = [
    {
        id: 'greet',
        keywords: ['halo', 'hai', 'siang', 'pagi', 'malam', 'salam'],
        answer: "Halo! Selamat datang di SMPN 6 Purwakarta. Ada yang bisa saya bantu?"
    },
    {
        id: 'profil',
        keywords: ['profil', 'tentang', 'sejarah', 'kapan berdiri', 'npsn'],
        answer: "SMPN 6 Purwakarta didirikan pada 11 Maret 1991 (NPSN: 20217386). Kami berkomitmen mencetak generasi unggul, berakhlak mulia, dan berprestasi."
    },
    {
        id: 'visi',
        keywords: ['visi', 'tujuan', 'cita-cita'],
        answer: "Visi kami: Terwujudnya peserta didik yang berakhlakul karimah, berprestasi, kreatif dan mandiri."
    },
    {
        id: 'lokasi',
        keywords: ['lokasi', 'alamat', 'dimana', 'peta', 'jalan'],
        answer: "Kami berlokasi di Jl. Purnawarman Barat, Sindangkasih, Kec. Purwakarta, Jawa Barat. Dekat dengan pusat kota."
    },
    {
        id: 'kontak',
        keywords: ['kontak', 'telepon', 'hp', 'wa', 'whatsapp', 'email', 'hubungi'],
        answer: "Anda bisa menghubungi kami via WhatsApp di 0877-7893-5359 atau email smpn6purwakarta@gmail.com."
    },
    {
        id: 'jadwal',
        keywords: ['jadwal', 'jam', 'buka', 'operasional'],
        answer: "Jam operasional administrasi sekolah: Senin - Jumat pukul 07:00 - 16:00. Sabtu & Minggu libur."
    },
    {
        id: 'ekskul',
        keywords: ['ekskul', 'ekstrakurikuler', 'kegiatan', 'bakat'],
        answer: "Kami memiliki berbagai ekstrakurikuler seperti Pramuka, Paskibra, Kesenian, PMR, Perisai Diri, dan Olahraga."
    },
    {
        id: 'fasilitas',
        keywords: ['fasilitas', 'sarana', 'lab', 'perpustakaan'],
        answer: "Fasilitas kami meliputi Laboratorium Komputer, Perpustakaan Digital, Ruang Kelas nyaman, dan lapangan olahraga."
    },
    {
        id: 'kepsek',
        keywords: ['kepala sekolah', 'kepsek', 'pimpinan'],
        answer: "Kepala Sekolah kami saat ini adalah Bapak R. Gurnita Wijaksana, S.Pd."
    },
    {
        id: 'prestasi',
        keywords: ['prestasi', 'juara', 'lomba'],
        answer: "Siswa kami sering menjuarai berbagai kompetisi akademik dan non-akademik tingkat kabupaten hingga provinsi. Lihat menu Berita untuk info terbaru!"
    }
];

// Initial Suggestions
const defaultSuggestions = [
    "Profil Sekolah", "Lokasi Dimana?", "Ada Ekskul apa?", "Kontak WA"
];

// Inject HTML Structure
function initChatbot() {
    const chatHTML = `
        <div id="chatbot-container">
            <div id="chatbot-window">
                <div class="chat-header">
                    <img src="bot-icon.png" alt="Bot">
                    <div>
                        <h3>Spensix Bot</h3>
                        <p>Asisten Virtual</p>
                    </div>
                    <button class="close-chat" onclick="toggleChat()"><i class="fas fa-times"></i></button>
                </div>
                <div class="chat-messages" id="chat-messages">
                    <div class="message bot">
                        <div class="welcome-msg">
                            <img src="bot-icon.png" class="bot-anim-icon">
                            <p><strong>Halo! 👋</strong></p>
                            <p>Ayo tanya apapun tentang SMPN 6 Purwakarta disini!</p>
                        </div>
                    </div>
                </div>
                <div class="suggestions" id="suggestions"></div>
                <div class="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Ketik pertanyaan..." onkeypress="handleEnter(event)">
                    <button id="send-btn" onclick="sendMessage()"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
            <div id="chatbot-toggle" onclick="toggleChat()">
                <img src="bot-icon.png" alt="Chat">
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', chatHTML);
    renderSuggestions(defaultSuggestions);
}

// Toggle Chat
function toggleChat() {
    const window = document.getElementById('chatbot-window');
    window.classList.toggle('active');
    
    // Focus input when opened
    if (window.classList.contains('active')) {
        document.getElementById('chat-input').focus();
    }
}

// Render Suggestions
function renderSuggestions(list) {
    const container = document.getElementById('suggestions');
    container.innerHTML = list.map(text => 
        `<button class="suggestion-chip" onclick="sendSuggestion('${text}')">${text}</button>`
    ).join('');
}

// Send Message
function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;

    // User Message
    addMessage(text, 'user');
    input.value = '';

    // Typing Indicator
    showTyping();

    // Process Response (Simulated Delay)
    setTimeout(() => {
        const response = findAnswer(text);
        removeTyping();
        addMessage(response.answer, 'bot');
        
        // Update Suggestions based on context or shuffle defaults
        if (response.keywords) {
             // Logic to show related chips could go here
        }
        
    }, 800);
}

function sendSuggestion(text) {
    document.getElementById('chat-input').value = text;
    sendMessage();
}

function handleEnter(e) {
    if (e.key === 'Enter') sendMessage();
}

// Add Message to UI
function addMessage(text, type) {
    const container = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;
    // Allow basic HTML in bot messages
    msgDiv.innerHTML = text; 
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

// Typing Indicator
function showTyping() {
    const container = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
    `;
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;
}

function removeTyping() {
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
}

// Search Logic (Simple Fuzzy-like using keyword matching for now, Fuse.js is better if we load it)
// Note: Created strict keyword matching first, can be enhanced with Fuse.js if loaded.
// Since User requested "Simantic Search" (Semantic), Fuse.js is a good approximation.
function findAnswer(query) {
    // Check if Fuse is loaded
    if (typeof Fuse !== 'undefined') {
        const options = {
            keys: ['keywords', 'answer'],
            threshold: 0.4, // Lower = stricter
        };
        const fuse = new Fuse(knowledgeBase, options);
        const result = fuse.search(query);
        
        if (result.length > 0) {
            return result[0].item;
        }
    } else {
        // Fallback simple search
        const lowerQuery = query.toLowerCase();
        for (const item of knowledgeBase) {
            if (item.keywords.some(k => lowerQuery.includes(k))) {
                return item;
            }
        }
    }

    // Default Fallback
    return {
        answer: `Maaf, saya belum mengerti pertanyaan itu. <br><br>
        Silakan hubungi kami langsung via WhatsApp: <br>
        <a href="https://wa.me/6287778935359" target="_blank" style="color:#25D366; font-weight:bold; text-decoration:none;">
            <i class="fab fa-whatsapp"></i> Hubungi Admin
        </a>`
    };
}

// Init on Load
document.addEventListener('DOMContentLoaded', () => {
    // Load Fuse.js dynamically if not present
    if (typeof Fuse === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/fuse.js@6.6.2';
        script.onload = initChatbot;
        document.head.appendChild(script);
    } else {
        initChatbot();
    }
});
