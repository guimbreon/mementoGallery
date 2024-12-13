const uploadBtn = document.getElementById("upload"); // Change button to "upload-btn"

let ThisImport;

document.addEventListener("DOMContentLoaded", () => {
  // Function to create the popup as shown in the image
  function showPopUp() {
    const body = document.body;
    // Create popup content with four options
    const popUpContent = `
      <div class="popup-container">
        <h2>Upload from...</h2>
        <div class="upload-options">
          <button class="upload-option" id="google-drive">Google Drive</button>
          <button class="upload-option" id="icloud">iCloud</button>
          <button class="upload-option" id="one-drive">OneDrive</button>
          <button class="upload-option" id="outro">Other</button>
        </div>
        <div id="close-popup" class="close-button"><img src="images/icons/remove.png"></div>
      </div>
    `;

    // Set popup content
    popUp.innerHTML = popUpContent;
    popUp.style.display = "flex"; // Display the popup
    body.style.overflow = "hidden";

    // Close the popup when 'X' is clicked
    document.getElementById("close-popup").addEventListener("click", closePopUp);
    // CLOSE WHEN CLICK OUTSIDE POP-UP
    document.addEventListener("click", function(event) {
      const popupContainer = document.querySelector(".popup-container");
      if (event.target === popUp && !popupContainer.contains(event.target)) {
        closePopUp(); // Close the pop-up
      }
    });

    // Event listeners for each upload option
    document.getElementById("google-drive").addEventListener("click", () => { closePopUp(); showImportPhotos("GoogleDrive")});
    document.getElementById("icloud").addEventListener("click", () => showImportPhotos("ICloud"));
    document.getElementById("one-drive").addEventListener("click", () => showImportPhotos("OneDrive"));
    document.getElementById("outro").addEventListener("click", () => showImportPhotos("Other"));
  }

  // Function to close the popup
  function closePopUp() {
    popUp.style.display = "none";
    document.body.style.overflow = "";
  }

  // Add event listener to 'Upload' button
  uploadBtn.addEventListener("click", showPopUp);

  function showImportPhotos(whichImport) {
    ThisImport = whichImport
    const body = document.body;
    let photos = JSON.parse(localStorage.getItem("albuns_import")); // Retrieve albums from localStorage
    if (photos && photos[whichImport]) {
      // Generate the popup content as a complete string
      
      popUp.innerHTML = `
        <div class = "popUpcontainer" id = "popup-container">
            <div id="close-popup" class="close-button"><img src="images/icons/remove.png"></div>
            <div class="tittle-import">
              <h2>Select the photos you want to import</h2>
              <p id="select-all">Select all</p> <!-- Add the select all text -->
            </div>
          <div class="photo-gallery">
            ${photos[whichImport].map(photo =>            
              `              <div class="photo-item">
                <img src="${window.location.pathname.endsWith("album.html") ?photo.link : "albuns/"+ photo.link}" alt="${photo.nome}" />
              </div>
            `).join('')}
          </div>
          <div>
          <button id = "return-button">Back</button>
          <button id = "concluir-import">Next</button>
            </div>
        </div>
      `;
  
      popUp.style.display = "flex";
      body.style.overflow = "hidden";
      
      // CODE FOR SELECTING PHOTO
      document.querySelectorAll('.photo-item').forEach(item => {
        item.addEventListener('click', function () {
            // Toggle selection on the clicked photo
            item.classList.toggle('selected');
        });
      });
      
      //"X"
      document.getElementById("close-popup").addEventListener("click", () => {
        closePopUp(); // Close the pop-up when clicking the 'X' button
      });

      //RETURN TO THE PREVIOUS POPUP
      document.getElementById("return-button").addEventListener("click", function() {
        closePopUp();   // Close the current pop-up
        showPopUp();    // Call the function that shows the initial pop-up
      });

      // CLOSE WHEN CLICKING OUTSIDE THE POP-UP
      document.addEventListener("click", function (event) {
        const popupContainer = document.getElementById("popup-container");
        if (event.target === popUp && !popupContainer.contains(event.target)) {
          closePopUp(); // Close the pop-up when clicking outside of it
        }
      });

      // Function to select/deselect all photos
      document.getElementById("select-all").addEventListener("click", function() {
        const allPhotos = document.querySelectorAll('.photo-item');
        const allSelected = Array.from(allPhotos).every(item => item.classList.contains('selected'));
        
        // If all photos are selected, deselect all, otherwise select all
        allPhotos.forEach(item => {
          item.classList.toggle('selected', !allSelected);
        });
      });

    } else {
      alert(`Import functionality with ${ThisImport} not available!`)
      console.error("No photos from Google Drive to display.");
    }
  }
});


