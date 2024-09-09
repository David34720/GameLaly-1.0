"use strict";

var _require = require('../models'),
    Room = _require.Room,
    Cell = _require.Cell,
    Item = _require.Item,
    User = _require.User,
    Level = _require.Level,
    Message = _require.Message;

var _require2 = require('../db/sequelize'),
    sequelizeConnection = _require2.sequelizeConnection;

var roomController = {
  index: function index(req, res) {
    var rooms, notification;
    return regeneratorRuntime.async(function index$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(Room.findAll());

          case 2:
            rooms = _context.sent;
            notification = req.session.notification || null;
            req.session.notification = null;
            res.render('rooms', {
              rooms: rooms,
              notification: notification
            });

          case 6:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  add: function add(req, res) {
    var map_id, isFirst, qtyRoomWithMapId, room, user, playerData, itemsData, notification;
    return regeneratorRuntime.async(function add$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            map_id = req.params.map_id;
            isFirst = true;
            _context2.next = 4;
            return regeneratorRuntime.awrap(Room.count({
              where: {
                map_id: map_id
              }
            }));

          case 4:
            qtyRoomWithMapId = _context2.sent;

            if (qtyRoomWithMapId > 0) {
              isFirst = false;
            }

            _context2.next = 8;
            return regeneratorRuntime.awrap(Room.create({
              name: "Nouvelle pièce",
              description: "Description de la nouvelle carte",
              map_id: map_id,
              first_room: isFirst,
              cell_size: 30,
              nb_rows: 10,
              nb_cols: 10,
              start_x: 0,
              start_y: 0,
              img_bg: "",
              color_bg: "#FFFFFF"
            }));

          case 8:
            room = _context2.sent;
            _context2.next = 11;
            return regeneratorRuntime.awrap(User.findByPk(req.session.user.id));

          case 11:
            user = _context2.sent;
            playerData = {
              pos_x: room.start_x,
              pos_y: room.start_y,
              img: user ? user.img : 'default-image.png'
            };
            _context2.next = 15;
            return regeneratorRuntime.awrap(Item.findAll());

          case 15:
            itemsData = _context2.sent;
            notification = req.session.notification || null;
            req.session.notification = null;
            res.render("rooms", {
              room: room,
              notification: notification,
              playerData: playerData,
              cells: [],
              itemsData: itemsData
            });

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  create: function create(req, res) {
    return regeneratorRuntime.async(function create$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            req.session.notification = {
              message: 'Carte créée avec succès',
              level: 'success'
            };
            _context3.next = 3;
            return regeneratorRuntime.awrap(Map.create({
              name: req.body.name,
              description: req.body.description,
              users_id: 1,
              level_id: 1
            }));

          case 3:
            res.redirect('/map/add');

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    });
  },
  edit: function edit(req, res) {
    var id, itemsData, room, user, playerData, cells, notification;
    return regeneratorRuntime.async(function edit$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id = req.params.id;
            _context4.next = 3;
            return regeneratorRuntime.awrap(Item.findAll());

          case 3:
            itemsData = _context4.sent;
            _context4.next = 6;
            return regeneratorRuntime.awrap(Room.findByPk(id, {
              include: [{
                model: Cell,
                as: 'cells'
              }]
            }));

          case 6:
            room = _context4.sent;

            if (room) {
              _context4.next = 10;
              break;
            }

            req.session.notification = {
              message: 'Room not found',
              level: 'danger'
            };
            return _context4.abrupt("return", res.redirect('/rooms'));

          case 10:
            _context4.next = 12;
            return regeneratorRuntime.awrap(User.findByPk(req.session.user.id));

          case 12:
            user = _context4.sent;
            playerData = {
              pos_x: room.start_x,
              pos_y: room.start_y,
              img: user ? user.img : 'default-image.png'
            };
            console.log('playerData', playerData);
            cells = room.cells;
            notification = null;
            res.render('rooms', {
              itemsData: itemsData,
              room: room,
              cells: cells,
              notification: notification,
              playerData: playerData
            });

          case 18:
          case "end":
            return _context4.stop();
        }
      }
    });
  },
  update: function update(req, res) {
    var _req$body, name, description, map_id, first_room, cell_size, nb_rows, nb_cols, start_x, start_y, img_bg, color_bg, id;

    return regeneratorRuntime.async(function update$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _req$body = req.body, name = _req$body.name, description = _req$body.description, map_id = _req$body.map_id, first_room = _req$body.first_room, cell_size = _req$body.cell_size, nb_rows = _req$body.nb_rows, nb_cols = _req$body.nb_cols, start_x = _req$body.start_x, start_y = _req$body.start_y, img_bg = _req$body.img_bg, color_bg = _req$body.color_bg;
            id = req.params.id;
            req.session.notification = {
              message: 'Room modifiée avec succès',
              level: 'success'
            };
            _context5.next = 5;
            return regeneratorRuntime.awrap(Room.update({
              name: name,
              description: description,
              map_id: map_id,
              first_room: first_room,
              cell_size: cell_size,
              nb_rows: nb_rows,
              nb_cols: nb_cols,
              start_x: start_x,
              start_y: start_y,
              img_bg: img_bg,
              color_bg: color_bg,
              updated_at: new Date()
            }, {
              where: {
                id: id
              }
            }));

          case 5:
            res.redirect('/rooms/edit/' + id);

          case 6:
          case "end":
            return _context5.stop();
        }
      }
    });
  },
  duplicate: function duplicate(req, res) {
    var id, room, newRoom;
    return regeneratorRuntime.async(function duplicate$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            id = req.params.id;
            _context6.next = 3;
            return regeneratorRuntime.awrap(Room.findByPk(id));

          case 3:
            room = _context6.sent;
            _context6.next = 6;
            return regeneratorRuntime.awrap(Room.create({
              name: room.name + " - Copie",
              description: room.description,
              map_id: room.map_id,
              first_room: false,
              cell_size: room.cell_size,
              nb_rows: room.nb_rows,
              nb_cols: room.nb_cols,
              start_x: room.start_x,
              start_y: room.start_y,
              img_bg: room.img_bg,
              color_bg: room.color_bg
            }));

          case 6:
            newRoom = _context6.sent;
            res.redirect('/rooms/edit/' + newRoom.id);

          case 8:
          case "end":
            return _context6.stop();
        }
      }
    });
  },
  destroy: function destroy(req, res) {
    var id, transaction;
    return regeneratorRuntime.async(function destroy$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            id = req.params.id;
            _context7.next = 3;
            return regeneratorRuntime.awrap(sequelizeConnection().transaction());

          case 3:
            transaction = _context7.sent;
            _context7.prev = 4;
            _context7.next = 7;
            return regeneratorRuntime.awrap(Cell.destroy({
              where: {
                room_id_link: id
              },
              transaction: transaction
            }));

          case 7:
            _context7.next = 9;
            return regeneratorRuntime.awrap(Cell.destroy({
              where: {
                room_id: id
              },
              transaction: transaction
            }));

          case 9:
            _context7.next = 11;
            return regeneratorRuntime.awrap(Room.destroy({
              where: {
                id: id
              },
              transaction: transaction
            }));

          case 11:
            _context7.next = 13;
            return regeneratorRuntime.awrap(transaction.commit());

          case 13:
            req.session.notification = {
              message: 'Room supprimée avec succès',
              level: 'success'
            };
            _context7.next = 22;
            break;

          case 16:
            _context7.prev = 16;
            _context7.t0 = _context7["catch"](4);
            _context7.next = 20;
            return regeneratorRuntime.awrap(transaction.rollback());

          case 20:
            console.error('Failed to delete room:', _context7.t0);
            req.session.notification = {
              message: 'Erreur lors de la suppression de la Room',
              level: 'danger'
            };

          case 22:
            res.redirect('/map/add');

          case 23:
          case "end":
            return _context7.stop();
        }
      }
    }, null, null, [[4, 16]]);
  },
  store: function store(req, res) {
    var name;
    return regeneratorRuntime.async(function store$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            name = req.body.name;
            _context8.next = 3;
            return regeneratorRuntime.awrap(Level.create({
              name: name
            }));

          case 3:
            res.redirect('/levels');

          case 4:
          case "end":
            return _context8.stop();
        }
      }
    });
  },
  saveCells: function saveCells(req, res) {
    var cellsData, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, cellData;

    return regeneratorRuntime.async(function saveCells$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            cellsData = req.body;
            console.log('saveCellControler', cellsData);

            if (Array.isArray(cellsData)) {
              _context9.next = 4;
              break;
            }

            return _context9.abrupt("return", res.status(400).json({
              error: 'Les données envoyées doivent être un tableau.'
            }));

          case 4:
            _context9.prev = 4;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context9.prev = 8;
            _iterator = cellsData[Symbol.iterator]();

          case 10:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context9.next = 19;
              break;
            }

            cellData = _step.value;
            _context9.next = 14;
            return regeneratorRuntime.awrap(Cell.destroy({
              where: {
                room_id: cellData.room_id,
                layer_type: cellData.layer_type,
                pos_x: cellData.pos_x,
                pos_y: cellData.pos_y
              }
            }));

          case 14:
            _context9.next = 16;
            return regeneratorRuntime.awrap(Cell.create({
              room_id: cellData.room_id,
              layer_type: cellData.layer_type,
              pos_x: cellData.pos_x,
              pos_y: cellData.pos_y,
              item_id: cellData.item_id,
              width: cellData.width || 1,
              // Largeur par défaut à 1
              height: cellData.height || 1,
              // Hauteur par défaut à 1
              offset_x: cellData.offset_x || 0,
              offset_y: cellData.offset_y || 0
            }));

          case 16:
            _iteratorNormalCompletion = true;
            _context9.next = 10;
            break;

          case 19:
            _context9.next = 25;
            break;

          case 21:
            _context9.prev = 21;
            _context9.t0 = _context9["catch"](8);
            _didIteratorError = true;
            _iteratorError = _context9.t0;

          case 25:
            _context9.prev = 25;
            _context9.prev = 26;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 28:
            _context9.prev = 28;

            if (!_didIteratorError) {
              _context9.next = 31;
              break;
            }

            throw _iteratorError;

          case 31:
            return _context9.finish(28);

          case 32:
            return _context9.finish(25);

          case 33:
            res.status(200).json({
              message: 'Cellules sauvegardées avec succès'
            });
            _context9.next = 40;
            break;

          case 36:
            _context9.prev = 36;
            _context9.t1 = _context9["catch"](4);
            console.error('Erreur lors de la sauvegarde des cellules:', _context9.t1);
            res.status(500).json({
              error: 'Erreur lors de la sauvegarde des cellules.'
            });

          case 40:
          case "end":
            return _context9.stop();
        }
      }
    }, null, null, [[4, 36], [8, 21, 25, 33], [26,, 28, 32]]);
  },
  // Méthode pour mettre à jour une cellule, incluant la gestion de la largeur et de la hauteur
  updateCell: function updateCell(req, res) {
    var _req$body2, cell_id, layer_type, pos_x, pos_y, item_id, width, height, offset_x, offset_y, cell;

    return regeneratorRuntime.async(function updateCell$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.prev = 0;
            console.log('Update cell data received:', req.body);
            _req$body2 = req.body, cell_id = _req$body2.cell_id, layer_type = _req$body2.layer_type, pos_x = _req$body2.pos_x, pos_y = _req$body2.pos_y, item_id = _req$body2.item_id, width = _req$body2.width, height = _req$body2.height, offset_x = _req$body2.offset_x, offset_y = _req$body2.offset_y;
            _context10.next = 5;
            return regeneratorRuntime.awrap(Cell.findOne({
              where: {
                id: cell_id
              }
            }));

          case 5:
            cell = _context10.sent;

            if (cell) {
              _context10.next = 8;
              break;
            }

            return _context10.abrupt("return", res.status(404).json({
              error: 'Cellule non trouvée'
            }));

          case 8:
            _context10.next = 10;
            return regeneratorRuntime.awrap(cell.update({
              item_id: item_id || null,
              width: width || 1,
              height: height || 1,
              layer_type: layer_type || 'element',
              pos_x: pos_x || 0,
              pos_y: pos_y || 0,
              offset_x: offset_x || 0,
              offset_y: offset_y || 0
            }));

          case 10:
            res.status(200).json({
              message: 'Cellule mise à jour avec succès'
            });
            _context10.next = 17;
            break;

          case 13:
            _context10.prev = 13;
            _context10.t0 = _context10["catch"](0);
            console.error('Erreur lors de la mise à jour de la cellule:', _context10.t0);
            res.status(500).json({
              error: 'Erreur lors de la mise à jour de la cellule.'
            });

          case 17:
          case "end":
            return _context10.stop();
        }
      }
    }, null, null, [[0, 13]]);
  },
  getMessagesForRoom: function getMessagesForRoom(req, res) {
    var room_id, messagesWithCellIds;
    return regeneratorRuntime.async(function getMessagesForRoom$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            room_id = req.params.room_id;
            _context11.prev = 1;
            _context11.next = 4;
            return regeneratorRuntime.awrap(Message.findAll({
              include: [{
                model: Cell,
                as: 'cell',
                where: {
                  room_id: room_id // Filtrer par room_id dans les cellules associées

                },
                attributes: ['id'] // Ne récupérer que l'ID de la cellule

              }]
            }));

          case 4:
            messagesWithCellIds = _context11.sent;

            if (messagesWithCellIds.length) {
              _context11.next = 7;
              break;
            }

            return _context11.abrupt("return", res.status(200).json([]));

          case 7:
            return _context11.abrupt("return", res.status(200).json(messagesWithCellIds));

          case 10:
            _context11.prev = 10;
            _context11.t0 = _context11["catch"](1);
            console.error('Erreur lors de la récupération des messages pour la salle:', _context11.t0);
            return _context11.abrupt("return", res.status(500).json({
              error: 'Erreur serveur lors de la récupération des messages'
            }));

          case 14:
          case "end":
            return _context11.stop();
        }
      }
    }, null, null, [[1, 10]]);
  },
  getMessageForCell: function getMessageForCell(req, res) {
    var cell_id, cellWithMessage;
    return regeneratorRuntime.async(function getMessageForCell$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            cell_id = req.params.cell_id;
            _context12.prev = 1;
            _context12.next = 4;
            return regeneratorRuntime.awrap(Cell.findOne({
              where: {
                id: cell_id
              },
              include: [{
                model: Message,
                as: 'message',
                // S'assurer que l'alias est correct
                attributes: ['id', 'text', 'created_at', 'updated_at'] // Sélectionner les attributs pertinents du message

              }]
            }));

          case 4:
            cellWithMessage = _context12.sent;

            if (!(!cellWithMessage || !cellWithMessage.message)) {
              _context12.next = 7;
              break;
            }

            return _context12.abrupt("return", res.status(200).json({
              text: ''
            }));

          case 7:
            res.status(200).json(cellWithMessage.message); // Retourne le message s'il existe

            _context12.next = 14;
            break;

          case 10:
            _context12.prev = 10;
            _context12.t0 = _context12["catch"](1);
            console.error('Erreur lors de la récupération du message pour la cellule :', _context12.t0);
            res.status(500).json({
              error: 'Erreur serveur lors de la récupération du message'
            });

          case 14:
          case "end":
            return _context12.stop();
        }
      }
    }, null, null, [[1, 10]]);
  },
  updateCellMessage: function updateCellMessage(req, res) {
    var _req$body3, cell_id, messageContent, cell, message, newMessage;

    return regeneratorRuntime.async(function updateCellMessage$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.prev = 0;
            _req$body3 = req.body, cell_id = _req$body3.cell_id, messageContent = _req$body3.messageContent; // Vérification des données nécessaires

            if (!(!cell_id || typeof messageContent !== 'string')) {
              _context13.next = 4;
              break;
            }

            return _context13.abrupt("return", res.status(400).json({
              error: 'cell_id et messageContent sont requis et valides.'
            }));

          case 4:
            _context13.next = 6;
            return regeneratorRuntime.awrap(Cell.findByPk(cell_id));

          case 6:
            cell = _context13.sent;

            if (cell) {
              _context13.next = 9;
              break;
            }

            return _context13.abrupt("return", res.status(404).json({
              error: 'Cellule non trouvée.'
            }));

          case 9:
            if (!cell.message_id) {
              _context13.next = 23;
              break;
            }

            _context13.next = 12;
            return regeneratorRuntime.awrap(Message.findByPk(cell.message_id));

          case 12:
            message = _context13.sent;

            if (!message) {
              _context13.next = 20;
              break;
            }

            _context13.next = 16;
            return regeneratorRuntime.awrap(message.update({
              text: messageContent
            }));

          case 16:
            console.log('Message mis à jour:', message);
            res.status(200).json({
              message: 'Message mis à jour avec succès',
              messageData: message
            });
            _context13.next = 21;
            break;

          case 20:
            return _context13.abrupt("return", res.status(404).json({
              error: 'Message non trouvé.'
            }));

          case 21:
            _context13.next = 30;
            break;

          case 23:
            _context13.next = 25;
            return regeneratorRuntime.awrap(Message.create({
              text: messageContent
            }));

          case 25:
            newMessage = _context13.sent;
            _context13.next = 28;
            return regeneratorRuntime.awrap(cell.update({
              message_id: newMessage.id
            }));

          case 28:
            console.log('Nouveau message créé:', newMessage);
            res.status(200).json({
              message: 'Message créé et associé à la cellule avec succès',
              messageData: newMessage
            });

          case 30:
            _context13.next = 36;
            break;

          case 32:
            _context13.prev = 32;
            _context13.t0 = _context13["catch"](0);
            console.error('Erreur lors de la mise à jour du message:', _context13.t0);
            res.status(500).json({
              error: 'Erreur lors de la mise à jour du message.'
            });

          case 36:
          case "end":
            return _context13.stop();
        }
      }
    }, null, null, [[0, 32]]);
  },
  deleteCells: function deleteCells(req, res) {
    var cellsData, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, cellData;

    return regeneratorRuntime.async(function deleteCells$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            cellsData = req.body;

            if (Array.isArray(cellsData)) {
              _context14.next = 3;
              break;
            }

            return _context14.abrupt("return", res.status(400).json({
              error: 'Les données envoyées doivent être un tableau.'
            }));

          case 3:
            _context14.prev = 3;
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context14.prev = 7;
            _iterator2 = cellsData[Symbol.iterator]();

          case 9:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context14.next = 16;
              break;
            }

            cellData = _step2.value;
            _context14.next = 13;
            return regeneratorRuntime.awrap(Cell.destroy({
              where: {
                room_id: cellData.room_id,
                pos_x: cellData.pos_x,
                pos_y: cellData.pos_y,
                id: cellData.cell_id,
                layer_type: cellData.layer_type
              }
            }));

          case 13:
            _iteratorNormalCompletion2 = true;
            _context14.next = 9;
            break;

          case 16:
            _context14.next = 22;
            break;

          case 18:
            _context14.prev = 18;
            _context14.t0 = _context14["catch"](7);
            _didIteratorError2 = true;
            _iteratorError2 = _context14.t0;

          case 22:
            _context14.prev = 22;
            _context14.prev = 23;

            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }

          case 25:
            _context14.prev = 25;

            if (!_didIteratorError2) {
              _context14.next = 28;
              break;
            }

            throw _iteratorError2;

          case 28:
            return _context14.finish(25);

          case 29:
            return _context14.finish(22);

          case 30:
            res.status(200).json({
              message: 'Cellules supprimées avec succès'
            });
            _context14.next = 37;
            break;

          case 33:
            _context14.prev = 33;
            _context14.t1 = _context14["catch"](3);
            console.error('Erreur lors de la suppression des cellules:', _context14.t1);
            res.status(500).json({
              error: 'Erreur lors de la suppression des cellules.'
            });

          case 37:
          case "end":
            return _context14.stop();
        }
      }
    }, null, null, [[3, 33], [7, 18, 22, 30], [23,, 25, 29]]);
  },
  updateUserImg: function updateUserImg(req, res) {
    var img, userId;
    return regeneratorRuntime.async(function updateUserImg$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            img = req.body.img;
            userId = req.session.user.id;
            _context15.next = 4;
            return regeneratorRuntime.awrap(User.update({
              img: img
            }, {
              where: {
                id: userId
              }
            }));

          case 4:
            res.json({
              success: true
            });

          case 5:
          case "end":
            return _context15.stop();
        }
      }
    });
  },
  getCharacterSelection: function getCharacterSelection(req, res) {
    var characters;
    return regeneratorRuntime.async(function getCharacterSelection$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.next = 2;
            return regeneratorRuntime.awrap(Item.findAll({
              where: {
                item_type: 9
              }
            }));

          case 2:
            characters = _context16.sent;
            res.json({
              success: true,
              characters: characters
            });

          case 4:
          case "end":
            return _context16.stop();
        }
      }
    });
  }
};
module.exports = {
  roomController: roomController
};