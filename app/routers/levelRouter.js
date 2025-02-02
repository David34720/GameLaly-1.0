const levelRouter = require('express').Router();
const { levelController } = require('../controllers/levelController.js');

levelRouter.get('/levels', levelController.index);
levelRouter.post('/levels/create', levelController.create);
levelRouter.get('/levels/edit/:id(\\d+)', levelController.edit);
levelRouter.post('/levels/update/:id(\\d+)', levelController.update);
levelRouter.post('/levels/delete/:id(\\d+)', levelController.destroy);

module.exports = { levelRouter };
