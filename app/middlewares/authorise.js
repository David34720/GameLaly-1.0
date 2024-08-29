const { User } = require('../models');

/**
 *
 * @param {array} actions les permssions recherchées
 */
function authorise(actions) {
    return async (req, res, next) => {
        const { id } = req.session.user;

        const user = await User.findByPk(id, {
            include: { association: 'role', include: 'permissions' },
        });

        for (const action of actions) {
            if (user.can(action)) {
                return next();
            }
        }

        const error = new Error('You shall not pass !');
        error.statusCode = 403;
        next(error);
    };
}

module.exports = { authorise };
