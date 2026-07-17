// ==========================================
// Wedding 2.0
// Swiper
// ==========================================

const swiper = new Swiper(".weddingSwiper", {

    effect: "fade",

    speed: 900,

    allowTouchMove: true,

    simulateTouch: true,

    keyboard: {
        enabled: true
    },

    mousewheel: {
        forceToAxis: true,
        releaseOnEdges: true
    },

    fadeEffect: {
        crossFade: true
    },

    navigation: {
        nextEl: ".nav.next",
        prevEl: ".nav.prev"
    }

});

// ==========================================
// HERO
// ==========================================

const hero = document.querySelector(".hero");
const heroNext = document.querySelector(".hero__next");

heroNext.addEventListener("click", () => {

    hero.classList.add("leaving");

    setTimeout(() => {

        swiper.slideNext();

    }, 650);

});

// ==========================================
// Возврат Hero
// ==========================================

swiper.on("slideChangeTransitionEnd", () => {

    hero.classList.remove("leaving");

});

// ==========================================
// Клавиатура
// ==========================================

document.addEventListener("keydown", (e) => {

    if (e.key === "ArrowRight") {

        swiper.slideNext();

    }

    if (e.key === "ArrowLeft") {

        swiper.slidePrev();

    }

});

// ==========================================
// Показ навигации
// ==========================================

const navigation = document.querySelector(".navigation");

function updateNavigation() {

    if (!navigation) return;

    if (swiper.activeIndex === 0) {

        navigation.classList.remove("show");

    } else {

        navigation.classList.add("show");

    }

}

updateNavigation();

swiper.on("slideChange", updateNavigation);

// ==========================================
// Кнопки
// ==========================================

const nextBtn = document.querySelector(".nav.next");
const prevBtn = document.querySelector(".nav.prev");

if (nextBtn) {

    nextBtn.addEventListener("click", () => {

        swiper.slideNext();

    });

}

if (prevBtn) {

    prevBtn.addEventListener("click", () => {

        swiper.slidePrev();

    });

}