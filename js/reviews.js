const reviewsTrack = document.querySelector('.reviewsTrack');
const reviewsSlider = document.querySelector('.reviewsSlider');

const reviewCards = document.querySelectorAll('.reviewCard');

const reviewPrev = document.querySelector('.reviewPrev');
const reviewNext = document.querySelector('.reviewNext');

const reviewDots = document.querySelector('.reviewDots');


let reviewIndex = 0;

let reviewDragging = false;

let reviewStartX = 0;
let reviewStartPosition = 0;
let reviewCurrentPosition = 0;

let reviewDidDrag = false;

let reviewsAutoPlay;


/* QUANTIDADE DE CARDS VISÍVEIS */

function getVisibleReviews() {

    if (window.innerWidth <= 968) {
        return 1;
    }

    return 3;
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

    const visibleReviews = getVisibleReviews();

    return Math.max(
        0,
        reviewCards.length - visibleReviews
    );
}


/* CRIA AS BOLINHAS */

function createReviewDots() {

    reviewDots.innerHTML = '';

    const maxIndex = getMaxReviewIndex();

    const totalDots = maxIndex + 1;


    for (let i = 0; i < totalDots; i++) {

        const dot = document.createElement('button');

        dot.classList.add('reviewDot');


        if (i === reviewIndex) {
            dot.classList.add('active');
        }


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


    reviewIndex = Math.max(
        0,
        Math.min(reviewIndex, maxIndex)
    );


    const position = reviewIndex * step;


    reviewsTrack.style.transform =
        `translateX(-${position}px)`;


    const dots =
        document.querySelectorAll('.reviewDot');


    dots.forEach((dot, index) => {

        dot.classList.toggle(
            'active',
            index === reviewIndex
        );
    });
}


/* AUTOPLAY */

function startReviewsAutoPlay() {

    clearInterval(reviewsAutoPlay);


    reviewsAutoPlay = setInterval(() => {

        const maxIndex = getMaxReviewIndex();


        if (reviewIndex < maxIndex) {

            reviewIndex++;

        } else {

            reviewIndex = 0;
        }


        updateReviews();

    }, 3500);
}


/* SETA DIREITA */

reviewNext.addEventListener('click', () => {

    const maxIndex = getMaxReviewIndex();


    if (reviewIndex < maxIndex) {

        reviewIndex++;

    } else {

        reviewIndex = 0;
    }


    updateReviews();

    startReviewsAutoPlay();
});


/* SETA ESQUERDA */

reviewPrev.addEventListener('click', () => {

    const maxIndex = getMaxReviewIndex();


    if (reviewIndex > 0) {

        reviewIndex--;

    } else {

        reviewIndex = maxIndex;
    }


    updateReviews();

    startReviewsAutoPlay();
});


/* COMEÇA A ARRASTAR */

reviewsSlider.addEventListener('pointerdown', (event) => {

    if (
        event.pointerType === 'mouse' &&
        event.button !== 0
    ) {
        return;
    }


    clearInterval(reviewsAutoPlay);


    reviewDragging = true;

    reviewDidDrag = false;


    reviewStartX = event.clientX;


    reviewStartPosition =
        reviewIndex * getReviewStep();


    reviewCurrentPosition =
        reviewStartPosition;


    reviewsTrack.classList.add('dragging');


    reviewsSlider.setPointerCapture(
        event.pointerId
    );
});


/* MOVIMENTO DO ARRASTE */

reviewsSlider.addEventListener('pointermove', (event) => {

    if (!reviewDragging) {
        return;
    }


    const distance =
        event.clientX - reviewStartX;


    if (Math.abs(distance) > 6) {

        reviewDidDrag = true;
    }


    const maxPosition =
        getMaxReviewIndex() *
        getReviewStep();


    reviewCurrentPosition =
        reviewStartPosition - distance;


    reviewCurrentPosition = Math.max(
        0,
        Math.min(
            reviewCurrentPosition,
            maxPosition
        )
    );


    reviewsTrack.style.transform =
        `translateX(-${reviewCurrentPosition}px)`;
});


/* FINALIZA O ARRASTE */

function finishReviewDrag(event) {

    if (!reviewDragging) {
        return;
    }


    reviewDragging = false;


    reviewsTrack.classList.remove('dragging');


    const step = getReviewStep();


    reviewIndex = Math.round(
        reviewCurrentPosition / step
    );


    reviewIndex = Math.max(
        0,
        Math.min(
            reviewIndex,
            getMaxReviewIndex()
        )
    );


    updateReviews();

    startReviewsAutoPlay();


    if (
        reviewsSlider.hasPointerCapture(
            event.pointerId
        )
    ) {

        reviewsSlider.releasePointerCapture(
            event.pointerId
        );
    }


    setTimeout(() => {

        reviewDidDrag = false;

    }, 0);
}


reviewsSlider.addEventListener(
    'pointerup',
    finishReviewDrag
);


reviewsSlider.addEventListener(
    'pointercancel',
    finishReviewDrag
);


/* EVITA CLIQUE ACIDENTAL APÓS ARRASTAR */

reviewsSlider.addEventListener('click', (event) => {

    if (reviewDidDrag) {

        event.preventDefault();

        event.stopPropagation();
    }

}, true);


/* IMPEDE ARRASTE NATIVO DAS IMAGENS */

reviewsSlider.addEventListener('dragstart', (event) => {

    event.preventDefault();
});


/* RESPONSIVIDADE */

window.addEventListener('resize', () => {

    reviewIndex = 0;

    createReviewDots();

    updateReviews();

    startReviewsAutoPlay();
});


/* INICIALIZA */

createReviewDots();

updateReviews();

startReviewsAutoPlay();