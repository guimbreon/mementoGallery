// Auxiliary function

// Função para adicionar uma foto eliminada ao álbum de lixo
function addToTrashAlbum(picture) {
  // Obter o álbum de lixo do localStorage ou inicializá-lo como vazio
  let lixoAlbum = JSON.parse(localStorage.getItem("lixoAlbum")) || {};

  // Certificar que a chave do álbum para o lixo existe
  if (!lixoAlbum[picture.albumKey]) {
      lixoAlbum[picture.albumKey] = [];
  }

  // Adicionar a imagem ao álbum de lixo, evitando duplicatas
  if (!lixoAlbum[picture.albumKey].some(img => img.link === picture.link)) {
      lixoAlbum[picture.albumKey].push(picture);
  }

  // Atualizar o localStorage com o novo estado do álbum de lixo
  localStorage.setItem("lixoAlbum", JSON.stringify(lixoAlbum));

  console.log(`Imagem adicionada ao álbum de lixo: ${picture.link}`);
}


function removeGeneralImages(selectedPictures) {
  let allAlbuns = JSON.parse(localStorage.getItem("albuns")) || {}; // Get albums from localStorage
  
  // Removed images counter
  let removedCount = 0;

  // For each selected image
  selectedPictures.forEach(picture => {
    let album = allAlbuns[picture.albumKey];
    
    // Find all instances of this image in the album
    let pictureIndexes = [];
    album.forEach((item, index) => {
      if (item.link === picture.link) pictureIndexes.push(index);
    });

    // Limit removal to the number of selections made (does not remove more than selected)
    pictureIndexes.slice(0, selectedPictures.filter(p => p.link === picture.link).length).forEach(index => {
      album.splice(index, 1); // Remove the image
      addToTrashAlbum(picture);
      removedCount++;
    });
  });

  // Update albums in localStorage with the remaining images
  localStorage.setItem("albuns", JSON.stringify(allAlbuns));

  console.log(`${removedCount} images removed.`);
}


// Function to create the close button
function createCloseButton(popup, overlay) {
  const img = document.createElement("img");
  img.src = window.location.pathname.endsWith("album.html") ? "images/icons/remove.png" : "../images/icons/remove.png"


  const divClose = document.createElement("div");
  
  divClose.id = "close-popup";
  divClose.className = "close-button"
  divClose.onclick = () => {
    document.body.removeChild(popup); // Close the pop-up
    document.body.removeChild(overlay); // Remove the overlay
  };
  divClose.appendChild(img)
  return divClose;
}


function findDuplicates() {
  const allAlbuns = JSON.parse(localStorage.getItem("albuns")) || {}; // Get albums from localStorage
  const duplicatesByAlbum = {};

  // Iterate over each album
  Object.keys(allAlbuns).forEach(albumKey => {
    const album = allAlbuns[albumKey];

    // Organize images by link inside the album
    const duplicates = {};
    album.forEach(picture => {
      if (!duplicates[picture.link]) {
        duplicates[picture.link] = [];
      }
      duplicates[picture.link].push(picture);
    });

    // Filter groups with more than one image (duplicates)
    const duplicateGroups = Object.values(duplicates).filter(group => group.length > 1);

    if (duplicateGroups.length > 0) {
      duplicatesByAlbum[albumKey] = duplicateGroups;
    }
  });

  console.log(duplicatesByAlbum, "Duplicates by album");
  return duplicatesByAlbum; // Return duplicates organized by album
}

function pupUpFotosGerais() {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  document.body.appendChild(overlay);
  overlay.style.display = "block";

  const popup = document.createElement("section"); // Using <section> instead of <div>
  popup.className = "popUpFotosGerais";

  const title = document.createElement("h2");
  title.innerHTML = "Select the photos you want to <u>remove</u>.";
  popup.appendChild(title);

  
  // Add close button
  const closeButton = createCloseButton(popup, overlay);
  popup.appendChild(closeButton);

  const albumContainer = document.createElement("div");
  albumContainer.className = "album-container";

  const allAlbuns = JSON.parse(localStorage.getItem("albuns")) || {}; // Get albums from localStorage

  // Iterate over albums to display photos
  Object.keys(allAlbuns).forEach(albumKey => {
    const album = allAlbuns[albumKey];

    const albumGroup = document.createElement("div");
    albumGroup.className = "album-group";

    const albumTitle = document.createElement("h3");
    albumTitle.textContent = `Album: ${albumKey}`;
    albumGroup.appendChild(albumTitle);

    // Create a map to control image selection
    album.forEach(picture => {
      const img = document.createElement("img");
      img.src = "../albuns/" + picture.link;
      img.alt = picture.nome;
      img.className = "popup-img";

      // Store the album key in the image
      picture.albumKey = albumKey;

      img.onclick = () => {
        // Control image selection
        if (selectedImages.includes(picture)) {
          selectedImages = selectedImages.filter(p => p !== picture); // Unselect
          img.classList.remove("selected");
        } else {
          selectedImages.push(picture); // Select
          img.classList.add("selected");
        }
      };

      albumGroup.appendChild(img);
    });

    albumContainer.appendChild(albumGroup);
  });

  popup.appendChild(albumContainer);

  const doneButton = document.createElement("button");
  doneButton.textContent = "Done";
  doneButton.className = "doneButton";
  doneButton.onclick = () => {
    
    if (confirm("Are you sure you want to delete the pictures?")) {
      // Check if there are selected duplicate images
      const duplicatePictures = selectedImages.filter(picture => {
        const allPictures = allAlbuns[picture.albumKey];
        const duplicateCount = allPictures.filter(p => p.link === picture.link).length;
        return duplicateCount > 1; // If the image is duplicated
      });

      if (duplicatePictures.length > 0) {
        // Limit the removal of duplicates by the number of selected images
        const limit = duplicatePictures.length;
        removeImgFromAlbum(duplicatePictures.slice(0, limit), duplicatePictures[0]?.albumKey); // Pass the correct album to the removal function
      } else {
        // Remove only the selected images
        removeGeneralImages(selectedImages);
      }

      // Clear the selected images list
      selectedImages = [];
      document.body.removeChild(popup); // Close the pop-up
      document.body.removeChild(overlay); // Remove the overlay

  } else {
    // O usuário clicou em "No"
    closePopUp
    console.log("Não adicionado.");
}

    
  };

  popup.appendChild(doneButton);
  document.body.appendChild(popup);
}


