// Function to clean up allPictures
const cleanAllPictures = () => {
    // Load data from localStorage
    const albumLixo = JSON.parse(localStorage.getItem('albuns'));
    const allPicturesLixo = JSON.parse(localStorage.getItem('allPictures'));

    // Check if both albuns and allPictures exist
    if (!albumLixo || !allPicturesLixo) {
        console.log('Albuns or allPictures not found in localStorage.');
        return;
    }

    // Helper function to get all picture names in albuns
    const getAlbumPictureNames = (albumLixo) => {
        const pictureNames = [];
        for (const album in albumLixo) {
            if (albumLixo.hasOwnProperty(album)) {
                albumLixo[album].forEach(picture => {
                    pictureNames.push(picture.nome);
                });
            }
        }
        return pictureNames;
    };

    // Get all picture names in albuns
    const albumPictureNames = getAlbumPictureNames(albumLixo);

    // Filter allPictures to remove any pictures not in albuns
    const filteredPictures = allPicturesLixo.filter(picture => albumPictureNames.includes(picture.nome));

    // Update localStorage with the filtered allPictures if changes are needed
    if (JSON.stringify(allPicturesLixo) !== JSON.stringify(filteredPictures)) {
        localStorage.setItem('allPictures', JSON.stringify(filteredPictures));
        console.log('Updated allPictures:', filteredPictures);
    }
};

// Run cleanAllPictures periodically every 10 seconds (adjust interval as needed)
setInterval(cleanAllPictures, 1);
