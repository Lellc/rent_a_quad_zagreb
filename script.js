`use strict`;
const body = document.body;
const allSections = document.querySelectorAll(`.section`);
const allSectionContents = document.querySelectorAll(`.section-content`);
const logos = document.querySelectorAll(`[data-id="logo"]`);
const burgerButton = document.querySelector(`.btn-burger`);
const headerNavigation = document.querySelector(`.header-right`);
const navLinks = document.querySelectorAll(`.nav-link`);
const footerYearEl = document.querySelector(`.footer-year`);

// DISPLAYING YEAR
const now = new Date();
const currYear = now.getFullYear();
footerYearEl.textContent = currYear;

// SMOOTH SCROLLING
body.addEventListener(`click`, (e) => {
  const link = e.target.closest(`[data-id="navigation"]`);
  if (!link) return;
  e.preventDefault();
  const destination = link.getAttribute(`href`);
  if (destination === `#`) {
    scrollTo(0, 0);
    return;
  }
  if (link.classList.contains(`nav-link`)) {
    headerNavigation.classList.remove(`nav-shown`);
  }
  const destinationElement = document.querySelector(destination);
  const offset = destination === `#section--email` ? 43 : 96;
  const destinationElementTop =
    window.scrollY + destinationElement.getBoundingClientRect().top - offset;
  window.scrollTo({
    top: destinationElementTop,
    left: 0,
    scrollBehavior: `smooth`,
  });
});

// SECTION APPEARING EFFECT
const sectionHandler = function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove(`section-hidden`);
    observer.unobserve(entry.target);
  });
};

const sectionOptions = {
  root: null,
  threshold: 0,
};

const sectionObserver = new IntersectionObserver(
  sectionHandler,
  sectionOptions
);

allSectionContents.forEach((content) => {
  content.classList.add(`section-hidden`);
  sectionObserver.observe(content);
});

// BURGER
burgerButton.addEventListener(`click`, () => {
  const burgerIcon = burgerButton.querySelector(`ion-icon`);
  let burgerIconName = burgerIcon.getAttribute(`name`);
  headerNavigation.classList.toggle(`nav-shown`);
  burgerIconName =
    burgerIconName === `menu-sharp` ? `close-sharp` : `menu-sharp`;
  burgerIcon.setAttribute(`name`, burgerIconName);
});
