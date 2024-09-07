"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameEngine = void 0;

var _RoomGenerator = require("./RoomGenerator.js");

var _ItemManager = require("./ItemManager.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GameEngine =
/*#__PURE__*/
function () {
  function GameEngine(config) {
    _classCallCheck(this, GameEngine);

    if (!config) {
      throw new Error('GameEngine configuration is required.');
    }

    this.config = config;
    this.currentRoom = null;
    this.itemManager = null;
    this.player = null;
    this.moveDelay = 200; // Délai en ms entre les mouvements

    this.lastMoveTime = 0; // Dernière fois que le joueur s'est déplacé
  }

  _createClass(GameEngine, [{
    key: "initializeGame",
    value: function initializeGame() {
      return regeneratorRuntime.async(function initializeGame$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(this.initializeRooms());

            case 2:
              // Attendre que la salle soit complètement générée
              this.initializeItems();
              this.initializePlayer();
              this.startGame();

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "initializeRooms",
    value: function initializeRooms() {
      if (!this.config || !this.config.initialRoomData) {
        throw new Error('Initial room data is missing in the configuration.');
      }

      console.log("Initial room data:", this.config.initialRoomData);
      var roomData = this.config.initialRoomData;
      var itemsData = this.config.itemsData || [];
      var roomGenerator = new _RoomGenerator.RoomGenerator(roomData, itemsData); // Passez la configuration de GameEngine ici

      this.currentRoom = roomGenerator.generateRoom(this.config);
    }
  }, {
    key: "generateRoomAsync",
    value: function generateRoomAsync(roomGenerator) {
      return new Promise(function (resolve, reject) {
        try {
          var room = roomGenerator.generateRoom();
          console.log("Room generated successfully:", room);
          resolve(room);
        } catch (error) {
          console.error("Erreur lors de la génération de la salle:", error);
          reject(error);
        }
      });
    }
  }, {
    key: "initializeItems",
    value: function initializeItems() {
      var itemsData = this.config.itemsData;
      this.itemManager = new _ItemManager.ItemManager(itemsData);
      this.itemManager.initializeItems();
    }
  }, {
    key: "initializePlayer",
    value: function initializePlayer() {
      var playerData = this.config.playerData;
      console.log("Initializing player with data:", playerData);
      this.player = {
        x: playerData.pos_x,
        y: playerData.pos_y,
        img: playerData.img || 'default-image.png',
        // Assurez-vous que l'image est définie
        life: 100,
        inventory: []
      };

      if (this.player.x == null || this.player.y == null) {
        console.error('Error: Player position is undefined or invalid', this.player);
      }

      this.renderPlayer();
    }
  }, {
    key: "startGame",
    value: function startGame() {
      if (!this.currentRoom) {
        console.error("Impossible de démarrer le jeu: la salle n'est pas encore prête.");
        return;
      }

      console.log("Démarrage du jeu avec la salle:", this.currentRoom);
      this.config.mode = 'play'; // Assurez-vous que le mode est défini sur "play"

      this.renderGame();
      this.bindEvents();
    }
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      var _this = this;

      document.addEventListener("keydown", function (event) {
        return _this.handleKeydown(event);
      });
      console.log("Event listener for keydown attached"); // Ajout de ce log pour confirmer l'attachement
    }
  }, {
    key: "handleKeydown",
    value: function handleKeydown(event) {
      var currentTime = Date.now();

      if (currentTime - this.lastMoveTime < this.moveDelay) {
        return; // Trop tôt pour un autre mouvement
      } // Enregistre le temps du dernier mouvement


      this.lastMoveTime = currentTime; // Vérifiez si le mode actuel est "play" avant de permettre le déplacement du joueur

      if (this.config.mode !== 'play') {
        return;
      } // Empêche le comportement par défaut des touches fléchées


      switch (event.key) {
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
          event.preventDefault(); // Empêche le défilement de la page

          break;

        default:
          break;
      }

      switch (event.key) {
        case "ArrowUp":
          this.movePlayer(0, -1);
          break;

        case "ArrowDown":
          this.movePlayer(0, 1);
          break;

        case "ArrowLeft":
          this.movePlayer(-1, 0);
          break;

        case "ArrowRight":
          this.movePlayer(1, 0);
          break;

        default:
          break;
      }
    }
  }, {
    key: "movePlayer",
    value: function movePlayer(deltaX, deltaY) {
      var _this2 = this;

      var newX = this.player.x + deltaX;
      var newY = this.player.y + deltaY;

      if (this.isPositionValid(newX, newY)) {
        this.clearCell(this.player.x, this.player.y); // Restaurer la cellule à son état initial

        this.updateSpritePosition(deltaX, deltaY, function () {
          _this2.player.x = newX;
          _this2.player.y = newY;

          _this2.renderPlayer(); // Afficher le joueur à la nouvelle position
          // Garder le joueur centré si nécessaire


          _this2.centerPlayerInView();
        });
      } else {
        console.log("Mouvement invalide");
      }
    }
  }, {
    key: "centerPlayerInView",
    value: function centerPlayerInView() {
      var playerElement = document.getElementById("player-element");
      var mapContainer = document.getElementById("map-container");
      var containerRect = mapContainer.getBoundingClientRect();
      var playerRect = playerElement.getBoundingClientRect();
      var thresholdX = containerRect.width * 0.2; // 20% du conteneur pour l'axe X

      var thresholdY = containerRect.height * 0.2; // 20% du conteneur pour l'axe Y
      // Si le joueur est à moins de 20% du bord gauche ou droit, scroll horizontalement

      if (playerRect.left - containerRect.left < thresholdX) {
        mapContainer.scrollLeft -= thresholdX - (playerRect.left - containerRect.left);
      } else if (containerRect.right - playerRect.right < thresholdX) {
        mapContainer.scrollLeft += thresholdX - (containerRect.right - playerRect.right);
      } // Si le joueur est à moins de 20% du bord haut ou bas, scroll verticalement


      if (playerRect.top - containerRect.top < thresholdY) {
        mapContainer.scrollTop -= thresholdY - (playerRect.top - containerRect.top);
      } else if (containerRect.bottom - playerRect.bottom < thresholdY) {
        mapContainer.scrollTop += thresholdY - (containerRect.bottom - playerRect.bottom);
      }
    }
  }, {
    key: "updateSpritePosition",
    value: function updateSpritePosition(deltaX, deltaY, callback) {
      var playerElement = document.getElementById("player-element");
      var cellWidth = this.config.initialRoomData.cell_size;
      var spriteCount = 2; // Nombre de sprites en largeur dans le sprite sheet

      playerElement.style.width = "".concat(cellWidth, "px");
      playerElement.style.height = "".concat(cellWidth, "px");
      playerElement.style.backgroundSize = "".concat(spriteCount * cellWidth, "px auto");
      var offsetX = 0;
      var offsetY = 0;

      if (deltaX === 1) {
        // Droite
        offsetX = cellWidth / 2;
        playerElement.style.backgroundPosition = "-".concat(cellWidth * 1, "px -").concat(cellWidth * 2, "px");
      } else if (deltaX === -1) {
        // Gauche
        offsetX = -cellWidth / 2;
        playerElement.style.backgroundPosition = "-".concat(cellWidth * 1, "px -").concat(cellWidth * 1, "px");
      } else if (deltaY === -1) {
        // Haut
        offsetY = -cellWidth / 2;
        playerElement.style.backgroundPosition = "-".concat(cellWidth * 1, "px -").concat(cellWidth * 3, "px");
      } else if (deltaY === 1) {
        // Bas
        offsetY = cellWidth / 2;
        playerElement.style.backgroundPosition = "-".concat(cellWidth * 1, "px -").concat(cellWidth * 0, "px");
      } // Déplacer l'élément de 50% de la largeur ou hauteur de la cellule


      playerElement.style.transform = "translate(".concat(offsetX, "px, ").concat(offsetY, "px)"); // Remettre le sprite à sa position finale après un court délai

      setTimeout(function () {
        playerElement.style.transform = 'translate(0, 0)'; // Changer la frame pour la deuxième partie du mouvement

        if (deltaX === 1) {
          playerElement.style.backgroundPosition = "-".concat(cellWidth * 0, "px -").concat(cellWidth * 2, "px");
        } else if (deltaX === -1) {
          playerElement.style.backgroundPosition = "-".concat(cellWidth * 0, "px -").concat(cellWidth * 1, "px");
        } else if (deltaY === -1) {
          playerElement.style.backgroundPosition = "-".concat(cellWidth * 0, "px -").concat(cellWidth * 3, "px");
        } else if (deltaY === 1) {
          playerElement.style.backgroundPosition = "-".concat(cellWidth * 0, "px -").concat(cellWidth * 0, "px");
        } // Appeler le callback pour mettre à jour la position réelle après l'animation


        if (callback) {
          callback();
        }
      }, this.moveDelay / 2); // Délai pour la transition intermédiaire
    }
  }, {
    key: "isPositionValid",
    value: function isPositionValid(x, y) {
      return x >= 0 && x < this.currentRoom.roomData.nb_cols && y >= 0 && y < this.currentRoom.roomData.nb_rows;
    }
  }, {
    key: "clearCell",
    value: function clearCell(x, y) {
      // Logique pour restaurer la cellule à son état initial après que le joueur l'a traversée
      this.currentRoom.updateCellAppearance({
        posX: x,
        posY: y,
        exists: false,
        // Ou remettre l'état initial
        item: null,
        message: null
      });
    }
  }, {
    key: "renderGame",
    value: function renderGame() {
      this.currentRoom.renderMap();
      this.renderPlayer();
    }
  }, {
    key: "renderPlayer",
    value: function renderPlayer() {
      var playerElement = document.getElementById("player-element");

      if (!playerElement) {
        playerElement = document.createElement("div");
        playerElement.id = "player-element";
        playerElement.style.position = "absolute";
        playerElement.style.width = "".concat(this.currentRoom.roomData.cell_size, "px");
        playerElement.style.height = "".concat(this.currentRoom.roomData.cell_size, "px"); // Appliquer l'image de fond

        playerElement.style.backgroundImage = "url(".concat(this.player.img, ")"); // Ajuster la taille du sprite à la taille de la cellule
        // Le sprite original fait 2000px de large pour 10 sprites, donc chaque sprite fait 200px de large.
        // Nous devons redimensionner le sprite entier pour qu'il s'adapte à la cellule de 50px de large.

        var scale = this.currentRoom.roomData.cell_size / 50; // 50/200 = 0.25

        var newBackgroundSize = "".concat(100 * scale, "px auto"); // Redimensionner la largeur totale

        playerElement.style.backgroundSize = newBackgroundSize; // Positionner pour afficher le premier sprite (coin supérieur gauche)

        playerElement.style.backgroundPosition = "0 0"; // Sélection de la première figurine

        var mapContainer = document.getElementById("map-container");
        mapContainer.appendChild(playerElement);
      } // Mettre à jour la position du joueur


      playerElement.style.left = "".concat(this.player.x * this.currentRoom.roomData.cell_size, "px");
      playerElement.style.top = "".concat(this.player.y * this.currentRoom.roomData.cell_size, "px");
    }
  }]);

  return GameEngine;
}();

exports.GameEngine = GameEngine;