"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// * On importe les modules nécessaires à la création de models
var _require = require('sequelize'),
    Model = _require.Model,
    DataTypes = _require.DataTypes,
    literal = _require.literal; // * notre connexion à la BDD


var _require2 = require('../db/sequelize'),
    sequelizeConnection = _require2.sequelizeConnection;

var Item =
/*#__PURE__*/
function (_Model) {
  _inherits(Item, _Model);

  function Item() {
    _classCallCheck(this, Item);

    return _possibleConstructorReturn(this, _getPrototypeOf(Item).apply(this, arguments));
  }

  return Item;
}(Model);

Item.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  img: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  item_type: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  effect: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  life: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  context: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_obstacle: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_object: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    // * On doit utiliser literal pour dire à la BDD que l'on souhaite un timestamp et non pas la string 'CURRENT_TIMESTAMP'
    defaultValue: literal('CURRENT_TIMESTAMP')
  },
  updated_at: DataTypes.DATE
}, {
  // * cette option est la pour connecter le modèle à la BDD
  sequelize: sequelizeConnection(),
  // * Cette option est facultative, si on ne la met pas, sequelize va analyser le nom de la classe et s'en servir pour se connecter à la BDD en le mettant en minusucules et au pluriel.
  tableName: 'item'
});
module.exports = Item;