"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RoomGenerator = void 0;

var _RoomBuilder = require("./RoomBuilder.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

console.log("RoomGenerator.js"); // Classe permettant la génération initiale des pièces (rooms) et de leur disposition sur la carte.
// Et définir les dimensions, les positions de départ, et les caractéristiques statiques des pièces.
// Initialisez RoomGenerator avec les données de la pièce.
// Définition des propriétés: méthodes setDimensions, setStartPosition, setAppearance pour configurer la pièce.
// Génération de la pièce: méthode generateRoom() crée la pièce et la retourne.
// Ajout d'éléments: ajouter des items et des messages aux cellules spécifiques en utilisant addItemToCell et addMessageToCell.
// RoomGenerator permet de générer des pièces dynamiques et de les remplir avec des éléments interactifs.
// Exemple :
// const roomData = {
//     name: 'Room Alpha',
//     description: 'Première pièce du niveau',
//     map_id: 1, // Id de la carte à laquelle appartient la pièce
//     first_room: true,
//     nb_rows: 10,
//     nb_cols: 10,
//     cell_size: 32,
//     start_x: 0,
//     start_y: 0,
//     img_bg: null,
//     color_bg: '#FFFFFF'
// };
// const roomGenerator = new RoomGenerator(roomData);
// roomGenerator.setDimensions(15, 15, 32);
// roomGenerator.setStartPosition(2, 2);
// roomGenerator.setAppearance(null, '#FF0000'); // Définit une couleur de fond rouge
// const room = roomGenerator.generateRoom();
// roomGenerator.addItemToCell(1, 5, 5); // Ajoute un item à la cellule (5,5)
// roomGenerator.addMessageToCell(1, 7, 7); // Ajoute un message à la cellule (7,7)

var RoomGenerator =
/*#__PURE__*/
function () {
  function RoomGenerator(roomData, itemsData) {
    _classCallCheck(this, RoomGenerator);

    this.roomData = roomData; // Données brutes pour générer la pièce

    this.itemsData = itemsData; // Données brutes pour ajouter des items à la carte

    this.room = null; // Instance de RoomBuilder
  } // generateRoom(), this.room est mis à jour pour pointer vers un nouvel objet RoomBuilder qui est responsable de la génération et de la gestion des détails de la pièce. Cet objet est ensuite utilisé pour initier la carte de la pièce (initMap()) et d'autres actions.
  // this.room contient une référence à l'objet RoomBuilder, ce qui signifie que vous pouvez maintenant interagir avec cet objet pour effectuer des actions sur la pièce.


  _createClass(RoomGenerator, [{
    key: "generateRoom",
    value: function generateRoom(gameConfig) {
      if (!this.roomData || !this.itemsData) {
        throw new Error('Les données de la pièce ou les items sont manquants.');
      }

      try {
        this.room = new _RoomBuilder.RoomBuilder(this.roomData, this.itemsData, gameConfig); // Instancier RoomBuilder

        this.room.initMap(); // Initialisation de la carte de la pièce

        console.log("Room generated successfully:", this.room);
        return this.room; // Retourner l'instance de RoomBuilder
      } catch (error) {
        console.error("Erreur lors de la génération de la pièce:", error);
        return null; // Retourner null en cas d'erreur
      }
    } // Définir les dimensions de la pièce

  }, {
    key: "setDimensions",
    value: function setDimensions(nbRows, nbCols, cellSize) {
      this.roomData.nb_rows = nbRows;
      this.roomData.nb_cols = nbCols;
      this.roomData.cell_size = cellSize;
    } // Définir la position de départ

  }, {
    key: "setStartPosition",
    value: function setStartPosition(startX, startY) {
      this.roomData.start_x = startX;
      this.roomData.start_y = startY;
    } // Définir l'apparence statique (image ou couleur de fond)

  }, {
    key: "setAppearance",
    value: function setAppearance() {
      var imgBg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var colorBg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '#FFFFFF';
      this.roomData.img_bg = imgBg;
      this.roomData.color_bg = colorBg;
    } // Ajouter un item dans une cellule spécifique

  }, {
    key: "addItemToCell",
    value: function addItemToCell(itemId, posX, posY) {
      if (!this.room) {
        throw new Error('La pièce n\'a pas encore été générée. Appelez generateRoom() en premier.');
      }

      this.room.addItemToCell(itemId, posX, posY);
    }
  }, {
    key: "addMessageToCell",
    value: function addMessageToCell(messageId, posX, posY) {
      if (!this.room) {
        throw new Error('La pièce n\'a pas encore été générée. Appelez generateRoom() en premier.');
      }

      this.room.addMessageToCell(messageId, posX, posY);
    }
  }]);

  return RoomGenerator;
}();

exports.RoomGenerator = RoomGenerator;