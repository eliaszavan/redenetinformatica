/* CARROSSEL DO HERO */
const hero = document.querySelector('.hero');

if (hero) {
    const heroTrack = hero.querySelector('.heroTrack');
    const heroSlides = hero.querySelectorAll('.heroSlide');
    const heroDots = hero.querySelectorAll('.heroDot');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let heroIndex = 0;
    let heroAutoPlay;

    function updateHero(index) {
        heroIndex = (index + heroSlides.length) % heroSlides.length;
        heroTrack.style.transform = `translateX(-${heroIndex * 100}%)`;

        heroSlides.forEach((slide, i) => {
            const active = i === heroIndex;
            slide.setAttribute('aria-hidden', active ? 'false' : 'true');
            slide.inert = !active;
        });

        heroDots.forEach((dot, i) => {
            const active = i === heroIndex;
            dot.classList.toggle('active', active);
            dot.setAttribute('aria-current', active ? 'true' : 'false');
        });
    }

    function startHeroAutoPlay() {
        clearInterval(heroAutoPlay);

        if (heroSlides.length < 2 || document.hidden || reduceMotion.matches) return;

        heroAutoPlay = setInterval(() => {
            updateHero(heroIndex + 1);
        }, 5000);
    }

    heroDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateHero(index);
            startHeroAutoPlay();
        });
    });

    hero.addEventListener('mouseenter', () => clearInterval(heroAutoPlay));
    hero.addEventListener('mouseleave', startHeroAutoPlay);
    hero.addEventListener('focusin', () => clearInterval(heroAutoPlay));
    hero.addEventListener('focusout', startHeroAutoPlay);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) clearInterval(heroAutoPlay);
        else startHeroAutoPlay();
    });

    reduceMotion.addEventListener('change', startHeroAutoPlay);

    updateHero(0);
    startHeroAutoPlay();
}
