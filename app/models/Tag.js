// * On importe les modules nécessaires à la création de models
const { Model, DataTypes, literal } = require('sequelize');
// * notre connexion à la BDD
const { sequelizeConnection } = require('../db/sequelize');

class Tag extends Model {}


Tag.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },

        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            // * On doit utiliser literal pour dire à la BDD que l'on souhaite un timestamp et non pas la string 'CURRENT_TIMESTAMP'
            defaultValue: literal('CURRENT_TIMESTAMP'),
        },

        updated_at: DataTypes.DATE,
    },
    {
        // * cette option est la pour connecter le modèle à la BDD
        sequelize: sequelizeConnection(),
        // * Cette option est facultative, si on ne la met pas, sequelize va analyser le nom de la classe et s'en servir pour se connecter à la BDD en le mettant en minusucules et au pluriel.
        tableName: 'tag',
    }
);

module.exports = Tag;
