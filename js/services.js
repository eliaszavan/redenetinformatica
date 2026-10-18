
const servicesTrack = document.querySelector('.servicesTrack');
const servicesSlider = document.querySelector('.servicesSlider');
const serviceCards = document.querySelectorAll('.serviceCard');

const servicePrev = document.querySelector('.servicePrev');
const serviceNext = document.querySelector('.serviceNext');
const serviceDots = document.querySelector('.serviceDots');

let serviceIndex = 0;
let servicePositions = [];


// Calcula as posições válidas do carrossel.
function getServicePositions() {
    if (!servicesTrack || !servicesSlider || !serviceCards.length) {
        return [0];
    }

    const maxScroll = Math.max(
        0,
        servicesTrack.scrollWidth - servicesSlider.clientWidth
    );

    const positions = [0];

    let position = 0;

    serviceCards.forEach((card, index) => {
        if (index === 0) return;

        const cardPosition = card.offsetLeft -
            serviceCards[0].offsetLeft;

        // Só adiciona posições que ainda permitem avançar
        // sem ultrapassar o limite real do carrossel.
        if (
            cardPosition > position &&
            cardPosition < maxScroll - 1
        ) {
            positions.push(cardPosition);
            position = cardPosition;
        }
    });

    // Inclui o limite final quando ainda não foi alcançado.
    if (maxScroll > 0 && positions[positions.length - 1] < maxScroll - 1) {
        positions.push(maxScroll);
    }

    return positions;
}


// Cria as bolinhas de navegação.
function createServiceDots() {
    if (!serviceDots) return;

    serviceDots.innerHTML = '';

    servicePositions.forEach((_, index) => {
        const dot = document.createElement('button');

        dot.type = 'button';
        dot.classList.add('serviceDot');

        dot.setAttribute(
            'aria-label',
            `Ir para a posição ${index + 1}`
        );

        dot.addEventListener('click', () => {
            serviceIndex = index;
            updateServices();
        });

        serviceDots.appendChild(dot);
    });
}


// Atualiza o carrossel, as bolinhas e as setas.
function updateServices() {
    if (!servicesTrack || !serviceCards.length) return;

    const maxIndex = servicePositions.length - 1;

    serviceIndex = Math.max(
        0,
        Math.min(serviceIndex, maxIndex)
    );

    const position = servicePositions[serviceIndex] || 0;

    servicesTrack.style.transform =
        `translateX(-${position}px)`;

    const dots = serviceDots.querySelectorAll('.serviceDot');

    dots.forEach((dot, index) => {
        const active = index === serviceIndex;

        dot.classList.toggle('active', active);

        dot.setAttribute(
            'aria-current',
            active ? 'true' : 'false'
        );
    });

    if (servicePrev) {
        servicePrev.disabled = serviceIndex === 0;
    }

    if (serviceNext) {
        serviceNext.disabled = serviceIndex >= maxIndex;
    }
}


// Avança para a próxima posição.
if (serviceNext) {
    serviceNext.addEventListener('click', () => {
        if (serviceIndex < servicePositions.length - 1) {
            serviceIndex++;
            updateServices();
        }
    });
}


// Volta para a posição anterior.
if (servicePrev) {
    servicePrev.addEventListener('click', () => {
        if (serviceIndex > 0) {
            serviceIndex--;
            updateServices();
        }
    });
}


// Recalcula as posições após alterações no layout.
function refreshServices() {
    const currentPosition = servicePositions[serviceIndex] || 0;

    servicePositions = getServicePositions();

    // Mantém a posição visual mais próxima após o redimensionamento.
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


// Aguarda o layout inicial estar calculado.
window.addEventListener('load', refreshServices);

// Recalcula ao redimensionar a janela.
window.addEventListener('resize', refreshServices);


// Inicializa.
refreshServices();
