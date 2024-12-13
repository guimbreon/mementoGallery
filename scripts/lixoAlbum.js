// Supondo que 'lixoAlbum' já esteja armazenado no localStorage
const lixoAlbum = JSON.parse(localStorage.getItem("lixoAlbum"));

// Seleciona a seção onde as fotos serão inseridas
const photosLixoSection = document.querySelector(".photosLixo");

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

// Verifica se 'lixoAlbum' existe e possui álbuns
if (lixoAlbum && Object.keys(lixoAlbum).length > 0) {
    Object.keys(lixoAlbum).forEach(albumName => {
        const album = lixoAlbum[albumName];

        if (Array.isArray(album) && album.length > 0) {
            // Cria um título para o álbum
            const albumTitle = document.createElement("h3");
            albumTitle.textContent = `Album: ${albumName}`;
            photosLixoSection.appendChild(albumTitle);

            // Cria uma div contêiner para o álbum com estilo de grid
            const albumContainer = document.createElement("div");
            albumContainer.style.marginTop = "28px";
            albumContainer.style.display = "grid";
            albumContainer.style.gridTemplateColumns = "repeat(5, 1fr)";
            albumContainer.style.gap = "10px";

            // Para cada imagem no álbum
            album.forEach(picture => {
                const relativePath = getRelativePath(picture.link);

                if (relativePath) {
                    // Cria o contêiner div para a imagem
                    const photoDiv = document.createElement("div");
                    photoDiv.className = "photo";

                    // Cria o elemento de imagem
                    const imgElement = document.createElement("img");
                    imgElement.src = `../albuns/${relativePath}`;
                    imgElement.alt = picture.nome || "Image without name";

                    // Adiciona um evento onclick para manipular a imagem (opcional)
                    imgElement.onclick = () => openImage(imgElement.src);

                    // Adiciona a imagem à div
                    photoDiv.appendChild(imgElement);

                    // Adiciona a div ao contêiner do álbum
                    albumContainer.appendChild(photoDiv);
                }
            });

            // Adiciona o contêiner do álbum à seção de fotos
            photosLixoSection.appendChild(albumContainer);
        }
  
    });
} else {
    // Exibe mensagem se o álbum de lixo estiver vazio
    photosLixoSection.innerHTML = "<p>No images found in trash.</p>";
}

