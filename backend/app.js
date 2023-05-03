const express = require('express');
const helmet = require("helmet");
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
require("dotenv").config();
const sauceRoutes = require('./routes/sauce');
const Sauce = require('./models/Sauce');
const path = require('path');

//Connecter à MongoDb
const pass = process.env.MONGODB_PASSWORD;
const user = process.env.MONGODB_USER
mongoose.connect(`mongodb+srv://${user}:${pass}@cluster0.qyetu4h.mongodb.net/test`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Initialiser express
const app = express();

//Initialiser Helmet pour la sécurité
app.use(helmet({
  //Changer l'option pour permettre de télécharer les images
  crossOriginResourcePolicy:  { policy: "same-site" }
}));

//CORS pour permettre de connecter de n'importe quelle ip
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
//Permer de parser le body de req 
app.use(express.json());

//Liens pour les routes
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
//Utiliser express.static pour accer les fichier sans Routes
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;