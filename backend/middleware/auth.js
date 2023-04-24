
const jwt = require('jsonwebtoken');

module.exports = (req,res, next) => {
    
    try{
        //Récupere le token de HEaders (premier élement aprés '')
        let token = req.headers.authorization.split(' ')[1];
        //Decoder le token
        let decodedToken = jwt.verify(token,'RANDOM_TOKEN_SECRET');
        //Récupere UserId de Headers
        let userId = decodedToken.userId;
        //Transmettre userId au req
        req.auth = {
            userId: userId.toString()
        }
        next()
    } catch (error) {
         res.status(401).json({error});
    }

};