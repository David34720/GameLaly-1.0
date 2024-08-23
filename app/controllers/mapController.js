const Map = require('../models/Map');

const mapController = {
    async index(req, res) {
        const maps = await Map.findAll();

        res.render('maps', { maps: maps });
    },

    async create(req, res) {
        console.log(req.body)
        const map = await Map.create({ 
            name: req.body.name, 
            description: req.body.description, 
            users_id: 1, 
            level_id: 1}
        );

        res.redirect('/map/add');
    },
    async add(req, res) {
        console.log("route maps/add");
        const maps = await Map.findAll();
        res.render('maps', { maps: maps });
    },

    async edit(req, res) {
        const { id } = req.params;

        const level = await Level.findByPk(id);

        res.render('level', { level: level });
    },

    async update(req, res) {
        // ! On devrait valider name, on ne sert jamais d'une donnée qui vient d'un client sans la valider
        const { name } = req.body;
        const { id } = req.params;

        await Level.update({ name: name }, { where: { id: id } });

        res.redirect('/levels');
    },

    async store(req, res) {
        // ! On devrait valider name, on ne sert jamais d'une donnée qui vient d'un client sans la valider
        const { name } = req.body;

        await Level.create({ name: name });

        res.redirect('/levels');
    },

    async destroy(req, res) {
        const { id } = req.params;

        await Level.destroy({ where: { id: id } });

        res.redirect('/levels');
    },
};

module.exports = { mapController };
