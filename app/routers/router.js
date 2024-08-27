const router = require('express').Router();
const { mapRouter } = require('./mapRouter.js');
const { levelRouter } = require('./levelRouter.js');
const { roomRouter } = require('./roomRouter.js');
const { itemRouter } = require('./itemRouter.js');

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
router.use(levelRouter);
router.use(roomRouter)
router.use('/items',itemRouter)

// * \\d+ est une regex qui va valider le type du paramètre :id, ce sera un nombre entier positif ou le router nous donnera un 404
// router.get('/level/:id(\\d+)', homeController.getOneLevel);

module.exports = router;
