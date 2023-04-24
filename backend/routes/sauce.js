const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();

const sauceCntrl = require ('../controllers/sauce');
//Router pour récupérer toutes les sauces
router.get('/',auth, sauceCntrl.getAllSauces);
//Route pour mettre les sauces
router.post('/', auth, multer, sauceCntrl.createSauce);
//Route pour modifier le sauce
router.put('/:id',auth, multer, sauceCntrl.modifySauce );
//Route pour supprimer le sauce
router.delete('/:id',auth, sauceCntrl.deleteSauce);
//Router pour récupérer le sauce
router.get('/:id',auth, sauceCntrl.getOneSauce);
//Route pour gerer de like
router.post('/:id/like', auth, sauceCntrl.likeDislike);
//Route pour gerer de dislike


module.exports = router;

