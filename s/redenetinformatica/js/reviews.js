const reviewsTrack = document.querySelector('.reviewsTrack');
const reviewsSlider = document.querySelector('.reviewsSlider');
const reviewCards = document.querySelectorAll('.reviewCard');
const reviewPrev = document.querySelector('.reviewPrev');
const reviewNext = document.querySelector('.reviewNext');
const reviewDots = document.querySelector('.reviewDots');
const reduceReviewMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let reviewIndex = 0;
let reviewDragging = false;
let reviewStartX = 0;
let reviewStartPosition = 0;
let reviewCurrentPosition = 0;
let reviewDidDrag = false;
let reviewsAutoPlay;

/* QUANTIDADE DE CARDS VISÍVEIS */
function getVisibleReviews() {
    return window.innerWidth <= 968 ? 1 : 3;
}

/* DISTÂNCIA ENTRE UM CARD E OUTRO */
function getReviewStep() {
    const card = reviewCards[0];
    const trackStyle = window.getComputedStyle(reviewsTrack);
    const gap = parseFloat(trackStyle.gap) || 0;

    return card.offsetWidth + gap;
}

/* ÚLTIMA POSIÇÃO POSSÍVEL */
function getMaxReviewIndex() {
    return Math.max(0, reviewCards.length - getVisibleReviews());
}

/* CRIA AS BOLINHAS */
function createReviewDots() {
    reviewDots.innerHTML = '';
    const totalDots = getMaxReviewIndex() + 1;

    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.classList.add('reviewDot');
        dot.setAttribute('aria-label', `Ir para avaliações ${i + 1}`);

        if (i === reviewIndex) dot.classList.add('active');

        dot.addEventListener('click', () => {
            reviewIndex = i;
            updateReviews();
            startReviewsAutoPlay();
        });

        reviewDots.appendChild(dot);
    }
}

/* ATUALIZA O CARROSSEL */
function updateReviews() {
    const step = getReviewStep();
    const maxIndex = getMaxReviewIndex();

    reviewIndex = Math.max(0, Math.min(reviewIndex, maxIndex));
    reviewsTrack.style.transform = `translateX(-${reviewIndex * step}px)`;

    document.querySelectorAll('.reviewDot').forEach((dot, index) => {
        const active = index === reviewIndex;
        dot.classList.toggle('active', active);
        dot.setAttribute('aria-current', active ? 'true' : 'false');
    });
}

/* AUTOPLAY */
function startReviewsAutoPlay() {
    clearInterval(reviewsAutoPlay);
    if (document.hidden || reduceReviewMotion.matches) return;

    reviewsAutoPlay = setInterval(() => {
        const maxIndex = getMaxReviewIndex();
        reviewIndex = reviewIndex < maxIndex ? reviewIndex + 1 : 0;
        updateReviews();
    }, 3500);
}

/* SETAS */
reviewNext.addEventListener('click', () => {
    const maxIndex = getMaxReviewIndex();
    reviewIndex = reviewIndex < maxIndex ? reviewIndex + 1 : 0;
    updateReviews();
    startReviewsAutoPlay();
});

reviewPrev.addEventListener('click', () => {
    const maxIndex = getMaxReviewIndex();
    reviewIndex = reviewIndex > 0 ? reviewIndex - 1 : maxIndex;
    updateReviews();
    startReviewsAutoPlay();
});

/* ARRASTAR */
reviewsSlider.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    clearInterval(reviewsAutoPlay);
    reviewDragging = true;
    reviewDidDrag = false;
    reviewStartX = event.clientX;
    reviewStartPosition = reviewIndex * getReviewStep();
    reviewCurrentPosition = reviewStartPosition;
    reviewsTrack.classList.add('dragging');
    reviewsSlider.setPointerCapture(event.pointerId);
});

reviewsSlider.addEventListener('pointermove', event => {
    if (!reviewDragging) return;

    const distance = event.clientX - reviewStartX;
    if (Math.abs(distance) > 6) reviewDidDrag = true;

    const maxPosition = getMaxReviewIndex() * getReviewStep();
    reviewCurrentPosition = Math.max(0, Math.min(reviewStartPosition - distance, maxPosition));
    reviewsTrack.style.transform = `translateX(-${reviewCurrentPosition}px)`;
});

function finishReviewDrag(event) {
    if (!reviewDragging) return;

    reviewDragging = false;
    reviewsTrack.classList.remove('dragging');

    reviewIndex = Math.round(reviewCurrentPosition / getReviewStep());
    reviewIndex = Math.max(0, Math.min(reviewIndex, getMaxReviewIndex()));

    updateReviews();
    startReviewsAutoPlay();

    if (reviewsSlider.hasPointerCapture(event.pointerId)) {
        reviewsSlider.releasePointerCapture(event.pointerId);
    }

    setTimeout(() => {
        reviewDidDrag = false;
    }, 0);
}

reviewsSlider.addEventListener('pointerup', finishReviewDrag);
reviewsSlider.addEventListener('pointercancel', finishReviewDrag);

reviewsSlider.addEventListener('click', event => {
    if (!reviewDidDrag) return;

    event.preventDefault();
    event.stopPropagation();
}, true);

reviewsSlider.addEventListener('dragstart', event => event.preventDefault());
reviewsSlider.addEventListener('mouseenter', () => clearInterval(reviewsAutoPlay));
reviewsSlider.addEventListener('mouseleave', startReviewsAutoPlay);
reviewsSlider.addEventListener('focusin', () => clearInterval(reviewsAutoPlay));
reviewsSlider.addEventListener('focusout', startReviewsAutoPlay);

/* RESPONSIVIDADE */
window.addEventListener('resize', () => {
    reviewIndex = 0;
    createReviewDots();
    updateReviews();
    startReviewsAutoPlay();
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(reviewsAutoPlay);
    else startReviewsAutoPlay();
});

reduceReviewMotion.addEventListener('change', startReviewsAutoPlay);

/* INICIALIZA */
createReviewDots();
updateReviews();
startReviewsAutoPlay();
