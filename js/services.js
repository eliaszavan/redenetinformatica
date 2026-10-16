const servicesTrack = document.querySelector('.servicesTrack');

const serviceCards = document.querySelectorAll('.serviceCard');

const servicePrev = document.querySelector('.servicePrev');
const serviceNext = document.querySelector('.serviceNext');

const serviceDots = document.querySelector('.serviceDots');


let serviceIndex = 0;


function getVisibleServices() {

    if (window.innerWidth <= 968) {
        return 1;
    }

    if (window.innerWidth <= 1200) {
        return 3;
    }

    return 4;
}


function createServiceDots() {

    serviceDots.innerHTML = '';

    const visibleServices = getVisibleServices();

    const totalDots = serviceCards.length - visibleServices + 1;


    for (let i = 0; i < totalDots; i++) {

        const dot = document.createElement('button');

        dot.classList.add('serviceDot');


        if (i === serviceIndex) {
            dot.classList.add('active');
        }


        dot.addEventListener('click', () => {

            serviceIndex = i;

            updateServices();
        });


        serviceDots.appendChild(dot);
    }
}


function updateServices() {

    const card = serviceCards[0];

    const trackStyle = window.getComputedStyle(servicesTrack);

    const gap = parseFloat(trackStyle.gap);

    const cardWidth = card.offsetWidth;

    const position = serviceIndex * (cardWidth + gap);


    servicesTrack.style.transform = `translateX(-${position}px)`;


    const dots = document.querySelectorAll('.serviceDot');


    dots.forEach((dot, index) => {

        dot.classList.toggle('active', index === serviceIndex);
    });
}


serviceNext.addEventListener('click', () => {

    const visibleServices = getVisibleServices();

    const maxIndex = serviceCards.length - visibleServices;


    if (serviceIndex < maxIndex) {

        serviceIndex++;

    } else {

        serviceIndex = 0;
    }


    updateServices();
});


servicePrev.addEventListener('click', () => {

    const visibleServices = getVisibleServices();

    const maxIndex = serviceCards.length - visibleServices;


    if (serviceIndex > 0) {

        serviceIndex--;

    } else {

        serviceIndex = maxIndex;
    }


    updateServices();
});


window.addEventListener('resize', () => {

    serviceIndex = 0;

    createServiceDots();

    updateServices();
});


createServiceDots();

updateServices();