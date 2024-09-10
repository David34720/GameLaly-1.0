"use strict";

var _require = require('../models'),
    Item = _require.Item,
    ItemType = _require.ItemType;

var itemController = {
  index: function index(req, res) {
    var type, filter, items, types, notification;
    return regeneratorRuntime.async(function index$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            type = req.query.type; // Récupère le type depuis les paramètres de la requête

            filter = {};

            if (type) {
              filter = {
                item_type: type
              }; // Filtre les items par type
            }

            _context.next = 5;
            return regeneratorRuntime.awrap(Item.findAll({
              where: filter,
              include: {
                model: ItemType,
                as: 'type'
              }
            }));

          case 5:
            items = _context.sent;
            _context.next = 8;
            return regeneratorRuntime.awrap(ItemType.findAll());

          case 8:
            types = _context.sent;
            // Récupère tous les types pour le filtre
            notification = req.session.notification || null;
            req.session.notification = null;
            res.render('items', {
              items: items,
              types: types,
              notification: notification,
              selectedType: type
            });

          case 12:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  add: function add(req, res) {
    var notification, types;
    return regeneratorRuntime.async(function add$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            notification = req.session.notification || null;
            req.session.notification = null;
            _context2.next = 4;
            return regeneratorRuntime.awrap(ItemType.findAll());

          case 4:
            types = _context2.sent;
            // Récupération de la liste des types d'items
            res.render('item', {
              notification: notification,
              types: types
            }); // Passez les types à la vue

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  create: function create(req, res) {
    var _req$body, name, description, item_type, effect, life, value, context, is_obstacle, is_object, itemTypeInt, effectInt, lifeInt, valueInt;

    return regeneratorRuntime.async(function create$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // route post items/create
            console.log(req.body);
            console.log(req.file); // Pour déboguer et voir les détails du fichier téléchargé

            _req$body = req.body, name = _req$body.name, description = _req$body.description, item_type = _req$body.item_type, effect = _req$body.effect, life = _req$body.life, value = _req$body.value, context = _req$body.context; // Vérifier si la case à cocher est cochée

            is_obstacle = req.body.is_obstacle === 'on';
            is_object = req.body.is_object === 'on'; // Conversion des valeurs en nombres pour les champs numériques

            itemTypeInt = parseInt(item_type, 10);
            effectInt = parseInt(effect, 10);
            lifeInt = parseInt(life, 10);
            valueInt = parseInt(value, 10); // Vérification des paramètres

            if (!(!name || !req.file || isNaN(itemTypeInt) || isNaN(effectInt) || isNaN(lifeInt) || isNaN(valueInt))) {
              _context3.next = 12;
              break;
            }

            req.session.notification = {
              message: "Tous les champs sont requis et doivent être valides.",
              level: 'error'
            };
            return _context3.abrupt("return", res.redirect('/items/add'));

          case 12:
            _context3.next = 14;
            return regeneratorRuntime.awrap(Item.create({
              name: name,
              description: description,
              img: "/img/items/".concat(req.file.filename),
              // Chemin de l'image stockée
              item_type: itemTypeInt,
              effect: effectInt,
              life: lifeInt,
              value: valueInt,
              context: context,
              is_obstacle: is_obstacle,
              // Sauvegarde de la valeur booléenne pour is_obstacle
              is_object: is_object,
              created_at: new Date(),
              updated_at: new Date()
            }));

          case 14:
            req.session.notification = {
              message: "Item ".concat(name, " cr\xE9\xE9 avec succ\xE8s"),
              level: 'success'
            }; // Redirection vers la liste des items

            res.redirect('/items');

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    });
  },
  edit: function edit(req, res) {
    var id, item, notification, types;
    return regeneratorRuntime.async(function edit$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id = req.params.id;
            console.log('ID reçu pour l\'édition :', id);
            _context4.next = 4;
            return regeneratorRuntime.awrap(Item.findByPk(id));

          case 4:
            item = _context4.sent;
            notification = null;
            _context4.next = 8;
            return regeneratorRuntime.awrap(ItemType.findAll());

          case 8:
            types = _context4.sent;
            // Récupération de la liste des types d'items
            res.render('itemEdit', {
              item: item,
              notification: notification,
              types: types
            }); // Passez les types à la vue

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    });
  },
  update: function update(req, res) {
    var id, _req$body2, name, description, item_type, effect, life, value, context, is_obstacle, is_object, itemTypeInt, effectInt, lifeInt, valueInt, item, imgPath;

    return regeneratorRuntime.async(function update$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            console.log(req.body);
            console.log(req.file);
            id = req.params.id;
            _req$body2 = req.body, name = _req$body2.name, description = _req$body2.description, item_type = _req$body2.item_type, effect = _req$body2.effect, life = _req$body2.life, value = _req$body2.value, context = _req$body2.context; // Récupérer la valeur de la case à cocher, en s'assurant que c'est un booléen

            is_obstacle = req.body.is_obstacle === 'on'; // Si coché, `is_obstacle` sera `true`, sinon `false`.

            is_object = req.body.is_object === 'on';
            itemTypeInt = parseInt(item_type, 10);
            effectInt = parseInt(effect, 10);
            lifeInt = parseInt(life, 10);
            valueInt = parseInt(value, 10);

            if (!(!name || isNaN(itemTypeInt) || isNaN(effectInt) || isNaN(lifeInt) || isNaN(valueInt))) {
              _context5.next = 14;
              break;
            }

            req.session.notification = {
              message: "Tous les champs sont requis et doivent être valides.",
              level: 'error'
            };
            console.log("Tous les champs sont requis et doivent être valides.", req.body.name);
            return _context5.abrupt("return", res.redirect("/items/edit/".concat(id)));

          case 14:
            _context5.next = 16;
            return regeneratorRuntime.awrap(Item.findByPk(id));

          case 16:
            item = _context5.sent;

            if (item) {
              _context5.next = 20;
              break;
            }

            req.session.notification = {
              message: 'Item non trouvé',
              level: 'error'
            };
            return _context5.abrupt("return", res.redirect('/items'));

          case 20:
            // Si un fichier est uploadé, on met à jour l'image
            imgPath = item.img;

            if (req.file) {
              imgPath = "/img/items/".concat(req.file.filename);
            }

            _context5.next = 24;
            return regeneratorRuntime.awrap(item.update({
              name: name,
              description: description,
              img: imgPath,
              item_type: itemTypeInt,
              effect: effectInt,
              life: lifeInt,
              value: valueInt,
              context: context,
              is_obstacle: is_obstacle,
              // Mettre à jour la valeur de `is_obstacle`
              is_object: is_object,
              // Mettre à jour la valeur de `is_object`
              updated_at: new Date()
            }));

          case 24:
            req.session.notification = {
              message: "Item ".concat(name, " mis \xE0 jour avec succ\xE8s"),
              level: 'success'
            };
            res.redirect('/items');

          case 26:
          case "end":
            return _context5.stop();
        }
      }
    });
  },
  duplicate: function duplicate(req, res) {
    var id, item, newItem, notification;
    return regeneratorRuntime.async(function duplicate$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            id = req.params.id;
            _context6.next = 3;
            return regeneratorRuntime.awrap(Item.findByPk(id));

          case 3:
            item = _context6.sent;

            if (item) {
              _context6.next = 7;
              break;
            }

            req.session.notification = {
              message: 'Item non trouvé',
              level: 'error'
            };
            return _context6.abrupt("return", res.redirect('/items'));

          case 7:
            _context6.next = 9;
            return regeneratorRuntime.awrap(Item.create({
              name: item.name + ' (copie)',
              description: item.description,
              img: item.img,
              item_type: item.item_type,
              effect: item.effect,
              life: item.life,
              value: item.value,
              context: item.context,
              is_obstacle: item.is_obstacle,
              is_object: item.is_object,
              created_at: new Date(),
              updated_at: new Date()
            }));

          case 9:
            newItem = _context6.sent;
            req.session.notification = {
              message: "Item ".concat(item.name, " duppliqu\xE9 avec succ\xE8s"),
              level: 'success'
            };
            notification = req.session.notification || null;
            req.session.notification = null;
            res.render('itemEdit', {
              item: newItem,
              notification: notification
            });

          case 14:
          case "end":
            return _context6.stop();
        }
      }
    });
  },
  destroy: function destroy(req, res) {
    var id;
    return regeneratorRuntime.async(function destroy$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            id = req.params.id;
            _context7.next = 3;
            return regeneratorRuntime.awrap(Item.destroy({
              where: {
                id: id
              }
            }));

          case 3:
            req.session.notification = {
              message: 'Item supprimé avec succès',
              level: 'success'
            };
            res.redirect('/items');

          case 5:
          case "end":
            return _context7.stop();
        }
      }
    });
  },
  types: function types(req, res) {
    var types, notification;
    return regeneratorRuntime.async(function types$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return regeneratorRuntime.awrap(ItemType.findAll());

          case 2:
            types = _context8.sent;
            notification = null;
            res.render('itemTypes', {
              types: types,
              notification: notification
            });

          case 5:
          case "end":
            return _context8.stop();
        }
      }
    });
  },
  updateTypes: function updateTypes(req, res) {
    var id, name, type;
    return regeneratorRuntime.async(function updateTypes$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            id = req.params.id;
            name = req.body.name;
            _context9.next = 4;
            return regeneratorRuntime.awrap(ItemType.findByPk(id));

          case 4:
            type = _context9.sent;

            if (type) {
              _context9.next = 8;
              break;
            }

            req.session.notification = {
              message: 'Type non trouvé',
              level: 'error'
            };
            return _context9.abrupt("return", res.redirect('/items/types'));

          case 8:
            _context9.next = 10;
            return regeneratorRuntime.awrap(type.update({
              name: name
            }));

          case 10:
            req.session.notification = {
              message: "Type ".concat(name, " mis \xE0 jour avec succ\xE8s"),
              level: 'success'
            };
            res.redirect('/items/types');

          case 12:
          case "end":
            return _context9.stop();
        }
      }
    });
  },
  createTypes: function createTypes(req, res) {
    var name;
    return regeneratorRuntime.async(function createTypes$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            name = req.body.name;
            console.log("Données reçues pour createTypes:", req.body);

            if (name) {
              _context10.next = 5;
              break;
            }

            req.session.notification = {
              message: "Tous les champs sont requis et doivent être valides.",
              level: 'error'
            };
            return _context10.abrupt("return", res.redirect('/items/types'));

          case 5:
            _context10.next = 7;
            return regeneratorRuntime.awrap(ItemType.create({
              name: name
            }));

          case 7:
            req.session.notification = {
              message: "Type ".concat(name, " ajout\xE9 avec succ\xE8s"),
              level: 'success'
            };
            res.redirect('/items/types');

          case 9:
          case "end":
            return _context10.stop();
        }
      }
    });
  },
  destroyTypes: function destroyTypes(req, res) {
    var id;
    return regeneratorRuntime.async(function destroyTypes$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            id = req.params.id;
            _context11.next = 3;
            return regeneratorRuntime.awrap(ItemType.destroy({
              where: {
                id: id
              }
            }));

          case 3:
            req.session.notification = {
              message: 'Type supprimé avec succès',
              level: 'success'
            };
            res.redirect('/items/types');

          case 5:
          case "end":
            return _context11.stop();
        }
      }
    });
  }
};
module.exports = {
  itemController: itemController
};