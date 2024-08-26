const roomRouter = require('express').Router();
const { roomController } = require('../controllers/roomController.js');
const {
    handlers: {
        catcher
    }
} = require('../middlewares');



roomRouter.get('/rooms/:id(\\d+)', catcher(roomController.edit));



module.exports = { roomRouter };
