// ===================
// 1. INISIALISASI & ELEMEN
// ===================
const scenes = document.querySelectorAll('.scene');
const music = document.getElementById('bgMusic');
const musicText = document.getElementById('musicText');
let confettiActive = false;

// ===================
// 2. FUNGSI UNTUK EFEK SUARA
// ===================
function playSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0; // Reset ke awal
        sound.volume = 0.3; // Volume 30%
        sound.play().catch(e => console.log("Suara tidak bisa diputar:", e));
    }
}

// ===================
// 3. LOGIKA MUSIK
// ===================
// Aktifkan musik setelah interaksi pertama
function initAudioOnInteraction() {
    if (music.paused) {
        music.volume = 0.4;
        music.play().then(() => {
            console.log("Musik berhasil diputar");
            musicText.textContent = "Musik: ON";
        }).catch(e => {
            console.log("Autoplay diblokir:", e);
            musicText.textContent = "Tap untuk musik";
        });
    }
    // Hapus event listener setelah pertama kali
    window.removeEventListener('click', initAudioOnInteraction);
    window.removeEventListener('touchstart', initAudioOnInteraction);
}

// Pasang listener untuk interaksi pertama
window.addEventListener('click', initAudioOnInteraction);
window.addEventListener('touchstart', initAudioOnInteraction);

function toggleMusic() {
    if (music.paused) {
        music.play();
        musicText.textContent = "Musik: ON";
    } else {
        music.pause();
        musicText.textContent = "Musik: OFF";
    }
}

// ===================
// 4. PERPINDAHAN SCENE
// ===================
function goToScene(sceneId) {
    scenes.forEach(scene => scene.classList.remove('active'));
    document.getElementById(sceneId).classList.add('active');
    
    // Konfeti di scene 3 dan 4
    if (sceneId === 'scene3' || sceneId === 'scene4') {
        startConfetti();
    }
}

// ===================
// 5. ANIMASI BUKA AMPLOP
// ===================
function openEnvelope() {
    playSound('clickSound');
    
    const envelope = document.querySelector('.envelope-container');
    const flap = document.querySelector('.flap');
    
    // 1. Animasi buka flap
    envelope.classList.add('open');
    
    // 2. Pindah ke scene2 setelah animasi
    setTimeout(() => {
        goToScene('scene2');
        
        // Reset amplop setelah beberapa saat
        setTimeout(() => {
            envelope.classList.remove('open');
        }, 500);
    }, 1200);
}

// ===================
// 6. TOMBOL "HMM..." YANG HINDAR
// ===================
function dodgeButton() {
    playSound('clickSound');
    
    const btn = document.getElementById('btnNo');
    const x = Math.random() * (window.innerWidth - btn.offsetWidth);
    const y = Math.random() * (window.innerHeight - btn.offsetHeight);
    
    btn.style.position = 'fixed';
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;
    
    // Ganti teks acak
    const texts = ["Yakinn nih?", "Cobaa yang iya dong!", "Jangan dipilih!", "Amplopnya bagus lho...", "Pilih iyaa dongg!"];
    btn.innerHTML = `<i class="fas fa-times-circle"></i> ${texts[Math.floor(Math.random() * texts.length)]}`;
}

function dodgeButtonMobile() {
    if ('ontouchstart' in window) {
        dodgeButton();
    }
}

// ===================
// 7. LOGIKA SURAT & RESPONS
// ===================
function showLetter() {
    playSound('clickSound');
    goToScene('scene3');
}

function showFinalScene() {
    playSound('clickSound');
    
    // 1. Pindah ke halaman terakhir
    goToScene('scene4');
    
    // 2. Scroll otomatis ke pertanyaan serius
    setTimeout(() => {
        const targetElement = document.getElementById('serious-question');
        if (targetElement) {
            targetElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Efek highlight
            targetElement.style.boxShadow = '0 0 30px rgba(255, 107, 139, 0.4)';
            setTimeout(() => {
                targetElement.style.boxShadow = '';
            }, 1500);
        }
    }, 100);
}

function restartExperience() {
    playSound('clickSound');
    goToScene('scene1');
}

function respond(choice) {
    playSound('clickSound');
    
    const responseBox = document.getElementById('finalResponse');
    
    if (choice === 'yes') {
        responseBox.innerHTML = `
            <h3 style="color:#4caf50;"><i class="fas fa-heart"></i> Alhamdulillah, Terima Kasih! 😭</h3>
            <p>Ini bener-bener jadi kejutan terindah di tahun baru! 🎉</p>
            <p><strong>Aku janji akan jaga perasaan ini dan usahain yang terbaik buat kita.</strong></p>
            <p>Aku tunggu ya, kita lanjut cerita... 💖</p>
        `;
        startConfetti();
    } else if (choice === 'maybe') {
        responseBox.innerHTML = `
            <h3 style="color:#ff9800;"><i class="fas fa-star"></i> Oke, aku tunggu...</h3>
            <p>Take your time, gak usah buru-buru.</p>
            <p>Tapi janji, kalo udah ada jawabannya, <strong>chat aku yang pertama ya!</strong> 🤞</p>
            <p>Kita tetap temenan yang asik sambil nunggu! ✨</p>
        `;
    }
    
    responseBox.scrollIntoView({ behavior: 'smooth' });
}

