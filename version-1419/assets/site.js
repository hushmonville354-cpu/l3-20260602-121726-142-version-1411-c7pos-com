(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var nav = document.querySelector('[data-main-nav]');

    if (menuButton && nav) {
        menuButton.addEventListener('click', function () {
            nav.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;
        var timer = null;

        function setSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        function startTimer() {
            timer = window.setInterval(function () {
                setSlide(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                window.clearInterval(timer);
                setSlide(index);
                startTimer();
            });
        });

        setSlide(0);
        startTimer();
    }

    var scope = document.querySelector('[data-search-scope]');
    var searchInput = document.querySelector('[data-search-input]');
    var yearFilter = document.querySelector('[data-year-filter]');
    var typeFilter = document.querySelector('[data-type-filter]');
    var emptyState = document.querySelector('[data-empty-state]');

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function applyFilters() {
        if (!scope) {
            return;
        }

        var keyword = normalize(searchInput ? searchInput.value : '');
        var year = normalize(yearFilter ? yearFilter.value : '');
        var type = normalize(typeFilter ? typeFilter.value : '');
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
        var visible = 0;

        cards.forEach(function (card) {
            var content = normalize([
                card.getAttribute('data-title'),
                card.getAttribute('data-year'),
                card.getAttribute('data-type'),
                card.getAttribute('data-region'),
                card.getAttribute('data-tags'),
                card.textContent
            ].join(' '));
            var matchKeyword = !keyword || content.indexOf(keyword) !== -1;
            var matchYear = !year || normalize(card.getAttribute('data-year')) === year;
            var matchType = !type || normalize(card.getAttribute('data-type')) === type;
            var show = matchKeyword && matchYear && matchType;
            card.style.display = show ? '' : 'none';
            if (show) {
                visible += 1;
            }
        });

        if (emptyState) {
            emptyState.classList.toggle('active', visible === 0);
        }
    }

    [searchInput, yearFilter, typeFilter].forEach(function (element) {
        if (element) {
            element.addEventListener('input', applyFilters);
            element.addEventListener('change', applyFilters);
        }
    });

    var players = Array.prototype.slice.call(document.querySelectorAll('.video-player'));

    players.forEach(function (player) {
        var video = player.querySelector('video');
        var button = player.querySelector('.play-overlay');
        var source = player.getAttribute('data-video-src');
        var started = false;
        var hlsInstance = null;

        function loadVideo() {
            if (!video || !source || started) {
                return;
            }

            started = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function playVideo() {
            loadVideo();
            player.classList.add('is-playing');
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {
                    player.classList.remove('is-playing');
                });
            }
        }

        if (button) {
            button.addEventListener('click', playVideo);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    playVideo();
                }
            });
            video.addEventListener('play', function () {
                player.classList.add('is-playing');
            });
            video.addEventListener('pause', function () {
                if (!video.currentTime) {
                    player.classList.remove('is-playing');
                }
            });
            window.addEventListener('beforeunload', function () {
                if (hlsInstance) {
                    hlsInstance.destroy();
                }
            });
        }
    });
})();
