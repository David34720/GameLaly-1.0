"use strict";

var _require = require('../models'),
    User = _require.User;

var _require2 = require('../auth/Gate'),
    Gate = _require2.Gate;
/**
 * Ce middleware laisse passer si user possède la permission action
 * @param {string} action la permissions recherchée
 * @returns {(function(*, *, *): Promise<*>)|*}
 */


function authorise(action) {
  return function _callee(req, res, next) {
    var id, user, error;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            id = req.session.user.id;
            _context.next = 3;
            return regeneratorRuntime.awrap(User.findByPk(id, {
              include: {
                association: 'role',
                include: 'permissions'
              }
            }));

          case 3:
            user = _context.sent;

            if (!Gate.allows(action, user)) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", next());

          case 6:
            error = new Error('You shall not pass !');
            error.statusCode = 403;
            return _context.abrupt("return", next(error));

          case 9:
          case "end":
            return _context.stop();
        }
      }
    });
  };
}

module.exports = {
  authorise: authorise
};