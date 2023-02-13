"use strict";

//////////////////////////////////
//////////////////////////////////ELEMENTS
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");

const nav = document.querySelector(".nav");
const navLinks = document.querySelector(".nav__links");
const header = document.querySelector(".header");
const section1 = document.querySelector("#section--1");
const allSections = document.querySelectorAll(".section");
const imgTargets = document.querySelectorAll("img[data-src]");

const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");

const cookieDiv = document.createElement("div");

//////////////////////////////////
//////////////////////////////////MODAL WINDOW
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach(function (btn) {
  btn.addEventListener("click", openModal);
});

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//////////////////////////////////
//////////////////////////////////COOKIE MESSAGE

// //style
// cookieDiv.classList.add("cookie-message");
// cookieDiv.style.position = "fixed";
// cookieDiv.style.bottom = "0";
// cookieDiv.style.backgroundColor = "#37383d";
// cookieDiv.style.width = "120%";
// cookieDiv.style.height =
//   Number.parseFloat(getComputedStyle(cookieDiv).height) + 30 + "px";

// //text
// cookieDiv.innerHTML =
//   'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// //aggiunge al body
// document.body.append(cookieDiv);

// //remove cookie
// document
//   .querySelector(".btn--close-cookie")
//   .addEventListener("click", () => cookieDiv.remove());

//////////////////////////////////
//////////////////////////////////BUTTON SCROLLING
btnScrollTo.addEventListener("click", function () {
  section1.scrollIntoView({ behavior: "smooth" });
  //Old way
  // const scrollCoord = section1.getBoundingClientRect();
  // window.scrollTo({
  //   left: scrollCoord.left + window.pageXOffset,
  //   top: scrollCoord.top + window.pageYOffset,
  //   behavior: "smooth",
  // });
});

//////////////////////////////////
//////////////////////////////////PAGE NAVIGATION WITH EVENT DELEGATION

navLinks.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    e.target.classList.contains("nav__link") &&
    !e.target.classList.contains("btn--show-modal")
  ) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

////////////////////////////////
//////////////////////////////// TAB OPERATIONS

tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");

  //guard clause
  if (!clicked) return;

  //removing active classes
  tabs.forEach(t => t.classList.remove("operations__tab--active"));
  tabsContent.forEach(c => c.classList.remove("operations__content--active"));
  //active tab
  clicked.classList.add("operations__tab--active");
  //active content
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
  //alternative method
  // tabsContent[clicked.dataset.tab - 1].classList.add(
  //   "operations__content--active"
  // );
});

////////////////////////////////
//////////////////////////////// MENU FADE ANIMATION

const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
      logo.style.opacity = this;
    });
  }
};

nav.addEventListener("mouseover", handleHover.bind(0.5));

nav.addEventListener("mouseout", handleHover.bind(1));

////////////////////////////////
//////////////////////////////// NAV STICKY
const navHeight = nav.getBoundingClientRect().height;

const obsCallback = function (entries) {
  entries.forEach(entry => {
    entry.isIntersecting
      ? nav.classList.remove("sticky")
      : nav.classList.add("sticky");
  });
};

const observer = new IntersectionObserver(obsCallback, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

observer.observe(header);

////////////////////////////////
//////////////////////////////// REVEAL SECTIONS WITH TRANSITION
const revealSection = function (entries, observer) {
  entries.forEach(entry => {
    //guard clause
    if (!entry.isIntersecting) return;
    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

////////////////////////////////
//////////////////////////////// LAZY LOADING IMAGES

const loadImage = function (entries, observer) {
  entries.forEach(entry => {
    //guard clause
    if (!entry.isIntersecting) return;
    //replace the src with data-set
    entry.target.src = entry.target.dataset.src;
    //event listener that removes the class lazy ONLY once the loading is completed
    entry.target.addEventListener("load", function () {
      entry.target.classList.remove("lazy-img");
    });

    observer.unobserve(entry.target);
  });
};

const imgObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTargets.forEach(img => imgObserver.observe(img));

////////////////////////////////
//////////////////////////////// SLIDER FUNCTION
const slider = function () {
  let curSlide = 0;
  const maxSlide = slides.length;

  //function to create dots under the slides
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  //function for active dots
  const activeDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach(dot => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  //function to calculate slides' position
  const goToSlide = function (slide) {
    activeDot(slide);
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  //function next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) curSlide = 0;
    else curSlide++;

    goToSlide(curSlide);
  };

  //function previous slide
  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;

    goToSlide(curSlide);
  };

  //initialize slides and dots as soon as the page loads
  const init = function () {
    createDots();
    goToSlide(0);
  };

  init();

  ////////event handlers

  //next slide btn right
  btnRight.addEventListener("click", nextSlide);
  //next slide arrow right
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") {
      nextSlide();
    }
  });

  //previous slide btn left
  btnLeft.addEventListener("click", prevSlide);

  //previous slide arrow left
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") {
      prevSlide();
    }
  });

  //click dots
  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      curSlide = e.target.dataset.slide;
      goToSlide(curSlide);
    }
  });
};
slider();

//force page scroll to top at page refresh
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};
