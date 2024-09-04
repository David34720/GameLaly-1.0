const Level = require('./Level');
const Message = require('./Message');
const Map = require('./Map');
const Room = require('./Room');
const Cell = require('./Cell');
const Item = require('./Item');
const ItemType = require('./ItemType');
const User = require('./User');
const Role = require('./Role');
const Permission = require('./Permission');
const PermissionHasRole = require('./PermissionHasRole');


// Un niveau (Level) a plusieurs cartes (Maps)
Level.hasMany(Map, {
    foreignKey: 'level_id',
    as: 'maps',
});

// Une carte (Map) appartient à un seul niveau (Level)
Map.belongsTo(Level, {
    foreignKey: 'level_id',
    as: 'level',
});

// Une carte (Map) a plusieurs pièces (Rooms)
Map.hasMany(Room, {
    foreignKey: 'map_id',
    as: 'rooms',
});

// Une pièce (Room) appartient à une seule carte (Map)
Room.belongsTo(Map, {
    foreignKey: 'map_id',
    as: 'map',
});

// Une pièce (Room) a plusieurs cellules (Cells)
Room.hasMany(Cell, { 
    foreignKey: 'room_id',
    onDelete: 'CASCADE', 
    as: 'cells' // Association pour les cellules
});

// Une cellule (Cell) appartient à une seule pièce (Room)
Cell.belongsTo(Room, { 
    foreignKey: 'room_id', 
    as: 'room',
    onDelete: 'SET NULL'
});

// Une cellule (Cell) peut avoir un lien avec une autre pièce (Room)
Cell.belongsTo(Room, { 
    foreignKey: 'room_id_link', 
    as: 'linkedRoom' 
});

// Une cellule (Cell) peut contenir un item (Item)
Cell.belongsTo(Item, {
    foreignKey: 'item_id',
    as: 'item',
    onDelete: 'SET NULL', // Si un item est supprimé, on met la valeur item_id à NULL dans la cellule
});

// Une cellule (Cell) peut avoir un message (Message)
Cell.belongsTo(Message, {
    foreignKey: 'message_id',
    as: 'message',
    onDelete: 'SET NULL', // Si le message est supprimé, on met la valeur message_id à NULL dans la cellule
});

// Un message (Message) peut appartenir à une cellule (Cell)
Message.hasOne(Cell, {
    foreignKey: 'message_id',
    as: 'cell',
});

// Un item (Item) peut être présent dans plusieurs cellules (Cells)
Item.hasMany(Cell, {
    foreignKey: 'item_id',
    as: 'cells',
});

// Un item (Item) appartient à un type d'item (ItemType)
Item.belongsTo(ItemType, {
    foreignKey: 'item_type', // correspond à la colonne dans la table `item`
    as: 'type'
});

// Un type d'item (ItemType) peut être associé à plusieurs items (Items)
ItemType.hasMany(Item, {
    foreignKey: 'item_type', // correspond à la colonne dans la table `item`
    as: 'items',
});

Permission.belongsToMany(Role, {
    through: PermissionHasRole,
    foreignKey: 'permission_id',
    otherKey: 'role_id',
    as: 'roles',
});

Role.belongsToMany(Permission, {
    through: PermissionHasRole,
    foreignKey: 'role_id',
    otherKey: 'permission_id',
    as: 'permissions',
});

Role.hasMany(User, {
    foreignKey: 'role_id',
    as: 'users',
});

User.belongsTo(Role, {
    foreignKey: 'role_id',
    as: 'role',
});

// Export des modèles avec leurs relations
module.exports = { Level, Map, Room, Cell, Item, ItemType, User, Message };
