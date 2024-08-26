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
        message_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Message',
                key: 'id',
            },
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
