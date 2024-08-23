const Map = require('../models/Map');

const homeController = {
    async index(req, res) {
        try {
            // // * find by primary key
            // const level = await Level.findByPk(4);
            // // ! exercice : trouver un autre moyen de sélectionner le level avec l'id de 4
            // let levelfour = await Level.findOne({
            //     where: {
            //         id: 4,
            //     },
            // });

            // levelfour = await Level.findAll({ where: { id: 4 } });

            // console.log(levelfour);
            // // * Controle surprise : 2 minutes pour trouver comment mettre à jour le level avec l'ID 4
            // level.name = 'Mickey';
            // await level.save();
            // // * faire la mise à jour avec la méthode static update()
            // const levelId = 4;
            // await Level.update(
            //     { name: 'new data' },
            //     { where: { id: levelId } }
            // );

            //const levels = await Level.findAll();

            // * await Level.create({ name: 'quindim' });
            // * 2 minutes pour trouver un autre moyen de créer un objet level
            // const newlevel = Level.build({ name: 'Quindim the beasts' });
            // await newlevel.save();
            const maps = await Map.findAll();
            console.log(maps);
            res.render('index', { maps: maps });
        } catch (error) {
            console.log(error);
        }
    },
};

module.exports = { homeController };
