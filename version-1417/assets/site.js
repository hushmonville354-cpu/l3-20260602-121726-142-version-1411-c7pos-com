(function () {
    const menuButton = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            const isOpen = mobileNav.classList.toggle('open');
            menuButton.setAttribute('aria-expanded', String(isOpen));
        });
    }

    const carousel = document.querySelector('[data-hero-carousel]');

    if (carousel) {
        const slides = Array.from(carousel.querySelectorAll('.hero-slide'));
        const dots = Array.from(carousel.querySelectorAll('.hero-dot'));
        let current = 0;
        let timer = null;

        const showSlide = function (index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        };

        const start = function () {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        };

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-slide')) || 0);
                start();
            });
        });

        start();
    }

    const panels = document.querySelectorAll('[data-filter-panel]');

    panels.forEach(function (panel) {
        const scope = panel.parentElement || document;
        const keyword = panel.querySelector('[data-filter-keyword]');
        const type = panel.querySelector('[data-filter-type]');
        const year = panel.querySelector('[data-filter-year]');
        const reset = panel.querySelector('[data-filter-reset]');
        const cards = Array.from(scope.querySelectorAll('.movie-card'));

        const apply = function () {
            const keywordValue = keyword ? keyword.value.trim().toLowerCase() : '';
            const typeValue = type ? type.value : '';
            const yearValue = year ? year.value : '';

            cards.forEach(function (card) {
                const haystack = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-tags')
                ].join(' ').toLowerCase();
                const okKeyword = !keywordValue || haystack.indexOf(keywordValue) !== -1;
                const okType = !typeValue || card.getAttribute('data-type') === typeValue;
                const okYear = !yearValue || card.getAttribute('data-year') === yearValue;
                card.classList.toggle('hidden', !(okKeyword && okType && okYear));
            });
        };

        [keyword, type, year].forEach(function (control) {
            if (control) {
                control.addEventListener('input', apply);
                control.addEventListener('change', apply);
            }
        });

        if (reset) {
            reset.addEventListener('click', function () {
                if (keyword) {
                    keyword.value = '';
                }
                if (type) {
                    type.value = '';
                }
                if (year) {
                    year.value = '';
                }
                apply();
            });
        }
    });
})();

function setupMoviePlayer(videoId, buttonId, overlayId, source) {
    const video = document.getElementById(videoId);
    const button = document.getElementById(buttonId);
    const overlay = document.getElementById(overlayId);
    let prepared = false;
    let player = null;

    const prepare = function () {
        if (!video || prepared) {
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
            player = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            player.loadSource(source);
            player.attachMedia(video);
        } else {
            video.src = source;
        }

        prepared = true;
    };

    const begin = function () {
        if (!video) {
            return;
        }

        prepare();

        if (overlay) {
            overlay.classList.add('is-hidden');
        }

        video.controls = true;
        const promise = video.play();

        if (promise && typeof promise.catch === 'function') {
            promise.catch(function () {
                if (overlay) {
                    overlay.classList.remove('is-hidden');
                }
            });
        }
    };

    if (button) {
        button.addEventListener('click', function (event) {
            event.stopPropagation();
            begin();
        });
    }

    if (overlay) {
        overlay.addEventListener('click', begin);
    }

    if (video) {
        video.addEventListener('click', function () {
            if (video.paused) {
                begin();
            }
        });
    }

    window.addEventListener('pagehide', function () {
        if (player) {
            player.destroy();
            player = null;
        }
    });
}
