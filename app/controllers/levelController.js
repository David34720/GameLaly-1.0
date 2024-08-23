const Level = require('../models/Level');

const levelController = {
    async index(req, res) {
        const levels = await Level.findAll();

        res.render('levels', { levels: levels });
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

module.exports = { levelController };
