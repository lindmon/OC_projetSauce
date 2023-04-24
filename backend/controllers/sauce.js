const Sauce = require('../models/Sauce');
const fs = require('fs');


exports.createSauce = (req, res) => {
    //Recuperer l'info de input de frontend
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        name: sauceObject.name,
        manufacturer: sauceObject.manufacturer,
        description: sauceObject.description,
        mainPepper: sauceObject.mainPepper,
        heat: sauceObject.heat,
        userId:req.auth.userId.toString(),
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    sauce.save()
    .then(()=> res.status(201).json({message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error}));
};

exports.modifySauce = (req,res) => {
    const sauceObject = req.file ? {
        //Récupérer l'image en cas de modification de l'image
        ...JSON.parse(req.body.sauce),
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        }: 
        //Récupérer les champs modifiés 
        {...req.body}
    //Vérifier l'id de l'utilisateur
    delete sauceObject._userId;
    Sauce.findOne({_id:req.params.id})
    .then((sauce) => {
        if(sauce.userId != req.auth.userId){
            res.status(401).json({message:'Non-autorizé'});
        } else {
            Sauce.updateOne({_id:req.params.id}, {...sauceObject, id: req.params.id })
            .then(() => res.status(200).json({message: 'Objet modifié !'}))
            .catch(error => res.status(400).json({error}));

        }
    })
    .catch(error => res.status(400).json({error}));

};

//Suppression d'article de la base de donées mongo
exports.deleteSauce = (req, res) => {
    //Trouver l'object
    Sauce.findOne({_id: req.params.id})
    .then( sauce => {
    //Vérifier l'id de l'utilisateur
        if(sauce.userId != req.auth.userId){
            res.status(401).json({message:'Non-autorizé'});
        } else {
            //Supprimer l'image dans le fichier
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'Objet supprimé !'}))
                    .catch(error => res.status(400).json({error}));
            })

        }
    })
    .catch(error => res.status(400).json({error}));

};

exports.getOneSauce = (req,res) => {
    // Renvoie la sauce avec l'id 
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => res.status(200).json(sauce))
    .catch(error => res.status(400).json({error}));
}

exports.getAllSauces = (req, res) => {
    Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
}

exports.likeDislike = (req, res) => {
    const like = req.body.like;
    const userId = req.body.userId.toString();
    const sauceId = req.params.id;

    //Chercher le sauce
    Sauce.findOne({_id: sauceId})
        .then(sauce => {
            switch(like) {
                //Utilisateur like le sauce
                case 1:
                //Ajouter like de l'utilisateur
                    Sauce.findOneAndUpdate(
                        { _id:sauceId },
                            {   $inc: {likes:+1},
                                $push: {usersLiked: userId}
                            }
                    )
                    .then(() => res.status(200).json({message: 'Like ajouté'}))
                    .catch(error => res.status(400).json({error}));
                break;
                 //Utilisateur dislike le sauce
                 case -1:
                        //Ajouter dislike de l'utilisateur
                        Sauce.findOneAndUpdate(
                            { _id:sauceId },
                                {   $inc: {dislikes:+1},
                                    $push: {usersDisliked: userId}
                                }
                        )
                        .then(() => res.status(200).json({message: 'Dislike ajouté'}))
                        .catch(error => res.status(400).json({error}));
                   
                break;
                //Utilisateur unlike ou undislike la sauce
                case 0:
                    //Unlike le sauce
                    if(sauce.usersLiked.includes(userId)){
                        Sauce.findOneAndUpdate(
                            { _id:sauceId },
                                {   $inc: {likes:-1},
                                    $pull: {usersLiked: userId}
                                }
                        )
                        .then(() => res.status(200).json({message: 'Like supprimé'}))
                        .catch(error => res.status(400).json({error}));
                    }
                    //Undislike le sauce
                    else {
                        Sauce.findOneAndUpdate(
                            { _id:sauceId },
                                {   $inc: {dislikes:-1},
                                    $pull: {usersDisliked: userId}
                                }
                        )
                        .then(() => res.status(200).json({message: 'Dislike supprimé'}))
                        .catch(error => res.status(400).json({error}));
                    }
                
                break;
        
            }
        })
        .catch(error => res.status(400).json({error}));
    
}