`use strict`;

const body = document.body;
const allSectionContents = document.querySelectorAll(`.section-content`);
const burgerButton = document.querySelector(`.btn-burger`);
const headerNavigation = document.querySelector(`.header-right`);
const footerYearEl = document.querySelector(`.footer-year`);
const headerElement = document.querySelector(`#header`);
const heroSection = document.querySelector(`#section--hero`);
const headerOverlay = document.querySelector(`.header-overlay`);
const burgerIcon = burgerButton.querySelector(`ion-icon`);
const mobileNavigation = document.querySelector(`.navigation-mobile`);

let headerHeight = headerElement.getBoundingClientRect().height;
let isMobileNavOpen = false;

const closeNavigation = function () {
  mobileNavigation.classList.remove(`navigation-mobile-open`);
  headerOverlay.classList.add(`header-overlay-hidden`);
  burgerIcon.setAttribute(`name`, `menu-sharp`);
  isMobileNavOpen = false;
};

closeNavigation();

const openNavigation = function () {
  mobileNavigation.classList.add(`navigation-mobile-open`);
  headerOverlay.classList.remove(`header-overlay-hidden`);
  burgerIcon.setAttribute(`name`, `close-sharp`);
  isMobileNavOpen = true;
};

const calcNavHeight = function () {
  const headerStats = headerElement.getBoundingClientRect();
  if (headerStats.bottom <= 0) return;
  const headerVisibleHeight = headerStats.bottom;
  // prettier-ignore
  document.documentElement.style.setProperty(`--mobile-nav-padding`, `${headerVisibleHeight}px`);
};
calcNavHeight();

window.addEventListener(`scroll`, () => {
  closeNavigation();
  calcNavHeight();
});

window.addEventListener(`resize`, () => {
  headerHeight = headerElement.getBoundingClientRect().height;
  navWidth = mobileNavigation.getBoundingClientRect().width;
  calcNavHeight();
  closeNavigation();
});

// DISPLAYING YEAR
const now = new Date();
const currYear = now.getFullYear();
footerYearEl.textContent = currYear;

// SMOOTH SCROLLING
body.addEventListener(`click`, (e) => {
  const link = e.target.closest(`[data-id="navigation"]`);
  if (!link) return;
  e.preventDefault();
  const headerHeight = headerElement.getBoundingClientRect().height;
  const destination = link.getAttribute(`href`);
  if (destination === `#`) {
    scrollTo(0, 0);
    closeNavigation();
    return;
  }
  const destinationElement = document.querySelector(destination);
  const offset =
    destination === `#section--email` ? 32 + headerHeight : 96 + headerHeight;
  const destinationElementTop =
    window.scrollY + destinationElement.getBoundingClientRect().top - offset;
  window.scrollTo({
    top: destinationElementTop,
    left: 0,
    behavior: `smooth`,
  });
  closeNavigation();
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
  burgerButton.disabled = true;
  setTimeout(() => {
    burgerButton.disabled = false;
  }, 500);
  if (isMobileNavOpen) closeNavigation();
  else openNavigation();
});

headerOverlay.addEventListener(`click`, () => {
  closeNavigation();
});

document.addEventListener(`keydown`, (e) => {
  if (e.key === `Escape`) closeNavigation();
});

// FIXED HEADER
const heroHandler = function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      headerElement.classList.remove(`header-fixed-position`);
    } else {
      headerElement.classList.add(`header-fixed-position`);
    }
  });
};

const heroOptions = {
  root: null,
  rootMargin: `-${headerHeight}px`,
  threshold: 0,
};

const heroObserver = new IntersectionObserver(heroHandler, heroOptions);
heroObserver.observe(heroSection);
