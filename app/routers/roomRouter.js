const roomRouter = require('express').Router();
const { roomController } = require('../controllers/roomController.js');
const {
    handlers: {
        catcher
    }
} = require('../middlewares');



roomRouter.get('/rooms/edit/:id(\\d+)', catcher(roomController.edit));
roomRouter.get('/rooms/add/:map_id(\\d+)', catcher(roomController.add));
roomRouter.post('/rooms/update/:id(\\d+)', catcher(roomController.update));
roomRouter.post('/rooms/duplicate/:id(\\d+)', catcher(roomController.duplicate));
roomRouter.post('/rooms/delete/:id(\\d+)', catcher(roomController.destroy));

// Route pour sauvegarder les cellules
roomRouter.post('/rooms/save-cells', catcher(roomController.saveCells));
roomRouter.post('/room/update-cell', (req, res) => {
    console.log("Update cell request received", req.body);
    // Ensuite appelle le contrôleur
    roomController.updateCell(req, res);
});
roomRouter.delete('/rooms/delete-cells', catcher(roomController.deleteCells));

// Route pour mettre à jour l'image du joueur
roomRouter.post('/update-user-img', roomController.updateUserImg);
roomRouter.get('/characters', roomController.getCharacterSelection);

module.exports = { roomRouter };
