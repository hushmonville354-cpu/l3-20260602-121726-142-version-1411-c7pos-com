(function () {
  function onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function initHeader() {
    const header = document.querySelector('[data-site-header]');
    const toggle = document.querySelector('[data-menu-toggle]');
    const panel = document.querySelector('[data-mobile-panel]');

    if (header) {
      const updateHeader = function () {
        header.classList.toggle('is-scrolled', window.scrollY > 18);
      };
      updateHeader();
      window.addEventListener('scroll', updateHeader, { passive: true });
    }

    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        panel.classList.toggle('is-open');
      });
    }
  }

  function initImageFallbacks() {
    document.querySelectorAll('img').forEach(function (image) {
      image.addEventListener('error', function () {
        image.classList.add('is-missing');
        image.setAttribute('aria-hidden', 'true');
      }, { once: true });
    });
  }

  function initCarousel() {
    document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
      const slides = Array.from(carousel.querySelectorAll('[data-carousel-slide]'));
      const dots = Array.from(carousel.querySelectorAll('[data-carousel-dot]'));
      let activeIndex = 0;
      let timer = null;

      function render(index) {
        activeIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle('is-active', slideIndex === activeIndex);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle('is-active', dotIndex === activeIndex);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function () {
          render(activeIndex + 1);
        }, 5000);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          render(Number(dot.dataset.carouselDot || 0));
          start();
        });
      });

      carousel.addEventListener('mouseenter', stop);
      carousel.addEventListener('mouseleave', start);

      if (slides.length > 1) {
        render(0);
        start();
      }
    });
  }

  function getSearchParams() {
    try {
      return new URLSearchParams(window.location.search);
    } catch (error) {
      return new URLSearchParams('');
    }
  }

  function initSearchPage() {
    const panel = document.querySelector('[data-search-panel]');
    const cards = Array.from(document.querySelectorAll('[data-search-card]'));
    const resultLine = document.querySelector('[data-result-line]');

    if (!panel || cards.length === 0) {
      return;
    }

    const input = panel.querySelector('[data-search-input]');
    const categoryFilter = panel.querySelector('[data-category-filter]');
    const yearFilter = panel.querySelector('[data-year-filter]');
    const resetButton = panel.querySelector('[data-search-reset]');
    const params = getSearchParams();

    if (input && params.get('q')) {
      input.value = params.get('q');
    }

    function cardText(card) {
      return [
        card.dataset.title,
        card.dataset.region,
        card.dataset.genre,
        card.dataset.tags,
        card.dataset.year,
        card.dataset.category
      ].join(' ').toLowerCase();
    }

    function applyFilters() {
      const keyword = (input ? input.value : '').trim().toLowerCase();
      const category = categoryFilter ? categoryFilter.value : '';
      const yearMin = yearFilter && yearFilter.value ? Number(yearFilter.value) : 0;
      let count = 0;

      cards.forEach(function (card) {
        const text = cardText(card);
        const year = Number(card.dataset.year || 0);
        const matchKeyword = !keyword || text.indexOf(keyword) !== -1;
        const matchCategory = !category || card.dataset.category === category;
        const matchYear = !yearMin || year >= yearMin;
        const visible = matchKeyword && matchCategory && matchYear;

        card.style.display = visible ? '' : 'none';
        if (visible) {
          count += 1;
        }
      });

      if (resultLine) {
        resultLine.textContent = '共 ' + count + ' 部影片';
      }
    }

    [input, categoryFilter, yearFilter].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    if (resetButton) {
      resetButton.addEventListener('click', function () {
        if (input) {
          input.value = '';
        }
        if (categoryFilter) {
          categoryFilter.value = '';
        }
        if (yearFilter) {
          yearFilter.value = '';
        }
        applyFilters();
      });
    }

    applyFilters();
  }

  onReady(function () {
    initHeader();
    initImageFallbacks();
    initCarousel();
    initSearchPage();
  });
})();
