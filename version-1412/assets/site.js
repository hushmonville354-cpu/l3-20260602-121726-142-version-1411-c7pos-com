const menuButton = document.querySelector('[data-menu-toggle]');
const mobilePanel = document.querySelector('[data-mobile-panel]');

if (menuButton && mobilePanel) {
  menuButton.addEventListener('click', () => {
    mobilePanel.classList.toggle('open');
  });
}

const hero = document.querySelector('[data-hero]');

if (hero) {
  const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
  const previous = hero.querySelector('[data-hero-prev]');
  const next = hero.querySelector('[data-hero-next]');
  let activeIndex = 0;
  let timer = null;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === activeIndex);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === activeIndex);
    });
  };

  const startTimer = () => {
    clearInterval(timer);
    timer = setInterval(() => showSlide(activeIndex + 1), 5200);
  };

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      showSlide(Number(dot.dataset.heroDot));
      startTimer();
    });
  });

  if (previous) {
    previous.addEventListener('click', () => {
      showSlide(activeIndex - 1);
      startTimer();
    });
  }

  if (next) {
    next.addEventListener('click', () => {
      showSlide(activeIndex + 1);
      startTimer();
    });
  }

  startTimer();
}

const filterScope = document.querySelector('[data-filter-scope]');

if (filterScope) {
  const input = filterScope.querySelector('[data-filter-input]');
  const category = filterScope.querySelector('[data-category-filter]');
  const year = filterScope.querySelector('[data-year-filter]');
  const cards = Array.from(document.querySelectorAll('[data-card-list] .movie-card'));
  const params = new URLSearchParams(window.location.search);
  const queryValue = params.get('q') || '';

  if (input && queryValue) {
    input.value = queryValue;
  }

  const normalize = (value) => String(value || '').toLowerCase().trim();

  const applyFilter = () => {
    const keyword = normalize(input ? input.value : '');
    const categoryValue = normalize(category ? category.value : '');
    const yearValue = normalize(year ? year.value : '');

    cards.forEach((card) => {
      const text = normalize(`${card.dataset.title} ${card.dataset.category} ${card.dataset.tags}`);
      const matchKeyword = !keyword || text.includes(keyword);
      const matchCategory = !categoryValue || normalize(card.dataset.category) === categoryValue;
      const matchYear = !yearValue || normalize(card.dataset.year) === yearValue;
      card.classList.toggle('is-hidden', !(matchKeyword && matchCategory && matchYear));
    });
  };

  [input, category, year].forEach((control) => {
    if (control) {
      control.addEventListener('input', applyFilter);
      control.addEventListener('change', applyFilter);
    }
  });

  applyFilter();
}
