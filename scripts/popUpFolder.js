const addFolderBtn = document.getElementById("add-folder");
const popUp = document.getElementById("pop-up");
const albumList = document.getElementById("albumList");
const filterCategories = {
  "Countries": ["Portugal", "Brazil", "Tanzania"],
  "Cities": ["Sintra", "São Paulo", "Rio de Janeiro", "Rio de Janeiro", "Rio de Janeiro", "Geneva", "Fribourg"],
  "Nature & Parks": ["Peneda-Gerês National Park", "Amazon", "Serengeti"],
  "Technology": ["iPhone 13 mini", "iPhone 15"],
  "People": ["Winona Ryder"],
  "Vehicles": ["porsche", "car"],
  "Historical/Medieval": ["medieval", "armor", "crown", "castle"],
  "Clothing": ["Dress", "dress"],
  "Miscellaneous": ["natureza", "Sun"]
};


let starts = window.location.pathname.endsWith("album.html") ?"../" : ""
document.addEventListener("DOMContentLoaded", () => {
  // Function to create the popup
  function showPopUp() {
    // Create popup content
    const popUpContent = `
      <div class="popup-container">
        <h2>Create new Album</h2>
        <input type="text" id="folder-name" placeholder="Enter album name...">
        <button id="create-folder">Next</button>
        <div id="close-popup" class="close-button"><img src="${starts}images/icons/remove.png"></div>
      </div>
    `;

    // Set popup content
    popUp.innerHTML = popUpContent;

    // Display the popup and darken the background
    popUp.style.display = "flex";

    // Close the popup when 'Cancel' is clicked
    document.getElementById("close-popup").addEventListener("click", closePopUp);

    // Handle folder creation and move to filters when 'Next' is clicked
    document.getElementById("create-folder").addEventListener("click", showFiltersPopUp);
  }

  // Function to close the popup
  function closePopUp() {
    popUp.style.display = "none";
  }// Function to show filters in the popup
  

  function showFiltersPopUp() {
    const folderName = document.getElementById("folder-name").value.trim();
    
    // Save the folder name in local storage temporarily for later use
    localStorage.setItem("currentFolderName", folderName);
    if (folderName) {
      // Retrieve current albums from local storage
      const albums = JSON.parse(localStorage.getItem("albuns")) || {};
  
      // Retrieve all pictures
      const allPicturesAlbum = JSON.parse(localStorage.getItem("allPictures"));
      
      if (!Array.isArray(allPicturesAlbum)) {
        alert("No pictures available.");
        return;
      }
  
      // Get all unique filters present in the pictures
      let availableFilters = {
        "Countries": new Set(),
        "Cities": new Set(),
        "Nature & Parks": new Set(),
        "Technology": new Set(),
        "People": new Set(),
        "Vehicles": new Set(),
        "Historical/Medieval": new Set(),
        "Clothing": new Set(),
        "Miscellaneous": new Set()
      };
  
      // Loop through all pictures and gather unique filters for each category
      allPicturesAlbum.forEach(picture => {
        if (Array.isArray(picture.filtro)) {
          picture.filtro.forEach(filtro => {
            // Add the filter to the appropriate category if it exists
            for (const category in availableFilters) {
              if (filterCategories[category].includes(filtro)) {
                availableFilters[category].add(filtro);
              }
            }
          });
        }
      });
  
      // Build the filter popup content dynamically based on available filters
      let filterGroupsContent = '';
      const groupSize = 3; // Define the number of filters per group
  
      // Loop through each category and create a group for each one
      for (const category in availableFilters) {
        const filters = Array.from(availableFilters[category]);
        if (filters.length > 0) {
          filterGroupsContent += `<h3>${category}</h3>`; // Add the category title
          for (let i = 0; i < filters.length; i += groupSize) {
            const filterGroup = filters.slice(i, i + groupSize);
            filterGroupsContent += `
              <div class="filter-group">
                ${filterGroup.map((filter, index) => {
                  const filterId = `filter${category}_${i + index + 1}`;
                  return `<label><input type="checkbox" class="filter-checkbox" data-filter="${filter}"> ${filter}</label>`;
                }).join('')}
              </div>
            `;
          }
        }
      }
  
      // Update popup content with the filter groups
      let srcBackButton = window.location.pathname.endsWith("album.html") ? "../images/back.png" : "images/back.png";
      const popUpContent = `
        <div class="popup-container-Filtros">
          <a id="back-button" class="back-button">
            <img src="${srcBackButton}" alt="Back">
          </a>
          <h2>Apply filters to "${folderName}"</h2>
          ${filterGroupsContent}
          <div>
            <p><strong>Available Photos: </strong><span id="photo-count">0</span></p> <!-- Photo count field -->
          </div>
          <div>
            <label for="photo-limit"><strong>How many photos do you want?</strong></label>
            <input type="number" id="photo-limit" min="1" placeholder="Photo limit">
          </div>
          <br>
          <button id="apply-filters">Create</button>
            <div id="close-popup" class="close-button"><img src="${starts}images/icons/remove.png"></div>
        </div>
      `;
  
      // Update popup content
      popUp.innerHTML = popUpContent;
  
      // Close the popup when 'Cancel' is clicked
      document.getElementById("close-popup").addEventListener("click", closePopUp);
  
      // Handle applying filters when 'Apply' is clicked
      document.getElementById("apply-filters").addEventListener("click", applyFilters);
      document.getElementById("back-button").addEventListener("click", () => {
        showPopUp();
      });
  
      // Update photo count whenever a checkbox is clicked
      const checkboxes = document.querySelectorAll('.filter-checkbox');
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updatePhotoCount);
      });
  
      // Initial photo count update
      updatePhotoCount();
    } else {
      alert("Please provide a name for the album!");
    }
  }
  




