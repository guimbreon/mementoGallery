// Obtém o parâmetro "album" da URL
let urlParams = new URLSearchParams(window.location.search);
const album = urlParams.get('album');

// Referência ao botão "upload" para adicionar imagens
const uploadButton = document.getElementById("addImage");

// Armazena as imagens selecionadas temporariamente
let selectedImages = [];


const divAlbum = document.getElementById("photos");




// Função para gerar uma imagem
function genPicture(picture) {
    const img = document.createElement("img");
    img.src = picture.link;
    img.alt = picture.nome;

    const divPhoto = document.createElement("div");
    divPhoto.className = "photo";

    divPhoto.onclick = () => {
        openImage(picture.link);
    };


    divPhoto.appendChild(img);
    divAlbum.appendChild(divPhoto);
}

// Função para gerar o álbum
function genAlbum(albumLinks) {
    albumLinks.forEach(picture => {
        genPicture(picture);
    });
}

function openImagePopup() {

    // Create the overlay
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    document.body.appendChild(overlay);
    overlay.style.display = "block"; // Show the overlay


    // Create the pop-up
    const popup = document.createElement("div");
    popup.className = "popUpAddImage";

    // Title for the pop-up
    const title = document.createElement("h2");
    title.textContent = "Add Image";
    popup.appendChild(title);

    // Create the grid container for images
    const imageGrid = document.createElement("div");
    imageGrid.className = "image-grid";

    // Get the images from "allPictures" in localStorage
    const allPictures = JSON.parse(localStorage.getItem("allPictures")) || [];

    allPictures.forEach((picture) => {
        const img = document.createElement("img");
        img.src = picture.link;
        img.alt = picture.nome;
        img.className = "popup-img";

        // Handle selection styling
        img.onclick = () => {
            if (selectedImages.includes(picture)) {
                selectedImages = selectedImages.filter((p) => p !== picture);
                img.classList.remove("selected");
            } else {
                selectedImages.push(picture);
                img.classList.add("selected");
            }
        };
        imageGrid.appendChild(img);
    });

    popup.appendChild(imageGrid);

    // "Done" button to confirm selection
    const doneButton = document.createElement("button");
    doneButton.textContent = "Done";
    doneButton.className = "doneButton";
    doneButton.onclick = () => {

        if (confirm("Are you sure you want to add the image?")) {
            // O usuário clicou em "Yes"
            selectedImages.forEach((picture) => addToAlbum(picture));
            selectedImages = []; // Clear selected images list
        } else {
            // O usuário clicou em "No"
            console.log("Não adicionado.");
        }
        
        document.body.removeChild(popup); // Remove pop-up
        document.body.removeChild(overlay); // Remove overlay

    };
    const img = document.createElement("img");
  img.src = window.location.pathname.endsWith("album.html") ? "../images/icons/remove.png" : "../images/icons/remove.png"


  const divClose = document.createElement("div");
  
  divClose.id = "close-popup";
  divClose.className = "close-button"
  divClose.onclick = () => {
    document.body.removeChild(popup); // Close the pop-up
    document.body.removeChild(overlay); // Remove the overlay
  };
  divClose.appendChild(img)
    popup.appendChild(divClose);
    popup.appendChild(doneButton);
    document.body.appendChild(popup);
}



// Função para adicionar uma imagem ao álbum e salvar no localStorage
function addToAlbum(picture) {
    const storedAlbums = JSON.parse(localStorage.getItem("albuns")) || {};

    if (!storedAlbums[album]) {
        storedAlbums[album] = [];
    }

    storedAlbums[album].push(picture);
    localStorage.setItem("albuns", JSON.stringify(storedAlbums));

    // Atualiza a visualização do álbum
    genPicture(picture);
}

// Função para carregar o álbum dependendo da origem
function loadAlbum() {
    const storedAlbums = JSON.parse(localStorage.getItem("albuns")) || {};

    // Define o título do álbum e insere no elemento <main>
    const tituloAlbum = document.createElement("h2");
    tituloAlbum.innerHTML = document.title;
    
    // Insere o título antes da seção de fotos
    divAlbum.parentNode.insertBefore(tituloAlbum, divAlbum);

    uploadButton.onclick = openImagePopup;
    if (storedAlbums[album] && storedAlbums[album].length > 0) {
        genAlbum(storedAlbums[album]);
    }
}


// Define o título do documento com o nome do álbum
document.title = album;

// Carrega o álbum
loadAlbum();


