const servicesTrack = document.querySelector('.servicesTrack');
const servicesSlider = document.querySelector('.servicesSlider');
const serviceCards = document.querySelectorAll('.serviceCard');
const servicePrev = document.querySelector('.servicePrev');
const serviceNext = document.querySelector('.serviceNext');
const serviceDots = document.querySelector('.serviceDots');
const reduceServiceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let serviceIndex = 0;
let servicePositions = [];
let serviceDragging = false;
let serviceStartX = 0;
let serviceStartPosition = 0;
let serviceCurrentPosition = 0;
let serviceDidDrag = false;
let servicesAutoPlay;

/* CALCULA AS POSIÇÕES DO CARROSSEL */
function getServicePositions() {
    if (!servicesTrack || !servicesSlider || !serviceCards.length) return [0];

    const maxScroll = Math.max(0, servicesTrack.scrollWidth - servicesSlider.clientWidth);
    const positions = [0];
    let position = 0;

    serviceCards.forEach((card, index) => {
        if (index === 0) return;

        const cardPosition = card.offsetLeft - serviceCards[0].offsetLeft;
        if (cardPosition > position && cardPosition < maxScroll - 1) {
            positions.push(cardPosition);
            position = cardPosition;
        }
    });

    if (maxScroll > 0 && positions[positions.length - 1] < maxScroll - 1) {
        positions.push(maxScroll);
    }

    return positions;
}

/* CRIA AS BOLINHAS */
function createServiceDots() {
    if (!serviceDots) return;

    serviceDots.innerHTML = '';

    servicePositions.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.classList.add('serviceDot');
        dot.setAttribute('aria-label', `Ir para a posição ${index + 1}`);

        dot.addEventListener('click', () => {
            serviceIndex = index;
            updateServices();
            startServicesAutoPlay();
        });

        serviceDots.appendChild(dot);
    });
}

/* ATUALIZA O CARROSSEL */
function updateServices() {
    if (!servicesTrack || !serviceCards.length) return;

    const maxIndex = servicePositions.length - 1;
    serviceIndex = Math.max(0, Math.min(serviceIndex, maxIndex));
    const position = servicePositions[serviceIndex] || 0;

    servicesTrack.style.transform = `translateX(-${position}px)`;

    serviceDots.querySelectorAll('.serviceDot').forEach((dot, index) => {
        const active = index === serviceIndex;
        dot.classList.toggle('active', active);
        dot.setAttribute('aria-current', active ? 'true' : 'false');
    });

    if (servicePrev) servicePrev.disabled = serviceIndex === 0;
    if (serviceNext) serviceNext.disabled = serviceIndex >= maxIndex;
}

/* AUTOPLAY */
function startServicesAutoPlay() {
    clearInterval(servicesAutoPlay);
    if (document.hidden || reduceServiceMotion.matches) return;

    servicesAutoPlay = setInterval(() => {
        serviceIndex = serviceIndex < servicePositions.length - 1 ? serviceIndex + 1 : 0;
        updateServices();
    }, 3500);
}

/* SETAS */
if (serviceNext) {
    serviceNext.addEventListener('click', () => {
        if (serviceIndex < servicePositions.length - 1) {
            serviceIndex++;
            updateServices();
            startServicesAutoPlay();
        }
    });
}

if (servicePrev) {
    servicePrev.addEventListener('click', () => {
        if (serviceIndex > 0) {
            serviceIndex--;
            updateServices();
            startServicesAutoPlay();
        }
    });
}

/* ARRASTAR */
servicesSlider.addEventListener('pointerdown', event => {
    if (event.target.closest('a, button')) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    clearInterval(servicesAutoPlay);
    serviceDragging = true;
    serviceDidDrag = false;
    serviceStartX = event.clientX;
    serviceStartPosition = servicePositions[serviceIndex] || 0;
    serviceCurrentPosition = serviceStartPosition;
    servicesTrack.classList.add('dragging');
    servicesSlider.setPointerCapture(event.pointerId);
});

servicesSlider.addEventListener('pointermove', event => {
    if (!serviceDragging) return;

    const distance = event.clientX - serviceStartX;
    if (Math.abs(distance) > 6) serviceDidDrag = true;

    const maxPosition = servicePositions[servicePositions.length - 1] || 0;
    serviceCurrentPosition = Math.max(0, Math.min(serviceStartPosition - distance, maxPosition));
    servicesTrack.style.transform = `translateX(-${serviceCurrentPosition}px)`;
});

function finishServiceDrag(event) {
    if (!serviceDragging) return;

    serviceDragging = false;
    servicesTrack.classList.remove('dragging');

    let closestIndex = 0;
    let closestDistance = Infinity;

    servicePositions.forEach((position, index) => {
        const distance = Math.abs(position - serviceCurrentPosition);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
        }
    });

    serviceIndex = closestIndex;
    updateServices();
    startServicesAutoPlay();

    if (servicesSlider.hasPointerCapture(event.pointerId)) {
        servicesSlider.releasePointerCapture(event.pointerId);
    }

    setTimeout(() => {
        serviceDidDrag = false;
    }, 0);
}

servicesSlider.addEventListener('pointerup', finishServiceDrag);
servicesSlider.addEventListener('pointercancel', finishServiceDrag);

servicesSlider.addEventListener('click', event => {
    if (event.target.closest('.serviceMore') || !serviceDidDrag) return;

    event.preventDefault();
    event.stopPropagation();
}, true);

servicesSlider.addEventListener('dragstart', event => event.preventDefault());
servicesSlider.addEventListener('mouseenter', () => clearInterval(servicesAutoPlay));
servicesSlider.addEventListener('mouseleave', startServicesAutoPlay);
servicesSlider.addEventListener('focusin', () => clearInterval(servicesAutoPlay));
servicesSlider.addEventListener('focusout', startServicesAutoPlay);

/* RECALCULA O CARROSSEL */
function refreshServices() {
    const currentPosition = servicePositions[serviceIndex] || 0;
    servicePositions = getServicePositions();

    let closestIndex = 0;
    let closestDistance = Infinity;

    servicePositions.forEach((position, index) => {
        const distance = Math.abs(position - currentPosition);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
        }
    });

    serviceIndex = closestIndex;
    createServiceDots();
    updateServices();
}

window.addEventListener('load', () => {
    refreshServices();
    startServicesAutoPlay();
});

window.addEventListener('resize', () => {
    refreshServices();
    startServicesAutoPlay();
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(servicesAutoPlay);
    else startServicesAutoPlay();
});

reduceServiceMotion.addEventListener('change', startServicesAutoPlay);

/* INICIALIZA */
refreshServices();
startServicesAutoPlay();
