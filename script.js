`use strict`;
const body = document.body;
const allSections = document.querySelectorAll(`.section`);
const allSectionContents = document.querySelectorAll(`.section-content`);
const logos = document.querySelectorAll(`[data-id="logo"]`);
const burgerButton = document.querySelector(`.btn-burger`);
const headerNavigation = document.querySelector(`.header-right`);
const navLinks = document.querySelectorAll(`.nav-link`);
const footerYearEl = document.querySelector(`.footer-year`);
const headerElement = document.querySelector(`#header`);
const heroSection = document.querySelector(`#section--hero`);
const headerOverlay = document.querySelector(`.header-overlay`);
const burgerIcon = burgerButton.querySelector(`ion-icon`);

let headerHeight = headerElement.getBoundingClientRect().height;

const closeNavigation = function () {
  headerNavigation.classList.remove(`header-right-shown`);
  headerOverlay.classList.remove(`header-overlay-shown`);
  burgerIcon.setAttribute(`name`, `menu-sharp`);
};

const calcNavHeight = function () {
  headerHeight = headerElement.getBoundingClientRect().height;
  const headerVisibleHeight = headerHeight;
  const headerHeightPercentage =
    (headerVisibleHeight / window.innerHeight) * 100;
  let overlayHeight = 100 - headerHeightPercentage;
  if (overlayHeight >= 100) overlayHeight = 100;
  document.documentElement.style.setProperty(
    `--overlay-height`,
    `${overlayHeight}vh`
  );
};
calcNavHeight();

window.addEventListener(`scroll`, () => {
  calcNavHeight();
  closeNavigation();
});
window.addEventListener(`resize`, calcNavHeight);

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
    closeNavigation();
    return;
  }
  const destinationElement = document.querySelector(destination);
  const offset =
    destination === `#section--email` ? headerHeight : 96 + headerHeight;
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
  let burgerIconName = burgerIcon.getAttribute(`name`);
  headerNavigation.classList.toggle(`header-right-shown`);
  headerOverlay.classList.toggle(`header-overlay-shown`);
  burgerIconName =
    burgerIconName === `menu-sharp` ? `close-sharp` : `menu-sharp`;
  burgerIcon.setAttribute(`name`, burgerIconName);
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
