const menuToggle = document.querySelector('.menuToggle');
const menu = document.querySelector('.menu');
const menuLinks = document.querySelectorAll(".menu a[href^='#']");
const header = document.querySelector('header');

/* MENU MOBILE */
menuToggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});

menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
    });
});

/* NAVEGAÇÃO ATIVA POR SEÇÃO */
function updateActiveSection() {
    const headerHeight = header ? header.offsetHeight : 0;
    const activationPoint = window.scrollY + headerHeight + 100;
    let currentSection = null;

    menuLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;

        const section = document.querySelector(href);
        if (!section) return;

        if (section.offsetTop <= activationPoint) {
            currentSection = section;
        }
    });

    const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5;

    if (isAtBottom) {
        for (let i = menuLinks.length - 1; i >= 0; i--) {
            const href = menuLinks[i].getAttribute('href');
            if (!href || href === '#') continue;

            const section = document.querySelector(href);
            if (section) {
                currentSection = section;
                break;
            }
        }
    }

    menuLinks.forEach(link => link.classList.remove('active'));

    if (currentSection) {
        const activeLink = document.querySelector(`.menu a[href="#${currentSection.id}"]`);
        if (activeLink) activeLink.classList.add('active');
    }
}

/* OFFSET DO HEADER PARA NAVEGAÇÃO */
function updateHeaderOffset() {
    if (!header) return;

    document.documentElement.style.setProperty(
        '--headerOffset',
        `${header.offsetHeight + 15}px`
    );
}

/* EVENTOS */
window.addEventListener('scroll', updateActiveSection, { passive: true });
window.addEventListener('resize', updateActiveSection);
window.addEventListener('load', updateHeaderOffset);
window.addEventListener('resize', updateHeaderOffset);

updateActiveSection();
updateHeaderOffset();
