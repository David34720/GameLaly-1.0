const authRouter = require('express').Router();
const { registerController } = require('../controllers/registerController.js');
const { sessionController } = require('../controllers/sessionController.js');

const { isAuth } = require('../middlewares');
const {
    handlers: {
        catcher
    }
} = require('../middlewares');

// afficher le form création de compte
authRouter.get('/register', registerController.index);
authRouter.post('/register', catcher(registerController.store));
// afficher le form connexion à son compte
authRouter.get('/login', sessionController.index);
authRouter.post('/login', catcher(sessionController.store));
//
authRouter.get('/logout', catcher(sessionController.destroy));

module.exports = { authRouter };
