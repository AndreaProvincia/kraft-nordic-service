// Hide topbar when scrolling down from the top area.
window.addEventListener('scroll', function() {
    const topbar = document.querySelector('.topbar');
    if (!topbar) return;

    if (window.scrollY > 50) {
        topbar.classList.add('shrink');
    } else {
        topbar.classList.remove('shrink');
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

// Toggle ROT information section based on checkbox
document.addEventListener('DOMContentLoaded', function() {
    const rotCheckbox = document.querySelector('#rot-checkbox');
    const rotSection = document.querySelector('#rot-section');
    if (!rotCheckbox || !rotSection) return;

    function updateROTVisibility() {
        rotSection.style.display = rotCheckbox.checked ? 'block' : 'none';
    }

    updateROTVisibility();
    rotCheckbox.addEventListener('change', updateROTVisibility);
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

// Filter services by category
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    const toggleBtn = document.querySelector('.services-more-btn');
    const visibleCount = 8;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');

            // Update active button
            filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
            this.classList.add('filter-btn--active');

            // Filter cards and reset expand state
            let visibleCards = [];
            serviceCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = '';
                    visibleCards.push(card);
                } else {
                    const cardCategory = card.getAttribute('data-category');
                    if (cardCategory === filterValue) {
                        card.style.display = '';
                        visibleCards.push(card);
                    } else {
                        card.style.display = 'none';
                    }
                }
            });

            // Reset "Visa fler" button and show all filtered items
            if (toggleBtn) {
                // Remove is-hidden from all visible cards so they all show
                visibleCards.forEach(card => card.classList.remove('is-hidden'));
                toggleBtn.textContent = 'Visa färre tjänster';
                toggleBtn.setAttribute('aria-expanded', 'true');
            }
        });
    });
});