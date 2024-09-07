"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// Cell.js
var _require = require('sequelize'),
    Model = _require.Model,
    DataTypes = _require.DataTypes,
    literal = _require.literal;

var _require2 = require('../db/sequelize'),
    sequelizeConnection = _require2.sequelizeConnection;

var Cell =
/*#__PURE__*/
function (_Model) {
  _inherits(Cell, _Model);

  function Cell() {
    _classCallCheck(this, Cell);

    return _possibleConstructorReturn(this, _getPrototypeOf(Cell).apply(this, arguments));
  }

  return Cell;
}(Model);

Cell.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Room',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  room_id_link: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Room',
      key: 'id'
    },
    onDelete: 'SET NULL' // Lien vers une autre Room

  },
  pos_x: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pos_y: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  item_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Item',
      key: 'id'
    }
  },
  layer_type: {
    type: DataTypes.TEXT,
    defaultValue: 'element'
  },
  message_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Message',
      key: 'id'
    }
  },
  width: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1 // Nombre de cellules en largeur

  },
  height: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1 // Nombre de cellules en hauteur

  },
  offset_x: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0 // Décalage en X dans la cellule

  },
  offset_y: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0 // Décalage en Y dans la cellule

  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: literal('CURRENT_TIMESTAMP')
  },
  updated_at: DataTypes.DATE
}, {
  sequelize: sequelizeConnection(),
  tableName: 'cell'
});
module.exports = Cell;