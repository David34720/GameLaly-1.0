const router = require('express').Router();
const { mapRouter } = require('./mapRouter.js');
const {
    handlers: {
        catcher
    }
} = require('../middlewares');
// const router = express.Router();
// const { Router } = require('express');
// const router = Router();

const { homeController } = require('../controllers/homeController.js');

router.get('/', catcher(homeController.index));

router.use(mapRouter);

// * \\d+ est une regex qui va valider le type du paramètre :id, ce sera un nombre entier positif ou le router nous donnera un 404
// router.get('/level/:id(\\d+)', homeController.getOneLevel);

module.exports = router;
