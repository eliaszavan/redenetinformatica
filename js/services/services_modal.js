const serviceModal = document.querySelector('#serviceModal');

const serviceModalClose = document.querySelector('.serviceModalClose');
const serviceModalBack = document.querySelector('.serviceModalBack');
const serviceModalOverlay = document.querySelector('.serviceModalOverlay');

const serviceMoreButtons = document.querySelectorAll('.serviceMore');

const modalTitle = document.querySelector('#modalTitle');
const modalDescription = document.querySelector('#modalDescription');
const modalIcon = document.querySelector('#modalIcon');
const modalItems = document.querySelector('#modalItems');
const modalInfo = document.querySelector('#modalInfo');


const services = {

    computadores: {
        title: 'Computadores',

        icon: 'fa-desktop',

        description:
            'Manutenção completa para computadores, com diagnóstico, reparos e melhorias para garantir mais desempenho e estabilidade.',

        items: [
            'Formatação e instalação de sistemas',
            'Diagnóstico de hardware e software',
            'Troca de SSD e memória RAM',
            'Limpeza interna e manutenção preventiva',
            'Correção de lentidão e travamentos',
            'Backup e recuperação de arquivos'
        ],

        info:
            'Traga seu computador até a RedeNet para uma avaliação precisa e identificação do serviço necessário.'
    },
    redes: {
        title: 'Rede Ethernet e Wi-Fi',

        icon: 'fa-wifi',

        description:
            'Instalação e configuração de redes cabeadas e Wi-Fi para residências e empresas.',

        items: [
            'Configuração de redes Wi-Fi',
            'Instalação de rede cabeada',
            'Montagem de cabos de rede',
            'Configuração de roteadores',
            'Diagnóstico de problemas de conexão',
            'Organização e expansão da rede'
        ],

        info:
            'Entre em contato com a RedeNet para avaliarmos o ambiente e indicarmos a melhor solução de rede.'
    },


    notebooks: {
        title: 'Notebooks',

        icon: 'fa-laptop',

        description:
            'Manutenção especializada para notebooks de diversas marcas e modelos, garantindo mais desempenho, segurança e vida útil para o seu equipamento.',

        items: [
            'Formatação e instalação de sistemas',
            'Diagnóstico completo de hardware e software',
            'Troca de SSD e memória',
            'Reparo de tela, teclado e outros componentes',
            'Limpeza interna e troca de pasta térmica',
            'Otimização de desempenho'
        ],

        info:
            'Traga seu notebook até a RedeNet para uma avaliação precisa e um diagnóstico do serviço necessário.'
    },


    impressoras: {
        title: 'Impressoras',

        icon: 'fa-print',

        description:
            'Manutenção e configuração de impressoras para manter seu equipamento funcionando corretamente e com qualidade de impressão.',

        items: [
            'Diagnóstico de falhas',
            'Limpeza e manutenção preventiva',
            'Configuração de impressoras',
            'Correção de falhas de impressão',
            'Manutenção de impressoras a laser',
            'Manutenção de impressoras jato de tinta'
        ],

        info:
            'Leve sua impressora até a RedeNet para avaliarmos o equipamento e identificarmos a melhor solução.'
    },


    pcgamer: {
        title: 'PC Gamer',

        icon: 'fa-gamepad',

        description:
            'Montagem e manutenção de computadores gamer, buscando desempenho, estabilidade e uma configuração adequada para o seu uso.',

        items: [
            'Montagem personalizada',
            'Upgrade de placa de vídeo',
            'Instalação de SSD e memória RAM',
            'Organização e montagem de componentes',
            'Otimização de desempenho',
            'Manutenção preventiva'
        ],

        info:
            'Fale conosco sobre o seu setup e podemos avaliar as melhores opções de montagem ou upgrade para o seu PC Gamer.'
    },


    upgrade: {
        title: 'Upgrade de Hardware',

        icon: 'fa-microchip',

        description:
            'Atualize seu equipamento com componentes que podem melhorar o desempenho e prolongar sua vida útil.',

        items: [
            'Upgrade de memória RAM',
            'Instalação de SSD',
            'Troca de processador',
            'Upgrade de placa de vídeo',
            'Substituição de fonte',
            'Avaliação de compatibilidade'
        ],

        info:
            'Antes do upgrade, avaliamos a compatibilidade do equipamento para indicar componentes adequados à sua necessidade.'
    },
    cameras: {
        title: 'Câmeras',

        icon: 'fa-video',

        description:
            'Instalação, configuração e manutenção de sistemas de câmeras para monitoramento residencial e comercial.',

        items: [
            'Instalação de câmeras de segurança',
            'Configuração de DVR e NVR',
            'Acesso remoto pelo celular',
            'Configuração de gravação e armazenamento',
            'Manutenção e diagnóstico do sistema',
            'Expansão de sistemas de monitoramento'
        ],

        info:
            'Entre em contato com a RedeNet para avaliarmos o ambiente e indicarmos uma solução de monitoramento adequada à sua necessidade.'
    }
};


function openServiceModal(serviceName) {

    const service = services[serviceName];

    if (!service) {
        return;
    }


    modalTitle.textContent = service.title;

    modalDescription.textContent = service.description;

    modalInfo.textContent = service.info;


    modalIcon.className = `fa-solid ${service.icon}`;


    modalItems.innerHTML = '';


    service.items.forEach(item => {

        const modalItem = document.createElement('div');

        modalItem.classList.add('serviceModalItem');


        modalItem.innerHTML = `
            <i class="fa-solid fa-check"></i>
            <span>${item}</span>
        `;


        modalItems.appendChild(modalItem);
    });


    serviceModal.classList.add('open');

    document.body.classList.add('modalOpen');
}


function closeServiceModal() {

    serviceModal.classList.remove('open');

    document.body.classList.remove('modalOpen');
}


serviceMoreButtons.forEach(button => {

    button.addEventListener('click', (event) => {

        event.preventDefault();


        const serviceName = button.dataset.service;


        openServiceModal(serviceName);
    });
});


serviceModalClose.addEventListener('click', closeServiceModal);


serviceModalBack.addEventListener('click', closeServiceModal);


serviceModalOverlay.addEventListener('click', closeServiceModal);


document.addEventListener('keydown', (event) => {

    if (event.key === 'Escape' && serviceModal.classList.contains('open')) {

        closeServiceModal();
    }
});