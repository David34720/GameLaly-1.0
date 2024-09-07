"use strict";

var mapRouter = require('express').Router();

var _require = require('../controllers/mapController.js'),
    mapController = _require.mapController;

var _require2 = require('../middlewares'),
    catcher = _require2.handlers.catcher;

var _require3 = require('../middlewares/auth.js'),
    auth = _require3.auth;

mapRouter.get('/map/add', auth, catcher(mapController.add));
mapRouter.post('/map/create', catcher(mapController.create));
mapRouter.get('/map/edit/:id(\\d+)', mapController.edit);
mapRouter.post('/map/update/:id(\\d+)', mapController.update);
mapRouter.post('/map/delete/:id(\\d+)', mapController.destroy);
module.exports = {
  mapRouter: mapRouter
};