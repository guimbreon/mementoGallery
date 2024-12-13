document.addEventListener('DOMContentLoaded', () => {
  // Add event listener to album list items
  const albumListItems = document.querySelectorAll('.menu li.albuns');
  const url = window.location.pathname;
  
  albumListItems.forEach(item => {
      item.addEventListener('click', () => {
          // Get the album name
          const albumName = item.textContent.trim();
          
          // Retrieve the existing lastClicked array from localStorage, or initialize it as an empty array
          let lastClicked = JSON.parse(localStorage.getItem('lastClicked')) || [];

          // Add the new album to the array (if it's not already present)
          if (!lastClicked.includes(albumName)) {
              lastClicked.push(albumName);
              
              // Ensure only the last 3 albums are stored
              if (lastClicked.length > 3) {
                  lastClicked.shift(); // Remove the oldest album if there are more than 3
              }

              // Save the updated list back to localStorage
              localStorage.setItem('lastClicked', JSON.stringify(lastClicked));
          }

          // Update the album list dynamically
          updateAlbumList(lastClicked);
      });
  });

  function redirectToPage(albumName) {
    if(url.includes("index.html")){
      window.location.href = "albuns/album.html?album=" + encodeURIComponent(albumName);
    } else {
      window.location.href = "album.html?album=" + encodeURIComponent(albumName); 
    }
  }

  // Function to update the album list in the UI based on localStorage
  function updateAlbumList(albums) {
      const albumListContainer = document.querySelector('.album-list');
      albumListContainer.innerHTML = ''; // Clear the current list

      // Iterate over the albums and create new album elements
      albums.forEach(album => {
          const albumElement = document.createElement('div');
          albumElement.classList.add('album');

          const theme = document.body.classList.contains('dark-theme') ? 'dark-theme' : 'light-theme';
          const albumIcon = document.createElement('img');

          if (theme === 'dark-theme') {
            albumIcon.src = 'images/icons/white-folder.png';
        } else {
            albumIcon.src = 'images/icons/folder.png';
        }
  
    
          const albumListContainer = document.querySelector('.album-list');
          albumElement.appendChild(albumIcon);
          albumListContainer.appendChild(albumElement);
          albumIcon.alt = 'Album Icon';

          const albumName = document.createElement('p');
          albumName.textContent = album;

          albumElement.onclick = function() {
            redirectToPage(album);
          };


          // Append the elements
          albumElement.appendChild(albumIcon);
          albumElement.appendChild(albumName);
          albumListContainer.appendChild(albumElement);
      });
  }

  // On page load, check if there are any albums saved in localStorage and update the list
  const savedAlbums = JSON.parse(localStorage.getItem('lastClicked')) || [];
  if (savedAlbums.length > 0) {
      updateAlbumList(savedAlbums);
  }
});
