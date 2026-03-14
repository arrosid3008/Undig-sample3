const CONFIG = {
    eventTitle: "Pernikahan Arrosid & Zumrotus",
    eventStartUTC: "20260405T010000Z", 
    eventEndUTC: "20260405T060000Z",   
    eventLocation: "GOR Jatimekar, Bandung",
    eventDesc: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir."
};

// URL GOOGLE APPS SCRIPT WEB APP 
const scriptURL = 'https://script.google.com/macros/s/AKfycbw1PBqhELo0eKayaEkpC2wbSu_w-O6T7co9MG9_WrcOJoBGS-ryaHm7esmoyv9madk/exec';

let replyToId = null; 

document.addEventListener("DOMContentLoaded", () => {
    // 1. Setup Guest Name URL Parameter
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    const guestNameEl = document.getElementById('guest-name');
    
    if(guestNameEl) {
        guestNameEl.innerText = (guestName && guestName.trim() !== '') ? guestName : "Tamu Spesial"; 
    }

    // 2. Theme Toggle
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

    // 3. Opening Invitation & Music
    const btnOpen = document.getElementById('btn-open');
    const openingScreen = document.getElementById('opening-screen');
    const mainContent = document.getElementById('main-content');
    const bottomNav = document.getElementById('bottom-nav');
    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-control');
    let isPlaying = false;
    let wasMusicPlayingBeforeVideo = false; 

    const toggleMusic = () => {
        if (!bgMusic) return;
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
            triggerConfetti(e.clientX, e.clientY);
            setTimeout(() => {
                openingScreen.classList.add('slide-up');
                setTimeout(() => {
                    openingScreen.style.display = 'none';
                    mainContent.classList.remove('hidden');
                    bottomNav.classList.remove('hidden');
                    if(musicBtn) musicBtn.classList.remove('hidden');
                    initParticles();
                }, 800); 
                if (!isPlaying) toggleMusic();
            }, 300); 
        });
    }

    // 4. Video Interaction
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
        const resumeMusic = () => {
            if (wasMusicPlayingBeforeVideo && !isPlaying) {
                bgMusic.play();
                if(musicBtn) musicBtn.classList.add('playing');
                isPlaying = true;
            }
        };
        storyVideo.addEventListener('pause', resumeMusic);
        storyVideo.addEventListener('ended', resumeMusic);
    }

    // 5. Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
    reveals.forEach(el => observer.observe(el));

    const heroSection = document.querySelector("#hero");
    if(heroSection) {
        const heroObserver = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) entries[0].target.classList.add("hero-active");
        },{ threshold: 0.3 });
        heroObserver.observe(heroSection);
    }

    // 6. Smart Bottom Nav
    let lastScrollY = window.scrollY;
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                if (currentScrollY > lastScrollY && currentScrollY > 300) {
                    bottomNav.classList.add('nav-hidden');
                } else {
                    bottomNav.classList.remove('nav-hidden');
                }
                lastScrollY = currentScrollY;
                ticking = false;
            });
            ticking = true;
        }
    });

    // 7. Initialize Swiper Gallery
    if(typeof Swiper !== 'undefined') {
        new Swiper('.mySwiper', {
            effect: "coverflow", grabCursor: true, centeredSlides: true, slidesPerView: "auto",
            coverflowEffect: { rotate: 5, stretch: 0, depth: 100, modifier: 2, slideShadows: false },
            loop: true, autoplay: { delay: 3500, disableOnInteraction: false },
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            breakpoints: { 320: { slidesPerView: 1.2, spaceBetween: 20 }, 600: { slidesPerView: 2.2, spaceBetween: 30 } }
        });
    }

    // 8. Calendar Setup
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

    // 9. Countdown Timer
    const weddingDate = new Date("April 5, 2026 08:00:00").getTime();
    const countdownElement = document.getElementById("countdown");
    
    if(countdownElement) {
        const countdown = setInterval(() => {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            if(distance < 0){
                clearInterval(countdown);
                countdownElement.innerHTML = "<h3 style='color: var(--accent); margin-top: 20px; font-family: Playfair Display;'>Acara Telah Berlangsung / Selesai 💍</h3>";
                return;
            }

            document.getElementById("days").innerText = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
            document.getElementById("hours").innerText = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
            document.getElementById("minutes").innerText = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
            document.getElementById("seconds").innerText = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
        }, 1000);
    }

    // 10. RSVP Form dengan FETCH ke Google Sheets
    const rsvpForm = document.getElementById('rsvp-form');
    const formGSheet = document.forms['submit-to-google-sheet'];
    const btnSubmitRsvp = document.getElementById('btn-submit-rsvp');
    
    const STORAGE_KEY = 'rsvp_chat_v1';
    renderChat(STORAGE_KEY);

    if(rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nama = document.getElementById('rsvp-name').value.trim();
            const kehadiran = document.getElementById('rsvp-attendance').value;
            const jumlah = document.getElementById('rsvp-jumlah').value;
            const pesan = document.getElementById('rsvp-message').value.trim();

            if(!nama || !kehadiran || !jumlah || !pesan) return;

            // Efek Loading pada tombol
            const originalBtnText = btnSubmitRsvp.innerHTML;
            btnSubmitRsvp.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
            btnSubmitRsvp.disabled = true;

            // Fetch Data ke Google Sheets
            fetch(scriptURL, { method: 'POST', body: new FormData(formGSheet), mode: 'no-cors'})
                .then(response => {
                    // Update Local Storage (Untuk Chat Bubble Real-time)
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
                    if(chatList) setTimeout(() => chatList.scrollTop = chatList.scrollHeight, 100);

                    // Kembalikan Tombol ke semula
                    btnSubmitRsvp.innerHTML = originalBtnText;
                    btnSubmitRsvp.disabled = false;
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    showToast("Terjadi kesalahan, gagal mengirim ucapan.");
                    btnSubmitRsvp.innerHTML = originalBtnText;
                    btnSubmitRsvp.disabled = false;
                });
        });
    }

    // 11. Gift Reveal Logic
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
window.toggleGiftInfo = function(btn) {
    const card = btn.closest('.atm-card');
    card.classList.toggle('expanded');
    btn.innerHTML = card.classList.contains('expanded') ? '<i class="fas fa-chevron-up"></i> Tutup' : 'Info';
};

