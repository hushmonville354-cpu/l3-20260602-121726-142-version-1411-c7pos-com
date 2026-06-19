(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mainNav = document.querySelector('[data-main-nav]');
    if (menuButton && mainNav) {
        menuButton.addEventListener('click', function () {
            mainNav.classList.toggle('open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var current = 0;
    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle('active', i === current);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === current);
        });
    }
    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
            showSlide(i);
        });
    });
    if (slides.length > 1) {
        setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    function filterCards(scope) {
        var root = scope || document;
        var keywordInput = root.querySelector('[data-filter-keyword]');
        var yearSelect = root.querySelector('[data-filter-year]');
        var regionSelect = root.querySelector('[data-filter-region]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-title]'));
        var emptyState = document.querySelector('[data-empty-state]');
        if (!keywordInput || !cards.length) {
            return;
        }
        function run() {
            var keyword = keywordInput.value.trim().toLowerCase();
            var year = yearSelect ? yearSelect.value : '';
            var region = regionSelect ? regionSelect.value : '';
            var visible = 0;
            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-tags'),
                    card.getAttribute('data-region'),
                    card.textContent
                ].join(' ').toLowerCase();
                var okKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                var okYear = !year || card.getAttribute('data-year') === year;
                var okRegion = !region || card.getAttribute('data-region') === region;
                var show = okKeyword && okYear && okRegion;
                card.style.display = show ? '' : 'none';
                if (show) {
                    visible += 1;
                }
            });
            if (emptyState) {
                emptyState.style.display = visible ? 'none' : 'block';
            }
        }
        keywordInput.addEventListener('input', run);
        if (yearSelect) {
            yearSelect.addEventListener('change', run);
        }
        if (regionSelect) {
            regionSelect.addEventListener('change', run);
        }
        run();
    }
    filterCards(document);

    var video = document.querySelector('[data-video-player]');
    var trigger = document.querySelector('[data-player-trigger]');
    if (video && trigger) {
        var box = video.closest('.player-box');
        var src = video.getAttribute('data-src');
        var started = false;
        function setupAndPlay() {
            if (started) {
                video.play();
                return;
            }
            started = true;
            if (box) {
                box.classList.add('is-playing');
            }
            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(src);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    video.play();
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = src;
                video.addEventListener('loadedmetadata', function () {
                    video.play();
                }, { once: true });
                video.load();
            } else {
                video.src = src;
                video.play();
            }
        }
        trigger.addEventListener('click', setupAndPlay);
        video.addEventListener('click', function () {
            if (video.paused) {
                setupAndPlay();
            }
        });
        video.addEventListener('play', function () {
            if (box) {
                box.classList.add('is-playing');
            }
        });
        video.addEventListener('pause', function () {
            if (box && video.currentTime === 0) {
                box.classList.remove('is-playing');
            }
        });
    }
})();
