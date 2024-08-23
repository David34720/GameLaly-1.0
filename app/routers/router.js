const router = require('express').Router();
const { levelRouter } = require('./levelRouter.js');
// const router = express.Router();
// const { Router } = require('express');
// const router = Router();

const { homeController } = require('../controllers/homeController.js');

router.get('/', homeController.index);

router.use(levelRouter);

// * \\d+ est une regex qui va valider le type du paramètre :id, ce sera un nombre entier positif ou le router nous donnera un 404
// router.get('/level/:id(\\d+)', homeController.getOneLevel);

module.exports = router;
