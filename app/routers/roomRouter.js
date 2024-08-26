const roomRouter = require('express').Router();
const { roomController } = require('../controllers/roomController.js');
const {
    handlers: {
        catcher
    }
} = require('../middlewares');



roomRouter.get('/rooms/edit/:id(\\d+)', catcher(roomController.edit));
roomRouter.get('/rooms/add/:map_id(\\d+)', catcher(roomController.add));
roomRouter.post('/rooms/delete/:id(\\d+)', catcher(roomController.destroy));


module.exports = { roomRouter };