window.copyText = function(elementId, btnElement) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(() => {
        const originalHtml = btnElement.innerHTML;
        btnElement.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
        btnElement.classList.add('copied');
        showToast("Berhasil disalin!");
        
        setTimeout(() => {
            btnElement.innerHTML = originalHtml;
            btnElement.classList.remove('copied');
        }, 2000);
    }).catch(err => alert("Gagal menyalin."));
};

window.renderChat = function(storageKey) {
    const container = document.getElementById('wishes-list');
    if(!container) return;

    const data = JSON.parse(localStorage.getItem(storageKey)) || [];
    
    if(data.length === 0) {
        container.innerHTML = `<p class="text-muted" style="text-align:center; font-family:sans-serif; font-size:0.9rem;">Jadilah yang pertama mengirim ucapan!</p>`;
        return;
    }
    
    container.innerHTML = ''; 
    data.forEach(item => {
        let quoteHtml = '';
        if(item.replyTo) {
            const targetMsg = data.find(d => d.id === item.replyTo);
            if(targetMsg) {
                const shortMsg = targetMsg.pesan.length > 40 ? targetMsg.pesan.substring(0, 40) + '...' : targetMsg.pesan;
                quoteHtml = `<div class="chat-quote" style="background: var(--bg-secondary); padding: 8px 12px; border-left: 3px solid var(--accent); font-size: 0.9rem; color: var(--text-muted); margin-bottom: 10px; border-radius: 4px;"><b>${targetMsg.nama}</b> ${shortMsg}</div>`;
            }
        }

        const badgeClass = item.kehadiran === 'Hadir' ? 'badge-hadir' : 'badge-absen';
        const displayTime = item.waktu || 'Baru saja';
        
        const card = document.createElement('div');
        card.className = 'chat-bubble';
        card.innerHTML = `
            ${quoteHtml}
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--border-color); padding-bottom: 8px; margin-bottom: 8px;">
                <div style="display: flex; flex-direction: column;">
                    <span class="chat-name">${item.nama}</span>
                    <span class="chat-time">${displayTime}</span>
                </div>
                <span class="${badgeClass}"><i class="fas ${item.kehadiran==='Hadir'?'fa-check-circle':'fa-times-circle'}"></i> ${item.kehadiran}</span>
            </div>
            <div class="chat-text">${item.pesan}</div>
            <button style="background: transparent; border: none; color: var(--accent); font-size: 0.85rem; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; margin-top: 10px; font-family: sans-serif;" onclick="setReplyChat('${item.id}', '${item.nama.replace(/'/g,"\\'").replace(/"/g,'"')}')"><i class="fas fa-reply"></i> Balas</button>
        `;
        container.appendChild(card);
    });
};

