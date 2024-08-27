const Level = require('./Level');
const Map = require('./Map');
const Room = require('./Room');
const Cell = require('./Cell');
const Item = require('./Item');

// Associations
Level.hasMany(Map, {
    foreignKey: 'level_id',
    as: 'maps',
});

Map.belongsTo(Level, {
    foreignKey: 'level_id',
    as: 'level',
});

Map.hasMany(Room, {
    foreignKey: 'map_id',
    as: 'rooms',
});

Room.belongsTo(Map, {
    foreignKey: 'map_id',
    as: 'map',
});

Room.hasMany(Cell, { 
    foreignKey: 'room_id',
    onDelete: 'CASCADE', 
    as: 'cells' // Association pour les cells
});

Cell.belongsTo(Room, { 
    foreignKey: 'room_id', 
    as: 'room',
    onDelete: 'SET NULL'
});

Cell.belongsTo(Room, { 
    foreignKey: 'room_id_link', 
    as: 'linkedRoom' 
});

//  Une Cellule a un Item
Cell.belongsTo(Item, {
    foreignKey: 'item_id',
    as: 'item',
    onDelete: 'SET NULL', // Si un item est supprimé, on met la valeur item_id à NULL dans la cellule
});

// Un Item peut être présent dans plusieurs Cells
Item.hasMany(Cell, {
    foreignKey: 'item_id',
    as: 'cells',
});

module.exports = { Map, Level, Room, Cell, Item };


