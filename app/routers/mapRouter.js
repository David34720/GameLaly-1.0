const mapRouter = require('express').Router();
const { mapController } = require('../controllers/mapController.js');
const {
    handlers: {
        catcher
    }
} = require('../middlewares');
const { auth } = require('../middlewares/auth.js');

mapRouter.get('/map/add', auth, catcher(mapController.add));
mapRouter.post('/map/create', catcher(mapController.create));
mapRouter.get('/map/edit/:id(\\d+)', mapController.edit);
mapRouter.post('/map/update/:id(\\d+)', mapController.update);
mapRouter.post('/map/delete/:id(\\d+)', mapController.destroy);


module.exports = { mapRouter };
