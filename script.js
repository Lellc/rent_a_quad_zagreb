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
const productCardsContainer = document.querySelector(
  `.product-cards-container`
);

// RENDERING PRODUCTS
const products = [
  {
    imageLink: `https://placehold.co/600x300`,
    imageAlt: `tg600`,
    name: `TG600 ccm`,
    seats: `2`,
    power: `33 kW`,
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus saepe soluta explicabo quidem amet quasi nemo. Nesciunt, nostrum omnis? Et.`,
    price3H: `35€`,
    price8H: `50€`,
    price24H: `70€`,
  },
  {
    imageLink: `https://placehold.co/600x300`,
    imageAlt: `tg600`,
    name: `TG600 ccm`,
    seats: `2`,
    power: `33 kW`,
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus saepe soluta explicabo quidem amet quasi nemo. Nesciunt, nostrum omnis? Et.`,
    price3H: `35€`,
    price8H: `50€`,
    price24H: `70€`,
  },
  {
    imageLink: `https://placehold.co/600x300`,
    imageAlt: `tg600`,
    name: `TG600 ccm`,
    seats: `2`,
    power: `33 kW`,
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus saepe soluta explicabo quidem amet quasi nemo. Nesciunt, nostrum omnis? Et.`,
    price3H: `35€`,
    price8H: `50€`,
    price24H: `70€`,
  },
];

products.forEach((product) => {
  const productCardContent = `
          <div class="product-card">
            <img
              src="${product.imageLink}"
              alt="${product.imageAlt}"
              class="product-img"
              loading="lazy"
            />
            <h3 class="card-heading">${product.name}</h3>
            <div class="tags">
              <div class="tag">
                <ion-icon name="people-sharp"></ion-icon>
                <span>${product.seats} sjedala</span>
              </div>
              <div class="tag">
                <ion-icon name="flash-sharp"></ion-icon>
                <span>${product.power}</span>
              </div>
            </div>
            <p class="card-description">
              ${product.description}
            </p>
            <div class="card-prices">
              <div>
                <p class="time">3 sata</p>
                <p class="price">${product.price3H}</p>
              </div>
              <div class="devider"></div>
              <div>
                <p class="time">8 sati</p>
                <p class="price">${product.price8H}</p>
              </div>
              <div class="devider"></div>
              <div>
                <p class="time">24 sata</p>
                <p class="price">${product.price24H}</p>
              </div>
            </div>
            <a
              class="btn btn-card-cta"
              href="#section--email"
              data-id="navigation"
              >Rezerviraj</a
            >
          </div>`;
  productCardsContainer.insertAdjacentHTML(`beforeend`, productCardContent);
});

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
  calcNavHeight();
  closeNavigation();
  createHeroObserver();
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
  headerHeight = headerElement.getBoundingClientRect().height;
  const sectionHeading = document.querySelector(`.section-heading`);
  const sectionHeadingMargin = Number.parseFloat(
    getComputedStyle(sectionHeading).marginBottom
  );
  const destination = link.getAttribute(`href`);
  if (destination === `#`) {
    scrollTo(0, 0);
    closeNavigation();
    return;
  }
  const destinationElement = document.querySelector(destination);
  const offset =
    destination === `#section--email`
      ? 32 + headerHeight
      : sectionHeadingMargin + headerHeight;
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

let heroObserver;

const createHeroObserver = function () {
  headerHeight = headerElement.getBoundingClientRect().height;
  if (heroObserver) heroObserver.disconnect();

  heroObserver = new IntersectionObserver(heroHandler, {
    root: null,
    rootMargin: `-${headerHeight}px`,
    threshold: 0,
  });

  heroObserver.observe(heroSection);
};

createHeroObserver();
