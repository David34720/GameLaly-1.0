const { Model, DataTypes, literal } = require('sequelize');
const { sequelizeConnection } = require('../db/sequelize');

class Message extends Model {}

Message.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false,  // Le texte du message est obligatoire
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: literal('CURRENT_TIMESTAMP'),  // Date de création par défaut à l'instant présent
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,  // Date de mise à jour
        }
    },
    {
        sequelize: sequelizeConnection(),
        tableName: 'message',
    }
);

module.exports = Message;
