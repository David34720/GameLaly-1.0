"use strict";

var _require = require('../models'),
    Map = _require.Map,
    Room = _require.Room,
    Cell = _require.Cell;

var mapController = {
  index: function index(req, res) {
    var maps, notification;
    return regeneratorRuntime.async(function index$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(Map.findAll());

          case 2:
            maps = _context.sent;
            notification = req.session.notification || null;
            req.session.notification = null;
            res.render('maps', {
              maps: maps,
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
    var maps, notification;
    return regeneratorRuntime.async(function add$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // route get map/add
            console.log("route maps/add");
            _context2.next = 3;
            return regeneratorRuntime.awrap(Map.findAll({
              include: {
                model: Room,
                as: 'rooms',
                include: {
                  model: Cell,
                  as: 'cells',
                  include: {
                    model: Room,
                    as: 'linkedRoom'
                  }
                }
              }
            }));

          case 3:
            maps = _context2.sent;
            console.log('maps:', JSON.stringify(maps, null, 2));
            notification = req.session.notification || null;
            req.session.notification = null;
            res.render('maps', {
              maps: maps,
              notification: notification
            });

          case 8:
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
            // route post map/create
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
    var id, map, notification;
    return regeneratorRuntime.async(function edit$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id = req.params.id;
            _context4.next = 3;
            return regeneratorRuntime.awrap(Map.findByPk(id));

          case 3:
            map = _context4.sent;
            notification = null;
            res.render('mapEdit', {
              map: map,
              notification: notification
            });

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    });
  },
  update: function update(req, res) {
    var _req$body, name, description, id;

    return regeneratorRuntime.async(function update$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            // ! On devrait valider name, on ne sert jamais d'une donnée qui vient d'un client sans la valider
            _req$body = req.body, name = _req$body.name, description = _req$body.description;
            id = req.params.id;
            req.session.notification = {
              message: 'Carte modifiée avec succès',
              level: 'success'
            };
            _context5.next = 5;
            return regeneratorRuntime.awrap(Map.update({
              name: name,
              description: description,
              users_id: 1,
              level_id: 1
            }, {
              where: {
                id: id
              }
            }));

          case 5:
            res.redirect('/map/add');

          case 6:
          case "end":
            return _context5.stop();
        }
      }
    });
  },
  destroy: function destroy(req, res) {
    var id;
    return regeneratorRuntime.async(function destroy$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            id = req.params.id;
            _context6.next = 3;
            return regeneratorRuntime.awrap(Map.destroy({
              where: {
                id: id
              }
            }));

          case 3:
            req.session.notification = {
              message: 'Carte supprimée avec succès',
              level: 'success'
            };
            res.redirect('/map/add');

          case 5:
          case "end":
            return _context6.stop();
        }
      }
    });
  }
};
module.exports = {
  mapController: mapController
};