(() => {
    'use strict';

    const slogans = [
  "Από τη φαντασία σας, στον χώρο σας.",
  "Ξύλο με χαρακτήρα. Δημιουργίες για μια ζωή.",
  "Εκεί που η παράδοση συναντά το σύγχρονο design.",
  "Μοναδικά έπιπλα για μοναδικούς χώρους.",
  "Η τέχνη του ξύλου, κομμένη στα μέτρα σας.",
    "Σχεδιάζουμε, κατασκευάζουμε, εντυπωσιάζουμε.",
    "Η ιστορία του ξύλου συνεχίζεται εδώ."
];

// Επιλέγει μια τυχαία πρόταση κατά τη φόρτωση
    const randomSlogan = slogans[Math.floor(Math.random() * slogans.length)];
document.getElementById('hero-slogan').innerText = randomSlogan;

    const root = document.documentElement;
    const header = document.getElementById('header');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    /* --- Navbar: σκουραίνει στο scroll --- */
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* --- Mobile menu --- */
    const toggle = header.querySelector('.menu-toggle');
    const setMenu = (open) => {
        header.classList.toggle('menu-open', open);
        toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setMenu(false);
    });

    /* --- Ομαλό scroll με δική μας διάρκεια --- */
const SCROLL_DURATION = 1200; // σε ms, αύξησέ το για πιο αργό scroll

function smoothScrollTo(targetY, duration) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime = null;

    // easeInOutCubic: αργή εκκίνηση, ταχύτερο μέσο, αργό τέλος
    const ease = (t) => t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

    function step(now) {
        if (startTime === null) startTime = now;
        const progress = Math.min((now - startTime) / duration, 1);
        window.scrollTo(0, startY + distance * ease(progress));
        if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
        const id = link.getAttribute('href').slice(1);
        const target = id ? document.getElementById(id) : document.body;
        if (!target) return;
        e.preventDefault();
        setMenu(false);

        const top = id ? target.offsetTop - header.offsetHeight : 0;

        if (reduceMotion.matches) {
            window.scrollTo(0, top);
        } else {
            smoothScrollTo(top, SCROLL_DURATION);
        }
    });
});

    /* --- Fade-in εφέ (αν δεν υποστηρίζεται, τα στοιχεία μένουν ορατά) --- */
    if (!('IntersectionObserver' in window)) {
        root.classList.remove('js');
    } else {
        const appear = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.fade-in-section').forEach((el) => appear.observe(el));

        /* --- Ενότητα "Σχετικά": εικόνα + διαδοχικά κείμενα --- */
        const about = document.getElementById('about');
        if (about) {
            const logoImg = about.querySelector('.slide-in-img');
            const fadeTexts = about.querySelectorAll('.fade-text');
            const aboutObserver = new IntersectionObserver((entries, observer) => {
                if (!entries.some((entry) => entry.isIntersecting)) return;
                observer.disconnect();
                if (logoImg) logoImg.classList.add('active');
                fadeTexts.forEach((el, i) => {
                    setTimeout(() => el.classList.add('visible'), 300 + i * 400);
                });
            }, { threshold: 0.3 });
            aboutObserver.observe(about);
        }
    }

    /* --- Marquee σχεδίων --- */
    const designImages = [1, 2, 3, 4, 5, 6].map((n) => `src/sxedia/d${n}.jpg`);
    const tracks = document.querySelectorAll('.marquee-track');

    // Διπλασιάζουμε τα στοιχεία για απρόσκοπτο loop (το 2ο σετ κρύβεται από τα βοηθητικά εργαλεία)
    tracks.forEach((track) => {
        [false, true].forEach((isClone) => {
            designImages.forEach((src, i) => {
                const item = document.createElement('button');
                item.type = 'button';
                item.className = 'marquee-item';
                item.setAttribute('aria-label', `Μεγέθυνση σχεδίου ${i + 1}`);
                if (isClone) {
                    item.tabIndex = -1;
                    item.setAttribute('aria-hidden', 'true');
                }
                const img = new Image();
                img.src = src;
                img.alt = '';
                img.width = 320;
                img.height = 200;
                img.loading = 'lazy';
                item.append(img);
                track.append(item);
            });
        });
    });

    /* --- Pop-up εικόνας (<dialog>): Esc και κλικ στο φόντο κλείνουν μόνα τους --- */
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const setPaused = (paused) => tracks.forEach((t) => t.classList.toggle('paused', paused));

    tracks.forEach((track) => {
        track.addEventListener('click', (e) => {
            const img = e.target.closest('.marquee-item')?.querySelector('img');
            if (!img) return;
            modalImg.src = img.src;
            modalImg.alt = img.closest('.marquee-item').getAttribute('aria-label');
            setPaused(true);
            modal.showModal();
        });
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('.modal-close')) modal.close();
    });
    modal.addEventListener('close', () => setPaused(false));

    /* --- Έτος στο footer --- */
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
})();
