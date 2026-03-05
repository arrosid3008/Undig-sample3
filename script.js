document.addEventListener("DOMContentLoaded", () => {
    // Daftarkan plugin GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Kunci scroll sebelum cover dibuka
    document.body.style.overflowY = 'hidden';

    // --- 1. COVER SCREEN & AUDIO LOGIC ---
    const bgMusic = document.getElementById('bg-music');
    const audioControl = document.getElementById('audio-control');
    const btnOpenInvitation = document.getElementById('btn-open-invitation');
    let isPlaying = false;

    // Buka Undangan
    btnOpenInvitation.addEventListener('click', () => {
        // Sembunyikan cover
        document.getElementById('cover-screen').classList.add('cover-hidden');
        document.body.style.overflowY = 'auto'; // Buka kunci scroll
        
        // Putar audio
        bgMusic.play().then(() => {
            isPlaying = true;
            audioControl.classList.remove('hidden');
            audioControl.classList.remove('audio-paused');
        }).catch(e => console.log("Audio autoplay dicegah oleh browser."));

        // Animasi teks Hero Section
        gsap.fromTo('.gsap-hero-text', 
            { y: 50, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1.5, stagger: 0.3, ease: 'power3.out', delay: 0.5 }
        );
    });

    // Tombol Toggle Play/Pause Audio
    audioControl.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            audioControl.classList.add('audio-paused');
        } else {
            bgMusic.play();
            audioControl.classList.remove('audio-paused');
        }
        isPlaying = !isPlaying;
    });

    // --- 2. COUNTDOWN TIMER ---
    // Atur tanggal pernikahan: 05 April 2026, 08:00 WIB
    const targetDate = new Date("2026-04-05T08:00:00").getTime();
    
    const countdown = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            clearInterval(countdown);
            // Anda bisa menambahkan logika di sini ketika waktu sudah habis
            return;
        }

        document.getElementById("days").innerText = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
        document.getElementById("hours").innerText = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
        document.getElementById("mins").innerText = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        document.getElementById("secs").innerText = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
    }, 1000);

    // --- 3. COPY REKENING LOGIC ---
    document.getElementById('btn-copy-rek').addEventListener('click', () => {
        const rekText = document.getElementById("rek-bca").innerText;
        navigator.clipboard.writeText(rekText).then(() => {
            alert("Nomor Rekening BCA berhasil disalin: " + rekText);
        });
    });

    // --- 4. RSVP FORM LOGIC (Tanpa Reload) ---
    document.getElementById('rsvp-form').addEventListener('submit', function(e) {
        e.preventDefault(); // Mencegah halaman ter-refresh
        
        const name = document.getElementById('name').value;
        const attendance = document.getElementById('attendance').value;
        const message = document.getElementById('message').value;

        // Buat elemen HTML baru untuk pesan
        const newWish = document.createElement('div');
        newWish.className = 'bg-gray-50 p-6 border-l-2 border-black mb-4 slide-down';
        newWish.innerHTML = `
            <p class="font-serif text-lg mb-1">${name}</p>
            <span class="text-xs ${attendance === 'Hadir' ? 'text-white bg-black' : 'text-gray-500 bg-gray-200'} px-2 py-1 rounded-sm">${attendance}</span>
            <p class="text-sm mt-3 text-gray-700 italic">"${message}"</p>
        `;

        // Masukkan elemen baru ke bagian atas daftar
        const container = document.getElementById('wishes-container');
        container.insertBefore(newWish, container.firstChild);

        // Reset form dan tampilkan pesan sukses
        this.reset();
        alert("Terima kasih! Pesan dan konfirmasi kehadiran Anda telah terkirim.");
    });

    // --- 5. GSAP SCROLL ANIMATIONS ---
    
    // Parallax pada Background Hero
    gsap.to('.hero-bg', {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero-bg",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // Animasi Fade-in umum
    gsap.utils.toArray('.gsap-fade').forEach(elem => {
        gsap.fromTo(elem, 
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1, ease: 'power2.out',
                scrollTrigger: {
                    trigger: elem,
                    start: "top 85%",
                }
            }
        );
    });

    // Animasi beruntun (stagger) pada Love Story
    gsap.fromTo('.gsap-story', 
        { x: -30, opacity: 0 },
        {
            x: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power2.out',
            scrollTrigger: {
                trigger: ".gsap-story",
                start: "top 80%",
            }
        }
    );

    // Animasi beruntun pada Galeri
    gsap.fromTo('.gsap-gallery', 
        { y: 50, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out',
            scrollTrigger: {
                trigger: ".gsap-gallery",
                start: "top 80%",
            }
        }
    );
});
