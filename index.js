require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const initSession = require('./app/middlewares/initSession');
const router = require('./app/routers/router');

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

// Définir le chemin des vues
app.set('views', path.join(__dirname, 'app/views'));

// Servir les fichiers statiques depuis "public/assets"
app.use(express.static(path.join(__dirname, 'assets')));

// Initialiser la session
app.use(initSession);

// Pour analyser les requêtes POST avec des données URL-encodées
app.use(express.urlencoded({ extended: false }));

// Utiliser le routeur principal
app.use(router);

// Démarrer le serveur
app.listen(port, () => {
    console.log(`${process.env.BASE_URL}:${port}`);
});