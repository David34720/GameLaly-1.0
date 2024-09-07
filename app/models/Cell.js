// Cell.js
const { Model, DataTypes, literal } = require('sequelize');
const { sequelizeConnection } = require('../db/sequelize');

class Cell extends Model {}

Cell.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        room_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Room',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        room_id_link: {
            type: DataTypes.INTEGER,
            allowNull: true, 
            references: {
                model: 'Room',
                key: 'id',
            },
            onDelete: 'SET NULL',  // Lien vers une autre Room
        },
        pos_x: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        pos_y: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        item_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Item',
                key: 'id',
            },
        },
        layer_type: {
            type: DataTypes.TEXT,
            defaultValue: 'element',
        },
        message_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Message',
                key: 'id',
            },
        },
        width: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1, // Nombre de cellules en largeur
        },
        height: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1, // Nombre de cellules en hauteur
        },
        offset_x: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0, // Décalage en X dans la cellule
        },
        offset_y: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0, // Décalage en Y dans la cellule
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: literal('CURRENT_TIMESTAMP'),
        },
        updated_at: DataTypes.DATE,
    },
    {
        sequelize: sequelizeConnection(),
        tableName: 'cell',
    }
);

module.exports = Cell;
