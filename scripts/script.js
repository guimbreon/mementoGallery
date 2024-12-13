const mainFab = document.querySelector('.main-fab');
const fabContainer = document.querySelector('.fab-container');
const plus = document.getElementById('plus');

document.addEventListener("DOMContentLoaded", () => {
    // Carregar e aplicar a fonte salva
    const savedFont = localStorage.getItem("selectedFont");
    if (savedFont) {
        document.documentElement.classList.add(savedFont);
    }

    // Carregar e aplicar o tema salvo
    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    }
});

mainFab.addEventListener('click', () => {
    if (fabContainer.classList.contains('open')) {
        // Adiciona a classe 'closing' e remove 'open' para iniciar o desaparecimento
        fabContainer.classList.remove('open');
        fabContainer.classList.add('closing');

        // Remove a classe 'closing' após o término da animação
        setTimeout(() => {
            fabContainer.classList.remove('closing');
        }, 300); // 300ms deve corresponder à duração total da animação no CSS
    } else {
        // Adiciona a classe 'open' para exibir os ícones
        fabContainer.classList.add('open');
    }
});