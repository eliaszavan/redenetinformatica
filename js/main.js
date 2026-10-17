const menuToggle = document.querySelector('.menuToggle');
const menu = document.querySelector('.menu');

menuToggle.addEventListener('click', () => {
    menu.classList.toggle('open');
    menuToggle.classList.toggle('open');
});

const menuLinks = document.querySelectorAll('.menu a');

menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.remove('open');
        menuToggle.classList.remove('open');
    });
});
/* ========================================
   NAVEGAÇÃO ATIVA POR SEÇÃO
======================================== */

function initActiveSection() {
    const sections = [...document.querySelectorAll("section[id]")];
    const menuLinks = [...document.querySelectorAll(".menu a[href^='#']")];
    const header = document.querySelector("header");

    if (!sections.length || !menuLinks.length) return;

    // Localiza os links da navbar pelo href ou pelo texto
    function findMenuLink(keywords) {
        return menuLinks.find(link => {
            const href = link.getAttribute("href").toLowerCase();
            const text = link.textContent.toLowerCase();

            return keywords.some(keyword =>
                href.includes(keyword) || text.includes(keyword)
            );
        });
    }

    // Identifica automaticamente as seções
    function findSection(keywords) {
        return sections.find(section =>
            keywords.some(keyword =>
                section.id.toLowerCase().includes(keyword)
            )
        );
    }

    const inicioLink =
        findMenuLink(["inicio", "início"]) || menuLinks[0];

    const servicosLink =
        findMenuLink(["servicos", "serviços", "servico", "services"]);

    const reviewsLink =
        findMenuLink(["reviews", "avaliacoes", "avaliações", "avaliacao"]);

    const reviewsSection =
        findSection(["reviews", "review", "avaliacoes", "avaliações"]) ||
        sections.find(section => {
            const link = reviewsLink;
            return link &&
                link.getAttribute("href") === `#${section.id}`;
        });

    function setActiveLink(activeLink) {
        menuLinks.forEach(link => {
            link.classList.toggle("active", link === activeLink);
        });
    }

    function updateActiveSection() {
        const scrollY = window.scrollY;
        const headerHeight = header
            ? header.getBoundingClientRect().height
            : 0;

        // 1. No topo, mantém Início ativo
        if (scrollY <= 50) {
            setActiveLink(inicioLink);
            return;
        }

        // 2. Depois de 50px, Serviços passa a ser o padrão
        let activeLink = servicosLink || inicioLink;

        // 3. Só ativa Reviews quando chegar ao momento adequado
        if (reviewsSection && reviewsLink) {
            const reviewsTop =
                reviewsSection.getBoundingClientRect().top + scrollY;

            // Evita ativar Reviews apenas porque ela já está
            // parcialmente visível na entrada da página.
            const minimumScroll = window.innerHeight * 0.5;

            const reviewsActivationPoint = Math.max(
                minimumScroll,
                reviewsTop - headerHeight - 50
            );

            const isAtBottom =
                window.scrollY + window.innerHeight >=
                document.documentElement.scrollHeight - 2;

            if (
                scrollY >= reviewsActivationPoint ||
                isAtBottom
            ) {
                activeLink = reviewsLink;
            }
        }

        setActiveLink(activeLink);
    }

    // Eventos
    window.addEventListener("scroll", updateActiveSection, {
        passive: true
    });

    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("hashchange", updateActiveSection);

    // Estado inicial
    updateActiveSection();
}

// Aguarda o HTML estar disponível
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initActiveSection);
} else {
    initActiveSection();
}