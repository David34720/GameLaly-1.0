require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const {
    handlers: {
        notfound,
        fatal
    },      
} = require('./app/middlewares');


const initSession = require('./app/middlewares/initSession');
const { isAuth, initUserSession } = require('./app/middlewares/initUserSession');
const router = require('./app/routers/router');

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

// Définir le chemin des vues
app.set('views', path.join(__dirname, 'app/views'));

// Servir les fichiers statiques depuis "public/assets"
app.use(express.static(path.join(__dirname, 'assets')));

// Pour analyser les requêtes POST avec des données URL-encodées
app.use(express.urlencoded({ extended: false }));


// Initialiser la session et authentification
app.use(initSession);
app.use(initUserSession);
// Middleware pour rendre `originalAdmin` accessible dans toutes les vues
app.use((req, res, next) => {
    res.locals.originalAdmin = req.session.originalAdmin;
    next();
});

// Utiliser le routeur principal
app.use(router);

// // 404 est branché
app.use(notfound);
// // dernier middleware de la chaine : celui qui gère les erreurs
app.use(fatal);

// Démarrer le serveur
app.listen(port, () => {
    console.log(`${process.env.BASE_URL}:${port}`);
});