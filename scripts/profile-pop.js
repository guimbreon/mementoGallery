document.addEventListener('DOMContentLoaded', () => {
    const profileIcon = document.getElementById('profileIcon');
    const profilePop = document.getElementById('profilePop');

    // Abre ou fecha o pop-up ao clicar no ícone de perfil
    profileIcon.addEventListener('click', (event) => {
        event.stopPropagation(); // Impede que o clique feche imediatamente
        profilePop.style.display = 
            profilePop.style.display === 'block' ? 'none' : 'block';
    });

    // Fecha o pop-up ao clicar em qualquer outro lugar
    document.addEventListener('click', () => {
        profilePop.style.display = 'none';
    });

    // Impede o fechamento ao clicar dentro do pop-up
    profilePop.addEventListener('click', (event) => {
        event.stopPropagation();
    });
});