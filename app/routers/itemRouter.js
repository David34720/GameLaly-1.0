const itemRouter = require('express').Router();
const { itemController } = require('../controllers/itemController.js');
const {
    handlers: {
        catcher
    }
} = require('../middlewares');
const upload = require('../middlewares/multer');

itemRouter.get('/', catcher(itemController.index));
itemRouter.get('/add', catcher(itemController.add));
itemRouter.post('/create', upload.single('img'), catcher(itemController.create));
itemRouter.get('/edit/:id(\\d+)', catcher(itemController.edit));
itemRouter.post('/update/:id(\\d+)', upload.single('img'), catcher(itemController.update));
itemRouter.post('/duplicate/:id(\\d+)', catcher(itemController.duplicate));
itemRouter.post('/delete/:id(\\d+)', catcher(itemController.destroy));


module.exports = { itemRouter };
