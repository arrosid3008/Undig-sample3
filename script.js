document.addEventListener("DOMContentLoaded", () => {
    // 1. Pastikan GSAP terdaftar dengan benar
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    } else {
        console.error("GSAP tidak ditemukan. Pastikan koneksi internet stabil atau CDN benar.");
    }

    // 2. Elemen Selector
    const coverScreen = document.getElementById('cover-screen');
    const btnOpen = document.getElementById('btn-open-invitation');
    const bgMusic = document.getElementById('bg-music');
    const audioControl = document.getElementById('audio-control');
    const rsvpForm = document.getElementById('rsvp-form');

    // Pastikan body terkunci di awal
    document.body.style.overflow = 'hidden';

    // 3. Logika Buka Undangan
    if (btnOpen && coverScreen) {
        btnOpen.addEventListener('click', () => {
            coverScreen.classList.add('cover-hidden');
            document.body.style.overflow = 'auto';
            
            // Play Audio dengan handling error (kebijakan browser)
            if (bgMusic) {
                bgMusic.play().then(() => {
                    audioControl?.classList.remove('hidden');
                }).catch(err => console.log("Autoplay dicegah:", err));
            }

            // Animasi Hero setelah dibuka
            gsap.fromTo('.gsap-hero-text', 
                { y: 50, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: 'power3.out' }
            );
        });
    }

    // 4. Countdown Timer (Perbaikan format tanggal)
    const targetDate = new Date("April 5, 2026 08:00:00").getTime();
    
    const updateCountdown = () => {
        const now = new Date().getTime();
        const diff = targetDate - now;

        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);

            if(document.getElementById("days")) document.getElementById("days").innerText = days.toString().padStart(2, '0');
            if(document.getElementById("hours")) document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
            if(document.getElementById("mins")) document.getElementById("mins").innerText = mins.toString().padStart(2, '0');
            if(document.getElementById("secs")) document.getElementById("secs").innerText = secs.toString().padStart(2, '0');
        }
    };
    setInterval(updateCountdown, 1000);

    // 5. Animasi Scroll (GSAP)
    // Efek Parallax background hero
    gsap.to(".hero-bg", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
            trigger: "section",
            scrub: true
        }
    });

    // Fade in untuk elemen dengan class .gsap-fade
    gsap.utils.toArray('.gsap-fade').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 90%",
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });
    });
});