// Function to update photo count based on selected filters and photo limit
function updatePhotoCount() {
  const allPicturesAlbum = JSON.parse(localStorage.getItem("allPictures"));
  const selectedFilters = Array.from(document.querySelectorAll('.filter-checkbox:checked')).map(checkbox => checkbox.getAttribute('data-filter'));
  
  let filteredPhotosCount = 0;

  // Filter photos based on selected filters
  allPicturesAlbum.forEach(picture => {
    const pictureFilters = picture.filtro || [];
    if (selectedFilters.every(filter => pictureFilters.includes(filter))) {
      filteredPhotosCount++;
    }
  });

  // Get the photo limit value from the input field
  const photoLimit = parseInt(document.getElementById("photo-limit").value) || filteredPhotosCount;

  // Update the photo count display, considering the limit
  document.getElementById("photo-count").textContent = Math.min(filteredPhotosCount, photoLimit);
}
// Function to apply filters and finalize album creation
function applyFilters() {
  if (confirm("Are you sure you want to create this album?")) {

    const folderName = localStorage.getItem("currentFolderName");

    if (folderName) {
      console.log("a")
      // Retrieve current albums from local storage
      let albums = JSON.parse(localStorage.getItem("albuns")) || {};
  
      // Get the selected filters
      const selectedFilters = Array.from(document.querySelectorAll('.filter-checkbox:checked')).map(checkbox => checkbox.getAttribute('data-filter'));
  
      // Retrieve all pictures
      const allPicturesAlbum = JSON.parse(localStorage.getItem("allPictures"));
  
      // Filter photos according to selected filters
      const filteredPhotos = allPicturesAlbum.filter(picture => {
        const pictureFilters = picture.filtro || [];
        return selectedFilters.every(filter => pictureFilters.includes(filter));
      });
  
      // Count the number of filtered photos
      const filteredPhotosCount = filteredPhotos.length;
  
      // Get the desired photo limit
      const photoLimit = parseInt(document.getElementById("photo-limit").value) || filteredPhotosCount;
  
      // Show a warning message if there are no photos for the selected filters
      if (filteredPhotosCount === 0) {
        alert("There are not enough photos for the specified filters.");
        return;
      }
  
      // Show a warning message if the number of desired photos is greater than the possible number of photos
      if (photoLimit > filteredPhotosCount) {
        alert("The number of photos you want to select is greater than the number you can select.");
        return;
      }
  
      // Select random photos (if there are more photos than the limit)
      const randomPhotos = getRandomItems(filteredPhotos, photoLimit);
  
      // Add the photos to the album
      albums[folderName] = randomPhotos; // Add random photos to the album
  
      // Update local storage with the new album
      localStorage.setItem("albuns", JSON.stringify(albums));
  
      // Update the interface on the album side (optional, if needed)
      genSideAlbum(folderName);
  
      // Close the popup after applying filters
      closePopUp();
      setTimeout(() => {
        alert("The album was successfully created.");
        redirectToPage(folderName);
      }, 100); // Redirect after 2 seconds
    } else {
      alert("An error occurred. Please try again.");
    }

  }

}

// Function to select random items from an array
function getRandomItems(array, count) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}



  // Function to generate album item in the sidebar
  function genSideAlbum(album) {
    var allAlbuns = document.querySelectorAll('.albuns');
    if (document.getElementsByClassName('albuns hidden').length != 0) {
      allAlbuns.forEach(album => {
        album.classList.toggle('hidden');
      });
    }

    const li = document.createElement("li");
    li.className = "albuns";
    li.onclick = function () {
      redirectToPage(album);
    };
    li.textContent = album;
    albumList.appendChild(li);
  }

  // Function to redirect to album page
  function redirectToPage(albumName) {
    const url = window.location.pathname;
    if (url.includes("index.html")) {
      window.location.href = "albuns/album.html?album=" + encodeURIComponent(albumName);
    } else {
      window.location.href = "album.html?album=" + encodeURIComponent(albumName);
    }
  }

  // Add event listener to 'Add Folder' button
  addFolderBtn.addEventListener("click", showPopUp);
});
