const { User } = require('../models');

async function isAdmin(req, res, next) {
    const user = req.session?.user;

    const userInstance = await User.findByPk(user.id, {
        include: { all: true, nested: true },
    });

    let role = null;

    if (userInstance.dataValues.hasOwnProperty('role')) {
        role = userInstance.dataValues.role.name === 'boss';
    }

    if (role) {
        return next();
    }

    const error = new Error('Vous ne passerez pas !');
    error.statusCode = 403;

    return next(error);
}

module.exports = { isAdmin };