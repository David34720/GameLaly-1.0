const tagRouter = require('express').Router();
const { levelController } = require('../controllers/levelController.js');

tagRouter.get('/tags', tagController.index);
// levelRouter.get('/levels/edit/:id(\\d+)', levelController.edit);
// levelRouter.post('/levels/update/:id(\\d+)', levelController.update);
// levelRouter.post('/levels/create', levelController.store);
// levelRouter.post('/levels/delete/:id(\\d+)', levelController.destroy);

module.exports = { tagRouter };
