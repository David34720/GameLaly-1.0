"use strict";

require('dotenv').config();

var path = require('path');

var express = require('express');

var http = require('http'); // Importation du module HTTP


var app = express();
var server = http.createServer(app); // Créez un serveur HTTP avec Express

var _require = require('./app/middlewares'),
    _require$handlers = _require.handlers,
    notfound = _require$handlers.notfound,
    fatal = _require$handlers.fatal;

var initSession = require('./app/middlewares/initSession');

var _require2 = require('./app/middlewares/initUserSession'),
    initUserSession = _require2.initUserSession;

var router = require('./app/routers/router');

var port = process.env.PORT || 3000;
app.set('view engine', 'ejs'); // Définir le chemin des vues

app.set('views', path.join(__dirname, 'app/views')); // Servir les fichiers statiques depuis "public/assets"

app.use(express["static"](path.join(__dirname, 'assets'))); // Middleware pour parser le JSON

app.use(express.json({
  limit: '2mb'
})); // Pour analyser les requêtes POST avec des données URL-encodées

app.use(express.urlencoded({
  extended: false
})); // Initialiser la session et authentification

app.use(initSession);
app.use(initUserSession); // Middleware pour rendre `originalAdmin` accessible dans toutes les vues

app.use(function (req, res, next) {
  res.locals.originalAdmin = req.session.originalAdmin;
  next();
}); // Utiliser le routeur principal

app.use(router); // 404 est branché

app.use(notfound); // Dernier middleware de la chaine : celui qui gère les erreurs

app.use(fatal); // Démarrer le serveur HTTP et WebSocket

server.listen(port, function () {
  console.log("".concat(process.env.BASE_URL, ":").concat(port));
}); // Importer et démarrer le serveur WebSocket

require('./app/server/websocket-server')(server);