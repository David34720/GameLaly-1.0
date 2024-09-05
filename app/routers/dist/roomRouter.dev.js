"use strict";

var roomRouter = require('express').Router();

var _require = require('../controllers/roomController.js'),
    roomController = _require.roomController;

var _require2 = require('../middlewares'),
    catcher = _require2.handlers.catcher;

roomRouter.get('/rooms/edit/:id(\\d+)', catcher(roomController.edit));
roomRouter.get('/rooms/add/:map_id(\\d+)', catcher(roomController.add));
roomRouter.post('/rooms/update/:id(\\d+)', catcher(roomController.update));
roomRouter.post('/rooms/duplicate/:id(\\d+)', catcher(roomController.duplicate));
roomRouter.post('/rooms/delete/:id(\\d+)', catcher(roomController.destroy)); // Route pour sauvegarder les cellules

roomRouter.post('/rooms/save-cells', catcher(roomController.saveCells));
roomRouter.post('/room/update-cell', function (req, res) {
  console.log("Update cell request received", req.body); // Ensuite appelle le contrôleur

  roomController.updateCell(req, res);
});
roomRouter["delete"]('/rooms/delete-cells', catcher(roomController.deleteCells)); // Route pour mettre à jour l'image du joueur

roomRouter.post('/room/update-cell-message', catcher(roomController.updateCellMessage));
roomRouter.get('/room/get-messages-for-room/:room_id(\\d+)', catcher(roomController.getMessagesForRoom));
roomRouter.get('/room/get-message-for-cell/:id(\\d+)', catcher(roomController.updateCellMessage));
roomRouter.post('/update-user-img', roomController.updateUserImg);
roomRouter.get('/characters', roomController.getCharacterSelection);
module.exports = {
  roomRouter: roomRouter
};