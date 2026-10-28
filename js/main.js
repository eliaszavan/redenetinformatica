const menuToggle = document.querySelector('.menuToggle');
const menu = document.querySelector('.menu');


/* ========================================
   MENU MOBILE
======================================== */

menuToggle.addEventListener('click', () => {

    menu.classList.toggle('open');

    menuToggle.classList.toggle('open');
});


const menuLinks = document.querySelectorAll(
    ".menu a[href^='#']"
);


menuLinks.forEach(link => {

    link.addEventListener('click', () => {

        menu.classList.remove('open');

        menuToggle.classList.remove('open');
    });
});


/* ========================================
   NAVEGAÇÃO ATIVA POR SEÇÃO
======================================== */

function updateActiveSection() {

    const header = document.querySelector('header');


    const headerHeight = header
        ? header.offsetHeight
        : 0;


    /*
        Linha imaginária usada para decidir
        qual seção está ativa.

        Ela fica um pouco abaixo do header.
    */

    const activationPoint =
        window.scrollY +
        headerHeight +
        100;


    let currentSection = null;


    menuLinks.forEach(link => {

        const href = link.getAttribute('href');


        if (!href || href === '#') {
            return;
        }


        const section =
            document.querySelector(href);


        if (!section) {
            return;
        }


        /*
            Se o topo da seção já passou
            pelo ponto de ativação,
            ela se torna a seção atual.
        */

        if (
            section.offsetTop <=
            activationPoint
        ) {

            currentSection = section;
        }
    });


    /*
        Se estiver praticamente no final
        da página, ativa a última seção
        existente no menu.
    */

    const isAtBottom =
        window.innerHeight +
        window.scrollY >=
        document.documentElement.scrollHeight - 5;


    if (isAtBottom) {

        for (
            let i = menuLinks.length - 1;
            i >= 0;
            i--
        ) {

            const href =
                menuLinks[i].getAttribute('href');


            if (!href || href === '#') {
                continue;
            }


            const section =
                document.querySelector(href);


            if (section) {

                currentSection = section;

                break;
            }
        }
    }


    /* REMOVE TODOS OS ACTIVE */

    menuLinks.forEach(link => {

        link.classList.remove('active');
    });


    /* ATIVA O LINK DA SEÇÃO ATUAL */

    if (currentSection) {

        const activeLink =
            document.querySelector(
                `.menu a[href="#${currentSection.id}"]`
            );


        if (activeLink) {

            activeLink.classList.add('active');
        }
    }
}


/* ========================================
   EVENTOS
======================================== */

window.addEventListener(
    'scroll',
    updateActiveSection,
    {
        passive: true
    }
);


window.addEventListener(
    'resize',
    updateActiveSection
);


/* ESTADO INICIAL */

updateActiveSection();

/* ========================================
   OFFSET DO HEADER PARA NAVEGAÇÃO
======================================== */

const header = document.querySelector('header');

function updateHeaderOffset() {

    if (!header) {
        return;
    }

    const headerHeight = header.offsetHeight;

    document.documentElement.style.setProperty(
        '--headerOffset',
        `${headerHeight + 15}px`
    );
}

window.addEventListener(
    'load',
    updateHeaderOffset
);

window.addEventListener(
    'resize',
    updateHeaderOffset
);

updateHeaderOffset();