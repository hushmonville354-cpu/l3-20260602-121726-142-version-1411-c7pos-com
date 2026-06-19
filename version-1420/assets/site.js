(function () {
    const menuButton = document.querySelector('.menu-button');
    const mobileNav = document.querySelector('.mobile-nav');
    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('.hero-dot'));
    let currentSlide = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        currentSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle('active', i === currentSlide);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        setInterval(function () {
            showSlide(currentSlide + 1);
        }, 5200);
    }

    const searchInputs = Array.from(document.querySelectorAll('.site-search-input'));
    const searchPanel = document.querySelector('.search-panel');

    function renderSearch(query) {
        if (!searchPanel) {
            return;
        }
        const value = query.trim().toLowerCase();
        if (!value || !Array.isArray(window.SEARCH_MOVIES)) {
            searchPanel.classList.remove('open');
            searchPanel.innerHTML = '';
            return;
        }
        const results = window.SEARCH_MOVIES.filter(function (item) {
            return item.text.includes(value);
        }).slice(0, 12);
        if (!results.length) {
            searchPanel.classList.add('open');
            searchPanel.innerHTML = '<div class="search-empty">没有找到匹配内容</div>';
            return;
        }
        searchPanel.classList.add('open');
        searchPanel.innerHTML = results.map(function (item) {
            return '<a class="search-result" href="' + item.url + '">' +
                '<img src="' + item.poster + '" alt="' + item.title + '">' +
                '<span><strong>' + item.title + '</strong><span>' + item.year + ' · ' + item.category + ' · ' + item.genre + '</span></span>' +
                '<span>播放</span>' +
                '</a>';
        }).join('');
    }

    searchInputs.forEach(function (input) {
        input.addEventListener('input', function () {
            renderSearch(input.value);
        });
        input.addEventListener('focus', function () {
            renderSearch(input.value);
        });
    });

    document.addEventListener('click', function (event) {
        if (!searchPanel) {
            return;
        }
        const insidePanel = searchPanel.contains(event.target);
        const insideInput = searchInputs.some(function (input) {
            return input.contains(event.target);
        });
        if (!insidePanel && !insideInput) {
            searchPanel.classList.remove('open');
        }
    });

    const localFilter = document.querySelector('[data-local-filter]');
    const yearSelect = document.querySelector('[data-year-filter]');
    const localCards = Array.from(document.querySelectorAll('[data-title][data-year]'));

    function applyLocalFilter() {
        const query = localFilter ? localFilter.value.trim().toLowerCase() : '';
        const year = yearSelect ? yearSelect.value : '';
        localCards.forEach(function (card) {
            const title = (card.getAttribute('data-title') || '').toLowerCase();
            const genre = (card.getAttribute('data-genre') || '').toLowerCase();
            const cardYear = card.getAttribute('data-year') || '';
            const matchesQuery = !query || title.includes(query) || genre.includes(query);
            const matchesYear = !year || cardYear === year;
            card.style.display = matchesQuery && matchesYear ? '' : 'none';
        });
    }

    if (localFilter) {
        localFilter.addEventListener('input', applyLocalFilter);
    }
    if (yearSelect) {
        yearSelect.addEventListener('change', applyLocalFilter);
    }
})();