function openImage(srcImagem) {
  console.log("a");

  // Remove the part of the path to match the stored relative path structure
  srcImagem = srcImagem.replace(/^.*\/albuns\//, "").replace(/\\/g, "/");

  // Retrieve the metadata from localStorage
  const imageData = JSON.parse(localStorage.getItem("lixoAlbum"));
  
  // Search for the correct image based on the relative path
  let correctImgs;
  for (let albumName in imageData) {
    for (let image of imageData[albumName]) {
      if (srcImagem === image.link) {  // Direct path comparison
        correctImgs = image;
        break;
      }
    }
    if (correctImgs) break;  // Exit the outer loop once found
  }

  if (correctImgs) {
    let srcEmocao;
    if (correctImgs.emocao == "admiration") {
      srcEmocao = window.location.pathname.endsWith("album.html") ? "../images/icons/admiracao.png" : "images/icons/admiracao.png";
    } else if (correctImgs.emocao == "delight") {
      srcEmocao = window.location.pathname.endsWith("album.html") ? "../images/icons/encantamento.png" : "images/icons/encantamento.png";
    } else if (correctImgs.emocao == "calmness") {
      srcEmocao = window.location.pathname.endsWith("album.html") ? "../images/icons/tranquilidade.png" : "images/icons/tranquilidade.png";
    } else if (correctImgs.emocao == "happyness") {
      srcEmocao = window.location.pathname.endsWith("album.html") ? "../images/icons/felicidade.png" : "images/icons/felicidade.png";
    } else if (correctImgs.emocao == "passion") {
      srcEmocao = window.location.pathname.endsWith("album.html") ? "../images/icons/paixao.png" : "images/icons/paixao.png";
    }

    const pessoasInfo = correctImgs.pessoas && correctImgs.pessoas.trim() !== "" 
    ? `<p id="pessoas">People: ${correctImgs.pessoas}</p>` 
    : "";

    const notasInfo = correctImgs.notas && correctImgs.notas.trim() !== "" 
    ? `<p id="notas"><strong>Notes:</strong> ${correctImgs.notas}</p>` 
    : "";

    let srcLocal = window.location.pathname.endsWith("album.html") ? "../images/localizacao.png" : "images/localizacao.png";
    let srcPin = window.location.pathname.endsWith("album.html") ? "../images/pin.png" : "images/pin.png";
    let srcRem = window.location.pathname.endsWith("album.html") ? "../images/icons/remove.png" : "images/icons/remove.png";

    const body = document.body;

    popUp.innerHTML = `
      <section class="popup-image" id="popup-image">
        <div class="popup-imageInfo">
          <div class="image-container">
            <img src=../albuns/${srcImagem} class="popup-image">



            <div class="restaurar">
              <button class="fab" id="restore"><img src="../images/icons/restore.png"></button>
            </div>
          </div>
          <div class="text-container">
            <div id="close-popup" class="close-button"><img src="../${srcRem}"></div>
            <p id="data">${correctImgs.data}</p>
            <div class="map-container">
              <div class="map-wrapper">
                <img id="map" src="../${srcLocal}" class="map-img">
                <img id="pin_map" src="../${srcPin}" class="pin-img">
              </div>
              <p class="location-text">${correctImgs.localizacao}</p>
            </div>
            ${pessoasInfo}
            <div class="emocao-container">
              <img src="../${srcEmocao}" alt="emoji" class="emoji">
              <p id="emocao">
                ${correctImgs.emocao}
                <span class="info-icon" id="info-icon">i</span>
                <span class="info-tooltip">This photo conveys a feeling of ${correctImgs.emocao}</span>
              </p>
            </div>
            <div class="detalhes-tec">
              <div class="metadados-dispositivo">${correctImgs.dispositivo}</div>
              <div class="metadados-camera">${correctImgs.camera}</div>
              <div class="metadados-meta">${correctImgs.metadados}</div>
              <div class="metadados-avancados">${correctImgs.avancados}</div>
            </div>
            <hr>
            ${notasInfo}
            <hr>
          </div>
        </div>
      </section>
    `;

    popUp.style.display = "flex";
    body.style.overflow = "hidden";

    const imageElement = document.querySelector('.image-container img'); 
    const closeButton = document.getElementById('close-popup');

    imageElement.addEventListener('click', function () {
      imageElement.classList.toggle('show'); 
    });

    document.getElementById("close-popup").addEventListener("click", closePopUp);
    document.getElementById("popup-image").addEventListener("click", function (event) {
      if (event.target.id === 'popup-image') {
        closePopUp();
      }
    });

    const pinImage = document.getElementById("pin_map");
    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    document.body.appendChild(tooltip);

    pinImage.addEventListener("mouseover", (event) => {
      tooltip.textContent = `${correctImgs.gps}`;
      tooltip.style.visibility = "visible";

      const pinRect = pinImage.getBoundingClientRect();
      tooltip.style.top = `${pinRect.top + window.scrollY + 10}px`; 
      tooltip.style.left = `${pinRect.left + window.scrollX + pinImage.width + 10}px`; 
    });

    pinImage.addEventListener("mouseout", () => tooltip.style.visibility = "hidden");


  }
}

function closePopUp() {
  popUp.style.display = "none";
  document.body.style.overflow = "";
}



document.addEventListener("click", (event) => {
  let albuns = JSON.parse(localStorage.getItem("albuns"));
  let lixoAlbum = JSON.parse(localStorage.getItem("lixoAlbum"));
  let allPictures = JSON.parse(localStorage.getItem("allPictures"));

  if (event.target.closest("#restore")) {
    const confirmRestore = confirm("Are you sure you want to restore the image?");
    
    if (confirmRestore) {
      // Find the image link and album dynamically from the clicked element
      const imageContainer = event.target.closest(".image-container");
      const imageElement = imageContainer.querySelector(".popup-image");
      const imageSrc = imageElement.src; // Get the src of the image
      const imageLink = imageSrc.split("/albuns/")[1]; // Extract the relative path of the image
      const albumKey = imageLink.split("/")[0]; // Get the album name (e.g., 'Natureza')
      
      // Check if the image exists in the trash (lixoAlbum)
      let imageToRestore = null;
      for (const album in lixoAlbum) {
        const image = lixoAlbum[album]?.find(img => img.link === imageLink);
        if (image) {
          imageToRestore = image;
          break;
        }
      }

      // If the image exists in lixoAlbum, restore it
      if (imageToRestore) {
        // 1. Remove the image from lixoAlbum
        for (const album in lixoAlbum) {
          lixoAlbum[album] = lixoAlbum[album].filter(img => img.link !== imageToRestore.link);
          if(lixoAlbum[album].length == 0){
            delete lixoAlbum[album];
          }
        }

        // 2. Add the image to the correct album in albuns (e.g., Natureza)
        if (albuns[albumKey]) {
          albuns[albumKey].push(imageToRestore);
        } else {
          albuns[albumKey] = [imageToRestore]; // If the album does not exist, create it
        }

        // 3. Add the image to allPictures collection
        allPictures.push(imageToRestore);

        // 4. Save the updated data back to localStorage
        localStorage.setItem("lixoAlbum", JSON.stringify(lixoAlbum));
        localStorage.setItem("albuns", JSON.stringify(albuns));
        localStorage.setItem("allPictures", JSON.stringify(allPictures));

        // 5. Provide feedback and reload the page
        alert("Image restored successfully!");
        location.reload(); // This will reload the page to reflect the changes
        
      } else {
        alert("Image not found in trash.");
      }
    } else {
      console.log("Image restoration canceled.");
    }
  }
});