// Function to remove the image from a specific album, limiting removal to the number of selected images
function removeImgFromAlbum(selectedPictures, albumKey) {
  let allAlbuns = JSON.parse(localStorage.getItem("albuns")) || {}; // Get albums from localStorage


  if (!allAlbuns[albumKey]) {
    console.error(`Album "${albumKey}" not found.`);
    return;
  }

  // Get the specific album
  let album = allAlbuns[albumKey];

  // Removed images counter
  let removedCount = 0;

  // For each selected image
  selectedPictures.forEach(picture => {
    // If the image is in the album, remove it
    let pictureIndex = album.findIndex(item => item.link === picture.link);
    addToTrashAlbum(picture);
    if (pictureIndex !== -1) {
      album.splice(pictureIndex, 1); // Remove only the selected image
      removedCount++;
    }
  });

  // Update the album in localStorage with the remaining images
  allAlbuns[albumKey] = album;
  localStorage.setItem("albuns", JSON.stringify(allAlbuns));

  console.log(`${removedCount} images removed from album "${albumKey}".`);
}





// Function to display duplicate photos, separated by album
function popUpDuplicateFotos() {
  let duplicatePages = findDuplicates(); // Initialize duplicates
  console.log(duplicatePages);
  
  // Check if the duplicates object is empty
  if (Object.keys(duplicatePages).length === 0) {
    alert("No duplicates found!");
    return;
  }
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  document.body.appendChild(overlay);
  overlay.style.display = "block";

  const popup = document.createElement("section"); // Using <section> instead of <div>
  popup.className = "popUpDuplicateFotos";

  const closeButton = createCloseButton(popup, overlay);
  popup.appendChild(closeButton);
  
  const title = document.createElement("h2");
  title.innerHTML = "Select the photos you want to <u>remove</u>.";
  popup.appendChild(title);


  const duplicateContainer = document.createElement("div");
  duplicateContainer.className = "duplicate-container";

  const allAlbuns = JSON.parse(localStorage.getItem("albuns")) || {}; // Get albums from localStorage

  // Iterate over albums to find duplicates
  Object.keys(allAlbuns).forEach(albumKey => {
    const album = allAlbuns[albumKey];

    // Group duplicates inside the album
    const duplicatesMap = album.reduce((acc, picture) => {
      if (!acc[picture.link]) acc[picture.link] = [];
      acc[picture.link].push(picture);
      return acc;
    }, {});

    const duplicateGroups = Object.values(duplicatesMap).filter(group => group.length > 1);

    duplicateGroups.forEach((group, index) => {
      const groupContainer = document.createElement("div");
      groupContainer.className = "duplicate-group";

      const groupTitle = document.createElement("h3");
      groupTitle.textContent = `Album: ${albumKey} - Group ${index + 1}`;
      groupContainer.appendChild(groupTitle);

      group.forEach(picture => {
        const img = document.createElement("img");
        img.src = "../albuns/" + picture.link;
        img.alt = picture.nome;
        img.className = "popup-img";

        // Store the album key in the image
        picture.albumKey = albumKey;

        img.onclick = () => {
          // Control image selection
          if (selectedImages.includes(picture)) {
            selectedImages = selectedImages.filter(p => p !== picture); // Unselect
            img.classList.remove("selected");
          } else {
            // Limit selection to the number of images in the group
              selectedImages.push(picture); // Select
              img.classList.add("selected");
            
          }
        };

        groupContainer.appendChild(img);
      });

      duplicateContainer.appendChild(groupContainer);
    });
  });

  popup.appendChild(duplicateContainer);

  const doneButton = document.createElement("button");
  doneButton.textContent = "Done";
  doneButton.className = "doneButton";
  doneButton.onclick = () => {

    
    if (confirm("Are you sure you want to delete the pictures?")) {
      // Proceed to remove the selected duplicates
      if (selectedImages.length > 0) {
        removeGeneralImages(selectedImages); // Remove selected duplicates
      }

      // Clear the selected images list
      selectedImages = [];
      document.body.removeChild(popup); // Close the pop-up
      document.body.removeChild(overlay); // Remove the overlay

    }
  };

  popup.appendChild(doneButton);
  document.body.appendChild(popup);
}



// Variável global para armazenar as imagens selecionadas temporariamente
let selectedImages = [];

// Ajuste do menu de lixo
const trashMenu = document.getElementById("trashMenu");

// Botão "Eliminar Duplicadas"
const deleteDuplicatesButton = document.createElement("button");
deleteDuplicatesButton.textContent = "Delete Duplicates";
deleteDuplicatesButton.className = "trash-button";
deleteDuplicatesButton.onclick = function () { popUpDuplicateFotos() };

// Botão "Eliminar Fotos Do Sistema"
const eliminarGeralButton = document.createElement("button");
eliminarGeralButton.textContent = "Delete Photos from the System";
eliminarGeralButton.className = "trash-button";
eliminarGeralButton.onclick = function () { 
    
  
  pupUpFotosGerais() };

trashMenu.appendChild(eliminarGeralButton);
trashMenu.appendChild(deleteDuplicatesButton);
