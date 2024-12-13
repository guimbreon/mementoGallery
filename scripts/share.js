const shareBtn = document.getElementById("share"); // Change button to "upload-btn"

let ThisShare;
document.addEventListener("DOMContentLoaded", () => {

  // Function to create the popup as shown in the image
  function showImportPhotos() {
    const body = document.body;
    let photos = JSON.parse(localStorage.getItem("allPictures")); // Retrieve albums from localStorage
    if (photos) {
      // Generate the popup content as a complete string
      
      popUp.innerHTML = `
        <div class = "popUpcontainer" id = "popup-container">
            <div id="close-popup" class="close-button"><img src="${starts}images/icons/remove.png"></div>
            <div class="tittle-import">
              <h2>Select the photos you want to share!</h2>
              <p id="select-all">Select all</p> <!-- Add the select all text -->
            </div>
          <div class="photo-gallery">
            ${photos.map(photo =>            
              `              <div class="photo-item">
                <img src="${window.location.pathname.endsWith("album.html") ?photo.link : "albuns/"+ photo.link}" alt="${photo.nome}" />
              </div>
            `).join('')}
          </div>
          <div>
          <button id = "concluir-share">Next</button>
            </div>
            
        <br>
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
      // Function to select/deselect all photos
      document.getElementById("select-all").addEventListener("click", function() {
        const allPhotos = document.querySelectorAll('.photo-item');
        const allSelected = Array.from(allPhotos).every(item => item.classList.contains('selected'));
        
        // If all photos are selected, deselect all, otherwise select all
        allPhotos.forEach(item => {
          item.classList.toggle('selected', !allSelected);
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


    } else {
      alert(`Import functionality with ${ThisShare} not available!`)
      console.error("No photos from Google Drive to display.");
    }
  }


  function showPeoplePopUp() {
    popUp.innerHTML = `
    <div class="popUpcontainer" id="popup-container">
        <div id="close-popup" class="close-button"><img src="${starts}images/icons/remove.png"></div>
        <div class="tittle-import">
          <h2>To who do you want to share with?</h2>
          <p id="select-all">Select all</p>
        </div>
      <div class="profile-grid">
        <div><img class="profile-pic" src="${starts}images/friends/mom.jpg">Mom</div>
        <div><img class="profile-pic" src="${starts}images/friends/dad.jpg">Dad</div>
        <div><img class="profile-pic" src="${starts}images/friends/dani.jpg">Dani</div>
        <div><img class="profile-pic" src="${starts}images/friends/frank.jpg">Frank</div>
      </div>
      <div>
        <button id="return-button">Back</button>
        <button id="concluir-share-friends">Next</button>
        <br>
      </div>
    </div>
  `;

  document.querySelectorAll('.profile-pic').forEach(item => {
    item.addEventListener('click', function () {
        // Toggle selection on the clicked photo
        item.classList.toggle('selected');
    });
  });


  // Function to select/deselect all photos
  document.getElementById("select-all").addEventListener("click", function() {
    const allPhotos = document.querySelectorAll('.profile-pic');
    const allSelected = Array.from(allPhotos).every(item => item.classList.contains('selected'));
    
    // If all photos are selected, deselect all, otherwise select all
    allPhotos.forEach(item => {
      item.classList.toggle('selected', !allSelected);
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
}


  // Function to close the popup
  function closePopUp() {
    popUp.style.display = "none";
    document.body.style.overflow = "";
  }
  // Add event listener to 'Upload' button
  shareBtn.addEventListener("click", showImportPhotos);

  document.addEventListener("click", (event) => {
    if (event.target && event.target.id === "concluir-share-friends") {
      // Selecionar todas as fotos com a classe 'selected' dentro de '.profile-pic'
      const selectedPhotos = document.querySelectorAll(".profile-pic.selected");
      const selectedPhotosCount = selectedPhotos.length;
  
      if (selectedPhotosCount > 0) {
        // Exibir um pop-up de confirmação ou processar as fotos selecionadas
        showFriendsPopUp(selectedPhotosCount, selectedPhotos);
      } else {
        alert("Select at least one friend before continuing.");
      }
    }
  });
  
  // Função para exibir informações do pop-up com base nos itens selecionados
  function showFriendsPopUp(count, photos) {
    let names = Array.from(photos).map(photo => photo.parentElement.textContent.trim());


    if (confirm(`Are you sure you want to share with ${names.join(", ")}`)) {
    closePopUp();
    setTimeout(() => {
      alert("The photos were sent sucessfully!");
    }, 100); // Redirect after 2 seconds
  } else {
      // O usuário clicou em "No"
      closePopUp
      console.log("Não adicionado.");
  }
  }

  document.addEventListener("click", (event) => {
    if (event.target && event.target.id === "concluir-share") {
      // Select all photos marked as selected
      const selectedPhotos = document.querySelectorAll(".photo-item.selected");
      const selectedPhotosCount = selectedPhotos.length;
  
      if (selectedPhotosCount > 0) {
        // Show confirmation popup
        showPeoplePopUp(selectedPhotosCount, selectedPhotos);
      } else {
        alert("Select at least one friends before continuing.");
      }
    }
  });




})
