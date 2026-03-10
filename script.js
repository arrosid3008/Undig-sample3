// --- CONFIGURASI DATA ---
const CONFIG = {
    eventTitle: "Pernikahan Arrosid & Zumrotus",
    eventStartUTC: "20260405T010000Z", // Jam 08:00 WIB
    eventEndUTC: "20260405T060000Z",   // Jam 13:00 WIB
    eventLocation: "GOR Jatimekar, Bandung",
    eventDesc: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir."
};

document.addEventListener("DOMContentLoaded", () => {

    // 1. THEME TOGGLE (Dark / Light Mode)
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    themeBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const icon = themeBtn.querySelector('i');
        if (body.classList.contains('dark-mode')) {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    });

    // 2. BUKA UNDANGAN & MUSIC CONTROL
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
            musicBtn.classList.remove('playing');
        } else {
            bgMusic.play().catch(e => console.log("Autoplay dicegah browser", e));
            musicBtn.classList.add('playing');
        }
        isPlaying = !isPlaying;
    };

    musicBtn.addEventListener('click', toggleMusic);

    btnOpen.addEventListener('click', () => {
        openingScreen.classList.add('slide-up');
        
        setTimeout(() => {
            openingScreen.style.display = 'none';
            mainContent.classList.remove('hidden');
            bottomNav.classList.remove('hidden');
            musicBtn.classList.remove('hidden');
            
            // Inisiasi efek bunga jatuh setelah undangan dibuka
            initParticles();
        }, 800);

        if (!isPlaying) toggleMusic();
    });

    // 2.1 INTERAKSI VIDEO & AUDIO STORY
    const storyVideo = document.getElementById('story-video');
    if(storyVideo) {
        storyVideo.addEventListener('play', () => {
            if (isPlaying) {
                wasMusicPlayingBeforeVideo = true; 
                bgMusic.pause(); 
                musicBtn.classList.remove('playing'); 
                isPlaying = false;
            } else {
                wasMusicPlayingBeforeVideo = false;
            }
        });

        storyVideo.addEventListener('pause', () => {
            if (wasMusicPlayingBeforeVideo && !isPlaying) {
                bgMusic.play();
                musicBtn.classList.add('playing');
                isPlaying = true;
            }
        });

        storyVideo.addEventListener('ended', () => {
            if (wasMusicPlayingBeforeVideo && !isPlaying) {
                bgMusic.play();
                musicBtn.classList.add('playing');
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
    const swiper = new Swiper('.mySwiper', {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        coverflowEffect: {
            rotate: 20,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
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

    // 6. ADD TO CALENDAR LINKS
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(CONFIG.eventTitle)}&dates=${CONFIG.eventStartUTC}/${CONFIG.eventEndUTC}&details=${encodeURIComponent(CONFIG.eventDesc)}&location=${encodeURIComponent(CONFIG.eventLocation)}`;
    document.getElementById('btn-google-cal').href = googleCalUrl;

    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${CONFIG.eventStartUTC}\nDTEND:${CONFIG.eventEndUTC}\nSUMMARY:${CONFIG.eventTitle}\nLOCATION:${CONFIG.eventLocation}\nDESCRIPTION:${CONFIG.eventDesc}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const icsUrl = URL.createObjectURL(blob);
    
    const appleBtn = document.getElementById('btn-apple-cal');
    const outlookBtn = document.getElementById('btn-outlook-cal');
    appleBtn.href = icsUrl; appleBtn.download = "Wedding.ics";
    outlookBtn.href = icsUrl; outlookBtn.download = "Wedding.ics";

    // 7. COUNTDOWN TIMER
    const weddingDate = new Date("April 5, 2026 08:00:00").getTime();
    const countdownElement = document.getElementById("countdown");
    
    const countdown = setInterval(() => {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if(distance < 0){
            clearInterval(countdown);
            if(countdownElement) countdownElement.innerHTML = "<h3 style='color: var(--accent); margin-top: 20px;'>Acara Sedang Berlangsung / Telah Selesai 💍</h3>";
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

    // 8. RSVP FORM & LOCAL STORAGE
    const rsvpForm = document.getElementById('rsvp-form');
    const wishesListContainer = document.getElementById('wishes-list');
    const STORAGE_KEY = 'rsvp_data_v1';

    renderWishes();

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nama = document.getElementById('rsvp-name').value.trim();
        const kehadiran = document.getElementById('rsvp-attendance').value;
        const pesan = document.getElementById('rsvp-message').value.trim();

        if(!nama || !kehadiran || !pesan) return;

        const entry = { id: Date.now(), nama, kehadiran, pesan };
        
        const existingData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        existingData.unshift(entry);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));

        renderWishes();
        rsvpForm.reset();
        showToast("Terima kasih atas ucapan dan doanya!");
    });

    function renderWishes() {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        
        if(data.length === 0) {
            wishesListContainer.innerHTML = `
                <div class="wish-item text-center" style="border-left: none;">
                    <p class="text-muted">Jadilah yang pertama memberikan ucapan!</p>
                </div>`;
            return;
        }
        
        wishesListContainer.innerHTML = ''; 
        data.forEach(item => {
            const badgeClass = item.kehadiran === 'Hadir' ? 'badge-hadir' : 'badge-absen';
            const icon = item.kehadiran === 'Hadir' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-times-circle"></i>';
            const card = document.createElement('div');
            card.className = 'wish-item';
            card.innerHTML = `
                <div class="wish-name">${item.nama} <span class="${badgeClass}">${icon} ${item.kehadiran}</span></div>
                <div class="wish-text">"${item.pesan}"</div>
            `;
            wishesListContainer.appendChild(card);
        });
    }

    // 9. ANIMASI PARTIKEL (BUNGA JATUH) - DIOPTIMASI UNTUK MOBILE
    function initParticles() {
        const container = document.getElementById('particles-container');
        // Kosongkan container berjaga-jaga jika ter-trigger 2x
        container.innerHTML = '';
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            createParticle(container);
        }
    }

    function createParticle(container) {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        
        // Menggunakan persen (%) agar responsif di layar mobile
        petal.style.left = Math.random() * 100 + '%';
        
        const size = Math.random() * 8 + 8; // 8px - 16px
        petal.style.width = size + 'px';
        petal.style.height = size + 'px';
        
        // Durasi 10s - 15s (agar tidak terlalu berat dan cepat dirender)
        const duration = Math.random() * 5 + 10;
        petal.style.animationDuration = duration + 's';
        
        petal.style.animationDelay = Math.random() * 5 + 's';
        
        container.appendChild(petal);

        // Hapus elemen HANYA ketika animasi CSS selesai, lalu buat ulang
        // Ini lebih aman dan hemat memori (cleaner DOM)
        petal.addEventListener('animationend', () => {
            petal.remove();
            createParticle(container);
        });
    }
});

// --- FUNGSI GLOBAL ---
window.expandStory = function() {
    const content = document.getElementById('story-full');
    const btn = document.querySelector('.btn-expand');
    
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
        showToast("Nomor berhasil disalin!");
    }).catch(err => alert("Gagal menyalin."));
};

window.showToast = function(message) {
    const toast = document.getElementById('toast');
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
};