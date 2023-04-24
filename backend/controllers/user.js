const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');



//Middleware pour enregistrer utilisateur

exports.signup = (req,res) => {

    // Hashage de password d'utilisateur
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({message: 'Utilisateur créé'}))
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

//Middleware pour loger utilisateur
exports.login = (req,res) => {
    User.findOne({email: req.body.email})
        
        .then(user => {
            if (!user) {
              return  res.status(401).json({message: 'Paire utilisateur/mot de passe incorrecte'});
            } else {
                bcrypt.compare(req.body.password, user.password)

                    .then(valid => {
                        if(!valid) {
                            return res.status(401).json({message: 'Paire utilisateur/mot de passe incorrecte'});
                        } else {
                            return res.status(200).json({
                                userId:user._id,
                                token: jwt.sign(
                                    {userId: user._id},
                                    'RANDOM_TOKEN_SECRET',
                                    {expiresIn: '24h'}
                                )
                                
                            });
                        }
                        
                    })
                    .catch(error => res.status(500).json({message:'probmlems with bcrypt'}))
            }
        })
        .catch(error =>  res.status(500).json({message:error}));
}

// async (req,res) => {
//     const {error} = validate(req.body);
//     if(error) return res.status(400).send(error.details[0].message);
  
//     let user = await User.findOne({email: req.body.email});
//     if (!user) return res.status(400).send('Invalid Email or Password.')
  
//     const validPassword = await bcrypt.compare(req.body.password, user.password);
//     if (!validPassword) return res.status(400).send('Invalid Email or Password.')
  
//     const token = user.generateAuthToken();
//     res.send(token);
//   });