document.addEventListener("DOMContentLoaded", () => {
    const backArrow = document.getElementById("backArrow");
    const savedTheme = localStorage.getItem("selectedTheme");

    if (backArrow) {
        // Atualiza a imagem da seta com base no tema salvo
        if (savedTheme === "dark-theme") {
            backArrow.src = "../images/icons/white-arrow.png"; // Seta branca para tema escuro
        } else {
            backArrow.src = "../images/icons/black-arrow.png"; // Seta padrão para outros temas
        }
    }
});