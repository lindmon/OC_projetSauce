const multer = require('multer');
//Creeer le dictionnaire pour les types MIME
const MIME_TYPES = {
    'image/jpg':'jpg',
    'image/jpeg':'jpg',
    'image/png':'jpg',
}

const storage = multer.diskStorage({
    //Indiquer l'endroite pour sauvgarder les fichiers
    destination:(req, file, callback) => {
        callback(null, 'images');
    },
    //Creer le nom unique pour les fichiers
    filename:(req, file, callback) => {
        //Éliminer les espaces blanches dans le nom de fichier original
        const name = file.originalname.split(' ').join('_');
        //Definir l'extension de fichier
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});
//Exporter que le seule fichier
module.exports = multer({storage}).single('image');