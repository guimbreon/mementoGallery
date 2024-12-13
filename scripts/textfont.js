// script.js

// Função para alterar a fonte e salvar no localStorage
function changeFont(fontClass) {
    // Remover as classes de fontes ativas no <html>
    document.documentElement.classList.remove('poppins', 'roboto', 'opensans', 'helvetica');
    
    // Adicionar a classe correspondente à fonte selecionada
    document.documentElement.classList.add(fontClass);

    // Salvar a decisão no localStorage
    localStorage.setItem('selectedFont', fontClass);
}

// Adiciona eventos de clique aos botões de fonte
document.getElementById('poppins').addEventListener('click', function() {
    changeFont('poppins');
});


document.getElementById('opensans').addEventListener('click', function() {
    changeFont('opensans');
});

document.getElementById('helvetica').addEventListener('click', function() {
    changeFont('helvetica');
});

// Aplicar a fonte salva no localStorage quando a página for carregada
document.addEventListener("DOMContentLoaded", () => {
    const savedFont = localStorage.getItem("selectedFont");
    if (savedFont) {
        document.documentElement.classList.add(savedFont);
    }
});