// Adds event to "Complete Import" button
document.addEventListener("click", (event) => {
  if (event.target && event.target.id === "concluir-import") {
    // Select all photos marked as selected
    const selectedPhotos = document.querySelectorAll(".photo-item.selected");
    const selectedPhotosCount = selectedPhotos.length;

    if (selectedPhotosCount > 0) {
      // Show confirmation popup
      showConfirmationPopup(selectedPhotosCount, selectedPhotos);
    } else {
      alert("Select at least one photo before continuing.");
    }
  }
});

// Function to display the confirmation popup
function showConfirmationPopup(selectedPhotosCount, selectedPhotos) {

  if (confirm("Are you sure you want to import?")) {
      // O usuário clicou em "Yes"
      importSelectedPhotos(selectedPhotos); // Call the import function
    closePopUp();
    setTimeout(() => {
      alert("The photos were successfully imported");
      window.location.href = `albuns/album.html?album=${ThisImport}`;
    }, 100); // Redirect after 2 seconds
  } else {
      // O usuário clicou em "No"
      closePopUp
      console.log("Não adicionado.");
  }

  
}

// Function to import the selected photos
function importSelectedPhotos(selectedPhotos) {
  // Retrieve full data from localStorage
  const photosData = JSON.parse(localStorage.getItem("albuns_import")) || {};

  // Create an array of selected photos with all the data
  const allSelectedPictures = Array.from(selectedPhotos).map(item => {
    const imgElement = item.querySelector("img");
    const relativeLink = imgElement.src.replace(window.location.origin, ""); // Relative link

    // Find the full data for the photo based on "contains" in the link
    const photoData = Object.values(photosData)
      .flat() // Combine all albums into a single array
      .find(photo => relativeLink.includes(photo.link)); // Check if the link contains the relative part

    if (photoData) {
      return { ...photoData }; // Return the full photo data
    } else {
      console.warn(`Photo data not found for the link: ${relativeLink}`);
      return null; // Ignore photos not found
    }
  }).filter(photo => photo !== null); // Remove null entries

  // Check if the photos already exist in "allPictures" and filter them
  const allPictures = JSON.parse(localStorage.getItem("allPictures")) || [];
  
  // Filter the photos that do not exist in "allPictures" to avoid duplicates
  const uniquePhotos = allSelectedPictures.filter(newPhoto => {
    return !allPictures.some(existingPhoto => existingPhoto.link === newPhoto.link);
  });

  // Add only the unique photos to localStorage
  const updatedPictures = [...allPictures, ...uniquePhotos];
  localStorage.setItem("allPictures", JSON.stringify(updatedPictures));

  // Update or create the chosen album in "albuns"
  const albuns = JSON.parse(localStorage.getItem("albuns")) || {};
  console.log(ThisImport)
  albuns[ThisImport] = albuns[ThisImport] ? [...albuns[ThisImport], ...allSelectedPictures] : allSelectedPictures;
  localStorage.setItem("albuns", JSON.stringify(albuns));

  console.log(`${allSelectedPictures.length} photo(s) imported successfully.`);
}
