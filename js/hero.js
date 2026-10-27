/* CARROSSEL DO HERO */

const hero = document.querySelector('.hero');

if (hero) {

    const heroTrack = hero.querySelector('.heroTrack');
    const heroSlides = hero.querySelectorAll('.heroSlide');
    const heroDots = hero.querySelectorAll('.heroDot');

    let heroIndex = 0;
    let heroAutoPlay;

    /* MOSTRA O BANNER SELECIONADO */

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

    /* AVANCA A CADA 5 SEGUNDOS */

    function startHeroAutoPlay() {

        clearInterval(heroAutoPlay);

        if (heroSlides.length < 2 || document.hidden) {
            return;
        }

        heroAutoPlay = setInterval(() => {
            updateHero(heroIndex + 1);
        }, 5000);
    }

    /* DOTS: UNICA NAVEGACAO MANUAL */

    heroDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateHero(index);
            startHeroAutoPlay();
        });
    });

    /* EVITA RODAR COM A ABA OCULTA */

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(heroAutoPlay);
        } else {
            startHeroAutoPlay();
        }
    });

    updateHero(0);
    startHeroAutoPlay();
}