// ===================
// 8. ANIMASI KONFETI
// ===================
function startConfetti() {
    if (confettiActive) return;
    confettiActive = true;
    
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confettiCount = 120;
    const confettiPieces = [];
    const colors = ['#c62828', '#ffeb3b', '#4caf50', '#2196f3', '#ffffff'];
    
    // Buat partikel konfeti
    for (let i = 0; i < confettiCount; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 8 + 4,
            d: Math.random() * 3 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 10,
            tiltAngle: Math.random() * 0.1 - 0.05
        });
    }
    
    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < confettiPieces.length; i++) {
            const p = confettiPieces[i];
            ctx.beginPath();
            ctx.lineWidth = p.r / 2;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
            ctx.stroke();
            
            p.y += p.d;
            p.x += Math.sin(p.y * 0.01);
            p.tilt += p.tiltAngle;
            
            if (p.y > canvas.height) {
                confettiPieces[i] = {
                    x: Math.random() * canvas.width,
                    y: -20,
                    r: p.r,
                    d: p.d,
                    color: p.color,
                    tilt: p.tilt,
                    tiltAngle: p.tiltAngle
                };
            }
        }
        
        requestAnimationFrame(drawConfetti);
    }
    
    // Hentikan konfeti setelah 10 detik
    setTimeout(() => {
        canvas.width = 0;
        canvas.height = 0;
        confettiActive = false;
    }, 10000);
    
    drawConfetti();
}
// ===================
// ===================
// ===================
// 10. GALLERY PORTRAIT FUNCTIONS
// ===================

let currentPortraitSlide = 0;
let portraitSlides = [];
let portraitDots = [];

function initPortraitGallery() {
    portraitSlides = document.querySelectorAll('.portrait-slide');
    portraitDots = document.querySelectorAll('.p-dot');
    
    if (portraitSlides.length > 0) {
        updatePortraitSlide();
        setupPortraitSwipe();
    }
}

function updatePortraitSlide() {
    // Sembunyikan semua slide
    portraitSlides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Tampilkan slide aktif
    if (portraitSlides[currentPortraitSlide]) {
        portraitSlides[currentPortraitSlide].classList.add('active');
    }
    
    // Update indikator dots
    portraitDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentPortraitSlide);
    });
    
    // Efek suara klik
    playSound('clickSound');
}

function nextPortraitSlide() {
    if (currentPortraitSlide < portraitSlides.length - 1) {
        currentPortraitSlide++;
    } else {
        currentPortraitSlide = 0; // Loop ke awal
    }
    updatePortraitSlide();
}

function prevPortraitSlide() {
    if (currentPortraitSlide > 0) {
        currentPortraitSlide--;
    } else {
        currentPortraitSlide = portraitSlides.length - 1; // Loop ke akhir
    }
    updatePortraitSlide();
}

function goToPortraitSlide(index) {
    if (index >= 0 && index < portraitSlides.length) {
        currentPortraitSlide = index;
        updatePortraitSlide();
    }
}

// Swipe untuk HP
function setupPortraitSwipe() {
    const slider = document.getElementById('portraitSlider');
    if (!slider) return;
    
    let startX = 0;
    let endX = 0;
    const swipeThreshold = 50;
    
    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });
    
    slider.addEventListener('touchmove', (e) => {
        endX = e.touches[0].clientX;
    }, { passive: true });
    
    slider.addEventListener('touchend', () => {
        const diffX = startX - endX;
        
        if (Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0) {
                // Swipe kiri = next
                nextPortraitSlide();
            } else {
                // Swipe kanan = prev
                prevPortraitSlide();
            }
        }
    }, { passive: true });
}

// Update fungsi goToScene untuk include portrait gallery
function goToScene(sceneId) {
    scenes.forEach(scene => scene.classList.remove('active'));
    document.getElementById(sceneId).classList.add('active');
    
    // Konfeti di scene 3, 4, dan 5
    if (sceneId === 'scene3' || sceneId === 'scene4' || sceneId === 'scene5') {
        startConfetti();
    }
    
    // Inisialisasi gallery portrait jika masuk scene5
    if (sceneId === 'scene5') {
        setTimeout(initPortraitGallery, 100);
    }
}

// Keyboard navigation (untuk desktop)
document.addEventListener('keydown', (e) => {
    // Cek jika di scene5
    const scene5 = document.getElementById('scene5');
    if (scene5 && scene5.classList.contains('active')) {
        if (e.key === 'ArrowLeft') {
            prevPortraitSlide();
        } else if (e.key === 'ArrowRight') {
            nextPortraitSlide();
        }
    }
});
// ===================
// 9. INISIALISASI & EVENT LISTENER
// ===================
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi hati jatuh
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach((heart, i) => {
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.animationDuration = `${Math.random() * 15 + 10}s`;
        heart.style.animationDelay = `${Math.random() * 5}s`;
        heart.style.opacity = Math.random() * 0.7 + 0.3;
        heart.style.fontSize = `${Math.random() * 20 + 20}px`;
    });
    
    // Event listener untuk amplop (PENTING!)
    const envelopeBtn = document.getElementById('theEnvelope');
    if (envelopeBtn) {
        envelopeBtn.addEventListener('click', openEnvelope);
        console.log("Event listener amplop terpasang");
    }
    
    // Event listener untuk semua tombol (efek suara klik)
    const allButtons = document.querySelectorAll('button, .btn, .btn-next, .btn-final, .btn-yes, .btn-no, .btn-romantic, .btn-share');
    allButtons.forEach(button => {
        button.addEventListener('click', function() {
            playSound('clickSound');
        });
    });
    
    // Event listener untuk link di header
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', function() {
            playSound('clickSound');
        });
    });
    
    // Pastikan scene 1 aktif
    goToScene('scene1');
    
    // Event listener untuk resize window
    window.addEventListener('resize', function() {
        const canvas = document.getElementById('confettiCanvas');
        if (confettiActive) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    });
});