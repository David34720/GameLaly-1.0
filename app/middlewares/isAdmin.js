const { User } = require('../models');

async function isAdmin(req, res, next) {
    const user = req.session?.user;

    if (!user) {
        return res.redirect('/login'); // Redirige vers la page de connexion si l'utilisateur n'est pas défini
    }

    const userInstance = await User.findByPk(user.id, {
        include: { all: true, nested: true },
    });

    if (!userInstance) {
        const error = new Error('Utilisateur non trouvé');
        error.statusCode = 404;
        return next(error);
    }

    let role = null;

    if (Object.prototype.hasOwnProperty.call(userInstance.dataValues, 'role')) {
        role = userInstance.dataValues.role.name === 'admin';
    }

    if (role) {
        return next();
    }

    const error = new Error('Vous ne passerez pas !');
    error.statusCode = 403;

    return next(error);
}

module.exports = { isAdmin };