(() => {
    'use strict';

    /* Για να προσθέσεις φωτογραφίες ή νέα κατηγορία, άλλαξε μόνο αυτόν τον πίνακα.
       Οι εικόνες ονομάζονται <prefix>1.jpg ... <prefix><count>.jpg μέσα στο src/<folder>/ */
    const GALLERIES = {
        epipla:    { title: 'Έπιπλα',    folder: 'epipla',    prefix: 'e', count: 6, alt: 'Έπιπλο' },
        ntoulapes: { title: 'Ντουλάπες', folder: 'ntoulapes', prefix: 'w', count: 5, alt: 'Ντουλάπα' },
        kouzines:  { title: 'Κουζίνες',  folder: 'kouzines',  prefix: 'k', count: 8, alt: 'Κουζίνα' },
        syntheta:  { title: 'Σύνθετα',   folder: 'syntheta',  prefix: 's', count: 5, alt: 'Σύνθετο' }
    };

    const type = new URLSearchParams(location.search).get('type');
    const gallery = GALLERIES[type];
    if (!gallery) {
        location.replace('index.html#services');
        return;
    }

    const images = Array.from({ length: gallery.count }, (_, i) =>
        `src/${gallery.folder}/${gallery.prefix}${i + 1}.jpg`);

    const container = document.querySelector('.slider-container');
    const sliderImg = document.getElementById('main-slider-img');
    const counter = document.getElementById('image-counter');

    document.title = `${gallery.title} - Avramidis Woodlab`;
    document.getElementById('gallery-title').textContent = gallery.title;

    let currentIndex = 0;
    let token = 0; // αγνοεί παλιές εναλλαγές αν ο χρήστης πατάει γρήγορα

    const wrap = (i) => (i + images.length) % images.length;
    const preload = (i) => { new Image().src = images[wrap(i)]; };

    function render() {
        sliderImg.src = images[currentIndex];
        sliderImg.alt = `${gallery.alt} ${currentIndex + 1} από ${images.length}`;
        counter.textContent = `${currentIndex + 1} / ${images.length}`;
        preload(currentIndex + 1);
        preload(currentIndex - 1);
    }

    function show(index) {
        currentIndex = wrap(index);
        const mine = ++token;
        sliderImg.classList.add('is-fading');

        // Αλλάζουμε εικόνα μόνο όταν η επόμενη έχει φορτώσει (και έχει περάσει το fade)
        const next = new Image();
        next.src = images[currentIndex];
        Promise.all([
            next.decode().catch(() => {}),
            new Promise((resolve) => setTimeout(resolve, 150))
        ]).then(() => {
            if (mine !== token) return;
            render();
            sliderImg.classList.remove('is-fading');
        });
    }

    document.getElementById('nextBtn').addEventListener('click', () => show(currentIndex + 1));
    document.getElementById('prevBtn').addEventListener('click', () => show(currentIndex - 1));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') show(currentIndex + 1);
        else if (e.key === 'ArrowLeft') show(currentIndex - 1);
    });

    /* Swipe σε κινητά */
    let startX = 0;
    let startY = 0;
    container.addEventListener('touchstart', (e) => {
        startX = e.changedTouches[0].clientX;
        startY = e.changedTouches[0].clientY;
    }, { passive: true });
    container.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            show(currentIndex + (dx < 0 ? 1 : -1));
        }
    }, { passive: true });

    render();
})();
