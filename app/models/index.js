const Level = require('./Level');
const Map = require('./Map');
const Room = require('./Room');

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

module.exports = { Map, Level, Room };

