"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RoomBuilder = void 0;

var _GameEngine = require("./GameEngine.js");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Classe RoomBuilder pour générer et gérer l'affichage d'une pièce avec des cellules interactives.
var RoomBuilder =
/*#__PURE__*/
function () {
  // Constructeur pour initialiser l'instance de RoomBuilder avec les données de la pièce (roomData) et la liste des items (items).
  function RoomBuilder(roomData, items, gameConfig) {
    _classCallCheck(this, RoomBuilder);

    if (!roomData) {
      throw new Error('roomData is required');
    }

    if (!items) {
      throw new Error('items are required');
    }

    this.roomData = roomData; // Données sur la pièce, incluant le nombre de lignes, colonnes, etc.

    this.items = items; // Liste des items disponibles pour être placés dans les cellules

    this.cells = []; // Tableau pour stocker les cellules de la pièce

    this.selectedItem = null; // Item actuellement sélectionné pour insertion dans une cellule

    this.mode = 'play'; // Mode courant : 'select', 'insert', ou 'delete'

    this.layer = 'element'; // Layer courant : 'objet', 'character', ou 'element'

    this.selectedCells = new Set(); // Ensemble des cellules sélectionnées

    this.isMouseDown = false; // Indicateur pour savoir si la souris est enfoncée

    this.isSaving = false; // Indicateur pour empêcher les sauvegardes répétées

    this.previousMode = null; // stocker le mode précédent pour toggle touch shift et revenir en arrière au keyup

    this.playerPosition = {
      x: 0,
      y: 0
    }; // Position du joueur (x, y) en pixels
    // Initialisation du GameEngine

    this.gameEngine = new _GameEngine.GameEngine(gameConfig);
    this.messagesForRoom = [];
    console.log("RoomBuilder initialized with:", roomData, items);
  } // initialise la postion du joueur au démarrage


  _createClass(RoomBuilder, [{
    key: "initPlayerPosition",
    value: function initPlayerPosition() {
      var playerPostiionStart_X = this.roomData.start_x;
      var playerPostiionStart_Y = this.roomData.start_y;
      this.playerPosition = {
        x: playerPostiionStart_X,
        y: playerPostiionStart_Y
      };
    } // Initialise la carte en créant les cellules à partir des données de la pièce, en les affichant dans le conteneur HTML, 
    // et en configurant les événements nécessaires pour les interactions utilisateur.

  }, {
    key: "initMap",
    value: function initMap() {
      var _this = this;

      this.createCells(); // Crée les cellules de la pièce en fonction des données fournies (roomData).

      this.renderMap(); // Affiche les cellules sur la carte (dans le conteneur HTML).

      this.renderItemList(); // Affiche la liste des items disponibles pour l'utilisateur.

      this.setupEventListeners(); // Configure les événements utilisateur (clics, modes d'interaction, etc.).

      this.changeMode('play'); // Met à jour l'affichage de l'interface utilisateur selon le mode actif.

      this.initPlayerPosition(); // Initialise la position du joueur

      this.getMessagesForRoom(); // initialise la liste des messages pour la room

      var mapContainer = document.getElementById("map-container");
      mapContainer.addEventListener('mouseleave', function () {
        return _this.onMouseUp();
      });
      this.centerCell(mapContainer, this.playerPosition.x, this.playerPosition.y); // Centrer la cellule à la position du joueur
    } // Centre la cellule spécifiée dans le conteneur de la carte

  }, {
    key: "centerCell",
    value: function centerCell(container, cellX, cellY) {
      var cell_size = this.roomData.cell_size;
      var containerWidth = container.clientWidth; // spécifie width de l'élément HTML, élément du DOM

      var containerHeight = container.clientHeight;
      var cellCenterX = cellX * cell_size + cell_size / 2;
      var cellCenterY = cellY * cell_size + cell_size / 2;
      var scrollLeft = cellCenterX - containerWidth / 2;
      var scrollTop = cellCenterY - containerHeight / 2;
      container.scrollLeft = scrollLeft;
      container.scrollTop = scrollTop;
    }
  }, {
    key: "getMessagesForRoom",
    value: function getMessagesForRoom() {
      var response, messages;
      return regeneratorRuntime.async(function getMessagesForRoom$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return regeneratorRuntime.awrap(fetch("/room/get-messages-for-room/".concat(this.roomData.id), {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json'
                }
              }));

            case 3:
              response = _context.sent;

              if (response.ok) {
                _context.next = 6;
                break;
              }

              throw new Error('Erreur lors de la récupération des messages');

            case 6:
              _context.next = 8;
              return regeneratorRuntime.awrap(response.json());

            case 8:
              messages = _context.sent;
              this.messagesForRoom = messages;
              _context.next = 15;
              break;

            case 12:
              _context.prev = 12;
              _context.t0 = _context["catch"](0);
              console.error('Erreur lors de la récupération des messages de la salle :', _context.t0);

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, null, this, [[0, 12]]);
    }
  }, {
    key: "getMessageForCell",
    value: function getMessageForCell(cell_id) {
      var response, message;
      return regeneratorRuntime.async(function getMessageForCell$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (cell_id) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt("return", {
                text: ''
              });

            case 2:
              _context2.prev = 2;
              _context2.next = 5;
              return regeneratorRuntime.awrap(fetch("/room/get-message-for-cell/".concat(cell_id), {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json'
                }
              }));

            case 5:
              response = _context2.sent;

              if (response.ok) {
                _context2.next = 8;
                break;
              }

              throw new Error('Erreur lors de la récupération des messages');

            case 8:
              _context2.next = 10;
              return regeneratorRuntime.awrap(response.json());

            case 10:
              message = _context2.sent;
              return _context2.abrupt("return", message);

            case 14:
              _context2.prev = 14;
              _context2.t0 = _context2["catch"](2);
              console.error('Erreur lors de la récupération des messages de la cellule :', _context2.t0);
              return _context2.abrupt("return", {
                text: ''
              });

            case 18:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[2, 14]]);
    } // Crée les cellules de la carte en fonction des données de la pièce (roomData) fournies lors de l'instanciation.
    // Les cellules sont initialisées avec leur position, leur taille, et les éventuels items ou messages.

  }, {
    key: "createCells",
    value: function createCells() {
      var _this2 = this;

      var _this$roomData = this.roomData,
          nb_rows = _this$roomData.nb_rows,
          nb_cols = _this$roomData.nb_cols,
          cell_size = _this$roomData.cell_size; // Créer 3 layers pour les différents types d'items

      this.layerCharacters = [];
      this.layerObjects = [];
      this.layerElements = [];

      var _loop = function _loop(y) {
        var _loop2 = function _loop2(x) {
          var baseCell = {
            x: x * cell_size,
            y: y * cell_size,
            size: cell_size,
            height: 1,
            width: 1,
            offset_x: 0,
            offset_y: 0,
            posX: x,
            posY: y,
            exists: false,
            item: null,
            message: null,
            layer_type: 'default',
            isObstacle: false // Par défaut, pas d'obstacle

          };

          var cellsFinded = _this2.roomData.cells.filter(function (c) {
            return c.pos_x === x && c.pos_y === y;
          });

          if (cellsFinded.length > 0) {
            cellsFinded.forEach(function (c) {
              var cell = _objectSpread({}, baseCell);

              cell.exists = true;
              cell.item = c.item_id;
              cell.message = c.message_id;
              cell.id = c.id;

              var item = _this2.items.find(function (i) {
                return i.id === cell.item;
              });

              if (item) {
                if (item.item_type === 9) {
                  // Personnage
                  cell.layer_type = 'personnage';

                  _this2.replaceCellIfExists(_this2.layerCharacters, cell); // Remplacer si déjà vide


                  _this2.addCellIfNotExists(_this2.layerElements, _objectSpread({}, baseCell, {
                    layer_type: 'element'
                  }));

                  _this2.addCellIfNotExists(_this2.layerObjects, _objectSpread({}, baseCell, {
                    layer_type: 'object'
                  }));
                } else if (item.is_object) {
                  // Objet
                  cell.layer_type = 'object';
                  cell.height = c.height;
                  cell.width = c.width;
                  cell.offset_x = c.offset_x;
                  cell.offset_y = c.offset_y;

                  _this2.replaceCellIfExists(_this2.layerObjects, cell); // Remplacer si déjà vide


                  _this2.addCellIfNotExists(_this2.layerElements, _objectSpread({}, baseCell, {
                    layer_type: 'element'
                  }));

                  _this2.addCellIfNotExists(_this2.layerCharacters, _objectSpread({}, baseCell, {
                    layer_type: 'personnage'
                  })); // Si l'objet est un obstacle, marquer la cellule comme obstacle


                  if (item.is_obstacle) {
                    cell.isObstacle = true;
                    console.log('Cellule ' + cell.posX + ', ' + cell.posY + ' est un obstacle');
                  } // Marquer les cellules couvertes par l'objet


                  _this2.markCoveredCells(cell);
                } else {
                  // Élément
                  cell.layer_type = 'element';

                  _this2.replaceCellIfExists(_this2.layerElements, cell); // Remplacer si déjà vide


                  _this2.addCellIfNotExists(_this2.layerObjects, _objectSpread({}, baseCell, {
                    layer_type: 'object'
                  }));

                  _this2.addCellIfNotExists(_this2.layerCharacters, _objectSpread({}, baseCell, {
                    layer_type: 'personnage'
                  }));
                }
              } // Ajouter la cellule à la liste générale des cellules


              _this2.cells.push(cell);
            });
          } else {
            // Crée une cellule vide pour chaque layer si elle n'existe pas encore
            var emptyCellElement = _objectSpread({}, baseCell, {
              layer_type: 'element'
            });

            var emptyCellObject = _objectSpread({}, baseCell, {
              layer_type: 'object'
            });

            var emptyCellCharacter = _objectSpread({}, baseCell, {
              layer_type: 'personnage'
            }); // Ajouter la cellule vide dans chaque layer


            _this2.addCellIfNotExists(_this2.layerElements, emptyCellElement);

            _this2.addCellIfNotExists(_this2.layerObjects, emptyCellObject);

            _this2.addCellIfNotExists(_this2.layerCharacters, emptyCellCharacter); // Ajouter la cellule vide à la liste générale des cellules


            _this2.cells.push(emptyCellElement);
          }
        };

        for (var x = 0; x < nb_cols; x++) {
          _loop2(x);
        }
      };

      for (var y = 0; y < nb_rows; y++) {
        _loop(y);
      }

      this.markAllCoveredCells();
    } // Fonction utilitaire pour ajouter une cellule seulement si elle n'existe pas déjà dans le layer

  }, {
    key: "addCellIfNotExists",
    value: function addCellIfNotExists(layer, newCell) {
      var exists = layer.some(function (c) {
        return c.posX === newCell.posX && c.posY === newCell.posY;
      });

      if (!exists) {
        layer.push(newCell);
      }
    } // Fonction utilitaire pour remplacer une cellule vide existante si elle existe

  }, {
    key: "replaceCellIfExists",
    value: function replaceCellIfExists(layer, newCell) {
      var index = layer.findIndex(function (c) {
        return c.posX === newCell.posX && c.posY === newCell.posY;
      });

      if (index !== -1 && !layer[index].exists) {
        layer[index] = newCell; // Remplacer la cellule vide par celle avec l'item
      } else if (index === -1) {
        layer.push(newCell); // Si elle n'existe pas, on l'ajoute
      }
    }
  }, {
    key: "markAllCoveredCells",
    value: function markAllCoveredCells() {
      var _this3 = this;

      // On parcourt uniquement les cellules contenant des objets qui sont des obstacles
      this.layerObjects.forEach(function (cell) {
        if (cell.isObstacle) {
          _this3.markCoveredCells(cell); // Marque les cellules couvertes par cet objet

        }
      });
    }
  }, {
    key: "markCoveredCells",
    value: function markCoveredCells(cell) {
      var _this4 = this;

      var startX = cell.posX;
      var startY = cell.posY;
      var endX = startX + (cell.width || 1);
      var endY = startY + (cell.height || 1);

      var _loop3 = function _loop3(y) {
        var _loop4 = function _loop4(x) {
          // Marquer chaque cellule couverte comme un obstacle
          var coveredCell = _this4.layerObjects.find(function (c) {
            return c.posX === x && c.posY === y;
          });

          if (coveredCell) {
            coveredCell.isObstacle = true; // Marquer la cellule comme couverte par un obstacle

            console.log('Cellule couverte:', coveredCell);
          }
        };

        for (var x = startX; x < endX; x++) {
          _loop4(x);
        }
      };

      for (var y = startY; y < endY; y++) {
        _loop3(y);
      }
    } // Affiche la carte en créant les éléments HTML pour chaque cellule et en les positionnant dans le conteneur principal.
    // Les cellules existantes sont affichées avec une couleur spécifique et peuvent contenir un item.

  }, {
    key: "renderMap",
    value: function renderMap() {
      var mapContainer = document.getElementById("map-container");
      mapContainer.innerHTML = ""; // Vide le conteneur pour le réinitialiser.

      var mapContainerCharacters = document.createElement("div");
      mapContainerCharacters.id = "map-container-characters";
      mapContainerCharacters.className = "map-layer";
      mapContainer.appendChild(mapContainerCharacters);
      var mapContainerObjects = document.createElement("div");
      mapContainerObjects.id = "map-container-objects";
      mapContainerObjects.className = "map-layer";
      mapContainer.appendChild(mapContainerObjects);
      var mapContainerElements = document.createElement("div");
      mapContainerElements.id = "map-container-elements";
      mapContainerElements.className = "map-layer";
      mapContainer.appendChild(mapContainerElements); // Display la carte des personnages

      this.renderLayerMap(this.layerCharacters, mapContainerCharacters, "#FFDD57"); // Personnages
      // Display la carte des objets

      this.renderLayerMap(this.layerObjects, mapContainerObjects, "#8FBC8F"); // Objets
      // Display la carte des éléments

      this.renderLayerMap(this.layerElements, mapContainerElements, "#ADD8E6"); // Autres
    } // Fonction utilisée pour afficher un layer particulier
    // Fonction pour afficher un layer particulier (éléments, objets, personnages)

  }, {
    key: "renderLayerMap",
    value: function renderLayerMap(layer, container, color) {
      var _this5 = this;

      var cell_size = this.roomData.cell_size; // On efface d'abord tout ce qui existe dans le container

      container.innerHTML = '';
      layer.forEach(function (cell) {
        var cellElement = document.createElement("div");
        cellElement.className = "cell";
        cellElement.style.width = "".concat(cell_size, "px");
        cellElement.style.height = "".concat(cell_size, "px"); // Utilisation de position absolute pour positionner les cellules

        cellElement.style.position = "absolute";
        cellElement.style.left = "".concat(cell.posX * cell_size, "px");
        cellElement.style.top = "".concat(cell.posY * cell_size, "px");
        cellElement.style.overflow = "visible"; // Permet à l'image de dépasser la cellule
        // Afficher l'item si la cellule contient un item

        if (cell.exists && cell.item) {
          _this5.renderItemInCell(cellElement, cell); // Passer `cell` comme argument ici

        }

        container.appendChild(cellElement); // Ajout des événements d'interaction pour chaque cellule

        cellElement.addEventListener('mousedown', function () {
          return _this5.onMouseDown(cell, cellElement);
        });
        cellElement.addEventListener('mouseover', function () {
          return _this5.onMouseOver(cell, cellElement);
        });
      });
      this.updateLayerInteractivity();
    } // Gère le clic initial sur une cellule, en fonction du mode courant (sélection, insertion, suppression).

  }, {
    key: "onMouseDown",
    value: function onMouseDown(cell, cellElement) {
      this.isMouseDown = true; // Marque le début d'une interaction par clic.

      this.handleCellInteraction(cell, cellElement); // Gère l'interaction avec la cellule.

      cellElement.classList.add('hovered'); // Ajoute une classe CSS pour indiquer que la cellule est survolée.
    } // Gère le survol des cellules pendant que la souris est enfoncée

  }, {
    key: "onMouseOver",
    value: function onMouseOver(cell, cellElement) {
      if (!this.isMouseDown) return; // Ne rien faire si la souris n'est pas enfoncée.

      this.handleCellInteraction(cell, cellElement); // Gère l'interaction avec la cellule en fonction du mode.

      cellElement.classList.add('hovered');
    } // Gère la fin du clic

  }, {
    key: "onMouseUp",
    value: function onMouseUp() {
      if (this.isMouseDown) {
        this.isMouseDown = false; // Marque la fin de l'interaction par clic.

        this.clearHoveredCells(); // Réinitialise les styles de survol.

        this.saveSelectedCells(); // Sauvegarde les cellules sélectionnées.
      }
    } // Supprime les styles des cellules survolées pour réinitialiser leur apparence.

  }, {
    key: "clearHoveredCells",
    value: function clearHoveredCells() {
      var hoveredCells = document.querySelectorAll('.cell.hovered'); // Sélectionne toutes les cellules survolées.

      hoveredCells.forEach(function (cell) {
        return cell.classList.remove('hovered');
      }); // Supprime la classe CSS indiquant le survol.
    } // Gère l'interaction avec une cellule en fonction du mode sélectionné (sélection, insertion, suppression).

  }, {
    key: "handleCellInteraction",
    value: function handleCellInteraction(cell, cellElement) {
      var cellKey = "".concat(cell.posX, "-").concat(cell.posY); // Clé unique pour identifier chaque cellule.

      var layerCells;

      switch (this.layer) {
        case 'element':
          layerCells = this.layerElements;
          break;

        case 'object':
          layerCells = this.layerObjects;
          break;

        case 'character':
          layerCells = this.layerCharacters;
          break;

        default:
          layerCells = this.cells;
          break;
      } // Vérifie que layerCell existe avant de continuer


      var layerCell = layerCells.find(function (lCell) {
        return lCell.posX === cell.posX && lCell.posY === cell.posY;
      });

      if (!layerCell) {
        console.warn('Aucune cellule trouvée pour cette position.');
        return; // Arrête si la cellule n'est pas trouvée
      } // Sélection de cellule


      if (this.mode === 'select') {
        console.log('Selected cell:', layerCell);
        this.selectCell(layerCell); // Sélectionne la cellule pour afficher ses détails

        return;
      } // Insertion d'un item


      if (this.mode === 'insert' && this.selectedItem) {
        this.placeItemInCell(layerCell, this.selectedItem.id); // Insère un item dans la cellule

        this.selectedCells.add(cellKey); // Ajoute la cellule sélectionnée à l'ensemble des cellules à sauvegarder

        cellElement.style.backgroundColor = "#007bff"; // Indication visuelle
      } // Suppression d'un item
      else if (this.mode === 'delete' && layerCell.exists) {
          this.deleteCell(layerCell); // Supprime l'item ou le message de la cellule

          this.selectedCells.add(cellKey); // Ajoute la cellule sélectionnée à l'ensemble des cellules à sauvegarder

          cellElement.style.backgroundColor = "#fff"; // Indication visuelle
        }
    } // Met à jour l'apparence d'une cellule spécifique après modification (insertion ou suppression d'item).
    // Met à jour l'apparence d'une cellule spécifique après modification (insertion ou suppression d'item).

  }, {
    key: "updateCellAppearance",
    value: function updateCellAppearance(cell) {
      var cellElement = document.querySelector(".cell[style*=\"grid-column-start: ".concat(cell.posX + 1, ";\"][style*=\"grid-row-start: ").concat(cell.posY + 1, ";\"]"));

      if (cellElement) {
        if (cell.exists) {
          cellElement.style.backgroundColor = "#007bff"; // Change la couleur pour les cellules existantes.

          cellElement.innerHTML = ""; // Réinitialise le contenu HTML de la cellule.

          if (cell.item) {
            this.renderItemInCell(cellElement, cell.item); // Affiche l'item dans la cellule si elle en contient un.
          }
        } else {
          cellElement.style.backgroundColor = "#fff"; // Réinitialise la couleur pour les cellules vides.

          cellElement.innerHTML = ""; // Réinitialise le contenu HTML de la cellule.
        }
      }
    } // Sauvegarde les cellules sélectionnées dans la base de données en envoyant une requête au serveur.

  }, {
    key: "saveSelectedCells",
    value: function saveSelectedCells() {
      var _this6 = this;

      var layerCells, layer_type, cellsData, url, method, response, errorMessage;
      return regeneratorRuntime.async(function saveSelectedCells$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!(this.selectedCells.size === 0 || this.isSaving)) {
                _context3.next = 3;
                break;
              }

              // Vérifie si des cellules sont sélectionnées et qu'aucune sauvegarde n'est en cours.
              console.warn('Aucune cellule sélectionnée pour la sauvegarde ou suppression ou sauvegarde déjà en cours.');
              return _context3.abrupt("return");

            case 3:
              this.isSaving = true; // Empêche les sauvegardes répétées.
              // Selection du layer actif

              _context3.t0 = this.layer;
              _context3.next = _context3.t0 === 'element' ? 7 : _context3.t0 === 'object' ? 10 : _context3.t0 === 'character' ? 13 : 16;
              break;

            case 7:
              layerCells = this.layerElements;
              layer_type = 'element';
              return _context3.abrupt("break", 19);

            case 10:
              layerCells = this.layerObjects;
              layer_type = 'object';
              return _context3.abrupt("break", 19);

            case 13:
              layerCells = this.layerCharacters;
              layer_type = 'character';
              return _context3.abrupt("break", 19);

            case 16:
              layerCells = this.cells;
              layer_type = 'default';
              return _context3.abrupt("break", 19);

            case 19:
              cellsData = Array.from(this.selectedCells).map(function (key) {
                var _key$split$map = key.split('-').map(Number),
                    _key$split$map2 = _slicedToArray(_key$split$map, 2),
                    posX = _key$split$map2[0],
                    posY = _key$split$map2[1]; // Récupère les coordonnées de la cellule à partir de la clé.
                // switch ()


                var cell = layerCells.find(function (c) {
                  return c.posX === posX && c.posY === posY;
                }); // Trouve la cellule correspondante.

                return {
                  room_id: _this6.roomData.id,
                  // Identifiant de la pièce.
                  pos_x: cell.posX,
                  // Coordonnée X de la cellule.
                  pos_y: cell.posY,
                  // Coordonnée Y de la cellule.
                  item_id: cell.exists ? cell.item : null,
                  // Identifiant de l'item (null si aucun).
                  message_id: cell.exists ? cell.message : null,
                  // Identifiant du message (null si aucun).
                  layer_type: layer_type,
                  cell_id: cell.id
                };
              });
              url = '/rooms/save-cells'; // URL par défaut pour l'insertion

              method = 'POST'; // Méthode HTTP par défaut

              if (this.mode === 'delete') {
                url = '/rooms/delete-cells'; // URL pour la suppression

                method = 'DELETE'; // Méthode HTTP pour la suppression
              }

              _context3.prev = 23;
              _context3.next = 26;
              return regeneratorRuntime.awrap(fetch(url, {
                method: method,
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(cellsData) // Envoie les données des cellules sélectionnées au serveur.

              }));

            case 26:
              response = _context3.sent;

              if (response.ok) {
                _context3.next = 32;
                break;
              }

              _context3.next = 30;
              return regeneratorRuntime.awrap(response.text());

            case 30:
              errorMessage = _context3.sent;
              throw new Error("Erreur lors de la ".concat(this.mode === 'delete' ? 'suppression' : 'sauvegarde', " des cellules: ").concat(errorMessage));

            case 32:
              console.log("Les cellules ont \xE9t\xE9 ".concat(this.mode === 'delete' ? 'supprimées' : 'sauvegardées', " avec succ\xE8s."));
              this.selectedCells.clear(); // Réinitialise l'ensemble des cellules sélectionnées.

              this.updateCellsAfterSave(cellsData); // Met à jour l'état des cellules après la sauvegarde ou la suppression.

              this.renderMap(); // Réaffiche la carte avec les modifications.

              _context3.next = 41;
              break;

            case 38:
              _context3.prev = 38;
              _context3.t1 = _context3["catch"](23);
              console.error('Erreur:', _context3.t1);

            case 41:
              _context3.prev = 41;
              this.isSaving = false; // Réinitialise l'indicateur de sauvegarde.

              return _context3.finish(41);

            case 44:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this, [[23, 38, 41, 44]]);
    } // Met à jour les cellules après la sauvegarde pour refléter les modifications.

  }, {
    key: "updateCellsAfterSave",
    value: function updateCellsAfterSave(cellsData) {
      var layerCells = this.getLayerCells(); // Récupère les cellules du layer actif

      var layerType = this.layer; // Récupère le type de layer actif (element, object, character)

      cellsData.forEach(function (data) {
        // Trouve la cellule dans le layer actuel, en utilisant posX, posY et le layer_type
        var cell = layerCells.find(function (c) {
          return c.posX === data.pos_x && c.posY === data.pos_y && c.layer_type === layerType;
        });

        if (cell) {
          // Si l'item_id n'est pas null, on définit exists à true, sinon à false
          cell.exists = data.item_id !== null; // Met à jour l'item et le message dans la cellule

          cell.item = data.item_id;
          cell.message = data.message_id;
        }
      });
    } // Sélectionne une cellule et affiche ses détails dans l'interface utilisateur.

  }, {
    key: "selectCell",
    value: function selectCell(cell) {
      console.log("S\xE9lection de la cellule : (".concat(cell.posX, ", ").concat(cell.posY, ", ").concat(cell.item, ")"));
      this.showCellDetails(cell); // Affiche les détails de la cellule sélectionnée.

      if (cell.exists && cell.item) {
        var selectedItem = this.items.find(function (item) {
          return item.id === cell.item;
        }); // Trouve l'objet item correspondant à l'ID

        if (selectedItem) {
          this.selectedItem = selectedItem; // Définit l'item sélectionné

          this.highlightSelectedItem(selectedItem); // Met en évidence l'item dans la liste si besoin
        } else {
          console.error("Item avec ID ".concat(cell.item, " non trouv\xE9."));
        }
      }
    } // Affiche les détails de la cellule sélectionnée dans un conteneur HTML.
    // Affiche les détails de la cellule sélectionnée dans un conteneur HTML.

  }, {
    key: "showCellDetails",
    value: function showCellDetails(cell) {
      var detailsContainer, messageForCell, messageContent;
      return regeneratorRuntime.async(function showCellDetails$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              console.log("Affichage des d\xE9tails de la cellule : (".concat(cell.posX, ", ").concat(cell.posY, ", ").concat(cell.item, ")"));
              detailsContainer = document.getElementById("cell-details");

              if (detailsContainer) {
                _context4.next = 5;
                break;
              }

              console.error("Le conteneur de détails des cellules est introuvable.");
              return _context4.abrupt("return");

            case 5:
              _context4.next = 7;
              return regeneratorRuntime.awrap(this.getMessageForCell(cell.id));

            case 7:
              messageForCell = _context4.sent;
              // Si le message est vide ou absent, afficher un texte par défaut
              messageContent = messageForCell ? messageForCell.text : 'Aucun message trouvé pour cette cellule'; // Injecter le contenu HTML

              detailsContainer.innerHTML = "\n            <form id=\"cell-edit-form\">\n                <input type=\"hidden\" name=\"room_id\" value=\"".concat(this.roomData.id, "\">\n                <input type=\"hidden\" name=\"pos_x\" value=\"").concat(cell.posX, "\">\n                <input type=\"hidden\" name=\"pos_y\" value=\"").concat(cell.posY, "\">\n                <input type=\"hidden\" name=\"layer_type\" value=\"").concat(cell.layer_type, "\">\n                <input type=\"hidden\" name=\"cell_id\" value=\"").concat(cell.id, "\">\n                \n                <!-- S\xE9lection de l'item -->\n                <div class=\"mb-3\">\n                    <span class=\"badge bg-info p-3\">S\xE9lection de l'item ").concat(cell.id, "</span>\n                </div>\n                <div class=\"mb-3\">\n                  <label for=\"item_id\" class=\"form-label\">Item</label>\n                  <select class=\"form-select\" id=\"item-id\" name=\"item_id\">\n                    <option value=\"\">Aucun</option>\n                    ").concat(this.items.map(function (item) {
                return "\n                      <option value=\"".concat(item.id, "\" ").concat(cell.item === item.id ? 'selected' : '', ">").concat(item.name, "</option>\n                    ");
              }).join(''), "\n                  </select>\n                </div>\n                \n                <!-- Position de la cellule -->\n                <div class=\"mb-3\">\n                    <label for=\"position\" class=\"form-label\">Position (x, y)</label>\n                    <input type=\"text\" class=\"form-control\" id=\"position\" name=\"position\" value=\"(").concat(cell.posX, ", ").concat(cell.posY, ")\" readonly>\n                </div>\n                \n                <!-- Largeur et hauteur avec des barres de d\xE9filement -->\n                ").concat(cell.layer_type === 'object' ? "\n                <!-- Largeur et hauteur uniquement pour les objets -->\n                <div class=\"mb-3\">\n                    <label for=\"width\" class=\"form-label\">Largeur</label>\n                    <div class=\"d-flex align-items-center\">\n                        <input type=\"range\" class=\"form-range\" id=\"width\" name=\"width\" min=\"1\" max=\"10\" value=\"".concat(cell.width, "\">\n                    </div>\n                </div>\n                <div class=\"mb-3\">\n                    <label for=\"height\" class=\"form-label\">Hauteur</label>\n                    <div class=\"d-flex align-items-center\">\n                        <input type=\"range\" class=\"form-range\" id=\"height\" name=\"height\" min=\"1\" max=\"10\" value=\"").concat(cell.height, "\">\n                    </div>\n                </div>\n                <div class=\"mb-3\">\n                    <label for=\"height\" class=\"form-label\">Position Horizontale</label>\n                    <div class=\"d-flex align-items-center\">\n                        <input type=\"range\" class=\"form-range\" id=\"offset_x\" name=\"offset_x\" min=\"0\" max=\"").concat(cell.size, "\" value=\"").concat(cell.offset_x, "\">\n                    </div>\n                </div>\n                <div class=\"mb-3\">\n                    <label for=\"height\" class=\"form-label\">Position Horizontale</label>\n                    <div class=\"d-flex align-items-center\">\n                        <input type=\"range\" class=\"form-range\" id=\"offset_y\" name=\"offset_y\" min=\"0\" max=\"").concat(cell.size, "\" value=\"").concat(cell.offset_y, "\">\n                    </div>\n                </div>\n                ") : '', "\n            </form>\n    \n            <!-- Message -->\n            <form id=\"message-form\">\n                <input type=\"hidden\" name=\"cell_id\" value=\"").concat(cell.id, "\">\n                <div class=\"mb-3\">\n                    <label for=\"messageContent\" class=\"form-label\">Message</label>\n                    <textarea class=\"form-control\" id=\"messageContent\" name=\"messageContent\" rows=\"4\">").concat(messageContent, "</textarea>\n                </div>\n                <button type=\"submit\" class=\"btn btn-primary\" id=\"save-message-btn\" >Sauvegarder</button>\n            </form>\n        "); // Assurez-vous que le HTML est injecté avant d'appeler les écouteurs d'événements

              this.attachFormListeners(cell.layer_type);
              this.messageCellSubmitForm();

            case 12:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this);
    } // Fonction pour attacher les écouteurs aux éléments du formulaire

  }, {
    key: "attachFormListeners",
    value: function attachFormListeners(layer_type) {
      var _this7 = this;

      var form = document.getElementById('cell-edit-form');

      if (!form) {
        console.error('Le formulaire de la cellule est introuvable.');
        return;
      }

      if (layer_type === 'object') {
        // Synchroniser les champs de largeur et hauteur avec les sliders
        var widthSlider = document.getElementById('width');
        var heightSlider = document.getElementById('height');

        if (widthSlider) {
          widthSlider.addEventListener('input', function () {
            _this7.autoSubmitForm(form);
          });
        } else {
          console.warn('Le slider de largeur est introuvable.');
        }

        if (heightSlider) {
          heightSlider.addEventListener('input', function () {
            _this7.autoSubmitForm(form);
          });
        } else {
          console.warn('Le slider de hauteur est introuvable.');
        }
      } // Soumission automatique lorsque l'utilisateur modifie le formulaire


      form.addEventListener('change', function () {
        _this7.autoSubmitForm(form);
      }); // soumission du form message dans cell détail

      var btnSaveMessageCell = document.getElementById('message-form');
      btnSaveMessageCell.addEventListener('submit', function (event) {
        event.preventDefault();

        _this7.messageCellSubmitForm();
      });
    }
  }, {
    key: "autoSubmitForm",
    value: function autoSubmitForm(form) {
      var formData, data, response, layerCells, layerCell;
      return regeneratorRuntime.async(function autoSubmitForm$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              formData = new FormData(form);
              data = Object.fromEntries(formData);
              console.log('data', data);
              _context5.prev = 3;
              _context5.next = 6;
              return regeneratorRuntime.awrap(fetch('/room/update-cell', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
              }));

            case 6:
              response = _context5.sent;

              if (response.ok) {
                _context5.next = 9;
                break;
              }

              throw new Error('Erreur lors de la mise à jour de la cellule');

            case 9:
              _context5.t0 = data.layer_type;
              _context5.next = _context5.t0 === 'element' ? 12 : _context5.t0 === 'object' ? 14 : _context5.t0 === 'character' ? 16 : 18;
              break;

            case 12:
              layerCells = this.layerElements;
              return _context5.abrupt("break", 20);

            case 14:
              layerCells = this.layerObjects;
              return _context5.abrupt("break", 20);

            case 16:
              layerCells = this.layerCharacters;
              return _context5.abrupt("break", 20);

            case 18:
              layerCells = this.cells;
              return _context5.abrupt("break", 20);

            case 20:
              // Vérifiez si la cellule fait partie du layer courant
              layerCell = layerCells.find(function (lCell) {
                return lCell.posX === Number(data.pos_x) && lCell.posY === Number(data.pos_y);
              });
              console.log('layerCell', layerCell);
              this.placeItemInCell(layerCell, data.item_id); // Insère un item dans la cellule

              this.renderMap();
              _context5.next = 29;
              break;

            case 26:
              _context5.prev = 26;
              _context5.t1 = _context5["catch"](3);
              console.error('Erreur lors de la soumission automatique du formulaire :', _context5.t1);

            case 29:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this, [[3, 26]]);
    }
  }, {
    key: "messageCellSubmitForm",
    value: function messageCellSubmitForm() {
      var messageForm, formData, data, response;
      return regeneratorRuntime.async(function messageCellSubmitForm$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              messageForm = document.getElementById('message-form');
              formData = new FormData(messageForm);
              data = Object.fromEntries(formData); // Vérification si le contenu du message est bien présent

              if (!(!data.messageContent || data.messageContent.trim() === '')) {
                _context6.next = 5;
                break;
              }

              return _context6.abrupt("return");

            case 5:
              _context6.prev = 5;
              _context6.next = 8;
              return regeneratorRuntime.awrap(fetch('/room/update-cell-message', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
              }));

            case 8:
              response = _context6.sent;

              if (response.ok) {
                _context6.next = 11;
                break;
              }

              throw new Error('Erreur lors de la mise à jour du message de la cellule');

            case 11:
              _context6.next = 16;
              break;

            case 13:
              _context6.prev = 13;
              _context6.t0 = _context6["catch"](5);
              console.error('Erreur lors de la soumission automatique du formulaire :', _context6.t0);

            case 16:
            case "end":
              return _context6.stop();
          }
        }
      }, null, null, [[5, 13]]);
    } // Place un item dans une cellule spécifique et met à jour son apparence.

  }, {
    key: "placeItemInCell",
    value: function placeItemInCell(cell, itemId) {
      cell.exists = true; // Marque la cellule comme existante.

      cell.item = itemId; // Associe l'item sélectionné à la cellule.

      this.updateCellAppearance(cell, false); // Met à jour l'apparence de la cellule.
    } // Supprime un item ou un message d'une cellule spécifique et met à jour son apparence.

  }, {
    key: "deleteCell",
    value: function deleteCell(cell) {
      cell.exists = false; // Marque la cellule comme vide.

      cell.item = null; // Supprime l'item de la cellule.

      cell.message = null; // Supprime le message de la cellule.

      this.updateCellAppearance(cell); // Met à jour l'apparence de la cellule.
    } // Affiche un item dans une cellule spécifique en utilisant son élément HTML.

  }, {
    key: "renderItemInCell",
    value: function renderItemInCell(cellElement, cell) {
      var item = this.items.find(function (item) {
        return item.id === Number(cell.item);
      }); // Trouve l'item correspondant.

      if (item) {
        // Supprime l'ancienne image s'il y en a déjà une dans ce cellElement
        while (cellElement.firstChild) {
          cellElement.removeChild(cellElement.firstChild);
        }

        var itemElement = document.createElement("img"); // Crée un élément image pour l'item.

        itemElement.src = item.img; // Définit la source de l'image.

        itemElement.alt = item.name; // Définit l'alt pour l'accessibilité.

        itemElement.title = item.description; // Définit le titre pour afficher la description au survol.
        // Appliquer les dimensions de l'image en fonction de la taille de l'objet

        itemElement.style.position = "absolute"; // Permet à l'image de dépasser la cellule

        itemElement.style.width = "".concat(cell.width * cell.size, "px"); // Appliquer la largeur de l'objet

        itemElement.style.height = "".concat(cell.height * cell.size, "px"); // Appliquer la hauteur de l'objet
        // Appliquer les offsets (décalages) pour positionner l'image correctement

        itemElement.style.left = "".concat(cell.offset_x, "px"); // Décalage horizontal

        itemElement.style.top = "".concat(cell.offset_y, "px"); // Décalage vertical
        // Désactiver le glisser-déposer par défaut de l'image

        itemElement.draggable = false; // Ajouter l'image à la cellule

        cellElement.appendChild(itemElement);
      } else {
        console.error("Item avec ID ".concat(cell.item, " non trouv\xE9."));
      }
    } // Affiche la liste des items disponibles pour être placés dans les cellules.

  }, {
    key: "renderItemList",
    value: function renderItemList() {
      var _this8 = this;

      var itemListContainer = document.getElementById("item-list");
      itemListContainer.innerHTML = ""; // Vide la liste des items pour la réinitialiser.

      var itemsForLayer = []; // Filtrer les items en fonction du layer actif

      switch (this.layer) {
        case 'object':
          itemsForLayer = this.items.filter(function (item) {
            return item.is_object;
          }); // Items où is_object est vrai

          break;

        case 'character':
          itemsForLayer = this.items.filter(function (item) {
            return item.item_type === 9;
          }); // Items où item_type est 9 (personnages)

          break;

        case 'element':
          itemsForLayer = this.items.filter(function (item) {
            return !item.is_object && item.item_type !== 9;
          }); // Les autres items

          break;

        default:
          itemsForLayer = this.items; // Par défaut, on affiche tous les items

          break;
      }

      console.log('Items pour cette couche:', itemsForLayer); // Crée les éléments HTML pour chaque item filtré

      itemsForLayer.forEach(function (item) {
        var itemElement = document.createElement("div");
        itemElement.className = "item d-flex align-items-start mb-2";
        itemElement.innerHTML = "\n                <img src=\"".concat(item.img, "\" alt=\"").concat(item.name, "\" title=\"").concat(item.description, "\" class=\"item-thumbnail me-2\" />\n                <div class=\"item-details\">\n                    <h6 class=\"item-name mb-1\">").concat(item.name, "</h6>\n                    <p class=\"item-description text-muted mb-0\">").concat(_this8.truncateText(item.description, 40), "</p>\n                </div>\n            "); // Ajoute un écouteur de clic pour sélectionner l'item

        itemElement.addEventListener('click', function () {
          _this8.selectedItem = item; // Définit l'item sélectionné lors du clic

          _this8.updateModeUI();
        });
        itemElement.querySelector("img").draggable = false; // Empêche le glisser-déposer de l'image

        itemListContainer.appendChild(itemElement); // Ajoute l'item à la liste des items disponibles
      });
    } // Troncature des textes trop longs dans la liste des items.

  }, {
    key: "truncateText",
    value: function truncateText(text, maxLength) {
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    } // Met en évidence l'item sélectionné dans la liste des items disponibles.

  }, {
    key: "highlightSelectedItem",
    value: function highlightSelectedItem(item) {
      var itemListContainer = document.getElementById("item-list");
      Array.from(itemListContainer.children).forEach(function (child) {
        child.classList.remove("selected-item"); // Supprime la mise en évidence des autres items.

        if (child.querySelector("img[alt=\"".concat(item.name, "\"]"))) {
          child.classList.add("selected-item"); // Met en évidence l'item sélectionné.
        }
      });
    } // Configure les événements pour changer de mode (insertion, suppression, sélection) et met à jour l'interface utilisateur.
    // Configure les événements pour changer de mode (insertion, suppression, sélection) et met à jour l'interface utilisateur.

  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this9 = this;

      var playModeButton = document.getElementById("toggle-play-mode-button");
      var insertModeButton = document.getElementById("toggle-insert-mode-button");
      var deleteModeButton = document.getElementById("toggle-delete-mode-button");
      var selectModeButton = document.getElementById("toggle-select-mode-button");
      var mapContainer = document.getElementById("map-container"); // Écouteurs pour les boutons de mode

      playModeButton.addEventListener('click', function _callee() {
        return regeneratorRuntime.async(function _callee$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                _context7.next = 3;
                return regeneratorRuntime.awrap(_this9.gameEngine.initializeGame());

              case 3:
                _context7.next = 8;
                break;

              case 5:
                _context7.prev = 5;
                _context7.t0 = _context7["catch"](0);
                console.error("Erreur lors de l'initialisation du jeu:", _context7.t0);

              case 8:
                _this9.changeMode('play');

              case 9:
              case "end":
                return _context7.stop();
            }
          }
        }, null, null, [[0, 5]]);
      });
      insertModeButton.addEventListener('click', function () {
        _this9.changeMode('insert');

        _this9.updateModeUI();
      });
      deleteModeButton.addEventListener('click', function () {
        _this9.changeMode('delete');

        _this9.updateModeUI();
      });
      selectModeButton.addEventListener('click', function () {
        _this9.changeMode('select');

        _this9.updateModeUI();
      }); // Ajout des événements pour la touche Shift (mode grab)

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Shift') {
          if (_this9.mode !== 'grab') {
            _this9.previousMode = _this9.mode; // Sauvegarde du mode actuel

            _this9.changeMode('grab'); // Passe en mode "grab"


            _this9.updateModeUI();
          }
        }
      });
      document.addEventListener('keyup', function (event) {
        if (event.key === 'Shift' && _this9.mode === 'grab') {
          _this9.changeMode(_this9.previousMode); // Restaure le mode précédent


          _this9.previousMode = null; // Réinitialise le mode précédent

          _this9.updateModeUI();
        }
      }); // Gestion du déplacement de la grille en mode "grab"

      var isGrabbing = false;
      var startX, startY, scrollLeft, scrollTop;
      mapContainer.addEventListener('mousedown', function (e) {
        if (_this9.mode === 'grab') {
          isGrabbing = true;
          mapContainer.classList.add('grabbing');
          startX = e.pageX - mapContainer.offsetLeft;
          startY = e.pageY - mapContainer.offsetTop;
          scrollLeft = mapContainer.scrollLeft;
          scrollTop = mapContainer.scrollTop;

          _this9.updateModeUI();
        } else {
          _this9.isMouseDown = true; // Interaction standard (non-grab)

          _this9.updateModeUI();
        }
      });
      mapContainer.addEventListener('mouseleave', function () {
        isGrabbing = false;
        mapContainer.classList.remove('grabbing');
        _this9.isMouseDown = false; // S'assure que la souris n'est plus enfoncée
      });
      mapContainer.addEventListener('mouseup', function () {
        isGrabbing = false;
        mapContainer.classList.remove('grabbing');

        _this9.onMouseUp(); // Gestion de la fin du clic pour l'interaction standard

      });
      mapContainer.addEventListener('mousemove', function (e) {
        if (isGrabbing) {
          e.preventDefault();
          var x = e.pageX - mapContainer.offsetLeft;
          var y = e.pageY - mapContainer.offsetTop;
          var walkX = (x - startX) * 1.5; // Multiplicateur pour ajuster la vitesse du déplacement horizontal

          var walkY = (y - startY) * 1.5; // Multiplicateur pour ajuster la vitesse du déplacement vertical

          mapContainer.scrollLeft = scrollLeft - walkX;
          mapContainer.scrollTop = scrollTop - walkY;
        } else if (_this9.isMouseDown) {
          // Interaction standard pendant un clic maintenu
          var hoveredCell = document.elementFromPoint(e.clientX, e.clientY);

          if (hoveredCell && hoveredCell.classList.contains('cell')) {
            var cell = _this9.getCellFromElement(hoveredCell);

            _this9.onMouseOver(cell, hoveredCell); // Appelle la fonction pour gérer le survol

          }
        }
      }); // Écouteurs pour les boutons de layers (éléments, objets, personnages)

      var toggleLayerElementModeButton = document.getElementById("toggle-layerElement-mode-button");
      var toggleLayerObjectModeButton = document.getElementById("toggle-layerObject-mode-button");
      var toggleLayerCharacterModeButton = document.getElementById("toggle-layerCharacter-mode-button");
      toggleLayerElementModeButton.addEventListener('click', function () {
        _this9.changeLayer('element');

        _this9.selectedItem = null;

        _this9.updateModeUI();
      });
      toggleLayerObjectModeButton.addEventListener('click', function () {
        _this9.changeLayer('object');

        _this9.updateModeUI();
      });
      toggleLayerCharacterModeButton.addEventListener('click', function () {
        _this9.changeLayer('character');

        _this9.updateModeUI();
      }); // Ajout d'un écouteur global pour capturer les événements de relâchement de souris

      document.addEventListener('mouseup', function () {
        return _this9.onMouseUp();
      });
    }
  }, {
    key: "getCellFromElement",
    value: function getCellFromElement(cellElement) {
      var posX = parseInt(cellElement.style.left) / this.roomData.cell_size;
      var posY = parseInt(cellElement.style.top) / this.roomData.cell_size;
      var currentLayerCells = this.getLayerCells();
      return currentLayerCells.find(function (cell) {
        return cell.posX === posX && cell.posY === posY;
      });
    } // Fonction pour changer le mode et mettre à jour l'interface

  }, {
    key: "changeMode",
    value: function changeMode(newMode) {
      this.mode = newMode;
      console.log("Mode changé en :", this.mode);
      this.layer = null;
      this.updateLayerButtons(); // Met à jour l'état des boutons de layer dans l'UI

      this.updateLayerInteractivity(); // Met à jour la visibilité et l'interactivité des layers

      this.renderItemList(); // Réaffiche la liste des items filtrés selon le layer

      this.updateModeUI(); // Met à jour l'UI avec le nouveau mode et layer

      this.updateModeButtons();
    }
  }, {
    key: "getLayerCells",
    value: function getLayerCells() {
      switch (this.layer) {
        case 'element':
          return this.layerElements;

        case 'object':
          return this.layerObjects;

        case 'character':
          return this.layerCharacters;

        default:
          return [];
      }
    } // Met à jour l'apparence des boutons de mode en fonction du mode actif

  }, {
    key: "updateModeButtons",
    value: function updateModeButtons() {
      var playButton = document.getElementById("toggle-play-mode-button");
      var insertButton = document.getElementById("toggle-insert-mode-button");
      var deleteButton = document.getElementById("toggle-delete-mode-button");
      var selectButton = document.getElementById("toggle-select-mode-button");
      playButton.classList.toggle('active-mode', this.mode === 'play');
      insertButton.classList.toggle('active-mode', this.mode === 'insert');
      deleteButton.classList.toggle('active-mode', this.mode === 'delete');
      selectButton.classList.toggle('active-mode', this.mode === 'select'); // Ajout d'une classe pour le mode grab si nécessaire
    } // Met à jour l'affichage de l'interface utilisateur pour indiquer le mode actif

  }, {
    key: "updateModeUI",
    value: function updateModeUI() {
      var banner = document.getElementById('mode-banner');
      var body = document.querySelector('body');
      body.classList.remove('mode-insert', 'mode-delete', 'mode-select', 'mode-grab', 'mode-play'); // Supprime les classes de mode précédentes.

      var itemText = this.selectedItem ? " - ".concat(this.selectedItem.name) : ''; // Vérifie si un item est sélectionné

      var bannerText = '';
      console.log("Mode update en :", this.mode);

      switch (this.mode) {
        case 'play':
          bannerText = "Jouer - ".concat(this.layer);
          banner.className = "banner banner-play";
          body.classList.add('mode-play');
          break;

        case 'insert':
          bannerText = "Insertion - ".concat(this.layer).concat(itemText);
          banner.className = "banner banner-insert";
          body.classList.add('mode-insert');
          break;

        case 'delete':
          bannerText = "Suppression - ".concat(this.layer);
          banner.className = "banner banner-delete";
          body.classList.add('mode-delete');
          break;

        case 'select':
          bannerText = "S\xE9lection - ".concat(this.layer).concat(itemText);
          banner.className = "banner banner-select";
          body.classList.add('mode-select');
          break;

        case 'grab':
          bannerText = "Grab - ".concat(this.layer);
          banner.className = "banner banner-grab";
          body.classList.add('mode-grab');
          break;

        default:
          bannerText = "S\xE9lection - ".concat(this.layer);
          banner.className = "banner banner-select";
          body.classList.add('mode-select');
          break;
      }

      banner.textContent = bannerText;
    }
  }, {
    key: "changeLayer",
    value: function changeLayer(newLayer) {
      // Si on clique à nouveau sur le même layer, on désactive ce layer pour afficher tous les items
      if (this.layer === newLayer) {
        this.layer = null; // Désactivation du layer actif
      } else {
        this.layer = newLayer; // Activation du nouveau layer
      } // Réinitialise l'item sélectionné à null à chaque changement de layer


      this.selectedItem = null;
      this.updateLayerButtons(); // Met à jour l'état des boutons de layer dans l'UI

      this.updateLayerInteractivity(); // Met à jour la visibilité et l'interactivité des layers

      this.renderItemList(); // Réaffiche la liste des items filtrés selon le layer

      this.updateModeUI(); // Met à jour l'UI avec le nouveau mode et layer
    } // Fonction pour mettre à jour l'interactivité des layers

  }, {
    key: "updateLayerInteractivity",
    value: function updateLayerInteractivity() {
      var elementsLayer = document.getElementById('map-container-elements');
      var objectsLayer = document.getElementById('map-container-objects');
      var charactersLayer = document.getElementById('map-container-characters'); // Désactive les pointer-events pour les couches qui ne sont pas actives

      elementsLayer.classList.remove('layer-active', 'layer-inactive');
      objectsLayer.classList.remove('layer-active', 'layer-inactive');
      charactersLayer.classList.remove('layer-active', 'layer-inactive'); // Applique les bonnes classes selon le layer actif

      switch (this.layer) {
        case 'element':
          elementsLayer.classList.add('layer-active');
          objectsLayer.classList.add('layer-inactive');
          charactersLayer.classList.add('layer-inactive');
          break;

        case 'object':
          elementsLayer.classList.add('layer-inactive');
          objectsLayer.classList.add('layer-active');
          charactersLayer.classList.add('layer-inactive');
          break;

        case 'character':
          elementsLayer.classList.add('layer-inactive');
          objectsLayer.classList.add('layer-inactive');
          charactersLayer.classList.add('layer-active');
          break;

        case null:
          elementsLayer.classList.remove('layer-inactive');
          objectsLayer.classList.remove('layer-inactive');
          charactersLayer.classList.remove('layer-inactive');
          break;

        default:
          break;
      }
    }
  }, {
    key: "updateLayerButtons",
    value: function updateLayerButtons() {
      var toggleLayerElementModeButton = document.getElementById("toggle-layerElement-mode-button");
      var toggleLayerObjectModeButton = document.getElementById("toggle-layerObject-mode-button");
      var toggleLayerCharacterModeButton = document.getElementById("toggle-layerCharacter-mode-button");
      toggleLayerElementModeButton.classList.toggle('active-mode', this.layer === 'element');
      toggleLayerObjectModeButton.classList.toggle('active-mode', this.layer === 'object');
      toggleLayerCharacterModeButton.classList.toggle('active-mode', this.layer === 'character');
    }
  }]);

  return RoomBuilder;
}();

exports.RoomBuilder = RoomBuilder;