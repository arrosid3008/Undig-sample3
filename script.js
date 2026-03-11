// --- CONFIGURASI DATA ---
const CONFIG = {
    eventTitle: "Pernikahan Arrosid & Zumrotus",
    eventStartUTC: "20260405T010000Z", // Jam 08:00 WIB
    eventEndUTC: "20260405T060000Z",   // Jam 13:00 WIB
    eventLocation: "GOR Jatimekar, Bandung",
    eventDesc: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir."
};

let replyToId = null; 

document.addEventListener("DOMContentLoaded", () => {

    /* PARAMETER URL NAMA TAMU */
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    const guestNameEl = document.getElementById('guest-name');
    
    if(guestNameEl) {
        if(guestName && guestName.trim() !== '') {
            guestNameEl.innerText = guestName; 
        } else {
            guestNameEl.innerText = "Tamu Undangan"; 
        }
    }

    // 1. THEME TOGGLE
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    if(themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const icon = themeBtn.querySelector('i');
            if (body.classList.contains('dark-mode')) {
                icon.classList.replace('fa-moon', 'fa-sun');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
            }
        });
    }

    // 2. BUKA UNDANGAN, MUSIC CONTROL, & MAGIC BURST
    const btnOpen = document.getElementById('btn-open');
    const openingScreen = document.getElementById('opening-screen');
    const mainContent = document.getElementById('main-content');
    const bottomNav = document.getElementById('bottom-nav');
    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-control');
    let isPlaying = false;
    let wasMusicPlayingBeforeVideo = false; 

    const toggleMusic = () => {
        if (isPlaying) {
            bgMusic.pause();
            if(musicBtn) musicBtn.classList.remove('playing');
        } else {
            bgMusic.play().catch(e => console.log("Autoplay dicegah browser", e));
            if(musicBtn) musicBtn.classList.add('playing');
        }
        isPlaying = !isPlaying;
    };

    if(musicBtn) musicBtn.addEventListener('click', toggleMusic);

    if(btnOpen) {
        btnOpen.addEventListener('click', (e) => {
            // TRIGGER EFEK MAGIC BURST
            triggerConfetti(e.clientX, e.clientY);

            setTimeout(() => {
                openingScreen.classList.add('slide-up');
                
                setTimeout(() => {
                    openingScreen.style.display = 'none';
                    mainContent.classList.remove('hidden');
                    bottomNav.classList.remove('hidden');
                    if(musicBtn) musicBtn.classList.remove('hidden');
                    
                    // INIT EFEK STARDUST ELEGAN
                    initParticles();
                }, 800);

                if (!isPlaying) toggleMusic();
            }, 500); // Delay sedikit lebih lama agar ledakan cahayanya terlihat memukau
        });
    }

    // 2.1 INTERAKSI VIDEO & AUDIO STORY
    const storyVideo = document.getElementById('story-video');
    if(storyVideo) {
        storyVideo.addEventListener('play', () => {
            if (isPlaying) {
                wasMusicPlayingBeforeVideo = true; 
                bgMusic.pause(); 
                if(musicBtn) musicBtn.classList.remove('playing'); 
                isPlaying = false;
            } else {
                wasMusicPlayingBeforeVideo = false;
            }
        });

        storyVideo.addEventListener('pause', () => {
            if (wasMusicPlayingBeforeVideo && !isPlaying) {
                bgMusic.play();
                if(musicBtn) musicBtn.classList.add('playing');
                isPlaying = true;
            }
        });

        storyVideo.addEventListener('ended', () => {
            if (wasMusicPlayingBeforeVideo && !isPlaying) {
                bgMusic.play();
                if(musicBtn) musicBtn.classList.add('playing');
                isPlaying = true;
            }
        });
    }

    // 3. SCROLL REVEAL ANIMATION
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    reveals.forEach(el => observer.observe(el));

    const heroSection = document.querySelector("#hero");
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add("hero-active");
            }
        });
    },{ threshold: 0.3 });
    if(heroSection) heroObserver.observe(heroSection);

    // 4. BOTTOM NAV AUTO-HIDE
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 300) {
            bottomNav.classList.add('nav-hidden');
        } else {
            bottomNav.classList.remove('nav-hidden');
        }
        lastScrollY = currentScrollY;
    });

    // 5. INIT SWIPER (Gallery)
    if(typeof Swiper !== 'undefined') {
        new Swiper('.mySwiper', {
            effect: "coverflow",
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: "auto",
            coverflowEffect: {
                rotate: 20, stretch: 0, depth: 100, modifier: 1, slideShadows: false,
            },
            loop: true,
            autoplay: { delay: 3500, disableOnInteraction: false },
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            breakpoints: {
                320: { slidesPerView: 1.2, spaceBetween: 15 },
                600: { slidesPerView: 2.2, spaceBetween: 20 }
            }
        });
    }

    // 6. ADD TO CALENDAR LINKS
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(CONFIG.eventTitle)}&dates=${CONFIG.eventStartUTC}/${CONFIG.eventEndUTC}&details=${encodeURIComponent(CONFIG.eventDesc)}&location=${encodeURIComponent(CONFIG.eventLocation)}`;
    const btnGoogle = document.getElementById('btn-google-cal');
    if(btnGoogle) btnGoogle.href = googleCalUrl;

    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${CONFIG.eventStartUTC}\nDTEND:${CONFIG.eventEndUTC}\nSUMMARY:${CONFIG.eventTitle}\nLOCATION:${CONFIG.eventLocation}\nDESCRIPTION:${CONFIG.eventDesc}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const icsUrl = URL.createObjectURL(blob);
    
    const appleBtn = document.getElementById('btn-apple-cal');
    const outlookBtn = document.getElementById('btn-outlook-cal');
    if(appleBtn) { appleBtn.href = icsUrl; appleBtn.download = "Wedding.ics"; }
    if(outlookBtn) { outlookBtn.href = icsUrl; outlookBtn.download = "Wedding.ics"; }

    // 7. COUNTDOWN TIMER
    const weddingDate = new Date("April 5, 2026 08:00:00").getTime();
    const countdownElement = document.getElementById("countdown");
    
    if(countdownElement) {
        const countdown = setInterval(() => {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            if(distance < 0){
                clearInterval(countdown);
                countdownElement.innerHTML = "<h3 style='color: var(--accent); margin-top: 20px; font-family: Playfair Display;'>Acara Sedang Berlangsung / Telah Selesai 💍</h3>";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            document.getElementById("days").innerText = days < 10 ? '0'+days : days;
            document.getElementById("hours").innerText = hours < 10 ? '0'+hours : hours;
            document.getElementById("minutes").innerText = minutes < 10 ? '0'+minutes : minutes;
            document.getElementById("seconds").innerText = seconds < 10 ? '0'+seconds : seconds;
        }, 1000);
    }

    // 8. RSVP CHAT FORM & LOCAL STORAGE
    const rsvpForm = document.getElementById('rsvp-form');
    const STORAGE_KEY = 'rsvp_chat_v1';

    renderChat(STORAGE_KEY);

    if(rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nama = document.getElementById('rsvp-name').value.trim();
            const kehadiran = document.getElementById('rsvp-attendance').value;
            const pesan = document.getElementById('rsvp-message').value.trim();

            if(!nama || !kehadiran || !pesan) return;

            const now = new Date();
            const timeStr = now.toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');

            const entry = { 
                id: Date.now().toString(), 
                nama, kehadiran, pesan,
                waktu: timeStr,
                replyTo: replyToId 
            };
            
            const existingData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            existingData.push(entry); 
            localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));

            renderChat(STORAGE_KEY);
            rsvpForm.reset();
            cancelReplyChat();
            showToast("Terima kasih atas ucapan dan doanya!");

            const chatList = document.getElementById('wishes-list');
            if(chatList) {
                setTimeout(() => chatList.scrollTop = chatList.scrollHeight, 100);
            }
        });
    }

    // 10. FITUR BUTTON REVEAL GIFT
    const btnRevealGift = document.getElementById('btn-reveal-gift');
    const giftContainer = document.getElementById('gift-container');

    if(btnRevealGift && giftContainer) {
        giftContainer.classList.add('hidden-anim');
        giftContainer.classList.remove('hidden'); 

        btnRevealGift.addEventListener('click', () => {
            if(giftContainer.classList.contains('hidden-anim')){
                giftContainer.classList.remove('hidden-anim');
                btnRevealGift.innerHTML = '<i class="fas fa-times"></i> Tutup Pilihan';
                btnRevealGift.classList.remove('pulse-btn');
            } else {
                giftContainer.classList.add('hidden-anim');
                btnRevealGift.innerHTML = '<i class="fas fa-gift"></i> Kirim Hadiah';
                btnRevealGift.classList.add('pulse-btn');
            }
        });
    }
});


// --- FUNGSI GLOBAL ---

window.renderChat = function(storageKey) {
    const container = document.getElementById('wishes-list');
    if(!container) return;

    const data = JSON.parse(localStorage.getItem(storageKey)) || [];
    
    if(data.length === 0) {
        container.innerHTML = `<p class="text-muted" style="text-align:center;">Jadilah yang pertama mengirim ucapan!</p>`;
        return;
    }
    
    container.innerHTML = ''; 
    data.forEach(item => {
        let quoteHtml = '';
        if(item.replyTo) {
            const targetMsg = data.find(d => d.id === item.replyTo);
            if(targetMsg) {
                const shortMsg = targetMsg.pesan.length > 40 ? targetMsg.pesan.substring(0, 40) + '...' : targetMsg.pesan;
                quoteHtml = `<div class="chat-quote"><b>${targetMsg.nama}</b> ${shortMsg}</div>`;
            }
        }

        const badgeClass = item.kehadiran === 'Hadir' ? 'badge-hadir' : 'badge-absen';
        const displayTime = item.waktu || 'Baru saja';
        
        const card = document.createElement('div');
        card.className = 'chat-bubble';
        card.innerHTML = `
            ${quoteHtml}
            <div class="chat-header">
                <div class="chat-info">
                    <span class="chat-name">${item.nama}</span>
                    <span class="chat-time">${displayTime}</span>
                </div>
                <span class="chat-badge ${badgeClass}"><i class="fas ${item.kehadiran==='Hadir'?'fa-check-circle':'fa-times-circle'}"></i> ${item.kehadiran}</span>
            </div>
            <div class="chat-text">${item.pesan}</div>
            <button class="btn-reply-chat" onclick="setReplyChat('${item.id}', '${item.nama.replace(/'/g,"\\'").replace(/"/g,'"')}', '${item.pesan.replace(/'/g,"\\'").replace(/"/g,'"')}')"><i class="fas fa-reply"></i> Balas</button>
        `;
        container.appendChild(card);
    });
};

window.setReplyChat = function(id, nama, pesan) {
    replyToId = id;
    const indicator = document.getElementById('reply-indicator');
    const indicatorName = document.getElementById('reply-indicator-name');
    
    if(indicator && indicatorName) {
        indicator.classList.remove('hidden');
        indicatorName.innerText = nama;
    }
    document.getElementById('rsvp-message').focus();
};

window.cancelReplyChat = function() {
    replyToId = null;
    const indicator = document.getElementById('reply-indicator');
    if(indicator) indicator.classList.add('hidden');
};

window.expandStory = function() {
    const content = document.getElementById('story-full');
    const btn = document.querySelector('.btn-expand');
    if(!content) return;

    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        btn.innerHTML = 'Tutup Cerita <i class="fas fa-chevron-up"></i>';
    } else {
        content.classList.add('hidden');
        btn.innerHTML = 'Lihat Cerita <i class="fas fa-chevron-down"></i>';
    }
};

window.copyText = function(elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(() => {
        showToast("Berhasil disalin!");
    }).catch(err => alert("Gagal menyalin."));
};

window.showToast = function(message) {
    const toast = document.getElementById('toast');
    if(!toast) return;
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
};

// =========================================================
// REVISI: EFEK STARDUST ELEGAN (Menggantikan Daun)
// =========================================================
window.initParticles = function() {
    const container = document.getElementById('particles-container');
    if(!container) return;
    container.innerHTML = '';
    
    // Warna Stardust: Emas utama, Emas Muda, dan Putih
    const colors = ['#b59551', '#d4af37', '#ffffff', '#f9f6f0'];
    const particleCount = 15; // Jumlah jauh lebih sedikit agar elegan dan ringan
    
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => createParticle(container, colors), Math.random() * 5000);
    }
};

function createParticle(container, colors) {
    const dust = document.createElement('div');
    dust.classList.add('magic-dust'); 
    
    const randColor = colors[Math.floor(Math.random() * colors.length)];
    dust.style.backgroundColor = randColor;
    dust.style.boxShadow = `0 0 8px ${randColor}, 0 0 15px rgba(255, 255, 255, 0.5)`; // Glowing
    
    dust.style.left = Math.random() * 100 + '%';
    
    // Ukuran sangat kecil dan lembut (3px - 6px)
    const size = Math.random() * 3 + 3; 
    dust.style.width = size + 'px';
    dust.style.height = size + 'px';
    
    // Durasi sangat lambat agar terlihat tenang (15 - 25 detik)
    const duration = Math.random() * 10 + 15; 
    dust.style.animationDuration = duration + 's';
    
    // Bergerak lembut ke kiri/kanan
    const swayX = (Math.random() * 100 - 50) + 'px'; 
    dust.style.setProperty('--sway-x', swayX);
    
    container.appendChild(dust);

    dust.addEventListener('animationend', () => {
        dust.remove();
        createParticle(container, colors);
    });
}

// =========================================================
// REVISI: EFEK BURST MAGIC STARDUST
// =========================================================
window.triggerConfetti = function(x, y) {
    let container = document.getElementById('confetti-container');
    if(!container) {
        container = document.createElement('div');
        container.id = 'confetti-container';
        document.body.appendChild(container);
    }
    
    // Palet warna mewah untuk ledakan partikel
    const colors = ['#d4af37', '#b59551', '#ffffff', '#fff8e7'];
    const burstCount = 60; // Jumlah partikel ledakan diperbanyak agar memukau
    
    for(let i = 0; i < burstCount; i++) {
        const spark = document.createElement('div');
        spark.classList.add('gold-burst');
        
        spark.style.left = x + 'px';
        spark.style.top = y + 'px';
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        spark.style.backgroundColor = color;
        spark.style.boxShadow = `0 0 10px ${color}, 0 0 20px #ffffff`;
        
        // Ukuran partikel ledakan
        const size = Math.random() * 5 + 3;
        spark.style.width = size + 'px';
        spark.style.height = size + 'px';
        
        // Pola ledakan menyebar 360 derajat
        const angle = Math.random() * Math.PI * 2;
        const velocity = 80 + Math.random() * 150; // Jarak tembak
        const dx = Math.cos(angle) * velocity + 'px';
        const dy = Math.sin(angle) * velocity + 'px';
        
        spark.style.setProperty('--dx', dx);
        spark.style.setProperty('--dy', dy);
        
        container.appendChild(spark);
        
        // Hapus partikel setelah animasi (1.5 detik)
        setTimeout(() => spark.remove(), 1500);
    }
};