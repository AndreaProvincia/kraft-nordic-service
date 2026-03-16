// Shrink hero on scroll
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero-section');
    const topbar = document.querySelector('.topbar');
    const body = document.body;

    if (window.scrollY > 50) {
        if (hero) hero.classList.add('shrink');
        if (topbar) topbar.classList.add('shrink');
        if (body) body.classList.remove('topbar-fixed-padding');
    } else {
        if (hero) hero.classList.remove('shrink');
        if (topbar) topbar.classList.remove('shrink');
        if (body) body.classList.add('topbar-fixed-padding');
    }
});

// Toggle search field in topbar
document.addEventListener('DOMContentLoaded', function() {
    // ensure body has padding to account for fixed topbar initially
    document.body.classList.add('topbar-fixed-padding');
    const searchForm = document.querySelector('.search-form');
    if (!searchForm) return;
    const toggle = searchForm.querySelector('.search-toggle');
    const input = searchForm.querySelector('input[type="search"]');
    const submit = searchForm.querySelector('.search-submit');

    toggle && toggle.addEventListener('click', function(e) {
        const isOpen = searchForm.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        if (isOpen) {
            // focus input after it becomes visible
            setTimeout(() => input && input.focus(), 50);
        }
    });

    // Close search if click outside
    document.addEventListener('click', function(e) {
        if (!searchForm.classList.contains('open')) return;
        if (!searchForm.contains(e.target)) {
            searchForm.classList.remove('open');
            toggle && toggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Optional: prevent empty searches
    searchForm.addEventListener('submit', function(e) {
        if (input && input.value.trim() === '') {
            e.preventDefault();
            input.focus();
        }
    });
});

// Transform each .service-image into a simple slider (keeps original <img> intact)
document.addEventListener('DOMContentLoaded', function() {
    const serviceImages = document.querySelectorAll('.service-image');
    serviceImages.forEach(container => {
        // if already transformed, skip
        if (container.querySelector('.slides')) return;

        const imgs = Array.from(container.querySelectorAll('img'));
        if (imgs.length === 0) return;

        // build slides wrapper
        const slides = document.createElement('div');
        slides.className = 'slides';

        imgs.forEach(img => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            // move existing img into slide (preserve attributes)
            slide.appendChild(img);
            slides.appendChild(slide);
        });

        // clear container and attach slides
        container.innerHTML = '';
        container.appendChild(slides);

        // add controls
        const prev = document.createElement('button');
        prev.type = 'button'; prev.className = 'slider-btn prev'; prev.setAttribute('aria-label', 'Föregående'); prev.textContent = '‹';
        const next = document.createElement('button');
        next.type = 'button'; next.className = 'slider-btn next'; next.setAttribute('aria-label', 'Nästa'); next.textContent = '›';
        const dots = document.createElement('div'); dots.className = 'slider-dots';
        container.appendChild(prev); container.appendChild(next); container.appendChild(dots);

        const slideEls = Array.from(slides.children);
        let idx = 0;

        function update() {
            slides.style.transform = `translateX(${-idx * 100}%)`;
            Array.from(dots.children).forEach((b,i)=> b.classList.toggle('active', i===idx));
        }

        // build dots
        slideEls.forEach((_, i) => {
            const b = document.createElement('button'); b.type='button';
            b.addEventListener('click', () => { idx = i; update(); });
            dots.appendChild(b);
        });

        prev.addEventListener('click', () => { idx = (idx-1+slideEls.length)%slideEls.length; update(); });
        next.addEventListener('click', () => { idx = (idx+1)%slideEls.length; update(); });

        // allow keyboard navigation when focused
        container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prev.click();
            if (e.key === 'ArrowRight') next.click();
        });

        // initial
        update();
    });
});

// Show urgent note when Akut VVS is selected
document.addEventListener('DOMContentLoaded', function() {
    const serviceSelect = document.querySelector('#service');
    const urgentNote = document.querySelector('#urgentNote');
    const messageField = document.querySelector('#message')?.closest('.form-full');
    const acuteCallout = document.querySelector('#acuteCallout');
    if (!serviceSelect) return;

    function updateUrgentNote() {
        const isUrgent = serviceSelect.value === 'Akut VVS';
        if (urgentNote) urgentNote.hidden = !isUrgent;
        if (messageField) messageField.style.display = isUrgent ? 'none' : 'block';
        if (acuteCallout) acuteCallout.style.display = isUrgent ? 'block' : 'none';
    }

    updateUrgentNote();
    serviceSelect.addEventListener('change', updateUrgentNote);
});

// Homepage: show first 8 services, reveal the rest on demand
document.addEventListener('DOMContentLoaded', function() {
    const grid = document.querySelector('.services-grid');
    const toggleBtn = document.querySelector('.services-more-btn');
    if (!grid || !toggleBtn) return;

    const cards = Array.from(grid.querySelectorAll('.service-card'));
    const visibleCount = 8;

    if (cards.length <= visibleCount) {
        toggleBtn.style.display = 'none';
        return;
    }

    cards.slice(visibleCount).forEach(card => card.classList.add('is-hidden'));

    let expanded = false;
    toggleBtn.addEventListener('click', function() {
        expanded = !expanded;
        cards.slice(visibleCount).forEach(card => card.classList.toggle('is-hidden', !expanded));
        toggleBtn.textContent = expanded ? 'Visa färre tjänster' : 'Visa fler tjänster';
        toggleBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
});