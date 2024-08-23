const mapRouter = require('express').Router();
const { mapController } = require('../controllers/mapController.js');
const {
    handlers: {
        catcher
    }
} = require('../middlewares');

mapRouter.get('/map/add', catcher(mapController.add));
mapRouter.post('/map/create', catcher(mapController.create));
// levelRouter.get('/levels/edit/:id(\\d+)', levelController.edit);
// levelRouter.post('/levels/update/:id(\\d+)', levelController.update);
// levelRouter.post('/levels/create', levelController.store);
// levelRouter.post('/levels/delete/:id(\\d+)', levelController.destroy);

module.exports = { mapRouter };