window.setReplyChat = function(id, nama) {
    replyToId = id;
    const rsvpMsg = document.getElementById('rsvp-message');
    if(rsvpMsg) {
        rsvpMsg.placeholder = `Membalas ucapan ${nama}...`;
        rsvpMsg.focus();
    }
};

window.cancelReplyChat = function() {
    replyToId = null;
    const rsvpMsg = document.getElementById('rsvp-message');
    if(rsvpMsg) rsvpMsg.placeholder = "Tuliskan doa & ucapan...";
};

window.expandStory = function() {
    const content = document.getElementById('story-full');
    const btn = document.querySelector('.btn-expand');
    if(!content) return;

    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        btn.innerHTML = '<i class="fas fa-heart"></i> Tutup Cerita <i class="fas fa-chevron-up"></i>';
    } else {
        content.classList.add('hidden');
        btn.innerHTML = '<i class="fas fa-heart"></i> Lihat Cerita <i class="fas fa-chevron-down"></i>';
    }
};

window.showToast = function(message) {
    const toast = document.getElementById('toast');
    if(!toast) return;
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
};

window.initParticles = function() {
    const container = document.getElementById('particles-container');
    if(!container) return;
    container.innerHTML = '';
    
    const colors = ['#b89152', '#d4af37', '#ffffff', '#e3d9c6'];
    const particleCount = 35; 
    
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => createParticle(container, colors), Math.random() * 3000);
    }
};

function createParticle(container, colors) {
    const dust = document.createElement('div');
    dust.classList.add('magic-dust'); 
    
    const randColor = colors[Math.floor(Math.random() * colors.length)];
    dust.style.backgroundColor = randColor;
    dust.style.boxShadow = `0 0 8px ${randColor}, 0 0 10px rgba(255, 255, 255, 0.3)`;
    
    dust.style.left = Math.random() * 100 + '%';
    
    const size = Math.random() * 3 + 2; 
    dust.style.width = size + 'px';
    dust.style.height = size + 'px';
    
    const duration = Math.random() * 5 + 6; 
    dust.style.animationDuration = duration + 's';
    
    const swayX = (Math.random() * 100 - 50) + 'px'; 
    dust.style.setProperty('--sway-x', swayX);
    
    container.appendChild(dust);

    dust.addEventListener('animationend', () => {
        dust.remove();
        createParticle(container, colors);
    });
}

window.triggerConfetti = function(x, y) {
    let container = document.getElementById('confetti-container');
    if(!container) {
        container = document.createElement('div');
        container.id = 'confetti-container';
        document.body.appendChild(container);
    }
    
    const colors = ['#d4af37', '#b89152', '#ffffff', '#e3d9c6'];
    const burstCount = 40; 
    
    for(let i = 0; i < burstCount; i++) {
        const spark = document.createElement('div');
        spark.classList.add('gold-burst');
        
        spark.style.left = x + 'px';
        spark.style.top = y + 'px';
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        spark.style.backgroundColor = color;
        
        spark.style.borderRadius = Math.random() > 0.5 ? '2px' : '50%';
        spark.style.boxShadow = `0 2px 5px rgba(0,0,0,0.2)`;
        
        const size = Math.random() * 6 + 4;
        spark.style.width = size + 'px';
        spark.style.height = size + 'px';
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 100; 
        const dx = Math.cos(angle) * velocity + 'px';
        const dy = Math.sin(angle) * velocity + 'px';
        
        spark.style.setProperty('--dx', dx);
        spark.style.setProperty('--dy', dy);
        
        container.appendChild(spark);
        setTimeout(() => spark.remove(), 800);
    }
};