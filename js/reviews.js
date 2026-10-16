const reviewsTrack = document.querySelector('.reviewsTrack');

const reviewCards = document.querySelectorAll('.reviewCard');

const reviewPrev = document.querySelector('.reviewPrev');
const reviewNext = document.querySelector('.reviewNext');

const reviewDots = document.querySelector('.reviewDots');


let reviewIndex = 0;


function getVisibleReviews() {

    if (window.innerWidth <= 968) {
        return 1;
    }

    return 3;
}


function createReviewDots() {

    reviewDots.innerHTML = '';

    const visibleReviews = getVisibleReviews();

    const totalDots = reviewCards.length - visibleReviews + 1;

    for (let i = 0; i < totalDots; i++) {

        const dot = document.createElement('button');

        dot.classList.add('reviewDot');

        if (i === reviewIndex) {
            dot.classList.add('active');
        }

        dot.addEventListener('click', () => {

            reviewIndex = i;

            updateReviews();
        });

        reviewDots.appendChild(dot);
    }
}


function updateReviews() {

    const card = reviewCards[0];

    const trackStyle = window.getComputedStyle(reviewsTrack);

    const gap = parseFloat(trackStyle.gap);

    const cardWidth = card.offsetWidth;

    const position = reviewIndex * (cardWidth + gap);

    reviewsTrack.style.transform = `translateX(-${position}px)`;


    const dots = document.querySelectorAll('.reviewDot');

    dots.forEach((dot, index) => {

        dot.classList.toggle('active', index === reviewIndex);
    });
}


reviewNext.addEventListener('click', () => {

    const visibleReviews = getVisibleReviews();

    const maxIndex = reviewCards.length - visibleReviews;

    if (reviewIndex < maxIndex) {
        reviewIndex++;
    } else {
        reviewIndex = 0;
    }

    updateReviews();
});


reviewPrev.addEventListener('click', () => {

    const visibleReviews = getVisibleReviews();

    const maxIndex = reviewCards.length - visibleReviews;

    if (reviewIndex > 0) {
        reviewIndex--;
    } else {
        reviewIndex = maxIndex;
    }

    updateReviews();
});


window.addEventListener('resize', () => {

    reviewIndex = 0;

    createReviewDots();

    updateReviews();
});


createReviewDots();
updateReviews();