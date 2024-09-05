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

    this.mode = 'select'; // Mode courant : 'select', 'insert', ou 'delete'

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

      this.updateModeUI(); // Met à jour l'affichage de l'interface utilisateur selon le mode actif.

      this.initPlayerPosition(); // Initialise la position du joueur

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
    } // Crée les cellules de la carte en fonction des données de la pièce (roomData) fournies lors de l'instanciation.
    // Les cellules sont initialisées avec leur position, leur taille, et les éventuels items ou messages.

  }, {
    key: "createCells",
    value: function createCells() {
      var _this2 = this;

      var _this$roomData = this.roomData,
          nb_rows = _this$roomData.nb_rows,
          nb_cols = _this$roomData.nb_cols,
          cell_size = _this$roomData.cell_size; // Récupère les dimensions et la taille des cellules depuis roomData.

      var _loop = function _loop(y) {
        var _loop2 = function _loop2(x) {
          var cell = {
            x: x * cell_size,
            // Position en pixels sur l'axe X
            y: y * cell_size,
            // Position en pixels sur l'axe Y
            posX: x,
            // Position en colonnes
            posY: y,
            // Position en lignes
            exists: false,
            // Indique si la cellule contient un item ou un message
            item: null,
            // ID de l'item dans la cellule (null si aucun)
            message: null // ID du message dans la cellule (null si aucun)

          };

          var existingCell = _this2.roomData.cells.find(function (c) {
            return c.pos_x === x && c.pos_y === y;
          }); // Vérifie si une cellule existe déjà à cette position.


          if (existingCell) {
            console.log("Cellule existante:", existingCell);
            cell.exists = true; // Marque la cellule comme existante.

            cell.item = existingCell.item_id; // Associe l'item existant à la cellule.

            cell.message = existingCell.message_id; // Associe le message existant à la cellule.

            cell.id = existingCell.id;
            console.log("Cellule existante IDDDDDD:", cell);
          }

          _this2.cells.push(cell); // Ajoute la cellule au tableau des cellules.

        };

        for (var x = 0; x < nb_cols; x++) {
          _loop2(x);
        }
      };

      for (var y = 0; y < nb_rows; y++) {
        _loop(y);
      }
    } // Affiche la carte en créant les éléments HTML pour chaque cellule et en les positionnant dans le conteneur principal.
    // Les cellules existantes sont affichées avec une couleur spécifique et peuvent contenir un item.

  }, {
    key: "renderMap",
    value: function renderMap() {
      var _this3 = this;

      var mapContainer = document.getElementById("map-container");
      mapContainer.innerHTML = ""; // Vide le conteneur pour le réinitialiser.

      mapContainer.style.display = "grid";
      mapContainer.style.gridTemplateColumns = "repeat(".concat(this.roomData.nb_cols, ", ").concat(this.roomData.cell_size, "px)"); // Définit le nombre de colonnes et la taille des cellules.

      mapContainer.style.gridTemplateRows = "repeat(".concat(this.roomData.nb_rows, ", ").concat(this.roomData.cell_size, "px)"); // Définit le nombre de lignes et la taille des cellules.

      this.cells.forEach(function (cell) {
        var cellElement = document.createElement("div"); // Crée un élément HTML pour chaque cellule.

        cellElement.className = "cell"; // Ajoute la classe CSS pour le style de la cellule.

        cellElement.style.width = "".concat(_this3.roomData.cell_size, "px"); // Définit la largeur de la cellule.

        cellElement.style.height = "".concat(_this3.roomData.cell_size, "px"); // Définit la hauteur de la cellule.

        cellElement.style.boxSizing = "border-box"; // Assure que le padding et la bordure sont inclus dans la taille totale.

        cellElement.style.border = "1px solid #ccc"; // Ajoute une bordure aux cellules.

        if (cell.exists) {
          cellElement.style.backgroundColor = "#007bff"; // Change la couleur de fond pour les cellules existantes.

          if (cell.item) {
            _this3.renderItemInCell(cellElement, cell.item); // Affiche l'item dans la cellule si elle en contient un.


            cellElement.style.border = "0px solid #ccc";
          }
        } else {
          cellElement.style.backgroundColor = "#fff"; // Couleur de fond pour les cellules vides.
        }

        mapContainer.appendChild(cellElement); // Ajoute l'élément cellule au conteneur.
        // Ajoute des événements pour gérer les interactions utilisateur (clics et survol).

        cellElement.addEventListener('mousedown', function () {
          return _this3.onMouseDown(cell, cellElement);
        });
        cellElement.addEventListener('mouseover', function () {
          return _this3.onMouseOver(cell, cellElement);
        });
      });
      document.addEventListener('mouseup', function () {
        return _this3.onMouseUp();
      }); // Ajoute un événement global pour gérer la fin du clic.
    } // Gère le clic initial sur une cellule, en fonction du mode courant (sélection, insertion, suppression).

  }, {
    key: "onMouseDown",
    value: function onMouseDown(cell, cellElement) {
      this.isMouseDown = true; // Marque le début d'une interaction par clic.

      this.handleCellInteraction(cell, cellElement); // Gère l'interaction avec la cellule en fonction du mode.

      cellElement.classList.add('hovered'); // Ajoute une classe CSS pour indiquer que la cellule est survolée.
    } // Gère le survol d'une cellule lors du clic maintenu, en fonction du mode courant.

  }, {
    key: "onMouseOver",
    value: function onMouseOver(cell, cellElement) {
      if (!this.isMouseDown) return; // Ne rien faire si la souris n'est pas enfoncée.

      this.handleCellInteraction(cell, cellElement); // Gère l'interaction avec la cellule en fonction du mode.

      cellElement.classList.add('hovered'); // Ajoute une classe CSS pour indiquer que la cellule est survolée.
    } // Gère la fin du clic en réinitialisant les états et en déclenchant la sauvegarde des cellules sélectionnées.

  }, {
    key: "onMouseUp",
    value: function onMouseUp() {
      this.isMouseDown = false; // Marque la fin de l'interaction par clic.

      this.clearHoveredCells(); // Supprime les styles des cellules survolées.

      this.saveSelectedCells(); // Sauvegarde les cellules sélectionnées dans la base de données.
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

      if (this.mode === 'select') {
        this.selectCell(cell); // Sélectionne la cellule pour afficher ses détails.

        console.log('handleInrecation', cell);
        return;
      }

      if (this.mode === 'insert' && this.selectedItem) {
        this.placeItemInCell(cell, this.selectedItem.id); // Insère un item dans la cellule.

        this.selectedCells.add(cellKey); // Ajoute la cellule sélectionnée à l'ensemble des cellules à sauvegarder.

        cellElement.style.backgroundColor = "#007bff"; // Changement de couleur immédiat pour indiquer l'insertion.
      } else if (this.mode === 'delete' && cell.exists) {
        this.deleteCell(cell); // Supprime l'item ou le message de la cellule.

        this.selectedCells.add(cellKey); // Ajoute la cellule sélectionnée à l'ensemble des cellules à sauvegarder.

        cellElement.style.backgroundColor = "#fff"; // Changement de couleur immédiat pour indiquer la suppression.
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
      var _this4 = this;

      var cellsData, url, method, response, errorMessage;
      return regeneratorRuntime.async(function saveSelectedCells$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(this.selectedCells.size === 0 || this.isSaving)) {
                _context.next = 3;
                break;
              }

              // Vérifie si des cellules sont sélectionnées et qu'aucune sauvegarde n'est en cours.
              console.warn('Aucune cellule sélectionnée pour la sauvegarde ou suppression ou sauvegarde déjà en cours.');
              return _context.abrupt("return");

            case 3:
              this.isSaving = true; // Empêche les sauvegardes répétées.

              cellsData = Array.from(this.selectedCells).map(function (key) {
                var _key$split$map = key.split('-').map(Number),
                    _key$split$map2 = _slicedToArray(_key$split$map, 2),
                    posX = _key$split$map2[0],
                    posY = _key$split$map2[1]; // Récupère les coordonnées de la cellule à partir de la clé.


                var cell = _this4.cells.find(function (c) {
                  return c.posX === posX && c.posY === posY;
                }); // Trouve la cellule correspondante.


                return {
                  room_id: _this4.roomData.id,
                  // Identifiant de la pièce.
                  pos_x: cell.posX,
                  // Coordonnée X de la cellule.
                  pos_y: cell.posY,
                  // Coordonnée Y de la cellule.
                  item_id: cell.exists ? cell.item : null,
                  // Identifiant de l'item (null si aucun).
                  message_id: cell.exists ? cell.message : null // Identifiant du message (null si aucun).

                };
              });
              url = '/rooms/save-cells'; // URL par défaut pour l'insertion

              method = 'POST'; // Méthode HTTP par défaut

              if (this.mode === 'delete') {
                url = '/rooms/delete-cells'; // URL pour la suppression

                method = 'DELETE'; // Méthode HTTP pour la suppression
              }

              _context.prev = 8;
              _context.next = 11;
              return regeneratorRuntime.awrap(fetch(url, {
                method: method,
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(cellsData) // Envoie les données des cellules sélectionnées au serveur.

              }));

            case 11:
              response = _context.sent;

              if (response.ok) {
                _context.next = 17;
                break;
              }

              _context.next = 15;
              return regeneratorRuntime.awrap(response.text());

            case 15:
              errorMessage = _context.sent;
              throw new Error("Erreur lors de la ".concat(this.mode === 'delete' ? 'suppression' : 'sauvegarde', " des cellules: ").concat(errorMessage));

            case 17:
              console.log("Les cellules ont \xE9t\xE9 ".concat(this.mode === 'delete' ? 'supprimées' : 'sauvegardées', " avec succ\xE8s."));
              this.selectedCells.clear(); // Réinitialise l'ensemble des cellules sélectionnées.

              this.updateCellsAfterSave(cellsData); // Met à jour l'état des cellules après la sauvegarde ou la suppression.

              this.renderMap(); // Réaffiche la carte avec les modifications.

              _context.next = 26;
              break;

            case 23:
              _context.prev = 23;
              _context.t0 = _context["catch"](8);
              console.error('Erreur:', _context.t0);

            case 26:
              _context.prev = 26;
              this.isSaving = false; // Réinitialise l'indicateur de sauvegarde.

              return _context.finish(26);

            case 29:
            case "end":
              return _context.stop();
          }
        }
      }, null, this, [[8, 23, 26, 29]]);
    } // Met à jour les cellules après la sauvegarde pour refléter les modifications.

  }, {
    key: "updateCellsAfterSave",
    value: function updateCellsAfterSave(cellsData) {
      var _this5 = this;

      cellsData.forEach(function (data) {
        var cell = _this5.cells.find(function (c) {
          return c.posX === data.pos_x && c.posY === data.pos_y;
        }); // Trouve la cellule correspondante.


        if (cell) {
          cell.exists = data.item_id !== null; // Met à jour l'existence de l'item dans la cellule.

          cell.item = data.item_id; // Met à jour l'item dans la cellule.

          cell.message = data.message_id; // Met à jour le message dans la cellule.
        }
      });
    } // Sélectionne une cellule et affiche ses détails dans l'interface utilisateur.

  }, {
    key: "selectCell",
    value: function selectCell(cell) {
      console.log("S\xE9lection de la cellule : (".concat(cell.posX, ", ").concat(cell.posY, ", ").concat(cell.id, ")"));
      this.showCellDetails(cell); // Affiche les détails de la cellule sélectionnée.

      if (cell.exists && cell.item) {
        this.highlightSelectedItem(this.items.find(function (item) {
          return item.id === cell.item;
        })); // Met en évidence l'item sélectionné.
      }
    } // Affiche les détails de la cellule sélectionnée dans un conteneur HTML.
    // Affiche les détails de la cellule sélectionnée dans un conteneur HTML.

  }, {
    key: "showCellDetails",
    value: function showCellDetails(cell) {
      console.log("Affiche les d\xE9tails de la cellule : (".concat(cell.posX, ", ").concat(cell.id, ")"));
      var detailsContainer = document.getElementById("cell-details"); ////    RECHERCHER LES MESSAGE CAR cell.id = ok

      detailsContainer.innerHTML = "\n    <form id=\"cell-edit-form\">\n        <input type=\"hidden\" name=\"room_id\" value=\"".concat(this.roomData.id, "\">\n        <input type=\"hidden\" name=\"pos_x\" value=\"").concat(cell.posX, "\">\n        <input type=\"hidden\" name=\"pos_y\" value=\"").concat(cell.posY, "\">\n        <input type=\"hidden\" name=\"cell_id\" value=\"").concat(cell_id, "\">\n        \n        <!-- S\xE9lection de l'item -->\n        <div class=\"mb-3\">\n            <span class=\"badge bg-info p-3\">S\xE9lection de l'item").concat(cell.id, "</span>\n        </div>\n        <div class=\"mb-3\">\n          <label for=\"item_id\" class=\"form-label\">Item</label>\n          <select class=\"form-select\" id=\"item-id\" name=\"item_id\">\n            <option value=\"\">Aucun</option>\n            ").concat(this.items.map(function (item) {
        return "\n              <option value=\"".concat(item.id, "\" ").concat(cell.item === item.id ? 'selected' : '', ">").concat(item.name, "</option>\n            ");
      }).join(''), "\n          </select>\n        </div>\n        \n        <!-- Position de la cellule -->\n        <div class=\"mb-3\">\n            <label for=\"position\" class=\"form-label\">Position (x, y)</label>\n            <input type=\"text\" class=\"form-control\" id=\"position\" name=\"position\" value=\"(").concat(cell.posX, ", ").concat(cell.posY, ")\" readonly>\n        </div>\n\n        <!-- Largeur et hauteur avec des barres de d\xE9filement -->\n        <div class=\"mb-3\">\n            <label for=\"width\" class=\"form-label\">Largeur</label>\n            <div class=\"d-flex align-items-center\">\n                <input type=\"range\" class=\"form-range\" id=\"width\" name=\"width\" min=\"1\" max=\"10\" value=\"").concat(cell.width, "\">\n            </div>\n        </div>\n        <div class=\"mb-3\">\n            <label for=\"height\" class=\"form-label\">Hauteur</label>\n            <div class=\"d-flex align-items-center\">\n                <input type=\"range\" class=\"form-range\" id=\"height\" name=\"height\" min=\"1\" max=\"10\" value=\"").concat(cell.height, "\">\n            </div>\n        </div>\n\n        <!-- Message -->\n        <div class=\"mb-3\">\n            <label for=\"message\" class=\"form-label\">Message</label>\n            <textarea class=\"form-control\" id=\"message\" name=\"message\" rows=\"4\">").concat(cell.message || '', "</textarea>\n        </div>\n    </form>\n    "); // Attachez les gestionnaires d'événements pour soumettre automatiquement le formulaire et synchroniser la largeur/hauteur

      this.attachFormListeners();
    } // Fonction pour attacher les écouteurs aux éléments du formulaire

  }, {
    key: "attachFormListeners",
    value: function attachFormListeners() {
      var _this6 = this;

      var form = document.getElementById('cell-edit-form'); // Synchroniser les champs de largeur et hauteur avec les sliders

      var widthSlider = document.getElementById('width');
      var heightSlider = document.getElementById('height');
      widthSlider.addEventListener('input', function () {
        _this6.autoSubmitForm(form);
      });
      heightSlider.addEventListener('input', function () {
        _this6.autoSubmitForm(form);
      }); // Soumission automatique lorsque l'utilisateur modifie le formulaire

      form.addEventListener('change', function () {
        _this6.autoSubmitForm(form);
      });
    }
  }, {
    key: "autoSubmitForm",
    value: function autoSubmitForm(form) {
      var formData, data, response;
      return regeneratorRuntime.async(function autoSubmitForm$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              formData = new FormData(form);
              data = Object.fromEntries(formData);
              console.log('..... data   ' + data);
              _context2.prev = 3;
              _context2.next = 6;
              return regeneratorRuntime.awrap(fetch('/room/update-cell', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
              }));

            case 6:
              response = _context2.sent;

              if (response.ok) {
                _context2.next = 9;
                break;
              }

              throw new Error('Erreur lors de la mise à jour de la cellule');

            case 9:
              console.log('Mise à jour de la cellule réussie');
              _context2.next = 15;
              break;

            case 12:
              _context2.prev = 12;
              _context2.t0 = _context2["catch"](3);
              console.error('Erreur lors de la soumission automatique du formulaire :', _context2.t0);

            case 15:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[3, 12]]);
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
      console.log("Deleting cell at (".concat(cell.posX, ", ").concat(cell.posY, ")"));
      cell.exists = false; // Marque la cellule comme vide.

      cell.item = null; // Supprime l'item de la cellule.

      cell.message = null; // Supprime le message de la cellule.

      this.updateCellAppearance(cell); // Met à jour l'apparence de la cellule.

      console.log("Cell exists status: ".concat(cell.exists));
    } // Affiche un item dans une cellule spécifique en utilisant son élément HTML.

  }, {
    key: "renderItemInCell",
    value: function renderItemInCell(cellElement, itemId) {
      var item = this.items.find(function (item) {
        return item.id === itemId;
      }); // Trouve l'item correspondant.

      if (item) {
        var itemElement = document.createElement("img"); // Crée un élément image pour l'item.

        itemElement.src = item.img; // Définit la source de l'image.

        itemElement.alt = item.name; // Définit l'alt pour l'accessibilité.

        itemElement.title = item.description; // Définit le titre pour afficher la description au survol.

        itemElement.style.position = "relative"; // Positionne l'image à l'intérieur de la cellule.

        itemElement.style.width = "100%"; // Définit la largeur de l'image.

        itemElement.style.height = "100%"; // Définit la hauteur de l'image.

        itemElement.draggable = false; // Empêche le glisser-déposer par défaut de l'image.

        cellElement.appendChild(itemElement); // Ajoute l'image de l'item à la cellule.
      } else {
        console.error("Item avec ID ".concat(itemId, " non trouv\xE9."));
      }
    } // Affiche la liste des items disponibles pour être placés dans les cellules.

  }, {
    key: "renderItemList",
    value: function renderItemList() {
      var _this7 = this;

      var itemListContainer = document.getElementById("item-list");
      itemListContainer.innerHTML = ""; // Vide la liste des items pour la réinitialiser.

      this.items.forEach(function (item) {
        var itemElement = document.createElement("div");
        itemElement.className = "item d-flex align-items-start mb-2";
        itemElement.innerHTML = "\n                <img src=\"".concat(item.img, "\" alt=\"").concat(item.name, "\" title=\"").concat(item.description, "\" class=\"item-thumbnail me-2\" />\n                <div class=\"item-details\">\n                    <h6 class=\"item-name mb-1\">").concat(item.name, "</h6>\n                    <p class=\"item-description text-muted mb-0\">").concat(_this7.truncateText(item.description, 40), "</p>\n                </div>\n            ");
        itemElement.addEventListener('click', function () {
          _this7.selectedItem = item; // Définit l'item sélectionné lors du clic.

          console.log("Item s\xE9lectionn\xE9: ".concat(item.name));
        });
        itemElement.querySelector("img").draggable = false; // Empêche le glisser-déposer de l'image.

        itemListContainer.appendChild(itemElement); // Ajoute l'item à la liste des items disponibles.
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
      var _this8 = this;

      var playModeButton = document.getElementById("toggle-play-mode-button");
      var insertModeButton = document.getElementById("toggle-insert-mode-button");
      var deleteModeButton = document.getElementById("toggle-delete-mode-button");
      var selectModeButton = document.getElementById("toggle-select-mode-button");
      var mapContainer = document.getElementById("map-container");
      playModeButton.addEventListener('click', function _callee() {
        return regeneratorRuntime.async(function _callee$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _this8.changeMode('play'); // Appeler initializeGame et attendre qu'il termine


                _context3.prev = 1;
                _context3.next = 4;
                return regeneratorRuntime.awrap(_this8.gameEngine.initializeGame());

              case 4:
                _context3.next = 9;
                break;

              case 6:
                _context3.prev = 6;
                _context3.t0 = _context3["catch"](1);
                console.error("Erreur lors de l'initialisation du jeu:", _context3.t0);

              case 9:
              case "end":
                return _context3.stop();
            }
          }
        }, null, null, [[1, 6]]);
      });
      insertModeButton.addEventListener('click', function () {
        _this8.changeMode('insert');
      });
      deleteModeButton.addEventListener('click', function () {
        _this8.changeMode('delete');
      });
      selectModeButton.addEventListener('click', function () {
        _this8.changeMode('select');
      }); // Ajout des événements pour la touche Shift

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Shift') {
          if (_this8.mode !== 'grab') {
            _this8.previousMode = _this8.mode; // Sauvegarde du mode actuel

            _this8.changeMode('grab'); // Passe en mode "grab"

          }
        }
      });
      document.addEventListener('keyup', function (event) {
        if (event.key === 'Shift' && _this8.mode === 'grab') {
          _this8.changeMode(_this8.previousMode); // Restaure le mode précédent


          _this8.previousMode = null; // Réinitialise le mode précédent
        }
      }); // Gestion du déplacement de la grille lorsque le mode "grab" est activé

      var isGrabbing = false;
      var startX, startY, scrollLeft, scrollTop;
      mapContainer.addEventListener('mousedown', function (e) {
        if (_this8.mode === 'grab') {
          isGrabbing = true;
          mapContainer.classList.add('grabbing');
          startX = e.pageX - mapContainer.offsetLeft;
          startY = e.pageY - mapContainer.offsetTop;
          scrollLeft = mapContainer.scrollLeft;
          scrollTop = mapContainer.scrollTop;
        }
      });
      mapContainer.addEventListener('mouseleave', function () {
        isGrabbing = false;
        mapContainer.classList.remove('grabbing');
      });
      mapContainer.addEventListener('mouseup', function () {
        isGrabbing = false;
        mapContainer.classList.remove('grabbing');
      });
      mapContainer.addEventListener('mousemove', function (e) {
        if (!isGrabbing) return;
        e.preventDefault();
        var x = e.pageX - mapContainer.offsetLeft;
        var y = e.pageY - mapContainer.offsetTop;
        var walkX = (x - startX) * 1.5; // Multiplicateur pour la vitesse de défilement horizontal

        var walkY = (y - startY) * 1.5; // Multiplicateur pour la vitesse de défilement vertical

        mapContainer.scrollLeft = scrollLeft - walkX;
        mapContainer.scrollTop = scrollTop - walkY;
      });
    } // Fonction pour changer le mode et mettre à jour l'interface

  }, {
    key: "changeMode",
    value: function changeMode(newMode) {
      this.mode = newMode;
      this.updateModeButtons();
      this.updateModeUI();
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
      body.classList.remove('mode-insert', 'mode-delete', 'mode-select', 'mode-grab'); // Supprime les classes de mode précédentes.

      switch (this.mode) {
        case 'play':
          banner.textContent = "Mode Play Activé";
          banner.className = "banner banner-insert";
          body.classList.add('mode-play');
          break;

        case 'insert':
          banner.textContent = "Mode Insertion Activé";
          banner.className = "banner banner-insert";
          body.classList.add('mode-insert');
          break;

        case 'delete':
          banner.textContent = "Mode Suppression Activé";
          banner.className = "banner banner-delete";
          body.classList.add('mode-delete');
          break;

        case 'select':
          banner.textContent = "Mode Sélection Activé";
          banner.className = "banner banner-select";
          body.classList.add('mode-select');
          break;

        case 'grab':
          banner.textContent = "Mode Saisie Activé";
          banner.className = "banner banner-grab";
          body.classList.add('mode-grab');
          break;

        default:
          banner.textContent = "Mode Sélection Activé";
          banner.className = "banner banner-select";
          body.classList.add('mode-select');
          break;
      }
    }
  }]);

  return RoomBuilder;
}();

exports.RoomBuilder = RoomBuilder;