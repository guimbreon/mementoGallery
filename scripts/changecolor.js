const defaultThemeBtn = document.getElementById("defaultThemeBtn");
const lightThemeBtn = document.getElementById("lightThemeBtn");
const darkThemeBtn = document.getElementById("darkThemeBtn");
const hiddenButton = document.getElementById("hiddenButton");

let darkThemeClickCount = 0; // Contador de cliques no botão dark-theme

function applyTheme(theme) {
    // Remove todos os temas previamente aplicados
    document.body.classList.remove("light-theme", "dark-theme", "hidden-theme");

    // Adiciona o tema escolhido
    if (theme) {
        document.body.classList.add(theme);
        localStorage.setItem("selectedTheme", theme); // Salva o tema no Local Storage
    } else {
        localStorage.removeItem("selectedTheme"); // Remove o tema salvo
    }

    // Atualiza o botão ativo
    updateActiveButton(theme);

    // Atualiza a imagem da seta
    updateBackArrow(theme);
}

function updateActiveButton(theme) {
    // Remove a classe 'active' de todos os botões
    defaultThemeBtn.classList.remove("active");
    lightThemeBtn.classList.remove("active");
    darkThemeBtn.classList.remove("active");
    hiddenButton.classList.remove("active");

    // Adiciona a classe 'active' ao botão correspondente
    if (!theme) {
        defaultThemeBtn.classList.add("active"); // Padrão
    } else if (theme === "light-theme") {
        lightThemeBtn.classList.add("active"); // Claro
    } else if (theme === "dark-theme") {
        darkThemeBtn.classList.add("active"); // Escuro
    } else if (theme === "hidden-theme") {
        hiddenButton.classList.add("active"); // Hidden Theme
    }
}

function updateBackArrow(theme){
    const backArrow = document.getElementById("backArrow")

    if (theme === "dark-theme"){
        backArrow.src = "../images/icons/white-arrow.png";
    } else {
        backArrow.src = "../images/icons/black-arrow.png";
    }
}

// Evento de clique para o botão dark-theme
darkThemeBtn.addEventListener("click", () => {
    applyTheme("dark-theme");
    
    // Incrementa o contador de cliques
    darkThemeClickCount++;

    // Se o contador atingir 7, exibe o botão escondido
    if (darkThemeClickCount === 7) {
        hiddenButton.style.display = "block";
        darkThemeClickCount = 0; // Reseta o contador
    }
});

// Evento de clique para o botão escondido
hiddenButton.addEventListener("click", () => {
    applyTheme("hidden-theme"); // Aplica o tema escondido
});

// Evento de clique para os outros botões
defaultThemeBtn.addEventListener("click", () => {
    applyTheme(null); // volta ao padrão
    darkThemeClickCount = 0; // Reseta o contador
});
lightThemeBtn.addEventListener("click", () => {
    applyTheme("light-theme");
    darkThemeClickCount = 0; // Reseta o contador
});

// No carregamento da página, aplica o tema salvo e atualiza o botão ativo
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme) {
        document.body.classList.add(savedTheme); // aplica o tema salvo
    }
    updateActiveButton(savedTheme); // atualiza o botão ativo
});








//VAI PARA TRÁS SETINHA

function goBack() {
    window.history.back();
}