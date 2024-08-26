const Level = require('./Level');
const Map = require('./Map');
const Room = require('./Room');
const Cell = require('./Cell');

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

module.exports = { Map, Level, Room, Cell };


