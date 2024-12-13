document.addEventListener("DOMContentLoaded", () => {
  const ul = document.getElementById("albumList");
  const albunsMain = document.querySelector('.album-main'); // Selecionar o item "Albums"
  const arrow = albunsMain.querySelector('.arrow'); // Selecionar a seta de imagem dentro de "Albums"
  const trashIcon = document.getElementById("trashIcon"); // Selecionar o ícone do lixo
  const url = window.location.href;

  let upArrow, downArrow, trashImage;

  // Função para atualizar os ícones com base no tema atual
  function updateIcons() {
    const body = document.body;

    if (body.classList.contains('dark-theme')) {
      if(url.includes("index.html")){
        upArrow = "images/icons/up-white.png";
        downArrow = "images/icons/down-white.png";
        trashImage = "images/icons/white-trash.png";
      } else{        
        upArrow = "../images/icons/up-white.png";
        downArrow = "../images/icons/down-white.png";
        trashImage = "../images/icons/white-trash.png";
      }
    } else if (body.classList.contains('light-theme')) {
      if(url.includes("index.html")){
        upArrow = "images/icons/up-dark.png";
        downArrow = "images/icons/down-dark.png";
        trashImage = "images/icons/black-trash.png";
    } else{        
        upArrow = "../images/icons/up-dark.png";
        downArrow = "../images/icons/down-dark.png";
        trashImage = "../images/icons/black-trash.png";
      }
    } else { // Default theme
      if(url.includes("index.html")){
        upArrow = "images/icons/up-white.png";
        downArrow = "images/icons/down-white.png";
        trashImage = "images/icons/white-trash.png";
      } else{        
        upArrow = "../images/icons/up-white.png";
        downArrow = "../images/icons/down-white.png";
        trashImage = "../images/icons/white-trash.png";
      }
    }

    // Atualiza a seta atual imediatamente
    if (arrow.src.includes('up')) {
      arrow.src = upArrow;
    } else {
      arrow.src = downArrow;
    }

    // Atualizar o ícone do lixo
    trashIcon.src = trashImage;
  }

  // Atualizar as imagens no carregamento
  updateIcons();

  // Função para gerar um álbum na sidebar
  function genSideAlbum(album) {
    const li = document.createElement("li");
    li.className = "albuns hidden";

    li.onclick = function() {
      redirectToPage(album);
    };

    li.textContent = album;
    ul.appendChild(li);
  }

  // Função para redirecionar para a página do álbum
  function redirectToPage(albumName) {
    let pathPrefix;
    let albumRed;
    if (window.location.pathname.includes("index")){
      albumRed = "albuns/album.html?album=";
      pathPrefix = "";
    }else if(window.location.pathname.includes("lixo")){
      albumRed = "albuns/album.html?album=";
      pathPrefix = "../";
    }else if(window.location.pathname.includes("album")){
      albumRed = "album.html?album=";
      pathPrefix = "";
    }
    window.location.href = pathPrefix + albumRed + encodeURIComponent(albumName);
  }

  // Carregar álbuns pré-definidos e do localStorage
  function loadAllAlbums() {
    // Exibir álbuns do localStorage
    const storedAlbums = JSON.parse(localStorage.getItem("albuns")) || {};
    Object.keys(storedAlbums).forEach(album => {
      genSideAlbum(album);
    });
  }

  // Configuração inicial: carregar todos os álbuns
  loadAllAlbums();

  // Alternar exibição de álbuns na sidebar e mudar a direção da seta
  albunsMain.addEventListener('click', () => {
    const albunsList = document.querySelectorAll('.albuns');

    albunsList.forEach(album => {
        album.classList.toggle('hidden');

    });

    // Alterar direção da seta
    if (arrow.src.includes('up')) {
      arrow.src = downArrow;
    } else {
      arrow.src = upArrow;
    }
  });

  // Ouça eventos para mudança de tema
  document.addEventListener('themeChange', updateIcons);

  // Highlight the album based on the URL query
  const params = new URLSearchParams(window.location.search);
  const currentAlbum = params.get('album');

  const albumItems = document.querySelectorAll('.albuns');
  albumItems.forEach(item => {
    if (item.textContent.trim() === currentAlbum) {
      
      item.style.backgroundColor = '#717171'; // Set a light background color
      item.style.borderRadius = '4px'; // Optional: Add a little styling for aesthetics
    }
  });

  // Select the <li> element
  const trashItem = document.querySelector('.lixo');

  // Add an event listener to the <li>
  trashItem.addEventListener('click', () => {
    // Navigate to the href of the <a> tag inside the <li>
    window.location.href = trashItem.querySelector('a').href;
  });

  // Optionally, change the cursor to a pointer to indicate it's clickable
  trashItem.style.cursor = 'pointer';
});
