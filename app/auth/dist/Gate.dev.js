"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Gate =
/*#__PURE__*/
function () {
  function Gate() {
    _classCallCheck(this, Gate);
  }

  _createClass(Gate, null, [{
    key: "allows",

    /**
     * Cette méthode retourne true si user possède une permission action, sinon false
     * @param {string} action
     * @param {object} user
     * @returns {boolean}
     */
    value: function allows(action, user) {
      var ok = false;
      var permissions = user.permissions;

      for (var i = 0; i < permissions.length; i++) {
        if (permissions[i].name === action) {
          ok = true;
          break;
        }
      }

      return ok;
    }
  }]);

  return Gate;
}();

module.exports = {
  Gate: Gate
};