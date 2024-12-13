// Supondo que 'allPictures' já esteja armazenado no localStorage
const genAllPics = JSON.parse(localStorage.getItem("allPictures"));



// Seleciona a seção onde as fotos serão inseridas
const photosSection = document.querySelector(".photos");

// Função para extrair o caminho relativo a partir de "/albuns/"
function getRelativePath(link) {
    const basePath = "/albuns/";
    const index = link.indexOf(basePath);

    if (index !== -1) {
        // Caso contenha "/albuns/", extrai o caminho relativo
        return link.substring(index + basePath.length);
    } else {
        return link;
    }
}

// Verifica se o array de imagens existe e tem conteúdo
if (allPictures && allPictures.length > 0) {
    allPictures.forEach(picture => {
        const relativePath = getRelativePath(picture.link);
        if (relativePath) {
            // Cria o contêiner div
            const photoDiv = document.createElement("div");
            photoDiv.className = "photo";

            // Cria o elemento de imagem
            const imgElement = document.createElement("img");
            imgElement.src = `albuns/${relativePath}`;
            imgElement.alt = picture.nome || "Image without name";
            imgElement.onclick = () => openImage(imgElement.src);

            // Adiciona a imagem à div
            photoDiv.appendChild(imgElement);

            // Adiciona a div ao section
            photosSection.appendChild(photoDiv);
        }
    });
} else {
    photosSection.innerHTML = "<p>No images found.</p>";
}


