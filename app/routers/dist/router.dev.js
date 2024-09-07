"use strict";

var router = require('express').Router();

var _require = require('./adminRouter.js'),
    adminRouter = _require.adminRouter;

var _require2 = require('./authRouter.js'),
    authRouter = _require2.authRouter;

var _require3 = require('./mapRouter.js'),
    mapRouter = _require3.mapRouter;

var _require4 = require('./levelRouter.js'),
    levelRouter = _require4.levelRouter;

var _require5 = require('./roomRouter.js'),
    roomRouter = _require5.roomRouter;

var _require6 = require('./itemRouter.js'),
    itemRouter = _require6.itemRouter;

var _require7 = require('../controllers/homeController.js'),
    homeController = _require7.homeController;

var _require8 = require('../middlewares'),
    catcher = _require8.handlers.catcher;

var _require9 = require('../middlewares/auth.js'),
    auth = _require9.auth;

var _require10 = require('../middlewares/isAdmin.js'),
    isAdmin = _require10.isAdmin;

router.get('/', catcher(homeController.index));
router.use(auth, adminRouter);
router.use(auth, authRouter);
router.use(auth, mapRouter);
router.use(auth, levelRouter);
router.use(auth, roomRouter);
router.use('/items', auth, itemRouter); // * \\d+ est une regex qui va valider le type du paramètre :id, ce sera un nombre entier positif ou le router nous donnera un 404
// router.get('/level/:id(\\d+)', homeController.getOneLevel);

module.exports = router;