(function () {
  var header = document.getElementById("siteHeader");
  var toggle = document.querySelector("[data-menu-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  if (header) {
    window.addEventListener("scroll", function () {
      header.classList.toggle("is-scrolled", window.scrollY > 10);
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
  var heroIndex = 0;

  function showHero(index) {
    if (!slides.length) {
      return;
    }

    heroIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === heroIndex);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === heroIndex);
    });
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener("click", function () {
      showHero(dotIndex);
    });
  });

  if (slides.length > 1) {
    showHero(0);
    window.setInterval(function () {
      showHero(heroIndex + 1);
    }, 5200);
  }

  var searchForm = document.querySelector("[data-filter-form]");
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-title]"));
  var empty = document.querySelector("[data-empty-result]");

  function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  function filterCards() {
    if (!searchForm || !cards.length) {
      return;
    }

    var keyword = normalize(searchForm.querySelector("[name='keyword']") && searchForm.querySelector("[name='keyword']").value);
    var year = normalize(searchForm.querySelector("[name='year']") && searchForm.querySelector("[name='year']").value);
    var region = normalize(searchForm.querySelector("[name='region']") && searchForm.querySelector("[name='region']").value);
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute("data-title"),
        card.getAttribute("data-year"),
        card.getAttribute("data-region"),
        card.getAttribute("data-genre"),
        card.getAttribute("data-category")
      ].join(" "));
      var ok = true;

      if (keyword && haystack.indexOf(keyword) === -1) {
        ok = false;
      }

      if (year && normalize(card.getAttribute("data-year")) !== year) {
        ok = false;
      }

      if (region && normalize(card.getAttribute("data-region")) !== region) {
        ok = false;
      }

      card.style.display = ok ? "" : "none";

      if (ok) {
        visible += 1;
      }
    });

    if (empty) {
      empty.style.display = visible ? "none" : "block";
    }
  }

  if (searchForm) {
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      filterCards();
    });
    Array.prototype.slice.call(searchForm.querySelectorAll("input, select")).forEach(function (field) {
      field.addEventListener("input", filterCards);
      field.addEventListener("change", filterCards);
    });

    var params = new URLSearchParams(window.location.search);
    var q = params.get("q");
    var keywordField = searchForm.querySelector("[name='keyword']");
    if (q && keywordField) {
      keywordField.value = q;
    }
    filterCards();
  }
})();
